// JavaScript Document
/*@create by:  tsxiong
*@time: 2016年03月20日
*/
;(function () {
var User = document.getElementById("UserInput");
var Password = document.getElementById("PswInput");
var ComfirmInput = document.getElementById("ComfirmInput");
User.focus();
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
        Element = User;
    } (); //Page Entry

    //@User ocde scope start  
    document.getElementById('Exit').onclick = function () {
        document.getElementById('Exit').disabled = true;
        return CallResponse('Exit');
    }
    //输入框点击事件
    User.onclick = function () {
        Element = User;
        App.InputEdit.getCurPosition(Element);
    }

    Password.onclick = function () {
        Element = Password;
        App.InputEdit.getCurPosition(Element);
    }

    ComfirmInput.onclick = function () {
        Element = ComfirmInput;
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
            if ((User.value == "") || (Password.value == "") || (ComfirmInput.value == "")) {
                span_tip.innerText = "输入信息不能为空！";
            } else {
                if (User.value != SafePsw) {
                        span_tip.innerText = "原始密码输入错误！";
                } else if (PswInput.value != ComfirmInput.value){
                        span_tip.innerText = "两次密码不一致！";
                }else{
                    var arrTotalFlag = new Array(PswInput.value);
                    nRet1 = top.API.Dat.SetPersistentData("SAFEPASSWORD", "STRING", arrTotalFlag);
                    top.API.displayMessage('交易流水号：SetPersistentData SAFEPASSWORD Return:' + nRet1);
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

    function onDatSetPersistentDataComplete(DataName) {
		top.API.displayMessage("onDatSetPersistentDataComplete is done,DataName=" + DataName);
        top.ErrorInfo = "修改信息管理员密码成功！";
		return CallResponse("OK");
	}

	function onDatSetPersistentDataError(DataName, ErrorCode) {
		top.API.displayMessage("onDatSetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
	}
    function EventLogin() {
        top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);	
		top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
		top.API.Dat.addEvent("AddPersistentDataComplete", onAddPersistentDataComplete);
		top.API.Dat.addEvent("AddPersistentDataError", onAddPersistentDataError);
        top.API.Dat.addEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
		top.API.Dat.addEvent("SetPersistentDataError", onDatSetPersistentDataError);
    }

    function EventLogout() {
        top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);	
		top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.removeEvent("AddPersistentDataComplete", onAddPersistentDataComplete);
		top.API.Dat.removeEvent("AddPersistentDataError", onAddPersistentDataError);
        top.API.Dat.removeEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
		top.API.Dat.removeEvent("SetPersistentDataError", onDatSetPersistentDataError);
    }


    //remove all event handler
    function Clearup() {
        EventLogout();
    }
})();