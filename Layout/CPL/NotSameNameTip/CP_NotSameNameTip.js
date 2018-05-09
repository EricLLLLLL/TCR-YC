/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        App.Timer.TimeoutDisposal(TimeoutCallBack);
    }(); //Page Entry

    function ButtonDisable() {
        top.API.displayMessage("ButtonDisable");
        document.getElementById('Exit').disabled = true;
    }

    function ButtonEnable() {
        top.API.displayMessage("ButtonEnable");
        document.getElementById('Exit').disabled = false;
    }


	document.getElementById("Exit").onclick = function(){
        top.API.displayMessage("点击Exit按钮,响应<Exit>");
        ButtonDisable();
		return CallResponse("Back");
	}

    //Countdown function
    function TimeoutCallBack() {
        top.API.displayMessage("页面超时,响应<TimeOut>");
        top.ErrorInfo = top.API.PromptList.No3;
        return CallResponse("Exit");
    }
    //Page Return
    
    //remove all event handler
    function Clearup() {
        //TO DO:
        App.Timer.ClearTime();
    }
})();