/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        EventLogin();
        initPbk();
    }(); //Page Entry
    //@User ocde scope start
    function initPbk() {
        top.API.displayMessage("进入Function<initPbk()>");
        // var field1 = "data1=20160920|abstract1=支出|detail1=-1000.00|balance1=2000.00|operator1=001";
        // var field2 = "data2=20160922|abstract2=存入|detail2=+1000.00|balance2=3000.00|operator2=012";
        // var field3 = "data3=20160928|abstract3=支出|detail3=-1500.00|balance3=1500.00|operator3=009";
    
        // var fields = field1 + "|" + field2 + "|" + field3;
        // top.API.Pbk.Print("TestPassbookForm", fields);
        var FillPassbook;
        var objFillPassbook = top.API.Dat.GetDataSync("FillPassbook", "STRING");
        if (null == objFillPassbook) {
            top.API.displayMessage("GetDataSync FillPassbook objGet = null");
        }
        else {
            top.API.displayMessage("GetDataSync objFillPassbook Return:" + objFillPassbook.toArray());
            var arrFillPassbook = objFillPassbook.toArray();
            FillPassbook = arrFillPassbook[0];
        }
		FillPassbook = "";
        top.API.Pbk.Print("PassbookForm", FillPassbook);
    }

    //@User code scope end 

    //event handler
    function onPrintComplete() {
        top.API.displayMessage("onPrintComplete触发,响应<OK>");
        return CallResponse("OK");           
    }
    //event handler
    function onPrintEjected() {
        top.API.displayMessage("onPrintEjected触发");
    }
    //event handler
    function onEjectTimeout() {
        top.API.displayMessage("onEjectTimeout触发,响应<TimeOut>");
        top.ErrorInfo = "打印失败，交易结束！";
        return CallResponse("TimeOut");
    }
    //event handler
    function onDeviceError() {
        top.API.displayMessage("onDeviceError触发");
        top.ErrorInfo = top.API.PromptList.No4;
        return CallResponse("Exit");
    }
    //event handler
    function onPrintTaken() {
        top.API.displayMessage("onPrintTaken触发,响应<OK>");
        return CallResponse("OK");
    }
    //Register the event
    function EventLogin() {
        top.API.Pbk.addEvent("PrintComplete", onPrintComplete);
        top.API.Pbk.addEvent("PrintEjected", onPrintEjected);
        top.API.Pbk.addEvent("Timeout", onEjectTimeout);
        top.API.Pbk.addEvent("DeviceError", onDeviceError);
        top.API.Pbk.addEvent("PrintTaken", onPrintTaken);
    }

    function EventLogout() {
        top.API.Pbk.removeEvent("PrintComplete", onPrintComplete);
        top.API.Pbk.removeEvent("PrintEjected", onPrintEjected);
        top.API.Pbk.removeEvent("Timeout", onEjectTimeout);
        top.API.Pbk.removeEvent("DeviceError", onDeviceError);
        top.API.Pbk.removeEvent("PrintTaken", onPrintTaken);
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