
(function () {
	var bPinOpen = false;
	var clickEnter = false;
	var Password = document.getElementById("PswInput");
	Password.focus();
	var Element;
	var span_tip = document.getElementById("span_tip");
	var SafePsw = "";
	var bGetPswCompleted = false;
	var Files = new dynamicLoadFiles();
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        EventLogin();
		App.Plugin.Keyboard.show("2", "PageSubject", "KeyboardDiv");
        Element = Password;
    } (); //Page Entry

    //@User ocde scope start  
    document.getElementById('Back').onclick = function () {
        return CallResponse('Back');
    }

    document.getElementById('OK').onclick = function () {
        top.API.displayMessage("on onclick");
		if (Password.value == "") {
			Files.ErrorMsg("输入信息不能为空！");
		}else if (Password.value.length != 6){
			Files.ErrorMsg("请输入6位数密码！");
		}else {
			document.getElementById('OK').disabled = true;
			top.API.displayMessage("开始校验密码");
			var tmphexArray2 = top.stringToHex(Password.value);
			top.API.Pin.VerifyPIN(tmphexArray2); // 通过接口确认密码
		}
        
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
		top.API.displayMessage("KeyboardKey_set");
		if (Password.value == "") {
			Files.ErrorMsg("输入信息不能为空！");
		}else if (Password.value.length != 6){
			Files.ErrorMsg("请输入6位数密码！");
			Password.value = "";
		}else {
			document.getElementById('OK').disabled = true;
			top.API.displayMessage("开始校验密码");
			var tmphexArray2 = top.stringToHex(Password.value);
			top.API.Pin.VerifyPIN(tmphexArray2); // 通过接口确认密码
		}
    }
	
	//--start
	/********************************************************************************************************/
    //永久数据模块
    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        var arrDataValue = DataValue;
        var nRet1 = -1;
        top.API.displayMessage("onDatGetPersistentDataComplete is done,DataName=" + DataName + ",DataType=" + DataType + ",DataValue=" + arrDataValue[0]);
        if ('JNLNUM' == DataName) {
            JnlNum = arrDataValue[0] + 1;
            if (JnlNum.toString().length === 9) {
                JnlNum = 0;
            }
            //设置交易流水号
            var arrJnlNum = new Array();
            arrJnlNum[0] = JnlNum;
            top.API.Dat.SetPersistentData(top.API.jnlnumTag, top.API.jnlnumType, arrJnlNum);
        }
    }

    function onDatGetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatGetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        top.API.displayMessage("获取数据失败");
        return CallResponse("Exit");
    }

    function onDatSetPersistentDataComplete(DataName) {
        top.API.displayMessage("onDatSetPersistentDataComplete is done,DataName=" + DataName);
        if ('JNLNUM' == DataName) {
            //待修正 添加流水
            var arrTransType = new Array("APPLYINITKEY")
            top.API.displayMessage("start APPLYINITKEY");
            top.API.Tcp.CompositionData(arrTransType); //进行处理工作参数报文
        }
    }

    function onDatSetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatSetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        return CallResponse("Exit");
    }

    /********************************************************************************************************/
    //TCP模块
    function onCompositionDataCompleted() {
        top.API.displayMessage("onCompositionDataCompleted is done");
		Files.showNetworkMsg("交易处理中,请稍候...");
        var objArrData = new Array();
        top.API.Tcp.SendToHost(objArrData, 60000);
    }

    function onTcpOnRecved(tmpCheck) {
        Check = tmpCheck;
        top.API.displayMessage("onTcpOnRecved is done,Check:" + Check);
        if (Check == "00") {
            top.API.Pin.PrivateKeyDec(2, "");
        } else {
			Files.ErrorMsg("通讯失败，交易结束");
            setTimeout(function () {
                return CallResponse("Exit");
            }, 4000);
        }
    }

    function onTcpSendFailed() {
        top.API.displayMessage("onTcpSendFailed is done");
        Files.ErrorMsg("通讯失败，交易结束");
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }
    function onTcpTimeout() {
        top.API.displayMessage("onTcpTimeout is done");
		Files.ErrorMsg("通讯超时，交易结束");
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }
    /********************************************************************************************************/
    //PIN模块
	/*
    function onPrivateKeyDecComplete(PlainData) {
		var	PinKey = PlainData;
        top.API.displayMessage("onPrivateKeyDecComplete is done, PlainData = " + PinKey);
	
        var HexMasterKey = top.stringToHex(PinKey);
        var tmphexArray = new Array(0);
	    var tmphexArray2 = top.stringToHex("0000000000000000");
        top.API.Pin.ExtendedLoadKey_Ex("InitKey", HexMasterKey, "ChinaSM,CRYPT", tmphexArray, "", 2, "");
    }

    function onPrivateKeyDecFailed() {
        top.API.displayMessage("onPrivateKeyDecFailed is done");
        span_tip.innerText = "私钥解密失败，请确认";
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }

    function onGetCertifiateComplete(CertData) { // 该事件成功不做任何处理
        top.API.displayMessage("onGetCertifiateComplete is done, CertData = " + CertData);
    }

    function onGetCertifiateFailed() {
        top.API.displayMessage("onGetCertifiateFailed is done");
        span_tip.innerText = "获取证书信息错误，请检查";
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }*/

    function onVerifyPINComplete() {
        top.API.displayMessage("onVerifyPINComplete is done");
		return CallResponse("OK");
        //top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);
    }

    function onVerifyPINFailed(data) {
        top.API.displayMessage("onVerifyPINFailed is done, data = " + data);
        if (data == "-6") {
            // 密码错
            document.getElementById('OK').disabled = false;
            span_tip.innerText = "密码错，请重新输入";
        } else if (data == "-10") {
            // 当前是默认密码，需要修改再验证
            document.getElementById('OK').disabled = false;
            span_tip.innerText = "当前是默认密码，需要修改再验证";
        } else {
            span_tip.innerText = "密码校验错误，请确认密码";
            setTimeout(function () {
                return CallResponse("Exit");
            }, 4000);
        }
    }

    /********************************************************************************************************/
    function onKeyLoaded() {
        top.API.displayMessage('onKeyLoaded is done');
        return CallResponse("OK");
    }

    function onDeviceError() {
        top.API.displayMessage('键盘触发事件：onDeviceError()');
        return CallResponse("Exit");
    }

    function onKeyLoadFailed() {
        top.API.displayMessage('键盘触发事件：onKeyLoadFailed()');
        span_tip.innerText = "密秘钥导入错误";
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }

    function onCryptFailed() {
        top.API.displayMessage('键盘加解密失败：onCryptFailed');
        return CallResponse("Exit");
    }
	//--end
	
    function EventLogin() {
        
        top.API.Pin.addEvent('KeyLoaded', onKeyLoaded);
        top.API.Pin.addEvent('KeyLoadFailed', onKeyLoadFailed);
        top.API.Pin.addEvent("CryptFailed", onCryptFailed);
        top.API.Pin.addEvent('DeviceError', onDeviceError);

        top.API.Pin.addEvent("VerifyPINComplete", onVerifyPINComplete);
        top.API.Pin.addEvent('VerifyPINFailed', onVerifyPINFailed);
    }

    function EventLogout() {
        top.API.Pin.removeEvent('KeyLoaded', onKeyLoaded);
        top.API.Pin.removeEvent('KeyLoadFailed', onKeyLoadFailed);
        top.API.Pin.removeEvent("CryptFailed", onCryptFailed);
        top.API.Pin.removeEvent('DeviceError', onDeviceError);

        top.API.Pin.removeEvent("VerifyPINComplete", onVerifyPINComplete);
        top.API.Pin.removeEvent('VerifyPINFailed', onVerifyPINFailed);
    }


    function Clearup() {
        EventLogout();
    }
})();