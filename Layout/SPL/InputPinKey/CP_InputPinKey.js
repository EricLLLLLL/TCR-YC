; (function(){
   var FirstInput     = document.getElementById('FirstInput'),
    //SecondInput     = document.getElementById('SecondInput'),
    CheckCode = document.getElementById('CheckCode'),
    KeyboardId = document.getElementById("KeysDiv"),
   
    strFirstInput  = "",
    //strSecondInput  = "",
    strCheckCode = "",
    InputFlag = 1,//0代表员工号，1代表原密码，2代表新密码，3代表确认新密码
    UpFlag    = 0,
    StatusFlag = 0;

    var CallResponse = App.Cntl.ProcessOnce (function (Response) { 
    //TO DO:
         Clearup();
        //Entry the flows control process.
          App.Cntl.ProcessDriven( Response );
        }),
       Initialize = function() {        
        EventLogin();
      //@initialize scope start       
         
         App.Plugin.Keyboard.show("1", "PageSubject", "KeyboardDiv");      
        $("#Keyboard").css({"left":"300px","top":"400px"});
        //KeyboardId.setAttribute("style","top:320px;");
        //fun();

        Element = FirstInput;
        App.InputEdit.getCurPosition(FirstInput);
        FirstInput.focus();

        //
        //App.Timer.TimeoutDisposal(TimeoutCallBack);
      }();//Page Entry

   //@User ocde scope start
    document.getElementById('Back').onclick = function(){

         return CallResponse('Back');
    }

    document.getElementById('OK').onclick = function(){
      
         return CallResponse('OK');
    }

    function Chekck(){
      // if(OldPsw.innerText == "")
      // {
      //   oldPswTip.innerText = "旧密码不能为空!";
      //   StatusFlag = 0;
      // }
      // else of(OldPsw.innerText.length < 6)
      // {
      //   oldPswTip.innerText = "旧密码不能少于6位!";
      //   StatusFlag = 0;
      // }

      // if(NewPsw.innerText == "")
      // {
      //   newPswTip1.innerText = "新密码不能为空!";
      //   StatusFlag = 0;
      // }
      // else of(NewPsw.innerText.length < 6)
      // {
      //   newPswTip1.innerText = "新密码不能少于6位!";
      //   StatusFlag = 0;
      // }

      // if(SecondNewPsw.innerText == "")
      // {
      //   newPswTip2.innerText = "密码不能为空!";
      //   StatusFlag = 0;
      // }
      // else of(SecondNewPsw.innerText.length < 6)
      // {
      //   newPswTip2.innerText = "密码不能少于6位!";
      //   StatusFlag = 0;
      // }

      // if(SecondNewPsw.innerText != NewPsw.innerText)
      // {
      //   newPswTip2.innerText = "两次密码不一致!";
      //   StatusFlag = 0;
      // }
    }


        //键盘输入
    //User.focus();
    //判断是员工号、原密码、新密码、还是确认新密码
    var oKeyboardKeyInput = document.getElementsByTagName("input");
    for (var j = 0; j < oKeyboardKeyInput.length; j++) {
        var inpt = oKeyboardKeyInput[j];
        inpt.onclick = function (e) {
            inputId = document.activeElement.id;
            // if (inputId == "UserInput") {
            //     InputFlag = 0;
            // } else 
            if (inputId == "FirstInput") {
                InputFlag = 0;
            }else{
                InputFlag = 1;   
            }
        }
    }

    //清除输入
    function onClearNum() {
        // if (InputFlag == 0) {
        //     User.innerText = "";
        //     strUser = "";
        //     document.getElementById("user_tip").innerHTML = "";
        //     User.focus();
        // } else 
        if (InputFlag == 0) {
            FirstInput.value = "";
            strFirstInput = "";
            //oldPswTip.innerHTML = "";
            FirstInput.focus();
        }else if(InputFlag == 1){
            CheckCode.value = "";
            strCheckCode = "";
            //newPswTip1.innerHTML = "";
            CheckCode.focus();
        }
    }

    //输入框点击事件
    FirstInput.onclick = function () {
        Element = FirstInput;
        App.InputEdit.getCurPosition(FirstInput);
    }

    CheckCode.onclick = function () {
        Element = CheckCode;
        App.InputEdit.getCurPosition(CheckCode);
    }

    // SecondNewPsw.onclick = function () {
    //   Element = SecondNewPsw;
    //     App.InputEdit.getCurPosition(SecondNewPsw);
    // }
   
    var oKeyboardKey = document.getElementsByClassName("KeyboardKey");
    for (var i = 0; i < oKeyboardKey.length; i++) {
        var keyEvent = oKeyboardKey[i];
        keyEvent.onclick = function (e) {
            //ClearTip();
            if ('退格' == this.innerText) {
                App.InputEdit.getInput(Element, 1, "BS");
            } else if ('清除' == this.innerText) {
                App.InputEdit.getInput(Element, 1, "CLEAR");
            } else {
                if (Element.value.length < 16) {
                    App.InputEdit.getInput(Element, 0, this.innerText);
                }
            }
        }
    }

     function ClearTip() {
        //user_tip.innerText = "";
        //password_tip.innerText = "";
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
