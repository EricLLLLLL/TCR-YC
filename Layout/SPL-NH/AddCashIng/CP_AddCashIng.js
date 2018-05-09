/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {
    var strErrMsg = "";
    var JnlNum = 0;
    var ChangeNum = new Array();
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        EventLogin();
		top.API.gAddNoteSuccess = false;
        for (i= 0; i < top.API.CashInfo.nCountOfUnits; i++) {
            ChangeNum[i] = top.API.CashInfo.arrUnitName[i] + ":" + top.API.CashInfo.arrUnitRemain[i].toString();          
        }
        top.API.displayMessage('ChangeNum=' + ChangeNum);
        top.API.Cim.StartExchange();
    } (); //Page Entry


    function onExchangeInitiated() {
        var nRet = top.API.Cim.SetUnitCountSync(ChangeNum);
        if (nRet == 0) {
            top.API.Cim.EndExchange();
        } else {
            strErrMsg = "设置钞箱数据失败";
            ShowFaildInfo();
            //return CallResponse("OK");
        }
    }

    function onExchangeCompleted() {
        //获取当前钞箱信息--钞箱余额
		var arrCurrentCount = new Array();
		var arrSplite = new Array();
		var arrReturnInfo = new Array();
		arrCurrentCount = top.API.Cdm.PUCurrentCount();
		for (i = 0; i < arrCurrentCount.length; i++) {
			arrSplite = arrCurrentCount[i].split(":");
			top.API.CashInfo.arrUnitName[i] = arrSplite[0];
			top.API.CashInfo.arrUnitRemain[i] = arrSplite[1];
		}
        //获取当前钞箱信息--钞箱面值
        top.API.CashInfo.arrUnitCurrency = top.API.GetUnitInfo(top.API.Cdm.CUNoteValue());
        //获取当前钞箱信息--钞箱个数
        top.API.CashInfo.nCountOfUnits = top.API.CashInfo.arrUnitRemain.length;
	//	top.API.gAddNoteSuccess = true;
        //return CallResponse("OK");
		//获取交易流水号
        top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);
    }

    function onDeviceError() {
        top.API.displayMessage('触发事件：onDeviceError()');
        return CallResponse("OK");
    }

    function onStartExchangeFailed() {
        top.API.displayMessage('触发事件：StartExchangeFailed()');
        return CallResponse("OK");
    }

    function onEndExchangeFailed() {
        top.API.displayMessage('触发事件：EndExchangeFailed()');
        return CallResponse("OK");
    }

document.getElementById('Exit').onclick = function () {
        //ButtonDisable();
        return CallResponse('Exit');
    }

    //@User code scope end 
    /********************************************************************************************************/
    //数据模块
    function onDatSetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatSetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        strErrMsg = "设置数据失败";
        ShowFaildInfo();
    }


    function onDatGetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatGetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        strErrMsg = "获取数据失败";
        ShowFaildInfo();
    }

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
            top.API.displayMessage('ADDCash--交易流水号：SetPersistentData JNLNUM ' + JnlNum);
        }
    }

    function onDatSetPersistentDataComplete(DataName) {
        top.API.displayMessage("onDatSetPersistentDataComplete is done,DataName=" + DataName);
        if ('TOTALADDOK' == DataName) {
            //获取交易流水号
            var nRet1 = top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);
            top.API.displayMessage("GetPersistentData JNLNUM Return:" + nRet1);
        } else if ('JNLNUM' == DataName) {
            // 组包，并发送报文
            var arrTransKindType = new Array("加钞");
            top.API.Dat.SetDataSync(top.API.TransKindTag, top.API.TransKindType, arrTransKindType);
            top.API.Jnl.PrintSync("BeforeSendDisposal");

            var arrTransType = new Array("ADDNOTE");
            top.API.displayMessage("Start ADDCASH");
            top.API.Tcp.CompositionData(arrTransType); //加钞报文
        }
    }

    /********************************************************************************************************/
    //组包模块
    function onTcpOnRecved(tmpCheck) {
        var Check = tmpCheck;
        if (Check == '00') {
            strErrMsg = "交易成功";
            var arrTransactionResult = new Array(strErrMsg);
            top.API.Dat.SetDataSync("TRANSACTIONRESULT", "STRING", arrTransactionResult);
            top.API.Jnl.PrintSync("Transaction");
            top.API.gAddNoteSuccess = true;
            return CallResponse("OK");
        } else {
            strErrMsg = "加钞失败,返回码：" + Check;
            ShowFaildInfo();
        }
    }

    function onTcpSendFailed() {
        top.API.displayMessage("onTcpSendFailed is done");
        strErrMsg = "报文发送失败";
        ShowFaildInfo();
    }
    function onTcpTimeout() {
        top.API.displayMessage("onTcpTimeout is done");
        strErrMsg = "通讯超时";
        ShowFaildInfo();
    }
    function onAnalysisFailed() {
        top.API.displayMessage("onAnalysisFailed is done");
        strErrMsg = "解包失败";
        ShowFaildInfo();
    }

    function onCompositionDataCompleted(arrData) {
        top.API.displayMessage("onCompositionDataCompleted is done");
        var HexWorkKey = top.stringToHex(arrData);
        top.API.Pin.GenerateMAC(HexWorkKey, "MACKEY", '', 0, 0);
    }
    function onCompositionDataFail() {
        top.API.displayMessage("onCompositionDataFail is done");
        strErrMsg = "组包失败";
        ShowFaildInfo();
    }

    /********************************************************************************************************/
    //加密模块
    function onMACGenerated(MacData) {
        top.API.displayMessage("onMACGenerated is done");
        var HexWorkKey = top.stringToHex(MacData);
        top.API.Tcp.SendToHost(HexWorkKey, 60000);
    }

    function onDeviceError() {
        top.API.displayMessage('键盘触发事件：onDeviceError()');
        strErrMsg = "密码键盘故障";
        ShowFaildInfo();
    }

    function ShowFaildInfo() {
        document.getElementById("ErrTips").innerText = strErrMsg;
        var arrTransactionResult = new Array(strErrMsg);
        top.API.Dat.SetDataSync("TRANSACTIONRESULT", "STRING", arrTransactionResult);
        top.API.Jnl.PrintSync("Transaction");

        var ChangeFlag = new Array();
        ChangeFlag[0] = 0;
        var nRet1 = top.API.Dat.SetDataSync(top.API.addnoteflagTag, top.API.addnoteflagType, ChangeFlag);
        top.API.displayMessage("SetDataSync ADDNOTEFLAG Return:" + nRet1);
        //return CallResponse("OK");
    }

    //Register the event
    function EventLogin() {
        top.API.Cim.addEvent('StartExchangeCompleted', onExchangeInitiated);
        top.API.Cim.addEvent('StartExchangeFailed', onStartExchangeFailed);
        top.API.Cim.addEvent('DeviceError', onDeviceError);
        top.API.Cim.addEvent('EndExchangeCompleted', onExchangeCompleted);
        top.API.Cim.addEvent('EndExchangeFailed', onEndExchangeFailed);

        top.API.Dat.addEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.addEvent("SetPersistentDataError", onDatSetPersistentDataError);

        top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
        //////////
        top.API.Tcp.addEvent("SendFailed", onTcpSendFailed);
        top.API.Tcp.addEvent("OnRecved", onTcpOnRecved);
        top.API.Tcp.addEvent("CompositionDataCompleted", onCompositionDataCompleted);
        top.API.Tcp.addEvent("Timeout", onTcpTimeout);
        top.API.Tcp.addEvent("CompositionDataFail", onCompositionDataFail);
        top.API.Tcp.addEvent("AnalysisFailed", onAnalysisFailed);
        ////
        top.API.Pin.addEvent("MACGenerated", onMACGenerated);
        top.API.Pin.addEvent('DeviceError', onDeviceError);
        top.API.Pin.addEvent('CryptFailed', onDeviceError);
    }

    function EventLogout() {
        top.API.Cim.removeEvent('StartExchangeCompleted', onExchangeInitiated);
        top.API.Cim.removeEvent('StartExchangeFailed', onStartExchangeFailed);
        top.API.Cim.removeEvent('DeviceError', onDeviceError);
        top.API.Cim.removeEvent('EndExchangeCompleted', onExchangeCompleted);
        top.API.Cim.removeEvent('EndExchangeFailed', onEndExchangeFailed);

        top.API.Dat.removeEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.removeEvent("SetPersistentDataError", onDatSetPersistentDataError);
        top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);

        ////
        top.API.Tcp.removeEvent("SendFailed", onTcpSendFailed);
        top.API.Tcp.removeEvent("OnRecved", onTcpOnRecved);
        top.API.Tcp.removeEvent("CompositionDataCompleted", onCompositionDataCompleted);
        top.API.Tcp.removeEvent("Timeout", onTcpTimeout);
        top.API.Tcp.removeEvent("CompositionDataFail", onCompositionDataFail);
        top.API.Tcp.removeEvent("AnalysisFailed", onAnalysisFailed);
        ////
        top.API.Pin.removeEvent("MACGenerated", onMACGenerated);
        top.API.Pin.removeEvent('DeviceError', onDeviceError);
        top.API.Pin.removeEvent('CryptFailed', onDeviceError);
    }

    
    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
    }
})();
