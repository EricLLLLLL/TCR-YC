/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        top.API.Siu.SetReceiptPrinterLight('OFF');
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        ButtonDisable();
        var arrTransactionResult = new Array("交易成功");
        top.API.Dat.SetDataSync("TRANSACTIONRESULT", "STRING", arrTransactionResult);
        top.API.gTakeCardAndPrint = false;
        EventLogin();
        ButtonEnable();
    } (); //Page Entry

    function ButtonDisable() {
        top.API.displayMessage("ButtonDisable");
        document.getElementById('Exit').disabled = true;
        document.getElementById('OK').disabled = true;
    }

    function ButtonEnable() {
    top.API.displayMessage("ButtonEnable");
    document.getElementById('Exit').disabled = false;
    document.getElementById('OK').disabled = false;
    }

    document.getElementById('Exit').onclick = function () {
        top.API.displayMessage("点击<退出>按钮,响应<Exit>");
        ButtonDisable();
    return CallResponse('Exit');
    }

    document.getElementById('OK').onclick = function () {
        top.API.displayMessage("点击<确定>按钮,响应<OK>");
        ButtonDisable();
        initPtr();
        //return CallResponse('OK');
    }

    //@User ocde scope start
    function initPtr() {
        top.API.displayMessage("进入Function<initPtr()>");
        top.API.Ptr.Print("ExChangeMoney_Print_szABC", "",top.API.gPrintTimeOut);
    }

    //@User code scope end 
        

    //event handler
    function onPrintComplete() {
        top.API.displayMessage("onPrintComplete触发,响应<OK>");
        top.API.Siu.SetReceiptPrinterLight('SLOW');
        App.Plugin.Voices.play("voi_8");
        return CallResponse("OK");
    }
    //event handler
    function onPrintEjected() {
        top.API.displayMessage("onPrintEjected触发");
        return CallResponse("OK");    
    }
    //event handler
    function onEjectTimeout() {
        top.API.displayMessage("onEjectTimeout触发,响应<TimeOut>");
        top.ErrorInfo = "打印失败，交易结束！";
        return CallResponse("OK");
    }
    //event handler
    function onDeviceError() {
        top.API.displayMessage("onDeviceError触发");
        top.ErrorInfo = top.API.PromptList.No4;
        return CallResponse("Exit");
    }

     function onPrintFailed() {
        top.API.displayMessage("ononPrintFailed触发");
        top.ErrorInfo = top.API.PromptList.No4;
        return CallResponse("Exit");
    }
    //event handler
    function onPrintTaken() {
        top.API.displayMessage("onPrintTaken触发,响应<OK>");
        return CallResponse("OK");
    }
    /********************************************************************************************************/
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

    //Countdown function
    function TimeoutCallBack() {
        top.API.displayMessage("页面超时,响应<TimeOut>");
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