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
       // App.Timer.TimeoutDisposal(TimeoutCallBack);
      }();//Page Entry

      function ButtonDisable() {
        document.getElementById('Back').disabled = true;
        //document.getElementById('Reset').disabled = true;
        document.getElementById('Reboot').disabled = true;
        document.getElementById('Shutdown').disabled = true;
        document.getElementById('PageRoot').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Back').disabled = false;
        //document.getElementById('Reset').disabled = false;
        document.getElementById('Reboot').disabled = false;
        document.getElementById('Shutdown').disabled = false;
        document.getElementById('PageRoot').disabled = false;
    }

   //@User ocde scope start
    document.getElementById('Back').onclick = function(){
        ButtonDisable();
         return CallResponse('Back');
    }

   // document.getElementById('Reset').onclick = function(){

   //       //return CallResponse('Back');
   //  }

    document.getElementById('Reboot').onclick = function(){
        ButtonDisable();
         return CallResponse('RebootOrNot');
    }

    document.getElementById('Shutdown').onclick = function(){
        ButtonDisable();
         return CallResponse('ShutdownOrNot');
    }

    document.getElementById("PageRoot").onclick = function () {
        ButtonDisable();
        return CallResponse("Exit");
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
