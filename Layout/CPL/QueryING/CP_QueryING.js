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
        EventLogin();
        //@initialize scope start
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        //    top.API.Tcp.SendToHost("CHECKBALANCE", 60000);
        return CallResponse('OK');
    }();//Page Entry

    //@User ocde scope start
    //document.getElementById('OK').onclick = function(){
    //  
    //     return CallResponse('OK');
    //}

    //@User code scope end 

    //event handler
    function onTcpSendFailed() {
        top.API.displayMessage("onTcpSendFailed is done");
        return CallResponse('TimeOut');
    }
    function onTcpOnRecved(Check) {
        top.API.displayMessage("onTcpOnRecved is done,Check:" + Check);
        if (00 == Check) {
            return CallResponse('OK');
        } else { 
            return CallResponse('TimeOut');
        };
    }
    function onTcpTimeout() {
        top.API.displayMessage("onTcpTimeout is done");
        return CallResponse('TimeOut');
    }

    //Register the event
    function EventLogin() {
        top.API.Tcp.addEvent("SendFailed", onTcpSendFailed);
        top.API.Tcp.addEvent("OnRecved", onTcpOnRecved);
        top.API.Tcp.addEvent("Timeout", onTcpTimeout);
    }

    function EventLogout() {
        top.API.Tcp.removeEvent("SendFailed", onTcpSendFailed);
        top.API.Tcp.removeEvent("OnRecved", onTcpOnRecved);
        top.API.Tcp.removeEvent("Timeout", onTcpTimeout);
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
