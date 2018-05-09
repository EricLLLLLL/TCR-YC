;
(function () {
    var CallResponse = App.Cntl.ProcessOnce(function (Response) {
            //TO DO:
            Clearup();
            //Entry the flows control process.
            App.Cntl.ProcessDriven(Response);
        }),
        Initialize = function () {
            // EventLogin();
            ButtonDisable();
            //@initialize scope start

            App.Timer.TimeoutDisposal(TimeoutCallBack);
            ButtonEnable();
            BtnsContorl();
        }(); //Page Entry


    function ButtonDisable() {
        document.getElementById('Exit').disabled = true;
        // document.getElementById('Back').disabled = true;
        document.getElementById('TransferCancellation').disabled = true;
        document.getElementById('TransferRemittance').disabled = true;
        document.getElementById('PeriodicCurrentAccount').disabled = true;
        document.getElementById('CurrentToRegular').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Exit').disabled = false;
        // document.getElementById('Back').disabled = false;
        document.getElementById('TransferCancellation').disabled = false;
        document.getElementById('TransferRemittance').disabled = false;
        document.getElementById('PeriodicCurrentAccount').disabled = false;
        document.getElementById('CurrentToRegular').disabled = false;
    }
    function BtnsContorl(){
        if ( top.API.gbTRANSFER_DEAL ) {
            $("#TransferRemittance").show();
        } else {
            $("#TransferRemittance").hide();
        }
        if ( top.API.gbTRANSFERCANCEL_DEAL ) {
            $("#TransferCancellation").show();
        } else {
            $("#TransferCancellation").hide();
        }
        if ( top.API.gbPCA_DEAL ) {
            $("#PeriodicCurrentAccount").show();
        } else {
            $("#PeriodicCurrentAccount").hide();
        }
        if ( top.API.gbCTR_DEAL ) {
            $("#CurrentToRegular").show();
        } else {
            $("#CurrentToRegular").hide();
        }
    }

    //@User ocde scope start
    document.getElementById('Exit').onclick = function () {
        ButtonDisable();
        top.ErrorInfo = top.API.PromptList.No2;
        return CallResponse('Exit');
    };
    // document.getElementById('Back').onclick = function () {
    //     ButtonDisable();
    //     return CallResponse('Back');
    // };
    document.getElementById('TransferCancellation').onclick = function () {
        // top.API.gTransactiontype = 'QueryCancelInfo';
        top.API.gTransactiontype = 'QRYTFSCANCEL'; // 撤销查询
        top.API.CashInfo.Dealtype = 'TransferCancellation';
        ButtonDisable();
        return CallResponse('TransferCancellation');
    };
    document.getElementById('TransferRemittance').onclick = function () {
        top.API.gTransactiontype = 'INQ'; // 验密
        top.API.CashInfo.Dealtype = 'TransferRemittance';
        ButtonDisable();
        return CallResponse('TransferRemittance');
    };
    document.getElementById('PeriodicCurrentAccount').onclick = function () {
        top.API.gTransactiontype = 'QRYEXCHANGE';  // 查询定活互转账户信息
        top.API.CashInfo.Dealtype = 'PeriodicCurrentAccount';  // 定期转活期
        top.API.Dat.SetDataSync("DEALTYPE", "STRING", ["2"]);  // 设置共享内存DEALTYPE值为2
        ButtonDisable();
        return CallResponse('PeriodicCurrentAccount');
    };
    document.getElementById('CurrentToRegular').onclick = function () {
        top.API.gTransactiontype = 'QRYEXCHANGE';  // 查询定活互转账户信息
        top.API.CashInfo.Dealtype = 'CurrentToRegular';  // 活期转定期
        top.API.Dat.SetDataSync("DEALTYPE", "STRING", ["1"]);  // 设置共享内存DEALTYPE值为1
        ButtonDisable();
        return CallResponse('CurrentToRegular');
    };


    //@User code scope end

    //Countdown function
    function TimeoutCallBack() {
        top.ErrorInfo = top.API.PromptList.No3;
        return CallResponse('TimeOut');
    }

    //remove all event handler
    function Clearup() {
        //TO DO:
        //EventLogout();
        App.Timer.ClearTime();
    }
})();