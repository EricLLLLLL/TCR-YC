/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        ButtonDisable();
        EventLogin();
        //@initialize scope start  
        App.Plugin.Keyboard.show("3", "KeysDiv", "Keyboards");
        funKeyInput();
        top.API.Dat.GetPersistentData(top.API.telleridTag, top.API.telleridType);
        ButtonEnable();
    }();//Page Entry
    function ButtonDisable() {
        document.getElementById('Back').disabled = true;
        document.getElementById('OK').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Back').disabled = false;
        document.getElementById('OK').disabled = false;
    }

    //键盘相关
    var strTellerNo = "";
    var strDeviceNo = "";
    var strBranchNo = "";
    var TellerNo = document.getElementById("TellerNoInput");
    var DeviceNo = document.getElementById("DeviceNoInput");
    var BranchNo = document.getElementById("BranchNoInput");
    var InputFlag = 0;
    TellerNo.focus();

    var oKeyboardKeyInput = document.getElementsByTagName("input");
    for (var j = 0; j < oKeyboardKeyInput.length; j++) {
        var inpt = oKeyboardKeyInput[j];
        inpt.onclick = function (e) {
            inputId = document.activeElement.id;
            if (inputId == "TellerNoInput") {
                InputFlag = 0;
            } else if (inputId == "DeviceNoInput") {
                InputFlag = 1;
            } else if (inputId == "BranchNoInput") {
                InputFlag = 2;
            }
        }
    }


    function funKeyInput() {
        var oKeyboardKey = document.getElementsByName("Name_Keyboard");
        for (var i = 0; i < oKeyboardKey.length; i++) {
            var keyEvent = oKeyboardKey[i];
            keyEvent.onclick = function (e) {
                if (this.innerText == "清除") {
                    onClearNum();
                } else if (this.innerText == "小写") {
                    document.getElementById("KeysDiv").removeChild(document.getElementById("Keyboards"));
                    App.Plugin.Keyboard.show("6", "KeysDiv", "Keyboards");
                    keyflag = 1;
                    funKeyInput();
                } else if (this.innerText == "大写") {
                    document.getElementById("KeysDiv").removeChild(document.getElementById("Keyboards"));
                    App.Plugin.Keyboard.show("3", "KeysDiv", "Keyboards");
                    keyflag = 1;
                    funKeyInput();
                } else {
                    if (InputFlag == 0) {
                        if (strTellerNo.length < 10) {
                            strTellerNo += this.innerText;
                            TellerNo.value = strTellerNo;

                        }
                        TellerNo.focus();
                    } else if (InputFlag == 1) {
                        if (strDeviceNo.length < 10) {
                            strDeviceNo += this.innerText;
                            DeviceNo.value = strDeviceNo;
                        }
                        DeviceNo.focus();
                    } else if (InputFlag == 2) {
                        if (strBranchNo.length < 10) {
                            strBranchNo += this.innerText;
                            BranchNo.value = strBranchNo;

                        }
                        BranchNo.focus();
                    }
                }
            }
        }
    }


    function onClearNum() {
        if (InputFlag == 0) {
            TellerNo.value = '';
            strTellerNo = '';
            TellerNo.focus();
        } else if (InputFlag == 1) {
            DeviceNo.value = '';
            strDeviceNo = '';
            DeviceNo.focus();
        } else if (InputFlag == 2) {
            BranchNo.value = '';
            strBranchNo = '';
            BranchNo.focus();
        }
    }


    //@User ocde scope start
    document.getElementById('OK').onclick = function () {
        if (strTellerNo == "") {
            document.getElementById("tipdiv").innerText = "输入的柜员号不能为空！";
        } else if (strDeviceNo == "") {
            document.getElementById("tipdiv").innerText = "输入的设备编号不能为空！";
        } else if (strBranchNo == "") {
            document.getElementById("tipdiv").innerText = "输入的受理行号不能为空！";
        } else {
            var inputvalue1 = new Array(strTellerNo);
            top.API.displayMessage('柜员号：SetPersistentData TELLERID =' + inputvalue1);
            var nRet1 = top.API.Dat.SetPersistentData(top.API.telleridTag, top.API.telleridType, inputvalue1);
            top.API.displayMessage('柜员号：SetPersistentData TELLERID Return:' + nRet1);
        }
    }

    document.getElementById('Back').onclick = function () {
        ButtonDisable();
        return CallResponse('Back');
    }

    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        var arrGet = DataValue;
        var showinfo = arrGet[0];
        top.API.displayMessage("onDatGetPersistentDataComplete is done,DataName=" + DataName + ",DataType=" + DataType + ",DataValue=" + showinfo);
        if ('TELLERID' == DataName) {
            TellerNo.value = showinfo;
            strTellerNo = TellerNo.value;
            var nRet2 = top.API.Dat.GetPersistentData(top.API.terminalnumTag, top.API.terminalnumType);
            top.API.displayMessage("终端号：GetPersistentData TERMINALNUM Return:" + nRet2);
        }
        if ('TERMINALNUM' == DataName) {
            DeviceNo.value = showinfo;
            strDeviceNo = DeviceNo.value;
            var nRet3 = top.API.Dat.GetPersistentData(top.API.subbanknumTag, top.API.subbanknumType);
            top.API.displayMessage("受理行号：GetPersistentData SUBBANKNUM Return:" + nRet3);
        }
        if ('SUBBANKNUM' == DataName) {
            BranchNo.value = showinfo;
            strBranchNo = BranchNo.value;
        }
    }

    function onDatGetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatGetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        alert("读取失败");
        if ('TELLERID' == DataName) {
            var nRet2 = top.API.Dat.GetPersistentData(top.API.terminalnumTag, top.API.terminalnumType);
            top.API.displayMessage("终端号：GetPersistentData TERMINALNUM Return:" + nRet2);
        }
        if ('TERMINALNUM' == DataName) {
            var nRet3 = top.API.Dat.GetPersistentData(top.API.subbanknumTag, top.API.subbanknumType);
            top.API.displayMessage("受理行号：GetPersistentData SUBBANKNUM Return:" + nRet3);
        }
    }

    function onDatSetPersistentDataComplete(DataName) {
        top.API.displayMessage("onDatSetPersistentDataComplete is done,DataName=" + DataName);
        if ('TELLERID' == DataName) {
            var inputvalue2 = new Array(strDeviceNo);
            top.API.displayMessage('终端号：SetPersistentData TERMINALNUM =' + inputvalue2);
            var nRet2 = top.API.Dat.SetPersistentData(top.API.terminalnumTag, top.API.terminalnumType, inputvalue2);
            top.API.displayMessage('终端号：SetPersistentData TERMINALNUM Return:' + nRet2);
        }
        if ('TERMINALNUM' == DataName) {
            var inputvalue3 = new Array(strBranchNo);
            top.API.displayMessage('受理行号：SetPersistentData SUBBANKNUM =' + inputvalue3);
            var nRet3 = top.API.Dat.SetPersistentData(top.API.subbanknumTag, top.API.subbanknumType, inputvalue3);
            top.API.displayMessage('受理行号：SetPersistentData SUBBANKNUM Return:' + nRet3);
        }
        if ('SUBBANKNUM' == DataName) {
            top.API.gSubBankNum = strBranchNo + "-" + strDeviceNo + "号机";
            return CallResponse('OK');
        }
    }

    function onDatSetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatSetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        alert("设定失败,请重新设定！");
    }

    //@User code scope end 

    //Register the event
    function EventLogin() {
        top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.addEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.addEvent("SetPersistentDataError", onDatSetPersistentDataError);
    }

    function EventLogout() {
        top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.removeEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.removeEvent("SetPersistentDataError", onDatSetPersistentDataError);
    }

    function Clearup() {
        EventLogout();
    }
})();
