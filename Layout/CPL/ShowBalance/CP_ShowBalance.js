;
(function () {
  var Initialize = function () {
    EventLogin();
    //@initialize scope start   
    // 控制按钮是否可点击 需要控制的按钮的id
   // BtnEnable(BtnIdArr); // 可以点击
    //BtnDisable(BtnIdArr); // 失效 不能点击 
     ButtonDisable();
     ButtonEnable();
    showbalanceinfo()
    App.Timer.TimeoutDisposal(TimeoutCallBack, ButtonDisable);
  }(); //Page Entry
  //
 // var BtnIdArr = ['Exit', 'OK'];
  //@User ocde scope start
function showbalanceinfo()
{
        cardNum = top.API.gCardno;
        var currentbalance = top.API.gCURRENTBALANCE;
        var availablebalance = top.API.gAVAILABLEBALANCE;
        top.API.displayMessage("balance info=" + cardNum + currentbalance + availablebalance);
        document.getElementById("cardType").innerText = cardNum;
        document.getElementById("accountBalance").innerText = currentbalance;
        document.getElementById("monthLimit").innerText = 0.00;
        document.getElementById("usableLimit").innerText = 0.00;
        document.getElementById("AdvisableMoney").innerText = availablebalance;
}

      function ButtonDisable(){
          document.getElementById('Exit').disabled = true;
          document.getElementById('Continue').disabled = true;
          document.getElementById('PageRoot').disabled = true;
     } 
     
     function ButtonEnable(){
          document.getElementById('Continue').disabled = false;
          document.getElementById('Exit').disabled = false;
          document.getElementById('PageRoot').disabled = false;
     }  

    document.getElementById("PageRoot").onclick = function () {
        ButtonDisable();
        return CallResponse("BackHomepage");
    };

  // document.getElementById("OK").onclick = function () {
  //    ButtonDisable();
  //    return CallResponse("Exit");
  //  };
     document.getElementById("Exit").onclick = function () {
        ButtonDisable();
        top.API.gNotINQ = true;
         return CallResponse("Exit");
   };

    document.getElementById('Continue').onclick = function () {
        ButtonDisable();
        top.API.gNotINQ = true;
        return CallResponse("NeedInitData");
    };

  //@User code scope end 

  //event handler


  //Register the event
  function EventLogin() {
    //top.Crd.CardInserted.connect(onCardInserted);        
  }

  function EventLogout() {
    //top.Crd.CardInserted.disconnect(onCardInserted);      
  }

  //Countdown function
  function TimeoutCallBack() {

    return CallResponse("TimeOut");
  }

  //Page Return
  function CallResponse(Response) {
    //TO DO:
    Clearup();
    //Entry the flows control process.
    App.Cntl.ProcessDriven(Response);
  }
  //remove all event handler
  function Clearup() {
    //TO DO:
    EventLogout();
    App.Timer.ClearTime();
  }
})();