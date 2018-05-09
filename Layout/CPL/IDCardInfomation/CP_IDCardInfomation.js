;(function () {
    var Files = new dynamicLoadFiles();
    var rootpath = "";
    //var rootpath = "http://20.200.23.224:7002/idquery/";
    var CheckResult = "";
    var iamgeURI = "";
    var BranchCode = top.API.Dat.GetPrivateProfileSync("IdentityAudit", "BranchCode", "", top.API.Dat.GetBaseDir() + top.API.gIniFileName);
   // var BranchCode = 11005293;//机构代码
    var CallResponse = App.Cntl.ProcessOnce(function (Response) {
            //TO DO:
            Clearup();
            //Entry the flows control process.
            App.Cntl.ProcessDriven(Response);
        }),
        Initialize = function () {
            ButtonDisable();
            EventLogin();
            rootpath = top.API.Dat.GetPrivateProfileSync("IdentityAudit", "CheckIdURI", "", top.API.Dat.GetBaseDir() + top.API.gIniFileName);
            var gCheckIdCardpic = top.API.Dat.GetPrivateProfileSync("IdentityAudit", "gCheckIdCardpic", "", top.API.Dat.GetBaseDir() + top.API.gIniFileName);
            top.API.gCheckIdCardpic = gCheckIdCardpic.trim();
            document.getElementById("identityName").innerText = top.API.gIdName;
            document.getElementById("auidentityGender").innerText = top.API.gIdSex;
            document.getElementById("auidentityNation").innerText = top.API.gIdNation;
            //document.getElementById("birthday").innerText = top.API.gIdBirthday;
            document.getElementById("auidentityNumber").innerText = top.API.gIdNumber;
            document.getElementById("identityValidDate").innerHTML = top.API.gIdEndtime;
            document.getElementById("identityIssue").innerText = top.API.gIdDepartment;
            document.getElementById("identityAddress").innerText = top.API.gIdAddress;
            document.getElementById("IDcardPhotoFront").src = top.API.gIdFrontImage+ "?r=" + Math.random();
            document.getElementById("IDcardPhotoReverse").src = top.API.gIdBackImage+ "?r=" + Math.random();
            top.API.displayMessage("Start" + top.API.gIdFrontImage + top.API.gIdBackImage);
            ButtonEnable();
            App.Timer.TimeoutDisposal(TimeoutCallBack);
        }();//Page Entry

    //@User ocde scope start
    document.getElementById('Exit').onclick = function () {
        return CallResponse('Exit');
    };

    document.getElementById('OK').onclick = function () {
        //发起联网核查交易
Files.showNetworkMsg("正在进行联网核查,请稍候...");
        setTimeout(function(){CheckIdCard();},1000);
    };
    document.getElementById("PageRoot").onclick = function () {
        ButtonDisable();
        return CallResponse("BackHomepage");
    };


    function CheckIdCard() {
        top.API.displayMessage("CheckIdCard()");
        Files.showNetworkMsg("正在进行联网核查,请稍候...");
        // return CallResponse('OK');
        $.ajax({
            type: "post",
            url: rootpath + "LoginAction.do?op=login",
            data: {BranchCode: BranchCode, BizChType: 01},
            async: false,
		cache:false,
            success: function (Result) {
                //alert("Result:" + Result);
                //console.log(Result);
                //document.write(Result);
                $.ajax({
                    type: "post",
                    url: rootpath + "TuxSingleCheckAction.do?op=select",
                    //PlatType,BizChType 后台系统类型
                    data: {PlatType: 01, BranchCode: BranchCode, BizChType: 01, ID1: top.API.gIdNumber, Name1: top.API.gIdName},
                   async: false,
			cache:false,
                    success: function (Result) {
                        $("#checkIdCardDiv").html(Result);
                        CheckResult = $('input[name="CheckResult0"]').val();
                        top.API.displayMessage("CheckResult："+CheckResult);
                        if(CheckResult.trim() == "公民身份号码与姓名一致，且存在照片"){
                            iamgeURI = rootpath + $('input[name="Photo0"]').val();
                            top.API.displayMessage("iamgeURI："+iamgeURI);
                            //下载图片
                            // download(iamgeURI,"");
                            //同步方法
                            top.API.Jst.setData(iamgeURI,"/"+top.API.gCheckIdCardpic);
                            //异步方法
                            top.API.Jst.getFile();
                        }else{
                            Files.ErrorMsg(CheckResult.trim());
                        }
                    },
                    error: function (xhr, status, errMsg) {
			console.log(xhr.status);
console.log(xhr.readyState);
	console.log(status);
                        Files.ErrorMsg("联网核查失败");
                        setTimeout(function () {
                            return CallResponse("Exit");
                        }, 4000);
                    }
                });
            },
            error: function (xhr, status, errMsg) {
                Files.ErrorMsg("联网核查失败");
top.API.displayMessage("xhr："+xhr.responseText);
                setTimeout(function () {
                    return CallResponse("Exit");
                }, 4000);
            }
        });
    }

    function ButtonDisable() {
        top.API.displayMessage("ButtonDisable，禁用按钮");
        document.getElementById('Exit').disabled = true;
        document.getElementById('OK').disabled = true;
        document.getElementById('PageRoot').disabled = true;
    }

    function ButtonEnable() {
        top.API.displayMessage("ButtonEnable，启用按钮");
        document.getElementById('Exit').disabled = false;
        document.getElementById('OK').disabled = false;
        document.getElementById('PageRoot').disabled = false;
    }

    function onDownloadResult(retCode){
        if(retCode == 0){
            top.API.displayMessage("return CallResponse('OK')");
            return CallResponse("OK");
        }else{
            Files.ErrorMsg("联网核查失败");
            setTimeout(function () {
                return CallResponse("Exit");
            }, 4000);
        }
    }

    //Register the event
    function EventLogin() {
        //top.API.Crd.addEvent('CardInserted',onCardInserted);
        //top.API.Crd.addEvent('CardAccepted',onCardAccepted);
        top.API.Jst.addEvent('downloadResult',onDownloadResult);
    }

    function EventLogout() {
        //top.API.Crd.removeEvent('CardInserted',onCardInserted);
        //top.API.Crd.removeEvent('CardAccepted',onCardAccepted);
        top.API.Jst.removeEvent('downloadResult',onDownloadResult);
    }

    //Countdown function
    function TimeoutCallBack() {
        return CallResponse('TimeOut');
    }

    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
        App.Timer.ClearTime();
    }
})();
