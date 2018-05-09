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
        //@initialize scope start
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        ButtonDisable();
        ButtonEnable();
    }();//Page Entry

    //@User ocde scope start
    function ButtonDisable() {
        top.API.displayMessage("ButtonDisable");
        document.getElementById('Exit').disabled = true;
        document.getElementById('IDCheck').disabled = true;
        document.getElementById('AuthorCheck').disabled = true;
    }

    function ButtonEnable() {
        top.API.displayMessage("ButtonEnable");
        document.getElementById('Exit').disabled = false;
        document.getElementById('IDCheck').disabled = false;
        document.getElementById('AuthorCheck').disabled = false;
    }

    document.getElementById('Exit').onclick = function () {
        top.API.displayMessage("点击Exit按钮,响应<Exit>");
        ButtonDisable();
        top.ErrorInfo = top.API.PromptList.No2;
        return CallResponse('Exit');
    }

    document.getElementById('IDCheck').onclick = function () {
        top.API.displayMessage("点击身份证核查按钮,响应<OK>");
        ButtonDisable();
        return CallResponse('OK');
    }
    document.getElementById('AuthorCheck').onclick = function () {
        top.API.displayMessage("点击交易审核按钮,响应<ReAuthor>");
        ButtonDisable();
        return CallResponse('ReAuthor');
    }
    //@User code scope end 

    //event handler   

    //Countdown function
    function TimeoutCallBack() {
        top.API.displayMessage("页面超时,响应<Exit>");
        top.ErrorInfo = top.API.PromptList.No3;
        return CallResponse('Exit');
    }
    //Page Return
    
    //remove all event handler
    function Clearup() {
        //TO DO:
        App.Plugin.Voices.del();
        App.Timer.ClearTime();
    }
})();
