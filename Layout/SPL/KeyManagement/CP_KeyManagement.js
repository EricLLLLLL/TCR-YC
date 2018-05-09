;(function(){
	var Files = new dynamicLoadFiles();
    var CallResponse = App.Cntl.ProcessOnce (function (Response) { 
         Clearup();
        //Entry the flows control process.
          App.Cntl.ProcessDriven( Response );
        }),
		
		Initialize = function() {
			EventLogin();
      }();//Page Entry

   //@User ocde scope start
    document.getElementById('Back').onclick = function(){
        return CallResponse('Back');
    }
    document.getElementById('PageRoot').onclick = function(){
        return CallResponse('Exit');
    }

    document.getElementById('Masterkey').onclick = function(){
		ButtonEnable(false);
		Files.showNetworkMsg("交易处理中,请稍候...");
		top.API.Pin.GetCertifiate(2); // 直接从UKEY中获取授权信息
    }

    document.getElementById('MACPINkey').onclick = function(){
		ButtonEnable(false);
		if (CheckInitKey()){
			top.API.gTransactiontype = "APPLYWORKPARAM_PIN";
			return CallResponse('MACPINkey');
		}else{
			ButtonEnable(true);
			Files.ErrorMsg("初始秘钥异常，请先导入初始秘钥");
		}
    }

    document.getElementById('InitEPP').onclick = function(){
		ButtonEnable(false);
		Files.showNetworkMsg("交易处理中,请稍候...");
		top.API.Pin.Initialize();
    }
	
	function ButtonEnable(flag){
		document.getElementById('Masterkey').disabled = !flag;
		document.getElementById('MACPINkey').disabled = !flag;
		document.getElementById('InitEPP').disabled = !flag;
	}
	
	function CheckInitKey(){
		if (top.API.Pin.KeyIsValidSync("InitKey")){
			top.API.displayMessage("初始密钥存在");
			return true;
		}else{
			top.API.displayMessage("主秘钥异常，请导入主秘钥");
			return false;
		}
	}

   //@User code scope end 
   
   function onGetCertifiateComplete(CertData) { // 获取证书成功后跳到输入密码界面
        top.API.displayMessage("onGetCertifiateComplete is done, CertData = " + CertData);
		top.API.gTransactiontype = "APPLYINITKEY";
		$('#networkWrap').css("display","none");
		return CallResponse('Masterkey');
    }

    function onGetCertifiateFailed() {
        top.API.displayMessage("onGetCertifiateFailed is done");
		ButtonEnable(true);
		Files.ErrorMsg("获取证书信息错误,请检查USBKEY是否存在");
    }
	
	function onDeviceError(){
       top.API.displayMessage("onDeviceError触发");
	   ButtonEnable(true);
       Files.ErrorMsg("键盘故障");
	}   

    function onInitializeFailed(){
       top.API.displayMessage("onInitializeFailed触发");
	   ButtonEnable(true);
	   Files.ErrorMsg("初始化失败");
	}   
   
	function onInitializeComplete(){
       top.API.displayMessage("onInitializeComplete");
	   ButtonEnable(true);
	   $('#networkWrap').css("display","none");
	   Files.ErrorMsg("初始化成功");
	}

    //event handler
   
    //Register the event
    function EventLogin() {
        top.API.Pin.addEvent("GetCertifiateComplete", onGetCertifiateComplete);
        top.API.Pin.addEvent('GetCertifiateFailed', onGetCertifiateFailed);
		
		top.API.Pin.addEvent("InitializeComplete",onInitializeComplete);   
        top.API.Pin.addEvent("InitializeFailed",onInitializeFailed);    
        top.API.Pin.addEvent("DeviceError",onDeviceError); 
    }

    function EventLogout() {
        top.API.Pin.removeEvent("GetCertifiateComplete", onGetCertifiateComplete);
        top.API.Pin.removeEvent('GetCertifiateFailed', onGetCertifiateFailed);
		
		top.API.Pin.removeEvent("InitializeComplete",onInitializeComplete);  
        top.API.Pin.removeEvent("InitializeFailed",onInitializeFailed);   
        top.API.Pin.removeEvent("DeviceError",onDeviceError);
    }

       //Countdown function
    function TimeoutCallBack() {
        top.API.displayMessage("TimeoutCallBack is done");
		ButtonEnable(true);
        return CallResponse('TimeOut');
     }
      //remove all event handler
    function Clearup(){
      //TO DO:
		EventLogout();
    }
})();
