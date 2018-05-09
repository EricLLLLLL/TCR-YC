; (function(){
	var keyFlag = -1; //辨别PINKEY、MACKEY标志位；1：PINKEY   2：MACKEY 0:MasterKEY
	var nKeyNum = 0;
	var Pinkey = "";
    var MACkey = "";
	var MasterKey = "";
    var arrTransType;
	var Files = new dynamicLoadFiles();
    var CallResponse = App.Cntl.ProcessOnce (function (Response) { 
		//TO DO:
         Clearup();
        //Entry the flows control process.
          App.Cntl.ProcessDriven( Response );
        }),
		Initialize = function() {      
			EventLogin();
			//@initialize scope start   
			top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);	  
      }();//Page Entry

   //@User ocde scope start
   function CheckAndDownMK() {
        if (top.API.Pin.KeyIsValidSync("MasterKey")) {
            top.API.displayMessage("MasterKey Is Valid, Start Down PinKey");
            DownPinKey();
        } else {
            top.API.displayMessage("MasterKey Not Valid, Start Down MasterKey");
            DecryptMaster();
        }
    }
   
   function CheckPinKey() {
		var objGetMasterKey = top.API.Dat.GetDataSync("CDK", top.API.pinkeyType);
        var objGetPinKey = top.API.Dat.GetDataSync(top.API.pinkeyTag, top.API.pinkeyType);
        if (null == objGetPinKey || null == objGetMasterKey) {
            top.API.displayMessage("GetDataSync WorKKey objGet = null");
            return false;
        }
        else {
            top.API.displayMessage("GetDataSync objGetPinKey Return:" + objGetPinKey);
			var arrGetMkKey = objGetMasterKey;
            var arrGetPinKey = objGetPinKey;
            PinKey = arrGetPinKey[0];
			MasterKey = objGetMasterKey[0];
            if (PinKey == "") {
                return false;
            } else {
                return true;
            }
        }
    }
	
	function CheckMacKey() {
        var objGetMACKey = top.API.Dat.GetDataSync(top.API.mackeyTag, top.API.mackeyType);
        if ( null == objGetMACKey) {
            top.API.displayMessage("GetDataSync MacKey objGet = null");
            return false;
        }
        else {
            top.API.displayMessage("GetDataSync objGetMACKey Return:" + objGetMACKey);
            var arrGetMACKey = objGetMACKey;
            MACKey = arrGetMACKey[0];
            if (MACKey == "") {
                return false;
            } else {
                return true;
            }
        }
    }
	
   function DownPinKey() {
        top.API.displayMessage("下载PINKEY");
        keyFlag = 1;
        var HexWorkKey = top.stringToHex(PinKey);
        var tmphexArray = new Array();
		var tmphexArray2 = top.stringToHex("0000000000000000");
        top.API.Pin.ExtendedLoadEncryptedKey_Ex("PINKEY", HexWorkKey, "MasterKey", "ChinaSM,CRYPT,FUNCTION,MACING,KEYENCKEY", tmphexArray, "", 2, "");
    }


    function DownMACKey() {
        top.API.displayMessage("下载MACKEY");
        keyFlag = 2;
        var HexWorkKey = top.stringToHex(MACKey);
        var tmphexArray = new Array();
		var tmphexArray2 = top.stringToHex("0000000000000000");
        top.API.Pin.ExtendedLoadEncryptedKey_Ex("MACKEY", HexWorkKey, "MasterKey", "ChinaSM,CRYPT,MACING", tmphexArray, "", 2, "");
    }

	
	function DecryptMaster() {
        top.API.displayMessage("下载MDecrypt MasterKEY");
        var HexWorkKey = top.stringToHex(MasterKey);
        top.API.Pin.DecryptChinaSM(HexWorkKey, "InitKey", 0, 4096);
    }
   
   //@User code scope end 
   //--start
	/********************************************************************************************************/
    //永久数据模块
    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        var arrDataValue = DataValue;
        var nRet1 = -1;
        top.API.displayMessage("onDatGetPersistentDataComplete is done,DataName=" + DataName + ",DataType=" + DataType + ",DataValue=" + arrDataValue[0]);
        if ('JNLNUM' == DataName) {
            JnlNum = arrDataValue[0] + 1;
            if (JnlNum.toString().length === 9) {
                JnlNum = 0;
            }
            //设置交易流水号
            var arrJnlNum = new Array();
            arrJnlNum[0] = JnlNum;
            top.API.Dat.SetPersistentData(top.API.jnlnumTag, top.API.jnlnumType, arrJnlNum);
        }
    }

    function onDatGetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatGetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        top.API.displayMessage("获取数据失败");
        Files.ErrorMsg("数据库读取失败");
		top.ErrorInfo = "数据库读取失败";
		setTimeout(function () {
			return CallResponse("TradeFail");
		}, 4000);
    }

    function onDatSetPersistentDataComplete(DataName) {
        top.API.displayMessage("onDatSetPersistentDataComplete is done,DataName=" + DataName);
        if ('JNLNUM' == DataName) {
            //待修正 添加流水
			arrTransType = new Array(top.API.gTransactiontype);
            top.API.displayMessage("TransType:" +　top.API.gTransactiontype);
            top.API.Tcp.CompositionData(arrTransType); //进行处理工作参数报文
        }
    }

    function onDatSetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatSetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
		Files.ErrorMsg("数据库写入失败");
		top.ErrorInfo = "数据库写入失败";
		setTimeout(function () {
			return CallResponse("TradeFail");
		}, 4000);
    }

    /********************************************************************************************************/
    //TCP模块
    function onCompositionDataCompleted() {
        top.API.displayMessage("onCompositionDataCompleted is done");
		Files.showNetworkMsg("交易处理中,请稍候...");
        var objArrData = new Array();
        top.API.Tcp.SendToHost(objArrData, 60000);
    }

    function onTcpOnRecved(tmpCheck) {
        Check = tmpCheck;
        top.API.displayMessage("onTcpOnRecved is done,Check:" + Check);
        if (Check == "00"){
			if (arrTransType == "APPLYINITKEY"){
				top.API.Pin.PrivateKeyDec(2, "");
			}else if (arrTransType == "APPLYWORKPARAM_PIN" && CheckPinKey() && nKeyNum == 0){
				nKeyNum = 1;
				top.API.gTransactiontype = "APPLYWORKPARAM_MAC";
				top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);
			}else if (arrTransType == "APPLYWORKPARAM_MAC" && CheckMacKey() && nKeyNum == 1){
				CheckAndDownMK();
			}
        } else {
            Files.ErrorMsg("通讯失败，交易结束");
            top.ErrorInfo = "通讯失败";
            setTimeout(function () {
                return CallResponse("TradeFail");
            }, 4000);
        }
    }

    function onTcpSendFailed() {
        top.API.displayMessage("onTcpSendFailed is done");
        Files.ErrorMsg("通讯失败，交易结束");
        top.ErrorInfo = "通讯失败";
        setTimeout(function () {
            return CallResponse("TradeFail");
        }, 4000);
    }
    function onTcpTimeout() {
        top.API.displayMessage("onTcpTimeout is done");
        Files.ErrorMsg("通讯超时，交易结束");
        top.ErrorInfo = "通讯超时";
        setTimeout(function () {
            return CallResponse("TradeFail");
        }, 4000);
    }
    /********************************************************************************************************/
    //PIN模块
	function onDecryptComplete(dataAsc) {
        top.API.displayMessage("解密MasterKEY成功, dataAsc = " + dataAsc);
        keyFlag = 0;
        var HexMasterKey = top.stringToHex(dataAsc);
        var tmphexArray = new Array();
		var tmphexArray2 = top.stringToHex("0000000000000000");
        top.API.Pin.ExtendedLoadKey_Ex("MasterKey", HexMasterKey, "ChinaSM,CRYPT,FUNCTION,MACING,KEYENCKEY", tmphexArray, "", 2, "");
    }

    function onDecryptFailed() {
        top.API.displayMessage("解密MasterKEY失败");
		Files.ErrorMsg("解密MasterKEY失败");
        setTimeout(function () {
            return CallResponse("TradeFail");
        }, 4000);
    }
	
    function onPrivateKeyDecComplete(PlainData) {
		var	PinKey = PlainData;
        top.API.displayMessage("onPrivateKeyDecComplete is done, PlainData = " + PinKey);
		keyFlag = 4;
        var HexMasterKey = top.stringToHex(PinKey);
        var tmphexArray = new Array(0);
	    var tmphexArray2 = top.stringToHex("0000000000000000");
        top.API.Pin.ExtendedLoadKey_Ex("InitKey", HexMasterKey, "ChinaSM,CRYPT", tmphexArray, "", 2, "");
    }

    function onPrivateKeyDecFailed() {
        top.API.displayMessage("onPrivateKeyDecFailed is done");
        top.ErrorInfo =  "私钥解密失败";
		Files.ErrorMsg("解密MasterKEY失败");
        setTimeout(function () {
            return CallResponse("TradeFail");
        }, 4000);
    }
	
    function onKeyLoaded() {
        top.API.displayMessage('onKeyLoaded is done');
		if (keyFlag == 0){
			top.API.displayMessage('下载MasterKEY成功');
            DownPinKey();
		} else if (keyFlag == 1) {
            top.API.displayMessage('下载PINKEY成功');            
            DownMACKey();
        } else if (keyFlag == 2){
            top.API.displayMessage('下载MACKEY成功');			
			top.API.Jnl.PrintSync("OpenAppSuccess");
			return CallResponse("TradeSuccess");
		} else {
			top.API.displayMessage('下载INITKEY成功');
			return CallResponse("TradeSuccess");
		}
    }

    function onDeviceError() {
        top.API.displayMessage('键盘触发事件：onDeviceError()');
        Files.ErrorMsg("键盘故障");
        top.ErrorInfo = "键盘故障";
        setTimeout(function () {
            return CallResponse("TradeFail");
        }, 4000);
    }

    function onKeyLoadFailed() {
        top.API.displayMessage('键盘触发事件：onKeyLoadFailed()');
		Files.ErrorMsg("密钥导入错误");
        top.ErrorInfo = "密钥导入错误";
        setTimeout(function () {
            return CallResponse("TradeFail");
        }, 4000);
    }

    function onCryptFailed() {
        top.API.displayMessage('键盘加解密失败：onCryptFailed');
        Files.ErrorMsg("键盘加解密失败");
        top.ErrorInfo = "键盘加解密失败";
        setTimeout(function () {
            return CallResponse("TradeFail");
        }, 4000);
    }
	/********************************************************************************************************/
	//--end

    //event handler
   
    //Register the event
    function EventLogin() {
		top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.addEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.addEvent("SetPersistentDataError", onDatSetPersistentDataError);

        top.API.Tcp.addEvent("SendFailed", onTcpSendFailed);
        top.API.Tcp.addEvent("OnRecved", onTcpOnRecved);
        top.API.Tcp.addEvent("CompositionDataCompleted", onCompositionDataCompleted);
        top.API.Tcp.addEvent("Timeout", onTcpTimeout);

        top.API.Pin.addEvent('KeyLoaded', onKeyLoaded);
        top.API.Pin.addEvent('KeyLoadFailed', onKeyLoadFailed);
        top.API.Pin.addEvent("CryptFailed", onCryptFailed);
        top.API.Pin.addEvent('DeviceError', onDeviceError);
		top.API.Pin.addEvent("DecryptComplete", onDecryptComplete);
		top.API.Pin.addEvent("DecryptFailed", onDecryptFailed);

        top.API.Pin.addEvent('PrivateKeyDecComplete', onPrivateKeyDecComplete);
        top.API.Pin.addEvent('PrivateKeyDecFailed', onPrivateKeyDecFailed);
    }

    function EventLogout() {
		top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.removeEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.removeEvent("SetPersistentDataError", onDatSetPersistentDataError);

        top.API.Tcp.removeEvent("SendFailed", onTcpSendFailed);
        top.API.Tcp.removeEvent("OnRecved", onTcpOnRecved);
        top.API.Tcp.removeEvent("CompositionDataCompleted", onCompositionDataCompleted);
        top.API.Tcp.removeEvent("Timeout", onTcpTimeout);

        top.API.Pin.removeEvent('KeyLoaded', onKeyLoaded);
        top.API.Pin.removeEvent('KeyLoadFailed', onKeyLoadFailed);
        top.API.Pin.removeEvent("CryptFailed", onCryptFailed);
        top.API.Pin.removeEvent('DeviceError', onDeviceError);
		top.API.Pin.removeEvent("DecryptComplete", onDecryptComplete);
		top.API.Pin.removeEvent("DecryptFailed", onDecryptFailed);

        top.API.Pin.removeEvent('PrivateKeyDecComplete', onPrivateKeyDecComplete);
        top.API.Pin.removeEvent('PrivateKeyDecFailed', onPrivateKeyDecFailed);
    }

       //Countdown function
    function TimeoutCallBack() {
        return CallResponse('TimeOut');
     }
      //remove all event handler
    function Clearup(){
      //TO DO:
		EventLogout();
    }
})();
