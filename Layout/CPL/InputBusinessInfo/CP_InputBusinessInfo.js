/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {
    var InputID = document.getElementById("AccountInput");
    var CardNoValue = "";
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        //@initialize scope start
        ButtonDisable();
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        App.Plugin.Keyboard.show("9", "PageSubject", "KeyboardDiv9");
        KeyboardClick();
        InputID.focus();
		App.Plugin.Voices.play("voi_38");
        ButtonEnable();
    } (); //Page Entry

    //@User ocde scope start
    function ButtonDisable() {
        document.getElementById('Exit').disabled = true;
        document.getElementById('OK').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Exit').disabled = false;
        document.getElementById('OK').disabled = false;
    }

    document.getElementById('Exit').onclick = function () {
        ButtonDisable();
        top.ErrorInfo = top.API.PromptList.No2;
        return CallResponse('Exit');
    }

    document.getElementById('OK').onclick = function () {
        ButtonDisable();
        var tmpCardNoValue = CardNoValue;
		while(tmpCardNoValue.indexOf(" ") != -1)
		{
			tmpCardNoValue = tmpCardNoValue.replace(" ","");
		}
		if(tmpCardNoValue.length > 0){
            if( tmpCardNoValue.length == 17 && tmpCardNoValue.substr(0,2) == "41" ){
                // if (tmpCardNoValue.substr(0,2) != "41"){
                //     tmpCardNoValue = "41"+tmpCardNoValue;
                // }
                top.API.gCardno = tmpCardNoValue;           
                top.API.gTransactiontype = "QRYBUSSINESSACCOUNT";
                var arrCardNo = new Array(top.API.gCardno);
                top.API.Dat.SetDataSync(top.API.cardnoTag, top.API.cardnoType, arrCardNo);
                top.API.Jnl.PrintSync("BusinessAccountAction");
                return CallResponse('OK');
            }else{
                ButtonEnable();
                document.getElementById('ErrLittleTip').style.display = "block";
                document.getElementById('ErrLittleTip').innerHTML = "本机只支持本地存折，请输入完整17位账户";
            }
			
		}else{
			ButtonEnable();
            document.getElementById('ErrLittleTip').style.display = "block";
			document.getElementById('ErrLittleTip').innerHTML = "输入账号不能为空";
		}
		
    }
    function KeyboardClick() {
        var arrKeyboardKey = document.getElementsByName("Name_Keyboard");
        for (var i = 0; i < arrKeyboardKey.length; i++) {
            var keyEvent = arrKeyboardKey[i];
            keyEvent.onclick = function (e) {
                InputID.focus();
				document.getElementById('ErrLittleTip').style.display = "none";
                App.InputEdit.getCurPosition(InputID);
                if ('退格' == this.innerText) {
                    App.InputEdit.getInput(InputID, 1, "BS");
                    CardNoValue = InputID.value;
                    if (CardNoValue.length == 5 || CardNoValue.length == 10 || CardNoValue.length == 15 || CardNoValue.length == 20) {
                        App.InputEdit.getInput(InputID, 1, "BS");
                        CardNoValue = InputID.value;
                    }
                } else if ('清除' == this.innerText) {
                    InputID.value = "";
                    CardNoValue = "";
                } else {
                    if (CardNoValue.length < 24) {
                        if (CardNoValue.length == 4 || CardNoValue.length == 9 || CardNoValue.length == 14 || CardNoValue.length == 19) {
                            App.InputEdit.getInput(InputID, 0, " ");
                            CardNoValue = InputID.value;
                        }
                        App.InputEdit.getInput(InputID, 0, this.innerText);
                        CardNoValue = InputID.value;
                    }
                }
            }
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
        //TO DO:
        App.Plugin.Voices.del();
        App.Timer.ClearTime();
    }
})();
