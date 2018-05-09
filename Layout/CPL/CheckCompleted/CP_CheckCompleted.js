/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {
    var nReCompare = 0;
    var bIdentify = false;
    var bTipFlag = false;
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        ButtonDisable();
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        EventLogin();
        ButtonEnable();
        //
    }(); //Page Entry

    //@User ocde scope start
    function ButtonDisable() {
        top.API.displayMessage("ButtonDisable");
        document.getElementById('Exit').disabled = true;
        document.getElementById('OK').disabled = true;
        document.getElementById('PageRoot').disabled = true;
    }

    function ButtonEnable() {
        top.API.displayMessage("ButtonEnable");
        document.getElementById('Exit').disabled = false;
        document.getElementById('OK').disabled = false;
        document.getElementById('PageRoot').disabled = false;
    }

    document.getElementById('Exit').onclick = function () {
        top.API.displayMessage("点击<退出>");
        ButtonDisable();
        return CallResponse('Exit');
    }
    document.getElementById('OK').onclick = function () {
        top.API.displayMessage("点击<确认>");
        ButtonDisable();
        return CallResponse('OK');
    };
        document.getElementById('PageRoot').onclick = function() {
        ButtonDisable();
        return CallResponse('BackHomepage');
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
    //Page Return
    
    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
        App.Timer.ClearTime();
    }
})();
