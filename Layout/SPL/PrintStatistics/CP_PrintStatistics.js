/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function(){
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
    //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven( Response );
    });
    var Initialize = function() {
    EventLogin();
     SetExchangePrintData();
 } (); //Page Entry

   //@User ocde scope start
   function SetExchangePrintData() {
        top.API.displayMessage('开始：PUCurrentCount()');
        top.API.Cdm.PUCurrentCount();
        top.API.displayMessage('结束：PUCurrentCount()');
        top.API.displayMessage('开始：CUNoteValue()');
        top.API.Cdm.CUNoteValue();
        top.API.displayMessage('结束：CUNoteValue()');
        top.API.displayMessage('开始：CUType()');
        top.API.Cdm.CUType();
        top.API.displayMessage('结束：CUType()');
        top.API.Cim.StatisticsData();
        var t=window.setTimeout(PrintData,1000);
    }
   //@User code scope end 
   function PrintData() {
        var arrTransKindType = new Array("打印统计数据");
        var nRet = top.API.Dat.SetDataSync(top.API.TransKindTag, top.API.TransKindType, arrTransKindType);
        top.API.displayMessage("SetDataSync TransKindType Return:" + nRet);
        top.API.Jnl.PrintSync("MachineSettle");
        top.API.Ptr.Print("SUBTOTAL_szABC_haveReDep", "",top.API.gPrintTimeOut); 
   }
    //event handler
    function onPrintComplete() {
        top.API.displayMessage("onPrintComplete触发");
        return CallResponse("OK");           
    }
    //event handler
    function onPrintEjected() {
        top.API.displayMessage("onPrintEjected触发");
    }
    //event handler
    function onEjectTimeout() {
        top.API.displayMessage("onEjectTimeout触发,响应<TimeOut>");
    }
    //event handler
    function onDeviceError() {
        top.API.displayMessage("onDeviceError触发");
        return CallResponse("Back");
    }
     //event handler
    function onPrintFailed() {
        top.API.displayMessage("onPrintFailed触发");
        return CallResponse("Back");
    }
	function onPrintTaken() {
        top.API.displayMessage("onPrintTaken触发");
        //return CallResponse("Back");
    }
    //Register the event
    function EventLogin() {
        top.API.Ptr.addEvent("PrintComplete", onPrintComplete);
        top.API.Ptr.addEvent("PrintFailed", onPrintFailed);
        top.API.Ptr.addEvent("PrintEjected", onPrintEjected);
        top.API.Ptr.addEvent("Timeout", onEjectTimeout);
        top.API.Ptr.addEvent("DeviceError", onDeviceError);
        top.API.Ptr.addEvent("PrintTaken", onPrintTaken);
    }

    function EventLogout() {
        top.API.Ptr.removeEvent("PrintComplete", onPrintComplete);
        top.API.Ptr.removeEvent("PrintFailed", onPrintFailed);
        top.API.Ptr.removeEvent("PrintEjected", onPrintEjected);
        top.API.Ptr.removeEvent("Timeout", onEjectTimeout);
        top.API.Ptr.removeEvent("DeviceError", onDeviceError);
        top.API.Ptr.removeEvent("PrintTaken", onPrintTaken);
    }


      //remove all event handler
    function Clearup(){
		EventLogout();
    }
})();
