/*@create by art
*/
; (function () {
    var bSPL1 = false;
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        ButtonDisable();
        top.API.Sys.ItemClearSync(top.API.MTRN_TRANSACTIONDIFFER);
		top.API.gShowPrintButton = true;
        App.Plugin.Voices.play("voi_36");
		BtnsContorl()
        ButtonEnable();
    }(); 
	
    function ButtonDisable() {
        document.getElementById('CWD').disabled = true;
        document.getElementById('Exit').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('CWD').disabled = false;
        document.getElementById('Exit').disabled = false;
    }
	
	function BtnsContorl() {        
        var TransStatus = top.API.gTransStatus;
        if (TransStatus == "-1") {
            top.API.displayMessage("获取各交易状态失败");
			ButtonDisable();
			top.ErrorInfo = top.API.PromptList.No4;
			return CallResponse("Exit");
        } else {
            var arrTransStatus = TransStatus.split(",");
            var DRAW_PB_flag = parseInt(arrTransStatus[4]);            
            if (DRAW_PB_flag != 1) {
                document.getElementById('CWD').style.display = "none";
            } else {
                document.getElementById('CWD').style.display = "block";
            }

	    var DEP_PB_flag = parseInt(arrTransStatus[6]);            
            if (DEP_PB_flag != 1) {
                document.getElementById('DEP').style.display = "none";
            } else {
                document.getElementById('DEP').style.display = "block";
            }			
        }
    }
    document.getElementById("CWD").onclick = function () {
        ButtonDisable();
        top.API.CashInfo.Dealtype = "存折取款";
        
        top.API.Dat.SetDataSync("QRYCWDMONEYFLAG", "STRING", ["2"]);//借记卡、存折累计取款为"2"
        top.API.Jnl.PrintSync("SelectPBCWD");
        var arrDealType = new Array(top.API.CashInfo.Dealtype);
        top.API.Dat.SetDataSync(top.API.dealtypeTag, top.API.dealtypeType, arrDealType);
        var arrCwdDealtypeType = new Array("PASSBOOK"); 
        top.API.Dat.SetDataSync(top.API.CWDDealTypeTag, top.API.CWDDealTypeType, arrCwdDealtypeType);
        top.API.Sys.DataSetSync(top.API.MTRN_TRANSACTIONDIFFER, top.API.MTRN_WITHDRAW_PB);
        return CallResponse("CWD");
    }
	
	document.getElementById("DEP").onclick = function () {
        ButtonDisable();
        top.API.CashInfo.Dealtype = "存折存款";
		top.API.Jnl.PrintSync("SelectPBDEP");
        top.API.gATMORTCR = "TCR";
		top.API.gCardOrBookBank = 2;
        var arrDealType = new Array(top.API.CashInfo.Dealtype);
        top.API.Dat.SetDataSync(top.API.dealtypeTag, top.API.dealtypeType, arrDealType);
		var arrCwdDealtypeType = new Array("CARD"); 
        top.API.Dat.SetDataSync(top.API.CWDDealTypeTag, top.API.CWDDealTypeType, arrCwdDealtypeType);
        top.API.Sys.DataSetSync(top.API.MTRN_TRANSACTIONDIFFER, top.API.MTRN_DEPOSIT_PB);
        return CallResponse("DEP");
    }

    document.getElementById("Exit").onclick = function () {
        ButtonDisable();
        top.ErrorInfo = top.API.PromptList.No2;
        return CallResponse("Exit");
    }

    //@User code scope end
    function TimeoutCallBack() {
        top.ErrorInfo = top.API.PromptList.No3;
        return CallResponse('TimeOut');
    }

    //remove all event handler
    function Clearup() {
        App.Timer.ClearTime();
        //TO DO:
    }


})();