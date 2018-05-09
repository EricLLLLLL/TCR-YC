/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {
	var JnlNum = 0; //记流水,交易流水号
	var Check = ""; //记流水,交易响应码
	var strMsg = ""; //记流水,交易信息	
	var strErrMsg = "交易失败";
	var arrTransType;
	var strMsgType = 0;
	
	var ChangeNum = new Array();
    var CallResponse = App.Cntl.ProcessOnce( function(Response){
        EventLogout();
        App.Cntl.ProcessDriven( Response );
    });
	var Initialize = function () {
		ButtonDisable();
		EventLogin();
		top.API.Cim.StatisticsData();
		top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);
    } (); //Page Entry
    function ButtonDisable() {
        document.getElementById('OK').disabled = true;
        document.getElementById('Exit').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('OK').disabled = false;
        document.getElementById('Exit').disabled = false;
    }
	
	function ExchangeStart() {
        top.API.Cdm.PUCurrentCount();
        top.API.Cdm.CUNoteValue();
        top.API.Cdm.CUType();   
        for (var i = 0; i < top.API.CashInfo.arrUnitName.length; i++) {
			ChangeNum[i] = top.API.CashInfo.arrUnitName[i] + ":0";
		}
        top.API.Cim.StartExchange();
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
	
    function ShowFaildInfo() {
        ButtonEnable();
        document.getElementById("ErrFailTip").innerText = strErrMsg;
		document.getElementById("faildDiv").style.display = "block";
		document.getElementById("ChangeDiv").style.display = "none";
		document.getElementById("Exit").style.display = "block";
	}

	function PrintJnl() {
	    var arrTransactionResult = new Array(strErrMsg);
	    top.API.Dat.SetDataSync("TRANSACTIONRESULT", "STRING", arrTransactionResult);
	    top.API.Jnl.PrintSync("Transaction");
	    if (strErrMsg != "交易成功") {
	        ShowFaildInfo();
	    }
	}


    function onExchangeInitiated() {
        var nRet = top.API.Cim.SetUnitCountSync(ChangeNum);
        if (nRet == 0) {
            var arrTransKindType = new Array("清除统计数据");
            top.API.Dat.SetDataSync(top.API.TransKindTag, top.API.TransKindType, arrTransKindType);
            top.API.Jnl.PrintSync("MachineSettle");
            var PtrPaperStatus = top.API.Ptr.StPaperStatus();
            if (PtrPaperStatus == "FULL" || PtrPaperStatus == "LOW") {
                top.API.Ptr.Print("TOTAL_szABC_haveReDep", "",top.API.gPrintTimeOut);
            }
            top.API.Cim.EndExchange();
        } else {
            ShowFaildInfo();
        }
        ButtonEnable();
    }

    function onExchangeCompleted() {
        var arrTotalFlag = new Array();
        arrTotalFlag[0] = 0;
        top.API.Dat.SetPersistentData("TOTALADDOK", "LONG", arrTotalFlag);
		
		// 保存清机时间
		var strTmp = getNowFormatDate();
		top.API.displayMessage("本次清机时间:" + strTmp);
		top.API.Dat.WritePrivateProfileSync("Exchange", "ExchangeDate", strTmp, top.API.Dat.GetBaseDir()+top.API.gIniFileName);
    }

	function getNowFormatDate() {
		var date = new Date();
		var seperator1 = "-";
		var seperator2 = ":";
		var month = date.getMonth() + 1;
		var strDate = date.getDate();
		var strHour = date.getHours();
		var strMin = date.getMinutes();
		var strSec = date.getSeconds();
		
		if (month >= 1 && month <= 9) {
			month = "0" + month;
		}
		
		if (strDate >= 0 && strDate <= 9) {
			strDate = "0" + strDate;
		}
		
		if (strHour >= 0 && strHour <= 9) {
			strHour = "0" + strHour;
		}
		
		if (strMin >= 0 && strMin <= 9) {
			strMin = "0" + strMin;
		}
		
		if (strSec >= 0 && strSec <= 9) {
			strSec = "0" + strSec;
		}
		
		var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + strHour + seperator2 + strMin + seperator2 + strSec;
		return currentdate;
	} 

    function onDeviceError() {
		var strAcceptStatus = top.API.Cim.LastAcceptStatus();
        top.API.displayMessage("LastAcceptStatus=" + strAcceptStatus);
		if (strAcceptStatus == "ACTIVE") {
			top.API.displayMessage("执行CashInEnd");
            top.API.Cim.StoreEscrowedCash(top.API.gStoreEscrowedCashTimeOut);
			ExchangeStart();
        } else{
			ButtonEnable();
			ShowFaildInfo();
		}
    }
    /********************************************************************************************************/    
    /********************************************************************************************************/
    //永久数据模块
    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        var arrDataValue = DataValue;
        if ('JNLNUM' == DataName) {
            JnlNum = arrDataValue[0] + 1;
            if (JnlNum.toString().length === 9) {
                JnlNum = 0;
            }
            var arrJnlNum = new Array();
            arrJnlNum[0] = JnlNum;
            top.API.Dat.SetPersistentData(top.API.jnlnumTag, top.API.jnlnumType, arrJnlNum);
		}
    }

    function onDatGetPersistentDataError(DataName, ErrorCode) {
        ButtonEnable();
		ShowFaildInfo();
    }
    function onDatSetPersistentDataComplete(DataName) {
        if ('JNLNUM' == DataName) {
            top.API.displayMessage("开始清机前的组包");
            var arrTransType = new Array("EXCHANGE");
            top.API.Tcp.CompositionData(arrTransType); //清机报文
        }
        if ('TOTALADDOK' == DataName) {
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
			document.getElementById("ErrOkTip").value = strErrMsg;
    		document.getElementById("SuccessedDiv").style.display = "block";
            document.getElementById("ChangeDiv").style.display = "none";
            document.getElementById("OK").style.display = "block"; 
			ButtonEnable();
        }          
    }

    function onDatSetPersistentDataError(DataName, ErrorCode) {
        ButtonEnable();
		ShowFaildInfo();
    }

    //@User code scope end 
	/********************************************************************************************************/
    //组包模块
    function onCompositionDataCompleted(arrData) {
        top.API.displayMessage("onCompositionDataCompleted");
	    var HexWorkKey = top.stringToHex(arrData);
	    top.API.Pin.GenerateMAC(HexWorkKey, "MACKEY", '', 0, 0);
    }
	function onCompositionDataFail() {
        top.API.displayMessage("CompositionDataFail");
        //NextPageFlag = 2;
        strErrMsg = "组包失败";
        PrintJnl();
    }

    function onMACGenerated(MacData) {
		top.API.displayMessage("onMACGenerated");
		var objMacData = top.stringToHex(MacData);
        top.API.Tcp.SendToHost(objMacData, 60000);
	//ExchangeStart();
    }
	/********************************************************************************************************/
    //TCP模块
    function onTcpOnRecved(tmpCheck) {
        Check = tmpCheck;
        top.API.displayMessage("Check:" + Check);
        strErrMsg = "";
        switch (Check) {
            case '00':
				ExchangeStart();
				strErrMsg = "轧帐对账平，交易成功!";
                break;
            case "Z0":
                ExchangeStart();
                strErrMsg = "轧帐，对帐结果不平";
                break;
            default:
                top.API.displayMessage("下载工作参数异常");  
                strErrMsg = "交易失败，返回码=" + Check;
                PrintJnl();
				//ExchangeStart();
                break;
        }       
    }
	
    function onTcpSendFailed() {
        top.API.displayMessage("onTcpSendFailed is done");
        strErrMsg = "报文发送失败";
        PrintJnl();
    }
    function onTcpTimeout() {
        top.API.displayMessage("onTcpTimeout is done");
        strErrMsg = "通讯超时";
        PrintJnl();
    }
	function onAnalysisFailed() {
	    top.API.displayMessage("onAnalysisFailed is done");
	    strErrMsg = "解包失败";
	    PrintJnl();
    }

    function onStartExchangeFailed() {
        top.API.displayMessage('触发事件：StartExchangeFailed()');
        strErrMsg = "onStartExchangeFailed";
        PrintJnl();
    }

    function onEndExchangeFailed() {
        top.API.displayMessage('触发事件：EndExchangeFailed()');
        strErrMsg = "onEndExchangeFailed";
        PrintJnl();
    }

	function onCryptFailed(){
	    top.API.displayMessage('触发事件：onCryptFailed()');
	    strErrMsg = "onCryptFailed";
	    PrintJnl();
	}
	
	function onPinDeviceError() {
	    top.API.displayMessage('触发事件：onPinDeviceError()');
	    strErrMsg = "onPinDeviceError";
	    PrintJnl();
	}
    //Register the event
    function EventLogin() {
        top.API.Cim.addEvent('StartExchangeCompleted', onExchangeInitiated);
        top.API.Cim.addEvent('StartExchangeFailed', onStartExchangeFailed);
        top.API.Cim.addEvent('DeviceError', onDeviceError);
        top.API.Cim.addEvent('EndExchangeCompleted', onExchangeCompleted);
        top.API.Cim.addEvent('EndExchangeFailed', onEndExchangeFailed);
		////
        top.API.Tcp.addEvent("SendFailed", onTcpSendFailed);
        top.API.Tcp.addEvent("OnRecved", onTcpOnRecved);
        top.API.Tcp.addEvent("CompositionDataCompleted", onCompositionDataCompleted);
        top.API.Tcp.addEvent("Timeout", onTcpTimeout);
		top.API.Tcp.addEvent("CompositionDataFail", onCompositionDataFail);
		top.API.Tcp.addEvent("AnalysisFailed", onAnalysisFailed);
		top.API.Pin.addEvent("MACGenerated", onMACGenerated);
		top.API.Pin.addEvent('DeviceError', onPinDeviceError);
		top.API.Pin.addEvent("CryptFailed",onCryptFailed);
        ////
        top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.addEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.addEvent("SetPersistentDataError", onDatSetPersistentDataError);
    }

    function EventLogout() {
        top.API.Cim.removeEvent('StartExchangeCompleted', onExchangeInitiated);
        top.API.Cim.removeEvent('StartExchangeFailed', onStartExchangeFailed);
        top.API.Cim.removeEvent('DeviceError', onDeviceError);
        top.API.Cim.removeEvent('EndExchangeCompleted', onExchangeCompleted);
        top.API.Cim.removeEvent('EndExchangeFailed', onEndExchangeFailed);
        ////
        top.API.Tcp.removeEvent("SendFailed", onTcpSendFailed);
        top.API.Tcp.removeEvent("OnRecved", onTcpOnRecved);
        top.API.Tcp.removeEvent("CompositionDataCompleted", onCompositionDataCompleted);
        top.API.Tcp.removeEvent("Timeout", onTcpTimeout);
		top.API.Tcp.removeEvent("CompositionDataFail", onCompositionDataFail);
		top.API.Tcp.removeEvent("AnalysisFailed", onAnalysisFailed);
		top.API.Pin.removeEvent("MACGenerated", onMACGenerated);
		top.API.Pin.removeEvent('DeviceError', onPinDeviceError);
		top.API.Pin.removeEvent('CryptFailed', onCryptFailed);
        ////
        top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.removeEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.removeEvent("SetPersistentDataError", onDatSetPersistentDataError);
    }

    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
    }
})();
