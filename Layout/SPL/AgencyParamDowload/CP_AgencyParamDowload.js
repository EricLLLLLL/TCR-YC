; (function(){
  var AddNoteValue;
  var CallResponse = App.Cntl.ProcessOnce (function (Response) { 
  //TO DO:
       Clearup();
      //Entry the flows control process.
        App.Cntl.ProcessDriven( Response );
      }),
     Initialize = function() {
      // document.getElementById('PageTitle').innerText = '';
      EventLogin();
    //@initialize scope start
      // top.API.Crd.AcceptAndReadTracks('2,3', 20000); 
       
      //
      App.Timer.TimeoutDisposal(TimeoutCallBack);
    }();//Page Entry

 //@User ocde scope start
  document.getElementById('Back').onclick = function(){

       return CallResponse('Back');
  }
  document.getElementById('PageRoot').onclick = function(){
    
        return CallResponse('Exit');
}
  
  

  
  document.getElementById('OK').onclick = function(){
    AddNoteValue = $("#ParamSelect option:selected").val();
    return CallResponse('TradeSuccess');
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
