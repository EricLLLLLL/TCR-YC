/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {    
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
		EventLogout();
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
		EventLogin();
        CheckStatus();
    } (); //Page Entry

    //@User ocde scope start
    function CheckStatus() {
		top.API.CheckDeviceStatus();
		var arrCurrentCount = new Array();
		var arrSplite = new Array();
		var arrReturnInfo = new Array();
		arrCurrentCount = top.API.Cdm.PUCurrentCount();
		for (i = 0; i < arrCurrentCount.length; i++) {
			arrSplite = arrCurrentCount[i].split(":");
			top.API.CashInfo.arrUnitName[i] = arrSplite[0];
			top.API.CashInfo.arrUnitRemain[i] = arrSplite[1];
		}
        //获取当前钞箱信息--钞箱面值
        top.API.CashInfo.arrUnitCurrency = top.API.GetUnitInfo(top.API.Cdm.CUNoteValue());
        //获取当前钞箱信息--钞箱个数
        top.API.CashInfo.nCountOfUnits = top.API.CashInfo.arrUnitRemain.length;
        if (top.API.CashInfo.nCountOfUnits < 5) {
            top.API.displayMessage("钞箱数目错误，nCountOfUnits = " + top.API.CashInfo.nCountOfUnits);
            return CallResponse("UnitError");
			
        }
        if (top.API.Pin.KeyIsValidSync("MACKEY")) {
            top.API.gMACKEY = true;
        }
        top.API.CashInfo.InitData();
		top.API.Dat.GetPersistentData("SUBBANKNUM", "STRING");
    }
	//永久数据模块
    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        var arrDataValue = DataValue;
        if ('SUBBANKNUM' == DataName) {
            top.API.gSubBankNum = arrDataValue[0];
             //获取柜员号
            top.API.Dat.GetPersistentData("TERMINALNUM", "STRING");
        }
        if ('TERMINALNUM' == DataName) {
            top.API.gSubBankNum += "-" + arrDataValue[0] + "号机";
            return CallResponse("OK");
        }      
    }

    function onDatGetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatGetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        return CallResponse("OK");
    }
	function EventLogin() {
        top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
    }

    function EventLogout() {
        top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
    }
})();