;
(function() {
    var DeviceErrTimes = 0;
    var Files = new dynamicLoadFiles();
    var continueReadCard = false;
    var CallResponse = App.Cntl.ProcessOnce(function(Response) {
        //TO DO:
        top.API.Siu.SetScannerLight('OFF');
        Clearup();
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function() {
        EventLogin();
        if (top.API.Idr.StDetailedDeviceStatus() != "ONLINE"){
            Files.ErrorMsg("身份证模块故障！");
            setTimeout(function () {
                return CallResponse("Exit");
            }, 4000);
        }
        //@initialize scope start
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        ButtonDisable();
        top.API.Idr.AcceptAndRead(-1);
        top.API.Siu.SetScannerLight('QUICK');
        ButtonEnable();
        App.Plugin.Voices.play("voi_5");
    }(); //Page Entry

    //@User ocde scope start
    function ButtonDisable() {
        document.getElementById('PageRoot').disabled = true;
        // document.getElementById('OK').disabled = true;
        // document.getElementById('Back').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('PageRoot').disabled = false;
        // document.getElementById('OK').disabled = false;
        // document.getElementById('Back').disabled = false;
    }

    // document.getElementById('Exit').onclick = function() {
    //     ButtonDisable();
    //     top.ErrorInfo = top.API.PromptList.No2;
    //     return CallResponse('Exit');
    // }

    document.getElementById('PageRoot').onclick = function() {
        ButtonDisable();
        top.API.Idr.CancelAccept();
        return CallResponse('BackHomepage');
    }

    // document.getElementById('OK').onclick = function() {
    //     top.API.Idr.AcceptAndRead(-1);
    //     document.getElementById("OK").style.display = "none";
    // }
    // //@User code scope end 

    //event handler
    function onCardInserted() {
        top.API.displayMessage("onCardInserted");
        Files.showNetworkMsg("证件信息读取中,请稍候...");
        //document.getElementById('err-tip').innerText = "";
        //document.getElementById('AgentErrTip').style.display = "none";
        //alert("onCardInserted");
    }

    //event handler
    function onCardAccepted(info) {
        top.API.displayMessage("onCardAccepted");
        /*info=
         info[0]xxx
         ,info[1]男
         ,info[2]汉族
         ,info[3]19930929
         ,info[4]450xxxxxxxxxxxxxxx
         ,info[5]广东深圳
         ,info[6]公安局分局
         ,info[7]20130820
         ,info[8]20230820
         ,info[9]D:\DATA\HeadImage.bmp
         ,info[10]D:\DATA\FrontImage.jpg
         ,info[11]D:\DATA\BackImage.jpg*/
      //  ButtonDisable();
        top.API.displayMessage("info:"+info);
        top.API.gstrIdCardInfo = info;
        var arrIDNO = new Array();
        arrIDNO = info.split(",");
        top.API.gIdCardpic = arrIDNO[9];
        top.API.gIdName = arrIDNO[0].toString().replace(/\s+/g, "");
        top.API.gIdNation = arrIDNO[2];
        top.API.gIdSex = arrIDNO[1];
        top.API.gIdBirthday = arrIDNO[3];
        top.API.gIdNumber = arrIDNO[4];
        top.API.gIdFrontImage = arrIDNO[10];
        top.API.gIdBackImage = arrIDNO[11];
        top.API.gIdAddress = arrIDNO[5];
        top.API.gIdEndtime = arrIDNO[8];
        top.API.gIdDepartment = arrIDNO[6];
        top.API.gIdStarttime = arrIDNO[7];

        top.API.displayMessage(" top.API.gIdEndtime:"+ top.API.gIdEndtime);

        if (arrIDNO[0] == "") {
            DeviceErrTimes++;
            if (DeviceErrTimes == 10) {
                Files.ErrorMsg("读取身份证信息失败次数超限，交易结束！");
                continueReadCard = true;
                top.API.Idr.Eject(60000);
                setTimeout(function () {
                    return CallResponse("Exit");
                }, 4000);
            } else {
                Files.ErrorMsg("读取身份证信息失败，重新插卡！");
                continueReadCard = true;
                top.API.Idr.Eject(60000);
                top.API.Siu.SetScannerLight('QUICK');
            }
        } else {
            var sDate = top.GetDate12byte().substring(0, 8);
            if (parseInt(sDate) - parseInt(arrIDNO[3]) < 160000) {
                Files.ErrorMsg("年龄未满16周岁，请更换其他证件！");
                continueReadCard = true;
                top.API.Idr.Eject(60000);
                top.API.Siu.SetScannerLight('QUICK');
            } else if (parseInt(arrIDNO[8]) < parseInt(sDate)) {
                Files.ErrorMsg("该身份证已过期，请更换其他证件！");
                continueReadCard = true;
                top.API.Idr.Eject(60000);
                top.API.Siu.SetScannerLight('QUICK');
            } else {
                return CallResponse("OK");
                        // var IsSameName = top.API.Dat.GetPrivateProfileSync("AssConfig", "IsSameName", "0", top.API.gIniFileName);
                        // if (IsSameName == "0") {
                        //     top.API.gIdNumberForRisk = top.API.gIdNumber;
                        //     top.API.gIdName = top.API.gCustomerName;

                        //     App.Plugin.Voices.play("voi_50");
                        //     App.Timer.SetPageTimeout(7);
                        //     setTimeout(function(){
                        //         return CallResponse("OK");
                        //     },5000);

                        // } else {
                        //     Files.ErrorMsg("读取身份证信息失败，交易结束！");
                        //     return CallResponse('Exit');
                        // }
                    }
                }
        }

    function onCardTaken() {
        if (continueReadCard) {
            top.API.Idr.AcceptAndRead(-1);
            continueReadCard = false;
        }
    }

    function onTimeout() {
        top.API.displayMessage("onTimeout");
    }

    function onDeviceError() {
        if (top.API.Idr.StDetailedDeviceStatus() != "ONLINE") {
            top.ErrorInfo = top.API.PromptList.No7;
        } else {
            DeviceErrTimes++;
            if (DeviceErrTimes == 10) {
                Files.ErrorMsg("读取身份证信息失败次数超限，交易结束！");
                continueReadCard = true;
                top.API.Idr.Eject(60000);
                setTimeout(function () {
                    return CallResponse("Exit");
                }, 4000);
            } else {
                Files.ErrorMsg("读取身份证信息失败，重新插卡！");
                continueReadCard = true;
                top.API.Idr.Eject(60000);
                top.API.Siu.SetScannerLight('QUICK');
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
                Files.ErrorMsg("读取身份证信息失败次数超限，交易结束！");
                continueReadCard = true;
                top.API.Idr.Eject(60000);
                setTimeout(function () {
                    return CallResponse("Exit");
                }, 4000);
            } else {
                Files.ErrorMsg("读取身份证信息失败，重新插卡！");
                continueReadCard = true;
                top.API.Idr.Eject(60000);
                top.API.Siu.SetScannerLight('QUICK');
            }
        }

    }

    function onCardInvalid() {
        DeviceErrTimes++;
            if (DeviceErrTimes == 10) {
                Files.ErrorMsg("读取身份证信息失败次数超限，交易结束！");
                setTimeout(function () {
                    return CallResponse("Exit");
                }, 4000);
            } else {
                Files.ErrorMsg("读取身份证信息失败，重新插卡！");
                ///top.API.Idr.AcceptAndRead(-1);
                continueReadCard = true;
                top.API.Idr.Eject(60000);
                top.API.Siu.SetScannerLight('QUICK');
            }
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
    }

    function EventLogout() {
        top.API.Idr.removeEvent('CardInserted', onCardInserted);
        top.API.Idr.removeEvent('CardAccepted', onCardAccepted);
        top.API.Idr.removeEvent('CardAcceptFailed', onCardAcceptFailed);
        top.API.Idr.removeEvent('CardTaken', onCardTaken);
        top.API.Idr.removeEvent('Timeout', onTimeout);
        top.API.Idr.removeEvent("DeviceError", onDeviceError);
        top.API.Idr.removeEvent("CardInvalid", onCardInvalid);
    }

    //Countdown function
    function TimeoutCallBack() {
        top.ErrorInfo = top.API.PromptList.No3;
        top.API.Idr.CancelAccept();
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