/*@create by:  tsxiong
 *@time: 2016年03月20日
 */
;(function () {
    var bHaveCard = true;
    var warnTimer = 0;
    var soundObj;
    var nCwcTimes = 0;
    var nCwcMaxTimes = 0;
    var bEjectCardCwc = true;
    var arrTransType = "";
    var timeID;
    var Files = new dynamicLoadFiles();
    var CallResponse = App.Cntl.ProcessOnce(function (Response) {
        //TO DO:
        ClearWarning();
        top.API.Siu.SetCardReaderLight('OFF');
        Clearup();
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        EventLogin();
        //写入TslLog
        top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["<== 退卡"]);
        top.API.Jnl.PrintSync("Content");
        top.API.displayMessage("cccccccccccccccccccccccccccccccc");
        if ("PRESENT" == top.API.Crd.StMediaStatus()) {
            PlayVoice(bHaveCard);
            top.API.gHaveTakeCard = false;
            App.Timer.SetPageTimeout(60);
            App.Timer.TimeoutDisposal(TimeoutCallBack);
            top.API.Crd.Eject(top.API.gEjectCardTimeOut);
            timeID = window.setInterval(GetCardState, 5000);
            //document.getElementById("tip_label2").style.display = "block";
        } else {
            top.API.displayMessage("dddddddddddddddddd");
            bHaveCard = false;
            PlayVoice(bHaveCard);
		    top.API.displayMessage("xxxxxxxxxxxxxxxx");
		    top.API.displayMessage("Dealtype = " +  top.API.CashInfo.Dealtype);	
		    App.Timer.SetPageTimeout(5);
		    top.API.displayMessage("hhhhhhhhhhhhhhhhh");
		    App.Timer.TimeoutDisposal(TimeoutCallBack);
        }
        //获取交易结果

    }();//Page Entry
    //持续播放
    function playWarning() {
        top.API.displayMessage("15秒后未取卡报警音提示");
        var obj = document.createElement("bgsound");
        obj.id = "ModuleSound";
        obj.src = "Framework/Plugin/Voice/Sound/Forget_Beep_New.wav";
        obj.autoplay = true;
        obj.loop = "-1";
        soundObj = obj;
        document.body.appendChild(soundObj);
    }

    function GetCardState() {
        if ("PRESENT" != top.API.Crd.StMediaStatus()) {
            top.API.gHaveTakeCard = true;
            return CallResponse("Exit");
        }
    }

    function ClearWarning() {
        if (warnTimer != 0) {
            window.clearTimeout(warnTimer);
            if (soundObj != null) {
                document.body.removeChild(soundObj);
            }
            warnTimer = 0;
        }
    }

    // 转账交易失败公用凭条
    function setPrintForm(){
        top.API.Dat.SetDataSync("POUNDAGE", "STRING", ["0.00"]);
        if (top.API.gTakeCardAndPrint == true) {
            if (top.API.Ptr.bDeviceStatus && top.API.gNoPtrSerFlag == false) {
                top.API.Ptr.Print("ReceiptCash_Print_szABC", "", top.API.gPrintTimeOut);// 打印凭条
            }
        }
    }

    function PlayVoice(bCard) {
		top.API.displayMessage(top.ErrorInfo);
        switch (top.ErrorInfo) {
            case top.API.PromptList.No1:
                if (bCard) {
                    App.Plugin.Voices.play("voi_29");
                } else {
                    App.Plugin.Voices.play("voi_33");
                }
                break;
            case top.API.PromptList.No2:
                if (bCard) {
                    App.Plugin.Voices.play("voi_19");
                } else {
                    App.Plugin.Voices.play("voi_30");
                }
                break;
            case top.API.PromptList.No3:
                if (bCard) {
                    App.Plugin.Voices.play("voi_17");
                } else {
                    App.Plugin.Voices.play("voi_18");
                }
                break;
            case top.API.PromptList.No4:
                if (bCard) {
                    App.Plugin.Voices.play("voi_23");
                } else {
                    App.Plugin.Voices.play("voi_23");
                }
                break;
            case top.API.PromptList.No5:
                if (bCard) {
                    App.Plugin.Voices.play("voi_25");
                } else {
                    App.Plugin.Voices.play("voi_24");
                }
                break;
            case top.API.PromptList.No6:
                if (bCard) {
                    App.Plugin.Voices.play("voi_2");
                }
                break;
            case top.API.PromptList.No7:
                if (bCard) {
                    App.Plugin.Voices.play("voi_31");
                }
                break;
            case top.API.PromptList.No8:
                if (bCard) {
                    //App.Plugin.Voices.play("voi_32");
                }
                break;
            default:
                App.Plugin.Voices.play("voi_2");
                break;
        }
    }


    function onCardEjected() {
        top.API.Siu.SetCardReaderLight('SLOW');
    }

    function onCardTaken() {
        top.API.Jnl.PrintSync("TakeCardAction");
        top.API.gHaveTakeCard = true;
        //ClearWarning();
        //判断是否冲正
        return CallResponse("Exit");
    }

    function onDeviceError() {
        top.API.displayMessage("DeviceError");
        return CallResponse("Exit");
    }

    function onCardEjectFailed() {
        top.API.displayMessage("onCardEjectFailed");
        top.ErrorInfo = top.API.PromptList.No4;
        return CallResponse('Exit');
    }

    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        if ('JNLNUM' == DataName) {
            var arrDataValue = DataValue;
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
        return CallResponse("Exit");
    }

    function onDatSetPersistentDataComplete(DataName) {
        if ('JNLNUM' == DataName) {
            top.API.Tcp.CompositionData(arrTransType);
        }
    }

    function onDatSetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("DatSetPersistentDataError");
        return CallResponse("Exit");
    }

    function CWC(){
        arrTransType = "CWC";
        Files.showNetworkMsg("交易处理中,请稍候...");
        top.API.displayMessage("Start 获取流水号" + arrTransType);
        var nRet1 = top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);
    }

    function onCompositionDataCompleted(arrData) {
        top.API.displayMessage("onCompositionDataCompleted is done, arrData =" + arrData);
        var objArrData = arrData;
        var HexMasterKey = top.stringToHex(arrData);
        top.API.Pin.GenerateMAC(HexMasterKey, "MACKEY", '', 0, 0);
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
        nCwcTimes++;
        top.API.Tcp.SendToHost(HexMasterKey, 60000);
    }

    function onTcpOnRecved(tmpCheck) {
        top.API.displayMessage("onTcpOnRecved is done,CheckCode:" + tmpCheck);
        switch (tmpCheck) {
            case '00':
                return CallResponse("Exit");
                break;
            default:
                if (nCwcTimes < nCwcMaxTimes) {
                    top.API.displayMessage("当前冲正次数为" + nCwcTimes);
                    top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);
                } else {
                    return CallResponse("Exit");
                }
                break;
        }
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

    //Register the event
    function EventLogin() {
        top.API.Crd.addEvent("CardEjected", onCardEjected);
        top.API.Crd.addEvent("CardEjectFailed", onCardEjectFailed);
        top.API.Crd.addEvent("CardTaken", onCardTaken);
        top.API.Crd.addEvent("DeviceError", onDeviceError);

        top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.addEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.addEvent("SetPersistentDataError", onDatSetPersistentDataError);

        top.API.Tcp.addEvent("SendFailed", onTcpSendFailed);
        top.API.Tcp.addEvent("OnRecved", onTcpOnRecved);
        top.API.Tcp.addEvent("CompositionDataCompleted", onCompositionDataCompleted);
        top.API.Tcp.addEvent("CompositionDataFail", onCompositionDataFail);

        top.API.Pin.addEvent("MACGenerated", onMACGenerated);
        top.API.Tcp.addEvent("Timeout", onTcpTimeout);
        top.API.Tcp.addEvent("AnalysisFailed", onAnalysisFailed);
        top.API.Pin.addEvent("CryptFailed", onCryptFailed);
    }

    function EventLogout() {
        top.API.Crd.removeEvent("CardEjected", onCardEjected);
        top.API.Crd.removeEvent("CardEjectFailed", onCardEjectFailed);
        top.API.Crd.removeEvent("CardTaken", onCardTaken);
        top.API.Crd.removeEvent("DeviceError", onDeviceError);

        top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.removeEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.removeEvent("SetPersistentDataError", onDatSetPersistentDataError);

        top.API.Tcp.removeEvent("SendFailed", onTcpSendFailed);
        top.API.Tcp.removeEvent("OnRecved", onTcpOnRecved);
        top.API.Tcp.removeEvent("CompositionDataCompleted", onCompositionDataCompleted);
        top.API.Tcp.removeEvent("CompositionDataFail", onCompositionDataFail);

        top.API.Pin.removeEvent("MACGenerated", onMACGenerated);
        top.API.Tcp.removeEvent("Timeout", onTcpTimeout);
        top.API.Tcp.removeEvent("AnalysisFailed", onAnalysisFailed);
        top.API.Pin.removeEvent("CryptFailed", onCryptFailed);


    }

    //Countdown function
    function TimeoutCallBack() {
        top.API.displayMessage('TimeoutCallBack：TimeoutCallBack');
        return CallResponse("Exit");
    }

    //Page Return

    //remove all event handler
    function Clearup() {
        EventLogout();
        if (timeID > 0) {
            window.clearInterval(timeID);
        }
        App.Plugin.Voices.del();
        App.Timer.ClearTime();
        top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["*** 客户取卡"]);
        top.API.Jnl.PrintSync("Content");
        top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["************************************"]);
        top.API.Jnl.PrintSync("Content");
    }

    //@User ocde scope start

})();
