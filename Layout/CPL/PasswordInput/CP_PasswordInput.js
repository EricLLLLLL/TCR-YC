/*@create by:  tsxiong
 *@time: 2016年03月20日
 */
;(function () {
    var Inputdata = "";
    var ExitFlag = 0;
    var CardNo = "";
    var InputPwdObj = document.getElementById("PWDvalue");
    //var ErrorTipObj =document.getElementById("InputPwd-error");
    var arrTransType,
        Files = new dynamicLoadFiles(),
        CallResponse = App.Cntl.ProcessOnce(function (Response) {
            //TO DO:
            top.API.Siu.SetPinPadLight('OFF');
            Clearup();
            //Entry the flows control process.
            App.Cntl.ProcessDriven(Response);
        });
    var Initialize = function () {

        App.Timer.TimeoutDisposal(TimeoutCallBack);
        ButtonDisable();
        EventLogin();
//top.API.Pin.CancelGetPin();
        //@initialize scope start    
        top.API.Pin.GetPin(6, 6, false, "0,1,2,3,4,5,6,7,8,9,ENTER,CLEAR,CANCEL", "ENTER,CANCEL", -1);
        top.API.Siu.SetPinPadLight('CONTINUOUS');
        InputPwdObj.focus();
        CardNo = top.API.gCardno;
        ButtonEnable();
        App.Plugin.Voices.play("voi_11");
        top.API.displayMessage("开始FormatPin6666");
    }();//Page Entry

    //@User ocde scope start
    //重新输入密码
    function Reinput() {
        top.API.Pin.GetPin(6, 6, false, "0,1,2,3,4,5,6,7,8,9,ENTER,CLEAR,CANCEL", "ENTER,CANCEL", -1);
        Inputdata = "";
        InputPwdObj.value = Inputdata;
        ButtonEnable();
    }

    //获取pinblock值
    function GetPinblock() {
        top.API.displayMessage("开始FormatPin");
        var pbCustomerdata = CardNo.substr(CardNo.length - 13, 12);
        var pbFormat = 'ANSI';
        var pbKeyname = 'PINKEY';
        top.API.displayMessage("开始Forma4444tPin");
        top.API.Pin.PinBlock(pbFormat, pbCustomerdata, 15, pbKeyname, "", "", 32768);
    }

    function ButtonDisable() {
        document.getElementById('PageRoot').disabled = true;
        // document.getElementById('OK').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('PageRoot').disabled = false;
        // document.getElementById('OK').disabled = false;
    }

    document.getElementById("PageRoot").onclick = function () {
        ButtonDisable();
        top.API.Pin.CancelGetPin();
        top.ErrorInfo = top.API.PromptList.No2;
        return CallResponse("BackHomepage");
    };

    //@User code scope end 

    //event handler
    function onKeyPressed(key, keyCode) {
        //ErrorTipObj.style.display = "none";
        switch (key) {
            case '*':
                Inputdata += "*";
                InputPwdObj.value = Inputdata;
                break;
            case 'CLEAR':
                Inputdata = "";
                InputPwdObj.value = Inputdata;
                break;
            case 'CANCEL':
                ButtonDisable();
                break;
            case 'ENTER':
                break;
            default:
                top.API.displayMessage("接收Key值异常，Key=" + key);
                break;
        }
    }

    //event handler
    function onGetPinCompleted() {
        top.API.displayMessage("onGetPinCompleted");
        if (Inputdata.length == 6) {
            ButtonDisable();
            GetPinblock();
        } else {
            Files.ErrorMsg("密码格式输入错误，请重新输入");
            // ErrorTipObj.style.display = "block";
            top.API.Pin.CancelGetPin();
            Reinput();
        }
    }

    //event handler
    function onTimeout() {
        top.ErrorInfo = top.API.PromptList.No3;
        return CallResponse("TimeOut");
    }

    //event handler
    function onPinBlockCompleted(Pinblock) {
        top.API.displayMessage("top.API.gbContinueTransFlag" + top.API.CashInfo.Dealtype);
        switch (top.API.CashInfo.Dealtype) {
            case '存折业务':
                top.API.gATMORTCR = "TCR";
                var arrATMORTCR = new Array("TCR");
                top.API.Dat.SetDataSync("ATMORTCR", "STRING", arrATMORTCR);
                top.API.gTransactiontype = "QRYCUSTNAME";
                break;
            case '存折取款':
                top.API.gTransactiontype = "QRYCWDMONEY";
                break;
            case 'INQ':
                top.API.gTransactiontype = "INQ";
                break;
            default:
                break;
        }
        //return CallResponse("OK");
        top.API.displayMessage("top.API.gbContinueTransFlag" + top.API.gbContinueTransFlag);
        if (top.API.gbContinueTransFlag) {
            if (top.API.gNotINQ &&top.API.gTranType != 'CWD') {
                return CallResponse("NotINQ");
            } else {
                if (top.API.gTranType == 'CWD') {
                    return CallResponse("CWD");
                } else {
                    communicate();
                }
            }
        } else {
            communicate();
        }
    }

    function communicate() {
        top.API.gTransactiontype == "INQ"
        //arrTransType = "INQ";
        arrTransType = "INQ";
        Files.showNetworkMsg("交易处理中,请稍候...");
        top.API.displayMessage("Start 获取流水号" + arrTransType);
        var nRet1 = top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);
    }

    /***验密****/

    //组包
    function onCompositionDataCompleted(arrData) {
        var objArrData = arrData;
        var HexWorkKey = top.stringToHex(objArrData);
        top.API.Pin.GenerateMAC(HexWorkKey, "MACKEY", '', 0, 0);
    }

    function onCompositionDataFail() {
        top.API.displayMessage("onCompositionDataFail is done");
        Files.ErrorMsg("通讯失败，交易结束");
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
                //PrintJnl("查询成功", "CODE=" + arrTransType);
                //return CallResponse("OK");
                top.API.displayMessage("gTransactiontype is " + arrTransType);
                if (arrTransType == "INQ") {
                    var objGet1 = top.API.Dat.GetDataSync(top.API.customernameTag, top.API.customernameType);
                    if (null == objGet1) {
                        top.API.gCustomerName = "";
                    } else {
                        top.API.gCustomerName = objGet1[0].replace(/\s+/g, "");
                    }
                    if (top.API.gTranType == 'CWD') {
                        return CallResponse("CWD");
                    } else {
                        return CallResponse("OK");
                    }

                }
                break;
            case '26':
                Files.ErrorMsg("密码错,请重新输入！");
                setTimeout(function () {
                    Reinput();
                }, 4000);
                break;
            case '27':
                Files.ErrorMsg("密码错误次数超限！");
                setTimeout(function () {
                    return CallResponse("Exit");
                }, 4000);
                break;
            default:
                // 获取错误待显示提示信息
                var sTranCode = top.API.Dat.GetPrivateProfileSync("TranCode", tmpCheck, "交易失败", top.API.Dat.GetBaseDir() + top.API.gIniTranCode);
                Files.ErrorMsg(sTranCode);
                setTimeout(function () {
                    return CallResponse("Exit");
                }, 4000);
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

    /********************************************************************************************************/
    //永久数据模块
    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        var arrDataValue = DataValue;
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
        if ('JNLNUM' == DataName.substr(0, 6)) {
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

    /**验密结束*/


    function onGetPinCancelled() {
        top.API.displayMessage("键盘点击取消按键GetPinCancelled");
        top.ErrorInfo = top.API.PromptList.No2;
        return CallResponse("Exit");
    }

    function onDeviceError() {
        top.API.displayMessage(top.API.PromptList.No4);
        top.ErrorInfo = top.API.PromptList.No4;
        return CallResponse("Exit");
    }

    function onGetPinFailed() {
        top.API.displayMessage("onGetPinFailed触发");
        top.ErrorInfo = top.API.PromptList.No4;
        return CallResponse("Exit");
    }

    function onPinBlockFailed() {
        top.API.displayMessage("onPinBlockFailed触发");
        top.ErrorInfo = top.API.PromptList.No4;
        return CallResponse("Exit");
    }

    function onGetPinCancelFailed() {
        top.API.displayMessage("onGetPinCancelFailed触发");
        top.ErrorInfo = top.API.PromptList.No4;
        return CallResponse("Exit");
    }

    //Register the event
    function EventLogin() {
        top.API.Pin.addEvent("KeyPressed", onKeyPressed);
        top.API.Pin.addEvent("GetPinCompleted", onGetPinCompleted);
        top.API.Pin.addEvent("GetPinFailed", onGetPinFailed);
        top.API.Pin.addEvent("DeviceError", onDeviceError);
        top.API.Pin.addEvent("GetPinCancelled", onGetPinCancelled);
        top.API.Pin.addEvent("GetPinCancelFailed", onGetPinCancelFailed);
        top.API.Pin.addEvent("Timeout", onTimeout);
        top.API.Pin.addEvent("PinBlockCompleted", onPinBlockCompleted);
        top.API.Pin.addEvent("PinBlockFailed", onPinBlockFailed);


        top.API.Tcp.addEvent("SendFailed", onTcpSendFailed);
        top.API.Tcp.addEvent("OnRecved", onTcpOnRecved);
        top.API.Tcp.addEvent("CompositionDataCompleted", onCompositionDataCompleted);
        top.API.Tcp.addEvent("CompositionDataFail", onCompositionDataFail);
        top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.addEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.addEvent("SetPersistentDataError", onDatSetPersistentDataError);
        top.API.Pin.addEvent("MACGenerated", onMACGenerated);
        top.API.Tcp.addEvent("Timeout", onTcpTimeout);
        top.API.Tcp.addEvent("AnalysisFailed", onAnalysisFailed);
        top.API.Pin.addEvent("CryptFailed", onCryptFailed);

    }

    function EventLogout() {
        top.API.Pin.removeEvent("GetPinCancelled", onGetPinCancelled);
        top.API.Pin.removeEvent("GetPinCancelFailed", onGetPinCancelFailed);
        top.API.Pin.removeEvent("KeyPressed", onKeyPressed);
        top.API.Pin.removeEvent("GetPinCompleted", onGetPinCompleted);
        top.API.Pin.removeEvent("GetPinFailed", onGetPinFailed);
        top.API.Pin.removeEvent("DeviceError", onDeviceError);
        top.API.Pin.removeEvent("Timeout", onTimeout);
        top.API.Pin.removeEvent("PinBlockCompleted", onPinBlockCompleted);
        top.API.Pin.removeEvent("PinBlockFailed", onPinBlockFailed);

        top.API.Tcp.removeEvent("SendFailed", onTcpSendFailed);
        top.API.Tcp.removeEvent("OnRecved", onTcpOnRecved);
        top.API.Tcp.removeEvent("CompositionDataCompleted", onCompositionDataCompleted);
        top.API.Tcp.removeEvent("CompositionDataFail", onCompositionDataFail);
        top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.removeEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.removeEvent("SetPersistentDataError", onDatSetPersistentDataError);
        top.API.Pin.removeEvent("MACGenerated", onMACGenerated);
        top.API.Tcp.removeEvent("Timeout", onTcpTimeout);
        top.API.Tcp.removeEvent("AnalysisFailed", onAnalysisFailed);
        top.API.Pin.removeEvent("CryptFailed", onCryptFailed);
    }

    //Countdown function
    function TimeoutCallBack() {
        top.API.Pin.CancelGetPin();
        top.ErrorInfo = top.API.PromptList.No3;
        return CallResponse("TimeOut");
    }

    //Page Return

    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
        App.Plugin.Voices.del();
        App.Timer.ClearTime();
    }
})();
