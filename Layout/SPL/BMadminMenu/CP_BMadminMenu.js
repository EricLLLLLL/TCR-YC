; (function(){
    var CallResponse = App.Cntl.ProcessOnce (function (Response) { 
    //TO DO:
         Clearup();
        //Entry the flows control process.
          App.Cntl.ProcessDriven( Response );
        }),
       Initialize = function() {
        document.getElementById('PageTitle').innerText = '';
        EventLogin();
      //@initialize scope start
        top.API.Crd.AcceptAndReadTracks('2,3', 20000); 
         
        //
        App.Timer.TimeoutDisposal(TimeoutCallBack);
      }();//Page Entry

   //@User ocde scope start

   
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
