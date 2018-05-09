; (function(){
    var cardNum = "",  // 卡号
        balance = "";  // 余额

    var CallResponse = App.Cntl.ProcessOnce (function (Response) { 
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven( Response );
    }),
    Initialize = function() {
        ButtonDisable();
        //@initialize scope start
        cardNum = top.API.gCardno;
        balance = top.API.Dat.GetDataSync("QRYEXCHANGERESULT", "STRING").toArray()[0]; // 获取余额返回值
        top.API.balance = balance.slice(4,19).split(" ")[0];  // 处理余额值
        
        top.API.displayMessage("top.API.balance="+top.API.balance);
        ButtonEnable();
        $("#cardNum").val(cardNum);
        $("#Balance").val(top.API.balance);
         
        //
        App.Timer.TimeoutDisposal(TimeoutCallBack);
    }();//Page Entry

    function ButtonDisable() {
        document.getElementById('Exit').disabled = true;
        document.getElementById('OK').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Exit').disabled = false;
        document.getElementById('OK').disabled = false;
    }

    //@User ocde scope start
    document.getElementById('Exit').onclick = function(){
        // top.API.displayMessage("退卡");
        ButtonDisable();
        top.ErrorInfo = top.API.PromptList.No2;
        return CallResponse('Exit');
    }

    document.getElementById('OK').onclick = function(){
        // top.API.displayMessage("继续");
        ButtonDisable();
        return CallResponse('OK');
    }
   
    //@User code scope end 

    //Countdown function
    function TimeoutCallBack() {
        top.ErrorInfo = top.API.PromptList.No3;
        return CallResponse('TimeOut');
    }
    //remove all event handler
    function Clearup(){
        //TO DO:
        //EventLogout();
        App.Timer.ClearTime();
    }
})();
