;
(function() {
    var CallResponse = App.Cntl.ProcessOnce(function(Response) {
            //TO DO:
            Clearup();
            //Entry the flows control process.
            App.Cntl.ProcessDriven(Response);
        }),
        Initialize = function() {
            EventLogin();
            //@initialize scope start
            App.Timer.TimeoutDisposal(TimeoutCallBack);
        }(); //Page Entry

    //@User ocde scope start
    document.getElementById('Exit').onclick = function() {

        return CallResponse('Exit');
    }

    document.getElementById('OK').onclick = function() {

        return CallResponse('OK');
    }

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
    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
        App.Timer.ClearTime();
    }
})();