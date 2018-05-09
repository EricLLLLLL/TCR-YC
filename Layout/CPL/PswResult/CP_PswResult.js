/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {
    var TransType = null;
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        //EventLogin();
        //@initialize scope start
        ButtonDisable();
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        document.getElementById("Logo-Err").style.display = "block";
        if (top.API.gResponsecode != '00') {
            document.getElementById("Back").style.display = "block";
        }
        document.getElementById("tip_label").innerText = top.ErrorInfo;
        top.ErrorInfo = top.API.PromptList.No6;
        ButtonEnable();
    } (); //Page Entry

    //@User ocde scope start
    function ButtonDisable() {
        top.API.displayMessage("ButtonDisable");
        document.getElementById('Exit').disabled = true;
        document.getElementById('Back').disabled = true;
    }

    function ButtonEnable() {
        top.API.displayMessage("ButtonEnable");
        document.getElementById('Exit').disabled = false;
        document.getElementById('Back').disabled = false;
    }

    document.getElementById('Exit').onclick = function () {
        top.API.displayMessage("点击<退出>按钮,响应<Exit>");
        ButtonDisable();
        return CallResponse('Exit');
    }

    document.getElementById('Back').onclick = function () {
        top.API.displayMessage("点击<重新办理>按钮,响应<RePsw>");
        ButtonDisable();
        return CallResponse('RePsw');
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
        App.Timer.ClearTime();
    }
})();
