/*@create by:  tsxiong
 *@time: 2016年03月20日
 */
;(function () {
    var iniRet = "";
    var Files = dynamicLoadFiles();
    var CallResponse = App.Cntl.ProcessOnce(function (Response) {
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        EventLogin();
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        ButtonDisable();
        // if(top.API.gTransactiontype == 'NOCARDDEP')
        // {
        //     document.getElementById('Continue').style.display = "none";
        // }
        var PtrPaperStatus = top.API.Ptr.StPaperStatus();
        top.API.gTslResult = "SUCCESS";
        if (top.API.gTslFlag) {
            //“日期|时间|卡号|流水号|交易类型|金额|身份证号|身份证头像路径|交易结果”TSL数据库日志
            top.API.gTslFlag = false;
            var TslLog = top.API.gTslDate;
            TslLog += "|" + top.API.gTslTime;
            TslLog += "|" + top.API.gCardno;
            TslLog += "|" + top.API.gTslJnlNum;
            TslLog += "|" + top.API.gTslChooseType;
            TslLog += "|" + top.API.gTslMoneyCount;
            TslLog += "|" + top.API.gIdNumber;
            TslLog += "|" + top.API.gIdCardpic;
            TslLog += "|" + top.API.gTslResult;
            top.API.Tsl.AddTransLogSync(TslLog); //CreateUpJnlFile
            //终端号（8位），交易日期（8位），交易时间（6位），交易类型（4位，0107代表存款，0108代表取款），
            //帐号（19位），交易金额（10位包含两位小数位），设备流水号（6位），设备流水批次号（6位），
            //后台返回码（2位），后台返回流水号（12位），设备交易状态（2位，00代表交易成功，01代表异常交易），异常状态类型（4位）
            var strUpJnl = top.API.gTerminalID;
            strUpJnl += "|!" + top.API.gTslDate;
            strUpJnl += "|!" + top.API.gTslTime;
            strUpJnl += "|!" + top.API.gTslChooseJnlType;
            strUpJnl += "|!" + top.API.gCardno;
            strUpJnl += "|!" + top.API.gTslMoneyCount.replace(".", "");
            strUpJnl += "|!" + top.API.gTslJnlNum;
            strUpJnl += "|!" + top.API.gTslJnlBtn;
            strUpJnl += "|!" + top.API.gTslResponsecode;
            strUpJnl += "|!" + top.API.gTslSysrefnum;
            strUpJnl += "|!00|!交易成功";
            top.API.Tsl.HandleRecordFileSync(top.API.MTSL_WRITECHECKTRANSRECORD, strUpJnl);
        }
        if (top.API.CashInfo.Dealtype == "CWD取款") {
            //document.getElementById('INQ').style.display = "block";
        }
        top.API.Sys.ItemClearSync(top.API.MTRN_TRANSACTIONDIFFER);
        if (top.API.Ptr.bDeviceStatus && top.API.gNoPtrSerFlag == false && top.API.gShowPrintButton) {
            document.getElementById('Print').style.display = "block";
        }
        iniRet = top.API.Dat.GetPrivateProfileSync("TransactionConfig", "ContinueTransSupport", "1", top.API.gIniFileName);
        // if (iniRet==="0"){
        //     document.getElementById('Exit').innerHTML = "结束";
        // } else {
        //     document.getElementById('OK').style.display = "block";
        // if(top.API.CashInfo.Dealtype == "存折取款"){
        // 	document.getElementById('OK').innerHTML = "结束";
        // }else{
        // 	document.getElementById('OK').innerHTML = "退卡";
        // }
        // }
        switch (top.API.gTranType) {
            case 'noCardTrade':
                $("#ExitCard").css("background", "url('Framework/style/Graphics/btnOut.png')  no-repeat center center");
                $("#Continue").hide();
                break;
            case 'largeRemit':
                // $("#ExitCard").addClass("out");
                $("#ExitCard").css("background", "url('Framework/style/Graphics/btnOut.png')  no-repeat center center");
                break;
            case 'changePassword':
                // $("#ExitCard").addClass("out");
                $("#Print").hide();
                $("#Continue").hide();
                $("#PageRoot").hide();
                break;
            default :
                break;
        }

        //获取手续费
        var Poundage = top.API.gPoundage;
        //获取取款总额
        //var Amount = top.API.CashInfo.strTransAmount + ".00";
		
        //document.getElementById("Amount").innerText=Amount;
        App.Plugin.Voices.play("voi_33");
        var arrTransactionResult = new Array("TRANSUCCESS");
        top.API.gTakeCardAndPrint = false;
        top.API.Dat.SetDataSync("TRANSACTIONRESULT", "STRING", arrTransactionResult);
        //取款交易成功之后需要清除冲正流水号
        var arrCWCJNLNUM = new Array();
        arrCWCJNLNUM[0] = -1;
        top.API.Dat.SetPersistentData(top.API.cwcjnlnumTag, top.API.cwcjnlnumType, arrCWCJNLNUM);
        if (!(top.API.Ptr.bDeviceStatus && (PtrPaperStatus == "FULL" || PtrPaperStatus == "LOW"))) {
            $("#Print").hide();
        }
        ButtonEnable();
    }();//Page Entry

    //@User ocde scope start
    function ButtonDisable() {
        document.getElementById('Print').disabled = true;
        document.getElementById('ExitCard').disabled = true;
        document.getElementById('Continue').disabled = true;
        document.getElementById('PageRoot').disabled = true;

    }

    function ButtonEnable() {
        document.getElementById('Print').disabled = false;
        document.getElementById('ExitCard').disabled = false;
        document.getElementById('Continue').disabled = false;
        document.getElementById('PageRoot').disabled = false;

    }

    document.getElementById('PageRoot').onclick = function () {
        ButtonDisable();
        top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["************************************"]);
        top.API.Jnl.PrintSync("Content");
        if( top.API.gTranType != 'noCardTrade'){
            top.API.gLastTranstype = top.API.gTranType;
            return CallResponse("NeedInitData");
        }else{
            top.API.gLastTranstype = top.API.gTranType;
            return CallResponse("Exit");
        }
        // return CallResponse('BackHomepage');
    };

    document.getElementById('Print').onclick = function () {
        ButtonDisable();
        top.API.gPrintFSN = false;
        top.API.Ptr.Print("ReceiptCash_Print_szABC", "", top.API.gPrintTimeOut);
        //return CallResponse("Print");
    };

    //   document.getElementById('INQ').onclick = function () {
    //       ButtonDisable();
    // top.API.gTransactiontype = "INQ";
    // //余额查询
    //       var arrBalanceInquiryType = new Array("NOTYPE");
    //       top.API.Dat.SetDataSync(top.API.BalanceInquiryTag, top.API.BalanceInquiryType, arrBalanceInquiryType);
    //       return CallResponse('INQ');
    //   }

    // document.getElementById('OK').onclick = function () {
    //     ButtonDisable();
    //     return CallResponse("OK");
    // }
    document.getElementById('Continue').onclick = function () {
        ButtonDisable();
        top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["************************************"]);
        top.API.Jnl.PrintSync("Content");
        top.API.gLastTranstype = top.API.gTranType;
        top.API.displayMessage("点击Continue");
        //  if(top.API.gTransactiontype == 'NOCARDDEP')
        // {
        //     return CallResponse("OK");
        // }
        // else
        // {
        return CallResponse("NeedInitData");
        // }
    };
    document.getElementById('ExitCard').onclick = function () {
        ButtonDisable();
        // if (iniRet==="0"){
        return CallResponse("Exit");
        // } else {
        //     return CallResponse("NeedInitData");
        // }
    };
    //Countdown function
    function TimeoutCallBack() {
        top.ErrorInfo = top.API.PromptList.No3;
        top.API.gLastTranstype = top.API.gTranType;
        return CallResponse("TimeOut");
    }

    //Page Return
    function onPrintComplete() {
        top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["************************************"]);
        top.API.Jnl.PrintSync("Content");
        top.API.displayMessage("onPrintComplete");
        if( top.API.gTranType != 'noCardTrade'){
            top.API.gLastTranstype = top.API.gTranType;
            return CallResponse("NeedInitData");
        }else{
            top.API.gLastTranstype = top.API.gTranType;
            return CallResponse("Exit");
        }
    }

    //event handler
    function onEjectTimeout() {
        top.API.displayMessage("onEjectTimeout");
        return CallResponse("Exit");
    }

    //event handler
    function onDeviceError() {
        top.API.displayMessage("onDeviceError触发");
        return CallResponse("Exit");
    }

    function onPrintFailed() {
        top.API.displayMessage("onPrintFailed触发");
        Files.errmsgTag("凭条打印失败！");
        if( top.API.gTranType != 'noCardTrade'){
            top.API.gLastTranstype = top.API.gTranType;
            return CallResponse("NeedInitData");
        }else{
            top.API.gLastTranstype = top.API.gTranType;
            return CallResponse("Exit");
        }
    }

    //event handler
    function onPrintTaken() {
        top.API.displayMessage("onPrintTaken");
        if( top.API.gTranType != 'noCardTrade'){
            top.API.gLastTranstype = top.API.gTranType;
            return CallResponse("NeedInitData");
        }else{
            top.API.gLastTranstype = top.API.gTranType;
            return CallResponse("Exit");
        }
    }

    //Register the event
    function EventLogin() {
        top.API.Ptr.addEvent("PrintComplete", onPrintComplete);
        top.API.Ptr.addEvent("PrintFailed", onPrintFailed);
        top.API.Ptr.addEvent("DeviceError", onDeviceError);
        top.API.Ptr.addEvent("PrintTaken", onPrintTaken);
    }

    function EventLogout() {
        top.API.Ptr.removeEvent("PrintComplete", onPrintComplete);
        top.API.Ptr.removeEvent("PrintFailed", onPrintFailed);
        top.API.Ptr.removeEvent("DeviceError", onDeviceError);
        top.API.Ptr.removeEvent("PrintTaken", onPrintTaken);
    }

    //remove all event handler
    function Clearup() {
        EventLogout();
        App.Plugin.Voices.del();
        App.Timer.ClearTime();
    }
})();
