/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {
    var nPlanOutMoneyThisTime = 0;  //本批次要出钞的金额
    var DispenseMoney;
    var nMixOrDispense = 0;   //标识当前执行的命令，用于NotDispensable的响应。0：Mix，1：Dispense。
    var nCompleteOrError = false;   //标识当前页面结束方式。false：失败，true：成功。
    var AllMoney;
    var bEndflag = false;
    var bCompletedflag = false;
    var bTakenflag = false;
    var bShowNext = false;
    var ArrMixResult = new Array();
    var ArrDispense = new Array();
    var bTakenTimerClear = true;

    var timeId = null;
    var btimeup = false;
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
            if (top.API.gResponsecode == "04" || top.API.gResponsecode == "33" ||
                top.API.gResponsecode == "41" || top.API.gResponsecode == "43" ||
                top.API.gResponsecode == "07" || top.API.gResponsecode == "34" ||
                top.API.gResponsecode == "35" || top.API.gResponsecode == "36" ||
                top.API.gResponsecode == "37" || top.API.gResponsecode == "67") {
                Response = "Capture";
            }
        
        //if ((!nCompleteOrError) && (bTakenTimerClear)) {
            // top.ErrorInfo = top.API.PromptList.No8;
            top.ErrorInfo = top.API.PromptList.No2;
        //}
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        ButtonDisable();
        EventLogin();
        App.Plugin.Voices.play("voi_20");
        if ("0" == top.API.CashInfo.strTransAmount) {
			nCompleteOrError = true;
			//top.ErrorInfo = top.API.PromptList.No3;
			return CallResponse('OK');
	    }
        var arrTransactionResult = new Array("存钞失败");
        var nRet = top.API.Dat.SetDataSync("TRANSACTIONRESULT", "STRING", arrTransactionResult);
        top.API.displayMessage("SetDataSync TRANSACTIONRESULT Return:" + nRet);
        return CallResponse('OK');//不退钞不退钞不退钞
        InitArray();
        //@initialize scope start	
        DispenseMoney = parseInt(top.API.CashInfo.strTransAmount);
        DispenseMoney = DispenseMoney - 0;
        AllMoney = DispenseMoney;
        top.API.displayMessage("进行Mix,DispenseMoney=" + DispenseMoney);
        nMixOrDispense = 0;
        //top.API.Cdm.Mix(DispenseMoney, "CNY", "2");
        ButtonEnable();

    }();//Page Entry
    function InitArray() {
        var i = 0;
        for ( i = 0; i < top.API.CashInfo.nCountOfUnits; i++) {
            ArrMixResult[i] = 0; 
            ArrDispense[i] = 0; 
        }
    }
    function OnlyDispense() {
        top.API.displayMessage("直接进行Dispense");
        var objGet = top.API.Dat.GetDataSync(top.API.cashinboxresultTag, top.API.cashinboxresultType);
        if (null == objGet) {
            top.API.displayMessage("GetDataSync CASHINBOXRESULT objGet = null");
        }
        else {
            top.API.displayMessage("GetDataSync CASHINBOXRESULT Return:" + objGet);
            var arrGet = objGet;
            var num;
            for (var i = 0; i < arrGet.length; i++) {
                num = arrGet[i].substr(0, 1) - 1;
                ArrDispense[num] = parseInt(arrGet[i].substr(2, arrGet[i].length - 2), 10);
            }
            for (i = 0; i < ArrDispense.length; i++) {
                ArrMixResult[i] = ArrDispense[i];
            }
            top.API.displayMessage("MixResult[0]=" + ArrMixResult[0] + ";MixResult[1]=" + ArrMixResult[1] + ";MixResult[2]=" + ArrMixResult[2] + ";MixResult[3]=" + ArrMixResult[3] + ";MixResult[4]=" + ArrMixResult[4]);
            MulDispense();
        }
    }

    function MixAndDispense() {
        top.API.displayMessage("进行MixAndDispense,DispenseMoney=" + DispenseMoney);
        nMixOrDispense = 0;
        top.API.Cdm.Mix(DispenseMoney, "CNY", "1");
    }
    function showinfo() {
        top.API.displayMessage("总额=" + AllMoney + ";未出:" + DispenseMoney);
        var tmpString = "Content=取消存款已退钞：" + (AllMoney - DispenseMoney).toString() + "元  剩余：" + DispenseMoney.toString() + "元。";
        top.API.Jnl.PrintSync("DepCancel");
        document.getElementById("Loading").style.display = "none";
        document.getElementById("CinfoMoney").style.display = "block";
        document.getElementById("CinfoTip").style.display = "block";
        document.getElementById("outMoney").value = AllMoney - DispenseMoney;
        document.getElementById("RemainMoney").value = DispenseMoney;
        document.getElementById("PageTitle").innerText = "请取走您的钞票";
    }
    function ShowFailedInfo() {
        top.API.displayMessage("总额=" + AllMoney + ";未出:" + DispenseMoney);
        document.getElementById("PageTitle").innerText = "出钞失败，请核对已出钞票！";
        document.getElementById("CnextTip").style.display = "none";
        document.getElementById("CinfoTip").style.display = "none";
        document.getElementById("Exit").style.display = "block";
        if (AllMoney == DispenseMoney) {        
            VoicesPlay();
            timeId = setInterval(VoicesPlay, 12000);
            btimeup = true;
            bTakenTimerClear = false;
        }
        App.Timer.SetPageTimeout(60);
        App.Timer.TimeoutDisposal(TimeoutCallBack);
    }
    function ShowSuccessInfo() {
        top.API.displayMessage("总额=" + AllMoney + ";未出:" + DispenseMoney);
        nCompleteOrError = true;
        document.getElementById("CnextTip").innerHTML = "出钞完毕，请点击<确定>按钮";
        document.getElementById("OK").style.display = "block";
        App.Timer.SetPageTimeout(60);
        App.Timer.TimeoutDisposal(TimeoutCallBack);
    }

    function OutMoney() {
        top.API.displayMessage("showinfo,DispenseMoney=" + DispenseMoney);
        if (bCompletedflag) {
            top.API.displayMessage("进行OutMoney,DispenseMoney=" + DispenseMoney);
            nMixOrDispense = 0;
            top.API.Cdm.Mix(DispenseMoney, "CNY", "1");
            // MulDispense();
        }
    }
    //@User ocde scope start
    function MulDispense() {
        top.API.displayMessage("MulDispense触发,DispenseMoney=" + DispenseMoney);
        var nUnits = 0;
        var ArrDispense = new Array();
        var UnitsNotes = 0;
        for ( nUnits = 0; nUnits < top.API.CashInfo.nCountOfUnits; nUnits++) {
            UnitsNotes += ArrMixResult[nUnits];
            ArrDispense[nUnits] = 0;
        } 
        top.API.displayMessage("总张数=" + UnitsNotes);
        top.API.displayMessage("面值=" + top.API.CashInfo.arrUnitCurrency);
        top.API.displayMessage("ArrMixResult=" + ArrMixResult);
        if (UnitsNotes <= 100) {
            InitFlag();
            nPlanOutMoneyThisTime = DispenseMoney;
            nMixOrDispense = 1;
            top.API.Cdm.Dispense(0, ArrMixResult, "CNY", "0");
            top.API.displayMessage("按照ArrMixResult出钞");
            DispenseMoney = 0;
            bEndflag = true;
            for (nUnits = 0; nUnits < top.API.CashInfo.nCountOfUnits; nUnits++) {
                ArrMixResult[nUnits] = 0;
            }
            IsEnd();
        } else {
            var nRoundCount = 100;
            nPlanOutMoneyThisTime = DispenseMoney;
            for (nUnits = 0; nUnits < top.API.CashInfo.nCountOfUnits; nUnits++) {
                if (ArrMixResult[nUnits] != 0) {
                    if (nRoundCount > 0) {
                        if (ArrMixResult[nUnits] > nRoundCount) {
                            ArrDispense[nUnits] = nRoundCount;
                            ArrMixResult[nUnits] = ArrMixResult[nUnits] - ArrDispense[nUnits];
                            nRoundCount = nRoundCount - ArrDispense[nUnits];
                            DispenseMoney = DispenseMoney - top.API.CashInfo.arrUnitCurrency[nUnits] * ArrDispense[nUnits];
                            top.API.displayMessage("ArrMixResult[nUnits] > nRoundCount，钞箱" + (nUnits + 1) + "配钞张数=" + ArrDispense[nUnits]);
                        } else {
                            ArrDispense[nUnits] = ArrMixResult[nUnits];
                            ArrMixResult[nUnits] = ArrMixResult[nUnits] - ArrDispense[nUnits];
                            nRoundCount = nRoundCount - ArrDispense[nUnits];
                            DispenseMoney = DispenseMoney - top.API.CashInfo.arrUnitCurrency[nUnits] * ArrDispense[nUnits];
                            top.API.displayMessage("ArrMixResult[nUnits] <= nRoundCount钞箱" + (nUnits + 1) + "配钞张数=" + ArrDispense[nUnits]);
                            continue;
                        };
                    } else { };
                    InitFlag();
                    nPlanOutMoneyThisTime = nPlanOutMoneyThisTime - DispenseMoney;
                    nMixOrDispense = 1;
                    top.API.Cdm.Dispense(0, ArrDispense, "CNY", "0");
                    top.API.displayMessage("出钞:ArrDispense=" + ArrDispense);
                    IsEnd();
                    break;
                }
            }
        }
    }

    function InitFlag() {
        bCompletedflag = false;
        bTakenflag = false;
        bShowNext = false;
    }

    function IsEnd() {
        var nUnits = 0;
        var bReturn = true;
        for (nUnits = 0; nUnits < top.API.CashInfo.nCountOfUnits; nUnits++) {
            if (ArrMixResult[nUnits] != 0) {
                bReturn = false;
            }
        }
        if (bReturn) {
            DispenseMoney = 0;
            bEndflag = true;
            top.API.displayMessage("所有钞箱出钞完毕");
        } 
        return bReturn;
    }
    //@User code scope end 

    //event handler
    function onCashDispensed(info) {
        top.API.displayMessage("onCashDispensed触发");
        var arrInfo = new Array();
        arrInfo = info;
        var nUnits = 0;
        var nAmountThisTime = 0;
        for (nUnits = 0; nUnits < top.API.CashInfo.nCountOfUnits; nUnits++) {            
            nAmountThisTime = nAmountThisTime + (arrInfo[nUnits] * top.API.CashInfo.arrUnitCurrency[nUnits]);
        }
        DispenseMoney = DispenseMoney + nPlanOutMoneyThisTime - nAmountThisTime;
        if (nAmountThisTime == 0) {
            showinfo();
            ShowFailedInfo();
        }else{
            bCompletedflag = true;
            showinfo();
            if (bTakenflag) {//若出钞完全，bTakenflag为false。
                OutMoney();
            }else {
                if (bShowNext) {
                    ShowSuccessInfo();
                }else{  
                    top.API.displayMessage("提示客户拿走钞票");                  
                    VoicesPlay();
                    timeId = setInterval(VoicesPlay, 12000);
                    btimeup = true;
                    App.Timer.SetPageTimeout(60);
                    bTakenTimerClear = false;
                    App.Timer.TimeoutDisposal(TimeoutCallBack);
                }
            }
        }
    }

    function VoicesPlay() {
        var tmp1 = top.API.Cdm.StOutputStatus();
        var tmp2= top.API.Cim.StInputStatus();
        if (tmp1 != "EMPTY" || tmp2 != "EMPTY") {
            top.API.displayMessage("出钞口InputOutputStatus="+tmp1 + "入钞口InputOutputStatus="+tmp2);
           App.Plugin.Voices.play("voi_7");
        }
    }

    function onNotDispensable() {
        if (0 === nMixOrDispense) {
            top.API.displayMessage("Mix引起的onNotDispensable触发,DispenseMoney=" + DispenseMoney + ";nPlanOutMoneyThisTime=" + nPlanOutMoneyThisTime);
        } else {
            top.API.displayMessage("Dispense引起的onNotDispensable触发,DispenseMoney=" + DispenseMoney + ";nPlanOutMoneyThisTime=" + nPlanOutMoneyThisTime);
            DispenseMoney = DispenseMoney + nPlanOutMoneyThisTime - 0;
        }
        showinfo();
        ShowFailedInfo();
    }

    function onDeviceError() {
        if (0 === nMixOrDispense) {
            top.API.displayMessage("Mix引起的onDeviceError触发,DispenseMoney=" + DispenseMoney + ";nPlanOutMoneyThisTime=" + nPlanOutMoneyThisTime);
        } else {
            top.API.displayMessage("Dispense引起的onDeviceError触发,DispenseMoney=" + DispenseMoney + ";nPlanOutMoneyThisTime=" + nPlanOutMoneyThisTime);
            DispenseMoney = DispenseMoney + nPlanOutMoneyThisTime - 0;
        }
        showinfo();
        ShowFailedInfo();
    }
    function onMixComplete(MixResult) {
        top.API.displayMessage("Mix:" + DispenseMoney + ";onMixComplete触发");
        ArrMixResult = MixResult;
        top.API.displayMessage("MixResult=" + ArrMixResult);
        MulDispense();
    }
    //event handler
    function onCashUnitError(info) {
        top.API.displayMessage("onCashUnitError触发");
        var arrInfo = new Array();
        arrInfo = info;
        var nUnits = 0;
        var nAmountThisTime = 0;
        for (nUnits = 0; nUnits < top.API.CashInfo.nCountOfUnits; nUnits++) {
            nAmountThisTime = nAmountThisTime + (arrInfo[nUnits] * top.API.CashInfo.arrUnitCurrency[nUnits]);
        }
        DispenseMoney = DispenseMoney + nPlanOutMoneyThisTime - nAmountThisTime;
        showinfo();
        ShowFailedInfo();
    }

    function onCashTaken() {
        top.API.displayMessage("onCashTaken触发");
        if (btimeup) {
            btimeup = false;
            window.clearInterval(timeId);
        }
        if (!bTakenTimerClear) {
            App.Timer.ClearTime();
            bTakenTimerClear = true;
        }
        if (!bEndflag) {
            top.API.displayMessage("继续出钞");
            bTakenflag = true;
            OutMoney();
        } else {
            top.API.displayMessage("出钞完毕");
            if (bCompletedflag) {
                ShowSuccessInfo();
            }
            bShowNext = true;
            //return CallResponse("OK");
        }
    }

    function ButtonDisable() {
        top.API.displayMessage("ButtonDisable");
        document.getElementById('OK').disabled = true;
        document.getElementById('Exit').disabled = true;
    }

    function ButtonEnable() {
        top.API.displayMessage("ButtonEnable");
        document.getElementById('OK').disabled = false;
        document.getElementById('Exit').disabled = false;
    }

    document.getElementById('OK').onclick = function () {
        top.API.displayMessage("点击OK按钮,响应<OK>");
        ButtonDisable();
        //add by hj 
        if (top.API.gCheckInfoFlag && top.API.gAuthorRefuse!=""&&top.API.Ptr.bDeviceStatus && top.API.gNoPtrSerFlag==false) {
            return CallResponse('Print');
        } else {
            return CallResponse('OK');
        }
    }

    document.getElementById('Exit').onclick = function () {
        top.API.displayMessage("点击Exit按钮,响应<Exit>");
        ButtonDisable();
        if (top.API.gCheckInfoFlag && top.API.gAuthorRefuse != "" && top.API.Ptr.bDeviceStatus && top.API.gNoPtrSerFlag==false) {
            return CallResponse('Print');
        } else {
            return CallResponse('Exit');
        }
    }

    //Register the event
    function EventLogin() {
        top.API.Cdm.addEvent('MixComplete', onMixComplete);
        top.API.Cdm.addEvent('CashDispensed', onCashDispensed);
        top.API.Cdm.addEvent('CashTaken', onCashTaken);
        top.API.Cdm.addEvent('NotDispensable', onNotDispensable);
        top.API.Cdm.addEvent('CashUnitError', onCashUnitError);
        top.API.Cdm.addEvent('DeviceError', onDeviceError);
    }

    function EventLogout() {
        top.API.Cdm.removeEvent('MixComplete', onMixComplete);
        top.API.Cdm.removeEvent('CashDispensed', onCashDispensed);
        top.API.Cdm.removeEvent('CashTaken', onCashTaken);
        top.API.Cdm.removeEvent('NotDispensable', onNotDispensable);
        top.API.Cdm.removeEvent('CashUnitError', onCashUnitError);
        top.API.Cdm.removeEvent('DeviceError', onDeviceError);
    }

    //Countdown function
    function TimeoutCallBack() {
        top.API.displayMessage("超时事件触发");
        ButtonDisable();
        if (!bTakenTimerClear) {
            top.API.displayMessage("客户未取钞");
            top.ErrorInfo = top.API.PromptList.No3;
            var arrTransactionResult  = new Array("客户未取钞");
            var nRet = top.API.Dat.SetDataSync("TRANSACTIONRESULT", "STRING", arrTransactionResult);
            top.API.displayMessage("SetDataSync TRANSACTIONRESULT Return:" + nRet);
             var arrBSERVICE = new Array();
            arrBSERVICE[0] = 0;
            nRet = top.API.Dat.SetDataSync(top.API.servicestateTag, top.API.servicestateType, arrBSERVICE);
            top.API.displayMessage("SetDataSync SERVICESTATE Return:" + nRet);
            if (top.API.gCheckInfoFlag && top.API.gAuthorRefuse != "" && top.API.Ptr.bDeviceStatus && top.API.gNoPtrSerFlag==false) {
                return CallResponse('Print');
            } else {
                return CallResponse('Capture');
            }
        }else{
            if (nCompleteOrError) {
                if (top.API.gCheckInfoFlag && top.API.gAuthorRefuse != "" && top.API.Ptr.bDeviceStatus && top.API.gNoPtrSerFlag==false) {
                    return CallResponse('Print');
                } else {
                    return CallResponse('OK');
                }
            } else {
                top.ErrorInfo = top.API.PromptList.No3;
                if (top.API.gCheckInfoFlag && top.API.gAuthorRefuse != "" && top.API.Ptr.bDeviceStatus && top.API.gNoPtrSerFlag==false) {
                    return CallResponse('Print');
                } else {
                    return CallResponse('TimeOut');
                }
            }
        }
    }
    //Page Return
    
    //remove all event handler
    function Clearup() {
        //TO DO:
        if (btimeup) {
            btimeup = false;
            window.clearInterval(timeId);
        }
        App.Plugin.Voices.del();
        EventLogout();
        App.Timer.ClearTime();
    }
})();
