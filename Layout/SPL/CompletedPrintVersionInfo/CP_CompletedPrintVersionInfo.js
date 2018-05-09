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
	    ButtonDisable();
        App.Timer.TimeoutDisposal(TimeoutCallBack,ButtonDisable);
        ButtonEnable();
    }();//Page Entry
    function ButtonDisable() {
        top.API.displayMessage("ButtonDisable");
        document.getElementById('Back').disabled = true;
    }

    function ButtonEnable() {
        top.API.displayMessage("ButtonEnable");
        document.getElementById('Back').disabled = false;
    }
   //@User ocde scope start
    document.getElementById('Back').onclick = function(){
        ButtonDisable();
        return CallResponse('Back');
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
       //Page Return
    
      //remove all event handler
    function Clearup(){
      //TO DO:
    //EventLogout();
      App.Timer.ClearTime();
    }
})();
