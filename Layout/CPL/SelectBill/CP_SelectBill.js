/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {
    var bExit = false;
    var bItem = true;
    //定义保存各钞箱钞票数变量
    var strCash100  = "0";
    var strCash50 = "0";
    var strCash20 = "0";
    var strCash10 = "0";
    var strCash5 = "0";
    var strCash1 = "0";
    var strCashRemain = "";    
    var nCash100  = 0;
    var nCash50 = 0;
    var nCash20 = 0;
    var nCash10 = 0;
    var nCash5 = 0;
    var nCash1 = 0;
    var nCashRemain = 0;
    var nCash = 0;
    var tnCash100  = 0;
    var tnCash50 = 0;
    var tnCash20 = 0;
    var tnCash10 = 0;
    var tnCash5 = 0;
    var tnCash1 = 0;
    var inputId;
    var Cash100 = document.getElementById("t100");
    var Cash50 = document.getElementById("t50");
    var Cash20 = document.getElementById("t20");
    var Cash10 = document.getElementById("t10");
    var Cash5 = document.getElementById("t5");
    var Cash1 = document.getElementById("t1");
    var CashRemain = document.getElementById("RemainMoney");
    var ErrorTip = document.getElementById("ErrorTip");
    //保存当前输入框标志位
    var InputFlag = 1;  
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });	
    var Initialize = function () {
        //@initialize scope start    
        ButtonDisable();
        EventLogin();
        App.Plugin.Voices.play("voi_47");
        document.getElementById('Exit').style.display = "none";
        nCash = parseInt(top.API.CashInfo.strTransAmount);   
        if (nCash == 0) {
            App.Timer.SetPageTimeout(60);
            App.Timer.TimeoutDisposal(TimeoutCallBack);
            bItem = false;
            document.getElementById('OK').style.display = "none";
            document.getElementById('Exit').style.display = "block";
        }else{
            GetUnitInfo();   
            document.getElementById("CashMoney").innerText=nCash.toString();
            CashRemain.innerText=nCash.toString();                
            top.API.Pin.GetData(0, false, "0,1,2,3,4,5,6,7,8,9,ENTER,CLEAR,CANCEL", "CANCEL", -1);
        }  
        ButtonEnable();
    } (); //Page Entry

    function ButtonDisable() {
        top.API.displayMessage("ButtonDisable");
        document.getElementById('Exit').disabled = true;
        document.getElementById('OK').disabled = true;
    }

    function ButtonEnable() {
        top.API.displayMessage("ButtonEnable");
        document.getElementById('Exit').disabled = false;
        document.getElementById('OK').disabled = false;
    }

    function CheckRemainMoney() {        
        var i = 0;
        var RemainCount = top.API.Cdm.RemainCount();
        var bRet100 = false;
        var bRet50 = false;
        var bRet20 = false;
        var bRet10 = false;
        var bRet5 = false;
        var bRet1 = false;
        var arrMixCash = new Array();
		var arrRemainCurrencyCash = new Array(0,0,0,0,0,0);
        for ( i = 0; i < top.API.CashInfo.arrUnitRemain.length; i++) {
            if (i==3) {
                arrMixCash[3] = 0;
                continue;
            }else{
                if (top.API.CashInfo.arrUnitCurrency[i] == 100) {
					var tmpNum = top.API.CashInfo.arrUnitRemain[i] - RemainCount;
					if(tmpNum > 0){
						arrRemainCurrencyCash[0] += tmpNum;
					}
                    if ((top.API.CashInfo.arrUnitRemain[i] - nCash100) < RemainCount) {
                        if(top.API.CashInfo.arrUnitRemain[i] > RemainCount){
							nCash100 = nCash100 - top.API.CashInfo.arrUnitRemain[i] + RemainCount;
							arrMixCash[i] = top.API.CashInfo.arrUnitRemain[i] - RemainCount;  
						}else{
							arrMixCash[i] = 0;  
						}                     
                    }else{
                        arrMixCash[i] = nCash100;
						nCash100=0;
                        bRet100 = true;
                    }
                } else if (top.API.CashInfo.arrUnitCurrency[i] == 50) {
					var tmpNum = top.API.CashInfo.arrUnitRemain[i] - RemainCount;
					if(tmpNum > 0){
						arrRemainCurrencyCash[1] += tmpNum;
					}
                    if ((top.API.CashInfo.arrUnitRemain[i] - nCash50) < RemainCount) {
                        if(top.API.CashInfo.arrUnitRemain[i] > RemainCount){
							nCash50 = nCash50 - top.API.CashInfo.arrUnitRemain[i] + RemainCount;
							arrMixCash[i] = top.API.CashInfo.arrUnitRemain[i] - RemainCount;  
						}else{
							arrMixCash[i] = 0;  
						}                       
                    }else{
                        arrMixCash[i] = nCash50;
                        nCash50 = 0;
                        bRet50 = true;
                    }
                } else if (top.API.CashInfo.arrUnitCurrency[i] == 20) {
					var tmpNum = top.API.CashInfo.arrUnitRemain[i] - RemainCount;
					if(tmpNum > 0){
						arrRemainCurrencyCash[2] += tmpNum;
					}
                    if ((top.API.CashInfo.arrUnitRemain[i] - nCash20) < RemainCount) {
                        if(top.API.CashInfo.arrUnitRemain[i] > RemainCount){
							nCash20 = nCash20 - top.API.CashInfo.arrUnitRemain[i] + RemainCount;
							arrMixCash[i] = top.API.CashInfo.arrUnitRemain[i] - RemainCount;  
						}else{
							arrMixCash[i] = 0;  
						}                      
                    }else{
                        arrMixCash[i] = nCash20;
                        nCash20 = 0;
                        bRet20 = true;
                    }
                } else if (top.API.CashInfo.arrUnitCurrency[i] == 10) {
					var tmpNum = top.API.CashInfo.arrUnitRemain[i] - RemainCount;
					if(tmpNum > 0){
						arrRemainCurrencyCash[3] += tmpNum;
					}
                    if ((top.API.CashInfo.arrUnitRemain[i] - nCash10) < RemainCount) {
                        if(top.API.CashInfo.arrUnitRemain[i] > RemainCount){
							nCash10 = nCash10 - top.API.CashInfo.arrUnitRemain[i] + RemainCount;
							arrMixCash[i] = top.API.CashInfo.arrUnitRemain[i] - RemainCount;  
						}else{
							arrMixCash[i] = 0;  
						}                      
                    }else{
                        arrMixCash[i] = nCash10;
                        nCash10 = 0;
                        bRet10 = true;
                    }
                } else if (top.API.CashInfo.arrUnitCurrency[i] == 5) {
					var tmpNum = top.API.CashInfo.arrUnitRemain[i] - RemainCount;
					if(tmpNum > 0){
						arrRemainCurrencyCash[4] += tmpNum;
					}
                    if ((top.API.CashInfo.arrUnitRemain[i] - nCash5) < RemainCount) {
                        if(top.API.CashInfo.arrUnitRemain[i] > RemainCount){
							nCash5 = nCash5 - top.API.CashInfo.arrUnitRemain[i] + RemainCount;
							arrMixCash[i] = top.API.CashInfo.arrUnitRemain[i] - RemainCount;  
						}else{
							arrMixCash[i] = 0;  
						}                       
                    }else{
                        arrMixCash[i] = nCash5;
                        nCash5 = 0;
                        bRet5 = true;
                    }
                } else if (top.API.CashInfo.arrUnitCurrency[i] == 1) {
					var tmpNum = top.API.CashInfo.arrUnitRemain[i] - RemainCount;
					if(tmpNum > 0){
						arrRemainCurrencyCash[5] += tmpNum;
					}
                    if ((top.API.CashInfo.arrUnitRemain[i] - nCash1) < RemainCount) {
                        if(top.API.CashInfo.arrUnitRemain[i] > RemainCount){
							nCash1 = nCash1 - top.API.CashInfo.arrUnitRemain[i] + RemainCount;
							arrMixCash[i] = top.API.CashInfo.arrUnitRemain[i] - RemainCount;  
						}else{
							arrMixCash[i] = 0;  
						}                      
                    }else{
                        arrMixCash[i] = nCash1;
                        nCash1 = 0;
                        bRet1 = true;
                    }
                } 
            }     
        }
        if (!bRet100 && (nCash100 > 0)){
            ErrorTip.innerText = "100元存量不足，当前可取" + arrRemainCurrencyCash[0] + "张，请重新分配";   
            return false;           
        }
        if (!bRet50 && (nCash50 > 0)){
            ErrorTip.innerText = "50元存量不足，当前可取" + arrRemainCurrencyCash[1] + "张，请重新分配";   
            return false;           
        }
        if (!bRet20 && (nCash20 > 0)){
            ErrorTip.innerText = "20元存量不足，当前可取" + arrRemainCurrencyCash[2] + "张，请重新分配";   
            return false;           
        }
        if (!bRet10 && (nCash10 > 0)){
            ErrorTip.innerText = "10元存量不足，当前可取" + arrRemainCurrencyCash[3] + "张，请重新分配";     
            return false;           
        }
        if (!bRet5 && (nCash5 > 0)){
            ErrorTip.innerText = "5元存量不足，当前可取" + arrRemainCurrencyCash[4] + "张，请重新分配";    
            return false;           
        }
        if (!bRet1  && (nCash1 > 0)){
            ErrorTip.innerText = "1元存量不足，当前可取" + arrRemainCurrencyCash[5] + "张，请重新分配";   
            return false;           
        }
            SetPrintData();
            var i = 0;
            for ( i = 0; i < arrMixCash.length; i++) {
                top.API.CashInfo.arrSelfMixDispenset[i] = arrMixCash[i];
            }
            return true;           
    }
    function SetPrintData() {
        var PrintInData = new Array("");
        PrintInData[0] = "100:" + top.API.CashInfo.arrCurrencyCashIn[0] + ",50:" + top.API.CashInfo.arrCurrencyCashIn[1] + ",20:" + top.API.CashInfo.arrCurrencyCashIn[2] + ",10:" + top.API.CashInfo.arrCurrencyCashIn[3] + ",5:" + top.API.CashInfo.arrCurrencyCashIn[4] + ",1:" + top.API.CashInfo.arrCurrencyCashIn[5];
        var nRet = top.API.Dat.SetDataSync("ExChangeBillCountIn", "STRING", PrintInData);
        top.API.displayMessage("SetDataSync ExChangeBillCountIn =" + PrintInData +",Return:" + nRet);

        var PrintOutData = new Array();
        PrintOutData[0] = "100:" + strCash100 + ",50:" + strCash50 + ",20:" + strCash20 + ",10:" + strCash10 + ",5:" + strCash5 + ",1:" + strCash1;
        var nRet1 = top.API.Dat.SetDataSync("ExChangeBillCountOut", "STRING", PrintOutData);
        top.API.displayMessage("SetDataSync ExChangeBillCountOut =" + PrintOutData + ",Return:" + nRet1);    
    }

    function StringtoInt() {
        top.API.displayMessage("StringtoInt()");        
        if (strCash100 != "") {
            nCash100 = parseInt(strCash100,10);
        }
        if (strCash50 != "") {
            nCash50 = parseInt(strCash50,10);
        }
        if (strCash20 != "") {
            nCash20 = parseInt(strCash20,10);
        }
        if (strCash10 != "") {
            nCash10 = parseInt(strCash10,10);
        }
        if (strCash5 != "") {
            nCash5 = parseInt(strCash5,10);
        }
        if (strCash1 != "") {
            nCash1 = parseInt(strCash1,10);
        }
    }

    function ClearTip() {
        ErrorTip.innerText ="";
    }
    function RefreshData() {
        top.API.displayMessage("RefreshData()");
        StringtoInt();
        var tmpnCashRemain = nCash-nCash100*100-nCash50*50-nCash20*20-nCash10*10-nCash5*5-nCash1;
        if (tmpnCashRemain < 0) {
            if (inputId == "t100") {
                ErrorTip.innerText ="* 超出总金额！";
                strCash100 = tnCash100.toString();
                Cash100.innerText = strCash100;
                Cash100.focus();
            } else if (inputId == "t50") {
                ErrorTip.innerText ="* 超出总金额！";               
                strCash50 = tnCash50.toString();
                Cash50.innerText = strCash50;
                Cash50.focus();
            } else if (inputId == "t20") {
                ErrorTip.innerText ="* 超出总金额！";
                strCash20 = tnCash20.toString();
                Cash20.innerText = strCash20;
                Cash20.focus();
            } else if (inputId == "t10") {
                ErrorTip.innerText ="* 超出总金额！";
                strCash10 = tnCash10.toString();
                Cash10.innerText = strCash10;
                Cash10.focus();
            } else if (inputId == "t5") {
                ErrorTip.innerText ="* 超出总金额！";
                strCash5 = tnCash5.toString();
                Cash5.innerText = strCash5;
                Cash5.focus();
            } else if (inputId == "t1") {
                ErrorTip.innerText ="* 超出总金额！";
                strCash1 = tnCash1.toString();
                Cash1.innerText = strCash1;
                Cash1.focus();
            }
        }else{            
            tnCash100  = nCash100;
            tnCash50 = nCash50;
            tnCash20 = nCash20;
            tnCash10 = nCash10;
            tnCash5 = nCash5;
            tnCash1 = nCash1;
            nCashRemain = tmpnCashRemain;
            CashRemain.innerText = nCashRemain.toString();
        }        
    }

    var oKeyboardKeyInput = document.getElementsByTagName("input");
    for (var j = 0; j < oKeyboardKeyInput.length; j++) {
        var inpt = oKeyboardKeyInput[j];
        inpt.onclick = function (e) {
            ClearTip();
            ButtonEnable();
            inputId = document.activeElement.id;
        }
    }

    //清除当前输入框
    function onClearNum() {
        top.API.displayMessage("onClearNum()");
        if (inputId == "t100") {
            Cash100.innerText = '0';
            strCash100 = '0';
            Cash100.focus();
        } else if (inputId == "t50") {
            Cash50.innerText = '0';
            strCash50 = '0';
            Cash50.focus();
        } else if (inputId == "t20") {
            Cash20.innerText = '0';
            strCash20 = '0';
            Cash20.focus();
        } else if (inputId == "t10") {
            Cash10.innerText = '0';
            strCash10 = '0';
            Cash10.focus();
        } else if (inputId == "t5") {
            Cash5.innerText = '0';
            strCash5 = '0';
            Cash5.focus();
        } else if (inputId == "t1") {
            Cash1.innerText = '0';
            strCash1 = '0';
            Cash1.focus();
        }
        RefreshData(); 
    }

    function GetUnitInfo() {
        var  i;
        var b100 = false;
        var b50 = false;
        var b20 = false;
        var b10 = false;
        var b5 = false;
        var b1 = false;
        top.API.displayMessage("UnitCurrency[0]=" + top.API.CashInfo.arrUnitCurrency[0] + ";UnitCurrency[1]=" + top.API.CashInfo.arrUnitCurrency[1] + ";UnitCurrency[2]=" + top.API.CashInfo.arrUnitCurrency[2] + ";UnitCurrency[3]=" + top.API.CashInfo.arrUnitCurrency[3] + ";UnitCurrency[4]=" + top.API.CashInfo.arrUnitCurrency[4]);
        for (i= 0; i < top.API.CashInfo.arrUnitCurrency.length; i++) {
            if (top.API.CashInfo.arrUnitCurrency[i] == 100) {
                b100 = true;
            } else if (top.API.CashInfo.arrUnitCurrency[i] == 50) {
                b50 = true;
            } else if (top.API.CashInfo.arrUnitCurrency[i] == 20) {
                b20 = true;
            } else if (top.API.CashInfo.arrUnitCurrency[i] == 10) {
                b10 = true;
            } else if (top.API.CashInfo.arrUnitCurrency[i] == 5) {
                b5 = true;
            } else if (top.API.CashInfo.arrUnitCurrency[i] == 1) {
                b1 = true;
            }
        }
            if (b100) {
                Cash100.setAttribute("unselectable","off");
                Cash100.style.backgroundPositionY = "0px";
            }
            if (b50) {
                Cash50.setAttribute("unselectable","off");
                Cash50.style.backgroundPositionY = "0px";
            }
            if (b20) {
                Cash20.setAttribute("unselectable","off");
                Cash20.style.backgroundPositionY = "0px";
            } 
            if (b10) {
                Cash10.setAttribute("unselectable","off");
                Cash10.style.backgroundPositionY = "0px";
            }
            if (b5) {
                Cash5.setAttribute("unselectable","off");
                Cash5.style.backgroundPositionY = "0px";
            }
            if (b1) {
                Cash1.setAttribute("unselectable","off");
                Cash1.style.backgroundPositionY = "0px";
            }                  
    }
    function onKeyPressed(key, keyCode) {
        top.API.displayMessage("onKeyPressed触发,key=" + key);
        ClearTip();
        if (key == "ENTER") {
            document.getElementById('OK').onclick();
        }else if (key == "CLEAR") {
            onClearNum();
        }else if (key == "CANCEL") {
            // document.getElementById('Exit').onclick();
            top.API.Pin.GetData(0, false, "0,1,2,3,4,5,6,7,8,9,ENTER,CLEAR,CANCEL", "CANCEL", -1);
        }else {
            if (inputId == "t100") {
                if (strCash100 == "0") {
                    strCash100 = "";
                }                      
                strCash100 += key;
                Cash100.innerText = strCash100;               
            } else if (inputId == "t50") {
                if (strCash50 == "0") {
                    strCash50 = "";
                }    
                strCash50 += key;
                Cash50.innerText = strCash50;           
            } else if (inputId == "t20") {
                if (strCash20 == "0") {
                    strCash20 = "";
                }    
                strCash20 += key;
                Cash20.innerText = strCash20;           
            } else if (inputId == "t10") {
                if (strCash10 == "0") {
                    strCash10 = "";
                }    
                strCash10 += key;
                Cash10.innerText = strCash10;           
            } else if (inputId == "t5") {
                if (strCash5 == "0") {
                    strCash5 = "";
                }    
                strCash5 += key;
                Cash5.innerText = strCash5;           
            } else if (inputId == "t1") {
                if (strCash1 == "0") {
                    strCash1 = "";
                }    
                strCash1 += key;
                Cash1.innerText = strCash1;           
            } 
            RefreshData();
        }
    }

    document.getElementById('OK').onclick = function () {
        top.API.displayMessage("点击OK");
        RefreshData();
        if (nCashRemain == 0) {            
            if (CheckRemainMoney()) {
                ButtonDisable();                        
                top.API.Pin.CancelGetData();
                top.API.Cim.StoreEscrowedCash(top.API.gStoreEscrowedCashTimeOut);                
            }            
        }else{
            ErrorTip.innerText ="* 还有未分配金额！";        
        }
    }

    document.getElementById('Exit').onclick = function () {
        ButtonDisable();
        top.API.displayMessage("Exit.onclick");
        top.ErrorInfo = top.API.PromptList.No2;
        bExit = true;
        top.API.Cim.StoreEscrowedCash(top.API.gStoreEscrowedCashTimeOut);
        if (bItem) {
             top.API.Pin.CancelGetData();
        }
    }

    document.getElementById('AddMoney').onclick = function () {
        ButtonDisable();        
        top.API.displayMessage("AddMoney.onclick");
		top.API.Pin.CancelGetData();
        return CallResponse('ContinueAddMoney');
    }


    //event handler
    function onCancelled() {
        top.API.displayMessage("onCancelled触发");
    }

    function onDeviceError() {
        top.API.displayMessage("onDeviceError触发");
        top.ErrorInfo = top.API.PromptList.No4;
        bExit = true;
        top.API.Cim.StoreEscrowedCash(top.API.gStoreEscrowedCashTimeOut);
    }

  

    function onCimDeviceError() {
        top.API.displayMessage("onDeviceError触发");
        if (bExit) {
            return CallResponse("Exit");
        }else{
            top.ErrorInfo = top.API.PromptList.No4;
            return CallResponse('DEPCansel');
        }
    }


    function onEscrowedCashStored() {
        top.API.displayMessage("onEscrowedCashStored触发");
        if (bExit) {
            return CallResponse("DEPCansel");
        }else{
            return CallResponse('OK');
        }
    }

    function onEscrowedCashStoreFailed() {
        top.API.displayMessage("onEscrowedCashStoreFailed");
    }

    //@User code scope end 

    //Register the event
    function EventLogin() {
        top.API.Pin.addEvent("KeyPressed", onKeyPressed);
        top.API.Pin.addEvent("Cancelled", onCancelled);
        top.API.Pin.addEvent("DeviceError", onDeviceError);
        top.API.Cim.addEvent('EscrowedCashStored', onEscrowedCashStored);
        top.API.Cim.addEvent('EscrowedCashStoreFailed', onEscrowedCashStoreFailed);
        top.API.Cim.addEvent('DeviceError', onCimDeviceError);
    }

    function EventLogout() {
        top.API.Pin.removeEvent("KeyPressed", onKeyPressed);
        top.API.Pin.removeEvent("Cancelled", onCancelled);
        top.API.Pin.removeEvent("DeviceError", onDeviceError);
        top.API.Cim.removeEvent('EscrowedCashStored', onEscrowedCashStored);
        top.API.Cim.removeEvent('EscrowedCashStoreFailed', onEscrowedCashStoreFailed);
        top.API.Cim.removeEvent('DeviceError', onCimDeviceError);
    }


    //Countdown function
    function TimeoutCallBack() {
        top.API.displayMessage("超时事件触发");
        top.ErrorInfo = top.API.PromptList.No3;
        bExit = true;
        top.API.Cim.StoreEscrowedCash(top.API.gStoreEscrowedCashTimeOut);
        if (bItem) {
             top.API.Pin.CancelGetData();
        } 
    }
    //Page Return
    
    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
        App.Timer.ClearTime();
    }
})();
