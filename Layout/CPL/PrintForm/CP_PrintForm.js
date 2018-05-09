/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        top.API.Siu.SetReceiptPrinterLight('OFF');
        Clearup();
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        top.API.gShowPrintButton = false;
        EventLogin();
        initPtr();
    }(); //Page Entry

    //@User ocde scope start
    function initPtr() {
		top.API.Siu.SetReceiptPrinterLight('SLOW');
		if (top.API.gbPartCashIn) { //验钞时卡钞
			if (!top.API.gbPartCashInEnd) { 
				var arrComments = new Array("设备故障，请联系银行工作人员");
				top.API.Dat.SetDataSync("COMMENTS", "STRING", arrComments);
			}else{
				var arrTransactionResult  = new Array("部分入账");
				top.API.Dat.SetDataSync("TRANSACTIONRESULT", "STRING", arrTransactionResult);
				top.API.displayMessage("SetDataSync TRANSACTIONRESULT Return:" + nRet);
				top.API.Dat.SetDataSync("COMMENTS", "STRING", arrComments);
			}
		}
		top.API.Ptr.Print("ReceiptCash_Print_szABC", "",top.API.gPrintTimeOut);
		
        App.Plugin.Voices.play("voi_8"); 
    }

    //@User code scope end 

    //event handler
    function onPrintComplete() {
        if (top.API.gbPartCashIn || top.API.CashInfo.Dealtype == "无卡无折存款"
                || top.API.CashInfo.Dealtype == "对公存款" || top.API.CashInfo.Dealtype == "存折取款") { //验钞时卡钞
	        return CallResponse("Exit");           
	    }else{
	        return CallResponse("OK");           
	    }        
    }
    
    //event handler
    function onEjectTimeout() {
        top.ErrorInfo = "打印失败，交易结束！";
        return CallResponse("Exit");
    }
    //event handler
    function onDeviceError() {
        top.API.displayMessage("onDeviceError触发");
        top.ErrorInfo = top.API.PromptList.No4;
        return CallResponse("Exit");
    }
     function onPrintFailed() {
        top.API.displayMessage("onPrintFailed触发");
        top.ErrorInfo = top.API.PromptList.No4;
        return CallResponse("Exit");
    }
    //event handler
    function onPrintTaken() {
        if (top.API.gbPartCashIn || top.API.CashInfo.Dealtype == "无卡无折存款"
                 || top.API.CashInfo.Dealtype == "对公存款" || top.API.CashInfo.Dealtype == "存折取款") { //验钞时卡钞
            return CallResponse("Exit");  
        } else {
            return CallResponse("OK");           
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

    //Countdown function
    function TimeoutCallBack() {
        top.ErrorInfo = top.API.PromptList.No3;
        return CallResponse("TimeOut");
    }
    //Page Return
    
    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
        App.Plugin.Voices.del();
        App.Timer.ClearTime();
    }
})();