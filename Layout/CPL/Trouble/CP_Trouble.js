/*@create by:  tsxiong
*@time: 2016年03月20日
*/
;(function () {
    var keyFlag = 0; //辨别PINKEY、MACKEY标志位；1：PINKEY   2：MACKEY
    var Pinkey = "";
    var MACkey = "";
    var nConnectTimes = 1;
    var bTimeUp = false;
    var timeId;
    var JnlNum = 0; //记流水,交易流水号
    var Check = ""; //记流水,交易响应码
    var strMsg = ""; //记流水,交易信息
    var bTrade = false; //交易是否成功，true:成功
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        EventLogin();
        InitialDevice();
    } (); //Page Entry

    function InitialDevice() {
        top.API.CheckDeviceStatus(); //检测各个部件状态

        //note by hj
        /*if (!top.API.Cim.bDeviceStatus || !top.API.Cdm.bDeviceStatus) {
            top.API.displayMessage("现金模块状态异常，停止服务！");
            top.API.InitOpenFlag();
            return CallResponse("OffLine");
        }*/
		var tmp1 = top.API.Cdm.StOutputStatus();
        var tmp2= top.API.Cim.StInputStatus();
        if (tmp1 != "EMPTY" || tmp2 != "EMPTY") {
            top.API.displayMessage("出钞口InputOutputStatus="+tmp1 + "入钞口InputOutputStatus="+tmp2);
            top.API.InitOpenFlag();
            return CallResponse("OffLine");
        }
        if (top.API.Pin.bDeviceStatus) {// && top.API.Crd.bDeviceStatus
            if ((top.API.Pin.KeyIsValidSync("MasterKey"))) {
                top.API.displayMessage("主密钥存在");
                if ("NOTPRESENT" != top.API.Crd.StMediaStatus()) {//发卡器有卡即吞卡
                    top.API.Crd.Capture(top.API.gCaptureTimeout);
                }
                top.API.CashInfo.bCASH = true;
                //获取当前钞箱信息
				//modify by tsx  临时方案 获取3次钞箱信息
				for(var i=0; i<3;i++){
					var tmpPUCurrentCount = top.API.Cdm.PUCurrentCount();
					var tmpCUNoteValue = top.API.Cdm.CUNoteValue();
					if(tmpPUCurrentCount != null  && tmpCUNoteValue != null){
						//获取当前钞箱信息--钞箱余量
						top.API.CashInfo.arrUnitRemain = tmpPUCurrentCount.toArray();top.API.GetUnitInfo(tmpPUCurrentCount.toArray());
                //获取当前钞箱信息--钞箱面值
						top.API.CashInfo.arrUnitCurrency = top.API.GetUnitInfo(tmpCUNoteValue.toArray());
						//获取当前钞箱信息--钞箱个数
						top.API.CashInfo.nCountOfUnits = top.API.CashInfo.arrUnitRemain.length;
						break;
					}else if(i == 2){
						top.API.displayMessage("获取钞箱信息失败！");
						top.API.InitOpenFlag();
						return CallResponse("OffLine");
					}					
				}
                //获取当前钞箱信息--钞箱个数
                top.API.CashInfo.nCountOfUnits = top.API.CashInfo.arrUnitCurrency.length;
                if (top.API.CashInfo.nCountOfUnits < 5) {
					//top.API.CashInfo.nCountOfUnits=5; 
                    top.API.displayMessage("钞箱数目错误，nCountOfUnits = " + top.API.CashInfo.nCountOfUnits);
                    top.API.InitOpenFlag();
                    return CallResponse("OffLine");
                }
				//检测目前存款模块AcceptStatus
				var strAcceptStatus = top.API.Cim.LastAcceptStatus();
				top.API.displayMessage("LastAcceptStatus=" + strAcceptStatus);
				if (strAcceptStatus == "ACTIVE") {
					top.API.displayMessage("执行CashInEnd");
					//执行CashInEnd
					top.API.Cim.StoreEscrowedCash(top.API.gStoreEscrowedCashTimeOut);
				} 
                //获取清机标志
                var nRet1 = top.API.Dat.GetPersistentData("TOTALADDOK", "LONG");
                top.API.displayMessage("GetPersistentData TOTALADDOK Return:" + nRet1);
            } else {
                top.API.displayMessage("主密钥异常");
                top.API.InitOpenFlag();
                return CallResponse("OffLine");
            }
        } else {
            top.API.displayMessage("键盘打开异常，停止服务");
            top.API.InitOpenFlag();
            return CallResponse("OffLine");
        }
    }

    /********************************************************************************************************/
    //永久数据模块
    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        var arrDataValue = DataValue.toArray();
        var nRet1 = -1;
        top.API.displayMessage("onDatGetPersistentDataComplete is done,DataName=" + DataName + ",DataType=" + DataType + ",DataValue=" + arrDataValue[0]);
        if ('TOTALADDOK' == DataName) {
            if (arrDataValue[0] == 0) {
                top.API.displayMessage("未做清机加钞操作");
                return CallResponse("OffLine");
            } else {
                //获取允许交易类型
                nRet1 = top.API.Dat.GetPersistentData("POSSIBLETRANSACTION", "STRING");
                top.API.displayMessage("GetPersistentData POSSIBLETRANSACTION Return:" + nRet1);
            }
        }
        if ('POSSIBLETRANSACTION' == DataName) {
            if (arrDataValue[0].substr(0, 1) == "1") {
                top.API.CashInfo.bExchange = true;
            } else {
                top.API.CashInfo.bExchange = false;
            }
            if (arrDataValue[0].substr(1, 1) == "1") {
                top.API.CashInfo.bCWD = true;
            } else {
                top.API.CashInfo.bCWD = false;
            }
            if (arrDataValue[0].substr(2, 1) == "1") {
                top.API.CashInfo.bDEP = true;
            } else {
                top.API.CashInfo.bDEP = false;
            }
            //获取终端号
            nRet1 = top.API.Dat.GetPersistentData("TERMINALNUM", "STRING");
            top.API.displayMessage("GetPersistentData TERMINALNUM Return:" + nRet1);
        }
        if ('TERMINALNUM' == DataName) {            
            top.API.gTerminalID = arrDataValue[0];
            //获取交易流水号
            nRet1 = top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);
            top.API.displayMessage("GetPersistentData JNLNUM Return:" + nRet1);
        }
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
        top.API.displayMessage("未做清机加钞操作");
        return CallResponse("OffLine");
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
        return CallResponse("OffLine");
    }
    /********************************************************************************************************/
    //TCP模块
    function onCompositionDataCompleted() {
        top.API.displayMessage("onCompositionDataCompleted is done");
        var objArrData = new Array();
        top.API.Tcp.SendToHost(objArrData, 60000);
    }
    function onTcpOnRecved(tmpCheck) {
        Check = tmpCheck;
        top.API.displayMessage("onTcpOnRecved is done,Check:" + Check);
        strErrMsg = "";
        switch (Check) {
            case '00':
                bTrade = true;
                strErrMsg = "交易成功";
                break;
            default:
                top.API.displayMessage("下载工作参数异常");
                strErrMsg = "交易失败";
                top.API.InitOpenFlag();
                break;
        }
        SendJnl();
    }
    function onTcpSendFailed() {
        top.API.displayMessage("onTcpSendFailed is done");
        App.Timer.SetIntervalDisposal(onCompositionDataCompleted, 15000);
        if (nConnectTimes == 3) {
            top.API.InitOpenFlag();
            top.API.displayMessage("网络连接超时三次");
            return CallResponse("OffLine");
        } else {
            nConnectTimes++;
        }
    }
    function onTcpTimeout() {
        top.API.displayMessage("onTcpTimeout is done");
        App.Timer.SetIntervalDisposal(onCompositionDataCompleted, 15000);
        if (nConnectTimes == 3) {
            top.API.InitOpenFlag();
            top.API.displayMessage("网络连接超时三次");
            return CallResponse("OffLine");
        } else {
            nConnectTimes++;
        }
    }
    /********************************************************************************************************/
    //JNL模块
    function SendJnl() {
        top.API.Jnl.PrintSync("ApplyWorkParam");
        onJnlPrintComplete();
    }
    function onJnlPrintComplete() {
        top.API.displayMessage("onJnlPrintComplete is done");
        if (CheckKey()) {
            DownPinKey();
        } else {
            top.API.displayMessage("下载工作参数交易成功");
            if (bTrade) {
                var arrBSERVICE = new Array();
                arrBSERVICE[0] = 1;
                var nRet = top.API.Dat.SetDataSync(top.API.servicestateTag, top.API.servicestateType, arrBSERVICE);
                top.API.displayMessage("SetDataSync SERVICESTATE Return:" + nRet);
                return CallResponse("OnLine");
            } else {
                top.API.displayMessage("下载工作参数返回码非0");
                return CallResponse("OffLine");
            }
        }
    }

    function onJnlDeviceError() {
        top.API.displayMessage("onJnlDeviceError is done");
        return CallResponse("OffLine");
    }

    function onJnlTimeout() {
        top.API.displayMessage("onJnlTimeout is done");
        return CallResponse("OffLine");
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
            top.API.displayMessage("GetDataSync objGetPinKey Return:" + objGetPinKey.toArray());
            top.API.displayMessage("GetDataSync objGetMACKey Return:" + objGetMACKey.toArray());
            var arrGetPinKey = objGetPinKey.toArray();
            var arrGetMACKey = objGetMACKey.toArray();
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
            if (bTrade) {
                var arrBSERVICE = new Array();
                arrBSERVICE[0] = 1;
                var nRet = top.API.Dat.SetDataSync(top.API.servicestateTag, top.API.servicestateType, arrBSERVICE);
                top.API.displayMessage("SetDataSync SERVICESTATE Return:" + nRet);
                return CallResponse("OnLine");
            } else {
                return CallResponse("OffLine");
            }
        }
    }

    function onDeviceError() {
        top.API.displayMessage('键盘触发事件：onDeviceError()');
        top.API.InitOpenFlag();
        return CallResponse("OffLine");
    }
    function onKeyLoadFailed() {
        top.API.displayMessage('键盘触发事件：onKeyLoadFailed()');
        top.API.InitOpenFlag();
        return CallResponse("OffLine");
    }
    //Register the event
    function EventLogin() {
        top.API.Tcp.addEvent("SendFailed", onTcpSendFailed);
        top.API.Tcp.addEvent("OnRecved", onTcpOnRecved);
        top.API.Tcp.addEvent("CompositionDataCompleted", onCompositionDataCompleted);
        top.API.Tcp.addEvent("Timeout", onTcpTimeout);
        ////
        top.API.Pin.addEvent('KeyLoaded', onKeyLoaded);
        top.API.Pin.addEvent('KeyLoadFailed', onKeyLoadFailed); 
        top.API.Pin.addEvent('DeviceError ', onDeviceError);
        ////
        top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.addEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.addEvent("SetPersistentDataError", onDatSetPersistentDataError)
        ////
    }

    function EventLogout() {
        top.API.Tcp.removeEvent("SendFailed", onTcpSendFailed);
        top.API.Tcp.removeEvent("OnRecved", onTcpOnRecved);
        top.API.Tcp.removeEvent("CompositionDataCompleted", onCompositionDataCompleted);
        top.API.Tcp.removeEvent("Timeout", onTcpTimeout);
        ////
        top.API.Pin.removeEvent('KeyLoaded', onKeyLoaded);
        top.API.Pin.removeEvent('KeyLoadFailed', onKeyLoadFailed); 
        top.API.Pin.removeEvent('DeviceError ', onDeviceError);
        ////
        top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.removeEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.removeEvent("SetPersistentDataError", onDatSetPersistentDataError)
        ////
    }
    //Page Return
    

    //remove all event handler
    function Clearup() {
        EventLogout();
        App.Timer.ClearIntervalTime();
        //TO DO:
    };
})();