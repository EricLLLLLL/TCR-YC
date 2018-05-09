;(function () {
    var CallResponse = App.Cntl.ProcessOnce(function (Response) {
            //TO DO:
            Clearup();
            //Entry the flows control process.
            App.Cntl.ProcessDriven(Response);
        }),
        Files = new dynamicLoadFiles(),
        JnlNum = "",
        arrTransType,
        nDepSendTimes = 0,
        arrTransactionResult = "TRANFAIL";
        Initialize = function () {
            ButtonDisable();
            EventLogin();
            ButtonEnable();
            //@initialize scope start
            WriteAcctFileAfterTCP("AT", ""); //进页面先写一次，报文接收后再写一次
            document.getElementById('remitNumberInfo').innerText = top.API.PayeeAccount;
            var strName = '';
            strName += '*';
            strName += top.API.gTFRCustomerName.substr(1, (top.API.gTFRCustomerName.length - 1));
            document.getElementById('remitAccountInfo').innerText = strName;
            var showmoney = "CNY " + top.API.CashInfo.strTransAmount + ".00";
            document.getElementById('remitMoneyInfo').innerText = showmoney;

            top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["现金汇款金额:"+showmoney]);
            top.API.Jnl.PrintSync("Content");
            //document.getElementById('remitAmountInfo').innerText = top.API.gAcceptCounts;
            $('#t100').text(top.API.CashInfo.arrCurrencyCashIn[0]);
            $('#t50').text(top.API.CashInfo.arrCurrencyCashIn[1]);
            $('#t20').text(top.API.CashInfo.arrCurrencyCashIn[2]);
            $('#t10').text(top.API.CashInfo.arrCurrencyCashIn[3]);
            $('#t5').text(top.API.CashInfo.arrCurrencyCashIn[4]);
            $('#t1').text(top.API.CashInfo.arrCurrencyCashIn[5]);
            $('#tCash').text(top.API.CashInfo.strTransAmount + ".00");
            var CwdFee = "";
            var objGetFee = top.API.Dat.GetDataSync("POUNDAGE", top.API.customernameType);
            if (null != objGetFee) {
                CwdFee = objGetFee[0];
            } else {
                top.API.displayMessage("GetDataSync POUNDAGE type is STRING, DataValue is NULL");
            }
            App.Timer.TimeoutDisposal(TimeoutCallBack);
            if (CwdFee == "0") {
                top.API.gTransactiontype = 'NOCARDTFR'; // 转账汇款
                Files.showNetworkMsg("交易处理中,请稍候...");
				arrTransType = 'NOCARDTFR'; // 转账汇款
                top.API.displayMessage("Start 获取流水号" + top.API.gTransactiontype);
                top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);
            } else {
                var Poundage;
                var PoundageFee = top.API.Dat.GetDataSync("POUNDAGE", "STRING")[0]
                if (PoundageFee.length > 2) {
                    Poundage = PoundageFee.substr(0, (PoundageFee.length - 2));
                    Poundage += ".";
                    Poundage += PoundageFee.substr((PoundageFee.length - 2), 2);
                } else if (PoundageFee.length == 2) {
                    Poundage = "0." + PoundageFee;
                } else if (PoundageFee.length == 1) {
                    Poundage = "0.0" + PoundageFee;
                }
                $('#remitFeeInfo').text(Poundage);
            }                        
        }();//Page Entry

    function ButtonDisable() {
        //document.getElementById('Exit').disabled = true;
        document.getElementById('OK').disabled = true;
        //document.getElementById('PageRoot').disabled = true;
    }

    function ButtonEnable() {
        //document.getElementById('Exit').disabled = false;
        document.getElementById('OK').disabled = false;
        //document.getElementById('PageRoot').disabled = false;
    }

    //@User ocde scope start
    // document.getElementById('Exit').onclick = function(){

    //      //return CallResponse('Exit');
    //      return CallResponse('Back');   //苏可 
    // }

    // document.getElementById('PageRoot').onclick = function () {
    //     ButtonDisable();        
    //     return CallResponse('Exit');
    // }    


    document.getElementById('OK').onclick = function () {
        top.API.gTransactiontype = 'NOCARDTFR'; // 转账汇款
        arrTransType = 'NOCARDTFR'; // 转账汇款
        //arrTransType = "NOCARDDEP"; NOCARDDEP  //TRANSFERACTS
        Files.showNetworkMsg("交易处理中,请稍候...");
        top.API.displayMessage("Start 获取流水号" + top.API.gTransactiontype);
        //top.API.Dat.SetDataSync("TRANSFERTIMES", "STRING", [top.API.TRANSFERTIMES]); // 设置第一次转账标识 1第一次 2第二次
        //top.API.Dat.SetDataSync("TFRCARDNO", "STRING", [top.API.PayeeAccount]); // 设置转入卡卡号
        //top.API.Dat.SetDataSync("INCUSTOMERNAME", "STRING", [PayeeName]); // 设置转入户名

        var nRet1 = top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);

        //return CallResponse('OK');
    }

    //@User code scope end


    //组包
    function onCompositionDataCompleted(arrData) {
        var objArrData = arrData;
        var HexWorkKey = top.stringToHex(objArrData);
        top.API.Pin.GenerateMAC(HexWorkKey, "MACKEY", '', 0, 0);
    }

    function onCompositionDataFail() {
        top.API.displayMessage("onCompositionDataFail is done");
        Files.ErrorMsg("通讯失败，交易结束");        
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

    function printReceipt() {
        var content = "";
        var tempStr = top.API.Dat.GetDataSync("SYSREFNUM","STRING")[0];
        tempStr = tempStr.substr(tempStr.length - 8, 8);
        content += "P1=" + 179970113 + tempStr;//交易流水号
        content += ",P2=" + top.API.Dat.GetPersistentDataSync("TERMINALNUM","STRING")[0];
        content += ",P3=" + top.API.Dat.GetPersistentDataSync("SUBBANKNUM","STRING")[0];//交易机构号
        content += ",P4=" + top.API.Dat.GetPersistentDataSync("BANKCODE","STRING")[0];//网点机构号
        //content += ",P2=" + "61000106";//终端设备号
        // content += ",P3=" + "4498322Z";//交易机构号
        //content += ",P4=" + "6199908Q";//网点机构号
        content += ",P5=" + top.GetDate12byte().substring(0, 8);//交易日期
        content += ",P6=" + top.API.gEmpno;//授权员编号
        content += ",P7=" + "";//授权员姓名
        content += ",P8=" + top.API.gIdName;//姓名
        content += ",P9=" + top.API.gIdSex;//性别
        content += ",P10=" + top.API.gIdNation;//民族
        content += ",P11=" + "身份证";//证件类型
        content += ",P12=" + top.API.gIdNumber;//身份号码
        content += ",P13=" + top.API.gIdBirthday;//出生日期
        content += ",P14=" + top.API.gIdAddress;//家庭住址
        content += ",P15=" + top.API.gIdDepartment;//签发机关
        content += ",P16=" + top.API.gIdEndtime;
        content += ",P17=" + "";//手机号码
        content += ",P18=" + "";//邮政编码
        content += ",P19=" + "客户身份证号码与姓名一致，且有客户照片";//反馈联网核查结果
        content += ",P20=" + "大额现金汇款";//业务类型
        content += ",P21=" + top.API.PayeeAccount;//交易卡号
        content += ",P22=" + "";//
        content += ",P23=" + "";//转入卡号
        content += ",P24=" + "汇款";//
        content += ",P25=" + top.API.CashInfo.strTransAmount + ".00";//交易金额
        content += ",P26=" +  top.API.gIdStarttime;//开始日期
        content += ",P27=" + top.API.gIdCardpic;//身份证头像
        content += ",P28=" + top.API.Dat.GetBaseDir() + top.API.gFaceCheckPic;//人脸识别
        content += ",P29=" + top.API.Dat.GetBaseDir() + top.API.gCheckIdCardpic;//联网核查
        content += ",P30=" + top.API.gIdFrontImage;//身份证前
        content += ",P31=" + top.API.gIdBackImage;//身份证后
        top.API.Jst.WriteReceiptFile(top.API.Dat.GetBaseDir() + "/DATA/ReceiptData/"+tempStr+".html", content);

        top.API.Spt.RawData(top.API.Dat.GetBaseDir() + "/DATA/ReceiptData/"+tempStr+".html", -1);
        return CallResponse("OK");
//         //语音
//         App.Timer.ClearIntervalTime();
//         Files.showNetworkMsg("正在打印回单，请稍后！");
    }

    function SetJnlCashInBoxData(ReCode) {
        var CurrentInfo5 = top.API.CashInfo.arrAcceptorCount[5]
        if (typeof CurrentInfo5 == 'undefined') {
            CurrentInfo5 = 0;
        }
        var CurrentInfo6 = top.API.CashInfo.arrAcceptorCount[6]
        if (typeof CurrentInfo6 == 'undefined') {
            CurrentInfo6 = 0;
        }
        var strJNLData = ", RMB100=" + top.API.CashInfo.arrCurrencyCashIn[0] + ", RMB50=" + top.API.CashInfo.arrCurrencyCashIn[1]
            + ", RMB20=" + top.API.CashInfo.arrCurrencyCashIn[2] + ", RMB10=" + top.API.CashInfo.arrCurrencyCashIn[3]
            + ", RMB5=" + top.API.CashInfo.arrCurrencyCashIn[4] + ", RMB1=" + top.API.CashInfo.arrCurrencyCashIn[5]
            + ", iBOX1=" + top.API.CashInfo.arrAcceptorCount[0] + ", iBOX2=" + top.API.CashInfo.arrAcceptorCount[1]
            + ", iBOX3=" + top.API.CashInfo.arrAcceptorCount[2] + ", iBOX4=" + top.API.CashInfo.arrAcceptorCount[3]
            + ", iBOX5=" + top.API.CashInfo.arrAcceptorCount[4] + ", iBOX6=" + CurrentInfo5
            + ", iBOX7=" + CurrentInfo6;
        top.API.displayMessage("strJNLData=" + strJNLData);
        var arrCashOutBoxData = new Array(strJNLData);
        if (ReCode == "00") {
            arrTransactionResult = "TRANSUCCESS";
        }
        top.API.Dat.SetDataSync("TRANSACTIONRESULT", "STRING", [arrTransactionResult]);
        top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, arrCashOutBoxData);
        top.API.Jnl.PrintSync("CashInBox");
    }

    function onTcpOnRecved(tmpCheck) {
        top.API.displayMessage("onTcpOnRecved is done,CheckCode:" + tmpCheck);
        WriteAcctFileAfterTCP("", tmpCheck);
        SetJnlCashInBoxData(tmpCheck);
        switch (tmpCheck) {
            case '00':
                if (top.API.gTransactiontype == "NOCARDTFR") {
                    if (top.API.gTranType == 'largeRemit') {
                        //打印回执单
                        printReceipt();
                    } else {
                        return CallResponse("OK");
                    }
                }
                break;
            case '26':
                Files.ErrorMsg("密码错误！");
                setTimeout(function () {
                    return CallResponse("Exit");
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
                if ((tmpCheck == "Z1" || tmpCheck == "Z2" || tmpCheck == "2H")) {
                    top.API.Dat.SetPersistentDataSync(top.API.cwcflagTag, top.API.cwcflagType, [2]);
                }
                Files.ErrorMsg(sTranCode);

                setTimeout(function () {
                    return CallResponse("Exit");
                }, 4000);                               
                break;
        }
    }

    function SetTimeDepAgain() {
        if (nDepSendTimes == 0) {
            App.Timer.SetIntervalDisposal(noCardDepAgain, 60000);
        }
    }

    function noCardDepAgain() {
        arrTransType = "RENOCARDTFR";
        nDepSendTimes++;
        Files.showNetworkMsg("交易处理中,请稍候...");
        top.API.displayMessage("Start 获取流水号" + arrTransType);
        App.Timer.SetPageTimeout(70);
        top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);
    }

    function WriteAcctFileAfterTCP(Reason, sRetCode) {
        var sTransAmount = top.API.CashInfo.strTransAmount;// + ".00"
        var sAccoutNo = top.API.PayeeAccount;
        top.API.Tsl.UpdateRecord(sAccoutNo + ", " + "DEP" + ", " +
                sTransAmount + ", " + sTransAmount +
                ", " + sRetCode + ", " + Reason);
    }

    /********************************************************************************************************/
    //TCP模块    
    function onTcpSendFailed() {
        top.API.displayMessage("onTcpSendFailed is done");
        top.API.Dat.SetPersistentDataSync(top.API.cwcflagTag, top.API.cwcflagType, [2]);
        Files.ErrorMsg("通讯失败，交易结束");
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }

    function onTcpTimeout() {
        top.API.displayMessage("onTcpTimeout is done,top.API.gTransactiontype=" + top.API.gTransactiontype);
        top.API.Dat.SetPersistentDataSync(top.API.cwcflagTag, top.API.cwcflagType, [2]);
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
        if ('JNLNUM' == DataName) {
            top.API.Tcp.CompositionData(arrTransType);
        }else if("CWCFLAG" == DataName){
            var arrTransactionResult = new Array("TRANFAIL");
            top.API.Dat.SetDataSync("TRANSACTIONRESULT", "STRING", arrTransactionResult);
            //top.API.gTakeCardAndPrint = true; //退卡页面打印凭条
            // var arrComments = new Array("存款重发");
            // top.API.Dat.SetDataSync("COMMENTS", "STRING", arrComments);
            top.API.Ptr.Print("ReceiptCash_Print_szABC", "", top.API.gPrintTimeOut);
        }
    }

    function onDatSetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatSetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        Files.ErrorMsg("组包失败，交易结束");
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }

    function onRawDataComplete() {
        top.API.displayMessage("onRawDataComplete is done");
        // return CallResponse("OK");
    }

    function onRawDataFailed() {
        top.API.displayMessage("onRawDataFailed is done");
        // Files.ErrorMsg("打印回单失败！");
        // setTimeout(function () {
        //     return CallResponse("OK");
        // }, 4000);
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

        top.API.Spt.addEvent('RawDataComplete ', onRawDataComplete);
        top.API.Spt.addEvent('RawDataFailed ', onRawDataFailed);
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

        top.API.Spt.removeEvent('RawDataComplete ', onRawDataComplete);
        top.API.Spt.removeEvent('RawDataFailed ', onRawDataFailed);

    }

    //Countdown function
    function TimeoutCallBack() {
        // document.getElementById('OK').onclick();
        // return CallResponse('TimeOut');

        top.API.gTransactiontype = 'NOCARDTFR'; // 转账汇款
        //arrTransType = "NOCARDDEP"; NOCARDDEP  //TRANSFERACTS
        Files.showNetworkMsg("交易处理中,请稍候...");
        top.API.displayMessage("Start 获取流水号" + top.API.gTransactiontype);
        //top.API.Dat.SetDataSync("TRANSFERTIMES", "STRING", [top.API.TRANSFERTIMES]); // 设置第一次转账标识 1第一次 2第二次
        //top.API.Dat.SetDataSync("TFRCARDNO", "STRING", [top.API.PayeeAccount]); // 设置转入卡卡号
        //top.API.Dat.SetDataSync("INCUSTOMERNAME", "STRING", [PayeeName]); // 设置转入户名

        var nRet1 = top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);

    }

    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
        App.Timer.ClearTime();
        App.Timer.ClearIntervalTime();
    }
})();
