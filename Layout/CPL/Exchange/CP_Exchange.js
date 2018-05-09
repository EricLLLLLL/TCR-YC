/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {
    var bTimeOut = false;
    var cOutMoneyThisTime = 0;//当次出钞金额
	var nOutMoneyAllTime = 0; //已出金额	
	var nTakenMoneyAllTime = 0; //已拿走金额	
    var DispenseMoney; //未出金额
    var AllMoney = 0; //需要出钞的总金额
    var arrRJCount = new Array(); //初始RJ张数
    var nCompleteOrError = false;   //标识当前页面结束方式。false：失败，true：成功。


    var ArrMixResult = new Array(); //配钞结果数组
    var bFirstMix = true;

    var nCashUnitErrRetry = 3;
	var strPRESENTRESULT = "失败";
	
	var tmpCurrentInfo = new Array();
	var CurrentInfo = new Array();//实际出钞数据
	var rCurrentInfo = new Array();//回收箱数据
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        SetJnl();
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        ButtonDisable();
		App.Timer.TimeoutDisposal(TimeoutCallBack);
        EventLogin();
        InitArray();

        arrRJCount = top.API.GetUnitInfo(top.API.Cdm.PURejectCount().toArray());
        AllMoney = parseInt(top.API.CashInfo.strTransAmount);
		top.API.displayMessage("需要出钞的总金额:" + AllMoney);
        DispenseMoney = AllMoney;    
		top.API.Cdm.SetDispenseAmount(DispenseMoney);
        var arrTransactionResult = new Array("出钞失败");
		top.API.gTakeCardAndPrint = true;
        top.API.Dat.SetDataSync("TRANSACTIONRESULT", "STRING", arrTransactionResult);
        ButtonEnable();
	top.API.displayMessage("直接进行Dispense");
        for (var i = 0; i < top.API.CashInfo.nCountOfUnits; i++) {
            ArrMixResult[i] = top.API.CashInfo.arrSelfMixDispenset[i];
        }
        top.API.displayMessage("MixResult=" + ArrMixResult);
        StartDispense(); 
        App.Plugin.Voices.play("voi_14");

    }();//Page Entry
    function ButtonDisable() {
        document.getElementById('OK').disabled = true;
        document.getElementById('Exit').disabled = true;
    }
    function ButtonEnable() {
        document.getElementById('OK').disabled = false;
        document.getElementById('Exit').disabled = false;
    }
    function InitArray() {
        var i = 0;
        for (i = 0; i < top.API.CashInfo.nCountOfUnits; i++) {
            arrRJCount[i] = 0;
			tmpCurrentInfo[i] = 0;
            CurrentInfo[i] = 0;
			rCurrentInfo[i] = 0;
        }
    }
	function ShowLoading(){
        document.getElementById("CinfoMoney").style.display = "none";
        document.getElementById("CinfoTip").style.display = "none";
		document.getElementById("TipDiv").innerText = "正在出钞，请稍候...";
		document.getElementById("AD").style.display = "block";		
	}
    function showinfo() {
        top.API.displayMessage("总额=" + AllMoney + ";已出:" + nOutMoneyAllTime);
		document.getElementById("AD").style.display = "none";
        document.getElementById("CinfoMoney").style.display = "block";
        document.getElementById("CinfoTip").style.display = "block";
        document.getElementById("outMoney").value = nOutMoneyAllTime;
        document.getElementById("RemainMoney").value = AllMoney - nOutMoneyAllTime;
        document.getElementById("TipDiv").innerText = "请取走您的钞票";
        document.getElementById("CurOutMoney").innerText = cOutMoneyThisTime;
    }
    function ShowFailedInfo() {
        top.API.displayMessage("出钞失败，总额=" + AllMoney + ";已拿走金额:" + nTakenMoneyAllTime);
        nCompleteOrError = false;
        document.getElementById("TipDiv").innerText = "出钞失败，请核对已出钞票！";
        document.getElementById("CnextTip").style.display = "none";
        document.getElementById("CinfoTip").style.display = "none";
        document.getElementById("outMoney").value = nTakenMoneyAllTime;
        document.getElementById("RemainMoney").value = AllMoney - nTakenMoneyAllTime;
        document.getElementById("Exit").style.display = "block";
		
		top.API.Tsl.UpdateRecord(top.API.gCardno + ", " + "CWD" + ", " +top.API.CashInfo.strTransAmount + ", " + nTakenMoneyAllTime +", " + top.API.gResponsecode + ", " + "PF");        
        App.Timer.SetPageTimeout(60);		
    }

    function ShowSuccessInfo() {
        top.API.displayMessage("出钞成功，总额=" + AllMoney + ";已出:" + nOutMoneyAllTime);
        nCompleteOrError = true;
        document.getElementById("CnextTip").innerHTML = "出钞完毕，请点击<确定>按钮";
        document.getElementById("OK").style.display = "block";
		top.API.Tsl.UpdateRecord(top.API.gCardno + ", " + "CWD" + ", " +top.API.CashInfo.strTransAmount + ", " + nOutMoneyAllTime +", " + top.API.gResponsecode + ", " + "");
		App.Timer.SetPageTimeout(60);
    }

    //根据配钞结果进行出钞分配方式设计
    function StartDispense() {
        var nUnits = 0;
        top.API.displayMessage("StartDispense,DispenseMoney: " + DispenseMoney);
        var UnitsNotes = 0;
		var ArrDispense = new Array();
		for (nUnits = 0; nUnits < top.API.CashInfo.nCountOfUnits; nUnits++) {
            UnitsNotes += ArrMixResult[nUnits];            
			ArrDispense[nUnits] = 0;
        }  
        if (bFirstMix) {
			top.API.displayMessage("第1次Dispense");
			top.API.displayMessage("总张数=" + UnitsNotes);
            bFirstMix = false;
            top.API.gDispenseCounts = UnitsNotes;//分批次打印冠字号需要记录总张数
	}       
        top.API.displayMessage("配钞结果=" + ArrMixResult);       
		if (UnitsNotes <= 100) {
		top.API.Cdm.Dispense(0, ArrMixResult, "CNY", "0");		
        } else {
            var nRoundCount = 100;
            for (nUnits = 0; nUnits < top.API.CashInfo.nCountOfUnits; nUnits++) {
                if (ArrMixResult[nUnits] != 0) {
                    if (nRoundCount > 0) {
                        if (ArrMixResult[nUnits] > nRoundCount) {
                            ArrDispense[nUnits] = nRoundCount;
							ArrMixResult[nUnits] -= ArrDispense[nUnits];
                            nRoundCount -= ArrDispense[nUnits];                            
                            top.API.displayMessage("钞箱" + (nUnits + 1) + "配钞张数=" + ArrDispense[nUnits]);
                        } else {
                            ArrDispense[nUnits] = ArrMixResult[nUnits]; 
							ArrMixResult[nUnits] -= ArrDispense[nUnits];
                            nRoundCount -= ArrDispense[nUnits];
                            top.API.displayMessage("钞箱" + (nUnits + 1) + "配钞张数=" + ArrDispense[nUnits]);
                            continue;//为了确保出钞总张数为100张。
                        };
                    }                  
					top.API.displayMessage("当次各钞箱出钞情况:" + ArrDispense);
                    top.API.Cdm.Dispense(0, ArrDispense, "CNY", "0");                                        
                    break;
                }
            }
        }				
		
    }

    
	function VoicesPlay() {
		App.Plugin.Voices.play("voi_7");        
    }

    //@User code scope end 

    //event handler
    function onCashDispensed(info,Amount) {
		top.API.displayMessage("onCashDispensed触发");
			cOutMoneyThisTime = Amount;
			nOutMoneyAllTime += Amount;
		var arrInfo = new Array();
        arrInfo = info.toArray();
        var nUnits = 0;
        for (nUnits = 0; nUnits < top.API.CashInfo.nCountOfUnits; nUnits++) {
            CurrentInfo[nUnits] += parseInt(arrInfo[nUnits]);            
        }
        DispenseMoney = AllMoney - nOutMoneyAllTime;               
	var strAmount = cOutMoneyThisTime.toString();//单次金额
	var arrTmp = new Array(strAmount);
	top.API.Dat.SetDataSync("SINGLEDISPENSEMONEY", "STRING", arrTmp);
	top.API.Jnl.PrintSync("CashOutBox2");//打印当次出钞情况
        var cdmStatus = top.API.Cdm.StDetailedDeviceStatus();
        top.API.displayMessage("cdmStatus=" + cdmStatus);
        if (cOutMoneyThisTime == 0 && AllMoney == DispenseMoney && (cdmStatus == "HARDWAREERROR" || cdmStatus == "OFFLINE")) {
            top.ErrorInfo = top.API.PromptList.No4;
            var arrCWCFlag = new Array();
            arrCWCFlag[0] = 1;
            top.API.Dat.SetPersistentData(top.API.cwcflagTag, top.API.cwcflagType, arrCWCFlag);
        } else {            
			showinfo();
			top.API.Cdm.OpenShutter(top.API.gOpenShutterTimeOut);				           
        }
				}
    function onNotDispensable() {
        top.ErrorInfo = top.API.PromptList.No4;
        if (nOutMoneyAllTime == 0) {
            var arrCWCFlag = new Array();
            arrCWCFlag[0] = 1;
            top.API.Dat.SetPersistentData(top.API.cwcflagTag, top.API.cwcflagType, arrCWCFlag);
			}else{
            showinfo();
				ShowFailedInfo();
			}			           
        }
	


    function onDeviceError() {
        top.ErrorInfo = top.API.PromptList.No4;
        if (nOutMoneyAllTime == 0) {
            //修改冲正标志
            var arrCWCFlag = new Array();
            arrCWCFlag[0] = 1;
            top.API.Dat.SetPersistentData(top.API.cwcflagTag, top.API.cwcflagType, arrCWCFlag);
        } else {
            showinfo();
            ShowFailedInfo();
        }
    }
    function onCashDispenseFailed(info,Amount) {
        top.API.displayMessage("onCashDispenseFailed ,出钞情况：" + Amount);
		var arrInfo = new Array();
        arrInfo = info.toArray();
        var nUnits = 0;
        for (nUnits = 0; nUnits < top.API.CashInfo.nCountOfUnits; nUnits++) {
            CurrentInfo[nUnits] += parseInt(arrInfo[nUnits]);            
        }
        var cdmStatus = top.API.Cdm.StDetailedDeviceStatus();
        top.API.displayMessage("cdmStatus=" + cdmStatus);
		cOutMoneyThisTime = Amount;
		nOutMoneyAllTime += Amount;				
        DispenseMoney = AllMoney - nOutMoneyAllTime;  
	var strAmount = cOutMoneyThisTime.toString();//单次金额
	var arrTmp = new Array(strAmount);
	top.API.Dat.SetDataSync("SINGLEDISPENSEMONEY", "STRING", arrTmp);
	top.API.Jnl.PrintSync("CashOutBox2");//打印当次出钞情况
            top.ErrorInfo = top.API.PromptList.No4;
            if (nOutMoneyAllTime == 0) {
                //修改冲正标志
                var arrCWCFlag = new Array();
                arrCWCFlag[0] = 1;
                top.API.Dat.SetPersistentData(top.API.cwcflagTag, top.API.cwcflagType, arrCWCFlag);                
            } else {
                showinfo();
                ShowFailedInfo();
            }
        
    }
	//*****************取款钞口有钞方案*************************	
	function onOutPositionNotEmpty(){
		top.API.displayMessage("触发 onOutPositionNotEmpty事件");
		top.ErrorInfo = top.API.PromptList.No4;
        showinfo();
        ShowFailedInfo();	
	}
	function onDispenseAmountIncorrect() {
        top.ErrorInfo = top.API.PromptList.No4;
        showinfo();
        ShowFailedInfo();
    }
    function onCashTaken() {
	App.Timer.SetPageTimeout(180);
        if (bTimeOut) {
            top.API.displayMessage("TimeoutCallBack已经触发,onCashTaken直接return");
            return;
        }
	nTakenMoneyAllTime += cOutMoneyThisTime;
        App.Timer.ClearIntervalTime();
		top.API.Cdm.CloseShutter(top.API.gCloseShutterTimeOut);		
			}                   
	function onShutterOpened(){
		top.API.displayMessage("onShutterOpened触发,提示客户拿走钞票");
		App.Timer.SetIntervalDisposal(VoicesPlay, 12000);
		App.Timer.SetPageTimeout(180);
	}	
	function onShutterClosed(){
		top.API.displayMessage("onShutterClosed触发");
			if(AllMoney > nOutMoneyAllTime){
				StartDispense(); 
				ShowLoading();
			}else if(AllMoney == nOutMoneyAllTime){				
				ShowSuccessInfo();				
			}else{
				ShowFailedInfo();
			}
	}
	function onShutterOpenFailed(){
		top.API.displayMessage("onShutterOpenFailed触发");
		top.ErrorInfo = top.API.PromptList.No4;
        if (nOutMoneyAllTime == 0) {
            //修改冲正标志
            var arrCWCFlag = new Array();
            arrCWCFlag[0] = 1;
            top.API.Dat.SetPersistentData(top.API.cwcflagTag, top.API.cwcflagType, arrCWCFlag);
        } else {
            showinfo();
            ShowFailedInfo();
        }		
	}	
	function onShutterCloseFailed(){
		top.API.displayMessage("onShutterCloseFailed触发");
		top.ErrorInfo = top.API.PromptList.No4;
        if (nOutMoneyAllTime == 0) {
            //修改冲正标志
            var arrCWCFlag = new Array();
            arrCWCFlag[0] = 1;
            top.API.Dat.SetPersistentData(top.API.cwcflagTag, top.API.cwcflagType, arrCWCFlag);
        } else {
            showinfo();
            ShowFailedInfo();
        }
    }
	
	function onSubDispenseOk(info,Amount) {
		top.API.displayMessage("onSubDispenseOk触发");
		nOutMoneyAllTime += Amount;	
        cOutMoneyThisTime = Amount;//当笔已出金额
		if(nOutMoneyAllTime != AllMoney){
		showinfo();				
		}						
		App.Timer.SetIntervalDisposal(VoicesPlay, 12000);
		App.Timer.SetPageTimeout(180);	        
	}
    /********************************************************************************************************/
    //永久数据模块
    function onDatSetPersistentDataComplete(DataName) {
        if ('CWCFLAG' == DataName) {
            //设置冲正原因
            var arrCWCREASON = new Array();
            arrCWCREASON[0] = 2;
            top.API.Dat.SetPersistentData(top.API.cwcreasonTag, top.API.cwcreasonType, arrCWCREASON);
        }
        if ('CWCREASON' == DataName) {
            showinfo();
            ShowFailedInfo();
        }
    }

    function onDatSetPersistentDataError(DataName, ErrorCode) {
        top.ErrorInfo = top.API.PromptList.No5;
        showinfo();
        ShowFailedInfo();
    }

    
    //******************************************************************************************************

    function SetJnl() {
        var i = 0;
        if (nCompleteOrError) {
            strPRESENTRESULT = "成功";
        }		
        for (i = 0; i < top.API.CashInfo.nCountOfUnits; i++) {
            tmpCurrentInfo[i] = top.API.CashInfo.arrUnitRemain[i];
        }
        top.API.CashInfo.arrUnitRemain = top.API.GetUnitInfo(top.API.Cdm.PUCurrentCount().toArray());
        //获取RJ信息
        var NewarrRJCount = new Array();
		NewarrRJCount = top.API.GetUnitInfo(top.API.Cdm.PURejectCount().toArray());
        //
		var nRJCount = 0;
        for (i = 0; i < top.API.CashInfo.nCountOfUnits; i++) {
            rCurrentInfo[i] = NewarrRJCount[i] - arrRJCount[i];
			CurrentInfo[i] += rCurrentInfo[i];
			nRJCount += rCurrentInfo[i];
        }
		CurrentInfo[3] = 0-nRJCount;
        top.API.displayMessage("实际出钞数据=" + CurrentInfo);
        top.API.displayMessage("回收箱数据=" + rCurrentInfo);
        if (typeof CurrentInfo[5] == 'undefined') {
            CurrentInfo[5] = 0;
        }
        if (typeof CurrentInfo[6] == 'undefined') {
            CurrentInfo[6] = 0;
        }
        if (typeof  rCurrentInfo[5] == 'undefined') {
            rCurrentInfo[5] = 0;
        }
        if (typeof  rCurrentInfo[6] == 'undefined') {
            rCurrentInfo[6] = 0;
        }
		var strAmount = nOutMoneyAllTime.toString();//总金额
		var strJNLData = ", oBOX1=" + CurrentInfo[0] + ", oBOX2=" + CurrentInfo[1] + ", oBOX3=" + CurrentInfo[2]
							+ ", oBOX4=" + CurrentInfo[3] + ", oBOX5=" + CurrentInfo[4] + ", oBOX6=" + CurrentInfo[5] + ", oBOX7="
							+ CurrentInfo[6] + ", rBOX1=" + rCurrentInfo[0] + ", rBOX2=" + rCurrentInfo[1] + ", rBOX3=" + rCurrentInfo[2]
							+ ", rBOX4=" + rCurrentInfo[3] + ", rBOX5=" + rCurrentInfo[4] + ", rBOX6=" + rCurrentInfo[5] + ", rBOX7=" + rCurrentInfo[6]
							+ ",PRESENTRESULT=" + strPRESENTRESULT + ",PRESENTAMOUNT=" + strAmount;
		
        var arrCashOutBoxData = new Array(strJNLData);
        top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, arrCashOutBoxData);
        top.API.Jnl.PrintSync("CashOutBox3");
    }

    document.getElementById('OK').onclick = function () {
        ButtonDisable();
		top.API.Jnl.PrintSync("CwdComplete");
        return CallResponse('OK');
    }
    document.getElementById('Exit').onclick = function () {
        ButtonDisable();
        return CallResponse('Exit');
    }
    
	//**************************************************************
    //Register the event
    function EventLogin() {
        top.API.Dat.addEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.addEvent("SetPersistentDataError", onDatSetPersistentDataError);
        /////
        top.API.Cdm.addEvent('CashDispensed', onCashDispensed);
        top.API.Cdm.addEvent('CashTaken', onCashTaken);
        top.API.Cdm.addEvent('NotDispensable', onNotDispensable);
        top.API.Cdm.addEvent('CashDispenseFailed', onCashDispenseFailed);
        top.API.Cdm.addEvent('DeviceError', onDeviceError);        
        top.API.Cdm.addEvent('DispenseAmountIncorrect', onDispenseAmountIncorrect);
        top.API.Cdm.addEvent('OutPositionNotEmpty', onOutPositionNotEmpty);
		top.API.Cdm.addEvent('SubDispenseOk', onSubDispenseOk);
		//Door
		top.API.Cdm.addEvent('ShutterOpened', onShutterOpened);
		top.API.Cdm.addEvent('ShutterOpenFailed', onShutterOpenFailed);
		top.API.Cdm.addEvent('ShutterClosed', onShutterClosed);
		top.API.Cdm.addEvent('ShutterCloseFailed', onShutterCloseFailed);
    }

    function EventLogout() {
        top.API.Dat.removeEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.removeEvent("SetPersistentDataError", onDatSetPersistentDataError);
        ///
        top.API.Cdm.removeEvent('CashDispensed', onCashDispensed);
        top.API.Cdm.removeEvent('CashTaken', onCashTaken);
        top.API.Cdm.removeEvent('NotDispensable', onNotDispensable);
        top.API.Cdm.removeEvent('CashDispenseFailed', onCashDispenseFailed);
        top.API.Cdm.removeEvent('DeviceError', onDeviceError);
        top.API.Cdm.removeEvent('DispenseAmountIncorrect', onDispenseAmountIncorrect);
        top.API.Cdm.removeEvent('OutPositionNotEmpty', onOutPositionNotEmpty);
		top.API.Cdm.removeEvent('SubDispenseOk', onSubDispenseOk);
		//Door
		top.API.Cdm.removeEvent('ShutterOpened', onShutterOpened);
		top.API.Cdm.removeEvent('ShutterOpenFailed', onShutterOpenFailed);
		top.API.Cdm.removeEvent('ShutterClosed', onShutterClosed);
		top.API.Cdm.removeEvent('ShutterCloseFailed', onShutterCloseFailed);
    }

    //Countdown function
    function TimeoutCallBack() {
        bTimeOut = true;
        ButtonDisable();
		var tmp1 = top.API.Cdm.StOutputStatus();
        var tmp2 = top.API.Cim.StInputStatus();
        if (tmp1 != "EMPTY" || tmp2 != "EMPTY") {            
            top.API.displayMessage("客户未取钞");
			strPRESENTRESULT = "客户未取钞"
            top.ErrorInfo = top.API.PromptList.No3;
            var arrTransactionResult = new Array("客户未取钞");
			top.API.gTakeCardAndPrint = true;
            top.API.Dat.SetDataSync("TRANSACTIONRESULT", "STRING", arrTransactionResult);
            return CallResponse('TimeOut');
        } else {
            if (nCompleteOrError) {
                return CallResponse('OK');
            } else {
                top.ErrorInfo = top.API.PromptList.No3;
                return CallResponse('TimeOut');
            }
        }
    }
    //Page Return
    
    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
		top.API.Cdm.CloseShutter(top.API.gCloseShutterTimeOut);
        App.Timer.ClearIntervalTime();
        App.Plugin.Voices.del();
		App.Timer.ClearTime();
    }
})();
