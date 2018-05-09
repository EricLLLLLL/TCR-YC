;
(function () {
    var sSignOrNot;
    var sSignOrNotUser;
    var sUserType;
    var AdminObj;
    var AdminInfo;
    var sSignNum;
    var CallResponse = App.Cntl.ProcessOnce(function (Response) {
            //TO DO:
            Clearup();
            //Entry the flows control process.
            App.Cntl.ProcessDriven(Response);
        }),
        Initialize = function () {
            EventLogin();
            top.API.Dat.GetPersistentData("ADMININFO", "STRING"); //获取柜员号 00 01 02 8800
            top.API.SignType = "";
            top.ErrorInfo = "";
            document.getElementById('span_tip').innerText = "";
            // AdminSignNum:已经签到了的管理员序号，AdminSignType：是否已经签到成功 1 已经签到 0 没有签到
            sSignNum = top.API.Dat.GetPrivateProfileSync("AdminSign", "AdminSignNum", "", top.API.Dat.GetBaseDir() + top.API.gIniFileName);
            var nSignType = top.API.Dat.GetPrivateProfileSync("AdminSign", "AdminSignFlag", "0", top.API.Dat.GetBaseDir() + top.API.gIniFileName);

            if (nSignType == "0") { // 没有签到
                sSignOrNotUser = "未签到"
                document.getElementById('SignOut').disabled = true;
                document.getElementById('SignOutC').disabled = true;
                document.getElementById("SignOutC").style.backgroundColor = "#ccc";
                document.getElementById("SignOut").style.backgroundColor = "#ccc";
                if (top.API.AdminStatus == 1) {
                    document.getElementById('SignIn').disabled = true;
                    document.getElementById("SignIn").style.backgroundColor = "#ccc";
                }

            }
            if (nSignType == "1") { //已经签到 可以签退或强制签退
                sSignOrNotUser = "已签到"
                document.getElementById('SignIn').disabled = true;
                document.getElementById("SignIn").style.backgroundColor = "#ccc";
                if (top.API.AdminStatus != 1) { //业务管理员 不能强制签退
                    document.getElementById('SignOutC').disabled = true;
                    document.getElementById("SignOutC").style.backgroundColor = "#ccc";
                }
                if (sSignNum != top.API.User) { //  不是本人 不能签退
                    document.getElementById('SignOut').disabled = true;
                    document.getElementById("SignOut").style.backgroundColor = "#ccc";
                }
            }
            top.API.displayMessage("Start Check In or Out Select");
        }(); //Page Entry
    // 显示管理员信息  不包括是否签到
    function showAdminInfo() {
        var tab = document.getElementById('tab');
        for (i = 0; i < tab.rows.length; i++) {
            tab.rows[i].style.display = "none";
        }
        if (AdminInfo.length == 0) { //无管理员信息
            document.getElementById("right_div2").rows[1].style.display = "none";
            document.getElementById("errortip").style.display = "block";
        } else {
            document.getElementById("errortip").style.display = "none";
            // var strShowType = "";
            for (var i = 1; i < AdminInfo.length; i++) {
               /*  if (AdminInfo[i].user == sSignNum) {
                    sSignOrNot = sSignOrNotUser;
                } else {
                    sSignOrNot = "未签到";
                } */
                console.log("AdminInfo[i].user--"+AdminInfo[i].user);
                console.log("AdminInfo[i].usertype--"+AdminInfo[i].usertype);

                sUserType =   AdminInfo[i].usertype == "1" ? "主管": "管理员";
                sSignOrNot = AdminInfo[i].user == sSignNum ? sSignOrNotUser : "未签到";
               


                /*  if (AdminInfo[i].usertype == "1") {
                    sUserType = "主管"
                } else {
                    sUserType = "管理员"
                } */

                $("#tab").append("<tr><td>" + i + "</td><td>" + AdminInfo[i].user + "</td><td>" + sUserType + "</td><td>" + AdminInfo[i].idcardno + "</td><td>" + AdminInfo[i].agencyno + "</td><td>" + sSignOrNot + "</td></tr>");
               

            }
        }
    }



    function ButtonDisable() {
        document.getElementById('SignIn').disabled = true;
        document.getElementById('SignOut').disabled = true;
        document.getElementById('SignOutC').disabled = true;
        document.getElementById('Back').disabled = true;
        document.getElementById('PageRoot').disabled = true;
    }

    //@User ocde scope start
    document.getElementById('SignIn').onclick = function () {
        top.API.SignType = "SignIn";
        ButtonDisable();
        top.API.displayMessage("SignIn onclick, Start Identify");
        document.getElementById('span_tip').innerText = "请录入指纹！";
        top.API.Fpi.Identify(-1);
       // Skip();
    }

         /*  调试 跳过指纹录入
            function Skip() {
            if (top.API.SignType == "SignIn") {
                top.API.Dat.WritePrivateProfileSync("AdminSign", "AdminSignNum", top.API.User, top.API.Dat.GetBaseDir() + top.API.gIniFileName);
                top.API.Dat.WritePrivateProfileSync("AdminSign", "AdminSignFlag", "1", top.API.Dat.GetBaseDir() + top.API.gIniFileName);
            } else {
                top.API.Dat.WritePrivateProfileSync("AdminSign", "AdminSignNum", "", top.API.Dat.GetBaseDir() + top.API.gIniFileName);
                top.API.Dat.WritePrivateProfileSync("AdminSign", "AdminSignFlag", "0", top.API.Dat.GetBaseDir() + top.API.gIniFileName);
            }
            document.getElementById('span_tip').innerText = "";
            return CallResponse('OK');
            } 
        */

    document.getElementById('SignOut').onclick = function () {
        top.API.SignType = "SignOut";
        ButtonDisable();
        top.API.displayMessage("SignOut onclick, Start Identify");
        document.getElementById('span_tip').innerText = "请录入指纹！";
        top.API.Fpi.Identify(-1);
        //Skip();
    }

    document.getElementById('SignOutC').onclick = function () {
        top.API.SignType = "SignOutC";
        ButtonDisable();
        top.API.displayMessage("SignOutC onclick, Start Identify");
        document.getElementById('span_tip').innerText = "请录入指纹！";
        top.API.Fpi.Identify(-1);
        //Skip();
    }

    document.getElementById('Back').onclick = function () {
        ButtonDisable();
        document.getElementById('span_tip').innerText = "";
        return CallResponse('Back');
    }

    document.getElementById('PageRoot').onclick = function () {
        ButtonDisable();
        document.getElementById('span_tip').innerText = "";
        return CallResponse('Exit');
    }
    /********************************************************************************************************/
    //DAt模块
    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        if ('ADMININFO' == DataName) {
            var arrDataValue = DataValue;
            top.API.displayMessage("onDatGetPersistentDataComplete is done,DataName=" + DataName + ",DataType=" + DataType + ",DataValue=" + arrDataValue);
            top.API.AdminInfoObjStr = arrDataValue.toString();
            top.API.displayMessage("top.API.AdminInfoObjStr =" + top.API.AdminInfoObjStr);
            AdminObj = eval('(' + top.API.AdminInfoObjStr + ')');
            AdminInfo = AdminObj.AdminInfo;
            showAdminInfo();
            //  var deletebtns = document.getElementsByName("delBtn");          
            //   del_click(deletebtns);

        }
    }

    function onDatGetPersistentDataError(DataName, ErrorCode) {

        top.API.displayMessage("onDatSetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);


    }
    /********************************************************************************************************/
    //FPI模块
    function onFpiIdentifyComplete(data) {
        top.API.displayMessage("onFpiIdentifyComplete is done,Start DataMatch, userNum = " + top.API.User);
        if (top.API.SignType == "SignOutC") {
            top.API.Fpi.DataMatch(-1, top.API.User);
        } else {
            top.API.Fpi.DataMatch(-1, top.API.User);
        }
    }

    function onFpiTimeout() {
        top.API.displayMessage("onFpiTimeout is done");
        top.ErrorInfo = "获取指纹超时，请重试";
        document.getElementById('span_tip').innerText = "";
        return CallResponse('OK');
    }

    function onFpiDeviceError() {
        top.API.displayMessage("onFpiDeviceError is done");
        top.ErrorInfo = "设备故障，请确认";
        document.getElementById('span_tip').innerText = "";
        return CallResponse('OK');
    }

    function onFpiIdentifyFailed() {
        top.API.displayMessage("onFpiIdentifyFailed is done");
        top.ErrorInfo = "指纹获取失败，请重试";
        document.getElementById('span_tip').innerText = "";
        return CallResponse('OK');
    }

    function onFpiMatchComplete() {
        top.API.displayMessage("onFpiMatchComplete is done, 设置AdminSignFlag为1");
        if (top.API.SignType == "SignIn") {
            top.API.Dat.WritePrivateProfileSync("AdminSign", "AdminSignNum", top.API.User, top.API.Dat.GetBaseDir() + top.API.gIniFileName);
            top.API.Dat.WritePrivateProfileSync("AdminSign", "AdminSignFlag", "1", top.API.Dat.GetBaseDir() + top.API.gIniFileName);
        } else {
            top.API.Dat.WritePrivateProfileSync("AdminSign", "AdminSignNum", "", top.API.Dat.GetBaseDir() + top.API.gIniFileName);
            top.API.Dat.WritePrivateProfileSync("AdminSign", "AdminSignFlag", "0", top.API.Dat.GetBaseDir() + top.API.gIniFileName);
        }
        document.getElementById('span_tip').innerText = "";
        return CallResponse('OK');
    }

    function onFpiMatchFailed() {
        top.API.displayMessage("onFpiMatchFailed is done");
        top.ErrorInfo = "指纹匹配失败，请重新采集指纹";
        document.getElementById('span_tip').innerText = "";
        return CallResponse('OK');
    }

    /********************************************************************************************************/
    //Event
    function EventLogin() {
        top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Fpi.addEvent('IdentifyComplete', onFpiIdentifyComplete);
        top.API.Fpi.addEvent('Timeout', onFpiTimeout);
        top.API.Fpi.addEvent('DeviceError', onFpiDeviceError);
        top.API.Fpi.addEvent('IdentifyFailed', onFpiIdentifyFailed);
        top.API.Fpi.addEvent('MatchComplete', onFpiMatchComplete);
        top.API.Fpi.addEvent('MatchFailed', onFpiMatchFailed);
    }

    function EventLogout() {
        top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Fpi.removeEvent('IdentifyComplete', onFpiIdentifyComplete);
        top.API.Fpi.removeEvent('Timeout', onFpiTimeout);
        top.API.Fpi.removeEvent('DeviceError', onFpiDeviceError);
        top.API.Fpi.removeEvent('IdentifyFailed', onFpiIdentifyFailed);
        top.API.Fpi.removeEvent('MatchComplete', onFpiMatchComplete);
        top.API.Fpi.removeEvent('MatchFailed', onFpiMatchFailed);
    }
    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
    }
})();