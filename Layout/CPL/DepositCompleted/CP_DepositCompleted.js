/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {
    var iniRet = "";
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        ButtonDisable();
        top.API.gTslResult = "SUCCESS";
        if(top.API.gTslFlag){
        	//“日期|时间|卡号|流水号|交易类型|金额|身份证号|身份证头像路径|交易结果”TSL数据库日志
            top.API.gTslFlag = false;
        	var TslLog = top.API.gTslDate;
        	TslLog += "|"+top.API.gTslTime;
        	TslLog += "|"+top.API.gCardno;
        	TslLog += "|"+top.API.gTslJnlNum;
        	TslLog += "|"+top.API.gTslChooseType;
        	TslLog += "|"+top.API.gTslMoneyCount;
        	TslLog += "|"+top.API.gIdNumber;
        	TslLog += "|"+top.API.gIdCardpic;
        	TslLog += "|"+top.API.gTslResult;
        	top.API.Tsl.AddTransLogSync(TslLog); //CreateUpJnlFile
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
            strUpJnl += "|!00|!交易成功";
            top.API.Tsl.HandleRecordFileSync(top.API.MTSL_WRITECHECKTRANSRECORD, strUpJnl);	
            
        }
		if (top.API.CashInfo.Dealtype == "DEP存款") {
	    	document.getElementById('INQ').style.display = "block";
		}
        top.API.Sys.ItemClearSync(top.API.MTRN_TRANSACTIONDIFFER);
        if (top.API.Ptr.bDeviceStatus && top.API.gNoPtrSerFlag==false && top.API.gShowPrintButton) {
            document.getElementById('Print').style.display = "block";
        }
        iniRet = top.API.Dat.GetPrivateProfileSync("TransactionConfig", "ContinueTransSupport", "1", top.API.gIniFileName);
        if (top.API.CashInfo.Dealtype == "无卡无折存款" || top.API.gbPartCashIn || iniRet==="0" || top.API.CashInfo.Dealtype == "对公存款"){
            document.getElementById('Continue').innerHTML = "结束";
        } else {
			document.getElementById('OK').style.display = "block";
			if(top.API.CashInfo.Dealtype == "存折存款"){
				document.getElementById('OK').innerHTML = "结束";
			}else{
				document.getElementById('OK').innerHTML = "退卡";
			}           
        }
		
        //获取存款总额
        var Amount = top.API.CashInfo.strTransAmount + ".00";
        document.getElementById("Amount").innerText=Amount;
        App.Plugin.Voices.play("voi_33");
        var arrTransactionResult;
        if (top.API.gbPartCashIn) {
            arrTransactionResult = new Array("部分入账");
			var arrComments = new Array("其他未入账金额，请联系银行工作人员");
		    top.API.Dat.SetDataSync("COMMENTS", "STRING", arrComments);
		    document.getElementById('Print').style.display = "none";
		    document.getElementById('Continue').style.display = "none";
		    top.API.Ptr.Print("ReceiptCash_Print_szABC", "",top.API.gPrintTimeOut);
        } else{
            arrTransactionResult = new Array("交易成功");
        }
		top.API.gTakeCardAndPrint = false;
		top.API.Dat.SetDataSync("TRANSACTIONRESULT", "STRING", arrTransactionResult);
        ButtonEnable();
    }();//Page Entry

    //@User ocde scope start
    function ButtonDisable() {
        document.getElementById('Print').disabled = true;
        document.getElementById('INQ').disabled = true;
        document.getElementById('OK').disabled = true;
        document.getElementById('Continue').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Print').disabled = false;
        document.getElementById('INQ').disabled = false;
        document.getElementById('OK').disabled = false;
        document.getElementById('Continue').disabled = false;
    }

    document.getElementById('Print').onclick = function () {
        ButtonDisable();
        top.API.gPrintFSN = false;
		return CallResponse("Print");
	}

    document.getElementById('INQ').onclick = function () {
        ButtonDisable();
		top.API.gTransactiontype = "INQ";
		//余额查询
        var arrBalanceInquiryType = new Array("NOTYPE");
        top.API.Dat.SetDataSync(top.API.BalanceInquiryTag, top.API.BalanceInquiryType, arrBalanceInquiryType);
        return CallResponse('INQ');
    }

    document.getElementById('OK').onclick = function () {
        ButtonDisable();
        return CallResponse("OK");
    }
    document.getElementById('Continue').onclick = function () {
        ButtonDisable();
        top.API.gArrUnitRemain = top.API.Cdm.CUNoteValue();
        top.API.gArrUnitStatus = top.API.Cim.CUStatus();
        //top.API.CashInfo.InitData();
        if (top.API.CashInfo.Dealtype == "无卡无折存款" || top.API.gbPartCashIn || iniRet==="0" || top.API.CashInfo.Dealtype == "对公存款" ){
            return CallResponse('Exit');
        } else {
            return CallResponse('NeedInitData');
        }
        
    }
    function TimeoutCallBack() {
        top.ErrorInfo = top.API.PromptList.No3;
        return CallResponse("TimeOut");
    }
    //Page Return
    
    //remove all event handler
    function Clearup() {
        App.Plugin.Voices.del();
        App.Timer.ClearTime();
    }
})();
