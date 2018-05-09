/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {
	var InputObj = "";//输入框对象
	var strInputName = "";//输入框名字
    var DateTimeInput = null;
    var DateTimeInputNum = 0;
	var strCardNum = "";
	var strJnlNum = "";
	var nSearchType = 1;
    var arrDateTime = new Array();
	//var top.API.Tsl = null;
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
	    ButtonDisable();
        DateTimeInput = document.getElementsByName("DateTimeInput");
        DateTimeInputClick(DateTimeInput);
        App.Plugin.Keyboard.show("2", "PageSubject", "KeyboardDiv");
        KeyboardClick();
        SetDefaultValue();
        ButtonEnable();
    }();//Page Entry
    function ButtonDisable() {
        document.getElementById('Exit').disabled = true;
    }
    function ButtonEnable() {
        document.getElementById('Exit').disabled = false;
    }

    //输入框点击事件
    function DateTimeInputClick(Element) {
        for (var j = 0; j < Element.length; j++) {
            (function () {
                var inpt = Element[j];
				var p = j;
                inpt.onclick = function () {					
                    DateTimeInputNum = p;
                    InputObj = ""; 
                    App.InputEdit.getCurPosition(inpt);     
                }
            })();
        }
     }
   //@User ocde scope start
    document.getElementById('DealTime').onclick = function () {
		nSearchType = 1;
		document.getElementById('DealTime').style.backgroundImage = "url('Framework/style/Graphics/btn/radio_select.png')";
        document.getElementById('CardNum').style.backgroundImage = "url('Framework/style/Graphics/btn/redio_noselct.png')";
		document.getElementById('JnlNum').style.backgroundImage = "url('Framework/style/Graphics/btn/redio_noselct.png')";
		document.getElementById('CardNumDiv').style.display = "none";
		document.getElementById('JnlNumDiv').style.display = "none";
        document.getElementById('Hour').style.display = "inline";
		document.getElementById('Min').style.display = "inline";
        SetDefaultValue();
		ClearTip();
    }
    document.getElementById('CardNum').onclick = function () {
		nSearchType = 2;
		document.getElementById('DealTime').style.backgroundImage = "url('Framework/style/Graphics/btn/redio_noselct.png')";
        document.getElementById('CardNum').style.backgroundImage = "url('Framework/style/Graphics/btn/radio_select.png')";
		document.getElementById('JnlNum').style.backgroundImage = "url('Framework/style/Graphics/btn/redio_noselct.png')";
        document.getElementById('JnlNumDiv').style.display = "none";
		document.getElementById('Hour').style.display = "none";
		document.getElementById('Min').style.display = "none";
        document.getElementById('CardNumDiv').style.display = "block";
        SetDefaultValue();
		ClearTip();
    }
    document.getElementById('JnlNum').onclick = function () {
		nSearchType = 3;
		document.getElementById('DealTime').style.backgroundImage = "url('Framework/style/Graphics/btn/redio_noselct.png')";
        document.getElementById('CardNum').style.backgroundImage = "url('Framework/style/Graphics/btn/redio_noselct.png')";
		document.getElementById('JnlNum').style.backgroundImage = "url('Framework/style/Graphics/btn/radio_select.png')";
        document.getElementById('CardNumDiv').style.display = "none";
		document.getElementById('Hour').style.display = "none";
		document.getElementById('Min').style.display = "none";
        document.getElementById('JnlNumDiv').style.display = "block";
        SetDefaultValue();
		ClearTip();
    }

    document.getElementById('Card_No').onclick = function () {
		strInputName = 'Card_No';
		InputObj = document.getElementById('Card_No');
		App.InputEdit.getCurPosition(InputObj);
    }
    document.getElementById('Jnl_No').onclick = function () {
        strInputName = 'Jnl_No';
		InputObj = document.getElementById('Jnl_No');
		App.InputEdit.getCurPosition(InputObj);
    }
    

    //@User ocde scope start
    document.getElementById('Exit').onclick = function () {
        ButtonDisable();
        return CallResponse('Exit');
    }
    //@User code scope end 
    function SetDefaultValue() {
       var tmpDate = top.GetDate12byte();
       var i = 0;
       var j = 0;
       for ( i = 0; i < DateTimeInput.length; i++) {
            if (i == 0) {
                arrDateTime[i] = tmpDate.substr(j,4);				
                DateTimeInput[i].value = arrDateTime[i];
                j = j+4;
            }else{
                arrDateTime[i] = tmpDate.substr(j,2);
                DateTimeInput[i].value = arrDateTime[i];
                j = j+2;
            }
        }
    }
	
    function ClearTip() {
        document.getElementById('DateTip').innerText = "";			
		document.getElementById('CardNumTip').innerText = "";								
		document.getElementById('JnlNumTip').innerText = "";	
    }
	
    function KeyboardClick() {
        var arrKeyboardKey = document.getElementsByName("Name_Keyboard");
        for (var i = 0; i < arrKeyboardKey.length; i++) {
            var keyEvent = arrKeyboardKey[i];
            keyEvent.onclick = function (e) {
                ClearTip();
                if ('退格' == this.innerText) {
					if (InputObj != "") {
						App.InputEdit.getInput(InputObj , 1 ,"BS");
                        if (strInputName == 'Card_No') {
                            strCardNum = InputObj.value;
                        }else if (strInputName == 'Jnl_No') {
                            strJnlNum = InputObj.value;
                        }		
					}else{
						App.InputEdit.getInput(DateTimeInput[DateTimeInputNum] , 1 ,"BS");
						arrDateTime[DateTimeInputNum] = DateTimeInput[DateTimeInputNum].value;
					}                     
                } else if ('清除' == this.innerText) {
					if (InputObj != "") {
						InputObj.value = "";
                        if (strInputName == "Jnl_No") {
                            strJnlNum = InputObj.value;
                        }else if(strInputName == "Card_No") {
                            strCardNum = InputObj.value;
                        }
					}else{
						DateTimeInput[DateTimeInputNum].value = "";
						arrDateTime[DateTimeInputNum] = DateTimeInput[DateTimeInputNum].value;						
					}					
                } else {
					if (InputObj != "") {
                        if (strInputName == "Jnl_No") {
							if (strJnlNum.length < 6) {
								App.InputEdit.getInput(InputObj , 0 , this.innerText);
								strJnlNum = InputObj.value;
							} 
                        }else if(strInputName == "Card_No") {
							if (strCardNum.length < 20) {
								App.InputEdit.getInput(InputObj , 0 , this.innerText);
								strCardNum = InputObj.value;
							}
                        }
					}else{
							var Maxlen = 2;
							if (DateTimeInputNum == 0) {
								Maxlen = 4;
							}                    
							if (arrDateTime[DateTimeInputNum].length < Maxlen) {
								App.InputEdit.getInput(DateTimeInput[DateTimeInputNum] , 0 , this.innerText);
								arrDateTime[DateTimeInputNum] = DateTimeInput[DateTimeInputNum].value;
							}                        
						}
					}
                }
            }
        }
   
	document.getElementById('KeyboardKey_set').onclick = function () {   
        var Year = "";
        var Month = "";
        var Day = "";
		var Hour = "";
		var Min = "";
        var tmp = "0000";
        Year = tmp.substr(0,(4-arrDateTime[0].length)) + arrDateTime[0];
        Month = tmp.substr(0,(2-arrDateTime[1].length)) + arrDateTime[1];
        Day = tmp.substr(0,(2-arrDateTime[2].length)) + arrDateTime[2];
		Hour = tmp.substr(0,(2-arrDateTime[3].length)) + arrDateTime[3];
		Min = tmp.substr(0,(2-arrDateTime[4].length)) + arrDateTime[4];
        var tmpdate = Year + "-" + Month + "-" + Day;
		var tmpdatetime = Year + "-" + Month + "-" + Day + "-" + Hour + "-" + Min;		
        if (top.CheckDateTime(tmpdatetime)) {
            top.DigitalLogDate = Year+Month+Day;            
            var strPath = top.API.Dat.GetBaseDir() + "/DATA/TransactionJournal/"; //"Home\\DATA\\TransactionJournal\\";
			//var strPath = "C:\\Users\\Demon\\Desktop\\JNL\\TransactionJournal\\"
			strPath = strPath+ top.DigitalLogDate + ".txt";
			if(top.API.Tsl.InitJnlSync(strPath,15) == 0){				
				if(nSearchType == 1){
					tmp =  Year + "/" + Month + "/" + Day + " " + Hour + ":" + Min;					
				}
				if(nSearchType == 2){
					tmp =  strCardNum;					
				}
				if(nSearchType == 3){
					tmp =  strJnlNum;					
				}
				var s=top.API.Tsl.SearchJNLSync(1, nSearchType, tmp);
				if(s!=""){
					top.API.Tsl.UnInitJnlSync();
                    top.SearchParam1 = nSearchType;
                    top.SearchParam2 = tmp;
					return CallResponse("OK");					
				}else{
					if(nSearchType == 1){
                        tmp =  Year + "/" + Month + "/" + Day + " " + Hour;
                        s=top.API.Tsl.SearchJNLSync(1, nSearchType, tmp);
				        if(s!=""){
					       // top.API.Tsl.Uninit();
                            top.SearchParam1 = nSearchType;
                            top.SearchParam2 = tmp;
					        return CallResponse("OK");
                        }else{
						    document.getElementById('DateTip').innerText = "您输入的时间无记录，请重新输入！"	
                        }				
					}
					if(nSearchType == 2){
						document.getElementById('CardNumTip').innerText = "您输入的卡号无记录，请重新输入！"									
					}
					if(nSearchType == 3){
						document.getElementById('JnlNumTip').innerText = "您输入的流水号无记录，请重新输入！"					
					}
				}
			}else{
				document.getElementById('DateTip').innerText = "您输入的日期无记录，请重新输入！"		
			}            
        }else{
            document.getElementById('DateTip').innerText = "您输入的日期无效，请重新输入！"	
        }
	    top.API.Tsl.UnInitJnlSync();
    }
   
    
    //remove all event handler
    function Clearup() {
		top.API.Tsl.UnInitJnlSync();
    }
})();
