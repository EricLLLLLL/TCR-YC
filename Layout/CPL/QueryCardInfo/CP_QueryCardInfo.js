/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {
    var TransType = null;
    var keyFlag = 0; //辨别PINKEY、MACKEY标志位；1：PINKEY   2：MACKEY
    var NextPageFlag = 0; //流水跳转标志位；1：OK   2：TradeFailed
    var Pinkey = "";
    var MACkey = "";
    var strErrMsg = "交易成功";
    var Check = "";
    var JnlNum = null;//定义获取交易流水号变量
    var bReInput = false;
    var timeoutFlag = false;//是否已超时（页面超时、通讯超时）标志位
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        EventLogin();
        App.Plugin.Voices.play("voi_28");
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        top.ErrorInfo = top.API.PromptList.No1;
        SetCashUnitInfoToTCP();
        if (top.API.CashInfo.Dealtype == "无卡无折存款") {
            TransType = "QRYCUSTNAME";
        } else if (top.API.CashInfo.Dealtype == "对公存款") {
            TransType = "QRYBUSSINESSACCOUNT";
        }
        
		top.API.gTransactiontype = TransType;
        var arrCardNo = new Array(top.API.gCardno);
        //top.API.gCardno = strCardNo;
        var nRet = top.API.Dat.SetDataSync(top.API.cardnoTag, top.API.cardnoType, arrCardNo);
        top.API.displayMessage("SetDataSync CARDNO Return:" + nRet);
        //获取当前交易流水号，获取到后将值加1设置到JnlNum变量中
        var nRet1 = top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);
        top.API.displayMessage("GetPersistentData JNLNUM Return:" + nRet1);
    }();//Page Entry

    //@User ocde scope start

    //@User code scope end 
    function SetCashUnitInfoToTCP() {
        var strCounts = "";
        var strCurrency = "";
        var strInfo = "";
        for (i= 0; i < top.API.CashInfo.nCountOfUnits; i++) {
            switch (top.API.CashInfo.arrUnitCurrency[i]) {
                case 100:
                    strCurrency = "15650100";
                    break;
                case 50:
                    strCurrency = "15650050";
                    break;
                case 20:
                    strCurrency = "15650020";
                    break;
                case 10:
                    strCurrency = "15650010";
                    break;
                case 5:
                    strCurrency = "15650005";
                    break;
                case 1:
                    strCurrency = "15650001";
                    break;
                default:
                    strCurrency = "00000000";
                    break;
                }
            switch (top.API.CashInfo.arrUnitRemain[i].toString().length) {
                case 1:
                    strCounts = "000" + top.API.CashInfo.arrUnitRemain[i].toString();
                    break;
                case 2:
                    strCounts = "00" + top.API.CashInfo.arrUnitRemain[i].toString();
                    break;
                case 3:
                    strCounts = "0" + top.API.CashInfo.arrUnitRemain[i].toString();
                    break;
                case 4:
                    strCounts = top.API.CashInfo.arrUnitRemain[i].toString();
                    break;
                default:
                    strCounts = "0000";
                    break;
                }
                strInfo = strInfo + strCurrency + strCounts;
            }
        var arrDeviceState  = new Array(strInfo);
        var nRet = top.API.Dat.SetDataSync("DEVICESTATE", "STRING", arrDeviceState);
        top.API.displayMessage("SetDataSync DEVICESTATE Return:" + nRet);
    }
    //event handler
    /********************************************************************************************************/
    //FlowControl
    function TradeFailed() {
        top.API.displayMessage('TradeFailed()');
        if (strErrMsg != "交易成功") {
            top.ErrorInfo = strErrMsg + "!";
        }
        
		return CallResponse("TradeFailed");
    }

    function JournalPrint() {
        
        if (NextPageFlag == 1) {        
            return CallResponse("OK");
        }                        
       
        if (NextPageFlag == 2) {
            TradeFailed();
        }
        top.API.Jnl.PrintSync("QueryAccInfo");
        onJnlPrintComplete();
    }
    /********************************************************************************************************/
    //组包 
    function onCompositionDataCompleted(arrData) {
        top.API.displayMessage("onCompositionDataCompleted is done");
        var objArrData = arrData;
        top.API.Pin.GenerateMAC(objArrData, "MACKEY", '', 0,0);
    }

    function onCompositionDataFail() {
        top.API.displayMessage("onCompositionDataFail is done");
        strErrMsg = "通讯失败，交易结束";
        NextPageFlag = 2;
        JournalPrint();
    }

    function onMACGenerated(MacData) {
        top.API.displayMessage("onMACGenerated is done");
        var objMacData = MacData;
        top.API.Tcp.SendToHost(objMacData, 60000);
    }
    /********************************************************************************************************/
    //TCP模块    
    function onTcpSendFailed() {
        top.API.displayMessage("onTcpSendFailed is done");
        strErrMsg = "通讯失败，交易结束";
        NextPageFlag = 2;
        JournalPrint();
    }

    function onTcpOnRecved(tmpCheck) {
        Check = tmpCheck;
        top.API.gResponsecode = tmpCheck;
        top.API.displayMessage("onTcpOnRecved is done,Check:" + Check);
        var bSuccess = false;
        var ErrMsg = null;
        var nRet;
        switch (Check) {
            case '00':               
				 bSuccess = true;
                if (top.API.gTransactiontype == "QRYACCOUNTSTATE") {
                    //var arrTRANSACTIONTYPE = new Array("QRYCUSTNAME");
                    top.API.gTransactiontype = "QRYCUSTNAME";
					TransType = "QRYCUSTNAME";
                    //var nRet1 = top.API.Dat.SetDataSync(top.API.transactiontypeTag, top.API.transactiontypeType, arrTRANSACTIONTYPE);
                    //top.API.displayMessage("SetDataSync TRANSACTIONTYPE Return:" + nRet1);
                    var nRet1 = top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);
                    top.API.displayMessage("GetPersistentData JNLNUM Return:" + nRet1);
					JournalPrint();
                }else{
					var objGet1 = top.API.Dat.GetDataSync(top.API.customernameTag, top.API.customernameType);  					
					if (null == objGet1) {
						top.API.displayMessage("GetDataSync CUSTOMERNAME objGet = null");
						strErrMsg = "系统异常！";
					}else {											
						var arrGet1 = objGet1;         
						top.API.gCustomerName = arrGet1[0].toString().replace(/\s+/g, "");									
						if(top.API.gCustomerName != ""){									
							bSuccess = true;
							strErrMsg = "交易成功";
							NextPageFlag = 1;
							JournalPrint();
						}else{
							bSuccess = false;										
							strErrMsg = "该账号暂不能办理此项业务";
						}
					}
                    
                }
                break;
            case '01':
                strErrMsg =  "该账号暂不能办理此项业务";//"查询发卡银行";
                break;
            case '04':
                strErrMsg =  "银行卡异常,即将回收";//"没收卡";
                break;
            case '12':
                strErrMsg = "暂不能办理此项业务";//"无效交易";
                break;
            case '13':
                strErrMsg = "无效的交易金额";//"无效金额";
                break;
            case '14':
                strErrMsg = "该卡不支持";//"无效卡号";
                break;
            case '15':
                strErrMsg = "服务取消,请与发卡行联系";//"无此发卡方";
                break;
            case '30':
                strErrMsg = "服务因故未能完成,请联系银行!";//"交易报文错";
                break;
            case '33':
                strErrMsg = "卡已过期,即将回收";//"过期的卡";
                break;
            case '38':
                strErrMsg = "密码错误超次数";//"超过允许的PIN试输入（没收卡）";
                break;
            case '41':
                strErrMsg = "账户已冻结,即将回收";//"挂失卡（没收卡）";
                break;
            case '43':
                strErrMsg = "非法账户,即将回收";//"被窃卡（没收卡）";
                break;
            case '51':
                strErrMsg = "余额不足";//"资金不足";
                break;
            case '54':
                strErrMsg = "卡已过期";//"过期的卡";
                break;
            case '55':
                bReInput = true;
                strErrMsg = "您输入的密码不正确";
                break;
            case '65':
                strErrMsg = "已超当日可取款次数";//"超出取现次数限制";
                break;
            case '75':
                strErrMsg = "密码错误超次数";//"允许的输入PIN次数超限";
                break;
            case '89':
                strErrMsg = "无效终端";//"无效终端";
                break;
            case '90':
                strErrMsg = "服务因故未能完成";//"日期切换正在处理";
                break;
            case '91':
                strErrMsg = "服务因故未能完成,请联系银行";//"发卡方或交换中心不能操作";
                break;
            case '96':
                strErrMsg = "服务因故未能完成,请联系银行";//"系统异常、失效";
                break;
            default:
                strErrMsg = "服务因故未能完成,请联系银行";//"交易异常";
                break;
        };
        if (!bSuccess) {
            NextPageFlag = 2;
            JournalPrint();
        }
    }

    function onTcpTimeout() {
        top.API.displayMessage("onTcpTimeout is done,TransType=" + TransType);       
        if (!timeoutFlag) {
            timeoutFlag = true;
            strErrMsg = "通讯超时，交易结束";
            if (TransType == "CWD") {
                var arrCWCFlag = new Array();
                arrCWCFlag[0] = 1;
                var nRet1 = top.API.Dat.SetPersistentData(top.API.cwcflagTag, top.API.cwcflagType, arrCWCFlag);
                top.API.displayMessage('冲正标志位：SetPersistentData CWCFLAG Return:' + nRet1);
            } else {                
                NextPageFlag = 2;
                JournalPrint();
            }
        }
    }
	
	function onAnalysisFailed() {
        top.API.displayMessage("onAnalysisFailed is done,TransType=" + TransType);       
		strErrMsg = "报文解析失败，交易结束";
		if (TransType == "CWD") {
			var arrCWCFlag = new Array();
			arrCWCFlag[0] = 1;
			var nRet1 = top.API.Dat.SetPersistentData(top.API.cwcflagTag, top.API.cwcflagType, arrCWCFlag);
			top.API.displayMessage('冲正标志位：SetPersistentData CWCFLAG Return:' + nRet1);
		} else {                
			NextPageFlag = 2;
			JournalPrint();
		}
        
    }
	
    /********************************************************************************************************/
    //检测是否需要重新下载工作密钥
    function CheckKey() {
        var objGetPinKey = top.API.Dat.GetDataSync("PINKEY", "STRING");
        var objGetMACKey = top.API.Dat.GetDataSync("MACKEY", "STRING");
        if (null == objGetPinKey || null == objGetMACKey) {
            top.API.displayMessage("GetDataSync WorKKey objGet = null");
            return false;
        }
        else {
            top.API.displayMessage("GetDataSync objGetPinKey Return:" + objGetPinKey);
            top.API.displayMessage("GetDataSync objGetMACKey Return:" + objGetMACKey);
            var arrGetPinKey = objGetPinKey;
            var arrGetMACKey = objGetMACKey;
            PinKey = arrGetPinKey[0];
            MACKey = arrGetMACKey[0];
            if (PinKey == "" || MACKey == "") {
                return false;
            } else {
                return true;
            }
        }
    }

    function DownPinKey() {
        top.API.displayMessage("下载PINKEY");
        keyFlag = 1;
        var HexWorkKey = top.stringToHex(PinKey);
        var tmphexArray = new Array();
        top.API.Pin.ExtendedLoadEncryptedKey("PINKEY", HexWorkKey, "MasterKey", "CRYPT,FUNCTION,MACING,KEYENCKEY", tmphexArray);
    }

    function DownMACKey() {
        top.API.displayMessage("下载MACKEY");
        keyFlag = 2;
        var HexWorkKey = top.stringToHex(MACKey);
        var tmphexArray = new Array();
        top.API.Pin.ExtendedLoadEncryptedKey("MACKEY", HexWorkKey, "MasterKey", "CRYPT,MACING", tmphexArray);
    }

    function onKeyLoaded() {
        top.API.displayMessage('触发事件：onKeyLoaded()');
        if (keyFlag == 1) {
            top.API.displayMessage('下载PINKEY成功');
            DownMACKey();
        } else {
            top.API.displayMessage('下载MACKEY成功');
            NextPageFlag = 1;
            JournalPrint();
        }
    }
    //event handler
    function onDeviceError() {
        top.API.displayMessage('键盘触发事件：onDeviceError()');
        strErrMsg = "系统故障";
        NextPageFlag = 2;
        JournalPrint();
    }
     function onKeyLoadFailed() {
        top.API.displayMessage('键盘触发事件：onKeyLoadFailed()');
        strErrMsg = "系统故障";
        NextPageFlag = 2;
        JournalPrint();
    }
    /********************************************************************************************************/    
    //永久数据模块
    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        var arrDataValue = DataValue;
        top.API.displayMessage("onDatGetPersistentDataComplete is done,DataName=" + DataName + ",DataType=" + DataType + ",DataValue=" + arrDataValue[0]);
        if ('JNLNUM' == DataName) {           
            JnlNum = arrDataValue[0] + 1;
            if (JnlNum.toString().length === 7) {
                JnlNum = 0;
            }
            //设置交易流水号
            var arrJnlNum = new Array();
            arrJnlNum[0] = JnlNum;
            nRet1 = top.API.Dat.SetPersistentData(top.API.jnlnumTag, top.API.jnlnumType, arrJnlNum);
            top.API.displayMessage('交易流水号：SetPersistentData JNLNUM Return:' + nRet1 + '，JNLNUM = '+JnlNum);     
        }
    }

    function onDatGetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatGetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        NextPageFlag = 2;
        JournalPrint();
    }

    function onDatSetPersistentDataComplete(DataName) {
        top.API.displayMessage("onDatSetPersistentDataComplete is done,DataName=" + DataName);       
        top.API.Tcp.CompositionData(TransType);
        /*var nRet;  
        if ('JNLNUM' == DataName) {
            if (TransType == "CWD") {
                //设置冲正流水号
                var arrCWCJNLNUM = new Array();
                arrCWCJNLNUM[0] = JnlNum;
                nRet = top.API.Dat.SetPersistentData(top.API.cwcjnlnumTag, top.API.cwcjnlnumType, arrCWCJNLNUM);
                top.API.displayMessage('冲正流水号：SetPersistentData CWCJNLNUM Return:' + nRet1);
            }else{
                top.API.Tcp.CompositionData(TransType);
            }
        }
        //修改获取永久数据成功标志位
        if ('CWCJNLNUM' == DataName) {
            top.API.Tcp.CompositionData(TransType);
        }

        if ('CWCFLAG' == DataName) {
            if(TransType == "CWD"){
                //设置冲正原因
                var arrCWCREASON = new Array();
                arrCWCREASON[0] = 1;
                nRet = top.API.Dat.SetPersistentData(top.API.cwcreasonTag, top.API.cwcreasonType, arrCWCREASON);
                top.API.displayMessage('冲正原因：SetPersistentData CWCREASON Return:' + nRet);
            }    
        }
        if ('CWCREASON' == DataName) {                      
            NextPageFlag = 2;
            JournalPrint();
        }     */
    }

    function onDatSetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatSetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        NextPageFlag = 2;
        JournalPrint();
        onJnlPrintComplete();
    }
    /********************************************************************************************************/
    //JNL模块
    function onJnlPrintComplete() {
        top.API.displayMessage("onJnlPrintComplete is done");
        if (NextPageFlag == 1) {
            if (TransType == "CWC"){
                return CallResponse("CWC");
            }else{
                if ((TransType == "DEP") || (TransType == "CWD") ) {
                    var arrTransactionResult  = new Array("交易成功");
					top.API.gTakeCardAndPrint = false;
                    var nRet = top.API.Dat.SetDataSync("TRANSACTIONRESULT", "STRING", arrTransactionResult);
                    top.API.displayMessage("SetDataSync TRANSACTIONRESULT Return:" + nRet);
                }
                if (top.API.gMixSelfCWD) {
                    return CallResponse("EXCWD");
                }else{
                    return CallResponse("OK");
                }                
            }
        }
        if (NextPageFlag == 2) {
            TradeFailed();
        }
       // return CallResponse('OK');
    }
    /********************************************************************************************************/    
    //Register the event
    function EventLogin() {
        top.API.Tcp.addEvent("SendFailed", onTcpSendFailed);
        top.API.Tcp.addEvent("OnRecved", onTcpOnRecved);
        top.API.Tcp.addEvent("CompositionDataCompleted", onCompositionDataCompleted);
        top.API.Tcp.addEvent("CompositionDataFail", onCompositionDataFail);
        top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.addEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.addEvent("SetPersistentDataError", onDatSetPersistentDataError);
        top.API.Pin.addEvent("MACGenerated", onMACGenerated);
        top.API.Tcp.addEvent("Timeout", onTcpTimeout);
		top.API.Tcp.addEvent("AnalysisFailed", onAnalysisFailed);

        top.API.Pin.addEvent('KeyLoaded', onKeyLoaded);
        top.API.Pin.addEvent('KeyLoadFailed', onKeyLoadFailed); 
        top.API.Pin.addEvent('DeviceError ', onDeviceError);

    }

    function EventLogout() {
        top.API.Tcp.removeEvent("SendFailed", onTcpSendFailed);
        top.API.Tcp.removeEvent("OnRecved", onTcpOnRecved);
        top.API.Tcp.removeEvent("CompositionDataCompleted", onCompositionDataCompleted);
        top.API.Tcp.removeEvent("CompositionDataFail", onCompositionDataFail);
        top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.removeEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.removeEvent("SetPersistentDataError", onDatSetPersistentDataError)
        top.API.Pin.removeEvent("MACGenerated", onMACGenerated);
        top.API.Tcp.removeEvent("Timeout", onTcpTimeout);
		top.API.Tcp.removeEvent("AnalysisFailed", onAnalysisFailed);
		
        top.API.Pin.removeEvent('KeyLoaded', onKeyLoaded);
        top.API.Pin.removeEvent('KeyLoadFailed', onKeyLoadFailed); 
        top.API.Pin.removeEvent('DeviceError ', onDeviceError);

    }

    //Countdown function
    function TimeoutCallBack() {
        top.API.displayMessage("TimeoutCallBack is done,TransType=" + TransType);       
        if (!timeoutFlag) {
            timeoutFlag = true;
            strErrMsg = "通讯超时，交易结束";
            if (TransType == "CWD") {
                var arrCWCFlag = new Array();
                arrCWCFlag[0] = 1;
                var nRet1 = top.API.Dat.SetPersistentData(top.API.cwcflagTag, top.API.cwcflagType, arrCWCFlag);
                top.API.displayMessage('冲正标志位：SetPersistentData CWCFLAG Return:' + nRet1);
            } else {                
                 NextPageFlag = 2;
                 JournalPrint();
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
    }
})();