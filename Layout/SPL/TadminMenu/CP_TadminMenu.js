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
       // App.Timer.TimeoutDisposal(TimeoutCallBack);
      }();//Page Entry

   //@User ocde scope start


    document.getElementById('selectStatus').onclick = function(){
      
         return CallResponse('Checkstatus');
    }
    document.getElementById('selectSet').onclick = function(){
      
         return CallResponse('SetParam');//参数设置
    }
    document.getElementById('selectKey').onclick = function(){
      
         return CallResponse('ManageKey');
    }
    document.getElementById('selectDown').onclick = function(){
      
         return CallResponse('DownParam');
    }

    document.getElementById('selectOther').onclick = function(){
      
         return CallResponse('OtherManage');
    }
   document.getElementById('PageRoot').onclick = function(){
      
         return CallResponse('Exit');
    }
   //@User code scope end 

    //event handler
   
    //Register the event
    function EventLogin() {
        //top.API.Crd.addEvent('CardInserted',onCardInserted);      
    }

    function EventLogout() {
       //top.API.Crd.removeEvent('CardInserted',onCardInserted);

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
