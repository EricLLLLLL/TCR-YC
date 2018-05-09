/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {
    var StartEndTime = null;
    var StartEndTimeNum = 0;
    var arrstrStartTime = new Array();
    var arrstrEndTime = new Array();    
    var strDate = "";//交易日期
	var InputObj = "";//输入框对象
	var strInputName = "";//输入框名字
	var strType = "CrownNum";//查询方式
	var strCrown = "";//冠字号
	var strCardNo = "";//银行卡号
	var strJnl = "";//流水编号
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        ButtonDisable();		
        EventLogin();
        StartEndTime = document.getElementsByName("StartEndTime1");
        StartEndTimeClick(StartEndTime);
        var tmpstrDate = top.GetDate12byte();
        strDate = tmpstrDate.substr(0,4) + "#" + tmpstrDate.substr(4,2) + "#" + tmpstrDate.substr(6,2) + "#" + "00#00#00#" + 
                                tmpstrDate.substr(0,4) + "#" + tmpstrDate.substr(4,2) + "#" + tmpstrDate.substr(6,2) + "#" + "23#59#59";
        onClearTime();
        App.Plugin.Keyboard.show("4", "PageSubject", "KeyboardDivP");
         // $("#KeyboardDiv").css({"left":"1000px","top":"1000px"});
        KeyboardClick();
        ButtonEnable();
    } (); //Page Entry
    function ButtonDisable() {
        document.getElementById('Back').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Back').disabled = false;
    }
    //@User ocde scope start
    //交易类型
    document.getElementById('DataNum').onclick = function () {
        document.getElementById('DataNum_tip').style.display = "none";
        document.getElementById('Crown_Select_tip').style.display = "none";        
        document.getElementById('DataNum').style.backgroundImage = "url('Framework/style/Graphics/btn/radio_select.png')";
        document.getElementById('CrownNum').style.backgroundImage = "url('Framework/style/Graphics/btn/redio_noselct.png')";
        document.getElementById('Type_CrownNum').style.display = "none";
        document.getElementById('Type_DataNum').style.display = "block";
		strType = "DataNum";
        strCrown = "";
        document.getElementById('Crown_No').value = "";
        StartEndTime = document.getElementsByName("StartEndTime2");
        StartEndTimeClick(StartEndTime);
		onClearTime();
    }
    //冠字号查询
    document.getElementById('CrownNum').onclick = function () {        
        document.getElementById('DataNum_tip').style.display = "none";
        document.getElementById('Crown_Select_tip').style.display = "none";
        document.getElementById('CrownNum').style.backgroundImage = "url('Framework/style/Graphics/btn/radio_select.png')";
        document.getElementById('DataNum').style.backgroundImage = "url('Framework/style/Graphics/btn/redio_noselct.png')";
        document.getElementById('Type_DataNum').style.display = "none";
        document.getElementById('Type_CrownNum').style.display = "block";
		strType = "CrownNum";
        strCardNo = "";
        strJnl = "";
        document.getElementById('Jnl_No').value = "";
        document.getElementById('Card_No').value = "";
        StartEndTime = document.getElementsByName("StartEndTime1");
        StartEndTimeClick(StartEndTime);
		onClearTime();
    }
    //@User ocde scope start
    document.getElementById('Back').onclick = function () {
        ButtonDisable();
        return CallResponse('Back');
    }

    document.getElementById('Jnl_No').onclick = function () {  
        strInputName = 'Jnl_No';
		InputObj = document.getElementById('Jnl_No');
		App.InputEdit.getCurPosition(InputObj);
    }
    document.getElementById('Card_No').onclick = function () {  
        strInputName = 'Card_No';
		InputObj = document.getElementById('Card_No');
		App.InputEdit.getCurPosition(InputObj);
    }
    document.getElementById('Crown_No').onclick = function () {  
        strInputName = 'Crown_No';
		InputObj = document.getElementById('Crown_No');
		App.InputEdit.getCurPosition(InputObj);
    }

    //输入框点击事件
    function StartEndTimeClick(Element) {
        for (var j = 0; j < Element.length; j++) {
            (function () {
                var inpt = Element[j];
				var p = j;
                inpt.onclick = function () {					
                    StartEndTimeNum = p;
                    InputObj = ""; 
                    App.InputEdit.getCurPosition(inpt);     
                }
            })();
        }
     }
    //@User code scope end 
    function onClearTime() {
        top.API.displayMessage("onClearTime()");
        var i = 0;
        var arrSplitValue = new Array();
        arrSplitValue = strDate.split("#");
        for ( i = 0; i < arrSplitValue.length; i++) {            
            StartEndTime[i].value = arrSplitValue[i];
            if (i<6) {
                arrstrStartTime[i] = arrSplitValue[i];
            }else{
                arrstrEndTime[i-6] = arrSplitValue[i];
            }
        }  
    }

    function KeyboardClick() {
        var arrKeyboardKey = document.getElementsByName("Name_Keyboard");

        for (var i = 0; i < arrKeyboardKey.length; i++) {
            var keyEvent = arrKeyboardKey[i];
            keyEvent.onclick = function (e) {
                document.getElementById('DataNum_tip').style.display = "none";
                document.getElementById('Crown_Select_tip').style.display = "none";
                if ('退格' == this.innerText) {
					if (InputObj != "") {
						App.InputEdit.getInput(InputObj , 1 ,"BS");						
						strCrown = InputObj.value;				
					}else{
						App.InputEdit.getInput(StartEndTime[StartEndTimeNum] , 1 ,"BS");
						if (StartEndTimeNum < 6) {
							arrstrStartTime[StartEndTimeNum] = StartEndTime[StartEndTimeNum].value;
						}else{
							arrstrEndTime[StartEndTimeNum-6] = StartEndTime[StartEndTimeNum].value;
						} 
					}                     
                } else if ('清除' == this.innerText) {
					if (InputObj != "") {
						InputObj.value = "";
                        if (strInputName == "Jnl_No") {
                            strJnl = InputObj.value;
                        }else if(strInputName == "Card_No") {
                            strCardNo = InputObj.value;
                        }else if(strInputName == "Crown_No") {
                            strCrown = InputObj.value;
                        }
					}else{
						StartEndTime[StartEndTimeNum].value = "";
						if (StartEndTimeNum < 6) {
							arrstrStartTime[StartEndTimeNum] = StartEndTime[StartEndTimeNum].value;						
						}else{
							arrstrEndTime[StartEndTimeNum-6] = StartEndTime[StartEndTimeNum].value;
						}
					}					
                } else {
					if (InputObj != "") {
                        if (strInputName == "Jnl_No") {
							if (this.innerText != "*"){
								if (strJnl.length < 6) {
									App.InputEdit.getInput(InputObj , 0 , this.innerText);
									strJnl = InputObj.value;
								} 
							}
                        }else if(strInputName == "Card_No") {
							if (this.innerText != "*"){
								if (strCardNo.length < 20) {
									App.InputEdit.getInput(InputObj , 0 , this.innerText);
									strCardNo = InputObj.value;
								}
							}
                        }else if(strInputName == "Crown_No") {
                            if (strCrown.length < 10) {
							    App.InputEdit.getInput(InputObj , 0 , this.innerText);
							    strCrown = InputObj.value;
						    }
                        }
					}else{
						if (this.innerText != "*"){
							var Maxlen = 2;
							if (StartEndTimeNum == 0 || StartEndTimeNum == 6) {
								Maxlen = 4;
							}                    
							
							if (StartEndTimeNum < 6) {							
								if (arrstrStartTime[StartEndTimeNum].length < Maxlen) {
									App.InputEdit.getInput(StartEndTime[StartEndTimeNum] , 0 , this.innerText);
									arrstrStartTime[StartEndTimeNum] = StartEndTime[StartEndTimeNum].value;
								}                        
							}else{
								if (arrstrEndTime[StartEndTimeNum-6].length < Maxlen) {
									App.InputEdit.getInput(StartEndTime[StartEndTimeNum] , 0 , this.innerText);
									arrstrEndTime[StartEndTimeNum-6] = StartEndTime[StartEndTimeNum].value;
								}                        
							}
						}
					}
                }
            }
        }
   }

    document.getElementById('KeyboardKeys_set').onclick = function () {
        var i = 0; 
        var tmpParam = "";//临时空变量
        var strStart = "";
        var strEnd = "";
        var tmpStr = "000000";
		var tmpstrCrown = "**********";
        if (strJnl.length < 6 && strJnl != "") {
            strJnl = tmpStr.substr(0,(6-strJnl.length)) + strJnl;
        }
        for ( i = 0; i < 6; i++) {
            if (i == 0) {
                if (arrstrStartTime[i].length < 4) {
                    arrstrStartTime[i] = tmpStr.substr(0,(4-arrstrStartTime[i].length)) + arrstrStartTime[i];
					StartEndTime[i].value = arrstrStartTime[i];
                }
                if (arrstrEndTime[i].length < 4) {
                    arrstrEndTime[i] = tmpStr.substr(0,(4-arrstrEndTime[i].length)) + arrstrEndTime[i];
					StartEndTime[i+6].value = arrstrEndTime[i];
                }
            }else{
                if (arrstrStartTime[i].length < 2) {
                    arrstrStartTime[i] = tmpStr.substr(0,(2-arrstrStartTime[i].length)) + arrstrStartTime[i];
					StartEndTime[i].value = arrstrStartTime[i];
                }
                if (arrstrEndTime[i].length < 2) {
                    arrstrEndTime[i] = tmpStr.substr(0,(2-arrstrEndTime[i].length)) + arrstrEndTime[i];
					StartEndTime[i+6].value = arrstrEndTime[i];
                }
            }
                
            //strStart += arrstrStartTime[i];
            //strEnd += arrstrEndTime[i];
        }	
        strStart = arrstrStartTime[0] + "-" + arrstrStartTime[1] + "-" + arrstrStartTime[2] + " " + arrstrStartTime[3] + ":" + arrstrStartTime[4] + ":" + arrstrStartTime[5];
        strEnd = arrstrEndTime[0] + "-" + arrstrEndTime[1] + "-" + arrstrEndTime[2] + " " + arrstrEndTime[3] + ":" + arrstrEndTime[4] + ":" + arrstrEndTime[5];
		if (strType == "CrownNum"){
            
			var CrownNum = strCrown + tmpstrCrown.substr(0,(10-strCrown.length));	
			top.API.displayMessage("开始时间=" + strStart + ",结束时间=" + strEnd + ",冠字号=" + CrownNum);
			top.API.Tsl.SearchFSN(strStart,strEnd,CrownNum,tmpParam,tmpParam);
		}
		if (strType == "DataNum"){
			document.getElementById('Crown_No').value = strCrown;
			top.API.displayMessage("开始时间=" + strStart + ",结束时间=" + strEnd + ",流水号=" + strJnl + ",银行卡号=" + strCardNo);
			top.API.Tsl.SearchFSN(strStart,strEnd,tmpParam,strJnl,strCardNo);
		}           
    }

    function onSearchFSNComplete(GenneralFsn) {
        top.API.displayMessage("onSearchFSNComplete()--"+GenneralFsn);
        top.arrGenneralFsn = GenneralFsn;
        return CallResponse('OK');
    }
    function onSearchFSNFail() {
        top.API.displayMessage("onSearchFSNFail()");
        document.getElementById('DataNum_tip').style.display = "inline";
        document.getElementById('Crown_Select_tip').style.display = "inline";
        //onClearTime();
    }
   //Register the event
    function EventLogin() {
         top.API.Tsl.addEvent("SearchFSNComplete", onSearchFSNComplete);
         top.API.Tsl.addEvent("SearchFSNFail", onSearchFSNFail);
    }

    function EventLogout() {
         top.API.Tsl.removeEvent("SearchFSNComplete", onSearchFSNComplete);
         top.API.Tsl.removeEvent("SearchFSNFail", onSearchFSNFail);
    }

    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
    }
})();
