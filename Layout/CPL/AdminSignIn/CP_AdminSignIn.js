/*@create by:  tsxiong
 *@time: 2016年03月20日
 */
; (function () {
    var bSPL1 = false;
    var bCheckMoney = false,
        strCallResponse = "",
        Files = new dynamicLoadFiles(),
        nLastAcceptedAmount = -1,
        bError = false,
        tellersInfo = "",
        nIndex = 0,
        nIndexMax = 0,
        AdminInfo,        
        CallResponse = App.Cntl.ProcessOnce(function (Response) {
            //TO DO:
            Clearup();
            App.Cntl.ProcessDriven(Response);
        });

    var Initialize = function () {
        EventLogin();
        top.ErrorInfo = "";
        if (top.API.Fpi.StDetailedDeviceStatus() != "ONLINE") {
            return CallResponse('OnLine');
        } else {
            top.API.displayMessage("SIGNINFLAG=0，未签到，开始获取已经录入指纹账号列表");
            top.API.Dat.GetPersistentData("ADMININFO", "STRING"); //获取柜员号 00 01 02 8800            
        }
       
    }();//Page Entry

    document.getElementById("Skip").onclick = function () {
        document.getElementById('Skip').disabled = true;
	    top.API.Fpi.CancelIdentify();
        return CallResponse("OnLine");
    };

    function ChangebSPL1() {
        //TO DO:
        bSPL1 = false
    }
    document.getElementById("SPL1").onclick = function () {
        bSPL1 = true;
        var t = window.setTimeout(ChangebSPL1, 5000);
    }
    document.getElementById("SPL2").onclick = function () {
        if (bSPL1) {
            bSPL1 = false;
            top.API.Jnl.PrintSync("AdminOpenSpl");
            top.API.Dat.SetDataSync("OPERATESTATE", "STRING", ["0"]);//供暂停服务状态轮询使用
            top.API.displayMessage("OPERATESTATE = 0");
            top.API.Sys.OpenManagePage();
            top.API.Fpi.CancelIdentify();
            return CallResponse('OffLine');
        };
    }

    /********************************************************************************************************/
    //FPI模块
    function onFpiIdentifyComplete(data) {
        top.API.displayMessage("onFpiIdentifyComplete is done， Start DataMatch, data = " + data);
        Files.showNetworkMsg("指纹处理中,请稍候...");
        top.API.displayMessage("tellersInfo[" + nIndex + "] = " + tellersInfo[nIndex]);
        var bFingerOk = true;
        for (var i = 0; i < AdminInfo.length; i++) {
            if (AdminInfo[i].user == tellersInfo[nIndex]) {
                if (AdminInfo[i].usertype == "2") { // 业务主管不能签到,0为技术管理员 00;1为业务主管;2为业务管理员
                    bFingerOk = false;
                    top.API.Fpi.DataMatch(-1, tellersInfo[nIndex]);
                } else {
                    nIndex++;
                    i = 0;
                }
            }
        }
        if (bFingerOk) {
            Files.ErrorMsg('暂未录入业务管理员指纹，请先录入指纹！');
            setTimeout(function () {
                return CallResponse("OnLine");
            }, 6000);
        }
    }

    function onFpiTimeout() {
        top.API.displayMessage("onFpiTimeout is done");
        return CallResponse('Exit');
    }

    function onFpiDeviceError() {
        top.API.displayMessage("onFpiDeviceError is done");
        return CallResponse('Exit');
    }

    function onFpiIdentifyFailed() {
        top.API.displayMessage("onFpiIdentifyFailed is done");
        top.ErrorInfo = "指纹采集失败，请重新采集指纹";
        return CallResponse('Exit');
    }

    function onFpiMatchComplete() {
        top.API.displayMessage("onFpiMatchComplete is done, 设置AdminSignFlag为1");
        top.API.Dat.WritePrivateProfileSync("AdminSign", "AdminSignNum", tellersInfo[nIndex], top.API.Dat.GetBaseDir() + top.API.gIniFileName);    
        top.API.Dat.WritePrivateProfileSync("AdminSign", "AdminSignFlag", "1", top.API.Dat.GetBaseDir() + top.API.gIniFileName);
        return CallResponse('OnLine');
    }

    function onFpiMatchFailed() {
        top.API.displayMessage("onFpiMatchFailed is done");
        if (nIndex < nIndexMax - 1) {
            nIndex++;
            top.API.displayMessage("tellersInfo[" + nIndex + "] = " + tellersInfo[nIndex]);
            var bFingerOk = true;
            for (var i = 0; i < AdminInfo.length; i++) {
                if (AdminInfo[i].user == tellersInfo[nIndex]) {
                    if (AdminInfo[i].usertype == "2") { // 业务主管不能签到
                        bFingerOk = false;
                        top.API.Fpi.DataMatch(-1, tellersInfo[nIndex]);
                    } else {
                        nIndex++;
                        i = 0;
                    }
                } 
            }

            if (bFingerOk) {
                top.ErrorInfo = "指纹匹配失败，请检查是否已经录入指纹";
                return CallResponse('Exit');
            }

        } else {
            top.ErrorInfo = "指纹匹配失败，请检查是否已经录入指纹";
            return CallResponse('Exit');
        }             
    }

    /********************************************************************************************************/
    //永久数据模块
    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        var arrDataValue = DataValue;
        if ("MFPIIDLIST" == DataName) {
            var arrFpiValue = DataValue + "";
            top.API.displayMessage("柜员号指纹列表=" + arrFpiValue);
            nIndexMax = arrDataValue.length;
            top.API.displayMessage("当前录入指纹柜员个数为：" + (nIndexMax + 1));
            if (nIndexMax < 1) {
                top.ErrorInfo = "还未录入管机员指纹，请录入指纹";
                return CallResponse('Exit');
            } else {
                tellersInfo = DataValue;
                top.API.Fpi.Identify(-1); // 读取指纹特征数据,(-1)无限时等待                                 
            }
        }
        if ("ADMININFO" == DataName) {
            var arrDataValue = DataValue;
            top.API.displayMessage("onDatGetPersistentDataComplete is done,DataName=" + DataName + ",DataType=" + DataType + ",DataValue=" + arrDataValue);
            var sAdminInfoObjStr = arrDataValue.toString();
            top.API.displayMessage("top.API.AdminInfoObjStr =" + sAdminInfoObjStr);
            var AdminObj = eval('(' + sAdminInfoObjStr + ')');
            AdminInfo = AdminObj.AdminInfo;
            top.API.Dat.GetPersistentData("MFPIIDLIST", "STRING");  //获取柜员号
        }
                
    }

    function onDatGetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("DatGetPersistentDataError" + DataName + ",ErrorCode=" + ErrorCode);
    }

    function onDatSetPersistentDataComplete(DataName) {
        top.API.displayMessage("SIGNINFLAG 设置为 1, 开启对外");
        return CallResponse('OnLine');
    }

    function onDatSetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatSetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
    }

    //Register the event
    function EventLogin() {
        top.API.Fpi.addEvent('IdentifyComplete', onFpiIdentifyComplete);
        top.API.Fpi.addEvent('Timeout', onFpiTimeout);
        top.API.Fpi.addEvent('DeviceError', onFpiDeviceError);
        top.API.Fpi.addEvent('IdentifyFailed', onFpiIdentifyFailed);
        top.API.Fpi.addEvent('MatchComplete', onFpiMatchComplete);
        top.API.Fpi.addEvent('MatchFailed', onFpiMatchFailed);

        top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.addEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.addEvent("SetPersistentDataError", onDatSetPersistentDataError);
    }

    function EventLogout() {
        top.API.Fpi.removeEvent('IdentifyComplete', onFpiIdentifyComplete);
        top.API.Fpi.removeEvent('Timeout', onFpiTimeout);
        top.API.Fpi.removeEvent('DeviceError', onFpiDeviceError);
        top.API.Fpi.removeEvent('IdentifyFailed', onFpiIdentifyFailed);
        top.API.Fpi.removeEvent('MatchComplete', onFpiMatchComplete);
        top.API.Fpi.removeEvent('MatchFailed', onFpiMatchFailed);

        top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.removeEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.removeEvent("SetPersistentDataError", onDatSetPersistentDataError)
    }

    //Countdown function
    //Page Return
    function TimeoutCallBack() {
        top.ErrorInfo = top.API.PromptList.No3;
        top.API.Fpi.CancelIdentify();
        return CallResponse('TimeOut');
    }

    //remove all event handler
    function Clearup() {
        //TO DO:        
        EventLogout();
    }
})();
