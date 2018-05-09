/*@create by:  tsxiong
 *@time: 2016年03月20日
 *@modify by: LeoLei
 *@modify time :2016年09月07日
 */
;
(function() {
    var Inputdata = "";
    var bFirstKey = true;
    var EnterKey = false;
    var lRetAuthorized;
    var lRetBigTranLimit;
    var Files = new dynamicLoadFiles();
    var arrTransType = "";
    var CallResponse = App.Cntl.ProcessOnce(function(Response) {
        //TO DO:
        top.API.Siu.SetPinPadLight('OFF');
        Clearup();
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function() {
        //SYS 判断是否可取零钱
        top.API.gMixSelfCWD = false; //初始化零钞标志
        top.API.gbAmountType = true;
        // if (top.API.IsOntherCashCWD()) {
        //     document.getElementById('EXCWD').style.display = "block";
        // }
        lRetAuthorized = top.API.Sys.DataGetSync(top.API.MTRN_AUTHORIZEDAMOUNTRULE);
        top.API.displayMessage("MTRN_AUTHORIZEDAMOUNTRULE,授权限额,lRetAuthorized=" + lRetAuthorized);
        //考虑零钞限额
        var tmplRetBigTranLimit100 = top.API.Dat.GetDataSync("POSSIBLEDISPENSE100AMOUNT", "LONG")[0];
        //20180509
        var tmplRetBigTranLimitOther = top.API.Dat.GetDataSync("POSSIBLEDISPENSEOTHERAMOUNT", "LONG")[0];
        top.API.displayMessage("MTRN_TRANLIMITAMOUNTREAL,交易限额,lRetBigTranLimit100=" + tmplRetBigTranLimit100);
        top.API.displayMessage("MTRN_TRANLIMITAMOUNTREAL,交易限额,lRetBigTranLimitother=" + tmplRetBigTranLimitOther);
        var tmplRetBigTranLimit = tmplRetBigTranLimit100 + tmplRetBigTranLimitOther;
        var TransStatus = top.API.Sys.PossibleTransactionSync();
        var arrTransStatus = TransStatus.split(",");
        var BIG_CARD_flag = parseInt(arrTransStatus[10]);
        if (BIG_CARD_flag != 1) {
            lRetBigTranLimit = (tmplRetBigTranLimit <= 50000) ? tmplRetBigTranLimit : 49999;
        } else {
            lRetBigTranLimit = tmplRetBigTranLimit;
        }
        top.API.displayMessage("MTRN_TRANLIMITAMOUNTREAL,交易限额,lRetBigTranLimit=" + lRetBigTranLimit);

        ShowInfo(); //add by grb for 存折取款
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        ButtonDisable();
        EventLogin();
        //@initialize scope start
        top.API.Pin.GetData(0, false, "0,1,2,3,4,5,6,7,8,9,ENTER,CLEAR,CANCEL", "CANCEL", -1);
        top.API.Siu.SetPinPadLight('CONTINUOUS');
        ButtonEnable();
        App.Plugin.Voices.play("voi_12");
    }(); //Page Entry

    //@User ocde scope start
    //重新输入金额
    function Reinput() {
        ButtonEnable();
        EnterKey = false;
        bFirstKey = true;
        Inputdata = "";
        document.getElementById("CWDvalue").value = Inputdata;
        App.Timer.SetPageTimeout(60);
        // document.getElementById("CNMoney").innerText = Inputdata;
    }

    function ButtonDisable() {
        document.getElementById('cwdMoney3').disabled = true;
        document.getElementById('cwdMoney5').disabled = true;
        document.getElementById('cwdMoney10').disabled = true;
        document.getElementById('cwdMoney15').disabled = true;
        document.getElementById('cwdMoney20').disabled = true;
        document.getElementById('cwdMoney30').disabled = true;
        document.getElementById('Back').disabled = true;
        document.getElementById('OK').disabled = true;
        document.getElementById('Alter').disabled = true;
        // document.getElementById('EXCWD').disabled = true;

    }

    function ButtonEnable() {
        document.getElementById('cwdMoney3').disabled = false;
        document.getElementById('cwdMoney5').disabled = false;
        document.getElementById('cwdMoney10').disabled = false;
        document.getElementById('cwdMoney15').disabled = false;
        document.getElementById('cwdMoney20').disabled = false;
        document.getElementById('cwdMoney30').disabled = false;
        document.getElementById('Back').disabled = false;
        document.getElementById('OK').disabled = false;
        document.getElementById('Alter').disabled = false;
    }

    document.getElementById('Alter').onclick = function() {
        ButtonDisable();
        top.API.Pin.CancelGetData();
        top.API.Pin.GetData(0, false, "0,1,2,3,4,5,6,7,8,9,ENTER,CLEAR,CANCEL", "CANCEL", -1);
        Reinput();
        ButtonEnable();
    };

    document.getElementById('Back').onclick = function() {
        ButtonDisable();
        top.ErrorInfo = top.API.PromptList.No2;
        return CallResponse('Back');
    };

    document.getElementById('OK').onclick = function() {
        ButtonDisable();
        top.API.displayMessage("点击OK按钮");
        EnterKey = true;
        // document.getElementById('InfoTip').innerText = "";
        if (Inputdata == "" || Inputdata == "0") {
            Files.ErrorMsg("取款金额不能为空或为0");
            Reinput();
        } else {
            var UnitMaxAmount = lRetBigTranLimit;
            var nAmount = parseInt(Inputdata, 10);
            if (UnitMaxAmount < nAmount) {
                //document.getElementById("InfoTip").innerText = "超出设备可取金额";
                Files.ErrorMsg("超出设备可取金额");
                Reinput();
            } else {
                if (top.API.gTranType == 'CWD' && Inputdata > 10000) {
                    Files.ErrorMsg("小额单次取款不能大于1万元");
                    Reinput();
                } else if (top.API.gTranType == 'largeCwd' && Inputdata < 20000) {
                    Files.ErrorMsg("大额取款不能低于2万元");
                    Reinput();
                } else {
                    var CWDMoney = 0;
                    CWDMoney = 200000;
                    // top.API.displayMessage("top.API.gnCWDMoney:" + top.API.gnCWDMoney);
                    // top.API.displayMessage("nAmount:" + nAmount);
                    // top.API.displayMessage("CWDMoney:" + CWDMoney);
                    // if ((nAmount + top.API.gnCWDMoney) > CWDMoney) {
                    //     var showText = "个人客户日累计取款限额为" + CWDMoney + "元，您的本次取款金额已超出剩余可取现额度，请重新输入";
                    //     Files.ErrorMsg(showText);
                    //     Reinput();
                    // }else{
                    // }
                    if (nAmount > CWDMoney) {
                        Files.ErrorMsg("大额取款单笔不超过20万");
                        Reinput();
                    } else {
                        top.API.displayMessage("Start mix, nAmount = " + nAmount);
                        top.API.Cdm.Mix(nAmount, "CNY", "1");
                    }
                }
            }
        }
    };

    function onMixComplete(MixResult) {
        top.API.displayMessage("Input Money onMixComplete");
        top.API.Pin.CancelGetData();
        top.API.CashInfo.strTransAmount = Inputdata;
        var tmp = Inputdata + "00";
        var arrINPUTMONEY = new Array(tmp);
        top.API.Dat.SetDataSync(top.API.transamountTag, top.API.transamountType, arrINPUTMONEY);
        top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["取款金额：" + tmp + ".00"]);
        top.API.Jnl.PrintSync("Content");
        if (top.API.gTranType == 'largeCwd') {
            if (top.API.gbContinueTransFlag) {
                SetDealData();
            } else {
                return CallResponse("OK");
            }
        } else {
            SetDealData();
        }
    }

    function onMixFailed() {
        top.API.displayMessage("Input Money onMixFailed，ReInput");
        Files.ErrorMsg("取款金额输入有误，请重新输入");
        Reinput();
    }

    document.getElementById("PageRoot").onclick = function() {
        ButtonDisable();
        top.API.Pin.CancelGetData();
        // top.ErrorInfo = top.API.PromptList.No2;
        return CallResponse("BackHomepage");
    };

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
            var nFee = top.API.Dat.GetPrivateProfileSync("TransactionConfig", "CWDFEESupport", "0", top.API.Dat.GetBaseDir() + top.API.gIniFileName);
            if (nFee == "1") {
                top.API.displayMessage("大额取款手续费试算获取流水号");
                Files.showNetworkMsg("交易处理中,请稍候...");
                top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);
            } else {
                if (top.API.gTranType == 'largeCwd' && top.API.gbContinueTransFlag) {
                    return CallResponse("NotFirstTrade");
                } else {
                    return CallResponse("OK");
                }
                //                return CallResponse("OK");
            }
        }
    }

    document.getElementById('cwdMoney3').onclick = function() {
        top.API.displayMessage("点击1万元/300按钮");
        ButtonDisable();
        document.getElementById('InfoTip').innerText = "";
        Inputdata = "300";
        document.getElementById("CWDvalue").value = top.InsertChar(Inputdata, 3, ',');
        EnterKey = true;
        document.getElementById('OK').onclick();
    }
    document.getElementById('cwdMoney5').onclick = function() {
        top.API.displayMessage("点击2万元/500按钮");
        ButtonDisable();
        document.getElementById('InfoTip').innerText = "";
        if (top.API.gTranType == 'largeCwd') {
            Inputdata = "20000";
        } else if (top.API.gTranType == 'CWD') {
            Inputdata = "500";
        }
        document.getElementById("CWDvalue").value = top.InsertChar(Inputdata, 3, ',');
        EnterKey = true;
        document.getElementById('OK').onclick();
    };
    document.getElementById('cwdMoney10').onclick = function() {
        top.API.displayMessage("点击3万元/1000按钮");
        ButtonDisable();
        document.getElementById('InfoTip').innerText = "";
        if (top.API.gTranType == 'largeCwd') {
            Inputdata = "30000";
        } else if (top.API.gTranType == 'CWD') {
            Inputdata = "1000";
        }
        document.getElementById("CWDvalue").value = top.InsertChar(Inputdata, 3, ',');
        EnterKey = true;
        document.getElementById('OK').onclick();
    };
    document.getElementById('cwdMoney15').onclick = function() {
        top.API.displayMessage("点击4万元/2000按钮");
        ButtonDisable();
        document.getElementById('InfoTip').innerText = "";
        if (top.API.gTranType == 'largeCwd') {
            Inputdata = "40000";
        } else if (top.API.gTranType == 'CWD') {
            Inputdata = "1500";
        }
        document.getElementById("CWDvalue").value = top.InsertChar(Inputdata, 3, ',');
        EnterKey = true;
        document.getElementById('OK').onclick();
    };
    document.getElementById('cwdMoney20').onclick = function() {
        top.API.displayMessage("点击5万元/5000按钮");
        ButtonDisable();
        document.getElementById('InfoTip').innerText = "";
        if (top.API.gTranType == 'largeCwd') {
            Inputdata = "50000";
        } else if (top.API.gTranType == 'CWD') {
            Inputdata = "2000";
        }
        document.getElementById("CWDvalue").value = top.InsertChar(Inputdata, 3, ',');
        EnterKey = true;
        document.getElementById('OK').onclick();
    };
    document.getElementById('cwdMoney30').onclick = function() {
        top.API.displayMessage("点击10万元/10000按钮");
        ButtonDisable();
        document.getElementById('InfoTip').innerText = "";
        if (top.API.gTranType == 'largeCwd') {
            Inputdata = "100000";
        } else if (top.API.gTranType == 'CWD') {
            Inputdata = "3000";
        }
        document.getElementById("CWDvalue").value = top.InsertChar(Inputdata, 3, ',');
        EnterKey = true;
        document.getElementById('OK').onclick();
    };

    function ShowInfo() {
        var cashName;
        for (i = 1; i < (top.API.CashInfo.nCountOfUnits + 1); i++) {
            cashName += top.API.CashInfo.arrUnitCurrency[i - 1].toString();
        }

        if (top.API.gTranType == 'CWD') {
            if (lRetBigTranLimit >= 3000) {
                $('#cwdMoney30').text('3000');
                $('#cwdMoney30').css("display", "block");
            }
            if (lRetBigTranLimit >= 2000) {
                $('#cwdMoney20').text('2000');
                $('#cwdMoney20').css("display", "block");
            }
            if (lRetBigTranLimit >= 1500) {
                $('#cwdMoney15').text('1500');
                $('#cwdMoney15').css("display", "block");
            }
            if (lRetBigTranLimit >= 1000) {
                $('#cwdMoney10').text('1000');
                $('#cwdMoney10').css("display", "block");
            }
            if (lRetBigTranLimit >= 500) {
                $('#cwdMoney5').text('500');
                $('#cwdMoney5').css("display", "block");
            }
            if (lRetBigTranLimit >= 300) {
                $('#cwdMoney3').text('300');
                $('#cwdMoney3').css("display", "block");
            }
            $("#onceCwdData").text("1万");
            $("#dayCwdData").text("2万");

        } else if (top.API.gTranType == 'largeCwd') {
            if (lRetBigTranLimit >= 100000) {
                $('#cwdMoney30').css("display", "block");
            }
            if (lRetBigTranLimit >= 50000) {
                $('#cwdMoney20').css("display", "block");
            }
            if (lRetBigTranLimit >= 40000) {
                $('#cwdMoney15').css("display", "block");
            }
            if (lRetBigTranLimit >= 30000) {
                $('#cwdMoney10').css("display", "block");
            }
            if (lRetBigTranLimit >= 20000) {
                $('#cwdMoney5').css("display", "block");
            }
            $("#cwdMoney3").hide();

            $("#onceCwdData").text("20万");
            $("#dayCwdData").text("20万");
        }

    }

    //@User code scope end 
    function onKeyPressed(key, keyCode) {
        var tmpInputdata = "";
        document.getElementById('InfoTip').innerText = "";
        if (((0 == key || 00 == key) && bFirstKey == true) && Inputdata.length < 9) {
            top.API.displayMessage("第一个数字不能为0");
            // if (Inputdata.length == 0 && 0 == key) {
            //     tmpInputdata = Inputdata;
            //     tmpInputdata += key;
            //     Inputdata = tmpInputdata;
            //     document.getElementById("CWDvalue").value = top.InsertChar(Inputdata, 3, ',');
            // } else {
            return;
            // }
        } else if (0 <= key || key <= 9 || 00 == key) {
            tmpInputdata = Inputdata;
            tmpInputdata += key;
            if (tmpInputdata.length == 7) {
                document.getElementById('InfoTip').innerText = "";
            } else if ((parseInt(tmpInputdata, 10) > 10000) && (top.API.CashInfo.Dealtype == "存折取款")) {
                document.getElementById('InfoTip').innerText = "存折取款不可大于10000元";
            } else {
                Inputdata = tmpInputdata;
                bFirstKey = false;
            }
            document.getElementById("CWDvalue").value = top.InsertChar(Inputdata, 3, ',');
            // document.getElementById("CNMoney").innerText = top.cmycurd(Inputdata);
        } else if (key == "CLEAR") {
            Reinput();
        } else if (key == "CANCEL") {
            document.getElementById('Back').onclick();
        } else if (key == "ENTER") {
            if (!EnterKey) {
                EnterKey = true;
                document.getElementById('OK').onclick();
            }
        }
    }


    //event handler
    function onDeviceError() {
        top.API.displayMessage("onDeviceError触发");
        top.ErrorInfo = top.API.PromptList.No4;
        return CallResponse("Back");
    }

    function TslFunction(type) {
        var myData = top.GetDate12byte();
        top.API.gTslDate = myData.substr(0, 8);
        top.API.gTslTime = myData.substr(8, 6);
        top.API.gTslChooseType = type;
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
            var arrTransType = new Array("CWD");
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
        setTimeout(function() {
            return CallResponse("Exit");
        }, 4000);
    }

    function onAnalysisFailed() {
        Files.ErrorMsg("解包失败，交易结束");
        setTimeout(function() {
            return CallResponse("Exit");
        }, 4000);
    }

    function onTcpOnRecved(tmpCheck) {
        Check = tmpCheck;
        top.API.displayMessage("onTcpOnRecved is done,Check:" + Check);
        if (Check == "00") {
            if (top.API.gbContinueTransFlag) {
                return CallResponse("NotFirstTrade");
            } else {
                return CallResponse("OK");
            }
        } else {
            // 获取错误待显示提示信息
            var sTranCode = top.API.Dat.GetPrivateProfileSync("TranCode", tmpCheck, "交易失败", top.API.Dat.GetBaseDir() + top.API.gIniTranCode);
            Files.ErrorMsg(sTranCode);
            setTimeout(function() {
                return CallResponse("Exit");
            }, 4000);
        }
    }

    function onTcpSendFailed() {
        top.API.displayMessage("onTcpSendFailed is done");
        Files.ErrorMsg("报文发送失败");
        setTimeout(function() {
            return CallResponse("Exit");
        }, 4000);
    }

    function onTcpTimeout() {
        top.API.displayMessage("onTcpTimeout is done");
        Files.ErrorMsg("通讯故障");
        setTimeout(function() {
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
        setTimeout(function() {
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

        top.API.Cdm.addEvent('MixComplete', onMixComplete);
        top.API.Cdm.addEvent('MixFailed', onMixFailed);
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
        top.API.Dat.removeEvent("SetPersistentDataError", onDatSetPersistentDataError);

        top.API.Pin.removeEvent("MACGenerated", onMACGenerated);
        top.API.Pin.removeEvent("CryptFailed", onCryptFailed);
        top.API.Pin.removeEvent("KeyPressed", onKeyPressed);
        top.API.Pin.removeEvent("DeviceError", onDeviceError);

        top.API.Cdm.removeEvent('MixComplete', onMixComplete);
        top.API.Cdm.removeEvent('MixFailed', onMixFailed);
    }

    //Countdown function
    function TimeoutCallBack() {
        top.API.Jnl.PrintSync("PageTimeOut");
        top.ErrorInfo = top.API.PromptList.No3;
        return CallResponse('TimeOut');
    }

    //Page Return

    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
        top.API.Pin.CancelGetData();
        App.Plugin.Voices.del();
        App.Timer.ClearTime();
    }
})();