; (function(){
    var OldPsw     = document.getElementById('OldPsw'),
    NewPsw     = document.getElementById('NewPsw'),
    SecondNewPsw = document.getElementById('SecondNewPsw'),
    KeyboardId = document.getElementById("KeysDiv"),
    oldPswTip  = document.getElementById("oldpswTip"),

    newPswTip1 = document.getElementById("newpswTip1"),
    newPswTip2 = document.getElementById("newpswTip2"),
    strOldPs  = "",
    strNewPs  = "",
    strSecondNewPsw = "",
    InputFlag = 1,//0代表员工号，1代表原密码，2代表新密码，3代表确认新密码
    UpFlag    = 0,
    StatusFlag = 1;

    var CallResponse = App.Cntl.ProcessOnce (function (Response) { 
    //TO DO:
         Clearup();
        //Entry the flows control process.
          App.Cntl.ProcessDriven( Response );
        }),
       Initialize = function() {
        EventLogin();
      //@initialize scope start

        App.Plugin.Keyboard.show("4", "PageSubject", "KeyboardDiv");      
        $("#Keyboard").css({"left":"300px","top":"400px"});
        //KeyboardId.setAttribute("style","top:320px;");
        //fun();
        
        Element = OldPsw;
        App.InputEdit.getCurPosition(OldPsw);
        OldPsw.focus();
        //document.getElementById("KeyboardKey_set").id = "KeyboardKey_login";
        //
        //App.Timer.TimeoutDisposal(TimeoutCallBack);
      }();//Page Entry

   //@User ocde scope start
    document.getElementById('Back').onclick = function(){

         return CallResponse('Back');
    }

    document.getElementById("PageRoot").onclick = function () {
//        ButtonDisable();
        return CallResponse("Exit");
    }
    
    /*
    document.getElementById('OK').onclick = function(){
      StatusFlag = 1;
      Chekck();
      if(StatusFlag == 1)
      {
        top.API.Dat.GetPersistentData("ADMININFO", "STRING");
         //return CallResponse('TradeSuccess');
      }      
    }
    */
    
    document.getElementById('KeyboardKeys_set').onclick = function () {
      StatusFlag = 1;
      Chekck();
      if(StatusFlag == 1)
      {
        top.API.Dat.GetPersistentData("ADMININFO", "STRING");
         //return CallResponse('TradeSuccess');
      } 
    }

    function Chekck(){
      if(OldPsw.value == "")
      {
        oldPswTip.innerText = "旧密码不能为空!";
        StatusFlag = 0;
      }
      else if(OldPsw.value.length < 6)
      {
        oldPswTip.innerText = "旧密码不能少于6位!";
        StatusFlag = 0;
      }

      if(NewPsw.value == "")
      {
        newPswTip1.innerText = "新密码不能为空!";
        StatusFlag = 0;
      }
      else if(NewPsw.value.length < 6)
      {
        newPswTip1.innerText = "新密码不能少于6位!";
        StatusFlag = 0;
      }

      if(SecondNewPsw.value == "")
      {
        newPswTip2.innerText = "密码不能为空!";
        StatusFlag = 0;
      }
      else if(SecondNewPsw.value.length < 6)
      {
        newPswTip2.innerText = "密码不能少于6位!";
        StatusFlag = 0;
      }

      if(SecondNewPsw.value != NewPsw.value)
      {
        newPswTip2.innerText = "两次密码不一致!";
        StatusFlag = 0;
      }

      if(OldPsw.value != top.API.PasswordLogin)
      {
        oldPswTip.innerText = "旧密码错误!";
        StatusFlag = 0;
      }

      if(OldPsw.value == NewPsw.value)
      {
        oldPswTip.innerText = "请确保新旧密码不一致!";
        StatusFlag = 0;
      }
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
            if (inputId == "OldPsw") {
                InputFlag = 1;
            }else if(inputId == "NewPsw") {
                InputFlag = 2;
            }else{
                InputFlag = 3;   
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
        if (InputFlag == 1) {
            OldPsw.value = "";
            strOldPs = "";
            oldPswTip.innerHTML = "";
            OldPsw.focus();
        }else if(InputFlag == 2){
            NewPsw.value = "";
            strNewPs = "";
            newPswTip1.innerHTML = "";
            NewPsw.focus();
        }else{
            SecondNewPsw.innerText = "";
            strSecondNewPsw = "";
            newPswTip2.innerHTML = "";
            SecondNewPsw.focus();
        }
    }

    //输入框点击事件
    OldPsw.onclick = function () {
        Element = OldPsw;
        App.InputEdit.getCurPosition(OldPsw);
    }

    NewPsw.onclick = function () {
        Element = NewPsw;
        App.InputEdit.getCurPosition(NewPsw);
    }

    SecondNewPsw.onclick = function () {
      Element = SecondNewPsw;
        App.InputEdit.getCurPosition(SecondNewPsw);
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
        oldPswTip.innerText = "";
        newPswTip1.innerText = "";
        newPswTip2.innerText = "";
    }


    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        if ('ADMININFO' == DataName) {
            bGetData = true;
            var arrDataValue = DataValue;
            top.API.AdminInfoObjStr = arrDataValue.toString();
            AdminObj = eval('(' + top.API.AdminInfoObjStr + ')');
            AdminInfo = AdminObj.AdminInfo;

            for (var i = 0; i < AdminInfo.length; i++) {
                if (top.API.User == AdminInfo[i].user) {
                    AdminInfo[i].pw = NewPsw.value;
                    top.API.PasswordLogin = NewPsw.value;
                    break;
                }
            }
            var arrTotalFlag = new Array(JSON.stringify(AdminObj));
            top.API.Dat.SetPersistentData("ADMININFO", "STRING", arrTotalFlag);

        }


    }

    function onDatGetPersistentDataError(DataName, ErrorCode) {
        if ('ADMININFO' == DataName) {
            top.API.displayMessage("onDatGetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        }
    }

    function onDatSetPersistentDataComplete(DataName) {
        top.API.displayMessage("onDatSetPersistentDataComplete is done,DataName=" + DataName);
        if(DataName == "ADMININFO")
        {
            top.API.Dat.SetPersistentData(top.API.FIRSTADMINTag,top.API.FIRSTADMINType,"0");
        }
        else 
        {
            return CallResponse('TradeSuccess');
        }
    }

    function onDatSetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatGetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
    }
   //@User code scope end 

    //event handler
      
   
    //Register the event
    function EventLogin() {
      top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
      top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
        
      top.API.Dat.addEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
      top.API.Dat.addEvent("SetPersistentDataError", onDatSetPersistentDataError);
    }

    function EventLogout() {
      top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
      top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
       
      top.API.Dat.removeEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
      top.API.Dat.removeEvent("SetPersistentDataError", onDatSetPersistentDataError);
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
