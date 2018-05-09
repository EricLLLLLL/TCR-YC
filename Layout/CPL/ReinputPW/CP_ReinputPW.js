/*@create by:  tsxiong
 *@time: 2016年03月20日
 */
; (function () {
    var Inputdata = "";
    var ExitFlag = 0;
    var CardNo = "";
    var InputPwdObj = document.getElementById("InputPwd-input");
    var ErrorTipObj =document.getElementById("InputPwd-error");
    var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        top.API.Siu.SetPinPadLight('OFF');
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        ButtonDisable();
        EventLogin();
        //@initialize scope start    
        top.API.Pin.GetPin(6, 6, true, "0,1,2,3,4,5,6,7,8,9,ENTER,CLEAR,CANCEL", "ENTER,CANCEL", -1);
        top.API.Siu.SetPinPadLight('CONTINUOUS');
        InputPwdObj.focus();
        CardNo = top.API.gCardno;
        ButtonEnable();
        App.Plugin.Voices.play("voi_11");
    }();//Page Entry

    //@User ocde scope start
    //重新输入密码
    function Reinput() {
        top.API.Pin.GetPin(6, 6, true, "0,1,2,3,4,5,6,7,8,9,ENTER,CLEAR,CANCEL", "ENTER,CANCEL", -1);
        Inputdata = "";
        InputPwdObj.innerText = Inputdata;
        ButtonEnable();
    }
    //获取pinblock值
    function GetPinblock() {
        top.API.displayMessage("开始FormatPin");
        var pbCustomerdata = CardNo.substr(CardNo.length - 13, 12);
        var pbFormat = 'ANSI';
        var pbKeyname = 'PINKEY';
        top.API.Pin.PinBlock(pbFormat, pbCustomerdata, 15, pbKeyname, "", "");
    }

    function ButtonDisable() {
        document.getElementById('Exit').disabled = true;
        document.getElementById('OK').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Exit').disabled = false;
        document.getElementById('OK').disabled = false;
    }

    document.getElementById("Exit").onclick = function () {
        ButtonDisable();
        top.API.Pin.CancelGetPin();
        top.ErrorInfo = top.API.PromptList.No2;
        return CallResponse("Exit");
    }

    //@User code scope end 

    //event handler
    function onKeyPressed(key, keyCode) {
        ErrorTipObj.style.display = "none";
        switch (key) {
            case '*':
                Inputdata += "*";
                InputPwdObj.innerText = Inputdata;
                break;
            case 'CLEAR':
                Inputdata = "";
                InputPwdObj.innerText = Inputdata;
                break;
            case 'CANCEL':
                ButtonDisable();
                break;
            case 'ENTER':
                break;
            default:
                top.API.displayMessage("接收Key值异常，Key=" + key);
                break;
        }
    }
    //event handler
    function onGetPinCompleted() {
        if (Inputdata.length == 6) {
            ButtonDisable();
            GetPinblock();
        } else {
            ErrorTipObj.style.display = "block";
            Reinput();
        }
    }
    //event handler
    function onTimeout() {
        top.ErrorInfo = top.API.PromptList.No3;
        return CallResponse("TimeOut");
    }
    //event handler
    function onPinBlockCompleted(Pinblock) {
        switch (top.API.CashInfo.Dealtype) {
            case '存折业务':
                top.API.gATMORTCR = "TCR";
                var arrATMORTCR = new Array("TCR");
                top.API.Dat.SetDataSync("ATMORTCR", "STRING", arrATMORTCR);
                top.API.gTransactiontype = "QRYCUSTNAME";
                break;
            case '存折取款':
                top.API.gTransactiontype = "CWD";
                break;
            case 'INQ':
                top.API.gTransactiontype = "INQ";
                break;
            default:
                break;
        }
        return CallResponse("OK");
    }

    function onGetPinCancelled() {
        top.API.displayMessage("键盘点击取消按键GetPinCancelled");
        top.ErrorInfo = top.API.PromptList.No2;
        return CallResponse("Exit");
    }

    function onDeviceError() {
        top.API.displayMessage(top.API.PromptList.No4);
        top.ErrorInfo = top.API.PromptList.No4;
        return CallResponse("Exit");
    }

    function onGetPinFailed() {
        top.API.displayMessage("onGetPinFailed触发");
        top.ErrorInfo = top.API.PromptList.No4;
        return CallResponse("Exit");
    }

    function onPinBlockFailed() {
        top.API.displayMessage("onPinBlockFailed触发");
        top.ErrorInfo = top.API.PromptList.No4;
        return CallResponse("Exit");
    }
    function onGetPinCancelFailed() {
        top.API.displayMessage("onGetPinCancelFailed触发");
        top.ErrorInfo = top.API.PromptList.No4;
        return CallResponse("Exit");
    }
    //Register the event
    function EventLogin() {
        top.API.Pin.addEvent("KeyPressed", onKeyPressed);
        top.API.Pin.addEvent("GetPinCompleted", onGetPinCompleted);
        top.API.Pin.addEvent("GetPinFailed", onGetPinFailed);
        top.API.Pin.addEvent("DeviceError", onDeviceError);
        top.API.Pin.addEvent("GetPinCancelled", onGetPinCancelled);
        top.API.Pin.addEvent("GetPinCancelFailed", onGetPinCancelFailed);
        top.API.Pin.addEvent("Timeout", onTimeout);
        top.API.Pin.addEvent("PinBlockCompleted", onPinBlockCompleted);
        top.API.Pin.addEvent("PinBlockFailed", onPinBlockFailed);

    }

    function EventLogout() {
        top.API.Pin.removeEvent("GetPinCancelled", onGetPinCancelled);
        top.API.Pin.removeEvent("GetPinCancelFailed", onGetPinCancelFailed);
        top.API.Pin.removeEvent("KeyPressed", onKeyPressed);
        top.API.Pin.removeEvent("GetPinCompleted", onGetPinCompleted);
        top.API.Pin.removeEvent("GetPinFailed", onGetPinFailed);
        top.API.Pin.removeEvent("DeviceError", onDeviceError);
        top.API.Pin.removeEvent("Timeout", onTimeout);
        top.API.Pin.removeEvent("PinBlockCompleted", onPinBlockCompleted);
        top.API.Pin.removeEvent("PinBlockFailed", onPinBlockFailed);
    }

    //Countdown function
    function TimeoutCallBack() {
        top.API.Pin.CancelGetPin();
        top.ErrorInfo = top.API.PromptList.No3;
        return CallResponse("TimeOut");
    }
    //Page Return

    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
        App.Plugin.Voices.del();
        App.Timer.ClearTime();
    }
})();