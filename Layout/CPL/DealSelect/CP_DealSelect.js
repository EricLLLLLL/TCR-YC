/*@create by:  tsxiong
 *@time: 2016年03月20日
 */
;(function () {
    var bSPL1 = false;
    var strCardNo = "";
    var timeoutID;
    var nowimg = 0;
    var timer = null;
    var CallResponse = App.Cntl.ProcessOnce(function (Response) {
        if (Response == "OffLine") {
            top.API.Crd.CancelAccept();
            top.API.Scr.CancelAccept();
            top.API.Sys.SetIsBusying(false);
        } else {
            top.API.Sys.SetIsBusying(true);
        }
        top.API.Siu.SetCardReaderLight('OFF');
        window.clearTimeout(timeoutID);
        Clearup();
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
//$("#shade").css("display","block");
        //@initialize scope start
        ButtonDisable();
        top.API.NoCardDeal = false; // 最开始只在CP_InputRemittanceAccount.js中设置值为True，导致后续流程异常
        top.API.gArrUnitRemain = top.API.Cdm.CUNoteValue();
        top.API.gArrUnitStatus = top.API.Cim.CUStatus();
        top.API.Sys.ItemClearSync(top.API.MTRN_TRANSACTIONDIFFER);
              //App.Plugin.Advert.InsertAdv("AdvParentDiv");   //广告轮播


        // 克隆第一张图片，并且放到最后
        $(".box-in li:first").clone().appendTo('.box-in')
        function rightFunc() {

            if (nowimg < 1) {
                nowimg++
                $(".box-in").animate({
                    "left": nowimg * -790
                }, 1000)
            } else {
                nowimg = 0
                $(".box-in").animate({
                    "left": 2 * -790
                }, 1000, function () {
                    $(".box-in").css("left", 0)

                })
            }
            $(".circle span").eq(nowimg).addClass('current').siblings().removeClass('current')

        }
        // 自动轮播
        timer = setInterval(rightFunc, 5000);
        EventLogin();
        top.API.CashInfo.arrUnitRemain = top.API.GetUnitInfo(top.API.Cdm.PUCurrentCount());
        top.API.CashInfo.InitData();
        // document.getElementById("version").innerText = "版本号: ABC_ShenZhen_TCR_AP_" + top.API.gVersion;
        var arrCwdDealtypeType = new Array("CARD"); //新增数据库初始值
        top.API.Dat.SetDataSync(top.API.CWDDealTypeTag, top.API.CWDDealTypeType, arrCwdDealtypeType);
        setSupportDepValue();
        ButtonEnable();
        top.API.Dat.SetDataSync("CARDBANKTYPE", "STRING", [""]);
        top.API.Dat.SetDataSync("TFRCARDBANKTYPE", "STRING", [""]);
        refreshTitleAdv();
    }(); //Page Entry

    // 设置存款限额到sp中，控制不让已存满钞箱的相关金额进回收箱
    function setSupportDepValue() {
        var unitMaxmoney = top.API.Sys.DataGetSync(top.API.MTRN_REMAINDEPSITAMOUT);
        var arrTransactionResult = new Array('' + unitMaxmoney);
        top.API.Dat.SetDataSync("CASHINMAXAMOUNT", "STRING", arrTransactionResult);
    }

    //@User ocde scope start
    function ButtonDisable() {
        document.getElementById('bigTrade').disabled = true;
        document.getElementById('noCardTrade').disabled = true;
        //document.getElementById('cardTrade').disabled = true;
        //document.getElementById('Business4').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('bigTrade').disabled = false;
        document.getElementById('noCardTrade').disabled = false;
        // document.getElementById('cardTrade').disabled = false;
        //document.getElementById('Business4').disabled = false;

    }


    function refreshTitleAdv() {
        top.API.Crd.CancelAccept();
        top.API.Scr.CancelAccept();
        var nCurNetState = top.API.Dat.GetDataSync("CURNETSTATE", "LONG")[0];
        if (nCurNetState == 0) { // Net Offline
            top.API.displayMessage("Current NetWork OffLine");
            top.API.Dat.SetDataSync("OPERATESTATE", "STRING", ["1"]);//供暂停服务状态轮询使用
            top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["网络异常，暂停服务"]);
            top.API.Jnl.PrintSync("Content");
            return CallResponse('OffLine');
        }
        var bRet = top.API.CheckDeviceStatus();        
       // App.Plugin.Wait.disappear();
       // $("#shade").hide();
        if (!bRet || top.API.Pin.StDetailedDeviceStatus() != "ONLINE") {
            top.API.Dat.SetDataSync("OPERATESTATE", "STRING", ["1"]);//供暂停服务状态轮询使用
            return CallResponse('OffLine');
        }
        else {
            // top.API.displayMessage("卡取款:" + top.API.gbCARDCWD_DEAL +
            //     ",卡存款:" + top.API.gbCARDDEP_DEAL +
            //     ",存折取款:" + top.API.gbPBCWD_DEAL +
            //     ",存折存款:" + top.API.gbPBDEP_DEAL +
            //     ",零钞兑换:" + top.API.gbEXCHANGE_DEAL +
            //     ",卡折销户:" + top.API.gbACCDELETE_DEAL +
            //     ",无卡无折存款:" + top.API.gbNOCARDDEP_DEAL +
            //     ",对公存款:" + top.API.gbBUSINESSDEP_DEAL +
            //     ",转账汇款:" + top.API.gbTRANSFER_DEAL +
            //     ",转账撤销:" + top.API.gbTRANSFERCANCEL_DEAL +
            //     ",定转活:" + top.API.gbPCA_DEAL +
            //     ",活转定:" + top.API.gbCTR_DEAL +
            //     ",卡钞回存:" + top.API.gbSAVEBACK_DEAL +
            //     ",微信销户:" + top.API.gbWXCancel_DEAL);
            // var strTip = "";
            // if (!top.API.gbCARDCWD_DEAL && !top.API.gbCARDDEP_DEAL && !top.API.gbPBCWD_DEAL
            //     && !top.API.gbPBDEP_DEAL && !top.API.gbNOCARDDEP_DEAL && !top.API.gbBUSINESSDEP_DEAL) {
            //     return CallResponse('OffLine');
            // } else {
            //     if (!top.API.gbCARDDEP_DEAL && !top.API.gbPBDEP_DEAL
            //         && !top.API.gbNOCARDDEP_DEAL && !top.API.gbBUSINESSDEP_DEAL) {
            //         strTip = strTip + "/存款";
            //     } else {
            //         if (!top.API.gbCARDDEP_DEAL) {
            //             strTip = strTip + "/卡存款";
            //         }
            //         if (!top.API.gbPBDEP_DEAL) {
            //             strTip = strTip + "/折存款";
            //         }
            //         if (!top.API.gbNOCARDDEP_DEAL) {
            //             strTip = strTip + "/无卡无折存款";
            //         }
            //         if (!top.API.gbBUSINESSDEP_DEAL) {
            //             strTip = strTip + "/对公存款";
            //         }
            //     }
            //     if (!top.API.gbCARDCWD_DEAL && !top.API.gbPBCWD_DEAL) {
            //         strTip = strTip + "/取款";
            //     } else {
            //         if (!top.API.gbCARDCWD_DEAL) {
            //             strTip = strTip + "/卡取款";
            //         }
            //         if (!top.API.gbPBCWD_DEAL) {
            //             strTip = strTip + "/存折取款";
            //         }
            //     }
            // }
            // if (strTip != "") {
            //     strTip = strTip.substring(1, strTip.length);
            //     //document.getElementById("moveTilte").style.display = "block";
            //    // document.getElementById("moveTilte").innerHTML = "本机暂不提供" + strTip + "服务";
            // } else {
            //     //document.getElementById("moveTilte").innerHTML = "";
            //     //document.getElementById("moveTilte").style.display = "none";
            // }

            // 对公存款
            // if (top.API.gbBUSINESSDEP_DEAL) {
            //     $("#Business7").show();
            // } else {
            //     $("#Business7").hide();
            // }
            //大额
            var StPaperStatus = top.API.Spt.StPaperStatus().split(",")[0];
            top.API.displayMessage("top.API.gbLARGEAMOUNT_DEAL：" + top.API.gbLARGEAMOUNT_DEAL);
            top.API.displayMessage("top.API.Tfc.bDeviceStatus：" + top.API.Tfc.bDeviceStatus);
            top.API.displayMessage("StPaperStatus：" + StPaperStatus);
            if (top.API.gbLARGEAMOUNT_DEAL && top.API.Tfc.bDeviceStatus && StPaperStatus != "JAMMED" && StPaperStatus != "OUT" && top.API.Spt.bDeviceStatus) {
                $("#bigTrade").show();
            } else {
                $("#bigTrade").addClass("unsupported");
                $("#bigTrade").attr("disabled", true);
            }

            var sSignFlag = top.API.Dat.GetPrivateProfileSync("AdminSign", "AdminSignFlag", "0", top.API.Dat.GetBaseDir()+top.API.gIniFileName);
            if (sSignFlag == "0") { // 未签到，屏蔽大额交易
                $("#bigTrade").addClass("unsupported");
                $("#bigTrade").attr("disabled", true);
            }
            // 无卡无折
            if (top.API.gbNOCARDDEP_DEAL) {
                $("#noCardTrade").show();
            } else {
                $("#noCardTrade").addClass("unsupported");
                $("#noCardTrade").attr("disabled", true);
            }
        }
        if (top.API.Scr.bDeviceStatus) {
            top.API.Scr.AcceptAndReadAvailableTracks('1,2,3', -1);
        }
        if (top.API.Crd.bDeviceStatus && top.API.gHaveTakeCard) {
            top.API.Crd.AcceptAndChipInitialise('AcceptAndChipInitialise', -1);
            top.API.Siu.SetCardReaderLight('SLOW');
        } else {
            top.API.Siu.SetCardReaderLight('OFF');
        }

    }

    function ChangebSPL1() {
        //TO DO:
        bSPL1 = false;
    }

    document.getElementById("SPL1").onclick = function () {
        bSPL1 = true;
        var t = window.setTimeout(ChangebSPL1, 5000);
    };
    document.getElementById("SPL2").onclick = function () {
        if (bSPL1) {
            bSPL1 = false;
            top.API.Dat.SetDataSync("OPERATESTATE", "STRING", ["0"]);//供暂停服务状态轮询使用
            top.API.displayMessage("OPERATESTATE = 0");
            top.API.Sys.OpenManagePage();
            top.API.Jnl.PrintSync("AdminOpenSpl");
            return CallResponse('OffLine');
        }
    };

    // 零钞兑换
    // document.getElementById("Business4").onclick = function(){
    //     ButtonDisable();
    //     top.API.Jnl.PrintSync("SelectExchange");
    //     top.API.CashInfo.Dealtype = "零钞兑换";
    //     var arrDealType = new Array(top.API.CashInfo.Dealtype);
    //     var nRet = top.API.Dat.SetDataSync(top.API.dealtypeTag, top.API.dealtypeType, arrDealType);
    //     nRet = top.API.Sys.DataSetSync(top.API.MTRN_TRANSACTIONDIFFER, top.API.MTRN_NOCARDDEPOSIT);

    //     top.API.Crd.CancelAccept();
    //     top.API.Scr.CancelAccept();
    //     CheckPtrPaper("Exchange");
    // }

    // 大额交易
    document.getElementById("bigTrade").onclick = function () {
        ButtonDisable();
        top.API.Dat.SetDataSync("PSBCDEALTYPE", "STRING", new Array("LARGE"));
        top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["************************************"]);
        top.API.Jnl.PrintSync("Content");
        top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["待插卡首页：进入大额交易"]);
        top.API.Jnl.PrintSync("Content");
        top.API.CashInfo.Dealtype = "大额交易";  // 销户
        var arrDealType = new Array(top.API.CashInfo.Dealtype);
        top.API.Dat.SetDataSync(top.API.dealtypeTag, top.API.dealtypeType, arrDealType);
        //top.API.gTransactiontype = 'BigTrader';
        top.API.Crd.CancelAccept();
        top.API.Scr.CancelAccept();
        top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["设备编号："+top.API.gTerminalID]);
        top.API.Jnl.PrintSync("Content");
        CheckPtrPaper("BigTrader");
    };

    //无卡交易
    document.getElementById("noCardTrade").onclick = function () {
        ButtonDisable();
        top.API.Dat.SetDataSync("PSBCDEALTYPE", "STRING", new Array("NOCARD"));
        top.API.gTranType = 'noCardTrade';
        top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["************************************"]);
        top.API.Jnl.PrintSync("Content");
        top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["待插卡首页：进入无卡交易"]);
        top.API.Jnl.PrintSync("Content");
        top.API.gTranType = 'noCardTrade';
        top.API.CashInfo.Dealtype = "无卡无折存款";
        var arrDealType = new Array(top.API.CashInfo.Dealtype);
        top.API.Dat.SetDataSync(top.API.dealtypeTag, top.API.dealtypeType, arrDealType);
        top.API.Dat.SetDataSync("QRYCWDMONEYFLAG", "STRING", ["1"]);//无卡无折存款为"1";
        top.API.Sys.DataSetSync(top.API.MTRN_TRANSACTIONDIFFER, top.API.MTRN_NOCARDDEPOSIT);
        top.API.Crd.CancelAccept();
        top.API.Scr.CancelAccept();
        CheckPtrPaper("NoCardDep");
    };

    // //对公存款
    // document.getElementById("cardTrade").onclick = function () {
    //     ButtonDisable();
    //     top.API.Jnl.PrintSync("SelectBusinessDep");
    //     top.API.CashInfo.Dealtype = "对公存款";
    //     var arrDealType = new Array(top.API.CashInfo.Dealtype);
    //     var nRet = top.API.Dat.SetDataSync(top.API.dealtypeTag, top.API.dealtypeType, arrDealType);
    //     nRet = top.API.Sys.DataSetSync(top.API.MTRN_TRANSACTIONDIFFER, top.API.MTRN_NOCARDDEPOSIT);
    //     top.API.Crd.CancelAccept();
    //     top.API.Scr.CancelAccept();
    //     CheckPtrPaper("BusinessDep");
    // }

    function CheckPtrPaper(Response) {
        var PtrPaperStatus = top.API.Ptr.StPaperStatus();
        if (top.API.Ptr.bDeviceStatus && (PtrPaperStatus == "FULL" || PtrPaperStatus == "LOW")) {
            return CallResponse(Response);
        } else {
            return CallResponse("NoPrint");
        }
    }

    //@User code scope end
    function onStatusChanged(PropertyName, OldValue, NewValue) {
        var arrCurrentStatus = new Array();
        arrCurrentStatus = NewValue;
        top.API.displayMessage(PropertyName + ":CurrentStatus=" + arrCurrentStatus[0]);
        refreshTitleAdv();
    }

    function onSafeDoorOpened() {
        top.API.displayMessage("SafeDoorOpened");
        refreshTitleAdv();
    }

    function onSafeDoorClosed() {
        top.API.displayMessage("SafeDoorClosed");
        refreshTitleAdv();
    }

    //event handler
    function onCrdDeviceError() {
        top.API.displayMessage("onCrdDeviceError");
        top.API.Siu.SetCardReaderLight('OFF');
        refreshTitleAdv();
    }

    function onScrDeviceError() {
        top.API.displayMessage("onScrDeviceError");
        refreshTitleAdv();
    }

    function onScrCardAcceptFailed() {
        top.API.displayMessage("onScrCardAcceptFailed");
        refreshTitleAdv();
    }


    function onChipDataReceived(Token, Bytes) {
        top.API.CashInfo.Dealtype = "INQ";
        var arrBalanceInquiryType = new Array("ACCTYPE");
        top.API.Dat.SetDataSync(top.API.BalanceInquiryTag, top.API.BalanceInquiryType, arrBalanceInquiryType);
        top.API.Dat.SetDataSync("PSBCDEALTYPE", "STRING", new Array("SMALL"));
        return CallResponse('CardInsert');
    }

    function onCardTaken() {
	    ButtonEnable();
        top.API.displayMessage("onCardTaken触发");
        top.API.gHaveTakeCard = true;
        refreshTitleAdv();
    }

    function onScrCardTaken() {
        top.API.displayMessage("onScrCardTaken触发,不处理");
        refreshTitleAdv();
    }

    function onCardInserted() {
        top.API.displayMessage("CardInserted");
        //ButtonDisable();
        top.API.Scr.CancelAccept();
    }

    function onCardAcceptFailed() {
        top.API.displayMessage("onCardAcceptFailed触发");
        refreshTitleAdv();
    }

    //---------------存折事件--------------
    function onScrCardAccepted() {
        ButtonDisable();
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
            timeoutID = window.setTimeout(function () {
                App.Plugin.Wait.disappear();
                refreshTitleAdv();
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
            SetCardNo();
        }
    }

    function SetCardNo() {
        if (strCardNo.toString().length == 0) {
            App.Plugin.Wait.showNoBankCard();
            timeoutID = window.setTimeout(function () {
                App.Plugin.Wait.disappear();
                refreshTitleAdv();
            }, 3000);
            return;
        } else {
            // var arrCardNo = new Array(strCardNo);
            // top.API.gCardno = strCardNo;
            // top.API.Dat.SetDataSync(top.API.cardnoTag, top.API.cardnoType, arrCardNo);
            // top.API.Jnl.PrintSync("PassbookAction");
            // top.API.CashInfo.Dealtype = "存折业务";
            // var arrDealType = new Array(top.API.CashInfo.Dealtype);
            // top.API.Dat.SetDataSync(top.API.dealtypeTag, top.API.dealtypeType, arrDealType);
            // CheckPtrPaper("BookBank");
            top.API.BrushCard = true;
            top.API.CashInfo.Dealtype = "INQ";
            var arrBalanceInquiryType = new Array("ACCTYPE");
            top.API.Dat.SetDataSync(top.API.BalanceInquiryTag, top.API.BalanceInquiryType, arrBalanceInquiryType);
            top.API.Dat.SetDataSync("PSBCDEALTYPE", "STRING", new Array("SMALL"));
            return CallResponse('CardInsert');
        }
    }

    function onScrCardInvalid() {
        top.API.displayMessage("CardInvalid");
        App.Plugin.Wait.showNoBankCard();
        timeoutID = window.setTimeout(function () {
            App.Plugin.Wait.disappear();
            refreshTitleAdv();
        }, 3000);
    }

    //---------------存折事件--------------

    function onNetChangeOffline() {
        top.API.displayMessage("onNetChangeOffline");
        top.API.Dat.SetDataSync("OPERATESTATE", "STRING", ["1"]);//供暂停服务状态轮询使用
        top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["网络异常，暂停服务"]);
        top.API.Jnl.PrintSync("Content");
        return CallResponse('OffLine');
    }
    //Register the event
    function EventLogin() {
        top.API.Crd.addEvent("StatusChanged", onStatusChanged);
        top.API.Pin.addEvent("StatusChanged", onStatusChanged);
        top.API.Ptr.addEvent("StatusChanged", onStatusChanged);
        top.API.Cim.addEvent("StatusChanged", onStatusChanged);
        top.API.Fpi.addEvent("StatusChanged", onStatusChanged);
        top.API.Idr.addEvent("StatusChanged", onStatusChanged);
        top.API.Scr.addEvent("StatusChanged", onStatusChanged);
        //CRD
        top.API.Crd.addEvent("ChipDataReceived", onChipDataReceived);
        top.API.Crd.addEvent("CardTaken", onCardTaken);
        top.API.Crd.addEvent("CardInserted", onCardInserted);
        top.API.Crd.addEvent("DeviceError", onCrdDeviceError);
        top.API.Crd.addEvent("CardAcceptFailed", onCardAcceptFailed);
        //SCR  
        top.API.Scr.addEvent("CardAccepted", onScrCardAccepted);
        top.API.Scr.addEvent("CardAcceptFailed", onScrCardAcceptFailed);
        top.API.Scr.addEvent("CardInvalid", onScrCardInvalid);
        top.API.Scr.addEvent("CardTaken", onScrCardTaken);
        top.API.Scr.addEvent("DeviceError", onScrDeviceError);
        //保险柜门开关事件
        top.API.Cim.addEvent("SafeDoorClosed", onSafeDoorClosed);
        top.API.Cim.addEvent("SafeDoorOpened", onSafeDoorOpened);

        top.API.Sys.addEvent("NetChangeOffline", onNetChangeOffline);
    }

    function EventLogout() {
        top.API.Crd.removeEvent("StatusChanged", onStatusChanged);
        top.API.Pin.removeEvent("StatusChanged", onStatusChanged);
        top.API.Ptr.removeEvent("StatusChanged", onStatusChanged);
        top.API.Cim.removeEvent("StatusChanged", onStatusChanged);
        top.API.Fpi.removeEvent("StatusChanged", onStatusChanged);
        top.API.Idr.removeEvent("StatusChanged", onStatusChanged);
        top.API.Scr.removeEvent("StatusChanged", onStatusChanged);
        //CRD
        top.API.Crd.removeEvent("ChipDataReceived", onChipDataReceived);
        top.API.Crd.removeEvent("DeviceError", onCrdDeviceError);
        top.API.Crd.removeEvent("CardTaken", onCardTaken);
        top.API.Crd.removeEvent("CardInserted", onCardInserted); 
        top.API.Crd.removeEvent("CardAcceptFailed", onCardAcceptFailed);
        //SCR  
        top.API.Scr.removeEvent("CardAccepted", onScrCardAccepted);
        top.API.Scr.removeEvent("CardAcceptFailed", onScrCardAcceptFailed);
        top.API.Scr.removeEvent("CardInvalid", onScrCardInvalid);
        top.API.Scr.removeEvent("CardTaken", onScrCardTaken);
        top.API.Scr.removeEvent("DeviceError", onScrDeviceError);
        //保险柜门开关事件
        top.API.Cim.removeEvent("SafeDoorClosed", onSafeDoorClosed);
        top.API.Cim.removeEvent("SafeDoorOpened", onSafeDoorOpened); 

        top.API.Sys.removeEvent("NetChangeOffline", onNetChangeOffline);
    }

    //remove all event handler
    function Clearup() {
               //App.Plugin.Advert.removeAdv();
        clearInterval(timer)
        EventLogout();
        //TO DO:
    }

})();
