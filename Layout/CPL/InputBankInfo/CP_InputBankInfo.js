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
    var InputID = document.getElementById("AccountInput");
    var CardNoValue = "";
    var Initialize = function () {
        //@initialize scope start
        ButtonDisable();
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        App.Plugin.Keyboard.show("9", "PageSubject", "KeyboardDiv9");
        KeyboardClick();
        InputID.focus();
		//App.Plugin.Voices.play("voi_45");
        ButtonEnable();
    }();//Page Entry

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

			//add by tsx 应用根据位数判断存折还是卡号。卡号走大额存款，存折走ATM存款
            if( tmpCardNoValue.length == 16 || tmpCardNoValue.length == 19 || (tmpCardNoValue.length == 17 && tmpCardNoValue.substr(0,2) == "41") ){  // add by Gni 限制用户输入19位卡号或者17位切头两位是41的本地存折号
            
                top.API.gTransactiontype = "QRYCWDMONEY"; // 存折存款查询累计金额
                top.API.gCardOrBookBank = 2;
                top.API.CWDType = "passbook"; // 无折存款

                if (tmpCardNoValue.length == 19) {
                    top.API.gCardOrBookBank = 1;
                    top.API.CWDType = "card"; // 无卡存款
                    top.API.gTransactiontype = "QRYCUSTNAME"; // 查户名
                }
                if (tmpCardNoValue.substr(0,2) == "41"){
                    tmpCardNoValue = tmpCardNoValue.substr(2,tmpCardNoValue.length-2);
                }
                top.API.gCardno = tmpCardNoValue;           
                var arrCardNo = new Array(top.API.gCardno);
                top.API.Dat.SetDataSync(top.API.cardnoTag, top.API.cardnoType, arrCardNo);
                top.API.Jnl.PrintSync("AccountAction");
                return CallResponse('OK');

            }else{
                ButtonEnable();
                document.getElementById('TipError').style.display = "block";
                document.getElementById('TipError').innerHTML = "请输入正确的银行卡号，或17位本地存折号";
            }

		}else{
			ButtonEnable();
			document.getElementById('TipError').style.display = "block";
            document.getElementById('TipError').innerHTML = "输入账号不能为空";
		}
    }
    function KeyboardClick() {
        var arrKeyboardKey = document.getElementsByName("Name_Keyboard");
        for (var i = 0; i < arrKeyboardKey.length; i++) {
            var keyEvent = arrKeyboardKey[i];
            keyEvent.onclick = function (e) {
				document.getElementById('TipError').style.display = "none";
                InputID.focus();
                App.InputEdit.getCurPosition(InputID);
                if ('退格' == this.innerText) {
					App.InputEdit.getInput(InputID , 1 ,"BS");
                    CardNoValue = InputID.value;	
					if(CardNoValue.length == 5 || CardNoValue.length == 10 || CardNoValue.length == 15 || CardNoValue.length == 20)
					{						
						App.InputEdit.getInput(InputID , 1 ,"BS");
						CardNoValue = InputID.value;
					}
                } else if ('清除' == this.innerText) {					
					InputID.value = "";
                    CardNoValue = "";													
                } else {					
                    if (CardNoValue.length < 24) {
						if(CardNoValue.length == 4 || CardNoValue.length == 9 || CardNoValue.length == 14 || CardNoValue.length == 19)
						{							
							App.InputEdit.getInput(InputID , 0 ," ");
							CardNoValue = InputID.value;
						}
                        App.InputEdit.getInput(InputID , 0 , this.innerText);
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
        //App.Plugin.Voices.del();
        App.Timer.ClearTime();
    }
})();
