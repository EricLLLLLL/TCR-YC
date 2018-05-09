; (function(){
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        Clearup();
        App.Cntl.ProcessDriven( Response );
    });
    var Initialize = function() {     
        ButtonDisable(); 
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        ButtonEnable();
    }();//Page Entry

   //@User ocde scope start
    function ButtonDisable() {
        top.API.displayMessage("ButtonDisable");
        document.getElementById('Exit').disabled = true;
        document.getElementById('Print').disabled = true;
    }
    function ButtonEnable() {
        top.API.displayMessage("ButtonEnable");
        document.getElementById('Exit').disabled = false;
        document.getElementById('Print').disabled = false;
    }

    document.getElementById('Exit').onclick = function(){
         ButtonDisable();
         top.API.displayMessage("Back");
         return CallResponse('Back');
    }

    document.getElementById('Print').onclick = function(){
        top.API.displayMessage("Print");
         ButtonDisable();
         return CallResponse('Print');
    }
   
   //@User code scope end 


    function TimeoutCallBack() {        
        return CallResponse('TimeOut');
     }
       //Page Return
    
      //remove all event handler
    function Clearup(){
         App.Timer.ClearTime();
    }
})();
