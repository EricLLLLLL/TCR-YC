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
        
         
        //
        //App.Timer.TimeoutDisposal(TimeoutCallBack);
      }();//Page Entry

   //@User ocde scope start

    document.getElementById("PageRoot").onclick = function () {

        return CallResponse("Exit");
    }

    document.getElementById('selectStatus').onclick = function(){
      
         return CallResponse('Checkstatus');
    }
    // document.getElementById('selectCheck').onclick = function(){
      
    //      return CallResponse('TRANSACTION_TOTAL_INQURE');
    // }
    document.getElementById('selectCash').onclick = function(){
      
         return CallResponse('CASH_REPN');
    }
    // document.getElementById('selectCard').onclick = function(){
      
    //      return CallResponse('CLEAR_RETAINED_CARD');
    // }

    document.getElementById('selectOther').onclick = function(){
      
         return CallResponse('OtherManage');
    }
   
   //@User code scope end 

    //event handler
   
    //Register the event
    function EventLogin() {
        //top.API.Crd.addEvent('CardInserted',onCardInserted);      
    }

    function EventLogout() {
       //top.API.Crd.removeEvent('CardInserted',onCardInserted);

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
