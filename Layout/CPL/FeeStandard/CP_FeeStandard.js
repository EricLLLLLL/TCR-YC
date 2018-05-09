;
(function () {
  var CallResponse = App.Cntl.ProcessOnce(function (Response) {
      //TO DO:
      Clearup();
      //Entry the flows control process.
      App.Cntl.ProcessDriven(Response);
    }),
    Initialize = function () {
      document.getElementById('PageTitle').innerText = '';
      EventLogin();
      //@initialize scope start
    }(); //Page Entry

  //@User ocde scope start
  document.getElementById('Exit').onclick = function () {

    return CallResponse('Exit');
  }

  document.getElementById('OK').onclick = function () {

    return CallResponse('OK');
  }

  document.getElementById('PageRoot').onclick = function () {
    ButtonDisable();

    return CallResponse('BackHomepage');
  }
  //@User code scope end 

  //event handler

  //event handler
  function onCardAccepted() {
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
  function Clearup() {
    //TO DO:
    EventLogout();
    App.Timer.ClearTime();
  }
})();