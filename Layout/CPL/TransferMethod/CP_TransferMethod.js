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
             ButtonEnable();
             //$('#otherTransfer').addClass('unsupported');//他行卡按钮变灰
            //
            App.Timer.TimeoutDisposal(TimeoutCallBack);
        }();//Page Entry

    //@User ocde scope start
    function ButtonDisable() {
        // document.getElementById('Exit').disabled = true;
        document.getElementById('Exit').disabled = true;
        document.getElementById('PageRoot').disabled = true;
    }

    function ButtonEnable() {
        // document.getElementById('Exit').disabled = false;
        document.getElementById('Exit').disabled = false;
        document.getElementById('PageRoot').disabled = false;
    }
    document.getElementById('Exit').onclick = function(){
        ButtonDisable();
        top.ErrorInfo = top.API.PromptList.No2;
        return CallResponse('Exit');
    }
    document.getElementById('PageRoot').onclick = function(){
        ButtonDisable();
        return CallResponse('BackHomepage');
    }

    // document.getElementById('Back').onclick = function(){
    //     return CallResponse('Back');
    // }

    // 行内转账
    document.getElementById('ownTransfer').onclick = function(){
        // top.API.gTransactiontype = "QRYCUSTNAME";  // 查询户名
        top.API.CashInfo.Dealtype = 'InLineFlag';
        top.API.Dat.SetDataSync("INOROUT", "STRING", ["1"]);
        // top.API.Dat.SetDataSync("DEALTYPE", "STRING", ["行内转账"]);
        top.API.Dat.SetDataSync('TFRBANK','STRING',["中国邮政储蓄银行"]);//收款行
		
		top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["行内转账"]);
        top.API.Jnl.PrintSync("Content");
        return CallResponse('ChooseInBank');
    }

     // 行外转账
     document.getElementById('otherTransfer').onclick = function(){
         // top.API.gTransactiontype = "OutLineFlag";
         top.API.CashInfo.Dealtype = 'OutLineFlag';
         top.API.Dat.SetDataSync("INOROUT", "STRING", ["2"]);
         // top.API.Dat.SetDataSync("DEALTYPE", "STRING", ["行外转账"]);
		 
		 top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["行外转账"]);
        top.API.Jnl.PrintSync("Content");
         return CallResponse('ChooseOutBank');
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
