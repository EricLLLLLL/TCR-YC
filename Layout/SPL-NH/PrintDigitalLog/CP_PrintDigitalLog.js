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
    //EventLogin();
    //@initialize scope start    
        return CallResponse('OK');
    }();//Page Entry

   //@User ocde scope start
  
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
