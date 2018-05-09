/*@create by:  hj
*@time: 2016年11月23日
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
        document.getElementById('Back').disabled = true;
        document.getElementById('Continue').disabled = true;
    }

    function ButtonEnable() {
        top.API.displayMessage("ButtonEnable");
        document.getElementById('Back').disabled = false;
        document.getElementById('Continue').disabled = false;
    }


    document.getElementById("Back").onclick = function () {
        top.API.displayMessage("点击Back按钮,响应<Back>");
        ButtonDisable();
        return CallResponse("Back");
    }

    document.getElementById("Continue").onclick = function () {
        top.API.displayMessage("点击Continue按钮,响应<OK>");
        ButtonDisable();
        top.API.gReadIdCardFlag = 1;
        return CallResponse("OK");
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
        App.Timer.ClearTime();
    }
})();