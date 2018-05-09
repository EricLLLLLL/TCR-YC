;(function () {
    var Files = new dynamicLoadFiles(),
        strPicPath = top.API.Dat.GetBaseDir()+ top.API.gFaceCheckPic,
        //strPicPath2 = top.API.Dat.GetBaseDir()+"/FacePhoto2/tfc2.jpg",
        CallResponse = App.Cntl.ProcessOnce(function (Response) {
            //TO DO:
            Clearup();
            //Entry the flows control process.
            App.Cntl.ProcessDriven(Response);
        }),
        Initialize = function () {
            EventLogin();
            ButtonDisable();
            ButtonEnable();
            App.Timer.TimeoutDisposal(TimeoutCallBack);
            $('#verifacePhotoLocal').attr('src', top.API.Dat.GetBaseDir()+top.API.gCheckIdCardpic+ "?r=" + Math.random());
            $('#verifacePhotoTake').attr('src', strPicPath+ "?r=" + Math.random());
            Files.showNetworkMsg("正在进行人脸识别，请稍后····");
            //App.Plugin.Voices.play("voi_55");
            //todo 添加身份证图片路径
            top.API.Tfc.PhotoMatch(strPicPath, top.API.Dat.GetBaseDir()+top.API.gCheckIdCardpic, -1);
        }();//Page Entry
    function ButtonDisable() {
        top.API.displayMessage("ButtonDisable");
        document.getElementById('OK').disabled = true;
        document.getElementById('PageRoot').disabled = true;
    }

    function ButtonEnable() {
        top.API.displayMessage("ButtonEnable");
        document.getElementById('OK').disabled = false;
        document.getElementById('PageRoot').disabled = false;
    }
    document.getElementById('OK').onclick = function () {
        top.API.displayMessage("点击<确认>");
        ButtonDisable();
        return CallResponse('OK');
    };
        document.getElementById('PageRoot').onclick = function() {
        ButtonDisable();
        return CallResponse('BackHomepage');
    };

    function OnPhotoMatchCompleted() {
        top.API.displayMessage("OnPhotoMatchCompleted");
        top.API.gFaceCheckOK = true;
        return CallResponse('OK');
    }

    function OnPhotoMatchFailed() {
        top.API.displayMessage("OnPhotoMatchFailed");
        Files.ErrorMsg("人脸识别失败！");
        top.API.gFaceCheckOK = false;
        setTimeout(function(){return CallResponse("FaceCheckFail");},4000);
    }
    //@User code scope end

    function  OnTfcDeviceError(){
        top.API.displayMessage("OnTfcDeviceError");
        Files.ErrorMsg("人脸识别失败！");
        top.API.gFaceCheckOK = false;
        setTimeout(function(){return CallResponse("FaceCheckFail");},4000);
    }

    //Register the event
    function EventLogin() {
        top.API.Tfc.addEvent("PhotoMatchCompleted", OnPhotoMatchCompleted);
        top.API.Tfc.addEvent("PhotoMatchFailed", OnPhotoMatchFailed);
        top.API.Tfc.addEvent("DeviceError", OnTfcDeviceError);
    }

    function EventLogout() {
        top.API.Tfc.removeEvent("PhotoMatchCompleted", OnPhotoMatchCompleted);
        top.API.Tfc.removeEvent("PhotoMatchFailed", OnPhotoMatchFailed);
        top.API.Tfc.removeEvent("DeviceError", OnTfcDeviceError);
    }

       //Countdown function
    function TimeoutCallBack() {
        
        return CallResponse('TimeOut');
     }
      //remove all event handler
    function Clearup(){
      //TO DO:
    EventLogout();
      App.Timer.ClearTime();
    }
})();
