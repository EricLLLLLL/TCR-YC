/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {
    var strCardNo = "";
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        //@initialize scope start
        App.Plugin.Voices.play("voi_22");
        ButtonDisable();
        EventLogin();
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        top.API.Scr.AcceptAndReadAvailableTracks('1,2,3', 60000);
        ButtonEnable();
        //return CallResponse('OK');
    } (); //Page Entry

    //@User ocde scope start
    function ButtonDisable() {
        top.API.displayMessage("ButtonDisable");
        document.getElementById('Exit').disabled = true;
    }

    function ButtonEnable() {
        top.API.displayMessage("ButtonEnable");
        document.getElementById('Exit').disabled = false;

    }
    document.getElementById("Exit").onclick = function () {
        ButtonDisable();
        top.API.Scr.CancelAccept();
        return CallResponse("Exit");
    }

    function SetCardNo() {
        var arrCardNo = new Array(strCardNo);
        top.API.gCardno = strCardNo;
        var nRet = top.API.Dat.SetDataSync(top.API.cardnoTag, top.API.cardnoType, arrCardNo);
        top.API.displayMessage("SetDataSync CARDNO Return:" + nRet);
        top.API.Jnl.PrintSync("PassbookAction");
    }

     //event handler
    function onCardInserted() {
        top.API.displayMessage("This event should not have been there");
    }

    function onCardAccepted() {
        top.API.displayMessage("onCardAccepted触发");
        var strTrack2 = top.API.Scr.Track2();
        if ("" === strTrack2) {
            top.ErrorInfo = top.API.PromptList.No9;
            return CallResponse("Error");
        } else {
            var arrTrack2 = new Array();
            arrTrack2 = strTrack2.split("=");
            if (arrTrack2.length == 2) {
                strCardNo = arrTrack2[0];
            }else{
		        var num = arrTrack2.length - 1;
                strCardNo = arrTrack2[num];
            }
        }
        SetCardNo();
        return CallResponse('OK');
    }

    function onCardAcceptCancelled() {
        top.API.displayMessage("onCardAcceptCancelled");
        top.ErrorInfo = top.API.PromptList.No2;
        return CallResponse("TimeOut");
    }

    function onCardRead() {
        return CallResponse("TimeOut");
    }

    function onCardInvalid() {
        top.API.displayMessage("onCardInvalid,响应<TimeOut>");
        top.ErrorInfo = top.API.PromptList.No9;
        return CallResponse("TimeOut");
    }

    function onDeviceError() {
        top.API.displayMessage("onDeviceError,响应<TimeOut>");
        top.ErrorInfo = top.API.PromptList.No4;
        return CallResponse("TimeOut");
    }

    function onCardAcceptFailed() {
        top.API.displayMessage("onCardAcceptFailed");        
        refreshTitleAdv();
    }
     function onCardAcceptCancelFailed() {
        top.API.displayMessage("onCardAcceptCancelFailed");        
        refreshTitleAdv();
    }

    //@User code scope end 

    //event handler
    //event handler
    //Register the event
    function EventLogin() {
        top.API.Scr.addEvent("CardInserted", onCardInserted);
        top.API.Scr.addEvent("CardAccepted", onCardAccepted);
        top.API.Scr.addEvent("CardAcceptFailed", onCardAcceptFailed);
        top.API.Scr.addEvent("CardAcceptCancelled", onCardAcceptCancelled);
        top.API.Scr.addEvent("CardAcceptCancelFailed", onCardAcceptCancelFailed);
        top.API.Scr.addEvent("CardRead", onCardRead);
        top.API.Scr.addEvent("CardInvalid", onCardInvalid);
        top.API.Scr.addEvent("DeviceError", onDeviceError);
    }

    function EventLogout() {
        top.API.Scr.removeEvent("CardInserted", onCardInserted);
        top.API.Scr.removeEvent("CardAccepted", onCardAccepted);
        top.API.Scr.removeEvent("CardAcceptFailed", onCardAcceptFailed);
        top.API.Scr.removeEvent("CardAcceptCancelled", onCardAcceptCancelled);
        top.API.Scr.removeEvent("CardAcceptCancelFailed", onCardAcceptCancelFailed);
        top.API.Scr.removeEvent("CardRead", onCardRead);
        top.API.Scr.removeEvent("CardInvalid", onCardInvalid);
        top.API.Scr.removeEvent("DeviceError", onDeviceError);
    }

    //Countdown function
    function TimeoutCallBack() {
        top.ErrorInfo = top.API.PromptList.No3;
        top.API.Scr.CancelAccept();
        return CallResponse('TimeOut');
    }
    //Page Return
    
    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
        App.Timer.ClearTime();
        App.Plugin.Voices.del();
    }
})();
