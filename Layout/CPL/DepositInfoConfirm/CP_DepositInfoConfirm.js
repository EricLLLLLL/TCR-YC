/*@create by:  LeoLei
 *@time: 2018年03月8日
 */
;(function () {
    var nOkClickTime = 0;  // 点击第一次发送查询手续费流程，第二次发送其他流程
    var nDepSendTimes = 0; // 存款重发交易次数
    var arrTransType = "";
    var arrTransactionResult = "TRANFAIL";
    var Files = new dynamicLoadFiles(),
        JnlNum = "",
        CallResponse = App.Cntl.ProcessOnce(function (Response) {
            Clearup();
            if ("ContinueAddMoney" != Response) {
                top.API.Cim.StoreEscrowedCash(top.API.gStoreEscrowedCashTimeOut);
            }
            //Entry the flows control process.
            App.Cntl.ProcessDriven(Response);
        });
    var Initialize = function () {
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        ButtonDisable();
        EventLogin();
        showInfo();
        ButtonEnable();
        App.Plugin.Voices.play("voi_9");
    }();//Page Entry

    //@User ocde scope start
    function ButtonDisable() {
        document.getElementById('Exit').disabled = true;
        document.getElementById('ContinueMoney').disabled = true;
        document.getElementById('OK').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Exit').disabled = false;
        document.getElementById('ContinueMoney').disabled = false;
        document.getElementById('OK').disabled = false;
    }

    //显示入钞数据
    function showInfo() {

        if (top.API.gTranType == 'DEP' || top.API.gTranType == 'largeDep') {
            $("#depositNumberInfo").text(top.API.gCardno);
            $('#depositAccountInfo').text(top.API.gCustomerName);
        } else if (top.API.gTranType == 'noCardTrade' || top.API.gTranType == 'largeTran' || top.API.gTranType == 'largeRemit') {
            $("#depositNumberInfo").text(top.API.PayeeAccount);
            var strName = '';
            strName += '*';
            strName += top.API.gTFRCustomerName.substr(1, (top.API.gTFRCustomerName.length - 1));
            $('#depositAccountInfo').text(strName);
        }

        // }
        var strTransAmountTmp = parseInt(top.API.CashInfo.strTransAmount);

        //暂时还没有限额top.API.gChooseMoney
        if (strTransAmountTmp >= top.API.gChooseMoney && top.API.gChooseMoney != -1) {
            document.getElementById('ContinueMoney').style.display = "none";
        } else {
            document.getElementById('ContinueMoney').style.display = "block";
        }

        // 最大存款继续放钞限制
        if (top.API.nAcceptCashTimes >= top.API.gMaxCashTimes) {
            document.getElementById('ContinueMoney').style.display = "none";
        }

        for (var i = 0; i < top.API.CashInfo.arrCurrencyCashIn.length; i++) {
            top.API.gAcceptCounts += parseInt(top.API.CashInfo.arrCurrencyCashIn[i]);
        }
        //$('#depositAmountInfo').text(top.API.gAcceptCounts);

        // document.getElementById('PromptDiv1').style.display = "none";
        // document.getElementById('PageSubject').style.display = "block";       

        if (strTransAmountTmp > 0) {
            document.getElementById('Exit').style.display = "none";
            document.getElementById('OK').style.display = "block";
            var showmoney = "CNY " + top.API.CashInfo.strTransAmount + ".00";
            $('#depositMoneyInfo').text(showmoney);
            //$('#depositFeeInfo').text(DepFee);            // 显示存款手续费
            $('#t100').text(top.API.CashInfo.arrCurrencyCashIn[0]);
            $('#t50').text(top.API.CashInfo.arrCurrencyCashIn[1]);
            $('#t20').text(top.API.CashInfo.arrCurrencyCashIn[2]);
            $('#t10').text(top.API.CashInfo.arrCurrencyCashIn[3]);
            $('#t5').text(top.API.CashInfo.arrCurrencyCashIn[4]);
            $('#t1').text(top.API.CashInfo.arrCurrencyCashIn[5]);
            $('#tCash').text(top.API.CashInfo.strTransAmount + ".00");

            document.getElementById("continueTip").style.display = "block";
            document.getElementById("makeSureTip").style.display = "block";
        } else {
            document.getElementById('OK').style.display = "none";
            document.getElementById('Exit').style.display = "block";
            $('#depositMoneyInfo').text("CNY0.00");
            $('#t100').text(0);
            $('#t50').text(0);
            $('#t20').text(0);
            $('#t10').text(0);
            $('#t5').text(0);
            $('#t1').text(0);
            //$('#depositFeeInfo').text("0.00");
            $('#tCash').text("0.00");
            document.getElementById("continueTip").style.display = "none";
            document.getElementById("makeSureTip").style.display = "block";
        }
    }

    document.getElementById('Exit').onclick = function () {
        ButtonDisable();
        top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["存款信息确认，客户选择：取消"]);
        top.API.Jnl.PrintSync("Content");
        top.ErrorInfo = top.API.PromptList.No2;
        top.API.gOldCimRefusedNums = 0;
        top.API.ContinueAddCash = 0;
        return CallResponse('Exit');
    };

    document.getElementById('ContinueMoney').onclick = function () {
        ButtonDisable();
        top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["存款信息确认，客户选择：继续放钞"]);
        top.API.Jnl.PrintSync("Content");
        top.API.gIsContinueDep = true;
        top.API.ContinueAddCash = 1;
        top.API.nAcceptCashTimes++;
        return CallResponse('ContinueAddMoney');
    };

    document.getElementById('OK').onclick = function () {
        ButtonDisable();
        if (top.API.CashInfo.Dealtype == "DEP存款") {
            top.API.gTransactiontype = "DEP";
        } else if (top.API.CashInfo.Dealtype == "对公存款") {
            top.API.gTransactiontype = "BUSSINESSDEP";
        } else if (top.API.CashInfo.Dealtype == "无卡无折存款" || top.API.CashInfo.Dealtype == "存折存款") {
            top.API.gTransactiontype = "NOCARDDEP";
            if (top.API.gCardOrBookBank == 1) {
                top.API.gTransactiontype = "DEP";
            }
        }
        top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["存款信息确认，客户选择：确认"]);
        top.API.Jnl.PrintSync("Content");

        var strJNLData = "总共放钞：100:" + top.API.CashInfo.arrCurrencyCashIn[0] + " 50:" + top.API.CashInfo.arrCurrencyCashIn[1]
			+ " 20:" + top.API.CashInfo.arrCurrencyCashIn[2] + " 10:" + top.API.CashInfo.arrCurrencyCashIn[3] + " 5:" + top.API.CashInfo.arrCurrencyCashIn[4]
			+ " 1:" + top.API.CashInfo.arrCurrencyCashIn[5] + " RJ:" + top.API.Cim.NumOfRefused();
        top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, [strJNLData]);
        top.API.Jnl.PrintSync("Content");
        dep();

    };

    function dep() {
        top.API.gTransactiontype = "DEP";
        arrTransType = "DEP";
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
        }
        else {
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
        }
        else {
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
        top.API.displayMessage("onCompositionDataCompleted is done");
        var objArrData = arrData;
        var HexMasterKey = top.stringToHex(arrData);
        top.API.Pin.GenerateMAC(HexMasterKey, "MACKEY", '', 0, 0);
    }

    function onCompositionDataFail() {
        top.API.displayMessage("onCompositionDataFail is done");
        WriteAcctFileAfterTCP("AT", "");
        Files.ErrorMsg("通讯失败，交易结束");
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }

    function onMACGenerated(MacData) {
        top.API.displayMessage("onMACGenerated is done");
        var objMacData = MacData;
        var HexMasterKey = top.stringToHex(MacData);
        top.API.Tcp.SendToHost(HexMasterKey, 60000);
    }

    function onTcpOnRecved(tmpCheck) {
        top.API.displayMessage("onTcpOnRecved is done,CheckCode:" + tmpCheck);
        WriteAcctFileAfterTCP("", tmpCheck);
        SetJnlCashInBoxData(tmpCheck);
        switch (tmpCheck) {
            case '00':
                if (top.API.NoCardDeal) { // 进行无卡存款手续费试算跳出流程，到下一页面显示手续费                            
                    return CallResponse("OK");
                } else {                                      
                    if (top.API.gTranType == 'largeDep') {
                        //打印回执单
                        printReceipt();
                    } else {
                        return CallResponse("OK");
                    }
                }
                break;
            default:
                if (top.API.NoCardDeal) {
                    // 获取错误待显示提示信息
                    var sTranCode = top.API.Dat.GetPrivateProfileSync("TranCode", tmpCheck, "交易失败", top.API.Dat.GetBaseDir() + top.API.gIniTranCode);
                    Files.ErrorMsg(sTranCode);
                    setTimeout(function () {
                        return CallResponse("Exit");
                    }, 4000);
                } else {
                    // 判断是否存款重发,响应吗为如下需要重发存款报文，最大次数可配
                    var sTranCode = top.API.Dat.GetPrivateProfileSync("TranCode", tmpCheck, "交易失败", top.API.Dat.GetBaseDir() + top.API.gIniTranCode);
                    if (tmpCheck == "Z1" || tmpCheck == "Z2" || tmpCheck == "2H") {
                        top.API.Dat.SetPersistentDataSync(top.API.cwcflagTag, top.API.cwcflagType, [2]);
                        var arrTransactionResult = new Array("TRANFAIL");
                        top.API.Dat.SetDataSync("TRANSACTIONRESULT", "STRING", arrTransactionResult);
                        //top.API.gTakeCardAndPrint = true; //退卡页面打印凭条
                        // var arrComments = new Array("存款重发");
                        // top.API.Dat.SetDataSync("COMMENTS", "STRING", arrComments);
                        top.API.Ptr.Print("ReceiptCash_Print_szABC", "", top.API.gPrintTimeOut);
                    }
                    Files.ErrorMsg(sTranCode);

                    setTimeout(function () {
                        return CallResponse("DEP_NG");
                        top.API.gErrorInfo = "存款失败，请您联系银行！";
                    }, 4000);                                        
                }
                break;
        }
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
        if (ReCode == "00") {
            arrTransactionResult = "TRANSUCCESS";
        }
        top.API.Dat.SetDataSync("TRANSACTIONRESULT", "STRING", [arrTransactionResult]);
        var arrCashOutBoxData = new Array(strJNLData);
        if (!top.API.NoCardDeal) {
            top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, arrCashOutBoxData);
            top.API.Jnl.PrintSync("CashInBox");
        } else {
            top.API.Jnl.PrintSync("Transaction");
        }
    }

    function SetTimeDepAgain() {
        if (nDepSendTimes == 0) {
            App.Timer.SetIntervalDisposal(depAgain, 60000);
        }
    }

    function depAgain() {
        top.API.gTransactiontype = "DEP";
        if (top.API.NoCardDeal) {
            arrTransType = "RENOCARDTFR";
        } else {
            arrTransType = "REDEP";
        }
        nDepSendTimes++;
        Files.showNetworkMsg("交易处理中,请稍候...");
        top.API.displayMessage("Start 获取流水号" + arrTransType);
        App.Timer.SetPageTimeout(70);
        top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);
    }

    function WriteAcctFileAfterTCP(Reason, sRetCode) {
        var sTransAmount = top.API.CashInfo.strTransAmount;// + ".00"
        var sAccoutNo;
        if (top.API.NoCardDeal) {
            sAccoutNo = top.API.PayeeAccount;
        } else {
            sAccoutNo = top.API.gCardno;
        }

        top.API.Tsl.UpdateRecord(sAccoutNo + ", " + "DEP" + ", " +
                sTransAmount + ", " + sTransAmount +
                ", " + sRetCode + ", " + Reason);
    }

    function printReceipt() {
        var content = "";
        var tempStr = top.API.Dat.GetDataSync("SYSREFNUM", "STRING")[0];
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
        content += ",P20=" + "大额存款";//业务类型
        content += ",P21=" + top.API.gCardno;//交易卡号
        content += ",P22=" + "";//
        content += ",P23=" + "";//转入卡号
        content += ",P24=" + "存款";//
        content += ",P25=" + top.API.CashInfo.strTransAmount + ".00";//交易金额
        content += ",P26=" + top.API.gIdStarttime;//开始日期
        content += ",P27=" + top.API.gIdCardpic;//身份证头像
        content += ",P28=" + top.API.Dat.GetBaseDir() + top.API.gFaceCheckPic;//人脸识别
        content += ",P29=" + top.API.Dat.GetBaseDir() + top.API.gCheckIdCardpic;//联网核查
        content += ",P30=" + top.API.gIdFrontImage;//身份证前
        content += ",P31=" + top.API.gIdBackImage;//身份证后

        top.API.Jst.WriteReceiptFile(top.API.Dat.GetBaseDir() + "/DATA/ReceiptData/" + tempStr + ".html", content);

        top.API.Spt.RawData(top.API.Dat.GetBaseDir() + "/DATA/ReceiptData/" + tempStr + ".html", -1);
        return CallResponse("OK");
        //语音
        // App.Timer.ClearIntervalTime();
        // Files.showNetworkMsg("正在打印回单，请稍后！");
    }

    /********************************************************************************************************/
    //TCP模块
    function onTcpSendFailed() {
        top.API.displayMessage("onTcpSendFailed is done");
        WriteAcctFileAfterTCP("AT", ""); //add by art for 写交易记录文件
        if (!top.API.NoCardDeal) {
            top.API.Dat.SetPersistentDataSync(top.API.cwcflagTag, top.API.cwcflagType, [2]);
            var arrTransactionResult = new Array("TRANFAIL");
            top.API.Dat.SetDataSync("TRANSACTIONRESULT", "STRING", arrTransactionResult);
            //top.API.gTakeCardAndPrint = true; //退卡页面打印凭条
            // var arrComments = new Array("存款重发");
            // top.API.Dat.SetDataSync("COMMENTS", "STRING", arrComments);
            top.API.Ptr.Print("ReceiptCash_Print_szABC", "", top.API.gPrintTimeOut);
        }
        Files.ErrorMsg("通讯失败，交易结束");
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }

    function onTcpTimeout() {
        top.API.displayMessage("onTcpTimeout is done,arrTransType=" + arrTransType);        
        WriteAcctFileAfterTCP("AT", ""); //add by art for 写交易记录文件
        if (!top.API.NoCardDeal) {
            top.API.Dat.SetPersistentDataSync(top.API.cwcflagTag, top.API.cwcflagType, [2]);
            var arrTransactionResult = new Array("TRANFAIL");
            top.API.Dat.SetDataSync("TRANSACTIONRESULT", "STRING", arrTransactionResult);
            //top.API.gTakeCardAndPrint = true; //退卡页面打印凭条
            // var arrComments = new Array("存款重发");
            // top.API.Dat.SetDataSync("COMMENTS", "STRING", arrComments);
            top.API.Ptr.Print("ReceiptCash_Print_szABC", "", top.API.gPrintTimeOut);
        }
        Files.ErrorMsg("通讯失败，交易结束");
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }

    function onAnalysisFailed() {
        top.API.displayMessage("onAnalysisFailed is done");
        WriteAcctFileAfterTCP("AT", "");
        Files.ErrorMsg("报文解析失败，交易结束");
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }

    //event handler
    function onDeviceError() {
        top.API.displayMessage('键盘触发事件：onDeviceError()');
        Files.ErrorMsg("通讯失败，交易结束");
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
            if (top.API.NoCardDeal) { // 进行无卡存款手续费试算
                top.API.Dat.SetDataSync(top.API.TransKindTag, top.API.TransKindType, ["无卡存款手续费"]);
                top.API.Jnl.PrintSync("BeforeSendDisposal");
                top.API.Tcp.CompositionData("NOCARDTFRFEETRY");
            } else {                  // 走其他存款流程
                top.API.Dat.SetDataSync(top.API.TransKindTag, top.API.TransKindType, ["存款"]);
                top.API.Jnl.PrintSync("BeforeSendDisposal");
                top.API.Tcp.CompositionData(arrTransType);
            }
        }
    }

    function onDatSetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatSetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        Files.ErrorMsg("组包失败，交易结束");
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
    }

    //@User code scope end 
    function onEscrowedCashStored(arrUnitResult, bRecycle) {
        top.API.displayMessage("EscrowedCashStored");//暂时不对CashInEnd成功进行处理
    }

    function onEscrowedCashStoreFailed() {
        top.API.displayMessage("onEscrowedCashStoreFailed");//暂时不对CashInEnd失败进行处理
    }

    function onDeviceError() {
        top.API.displayMessage("DeviceError");//暂时不对CashInEnd失败进行处理
        Files.ErrorMsg("设备故障");
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
        top.API.Tcp.addEvent("Timeout", onTcpTimeout);
        top.API.Tcp.addEvent("AnalysisFailed", onAnalysisFailed);

        top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.addEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.addEvent("SetPersistentDataError", onDatSetPersistentDataError);

        top.API.Pin.addEvent("MACGenerated", onMACGenerated);
        top.API.Pin.addEvent("CryptFailed", onCryptFailed);

        top.API.Cim.addEvent('EscrowedCashStored', onEscrowedCashStored);
        top.API.Cim.addEvent('EscrowedCashStoreFailed', onEscrowedCashStoreFailed);
        top.API.Cim.addEvent('DeviceError', onDeviceError);


        top.API.Spt.addEvent('RawDataComplete ', onRawDataComplete);
        top.API.Spt.addEvent('RawDataFailed ', onRawDataFailed);
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

        top.API.Cim.removeEvent('EscrowedCashStored', onEscrowedCashStored);
        top.API.Cim.removeEvent('EscrowedCashStoreFailed', onEscrowedCashStoreFailed);
        top.API.Cim.removeEvent('DeviceError', onDeviceError);

        top.API.Spt.removeEvent('RawDataComplete ', onRawDataComplete);
        top.API.Spt.removeEvent('RawDataFailed ', onRawDataFailed);

    }

    //Countdown function
    function TimeoutCallBack() {
        //存款信息确认页面超时是否上账 0不上账 1上账
        var bDepTimeoutContinueTCP = top.API.Dat.GetPrivateProfileSync("TransactionConfig", "bDepTimeoutContinueTCP", "0", top.API.Dat.GetBaseDir() + top.API.gIniFileName);
        if (parseInt(top.API.CashInfo.strTransAmount) > 0) {
            if (top.API.CashInfo.Dealtype == "DEP存款") {
                top.API.gTransactiontype = "DEP";
            } else if (top.API.CashInfo.Dealtype == "对公存款") {
                top.API.gTransactiontype = "BUSSINESSDEP";
            } else if (top.API.CashInfo.Dealtype == "无卡无折存款" || top.API.CashInfo.Dealtype == "存折存款") {
                top.API.gTransactiontype = "NOCARDDEP";
                if (top.API.gCardOrBookBank == 1) {
                    top.API.gTransactiontype = "DEP";
                }
            }
            top.API.gOldCimRefusedNums = 0;
            var strJNLData = "总共放钞：100:" + top.API.CashInfo.arrCurrencyCashIn[0] + " 50:" + top.API.CashInfo.arrCurrencyCashIn[1]
                + " 20:" + top.API.CashInfo.arrCurrencyCashIn[2] + " 10:" + top.API.CashInfo.arrCurrencyCashIn[3] + " 5:" + top.API.CashInfo.arrCurrencyCashIn[4]
                + " 1:" + top.API.CashInfo.arrCurrencyCashIn[5] + " RJ:" + top.API.Cim.NumOfRefused();
            var arrCashOutBoxData = new Array(strJNLData);
            top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, arrCashOutBoxData);
            top.API.Jnl.PrintSync("Content");
            //App.Timer.SetPageTimeout(60);
            //App.Timer.TimeoutDisposal(TimeoutCallBack);
            top.API.displayMessage("bDepTimeoutContinueTCP："+bDepTimeoutContinueTCP);
            if(bDepTimeoutContinueTCP=="1"){
                if (nOkClickTime == 0) {
                    dep();
                } else {
                    if (top.API.NoCardDeal) {
                        return CallResponse("OK");
                    } else if (top.API.gTransactiontype == "DEP") {
                        dep();
                    }
                }
            }else{
                top.API.gErrorInfo = "您的钞票已经被回收，请联系银行！";
                top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["超时钞票被回收"]);
                top.API.Jnl.PrintSync("Content");


                var arrTransactionResult = new Array("TRANFAIL");
                top.API.Dat.SetDataSync("TRANSACTIONRESULT", "STRING", arrTransactionResult);
                top.API.gTakeCardAndPrint = true; //退卡页面打印凭条
                var arrComments = new Array("交易超时");
                top.API.Dat.SetDataSync("COMMENTS", "STRING", arrComments);
                top.API.Ptr.Print("ReceiptCash_Print_szABC", "", top.API.gPrintTimeOut);

                return CallResponse('TimeoutNotAll');
            }
        } else {
            top.ErrorInfo = top.API.PromptList.No3;
            top.API.gOldCimRefusedNums = 0;
            return CallResponse('TimeOut');
        }

    }

    //Page Return

    //remove all event handler
    function Clearup() {
        //TO DO:        
        EventLogout();
        App.Plugin.Voices.del();
        App.Timer.ClearTime();
        App.Timer.ClearIntervalTime();
    }

})();
