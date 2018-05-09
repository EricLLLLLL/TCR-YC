; (function(){
    var Teller = document.getElementById("TellerInput");
    Teller.focus();
    var Element;
    var Money = document.getElementById("MoneyInput");
    Money.focus();
    var CallResponse = App.Cntl.ProcessOnce (function (Response) { 
    //TO DO:
         Clearup();
        //Entry the flows control process.
          App.Cntl.ProcessDriven( Response );
        }),
       Initialize = function() {
        EventLogin();
      //@initialize scope start
        App.Plugin.Keyboard.show("2", "PageSubject", "KeyboardDiv");
        Element = Teller;
       // App.Timer.TimeoutDisposal(TimeoutCallBack);
      }();//Page Entry

   //@User ocde scope start
   function ButtonDisable() {
    document.getElementById('PageRoot').disabled = true;
}

function ButtonEnable() {
    document.getElementById('PageRoot').disabled = false;
}
    document.getElementById('PageRoot').onclick = function(){

         return CallResponse('Back');
    }

   
   //@User code scope end 
    Teller.onclick = function () {
        Element = Teller;
        App.InputEdit.getCurPosition(Element);
    }
    Money.onclick = function () {
        Element = Money;
        App.InputEdit.getCurPosition(Element);
    }
    var oKeyboardKey = document.getElementsByClassName("KeyboardKey");
    for (var i = 0; i < oKeyboardKey.length; i++) {
        var keyEvent = oKeyboardKey[i];
        keyEvent.onclick = function (e) {
            ClearTip();
            if ('退格' == this.innerText) {
                App.InputEdit.getInput(Element, 1, "BS");
            } else if ('清除' == this.innerText) {
                App.InputEdit.getInput(Element, 1, "CLEAR");
            } else {
                if (Element.value.length < 6) {
                    App.InputEdit.getInput(Element, 0, this.innerText);
                }
            }
        }
    }
    function ClearTip() {
        TellerInput_tip.innerText = "";
        MoneyInput_tip.innerText = "";
    }

    document.getElementById('KeyboardKey_set').onclick = function () {
        if ((Teller.value == "") || (Money.value == "")) {
            if (Teller.value == "") {
                TellerInput_tip.innerText = "*柜员号不能为空";
            }
            if (Money.value == "") {
                MoneyInput_tip.innerText = "*金额不能为空";
            }
        } else {
          /**
1)输入柜员号、现金出纳机钞箱剩余金额（轧账金额）
2)现金出纳机C将柜员号、钞箱剩余金额（轧账金额）上送前置系统
3)接收前置返回信息
4)收到后台成功应答，强制打印本地汇总
          **/
          return CallResponse('OK');
        }
    }
    //event handler
    function onCardInserted(){

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
