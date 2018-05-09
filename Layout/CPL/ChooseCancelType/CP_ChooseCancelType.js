; (function(){
    var CallResponse = App.Cntl.ProcessOnce (function (Response) { 
            //TO DO:
            Clearup();
            //Entry the flows control process.
            App.Cntl.ProcessDriven( Response );
        }),
        Initialize = function() {
            EventLogin();
            //@initialize scope start
             
            if(!top.API.gbWXCancel_DEAL){ $("#CancelAccountByWX").hide(); } //微信销户关闭
            App.Timer.TimeoutDisposal(TimeoutCallBack);
        }();//Page Entry

    //@User ocde scope start
    document.getElementById('Exit').onclick = function(){
        top.ErrorInfo = top.API.PromptList.No2;
        return CallResponse('Exit');
    }

    document.getElementById('Back').onclick = function(){
        return CallResponse('Back');
    }

    // 微信销户
    document.getElementById('CancelAccountByWX').onclick = function(){
        top.API.gTransactiontype = "WXACCDELETE"; // 微信销户
        return CallResponse('CancelAccountByWX');
    }

    // 转账销户
    document.getElementById('CancelAccountByTransfer').onclick = function(){
        return CallResponse('CancelAccountByTransfer');
    }
   
    //@User code scope end 

    //event handler  
   
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
    function Clearup(){
        //TO DO:
        EventLogout();
        App.Timer.ClearTime();
    }
})();
