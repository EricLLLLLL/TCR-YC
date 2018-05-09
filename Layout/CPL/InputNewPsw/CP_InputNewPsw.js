/*@create by:  tsxiong
 *@time: 2016年03月20日
 */
;
(function () {
    var Inputdata = "";
    var inputdataPinblock1 = "";
    var inputdataPinblock2 = "";
    var Pressing = 0;
    var ExitFlag = 0;
    var CardNo = "";
    var returnFlag = 1;
    var Files = new dynamicLoadFiles();
    var arrTransType = "";
    var CallResponse = App.Cntl.ProcessOnce(function (Response) {
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
        //@initialize scope start
        top.API.Pin.GetPin(4, 6, false, "0,1,2,3,4,5,6,7,8,9,ENTER,CLEAR,CANCEL", "ENTER,CANCEL", -1);
        top.API.Siu.SetPinPadLight('CONTINUOUS');
        document.getElementById("newPWDvalue").focus();
        Pressing = 1;
        document.getElementById("disagreePWD").innerHTML = "";
        CardNo = top.API.gCardno;
        ButtonEnable();
        App.Plugin.Voices.play("voi_11");
    }(); //Page Entry

    //@User ocde scope start
    //重新输入密码
    function Reinput() {
        top.API.displayMessage("开始重新输入密码");
        top.API.Pin.GetPin(4, 6, true, "0,1,2,3,4,5,6,7,8,9,ENTER,CLEAR,CANCEL", "ENTER,CANCEL", -1);
        Pressing = 1;
        Inputdata = "";
        inputdataPinblock1 = "";
        inputdataPinblock2 = "";
        document.getElementById("newPWDvalue").value = Inputdata;
        document.getElementById("newPWDvalue2").value = Inputdata;
        ButtonEnable();
    }

    //获取pinblock值
    function GetPinblock() {
        top.API.displayMessage("开始FormatPin");
        var pbCustomerdata = CardNo.substr(CardNo.length - 13, 12);
        var pbFormat = 'ANSI';
        var pbKeyname = 'PINKEY';
        top.API.Pin.PinBlock(pbFormat, pbCustomerdata, 15, pbKeyname, "", "", 32768);
    }

    function ButtonDisable() {
        top.API.displayMessage("ButtonDisable");
        document.getElementById('Exit').disabled = true;
        document.getElementById('PageRoot').disabled = true;
        //document.getElementById('Alter').disabled = true;
    }

    function ButtonEnable() {
        top.API.displayMessage("ButtonEnable");
        document.getElementById('Exit').disabled = false;
        document.getElementById('PageRoot').disabled = false;
        // document.getElementById('Alter').disabled = false;
    }

    document.getElementById("PageRoot").onclick = function () {
        top.API.displayMessage("点击PageRoot按钮,执行<top.API.Pin.CancelGetPin()>,响应<Exit>");
        ButtonDisable();
        returnFlag = 2;
        top.API.Pin.CancelGetPin();
        //return CallResponse("Exit");
    };

    document.getElementById("Exit").onclick = function () {
        top.API.displayMessage("点击Exit按钮,执行<top.API.Pin.CancelGetPin()>,响应<Exit>");
        ButtonDisable();
        returnFlag = 1;
        top.API.Pin.CancelGetPin();
        //return CallResponse("Exit");

    };

    // document.getElementById("Alter").onclick = function () {
    //     top.API.displayMessage("点击更正");
    //     ButtonDisable();
    //     //return CallResponse("Exit");
    //     top.API.Pin.CancelGetPin();
    //     Reinput();
    //     ButtonEnable();
    // };

    // document.getElementById("OK").onclick = function () {
    //     top.API.displayMessage("点击OK按钮,执行<top.API.Pin.CancelGetPin()>,响应<RePsw>");
    //     ButtonDisable();
    //     Pressing = 2;
    //     top.API.Pin.CancelGetPin();
    // }

    //@User code scope end 

    //event handler
    function onKeyPressed(key, keyCode) {
        top.API.displayMessage("onKeyPressed触发，key=" + key);
        document.getElementById("disagreePWD").innerHTML = "";
        if ((0 == key || key <= 9) || ('*' == key)) {
            Inputdata += "*";
            if (Pressing == 1) {
                document.getElementById("newPWDvalue").value = Inputdata;
            } else {
                document.getElementById("newPWDvalue2").value = Inputdata;
            }
        } else if (key === "CLEAR") {
            Inputdata = "";
            if (Pressing == 1) {
                inputdataPinblock1 = "";
                document.getElementById("newPWDvalue").value = Inputdata;
            } else {
                inputdataPinblock2 = "";
                document.getElementById("newPWDvalue2").value = Inputdata;
            }
        } else if (key === "ENTER") {
            top.API.displayMessage("按ENTER");
        }
    }

    //event handler
    function onGetPinCompleted() {
        top.API.displayMessage("onGetPinCompleted触发，Inputdata.length=" + Inputdata.length);
        if (Inputdata.length < 6) {
            //document.getElementById("disagreePWD").innerHTML = "密码有误，请重新输入";
            Files.ErrorMsg("密码有误，请重新输入");
            Reinput();
        } else {
            if (Pressing == 1) {
                document.getElementById("disagreePWD").innerHTML = "";
                top.API.displayMessage("开始第一次getPinblock");
                GetPinblock();
            } else {
                document.getElementById("disagreePWD").innerHTML = "";
                top.API.displayMessage("开始第二次getPinblock");
                GetPinblock();
            }
        }
    }

    //event handler
    function onTimeout() {
        top.API.displayMessage("onTimeout触发,响应<Exit>");
        top.ErrorInfo = top.API.PromptList.No3;
        return CallResponse("TimeOut");
    }

    //event handler
    function onPinBlockCompleted(Pinblock) {
        //top.API.displayMessage("onPinBlockCompleted触发");
        top.API.displayMessage(Pinblock);
        top.API.displayMessage("onPinBlockCompleted触发,Pinblock=" + Pinblock);
        var strPinblock = '';
        var hexArray = new Array();
        var ntmp = 0;
        hexArray = Pinblock;
        for (var index = 0; index < 8; index++) {
            ntmp = parseInt(hexArray[index] % 65535);
            if (ntmp < 16) {
                if (ntmp == 0) {
                    strPinblock += "00";
                } else {
                    strPinblock += "0" + ntmp.toString(16);
                }
            } else {
                strPinblock += ntmp.toString(16);
            }
        }
        top.API.displayMessage("Pinblock(字符串)=" + strPinblock);
        if (Pressing == 1) {
            Inputdata = "";
            Pressing = 2;
            inputdataPinblock1 = strPinblock;
            document.getElementById("newPWDvalue2").focus();
            //语音
            top.API.displayMessage("开始再次输入新密码");
            //Files.ErrorMsg("请再次输入新密码");
            top.API.Pin.GetPin(4, 6, false, "0,1,2,3,4,5,6,7,8,9,ENTER,CLEAR,CANCEL", "ENTER,CANCEL", -1);
        } else if (Pressing == 2) {
            inputdataPinblock2 = strPinblock;
            if (inputdataPinblock2 != inputdataPinblock1) {
                top.API.displayMessage("两次输入密码不一致，重新开始输入密码");
                Files.ErrorMsg("两次输入密码不一致，重新开始输入密码");
                //语音
                //document.getElementById("disagreePWD").innerHTML = "两次输入密码不一致，重新开始输入密码";
                Reinput();
            } else {
                top.API.gNewPinBlock = Pinblock;
                if (top.API.gOldPinBlock != top.API.gNewPinBlock) {
                    var NEWPINBLOCK = top.API.gOldPinBlock + "" + top.API.gNewPinBlock;
                    top.API.Dat.SetDataSync("NEWPINBLOCK", "STRING", NEWPINBLOCK);
                 
                    //return CallResponse("OK");
                    PWD();
                } else {
                    Files.ErrorMsg("新密码不能与原密码相同，请重新输入");
                    Reinput();
                }
            }
        }
    }


    function PWD() {
        arrTransType = "PWD";
        Files.showNetworkMsg("交易处理中,请稍候...");
        top.API.displayMessage("Start 获取流水号" + arrTransType);
        var nRet1 = top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);
    }

    function GetBalanceInfo() {
        var strBalance;
        var objGet3 = top.API.Dat.GetDataSync(top.API.currentbalanceTag, top.API.currentbalanceType);
        if (null == objGet3) {
            top.API.displayMessage("GetDataSync CURRENTBALANCE objGet = null");
            top.API.gCURRENTBALANCE = "";
        } else {
            if (objGet3[0].length > 2) {
                strBalance = objGet3[0].substr(0, (objGet3[0].length - 2));
                strBalance += ".";
                strBalance += objGet3[0].substr((objGet3[0].length - 2), 2);
            } else if (objGet3[0].length == 2) {
                strBalance = "0." + objGet3[0];
            } else if (objGet3[0].length == 1) {
                strBalance = "0.0" + objGet3[0];
            }
            top.API.gCURRENTBALANCE = strBalance;
        }
        var strAvailableBalance;
        var objGet4 = top.API.Dat.GetDataSync(top.API.availablebalanceTag, top.API.availablebalanceType);
        if (null == objGet4) {
            top.API.displayMessage("GetDataSync AVAILABLEBALANCE objGet = null");
            top.API.gAVAILABLEBALANCE = "";
        } else {
            if (objGet4[0].length > 2) {
                strAvailableBalance = objGet4[0].substr(0, (objGet4[0].length - 2));
                strAvailableBalance += ".";
                strAvailableBalance += objGet4[0].substr((objGet4[0].length - 2), 2);
            } else if (objGet4[0].length == 2) {
                strAvailableBalance = "0." + objGet4[0];
            } else if (objGet4[0].length == 1) {
                strAvailableBalance = "0.0" + objGet4[0];
            }
            top.API.gAVAILABLEBALANCE = strAvailableBalance;
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
                top.API.displayMessage("gTransactiontype is " + top.API.gTransactiontype);
                if (arrTransType == "PWD") {
                    GetBalanceInfo();
                       // 打印流水
                       top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["InputNewPsw设置新密码成功"]);
                       top.API.Jnl.PrintSync("Content");
                    return CallResponse("OK");
                }
                break;
            case '26':
                Files.ErrorMsg("原密码输入错误，请重新输入原密码");
                   // 打印流水
                   top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["InputNewPsw原密码输入错误重新输入原密码"]);
                   top.API.Jnl.PrintSync("Content");
                setTimeout(function () {
                    return CallResponse("RePsw");
                }, 4000);
                break;
            case '27':
                Files.ErrorMsg("密码错误次数超限！");
                 // 打印流水
                 top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["InputNewPsw密码错误次数超限"]);
                 top.API.Jnl.PrintSync("Content");
                setTimeout(function () {
                    return CallResponse("Exit");
                }, 4000);
                break;
            default:
                // 获取错误待显示提示信息
                var sTranCode = top.API.Dat.GetPrivateProfileSync("TranCode", tmpCheck, "交易失败", top.API.Dat.GetBaseDir() + top.API.gIniTranCode);
                 // 打印流水
                 top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["InputNewPsw交易失败"]);
                 top.API.Jnl.PrintSync("Content");
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

    function onGetPinCancelled() {
        top.API.displayMessage("onGetPinCancelled触发");
        if (returnFlag == 1) {
            return CallResponse("Exit");
        } else if (returnFlag == 2) {
            top.API.displayMessage("页面超时触发，响应<TimeOut>");
            //top.ErrorInfo = top.API.PromptList.No3;
            return CallResponse("BackHomepage");
        } else if (returnFlag == 3) {
            top.API.displayMessage("密码键盘触发，响应<Exit>");
            top.ErrorInfo = top.API.PromptList.No3;
            return CallResponse("TimeOut");
        }
    }

    function onDeviceError() {
        top.API.displayMessage("onDeviceError触发");
        top.ErrorInfo = top.API.PromptList.No4;
        return CallResponse("Exit");
        //return CallResponse("onDeviceError");
    }

    function onGetPinFailed() {
        top.API.displayMessage("onGetPinFailed触发");
        top.ErrorInfo = top.API.PromptList.No4;
        return CallResponse("Exit");
    }

    function onPinBlockFailed() {
        top.API.displayMessage("onGetPinCancelled触发");
        if (Pressing == 2) {
            return CallResponse("Exit");
        } else if (Pressing == 3) {
            top.API.displayMessage("页面超时触发，响应<TimeOut>");
            top.ErrorInfo = top.API.PromptList.No3;
            return CallResponse("TimeOut");
        } else if (Pressing == 3) {
            top.API.displayMessage("密码键盘触发，响应<Exit>");
            //top.ErrorInfo = top.API.PromptList.No2;
            return CallResponse("BackHomepage");
        } else {
            top.API.displayMessage("密码键盘触发，响应<Exit>");
            top.ErrorInfo = top.API.PromptList.No2;
            return CallResponse("Exit");
        }
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
        top.API.Dat.removeEvent("SetPersistentDataError", onDatSetPersistentDataError)
        top.API.Pin.removeEvent("MACGenerated", onMACGenerated);
        top.API.Tcp.removeEvent("Timeout", onTcpTimeout);
        top.API.Tcp.removeEvent("AnalysisFailed", onAnalysisFailed);
        top.API.Pin.removeEvent("CryptFailed", onCryptFailed);
    }

    //Countdown function
    function TimeoutCallBack() {
        top.API.displayMessage("页面超时,执行<top.API.Pin.CancelGetPin()>,响应<TimeOut>");
        Pressing = 3;
        returnFlag = 3;
        top.API.Pin.CancelGetPin();
        //return CallResponse("Exit");
    }

    //Page Return

    //remove all event handler
    function Clearup() {
        //TO DO:
        //top.API.Pin.CancelGetPin();
        EventLogout();
        App.Plugin.Voices.del();
        App.Timer.ClearTime();
    }
})();