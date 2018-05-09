;(function () {
    var $TipError = $("#TipError");
    var arrTransType = "";
    var FirstKey = 0; // 第一次输入是否有效
    var Inputdata = "";
    var InputShowData = ""; // 用来显示效果，隔4位有空格间隔
    var Files = new dynamicLoadFiles();
    var nTimeOut = 60;  // 用来显示页面倒计时，目前是页面输入后重新计时
    var InputID = document.getElementById("RemitNumberValue");
    var CardNoValue = "";

    var CallResponse = App.Cntl.ProcessOnce(function (Response) {
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
   
    var Initialize = function () {
        //@initialize scope start
        ButtonDisable();
        EventLogin();
        top.ErrorInfo = "";
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        // 销户流程默认提示
        //if (top.API.CashInfo.Dealtype == 'CancelAccount') {
        //    $TipError.html("转入账户需为邮储借记卡或存折！");
        //}
        InputID.focus();
        var sPinStatus = top.API.Pin.StDetailedDeviceStatus();
        if (sPinStatus != "ONLINE" && sPinStatus != "BUSY") {
            Files.ErrorMsg("密码键盘设备故障，交易结束");
            setTimeout(function () {
                return CallResponse("Exit");
            }, 4000);
        } else {
            top.API.Siu.SetPinPadLight('CONTINUOUS');
            top.API.Pin.GetData(0, false, "0,1,2,3,4,5,6,7,8,9,ENTER,CLEAR,CANCEL", "CANCEL", -1);
        }
        App.Plugin.Voices.play("voi_45");
        ButtonEnable();
    }();//Page Entry

    //@User ocde scope start
    function ButtonDisable() {
        document.getElementById('Back').disabled = true;
        document.getElementById('OK').disabled = true;
        document.getElementById('PageRoot').disabled = true;
        document.getElementById('Alter').disabled = true;

    }

    function ButtonEnable() {
        document.getElementById('Back').disabled = false;
        document.getElementById('OK').disabled = false;
        document.getElementById('PageRoot').disabled = false;
        document.getElementById('Alter').disabled = false;
    }

    document.getElementById('Back').onclick = function () {
        ButtonDisable();
        top.ErrorInfo = top.API.PromptList.No2;
        return CallResponse('Back');
    };

    document.getElementById('PageRoot').onclick = function () {
        ButtonDisable();
        //top.ErrorInfo = top.API.PromptList.No2;
        return CallResponse('BackHomepage');
    };

    document.getElementById('Alter').onclick = function () {
        if (Inputdata.length > 0) {
            Inputdata = Inputdata.substr(0, Inputdata.length - 1);
            var showLen = InputShowData.length;
            if (showLen == 20 || showLen == 14 || showLen == 10 || showLen == 5) {
                InputShowData = InputShowData.substr(0, InputShowData.length - 2);
            } else {
                InputShowData = InputShowData.substr(0, InputShowData.length - 1);
            }
            InputID.value = InputShowData;
        }        
    };

    function Reinput() {
        top.API.displayMessage("重新输入");
        App.Timer.SetPageTimeout(nTimeOut);
        ButtonEnable();
        FirstKey = 0;
        Inputdata = "";
        InputShowData = "";
        InputID.value = "";
        CardNoValue = "";
    }

    document.getElementById('OK').onclick = function () {
        ButtonDisable();
        var tmpCardNoValue = Inputdata;
        if (top.API.CashInfo.Dealtype == "大额交易") {
            //设置大额存款限额
            var lRetBigTranLimit = 200000;
            var arrTransactionResult = new Array(lRetBigTranLimit.toString());
            top.API.gChooseMoney = lRetBigTranLimit;
            top.API.Dat.SetDataSync("CASHINMAXAMOUNT", "STRING", arrTransactionResult);
        }
        else {
            //设置小额存款限额为50000，数据可以改变
            var lRetBigTranLimit = 50000;
            var arrTransactionResult = new Array(lRetBigTranLimit.toString());
            top.API.gChooseMoney = lRetBigTranLimit;
            top.API.Dat.SetDataSync("CASHINMAXAMOUNT", "STRING", arrTransactionResult);
            //return CallResponse("DEP");
        }
        while (tmpCardNoValue.indexOf(" ") != -1) {
            tmpCardNoValue = tmpCardNoValue.replace(" ", "");
        }
        if ((tmpCardNoValue.length < 14 || tmpCardNoValue.length > 19) || tmpCardNoValue.length == 15) {
            ButtonEnable();
            InputID.value = "";
            CardNoValue = "";
            Reinput();
            Files.ErrorMsg("请输入正确的卡号！");
        } else {
            if (tmpCardNoValue.length > 0) {
                // if( tmpCardNoValue.length == 16 || tmpCardNoValue.length == 19 || tmpCardNoValue.length == 17 ){
                //add by tsx 应用根据位数判断存折还是卡号。卡号走大额存款，存折走ATM存款
                // top.API.gCardOrBookBank = 2;
                // if (tmpCardNoValue.length == 19 || tmpCardNoValue.length == 16) {
                //     top.API.gCardOrBookBank = 1;
                // }
                // if (tmpCardNoValue.substr(0, 2) == "41") {
                //     tmpCardNoValue = tmpCardNoValue.substr(2, tmpCardNoValue.length - 2);
                // }
                top.API.Dat.SetDataSync("TFRCARDBANKTYPE", "STRING", [""]);
                var strCardBankType = top.API.Crd.GetCardBankType(tmpCardNoValue);                
                top.API.displayMessage("InputRemittanceAccount.js，strCardBankType=" + strCardBankType);
                var sCardBankType = strCardBankType.substr(0, 1);
                if (sCardBankType == "3") { // 他行卡
                    ButtonEnable();
                    Files.ErrorMsg("您输入的账号无法进行现金转账业务，请重新输入");
                    InputID.value = "";
                    CardNoValue = "";
                    Reinput();
                } else {
                    top.API.Dat.SetDataSync("TFRCARDBANKTYPE", "STRING", [sCardBankType]);
                    top.API.PayeeAccount = tmpCardNoValue;
                    //top.API.gCardno = tmpCardNoValue;
                    top.API.gTransactiontype = "QRYINCUSTNAME";

                    top.API.CashInfo.Dealtype = "无卡交易";
                    top.API.NoCardDeal = true;
                    var arrCardNo = new Array(top.API.PayeeAccount);
                    // top.API.Dat.SetDataSync("TFRCARDNO", top.API.cardnoType, arrCardNo);
                    top.API.Dat.SetDataSync("TFRCARDNO", top.API.cardnoType, arrCardNo);
                    var arrCashOutBoxData = "输入账号：" + tmpCardNoValue;
                    top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, [arrCashOutBoxData]);
                    top.API.Jnl.PrintSync("Content");
                    SendToHost();
                    //return CallResponse('OK');
                }                
            } else {
                ButtonEnable();
                Reinput();
                Files.ErrorMsg("转入账号格式不正确，请重新输入！");
            }
        }     
    }

    function SendToHost() {
        top.API.Pin.CancelGetData();
        arrTransType = "QRYINCUSTNAME";
        Files.showNetworkMsg("交易处理中,请稍候...");
        top.API.displayMessage("Start 获取流水号" + arrTransType);
        var nRet1 = top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);
    }    

    function onKeyPressed(key, keyCode) {
        App.Timer.SetPageTimeout(nTimeOut);
        InputID.focus();
        var tmpInputdata = "";
        top.API.displayMessage("onKeyPressed触发,key=" + key);
        if (FirstKey == 0 && (key == 0 || key == 00)) {
            return;
        } else if (0 <= key || key <= 9 || 00 == key) {
            if (Inputdata.length >= 19) {
                return;  // 不响应
            }

            FirstKey = 1;
            Inputdata += key;
            InputShowData += key;

            if (InputShowData.length == 4) {
                InputShowData += ' ';
            } else if (InputShowData.length == 9) {
                InputShowData += ' ';
            } else if (InputShowData.length == 14) {
                InputShowData += ' ';
            } else if (InputShowData.length == 19) {
                InputShowData += ' ';
            }

            InputID.value = InputShowData;
        } else if (key == "CLEAR") {
            Reinput();
        } else if (key == "CANCEL") {
            return CallResponse("Exit");
        } else if (key == "ENTER") {
            document.getElementById('OK').onclick();
        }
    }

    //组包
    function onCompositionDataCompleted(arrData) {
        var objArrData = arrData;
        var HexWorkKey = top.stringToHex(objArrData);
        top.API.Pin.GenerateMAC(HexWorkKey, "MACKEY", '', 0, 0);
    }

    function onCompositionDataFail() {
        top.API.displayMessage("onCompositionDataFail is done");
        Files.ErrorMsg("通讯失败，交易结束");
        //return CallResponse("OK");    //测试
        //WriteAcctFileAfterTCP("AT", ""); //add by art for 写交易记录文件
        //bNextPageFlag = false;
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }

    function onMACGenerated(MacData) {
        top.API.displayMessage("onMACGenerated is done, MacData =" + MacData);
        var HexMasterKey = top.stringToHex(MacData);
        var objMacData = MacData;
        top.API.Tcp.SendToHost(HexMasterKey, 60000);
    }

    function onTcpOnRecved(tmpCheck) {
        top.API.displayMessage("onTcpOnRecved is done,CheckCode:" + tmpCheck);
        switch (tmpCheck) {
            case '00':
                if (arrTransType == "QRYINCUSTNAME") {
                    //GetBalanceInfo();
                    var objGet1 = top.API.Dat.GetDataSync("INCUSTOMERNAME", top.API.customernameType);
                    if (null == objGet1) {
                        top.API.gTFRCustomerName = "";
                    } else {
                        top.API.gTFRCustomerName = objGet1[0].replace(/\s+/g, "");
                    }
                    return CallResponse("OK");
                }
                break;
            default:
                //strErrMsg = "交易失败"; //
                //PrintJnl("交易失败", "CODE=" + arrTransType);
                //return CallResponse("Failed");
                // 获取错误待显示提示信息
                var sTranCode = top.API.Dat.GetPrivateProfileSync("TranCode", tmpCheck, "交易失败", top.API.Dat.GetBaseDir() + top.API.gIniTranCode);
                Files.ErrorMsg(sTranCode);
                setTimeout(function () {
                    return CallResponse("Exit");
                }, 4000);    //测试
                break;
        }
    }

    /********************************************************************************************************/
    //TCP模块    
    function onTcpSendFailed() {
        top.API.displayMessage("onTcpSendFailed is done");
        //strErrMsg = "通讯失败，交易结束";
        //WriteAcctFileAfterTCP("AT", ""); //add by art for 写交易记录文件
        //bNextPageFlag = false;
        //TradeCompleted();
        Files.ErrorMsg("通讯失败，交易结束");
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }

    function onTcpTimeout() {
        top.API.displayMessage("onTcpTimeout is done,arrTransType=" + arrTransType);
        Files.ErrorMsg("通讯超时，交易结束");
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }

    function onAnalysisFailed() {
        top.API.displayMessage("onAnalysisFailed is done");
        Files.ErrorMsg("报文解析失败，交易结束");
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }

    //event handler
    function onDeviceError() {
        top.API.displayMessage('键盘触发事件：onDeviceError()');
        top.ErrorMsg("通讯失败，交易结束");
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }

    //event handler
    function onCryptFailed() {
        top.API.displayMessage('键盘加解密失败：onCryptFailed');
        Files.ErrorMsg("键盘加解密失败，交易结束");
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }

    function onGetDataFailed() {
        top.API.displayMessage('键盘输入明文失败：onGetDataFailed');
        Files.ErrorMsg("密码键盘输入明文失败，交易结束");
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }
    /********************************************************************************************************/
    //永久数据模块
    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        var arrDataValue = DataValue;
        top.API.displayMessage("onDatGetPersistentDataComplete" + DataName);
        if ('JNLNUM' == DataName) {
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
        top.API.displayMessage("DatGetPersistentDataError" + DataName + ",ErrorCode=" + ErrorCode);
        Files.ErrorMsg("组包失败，交易结束");
    }

    function onDatSetPersistentDataComplete(DataName) {
        if ('JNLNUM' == DataName) {
            top.API.Tcp.CompositionData(arrTransType);
        }
    }

    function onDatSetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatSetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        Files.ErrorMsg("组包失败，交易结束");
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }

    //Register the event
    function EventLogin() {
        top.API.Tcp.addEvent("SendFailed", onTcpSendFailed);
        top.API.Tcp.addEvent("OnRecved", onTcpOnRecved);
        top.API.Tcp.addEvent("CompositionDataCompleted", onCompositionDataCompleted);
        top.API.Tcp.addEvent("CompositionDataFail", onCompositionDataFail);

        top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.addEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.addEvent("SetPersistentDataError", onDatSetPersistentDataError);
        
        top.API.Tcp.addEvent("Timeout", onTcpTimeout);
        top.API.Tcp.addEvent("AnalysisFailed", onAnalysisFailed);

        top.API.Pin.addEvent("CryptFailed", onCryptFailed);
        top.API.Pin.addEvent("MACGenerated", onMACGenerated);
        top.API.Pin.addEvent('DeviceError', onDeviceError);
        top.API.Pin.addEvent("KeyPressed", onKeyPressed);
        top.API.Pin.addEvent("GetDataFailed", onGetDataFailed);
    }

    function EventLogout() {
        top.API.Tcp.removeEvent("SendFailed", onTcpSendFailed);
        top.API.Tcp.removeEvent("OnRecved", onTcpOnRecved);
        top.API.Tcp.removeEvent("CompositionDataCompleted", onCompositionDataCompleted);
        top.API.Tcp.removeEvent("CompositionDataFail", onCompositionDataFail);
        top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.removeEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.removeEvent("SetPersistentDataError", onDatSetPersistentDataError)
        
        top.API.Tcp.removeEvent("Timeout", onTcpTimeout);
        top.API.Tcp.removeEvent("AnalysisFailed", onAnalysisFailed);

        top.API.Pin.removeEvent("MACGenerated", onMACGenerated);
        top.API.Pin.removeEvent("CryptFailed", onCryptFailed);
        top.API.Pin.removeEvent('DeviceError', onDeviceError);
        top.API.Pin.removeEvent("KeyPressed", onKeyPressed);
        top.API.Pin.removeEvent("GetDataFailed", onGetDataFailed);
    }

    //Countdown function
    function TimeoutCallBack() {
        top.ErrorInfo = top.API.PromptList.No3;
        Files.ErrorMsg("交易超时，交易结束");
        setTimeout(function () {
            return CallResponse("TimeOut");
        }, 4000);
    }

    //Page Return

    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
        App.Plugin.Voices.del();
        top.API.Siu.SetPinPadLight('OFF');
        top.API.Pin.CancelGetData();
        App.Timer.ClearTime();
    }
})();
