; (function(){
    var CallResponse = App.Cntl.ProcessOnce (function (Response) { 
    //TO DO:
         Clearup();
        //Entry the flows control process.
          App.Cntl.ProcessDriven( Response );
        }),
       Initialize = function() {
        document.getElementById('messageTitle').innerText = "交易失败";
        document.getElementById('messageReason').innerText = top.API.gErrorInfo;
        EventLogin();
      //@initialize scope start
        //top.API.Crd.AcceptAndReadTracks('2,3', 20000); 
         
        ButtonDisable();
        ButtonEnable();
        App.Timer.TimeoutDisposal(TimeoutCallBack);
      }();//Page Entry

 //@User ocde scope start
   function ButtonDisable() {
        top.API.displayMessage("ButtonDisable");
        document.getElementById('OK').disabled = true;
        document.getElementById('PageRoot').disabled = true;
    }

    function ButtonEnable() {
        top.API.displayMessage("ButtonEnable");
        document.getElementById('OK').disabled = false;
        document.getElementById('PageRoot').disabled = false;
    }
    document.getElementById('OK').onclick = function () {
        top.API.displayMessage("点击<确认>");
        ButtonDisable();
        return CallResponse('Exit');
    };
        document.getElementById('PageRoot').onclick = function() {
        ButtonDisable();
        return CallResponse('BackHomepage');
    };
   //@User code scope end 

    //event handler
    
   
    //Register the event
    function EventLogin() {
       
    }

    function EventLogout() {
       
    }

       //Countdown function
    function TimeoutCallBack() {
        
        return CallResponse('TimeOut');
     }
      //remove all event handler
    function Clearup(){
      //TO DO:
    EventLogout();
      App.Timer.ClearTime();
    }
})();
