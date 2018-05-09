/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {
	var sFingerData=""; //add by art
    var nReCompare = 0;
    var bIdentify = false;
    var RefuseReason = "身份信息不符";
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        ButtonDisable();
        // EventLogin();
        //@initialize scope start
        //ShowInfo();
        //return CallResponse('OK');
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        // top.API.Fpi.Identify(-1);
        // bIdentify = true;
        ButtonEnable();
        // App.Plugin.Voices.play("voi_13");
    }();//Page Entry

    document.getElementById('DealTime').onclick = function () {
        document.getElementById('DealTime').style.backgroundImage = "url('Framework/style/Graphics/btn/radio_select.png')";
        document.getElementById('CardNum').style.backgroundImage = "url('Framework/style/Graphics/btn/redio_noselct.png')";
        document.getElementById('JnlNum').style.backgroundImage = "url('Framework/style/Graphics/btn/redio_noselct.png')";
        RefuseReason = "身份信息不符";
    }
    document.getElementById('CardNum').onclick = function () {
        document.getElementById('DealTime').style.backgroundImage = "url('Framework/style/Graphics/btn/redio_noselct.png')";
        document.getElementById('CardNum').style.backgroundImage = "url('Framework/style/Graphics/btn/radio_select.png')";
        document.getElementById('JnlNum').style.backgroundImage = "url('Framework/style/Graphics/btn/redio_noselct.png')";
        RefuseReason = "交易金额不符";
    }
    document.getElementById('JnlNum').onclick = function () {
        document.getElementById('DealTime').style.backgroundImage = "url('Framework/style/Graphics/btn/redio_noselct.png')";
        document.getElementById('CardNum').style.backgroundImage = "url('Framework/style/Graphics/btn/redio_noselct.png')";
        document.getElementById('JnlNum').style.backgroundImage = "url('Framework/style/Graphics/btn/radio_select.png')";
        RefuseReason = "指纹授权失败";
    }

    //@User ocde scope start
    function ButtonDisable() {
        top.API.displayMessage("ButtonDisable");
        document.getElementById('Left_3').disabled = true;
        document.getElementById('Right_3').disabled = true;
    }

    function ButtonEnable() {
        top.API.displayMessage("ButtonEnable");
        document.getElementById('Left_3').disabled = false;
        document.getElementById('Right_3').disabled = false;
    }

    document.getElementById('Left_3').onclick = function () {
        top.API.displayMessage("点击<退出>");
        ButtonDisable();
        return CallResponse('TimeOut');
    }
    document.getElementById('Right_3').onclick = function () {
        top.API.displayMessage("点击<确认>"); //tmp by art
        ButtonDisable();
        top.API.gAuthorRefuse = RefuseReason;
        if (top.API.Ptr.bDeviceStatus && top.API.gNoPtrSerFlag==false) {
            return CallResponse('Exit');
        } else {
            return CallResponse('TimeOut');
        }
    }


    //Countdown function
    function TimeoutCallBack() {
        return CallResponse('TimeOut');
    }
    //Page Return
    
    //remove all event handler
    function Clearup() {
        //TO DO:
        App.Timer.ClearTime();
    }
})();
