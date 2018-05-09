; (function(){
     var ImagePath;
     var Ret;
     var OpenFlg = false;
	 var CallResponse = App.Cntl.ProcessOnce( function(Response){
        Clearup();
        App.Cntl.ProcessDriven( Response );
    });
     var Initialize = function() {
         App.Timer.TimeoutDisposal(TimeoutCallBack);
         App.Plugin.Voices.play("voi_9");
         ButtonDisable();
         Ret = top.API.Vid.OpenCamera(356, 187, 317, 213, 0, 640, 480);
         top.API.displayMessage("OpenCamera:Ret" + Ret);
         if (Ret != 0) {
            top.ErrorInfo = "摄像头打开失败，交易结束！";
            return CallResponse('Exit');
         }else{
            OpenFlg = true;
         }
         ButtonEnable();
     }();

    document.getElementById('TakePhoto').onclick = function () {
        /*if (OpenFlg == false) {
            Ret = top.API.Vid.OpenCamera(290, 201, 315, 214, 0, 640, 480);
        }*/
        top.API.displayMessage("点击拍照按钮");
        document.getElementById("ReTakePhoto").style.display = "block";
        document.getElementById("TakePhoto").style.display = "none";
        document.getElementById("OK").style.display = "block";
        document.getElementById("TakePhoto").disabled = true;
        document.getElementById("ReTakePhoto").disabled = false;
        document.getElementById("OK").disabled = false;

        if (OpenFlg) {
            top.API.Vid.TakePhoto('D:/Image', 1);
            top.API.gPHOTOIMAGURL = top.API.Vid.GetImagePathSync();
            top.API.displayMessage("ImagePath:" + top.API.gPHOTOIMAGURL);
            document.getElementById('TakePic').src = top.API.gPHOTOIMAGURL + "?v=" + new Date().getTime();
            top.API.Vid.CloseCamera();
            OpenFlg = false;
        }else {///打开摄像头失败
            ButtonDisable();
            top.ErrorInfo = "摄像头打开失败，交易结束！";
            return CallResponse('Exit');
        }
    }

    document.getElementById('ReTakePhoto').onclick = function () {
        document.getElementById("ReTakePhoto").style.display = "none";
        document.getElementById("TakePhoto").style.display = "block";
        document.getElementById("OK").style.display = "none";
        document.getElementById("TakePhoto").disabled = false;
        document.getElementById("ReTakePhoto").disabled = true;
        document.getElementById("OK").disabled = true;
         
         Ret = top.API.Vid.OpenCamera(355, 186, 317, 217, 0, 640, 480);
         top.API.displayMessage("OpenCamera:Ret" + Ret);
         if (Ret != 0) {
            top.ErrorInfo = "摄像头打开失败，交易结束！";
            return CallResponse('Exit');
         }else{
            OpenFlg = true;
         }

        
    }
    
    function ButtonDisable(){
        top.API.displayMessage("ButtonDisable");
        document.getElementById('Exit').disabled = true;
        document.getElementById('OK').disabled = true;
        document.getElementById('TakePhoto').disabled = true;
        document.getElementById('ReTakePhoto').disabled = true;
        document.getElementById('Back').disabled = true;
    }
    function ButtonEnable() {
        top.API.displayMessage("ButtonEnable");
        document.getElementById('Exit').disabled = false;
        document.getElementById('Back').disabled = false;
        document.getElementById('TakePhoto').disabled = false;
        document.getElementById('ReTakePhoto').disabled = false;
        document.getElementById('OK').disabled = false;
    }

    document.getElementById('Exit').onclick = function(){
         ButtonDisable();
         return CallResponse('Exit');
    }

    document.getElementById('OK').onclick = function(){
         ButtonDisable();
         return CallResponse('OK');
    }

    document.getElementById('Back').onclick = function(){
        ButtonDisable();
        return CallResponse('Back');
    }

    function TimeoutCallBack() {
        ButtonDisable();
        top.API.displayMessage("摄像头超时<TimeOut>");
        top.API.gERRORMSG = "操作超时,交易结束！";
        return CallResponse('TimeOut');
     }
    
    
    function Clearup(){
        top.API.Vid.CloseCamera();
        App.Plugin.Voices.del();
      	App.Timer.ClearTime();
    }
})();
