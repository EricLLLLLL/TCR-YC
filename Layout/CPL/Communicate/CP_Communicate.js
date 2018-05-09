/*@create by:  tsxiong
 *@time: 2016年03月20日
 */
;(function () {
    var TransType = null;
    var bNextPageFlag = false; //流水跳转标志位；1：OK   2：TradeFailed
    var strErrMsg = "通讯失败，交易结束！";
    var Check = "";
    var JnlNum = null;//定义获取交易流水号变量
    var timeoutFlag = false;//是否已超时（页面超时、通讯超时）标志位
    var NGtimeId = null; //显示错误信息定时器
    var strCallResponse = "Error";//定义跳转内容
    var bTimeOutStart = false;//判断是否提示错误信息
    var CallResponse = App.Cntl.ProcessOnce(function (Response) {
        //TO DO:
        AfterSendDisposal();
        Clearup();
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        EventLogin();
        top.API.gResponsecode = '';
        //连续发报文的时候另做语音提示
        if (top.API.gTransactiontype == "QRYCUSTNAME") {
            document.getElementById('Tipid').innerText = "正在查询您的账户信息...";
            App.Plugin.Voices.play("voi_34");
        }
        else {
            App.Plugin.Voices.play("voi_28");
        }
        //@initialize scope start
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        top.ErrorInfo = top.API.PromptList.No1;
        SetCashUnitInfoToTCP();
        TransType = top.API.gTransactiontype;
        var arrTRANSACTIONTYPE = new Array(TransType);
        top.API.Dat.SetDataSync(top.API.transactiontypeTag, top.API.transactiontypeType, arrTRANSACTIONTYPE);
        top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);

    }();//Page Entry

    //@User ocde scope start

    //@User code scope end 
    function SetCashUnitInfoToTCP() {
        var strCounts = "";
        var strCurrency = "";
        var strInfo = "";
        for (i = 0; i < top.API.CashInfo.nCountOfUnits; i++) {
            switch (top.API.CashInfo.arrUnitCurrency[i]) {
                case 100:
                    strCurrency = "15650100";
                    break;
                case 50:
                    strCurrency = "15650050";
                    break;
                case 20:
                    strCurrency = "15650020";
                    break;
                case 10:
                    strCurrency = "15650010";
                    break;
                case 5:
                    strCurrency = "15650005";
                    break;
                case 1:
                    strCurrency = "15650001";
                    break;
                default:
                    strCurrency = "00000000";
                    break;
            }
            switch (top.API.CashInfo.arrUnitRemain[i].toString().length) {
                case 1:
                    strCounts = "000" + top.API.CashInfo.arrUnitRemain[i].toString();
                    break;
                case 2:
                    strCounts = "00" + top.API.CashInfo.arrUnitRemain[i].toString();
                    break;
                case 3:
                    strCounts = "0" + top.API.CashInfo.arrUnitRemain[i].toString();
                    break;
                case 4:
                    strCounts = top.API.CashInfo.arrUnitRemain[i].toString();
                    break;
                default:
                    strCounts = "0000";
                    break;
            }
            strInfo = strInfo + strCurrency + strCounts;
        }
        var arrDeviceState = new Array(strInfo);
        top.API.Dat.SetDataSync("DEVICESTATE", "STRING", arrDeviceState);
    }

    function BeforeSendDisposal() {
        var arrTransactionResult = new Array("通讯失败");
        top.API.gTakeCardAndPrint = true;
        top.API.Dat.SetDataSync("TRANSACTIONRESULT", "STRING", arrTransactionResult);
        switch (TransType) {
            case "DEP":
                SetTransKind("卡存款");
                break;
            case "NOCARDDEP":
                if (top.API.CashInfo.Dealtype == "存折存款") {
                    SetTransKind("存折存款");
                } else {
                    SetTransKind("无卡无折存款");
                }
                break;
            case "BUSSINESSDEP":
                SetTransKind("对公存款");
                var arrTRANSACTIONTYPE = new Array(top.API.gBUSSINESSDEPINFO);
                top.API.Dat.SetDataSync("BUSSINESSDEPINFO", "STRING", arrTRANSACTIONTYPE);
                break;
            case "CWD":
                if (top.API.CashInfo.Dealtype == "存折取款") {
                    SetTransKind("存折取款");
                } else {
                    SetTransKind("卡取款");
                }
                break;
            case "INQ":
                if (top.API.CashInfo.Dealtype == "存折业务") {
                    SetTransKind("折查询");
                } else {
                    SetTransKind("卡查询");
                }
                break;
            case "QRYCUSTNAME":
                SetTransKind("户名查询");
                break;
            case "CWC":
                SetTransKind("取款冲正");
                break;
            case "QRYBUSSINESSACCOUNT":
                SetTransKind("对公账户查询");
                break;
            case "QRYCWDMONEY":
                SetTransKind("累计金额查询");
                break;
            case "QRYACCOUNTTYPE":
                SetTransKind("账户类型查询");
                break;
            default:
                top.API.displayMessage("交易类型错误,TransType=" + TransType);
                break;
        }
        top.API.Jnl.PrintSync("BeforeSendDisposal");
    }

    function TradeCompleted() {
        if (bNextPageFlag) {
            var arrTransactionResult = new Array("交易成功");
            top.API.gTakeCardAndPrint = false;
            top.API.Dat.SetDataSync("TRANSACTIONRESULT", "STRING", arrTransactionResult);
        }
        switch (TransType) {
            case 'CWC':
                if (bNextPageFlag == true) {
                    strCallResponse = "CWC_OK";
                } else {
                    strCallResponse = "CWC_NG";
                }
                break;
            case 'BUSSINESSDEP':
            case 'NOCARDDEP':
            case 'DEP':
                if (top.API.gbPartCashIn) {
                    if (bNextPageFlag == true) {
                        var Amount = top.API.CashInfo.strTransAmount + ".00";
                        top.API.partCwcTip = true;
                        arrTransactionResult = new Array("已入账金额:" + Amount);
                        var arrComments = new Array("其他未入账金额，请联系银行工作人员");
                    } else {
                        top.API.partCwcTip = false;
                        arrTransactionResult = new Array("失败");
                        var arrComments = new Array("设备故障，请联系银行工作人员");
                    }
                    top.API.gTakeCardAndPrint = true;
                    top.API.Dat.SetDataSync("TRANSACTIONRESULT", "STRING", arrTransactionResult);
                    top.API.Dat.SetDataSync("COMMENTS", "STRING", arrComments);
                    var bSetDepErrorReset = top.API.Dat.GetPrivateProfileSync("TransactionConfig", "bSetDepErrorReset", "0", top.API.gIniFileName);
                    if (bSetDepErrorReset == '1') {
                        strCallResponse = 'CashinErrorReset';
                    } else if (bSetDepErrorReset == '2') {
                        strCallResponse = 'DirectAccount';
                    }
                } else {
                    if (bNextPageFlag == true) {
                        strCallResponse = "DEP_OK";
                    } else {
                        var arrTransactionResult = new Array("存钞失败");
                        top.API.gTakeCardAndPrint = true;
                        top.API.Dat.SetDataSync("TRANSACTIONRESULT", "STRING", arrTransactionResult);
                        strCallResponse = "DEP_NG";
                    }
                }
                break;
            case 'CWD':
                if (bNextPageFlag == true) {

                    if (top.API.gMixSelfCWD) {
                        strCallResponse = "EXCWD";
                    } else {
                        strCallResponse = "CWD_OK";
                    }
                } else {
                    strCallResponse = "CWD_NG";
                }
                break;
            case 'QRYCUSTNAME':
                if (bNextPageFlag == true) {
                    top.API.gTransStatus = top.API.Sys.PossibleTransactionSync();
                    var objGet1 = top.API.Dat.GetDataSync(top.API.customernameTag, top.API.customernameType);
                    if (null == objGet1) {
                        top.API.gCustomerName = "";
                    } else {
                        top.API.gCustomerName = objGet1[0].replace(/\s+/g, "");
                    }
                    strCallResponse = "QRYCUSTNAME_OK";
                } else {
                    strCallResponse = "QRYCUSTNAME_NG";
                }
                break;
            case 'INQ':
                if (bNextPageFlag == true) {
                    GetBalanceInfo();
                    strCallResponse = "INQ_OK";
                } else {
                    strCallResponse = "INQ_NG";
                }
                break;
            case 'QRYACCOUNTSTATE':
                if (bNextPageFlag == true) {
                    strCallResponse = "QRYACCOUNTSTATE_OK";
                } else {
                    strCallResponse = "QRYACCOUNTSTATE_NG";
                }
                break;
            case 'QRYBUSSINESSACCOUNT':
                if (bNextPageFlag == true) {
                    top.API.gTransStatus = top.API.Sys.PossibleTransactionSync();
                    var objGet1 = top.API.Dat.GetDataSync(top.API.customernameTag, top.API.customernameType);
                    if (null == objGet1) {
                        top.API.gCustomerName = "";
                    } else {
                        top.API.gCustomerName = objGet1[0].replace(/\s+/g, "");
                    }
                    strCallResponse = "QRYBUSSINESSACCOUNT_OK";
                } else {
                    strCallResponse = "QRYBUSSINESSACCOUNT_NG";
                }
                break;
            case 'QRYCWDMONEY':
                if (bNextPageFlag == true) {
                    strCallResponse = "QRYCWDMONEY_OK";
                    top.API.gTransactiontype = "QRYCUSTNAME"; // 查户名
                } else {
                    strCallResponse = "QRYCWDMONEY_NG";
                }
                break;
            case 'QRYACCOUNTTYPE':
                if (bNextPageFlag == true) {
                    strCallResponse = "QRYACCOUNTTYPE_OK";
                } else {
                    strCallResponse = "QRYACCOUNTTYPE_NG";
                }
                break;
            default:
                top.API.displayMessage("交易类型错误,TransType=" + TransType);
                break;
        }
        if (top.API.gResponsecode == "55") {
            strCallResponse = "ReInputPsw";
        }
        if (top.API.gResponsecode == "04" || top.API.gResponsecode == "33" ||
            top.API.gResponsecode == "41" || top.API.gResponsecode == "43" ||
            top.API.gResponsecode == "07" || top.API.gResponsecode == "34" ||
            top.API.gResponsecode == "35" || top.API.gResponsecode == "36" ||
            top.API.gResponsecode == "37" || top.API.gResponsecode == "67") {
            strCallResponse = "Capture";
        }
        if (bNextPageFlag == false) {
            top.ErrorInfo = top.API.PromptList.No6;
            if (timeoutFlag) {
                strCallResponse = "TimeOut";
            }
            document.getElementById('Loading').style.display = "none";
            document.getElementById('Tipdiv').style.display = "block";
            document.getElementById('tip_label').innerText = strErrMsg;
            bTimeOutStart = true;
            App.Timer.ClearTime();
            App.Timer.SetPageTimeout(8);
            App.Timer.TimeoutDisposal(TimeoutCallBack);
        } else {
            return CallResponse(strCallResponse);
        }

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

    function AfterSendDisposal() {
        if (Check == "00") {
            var tmpstrErrMsg = "交易成功";
            top.API.gTakeCardAndPrint = false;
        } else {
            var tmpstrErrMsg = "交易失败";
            top.API.gTakeCardAndPrint = true; //退卡页面打印凭条
        }
        var arrTransactionResult = new Array(tmpstrErrMsg);
        top.API.Dat.SetDataSync("TRANSACTIONRESULT", "STRING", arrTransactionResult);

        switch (TransType) {
            case "DEP":
                //获取存款金额
                var Amount = top.API.CashInfo.strTransAmount + ".00";
                top.API.gTslMoneyCount = Amount;
                top.API.gTslJnlNum = JnlNum;
                top.API.gTslFlag = true;
                top.API.gTslResponsecode = top.API.gResponsecode;
                //获取后台返回交易码
                objGet3 = top.API.Dat.GetDataSync("SYSREFNUM", "STRING");
                if (null == objGet3) {
                    top.API.displayMessage("GetDataSync poundage objGet = null");
                    top.API.gTslSysrefnum = "";
                }
                else {
                    top.API.displayMessage("后台返回交易码： " + objGet3);
                    top.API.gTslSysrefnum = objGet3;
                }
                SetJnlCashInBoxData();
                top.API.Jnl.PrintSync("CashInBox");
                break;
            case "NOCARDDEP":
                //获取存款金额
                var Amount = top.API.CashInfo.strTransAmount + ".00";
                top.API.gTslMoneyCount = Amount;
                top.API.gTslJnlNum = JnlNum;
                top.API.gTslFlag = true;
                top.API.gTslResponsecode = top.API.gResponsecode;
                //获取后台返回交易码
                objGet3 = top.API.Dat.GetDataSync("SYSREFNUM", "STRING");
                if (null == objGet3) {
                    top.API.displayMessage("GetDataSync poundage objGet = null");
                    top.API.gTslSysrefnum = "";
                }
                else {
                    top.API.displayMessage("后台返回交易码： " + objGet3);
                    top.API.gTslSysrefnum = objGet3;
                }
                SetJnlCashInBoxData();
                top.API.Jnl.PrintSync("CashInBox");
                break;
            case "BUSSINESSDEP":
                //获取存款金额
                var Amount = top.API.CashInfo.strTransAmount + ".00";
                top.API.gTslMoneyCount = Amount;
                top.API.gTslJnlNum = JnlNum;
                top.API.gTslFlag = true;
                top.API.gTslResponsecode = top.API.gResponsecode;
                //获取后台返回交易码
                objGet3 = top.API.Dat.GetDataSync("SYSREFNUM", "STRING");
                if (null == objGet3) {
                    top.API.displayMessage("GetDataSync poundage objGet = null");
                    top.API.gTslSysrefnum = "";
                }
                else {
                    top.API.displayMessage("后台返回交易码： " + objGet3);
                    top.API.gTslSysrefnum = objGet3;
                }
                SetJnlCashInBoxData();
                top.API.Jnl.PrintSync("CashInBox");
                break;
            case "CWD":
                //获取取款总额
                var Amount = top.API.CashInfo.strTransAmount + ".00";
                top.API.gTslMoneyCount = Amount;
                top.API.gTslJnlNum = JnlNum;
                top.API.gTslFlag = true;
                top.API.gTslResponsecode = top.API.gResponsecode;
                //获取后台返回交易码
                objGet3 = top.API.Dat.GetDataSync("SYSREFNUM", "STRING");
                if (null == objGet3) {
                    top.API.displayMessage("GetDataSync poundage objGet = null");
                    top.API.gTslSysrefnum = "";
                }
                else {
                    top.API.displayMessage("后台返回交易码： " + objGet3);
                    top.API.gTslSysrefnum = objGet3;
                }
                top.API.Jnl.PrintSync("CashOutBox1");
                break;
            case "INQ":
                top.API.Jnl.PrintSync("Transaction");
                break;
            case "QRYCUSTNAME":
                top.API.Jnl.PrintSync("Transaction");
                break;
            case "QRYBUSSINESSACCOUNT":
                top.API.Jnl.PrintSync("Transaction");
                break;
            case "QRYCWDMONEY":
                top.API.Jnl.PrintSync("Transaction");
                break;
            case "QRYACCOUNTTYPE":
                top.API.Jnl.PrintSync("Transaction");
                break;
            case "CWC":
                top.API.Jnl.PrintSync("Transaction");
                break;
            default:
                top.API.displayMessage("交易类型错误,TransType=" + TransType);
                break;
        }
    }

    //event handler
    /********************************************************************************************************/
    //组包 
    function onCompositionDataCompleted(arrData) {
        top.API.displayMessage("onCompositionDataCompleted is done, arrData =" + arrData);
        var objArrData = arrData;
        var HexMasterKey = top.stringToHex(arrData);
        top.API.Pin.GenerateMAC(HexMasterKey, "MACKEY", '', 0,0);
    }

    function onCompositionDataFail() {
        top.API.displayMessage("onCompositionDataFail is done");
        strErrMsg = "通讯失败，交易结束";
        WriteAcctFileAfterTCP("AT", ""); //add by art for 写交易记录文件
        bNextPageFlag = false;
        TradeCompleted();
    }

    function onMACGenerated(MacData) {
        top.API.displayMessage("onMACGenerated is done, MacData =" + MacData);
        var HexMasterKey = top.stringToHex(MacData);
        var objMacData = MacData;
        top.API.Tcp.SendToHost(HexMasterKey, 60000);
    }

    /********************************************************************************************************/
    //TCP模块    
    function onTcpSendFailed() {
        top.API.displayMessage("onTcpSendFailed is done");
        strErrMsg = "通讯失败，交易结束";
        WriteAcctFileAfterTCP("AT", ""); //add by art for 写交易记录文件
        bNextPageFlag = false;
        TradeCompleted();
    }

    function onTcpOnRecved(tmpCheck) {
        Check = tmpCheck;
        top.API.gResponsecode = tmpCheck;
        top.API.displayMessage("onTcpOnRecved is done,CheckCode:" + Check);
        var bSuccess = false;
        var ErrMsg = null;
        var nRet;
        switch (Check) {
            case '00':
                bNextPageFlag = true;
                if (TransType == "INQ") {
                    var objGet3 = top.API.Dat.GetDataSync("RESPONSECARDTYPE", "STRING");
                    if (null == objGet3) {
                        top.API.displayMessage("GetDataSync RESPONSECARDTYPE objGet = null");
                    } else {
                        var tmpResponse = objGet3[0].substr(0, 2);
                        if (tmpResponse == "01") {
                            bSuccess = true;
                            strErrMsg = "交易成功";
                            top.API.gATMORTCR = "TCR";
                            var arrATMORTCR = new Array("TCR");
                            var nRet = top.API.Dat.SetDataSync("ATMORTCR", "STRING", arrATMORTCR);

                            top.API.SaveBack = true; // 卡类型是银行卡，允许卡钞回存 
                            
                        } else if (tmpResponse == "02" || tmpResponse == "08") {
                            bSuccess = true;
                            strErrMsg = "交易成功";
                            top.API.gATMORTCR = "ATM";
                            var arrATMORTCR = new Array("ATM");
                            var nRet = top.API.Dat.SetDataSync("ATMORTCR", "STRING", arrATMORTCR);
                        } else {
                            bNextPageFlag = false;
                            strErrMsg = "该银行卡暂不支持交易";
                        }
                    }
                } else if (TransType == "QRYCWDMONEY") {
                    var objGet3 = top.API.Dat.GetDataSync("QRYCWDMONEY", "STRING");
                    if (null == objGet3) {
                        top.API.displayMessage("GetDataSync QRYCWDMONEY objGet = null");
                    }
                    else {
                        if( top.API.CWDType == "passbook" ){
                            var tmpResponse = objGet3[0];
                            var noPassbookCWDMoney = 200000; //当日累计金额写死
                            if (parseInt(tmpResponse) < noPassbookCWDMoney) {
                                top.API.noPassbookCWDMoney = parseInt(tmpResponse);
                                bSuccess = true;
                                strErrMsg = "交易成功";
                            } else {
                                bNextPageFlag = false;
                                strErrMsg = "个人客户累计无折存款限额为20万，您当日已存金额已达20万，请向网点咨询。";
                            }
                        }else{
                            var tmpResponse = objGet3[0];
                            var CWDMoney = 200000;//当日累计金额写死
                            if (parseInt(tmpResponse) < CWDMoney || top.API.gbOrderCWD == true) {
                                top.API.gnCWDMoney = parseInt(tmpResponse);
                                bSuccess = true;
                                strErrMsg = "交易成功";
                            } else {
                                bNextPageFlag = false;
                                strErrMsg = "个人客户累计取款限额为20万，您当日已取金额已达20万，请向网点预约取款。";
                            }
                        }
                        
                    }
                } else if (TransType == "QRYBUSSINESSACCOUNT") {
                    var objGet1 = top.API.Dat.GetDataSync(top.API.customernameTag, top.API.customernameType);
                    var arrGet1 = objGet1;
                    top.API.gCustomerName = arrGet1[0].toString().replace(/\s+/g, "");
                    if (top.API.gCustomerName != "") {
                        bSuccess = true;
                        strErrMsg = "交易成功";
                    } else {
                        bSuccess = false;
                        strErrMsg = "该账号暂不能办理此项业务";
                    }
                } else if (TransType == "QRYACCOUNTTYPE") {
                    var objGet1 = top.API.Dat.GetDataSync("QRYACCOUNTTYPE", "STRING");
                    var arrGet1 = objGet1;
                    var strQryAccountType = arrGet1[0].toString().replace(/\s+/g, "");
                    if (strQryAccountType == "00") {
                        bSuccess = true;
                        strErrMsg = "交易成功";
                    } else if (strQryAccountType == "01") {
                        bSuccess = false;
                        strErrMsg = "该账号暂不能办理此项业务";
                    } else if (strQryAccountType == "02") {
                        bSuccess = false;
                        strErrMsg = "该二类账号暂不能办理此项业务";
                    } else {
                        bSuccess = false;
                        strErrMsg = "该账号暂不能办理此项业务";
                    }
                } else {
                    bSuccess = true;
                    strErrMsg = "交易成功";
                }
                break;
            case '01':
                strErrMsg = "该银行卡暂不支持交易";//"查询发卡银行";
                break;
            case '04':
                strErrMsg = "银行卡异常,即将回收";//"没收卡";
                break;
            case '12':
                strErrMsg = "暂不能办理此项业务";//"无效交易";
                break;
            case '13':
                strErrMsg = "无效的交易金额";//"无效金额";
                break;
            case '14':
                strErrMsg = "该银行卡暂不支持交易";//"无效卡号";
                break;
            case '15':
                strErrMsg = "该银行卡暂不支持交易";//"无此发卡方";
                break;
            case '33':
                strErrMsg = "卡已过期,即将回收";//"过期的卡";
                break;
            case '38':
                strErrMsg = "密码错误超次数";//"超过允许的PIN试输入（没收卡）";
                break;
            case '41':
                strErrMsg = "账户已冻结,即将回收";//"挂失卡（没收卡）";
                break;
            case '43':
                strErrMsg = "非法账户,即将回收";//"被窃卡（没收卡）";
                break;
            case '51':
                strErrMsg = "余额不足";//"资金不足";
                break;
            case '54':
                strErrMsg = "卡已过期,即将回收";//"过期的卡";
                break;
            case '55':
                strErrMsg = "您输入的密码不正确";
                break;
            case '61':
                strErrMsg = "取款金额超限";//"资金不足";
                break;
            case '65':
                strErrMsg = "已超当日可取款次数";//"超出取现次数限制";
                break;
            case '75':
                strErrMsg = "密码错误超次数";//"允许的输入PIN次数超限";
                break;
            case '82':
                strErrMsg = "存在未销子账户，请到柜台办理";//"有未销子账户，拒绝交易";
                break;
            case '83':
                strErrMsg = "用户无权限操作解决方案";//"用户无权限操作解决方案";
                break;
            case '84':
                strErrMsg = "组件柜员分配错误";//"组件柜员分配错误";
                break;
            case '85':
                strErrMsg = "存折超出取款额度";//"存折超出取款额度"，不可再取;
                break;
            case '86':
                strErrMsg = "用户现金箱无此币种";//"用户现金箱无此币种";
                break;
            case '87':
                strErrMsg = "ARQC校验失败";//"相片校验不过（同号换卡多此类错误）";
                break;
            case '88':
                strErrMsg = "当前交易存折为对账折，请联系银行!";//"对账折账户";
                break;
            case '89':
                strErrMsg = "无效终端";//"无效终端";
                break;
            case '90':
            case '91':
            case '96':
            case '30':
            default:
                strErrMsg = "交易失败,请联系银行!";//"交易异常";
                break;
        }
        ;
        if (!bSuccess) {
            bNextPageFlag = false;
        }
        WriteAcctFileAfterTCP("", "");	//add by art for 写交易记录文件
        TradeCompleted();
    }

    function onTcpTimeout() {
        top.API.displayMessage("onTcpTimeout is done,TransType=" + TransType);
        if (!timeoutFlag) {
            timeoutFlag = true;
            WriteAcctFileAfterTCP("AT", ""); //add by art for 写交易记录文件
            strErrMsg = "通讯超时，交易结束";
            if (TransType == "CWD") {
                var arrCWCFlag = new Array();
                arrCWCFlag[0] = 1;
                top.API.Dat.SetPersistentData(top.API.cwcflagTag, top.API.cwcflagType, arrCWCFlag);
            } else {
                bNextPageFlag = false;
                TradeCompleted();
            }
        }
    }

    function onAnalysisFailed() {
        top.API.displayMessage("onAnalysisFailed is done");
        WriteAcctFileAfterTCP("AT", "");
        strErrMsg = "报文解析失败，交易结束";
        if (TransType == "CWD") {
            var arrCWCFlag = new Array();
            arrCWCFlag[0] = 1;
            top.API.Dat.SetPersistentData(top.API.cwcflagTag, top.API.cwcflagType, arrCWCFlag);
        } else {
            bNextPageFlag = false;
            TradeCompleted();
        }
    }

    //event handler
    function onDeviceError() {
        top.API.displayMessage('键盘触发事件：onDeviceError()');
        strErrMsg = "系统故障";
        bNextPageFlag = false;
        TradeCompleted();
    }

    //event handler
    function onCryptFailed() {
        top.API.displayMessage('键盘加解密失败：onCryptFailed');
        strErrMsg = "系统故障";
        bNextPageFlag = false;
        TradeCompleted();
    }

    /********************************************************************************************************/
    //永久数据模块
    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        var arrDataValue = DataValue;
        if ('JNLNUM' == DataName) {
            if (TransType == "DEP" || TransType == "NOCARDDEP" || TransType == "BUSSINESSDEP") {
                JnlNum = arrDataValue[0];
                BeforeSendDisposal();
                top.API.Tcp.CompositionData(TransType);
            } else {
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
    }

    function onDatGetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("DatGetPersistentDataError" + DataName + ",ErrorCode=" + ErrorCode);
        bNextPageFlag = false;
        TradeCompleted();
    }

    function onDatSetPersistentDataComplete(DataName) {
        if ('JNLNUM' == DataName) {
            if (TransType == "CWD") {
                //设置冲正流水号
                var arrCWCJNLNUM = new Array();
                arrCWCJNLNUM[0] = JnlNum;
                //取款交易成功之后需要清除冲正流水号
                BeforeSendDisposal();
                top.API.Dat.SetPersistentData(top.API.cwcjnlnumTag, top.API.cwcjnlnumType, arrCWCJNLNUM);
                top.API.Dat.SetDataSync(top.API.cwcjnlnumTag, top.API.cwcjnlnumType, arrCWCJNLNUM);
            } else {
                BeforeSendDisposal();
                top.API.Tcp.CompositionData(TransType);
            }
        }
        //修改获取永久数据成功标志位
        if ('CWCJNLNUM' == DataName) {
            top.API.Tcp.CompositionData(TransType);
        }
        if ('CWCFLAG' == DataName) {
            if (TransType == "CWD") {
                //设置冲正原因
                var arrCWCREASON = new Array();
                arrCWCREASON[0] = 1;
                nRet = top.API.Dat.SetPersistentData(top.API.cwcreasonTag, top.API.cwcreasonType, arrCWCREASON);
                top.API.Dat.SetDataSync(top.API.cwcreasonTag, top.API.cwcreasonType, arrCWCREASON);
            }
        }
        if ('CWCREASON' == DataName) {
            bNextPageFlag = false;
            TradeCompleted();
        }
    }

    function onDatSetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatSetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        bNextPageFlag = false;
        TradeCompleted();
    }

    /********************************************************************************************************/
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
        if (bTimeOutStart) {
            return CallResponse(strCallResponse);
        }
        if (!timeoutFlag) {
            timeoutFlag = true;
            strErrMsg = "通讯超时，交易结束";
            if (TransType == "CWD") {
                var arrCWCFlag = new Array();
                arrCWCFlag[0] = 1;
                var nRet1 = top.API.Dat.SetPersistentData(top.API.cwcflagTag, top.API.cwcflagType, arrCWCFlag);
            } else {
                bNextPageFlag = false;
                TradeCompleted();
            }
        }
    }

    //Page Return

    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
        App.Plugin.Voices.del();
        App.Timer.ClearTime();
    }

    function WriteAcctFileAfterTCP(Reason, InOutAmount) {
        var sRetCode = top.API.gResponsecode;
        var sTransAmount = top.API.CashInfo.strTransAmount;// + ".00"
        var sAccoutNo = top.API.gCardno;
        var sInOutAmount = InOutAmount;
        var sTransType = "";

        switch (top.API.gTransactiontype) {
            case "DEP":
            case "NOCARDDEP":
            case "BUSSINESSDEP":
                sTransType = "DEP";
                break;
            case "CWD":
                sTransType = "CWD";
                break;
            default:
                break;
        }
        if (("" == sTransType) || ("CWD" == sTransType && sRetCode == "55")) {
            return;
        }
        if ("CWD" == sTransType && sRetCode == "00") {
            Reason = "PF";
            top.API.Tsl.HandleRecordFileSync(top.API.MTSL_WRITETRANSRECORD, sAccoutNo + ", " + sTransType + ", " + sTransAmount + ", " + sInOutAmount + ", " + sRetCode + ", " + Reason);
            return;
        }
        if (top.API.gbPartCashIn && "DEP" == sTransType) {
            Reason += "PARTIN";
        }
        if ("DEP" == sTransType) {
            if( top.API.needPrintReDEPCash == true){
                    top.API.Tsl.HandleRecordFileSync(top.API.MTSL_WRITETRANSRECORD,top.API.gCardno + ", " + "DEP" + ", " +
                        top.API.CashInfo.strTransAmount + ", " + top.API.CashInfo.strTransAmount +
                        ", " + sRetCode + ", " + "REP");
            }else{
                top.API.Tsl.UpdateRecord(top.API.gCardno + ", " + "DEP" + ", " +
                    top.API.CashInfo.strTransAmount + ", " + top.API.CashInfo.strTransAmount +
                    ", " + sRetCode + ", " + Reason);
            }
        } else {
            top.API.Tsl.HandleRecordFileSync(top.API.MTSL_WRITETRANSRECORD, sAccoutNo + ", " + sTransType + ", " + sTransAmount + ", " + sInOutAmount + ", " + sRetCode + ", " + Reason);
        }
    }

    function SetTransKind(TransKindType) {
        var arrTransKindType = new Array(TransKindType);
        top.API.Dat.SetDataSync(top.API.TransKindTag, top.API.TransKindType, arrTransKindType);

    };
    function SetJnlCashInBoxData() {
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
        top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, arrCashOutBoxData);
    };
})();
