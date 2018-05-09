;
(function () {
    var bError = false;
    var Password = document.getElementById("PswInput");
    Password.focus();
    var PasswordConfirm = document.getElementById("confirmInput");
    // var user_tip = document.getElementById("user_tip");
    var finger_tip = document.getElementById("finger_tip");
    var passwordfirst_tip = document.getElementById("password_tip");
    var passwordsecond_tip = document.getElementById("confirm_tip");
    var Element;
    var iInputTimes = 0;
    var bKeybordSet = false;
    var AdminInfo;
    var FpiIDList;
    var bDataAcquired = false;
    var CallResponse = App.Cntl.ProcessOnce(function (Response) {
            //TO DO:
            Clearup();
            //Entry the flows control process.
            App.Cntl.ProcessDriven(Response);
        }),
        Initialize = function () {
            //@initialize scope start
            ButtonDisable();
            EventLogin();
            App.Plugin.Keyboard.show("2", "PageSubject", "KeyboardDiv");
            Element = Password;
            top.API.Dat.GetPersistentData("ADMININFO", "STRING");

            //document.getElementById("PromptIcon3").style.backgroundImage = "url('Framework/style/Graphics/box_ico_4.png')";

            ButtonEnable();

            //
            //App.Timer.TimeoutDisposal(TimeoutCallBack);
        }(); //Page Entry

    Password.onclick = function () {
        Element = Password;
        App.InputEdit.getCurPosition(Element);
    }


    PasswordConfirm.onclick = function () {
        Element = PasswordConfirm;
        App.InputEdit.getCurPosition(Element);
    }

    var oKeyboardKey = document.getElementsByClassName("KeyboardKey");
    for (var i = 0; i < oKeyboardKey.length; i++) {
        var keyEvent = oKeyboardKey[i];
        keyEvent.onclick = function (e) {
            ClearTip();
            if ('退格' == this.innerText) {
                App.InputEdit.getInput(Element, 1, "BS");
            } else if ('清除' == this.innerText) {
                App.InputEdit.getInput(Element, 1, "CLEAR");
            } else {
                if (Element.value.length < 6) {
                    App.InputEdit.getInput(Element, 0, this.innerText);
                }
            }
        }
    }

    function ClearTip() {
        //user_tip.innerText = "";
        //finger_tip.innerText = "";
        passwordfirst_tip.innerText = "";
        passwordsecond_tip.innerText = "";
    }

    document.getElementById('KeyboardKey_set').onclick = function () {
        if (!bDataAcquired) {
            finger_tip.innerText = "*请完成您的指纹录入！";
        } else if(Password.value.length < 6){
            passwordfirst_tip.innerText = "*密码不能少于6位";
        } else if(PasswordConfirm.value.length < 6){
            passwordsecond_tip.innerText = "*密码不能少于6位";
        } else if ((Password.value == "")) {
            passwordfirst_tip.innerText = "*密码不能为空";
        } else if (PasswordConfirm.value == "") {
            passwordsecond_tip.innerText = "*密码不能为空";
        } else if (Password.value != PasswordConfirm.value) {
            passwordsecond_tip.innerText = "*输入的密码不一致";
        }
        else {
            if (!bKeybordSet) {
                top.API.AddPassword = Password.value;
                var newJson = {
                    "user": top.API.AddUser,
                    "pw": top.API.AddPassword,
                    "usertype": top.API.AddUserType,
                    "idcardno":top.API.AddIDCardNum,
                    "agencyno":top.API.AddAgencyNum
                };

                AdminInfo.push(newJson);
                var arrTotalFlag = new Array(JSON.stringify(AdminObj));
                top.API.Dat.SetPersistentData("ADMININFO", "STRING", arrTotalFlag);
                bKeybordSet = true;
            }
        }
    }

    function ButtonDisable() {
        document.getElementById('Back').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Back').disabled = false;
    }

    document.getElementById("PageRoot").onclick = function () {
       // ButtonDisable();
        return CallResponse("Exit");
    }
    //@User ocde scope start
    document.getElementById('Back').onclick = function () {

        ButtonDisable();
        if (!bError) {
            top.API.Fpi.CancelAcquireData();
        }
        return CallResponse('Back');
    }

    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        if ('ADMININFO' == DataName) {
            var arrDataValue = DataValue;
            top.API.AdminInfoObjStr = arrDataValue.toString();
            AdminObj = eval('(' + top.API.AdminInfoObjStr + ')');
            AdminInfo = AdminObj.AdminInfo;

            top.API.Dat.GetPersistentData(top.API.MFPIIDLISTTag, top.API.MFPIIDLISTType);
        } else {
            for (var i = 0; i < DataValue.length; i++) {
                if (top.API.AddUser == DataValue[i]) {
                   top.API.displayMessage("添加管理员时，在数据库指纹列表中已存在该管理员。");
			finger_tip.innerText = "指纹列表中已存在该管理员！";
                    //return CallResponse("TradeFail");
                }
            }
            if (DataValue == "") {
                FpiIDList = new Array();
            } else {
                FpiIDList = DataValue;
            }
            var arrAddUser = new Array(top.API.AddUser);
            var ret = top.API.Dat.SetDataSync(top.API.MFPIDATAKEYTag, top.API.MFPIDATAKEYType, arrAddUser);
            iInputTimes = 0;
            top.API.Fpi.AcquireData(-1);
        }
    }

    function onDatGetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatGetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        //return CallResponse('Exit');
    }

    function onDatSetPersistentDataComplete(DataName) {
        top.API.displayMessage("onDatSetPersistentDataComplete is done,DataName=" + DataName);
        if (DataName == "ADMININFO") {
            FpiIDList.push(top.API.AddUser);
            top.API.Dat.SetPersistentData(top.API.MFPIIDLISTTag, top.API.MFPIIDLISTType, FpiIDList);
        } else {
            return CallResponse('TradeSuccess');
        }
    }

    function onDatSetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatSetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
    }


    function onDataAcquired(data) {
        top.API.displayMessage("onDataAcquired is done");
        finger_tip.style.color = "#2d997e";
        finger_tip.innerText = "指纹录入成功 ! !";
        bDataAcquired = true;
        /*
        iInputTimes = iInputTimes+ 1; 
        var IDName = "PromptIcon" + iInputTimes;
        document.getElementById(IDName).src = "Framework/style/Graphics/box_ico_3.png";
        finger_tip.innerText = "";
        */
        /*
        var fingerData=data;
        if ((fingerData[0] != null) && (fingerData[0] != "") && (fingerData[0] != undefined)) 
        {
            document.getElementById("PromptIcon3").style.backgroundImage = "url('Framework/style/Graphics/box_ico_3.png')";
        }
        */
    }

    function onFpiTimeout() {
        top.API.displayMessage("onFpiTimeout is done");
        document.getElementById("FingerTipDiv").innerText = "指纹录入超时 ! !";
        bError = true;
    }

    function onFpiDeviceError() {
        top.API.displayMessage("onFpiDeviceError is done");
        document.getElementById("FingerTipDiv").innerText = "指纹录入失败 ! !";
        bError = true;
    }

    function onFingerMoved() {
        top.API.displayMessage("onFingerMoved is done");
        iInputTimes = iInputTimes + 1;
        var IDName = "PromptIcon" + iInputTimes;
        document.getElementById(IDName).src = "Framework/style/Graphics/box_ico_3.png";
        finger_tip.innerText = "";
    }

    function onDataAcquireFailed() {
        top.API.displayMessage("DataAcquireFailed is done");
        document.getElementById("FingerTipDiv").innerText = "指纹录入失败 ! !";
        bError = true;
    }

    function onAcquireDataCancelled() {
        top.API.displayMessage("AcquireDataCancelled is done");
        document.getElementById("FingerTipDiv").innerText = "指纹录入失败 ! !";
        bError = true;
    }

    //Register the event
    function EventLogin() {
        top.API.Fpi.addEvent('DataAcquired', onDataAcquired);
        top.API.Fpi.addEvent('Timeout', onFpiTimeout);
        top.API.Fpi.addEvent('DeviceError', onFpiDeviceError);
        top.API.Fpi.addEvent('FingerMoved', onFingerMoved);
        top.API.Fpi.addEvent('DataAcquireFailed', onDataAcquireFailed);
        top.API.Fpi.addEvent('AcquireDataCancelled', onAcquireDataCancelled);

        top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.addEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.addEvent("SetPersistentDataError", onDatSetPersistentDataError);
    }

    function EventLogout() {
        top.API.Fpi.removeEvent('DataAcquired', onDataAcquired);
        top.API.Fpi.removeEvent('Timeout', onFpiTimeout);
        top.API.Fpi.removeEvent('DeviceError', onFpiDeviceError);
        top.API.Fpi.removeEvent('FingerMoved', onFingerMoved);
        top.API.Fpi.removeEvent('DataAcquireFailed', onDataAcquireFailed);
        top.API.Fpi.removeEvent('AcquireDataCancelled', onAcquireDataCancelled);

        top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.removeEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.removeEvent("SetPersistentDataError", onDatSetPersistentDataError);
    }


    //Countdown function
    function TimeoutCallBack() {

        return CallResponse('TimeOut');
    }
    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
        top.API.Fpi.CancelAcquireData();
        App.Timer.ClearTime();
    }
})();