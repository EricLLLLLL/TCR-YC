/*@create by:  tsxiong
 *@time: 2016年03月20日
 */
;(function () {
    var strShowData = "员工号: 1234500001";
    var CurSelctRadioId = "TypeNo1";
    var bIdentify = false;
    var AuthorType = "1";
    var CurFingerData = new Array();
    var Files = new dynamicLoadFiles();
    var authTranType = "";
    var nIndex = 0;
    var nIndexMax = 0;
    var tellersInfo = "";
    var AdminSignNum = "";
    var CallResponse = App.Cntl.ProcessOnce(function (Response) {
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        ButtonDisable();
        EventLogin();
        //@initialize scope start

        if (top.API.Fpi.StDetailedDeviceStatus() != "ONLINE"){
            Files.ErrorMsg("指纹仪故障，请联系管理员!");
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
        }
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        $("#Select").hide();
        $("#Accredit").hide();
        ShowInfo();
        ButtonEnable();
        App.Plugin.Voices.play("voi_13");

    }();//Page Entry

    //@User ocde scope start
    function ButtonDisable() {
        document.getElementById('Exit').disabled = true;
        document.getElementById('Accredit').disabled = true;
        document.getElementById('PageRoot').disabled = true;
        //document.getElementById('ReAuthor').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Exit').disabled = false;
        document.getElementById('Accredit').disabled = false;
        document.getElementById('PageRoot').disabled = false;
        //document.getElementById('ReAuthor').disabled = false;
    }


    function ShowInfo() {
        // var strName = '*';
        // strName += top.API.gCustomerName.substr(1, (top.API.gCustomerName.length - 1));
        // document.getElementById('authName').innerHTML = strName;
        //todo 显示用户的信息
        $("#authName").text(top.API.gIdName);
        $("#authIDType").text("身份证");
        $("#authIDNumber").text(top.API.gIdNumber);
        if(top.API.gTranType== "largeTran"||top.API.gTranType== "largeRemit"){
            $("#authAccount").text(top.API.gTFRCustomerName);
            $("#authNumber").text(top.API.PayeeAccount);
        }else{
            $("#authAccount").text(top.API.gCustomerName);
            $("#authNumber").text(top.API.gCardno);
        }
        switch (top.API.gTranType) {
            case  'largeDep':
                authTranType = "大额存款";
                break;
            case  'largeCwd':
                authTranType = "大额取款";
                break;
            case  'largeTran':
                authTranType = "大额转账";
                break;
            case  'largeRemit':
                authTranType = "大额现金汇款";
                break;
            default :
                authTranType = "交易不明";
                break;
        }
        $("#authTranType").text(authTranType);
        $("#authResult").text("客户身份证号码与姓名一致，且有客户照片");
        $("#customerPhotoLocal").attr("src", top.API.gIdCardpic + "?r=" + Math.random());
        $("#customerPhotoInternet").attr("src", top.API.Dat.GetBaseDir() + top.API.gCheckIdCardpic + "?r=" + Math.random());
        $("#customerPhotoMiddle").attr("src", top.API.Dat.GetBaseDir() + top.API.gFaceCheckPic + "?r=" + Math.random());
        $("#customerIDcardPhotoFront").attr("src", top.API.gIdFrontImage + "?r=" + Math.random());
        $("#customerIDcardPhotoReverse").attr("src", top.API.gIdBackImage + "?r=" + Math.random());
        var nRet1 = top.API.Dat.GetPersistentData("MFPIIDLIST", "STRING");
        AdminSignNum = top.API.Dat.GetPrivateProfileSync("AdminSign", "AdminSignNum", "", top.API.Dat.GetBaseDir() + top.API.gIniFileName);
    }

    document.getElementById('PageRoot').onclick = function () {
        ButtonDisable();
        return CallResponse('BackHomepage');
    };

    document.getElementById('Exit').onclick = function () {
        ButtonDisable();
        if (bIdentify) {
            top.API.Fpi.CancelIdentify();
        }
        top.ErrorInfo = top.API.PromptList.No2;
        //top.API.gOldTellerNo = CurSelctRadioId;
        return CallResponse('Exit');
    };

    document.getElementById('Accredit').onclick = function () {
        top.API.displayMessage("点击授权按钮");
        top.API.Fpi.Identify(-1);
        bIdentify = true;
        $("#Accredit").hide();
        // return CallResponse('OK');
    };

    function onFpiIdentifyComplete(data) {
        top.API.displayMessage("onFpiIdentifyComplete is done");
        // var checkText = $("#WorkersSelect").find("option:selected").val();
        // top.API.Fpi.DataMatch(-1, checkText);
  Files.showNetworkMsg("正在授权，请稍后...");
        top.API.displayMessage("top.API.gFaceCheckOK:"+top.API.gFaceCheckOK);
        if (top.API.gFaceCheckOK) {
            top.API.gEmpno = AdminSignNum.trim();
            top.API.Fpi.DataMatch(-1, AdminSignNum.trim());
            bIdentify = false;
        } else {
            top.API.displayMessage("tellersInfo[" + nIndex + "] = " + tellersInfo[nIndex]);
            top.API.gEmpno = tellersInfo[nIndex];
            top.API.Fpi.DataMatch(-1, tellersInfo[nIndex]);
        }
    }

    function onFpiTimeout() {
        top.API.displayMessage("onFpiTimeout is done");
        return CallResponse('Exit');
    }

    function onFpiDeviceError() {
        top.API.displayMessage("onFpiDeviceError is done");
        if (!bIdentify) {
            top.API.Fpi.Identify(-1);
            bIdentify = true;
        }
    }

    function onFpiIdentifyFailed() {
        top.API.displayMessage("onFpiIdentifyFailed is done");
        //document.getElementById('ReAuthor').style.display = "block";
        bIdentify = false;
        var tip = "授权失败，请点击“授权”按钮进行重新审核";
        // document.getElementById('err-tip').innerText = tip;
        Files.ErrorMsg(tip);
        $("#Accredit").show();
    }

    function onFpiMatchComplete() {
        top.API.displayMessage("onFpiMatchComplete is done");
        if(top.API.gTranType == 'largeCwd'){
            SetDealData();
        }else{
            return CallResponse('OK');
        }

    }

    function onFpiMatchFailed() {
        top.API.displayMessage("onFpiMatchFailed is done");
        //document.getElementById('ReAuthor').style.display = "block";
        if (top.API.gFaceCheckOK) {
            bIdentify = false;
            var tip = "授权失败，请点击“授权”按钮进行重新审核";
            // document.getElementById('err-tip').innerText = tip;
            Files.ErrorMsg(tip);
            $("#Accredit").show();
        } else {
            if (nIndex < nIndexMax - 1) {
                nIndex++;
                top.API.displayMessage("tellersInfo[" + nIndex + "] = " + tellersInfo[nIndex]);
                top.API.Fpi.DataMatch(-1, tellersInfo[nIndex]);
            } else {
                Files.ErrorMsg("授权失败，请点击“授权”按钮进行重新审核");
                $("#Accredit").show();
                nIndex = 0;
            }
        }
    }

    function SetDealData() {
        top.API.gTransactiontype = "CWD";
        if (top.API.gTranType == 'CWD') {
            TslFunction("SCWD");
            top.API.gTslChooseJnlType = "0108";
            return CallResponse("OK");
            top.API.displayMessage("普通取款手续费试算获取流水号");
            Files.showNetworkMsg("交易处理中,请稍候...");
            top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);

        } else if (top.API.gTranType == 'largeCwd') {
            TslFunction("BCWD");
            top.API.gTslChooseJnlType = "0108";
            return CallResponse("OK");
            var nFee = top.API.Dat.GetPrivateProfileSync("TransactionConfig", "CWDFEESupport", "0", top.API.Dat.GetBaseDir() + top.API.gIniFileName);
            if (nFee == "1") {
                top.API.displayMessage("大额取款手续费试算获取流水号");
                Files.showNetworkMsg("交易处理中,请稍候...");
                top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);
            } else {
                return CallResponse("OK");
            }
        }
    }
    function TslFunction(type) {
        var myData = top.GetDate12byte();
        top.API.gTslDate = myData.substr(0, 8);
        top.API.gTslTime = myData.substr(8, 6);
        top.API.gTslChooseType = type;
    }

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
        if ("MFPIIDLIST" == DataName) {
            var arrFpiValue = DataValue + "";
            top.API.displayMessage("柜员号指纹列表=" + arrDataValue.length);
            var x;
            for (x in arrDataValue) {
                if (arrDataValue[x].trim() == AdminSignNum.trim()) {
                    arrDataValue.splice(x, 1);
                }
            }
            nIndexMax = arrDataValue.length;
            top.API.displayMessage("未签到柜员个数为：" + nIndexMax + 1);
            if (nIndexMax < 1) {
                Files.ErrorMsg("还未录入管机员指纹，请录入指纹");
                setTimeout(function () {
                    return CallResponse("Exit");
                }, 4000);
            } else {
                tellersInfo = DataValue;
                nIndex = 0;
            }
            $("#Accredit").show();
        }
    }

    function onDatGetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatGetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        if ('MFPIIDLIST' == DataName) {//mod by hj
            Files.ErrorMsg("获取柜员信息失败！");
            setTimeout(function () {
                return CallResponse("Exit");
            }, 4000);
        }
        if ('JNLNUM' == DataName) {
            Files.ErrorMsg("获取数据失败！");
            setTimeout(function () {
                return CallResponse("Exit");
            }, 4000);
        }
    }

    function onDatSetPersistentDataComplete(DataName) {
        top.API.displayMessage("onDatSetPersistentDataComplete is done,DataName=" + DataName);
        if ('JNLNUM' == DataName) {
            //待修正 添加流水
            var arrTransType = new Array("CWDFEETRY");
            top.API.displayMessage("开始组取款手续费试算报文");
            top.API.Tcp.CompositionData(arrTransType); //进行处理工作参数报文
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
        if (Check == "00") {
            return CallResponse("OK");
        } else {
            // 获取错误待显示提示信息
            var sTranCode = top.API.Dat.GetPrivateProfileSync("TranCode", tmpCheck, "交易失败", top.API.Dat.GetBaseDir() + top.API.gIniTranCode);
            Files.ErrorMsg(sTranCode);
            setTimeout(function () {
                return CallResponse("Exit");
            }, 4000);
        }
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
        top.API.Fpi.addEvent('IdentifyComplete', onFpiIdentifyComplete);
        top.API.Fpi.addEvent('Timeout', onFpiTimeout);
        top.API.Fpi.addEvent('DeviceError', onFpiDeviceError);
        top.API.Fpi.addEvent('IdentifyFailed', onFpiIdentifyFailed);
        top.API.Fpi.addEvent('MatchComplete', onFpiMatchComplete);
        top.API.Fpi.addEvent('MatchFailed', onFpiMatchFailed);

        // top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete); //add by art
        // top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);  //add by art


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

        top.API.Pin.addEvent("MACGenerated", onMACGenerated);
        top.API.Pin.addEvent("CryptFailed", onCryptFailed);

    }

    function EventLogout() {
        top.API.Fpi.removeEvent('IdentifyComplete', onFpiIdentifyComplete);
        top.API.Fpi.removeEvent('Timeout', onFpiTimeout);
        top.API.Fpi.removeEvent('DeviceError', onFpiDeviceError);
        top.API.Fpi.removeEvent('IdentifyFailed', onFpiIdentifyFailed);
        top.API.Fpi.removeEvent('MatchComplete', onFpiMatchComplete);
        top.API.Fpi.removeEvent('MatchFailed', onFpiMatchFailed);

        // top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete); //add by art
        // top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError); //add by art

        top.API.Tcp.removeEvent("SendFailed", onTcpSendFailed);
        top.API.Tcp.removeEvent("OnRecved", onTcpOnRecved);
        top.API.Tcp.removeEvent("CompositionDataCompleted", onCompositionDataCompleted);
        top.API.Tcp.removeEvent("CompositionDataFail", onCompositionDataFail);
        top.API.Tcp.removeEvent("Timeout", onTcpTimeout);
        top.API.Tcp.removeEvent("AnalysisFailed", onAnalysisFailed);

        top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.removeEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.removeEvent("SetPersistentDataError", onDatSetPersistentDataError);

        top.API.Pin.removeEvent("MACGenerated", onMACGenerated);
        top.API.Pin.removeEvent("CryptFailed", onCryptFailed);


    }

    //Countdown function
    function TimeoutCallBack() {
        if (bIdentify) {
            top.API.Fpi.CancelIdentify();
        }
        top.ErrorInfo = top.API.PromptList.No3;
        return CallResponse('TimeOut');
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
