/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function(){
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        Clearup();
        App.Cntl.ProcessDriven( Response );
    });
    var Initialize = function() {     
        EventLogin();
        ButtonDisable();
		top.API.Tsl.HandleRecordFileSync(top.API.MTSL_RENAMERECORD, "");
		if (top.API.gAddNoteSuccess == true) {
			var arrTotalFlag = new Array();
			arrTotalFlag[0] = 1;
			top.API.Dat.SetPersistentData("TOTALADDOK", "LONG", arrTotalFlag);
		}else{
			document.getElementById("SuccessedDiv").style.display = "none";
			document.getElementById("FailedDiv").style.display = "block";
			document.getElementById("Back").style.display = "block";
			ButtonEnable();
		}
    }();//Page Entry
    function ButtonDisable() {
        document.getElementById('Back').disabled = true;
        document.getElementById('OK').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Back').disabled = false;
        document.getElementById('OK').disabled = false;
    }
   //@User ocde scope start
    document.getElementById('OK').onclick = function(){
        ButtonDisable();
         return CallResponse('OK');
    }

    document.getElementById('Back').onclick = function(){
        ButtonDisable();
         return CallResponse('Back');
    }
    document.getElementById('PageRoot').onclick = function () {

        return CallResponse('Exit');
    }
   //@User code scope end 
        /********************************************************************************************************/
    function onDatSetPersistentDataComplete(DataName) {
        if ('TOTALADDOK' == DataName) {
            top.API.Jnl.PrintSync("AddCashNote");
			var PtrPaperStatus = top.API.Ptr.StPaperStatus();
            if (PtrPaperStatus != "FULL" || PtrPaperStatus != "LOW") {
                top.API.Ptr.Print("ReceiptBillLoadingCountSet_szABC", "",top.API.gPrintTimeOut);
            }
            document.getElementById("OK").style.display = "block";  
        }  
        ButtonEnable();
    }

    function onDatSetPersistentDataError(DataName, ErrorCode) {
        document.getElementById("SuccessedDiv").style.display = "none";
        document.getElementById("FailedDiv").style.display = "block";
        document.getElementById("Back").style.display = "block";
        ButtonEnable();
    }
    //Register the event
    function EventLogin() {
        top.API.Dat.addEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.addEvent("SetPersistentDataError", onDatSetPersistentDataError);
    }

    function EventLogout() {
        top.API.Dat.removeEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.removeEvent("SetPersistentDataError", onDatSetPersistentDataError);
    }
      //Page Return
    
      //remove all event handler
    function Clearup(){
      //TO DO:
      EventLogout();
    }
})();
