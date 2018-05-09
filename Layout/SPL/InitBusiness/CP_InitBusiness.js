; (function(){
    var CallResponse = App.Cntl.ProcessOnce (function (Response) { 
    //TO DO:
         Clearup();
        //Entry the flows control process.
          App.Cntl.ProcessDriven( Response );
        }),
       Initialize = function() {
        EventLogin();
      //@initialize scope start
         
        //
        //App.Timer.TimeoutDisposal(TimeoutCallBack);
      }();//Page Entry

   //@User ocde scope start
    document.getElementById('Back').onclick = function(){

         return CallResponse('Back');
    }

    // document.getElementById('JournalPrinter').onclick = function(){
    //     top.API.InitBusinessFlag = "JournalPrinter";
    //     return CallResponse('OK');
    // }

    document.getElementById('ReceiptPrinter').onclick = function(){
        top.API.InitBusinessFlag = "ReceiptPrinter";
        return CallResponse('OK');
    }

    document.getElementById('CashOut').onclick = function(){
        top.API.InitBusinessFlag = "CashOut";
        return CallResponse('OK');
    }

    document.getElementById('CashIn').onclick = function(){
        top.API.InitBusinessFlag = "CashIn";
        return CallResponse('OK');
    }

    document.getElementById('CardReader').onclick = function(){
        top.API.InitBusinessFlag = "CardReader";
        return CallResponse('OK');
    }

    document.getElementById('FingerPrinter').onclick = function(){
        top.API.InitBusinessFlag = "FingerPrinter";
        return CallResponse('OK');
    }

    document.getElementById('Identifier').onclick = function(){
        top.API.InitBusinessFlag = "Identifier";
        return CallResponse('OK');
    }
    document.getElementById('OpenShutter').onclick = function () {
		top.API.Cdm.OpenShutter(top.API.gCloseShutterTimeOut);		
    }
	
	document.getElementById('CloseShutter').onclick = function () {
		top.API.Cdm.CloseShutter(top.API.gCloseShutterTimeOut);		
    }
    // document.getElementById('Camera').onclick = function(){
    //     top.API.InitBusinessFlag = "Camera";
    //     return CallResponse('OK');
    // }

    // document.getElementById('LaserPrinter').onclick = function(){
    //     top.API.InitBusinessFlag = "LaserPrinter";
    //     return CallResponse('OK');
    // }
    
        document.getElementById("PageRoot").onclick = function () {
//        ButtonDisable();
        return CallResponse("Exit");
    }
   
   //@User code scope end 

    //event handler
    function onDeviceError() {
		top.API.displayMessage("onDeviceError触发");
		ButtonEnable();
    }
    function onShutterOpened(){
		top.API.displayMessage("onShutterOpened触发,提示客户拿走钞票");
		ButtonEnable();
	}	
	function onShutterClosed(){
		top.API.displayMessage("onShutterClosed触发");
		ButtonEnable();
	}
	function onShutterOpenFailed(){
		top.API.displayMessage("onShutterOpenFailed触发");
		ButtonEnable();
	}	
	function onShutterCloseFailed(){
		top.API.displayMessage("onShutterCloseFailed触发");
		ButtonEnable();
	}
   
    //Register the event
    function EventLogin() {
      		//Door
		top.API.Cdm.addEvent('ShutterOpened', onShutterOpened);
		top.API.Cdm.addEvent('ShutterOpenFailed', onShutterOpenFailed);
		top.API.Cdm.addEvent('ShutterClosed', onShutterClosed);
		top.API.Cdm.addEvent('ShutterCloseFailed', onShutterCloseFailed);
		top.API.Cdm.addEvent('DeviceError', onDeviceError);
    }

    function EventLogout() {
      		//Door
		top.API.Cdm.removeEvent('ShutterOpened', onShutterOpened);
		top.API.Cdm.removeEvent('ShutterOpenFailed', onShutterOpenFailed);
		top.API.Cdm.removeEvent('ShutterClosed', onShutterClosed);
		top.API.Cdm.removeEvent('ShutterCloseFailed', onShutterCloseFailed);
		top.API.Cdm.removeEvent('DeviceError', onDeviceError);
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
