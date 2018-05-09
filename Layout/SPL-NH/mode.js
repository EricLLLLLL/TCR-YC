; (function(){
    var Initialize = function() {
	  //EventLogin();
    //@initialize scope start    
    
    //
    App.Timer.TimeoutDisposal(TimeoutCallBack);
    }();//Page Entry

    //@User ocde scope start
    document.getElementById("Exit").onclick = function(){

         return CallResponse("Exit");
    }

    document.getElementById("OK").onclick = function(){
      
         return CallResponse("OK");
    }
   
    //@User code scope end 

    //event handler
    
   
    //Register the event
    function EventLogin() {
      //top.API.Crd.addEvent("CardInserted",onCardInserted);        
    }

    function EventLogout() {
      //top.API.Crd.removeEvent("CardInserted",onCardInserted);       
    }

    //Countdown function
    function TimeoutCallBack() {
        
      return CallResponse("TimeOut");
    }
       //Page Return
    function  CallResponse ( Response ) { 
      //TO DO:
      Clearup();
      //Entry the flows control process.
      App.Cntl.ProcessDriven( Response );
    }
      //remove all event handler
    function Clearup(){
      //TO DO:
	  //EventLogout();
      App.Timer.ClearTime();
    }
})();