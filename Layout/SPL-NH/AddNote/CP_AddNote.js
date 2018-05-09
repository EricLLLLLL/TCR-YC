/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {
    var CashBoxInput = null;
	var arrCashCurrency;
    var strNotes = null;
    var CashBoxInputNum = 0;
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        ButtonDisable();
        EventLogin();
        //获取保险门状态
        if (top.API.Cim.StSafeDoorStatus() == "OPEN") {
            document.getElementById("WTip").style.display = "block";
        }else{
            document.getElementById("WTip").style.display = "none";
        }
        SetLabel();
        CashBoxInput = document.getElementsByName("CashBoxInput");
        CashBoxInputClick(CashBoxInput);
        CashBoxInput[0].focus();
        App.Plugin.Keyboard.show("2", "PageSubject", "KeyboardDiv");
        KeyboardClick();
        ButtonEnable();
    }(); //Page Entry

    function ButtonDisable() {
        document.getElementById('Exit').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Exit').disabled = false;
    }
    function SetLabel() {
        var  i;
        var  nplu = 0;
        var labelnum = "";
        strNotes = new Array();
		top.API.displayMessage("top.API.CashInfo.nCountOfUnits="+top.API.CashInfo.nCountOfUnits);
		arrCashCurrency = new Array(top.API.CashInfo.nCountOfUnits);
        for (i= 0; i < top.API.CashInfo.nCountOfUnits; i++) {
            if (i == 3) {
                strNotes[i] = "0";
            }else{
                strNotes[i] = "";
            }
            nplu = i + 1;
            labelnum = "CountOfUnits" + nplu.toString();
            document.getElementById(labelnum).style.display = "block";
        }
        top.API.displayMessage("UnitCurrency[0]=" + top.API.CashInfo.arrUnitCurrency[0] + ";UnitCurrency[1]=" + top.API.CashInfo.arrUnitCurrency[1] + ";UnitCurrency[2]=" + top.API.CashInfo.arrUnitCurrency[2] + ";UnitCurrency[3]=" + top.API.CashInfo.arrUnitCurrency[3] + ";UnitCurrency[4]=" + top.API.CashInfo.arrUnitCurrency[4]);
        for (i= 0; i < top.API.CashInfo.nCountOfUnits; i++) {
            switch (top.API.CashInfo.arrUnitCurrency[i]) {
                case 100:
					arrCashCurrency[i]=100;
                    nplu = i + 1;
                    labelnum = "NoteValueLabel" + nplu.toString();
                    document.getElementById(labelnum).innerText = "纸币钱箱" + nplu.toString() + "(100)：";
                    break;
                case 50:
					arrCashCurrency[i]=50;
                     nplu = i + 1;
                    labelnum = "NoteValueLabel" + nplu.toString();
                    document.getElementById(labelnum).innerText = "纸币钱箱" + nplu.toString() + "(050)：";
                    break;
                case 20:
					arrCashCurrency[i]=20;
                    nplu = i + 1;
                    labelnum = "NoteValueLabel" + nplu.toString();
                    document.getElementById(labelnum).innerText = "纸币钱箱" + nplu.toString() + "(020)：";
                    break;
                case 10:
					arrCashCurrency[i]=10;
                    nplu = i + 1;
                    labelnum = "NoteValueLabel" + nplu.toString();
                    document.getElementById(labelnum).innerText = "纸币钱箱" + nplu.toString() + "(010)：";
                    break;
                case 5:
					arrCashCurrency[i]=5;
                    nplu = i + 1;
                    labelnum = "NoteValueLabel" + nplu.toString();
                    document.getElementById(labelnum).innerText = "纸币钱箱" + nplu.toString() + "(005)：";
                    break;
                case 1:
					arrCashCurrency[i]=1;
                    nplu = i + 1;
                    labelnum = "NoteValueLabel" + nplu.toString();
                    document.getElementById(labelnum).innerText = "纸币钱箱" + nplu.toString() + "(001)：";
                    break;
                default:
					arrCashCurrency[i]=0;
                    nplu = i + 1;
                    labelnum = "NoteValueLabel" + nplu.toString();
                    document.getElementById(labelnum).innerText = "纸币钱箱" + nplu.toString() + "(000)：";
                    break;
                }
            }
    }
        //输入框点击事件
    function CashBoxInputClick(Element) {
        for (var j = 0; j < Element.length; j++) {
            (function () {
		if(j != 3){
                var inpt = Element[j];
				var p = j;
                inpt.onclick = function () {					
                    CashBoxInputNum = p;
                    App.InputEdit.getCurPosition(inpt);     
                }
                }
            })();
        }
     }

     function ClearTip() {
        var noteNo = "note" + (CashBoxInputNum+1).toString();
		document.getElementById(noteNo).innerText = "";
     }
	 function SetCountMoney() {
		var CountMoney = 0;
		var tmpCountMoney = 0;
		for (var i= 0; i < top.API.CashInfo.nCountOfUnits; i++) {
			if(strNotes[i] == ""){
				tmpCountMoney = 0;
			}else{
				tmpCountMoney = parseInt(strNotes[i]);
			}
			CountMoney += arrCashCurrency[i] * tmpCountMoney;
		}
		document.getElementById('CountMoney').value = CountMoney.toString() + ".00";
     }
     function KeyboardClick() {
        var arrKeyboardKey = document.getElementsByName("Name_Keyboard");
        for (var i = 0; i < arrKeyboardKey.length; i++) {
            var keyEvent = arrKeyboardKey[i];
            keyEvent.onclick = function (e) {
                ClearTip();				
                if ('退格' == this.innerText) {
					App.InputEdit.getInput(CashBoxInput[CashBoxInputNum] , 1 ,"BS");						
					strNotes[CashBoxInputNum] = CashBoxInput[CashBoxInputNum].value;				                 
                } else if ('清除' == this.innerText) {
					CashBoxInput[CashBoxInputNum].value = "";
                    strNotes[CashBoxInputNum] = "";				
                } else {
					if (strNotes[CashBoxInputNum].length < 4) {
                        App.InputEdit.getInput(CashBoxInput[CashBoxInputNum] , 0 ,this.innerText);						
					    strNotes[CashBoxInputNum] = CashBoxInput[CashBoxInputNum].value;			
					}
                }
				SetCountMoney();
            }
        }
   }

    document.getElementById('KeyboardKey_set').onclick = function () {
        var bSetAllow = true;
        var i = 0;
        var noteNo = "";		
        for (i= 0; i < top.API.CashInfo.nCountOfUnits; i++) {	
            if (i==3) {
                continue;
            }		
            if (strNotes[i] == "") {
                bSetAllow = false;
				noteNo = "note" + (i+1).toString();				
                document.getElementById(noteNo).innerText = "输入不能为空!";
            } else if (strNotes[i] < 0) {
                bSetAllow = false;
				noteNo = "note" + (i+1).toString();
                document.getElementById(noteNo).innerText = "输入不可小于0张!";
            } else if (strNotes[i] > 3000) {
                bSetAllow = false;
				noteNo = "note" + (i+1).toString();
                document.getElementById(noteNo).innerText = "输入不能大于3000张!";
            } 
        }
        if (bSetAllow) {
            for (i= 0; i < top.API.CashInfo.nCountOfUnits; i++) {
                top.API.CashInfo.arrUnitRemain[i] = parseInt(strNotes[i],10);
            }
            return CallResponse("OK");
        }
    }

    document.getElementById('Exit').onclick = function () {

        return CallResponse('Exit');
    }

    //@User code scope end 
    function onSafeDoorOpened() {
        document.getElementById("WTip").style.display = "block";
    }

    function onSafeDoorClosed() {
        document.getElementById("WTip").style.display = "none";
    }
    //Register the event
    function EventLogin() {
        //保险柜门开关事件
        top.API.Cim.addEvent("SafeDoorClosed", onSafeDoorClosed);
        top.API.Cim.addEvent("SafeDoorOpened", onSafeDoorOpened);
    }

    function EventLogout() {
        //保险柜门开关事件
        top.API.Cim.removeEvent("SafeDoorClosed", onSafeDoorClosed);
        top.API.Cim.removeEvent("SafeDoorOpened", onSafeDoorOpened);
    }


    
    //remove all event handler
    function Clearup() {
        EventLogout();
    }
})();
