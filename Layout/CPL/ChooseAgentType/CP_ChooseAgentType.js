/*@create by:  hj
*@time: 2016年11月24日
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
        ButtonDisable();
		App.Plugin.Voices.play("voi_37");
		top.API.gReadIdCardFlag = 0;
        ButtonEnable();
    }();//Page Entry

    //@User ocde scope start
    function ButtonDisable() {
        document.getElementById('Back').disabled = true;
        document.getElementById('Exit').disabled = true;
        document.getElementById('AgentBtn').disabled = true;
        document.getElementById('SelfBtn').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Back').disabled = false;
        document.getElementById('Exit').disabled = false;
        document.getElementById('AgentBtn').disabled = false;
        document.getElementById('SelfBtn').disabled = false;
    }

    document.getElementById('Back').onclick = function () {
        ButtonDisable();
        return CallResponse('Back');
    }

    document.getElementById('Exit').onclick = function () {
        ButtonDisable();
        top.ErrorInfo = top.API.PromptList.No2;
        return CallResponse('Exit');
    }

    document.getElementById('AgentBtn').onclick = function () {
        top.API.displayMessage("代理人办理");
        ButtonDisable();
        top.API.gReadIdCardFlag = 1;
        return CallResponse('OK');
    }
    document.getElementById('SelfBtn').onclick = function () {
        top.API.displayMessage("本人办理");
        ButtonDisable();
        top.API.gReadIdCardFlag = 0;
        return CallResponse('OK');
    }
    //@User code scope end 
    function TimeoutCallBack() {
        top.ErrorInfo = top.API.PromptList.No3;
        return CallResponse('TimeOut');
    }
    //Page Return
    
    //remove all event handler
    function Clearup() {
        //TO DO:
        App.Plugin.Voices.del();
        App.Timer.ClearTime();
    }
})();
