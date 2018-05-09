/*@create by:  tsxiong
 *@time: 2016年03月20日
 */
;(function () {
    var bSPL1 = false;
    var strCardNo = "";
    //var timeoutID;
    var Files = new dynamicLoadFiles(),
        isReadCard = false,
        CallResponse = App.Cntl.ProcessOnce(function (Response) {
            top.API.Crd.CancelAccept();
            top.API.Scr.CancelAccept();
            top.API.Siu.SetCardReaderLight('OFF');
            Clearup();
            App.Cntl.ProcessDriven(Response);
        });

    var Initialize = function () {
        ButtonDisable();
        App.Timer.TimeoutDisposal(TimeoutCallBack);
if (top.API.Crd.StDetailedDeviceStatus() != "ONLINE"||top.API.Scr.StDetailedDeviceStatus() != "ONLINE"){
            Files.ErrorMsg("读卡器模块故障，请联系管理员!");
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
        }
        top.API.Sys.ItemClearSync(top.API.MTRN_TRANSACTIONDIFFER);
        EventLogin();
        top.API.CashInfo.InitData();
        var arrCwdDealtypeType = new Array("CARD"); //新增数据库初始值
        top.API.Dat.SetDataSync(top.API.CWDDealTypeTag, top.API.CWDDealTypeType, arrCwdDealtypeType);
        top.API.Crd.AcceptAndChipInitialise('AcceptAndChipInitialise', -1);
        top.API.Siu.SetCardReaderLight('SLOW');
        if (top.API.gbPBDEP_DEAL || top.API.gbPBCWD_DEAL) {
            top.API.Scr.AcceptAndReadAvailableTracks('1,2,3', -1);
        }
        ButtonEnable();
    }(); //Page Entry
    //存折事件开始

    function ButtonDisable() {
        top.API.displayMessage("ButtonDisable");
        document.getElementById('PageRoot').disabled = true;
    }

    function ButtonEnable() {
        top.API.displayMessage("ButtonEnable");
        document.getElementById('PageRoot').disabled = false;
    }

    document.getElementById('PageRoot').onclick = function () {
        ButtonDisable();
        return CallResponse('BackHomepage');
    };
    function onScrDeviceError() {
        top.API.displayMessage("onScrDeviceError");
        Files.ErrorMsg("刷卡器故障，交易结束");
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }

    function onCardTaken() {
        top.API.displayMessage("onCardTaken触发");
    }

    function onScrCardAcceptFailed() {
        top.API.displayMessage("onScrCardAcceptFailed");
        Files.ErrorMsg("读卡失败，交易结束");
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }

    function onScrCardAccepted() {
        top.API.Crd.CancelAccept();
        // var strTrack2 = top.API.Scr.Track2();
        // var strTrack3 = top.API.Scr.Track3();
        var strTrack2 = top.API.Dat.GetDataSync("TRACK2DATA", "STRING")[0];
        var strTrack3 = top.API.Dat.GetDataSync("TRACK3DATA", "STRING")[0];
        //  if (strTrack2 == "" || strTrack3 == "") {
        top.API.displayMessage("strTrack2+" + strTrack2);
        top.API.displayMessage("strTrack3+" + strTrack3);
        if (strTrack2 == "") {
            App.Plugin.Wait.showNoBankCard();
            setTimeout(function () {
                App.Plugin.Wait.disappear();
            }, 3000);
        } else {
            if (strTrack2.indexOf("=") != -1) {
                strCardNo = strTrack2.split("=");
            } else if (strTrack2.indexOf("D") != -1) {
                strCardNo = strTrack2.split("D");
            } else if (strTrack2.indexOf(">") != -1) {
                strCardNo = strTrack2.split(">");
            }
            strCardNo = strCardNo[0];
            top.API.displayMessage("strCardNo+" + strCardNo);
            top.API.gCardno = strCardNo;
            top.API.gLastCardNum = strCardNo;
            top.API.gBrashCardType = 2;
            SetCardNo2();
        }
    }

    function SetCardNo2() {
        if (strCardNo.toString().length == 0) {
            App.Plugin.Wait.showNoBankCard();
            setTimeout(function () {
                App.Plugin.Wait.disappear();
            }, 3000);
            return;
        } else {
            
            top.API.CashInfo.Dealtype = "刷卡";
            var arrCardNo = new Array(strCardNo);
            var nRet = top.API.Dat.SetDataSync(top.API.cardnoTag, top.API.cardnoType, strCardNo);
            top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["卡号："+arrCardNo]);
            top.API.Jnl.PrintSync("Content");

            var nRet = top.API.Dat.SetDataSync(top.API.cardnoTag, top.API.cardnoType, arrCardNo);
            top.API.Jnl.PrintSync("ReadCardAction");
            // 新增判断大额交易银行卡别的处理
            var strCardBankType = top.API.Crd.GetCardBankType(strCardNo);
            top.API.displayMessage("LargeInsertCard.js GetCardBankType = " + strCardBankType);
            top.API.gSupportTransType = strCardBankType.substr(1, 16);
            var sCardBankType = strCardBankType.substr(0, 1);
            top.API.Dat.SetDataSync("CARDBANKTYPE", "STRING", [sCardBankType]);
            if (sCardBankType == "3") {
                Files.ErrorMsg("大额交易暂不支持跨行交易");
                setTimeout(function () {
                    return CallResponse("Exit");
                }, 4000);
            } else if (sCardBankType == "4") {
                Files.ErrorMsg("大额交易暂不支持信用卡交易");
                setTimeout(function () {
                    return CallResponse("Exit");
                }, 4000);
            } else {
                StartQueryAccount();
                //return CallResponse('OK');
            }
        }
    }

    function onScrCardInvalid() {
        top.API.displayMessage("CardInvalid");
        App.Plugin.Wait.showNoBankCard();
        setTimeout(function () {
            App.Plugin.Wait.disappear();
        }, 3000);
    }

    function onChipDataReceived(Token, Bytes) {
        //top.API.CashInfo.Dealtype = "INQ";
        var arrBalanceInquiryType = new Array("ACCTYPE");
        top.API.Dat.SetDataSync(top.API.BalanceInquiryTag, top.API.BalanceInquiryType, arrBalanceInquiryType);
        //return CallResponse('OK');
        readCard();
    }

    // function onCardTaken() {
    //     top.API.displayMessage("onCardTaken触发");
    //     refreshTitleAdv();
    // }

    function readCard() {
        isReadCard = true;
        App.Timer.ClearTime();
        Files.showNetworkMsg("正在读取卡片信息,请稍候...");
        App.Plugin.Voices.play("voi_15");
        //@initialize scope start
        var strCardType = "MAGCARD";
        var objGet = top.API.Dat.GetDataSync(top.API.cardtypeTag, top.API.cardtypeType);
        if (null == objGet) {
            top.API.displayMessage("GetDataSync CARDTYPE objGet = null");
        }
        else {
            var arrGet = objGet;
            strCardType = arrGet[0];
        }
        if ("CHIPCARD" === strCardType) {
            //document.getElementById('PageTag').innerHTML = '正在读取IC卡，请稍候...';
            top.API.Crd.PBOCGetICInfo(40000);//待修正  超时时间需要考虑页面超时临界值
        } else {
            top.API.Crd.AcceptAndReadAvailableTracks('2,3', 40000);//待修正  超时时间需要考虑页面超时临界值
        }
    }

    function onCardInserted() {
        top.API.displayMessage("CardInserted");
        top.API.Scr.CancelAccept();
    }

    function onCrdDeviceError() {
        top.API.displayMessage("onCrdDeviceError");
        top.API.Siu.SetCardReaderLight('OFF');
    }


    function onCardAccepted() {
        top.API.displayMessage("onCardAccepted触发");
        var strTrack2 = top.API.Crd.Track2();
        var strTrack3 = top.API.Crd.Track3();
        if ("" === strTrack2 && "" === strTrack3) {
            top.API.displayMessage(top.API.PromptList.No10);
            top.ErrorInfo = top.API.PromptList.No10;
            return CallResponse("Exit");
        } else {
            var arrTrack2 = new Array();
            arrTrack2 = strTrack2.split("=");
            strCardNo = arrTrack2[0];
        }
        top.API.gLastCardNum = strCardNo;
        top.API.gBrashCardType = 1;
        SetCardNo();
        StartQueryAccount();
    }

    function onCardInvalid() {
        top.API.displayMessage(top.API.PromptList.No7);
        top.ErrorInfo = top.API.PromptList.No7;
        return CallResponse("Exit");
    }

    function onChipInvalid() {
        top.API.displayMessage(top.API.PromptList.No7);
        top.ErrorInfo = top.API.PromptList.No7;
        return CallResponse("Exit");
    }

    function onCardAcceptFailed() {
        top.API.displayMessage("onCardAcceptFailed");
        top.ErrorInfo = top.API.PromptList.No7;
        return CallResponse('Exit');
    }


    function onChipPowerFailed() {
        top.API.displayMessage("onChipPowerFailed");
        top.ErrorInfo = top.API.PromptList.No7;
        return CallResponse('Exit');
    }


    function onGetICInfoFailed() {
        top.API.displayMessage("onGetICInfoFailed");
        top.ErrorInfo = top.API.PromptList.No7;
        return CallResponse('Exit');
    }

    function onReadIcTLVFailed() {
        top.API.displayMessage("onReadIcTLVFailed");
        top.ErrorInfo = top.API.PromptList.No7;
        return CallResponse('Exit');
    }

    function onDeviceError() {
        top.API.displayMessage("onDeviceError");
        top.ErrorInfo = top.API.PromptList.No4;
        return CallResponse('Exit');
    }


    function onGetICInfoCompleted() {
        top.API.displayMessage("onGetICInfoCompleted");
        strCardNo = top.API.Crd.CardNumber();
        SetCardNo();

        // 新增判断大额交易银行卡别的处理
        var strCardBankType = top.API.Crd.GetCardBankType(strCardNo);
        top.API.displayMessage("LargeInsertCard.js GetCardBankType = " + strCardBankType);
        top.API.gSupportTransType = strCardBankType.substr(1, 16);
        var sCardBankType = strCardBankType.substr(0, 1);
        top.API.Dat.SetDataSync("CARDBANKTYPE", "STRING", [sCardBankType]);
        if (sCardBankType == "3") {
            Files.ErrorMsg("大额交易暂不支持跨行交易");
            setTimeout(function () {
                return CallResponse("Exit");
            }, 4000);
        } else if (sCardBankType == "4") {
            Files.ErrorMsg("大额交易暂不支持信用卡交易");
            setTimeout(function () {
                return CallResponse("Exit");
            }, 4000);
        } else {
            top.API.Crd.PBOCReadIcTLV(50000);//读芯片卡数据（55域）
        }
    }

    //top.API.Crd.PBOCReadIcTLV触发该事件
    function onReadIcTLVCompleted(Info) {
        top.API.displayMessage("ReadIcTLVCompleted");
        var arrICCardData = new Array(Info);
        var nRet = top.API.Dat.SetDataSync(top.API.iccarddataTag, top.API.iccarddataType, arrICCardData);
        StartQueryAccount();
    }

    function ContinueTrans() {
        if (top.API.gbContinueTransFlag === true) {
            //return CallResponse("CHIPCARDcontinue");
      top.API.CashInfo.Dealtype = "INQ";
            top.API.gLargeInsertCard = true;
            return CallResponse("OK");
        } else {
            top.API.CashInfo.Dealtype = "INQ";
            top.API.gLargeInsertCard = true;
            return CallResponse("OK");
        }
    }

    function SetCardNo() {
        top.API.Jnl.PrintSync("ReadCardAction");
        var arrCardNo = new Array(strCardNo);
        var nRet = top.API.Dat.SetDataSync(top.API.cardnoTag, top.API.cardnoType, arrCardNo);
        top.API.gCardno = strCardNo;
        top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["卡号："+strCardNo]);
        top.API.Jnl.PrintSync("Content");
    }

    function StartQueryAccount() {
        top.API.displayMessage("StartQueryAccount GetPersistentData JnlNum");
        top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);
    }

    /********************************************************************************************************/
    //TCP模块
    function onTcpOnRecved(tmpCheck) {
        top.API.displayMessage("onTcpOnRecved is done,CheckCode:" + tmpCheck);
        switch (tmpCheck) {
            case '00':
                var sAccountType = top.API.Dat.GetDataSync("ACCOUNTTYPE", "STRING")[0]; // I 二类卡区别
                if (sAccountType == "0" || sAccountType == "1") {
                    return ContinueTrans();
                } else {
                    Files.ErrorMsg("II类账户暂不支持大额交易");
                    setTimeout(function () {
                        return CallResponse("Exit");
                    }, 4000);
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
    }

    function onCompositionDataCompleted(arrData) {
        var HexWorkKey = top.stringToHex(arrData);
        top.API.Pin.GenerateMAC(HexWorkKey, "MACKEY", '', 0, 0);
    }

    function onCompositionDataFail() {
        top.API.displayMessage("onCompositionDataFail is done");
        Files.ErrorMsg("通讯失败，交易结束");
        //WriteAcctFileAfterTCP("AT", ""); //add by art for 写交易记录文件
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }

    function onTcpSendFailed() {
        top.API.displayMessage("onTcpSendFailed is done");
        //WriteAcctFileAfterTCP("AT", ""); //add by art for 写交易记录文件
        Files.ErrorMsg("通讯失败，交易结束");
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }

    function onTcpTimeout() {
        top.API.displayMessage("onTcpTimeout is done");
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
    //永久数据模块
    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        var arrDataValue = DataValue;
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
        top.API.displayMessage("DatGetPersistentDataError" + DataName + ",ErrorCode=" + ErrorCode);
        Files.ErrorMsg("组包失败，交易结束");
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }

    function onDatSetPersistentDataComplete(DataName) {
        if ('JNLNUM' == DataName.substr(0, 6)) {
            var arrTransType = "QRYACCOUNT";
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

    /********************************************************************************************************/
    //PIN模块
    function onCryptFailed() {
        top.API.displayMessage('键盘加解密失败：onCryptFailed');
        Files.ErrorMsg("键盘加解密失败，交易结束");
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }

    function onMACGenerated(MacData) {
        var HexMasterKey = top.stringToHex(MacData);
        top.API.Tcp.SendToHost(HexMasterKey, 60000);
    }

    //Register the event
    function EventLogin() {
        top.API.Crd.addEvent("ChipDataReceived", onChipDataReceived);
        // top.API.Crd.addEvent("CardTaken", onCardTaken);
        top.API.Crd.addEvent("CardInserted", onCardInserted);
        top.API.Crd.addEvent("DeviceError", onCrdDeviceError);

        top.API.Crd.addEvent("CardAccepted", onCardAccepted);
        top.API.Crd.addEvent("CardInvalid", onCardInvalid);
        top.API.Crd.addEvent("DeviceError", onDeviceError);
        top.API.Crd.addEvent("GetICInfoCompleted", onGetICInfoCompleted);
        top.API.Crd.addEvent("ReadIcTLVCompleted", onReadIcTLVCompleted);
        //待修正  PBOC失败事件
        top.API.Crd.addEvent("ChipInvalid", onChipInvalid);
        top.API.Crd.addEvent("CardAcceptFailed", onCardAcceptFailed);
        top.API.Crd.addEvent("ChipPowerFailed", onChipPowerFailed);
        top.API.Crd.addEvent("GetICInfoFailed", onGetICInfoFailed);
        top.API.Crd.addEvent("ReadIcTLVFailed", onReadIcTLVFailed);


        top.API.Scr.addEvent("CardAccepted", onScrCardAccepted);
        top.API.Scr.addEvent("CardAcceptFailed", onScrCardAcceptFailed);
        top.API.Scr.addEvent("CardInvalid", onScrCardInvalid);
        top.API.Scr.addEvent("CardTaken", onCardTaken);
        top.API.Scr.addEvent("DeviceError", onScrDeviceError);

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

        top.API.Pin.addEvent("CryptFailed", onCryptFailed);
        top.API.Pin.addEvent("MACGenerated", onMACGenerated);
    }

    function EventLogout() {
        top.API.Crd.removeEvent("ChipDataReceived", onChipDataReceived);
        //top.API.Crd.removeEvent("CardTaken", onCardTaken);
        top.API.Crd.removeEvent("CardInserted", onCardInserted);
        top.API.Crd.removeEvent("DeviceError", onCrdDeviceError);

        top.API.Crd.removeEvent("CardAccepted", onCardAccepted);
        top.API.Crd.removeEvent("CardInvalid", onCardInvalid);
        top.API.Crd.removeEvent("DeviceError", onDeviceError);
        top.API.Crd.removeEvent("GetICInfoCompleted", onGetICInfoCompleted);
        top.API.Crd.removeEvent("ReadIcTLVCompleted", onReadIcTLVCompleted);
        top.API.Crd.removeEvent("ChipInvalid", onChipInvalid);
        top.API.Crd.removeEvent("CardAcceptFailed", onCardAcceptFailed);
        top.API.Crd.removeEvent("ChipPowerFailed", onChipPowerFailed);
        top.API.Crd.removeEvent("GetICInfoFailed", onGetICInfoFailed);
        top.API.Crd.removeEvent("ReadIcTLVFailed", onReadIcTLVFailed);

        top.API.Scr.removeEvent("CardAccepted", onScrCardAccepted);
        top.API.Scr.removeEvent("CardAcceptFailed", onScrCardAcceptFailed);
        top.API.Scr.removeEvent("CardInvalid", onScrCardInvalid);
        top.API.Scr.removeEvent("CardTaken", onCardTaken);
        top.API.Scr.removeEvent("DeviceError", onScrDeviceError);

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

        top.API.Pin.removeEvent("CryptFailed", onCryptFailed);
        top.API.Pin.removeEvent("MACGenerated", onMACGenerated);
    }

    function TimeoutCallBack() {
        Files.ErrorMsg("交易超时，交易结束");
        setTimeout(function () {
            return CallResponse("TimeOut");
        }, 4000);
    }

    //remove all event handler
    function Clearup() {
        App.Timer.ClearTime();
        EventLogout();
        //TO DO:
    }

})();
