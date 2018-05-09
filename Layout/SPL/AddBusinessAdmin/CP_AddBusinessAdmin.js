; (function(){
   var TellerId     = document.getElementById('TellerInput'),
    UserInput     = document.getElementById('UserInput'),
    IDcardInfo = document.getElementById('IDcardInput'),
    KeyboardId = document.getElementById("KeyboardDiv"),
    DeviceNo  = document.getElementById("DeviceNoInput"),
    TellerInput_tip = document.getElementById("TellerInput_tip"),
    IDcardInput_tip = document.getElementById("IDcardInput_tip"),
    DeviceNoInput_tip = document.getElementById("DeviceNoInput_tip"),

    //newPswTip1 = document.getElementById("newpswTip1"),
    //newPswTip2 = document.getElementById("newpswTip2"),
    strTellerId  = "",
    strUser  = "",
    strIDcardInfo = "",
    strDeviceNo = "",
    InputFlag = 0,//0代表柜员号，1代表姓名，2代表身份证，3代表机构号
    UpFlag    = 0,
    StatusFlag = 0,
    KeyBoardShowFlag = 0,
    currentID,
    Element,     
    KeyInputFlag = 0,
    ImeShowFlag = 0;
    App.Plugin.Keyboard.show("3", "KeysDiv", "Keyboards");
    $("#KeysDiv").css({
        "left": "152px",
        "top": "400px"
    })
    var CallResponse = App.Cntl.ProcessOnce (function (Response) { 
    //TO DO:
         Clearup();
        //Entry the flows control process.
          App.Cntl.ProcessDriven( Response );
        }),
       Initialize = function() {

        EventLogin();
      //@initialize scope start   

        //Element = TellerId;
        //currentID = "UserInput";
        //App.InputEdit.getCurPosition(TellerId);
        //TellerId.focus();
        ButtonDisable();
	    KeyBoardShowFlag = 1;     
            fun(); 
	    currentID = "TellerInput";
	    TellerId.focus();
	    Element = TellerId;        
	    App.InputEdit.getCurPosition(TellerId);
        top.API.AddUser = "";
        top.API.AddUserType = 2;
        top.API.AddIDCardNum = "";
        top.API.AddAgencyNum = "";
        ButtonEnable();
        //
        //App.Timer.TimeoutDisposal(TimeoutCallBack);
      }();//Page Entry

   //@User ocde scope start
    document.getElementById('Back').onclick = function(){
        ButtonDisable();
        if(KeyBoardShowFlag == 1)
        {                
            //App.Plugin.Keyboard.disappear("KeyboardDiv");  
            KeyBoardShowFlag = 0;
        }
        
         return CallResponse('Back');
    }

    document.getElementById('OK').onclick = function(){
        ButtonDisable();
        if(KeyBoardShowFlag == 1)
        {                
            //App.Plugin.Keyboard.disappear("KeyboardDiv");  
            KeyBoardShowFlag = 0;
        }
         if(TellerId.value == "")
        {
            TellerInput_tip.innerText = "必输项， 不能为空";
            ButtonEnable();
        }
        else if(IDcardInfo.value == "")
        {
            IDcardInput_tip.innerText = "必输项， 不能为空";
            ButtonEnable();
        }
        else if(DeviceNo.value == "")
        {
            DeviceNoInput_tip.innerText = "必输项， 不能为空";
            ButtonEnable();
        }
        else 
        {
            top.API.AddUser = TellerId.value;
            top.API.AddUserType = 2;
            top.API.AddIDCardNum = IDcardInfo.value;
            top.API.AddAgencyNum = DeviceNo.value;
            top.API.Dat.GetPersistentData("ADMININFO", "STRING");
        } 
    }
   
   document.getElementById("PageRoot").onclick = function () {
        ButtonDisable();
        return CallResponse("Exit");
    }

    //点击页面其他处 隐藏键盘
    document.onclick = function (e) {
        //点击 textarea框 调去输入法键盘
        e = e || window.event;
        var dom = e.srcElement || e.target;
        if (dom.id != currentID && (ImeShowFlag == 1 || KeyInputFlag == 0)) {
          
          if(KeyBoardShowFlag == 1)
            {  
                //不隐藏              
                // App.Plugin.Keyboard.disappear("KeyboardDiv");  
                KeyBoardShowFlag = 0;
            }

             if(ImeShowFlag == 1)
            {           
                top.API.Ime.HideIME('');
            }            
        }

        KeyInputFlag = 0;

    }


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
            if (inputId == "TellerInput") {
                InputFlag = 0;
            }else if(inputId == "UserInput") {
                InputFlag = 1;
            }else if(inputId == "IDcardInput") {
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
        if (InputFlag == 0) {
            TellerId.value = "";
            strTellerId = "";
            //oldPswTip.innerHTML = "";
            TellerId.focus();
        }else if(InputFlag == 1){
            UserInput.value = "";
            strUser = "";
            //newPswTip1.innerHTML = "";
            UserInput.focus();
        }else if(InputFlag == 2){
            IDcardInfo.value = "";
            strIDcardInfo = "";
            //newPswTip1.innerHTML = "";
            IDcardInfo.focus();
        }else{
            DeviceNo.value = "";
            strDeviceNo = "";
            //newPswTip2.innerHTML = "";
            DeviceNo.focus();
        }
    }

    //输入框点击事件
    TellerId.onclick = function () {
        if(ImeShowFlag == 1)
        {           
            top.API.Ime.HideIME();
        }

        if(KeyBoardShowFlag == 0)
        {

            KeyBoardShowFlag = 1;     
            fun();   
        }

        currentID = "TellerInput";
        TellerId.focus();
        Element = TellerId;        
        App.InputEdit.getCurPosition(TellerId);
    }

/*
    UserInput.onclick = function () {
        if(KeyBoardShowFlag == 1)
        {
            App.Plugin.Keyboard.disappear("KeyboardDiv");  
            //App.Plugin.Keyboard.disappear("KeyboardDiv");  
            KeyBoardShowFlag = 0;
        }
        if(ImeShowFlag == 0)
        {
           
            top.API.Ime.ShowIME('4','','');
        }
        currentID = "UserInput";
        Element = UserInput;
        UserInput.focus();
        App.InputEdit.getCurPosition(UserInput);
    }
*/
    IDcardInfo.onclick = function () {
      
      
      if(ImeShowFlag == 1)
        {            
            top.API.Ime.HideIME();
        }

        if(KeyBoardShowFlag == 0)
        {
            document.getElementById("KeysDiv").removeChild(document.getElementById("Keyboards"));
            App.Plugin.Keyboard.show("3", "KeysDiv", "Keyboards");

            KeyBoardShowFlag = 1;
            fun();
        }
        currentID = "IDcardInput";
        Element = IDcardInfo;
        IDcardInfo.focus();
        App.InputEdit.getCurPosition(IDcardInfo);
    }

    DeviceNo.onclick = function () {
        
        if(ImeShowFlag == 1)
        {       
            top.API.Ime.HideIME();
        }

        if(KeyBoardShowFlag == 0)
        {
            document.getElementById("KeysDiv").removeChild(document.getElementById("Keyboards"));
            App.Plugin.Keyboard.show("3", "KeysDiv", "Keyboards");

            fun();
        }
        currentID = "DeviceNoInput";
        Element = DeviceNo;
        DeviceNo.focus();
        App.InputEdit.getCurPosition(DeviceNo);
    }


   function fun(){

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

            }else if ('小写' == this.innerText) {
                //App.Plugin.Keyboard.disappear("KeyboardDiv");  
                KeyBoardShowFlag = 0;
                document.getElementById("KeysDiv").removeChild(document.getElementById("Keyboards"));
                App.Plugin.Keyboard.show("6", "KeysDiv", "Keyboards");

                KeyBoardShowFlag = 1;
                fun();
                //App.InputEdit.getInput(Element, 1, "CLEAR");            
            } else if ('大写' == this.innerText) {
                //App.Plugin.Keyboard.disappear("KeyboardDiv");  
                KeyBoardShowFlag = 0;
                document.getElementById("KeysDiv").removeChild(document.getElementById("Keyboards"));
                App.Plugin.Keyboard.show("3", "KeysDiv", "Keyboards");

                KeyBoardShowFlag = 1;
                fun();
                //App.InputEdit.getInput(Element, 1, "CLEAR");            
            }else {
                if(currentID == "TellerInput" || currentID == "DeviceNoInput")
                {
                    if (Element.value.length < 6) {
                        App.InputEdit.getInput(Element, 0, this.innerText);
                    }
                }
                else if(currentID == "IDcardInput")
                {
                   if (Element.value.length < 18) {
                        App.InputEdit.getInput(Element, 0, this.innerText);
                    } 
                }
            }
        }
    }
    }

     function ClearTip() {
        TellerInput_tip.innerText = "";
        IDcardInput_tip.innerText = "";
        DeviceNoInput_tip.innerText = "";
        //password_tip.innerText = "";
    }

     //禁止按钮
    function ButtonDisable() {
        top.API.displayMessage("ButtonDisable");       
        document.getElementById('OK').disabled = true;
        document.getElementById('Back').disabled = true;
    }
    //解禁按钮
    function ButtonEnable() {
        top.API.displayMessage("ButtonEnable");       
        //document.getElementById('loadImg').style.display = "none";
        document.getElementById('OK').disabled = false;
        document.getElementById('Back').disabled = false;
    }

    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        if ('ADMININFO' == DataName) {
            bGetData = true;
            var arrDataValue = DataValue;
            top.API.AdminInfoObjStr = arrDataValue.toString();
            AdminObj = eval('(' + top.API.AdminInfoObjStr + ')');
            AdminInfo = AdminObj.AdminInfo;

             var bTellerExist = false;
            var bIDCardInfoExist = false;
            for (var i = 0; i < AdminInfo.length; i++) {
                if (TellerInput.value == AdminInfo[i].user) {
                    bTellerExist = true;
                }

                if(IDcardInfo.value == AdminInfo[i].idcardno){
                    bIDCardInfoExist = true;
                }
            }

            if(bTellerExist)
            {
                TellerInput_tip.innerText = "业务管理员已注册，不能重复注册";
                top.API.displayMessage("业务管理员已注册，不能重复注册"); 
                ButtonEnable();  
            }
            else if(bIDCardInfoExist)
            {
                IDcardInput_tip.innerText = "业务管理员已注册，不能重复注册";
                top.API.displayMessage("业务管理员已注册，不能重复注册"); 
                ButtonEnable();
            }
            else
            {
                return CallResponse('OK');
            }
        }


    }

    function onDatGetPersistentDataError(DataName, ErrorCode) {
        if ('ADMININFO' == DataName) {
            top.API.displayMessage("onDatGetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        }
    }

    function onShowIMECompleted() {
        ImeShowFlag = 1;        
    }

    function onHideIMECompleted() {
        ImeShowFlag = 0;
    }

    function onInputResult(type, value) {
        top.API.displayMessage("进入 onInputResult***************" + type);
        if (value == "CONFIRM" || value == "CANCEL") {
            top.API.Ime.HideIME('');
        } else {
            top.API.displayMessage("Element:=========" + Element);
            if (value == "BS" || value == "CLEAR" || (currentID == "UserInput") ) {
                App.Plugin.ImeHM.getInput(currentID, type, value);                
            }
        }
    }

    function onShowIMEFailed() {
        ButtonDisable();
        top.API.displayMessage("onShowIMEFailed触发,showFlag ="+ showFlag);
        //top.API.gERRORMSG = "输入法调用失败，交易结束！";
        if (ImeShowFlag == 1) {
            //top.API.Ime.HideIME('');
        }
        top.API.Ime.HideIME('');
        //top.API.gErrorMSGFlag = 10;
        //return CallResponse("DeviceError");
    }

    function onHideIMEFailed() {
        ButtonDisable();
        top.API.displayMessage("onHideIMEFailed触发,showFlag ="+ showFlag);
        //top.API.gERRORMSG = "输入法调用失败，交易结束！";
        if (ImeShowFlag == 1) {
            //top.API.Ime.HideIME('');
        }
        top.API.Ime.HideIME('');
        //t.API.gErrorMSGFlag = 11;
        //return CallResponse("DeviceError");
    }


    //Register the event
    function EventLogin() {
        top.API.Ime.addEvent("ShowIMECompleted", onShowIMECompleted);
        top.API.Ime.addEvent("HideIMECompleted", onHideIMECompleted);
        top.API.Ime.addEvent("HideIMEFailed", onHideIMEFailed);
        top.API.Ime.addEvent("ShowIMEFailed", onShowIMEFailed);
        top.API.Ime.addEvent("InputResult", onInputResult);

        top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
    }

    function EventLogout() {
        top.API.Ime.removeEvent("ShowIMECompleted", onShowIMECompleted);
        top.API.Ime.removeEvent("HideIMECompleted", onHideIMECompleted);
        top.API.Ime.removeEvent("HideIMEFailed", onHideIMEFailed);
        top.API.Ime.removeEvent("ShowIMEFailed", onShowIMEFailed);
        top.API.Ime.removeEvent("InputResult", onInputResult);

        top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
    }

       //Countdown function
    function TimeoutCallBack() {
        if(KeyBoardShowFlag == 1)
        {                
            //App.Plugin.Keyboard.disappear("KeyboardDiv");  
            KeyBoardShowFlag = 0;
        }
        if(ImeShowFlag == 1)
        {                
            top.API.Ime.HideIME('');              
        }
        return CallResponse('TimeOut');
     }
      //remove all event handler
    function Clearup(){
      //TO DO:
        EventLogout();
        document.onclick = function(e) {}
        App.Timer.ClearTime();
    }
})();
