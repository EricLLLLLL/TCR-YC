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
      ButtonDisable();
      returnFun();
         //return CallResponse('Back');
    }

        document.getElementById("PageRoot").onclick = function () {
       // ButtonDisable();
        return CallResponse("Exit");
    }
    
    function ButtonDisable() {
        document.getElementById('Back').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Back').disabled = false;
    }

    // document.getElementById('OK').onclick = function(){
      
    //      return CallResponse('OK');
    // }
   
   function returnFun(){
    switch(top.API.InitBusinessFlag)
      {
        case "JournalPrinter":
          top.API.displayMessage("JournalPrinter");  
          return CallResponse("InitBusiness");
          break;
        case "ReceiptPrinter":
          top.API.displayMessage("ReceiptPrinter");  
          return CallResponse("InitBusiness");
          break;
        case "CashOut":
          top.API.displayMessage("CashOut");  
          return CallResponse("InitBusiness");
          break;
        case "CashIn":
          top.API.displayMessage("CashIn");  
          return CallResponse("InitBusiness");
          break;
        case "CardReader":
          top.API.displayMessage("CardReader");  
          return CallResponse("InitBusiness");
          break;
        case "FingerPrinter":
          top.API.displayMessage("FingerPrinter");  
          return CallResponse("InitBusiness");
          break;
        case "Identifier":
          top.API.displayMessage("Identifier");  
          return CallResponse("InitBusiness");
          break;
        case "Camera":
          top.API.displayMessage("Camera");  
          return CallResponse("InitBusiness");
          break;
        case "LaserPrinter":
          top.API.displayMessage("LaserPrinter");  
          return CallResponse("InitBusiness");
          break;
        case "BusinessManage":
          top.API.displayMessage("BusinessManage"); 
          return CallResponse("BusinessManage");
          break;
        default:
          return CallResponse("TimeOut");
          break;
     }
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
