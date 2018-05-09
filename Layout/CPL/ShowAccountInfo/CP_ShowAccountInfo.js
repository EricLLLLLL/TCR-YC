
/*@create by:  tsxiong
*@time: 2016年03月20日
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
        document.getElementById('showNumberInfo').innerText = top.API.gCardno;
		var strName = '';
        strName += '*';
        strName += top.API.gCustomerName.substr(1, (top.API.gCustomerName.length - 1));
		document.getElementById('showAccountInfo').innerText =  top.API.gCustomerName;
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
        return CallResponse('Exit');
        //return CallResponse('Back');
    };

    document.getElementById('PageRoot').onclick = function () {
        ButtonDisable();       
        return CallResponse('BackHomepage');
    };

    document.getElementById('OK').onclick = function () {
        ButtonDisable();
		top.API.gTransactiontype = "QRYCUSTNAME";
        if((top.API.gTranType == 'largeDep'|| top.API.gTranType == 'largeTran')&&top.API.gbContinueTransFlag){
            return CallResponse("NotFirstTrade");
        }else{
        return CallResponse("OK");
        }
        //return CallResponse('OK');
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
