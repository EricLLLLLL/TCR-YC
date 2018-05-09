;(function () {
    var tellersInfo = "",
        nIndex = 0,
        nIndexMax = 0,
        Files = new dynamicLoadFiles(),
        AdminSignNum = "",
        bIdentify = false,
        CallResponse = App.Cntl.ProcessOnce(function (Response) {
            //TO DO:
            Clearup();
            //Entry the flows control process.
            App.Cntl.ProcessDriven(Response);
        }),
        Initialize = function () {
            EventLogin();
            ButtonDisable();
            if (top.API.Fpi.StDetailedDeviceStatus() != "ONLINE"){
                Files.ErrorMsg("指纹仪故障，请联系管理员!");
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
            }
            showInfo();
            App.Timer.TimeoutDisposal(TimeoutCallBack);
            //top.API.Dat.GetPersistentData("MFPIIDLIST", "STRING");  //获取柜员号
            top.API.Fpi.Identify(-1);
            nIndex = 0;
            bIdentify = true;// 读取指纹特征数据,(-1)无限时等待
            AdminSignNum = top.API.Dat.GetPrivateProfileSync("AdminSign", "AdminSignNum", "", top.API.Dat.GetBaseDir() + top.API.gIniFileName);
            ButtonEnable();
        }();//Page Entry

    function showInfo() {

        top.API.displayMessage(" top.API.gIdEndtime:" + top.API.gIdEndtime);
        $("#customerName").text(top.API.gIdName);
        // $("#authIDType").text("身份证");
        $("#customerGender").text(top.API.gIdSex);
        $("#customerNumber").text(top.API.gIdNumber);
        $("#customerValidDate").text(top.API.gIdEndtime);
        $("#authResult").text("客户身份证号码与姓名一致，且有客户照片");
        $("#customerPhotoLocal").attr("src", top.API.gIdCardpic + "?r=" + Math.random());
        $("#customerPhotoInternet").attr("src", top.API.Dat.GetBaseDir() + top.API.gCheckIdCardpic + "?r=" + Math.random());
        $("#customerPhotoMiddle").attr("src", top.API.Dat.GetBaseDir() + top.API.gFaceCheckPic + "?r=" + Math.random());
        $("#customerIDcardPhotoFront").attr("src", top.API.gIdFrontImage + "?r=" + Math.random());
        $("#customerIDcardPhotoReverse").attr("src", top.API.gIdBackImage + "?r=" + Math.random());
    }

    function onFpiIdentifyComplete(data) {
        top.API.displayMessage("onFpiIdentifyComplete is done， Start DataMatch, data = " + data);
        // top.API.displayMessage("tellersInfo[" + nIndex + "] = " + tellersInfo[nIndex]);
        // top.API.Fpi.DataMatch(-1, tellersInfo[nIndex]);
        // top.API.gEmpno = AdminSignNum.trim();
        top.API.Fpi.DataMatch(-1, AdminSignNum.trim());
        bIdentify = false;
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
        Files.ErrorMsg("授权失败，请重新授权！");
        top.API.Fpi.Identify(-1);
    }

    function onFpiMatchComplete() {
        top.API.displayMessage("onFpiMatchComplete is done, 人脸识别授权完成");
        return CallResponse('OK');
    }

    function onFpiMatchFailed() {
        top.API.displayMessage("onFpiMatchFailed is done");
        // if (nIndex < nIndexMax - 1) {
        //     nIndex++;
        //     top.API.displayMessage("tellersInfo[" + nIndex + "] = " + tellersInfo[nIndex]);
        //     top.API.Fpi.DataMatch(-1, tellersInfo[nIndex]);
        // } else {
        //     Files.ErrorMsg("授权失败，请重新授权！");
        //     top.API.Fpi.Identify(-1);
        //     nIndex = 0;
        //     bIdentify = true;// 读取指纹特征数据,(-1)无限时等待
        // }
        Files.ErrorMsg("授权失败，请重新授权！");
        top.API.Fpi.Identify(-1);
        nIndex = 0;
        bIdentify = true;
    }

    /********************************************************************************************************/
    //永久数据模块
    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        var arrDataValue = DataValue;
        if ("MFPIIDLIST" == DataName) {
            var arrFpiValue = DataValue + "";
            top.API.displayMessage("柜员号指纹列表=" + arrDataValue.length);
            var AdminSignNum = top.API.Dat.GetPrivateProfileSync("AdminSign", "AdminSignNum", "", top.API.Dat.GetBaseDir() + top.API.gIniFileName);
            var x;
            for (x in arrDataValue) {
                if (arrDataValue[x].trim() == AdminSignNum.trim()) {
                    arrDataValue.splice(x, 1);
                }
            }
            nIndexMax = arrDataValue.length;
            top.API.displayMessage("未签到柜员个数为：" + nIndexMax + 1);
            if (nIndexMax < 1) {
                Files.ErrorMsg("还未录入管机员指纹，请录入指纹");
                setTimeout(function () {
                    return CallResponse("Exit");
                }, 4000);
            } else {
                tellersInfo = DataValue;
                top.API.Fpi.Identify(-1);
                nIndex = 0;
                bIdentify = true;// 读取指纹特征数据,(-1)无限时等待
            }
        }
    }

    function onDatGetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("DatGetPersistentDataError" + DataName + ",ErrorCode=" + ErrorCode);
    }


    function ButtonDisable() {
        top.API.displayMessage("ButtonDisable");
        document.getElementById('Refuse').disabled = true;
        document.getElementById('PageRoot').disabled = true;
    }

    function ButtonEnable() {
        top.API.displayMessage("ButtonEnable");
        // document.getElementById('Exit').disabled = false;
        document.getElementById('Refuse').disabled = false;
        document.getElementById('PageRoot').disabled = false;
    }

    document.getElementById('Refuse').onclick = function () {
        top.API.displayMessage("点击<退出>");
        ButtonDisable();
        if (bIdentify) {
            top.API.Fpi.CancelIdentify();
        }
        return CallResponse('Exit');
    };

    document.getElementById('PageRoot').onclick = function () {
        ButtonDisable();
        if (bIdentify) {
            top.API.Fpi.CancelIdentify();
        }
        return CallResponse('BackHomepage');
    };

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
    }

    //Countdown function
    function TimeoutCallBack() {
        if (bIdentify) {
            top.API.Fpi.CancelIdentify();
        }
        return CallResponse('TimeOut');
    }

    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
        App.Timer.ClearTime();
    }
})();
