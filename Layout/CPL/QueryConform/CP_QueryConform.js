/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        ButtonDisable();
        //@initialize scope start
		document.getElementById("Balance").value = top.API.gCURRENTBALANCE;
		document.getElementById("AvailableBalance").value = top.API.gAVAILABLEBALANCE;
        ButtonEnable();
        App.Plugin.Voices.play("voi_33");
    }();//Page Entry

    //@User ocde scope start
    function ButtonDisable() {
        document.getElementById('Exit').disabled = true;
        document.getElementById('Back').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Exit').disabled = false;
        document.getElementById('Back').disabled = false;
    }

    document.getElementById("Exit").onclick = function () {
        ButtonDisable();
        top.API.Jnl.PrintSync("SelectCancel");
        top.ErrorInfo = top.API.PromptList.No2;
        return CallResponse("Exit");
    }

    document.getElementById("Back").onclick = function () {
        ButtonDisable();
        return CallResponse("NeedInitData");
    }

    //@User code scope end

    //event handler

    //Countdown function
    function TimeoutCallBack() {
        top.API.Jnl.PrintSync("PageTimeOut");
        top.ErrorInfo = top.API.PromptList.No3;
        return CallResponse('TimeOut');
    }

    //Page Return
    

    //remove all event handler
    function Clearup() {
        App.Plugin.Voices.del();
        App.Timer.ClearTime();
    }




})();