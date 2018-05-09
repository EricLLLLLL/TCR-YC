/*@create by:  LeoLei
 *@time: 2018年04月9日
 */
; (function () {
    var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        ButtonDisable();
        document.getElementById('showNumberInfo').innerText = top.API.PayeeAccount;
        var strName = '';
        // strName += '*';
        // strName += top.API.gCustomerName.substr(1, (top.API.gCustomerName.length - 1));
        document.getElementById('showAccountInfo').innerText =  top.API.gTFRCustomerName;

        var arrCardNo = new Array(top.API.PayeeAccount);
        // top.API.Dat.SetDataSync("TFRCARDNO", top.API.cardnoType, arrCardNo);
        top.API.Dat.SetDataSync("TFRCARDNO", top.API.cardnoType, arrCardNo);
        App.Plugin.Voices.play("voi_43");
        ButtonEnable();
    } (); //Page Entry

    //@User ocde scope start
    function ButtonDisable() {
        document.getElementById('Exit').disabled = true;
        document.getElementById('OK').disabled = true;
        document.getElementById('PageRoot').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Exit').disabled = false;
        document.getElementById('OK').disabled = false;
        document.getElementById('PageRoot').disabled = false;
    }

    document.getElementById('Exit').onclick = function () {
        ButtonDisable();
        return CallResponse('NotSure');
        //return CallResponse('Back');
    };

    document.getElementById('PageRoot').onclick = function () {
        ButtonDisable();
        return CallResponse('BackHomepage');
    };

    document.getElementById('OK').onclick = function () {
        ButtonDisable();
       // top.API.gTransactiontype = "QRYCUSTNAME";
        return CallResponse('OK');
    };

    //Countdown function
    function TimeoutCallBack() {
        top.ErrorInfo = top.API.PromptList.No3;
        return CallResponse('TimeOut');
    }
    //Page Return

    //remove all event handler
    function Clearup() {
        App.Plugin.Voices.del();
        App.Timer.ClearTime();
    }
})();
