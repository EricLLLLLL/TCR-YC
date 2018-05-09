;(function () {
    var bCdmReset = false,//是否做了cdmReset操作
        bResetSuccess = false,//是否复位成功
        setIntervalId = null,
        bResetFailGoOn,
        CallResponse = App.Cntl.ProcessOnce(function (Response) {
            //TO DO:
            top.API.Sys.ItemClearSync(top.API.MTRN_TRANSACTIONDIFFER);
            Clearup();
            //Entry the flows control process.
            App.Cntl.ProcessDriven(Response);
        }),
        Initialize = function () {
            EventLogin();
            if (top.API.partCwcTip) {
                $('#partCwcTip').text('部分上账成功,上账金额：' + top.API.CashInfo.strTransAmount + '.00元');
            } else {
                $('#partCwcTip').text('部分上账失败');
            }
            resetFn(); // 复位
            bResetFailGoOn = top.API.Dat.GetPrivateProfileSync("TransactionConfig", "bResetFailGoOn", "0", top.API.gIniFileName);
            App.Timer.TimeoutDisposal(TimeoutCallBack);
        }();//Page Entry

    //@User ocde scope start
    document.getElementById('Exit').onclick = function () {
        top.API.displayMessage("点击Exit。");
        return CallResponse('Exit');
    }

    document.getElementById('OK').onclick = function () {
        top.API.depErrFlag = true; // 取款卡钞
        return CallResponse('Exit');
    }

    function resetFn(){
        if( top.API.resetFlag ){
            top.API.displayMessage("点击OK，开始Reset。");
            bCdmReset = false;
            App.Plugin.Wait.show();
            top.API.Cdm.Reset("RETRACT", 0, top.API.gResetTimeout);
            $('#OK').css('display', 'none');   
        }
        top.API.gTakeCardAndPrint = true; //不管成功与否都打印凭条
    }

    function onResetStatus() {
        top.API.displayMessage("onResetStatus");
        if (bCdmReset) {
            //clearTimeout(timeoutId);
            //bCimReset = false;
            bCdmReset = false;
            App.Plugin.Wait.disappear();
            if (bResetSuccess && top.API.Cdm.StOutputStatus() == "NOTEMPTY") {
                top.API.displayMessage("StOutputStatus --- NOTEMPTY");
                $("#Exit").css('display', 'block');
                top.API.Cdm.OpenShutter(top.API.gOpenShutterTimeOut);
            } else {
                top.API.displayMessage("复位失败，请联系银行处理");
                $('#warning').css('display', 'block');
                $('#warning').text('复位失败，请联系银行处理');
                App.Timer.SetPageTimeout(8);
                //return CallResponse('OK');
            }
        }
    }

    //door
    function onShutterOpened() {
        $('#warning').css('display', 'block');
        $('#warning').text('请注意清点返还的金额，如有疑问请立即与银行联系！');
        App.Timer.SetPageTimeout(60);
        setIntervalId = setInterval(function () {
            App.Plugin.Voices.play("voi_7");
        }, 8000);
        top.API.displayMessage("onShutterOpened触发");
    }

    function onShutterOpenFailed() {
        top.API.displayMessage("onShutterOpenFailed触发");
        //showInfo();
        $('#warning').css('display', 'block');
        $('#warning').text('复位失败，请联系银行处理');
        App.Timer.SetPageTimeout(8);
        //return CallResponse('OK');
    }

    function onCashTaken() {
        clearInterval(setIntervalId);
        top.API.Cdm.CloseShutter(top.API.gCloseShutterTimeOut);
    }

    function onShutterClosed() {
        top.API.displayMessage("onShutterClosed触发");
    }

    function onShutterCloseFailed() {
        top.API.displayMessage("onShutterCloseFailed触发");
    }

    //复位事件开始
    // function onCimResetComplete() {
    //     bResetSuccess = true;
    //     top.API.displayMessage("onCimResetComplete is done");
    //     bCimReset = true;
    //     onResetStatus();
    // }
    //
    // function onCimResetFailed() {
    //     top.API.displayMessage("onCimResetFailed is done");
    //     if(bResetFailGoOn == '1'){
    //         bResetSuccess = true;
    //     }
    //     bCimReset = true;
    //     onResetStatus();
    // }

    function onCdmResetComplete() {
        bResetSuccess = true;
        top.API.displayMessage("onCdmResetComplete is done");
        bCdmReset = true;
        onResetStatus();
    }

    function onCdmResetFailed() {
        top.API.displayMessage("onCdmResetFailed is done");
        if (bResetFailGoOn == '1') {
            bResetSuccess = true;
        } else if (bResetFailGoOn = '2') {
            bResetSuccess = false;
        }
        bCdmReset = true;
        onResetStatus();
    }

    // function onCimDeviceError() {
    //     top.API.displayMessage("onCimDeviceError is done");
    //     bCdmReset = true;
    //     onResetStatus();
    // }

    function onCdmDeviceError() {
        top.API.displayMessage("onCdmDeviceError is done");
        bCdmReset = true;
        onResetStatus();
    }

    function EventLogin() {
        //top.API.Cim.addEvent("ResetComplete", onCimResetComplete);
        //top.API.Cim.addEvent("ResetFailed", onCimResetFailed);
        top.API.Cdm.addEvent("ResetComplete", onCdmResetComplete);
        top.API.Cdm.addEvent("ResetFailed", onCdmResetFailed);
        //top.API.Cdm.addEvent("StatusChanged", onCdmStatusChanged);
        //top.API.Cim.addEvent("DeviceError", onCimDeviceError);
        top.API.Cdm.addEvent("DeviceError", onCdmDeviceError);

        //door
        top.API.Cdm.addEvent('ShutterOpened', onShutterOpened);
        top.API.Cdm.addEvent('ShutterOpenFailed', onShutterOpenFailed);
        top.API.Cdm.addEvent('ShutterClosed', onShutterClosed);
        top.API.Cdm.addEvent('ShutterCloseFailed', onShutterCloseFailed);

        //保险柜门
        //top.API.Cim.addEvent("SafeDoorClosed", onSafeDoorClosed);
        //top.API.Cim.addEvent("SafeDoorOpened", onSafeDoorOpened);

        top.API.Cdm.addEvent('CashTaken', onCashTaken);
    }

    function EventLogout() {

        //top.API.Cim.removeEvent("ResetComplete", onCimResetComplete);
        //top.API.Cim.removeEvent("ResetFailed", onCimResetFailed);
        top.API.Cdm.removeEvent("ResetComplete", onCdmResetComplete);
        top.API.Cdm.removeEvent("ResetFailed", onCdmResetFailed);
        //top.API.Cdm.removeEvent("StatusChanged", onCdmStatusChanged);
        //top.API.Cim.removeEvent("DeviceError", onCimDeviceError);
        top.API.Cdm.removeEvent("DeviceError", onCdmDeviceError);

        //door
        top.API.Cdm.removeEvent('ShutterOpened', onShutterOpened);
        top.API.Cdm.removeEvent('ShutterOpenFailed', onShutterOpenFailed);
        top.API.Cdm.removeEvent('ShutterClosed', onShutterClosed);
        top.API.Cdm.removeEvent('ShutterCloseFailed', onShutterCloseFailed);

        //保险柜门
        //top.API.Cim.removeEvent("SafeDoorClosed", onSafeDoorClosed);
        //top.API.Cim.removeEvent("SafeDoorOpened", onSafeDoorOpened);

        top.API.Cdm.removeEvent('CashTaken', onCashTaken);
    }

    //Countdown function
    function TimeoutCallBack() {
        return CallResponse('TimeOut');
    }

    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
        App.Timer.ClearTime();
    }
})();
