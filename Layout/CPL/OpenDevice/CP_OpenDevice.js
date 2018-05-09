/*@create by:  tsxiong
*@time: 2016年03月20日
*/
;(function () {
    var keyFlag = 0; //辨别PINKEY、MACKEY标志位；1：PINKEY   2：MACKEY
    var Pinkey = "";
    var MACkey = "";
    var MasterKey = "";
    var nConnectTimes = 1;
    var JnlNum = 0; //记流水,交易流水号
    var Check = ""; //记流水,交易响应码
    var strMsg = ""; //记流水,交易信息
    var bJnl = true; //是否第一次完成Jnl
    var nKeyNum = 0;
    var perLicensing = "";//人脸识别第一次发送ajax参数 通过接口火气C2V的值 如果为空字符串则正常  如果不为空则需要发送
    var license = "";//最终返回的校验信息值
    var TfcConnectSuccess = false;
    var LicensingURI = "";
    var setLicenseCount = 0;//设置校验文件次数，如果超过三次则停止设置
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response); 
    });
    var Initialize = function () {
        EventLogin();
        if (top.API.gSubBankNum == "") {
            top.API.gSubBankNum = top.API.Dat.GetPersistentDataSync("SUBBANKNUM", "STRING")[0];
        }

        if (top.API.gTerminalID == "") {
            top.API.gTerminalID = top.API.Dat.GetPersistentDataSync("TERMINALNUM", "STRING")[0];
        }

        LicensingURI = top.API.Dat.GetPrivateProfileSync("IdentityAudit", "LicensingURI", "", top.API.Dat.GetBaseDir() + top.API.gIniFileName);
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        var temp = top.API.Dat.GetPersistentDataSync(top.API.FIRSTADMINTag, "STRING")[0];

        if (top.FirstOpenFlag) {
            top.API.OpenDevice();
        } else {
            if(temp != "1"){
                InitialDevice();
            }else{
                return CallResponse("OffLine");
            }
        }
        top.API.Sys.SetMainProcessSync();
    } (); //Page Entry
	
    //@User ocde scope start
    function CheckOpenStatus() {
        if (top.API.Crd.bOpenDevice && top.API.Pin.bOpenDevice
            && top.API.Ptr.bOpenDevice && top.API.Idr.bOpenDevice && top.API.Fpi.bOpenDevice
             && top.API.Cim.bOpenDevice && top.API.Cdm.bOpenDevice && top.API.Siu.bOpenDevice && top.API.Scr.bOpenDevice) {
            top.FirstOpenFlag = false; //已经全部打开过
            InitialDevice(); //进行初始化
        }
    }

    function InitialDevice() {
        top.API.CheckDeviceStatus(); //检测各个部件状态
		top.API.gVersion = top.API.Dat.GetPrivateProfileSync("Version", "APVer", "", top.API.Dat.GetBaseDir()+"/TCR/HMAP_Ver.ini");
		top.API.gOrderCWDFlag = top.API.Dat.GetPrivateProfileSync("TransactionConfig", "bOrderCWD", "0", top.API.Dat.GetBaseDir()+top.API.gIniFileName);
		var tmp1 = top.API.Cdm.StOutputStatus();
        var tmp2= top.API.Cim.StInputStatus();
        if (tmp1 != "EMPTY" || tmp2 != "EMPTY") {
            top.API.displayMessage("出钞口InputOutputStatus="+tmp1 + "入钞口InputOutputStatus="+tmp2);
            
            return CallResponse("OffLine");
        }

        if (top.API.Pin.bDeviceStatus) {
            
            if (top.API.Pin.KeyIsValidSync("InitKey")) {
                top.API.displayMessage("初始密钥存在");
                //if ("NOTPRESENT" != top.API.Crd.StMediaStatus()) {//待修正4
                //    top.API.Crd.Eject(-1);
				//	top.API.Jnl.PrintSync("ErrorEjectCardAction"); 	
					//return CallResponse("OffLine");					
               // }
                top.API.CashInfo.bCASH = true;
				//modify by tsx  临时方案 获取3次钞箱信息
				for(var i=0; i<3;i++){
					var tmpPUCurrentCount = top.API.Cdm.PUCurrentCount();
					var tmpCUNoteValue = top.API.Cdm.CUNoteValue();
					if(tmpPUCurrentCount != null  && tmpCUNoteValue != null){
						//获取当前钞箱信息--钞箱余量
						top.API.CashInfo.arrUnitRemain = top.API.GetUnitInfo(tmpPUCurrentCount);
						//获取当前钞箱信息--钞箱面值
						top.API.CashInfo.arrUnitCurrency = top.API.GetUnitInfo(tmpCUNoteValue);
						//获取当前钞箱信息--钞箱个数
						top.API.CashInfo.nCountOfUnits = top.API.CashInfo.arrUnitRemain.length;
						break;
					}else if(i == 2){
                        top.API.displayMessage("获取钞箱信息失败！"
                    );
						
						return CallResponse("OffLine");
					}					
				}
                top.API.CashInfo.nCountOfUnits = top.API.CashInfo.arrUnitCurrency.length;
                if (top.API.CashInfo.nCountOfUnits < 5) {
                    return CallResponse("OffLine");
                }
				//检测目前存款模块AcceptStatus
				var strAcceptStatus = top.API.Cim.LastAcceptStatus();
				top.API.displayMessage("LastAcceptStatus=" + strAcceptStatus);
				if (strAcceptStatus == "ACTIVE") {
					top.API.displayMessage("执行CashInEnd");
					//执行CashInEnd
					top.API.Cim.StoreEscrowedCash(top.API.gStoreEscrowedCashTimeOut);
				} 
                //获取清机标志
                var nRet1 = top.API.Dat.GetPersistentData("TOTALADDOK", "LONG");                
            } else {                
				top.API.Jnl.PrintSync("MasterKeyError"); 
				top.API.displayMessage("初始秘钥异常，请通过UKEY重新导入初始秘钥");
                return CallResponse("OffLine");
            }
        } else {
			//修正7--  加form
            top.API.displayMessage("键盘打开异常，停止服务");//键盘打开异常，停止服务
            
            return CallResponse("OffLine");
        }
    }
    //@User code scope end
    //Open START
    function onCrdConnectionOpened() {
        top.API.displayMessage("onCrdConnectionOpened is done");
        top.API.Crd.bOpenDevice = true;
        CheckOpenStatus();

    }

    function onPinConnectionOpened() {
        top.API.displayMessage("onPinConnectionOpened is done");
        top.API.Pin.bOpenDevice = true;
        CheckOpenStatus();
    }

    function onPtrConnectionOpened() {
        top.API.displayMessage("onPtrConnectionOpened is done");    
        top.API.Ptr.bOpenDevice = true;
        CheckOpenStatus();
    }

    function onCimConnectionOpened() {
        top.API.displayMessage("onCimConnectionOpened is done"); 
        top.API.Cim.bOpenDevice = true;
        CheckOpenStatus();
    }


    function onIdrConnectionOpened() {
        top.API.displayMessage("onIdrConnectionOpened is done"); //,执行<top.API.Idr.Reset(RETRACT, 4)>    
        top.API.Idr.bOpenDevice = true;
        CheckOpenStatus();
    }

    function onFpiConnectionOpened() {
        top.API.displayMessage("onFpiConnectionOpened is done"); //,执行<top.API.Fpi.Reset(RETRACT, 4)>  
        top.API.Fpi.bOpenDevice = true;
        CheckOpenStatus();

    }

    function onCdmConnectionOpened() {
        top.API.displayMessage("onCdmConnectionOpened is done"); //,执行<top.API.Cim.Reset(RETRACT, 4)>
        top.API.Cdm.bOpenDevice = true;
        CheckOpenStatus();
    }

    function onScrConnectionOpened() {
        top.API.displayMessage("onScrConnectionOpened is done");
        top.API.Scr.bOpenDevice = true;
        CheckOpenStatus();
    }


    //不做状态改变事件处理
    function onSiuConnectionOpened() {
        top.API.displayMessage("onSiuConnectionOpened is done");
        top.API.Siu.bOpenDevice = true;
        CheckOpenStatus();
    }

    //Open END
    //DeviceError START
    function onCrdOpenFailed() {
        top.API.displayMessage("onCrdOpenFailed is done");
		top.API.Crd.bOpenDevice = true;
        CheckOpenStatus();
    }
    function onPtrOpenFailed() {
        top.API.displayMessage("onPtrOpenFailed is done");
		top.API.Ptr.bOpenDevice = true;
        CheckOpenStatus();
    }
    function onCimOpenFailed() {
        top.API.displayMessage("onCimOpenFailed is done");
		top.API.Cim.bOpenDevice = true;
        CheckOpenStatus();
    }
    function onCdmOpenFailed() {
        top.API.displayMessage("onCdmOpenFailed is done");
		top.API.Cdm.bOpenDevice = true;
        CheckOpenStatus();
    }
    function onFpiOpenFailed() {
        top.API.displayMessage("onFpiOpenFailed is done");
		top.API.Fpi.bOpenDevice = true;
        CheckOpenStatus();
    }
    function onIdrOpenFailed() {
        top.API.displayMessage("onIdrOpenFailed is done");
		top.API.Idr.bOpenDevice = true;
        CheckOpenStatus();
    }
	function onSiuOpenFailed() {
        top.API.displayMessage("onSiuOpenFailed is done");
		top.API.Siu.bOpenDevice = true;
        CheckOpenStatus();
    }
    function onScrOpenFailed() {
        top.API.displayMessage("onScrOpenFailed is done");
		top.API.Scr.bOpenDevice = true;
        CheckOpenStatus();
    }
	function onPinOpenFailed() {
        top.API.displayMessage("onScrOpenFailed is done");
		top.API.Pin.bOpenDevice = true;
        CheckOpenStatus();
    }
	
    /********************************************************************************************************/
    //永久数据模块
    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        var arrDataValue = DataValue;
        var nRet1 = -1;
        top.API.displayMessage("onDatGetPersistentDataComplete is done,DataName=" + DataName + ",DataType=" + DataType + ",DataValue=" + arrDataValue[0]);
        if ('TOTALADDOK' == DataName) {
            if (arrDataValue[0] == 0) {
				//修正   加入流水  添加form
                top.API.displayMessage("未做清机加钞操作");
                top.API.Sys.SetIsMaintain(true);
                return CallResponse("OffLine");
            } else {
                top.API.Dat.GetPersistentData("TERMINALNUM", "STRING");           
            }
        }
        if ('TERMINALNUM' == DataName) {            
            top.API.gTerminalID = arrDataValue[0];
            //获取交易流水号
            top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);            
        }
        if ('JNLNUM' == DataName) {
            JnlNum = arrDataValue[0] + 1;
            if (JnlNum.toString().length === 9) {
                JnlNum = 0;
            }
            //设置交易流水号
            var arrJnlNum = new Array();
            arrJnlNum[0] = JnlNum;
            top.API.Dat.SetPersistentData(top.API.jnlnumTag, top.API.jnlnumType, arrJnlNum);            
        }		
    }

    function onDatGetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatGetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        top.API.displayMessage("未做清机加钞操作");
        return CallResponse("OffLine");
    }

    function onDatSetPersistentDataComplete(DataName) {
        top.API.displayMessage("onDatSetPersistentDataComplete is done,DataName=" + DataName);
        if ('JNLNUM' == DataName) {
            //待修正 添加流水
            var arrTransType;
            if (nKeyNum == 0) {
                arrTransType = new Array("APPLYWORKPARAM_PIN");
                top.API.displayMessage("Start APPLYWORKPARAM PIN");
            } else {
                arrTransType = new Array("APPLYWORKPARAM_MAC");
                top.API.displayMessage("Start APPLYWORKPARAM MAC");
            }
            top.API.Tcp.CompositionData(arrTransType); //进行处理工作参数报文
        }
    }

    function onDatSetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatSetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        return CallResponse("OffLine");
    }
    /********************************************************************************************************/
    //TCP模块
    function onCompositionDataCompleted() {
        top.API.displayMessage("onCompositionDataCompleted is done");
        var objArrData = new Array();
        top.API.Tcp.SendToHost(objArrData, 60000);
    }
    function onTcpOnRecved(tmpCheck) {
        Check = tmpCheck;
        top.API.displayMessage("onTcpOnRecved is done,Check:" + Check);
        if (Check == "00" && nKeyNum == 0 && CheckPinKey()) {
            nKeyNum = 1;
            //获取交易流水号
            top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);														
        } else if (Check == "00" && nKeyNum == 1 && CheckMacKey()) {
            PrintJnl("申请工作参数成功");
            CheckAndDownMK();
        } else {
			PrintJnl("申请工作参数异常");              
			return CallResponse("OffLine");
		}
	}
	
    function CheckAndDownMK() {
        top.API.displayMessage("Start Down MasterKey");
        // 修改解决更新初始主密钥后，主密钥未更新导致交易失败的问题
        DecryptMaster();
    }

	function PrintJnl(strData) {
		var arrTransactionResult = new Array(strData);
        top.API.Dat.SetDataSync("TRANSACTIONRESULT", "STRING", arrTransactionResult);
        top.API.Jnl.PrintSync("ApplyWorkParam");	
	}
    function onTcpSendFailed() {
        top.API.displayMessage("onTcpSendFailed is done");
		App.Timer.SetIntervalDisposal(onCompositionDataCompleted, 15000);
        if (nConnectTimes == 3) {            
            top.API.displayMessage("网络连接超时三次");
            return CallResponse("OffLine");
        } else {
            nConnectTimes++;
        }
    }
    function onTcpTimeout() {
        top.API.displayMessage("onTcpTimeout is done");
        App.Timer.SetIntervalDisposal(onCompositionDataCompleted, 15000);
        if (nConnectTimes == 3) {            
            top.API.displayMessage("网络连接超时三次");
            return CallResponse("OffLine");
        } else {
            nConnectTimes++;
        }
    }
    /********************************************************************************************************/
    //PIN模块
    function CheckPinKey() {
        var objGetMasterKey = top.API.Dat.GetDataSync("CDK", top.API.pinkeyType);
        var objGetPinKey = top.API.Dat.GetDataSync(top.API.pinkeyTag, top.API.pinkeyType);
        if (null == objGetPinKey || null == objGetMasterKey) {
            top.API.displayMessage("GetDataSync WorKKey objGet = null");
            return false;
        }
        else {
            top.API.displayMessage("GetDataSync objGetPinKey Return:" + objGetPinKey);
            top.API.displayMessage("GetDataSync objGetMasterKey Return:" + objGetMasterKey);
            var arrGetPinKey = objGetPinKey;
            var arrGerMKey = objGetMasterKey;
            PinKey = arrGetPinKey[0];
            MasterKey = arrGerMKey[0];
            if (PinKey == "" ) {
                return false;
            } else {
                return true;
            }
        }
    }

    function CheckMacKey() {
        var objGetMACKey = top.API.Dat.GetDataSync(top.API.mackeyTag, top.API.mackeyType);
        if ( null == objGetMACKey) {
            top.API.displayMessage("GetDataSync MacKey objGet = null");
            return false;
        }
        else {
            top.API.displayMessage("GetDataSync objGetMACKey Return:" + objGetMACKey);
            var arrGetMACKey = objGetMACKey;
            MACKey = arrGetMACKey[0];
            if (MACKey == "") {
                return false;
            } else {
                return true;
            }
        }
    }

    function DecryptMaster() {
        top.API.displayMessage("下载MDecrypt MasterKEY");
        var HexWorkKey = top.stringToHex(MasterKey);
        top.API.Pin.DecryptChinaSM(HexWorkKey, "InitKey", 0, 4096);
    }

    function DownPinKey() {
        top.API.displayMessage("下载PINKEY");
        keyFlag = 1;
        var HexWorkKey = top.stringToHex(PinKey);
        var tmphexArray = new Array();
	  var tmphexArray2 = top.stringToHex("0000000000000000");
        top.API.Pin.ExtendedLoadEncryptedKey_Ex("PINKEY", HexWorkKey, "MasterKey", "ChinaSM,CRYPT,FUNCTION,MACING,KEYENCKEY", tmphexArray, "", 2, "");
    }

    function DownMACKey() {
        top.API.displayMessage("下载MACKEY");
        keyFlag = 2;
        var HexWorkKey = top.stringToHex(MACKey);
        var tmphexArray = new Array();
	  var tmphexArray2 = top.stringToHex("0000000000000000");
        top.API.Pin.ExtendedLoadEncryptedKey_Ex("MACKEY", HexWorkKey, "MasterKey", "ChinaSM,CRYPT,MACING", tmphexArray, "", 2, "");
    }

    function onDecryptComplete(dataAsc) {
        top.API.displayMessage("解密MasterKEY成功, dataAsc = " + dataAsc);
        keyFlag = 0;
        var HexMasterKey = top.stringToHex(dataAsc);
        var tmphexArray = new Array();
	 var tmphexArray2 = top.stringToHex("0000000000000000");
        top.API.Pin.ExtendedLoadKey_Ex("MasterKey", HexMasterKey, "ChinaSM,CRYPT,FUNCTION,MACING,KEYENCKEY", tmphexArray, "", 2, "");
    }

    function onDecryptFailed() {
        top.API.displayMessage("解密MasterKEY失败");
        return CallResponse("OffLine");
    }

    function onKeyLoaded() {
        if (keyFlag == 0) {
            top.API.displayMessage('下载MasterKEY成功');
            DownPinKey();
        } else if (keyFlag == 1) {
            top.API.displayMessage('下载PINKEY成功');            
            DownMACKey();
        } else {
            top.API.displayMessage('下载MACKEY成功');			
			top.API.Jnl.PrintSync("OpenAppSuccess");

            /**
             * 验证授权文件信息，只查看本地授权文件是否正确，请直接传空字符
             */
            //return CallResponse("OnLine");
            top.API.Tfc.IdentifyLicFile("",-1);
			//return CallResponse("OnLine");
        }
    }

    function onDeviceError() {
        top.API.displayMessage('键盘触发事件：onDeviceError()');        
        return CallResponse("OffLine");
    }

     function onKeyLoadFailed() {
        top.API.displayMessage('键盘触发事件：onKeyLoadFailed()');        
        return CallResponse("OffLine");
    }

	function onCryptFailed() {
        top.API.displayMessage('键盘加解密失败：onCryptFailed');
        return CallResponse("OffLine");
    }
    function onServiceClosed() {
        top.API.displayMessage('触发事件：onServiceClosed()');        
        return CallResponse("OffLine");
    }

    /**
     *
     * @constructor 检测人脸识别检验文件是否正确
     */
    function setLicense(){
        setLicenseCount++;
        perLicensing = top.API.Tfc.StDeviceInfo();
        if(perLicensing == ""){
            top.API.isFaceCheckOK = false;
            top.API.Tfc.IdentifyLicFile("",-1);
        }else{
            CreatLicense("techshino-face",perLicensing);
        }
    }

    /**
     * @param productCode "techshino-face"
     * @param perLicensing
     * @constructor
     */
    function CreatLicense(productCode,perLicensing){
        $.ajax({
            type : "post",
           // url : "http://20.5.193.197:7003/license/authorized/createLicense",
            url : LicensingURI+"/createLicense",
            dataType : "json",
            data : {
                    "productCode" : productCode,
                    "perLicensing": perLicensing
                },
            success : function(Result) {
                //{"message":"成功","res_code":"0000","sn":"ead1a4b8065068fe1431e01422b8565b"}
                top.API.displayMessage("Result："+JSON.stringify(Result));
                if(Result.res_code == '0000'){
                    TfcConnectSuccess = true;
                    getLicense(Result.sn);
                }else{
                    top.API.isFaceCheckOK = false;
                    top.API.Tfc.IdentifyLicFile("",-1);
                }
            },
            error : function(xhr, status, errMsg) {
                top.API.isFaceCheckOK = false;
                top.API.Tfc.IdentifyLicFile("",-1);
                top.API.displayMessage("errMsg："+errMsg);
            }
        });
    }

    function getLicense(sn){
        $.ajax({
            type : "post",
            url : LicensingURI+"/getLicense",
            //url : "http://20.5.193.197:7003/license/authorized/getLicense",
            dataType : "json",
            data : {"sn" : sn },
            success : function(Result) {
                // {
                // "license":"XNrMiZ3eMjYkFmYbNHKXD2x04rWjkOMPIXqqX/E3R9fjc0BjogLljyF6ql/xN0fXIXqqX/E3R9fjc0BjogLljyF6ql/xN0fXIXqqX/E3R9fjc0BjogLljyF6ql/xN0fXIXqqX/E3R9fjc0BjogLljyF6ql/xN0fXIXqqX/E3R9fjc0BjogLljyF6ql/xN0fXIXqqX/E3R9fjc0BjogLljyF6ql/xN0fXIXqqX/E3R9fjc0BjogLljyF6ql/xN0fXIXqqX/E3R9fjc0BjogLljyF6ql/xN0fXIXqqX/E3R9fjc0BjogLljyF6ql/xN0fXIXqqX/E3R9fjc0BjogLljyF6ql/xN0fXIXqqX/E3R9fjc0BjogLljyF6ql/xN0fXIXqqX/E3R9fjc0BjogLljyF6ql/xN0fXIXqqX/E3R9fjc0BjogLljyF6ql/xN0fXIXqqX/E3R9fjc0BjogLljyF6ql/xN0fXIXqqX/E3R9fjc0BjogLljyF6ql/xN0fXIXqqX/E3R9fjc0BjogLljyF6ql/xN0fXIXqqX/E3R9fjc0BjogLljyF6ql/xN0fXIXqqX/E3R9fjc0BjogLljyF6ql/xN0fXIXqqX/E3R9fjc0BjogLljyF6ql/xN0fXIXqqX/E3R9fjc0BjogLljyF6ql/xN0fXIXqqX/E3R9deVi1vwOO2tBXlpU22EVk1um0IXwEnVq7jc0BjogLljyF6ql/xN0fXIXqqX/E3R9fjc0BjogLljyF6ql/xN0fX7ca+USYaVOYzUCOt3+mipSF6ql/xN0fXIXqqX/E3R9fjc0BjogLljyF6ql/xN0fXIXqqX/E3R9fjc0BjogLlj4VsqiVfeIiw6o6X6qLUmZeSzQNARIA/OiF6ql/xN0fXIXqqX/E3R9fjc0BjogLljyF6ql/xN0fXIXqqX/E3R9cZrwe1IZ9JZg==",
                // "message":"成功",
                // "res_code":"0000"
                // }
                top.API.displayMessage("Result："+JSON.stringify(Result));
                if(Result.res_code == "0000"){
                    license = Result.license;
                    top.API.Tfc.IdentifyLicFile(license,-1);
                }else{
                    top.API.isFaceCheckOK = false;
                    top.API.Tfc.IdentifyLicFile("",-1);
                }
            },
            error : function(xhr, status, errMsg) {
                top.API.displayMessage("errMsg:"+errMsg);
                top.API.isFaceCheckOK = false;
                top.API.Tfc.IdentifyLicFile("",-1);
            }
        });
    }

    function onIdentifyLicFileCompleted(){
        top.API.displayMessage("onIdentifyLicFileCompleted");
        top.API.isFaceCheckOK = true;
        // 判断是否已经签到，或者指纹仪故障直接切到对外

        var nFee = top.API.Dat.GetPrivateProfileSync("AdminSign", "AdminSignFlag", "0", top.API.Dat.GetBaseDir()+top.API.gIniFileName);


        if (nFee == "1" || !top.API.Fpi.bDeviceStatus) {
            top.API.displayMessage("已经签到成功，开启对外");
            return CallResponse("OnLine");
        } else {
            top.API.displayMessage("还未签到，进入签到页面");
            return CallResponse("Back");
        }        
    }

    function onIdentifyLicFileFailed(){
        top.API.displayMessage("onIdentifyLicFileFailed");
        if(setLicenseCount<3){
            setLicense();
        }else{
            top.API.isFaceCheckOK = false;
            // 判断是否已经签到
            var nFee = top.API.Dat.GetPrivateProfileSync("AdminSign", "AdminSignFlag", "0", top.API.Dat.GetBaseDir()+top.API.gIniFileName);
            if (nFee == "1" || !top.API.Fpi.bDeviceStatus) {
                top.API.displayMessage("已经签到成功，开启对外");
                return CallResponse("OnLine");
            } else {
                top.API.displayMessage("还未签到，进入签到页面");
                return CallResponse("Back");
            }
        }
    }

    //Register the event
    function EventLogin() {
        top.API.Crd.addEvent("ConnectionOpened", onCrdConnectionOpened);
        top.API.Pin.addEvent("ConnectionOpened", onPinConnectionOpened);
        top.API.Ptr.addEvent("ConnectionOpened", onPtrConnectionOpened);
        top.API.Cim.addEvent("ConnectionOpened", onCimConnectionOpened);
        top.API.Cdm.addEvent("ConnectionOpened", onCdmConnectionOpened);
        top.API.Idr.addEvent("ConnectionOpened", onIdrConnectionOpened);
        top.API.Fpi.addEvent("ConnectionOpened", onFpiConnectionOpened);
        top.API.Siu.addEvent("ConnectionOpened", onSiuConnectionOpened);
        top.API.Scr.addEvent("ConnectionOpened", onScrConnectionOpened);
        ////
        top.API.Crd.addEvent("OpenFailed", onCrdOpenFailed);
        top.API.Ptr.addEvent("OpenFailed", onPtrOpenFailed);
        top.API.Cim.addEvent("OpenFailed", onCimOpenFailed);
        top.API.Cdm.addEvent("OpenFailed", onCdmOpenFailed);
        top.API.Idr.addEvent("OpenFailed", onIdrOpenFailed);
        top.API.Fpi.addEvent("OpenFailed", onFpiOpenFailed);
        top.API.Siu.addEvent("OpenFailed", onSiuOpenFailed);
        top.API.Scr.addEvent("OpenFailed", onScrOpenFailed);
		top.API.Pin.addEvent("OpenFailed", onPinOpenFailed);
        ////
        top.API.Tcp.addEvent("SendFailed", onTcpSendFailed);
        top.API.Tcp.addEvent("OnRecved", onTcpOnRecved);
        top.API.Tcp.addEvent("CompositionDataCompleted", onCompositionDataCompleted);
        top.API.Tcp.addEvent("Timeout", onTcpTimeout);
        ////
        top.API.Pin.addEvent('KeyLoaded', onKeyLoaded); 
        top.API.Pin.addEvent('KeyLoadFailed', onKeyLoadFailed); 
		top.API.Pin.addEvent("CryptFailed", onCryptFailed);
		top.API.Pin.addEvent('DeviceError', onDeviceError); 
		top.API.Pin.addEvent("DecryptComplete", onDecryptComplete);
		top.API.Pin.addEvent("DecryptFailed", onDecryptFailed);
        ////
        top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.addEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.addEvent("SetPersistentDataError", onDatSetPersistentDataError)
        ////
        //todo
        //添加人脸识别初始化是否成功事件
        top.API.Tfc.addEvent("IdentifyLicFileCompleted", onIdentifyLicFileCompleted);
        top.API.Tfc.addEvent("IdentifyLicFileFailed", onIdentifyLicFileFailed);
    }

    function EventLogout() {
        top.API.Crd.removeEvent("ConnectionOpened", onCrdConnectionOpened);
        top.API.Pin.removeEvent("ConnectionOpened", onPinConnectionOpened);
        top.API.Ptr.removeEvent("ConnectionOpened", onPtrConnectionOpened);
        top.API.Cim.removeEvent("ConnectionOpened", onCimConnectionOpened);
        top.API.Cdm.removeEvent("ConnectionOpened", onCdmConnectionOpened);
        top.API.Idr.removeEvent("ConnectionOpened", onIdrConnectionOpened);
        top.API.Fpi.removeEvent("ConnectionOpened", onFpiConnectionOpened);
        top.API.Scr.removeEvent("ConnectionOpened", onScrConnectionOpened);
        top.API.Siu.removeEvent("ConnectionOpened", onSiuConnectionOpened);
        ////
        top.API.Crd.removeEvent("OpenFailed", onCrdOpenFailed);
        top.API.Ptr.removeEvent("OpenFailed", onPtrOpenFailed);
        top.API.Cim.removeEvent("OpenFailed", onCimOpenFailed);
        top.API.Cdm.removeEvent("OpenFailed", onCdmOpenFailed);
        top.API.Idr.removeEvent("OpenFailed", onIdrOpenFailed);
        top.API.Fpi.removeEvent("OpenFailed", onFpiOpenFailed);
        top.API.Siu.removeEvent("OpenFailed", onSiuOpenFailed);
        top.API.Scr.removeEvent("OpenFailed", onScrOpenFailed);
		top.API.Pin.removeEvent("OpenFailed", onPinOpenFailed);
        ////
        top.API.Tcp.removeEvent("SendFailed", onTcpSendFailed);
        top.API.Tcp.removeEvent("OnRecved", onTcpOnRecved);
        top.API.Tcp.removeEvent("CompositionDataCompleted", onCompositionDataCompleted);
        top.API.Tcp.removeEvent("Timeout", onTcpTimeout);
        ////
        top.API.Pin.removeEvent('KeyLoaded', onKeyLoaded);
        top.API.Pin.removeEvent('KeyLoadFailed', onKeyLoadFailed); 
		top.API.Pin.removeEvent("CryptFailed", onCryptFailed);
		top.API.Pin.removeEvent('DeviceError', onDeviceError);
		top.API.Pin.removeEvent("DecryptComplete", onDecryptComplete);
		top.API.Pin.removeEvent("DecryptFailed", onDecryptFailed);
        ////
        top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.removeEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.removeEvent("SetPersistentDataError", onDatSetPersistentDataError);

        top.API.Tfc.removeEvent("IdentifyLicFileCompleted", onIdentifyLicFileCompleted);
        top.API.Tfc.removeEvent("IdentifyLicFileFailed", onIdentifyLicFileFailed);
        ////
    }
    //Page Return
    function TimeoutCallBack() {
        top.API.displayMessage("超时事件触发");
        
        return CallResponse("OffLine");
    }
    

    //remove all event handler
    function Clearup() {
        EventLogout();
        App.Timer.ClearTime();
		App.Timer.ClearIntervalTime();
        //TO DO:
    };
})();