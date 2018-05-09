/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {
    var $CheckIdImg = $("#CheckIdCardpic"),
        $IdCardImg  = $("#IdCardpic"),
        $adminiSelect = $("#administrator"),
        $checkResult = $("#checkResult"),
        $errTip = $(".errTip");

    // var nReCompare = 0;
    var bIdentify = false;
    var AuthorType = "1";
    var CurSelctRadioId = "";
    var bTipFlag = false;

    var sFingerData = ""; 
    var strShowData = "员工号: 1234500001"; 
    var TellerNo = "";
    var CurFingerData = new Array();

    var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        //modify by tsx 获取是否跳过联网核查
        App.Plugin.Voices.play("voi_13");
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        var iniRet = top.API.Dat.GetPrivateProfileSync("TestConfig", "NetCheckIsContinue", "0", top.API.gIniFileName);  
        if(iniRet == 1){
            return CallResponse('OK');  
        }else{
            ButtonDisable();
            EventLogin();
            //@initialize scope start
            setData();
            top.API.Fpi.Identify(-1); // 读取指纹特征数据,(-1)无限时等待
            bIdentify = true;
            AuthorType = top.API.Dat.GetPrivateProfileSync("MFPI", "bLocalPower", "1", "C:\\TCR\\Middle\\ini\\Setup.ini");  
            top.API.Dat.GetPersistentData("TELLERNO", "STRING");  //获取柜员号

            ButtonEnable();
        }
        //
    }(); //Page Entry

    //@User ocde scope start
    function ButtonDisable() {
        top.API.displayMessage("ButtonDisable");
        document.getElementById('Exit').disabled = true;
        // document.getElementById('OK').disabled = true;
        document.getElementById('ReAuthor').disabled = true;
    }

    function ButtonEnable() {
        top.API.displayMessage("ButtonEnable");
        document.getElementById('Exit').disabled = false;
        // document.getElementById('OK').disabled = false;
        document.getElementById('ReAuthor').disabled = false;
    }

    document.getElementById('Exit').onclick = function () {
        top.API.displayMessage("点击<退出>");
        if (bIdentify) {
            top.API.Fpi.CancelIdentify();
        }
        top.ErrorInfo = top.API.PromptList.No2;
        top.API.iniTellerNo = $("select").find("option:selected").val();
        ButtonDisable();
        return CallResponse('Exit');
    }
    
    document.getElementById('ReAuthor').onclick = function () {
        top.API.iniTellerNo = $("select").find("option:selected").val();
        if (bIdentify) {
            top.API.Fpi.CancelIdentify();
        }
        return CallResponse('ReAuthor');
    }

    //提示取走身份证
    function showTakeIDCard() {
        document.getElementById('PageTitle').innerHTML = "请取走身份证";
        document.getElementById('Exit').style.display = "none";
        bTipFlag = true;
        App.Plugin.Voices.play("voi_35");
    }
    //@User code scope end 

    // 回写数据
    function setData(){
        $errTip.html("请按指纹进行审核");
        $CheckIdImg.prop("src", top.API.gCheckIdCardpic+"?"+Math.random());  // 随机数解决图片缓存问题
        $IdCardImg.prop("src", top.API.gIdCardpic+"?"+Math.random());
        $checkResult.text(top.API.gIdName+" "+top.API.gIdNumber+" 成功");
    }

    function xmlParser(xmlStr) {
        if (window.DOMParser) {
            return (new window.DOMParser()).parseFromString(xmlStr, "text/xml");
        } else if (window.ActiveXObject) {
            var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = false;
            xmlDoc.loadXML(xmlStr);
            return xmlDoc;
        } else {
            throw new Error("No XML parser found");
        }
    }

    function FingerCheck(sUserCode, sToken)
    { 
        var IsSinglebeta = top.API.Dat.GetPrivateProfileSync("AssConfig", "IsSinglebeta", "0", top.API.gIniFileName);
        if (IsSinglebeta == "2") {
            top.API.displayMessage("FingerCheck JUMP");
            return CallResponse('OK');
        }
        var xmlhttp = null;
        if (window.ActiveXObject) {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        else if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        }
        
        var URL = "http://10.235.143.59:8080/usap/authentication?ProcessCode=108&ClientUnique=DECQK_41&AuthenticationType=3&UserCode="+ sUserCode + "&Token=" + sToken + "&ProductCode=TECHSHINO";
        //var URL = "http://10.232.48.83:88/usap/authentication?ProcessCode=108&ClientUnique=NEWBOS&AuthenticationType=3&UserCode="+ sUserCode + "&Token=" + sToken + "&ProductCode=TECHSHINO";
        xmlhttp.open("GET", URL, true); //异步
        xmlhttp.setRequestHeader("Content-Type", "text/xml")
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    var xmlDoc = xmlParser(xmlhttp.responseText);
                    var sPrecessCode = xmlDoc.getElementsByTagName("KSSOResponse")[0].firstElementChild.firstChild.nodeValue;
                    var sBusinessStatus = xmlDoc.getElementsByTagName("KSSOResponse")[0].lastElementChild.textContent;
                    if ("SSO_7" != sBusinessStatus) {
                        bIdentify = false;
                        document.getElementById('ReAuthor').style.display = "block";
                        var tip = "授权验证失败！请点击“重新审核”按钮进行重新审核";
                        tip = strShowData + "授权验证失败(" + sBusinessStatus + ")！请点击“重新审核”按钮进行重新审核";
                        $errTip.html(tip);
                        return;
                    }
                    else {
                        top.API.displayMessage("FingerCheck OK");
                        return CallResponse('OK');
                    }
                }
            }
        }
        xmlhttp.send(null);
    }

    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) { // add by Gni
        var arrDataValue = DataValue;
        if ('TELLERNO' == DataName) {
            var tellersObj = eval('(' + arrDataValue.toString() + ')');
            var tellersInfo = tellersObj.TelInfo;

            top.API.displayMessage("柜员号tellersInfo="+tellersInfo);

            if (tellersInfo.length == 0) {//无柜员数据
                $errTip.html("无柜员数据");
            }else{
                var strType = "";

                for (var i = 0; i < tellersInfo.length; i++){
                    var $option = "<option value='"+tellersInfo[i].telno+"' fingervalue='"+tellersInfo[i].fingerinfo+"'>"+tellersInfo[i].telno+"</option>";

                    // $option.html(tellersInfo[i].telno);
                    // $option.val(tellersInfo[i].telno);
                    // $option.prop("fingervalue", tellersInfo[i].fingerinfo);

                    $adminiSelect.append($option);
                }
                top.API.displayMessage("默认的柜员号top.API.iniTellerNo="+top.API.iniTellerNo);

                var iniTellerNo = top.API.iniTellerNo != "" ? top.API.iniTellerNo : tellersInfo[0].telno;
                $adminiSelect.val(iniTellerNo);

            }

        }

    }

    function getTellerNo(){
        CurSelctRadioId = $("select").find("option:selected").val();
        CurFingerData[0] = $("select").find("option:selected").attr("fingervalue");
        strShowData = "员工号："+CurSelctRadioId;
        TellerNo = $("select").find("option:selected").attr("fingervalue");

        top.API.displayMessage("选中的柜员号CurSelctRadioId="+CurSelctRadioId);
    };

    function onDatGetPersistentDataError(DataName, ErrorCode) {
        if ('TELLERNO' == DataName) {//mod by hj
            $errTip.html("获取柜员号数据失败！");
        }
    }

    function onFpiIdentifyComplete(data) {
        bIdentify = false;
        var IsSinglebeta = top.API.Dat.GetPrivateProfileSync("AssConfig", "IsSinglebeta", "0", top.API.gIniFileName);
        if (IsSinglebeta == "2") {
            top.API.displayMessage("FingerCheck JUMP");
            return CallResponse('OK');
        }
        if (AuthorType == "1") {//本地授权 比对指纹
            
            return CallResponse('OK');      
        }
        if (AuthorType == "2") {
            getTellerNo();
            sFingerData = data;
            FingerCheck(TellerNo, sFingerData);
            return;
        }
        return CallResponse('OK'); 
    }

    function onFpiTimeout() {
        top.API.displayMessage("onFpiTimeout is done");
        return CallResponse('Exit');
    }

    function onFpiDeviceError() {
        top.API.displayMessage("onFpiDeviceError is done");
        if (!bIdentify) {
            top.API.Fpi.Identify(-1);
            bIdentify=true;
        }
    }

    function onFpiIdentifyFailed() {
        getTellerNo();
        top.API.displayMessage("onFpiIdentifyFailed is done");
        document.getElementById('ReAuthor').style.display = "block";
        bIdentify = false;
        var tip = strShowData + "审核失败！请点击“重新审核”按钮进行重新审核";
        $errTip.html(tip);
    }

    function onFpiMatchComplete() {
        return CallResponse('OK');
    }

    function onFpiMatchFailed() {
        document.getElementById('ReAuthor').style.display = "block";
        bIdentify = false;
        var tip ="授权失败！请点击“重新审核”按钮进行重新审核";
        $errTip.html(tip);
    }
    //event handler


    //Register the event
    function EventLogin() {
        top.API.Fpi.addEvent('IdentifyComplete', onFpiIdentifyComplete);
        top.API.Fpi.addEvent('Timeout', onFpiTimeout);
        top.API.Fpi.addEvent('DeviceError', onFpiDeviceError);
        top.API.Fpi.addEvent('IdentifyFailed', onFpiIdentifyFailed);
        top.API.Fpi.addEvent('MatchComplete', onFpiMatchComplete);
        top.API.Fpi.addEvent('MatchFailed', onFpiMatchFailed);

        top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
    }

    function EventLogout() {
        top.API.Fpi.removeEvent('IdentifyComplete', onFpiIdentifyComplete);
        top.API.Fpi.removeEvent('Timeout', onFpiTimeout);
        top.API.Fpi.removeEvent('DeviceError', onFpiDeviceError);
        top.API.Fpi.removeEvent('IdentifyFailed', onFpiIdentifyFailed);
        top.API.Fpi.removeEvent('MatchComplete', onFpiMatchComplete);
        top.API.Fpi.removeEvent('MatchFailed', onFpiMatchFailed);

        top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
    }

    //Countdown function
    function TimeoutCallBack() {
        if (bIdentify) {
            top.API.Fpi.CancelIdentify();
        }
        top.ErrorInfo = top.API.PromptList.No3;
        return CallResponse('TimeOut');
    }
    //Page Return
    
    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
        App.Timer.ClearTime();
    }
})();
