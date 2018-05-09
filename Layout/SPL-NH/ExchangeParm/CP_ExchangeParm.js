/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {
	var JnlNum = 0; //记流水,交易流水号
	var Check = ""; //记流水,交易响应码
	var strMsg = ""; //记流水,交易信息	
	var strErrMsg = "交易失败";
	var arrTransType;
	var strMsgType = 0;
	var strTypeValue = "";
	var ChangeNum = new Array();
    var CallResponse = App.Cntl.ProcessOnce( function(Response){
        EventLogout();
        App.Cntl.ProcessDriven( Response );
    });
	var Initialize = function () {
		ButtonDisable();
		EventLogin();
		var ATypes = document.getElementsByName("TypeNo");   //获取类型号，以便将类型号放入到数据库中
		typesClick(ATypes);
		top.API.Dat.GetPersistentData("ATMPMODE", "STRING"); // 获取轧账模式
		ButtonEnable();
    } (); //Page Entry
    function ButtonDisable() {
        document.getElementById('OK').disabled = true;
        document.getElementById('Exit').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('OK').disabled = false;
        document.getElementById('Exit').disabled = false;
    }
	
    function typesClick(typebtns) {
        for (var i = 0; i < typebtns.length; i++) {
            (function () {
                var p = i;
                typebtns[p].onclick = function () {
                    for (var j = 0; j < typebtns.length; j++) {
                        typebtns[j].style.backgroundImage = "url('Framework/style/Graphics/btn/redio_noselct.png')";
                    }
                    typebtns[p].style.backgroundImage = "url('Framework/style/Graphics/btn/radio_select.png')";
                    strTypeValue = typebtns[p].getAttribute("tvalue");
                }
            })();
        }
    }

    //@User ocde scope start
    document.getElementById('OK').onclick = function () {
        ButtonDisable();
        return CallResponse('OK');     
    }

    document.getElementById('AddTeller').onclick = function () {
        document.getElementById("TypeList").style.display = "none"; 
        document.getElementById("ChangeDiv").style.display = "block"; 
        top.API.Dat.GetPersistentData("JNLNUM", "LONG"); // 获取流水，开始进行报文交互
    }

    document.getElementById('Exit').onclick = function () {
        ButtonDisable();
        return CallResponse('Exit');
    }
	
    function ShowFaildInfo() {
        ButtonEnable();
		document.getElementById("faildDiv").style.display = "block";
		document.getElementById("ChangeDiv").style.display = "none";
		document.getElementById("Exit").style.display = "block";
	}

	function PrintJnl() {
	    var arrTransactionResult = new Array(strErrMsg);
	    top.API.Dat.SetDataSync("TRANSACTIONRESULT", "STRING", arrTransactionResult);
	    top.API.Jnl.PrintSync("Transaction");
	    if (strErrMsg != "交易成功") {
	        ShowFaildInfo();
	    }
	}

    /********************************************************************************************************/    
    /********************************************************************************************************/
    //永久数据模块
    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        var arrDataValue = DataValue;
        if ('JNLNUM' == DataName) {
            JnlNum = arrDataValue[0] + 1;
            if (JnlNum.toString().length === 9) {
                JnlNum = 0;
            }
            var arrJnlNum = new Array();
            arrJnlNum[0] = JnlNum;
            top.API.Dat.SetPersistentData(top.API.jnlnumTag, top.API.jnlnumType, arrJnlNum);
        }

        if ("ATMPMODE" == DataName) {
            if (arrDataValue[0] == "2") { // ATM轧账模式，默认未终端轧账模式
                document.getElementById("TypeNo1").style.backgroundImage = "url('Framework/style/Graphics/btn/radio_select.png')";
                document.getElementById("TypeNo2").style.backgroundImage = "url('Framework/style/Graphics/btn/redio_noselct.png')";
            } else {
                document.getElementById("TypeNo2").style.backgroundImage = "url('Framework/style/Graphics/btn/redio_noselct.png')";
                document.getElementById("TypeNo2").style.backgroundImage = "url('Framework/style/Graphics/btn/radio_select.png')";
            }
        }
    }

    function onDatGetPersistentDataError(DataName, ErrorCode) {
        ButtonEnable();
		ShowFaildInfo();
    }
    function onDatSetPersistentDataComplete(DataName) {
        if ('JNLNUM' == DataName) {
            top.API.displayMessage("开始修改轧账模式前的组包");
            var arrTransType = new Array("EXCHANGEMODE");
            top.API.Tcp.CompositionData(arrTransType); //修改轧账模式报文
        }
        if ('ATMPMODE' == DataName) {
    		document.getElementById("SuccessedDiv").style.display = "block";
            document.getElementById("ChangeDiv").style.display = "none";
            document.getElementById("OK").style.display = "block"; 
            ButtonEnable();
        }          
    }

    function onDatSetPersistentDataError(DataName, ErrorCode) {
        ButtonEnable();
		ShowFaildInfo();
    }

    //@User code scope end 
	/********************************************************************************************************/
    //组包模块
    function onCompositionDataCompleted(arrData) {
        top.API.displayMessage("onCompositionDataCompleted");
	    var HexWorkKey = top.stringToHex(arrData);
	    top.API.Pin.GenerateMAC(HexWorkKey, "MACKEY", '', 0, 0);
    }
	function onCompositionDataFail() {
        top.API.displayMessage("CompositionDataFail");
        strErrMsg = "组包失败";
        PrintJnl();
    }

    function onMACGenerated(MacData) {
		top.API.displayMessage("onMACGenerated");
		var objMacData = top.stringToHex(MacData);
        top.API.Tcp.SendToHost(objMacData, 60000);
    }
	/********************************************************************************************************/
    //TCP模块
    function onTcpOnRecved(tmpCheck) {
        Check = tmpCheck;
        top.API.displayMessage("Check:" + Check);
        strErrMsg = "";
        switch (Check) {
            case '00':
                strErrMsg = "交易成功";
                top.API.Dat.SetPersistentData("ATMPMODE", "STRING", strTypeValue);
                break;
            default:                
                strErrMsg = "交易失败，返回码：" + Check;
                PrintJnl();
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
		top.API.Pin.addEvent("MACGenerated", onMACGenerated);
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
		top.API.Pin.removeEvent("MACGenerated", onMACGenerated);
		top.API.Pin.removeEvent('DeviceError', onPinDeviceError);
		top.API.Pin.removeEvent('CryptFailed', onCryptFailed);
        ////
        top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.removeEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.removeEvent("SetPersistentDataError", onDatSetPersistentDataError);
    }

    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
    }
})();
