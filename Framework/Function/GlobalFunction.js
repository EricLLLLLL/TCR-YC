
(function () {

    function WriteAcctFile(Reason, InOutAmount) {
        var sRetCode = "";
        var sTransAmount = top.API.CashInfo.strTransAmount;// + ".00"
        var sAccoutNo = top.API.gCardno;
        var sTransType = "";
        sTransType = "DEP";
        top.API.Tsl.HandleRecordFileSync(top.API.MTSL_WRITETRANSRECORD,
								sAccoutNo + ", " + sTransType + ", " +
								sTransAmount + ", " + InOutAmount + 
								", " + sRetCode + ", " + Reason);
    }
	
    function UpdateAcctFile(Reason, InOutAmount) {
        var sRetCode = top.API.gResponsecode;
        var sTransAmount = top.API.CashInfo.strTransAmount;
        var sTransType = "CWD";
        top.API.Tsl.UpdateRecord(sTransAmount, InOutAmount , sRetCode);
    }
})();;