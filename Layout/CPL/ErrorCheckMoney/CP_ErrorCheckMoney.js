/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {
    var CashAmount = 0;
    var CashTotal = 0;
    var typeSelect = 0;
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        ButtonDisable();
        EventLogin();
        top.API.Cim.StoreEscrowedCash(top.API.gStoreEscrowedCashTimeOut);
        ButtonEnable();
    }();//Page Entry

    //@User ocde scope start
    function ButtonDisable() {
        top.API.displayMessage("ButtonDisable");
        document.getElementById('Exit').disabled = true;
    }
    function ButtonEnable() {
        top.API.displayMessage("ButtonEnable");
        document.getElementById('Exit').disabled = false;
    }
    //显示入钞数据
    function showInfo() {
        top.API.displayMessage("显示入钞数据");
        document.getElementById("CinfoDiv").style.display = "block";
        document.getElementById("CinfoTip").style.display = "block";
        document.getElementById("CinfoTakeTip").style.display = "none";

        var objGet = top.API.Dat.GetDataSync(top.API.cashintotalTag, top.API.cashintotalType);
        top.API.displayMessage("GetDataSync CASHINTOTAL Return:" + objGet);
        if (null == objGet) {
            top.API.displayMessage("GetDataSync CASHINTOTAL objGet = null");
        }
        else {
            arrGet = objGet;
            top.API.displayMessage("入钞信息： " + objGet);
        }
        var  Denomination100 = "";
        var  Denomination50 = "";
        var  Denomination20 = "";
        var  Denomination10 = "";
        var i = 0;
        var strDenomination = new Array();
        for (i = 0; i < arrGet.length; i++) {
            strDenomination = arrGet[i].split(":");
            if (strDenomination[0] == "0") {
                CashAmount=0;
                break;
            }
            if (strDenomination[0] == "100") {
                Denomination100 = strDenomination[1];
            }
            if (strDenomination[0] == "50") {
                Denomination50 = strDenomination[1];
            }
            if (strDenomination[0] == "20") {
                Denomination20 = strDenomination[1];
            }
            if (strDenomination[0] == "10") {
                Denomination10 = strDenomination[1];
            }
        }
        document.getElementById("CinfoDiv").style.display = "block";
        document.getElementById("CinfoTip").style.display = "block";
        document.getElementById("CinfoTakeTip").style.display = "none";
        if (CashAmount == 0) {
            document.getElementById('tCash').value = "CNY0";
            document.getElementById('T100').value = "0";
            document.getElementById('T50').value = "0";
            document.getElementById('T20').value = "0";
            document.getElementById('T10').value = "0";
        } else {
            var showmoney = "CNY" + CashAmount;
            document.getElementById('tCash').value = showmoney;
            document.getElementById('T100').value = Denomination100;
            document.getElementById('T50').value = Denomination50;
            document.getElementById('T20').value = Denomination20;
            document.getElementById('T10').value = Denomination10;
        }
    }

    document.getElementById('Exit').onclick = function () {
        ButtonDisable();
        top.API.displayMessage("点击Exit按钮,响应<Exit>");
        return CallResponse('Exit');
    }


    //@User code scope end 

    //event handler
    function onEscrowedCashStored(arrUnitResult, bRecycle) {
        top.API.displayMessage("触发onEscrowedCashStored");
        var Recycle = 0;
        var UnitResult = arrUnitResult;
        var num;
        var ArrMixResult = new Array(0, 0, 0, 0, 0);
        for (var i = 0; i < UnitResult.length; i++) {
            num = UnitResult[i].substr(0, 1) - 1;
            ArrMixResult[num] = parseInt(UnitResult[i].substr(2, UnitResult[i].length - 2), 10);
        }
        top.API.displayMessage("arrUnitResult[0]=" + ArrMixResult[0] + ";arrUnitResult[1]=" + ArrMixResult[1] + ";arrUnitResult[2]=" + ArrMixResult[2] + ";arrUnitResult[3]=" + ArrMixResult[3] + ";arrUnitResult[4]=" + ArrMixResult[4]);
        for (var i = 0; i < 5; i++) {
            CashAmount = CashAmount + (ArrMixResult[i] * top.API.CashInfo.arrUnitCurrency[i]);
            CashTotal = CashTotal + ArrMixResult[i];
        }
        showInfo();
    }

    function onCashTaken() {
        top.API.displayMessage("触发onCashTaken");
    }

    function onTimeout() {
        top.API.displayMessage("触发onTimeout");
        return CallResponse('Exit');
    }

    function onDeviceError() {
        top.API.displayMessage("触发onDeviceError");
        return CallResponse("Exit");
    }

    function onEscrowedCashStoreFailed() {
        top.API.displayMessage("onEscrowedCashStoreFailed");
    }


    //Register the event
    function EventLogin() {
        top.API.Cim.addEvent('EscrowedCashStored', onEscrowedCashStored);
        top.API.Cim.addEvent('EscrowedCashStoreFailed', onEscrowedCashStoreFailed);
        top.API.Cim.addEvent('CashTaken', onCashTaken);
        top.API.Cim.addEvent('Timeout', onTimeout);
        top.API.Cim.addEvent('DeviceError', onDeviceError);
    }

    function EventLogout() {
        top.API.Cim.removeEvent('EscrowedCashStored', onEscrowedCashStored);
        top.API.Cim.removeEvent('EscrowedCashStoreFailed', onEscrowedCashStoreFailed);
        top.API.Cim.removeEvent('CashTaken', onCashTaken);
        top.API.Cim.removeEvent('Timeout', onTimeout);
        top.API.Cim.removeEvent('DeviceError', onDeviceError);
    }

    //Countdown function
    function TimeoutCallBack() {
        top.API.displayMessage("超时响应");
        top.ErrorInfo = top.API.PromptList.No3;
        return CallResponse("Exit");
    }
    //Page Return
    
    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
        App.Timer.ClearTime();
    }
})();
