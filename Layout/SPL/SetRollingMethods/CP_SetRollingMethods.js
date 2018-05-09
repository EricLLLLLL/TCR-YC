/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {
    var JnlNum = 0; //记流水,交易流水号
    var Check = ""; //记流水,交易响应码
    var strMsg = ""; //记流水,交易信息 
    var strErrMsg = "交易失败";
    var arrTransType;
    var strtmp="";//用来保存默认扎帐模式的类型。
    var strTypeValue = "";//用来设置扎帐模式的类型，"2"为终端模式，“1”为预轧账
    var ChangeNum = new Array();
    var Files = new dynamicLoadFiles();
    //键盘相关
    var strTellerNo = "";
    var TellerNo = document.getElementById("TellerInput");
    TellerNo.focus();
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        ButtonDisable();
        EventLogin();
        //@initialize scope start  
        App.Plugin.Keyboard.show("3", "KeysDiv", "Keyboards");
        $("#KeysDiv").css({"left":"100px","top":"400px"});
        funKeyInput();
        top.API.Dat.GetPersistentData(top.API.telleridTag, top.API.telleridType);
        // var ATypes = document.getElementsByName("select_id");   //获取页面扎帐模式，以便将类型号放入到数据库中
        // typesClick();
        top.API.Dat.GetPersistentData("ATMPMODE", "STRING"); // 获取默认轧账模式，"2"为终端模式，“1”为预轧账。ATM轧账模式，默认未终端轧账模式
        ButtonEnable();

    }();//Page Entry
    function ButtonDisable() {
        document.getElementById('Back').disabled = true;
        document.getElementById('OK').disabled = true;
        document.getElementById('PageRoot').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Back').disabled = false;
        document.getElementById('OK').disabled = false;
        document.getElementById('PageRoot').disabled = false;
    }
    document.getElementById('PageRoot').onclick = function () {
        ButtonDisable();
        return CallResponse('Exit');
    }
    // function typesClick(typebtns) {
    //     for (var i = 0; i < typebtns.length; i++) {
    //         (function () {
    //             var p = i;
    //             typebtns[p].onclick = function () {
    //                 for (var j = 0; j < typebtns.length; j++) {
    //                     typebtns[j].style.backgroundImage = "url('Framework/style/Graphics/btn/redio_noselct.png')";
    //                 }
    //                 typebtns[p].style.backgroundImage = "url('Framework/style/Graphics/btn/radio_select.png')";
    //                 strTypeValue = typebtns[p].getAttribute("tvalue");
    //             }
    //         })();
    //     }
    // }

    function PrintJnl() {
        var arrTransactionResult = new Array(strErrMsg);
        top.API.Dat.SetDataSync("TRANSACTIONRESULT", "STRING", arrTransactionResult);
        top.API.Jnl.PrintSync("Transaction");
        if (strErrMsg != "交易成功") {
            return CallResponse('TradeFail');
        }
    }    
    

    function funKeyInput() {
        var oKeyboardKey = document.getElementsByName("Name_Keyboard");
        for (var i = 0; i < oKeyboardKey.length; i++) {
            var keyEvent = oKeyboardKey[i];
            keyEvent.onclick = function (e) {
                document.getElementById("tipdiv").innerText = "";
                if (this.innerText == "清除") {
                    onClearNum();
                } else if (this.innerText == "小写") {
                    document.getElementById("KeysDiv").removeChild(document.getElementById("Keyboards"));
                    App.Plugin.Keyboard.show("6", "KeysDiv", "Keyboards");
                    keyflag = 1;
                    funKeyInput();
                } else if (this.innerText == "大写") {
                    document.getElementById("KeysDiv").removeChild(document.getElementById("Keyboards"));
                    App.Plugin.Keyboard.show("3", "KeysDiv", "Keyboards");
                    keyflag = 1;
                    funKeyInput();
                } else {
                    if (strTellerNo.length < 10) {
                        strTellerNo += this.innerText;
                        TellerNo.value = strTellerNo;

                    }
                    TellerNo.focus();
                }
            }
        }
    }


    function onClearNum() {
            TellerNo.value = '';
            strTellerNo = '';
            TellerNo.focus();
    }


    //@User ocde scope start
    document.getElementById('OK').onclick = function () {
        if (strTellerNo == "") {
            document.getElementById("tipdiv").innerText = "输入的柜员号不能为空！";
        }  else {
            // return CallResponse('TradeSuccess');
            var inputvalue = new Array(strTellerNo);
            top.API.displayMessage('柜员号：SetPersistentData TELLERID =' + inputvalue);
            var nRet = top.API.Dat.SetPersistentData(top.API.telleridTag, top.API.telleridType, inputvalue);
            top.API.displayMessage('柜员号：SetPersistentData TELLERID Return:' + nRet);

            strTypeValue = $("#select_id option:selected").val();
            top.API.Dat.SetPersistentData("ATMPMODE", "STRING", strTypeValue);
            App.Plugin.Keyboard.disappear("KeysDiv");
            Files.showNetworkMsg("交易处理中,请稍候...");
            top.API.Dat.GetPersistentData("JNLNUM", "LONG"); // 获取流水，开始进行报文交互
        }               
    }
    // TradeSuccess	TradeFail
    
    document.getElementById('Back').onclick = function () {
        ButtonDisable();
        return CallResponse('Back');
    }


    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        var arrGet = DataValue;
        var showinfo = arrGet[0];
        top.API.displayMessage("onDatGetPersistentDataComplete is done,DataName=" + DataName + ",DataType=" + DataType + ",DataValue=" + showinfo);
        if ('TELLERID' == DataName) {
            TellerNo.value = showinfo;
            strTellerNo = TellerNo.value;
        }

        //扎帐方式
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
                // document.getElementById("TypeNo1").style.backgroundImage = "url('Framework/style/Graphics/btn/radio_select.png')";
                // document.getElementById("TypeNo2").style.backgroundImage = "url('Framework/style/Graphics/btn/redio_noselct.png')";
                $("#select_id").val("2");
                
            } else {
                // document.getElementById("TypeNo2").style.backgroundImage = "url('Framework/style/Graphics/btn/redio_noselct.png')";
                // document.getElementById("TypeNo2").style.backgroundImage = "url('Framework/style/Graphics/btn/radio_select.png')";
                $("#select_id").val("1");
            }
            strtmp=arrDataValue[0];//暂时保存默认扎帐模式的类型
        }


    }

    function onDatGetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatGetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        // alert("读取失败");
        if ('TELLERID' == DataName) {

        }
    }
    function onDatSetPersistentDataComplete(DataName) {
        top.API.displayMessage("onDatSetPersistentDataComplete is done,DataName=" + DataName);

        
        //扎帐方式
        if ('JNLNUM' == DataName) {
            top.API.displayMessage("开始修改轧账模式前的组包");
            var arrTransType = new Array("EXCHANGEMODE");
            top.API.Tcp.CompositionData(arrTransType); //修改轧账模式报文
        }
        if ('ATMPMODE' == DataName) {
            // document.getElementById("SuccessedDiv").style.display = "block";
            // document.getElementById("ChangeDiv").style.display = "none";
            // document.getElementById("OK").style.display = "block"; 
            // ButtonEnable();
        }
    }

    function onDatSetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatSetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        // alert("设定失败,请重新设定！");
        strErrMsg = "设定柜员号失败";
        PrintJnl();
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
                return CallResponse('TradeSuccess');
                break;
            default:                
                strErrMsg = "交易失败，返回码：" + Check;
                top.API.Dat.SetPersistentData("ATMPMODE", "STRING", strtmp);//设置回原来的扎帐模式
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

    function Clearup() {
        EventLogout();
    }
})();
