/*@create by:  tsxiong
 *@time: 2016年03月20日
 */
;(function () {
    var bSPL1 = false,
        arrTransType = "",
        Files = new dynamicLoadFiles(),
        CallResponse = App.Cntl.ProcessOnce(function (Response) {
            //TO DO:
            Clearup();
            //Entry the flows control process.
            App.Cntl.ProcessDriven(Response);
        });
    var Initialize = function () {
        //@initialize scope start
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        top.API.gShowPrintButton = true;
        App.Plugin.Voices.play("voi_36");
        top.API.gbOrderCWD = false;
        EventLogin();
        ButtonDisable();        
        top.API.Sys.ItemClearSync(top.API.MTRN_TRANSACTIONDIFFER);
        InitTSLData();
        ButtonEnable();
        BtnsContorl();        
        // 1 为本行本省，2 为本行外省，3 为它行卡，4 为本行贷记卡，5 本省绿卡通，
        // 6 外省绿卡通，7 本省绿卡通副卡，8 外省绿卡通副卡, 0 本省存折，9 外省存折
    }(); //Page Entry


    function ButtonDisable() {
        document.getElementById('DEP').disabled = true;
        document.getElementById('changePassword').disabled = true;
        document.getElementById('CWD').disabled = true;
        //document.getElementById('OrderCWD').disabled = true;
        document.getElementById('INQ').disabled = true;
        //document.getElementById('Exit').disabled = true;
        document.getElementById('Transfer').disabled = true;
        document.getElementById('PageRoot').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('DEP').disabled = false;
        document.getElementById('changePassword').disabled = false;
        document.getElementById('CWD').disabled = false;
        //document.getElementById('OrderCWD').disabled = false;
        document.getElementById('INQ').disabled = false;
        //document.getElementById('Exit').disabled = false;
        document.getElementById('Transfer').disabled = false;
        document.getElementById('PageRoot').disabled = false;
    }

    function InitTSLData() {
        top.API.gTslChooseType = ""; //交易类型
        top.API.gTslJnlNum = ""; //流水号
        top.API.gTslMoneyCount = ""; //金额
        top.API.gTslResult = "FAIL"; //交易结果 默认为失败。
        top.API.gTslDate = "";
        top.API.gTslTime = "";
        top.API.gTslFlag = false;
        top.API.gTslSysrefnum = "";
        top.API.gTslChooseJnlType = ""; //电子流水交易类型，0107代表存款，0108代表取款
        top.API.gTslSysrefnum = ""; //后台返回流水号
        top.API.gTslJnlBtn = "";//设备流水批次号
        top.API.gTslFailType = ""; //异常状态类型（4位）
        top.API.gTslResponsecode = "";
        top.API.gMixSelfCWD = false;//自配取款标志位初始化
    }

    function BtnsContorl() {
        var sTransType = top.API.gSupportTransType;
        top.API.displayMessage("SUPPORTTRANSTYPE = " + sTransType);
        var nCount = 0;

        var sTranSupport = sTransType.substr(nCount, 1);
        if (sTranSupport == "0") {
            $('#INQ').addClass('unsupported');//查询按钮变灰
            $("#INQ").attr("disabled", true);
            $('#INQb').addClass('unsupported');
        }
        nCount++;
        sTranSupport = sTransType.substr(nCount, 1);
        if (sTranSupport == "0" || !top.API.gbCARDCWD_DEAL) {
            $('#CWD').addClass('unsupported');//取款按钮变灰
            $("#CWD").attr("disabled", true);
            $('#CWDb').addClass('unsupported');
        }
        nCount++;
        sTranSupport = sTransType.substr(nCount, 1);
        if (sTranSupport == "0") {
            $('#Transfer').addClass('unsupported');//转账按钮变灰
            $("#Transfer").attr("disabled", true);
        }
        nCount++;
        sTranSupport = sTransType.substr(nCount, 1);
        if (sTranSupport == "0") {
            $('#changePassword').addClass('unsupported');//改密按钮变灰
            $("#changePassword").attr("disabled", true);
        }
        nCount++;
        sTranSupport = sTransType.substr(nCount, 1);
        if (sTranSupport == "0" || !top.API.gbCARDDEP_DEAL) {
            $('#DEP').addClass('unsupported');//存款按钮变灰
            $("#DEP").attr("disabled", true);
            $('#DEPb').addClass('unsupported');
        }        
    }

    document.getElementById("changePassword").onclick = function () {
        ButtonDisable();
        top.API.gTranType = "changePassword";
        top.API.CashInfo.Dealtype = "PWD改密";
        var arrDealType = new Array(top.API.CashInfo.Dealtype);
        top.API.Dat.SetDataSync(top.API.dealtypeTag, top.API.dealtypeType, arrDealType);
        //top.API.Jnl.PrintSync("SelectDEP");
        // top.API.CashInfo.Dealtype = "DEP存款";
        // var arrDealType = new Array(top.API.CashInfo.Dealtype);
        // top.API.Dat.SetDataSync(top.API.dealtypeTag, top.API.dealtypeType, arrDealType);
        // top.API.Sys.DataSetSync(top.API.MTRN_TRANSACTIONDIFFER, top.API.MTRN_DEPOSIT_CARD);
        //top.API.gTransactiontype = "DEP";
        top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["选择改密交易"]);
        top.API.Jnl.PrintSync("Content");
        return CallResponse("ChangePassword");
    };
    document.getElementById("PageRoot").onclick = function () {
        ButtonDisable();
        return CallResponse("Back");
    };
    document.getElementById("Transfer").onclick = function () {
        ButtonDisable();
        top.API.CashInfo.Dealtype = "Transfer转账";
        var arrDealType = new Array(top.API.CashInfo.Dealtype);
        top.API.Dat.SetDataSync(top.API.dealtypeTag, top.API.dealtypeType, arrDealType);
        top.API.gTranType = 'Transfer';

	top.API.Jnl.PrintSync("selectTransfer");

        top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["选择转账交易"]);
        top.API.Jnl.PrintSync("Content");
        return CallResponse("Transfer");
    };
    document.getElementById("DEP").onclick = function () {
        ButtonDisable();
        top.API.Jnl.PrintSync("SelectDEP");
        top.API.CashInfo.Dealtype = "DEP存款";
        top.API.gTranType = 'DEP';
        top.API.Dat.SetDataSync("DEPFLAG", "STRING", ["1"]);//卡存款48域为1，取款回存为2
        var arrDealType = new Array(top.API.CashInfo.Dealtype);
        top.API.Dat.SetDataSync(top.API.dealtypeTag, top.API.dealtypeType, arrDealType);

        top.API.Sys.DataSetSync(top.API.MTRN_TRANSACTIONDIFFER, top.API.MTRN_DEPOSIT_CARD);
        top.API.gTransactiontype = "DEP";

        //设置小额存款限额为50000，数据可以改变
        var lRetBigTranLimit = 50000;
        var arrTransactionResult = new Array(lRetBigTranLimit.toString());
        top.API.gChooseMoney = lRetBigTranLimit;
        top.API.Dat.SetDataSync("CASHINMAXAMOUNT", "STRING", arrTransactionResult);
        top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["选择存款交易"]);
        top.API.Jnl.PrintSync("Content");
        return CallResponse("DEP");
    };

    document.getElementById("CWD").onclick = function () {
        ButtonDisable();
        top.API.Jnl.PrintSync("SelectCARDCWD");
        top.API.CashInfo.Dealtype = "CWD取款";
        //top.API.gTransactiontype = "QRYCWDMONEY";
        top.API.gTranType = 'CWD';
        top.API.Dat.SetDataSync("QRYCWDMONEYFLAG", "STRING", ["2"]);//借记卡、存折累计取款为"2"
        var arrDealType = new Array(top.API.CashInfo.Dealtype);
        top.API.Dat.SetDataSync(top.API.dealtypeTag, top.API.dealtypeType, arrDealType);
        top.API.Sys.DataSetSync(top.API.MTRN_TRANSACTIONDIFFER, top.API.MTRN_WITHDRAW_CARD);
        top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["选择取款交易"]);
        top.API.Jnl.PrintSync("Content");
        if (top.API.gbContinueTransFlag === true) {
            return CallResponse("CWDcontinue");
        } else {
            return CallResponse("CWD");
            //CWD();
        }
    };


    document.getElementById("INQ").onclick = function () {
        ButtonDisable();
        top.API.Jnl.PrintSync("SelectINQ");
	    top.API.gTranType = 'INQ';
        top.API.CashInfo.Dealtype = "INQ";
        var arrDealType = new Array(top.API.CashInfo.Dealtype);
        top.API.Dat.SetDataSync(top.API.dealtypeTag, top.API.dealtypeType, arrDealType);
        var arrTRANSACTIONTYPE = new Array("INQ");
        top.API.gTransactiontype = "INQ";
        //余额查询
        var arrBalanceInquiryType = new Array("NOTYPE");
        top.API.Dat.SetDataSync(top.API.BalanceInquiryTag, top.API.BalanceInquiryType, arrBalanceInquiryType);
        top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["选择查询交易"]);
        top.API.Jnl.PrintSync("Content");
        return CallResponse("INQ");
    };

    function CWD() {
        arrTransType = "QRYCWDMONEY";
        Files.showNetworkMsg("交易处理中,请稍候...");
        top.API.displayMessage("Start 获取流水号" + arrTransType);
        var nRet1 = top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);
    }

    /***验密****/
    //组包
    function onCompositionDataCompleted(arrData) {
        top.API.displayMessage("onCompositionDataCompleted is done, arrData =" + arrData);
        var objArrData = arrData;
        var HexMasterKey = top.stringToHex(arrData);
        top.API.Pin.GenerateMAC(HexMasterKey, "MACKEY", '', 0,0);
    }

    function onCompositionDataFail() {
        top.API.displayMessage("onCompositionDataFail is done");
        Files.ErrorMsg("通讯失败，交易结束");
        //WriteAcctFileAfterTCP("AT", ""); //add by art for 写交易记录文件
        //bNextPageFlag = false;
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }

    function onMACGenerated(MacData) {
        top.API.displayMessage("onMACGenerated is done, MacData =" + MacData);
        var HexMasterKey = top.stringToHex(MacData);
        var objMacData = MacData;
        top.API.Tcp.SendToHost(HexMasterKey, 60000);
    }

    function onTcpOnRecved(tmpCheck) {
       top.API.displayMessage("onTcpOnRecved is done,CheckCode:" + tmpCheck);
        switch (tmpCheck) {
            case '00':
                top.API.displayMessage("gTransactiontype is " + top.API.gTransactiontype);
                if (arrTransType == "QRYCWDMONEY") {
                    var objGet3 = top.API.Dat.GetDataSync("QRYCWDMONEY", "STRING");
                    if (null == objGet3) {
                        top.API.displayMessage("GetDataSync QRYCWDMONEY objGet = null");
                    } else {
                        // if( top.API.CWDType == "passbook" ){
                        //     var tmpResponse = objGet3.toArray()[0];
                        //     var noPassbookCWDMoney = 200000; //当日累计金额写死
                        //     if (parseInt(tmpResponse) < noPassbookCWDMoney) {
                        //         top.API.noPassbookCWDMoney = parseInt(tmpResponse);
                        //         bSuccess = true;
                        //         strErrMsg = "交易成功";
                        //     } else {
                        //         bNextPageFlag = false;
                        //         strErrMsg = "个人客户累计无折存款限额为20万，您当日已存金额已达20万，请向网点咨询。";
                        //     }
                        // }else{
                            var tmpResponse = objGet3[0];
                            var CWDMoney = 200000;//当日累计金额写死
                            if (parseInt(tmpResponse) < CWDMoney || top.API.gbOrderCWD == true) {
                                top.API.gnCWDMoney = parseInt(tmpResponse);
                                return CallResponse("CWD");
                            } else {
                                Files.ErrorMsg("个人客户累计取款限额为20万，您当日已取金额已达20万，请向网点预约取款。");
                                setTimeout(function () {
                                    return CallResponse("Exit");
                                }, 4000);
                            }
                        // }
                    }
                }
                break;
            default:
                //strErrMsg = "交易失败"; //"½»Ò×Òì³£";
                //PrintJnl("交易失败", "CODE=" + arrTransType);
                //return CallResponse("Failed");
                return CallResponse("Exit");
                break;
        }
        ;
    }

    /********************************************************************************************************/
    //TCP模块
    function onTcpSendFailed() {
        top.API.displayMessage("onTcpSendFailed is done");
        //strErrMsg = "通讯失败，交易结束";
        //WriteAcctFileAfterTCP("AT", ""); //add by art for 写交易记录文件
        //bNextPageFlag = false;
        //TradeCompleted();
        Files.ErrorMsg("通讯失败，交易结束");
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }

    function onTcpTimeout() {
        top.API.displayMessage("onTcpTimeout is done,arrTransType=" + arrTransType);
        Files.ErrorMsg("通讯超时，交易结束");
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }

    function onAnalysisFailed() {
        top.API.displayMessage("onAnalysisFailed is done");
        Files.ErrorMsg("报文解析失败，交易结束");
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }

    //event handler
    function onDeviceError() {
        top.API.displayMessage('键盘触发事件：onDeviceError()');
        top.ErrorMsg("通讯失败，交易结束");
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);

    }

    //event handler
    function onCryptFailed() {
        top.API.displayMessage('键盘加解密失败：onCryptFailed');
        Files.ErrorMsg("键盘加解密失败，交易结束");
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }

    /********************************************************************************************************/
    //永久数据模块
    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        var arrDataValue = DataValue;
        if ('JNLNUM' == DataName) {
            JnlNum = arrDataValue[0] + 1;
            if (JnlNum.toString().length === 7) {
                JnlNum = 0;
            }
            //设置交易流水号
            var arrJnlNum = new Array();
            arrJnlNum[0] = JnlNum;
            var nRet1 = top.API.Dat.SetPersistentData(top.API.jnlnumTag, top.API.jnlnumType, arrJnlNum);
        }
    }

    function onDatGetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("DatGetPersistentDataError" + DataName + ",ErrorCode=" + ErrorCode);
        Files.ErrorMsg("组包失败，交易结束");
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }

    function onDatSetPersistentDataComplete(DataName) {
        if ('JNLNUM' == DataName) {
            top.API.Tcp.CompositionData(arrTransType);
        }
    }

    function onDatSetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatSetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        Files.ErrorMsg("组包失败，交易结束");
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }

    /**验密结束*/


    function onGetPinCancelled() {
        top.API.displayMessage("键盘点击取消按键GetPinCancelled");
        top.ErrorInfo = top.API.PromptList.No2;
        return CallResponse("Exit");
    }

    function onDeviceError() {
        top.API.displayMessage(top.API.PromptList.No4);
        top.ErrorInfo = top.API.PromptList.No4;
        return CallResponse("Exit");
    }

    //Register the event
    function EventLogin() {
        top.API.Tcp.addEvent("SendFailed", onTcpSendFailed);
        top.API.Tcp.addEvent("OnRecved", onTcpOnRecved);
        top.API.Tcp.addEvent("CompositionDataCompleted", onCompositionDataCompleted);
        top.API.Tcp.addEvent("CompositionDataFail", onCompositionDataFail);
        top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.addEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.addEvent("SetPersistentDataError", onDatSetPersistentDataError);
        top.API.Pin.addEvent("MACGenerated", onMACGenerated);
        top.API.Tcp.addEvent("Timeout", onTcpTimeout);
        top.API.Tcp.addEvent("AnalysisFailed", onAnalysisFailed);
        top.API.Pin.addEvent("CryptFailed", onCryptFailed);
    }

    function EventLogout() {
        top.API.Tcp.removeEvent("SendFailed", onTcpSendFailed);
        top.API.Tcp.removeEvent("OnRecved", onTcpOnRecved);
        top.API.Tcp.removeEvent("CompositionDataCompleted", onCompositionDataCompleted);
        top.API.Tcp.removeEvent("CompositionDataFail", onCompositionDataFail);
        top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.removeEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.removeEvent("SetPersistentDataError", onDatSetPersistentDataError);
        top.API.Pin.removeEvent("MACGenerated", onMACGenerated);
        top.API.Tcp.removeEvent("Timeout", onTcpTimeout);
        top.API.Tcp.removeEvent("AnalysisFailed", onAnalysisFailed);
        top.API.Pin.removeEvent("CryptFailed", onCryptFailed);
    }

    //@User code scope end
    function TimeoutCallBack() {
        top.API.Jnl.PrintSync("PageTimeOut");
        top.ErrorInfo = top.API.PromptList.No3;
        return CallResponse('TimeOut');
    }

    //Register the event
    //Page Return


    //remove all event handler
    function Clearup() {
        EventLogout();
        App.Timer.ClearTime();
        App.Plugin.Voices.del();
        //TO DO:
    }
})();
