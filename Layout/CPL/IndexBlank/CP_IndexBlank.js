﻿; (function(){
	var CallResponse = App.Cntl.ProcessOnce( function(Response){ 
    //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven( Response );
    });
    var Initialize = function() {
      document.getElementById('PageTitle').innerText = '';
    EventLogin();
    //@initialize scope start
    top.API.Crd.AcceptAndReadTracks('2,3', 20000); 
    
    //
      App.Timer.TimeoutDisposal(TimeoutCallBack);
    }();//Page Entry

   //@User ocde scope start
    document.getElementById('Exit').onclick = function(){

         return CallResponse('Exit');
    }

    document.getElementById('OK').onclick = function(){
      
         return CallResponse('OK');
    }
   
   //@User code scope end 

    //event handler
    function onCardInserted(){

    }
    //event handler
    function onCardAccepted(){
       return CallResponse('CardAccepted');
   }   
   
    //Register the event
    function EventLogin() {
        top.API.Crd.addEvent('CardInserted',onCardInserted);
        top.API.Crd.addEvent('CardAccepted',onCardAccepted);
    }

    function EventLogout() {
       top.API.Crd.removeEvent('CardInserted',onCardInserted);
       top.API.Crd.removeEvent('CardAccepted',onCardAccepted);
    }

       //Countdown function
    function TimeoutCallBack() {
        
        return CallResponse('TimeOut');
     }
       //Page Return
    
      //remove all event handler
    function Clearup(){
      //TO DO:
    EventLogout();
      App.Timer.ClearTime();
    }
})();
