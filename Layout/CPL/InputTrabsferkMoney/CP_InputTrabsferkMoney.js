;
(function () {
    var Inputdata = '',
        InputID = document.getElementById("tranMoneyValue"),
        TransferType = top.API.CashInfo.Dealtype, // 行内转账 InLineFlag，行外转账 OutLineFlag
        bFirstKey = true,
        Files = new dynamicLoadFiles(),
        CallResponse = App.Cntl.ProcessOnce(function (Response) {
            //TO DO:
            top.API.Siu.SetPinPadLight('OFF');
            Clearup();
            //Entry the flows control process.
            App.Cntl.ProcessDriven(Response);
        }),
        Initialize = function () {
            EventLogin();
            //@initialize scope start
            App.Timer.TimeoutDisposal(TimeoutCallBack);
            //showInfo();
            top.API.Pin.GetData(0, false, "0,1,2,3,4,5,6,7,8,9,ENTER,CLEAR,CANCEL", "CANCEL", -1);
            top.API.Siu.SetPinPadLight('CONTINUOUS');
            if (TransferType == "InLineFlag") {
                App.Plugin.Voices.play("voi_51");
            } else {
                App.Plugin.Voices.play("voi_52");
            }
            var strName = '';
            strName += '*';
            strName += top.API.gTFRCustomerName.substr(1, (top.API.gTFRCustomerName.length - 1));
            $("#transferAccount").text(strName);
            InputID.focus();
            ButtonEnable();
        }(); //Page Entry

    function ButtonDisable() {
        // document.getElementById('Exit').disabled = true;
        document.getElementById('Back').disabled = true;
        document.getElementById('OK').disabled = true;
        document.getElementById('Alter').disabled = true;
        document.getElementById('PageRoot').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Back').disabled = false;
        // document.getElementById('Exit').disabled = false;
        document.getElementById('OK').disabled = false;
        document.getElementById('Alter').disabled = false;
        document.getElementById('PageRoot').disabled = false;
    }

    //@User ocde scope start

    document.getElementById('Alter').onclick = function () {
        top.API.displayMessage("Alter");
        ButtonEnable();
        bFirstKey = true;
        Inputdata = "";
        $('#tranMoneyValue').val(Inputdata);
    };
    document.getElementById('Back').onclick = function () {
        top.API.displayMessage("点击Back");
        //top.API.Pin.CancelGetData();
        ButtonDisable();
        return CallResponse('Back');
    };
    document.getElementById('PageRoot').onclick = function () {
        ButtonDisable();
        //top.API.Pin.CancelGetData();
        return CallResponse('BackHomepage');
    };


    document.getElementById('OK').onclick = function () {
        top.API.displayMessage("点击OK");
        if (Inputdata == '' || Inputdata == "0") {
            Files.ErrorMsg("转账金额不能为空或为0！");
		ReInput();
        } else {
            top.API.TransferMoney = Inputdata;
            if (top.API.TransferMoney > 1000000) {
                Files.ErrorMsg("转账不能大于100万元，请重新输入");
                ReInput();
                return;
            }
            top.API.displayMessage("TransferMoney:" + Inputdata);
            if (top.API.gTranType == 'Transfer') {
                if (top.API.TransferMoney > 20000) {
                    Files.ErrorMsg("小额转账不能大于2万元，请重新输入");
                    ReInput();
                    return;
                }
            } else if (top.API.gTranType == 'largeCwd') {
                if (top.API.TransferMoney > 100000) {
                    Files.ErrorMsg("大额转账不能大于10万元，请重新输入");
                    ReInput();
                    return;
                }
            }
            // top.API.Dat.SetDataSync("TRANSFERWAY", "STRING", [top.API.transferWay]); // 设置转账方式标识 0实时 1普通 2次日

            ButtonDisable();
            // top.API.gTransactiontype = 'Transfer';
            top.API.Pin.CancelGetData();
            // 转账手续费试算流程开始
		var tmp = top.API.TransferMoney + "00";
                        var arrINPUTMONEY = new Array(tmp);
                        top.API.Dat.SetDataSync(top.API.transamountTag, top.API.transamountType, arrINPUTMONEY);
			
			var arrInfo = new Array("转入金额: " + top.API.TransferMoney);
			top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, arrInfo);
			top.API.Jnl.PrintSync("Content");

            // 判断是否配置了流程
            var nFee = top.API.Dat.GetPrivateProfileSync("TransactionConfig", "TFRFEESupport", "0", top.API.Dat.GetBaseDir() + top.API.gIniFileName);
	var nOutFee = top.API.Dat.GetPrivateProfileSync("TransactionConfig", "OUTTFRFEESupport", "0", top.API.Dat.GetBaseDir() + top.API.gIniFileName);
	var objCardType = top.API.Dat.GetDataSync("CARDBANKTYPE", "STRING");
            if (nFee == "1") {
                top.API.displayMessage("卡卡转账手续费试算获取流水号");
                Files.showNetworkMsg("交易处理中,请稍候...");
                top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);
            } else if(nOutFee == "1" && objCardType[0] != "3"){
			top.API.displayMessage("卡卡转账手续费试算获取流水号");
                Files.showNetworkMsg("交易处理中,请稍候...");
                top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);
		}
		else {

                if (TransferType == "InLineFlag") {
                    return CallResponse('InLineFlag');
                } else {
                   // top.API.gTransactiontype = 'QRYFEE'; // 行外转账查手续费
                    return CallResponse('OutLineFlag');
                }
            }
        }
    };

    //@User code scope end

    function onKeyPressed(key, keyCode) {
        var tmpInputdata = "";
        // $('#TransferTip').text('');
        if (((0 == key || 00 == key) && bFirstKey == true) && Inputdata.length < 9) {
            top.API.displayMessage("第一个数字不能为0");
if(Inputdata.length == 0&&0 == key){
  tmpInputdata = Inputdata;
            tmpInputdata += key;
Inputdata = tmpInputdata;
 $('#tranMoneyValue').val(top.InsertChar(Inputdata, 3, ','));
}else{
return;
}
        } else if (0 <= key || key <= 9 || 00 == key) {
            if (Inputdata.length >= 7) {
                return;  // 不响应
            }
            tmpInputdata = Inputdata;
            tmpInputdata += key;
            // if (parseInt(tmpInputdata) > 1000000) {
            //     // $('#TransferTip').text('输入的金额不能大于100万！');
            //     Files.ErrorMsg("输入的金额不能大于100万");
            //     //WriteAcctFileAfterTCP("AT", ""); //add by art for 写交易记录文件
            //     //bNextPageFlag = false;
            //     // setTimeout(function () {
            //     //     return CallResponse("Exit");
            //     // }, 4000);
            //     ReInput();
            // } else {
            // if (Inputdata.length >= 19) {
            //     return;  // 不响应
            // }
            Inputdata = tmpInputdata;
            bFirstKey = false;
            // }
            top.API.displayMessage("onKeyPressed-----" + tmpInputdata);
            $('#tranMoneyValue').val(top.InsertChar(Inputdata, 3, ','));
            //document.getElementById("tranMoneyValue").innerText = top.InsertChar(Inputdata, 3, ',');
        } else if (key == "CLEAR") {
            top.API.displayMessage("onKeyPressed-----CLEAR");
            ReInput();
        } else if (key == "CANCEL") {
            top.API.displayMessage("onKeyPressed-----CANCEL");
            return CallResponse("Exit");
        } else if (key == "ENTER") {
            top.API.displayMessage("onKeyPressed-----ENTER");
            document.getElementById('OK').onclick();
        }
    }

    function ReInput() {
        ButtonEnable();
        bFirstKey = true;
        Inputdata = "";
        $('#tranMoneyValue').val(Inputdata);
    }

    function onDeviceError() {
        top.API.displayMessage("onDeviceError触发");
        top.ErrorInfo = top.API.PromptList.No4;
        return CallResponse("Exit");
    }


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
        return CallResponse("Exit");
    }

    function onDatSetPersistentDataComplete(DataName) {
        top.API.displayMessage("onDatSetPersistentDataComplete is done,DataName=" + DataName);
        if ('JNLNUM' == DataName) {
            //待修正 添加流水
            if (TransferType == "InLineFlag") {
                var arrTransType = new Array("TFRFEETRY");
                top.API.displayMessage("开始组取款手续费试算报文");
                top.API.Tcp.CompositionData(arrTransType); //进行处理工作参数报文
            } else {
                var arrTransType = new Array("INTERBANKTFRFEETRY");
                top.API.displayMessage("开始组取款手续费试算报文");
                top.API.Tcp.CompositionData(arrTransType); //进行处理工作参数报文
            }
        }
    }

    function onDatSetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatSetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        return CallResponse("Exit");
    }

    /********************************************************************************************************/
    //TCP模块
    function onCompositionDataCompleted(arrData) {
        top.API.displayMessage("onCompositionDataCompleted is done");
        var objArrData = arrData;
        var HexWorkKey = top.stringToHex(objArrData);
        top.API.Pin.GenerateMAC(HexWorkKey, "MACKEY", '', 0, 0);
    }

    function onCompositionDataFail() {
        Files.ErrorMsg("组包失败，交易结束");
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }

    function onAnalysisFailed() {
        Files.ErrorMsg("解包失败，交易结束");
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }

    function onTcpOnRecved(tmpCheck) {
        Check = tmpCheck;
        top.API.displayMessage("onTcpOnRecved is done,Check:" + Check);
		var arrInfo = new Array("交易名称: 手续费试算");
		top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, arrInfo);
		top.API.Jnl.PrintSync("Content");
        if (Check == "00") {
            if (TransferType == "InLineFlag") {
                return CallResponse('InLineFlag');
            } else {
                top.API.gTransactiontype = 'QRYFEE'; // 行外转账查手续费
                return CallResponse('OutLineFlag');
            }
        } else {
            // 获取错误待显示提示信息
            var sTranCode = top.API.Dat.GetPrivateProfileSync("TranCode", tmpCheck, "交易失败", top.API.Dat.GetBaseDir() + top.API.gIniTranCode);
            Files.ErrorMsg(sTranCode);
            setTimeout(function () {
                return CallResponse("Exit");
            }, 4000);
        }
		var arrInfo = new Array("响应码: " + tmpCheck);
		top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, arrInfo);
		top.API.Jnl.PrintSync("Content");
    }

    function onTcpSendFailed() {
        top.API.displayMessage("onTcpSendFailed is done");
        Files.ErrorMsg("报文发送失败");
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }

    function onTcpTimeout() {
        top.API.displayMessage("onTcpTimeout is done");
        Files.ErrorMsg("通讯故障");
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }

    /********************************************************************************************************/
    //PIN模块
    function onMACGenerated(MacData) {
        top.API.displayMessage("onMACGenerated is done, MacData =" + MacData);
        var HexMasterKey = top.stringToHex(MacData);
        top.API.Tcp.SendToHost(HexMasterKey, 60000);
    }

    function onCryptFailed() {
        top.API.displayMessage('键盘加解密失败：onCryptFailed');
        Files.ErrorMsg("键盘加解密失败，交易结束");
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
        top.API.Tcp.addEvent("Timeout", onTcpTimeout);
        top.API.Tcp.addEvent("AnalysisFailed", onAnalysisFailed);

        top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.addEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.addEvent("SetPersistentDataError", onDatSetPersistentDataError);

        //键盘事件
        top.API.Pin.addEvent("MACGenerated", onMACGenerated);
        top.API.Pin.addEvent("CryptFailed", onCryptFailed);
        top.API.Pin.addEvent("KeyPressed", onKeyPressed);
        top.API.Pin.addEvent("DeviceError", onDeviceError);

    }

    function EventLogout() {
        top.API.Tcp.removeEvent("SendFailed", onTcpSendFailed);
        top.API.Tcp.removeEvent("OnRecved", onTcpOnRecved);
        top.API.Tcp.removeEvent("CompositionDataCompleted", onCompositionDataCompleted);
        top.API.Tcp.removeEvent("CompositionDataFail", onCompositionDataFail);
        top.API.Tcp.removeEvent("Timeout", onTcpTimeout);
        top.API.Tcp.removeEvent("AnalysisFailed", onAnalysisFailed);

        top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.removeEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.removeEvent("SetPersistentDataError", onDatSetPersistentDataError)

        top.API.Pin.removeEvent("MACGenerated", onMACGenerated);
        top.API.Pin.removeEvent("CryptFailed", onCryptFailed);
        top.API.Pin.removeEvent("KeyPressed", onKeyPressed);
        top.API.Pin.removeEvent("DeviceError", onDeviceError);
    }

    //Countdown function
    function TimeoutCallBack() {
        top.ErrorInfo = top.API.PromptList.No3;
        //$("#MAIN", parent.document).height(768).removeClass("main-sroll");
        //top.API.Ime.HideIME('');
        return CallResponse('TimeOut');
    }

    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
        top.API.Pin.CancelGetData();
        App.Plugin.Voices.del();
        App.Timer.ClearTime();
    }
})();
