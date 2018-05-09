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
        CallResponse = App.Cntl.ProcessOnce(function (Response) {
            //TO DO:
            top.ErrorInfo = "";
            App.Cntl.ProcessDriven(Response);
        });

    var Initialize = function () {
        if (top.ErrorInfo != "") {
            $('#messageReason').text(top.ErrorInfo);
        }
    }();//Page Entry

    document.getElementById('Back').onclick = function () {
        top.API.displayMessage("点击<Back>");
        document.getElementById('Back').disabled = true;
        return CallResponse('Exit');
    }

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
            return CallResponse('OffLine');
        };
    }
    //Register the event

    //Countdown function
    //Page Return

    //remove all event handler
    function Clearup() {
        //TO DO:
    }
})();
