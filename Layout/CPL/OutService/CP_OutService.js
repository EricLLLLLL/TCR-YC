/*@create by:  tsxiong
 *@time: 2016年03月20日
 */
; (function(){
    var bSPL1 = false;
    var timeID;
    var arrTransType;
    var nCwcTimes = 0;
    var bCwcFalse = true;
    var JnlNum;
    var nTranType;
    var RetCode;
    var cwcFlag;
    var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        if (cwcFlag == 1 || cwcFlag == 2) {
            //Print();
        }
        //Entry the flows control process.
        App.Cntl.ProcessDriven( Response );
    });
    var Initialize = function() {
        //App.Timer.TimeoutDisposal(TimeoutCallBack);
        EventLogin();
        cwcFlag = top.API.Dat.GetPersistentDataSync(top.API.cwcflagTag, top.API.cwcflagType)[0];
        if (cwcFlag == 1) {
            bCwcFalse = false;
            nTranType = 1;
            top.API.Dat.SetPersistentDataSync(top.API.cwcflagTag, top.API.cwcflagType, [0]);
		    //timeID = window.setInterval(CWC, 60000);
		    App.Timer.SetIntervalDisposal(CWC, 60000);
            //CWC();
        } else if (cwcFlag == 2) {
            bCwcFalse = false;
            nTranType = 2;
            top.API.Dat.SetPersistentDataSync(top.API.cwcflagTag, top.API.cwcflagType, [0]);
            App.Timer.SetIntervalDisposal(DepAgain, 60000);
        } else {
            timeID = window.setInterval(GetMoudlesState, 60000 * 5);
        }
        //@initialize scope start
    }();//Page Entry

    //@User ocde scope start

    //@User code scope end
    function ChangebSPL1() {
        //TO DO:
        bSPL1 = false
    }
    document.getElementById("SPL1").onclick = function(){
        bSPL1 = true;
        var t=window.setTimeout(ChangebSPL1,5000);
    }
    document.getElementById("SPL2").onclick = function(){
        if (bSPL1 && bCwcFalse) {
            bSPL1 = false;
            top.API.Jnl.PrintSync("AdminOpenSpl");
            top.API.Dat.SetDataSync("OPERATESTATE", "STRING", ["0"]);//供暂停服务状态轮询使用 1:处理轮询，0：不处理
            top.API.displayMessage("OPERATESTATE = 0");
            top.API.Sys.OpenManagePage();
        };
    }

    function GetMoudlesState() {
        top.API.displayMessage("设备状态轮询");
        var bState = top.API.Dat.GetDataSync("OPERATESTATE", "STRING")[0];//供暂停服务状态轮询使用 1:处理轮询，0：不处理
        if (bState == 1) { // 处于暂停服务状态，则轮询设备状态
            var bRet = top.API.CheckDeviceStatus();
            if (bRet) { // 网络正常
                if ((top.API.Crd.bDeviceStatus || top.API.Scr.StDetailedDeviceStatus() == "ONLINE")
                    && top.API.Cim.bDeviceStatus && top.API.Cdm.bDeviceStatus &&
                    top.API.Pin.bDeviceStatus ) { // 关键设备状态正常
                    return CallResponse('OnLine');
                }
            }
        }
    }

    function onNetChangeOnline() {
        top.API.displayMessage("onNetChangeOnline");
        var bState = top.API.Dat.GetDataSync("OPERATESTATE", "STRING")[0];//供暂停服务状态轮询使用 1:处理轮询，0：不处理
        if (bState == 1 && bCwcFalse) {
            return CallResponse('OnLine');
        }        
    }

    //event handler
    function onServiceOpened() {
        return CallResponse('OnLine');
    }

    function CWC() {
        arrTransType = "CWC";
        nCwcTimes++;
		//App.Timer.ClearIntervalTime();
        top.API.displayMessage("当前冲正次数为" + nCwcTimes);
        top.API.displayMessage("Start 获取流水号" + arrTransType);
        top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);
    }

    function DepAgain() {
        if (top.API.NoCardDeal) {
            arrTransType = "RENOCARDTFR";
        } else {
            arrTransType = "REDEP";
        }
        nCwcTimes++;
        top.API.displayMessage("当前冲正次数为" + nCwcTimes);
        top.API.displayMessage("Start 获取流水号" + arrTransType);
        top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);
    }
    /********************************************************************************************************/
    //TCP模块
    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        if ('JNLNUM' == DataName) {
            var arrDataValue = DataValue;
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
        return CallResponse("OnLine");
    }

    function onDatSetPersistentDataComplete(DataName) {
        if ('JNLNUM' == DataName) {
            top.API.Tcp.CompositionData(arrTransType);
        }
    }

    function onDatSetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("DatSetPersistentDataError");
        return CallResponse("OnLine");
    }

    /********************************************************************************************************/
    //TCP模块
    function onCompositionDataCompleted(arrData) {
        top.API.displayMessage("onCompositionDataCompleted is done" );
        var objArrData = arrData;
        var HexMasterKey = top.stringToHex(arrData);
        top.API.Pin.GenerateMAC(HexMasterKey, "MACKEY", '', 0, 0);
    }

    function onCompositionDataFail() {
        top.API.displayMessage("onCompositionDataFail is done");
        Files.ErrorMsg("通讯失败，交易结束");
        if (nCwcTimes < 3) {
            return CallResponse("OnLine");
        } else {
            //App.Timer.SetIntervalDisposal(CWC, 60000);
        }
    }

    function onMACGenerated(MacData) {
        top.API.displayMessage("onMACGenerated is done, MacData =" + MacData);
        var HexMasterKey = top.stringToHex(MacData);
        var objMacData = MacData;        
        top.API.Tcp.SendToHost(HexMasterKey, 60000);
    }

    function WriteJnl(ReCode) {
        var strTranType;
        if (nTranType == 1) {
            strTranType = "取款冲正";
        } else {
            if (top.API.NoCardDeal) {
                strTranType = "无卡存款重发";
            } else {
                strTranType = "存款重发";
            }
        }
        var arrCashOutBoxData = "流水号：" + JnlNum + "，报文返回码:" + ReCode;
        top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, [strTranType]);
        top.API.Jnl.PrintSync("Content");
        top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, [arrCashOutBoxData]);
        top.API.Jnl.PrintSync("Content");
    }

    function Print() {
        var sTranRet;
        var comment;
        if (RetCode == "00") {
            sTranRet = "TRANSUCCESS";
            if (nTranType == 1) {
                comment = "冲正成功"
            } else {
                if (top.API.NoCardDeal) {
                    comment = "无卡存款重发成功";
                } else {
                    comment = "存款重发成功";
                }
            }
        } else {
            sTranRet = "TRANFAIL";
            if (nTranType == 1) {
                comment = "冲正失败"
            } else {
                if (top.API.NoCardDeal) {
                    comment = "无卡存款重发失败";
                } else {
                    comment = "存款重发失败";
                }
            }
        }
        top.API.Dat.SetDataSync("TRANSACTIONRESULT", "STRING", [sTranRet]);
        top.API.Dat.SetDataSync('COMMENTS', 'STRING', [comment]);
        top.API.Ptr.Print("ReceiptCash_Print_szABC", "", top.API.gPrintTimeOut);
    }

    function onTcpOnRecved(tmpCheck) {
        RetCode = tmpCheck;
        WriteJnl(tmpCheck);
        top.API.displayMessage("onTcpOnRecved is done,CheckCode:" + tmpCheck);
        switch (tmpCheck) {
            case '00':
                return CallResponse("OnLine");
                break;
            default:
                if (nCwcTimes < 3) {                    
                    //App.Timer.SetIntervalDisposal(CWC, 60000);
                } else {
                    return CallResponse("OnLine");
                }
                break;
        }
    }

    function onTcpSendFailed() {
        top.API.displayMessage("onTcpSendFailed is done");
        if (nCwcTimes < 3) {
            //App.Timer.SetIntervalDisposal(CWC, 60000);
        } else {
            return CallResponse("OnLine");
        }
    }

    function onTcpTimeout() {
        top.API.displayMessage("onTcpTimeout is done,arrTransType=" + arrTransType);
        if (nCwcTimes < 3) {
            //App.Timer.SetIntervalDisposal(CWC, 60000);
        } else {
            return CallResponse("OnLine");
        }
    }

    function onAnalysisFailed() {
        top.API.displayMessage("onAnalysisFailed is done");
        if (nCwcTimes < 3) {
            //App.Timer.SetIntervalDisposal(CWC, 60000);
        } else {
            return CallResponse("OnLine");
        }
    }

    //event handler
    function onDeviceError() {
        top.API.displayMessage('键盘触发事件：onDeviceError()');
        if (nCwcTimes < 3) {
            //App.Timer.SetIntervalDisposal(CWC, 60000);
        } else {
            return CallResponse("OnLine");
        }
    }

    //event handler
    function onCryptFailed() {
        top.API.displayMessage('键盘加解密失败：onCryptFailed');
        if (nCwcTimes < 3) {
            //App.Timer.SetIntervalDisposal(CWC, 60000);
        } else {
            return CallResponse("OnLine");
        }
    }

    function EventLogin() { 
        top.API.Sys.addEvent('ServiceOpened', onServiceOpened);
        top.API.Sys.addEvent('NetChangeOnline', onNetChangeOnline);

        top.API.Tcp.addEvent("SendFailed", onTcpSendFailed);
        top.API.Tcp.addEvent("OnRecved", onTcpOnRecved);
        top.API.Tcp.addEvent("CompositionDataCompleted", onCompositionDataCompleted);
        top.API.Tcp.addEvent("CompositionDataFail", onCompositionDataFail);
        top.API.Tcp.addEvent("Timeout", onTcpTimeout);
        top.API.Tcp.addEvent("AnalysisFailed", onAnalysisFailed);

        top.API.Pin.addEvent("MACGenerated", onMACGenerated);
        top.API.Pin.addEvent("CryptFailed", onCryptFailed);

        top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.addEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.addEvent("SetPersistentDataError", onDatSetPersistentDataError);
    }

    function EventLogout() {
        top.API.Sys.removeEvent('ServiceOpened', onServiceOpened);
        top.API.Sys.removeEvent('NetChangeOnline', onNetChangeOnline);

        top.API.Tcp.removeEvent("SendFailed", onTcpSendFailed);
        top.API.Tcp.removeEvent("OnRecved", onTcpOnRecved);
        top.API.Tcp.removeEvent("CompositionDataCompleted", onCompositionDataCompleted);
        top.API.Tcp.removeEvent("CompositionDataFail", onCompositionDataFail);
        top.API.Tcp.removeEvent("Timeout", onTcpTimeout);
        top.API.Tcp.removeEvent("AnalysisFailed", onAnalysisFailed);

        top.API.Pin.removeEvent("MACGenerated", onMACGenerated);
        top.API.Pin.removeEvent("CryptFailed", onCryptFailed);

        top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.removeEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.removeEvent("SetPersistentDataError", onDatSetPersistentDataError);
    }

    //Countdown function
    function TimeoutCallBack() {

        return CallResponse('TimeOut');
    }
    //Page Return

    //remove all event handler
    function Clearup(){
        //TO DO:
        EventLogout();
        if (timeID > 0) {
            window.clearInterval(timeID);
        }
        top.API.Dat.InitDatasSync();
        top.API.clearGlobalData();//初始化全局变量
        App.Timer.ClearIntervalTime();
        //App.Timer.ClearTime();
    }
})();
