;
(function() {
	var $errTip = $(".errTip"),
		$money  = $("#CNMoney");

    var Inputdata = "";
    var EnterKey = false;
    var bFirstKey = true;

    var CallResponse = App.Cntl.ProcessOnce(function(Response) {
            //TO DO:
            Clearup();
            App.Cntl.ProcessDriven(Response);
        }),
        Initialize = function() {
            EventLogin();

            setData();

            //@initialize scope start
            App.Timer.TimeoutDisposal(TimeoutCallBack);
        }(); //Page Entry

    function ButtonDisable() {
        document.getElementById('Exit').disabled = true;
        document.getElementById('OK').disabled = true;
        document.getElementById('Back').disabled = true;

    }

    function ButtonEnable() {
        document.getElementById('Exit').disabled = false;
        document.getElementById('OK').disabled = false;
        document.getElementById('Back').disabled = false;
    }
    //@User ocde scope start
    document.getElementById('Exit').onclick = function() {
        top.ErrorInfo = top.API.PromptList.No2;
        return CallResponse('Exit');
    }

    document.getElementById('OK').onclick = function() {
        
        return CallResponse('OK');
        top.API.displayMessage("点击OK按钮");
    }
	

    document.getElementById('Back').onclick = function() {

        return CallResponse('Back');
    }

    //@User code scope end
    function setData(){
        $(".cardNum").html( top.changeCardNum(top.API.gCardno) );
        $(".name").html( top.changeName(top.API.gCustomerName) );
        $(".CNMoney").html( top.API.PCABalance );        
    }

    //Register the event
    function EventLogin() {
    }

    function EventLogout() {
    }

    //Countdown function
    function TimeoutCallBack() {

        top.ErrorInfo = top.API.PromptList.No3;
        return CallResponse('TimeOut');
    }
    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
        // top.API.Pin.CancelGetData();
        App.Timer.ClearTime();
    }
})();