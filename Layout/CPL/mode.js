;
(function () {
  var BtnIdArr = ['Ok', 'Exit']; //按钮的id数组
  var Files = new dynamicLoadFiles();
  var CallResponse = App.Cntl.ProcessOnce(function (Response) {
      //TO DO:
      Clearup();
      //Entry the flows control process.
      App.Cntl.ProcessDriven(Response);
    }),
    Initialize = function () {

      EventLogin();
      //@initialize scope start
      // 控制按钮是否可点击 
      Files.BtnDisable(BtnIdArr); // 失效 不能点
      Files.BtnEnable(BtnIdArr); // 可以点击
击
      App.Timer.TimeoutDisposal(TimeoutCallBack);
    }(); //Page Entry

  //@User ocde scope start
  document.getElementById('Exit').onclick = function () {

    return CallResponse('Exit');
  }

  document.getElementById('OK').onclick = function () {

    return CallResponse('OK');
  }

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
  function Clearup() {
    //TO DO:
    EventLogout();
    App.Timer.ClearTime();
  }
})();