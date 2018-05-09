; (function () {
var bError =false;
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        ButtonDisable();
        EventLogin();
        document.getElementById("PromptIcon3").style.backgroundImage = "url('Framework/style/Graphics/box_ico_4.png')";
        var userNum = top.API.User;
        top.API.displayMessage("userNum = " + userNum);
        top.API.Dat.SetDataSync("MFPIDATAKEY", "STRING", userNum);
        top.API.Fpi.AcquireData(-1);
        ButtonEnable();
    }();//Page Entry

    function ButtonDisable() {
        document.getElementById('Back').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Back').disabled = false;
    }
    //@User ocde scope start
    document.getElementById('Back').onclick = function () {
        ButtonDisable();
	if(!bError){
        top.API.Fpi.CancelIdentify();
	}
        return CallResponse('Back');
    }

    function onDataAcquired(data) {
        top.API.displayMessage("onDataAcquired is done");
        var fingerData=data.toArray();
        if ((fingerData[0] != null) && (fingerData[0] != "") && (fingerData[0] != undefined)) {
			{
                document.getElementById("PromptIcon3").style.backgroundImage = "url('Framework/style/Graphics/box_ico_3.png')";
				return CallResponse('OK');
            }
        }
        
    }
    function onFpiTimeout() {
        top.API.displayMessage("onFpiTimeout is done");
		document.getElementById("FingerTipDiv").innerHTML="指纹录入超时 ! !";
		bError = true;
    }
    function onFpiDeviceError() {
        top.API.displayMessage("onFpiDeviceError is done");
		document.getElementById("FingerTipDiv").innerHTML="指纹录入失败 ! !";
		bError = true;      
    }
    function onFingerMoved() {
        top.API.displayMessage("onFingerMoved is done");    
    }
    function onDataAcquireFailed() {
        top.API.displayMessage("DataAcquireFailed is done");
		document.getElementById("FingerTipDiv").innerHTML="指纹录入失败 ! !";
		bError = true;
    }
    function onAcquireDataCancelled() {
        top.API.displayMessage("AcquireDataCancelled is done");
		document.getElementById("FingerTipDiv").innerHTML="指纹录入失败 ! !";
		bError = true;  
    }

    //Register the event
    function EventLogin() {
        top.API.Fpi.addEvent('DataAcquired', onDataAcquired);
        top.API.Fpi.addEvent('Timeout', onFpiTimeout);
        top.API.Fpi.addEvent('DeviceError', onFpiDeviceError);
        top.API.Fpi.addEvent('FingerMoved', onFingerMoved);
        top.API.Fpi.addEvent('DataAcquireFailed', onDataAcquireFailed);
        top.API.Fpi.addEvent('AcquireDataCancelled', onAcquireDataCancelled);
    }

    function EventLogout() {
        top.API.Fpi.removeEvent('DataAcquired', onDataAcquired);
        top.API.Fpi.removeEvent('Timeout', onFpiTimeout);
        top.API.Fpi.removeEvent('DeviceError', onFpiDeviceError);
        top.API.Fpi.removeEvent('FingerMoved', onFingerMoved);
        top.API.Fpi.removeEvent('DataAcquireFailed', onDataAcquireFailed);
        top.API.Fpi.removeEvent('AcquireDataCancelled', onAcquireDataCancelled);
    }

    //Countdown function
    function TimeoutCallBack() {
        return CallResponse('TimeOut');
    }

    //remove all event handler
    function Clearup() {
        EventLogout();
    }
})();
