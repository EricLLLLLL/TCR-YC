/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function(){
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        Clearup();
        App.Cntl.ProcessDriven( Response );
    });
    var Initialize = function() {     
	    ButtonDisable();
        App.Timer.TimeoutDisposal(TimeoutCallBack,ButtonDisable);
        ButtonEnable();
    }();//Page Entry
    function ButtonDisable() {
        top.API.displayMessage("ButtonDisable");
        document.getElementById('Exit').disabled = true;
    }

    function ButtonEnable() {
        top.API.displayMessage("ButtonEnable");
        document.getElementById('Exit').disabled = false;
    }
   //@User ocde scope start
    document.getElementById('Exit').onclick = function(){
        ButtonDisable();
        return CallResponse('Exit');
    }
   
   //@User code scope end 
     
    //Register the event
    function EventLogin() {
       
    }

    function EventLogout() {
       
    }

       //Countdown function
    function TimeoutCallBack() {
        
        return CallResponse('TimeOut');
     }
    
      //remove all event handler
    function Clearup(){
      //TO DO:
    //EventLogout();
      App.Timer.ClearTime();
    }
})();
