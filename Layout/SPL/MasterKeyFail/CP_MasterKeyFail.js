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
         document.getElementById('reasonTips').innerText = top.ErrorInfo ;
     
        //App.Timer.TimeoutDisposal(TimeoutCallBack);
      }();//Page Entry
      
   //@User ocde scope start
    document.getElementById('Back').onclick = function(){

         return CallResponse('Back');
    }

    // document.getElementById('OK').onclick = function(){
      
    //      return CallResponse('OK');
    // }
   
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
