// JavaScript Document
/*@create by:  tsxiong
*@time: 2016年03月20日
*/
(function () {
var bPinOpen = false;
var clickEnter = false;
var Password = document.getElementById("PswInput");
Password.focus();
var Element;
var span_tip = document.getElementById("span_tip");
var SafePsw = "";
var bGetPswCompleted = false;
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        EventLogin();
		top.API.Dat.GetPersistentData("SAFEPASSWORD", "STRING");
        App.Plugin.Keyboard.show("2", "PageSubject", "KeyboardDiv");
        Element = Password;
    } (); //Page Entry

    //@User ocde scope start  
    document.getElementById('Back').onclick = function () {
        document.getElementById('Back').disabled = true;
        return CallResponse('Back');
    }


    Password.onclick = function () {
        Element = Password;
        App.InputEdit.getCurPosition(Element);
    }

    var oKeyboardKey = document.getElementsByName("Name_Keyboard");
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
        span_tip.innerText = "";
    }

    document.getElementById('KeyboardKey_set').onclick = function () {
        if (bGetPswCompleted) {
             if (Password.value == "") {
                span_tip.innerText = "输入信息不能为空！";
            } else {
                if (Password.value != SafePsw) {
                    top.API.displayMessage("信息管理员密码输入错误");
                    span_tip.innerText = "输入的信息管理员密码错误！";
                } else {
                    top.API.displayMessage("信息管理员密码输入正确");
                    CallResponse("OK");
                }
            }
        }
       
    }


    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        if ('SAFEPASSWORD' == DataName) {
			var arrDataValue = DataValue;
			top.API.displayMessage("onDatGetPersistentDataComplete is done,DataName=" + DataName + ",DataType=" + DataType + ",DataValue=" + arrDataValue);
			SafePsw = DataValue[0];
            bGetPswCompleted = true;
		}		
    }

    function onDatGetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatSetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
		var arrParam = new Array("000000");
        top.API.Dat.AddPersistentData("SAFEPASSWORD", "STRING", arrParam);
    }

    function onAddPersistentDataComplete(DataName) {
        top.API.displayMessage("onAddPersistentDataComplete is done,DataName=" + DataName);
        if ('SAFEPASSWORD' == DataName) {
			SafePsw = '000000';
            bGetPswCompleted = true;
		}	
    }

    function onAddPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onAddPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
    }

    function EventLogin() {
        top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);	
		top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
		top.API.Dat.addEvent("AddPersistentDataComplete", onAddPersistentDataComplete);
		top.API.Dat.addEvent("AddPersistentDataError", onAddPersistentDataError);
    }

    function EventLogout() {
        top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);	
		top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.removeEvent("AddPersistentDataComplete", onAddPersistentDataComplete);
		top.API.Dat.removeEvent("AddPersistentDataError", onAddPersistentDataError);
    }


    function Clearup() {
        EventLogout();
    }
})();