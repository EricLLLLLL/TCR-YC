; (function(){
    var Files = new dynamicLoadFiles();
    var JnlNum = 0; //记流水,交易流水号
    var arrDownloadtype="";
    var CallResponse = App.Cntl.ProcessOnce (function (Response) { 
    //TO DO:
         Clearup();
        //Entry the flows control process.
          App.Cntl.ProcessDriven( Response );
        }),
       Initialize = function() {
        EventLogin();
      //@initialize scope start
        VersionInfo();
        //
        //App.Timer.TimeoutDisposal(TimeoutCallBack);
      }();//Page Entry

   //@User ocde scope start
    document.getElementById('Back').onclick = function(){

         return CallResponse('Back');
    }
    document.getElementById('PageRoot').onclick = function(){
      
               return CallResponse('Exit');
          }         
    
    document.getElementById('Control').onclick = function(){
         arrDownloadtype="DOWNLOADCTRLPARAM";//控制参数下载
         DownloadParam();
         // return CallResponse('TradeSuccess');
    }

    document.getElementById('MCCard').onclick = function(){
        top.API.Dat.SetDataSync("CARDBININDEX", "LONG",1);
        arrDownloadtype="DOWNLOADCARDTABLE";//卡表下载
         DownloadParam();
    }

    document.getElementById('ICCard').onclick = function(){
        top.API.Dat.SetDataSync("ICCARDBININDEX", "LONG",1);
      arrDownloadtype="DOWNLOADICCARDTABLE";//IC卡表下载
      DownloadParam();
    }

   
   //@User code scope end 
   function DownloadParam() {
        Files.showNetworkMsg("交易处理中,请稍候...");
        top.API.displayMessage("Start 获取流水号" + arrDownloadtype);
        var nRet1 = top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);
    }
    function VersionInfo() {
        var ControlParamVersion  = top.API.Dat.GetPrivateProfileSync("VERSION", "ControlParam", "", top.API.Dat.GetBaseDir()+"/TCR/Middle/ini/VerInfo.ini");//控制参数信息版本号
        var CardTableVersion  = top.API.Dat.GetPrivateProfileSync("VERSION", "CardTable", "", top.API.Dat.GetBaseDir()+"/TCR/Middle/ini/VerInfo.ini");//卡表信息版本号
        var ICCardTableVersion  = top.API.Dat.GetPrivateProfileSync("VERSION", "ICCardTable", "", top.API.Dat.GetBaseDir()+"/TCR/Middle/ini/VerInfo.ini");//IC卡表信息版本号
        document.getElementById('ControlId').innerText=ControlParamVersion;
        document.getElementById('MCCardId').innerText=CardTableVersion;
        document.getElementById('ICCardId').innerText=ICCardTableVersion;
    }

   function PrintJnl() {
        var arrTransactionResult = new Array(strErrMsg);
        top.API.Dat.SetDataSync("TRANSACTIONRESULT", "STRING", arrTransactionResult);
        top.API.Jnl.PrintSync("Transaction");
        if (strErrMsg != "交易成功") {
            return CallResponse('TradeFail');
        }
    } 

    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {   
      var arrDataValue = DataValue;
      top.API.displayMessage("DataName:"+DataName);
        if ('JNLNUM' == DataName.substr(0, 7)) {
            JnlNum = arrDataValue[0] + 1;
            if (JnlNum.toString().length === 7) {
                JnlNum = 0;
            }
            //设置交易流水号
            var arrJnlNum = new Array();
            arrJnlNum[0] = JnlNum;
            var nRet1 = top.API.Dat.SetPersistentData(top.API.jnlnumTag, top.API.jnlnumType, arrJnlNum);
        }
        

    }

    function onDatGetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatGetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        return CallResponse('TradeFail');
    }
    function onDatSetPersistentDataComplete(DataName) {
        top.API.displayMessage("onDatSetPersistentDataComplete is done,DataName=" + DataName);
        if ('JNLNUM' == DataName) {
            top.API.Tcp.CompositionData(arrDownloadtype); 
        }
    }

    function onDatSetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatSetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        // alert("设定失败,请重新设定！");
        return CallResponse('TradeFail');
    }

    //@User code scope end 
    /********************************************************************************************************/
    //组包模块
    function onCompositionDataCompleted(arrData) {
        top.API.displayMessage("onCompositionDataCompleted");
        //var HexWorkKey = top.stringToHex(arrData);
        //top.API.Pin.GenerateMAC(HexWorkKey, "MACKEY", '', 0, 0);
        var SendData = new Array();
        top.API.Tcp.SendToHost(SendData, 60000);
    }
    function onCompositionDataFail() {
        top.API.displayMessage("CompositionDataFail");
        strErrMsg = "组包失败";
        PrintJnl();
    }
    // function onMACGenerated(MacData) {
    //     top.API.displayMessage("onMACGenerated");
    //     var objMacData = top.stringToHex(MacData);
    //     top.API.Tcp.SendToHost(objMacData, 60000);
    // }
/********************************************************************************************************/
    //TCP模块
    function onTcpOnRecved(tmpCheck) {
        Check = tmpCheck;
        top.API.displayMessage("Check:" + Check);
        strErrMsg = "";
        switch (Check) {
            case '0000':
        //         if(arrDownloadtype=="DOWNLOADICCARDTABLE")//IC卡表
        //         {
			     //    top.API.displayMessage("DOWNLOADICCARDTABLE:"+arrDownloadtype);
        //             var n = top.API.Dat.GetDataSync("ICCARDBINFLAG", "LONG");
			     //    top.API.displayMessage("n:" + n);
				    // if(n==1){
        //                     strErrMsg = "交易成功";
        //                     return CallResponse('TradeSuccess');
        //             }
        //             else{
			     //        top.API.displayMessage("Start 获取流水号" + arrDownloadtype);
        //     		      var nRet1 = top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);
			     //   }                                
        //         }
        //         else if(arrDownloadtype=="DOWNLOADCARDTABLE"){//卡表
			     //        top.API.displayMessage("DOWNLOADCARDTABLE:"+arrDownloadtype);
        //                 var n = top.API.Dat.GetDataSync("CARDBINFLAG", "LONG");
			     //        top.API.displayMessage("n:" + n);
        //                 if(n==1){
        //                     strErrMsg = "交易成功";
        //                     return CallResponse('TradeSuccess');
        //                 }
        //                 else{
			     //              top.API.displayMessage("Start 获取流水号" + arrDownloadtype);
        //     		          var nRet1 = top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);
			     //        }
        //         }    
        //         else if(arrDownloadtype=="DOWNLOADCTRLPARAM"){//控制参数
        //             strErrMsg = "交易成功";
        //             return CallResponse('TradeSuccess');

        //         }  
                strErrMsg = "交易成功";
                return CallResponse('TradeSuccess');                         
                break;
            default:                
                strErrMsg = "交易失败，返回码：" + Check;
                PrintJnl();
                return CallResponse('TradeFail');
                break;
        }       
    }
    
    function onTcpSendFailed() {
        top.API.displayMessage("onTcpSendFailed is done");
        strErrMsg = "报文发送失败";
        PrintJnl();
    }
    function onTcpTimeout() {
        top.API.displayMessage("onTcpTimeout is done");
        strErrMsg = "通讯超时";
        PrintJnl();
    }
    function onAnalysisFailed() {
        top.API.displayMessage("onAnalysisFailed is done");
        strErrMsg = "解包失败";
        PrintJnl();
    }


    function onCryptFailed(){
        top.API.displayMessage('触发事件：onCryptFailed()');
        strErrMsg = "onCryptFailed";
        PrintJnl();
    }
    
    function onPinDeviceError() {
        top.API.displayMessage('触发事件：onPinDeviceError()');
        strErrMsg = "onPinDeviceError";
        PrintJnl();
    }
    //Register the event
    function EventLogin() {
        top.API.Tcp.addEvent("SendFailed", onTcpSendFailed);
        top.API.Tcp.addEvent("OnRecved", onTcpOnRecved);
        top.API.Tcp.addEvent("CompositionDataCompleted", onCompositionDataCompleted);
        top.API.Tcp.addEvent("Timeout", onTcpTimeout);
        top.API.Tcp.addEvent("CompositionDataFail", onCompositionDataFail);
        top.API.Tcp.addEvent("AnalysisFailed", onAnalysisFailed);
        // top.API.Pin.addEvent("MACGenerated", onMACGenerated);
        top.API.Pin.addEvent('DeviceError', onPinDeviceError);
        top.API.Pin.addEvent("CryptFailed",onCryptFailed);
        ////
        top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.addEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.addEvent("SetPersistentDataError", onDatSetPersistentDataError);
    }

    function EventLogout() {
        top.API.Tcp.removeEvent("SendFailed", onTcpSendFailed);
        top.API.Tcp.removeEvent("OnRecved", onTcpOnRecved);
        top.API.Tcp.removeEvent("CompositionDataCompleted", onCompositionDataCompleted);
        top.API.Tcp.removeEvent("Timeout", onTcpTimeout);
        top.API.Tcp.removeEvent("CompositionDataFail", onCompositionDataFail);
        top.API.Tcp.removeEvent("AnalysisFailed", onAnalysisFailed);
        // top.API.Pin.removeEvent("MACGenerated", onMACGenerated);
        top.API.Pin.removeEvent('DeviceError', onPinDeviceError);
        top.API.Pin.removeEvent('CryptFailed', onCryptFailed);
        ////
        top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.removeEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.removeEvent("SetPersistentDataError", onDatSetPersistentDataError);
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
