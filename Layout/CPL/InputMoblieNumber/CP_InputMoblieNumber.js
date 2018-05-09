/*@create by:  grb
*@time: 2016年10月07日
*/
; (function () {
    var InputID = document.getElementById("InputNum-input");
    var Inputdata = "";
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        //@initialize scope start
        ButtonDisable();
        document.getElementById("InputPwd-error").innerHTML = "";
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        App.Plugin.Keyboard.show("9", "PageSubject", "KeyboardDiv9");
        KeyboardClick();
        InputID.focus();
        ButtonEnable();
        App.Plugin.Voices.play("voi_44");
    }();//Page Entry

    //@User ocde scope start
    //重新输入密码
    function Reinput() {
        Inputdata = "";
        document.getElementById("InputNum-input").innerText = Inputdata;
        ButtonEnable();
    }

    function ButtonDisable() {
        document.getElementById('Exit').disabled = true;
        document.getElementById('OK').disabled = true;
		document.getElementById('Back').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Exit').disabled = false;
        document.getElementById('OK').disabled = false;
		document.getElementById('Back').disabled = false;
    }

    document.getElementById('Exit').onclick = function () {
        ButtonDisable();
        top.ErrorInfo = top.API.PromptList.No2;
        return CallResponse('Exit');
    }
	
	document.getElementById('Back').onclick = function () {
        ButtonDisable();
        return CallResponse('Back');
    }

    document.getElementById('OK').onclick = function () {
        ButtonDisable();
		if(Inputdata == "" || Inputdata.length != 11 || Inputdata.substring(0, 1) != "1" ){
			document.getElementById("InputPwd-error").innerHTML = "手机号码输入有误,请重新输入";
			document.getElementById('InputPwd-error').style.display = "block";
			Reinput();
		}else{
            top.API.displayMessage("手机号码：" + Inputdata);  //将手机号码记录到jslog
            top.API.phoneNum = Inputdata;
            var arrPhoneNum = new Array(Inputdata);
            top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, arrPhoneNum);
			top.API.Jnl.PrintSync("PhoneNum");//将手机号码记录到JNL	

            // 取款卡钞复位标志位
            top.API.resetFlag = top.API.depErrFlag ? true : false;

            switch(top.API.CashInfo.Dealtype){
                case 'InLineFlag':
                    return CallResponse('InLineFlag');
                    break;
                case 'OutLineFlag':
                    return CallResponse('OutLineFlag');
                    break;
                case '无卡无折存款':
                    if( !top.API.gbAmountType ){ // 大额存款
                        return CallResponse('LARGEAMOUNT');
                    }else{
                        return CallResponse('OK');
                    }
                    break;
                case 'CancelAccount':
                    if( top.API.gTransactiontype == "WXACCDELETE" ){
                        return CallResponse('CancelAccountByWX');
                    }else{
                        return CallResponse('OK');
                    }
                    break;
                default:
                    return CallResponse('OK');
                    break;
            }
			// return CallResponse('OK');			
		}
    }
    function KeyboardClick() {
        document.getElementById("InputPwd-error").innerHTML = "";
        var arrKeyboardKey = document.getElementsByName("Name_Keyboard");
        for (var i = 0; i < arrKeyboardKey.length; i++) {
            var keyEvent = arrKeyboardKey[i];
            keyEvent.onclick = function (e) {
                InputID.focus();
                App.InputEdit.getCurPosition(InputID);
                if ('退格' == this.innerText) {					
					App.InputEdit.getInput(InputID , 1 ,"BS");
                    Inputdata = InputID.value;	
                } else if ('清除' == this.innerText) {					
					InputID.value = "";
                    Inputdata = "";													
                } else {					
                    if (Inputdata.length < 11) {
                        App.InputEdit.getInput(InputID , 0 , this.innerText);
					    Inputdata = InputID.value;
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
