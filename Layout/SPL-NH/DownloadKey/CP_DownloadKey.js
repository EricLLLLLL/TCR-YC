/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {
    var keyFlag = 0; //辨别PINKEY、MACKEY标志位；1：PINKEY   2：MACKEY
    var Pinkey = "";
    var MACkey = "";
    var JnlNum = 0; //记流水,交易流水号
    var Check = ""; //记流水,交易响应码
    var strMsg = ""; //记流水,交易信息		

    var ChangeNum = new Array();
    var BoxNo = new Array();
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        ButtonDisable();
        EventLogin();
        //获取交易流水号
        var nRet1 = top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);
        top.API.displayMessage("GetPersistentData JNLNUM Return:" + nRet1);
    } (); //Page Entry
    function ButtonDisable() {
        document.getElementById('OK').disabled = true;
        document.getElementById('Exit').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('OK').disabled = false;
        document.getElementById('Exit').disabled = false;
    }

    function DownFaild() {
        document.getElementById("faildDiv").style.display = "block";
        document.getElementById("ChangeDiv").style.display = "none";
        document.getElementById("Exit").style.display = "block";
        ButtonEnable();
    }

    function DownSuccessd() {
        document.getElementById("SuccessedDiv").style.display = "block";
        document.getElementById("ChangeDiv").style.display = "none";
        document.getElementById("OK").style.display = "block";
        ButtonEnable();
    }

    //@User ocde scope start
    document.getElementById('OK').onclick = function () {
        ButtonDisable();
        return CallResponse('OK');
    }

    document.getElementById('Exit').onclick = function () {
        ButtonDisable();
        return CallResponse('Exit');
    }
    /********************************************************************************************************/
    //永久数据模块
    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        var arrDataValue = DataValue;
        var nRet1 = -1;
        top.API.displayMessage("onDatGetPersistentDataComplete is done,DataName=" + DataName + ",DataType=" + DataType + ",DataValue=" + arrDataValue[0]);
        if ('JNLNUM' == DataName) {
            JnlNum = arrDataValue[0] + 1;
            if (JnlNum.toString().length === 7) {
                JnlNum = 0;
            }
            //设置交易流水号
            var arrJnlNum = new Array();
            arrJnlNum[0] = JnlNum;
            nRet1 = top.API.Dat.SetPersistentData(top.API.jnlnumTag, top.API.jnlnumType, arrJnlNum);
            top.API.displayMessage('查询余额报文--交易流水号：SetPersistentData JNLNUM Return:' + nRet1 + '，JNLNUM = ' + JnlNum);
        }
    }

    function onDatGetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatGetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        DownFaild();
    }
    function onDatSetPersistentDataComplete(DataName) {
        top.API.displayMessage("onDatSetPersistentDataComplete is done,DataName=" + DataName);
        if ('JNLNUM' == DataName) {
            var arrTransType = new Array("APPLYWORKPARAM");
            top.API.displayMessage("Start APPLYWORKPARAM");
            top.API.Tcp.CompositionData(arrTransType); //进行处理工作参数报文
        }        
    }

    function onDatSetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatSetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        DownFaild();
        ButtonEnable();
    }

    //@User code scope end 
    /********************************************************************************************************/
    //组包模块
    function onCompositionDataCompleted(arrData) {
        top.API.displayMessage("onCompositionDataCompleted is done");
        var objArrData = arrData;
        top.API.Tcp.SendToHost(objArrData, 60000);
    }
    function onCompositionDataFail() {
        top.API.displayMessage("onCompositionDataFail is done");
        DownFaild()
    }

    function onMACGenerated(MacData) {
        top.API.displayMessage("onMACGenerated is done");
        var objMacData = MacData;
        top.API.Tcp.SendToHost(objMacData, 60000);
    }
    /********************************************************************************************************/
    //TCP模块
    function onTcpOnRecved(tmpCheck) {
        Check = tmpCheck;
        top.API.displayMessage("onTcpOnRecved is done,Check:" + Check);
        switch (Check) {
            case '00':
                if (CheckKey()) {
                    DownPinKey();
                } else {
                    DownFaild();
                }
                break;
            default:
                top.API.displayMessage("下载工作参数异常");
                DownFaild();
                break;
        }
    }

    function onTcpSendFailed() {
        top.API.displayMessage("onTcpSendFailed is done");
        DownFaild();

    }
    function onTcpTimeout() {
        top.API.displayMessage("onTcpTimeout is done");
        DownFaild();
    }
    function onAnalysisFailed() {
        top.API.displayMessage("onAnalysisFailed is done");
        DownFaild();

    }
    /********************************************************************************************************/
    //PIN模块
    function CheckKey() {
        var objGetPinKey = top.API.Dat.GetDataSync(top.API.pinkeyTag, top.API.pinkeyType);
        var objGetMACKey = top.API.Dat.GetDataSync(top.API.mackeyTag, top.API.mackeyType);
        if (null == objGetPinKey || null == objGetMACKey) {
            top.API.displayMessage("GetDataSync WorKKey objGet = null");
            return false;
        }
        else {
            top.API.displayMessage("GetDataSync objGetPinKey Return:" + objGetPinKey);
            top.API.displayMessage("GetDataSync objGetMACKey Return:" + objGetMACKey);
            var arrGetPinKey = objGetPinKey;
            var arrGetMACKey = objGetMACKey;
            PinKey = arrGetPinKey[0];
            MACKey = arrGetMACKey[0];
            if (PinKey == "" || MACKey == "") {
                return false;
            } else {
                return true;
            }
        }
    }

    function DownPinKey() {
        top.API.displayMessage("下载PINKEY");
        keyFlag = 1;
        var HexWorkKey = top.stringToHex(PinKey);
        var tmphexArray = new Array();
        top.API.Pin.ExtendedLoadEncryptedKey("PINKEY", HexWorkKey, "MasterKey", "CRYPT,FUNCTION,MACING,KEYENCKEY", tmphexArray);
    }

    function DownMACKey() {
        top.API.displayMessage("下载MACKEY");
        keyFlag = 2;
        var HexWorkKey = top.stringToHex(MACKey);
        var tmphexArray = new Array();
        top.API.Pin.ExtendedLoadEncryptedKey("MACKEY", HexWorkKey, "MasterKey", "CRYPT,MACING", tmphexArray);
    }

    function onKeyLoaded() {
        top.API.displayMessage('触发事件：onKeyLoaded()');
        if (keyFlag == 1) {
            top.API.displayMessage('下载PINKEY成功');
            DownMACKey();
        } else {
            top.API.displayMessage('下载MACKEY成功');
            DownSuccessd();
        }
    }

    function onDeviceError() {
        top.API.displayMessage('键盘触发事件：onDeviceError()');
        DownFaild();
    }
    function onKeyLoadFailed() {
        top.API.displayMessage('键盘触发事件：onDeviceError()');
        DownFaild();
    }
    /////////////////////////////////////////
    //Register the event
    function EventLogin() {
        top.API.Tcp.addEvent("SendFailed", onTcpSendFailed);
        top.API.Tcp.addEvent("OnRecved", onTcpOnRecved);
        top.API.Tcp.addEvent("CompositionDataCompleted", onCompositionDataCompleted);
        top.API.Tcp.addEvent("Timeout", onTcpTimeout);
        top.API.Tcp.addEvent("CompositionDataFail", onCompositionDataFail);
        top.API.Tcp.addEvent("AnalysisFailed", onAnalysisFailed);
        ////
        top.API.Pin.addEvent("MACGenerated", onMACGenerated);
        top.API.Pin.addEvent('KeyLoaded', onKeyLoaded);
        top.API.Pin.addEvent('KeyLoadFailed', onKeyLoadFailed); 
        top.API.Pin.addEvent('DeviceError ', onDeviceError);
        ////
        top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.addEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.addEvent("SetPersistentDataError", onDatSetPersistentDataError)
    }

    function EventLogout() {
        ////
        top.API.Tcp.removeEvent("SendFailed", onTcpSendFailed);
        top.API.Tcp.removeEvent("OnRecved", onTcpOnRecved);
        top.API.Tcp.removeEvent("CompositionDataCompleted", onCompositionDataCompleted);
        top.API.Tcp.removeEvent("Timeout", onTcpTimeout);
        top.API.Tcp.removeEvent("CompositionDataFail", onCompositionDataFail);
        top.API.Tcp.removeEvent("AnalysisFailed", onAnalysisFailed);
        ////
        top.API.Pin.removeEvent("MACGenerated", onMACGenerated);
        top.API.Pin.removeEvent('KeyLoaded', onKeyLoaded);
        top.API.Pin.removeEvent('KeyLoadFailed', onKeyLoadFailed); 
        top.API.Pin.removeEvent('DeviceError ', onDeviceError);
        ////
        top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.removeEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.removeEvent("SetPersistentDataError", onDatSetPersistentDataError)
    }
    //remove all event handler
    function Clearup() {
        EventLogout();
    }
})();
