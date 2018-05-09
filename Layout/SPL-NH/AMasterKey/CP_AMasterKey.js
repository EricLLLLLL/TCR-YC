// JavaScript Document
/*@create by:  tsxiong
*@time: 2018年03月27日
*/
(function () {
    var bPinOpen = false;
    var clickEnter = false;
    var Password = document.getElementById("PswInput");
    Password.focus();
    var Element;
    var span_tip = document.getElementById("span_tip");


    var CallResponse = App.Cntl.ProcessOnce(function (Response) {
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        EventLogin();
        App.Plugin.Keyboard.show("9", "PageSubject", "KeyboardDiv");
        Element = Password;
        top.API.displayMessage("Start GetCertifiate");
        top.API.Pin.GetCertifiate(2); // 直接从UKEY中获取授权信息
    }(); //Page Entry

    //@User ocde scope start  
    document.getElementById('Exit').onclick = function () {
        document.getElementById('Exit').disabled = true;
        return CallResponse('Exit');
    }

    //输入框点击事件
    Password.onclick = function () {
        Password.focus();
    }

    document.getElementById('OK').onclick = function () {
        top.API.displayMessage("KeyboardKey_set onclick");
        if (Password.value == "") {
            span_tip.innerText = "输入信息不能为空！";
        } else if (Password.value.length != 6) {
            span_tip.innerText = "输入密码长度不足6位！";
        } else {
            // 处理如何校验，获取KeyCode
            document.getElementById('OK').disabled = true;
            top.API.displayMessage("校验密码");
            var tmphexArray2 = top.stringToHex(Password.value);
            top.API.Pin.VerifyPIN(tmphexArray2); // 通过接口确认密码
        }
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
            top.API.displayMessage("APPLYINITKEY");
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
        var objArrData = new Array();
        top.API.Tcp.SendToHost(objArrData, 60000);
        span_tip.innerText = "交易正在处理，请稍候...";
    }

    function onTcpOnRecved(tmpCheck) {
        Check = tmpCheck;
        top.API.displayMessage("onTcpOnRecved is done,Check:" + Check);
        if (Check == "00") {
            top.API.Pin.PrivateKeyDec(2, "");
        } else {
            span_tip.innerText = "错误码：" + Check;
            setTimeout(function () {
                return CallResponse("Exit");
            }, 4000);
        }
    }

    function onTcpSendFailed() {
        top.API.displayMessage("onTcpSendFailed is done");
        span_tip.innerText = "报文发送失败";
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }
    function onTcpTimeout() {
        top.API.displayMessage("onTcpTimeout is done");
        span_tip.innerText = "通讯故障";
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }
    /********************************************************************************************************/
    //PIN模块
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
    }

    function onVerifyPINComplete() {
        top.API.displayMessage("onVerifyPINComplete is done");
        top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);
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

    function EventLogin() {
        top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.addEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.addEvent("SetPersistentDataError", onDatSetPersistentDataError);

        top.API.Tcp.addEvent("SendFailed", onTcpSendFailed);
        top.API.Tcp.addEvent("OnRecved", onTcpOnRecved);
        top.API.Tcp.addEvent("CompositionDataCompleted", onCompositionDataCompleted);
        top.API.Tcp.addEvent("Timeout", onTcpTimeout);

        top.API.Pin.addEvent('KeyLoaded', onKeyLoaded);
        top.API.Pin.addEvent('KeyLoadFailed', onKeyLoadFailed);
        top.API.Pin.addEvent("CryptFailed", onCryptFailed);
        top.API.Pin.addEvent('DeviceError', onDeviceError);

        top.API.Pin.addEvent('PrivateKeyDecComplete', onPrivateKeyDecComplete);
        top.API.Pin.addEvent('PrivateKeyDecFailed', onPrivateKeyDecFailed);
        top.API.Pin.addEvent("GetCertifiateComplete", onGetCertifiateComplete);
        top.API.Pin.addEvent('GetCertifiateFailed', onGetCertifiateFailed);
        top.API.Pin.addEvent("VerifyPINComplete", onVerifyPINComplete);
        top.API.Pin.addEvent('VerifyPINFailed', onVerifyPINFailed);
    }

    function EventLogout() {
        top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.removeEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.removeEvent("SetPersistentDataError", onDatSetPersistentDataError);

        top.API.Tcp.removeEvent("SendFailed", onTcpSendFailed);
        top.API.Tcp.removeEvent("OnRecved", onTcpOnRecved);
        top.API.Tcp.removeEvent("CompositionDataCompleted", onCompositionDataCompleted);
        top.API.Tcp.removeEvent("Timeout", onTcpTimeout);

        top.API.Pin.removeEvent('KeyLoaded', onKeyLoaded);
        top.API.Pin.removeEvent('KeyLoadFailed', onKeyLoadFailed);
        top.API.Pin.removeEvent("CryptFailed", onCryptFailed);
        top.API.Pin.removeEvent('DeviceError', onDeviceError);

        top.API.Pin.removeEvent('PrivateKeyDecComplete', onPrivateKeyDecComplete);
        top.API.Pin.removeEvent('PrivateKeyDecFailed', onPrivateKeyDecFailed);
        top.API.Pin.removeEvent("GetCertifiateComplete", onGetCertifiateComplete);
        top.API.Pin.removeEvent('GetCertifiateFailed', onGetCertifiateFailed);
        top.API.Pin.removeEvent("VerifyPINComplete", onVerifyPINComplete);
        top.API.Pin.removeEvent('VerifyPINFailed', onVerifyPINFailed);
    }

    function Clearup() {
        EventLogout();
    }
})();