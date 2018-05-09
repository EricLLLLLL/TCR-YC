;
(function () {
    // var BtnIdArr = ['Exit', 'OK'];
    var arrTransType,
        QueryBalance="",
        Files = new dynamicLoadFiles(),
        CallResponse = App.Cntl.ProcessOnce(function (Response) {
            //TO DO:
            Clearup();
            //Entry the flows control process.
            App.Cntl.ProcessDriven(Response);
        }),
        Initialize = function () {
            EventLogin();
            //@initialize scope start
            // 控制按钮是否可点击 需要控制的按钮的id
            //BtnEnable(BtnIdArr); // 可以点击
            //BtnDisable(BtnIdArr); // 失效 不能点击
            ButtonDisable();
            ButtonEnable();
            App.Timer.TimeoutDisposal(TimeoutCallBack);

            // 他行卡、外省卡、信用卡点击查询按钮，终端直接显示账户余额
            // 1 为本行本省，2 为本行外省，3 为它行卡，4 为本行贷记卡，5 本省绿卡通，
            // 6 外省绿卡通，7 本省绿卡通副卡，8 外省绿卡通副卡, 0 本省存折，9 外省存折
            if (top.API.gCardBankType == "2" || top.API.gCardBankType == "3" || top.API.gCardBankType == "4"
                || top.API.gCardBankType == "6" || top.API.gCardBankType == "8") {
                arrTransType = "INQ";
                Files.showNetworkMsg("正在通讯中，请稍后...");
                $('#queryBalance').css("display","none");
                $('#queryDetail').css("display", "none");
                top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);
            }
        }(); //Page Entry
    //@User ocde scope start


    function ButtonDisable() {
        document.getElementById('queryBalance').disabled = true;
        document.getElementById('queryDetail').disabled = true;
        document.getElementById('Exit').disabled = true;
        document.getElementById('PageRoot').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('queryBalance').disabled = false;
        document.getElementById('queryDetail').disabled = false;
        document.getElementById('Exit').disabled = false;
        document.getElementById('PageRoot').disabled = false;
    }

    document.getElementById("PageRoot").onclick = function () {
        ButtonDisable();
        return CallResponse("BackHomepage");
    };
    document.getElementById("Exit").onclick = function () {
        ButtonDisable();
        return CallResponse("Exit");
    };
    document.getElementById("queryBalance").onclick = function () {
        ButtonDisable();
        arrTransType = "INQ";
        queryBalance()

    };
    document.getElementById("queryDetail").onclick = function () {
        ButtonDisable();
        arrTransType = "TDI";
        queryBalance();
        //return CallResponse("INQ_DETAIL_OK");
    };
    function queryBalance() {
        Files.showNetworkMsg("交易处理中,请稍候...");
        top.API.displayMessage("Start 获取流水号" + arrTransType);
        var nRet1 = top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);
    }
     function PrintJnl() {
         var QueryBalanceDate= new Array(QueryBalance);
         top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, QueryBalanceDate);
         top.API.Jnl.PrintSync("Content");
    }
    function getTransDetail() {
        var strTransDetail;
        var objGet4 = top.API.Dat.GetDataSync("DETAILINFO", "STRING");
        if (null == objGet4) {
            top.API.displayMessage("GetDataSync strTransDetail objGet = null");
            top.API.gTransDetail = "";
        } else {
            top.API.displayMessage("GetDataSync strTransDetail objGet = "+objGet4);
            top.API.gTransDetail = objGet4;
        }
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
            QueryBalance="组包失败";
            PrintJnl();
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
                if (arrTransType == "INQ") {
                    GetBalanceInfo();
                    QueryBalance="查询类型：查询余额";
                    PrintJnl();
                    return CallResponse("INQ_OK");
                }else if (arrTransType == "TDI") {
                    getTransDetail();
                    QueryBalance="查询类型：查询明细";
                    PrintJnl();
                    return CallResponse("INQ_DETAIL_OK");
                }
                break;
            default:
                // 获取错误待显示提示信息
                var sTranCode = top.API.Dat.GetPrivateProfileSync("TranCode", tmpCheck, "交易失败", top.API.Dat.GetBaseDir() + top.API.gIniTranCode);
                Files.ErrorMsg(sTranCode);
                setTimeout(function () {
                    QueryBalance="查询类型：失败";
                    PrintJnl();
                    return CallResponse("Exit");
                }, 4000);
                break;
        }
        ;
    }

    /********************************************************************************************************/
    //TCP模块    
    function onTcpSendFailed() {
        top.API.displayMessage("onTcpSendFailed is done");
        Files.ErrorMsg("通讯失败，交易结束");
        setTimeout(function () {
            QueryBalance="发送报文失败";
            PrintJnl();
            return CallResponse("Exit");
        }, 4000);
    }

    function onTcpTimeout() {
        top.API.displayMessage("onTcpTimeout is done,arrTransType=" + arrTransType);
        Files.ErrorMsg("通讯超时，交易结束");
        setTimeout(function () {
            QueryBalance="通讯超时";
            PrintJnl();
            return CallResponse("Exit");
        }, 4000);
    }

    function onAnalysisFailed() {
        top.API.displayMessage("onAnalysisFailed is done");
        Files.ErrorMsg("报文解析失败，交易结束");
        setTimeout(function () {
            QueryBalance="报文解析失败";
            PrintJnl();
            return CallResponse("Exit");
        }, 4000);
    }

    //event handler
    function onDeviceError() {
        top.API.displayMessage('键盘触发事件：onDeviceError()');
        Files.ErrorMsg("通讯失败，交易结束");
        setTimeout(function () {
            QueryBalance="键盘故障";
            PrintJnl();
            return CallResponse("Exit");
        }, 4000);
    }

    //event handler
    function onCryptFailed() {
        top.API.displayMessage('键盘加解密失败：onCryptFailed');
        Files.ErrorMsg("键盘加解密失败，交易结束");
        setTimeout(function () {
            QueryBalance="键盘加密失败";
            PrintJnl();
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
            QueryBalance="组包失败";
            PrintJnl();
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
            QueryBalance="组包失败";
            PrintJnl();
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
        top.API.Pin.addEvent("MACGenerated", onMACGenerated);
        top.API.Tcp.addEvent("Timeout", onTcpTimeout);
        top.API.Tcp.addEvent("AnalysisFailed", onAnalysisFailed);
        top.API.Pin.addEvent("CryptFailed", onCryptFailed);

        top.API.Pin.addEvent('DeviceError ', onDeviceError);
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
        top.API.Pin.removeEvent("MACGenerated", onMACGenerated);
        top.API.Tcp.removeEvent("Timeout", onTcpTimeout);
        top.API.Tcp.removeEvent("AnalysisFailed", onAnalysisFailed);
        top.API.Pin.removeEvent("CryptFailed", onCryptFailed);
        top.API.Pin.removeEvent('DeviceError ', onDeviceError);

    }

    //Countdown function
    function TimeoutCallBack() {
        QueryBalance="超时";
        PrintJnl();
        return CallResponse("TimeOut");
    }

    //Page Return
    // function CallResponse(Response) {
    //     //TO DO:
    //     Clearup();
    //     //Entry the flows control process.
    //     App.Cntl.ProcessDriven(Response);
    // }

    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
        App.Timer.ClearTime();
    }
})();
