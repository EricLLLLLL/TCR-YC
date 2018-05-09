;(function () {
    var CallResponse = App.Cntl.ProcessOnce(function (Response) {
            //TO DO:
            Clearup();
            App.Cntl.ProcessDriven(Response);
        }),
        Initialize = function () {
            EventLogin();
            ButtonDisable();
            ButtonEnable();
            top.API.NoCardDeal = false; // 最开始只在CP_InputRemittanceAccount.js中设置值为True，导致后续流程异常
            var tmplRetBigTranLimit = top.API.Dat.GetDataSync("POSSIBLEDISPENSE100AMOUNT", "LONG")[0];
            if (top.API.gLargeInsertCard) {
                $("#largeRemit").addClass("unsupported");
                $("#largeRemit").attr("disabled", true);
            }
            if (!top.API.gbCARDCWD_DEAL || tmplRetBigTranLimit < 20000) {
                $("#largeCwd").addClass("unsupported");
                $("#largeCwd").attr("disabled", true);
            } else {
                $("#largeCwd").show();
            }
            if (!top.API.gbCARDDEP_DEAL) {
                $("#largeDep").addClass("unsupported");
                $("#largeDep").attr("disabled", true);
            } else {
                $("#largeDep").show();
            }
            // if (top.API.gbTRANSFER_DEAL || top.API.gbTRANSFERCANCEL_DEAL || top.API.gbPCA_DEAL || top.API.gbCTR_DEAL) {
            //     $("#largeTran").show();
            // } else {
            $("#largeTran").addClass("unsupported");
            $("#largeTran").attr("disabled", true);
            // }
            App.Timer.TimeoutDisposal(TimeoutCallBack);
        }();//Page Entry

    //@User ocde scope start
    document.getElementById('PageRoot').onclick = function () {
        return CallResponse('Exit');
    };

    function ButtonDisable() {
        document.getElementById('largeDep').disabled = true;
        document.getElementById('largeCwd').disabled = true;
        document.getElementById('largeTran').disabled = true;
        document.getElementById('largeRemit').disabled = true;
        document.getElementById('PageRoot').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('largeDep').disabled = false;
        document.getElementById('largeCwd').disabled = false;
        document.getElementById('largeTran').disabled = false;
        document.getElementById('largeRemit').disabled = false;
        document.getElementById('PageRoot').disabled = false;
    }

    document.getElementById('largeDep').onclick = function () {
        ButtonDisable();
        //设置大额存款限额
        top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["largeDep大额存款"]);
        top.API.Jnl.PrintSync("Content");
        top.API.CashInfo.Dealtype = "largeDep大额存款";
        var arrDealType = new Array(top.API.CashInfo.Dealtype);
        top.API.Dat.SetDataSync(top.API.dealtypeTag, top.API.dealtypeType, arrDealType);
        var lRetBigTranLimit = 200000;
        var arrTransactionResult = new Array(lRetBigTranLimit.toString());
        top.API.gChooseMoney = lRetBigTranLimit;
        top.API.Dat.SetDataSync("CASHINMAXAMOUNT", "STRING", arrTransactionResult);

        //记录交易类型
        top.API.gTranType = 'largeDep';
        return CallResponse('LargeAmountsDeposit');
    };
    document.getElementById('largeCwd').onclick = function () {
        ButtonDisable();
        top.API.CashInfo.Dealtype = "largeCwd大额取款";
        top.API.gTranType = 'largeCwd';
        top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["largeCwd大额取款"]);
        top.API.Jnl.PrintSync("Content");
        var arrDealType = new Array(top.API.CashInfo.Dealtype);
        top.API.Dat.SetDataSync(top.API.dealtypeTag, top.API.dealtypeType, arrDealType);
        top.API.Sys.DataSetSync(top.API.MTRN_TRANSACTIONDIFFER, top.API.MTRN_WITHDRAW_CARD);
        return CallResponse('LargeAmountsWithdrawal');
    };
    document.getElementById('largeTran').onclick = function () {
        top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["largeTran大额转账"]);
        top.API.Jnl.PrintSync("Content");
        top.API.gTranType = 'largeTran';
        top.API.CashInfo.Dealtype = "largeTran大额转账";
        top.API.gTranType = 'largeCwd';
        var arrDealType = new Array(top.API.CashInfo.Dealtype);
        top.API.Dat.SetDataSync(top.API.dealtypeTag, top.API.dealtypeType, arrDealType);
        ButtonDisable();
        return CallResponse('LargeAmountsTransferAccounts');
    };
    document.getElementById('largeRemit').onclick = function () {
        ButtonDisable();
        top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["largeRemit大额现金汇款"]);
        top.API.Jnl.PrintSync("Content");
	    top.API.NoCardDeal = true;
        top.API.CashInfo.Dealtype = "largeRemit大额现金汇款";
        var arrDealType = new Array(top.API.CashInfo.Dealtype);
        top.API.Dat.SetDataSync(top.API.dealtypeTag, top.API.dealtypeType, arrDealType);
        top.API.gTranType = 'largeRemit';
        return CallResponse('LargeAmountsCashRemittance');
    };
    //@User code scope end

    //Register the event
    function EventLogin() {
    }

    function EventLogout() {
    }

    //Countdown function
    function TimeoutCallBack() {

        return CallResponse('TimeOut');
    }

    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
        App.Timer.ClearTime();
    }
})();
