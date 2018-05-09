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
         InitReset();
        //
        //App.Timer.TimeoutDisposal(TimeoutCallBack);
      }();//Page Entry

   //@User ocde scope start
    // document.getElementById('Back').onclick = function(){

    //      return CallResponse('Back');
    // }
    
    // document.getElementById('OK').onclick = function(){
      
    //      return CallResponse('OK');
    // }
   
   function InitReset(){
      switch(top.API.InitBusinessFlag)
      {
        // case "JournalPrinter":
        //   //top.API.displayMessage("JournalPrinter");  
        //   return CallResponse("TradeSuccess");
        //   break;
        case "ReceiptPrinter":
          top.API.displayMessage("ReceiptPrinter");  
          top.API.Ptr.Reset("EJECT",60000);  
          //return CallResponse("TradeSuccess");
          break;
        case "CashOut":
          top.API.displayMessage("CashOut");  
          top.API.Cdm.Reset("RETRACT",0,60000);
          //return CallResponse("TradeSuccess");
          break;
        case "CashIn":
          top.API.displayMessage("CashIn");  
          top.API.Cim.Reset("RETRACT",0,60000);
          //return CallResponse("TradeSuccess");
          break;
        case "CardReader":
          top.API.displayMessage("CardReader");  
          top.API.Crd.Reset("NOACTION",60000);
          //return CallResponse("TradeSuccess");
          break;
        case "FingerPrinter":
          top.API.displayMessage("FingerPrinter");  
          top.API.Fpi.Reset(60000);
          //return CallResponse("TradeSuccess");
          break;
        case "Identifier":
          top.API.displayMessage("Identifier"); 
          top.API.Idr.Reset("NOACTION"); 
          //return CallResponse("TradeSuccess");
          break;
        case "Camera":
          top.API.displayMessage("Camera");  
          top.API.Cam.Reset(60000);
          //return CallResponse("TradeSuccess");
          break;
        case "LaserPrinter":
          top.API.displayMessage("LaserPrinter");  
          top.API.Spt.Reset(60000);
          //return CallResponse("TradeSuccess");
          break;
        case "BusinessManage":
          top.API.displayMessage("BusinessManage");  
          //return CallResponse("TradeSuccess");
          break;
        default:
          top.API.displayMessage("default");          
          return CallResponse("TradeFail");
          break;
      }
   }
  

   function onPtrResetComplete(){
    top.API.displayMessage("onPtrResetComplete");   
      return CallResponse("TradeSuccess");
   }

   function onCdmrResetComplete(){
    top.API.displayMessage("onCdmrResetComplete");   
      return CallResponse("TradeSuccess");
   }

   function onCimResetComplete(){
    top.API.displayMessage("onCimResetComplete");   
      return CallResponse("TradeSuccess");
   }

   function onCrdResetComplete(){
    top.API.displayMessage("onCrdResetComplete");    
      return CallResponse("TradeSuccess");
   }

   function onFpiResetComplete(){
    top.API.displayMessage("onFpiResetComplete");   
      return CallResponse("TradeSuccess");
   }

   function onIdrResetComplete(){
    top.API.displayMessage("onIdrResetComplete");   
      return CallResponse("TradeSuccess");
   }

   function onCamResetComplete(){
    top.API.displayMessage("onCamResetComplete");   
      return CallResponse("TradeSuccess");
   }

   function onSptResetComplete(){
    top.API.displayMessage("onSptResetComplete");   
      return CallResponse("TradeSuccess");
   }

/***********Fail**************/   

   function onPtrResetFailed(){
    top.API.displayMessage("onPtrResetFailed");   
      return CallResponse("TradeFail");
   }

   function onCdmrResetFailed(){
    top.API.displayMessage("onCdmrResetFailed");   
      return CallResponse("TradeFail");
   }

   function onCimResetFailed(){
    top.API.displayMessage("onCimResetFailed");   
      return CallResponse("TradeFail");
   }

   function onCrdResetFailed(){
    top.API.displayMessage("onCrdResetFailed");   
      return CallResponse("TradeFail");
   }

   function onFpiResetFailed(){
    top.API.displayMessage("onFpiResetFailed");   
      return CallResponse("TradeFail");
   }

   function onIdrResetFailed(){
    top.API.displayMessage("onIdrResetFailed");   
      return CallResponse("TradeFail");
   }

   function onCamResetFailed(){
    top.API.displayMessage("onCamResetFailed");   
      return CallResponse("TradeFail");
   }

   function onSptResetFailed(){
    top.API.displayMessage("onSptResetFailed");   
      return CallResponse("TradeFail");
   }
   //@User code scope end 

    //event handler
   
    //Register the event
    function EventLogin() {        
        top.API.Ptr.addEvent("ResetComplete", onPtrResetComplete);
        top.API.Cdm.addEvent("ResetComplete", onCdmrResetComplete);
        top.API.Cim.addEvent("ResetComplete", onCimResetComplete);
        top.API.Crd.addEvent("ResetComplete", onCrdResetComplete);
        top.API.Fpi.addEvent("ResetComplete", onFpiResetComplete);
        top.API.Idr.addEvent("ResetComplete", onIdrResetComplete);
        top.API.Cam.addEvent("ResetComplete", onCamResetComplete);
        top.API.Spt.addEvent("ResetComplete", onSptResetComplete);

        
        top.API.Ptr.addEvent("ResetFailed", onPtrResetFailed);
        top.API.Cdm.addEvent("ResetFailed", onCdmrResetFailed);
        top.API.Cim.addEvent("ResetFailed", onCimResetFailed);
        top.API.Crd.addEvent("ResetFailed", onCrdResetFailed);
        top.API.Fpi.addEvent("ResetFailed", onFpiResetFailed);
        top.API.Idr.addEvent("ResetFailed", onIdrResetFailed);
        top.API.Cam.addEvent("ResetFailed", onCamResetFailed);
        top.API.Spt.addEvent("ResetFailed", onSptResetFailed);
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
