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
     
        // document.getElementById('Crown').style.display = "none";
        //
        //App.Timer.TimeoutDisposal(TimeoutCallBack);
      }();//Page Entry

   //@User ocde scope start
    document.getElementById('Back').onclick = function(){

         return CallResponse('Back');
    }

    document.getElementById("PageRoot").onclick = function () {
//        ButtonDisable();
        return CallResponse("Exit");
    }
    
    document.getElementById('Init').onclick = function(){

         return CallResponse('InitBusiness');
    }

    document.getElementById('Service').onclick = function(){

        top.API.InitBusinessFlag = "BusinessManage";
         return CallResponse('BusinessManage');
    }

    document.getElementById('system').onclick = function(){

         return CallResponse('SystemSet');
    }
// 冠字号
    // document.getElementById('Crown').onclick = function(){

    //      return CallResponse('Crown');
    // }
    document.getElementById('Check').onclick = function(){

         return CallResponse('CheckIn');
    }


    // document.getElementById('OK').onclick = function(){
      
    //      return CallResponse('OK');
    // }
   
   //@User code scope end 

    //event handler   
   
    //Register the event
    function EventLogin() {
        //top.API.Crd.addEvent('CardAccepted',onCardAccepted);
    }

    function EventLogout() {
       //top.API.Crd.removeEvent('CardAccepted',onCardAccepted);
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
