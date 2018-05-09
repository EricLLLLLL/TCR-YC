/*@create by:  tsxiong
 *@time: 2016年03月20日
 */
;(function () {
    var $TipError = $("#TipError");
    var arrTransType = "";
    var strErrMsg = "";
    var FirstKey = 0; // 第一次输入是否有效
    var Inputdata = "";
    var InputShowData = ""; // 用来显示效果，隔4位有空格间隔
    var Files = new dynamicLoadFiles();
    var nTimeOut = 60;  // 用来显示页面倒计时，目前是页面输入后重新计时
    var CallResponse = App.Cntl.ProcessOnce(function (Response) {
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var InputID = document.getElementById("tranNumberValue");
    var CardNoValue = "";
    var Initialize = function () {
        //@initialize scope start
        ButtonDisable();
        EventLogin();
        top.ErrorInfo = top.API.PromptList.No1;
        InputID.focus();
        ButtonEnable();
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
        App.Timer.TimeoutDisposal(TimeoutCallBack);
    }();//Page Entry

    //@User ocde scope start
    function ButtonDisable() {
        // document.getElementById('Exit').disabled = true;
        document.getElementById('OK').disabled = true;
        document.getElementById('Back').disabled = true;
        document.getElementById('Alter').disabled = true;
        document.getElementById('PageRoot').disabled = true;
    }

    function ButtonEnable() {
        // document.getElementById('Exit').disabled = false;
        document.getElementById('OK').disabled = false;
        document.getElementById('Back').disabled = false;
        document.getElementById('Alter').disabled = false;
        document.getElementById('PageRoot').disabled = false;
    }

    function ShowTipsAndClear(TipMsg) {
        ButtonEnable();
        Files.ErrorMsg(TipMsg);
        InputID.value = "";
        CardNoValue = "";
        Reinput();
    }

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

    document.getElementById('Back').onclick = function () {
        ButtonDisable();
        // top.ErrorInfo = top.API.PromptList.No2;
        return CallResponse('Back');
    }
    
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

    document.getElementById('PageRoot').onclick = function () {
        ButtonDisable();
        return CallResponse('BackHomepage');
    }

    document.getElementById('OK').onclick = function () {
        ButtonDisable();
        var tmpCardNoValue = Inputdata;
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
            if (top.API.CashInfo.Dealtype == 'CancelAccount' && top.API.CancelCardNo == tmpCardNoValue) {
                ButtonEnable();
                Files.ErrorMsg("转入账号不能为待销户账号，请重新输入！");
                InputID.value = "";
                CardNoValue = "";
                Reinput();
            } else if (tmpCardNoValue.length > 0) {
                // if( tmpCardNoValue.length == 16 || tmpCardNoValue.length == 19 || tmpCardNoValue.length == 17 ){
                //add by tsx 应用根据位数判断存折还是卡号。卡号走大额存款，存折走ATM存款
                top.API.gCardOrBookBank = 2;
                if (tmpCardNoValue.length == 19 || tmpCardNoValue.length == 16) {
                    top.API.gCardOrBookBank = 1;
                }
                if (tmpCardNoValue.substr(0, 2) == "41") {
                    tmpCardNoValue = tmpCardNoValue.substr(2, tmpCardNoValue.length - 2);
                }
                //转账账号
                top.API.PayeeAccount = Inputdata;
                if (top.API.CashInfo.Dealtype == 'CancelAccount') {
                    //top.API.gTFRCardNo = tmpCardNoValue;
                    top.API.gTransactiontype = "QRYCUSTNAME";
                } else if (top.API.CashInfo.Dealtype == "InLineFlag") {
                    // 行内转账查询
                    // top.API.gTFRCardNo = tmpCardNoValue;
                    // 本行卡转账 - 查询输入卡号是否为本行卡
                    top.API.Dat.SetDataSync("TFRCARDBANKTYPE", "STRING", [""]);
                    var strCardBankType = top.API.Crd.GetCardBankType(tmpCardNoValue);
                    var sCardBankType = strCardBankType.substr(0, 1);
                    top.API.displayMessage("InputTrabsferkNum.js, InLineFlag, strCardBankType=" + strCardBankType);
                    if (sCardBankType == "3") {
                        ShowTipsAndClear("输入账号有误，请核对转入账户信息！");
                        return;
                    } else {
                        top.API.Dat.SetDataSync("TFRCARDBANKTYPE", "STRING", [sCardBankType]);
                        top.API.gTransactiontype = "QRYINCUSTNAME";
                        var arrCardNo = new Array(tmpCardNoValue);
                        top.API.Dat.SetDataSync("TFRCARDNO", "STRING", arrCardNo);
                    }
                } else if (top.API.CashInfo.Dealtype == "OutLineFlag") {
                    // 行外转账
                    // top.API.gTFRCardNo = tmpCardNoValue;
                    // 本行卡转账 - 查询输入卡号是否为本行卡
                    top.API.Dat.SetDataSync("TFRCARDBANKTYPE", "STRING", [""]);
                    var strCardBankType = top.API.Crd.GetCardBankType(tmpCardNoValue);
                    var sCardBankType = strCardBankType.substr(0, 1);
                    top.API.displayMessage("InputTrabsferkNum.js, OutLineFlag, strCardBankType=" + strCardBankType);
                    if (sCardBankType != "3") {
                        ShowTipsAndClear("转入账户为我行账户，请核对转账信息！");
                        return;
                    } else {
                        top.API.Dat.SetDataSync("TFRCARDBANKTYPE", "STRING", [sCardBankType]);
                        top.API.gTransactiontype = "QRYINCUSTNAME";
                        var arrCardNo = new Array(tmpCardNoValue);
                        top.API.Dat.SetDataSync("TFRCARDNO", "STRING", arrCardNo);
                    }

                } else if (top.API.NoCardDeal) {
                    top.API.gTransactiontype = "" + "";
                    var arrCardNo = new Array(tmpCardNoValue);
                    // // TODO 设置到数据库的要是转账账号字段，cardnoTag是无卡无折输入的
                    top.API.Dat.SetDataSync('TFRCARDNO', top.API.cardnoType, arrCardNo);

                } else if (top.API.gCardBankType == "3") {
                    top.API.displayMessage("他行卡在本行转账，sCardBankType=" + top.API.gCardBankType);
                    top.API.gTransactiontype = "QRYINCUSTNAME";
                    var arrCardNo = new Array(tmpCardNoValue);
                    top.API.Dat.SetDataSync("TFRCARDNO", "STRING", arrCardNo);
                }
                //top.API.Jnl.PrintSync("AccountAction");
				
				var arrInfo = new Array("转入账号: " + tmpCardNoValue);
				top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, arrInfo);
				top.API.Jnl.PrintSync("Content");
				
                StratTcpDataSend();
                // return CallResponse('OK');
            } else {
                ButtonEnable();
                Reinput();
                Files.ErrorMsg("转入账号格式不正确，请重新输入！");
            }
        }
    };

    function onKeyPressed(key, keyCode) {
        var tmpInputdata = "";
        App.Timer.SetPageTimeout(nTimeOut);
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


    function StratTcpDataSend() {
        top.API.Pin.CancelGetData();
        Files.showNetworkMsg("交易处理中,请稍候...");
        App.Plugin.Voices.play("voi_28");
        arrTransType = top.API.gTransactiontype;
        var arrTRANSACTIONTYPE = new Array(arrTransType);
        top.API.Dat.SetDataSync(top.API.transactiontypeTag, top.API.transactiontypeType, arrTRANSACTIONTYPE);
        top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);
    }

    function onCompositionDataCompleted(arrData) {
        var objArrData = arrData;
        var HexWorkKey = top.stringToHex(objArrData);
        top.API.Pin.GenerateMAC(HexWorkKey, "MACKEY", '', 0, 0);
    }

    function onCompositionDataFail() {
        top.API.displayMessage("onCompositionDataFail is done");
        Files.ErrorMsg("通讯失败，交易结束");
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
		var arrInfo = new Array("交易名称: 户名查询");
		top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, arrInfo);
        top.API.Jnl.PrintSync("Content");
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
					
					var arrInfo = new Array("转入户名: " + top.API.gTFRCustomerName);
					top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, arrInfo);
					top.API.Jnl.PrintSync("Content");
					
                    return CallResponse("QRYCUSTNAME_OK");
                }
                break;
            default:
                // 获取错误待显示提示信息
                var sTranCode = top.API.Dat.GetPrivateProfileSync("TranCode", tmpCheck, "交易失败", top.API.Dat.GetBaseDir() + top.API.gIniTranCode);
                Files.ErrorMsg(sTranCode);
                setTimeout(function () {
                    return CallResponse("Exit");
                }, 4000);    //测试
                break;
        }
		var arrInfo = new Array("返回码: " + tmpCheck);
		top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, arrInfo);
        top.API.Jnl.PrintSync("Content");
    }

    /********************************************************************************************************/
    //TCP模块
    function onTcpSendFailed() {
        top.API.displayMessage("onTcpSendFailed is done");
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

    /********************************************************************************************************/
    //PIN模块
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
        Files.ErrorMsg("键盘输入明文失败，交易结束");
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
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
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
        top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.addEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.addEvent("SetPersistentDataError", onDatSetPersistentDataError);

        top.API.Tcp.addEvent("CompositionDataCompleted", onCompositionDataCompleted);
        top.API.Tcp.addEvent("CompositionDataFail", onCompositionDataFail);
        top.API.Tcp.addEvent("SendFailed", onTcpSendFailed);
        top.API.Tcp.addEvent("OnRecved", onTcpOnRecved);
        top.API.Tcp.addEvent("Timeout", onTcpTimeout);
        top.API.Tcp.addEvent("AnalysisFailed", onAnalysisFailed);

        top.API.Pin.addEvent("MACGenerated", onMACGenerated);
        top.API.Pin.addEvent("CryptFailed", onCryptFailed);
        top.API.Pin.addEvent('DeviceError', onDeviceError);

        top.API.Pin.addEvent("KeyPressed", onKeyPressed);
        top.API.Pin.addEvent("GetDataFailed", onGetDataFailed);
    }

    function EventLogout() {
        top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.removeEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.removeEvent("SetPersistentDataError", onDatSetPersistentDataError);

        top.API.Tcp.removeEvent("CompositionDataCompleted", onCompositionDataCompleted);
        top.API.Tcp.removeEvent("CompositionDataFail", onCompositionDataFail);
        top.API.Tcp.removeEvent("SendFailed", onTcpSendFailed);
        top.API.Tcp.removeEvent("OnRecved", onTcpOnRecved);
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
        top.API.Siu.SetPinPadLight('OFF');
        top.API.Pin.CancelGetData();
        App.Plugin.Voices.del();
        App.Timer.ClearTime();
    }
})();
