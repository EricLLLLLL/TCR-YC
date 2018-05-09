/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {
    var bHaveCard = true;
	var bCloseService = false;
    var strCallResponse = "";
	var warnTimer=0;
	var soundObj;
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
		if(warnTimer!=0){
			window.clearTimeout(warnTimer);
			if( soundObj != null ){
				document.body.removeChild(soundObj);
			}
		}
        top.API.Siu.SetCardReaderLight('OFF');
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        EventLogin();
        //写入TslLog
        if(top.API.gTslFlag && top.API.gTslResult != "SUCCESS"){
        	//“日期|时间|卡号|流水号|交易类型|金额|身份证号|身份证头像路径|交易结果”
        	var TslLog = top.API.gTslDate;
        	TslLog += "|"+top.API.gTslTime;
        	TslLog += "|"+top.API.gCardno;
        	TslLog += "|"+top.API.gTslJnlNum;
        	TslLog += "|"+top.API.gTslChooseType;
        	TslLog += "|"+top.API.gTslMoneyCount;
        	TslLog += "|"+top.API.gIdNumber;
        	TslLog += "|"+top.API.gIdCardpic;
        	TslLog += "|"+top.API.gTslResult;
        	top.API.Tsl.AddTransLogSync(TslLog);   
            //终端号（8位），交易日期（8位），交易时间（6位），交易类型（4位，0107代表存款，0108代表取款），
            //帐号（19位），交易金额（10位包含两位小数位），设备流水号（6位），设备流水批次号（6位），
            //后台返回码（2位），后台返回流水号（12位），设备交易状态（2位，00代表交易成功，01代表异常交易），异常状态类型（4位）
            var strUpJnl = top.API.gTerminalID;  
            strUpJnl += "|!"+top.API.gTslDate;  
            strUpJnl += "|!"+top.API.gTslTime;  
            strUpJnl += "|!"+top.API.gTslChooseJnlType;  
            strUpJnl += "|!"+top.API.gCardno; 
            strUpJnl += "|!"+top.API.gTslMoneyCount.replace(".","");  
            strUpJnl += "|!"+top.API.gTslJnlNum;  
            strUpJnl += "|!"+top.API.gTslJnlBtn;  
            strUpJnl += "|!"+top.API.gTslResponsecode;  
            strUpJnl += "|!"+top.API.gTslSysrefnum;
            strUpJnl += "|!01|!交易失败";
            top.API.Tsl.HandleRecordFileSync(top.API.MTSL_WRITECHECKTRANSRECORD, strUpJnl);
        }
        document.getElementById("tip_label").innerText = top.ErrorInfo;
        document.getElementById("tip_label1").style.display = "block";
        document.getElementById("tip_button").style.display = "block";
        if (top.ErrorInfo == top.API.PromptList.No1) {
            document.getElementById("tip_button").style.backgroundImage = "url('Framework/style/Graphics/box_ico_3.png')";            
        }else{
            document.getElementById("tip_button").style.backgroundImage = "url('Framework/style/Graphics/box_ico_2.png')";            
        }   
        //获取交易结果
        var objGetTransaction = top.API.Dat.GetDataSync("TRANSACTIONRESULT", "STRING");
        if (objGetTransaction == "" || null == objGetTransaction) {
            top.API.displayMessage("GetDataSync TRANSACTIONRESULT  objGetDealType = null 读取失败");
        }
        else {
            top.API.displayMessage("GetDataSync TRANSACTIONRESULT Return:" + objGetTransaction);
            var arrGetTransaction = objGetTransaction;
            if ("部分入账" != arrGetTransaction[0] && "交易成功" != arrGetTransaction[0] && arrGetTransaction[0] != ""){
            if (!top.API.gbPartCashIn && top.API.Ptr.bDeviceStatus && top.API.gNoPtrSerFlag==false) {
                top.API.Ptr.Print("ReceiptCash_Print_szABC", "",top.API.gPrintTimeOut);//comment by grb
                }
            }
        }

        if ("PRESENT" == top.API.Crd.StMediaStatus()) {
            top.API.displayMessage("PRESENT == top.API.Crd.StMediaStatus()");
            PlayVoice(bHaveCard);
            //add by hj 退卡播放滴滴滴 start---
            warnTimer=window.setTimeout(function(){playWarning()}, 15000);
            App.Timer.SetPageTimeout(60);
            App.Timer.TimeoutDisposal(TimeoutCallBack);
            top.API.Crd.Eject(60000);
            document.getElementById("tip_label2").style.display = "block";
        }else {
            bHaveCard = false;
            PlayVoice(bHaveCard);
            var iniRet = top.API.Dat.GetPrivateProfileSync("TransactionConfig", "CWCSupport", "0", top.API.gIniFileName);  
            if ((top.API.CashInfo.Dealtype == "存折取款") && iniRet == "1") {
                top.API.displayMessage("判断存折取款冲正标志位");
                var nRet = top.API.Dat.GetPersistentData(top.API.cwcflagTag, top.API.cwcflagType);
                top.API.displayMessage("GetPersistentData CWCFLAG Return:" + nRet);
            }else{
                App.Timer.SetPageTimeout(8);       
                App.Timer.TimeoutDisposal(TimeoutCallBack);
            }            
        }       
        
    }();//Page Entry

    //@User ocde scope start
    function playWarning() {
		top.API.displayMessage("playWarning ======");
		var obj = document.createElement("bgsound");
            obj.id = "ModuleSound";
            obj.src = "Framework/Plugin/Voice/Sound/Forget_Beep_New.wav";
            obj.autoplay = true;
            obj.loop = "-1";
            soundObj = obj;
            document.body.appendChild(soundObj);
            
    }

    function PlayVoice(bCard) {
        top.API.displayMessage(top.ErrorInfo);
        switch(top.ErrorInfo) {
        case top.API.PromptList.No1:
            if (bCard) {
                App.Plugin.Voices.play("voi_29");
            }else{
                App.Plugin.Voices.play("voi_33");
            }
        	break;
        case top.API.PromptList.No2:
            if (bCard) {
                App.Plugin.Voices.play("voi_19");
            }else{
                App.Plugin.Voices.play("voi_30");
            }
        	break;
         case top.API.PromptList.No3:
            if (bCard) {
                App.Plugin.Voices.play("voi_17");
            }else{
                App.Plugin.Voices.play("voi_18");
            }
        	break;
        case top.API.PromptList.No4:
            if (bCard) {
                App.Plugin.Voices.play("voi_23");
            }else{
                App.Plugin.Voices.play("voi_23");
            }
        	break;
        case top.API.PromptList.No5:
            if (bCard) {
                App.Plugin.Voices.play("voi_25");
            }else{
                App.Plugin.Voices.play("voi_24");
            }
        	break;
         case top.API.PromptList.No6:
            if (bCard) {
                App.Plugin.Voices.play("voi_2");
            }
        	break;
        case top.API.PromptList.No7:
            if (bCard) {
                App.Plugin.Voices.play("voi_31");
            }
        	break;
        case top.API.PromptList.No8:
            if (bCard) {
                //App.Plugin.Voices.play("voi_32");
            }
        	break;
        default:
            App.Plugin.Voices.play("voi_2");
            break;
    }
	}

    //@User code scope end 

    //event handler
    function onExit() {
        top.API.displayMessage("直接退出");
        strCallResponse = "Exit";
        bCloseService = true;
        onServiceOpened();
    }

    function onCardEjected() {
        top.API.Siu.SetCardReaderLight('SLOW');
    }

    function onCardEjectFailed() {
        top.API.displayMessage("onCardEjectFailed");
        strCallResponse = "Exit";
        bCloseService = true;
        onServiceOpened();
    }

    function onCardTaken() {
        top.API.displayMessage("onCardTaken触发");
        top.API.Jnl.PrintSync("TakeCardAction");
		//add by tsx begin判断是否冲正
        var iniRet = top.API.Dat.GetPrivateProfileSync("TransactionConfig", "CWCSupport", "0", top.API.gIniFileName);        
        //add by tsx end
        if (top.API.CashInfo.Dealtype == "CWD取款" && (iniRet == "1")) {
            top.API.displayMessage("判断冲正标志位");
            bHaveCard = false;
            var nRet = top.API.Dat.GetPersistentData(top.API.cwcflagTag, top.API.cwcflagType);
            top.API.displayMessage("GetPersistentData CWCFLAG Return:" + nRet);
        }else{
            top.API.displayMessage("直接退出");
            strCallResponse = "Exit";
			bCloseService = true;
            onServiceOpened();
        }
    }
    //event handler
    function onCardCaptured() {

    }

    function onStatusChanged() {

    }
    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
		if ('CWCFLAG' == DataName) {
        var flag_CWC = DataValue;
        top.API.displayMessage("onDatGetPersistentDataComplete is done,DataName=" + DataName + ",DataType=" + DataType + ",DataValue=" + flag_CWC[0]);
			if (flag_CWC[0] === 1) {
            if (top.API.CashInfo.Dealtype == "CWD取款" || top.API.CashInfo.Dealtype == "存折取款"){
                var nRet;
                //若为取款交易，设置发送取款冲正报文的标志位
                top.API.gTransactiontype = "CWC";                
                //跳转之前设置冲正标志位为0
                var arrCWCFlag = new Array();
                arrCWCFlag[0] = 0;
                nRet = top.API.Dat.SetPersistentData(top.API.cwcflagTag, top.API.cwcflagType, arrCWCFlag);
                top.API.displayMessage('设置冲正标志位为0：SetPersistentData CWCFLAG Return:' + nRet);
            }
			} else {
				strCallResponse = "Exit";
				bCloseService = true;
				onServiceOpened();
        }
		}
    }
    function onDatGetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatGetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        strCallResponse = 'Exit';
		bCloseService = true;
        onServiceOpened();
    }

    function onDeviceError() {
        top.API.displayMessage("onDeviceError");
        strCallResponse = "Exit";
        bCloseService = true;
        onServiceOpened();
    }

    function onPrintFailed() {
        top.API.displayMessage("onPrintFailed");
        strCallResponse = "Exit";
        bCloseService = true;
        onServiceOpened();
    }

    function onDatSetPersistentDataComplete(DataName) {
        top.API.displayMessage("onDatSetPersistentDataComplete is done,DataName=" + DataName);      
        if ('CWCFLAG' == DataName) {
           strCallResponse = "CWC";
		   bCloseService = true;
           App.Timer.SetPageTimeout(8);       
           App.Timer.TimeoutDisposal(TimeoutCallBack);
        }
    }

    function onDatSetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("读取失败---onDatSetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
    }

    function onPrintComplete() {
        top.API.displayMessage("onPrintComplete触发,响应<OK>");
    }

    //event handler
    function onPrintEjected() {
        top.API.displayMessage("onPrintEjected触发");
    }
    //event handler
    function onEjectTimeout() {
        top.API.displayMessage("onEjectTimeout触发,响应<TimeOut>");
    }
    //event handler
    function onPtrDeviceError() {
        top.API.displayMessage("onPtrDeviceError触发");
    }
    //event handler
    function onPrintTaken() {
        top.API.displayMessage("onPrintTaken触发,响应<OK>");
    }

    function onServiceOpened(){
        top.API.displayMessage("触发onServiceOpened,bCloseService"+bCloseService);  
		if (bCloseService) {
			return CallResponse(strCallResponse);
		}	        
    }
    //Register the event
    function EventLogin() {
        top.API.Crd.addEvent("CardEjected", onCardEjected);
        top.API.Crd.addEvent("CardEjectFailed", onCardEjectFailed);
        top.API.Crd.addEvent("CardTaken", onCardTaken);
        //top.API.Crd.addEvent("CardCaptured", onCardCaptured)
        top.API.Crd.addEvent("StatusChanged", onStatusChanged);
        top.API.Crd.addEvent("DeviceError", onDeviceError);
        top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.addEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.addEvent("SetPersistentDataError", onDatSetPersistentDataError);
        ///////
        top.API.Ptr.addEvent("PrintComplete", onPrintComplete);
        top.API.Ptr.addEvent("PrintFailed", onPrintFailed);
        top.API.Ptr.addEvent("PrintEjected", onPrintEjected);
        top.API.Ptr.addEvent("Timeout", onEjectTimeout);
        top.API.Ptr.addEvent("DeviceError", onPtrDeviceError);
        top.API.Ptr.addEvent("PrintTaken", onPrintTaken);
        /////
        //top.API.Sys.addEvent('ServiceOpened',onServiceOpened);//modify by tsx 取消后屏检测
    }

    function EventLogout() {
        top.API.Crd.removeEvent("CardEjected", onCardEjected);
        top.API.Crd.removeEvent("CardEjectFailed", onCardEjectFailed);
        top.API.Crd.removeEvent("CardTaken", onCardTaken);
        //top.API.Crd.removeEvent("CardCaptured", onCardCaptured);
        top.API.Crd.removeEvent("StatusChanged", onStatusChanged);
        top.API.Crd.removeEvent("DeviceError", onDeviceError);
        top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.removeEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.removeEvent("SetPersistentDataError", onDatSetPersistentDataError);
        ///////
        top.API.Ptr.removeEvent("PrintComplete", onPrintComplete);
        top.API.Ptr.removeEvent("PrintFailed", onPrintFailed);
        top.API.Ptr.removeEvent("PrintEjected", onPrintEjected);
        top.API.Ptr.removeEvent("Timeout", onEjectTimeout);
        top.API.Ptr.removeEvent("DeviceError", onPtrDeviceError);
        top.API.Ptr.removeEvent("PrintTaken", onPrintTaken);
        ////////
        //top.API.Sys.removeEvent('ServiceOpened',onServiceOpened);//modify by tsx 取消后屏检测    
    }

    //Countdown function
    function TimeoutCallBack() {
        if (bHaveCard) {
            top.API.displayMessage("超时吞卡");            
            strCallResponse = "Capture";
            bCloseService = true;
            onServiceOpened();
        }else{
            top.API.displayMessage("TimeoutCallBack");
            if (strCallResponse == "CWC") {
                onServiceOpened();
            }else{
                strCallResponse = "Exit";
                bCloseService = true;
                onServiceOpened();
            }
        }
    }
    //Page Return
    
    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
        App.Plugin.Voices.del();
        App.Timer.ClearTime();
        // App.Plugin.Wait.disappear();
    }
    //@User ocde scope start

})();