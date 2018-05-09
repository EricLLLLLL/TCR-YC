// JavaScript Document
/*@create by:  tsxiong
 *@time: 2016年03月20日
 */
;(function () {
    var bFirstAdmin = false;
    var bPinOpen = false;
    var clickEnter = false;
    var bGetData = false;
    var AdminObj;
    var AdminInfo;
    var User = document.getElementById("UserInput");
    var Password = document.getElementById("PswInput");
    User.focus();
    var Element;
    var user_tip = document.getElementById("user_tip");
    var password_tip = document.getElementById("password_tip");
    var CallResponse = App.Cntl.ProcessOnce(function (Response) {
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        EventLogin();
        //单机调试时使用，打开各模块
        //top.API.OpenDevice();
        App.Plugin.Keyboard.show("2", "PageSubject", "KeyboardDiv");
        document.getElementById("KeyboardKey_set").id = "KeyboardKey_login";
        Element = User;
        if (!bGetData) {
            top.API.Dat.GetPersistentData("ADMININFO", "STRING");
        }
    }(); //Page Entry

    //输入框点击事件
    User.onclick = function () {
        /*
        if (!bGetData) {
            top.API.Dat.GetPersistentData("ADMININFO", "STRING");
        }*/
        Element = User;
        App.InputEdit.getCurPosition(Element);
    }

    Password.onclick = function () {
        /*
        if (!bGetData) {
            top.API.Dat.GetPersistentData("ADMININFO", "STRING");
        }
        */
        Element = Password;
        App.InputEdit.getCurPosition(Element);
    }

    // var oKeyboardKey = document.getElementsByTagName("span");
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

    $(document).ready(function(){
        $("#d1 a").click(function(){
            alert($(this).attr("linkId")); //这样就得到点击的链接的linkId参数了，然后你可以用这个值来做其它的事
        });
    });




    function ClearTip() {
        user_tip.innerText = "";
        password_tip.innerText = "";
    }

    document.getElementById('KeyboardKey_login').onclick = function () {
        if ((User.value == "") || (Password.value == "")) {
            if (User.value == "") {
                user_tip.innerText = "*账号不能为空";
            }
            if (Password.value == "") {
                password_tip.innerText = "*登录密码不能为空";
            }
        } else {
            var bOk = false;
            for (var i = 0; i < AdminInfo.length; i++) {
                if ((User.value == AdminInfo[i].user) && (Password.value == AdminInfo[i].pw)) {
                    bOk = true;
                    if (User.value == "00") {
                        top.API.AdminStatus = 0;
                    } else {
                        top.API.AdminStatus = AdminInfo[i].usertype;
                    }
                    break;
                }
            }
            if(top.API.Manageflg!=top.API.AdminStatus)//判断是否与登录按钮类型对应
            {
                bOk=false;
                if(top.API.AdminStatus==2&&top.API.Manageflg==1){//业务管理员与业务管理员按钮对应可以登录
                    bOk=true;
                }
                
            }
            if (bOk) {
                var ErrTip = "管理员：" + User.value + "，登录成功";
                top.API.Jnl.PrintSync("AdminLoginSuccess");
                top.API.Sys.SetIsMaintain(true);
                top.API.User = User.value;
                top.API.PasswordLogin = Password.value;
                if (User.value == "00"&&Password.value=="000000" && bFirstAdmin) {
                   // top.API.AddUserType = 1;
                    return CallResponse('FirstTimeSPL');
                }
                else
                {
                    /*
                    if(top.API.AdminStatus == 0)
                    {
                        top.API.AddUserType = 1;
                    }
                    else if(top.API.AdminStatus == 1)
                    {
                        top.API.AddUserType = 2;
                    }*/
                    return CallResponse('OK');
                }
            } else {
                var ErrTip = "管理员：" + User.value + "，登录失败";
                top.API.Jnl.PrintSync("AdminLoginFail");
                user_tip.innerText = "";
                password_tip.innerText = "*用户名或者密码错误";
            }
        }
    }

    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        if ('ADMININFO' == DataName) {
            bGetData = true;
            var arrDataValue = DataValue; 
            top.API.AdminInfoObjStr = arrDataValue.toString();
            AdminObj = eval('(' + top.API.AdminInfoObjStr + ')');
            AdminInfo = AdminObj.AdminInfo;

            top.API.Dat.GetPersistentData(top.API.FIRSTADMINTag,top.API.FIRSTADMINType);
        }
        else if(DataName == top.API.FIRSTADMINTag) 
        {
            if(DataValue[0] == 1)
            {
                bFirstAdmin = true;
            }
        }
    }

    function onDatGetPersistentDataError(DataName, ErrorCode) {
        if ('ADMININFO' == DataName) {
            top.API.displayMessage("onDatGetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        }
    }

    function EventLogin() {
        top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
    }

    function EventLogout() {
        top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
    }

    // document.getElementById('Back').onclick = function () {
    //     top.API.Sys.OpenService();
    //     top.API.Sys.OpenFrontPage();
    //     return CallResponse('Back');
    // }
    document.getElementById('PageRoot').onclick = function () {
        top.API.UnitStatusflg=0;
        return CallResponse("Back");
    }
    //Countdown function
    function TimeoutCallBack() {
        return CallResponse('TimeOut');

    }

    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
    }
})();