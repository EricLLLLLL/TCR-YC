;
(function () {
    var capitalMoney,//大写转账金额
        TransferType = top.API.CashInfo.Dealtype, // 行内转账 InLineFlag，行外转账 OutLineFlag
        PayeeName = top.API.Dat.GetDataSync("INCUSTOMERNAME", "STRING")[0],//收款方户名：
        // PayeeBank =  top.API.PayeeBank,//收款方行方：
        TransferMoney = top.API.TransferMoney,//转账金额：
        PayeeAccount = top.API.PayeeAccount,//收款方账号：
        Dealtype = top.API.CashInfo.Dealtype, // 行内转账 InLineFlag，行外转账 OutLineFlag
        transferWay = '',
        arrTransType = "",
        strErrMsg = "",
        JnlNum = "",
        Files = new dynamicLoadFiles(),
        CallResponse = App.Cntl.ProcessOnce(function (Response) {
            //TO DO:
            Clearup();
            //Entry the flows control process.
            App.Cntl.ProcessDriven(Response);
        }),
        Initialize = function () {
            EventLogin();
            ButtonDisable();
            //@initialize scope start
            showInfo();
            top.ErrorInfo = top.API.PromptList.No1;
            //为打凭条设置数据
            setInfoForJnl();
            ButtonEnable();
            //top.API.PayeeName = PayeeName;//收款方户名：
            App.Timer.TimeoutDisposal(TimeoutCallBack);

        }(); //Page Entry

    function showInfo() {
        $('#tranNumberInfo').text(PayeeAccount);
        var strName = '';
        strName += '*';
        strName += top.API.gTFRCustomerName.substr(1, (top.API.gTFRCustomerName.length - 1));

        $('#tranAccountInfo').text(strName);//收款方户名：
        $('#tranMoneyInfo').text(TransferMoney);
        var Poundage;
        var PoundageFee = top.API.Dat.GetDataSync("POUNDAGE", "STRING")[0];
        if (PoundageFee.length > 2) {
            Poundage = PoundageFee.substr(0, (PoundageFee.length - 2));
            Poundage += ".";
            Poundage += PoundageFee.substr((PoundageFee.length - 2), 2);
        } else if (PoundageFee.length == 2) {
            Poundage = "0." + PoundageFee;
        } else if (PoundageFee.length == 1) {
            Poundage = "0.0" + PoundageFee;
        }

        top.API.TransferPoundage = PoundageFee;
        $('#tranFeeInfo').text(Poundage);
    }
	
	function setJnlInfo(info){
		var arrInfo = new Array(info);
		top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, arrInfo);
		top.API.Jnl.PrintSync("Content");
	}

    function setInfoForJnl() {
        top.API.Dat.SetDataSync('DEALTYPE', 'STRING', [Dealtype]);//交易类型
        top.API.Dat.SetDataSync('TREANSMETHOD', 'STRING', [transferWay]);
        // top.API.Dat.SetDataSync('TFRBANK','STRING',[PayeeBank]);//收款行
        top.API.Dat.SetDataSync('TFRCARDNO', 'STRING', [PayeeAccount]);//收款人账号
        top.API.Dat.SetDataSync('TFRCUSTNAME', 'STRING', [PayeeName]); //收款人姓名
        // top.API.Dat.SetDataSync('REMITTANCE','STRING',[capitalMoney]);//汇款金额大写
        var tempMoney = TransferMoney + '00';
        top.API.Dat.SetDataSync('TRANSAMOUNT', 'STRING', [tempMoney]);//汇款金额
        top.API.Dat.SetDataSync("TRANSACTIONRESULT", "STRING", ["TRANFAIL"]);
    }

    //@User ocde scope start

    function ButtonDisable() {
        // document.getElementById('Exit').disabled = true;
        document.getElementById('Back').disabled = true;
        document.getElementById('OK').disabled = true;
        document.getElementById('PageRoot').disabled = true;
    }

    function ButtonEnable() {
        // document.getElementById('Exit').disabled = false;
        document.getElementById('Back').disabled = false;
        document.getElementById('OK').disabled = false;
        document.getElementById('PageRoot').disabled = false;
    }

    document.getElementById('Back').onclick = function () {
        ButtonDisable();
        return CallResponse('Back');
    }
    document.getElementById('PageRoot').onclick = function () {
        ButtonDisable();
        return CallResponse('BackHomepage');
    }

    // document.getElementById('Exit').onclick = function () {
    //     ButtonDisable();
    //     top.ErrorInfo = top.API.PromptList.No2;
    //     return CallResponse('Exit');
    // }

    document.getElementById('OK').onclick = function () {
        ButtonDisable();
        // top.API.gTransactiontype = 'TRANSFERACTS'; // 转账汇款
        // 转账汇款报文暂时无法解析，先使用NOCARDDEP报文
        top.API.gTransactiontype = "TFR";
        top.API.Dat.SetDataSync("TRANSFERTIMES", "STRING", [top.API.TRANSFERTIMES]); // 设置第一次转账标识 1第一次 2第二次
        top.API.Dat.SetDataSync("TFRCARDNO", "STRING", [top.API.PayeeAccount]); // 设置转入卡卡号
        top.API.Dat.SetDataSync("INCUSTOMERNAME", "STRING", [PayeeName]); // 设置转入户名

        if (top.API.Dat.GetDataSync("MONEYLIMIT", "STRING") == 0) {
            // 大额，需联网核查
            // return CallResponse('MaxMoneyFlag');
            StratTcpDataSend();
            // return CallResponse('MinMoneyFlag');
        } else {
            // return CallResponse('MinMoneyFlag');
            StratTcpDataSend();
        }
    };
    function StratTcpDataSend() {
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
		setJnlInfo("交易名称：转账");
        switch (tmpCheck) {
            case '00':
                top.API.Dat.SetDataSync("TRANSACTIONRESULT", "STRING", ["交易成功"]);
                if (arrTransType == "TFR") {
                    //GetBalanceInfo();

                    if (top.API.gTranType == 'largeTran') {
                        //打印回执单
                        top.API.displayMessage("11111111111111111111111");
                        printReceipt();
                    } else {
                        return CallResponse("TransferComplete_OK");
                    }
                }
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
		setJnlInfo("返回码：" + tmpCheck);
    }

    function printReceipt() {
		

        var content = "";
        var tempStr = top.API.Dat.GetDataSync("SYSREFNUM","STRING")[0];
        tempStr = tempStr.substr(tempStr.length-8,8);
        content += "P1=" + 179970113+tempStr;//交易流水号
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
        content += ",P20=" + "大额转账";//业务类型
        content += ",P21=" + top.API.gCardno;//交易卡号
        content += ",P22=" + "转入卡号";//
        content += ",P23=" + top.API.PayeeAccount;//转入卡号
        content += ",P24=" + "转入";//
        content += ",P25=" + top.API.TransferMoney + ".00";//交易金额
        content += ",P26=" +   top.API.gIdStarttime;//开始日期
        content += ",P27=" + top.API.gIdCardpic;//身份证头像
        content += ",P28=" + top.API.Dat.GetBaseDir() + top.API.gFaceCheckPic;//人脸识别
        content += ",P29=" + top.API.Dat.GetBaseDir() + top.API.gCheckIdCardpic;//联网核查
        content += ",P30=" + top.API.gIdFrontImage;//身份证前
        content += ",P31=" + top.API.gIdBackImage;//身份证后

        top.API.Jst.WriteReceiptFile(top.API.Dat.GetBaseDir() + "/DATA/ReceiptData/"+tempStr+".html", content);

        top.API.Spt.RawData(top.API.Dat.GetBaseDir() + "/DATA/ReceiptData/"+tempStr+".html", -1);
        return CallResponse("TransferComplete_OK");
        //语音
        //App.Timer.ClearIntervalTime();
        //Files.showNetworkMsg("正在打印回单，请稍后！");
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


    function onRawDataComplete() {
        top.API.displayMessage("onRawDataComplete is done");
       // return CallResponse("TransferComplete_OK");
    }

    function onRawDataFailed() {
        top.API.displayMessage("onRawDataFailed is done");
        //Files.ErrorMsg("打印回单失败！");
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
        top.API.Pin.addEvent('DeviceError ', onDeviceError);

        top.API.Spt.addEvent('RawDataComplete ', onRawDataComplete);
        top.API.Spt.addEvent('RawDataFailed ', onRawDataFailed);

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
        top.API.Pin.removeEvent('DeviceError ', onDeviceError);

        top.API.Spt.removeEvent('RawDataComplete ', onRawDataComplete);
        top.API.Spt.removeEvent('RawDataFailed ', onRawDataFailed);

    }

    //Countdown function
    function TimeoutCallBack() {
        top.ErrorInfo = top.API.PromptList.No3;
        return CallResponse('TimeOut');
    }

    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
        App.Timer.ClearTime();
    }
})();
