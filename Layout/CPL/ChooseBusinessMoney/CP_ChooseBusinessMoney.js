/*@create by:  tsxiong
 *@time: 2016年03月20日
 */
;(function () {
    var LargeOrNot = 0,
        lRetAuthorized,
        lRetBigTranLimit,
        bSetSupportCountMoney,
        SCMSet = [],
        CallResponse = App.Cntl.ProcessOnce(function (Response) {
            //TO DO:
            Clearup();
            App.Cntl.ProcessDriven(Response);
        });
    var Initialize = function () {
        ButtonDisable();
        EventLogin();
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        lRetBigTranLimit = top.API.Sys.DataGetSync(top.API.MTRN_TRANLIMITAMOUNTREAL);
        top.API.displayMessage("MTRN_TRANLIMITAMOUNTREAL,交易限额,lRetBigTranLimit=" + lRetBigTranLimit);
        //设置钞箱可存金额
        var bSetAvailableAmount =  top.API.Dat.GetPrivateProfileSync("TransactionConfig", "bSetAvailableAmount", "0", top.API.gIniFileName);
        if(bSetAvailableAmount == '1') {
            setSupportDepValue();
        }
        ShowInfo();
        ButtonEnable();
        //设置
        bSetSupportCountMoney = top.API.Dat.GetPrivateProfileSync("TransactionConfig", "bSetSupportCountMoney", "0", top.API.gIniFileName);
        if (bSetSupportCountMoney == '1') {
            SupportCountMoney();
        }else{
            top.API.Cim.SetSupportValue(['100','50','20','10','5','1']);
            top.API.gSupportValue = ['100','50','20','10','5','1'];
        }
        App.Plugin.Voices.play("voi_40");
    }(); //Page Entry

    function setSupportDepValue() {
        //lRetBigTranLimit = top.API.Sys.DataGetSync(top.API.MTRN_TRANLIMITAMOUNTREAL);
        //top.API.displayMessage("MTRN_TRANLIMITAMOUNTREAL,交易限额,lRetBigTranLimit=" + lRetBigTranLimit);
        var unitMaxmoney = top.API.Sys.DataGetSync(top.API.MTRN_REMAINDEPSITAMOUT);
        top.API.displayMessage("unitMaxmoney,钞箱可存金额=" + unitMaxmoney);
        if (lRetBigTranLimit > unitMaxmoney) {
            lRetBigTranLimit = unitMaxmoney;
        }
    }

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
        document.getElementById('tCardNo').value = top.API.gCardno;
        document.getElementById('tName').value = top.API.gCustomerName;
        //SupportCountMoney();
    }

    function ButtonDisable() {
        document.getElementById('Exit').disabled = true;
        document.getElementById('OK').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Exit').disabled = false;
        document.getElementById('OK').disabled = false;
    }

    document.getElementById('OK').onclick = function () {
        ButtonDisable();
        TslFunction("BUSINESSDEP");
        top.API.gTslChooseJnlType = "0107";
        var arrTransactionResult;
        arrTransactionResult = new Array(lRetBigTranLimit.toString());
        top.API.gChooseMoney = lRetBigTranLimit;
        var nRet = top.API.Dat.SetDataSync("CASHINMAXAMOUNT", "STRING", arrTransactionResult);
        top.API.displayMessage("SetDataSync CASHINMAXAMOUNT Return:" + nRet);
        return CallResponse('OK');
    }

    document.getElementById('Exit').onclick = function () {
        ButtonDisable();
        top.ErrorInfo = top.API.PromptList.No2;
        return CallResponse('Exit');
    }

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
