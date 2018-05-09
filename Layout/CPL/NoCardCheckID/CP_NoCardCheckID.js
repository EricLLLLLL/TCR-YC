/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {
    var DeviceErrTimes = 0;
    var ReadIdCardFlag;
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        top.API.Siu.SetScannerLight('OFF');
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        EventLogin();
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        ButtonDisable();
		top.API.Idr.AcceptAndRead(-1);        
        top.API.Siu.SetScannerLight('QUICK');
        ButtonEnable();
        App.Plugin.Voices.play("voi_5");
    }();//Page Entry

    //@User ocde scope start
    function ButtonDisable() {
        document.getElementById('Exit').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Exit').disabled = false;
    }

    document.getElementById('Exit').onclick = function () {
        ButtonDisable();
        top.API.Idr.CancelAccept();
        top.ErrorInfo = top.API.PromptList.No2;
        return CallResponse('Exit');
    }

    
    function onCardInserted() {
        //alert("onCardInserted");
    }
    //event handler
    function onCardAccepted(info) {
        ButtonDisable();
        var arrIDNO = new Array();
        arrIDNO = info.split(",");
        if (arrIDNO[0] == "") {
            DeviceErrTimes++;
            if (DeviceErrTimes == 10) {
                top.ErrorInfo = top.API.PromptList.No7;
                return CallResponse('Exit');
            } else {
                document.getElementById('err-tip').innerText = "读取身份证信息失败，请重新感应！";
                ButtonEnable();
            }
        } else {
			var sDate = top.GetDate12byte().substring(0, 8);
			if(parseInt(sDate) - parseInt(arrIDNO[3]) < 160000){
				document.getElementById('err-tip').innerText = "年龄未满16周岁，请更换其他证件！";
                ButtonEnable();
			}else if(parseInt(arrIDNO[8]) < parseInt(sDate)){
				document.getElementById('err-tip').innerText = "该身份证已过期，请更换其他证件！";
                ButtonEnable();
			}else{
				top.API.gIdName = arrIDNO[0];
				top.API.gIdNumber = arrIDNO[4];
				document.getElementById('err-tip').innerText = "正在联网核查，请稍候！";
				top.API.Dat.GetPersistentData("IDCHECKURL", "STRING");    
			}
            
        }
    }

    function onCardTaken() {
		document.getElementById('err-tip').innerText ="";
		document.getElementById('AgentErrTip').style.display="none";
		top.API.Idr.AcceptAndRead(-1);
    }
    function onTimeout() {
        top.API.displayMessage("onTimeout");
    }
    function onDeviceError() {
        top.API.displayMessage("onDeviceError");
        if (top.API.Idr.StDetailedDeviceStatus() != "ONLINE") {
            top.ErrorInfo = top.API.PromptList.No7;
        } else {
            DeviceErrTimes++;
            if (DeviceErrTimes == 10) {
                top.ErrorInfo = "读取二代证信息失败，交易结束";
                return CallResponse('Exit');
            } else {
                document.getElementById('err-tip').innerText = "读取身份证信息失败，请重新感应！";
            }
        }

    }

    function onCardAcceptFailed() {
        top.API.displayMessage("onCardAcceptFailed");
        if (top.API.Idr.StDetailedDeviceStatus() != "ONLINE") {
            top.ErrorInfo = top.API.PromptList.No7;
        } else {
            DeviceErrTimes++;
            if (DeviceErrTimes == 10) {
                top.ErrorInfo = "读取二代证信息失败，交易结束";
                return CallResponse('Exit');
            } else {
                document.getElementById('err-tip').innerText = "读取身份证信息失败，请重新感应！";
            }
        }

    }

    function onCardInvalid() {
        top.API.displayMessage("onCardInvalid");
        DeviceErrTimes++;
        if (DeviceErrTimes == 10) {
            top.ErrorInfo = "读取二代证信息失败，交易结束";
            return CallResponse('Exit');
        } else {
            document.getElementById('err-tip').innerText = "读取身份证信息失败，请重新感应！";
        }
    }

	    /********************************************************************************************************/    
    //永久数据模块
    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        var arrDataValue = DataValue;
        if ('IDCHECKURL' == DataName) {
            URL = arrDataValue[0];
            if (URL == "") {
                top.ErrorInfo = "联网核查异常！";
                return CallResponse('Exit');
            }else{
				var strParam = top.API.gIdName + "," + top.API.gIdNumber + "," + "" + "," + URL;
				if(!top.CheckInfo(strParam)){
					top.API.displayMessage("联网核查失败！");
					top.ErrorInfo = "联网核查失败！";
					return CallResponse('Exit');
				}else{
					top.API.displayMessage("联网核查成功！");					
					return CallResponse('OK');
				}                
            }            
        }   
    }

    function onDatGetPersistentDataError(DataName, ErrorCode) {
        top.ErrorInfo = "联网核查异常！";
                return CallResponse('Exit');
    }
    //Register the event
    function EventLogin() {
        top.API.Idr.addEvent('CardInserted', onCardInserted);
        top.API.Idr.addEvent('CardAccepted', onCardAccepted);
        top.API.Idr.addEvent('CardAcceptFailed', onCardAcceptFailed);
        top.API.Idr.addEvent('CardTaken', onCardTaken);
        top.API.Idr.addEvent("DeviceError", onDeviceError);
        top.API.Idr.addEvent('Timeout', onTimeout);
        top.API.Idr.addEvent('CardInvalid', onCardInvalid);
		top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
    }

    function EventLogout() {
        top.API.Idr.removeEvent('CardInserted', onCardInserted);
        top.API.Idr.removeEvent('CardAccepted', onCardAccepted);
        top.API.Idr.removeEvent('CardAcceptFailed', onCardAcceptFailed);
        top.API.Idr.removeEvent('CardTaken', onCardTaken);
        top.API.Idr.removeEvent('Timeout', onTimeout);
        top.API.Idr.removeEvent("DeviceError", onDeviceError);
        top.API.Idr.removeEvent("CardInvalid", onCardInvalid);
		top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
    }

    //Countdown function
    function TimeoutCallBack() {
        top.API.Idr.CancelAccept();
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
