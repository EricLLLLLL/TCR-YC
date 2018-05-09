/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {
    var TransType = null;
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        EventLogin();
        //@initialize scope start
//         var nRet = top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);
//         top.API.displayMessage("GetPersistentData JNLNUM Return:" + nRet);


    }();//Page Entry

    //@User ocde scope start

    //@User code scope end

    //event handler
    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        var JnlNum = DataValue[0];
        top.API.displayMessage("onDatGetPersistentDataComplete is done,DataName=" + DataName + ",DataType=" + DataType + ",DataValue=" + JnlNum);
        if ('JNLNUM' == DataName) {
            TransType = top.API.gTransactiontype;
            switch (TransType) {
                case "CWD":
                    var i;
                    //获取钞箱变更信息
                    var tmpCurrentInfo = new Array();
                    var CurrentInfo = new Array();
                    var objGet1 = top.API.Cdm.PUCurrentCount();
                    tmpCurrentInfo = objGet1;
                    for ( i = 0; i < tmpCurrentInfo.length; i++) {
                        CurrentInfo[i] = (tmpCurrentInfo[i]>top.API.CashInfo.arrUnitRemain[i])?(tmpCurrentInfo[i]-top.API.CashInfo.arrUnitRemain[i]):(top.API.CashInfo.arrUnitRemain[i]-tmpCurrentInfo[i]);
                    }         
                    top.API.Jnl.PrintSync("CashOutBox2");
                    break;
                default:
                    break;
            }
        }
    }
    function onDatGetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatGetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        return CallResponse('OK');
    }

    function onDatSetPersistentDataComplete(DataName) {
        top.API.displayMessage("onDatSetPersistentDataComplete is done,DataName=" + DataName);
        return CallResponse('OK');
    }

    function onDatSetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatSetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        return CallResponse('OK');
    }

    function onPrintComplete() {
        top.API.displayMessage("onPrintComplete is done");
        return CallResponse('OK');
    }

    function onDeviceError() {
        top.API.displayMessage("onDeviceError is done");
        return CallResponse('OK');
    }

    function onTimeout() {
        top.API.displayMessage("onTimeout is done");
        return CallResponse('OK');
    }

 
    //Register the event
    function EventLogin() {
        top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.addEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.addEvent("SetPersistentDataError", onDatSetPersistentDataError);
        top.API.Jnl.addEvent("PrintComplete", onPrintComplete);
        top.API.Jnl.addEvent("DeviceError", onDeviceError);
        top.API.Jnl.addEvent("Timeout", onTimeout);
    }
    function EventLogout() {
        top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.removeEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.removeEvent("SetPersistentDataError", onDatSetPersistentDataError);
//         top.API.Jnl.removeEvent("PrintComplete", onPrintComplete);
//         top.API.Jnl.removeEvent("DeviceError", onDeviceError);
//         top.API.Jnl.removeEvent("Timeout", onTimeout);
    }
    //Countdown function
    function TimeoutCallBack() {
        return CallResponse('TimeOut');
    }

    //Page Return
    

    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
        App.Timer.ClearTime();
    }
})();