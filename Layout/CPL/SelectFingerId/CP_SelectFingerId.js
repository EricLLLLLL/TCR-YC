
/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {
    var AdminObj;
    var TelInfo;
    var myselect = document.getElementById("cusId");
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        EventLogin();
        //@initialize scope start
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        ButtonDisable();
        var nRet1 = top.API.Dat.GetPersistentData("TELLERNO", "STRING");  //获取柜员号
        top.API.displayMessage("柜员号：GetPersistentData TELLERNO Return:" + nRet1);  //获取柜员号是否成功
        ButtonEnable();
    } (); //Page Entry

    //@User ocde scope start
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

    function ShowOpt(){
        var opt = "";
        for (var i = 0; i < TelInfo.length; i++) {
            opt = opt + "<option value='"+TelInfo[i].telno+"'>"+TelInfo[i].telno+"</option>";
        }
        myselect.innerHTML = opt;
    }

    document.getElementById('Exit').onclick = function () {
        ButtonDisable();
        return CallResponse('Exit');
    }

    document.getElementById('OK').onclick = function () {
        ButtonDisable();
        var Index = myselect.selectedIndex;
		top.API.RemoteID = myselect.options[Index].text;
        return CallResponse('OK');
    }
    //@User code scope end 

    //event handler
    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        var arrDataValue = DataValue.toArray();
        top.API.displayMessage("onDatGetPersistentDataComplete is done,DataName=" + DataName + ",DataType=" + DataType + ",DataValue=" + arrDataValue);
        //top.API.TelInfoObjStr = arrDataValue.toString();
       // top.API.displayMessage("top.API.TelInfoObjStr =" + top.API.TelInfoObjStr);
        AdminObj = eval('(' + arrDataValue.toString() + ')');
        TelInfo = AdminObj.TelInfo;
		if(TelInfo.length == 0){
			top.ErrorInfo = "无审核人员授权";
			//return CallResponse('Exit');
		}
        ShowOpt();
    }

    function onDatGetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatSetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        top.ErrorInfo = "无审核人员授权";
        return CallResponse('Exit');
    }
    //Register the event
    function EventLogin() {
        top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
    }

    function EventLogout() {
        top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
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
        App.Timer.ClearTime();
    }
})();
