/*@create by:  LeoLei
*@time: 2017年09月05日
*/
; (function () {
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        top.API.Siu.SetReceiptPrinterLight('OFF');
        top.ErrorInfo = top.API.PromptList.No4;
        Clearup();
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        App.Timer.TimeoutDisposal(TimeoutCallBack);
		//RecordTsl();
		CheckAcceptStatus();//检测目前存款模块AcceptStatus
        //initPtr();
    }(); //Page Entry
 
    //@User ocde scope start
	function RecordTsl() {
		//写入TslLog
        if(top.API.gTslFlag && top.API.gTslResult != "SUCCESS"){
			top.API.gTslFlag = false;
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
           // top.API.Tsl.CreateUpJnlFile(strUpJnl); //
            //top.API.Tsl.HandleRecordFileSync(top.API.MTSL_WRITECHECKTRANSRECORD, strUpJnl);
        }
	}
    function initPtr() {
		App.Plugin.Voices.play("voi_8");
		// var objGet1 = top.API.Dat.GetDataSync("COMMENTS", "STRING");
		// var arrGet1 = objGet1;
        //
		// var objGet = top.API.Dat.GetDataSync("TRANSACTIONRESULT", "STRING");
		// if (null == objGet) {
		// 	top.API.displayMessage("GetDataSync TRANSACTIONRESULT objGet = null");
		// }else {
			//var arrGet =  objGet;
			// if(arrGet[0]!= "失败"){
			// 	document.getElementById("tip_label").innerHTML = arrGet[0] +"<br/>"+arrGet1[0];
			// }else{
			// 	document.getElementById("tip_label").innerHTML = arrGet1[0];
			// }
			//$('#tip_label').text('正在上传故障信息，请稍后！');
		// }
		//document.getElementById("tip_label").style.display = "block";
		if (top.API.Ptr.bDeviceStatus && top.API.gNoPtrSerFlag==false) {
			top.API.Ptr.Print("ReceiptCash_Print_szABC", "",top.API.gPrintTimeOut); 
		}
        //return CallResponse("Exit");
	}
	
	function CheckAcceptStatus() {
		//检测目前存款模块AcceptStatus
top.API.displayMessage("LastAcceptStatus=1");
        var strAcceptStatus = top.API.Cim.LastAcceptStatus();
        top.API.displayMessage("LastAcceptStatus=" + strAcceptStatus);
        if (strAcceptStatus == "ACTIVE") {
			top.API.displayMessage("执行CashInEnd");
			//执行CashInEnd
            top.API.Cim.StoreEscrowedCash(top.API.gStoreEscrowedCashTimeOut);
        } 
	}
    //Countdown function
    function TimeoutCallBack() {
        return CallResponse("TimeOut");
    }
    //Page Return
    
    //remove all event handler
    function Clearup() {
        App.Plugin.Voices.del();
        App.Timer.ClearTime();
    }
})();