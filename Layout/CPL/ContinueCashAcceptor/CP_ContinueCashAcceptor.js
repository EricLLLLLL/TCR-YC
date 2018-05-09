/*@create by:  tsxiong
 *@time: 2016年03月20日
 */
;(function () {
    var bCheckMoney = false,
        strCallResponse = "",
        Files = new dynamicLoadFiles(),
        nLastAcceptedAmount = -1,
        bError = false,
        CallResponse = App.Cntl.ProcessOnce(function (Response) {
            //TO DO:
            Clearup();
            App.Cntl.ProcessDriven(Response);
        });

    var Initialize = function () {
        ButtonDisable();
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        EventLogin();
        top.API.Cim.PrepareForAcceptCash();
        App.Plugin.Voices.play("voi_6");
    }();//Page Entry

    //@User ocde scope start
    function ButtonDisable() {
        document.getElementById('Back').disabled = true;
        document.getElementById('Exit').disabled = true;
        document.getElementById('OK').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Back').disabled = false;
        document.getElementById('Exit').disabled = false;
        document.getElementById('OK').disabled = false;
    }

    document.getElementById('OK').onclick = function () {
        ButtonDisable();
        var tmp = top.API.Cim.StInputStatus();
        if (tmp == "EMPTY") {
            ButtonEnable();
            //汉字提示
            App.Plugin.Voices.play("voi_46");
        } else {
            //nextPage("OK");
            checkMoney();
            //return CallResponse('OK');
        }
    };

    document.getElementById('Exit').onclick = function () {
        ButtonDisable();
        top.ErrorInfo = top.API.PromptList.No2;
        top.API.Cim.StoreEscrowedCash(top.API.gStoreEscrowedCashTimeOut);
        return CallResponse('Exit');
    };

    document.getElementById('Back').onclick = function () {
        ButtonDisable();
        top.ErrorInfo = top.API.PromptList.No2;
        top.API.Cim.StoreEscrowedCash(top.API.gStoreEscrowedCashTimeOut);
        return CallResponse('Back');
    };
    //@User code scope end

    /**
     * 验钞逻辑函数
     * */
    function checkMoney() {
        //激活验钞标志位，准备区分后期页面跳转
        bCheckMoney = true;

        //清除放钞的语音，超时
        App.Plugin.Voices.del();
        App.Timer.ClearTime();

        //隐藏按钮
        $("#btnWrap").hide();

        //显示正在的弹框
        Files.showNetworkMsg("正在进行验钞，请稍后···");

        //重新设置超时
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        top.API.Cim.AcceptCash(-1);
        App.Plugin.Voices.play("voi_16");
    }

    /********************************************************************************************************/
    //CIM模块
    function onDeviceError() {
        top.API.displayMessage("onDeviceError触发");
        top.ErrorInfo = top.API.PromptList.No4;
        return CallResponse('Exit');
    }

    function onAcceptCashPrepared() {
        top.API.displayMessage("onAcceptCashPrepared");
        top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);
    }

    function onAcceptCashAlreadyActive() {
        top.API.displayMessage("onAcceptCashAlreadyActive");
        top.ErrorInfo = top.API.PromptList.No4;
        top.API.Cim.StoreEscrowedCash(top.API.gStoreEscrowedCashTimeOut);
        return CallResponse('Exit');
    }

    function onAcceptCashPrepareFailed() {
        top.API.displayMessage("onAcceptCashPrepareFailed");
        top.ErrorInfo = top.API.PromptList.No4;
        return CallResponse('Exit');
    }

    /********************************************************************************************************/
    //永久数据模块
    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        var arrDataValue = DataValue.toArray();
        var JnlNum = 0;
        if ('JNLNUM' == DataName) {
            JnlNum = arrDataValue[0] + 1;
            if (JnlNum.toString().length === 7) {
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
        top.ErrorInfo = top.API.PromptList.No4;
        return CallResponse('Exit');
    }

    function onDatSetPersistentDataComplete(DataName) {
        ButtonEnable();
        //top.API.displayMessage("onDatSetPersistentDataComplete is done,DataName=" + DataName);
    }

    function onDatSetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatSetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        top.ErrorInfo = top.API.PromptList.No4;
        return CallResponse('Exit');
    }


    /**吸钞事件开始**/


    function NextPage() {
        if (strCallResponse == "") {
            top.API.displayMessage("strCallResponse为空");
            return 0;
        }
        Clearup();
        if (bError) {
            top.API.Cim.StoreEscrowedCash(top.API.gStoreEscrowedCashTimeOut);
        }
        return CallResponse(strCallResponse);
    }

    function onCashInserted() {
        top.API.displayMessage("开始吸钞");
    }

    function SetCurrencyCashIn(TotalItems) {
        var i = 0;
        var strDenomination = new Array();
        for (i = 0; i < TotalItems.toArray().length; i++) {
            strDenomination = TotalItems.toArray()[i].split(":");
            if (strDenomination[0] == "0") {
                break;
            }
            if (strDenomination[0] == "100") {
                top.API.CashInfo.arrCurrencyCashIn[0] = strDenomination[1];
            }
            if (strDenomination[0] == "50") {
                top.API.CashInfo.arrCurrencyCashIn[1] = strDenomination[1];
            }
            if (strDenomination[0] == "20") {
                top.API.CashInfo.arrCurrencyCashIn[2] = strDenomination[1];
            }
            if (strDenomination[0] == "10") {
                top.API.CashInfo.arrCurrencyCashIn[3] = strDenomination[1];
            }
            if (strDenomination[0] == "5") {
                top.API.CashInfo.arrCurrencyCashIn[4] = strDenomination[1];
            }
            if (strDenomination[0] == "1") {
                top.API.CashInfo.arrCurrencyCashIn[5] = strDenomination[1];
            }
        }
        return;
    }

    function ReCordFile() {
        var nAllRefusedNum = top.API.Cim.NumOfRefused();
        var nThisTimeRefusedNum = nAllRefusedNum - top.API.gOldCimRefusedNums;
        top.API.gOldCimRefusedNums = nAllRefusedNum;

        var Lcount = top.API.gLcount;
        top.API.displayMessage(" 验钞次数==" + Lcount);
        var bRecordFile = true;
        if ((Lcount == 1) && (nLastAcceptedAmount == 0)) {
            bRecordFile = false;
        }

        if (Lcount == 1) {
            if (bRecordFile) {
                top.API.Tsl.HandleRecordFileSync(top.API.MTSL_WRITETRANSRECORD, top.API.gCardno
                    + ", DEP, " + top.API.CashInfo.strTransAmount
                    + ", " + top.API.CashInfo.strTransAmount + ", , ");
                var strJNLData = "第" + Lcount + "次放钞：100:" +
                    top.API.CashInfo.arrCurrencyCashIn[0] + " 50:" +
                    top.API.CashInfo.arrCurrencyCashIn[1] + " 20:" +
                    top.API.CashInfo.arrCurrencyCashIn[2] + " 10:" +
                    top.API.CashInfo.arrCurrencyCashIn[3] + " 5:" +
                    top.API.CashInfo.arrCurrencyCashIn[4] + " 1:" +
                    top.API.CashInfo.arrCurrencyCashIn[5] + " RJ:" +
                    nThisTimeRefusedNum;
                var arrCashOutBoxData = new Array(strJNLData);
                top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, arrCashOutBoxData);
                top.API.Jnl.PrintSync("Content");
            }
        } else {
            var TotalItemsArr = new Array(0, 0, 0, 0, 0, 0);
            var i = 0;
            for (i = 0; i < top.API.garrTotalItems.length; i++) {
                TotalItemsArr[i] = parseInt(top.API.CashInfo.arrCurrencyCashIn[i]) - top.API.garrTotalItems[i];
            }
            top.API.Tsl.UpdateRecord(top.API.gCardno + ", DEP, " + top.API.CashInfo.strTransAmount + ", "
                + top.API.CashInfo.strTransAmount + ", , ");
            top.API.displayMessage("当前(不是第一次)放钞信息：---Tcount100=" + TotalItemsArr[0] + "---Tcount50=" +
                TotalItemsArr[1] + "---Tcount20=" + TotalItemsArr[2] + "---Tcount10=" +
                TotalItemsArr[3] + "---Tcount5=" + TotalItemsArr[4] + "---Tcount1=" +
                TotalItemsArr[5] + "---RJNum=" + nThisTimeRefusedNum + "---");
            var strJNLData = "第" + Lcount + "次放钞：100:" + TotalItemsArr[0] + " 50:" +
                TotalItemsArr[1] + " 20:" + TotalItemsArr[2] + " 10:" + TotalItemsArr[3] + " 5:" + TotalItemsArr[4] +
                " 1:" + TotalItemsArr[5] + " RJ:" + nThisTimeRefusedNum;
            var arrCashOutBoxData = new Array(strJNLData);
            top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, arrCashOutBoxData);
            top.API.Jnl.PrintSync("Content");
        }
        if (bRecordFile) {
            for (i = 0; i < top.API.garrTotalItems.length; i++) {
                top.API.garrTotalItems[i] = parseInt(top.API.CashInfo.arrCurrencyCashIn[i]);
            }
            top.API.gLcount = Lcount + 1;
        }
    }

    function SetComments() {
        var arrTransactionResult = new Array("失败");
        top.API.Dat.SetDataSync("TRANSACTIONRESULT", "STRING", arrTransactionResult);
        top.API.gTakeCardAndPrint = true; //退卡页面打印凭条
        var arrComments = new Array("设备故障，请联系银行工作人员");
        top.API.Dat.SetDataSync("COMMENTS", "STRING", arrComments);
    }

    function onCashAccepted(TotalItems, PartRefused) {
        top.API.displayMessage("存入钞箱信息：" + TotalItems.toArray() + "; 是否有拒钞：" + PartRefused);
        var Lcount = top.API.gLcount;
        top.API.displayMessage(" 验钞次数==" + Lcount);
        nLastAcceptedAmount = top.API.Cim.GetLastAcceptedAmountSync("CNY", "VALID");
        if (nLastAcceptedAmount < 0) {
            top.API.displayMessage("top.API.Cim.GetLastAcceptedAmountSync异常，top.API.Cim.GetLastAcceptedAmountSync = " + nLastAcceptedAmount);
            top.API.Cim.StoreEscrowedCash(top.API.gStoreEscrowedCashTimeOut);
            top.ErrorInfo = top.API.PromptList.No4;
            SetComments();
            if (Lcount == 1) {
                top.API.Tsl.HandleRecordFileSync(top.API.MTSL_WRITETRANSRECORD, top.API.gCardno + ", DEP, 0, 0, , SF");
            } else {
                top.API.Tsl.UpdateRecord(top.API.gCardno + ", DEP, 0, 0, , SF");
            }
            strCallResponse = "Exit";
            //return CallResponse("Exit");
        }
        top.API.CashInfo.strTransAmount = nLastAcceptedAmount.toString();
        var tmp = top.API.CashInfo.strTransAmount + "00";
        var arrCashAmount = new Array(tmp);
        top.API.Dat.SetDataSync(top.API.transamountTag, top.API.transamountType, arrCashAmount);
        SetCurrencyCashIn(TotalItems);
        ReCordFile();

        var cimStatus = top.API.Cim.StDetailedDeviceStatus();
        var DoorStatus = top.API.Cim.StSafeDoorStatus();
        top.API.gbPartCashIn = (cimStatus == "HARDWAREERROR" || cimStatus == "OFFLINE" || DoorStatus == "OPEN");
        if (top.API.gbPartCashIn) { //验钞时卡钞
            ErrorSituation();
        } else {
            strCallResponse = "OK";
        }
        top.API.displayMessage("出钞口状态：" + top.API.Cdm.StOutputStatus() + ";是否有拒钞：" + PartRefused);
        if (top.API.Cdm.StOutputStatus() == "NOTEMPTY" && PartRefused) {
            top.API.Cdm.OpenShutter(top.API.gOpenShutterTimeOut);
        } else if (top.API.Cdm.StOutputStatus() == "EMPTY" && PartRefused) {
            top.API.Cdm.OpenShutter(top.API.gOpenShutterTimeOut);
            setTimeout(function () {
                top.API.Cdm.CloseShutter(top.API.gCloseShutterTimeOut);
            }, 10000);
        } else {
            return NextPage();
        }
    }

    function ErrorSituation() {
        bError = true;
        strCallResponse = "CashSeizing";

        ////存款卡钞是否上账
        // top.API.Jnl.PrintSync("CashInError");
        // var iniRet = top.API.Dat.GetPrivateProfileSync("TransactionConfig", "PartCashSaveSupport", "1", top.API.gIniFileName);
        // if( "1" == iniRet){
        //     top.API.displayMessage("交易金额："+ top.API.CashInfo.strTransAmount);
        //     if(parseInt(top.API.CashInfo.strTransAmount) > 0){
        //         if (top.API.CashInfo.Dealtype == "DEP存款"){
        //             top.API.gTransactiontype = "DEP";
        //         }else if(top.API.CashInfo.Dealtype == "无卡无折存款" || top.API.CashInfo.Dealtype == "存折存款"){
        //             top.API.gTransactiontype = "NOCARDDEP";
        //             if (top.API.gCardOrBookBank == 1) {
        //                 top.API.gTransactiontype = "DEP";
        //             }
        //         }else if(top.API.CashInfo.Dealtype == "对公存款"){
        //             top.API.gTransactiontype = "BUSSINESSDEP";
        //         }
        //         strCallResponse = "DirectAccount";
        //     }else{
        //         top.ErrorInfo = top.API.PromptList.No4;
        //         SetComments();
        //         strCallResponse = "Exit";
        //     }
        // }else{
        //     top.ErrorInfo = top.API.PromptList.No4;
        //     SetComments();
        //     strCallResponse = "Exit";
        // }
    }

    function VoicesPlay() {
        App.Plugin.Voices.play("voi_7");
    }

    function onCashTaken() {
        App.Timer.ClearIntervalTime();
        top.API.Cdm.CloseShutter(top.API.gCloseShutterTimeOut);
    }

    function onDeviceError() {
        top.API.displayMessage("onDeviceError触发");
        ErrorSituation();
        NextPage();
    }

    function onShutterOpened() {
        top.API.displayMessage("onShutterOpened触发,提示客户拿走钞票");
        App.Timer.SetIntervalDisposal(VoicesPlay, 12000);
    }

    function onShutterClosed() {
        top.API.displayMessage("onShutterClosed触发");
        NextPage();
    }

    function onShutterOpenFailed() {
        top.API.displayMessage("onShutterOpenFailed触发");
        ErrorSituation();
        NextPage();
    }

    function onShutterCloseFailed() {
        top.API.displayMessage("onShutterCloseFailed触发");
        ErrorSituation();
        NextPage();
    }

    function SetJnl() {
        var i;
        var tmpCurrentInfo = new Array();
        for (i = 0; i < top.API.CashInfo.nCountOfUnits; i++) {
            tmpCurrentInfo[i] = top.API.CashInfo.arrUnitRemain[i];
        }
        top.API.CashInfo.arrUnitRemain = top.API.GetUnitInfo(top.API.Cdm.PUCurrentCount().toArray());
        for (i = 0; i < top.API.CashInfo.nCountOfUnits; i++) {
            top.API.CashInfo.arrAcceptorCount[i] += (tmpCurrentInfo[i] > top.API.CashInfo.arrUnitRemain[i]) ? (tmpCurrentInfo[i] - top.API.CashInfo.arrUnitRemain[i]) : (top.API.CashInfo.arrUnitRemain[i] - tmpCurrentInfo[i]);
        }
    }

    /***吸钞结束***/

    //Register the event
    function EventLogin() {
        top.API.Cim.addEvent('DeviceError', onDeviceError);

        //放钞事件
        top.API.Cim.addEvent('AcceptCashPrepared', onAcceptCashPrepared);
        top.API.Cim.addEvent('AcceptCashAlreadyActive', onAcceptCashAlreadyActive);
        top.API.Cim.addEvent('AcceptCashPrepareFailed', onAcceptCashPrepareFailed);

        //验钞事件
        top.API.Cim.addEvent('CashInserted', onCashInserted);
        top.API.Cim.addEvent('CashAccepted', onCashAccepted);
        top.API.Cim.addEvent('CashTaken', onCashTaken);

        //钞门
        top.API.Cdm.addEvent('ShutterOpened', onShutterOpened);
        top.API.Cdm.addEvent('ShutterOpenFailed', onShutterOpenFailed);
        top.API.Cdm.addEvent('ShutterClosed', onShutterClosed);
        top.API.Cdm.addEvent('ShutterCloseFailed', onShutterCloseFailed);

        //数据模块
        top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.addEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.addEvent("SetPersistentDataError", onDatSetPersistentDataError);
    }

    function EventLogout() {
        top.API.Cim.removeEvent('DeviceError', onDeviceError);

        //放钞
        top.API.Cim.removeEvent('AcceptCashPrepared', onAcceptCashPrepared);
        top.API.Cim.removeEvent('AcceptCashAlreadyActive', onAcceptCashAlreadyActive);
        top.API.Cim.removeEvent('AcceptCashPrepareFailed', onAcceptCashPrepareFailed);

        //验钞
        top.API.Cim.removeEvent('CashInserted', onCashInserted);
        top.API.Cim.removeEvent('CashAccepted', onCashAccepted);
        top.API.Cim.removeEvent('CashTaken', onCashTaken);

        //钞门
        top.API.Cdm.removeEvent('ShutterOpened', onShutterOpened);
        top.API.Cdm.removeEvent('ShutterOpenFailed', onShutterOpenFailed);
        top.API.Cdm.removeEvent('ShutterClosed', onShutterClosed);
        top.API.Cdm.removeEvent('ShutterCloseFailed', onShutterCloseFailed);

        //数据
        top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.removeEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.removeEvent("SetPersistentDataError", onDatSetPersistentDataError);
    }

    //Countdown function
    //Page Return
    function TimeoutCallBack() {
        top.ErrorInfo = top.API.PromptList.No3;
        if (parseInt(top.API.CashInfo.strTransAmount) > 0) { // 有钞情况下超时，进入自动上账流程
            top.API.displayMessage("超时，有钞，存款确认");
            return CallResponse("OK");
        } else {
            if (bCheckMoney) {
                strCallResponse = "TimeOut";
                top.API.gTakeCardAndPrint = true; // 超时打印凭条
                top.API.Dat.SetDataSync("TRANSACTIONRESULT", "STRING", ["失败"]);
                top.API.Dat.SetDataSync("COMMENTS", "STRING", ["交易超时"]); // 备注
                bError = true;
                NextPage();
            } else {
                return CallResponse('TimeOut');
            }
        }        
    }

    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
        if (bCheckMoney) {
            top.API.Cdm.CloseShutter(top.API.gCloseShutterTimeOut);
            App.Timer.ClearIntervalTime();
        }
        App.Plugin.Voices.del();
        App.Timer.ClearTime();
    }
})();
