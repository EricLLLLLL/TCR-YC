/*@create by:  tsxiong
*
*/
; (function () {
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        ButtonDisable();
		EventLogin();
        var PtrPaperStatus = top.API.Ptr.StPaperStatus();
        if (PtrPaperStatus != "FULL" && PtrPaperStatus != "LOW") { 
            document.getElementById('NoPtrTip').style.display = "block";
			top.API.gNoPtrSerFlag=true;
        }else{
			document.getElementById('NoPtrTip').style.display = "none";
			top.API.gNoPtrSerFlag=false;
		}
        ButtonEnable();
    }();//Page Entry
    function ButtonDisable() {
        document.getElementById('Exchange').disabled = true;
        document.getElementById('AddNote').disabled = true;
        document.getElementById('NoteRemainQuery').disabled = true;
        document.getElementById('StatisticsData').disabled = true;
		document.getElementById('OpenShutter').disabled = true;
        document.getElementById('CloseShutter').disabled = true;
		document.getElementById('Exit').disabled = true;
		document.getElementById('ATMPMODE').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Exchange').disabled = false;
        document.getElementById('AddNote').disabled = false;
        document.getElementById('NoteRemainQuery').disabled = false;
        document.getElementById('StatisticsData').disabled = false;
		document.getElementById('OpenShutter').disabled = false;
        document.getElementById('CloseShutter').disabled = false;
        document.getElementById('Exit').disabled = false;
        document.getElementById('ATMPMODE').disabled = false;
    }

    document.getElementById('Exchange').onclick = function () {
        ButtonDisable();
        if (top.API.gMACKEY) {
           top.API.Tsl.HandleRecordFileSync(top.API.MTSL_READTRANSRECORD, "");
           return CallResponse('Exchange');
        } else {
            return CallResponse('NeedDownload');
        }
    }

    document.getElementById('AddNote').onclick = function () {
        ButtonDisable();
        top.API.Dat.GetPersistentData("TOTALADDOK", "LONG");
    }

    document.getElementById('NoteRemainQuery').onclick = function () {
        ButtonDisable();
        return CallResponse('NoteRemainQuery');
    }

    document.getElementById('Exit').onclick = function () {
        ButtonDisable();
        return CallResponse('Exit');
    }

    document.getElementById('StatisticsData').onclick = function () {
        ButtonDisable();
		top.API.Tsl.HandleRecordFileSync(top.API.MTSL_READTRANSRECORD, "");
        return CallResponse('Statistics');
    }
	
	document.getElementById('OpenShutter').onclick = function () {
        ButtonDisable();
		top.API.Cdm.OpenShutter(top.API.gCloseShutterTimeOut);		
    }
	
	document.getElementById('CloseShutter').onclick = function () {
        ButtonDisable();
		top.API.Cdm.CloseShutter(top.API.gCloseShutterTimeOut);		
    }

	document.getElementById('ATMPMODE').onclick = function () {
	    ButtonDisable();
	    return CallResponse('ATMPMODE');
	}

    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        var arrDataValue = DataValue;
        if ('TOTALADDOK' == DataName) {
            if (arrDataValue[0] == 0) {
                return CallResponse('AddNote');
            } else {
                return CallResponse('CantAddNote');
            }
        }
    }

    function onDatGetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatGetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        return CallResponse('CantAddNote');
    }
	
	function onDeviceError() {
		top.API.displayMessage("onDeviceError触发");
		ButtonEnable();
    }
	function onShutterOpened(){
		top.API.displayMessage("onShutterOpened触发,提示客户拿走钞票");
		ButtonEnable();
	}	
	function onShutterClosed(){
		top.API.displayMessage("onShutterClosed触发");
		ButtonEnable();
	}
	function onShutterOpenFailed(){
		top.API.displayMessage("onShutterOpenFailed触发");
		ButtonEnable();
	}	
	function onShutterCloseFailed(){
		top.API.displayMessage("onShutterCloseFailed触发");
		ButtonEnable();
	}
    function EventLogin() {
        top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
		//Door
		top.API.Cdm.addEvent('ShutterOpened', onShutterOpened);
		top.API.Cdm.addEvent('ShutterOpenFailed', onShutterOpenFailed);
		top.API.Cdm.addEvent('ShutterClosed', onShutterClosed);
		top.API.Cdm.addEvent('ShutterCloseFailed', onShutterCloseFailed);
		top.API.Cdm.addEvent('DeviceError', onDeviceError);
    }

    function EventLogout() {
        top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
		//Door
		top.API.Cdm.removeEvent('ShutterOpened', onShutterOpened);
		top.API.Cdm.removeEvent('ShutterOpenFailed', onShutterOpenFailed);
		top.API.Cdm.removeEvent('ShutterClosed', onShutterClosed);
		top.API.Cdm.removeEvent('ShutterCloseFailed', onShutterCloseFailed);
		top.API.Cdm.removeEvent('DeviceError', onDeviceError);
    }

    //Page Return

    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
    }
})();
