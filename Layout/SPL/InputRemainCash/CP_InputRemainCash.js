; (function(){
    var RemainCashInput = document.getElementById('RemainCashInput');
    var RemainCashInput_tip = document.getElementById('RemainCashInput_tip');
    var Element;
    var CallResponse = App.Cntl.ProcessOnce (function (Response) { 
    //TO DO:
         Clearup();
        //Entry the flows control process.
          App.Cntl.ProcessDriven( Response );
        }),
       Initialize = function() {
        EventLogin();
      //@initialize scope start
         App.Plugin.Keyboard.show("5", "KeysDiv", "Keyboards");
         $("#KeysDiv").css({
             "left": "580px",
             "top": "200px"
         })
        RemainCashInput.focus();
        Element = RemainCashInput;        
        App.InputEdit.getCurPosition(RemainCashInput);
        //
        // App.Timer.TimeoutDisposal(TimeoutCallBack);
      }();//Page Entry

    function ButtonDisable() {
        top.API.displayMessage("ButtonDisable");       
        document.getElementById('OK').disabled = true;
        document.getElementById('Back').disabled = true;
        // document.getElementById('PageRoot').disabled = true;
    }
    //解禁按钮
    function ButtonEnable() {
        top.API.displayMessage("ButtonEnable");       
        //document.getElementById('loadImg').style.display = "none";
        document.getElementById('OK').disabled = false;
        document.getElementById('Back').disabled = false;
        // document.getElementById('PageRoot').disabled = false;
    }
   //@User ocde scope start
    document.getElementById('Back').onclick = function(){
        ButtonDisable();
         return CallResponse('Back');
    }
    document.getElementById("PageRoot").onclick = function () {
      ButtonDisable();
        return CallResponse("Exit");
    }
    document.getElementById('OK').onclick = function(){
        ButtonDisable();
        if(RemainCashInput.value == "")
        {
            RemainCashInput_tip.innerText = "必输项， 不能为空";
            ButtonEnable();
        }
        else{
          top.API.displayMessage("SetDataSync REMAINCASHUNIT:"+RemainCashInput.value);  
          top.API.Dat.SetDataSync("REMAINCASHUNIT", "STRING", RemainCashInput.value);//设置钞箱总金额，轧账用
          return CallResponse('OK');
        }       
    }
    //输入框点击事件
    RemainCashInput.onclick = function () {
        /*
        if (!bGetData) {
            top.API.Dat.GetPersistentData("ADMININFO", "STRING");
        }*/
        RemainCashInput.focus();
        Element = RemainCashInput;        
        App.InputEdit.getCurPosition(RemainCashInput);
    }

    //var oKeyboardKey = document.getElementsByClassName("KeyboardKey");
   // var oKeyboardKey = document.getElementById("Keyboard").getElementsByTagName("span");
    var oKeyboardKey = document.getElementsByName("Name_Keyboard");
    for (var i = 0; i < oKeyboardKey.length; i++) {
        var keyEvent = oKeyboardKey[i];
        //if(keyEvent)
        top.API.displayMessage("keyEvent = "+keyEvent.className);  
        keyEvent.onclick = function (e) {
            ClearTip();
            KeyInputFlag = 1;
            if ('退格' == this.innerText) {
                App.InputEdit.getInput(Element, 1, "BS");
            } else if ('清除' == this.innerText) {
                App.InputEdit.getInput(Element, 1, "CLEAR");

            }else {
                if (Element.value.length < 12) {
                        App.InputEdit.getInput(Element, 0, this.innerText);
                } 
            }
        }
    }

    function ClearTip() {
        RemainCashInput_tip.innerText = "";
    }
    //清除输入
    function onClearNum() {
          RemainCashInput.value = "";
          RemainCashInput.focus();
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
    function Clearup(){
      //TO DO:
    EventLogout();
      App.Timer.ClearTime();
    }
})();
