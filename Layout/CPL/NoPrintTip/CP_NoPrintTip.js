/*@create by:  liaolei
 *@time: 2016年03月20日
 */
; (function () {
    var CallResponse = App.Cntl.ProcessOnce( function(Response){
        Clearup();
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        if( top.API.CashInfo.Dealtype == "CancelAccount" ){
            $("#OK").hide();
            $("#SubjectTip").find("p").html("无凭条纸，暂不能进行销户交易！");
        }
    }(); //Page Entry
    function ButtonDisable() {
        document.getElementById('Exit').disabled = true;
        document.getElementById('OK').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Exit').disabled = false;
        document.getElementById('OK').disabled = false;
    }


    document.getElementById("Exit").onclick = function(){
        ButtonDisable();
        top.ErrorInfo = top.API.PromptList.No2;
        return CallResponse("Exit");
    }

    document.getElementById("OK").onclick = function(){
        ButtonDisable();
        top.API.gNoPtrSerFlag = true;
        if (top.API.CashInfo.Dealtype == "无卡无折存款") {
            return CallResponse("NoCardDep");
        } else if (top.API.CashInfo.Dealtype == "存折业务") {
            return CallResponse("BookBank");
        } else if (top.API.CashInfo.Dealtype == "对公存款") {
            return CallResponse("BusinessDep");
        } else if (top.API.CashInfo.Dealtype == "零钞兑换") {
            return CallResponse("Exchange");
        } else if (top.API.CashInfo.Dealtype == "大额交易") {
            return CallResponse("BigTrader");
        } else if(top.API.gbContinueTransFlag === true) {//判断插卡交易过程中的继续交易			
            return CallResponse("CHIPCARDcontinue");
        }else{
            return CallResponse("OK");
        }
    }


    //Countdown function
    function TimeoutCallBack() {
        top.ErrorInfo = top.API.PromptList.No3;
        return CallResponse("TimeOut");
    }
    //Page Return

    //remove all event handler
    function Clearup() {
        App.Timer.ClearTime();
    }
})();