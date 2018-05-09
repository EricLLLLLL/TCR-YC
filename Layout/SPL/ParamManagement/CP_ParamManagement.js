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
          document.getElementById('AddNoteMode').disabled = true;
          document.getElementById('CashBox').disabled = true;
          document.getElementById('Action').disabled = true;
        //
        //App.Timer.TimeoutDisposal(TimeoutCallBack);
      }();//Page Entry

   //@User ocde scope start
    document.getElementById('Back').onclick = function(){

         return CallResponse('Back');
    }
    document.getElementById('PageRoot').onclick = function(){
      
               return CallResponse('Exit');
          } 				
    
    document.getElementById('TerminalNumber').onclick = function(){

         return CallResponse('TerminalNumber');
    }

    document.getElementById('AgencyNumber').onclick = function(){

         return CallResponse('AgencyNumber');
    }
    document.getElementById('BankNumber').onclick = function(){

         return CallResponse('BankNumber');
    }

    // document.getElementById('AddNoteMode').onclick = function(){

    //      return;
    // }

    document.getElementById('Test').onclick = function(){

         return CallResponse('Test');
    }
    				
    document.getElementById('Methods').onclick = function(){

         return CallResponse('Methods');
    }

    document.getElementById('Param').onclick = function(){

         return CallResponse('Param');
    }

    // document.getElementById('CashBox').onclick = function(){

    //      return;
    // }

    // document.getElementById('Action').onclick = function(){

    //      return;
    // }

    document.getElementById('View').onclick = function(){

         return CallResponse('View');
    }
    
   
   //@User code scope end 

    //event handler
     
   
    //Register the event
    function EventLogin() {
      //top.API.Crd.addEvent('CardAccepted',onCardAccepted);
    }

    function EventLogout() {
      //top.API.Crd.removeEvent('CardAccepted',onCardAccepted);
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
