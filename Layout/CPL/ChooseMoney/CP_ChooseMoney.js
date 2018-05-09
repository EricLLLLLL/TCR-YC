/*@create by:  tsxiong
 *@time: 2016年03月20日
 */
;(function () {
    var LargeOrNot = 0,
        lRetAuthorized,
        lRetBigTranLimit,
        unitMaxmoney,
        bSetSupportCountMoney,
        SCMSet = [],//supportMoneySet
        CallResponse = App.Cntl.ProcessOnce(function (Response) {
            //TO DO:
            Clearup();
            App.Cntl.ProcessDriven(Response);
        });
    var Initialize = function () {
        EventLogin();
        lRetAuthorized = top.API.Sys.DataGetSync(top.API.MTRN_AUTHORIZEDAMOUNTRULE);
        lRetBigTranLimit = top.API.Sys.DataGetSync(top.API.MTRN_TRANLIMITAMOUNTREAL);
        ButtonDisable();
        ShowInfo();
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        ButtonEnable();
        bSetSupportCountMoney = top.API.Dat.GetPrivateProfileSync("TransactionConfig", "bSetSupportCountMoney", "0", top.API.gIniFileName);
        if(bSetSupportCountMoney == '1'){
            SupportCountMoney();
        }else{
            top.API.Cim.SetSupportValue(['100','50','20','10','5','1']);
            top.API.gSupportValue = ['100','50','20','10','5','1'];
        }
        App.Plugin.Voices.play("voi_10");
    }();//Page Entry


    function GetUnitInfo(arrParam) {
        var arrCurrentCount = new Array();
        var arrSplite = new Array();
        var arrReturnInfo = new Array();
        arrCurrentCount = arrParam;
        for (i = 0; i < arrCurrentCount.length; i++) {
            arrSplite = arrCurrentCount[i].split(":");
            arrReturnInfo[i] = arrSplite[1];
        }
        return arrReturnInfo;
    }

    //根据钞箱是否已满的情况判断是否开放相关面值存款。
    function SupportCountMoney() {
        var arrUnitRemain = GetUnitInfo(top.API.gArrUnitRemain);
        var arrUnitStatus = GetUnitInfo(top.API.gArrUnitStatus);
        top.API.displayMessage("arrUnitRemain-------" + arrUnitRemain);
        top.API.displayMessage("arrUnitStatus-------" + arrUnitStatus);
        var arr = new Array();
        var amountOfMoney = ['100', '50', '20', '10', '5', '1'];
        for (var i = 0; i < arrUnitRemain.length; i++) {
            for (var j = 0; j < amountOfMoney.length; j++) {
                if (arrUnitRemain[i] == amountOfMoney[j]) {
                    if (arrUnitStatus[i] != 'FULL' && arrUnitStatus[i] != 'MISSING') {
                        arr.push(amountOfMoney[j]);
                    }
                }
            }
        }

        //去重
        for (var i = 0; i < arr.length; i++) {
            if (SCMSet.indexOf(arr[i]) == -1) {
                SCMSet.push(arr[i]);
            }
        }

        if (top.API.gSupportValue.sort().toString() != SCMSet.sort().toString()) {
            top.API.gSupportValue = SCMSet;
            top.API.displayMessage("SCMSet-------" + SCMSet);
            top.API.Cim.SetSupportValue(SCMSet);
        } else {
            SCMSet.sort(function (a, b) {
                return b - a;
            });

            //添加本机当前可支持面额的提示
            var tempSupportValue = SCMSet;
            var innerText = '本机当前支持的面额有：';
            if (tempSupportValue.length != 0) {
                for (var value in tempSupportValue) {
                    innerText += (tempSupportValue[value] + '元 ');
                }

            } else {
                innerText = '';
            }
            $('#SupportValue').text(innerText);
        }
    }

    //@User ocde scope start
    function ShowInfo() {
        var TransStatus = top.API.Sys.PossibleTransactionSync();
        var arrTransStatus = TransStatus.split(",");
        var BIG_CARD_flag = parseInt(arrTransStatus[10]);
        if (BIG_CARD_flag != 1) {
            document.getElementById('MoneyBtn2').style.display = "none";
        }
        if (lRetBigTranLimit <= 0) {
            document.getElementById('MoneyBtn2').style.display = "none";
            document.getElementById('MoneyBtn5').style.display = "none";
        }
        unitMaxmoney = top.API.Sys.DataGetSync(top.API.MTRN_REMAINDEPSITAMOUT);
        top.API.displayMessage("剩余存款总金额,Maxmoney=" + unitMaxmoney);

        var iniRet = top.API.Dat.GetPrivateProfileSync("BankConfig", "Edition", "2", top.API.gIniFileName);
        if ("2" == iniRet) {
            document.getElementById('LimitMoneyTip').style.display = "none";
        } else {
            document.getElementById('LimitMoneyTip').style.display = "block";
            document.getElementById('LimitMoney').innerHTML = (unitMaxmoney / 10000).toString();
        }

        var nAuthorized = parseInt(lRetAuthorized) / 10000;

        document.getElementById('MLimit2').innerHTML = nAuthorized;
        document.getElementById('MLimit3').innerHTML = nAuthorized;
        document.getElementById('MLimit4').innerHTML = nAuthorized;
        if (top.API.CashInfo.Dealtype == "存折存款" || top.API.CashInfo.Dealtype == "DEP存款") {
            document.getElementById('Back').style.display = "block";
        } else {
            document.getElementById('Back').style.display = "none";
        }
        var strName = '';
        strName += '*';
        strName += top.API.gCustomerName.substr(1, (top.API.gCustomerName.length - 1));
        if (top.API.CashInfo.Dealtype == "对公存款") {
            document.getElementById('tName').value = top.API.gCustomerName;
        } else {
            document.getElementById('tName').value = strName;
        }
        document.getElementById('tCardNo').value = top.API.gCardno;
    }

    function ButtonDisable() {
        document.getElementById('Exit').disabled = true;
        document.getElementById('MoneyBtn2').disabled = true;//大额
        document.getElementById('MoneyBtn5').disabled = true;//小额
        document.getElementById('Back').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Exit').disabled = false;
        document.getElementById('MoneyBtn2').disabled = false;
        document.getElementById('MoneyBtn5').disabled = false;
        document.getElementById('Back').disabled = false;
    }

    document.getElementById('Back').onclick = function () {
        ButtonDisable();
        return CallResponse('Back');
    }

    document.getElementById('Exit').onclick = function () {
        ButtonDisable();
        top.ErrorInfo = top.API.PromptList.No2;
        return CallResponse('Exit');
    }

    document.getElementById('MoneyBtn2').onclick = function () {
        top.API.displayMessage("点击大额存款");
        top.API.gbAmountType = false;
        var tmpTslType = "";
        if (top.API.CashInfo.Dealtype == "DEP存款") {
            tmpTslType = "BDEP";
        } else if (top.API.CashInfo.Dealtype == "存折存款") {
            tmpTslType = "BBOOKDEP";
        } else if (top.API.CashInfo.Dealtype == "无卡无折存款" || top.API.CashInfo.Dealtype == "存折存款") {
            tmpTslType = "BNOCARDDEP";
        }
        TslFunction(tmpTslType);
        top.API.gTslChooseJnlType = "0107";
        var bSetAvailableAmount =  top.API.Dat.GetPrivateProfileSync("TransactionConfig", "bSetAvailableAmount", "0", top.API.gIniFileName);
        if(bSetAvailableAmount == '1') {
            if (lRetBigTranLimit > unitMaxmoney) {
                lRetBigTranLimit = unitMaxmoney;
            }
        }
        var arrTransactionResult;
        arrTransactionResult = new Array(lRetBigTranLimit.toString());
        top.API.gChooseMoney = lRetBigTranLimit;
        top.API.Dat.SetDataSync("CASHINMAXAMOUNT", "STRING", arrTransactionResult);
        ButtonDisable();
        return CallResponse('LargeDeposit');
    }

    document.getElementById('MoneyBtn5').onclick = function () {
        top.API.displayMessage("点击普通存款");
        top.API.gbAmountType = true;
        var tmpTslType = "";
        if (top.API.CashInfo.Dealtype == "DEP存款") {
            tmpTslType = "SDEP";
        } else if (top.API.CashInfo.Dealtype == "存折存款") {
            tmpTslType = "SBOOKDEP";
        } else if (top.API.CashInfo.Dealtype == "无卡无折存款" || top.API.CashInfo.Dealtype == "存折存款") {
            tmpTslType = "SNOCARDDEP";
        }
        TslFunction(tmpTslType);
        top.API.gTslChooseJnlType = "0107";
        var SetLimit = (lRetBigTranLimit <= lRetAuthorized - 100) ? lRetBigTranLimit : lRetAuthorized - 100;
        var bSetAvailableAmount =  top.API.Dat.GetPrivateProfileSync("TransactionConfig", "bSetAvailableAmount", "0", top.API.gIniFileName);
        if(bSetAvailableAmount == '0'){
                SetLimit = lRetAuthorized - 100;
        }

        top.API.displayMessage("SetLimit=" + SetLimit);
        var arrTransactionResult;
        arrTransactionResult = new Array(SetLimit.toString());
        top.API.gChooseMoney = SetLimit;
        top.API.Dat.SetDataSync("CASHINMAXAMOUNT", "STRING", arrTransactionResult);
        ButtonDisable();
        return CallResponse('OK');
    }

    //@User code scope end 
    //处理日期时间和交易类型
    function TslFunction(type) {
        var myData = top.GetDate12byte();
        top.API.gTslDate = myData.substr(0, 8);
        top.API.gTslTime = myData.substr(8, 6);
        top.API.gTslChooseType = type;
    }


    function onSetSupportValueCompleted() {
        SCMSet.sort(function (a, b) {
            return b - a;
        });

        //添加本机当前可支持面额的提示
        var tempSupportValue = SCMSet;
        var innerText = '本机当前支持的面额有：';
        if (tempSupportValue.length != 0) {
            for (var value in tempSupportValue) {
                innerText += (tempSupportValue[value] + '元 ');
            }

        } else {
            innerText = '';
        }
        $('#SupportValue').text(innerText);
        top.API.displayMessage("onSetSupportValueCompleted");
    }

    function onSetSupportValueFailed() {
        top.API.gSupportValue = [];
        top.API.displayMessage("onSetSupportValueFailed");
    }


    function EventLogin() {
        top.API.Cim.addEvent("SetSupportValueCompleted", onSetSupportValueCompleted);
        top.API.Cim.addEvent("SetSupportValueFailed", onSetSupportValueFailed);
    }

    function EventLogout() {
        top.API.Cim.removeEvent("SetSupportValueCompleted", onSetSupportValueCompleted);
        top.API.Cim.removeEvent("SetSupportValueFailed", onSetSupportValueFailed);
    }

    //Countdown function
    function TimeoutCallBack() {
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
