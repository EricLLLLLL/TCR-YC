;(function () {
    var Files = new dynamicLoadFiles(),
        //strPicPath = top.API.Dat.GetBaseDir() + "/FacePhoto/tfc.jpg",
        strPicPath = "",
        bTakePhotoSuccess = false,
        openCount = 0,//打开摄像头次数 超过三次为失败  下同
        takePhotoCount = 0,//照照片次数
        StrCallResponse = "",
        CallResponse = App.Cntl.ProcessOnce(function (Response) {
            //TO DO:
            Clearup();
            top.API.Tfc.OpenConnection();
            //Entry the flows control process.
            App.Cntl.ProcessDriven(Response);
        }),
        Initialize = function () {
            ButtonDisable();
            EventLogin();
            if (top.API.Tfc.StDetailedDeviceStatus() != "ONLINE") {
                Files.ErrorMsg("摄像头模块故障，请联系管理员!");
                setTimeout(function () {
                    return CallResponse("Exit");
                }, 4000);
            }
            //打开摄像头
            top.API.Tfc.OpenConnAndCamera(390, 295, 195, 355, -1);
            var gFaceCheckPic = top.API.Dat.GetPrivateProfileSync("IdentityAudit", "gFaceCheckPic", "", top.API.Dat.GetBaseDir() + top.API.gIniFileName);
            top.API.gFaceCheckPic = gFaceCheckPic.trim();
            strPicPath = top.API.Dat.GetBaseDir() + top.API.gFaceCheckPic;
            openCount++;
            ButtonEnable();
            App.Timer.TimeoutDisposal(TimeoutCallBack);
            $("#OK").hide();
        }();//Page Entry

    //@User ocde scope start
    function ButtonDisable() {
        top.API.displayMessage("ButtonDisable");
        document.getElementById('OK').disabled = true;
        document.getElementById('PageRoot').disabled = true;
        document.getElementById('Back').disabled = true;
        document.getElementById('Make').disabled = true;

    }

    function ButtonEnable() {
        top.API.displayMessage("ButtonEnable");
        document.getElementById('OK').disabled = false;
        document.getElementById('PageRoot').disabled = false;
        document.getElementById('Back').disabled = false;
        document.getElementById('Make').disabled = false;
    }

    document.getElementById('OK').onclick = function () {
        top.API.displayMessage("点击<确认>");
        $("#OK").hide();
        ButtonDisable();
        StrCallResponse = "OK";
        // top.API.displayMessage("bTakePhoto：" + bTakePhoto);
        if (takePhotoCount == 0) {
            top.API.Tfc.CloseCameraAndConn(-1);
            //top.API.Tfc.OpenConnection();
            //return CallResponse(StrCallResponse);
        } else {
            if (bTakePhotoSuccess) {
                top.API.Tfc.CloseCamera(-1);
            } else {
                top.API.Tfc.CancelTakePhoto();
            }
        }
        //ButtonEnable();
        //return CallResponse('OK');
    };
    document.getElementById('PageRoot').onclick = function () {
        ButtonDisable();
        StrCallResponse = "BackHomepage";
        if (takePhotoCount == 0) {
            top.API.Tfc.CloseCameraAndConn(-1);
            //top.API.Tfc.OpenConnection();
            //return CallResponse(StrCallResponse);
        } else {
            if (bTakePhotoSuccess) {
                top.API.Tfc.CloseCameraAndConn(-1);
                //top.API.Tfc.OpenConnection();
            } else {
                top.API.Tfc.CancelTakePhoto();
            }
        }
        //ButtonEnable();
        //return CallResponse('BackHomepage');
    };
    document.getElementById('Make').onclick = function () {
        ButtonDisable();
        top.API.displayMessage("点击<拍照>");
        // $('#verifacePhotoTake').attr('src', "Framework/style/Graphics/verifacePhotoFront.png");
        top.API.Tfc.TakePhoto(strPicPath, "", false, -1);
        //bTakePhoto = true;
        takePhotoCount++;
        $("#Make").hide();
        $("#OK").hide();
        App.Plugin.Voices.play("voi_54");
        ButtonEnable();
    };
    document.getElementById('Back').onclick = function () {
        ButtonDisable();
        StrCallResponse = "Back";
        if (takePhotoCount == 0) {
            top.API.Tfc.CloseCameraAndConn(-1);
            //top.API.Tfc.OpenConnection();
            //return CallResponse(StrCallResponse);
        } else {
            if (bTakePhotoSuccess) {
                top.API.Tfc.CloseCameraAndConn(-1);
                //top.API.Tfc.OpenConnection();
            } else {
                top.API.Tfc.CancelTakePhoto();
            }
        }
        //return CallResponse('Back');
        //ButtonEnable();
    };
    //@User code scope end

    function OnOpenConnAndCameraFailed() {
        top.API.displayMessage("OnOpenConnAndCameraFailed");
        top.API.displayMessage("openCount--------------" + openCount);
        if (openCount < 3) {
            top.API.Tfc.OpenConnAndCamera(390, 295, 195, 390, -1);
            openCount++;
        } else {
            Files.ErrorMsg("打开摄像头失败!");
            top.API.Tfc.CloseCamera(-1);
            setTimeout(function () {
                return CallResponse("Exit");
            }, 4000);
        }
    }

    function OnOpenConnAndCameraCompleted() {
        top.API.displayMessage("OnOpenConnAndCameraCompleted");
    }

    function OnCloseCameraAndConnFailed() {
        top.API.Tfc.OpenConnection();
        top.API.displayMessage("OnCloseCameraAndConnFailed");
    }

    function OnCloseCameraAndConnCompleted() {
        top.API.displayMessage("OnCloseCameraAndConnCompleted");
        top.API.Tfc.OpenConnection();
        top.API.displayMessage("StrCallResponse:" + StrCallResponse);
        return CallResponse(StrCallResponse);
    }

    function OnTakePhotoFailed() {
        top.API.displayMessage("OnTakePhotoFailed");
        //bTakePhoto = true;
        //top.API.displayMessage("bTakePhoto：" + bTakePhoto);
        top.API.displayMessage("takePhotoCount--------------" + takePhotoCount);
        if (takePhotoCount < 5) {
            top.API.Tfc.TakePhoto(strPicPath, "", false, -1);
            //bTakePhoto = true;
            takePhotoCount++;
        } else {
            Files.ErrorMsg("识别人脸失败!");
            setTimeout(function () {
                StrCallResponse = "Exit";
                // if (bTakePhoto) {
                top.API.Tfc.CloseCameraAndConn(-1);
                //top.API.Tfc.OpenConnection();
                // } else {
                //     top.API.Tfc.CancelTakePhoto();
                // }
                //return CallResponse("Exit");
            }, 4000);
        }
    }

    function OnTakePhotoCompleted() {
        top.API.displayMessage("OnTakePhotoCompleted");
        bTakePhotoSuccess = true;
        top.API.displayMessage("bTakePhotoSuccess：" + bTakePhotoSuccess);
        //停止播放语音
        $("#Make").show();
        ButtonEnable();
        $("#OK").show();
        //App.Plugin.Voices.del();
        $('#verifacePhotoTake').attr('src', strPicPath + "?r=" + Math.random());
    }

    function OnTakePhotoCancelled() {
        top.API.displayMessage("OnTakePhotoCancelled");
        top.API.Tfc.CloseCameraAndConn(-1);
        //top.API.Tfc.OpenConnection();
        App.Plugin.Voices.del();
    }

    function OnCloseCameraFailed() {
        top.API.displayMessage("OnCloseCameraFailed");
    }

    function OnCloseCameraCompleted() {
        top.API.displayMessage("OnCloseCameraCompleted");
        return CallResponse(StrCallResponse);
    }

    function OnConnectionOpened() {
        top.API.displayMessage("OpenConnection");
    }

    function OnOpenFailed() {
        top.API.displayMessage("OpenFailed");
    }

    //Register the event
    function EventLogin() {
        top.API.Tfc.addEvent("OpenConnAndCameraFailed", OnOpenConnAndCameraFailed);
        top.API.Tfc.addEvent("OpenConnAndCameraCompleted", OnOpenConnAndCameraCompleted);
        top.API.Tfc.addEvent("CloseCameraAndConnFailed", OnCloseCameraAndConnFailed);
        top.API.Tfc.addEvent("CloseCameraAndConnCompleted", OnCloseCameraAndConnCompleted);
        top.API.Tfc.addEvent("TakePhotoCompleted", OnTakePhotoCompleted);
        top.API.Tfc.addEvent("TakePhotoFailed", OnTakePhotoFailed);
        top.API.Tfc.addEvent("TakePhotoCancelled", OnTakePhotoCancelled);
        top.API.Tfc.addEvent("CloseCameraFailed", OnCloseCameraFailed);
        top.API.Tfc.addEvent("CloseCameraCompleted", OnCloseCameraCompleted);
        top.API.Tfc.addEvent("ConnectionOpened", OnConnectionOpened);
        top.API.Tfc.addEvent("OpenFailed", OnOpenFailed);
    }

    function EventLogout() {
        top.API.Tfc.removeEvent("OpenConnAndCameraFailed", OnOpenConnAndCameraFailed);
        top.API.Tfc.removeEvent("OpenConnAndCameraCompleted", OnOpenConnAndCameraCompleted);
        top.API.Tfc.removeEvent("CloseCameraAndConnFailed", OnCloseCameraAndConnFailed);
        top.API.Tfc.removeEvent("CloseCameraAndConnCompleted", OnCloseCameraAndConnCompleted);
        top.API.Tfc.removeEvent("TakePhotoCompleted", OnTakePhotoCompleted);
        top.API.Tfc.removeEvent("TakePhotoFailed", OnTakePhotoFailed);
        top.API.Tfc.removeEvent("TakePhotoCancelled", OnTakePhotoCancelled);
        top.API.Tfc.removeEvent("CloseCameraFailed", OnCloseCameraFailed);
        top.API.Tfc.removeEvent("CloseCameraCompleted", OnCloseCameraCompleted);
        top.API.Tfc.removeEvent("ConnectionOpened", OnConnectionOpened);
        top.API.Tfc.removeEvent("OpenFailed", OnOpenFailed);
    }

    //Countdown function
    function TimeoutCallBack() {
        StrCallResponse = "TimeOut";
        if (takePhotoCount == 0) {
            top.API.Tfc.CloseCameraAndConn(-1);
            //top.API.Tfc.OpenConnection();
            //return CallResponse(StrCallResponse);
        } else {
            if (bTakePhotoSuccess) {
                top.API.Tfc.CloseCameraAndConn(-1);
                // top.API.Tfc.OpenConnection();
            } else {
                top.API.Tfc.CancelTakePhoto();
            }
        }
        //return CallResponse('TimeOut');
    }

    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
        App.Timer.ClearTime();
    }
})();
