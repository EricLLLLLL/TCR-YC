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

    // document.getElementById('CashOut').onclick = function(){
    //     top.API.InitBusinessFlag = "CashOut";
    //     return CallResponse('OK');
    // }

    // document.getElementById('CashIn').onclick = function(){
    //     top.API.InitBusinessFlag = "CashIn";
    //     return CallResponse('OK');
    // }

    document.getElementById('CardReader').onclick = function(){
        top.API.InitBusinessFlag = "CardReader";
        return CallResponse('OK');
    }

    // document.getElementById('FingerPrinter').onclick = function(){
    //     top.API.InitBusinessFlag = "FingerPrinter";
    //     return CallResponse('OK');
    // }

    // document.getElementById('Identifier').onclick = function(){
    //     top.API.InitBusinessFlag = "Identifier";
    //     return CallResponse('OK');
    // }

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
