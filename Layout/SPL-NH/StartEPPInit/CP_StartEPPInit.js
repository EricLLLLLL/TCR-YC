/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function(){
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
      //TO DO:
	  Clearup();
	  //Entry the flows control process.
	  App.Cntl.ProcessDriven( Response );
    });
    var Initialize = function() {      
        EventLogin();
        top.API.Pin.Initialize();
    }();//Page Entry

   //@User ocde scope start

   function onDeviceError(){
       top.API.displayMessage("onDeviceError触发");
       return CallResponse("Exit");
   }   

    function onInitializeFailed(){
       top.API.displayMessage("onInitializeFailed触发");
       return CallResponse("Exit");
   }   
   
   function onInitializeComplete(){
       top.API.displayMessage("onInitializeComplete");
       return CallResponse("OK");
   }
    
    function EventLogin() {
        top.API.Pin.addEvent("InitializeComplete",onInitializeComplete);   
        top.API.Pin.addEvent("InitializeFailed",onInitializeFailed);    
        top.API.Pin.addEvent("DeviceError",onDeviceError);        
    }

    function EventLogout() {
         top.API.Pin.removeEvent("InitializeComplete",onInitializeComplete);  
         top.API.Pin.removeEvent("InitializeFailed",onInitializeFailed);   
         top.API.Pin.removeEvent("DeviceError",onDeviceError);           
    }


    //remove all event handler
    function Clearup(){
	  EventLogout();
    }
})();