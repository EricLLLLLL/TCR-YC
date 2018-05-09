/*@module:API
 *@create by:  hyhua
 *@time: 2015年11月20日
 ****************************************
 *@功能描述:
 *加载各硬件模块。
 *
 ***************************************
 */


(function () {
    //the module type
    window.API = {
        initialize: function () {
            top.JsFilename = "";
            top.ErrorInfo = "交易成功!";
            top.FirstOpenFlag = true; //是否为第一次打开
            data.call(this); //将JSData内定义的全局变量设为top.API
            global.call(this); //将JSGlobal内定义的全局变量设为top.API
            displayMessage("Api Initialize...");
            //创建硬件对象
            var DevObj = new CreateDevObject();
            this.Crd = DevObj.CreateCrdObj();
            this.Cim = DevObj.CreateCimObj();
            this.Cdm = DevObj.CreateCdmObj();
            this.Fpi = DevObj.CreateFpiObj();
            this.Pin = DevObj.CreatePinObj();
            this.Ptr = DevObj.CreatePtrObj();
            this.Idr = DevObj.CreateIdrObj();
            this.Scr = DevObj.CreateScrObj();
            this.Siu = DevObj.CreateSiuObj();
            this.Cam = DevObj.CreateCamObj();
            this.Tfc = DevObj.CreateTfcObj();
           this.Spt = DevObj.CreateSptObj();
            //创建非硬件对象
            var USObj = new CreateUSObject();
            this.Jnl = USObj.CreateJnlObj();
            this.Tcp = USObj.CreateTcpObj();
            this.Sys = USObj.CreateSysObj();
            this.Tsl = USObj.CreateTslObj();
            this.Dat = USObj.CreateDatObj();
            this.Ime = USObj.CreateImeObj();    
	      //this.Sud = USObj.CreateSudObj();
		this.Jst = USObj.CreateJstObj();
		//创建深圳农行特殊对象
            //var ABCObj = new CreateABCObject();
            //this.Ass = ABCObj.CreateAssObj();
            //this.Rpm = ABCObj.CreateRpmObj();
            //this.Fck = ABCObj.CreateFckObj();
            this.CashInfo = new JSCashInfo();
        },
        OCXRegister: function () {
            this.Crd.RegisterMessage();
            this.Pin.RegisterMessage();
            this.Cim.RegisterMessage();
            this.Cdm.RegisterMessage();
            this.Ptr.RegisterMessage();
            this.Idr.RegisterMessage();
            this.Dat.RegisterMessage();
            this.Fpi.RegisterMessage();
            this.Jnl.RegisterMessage();
            this.Tcp.RegisterMessage();
            this.Siu.RegisterMessage();
            this.Scr.RegisterMessage();
            this.Tsl.RegisterMessage();
            this.Sys.RegisterMessage();
            this.Ime.RegisterMessage();
            this.Cam.RegisterMessage();
            this.Tfc.RegisterMessage();
            this.Spt.RegisterMessage();
            this.Jnl.WriteLogSync("OCXRegister OK", 1);
        },
        OCXUnregister: function () {
            this.Jnl.WriteLogSync("START OCXUnregister", 1);
            //this.Jnl.PrintSync("ErrorContent");
            this.Crd.UnRegisterMessage();
            this.Pin.UnRegisterMessage();
            this.Cim.UnRegisterMessage();
            this.Cdm.UnRegisterMessage();
            this.Ptr.UnRegisterMessage();
            this.Idr.UnRegisterMessage();
            this.Dat.UnRegisterMessage();
            this.Fpi.UnRegisterMessage();
            this.Jnl.UnRegisterMessage();
            this.Tcp.UnRegisterMessage();
            this.Siu.UnRegisterMessage();
            this.Scr.UnRegisterMessage();
            this.Tsl.UnRegisterMessage();
            this.Sys.UnRegisterMessage();
            this.Ime.UnRegisterMessage();
            this.Cam.UnRegisterMessage();
            this.Tfc.UnRegisterMessage();
            this.Spt.UnRegisterMessage();
        },
        OpenDevice: function () {
            this.Jnl.WriteLogSync("START OpenDevice", 1);
            this.Crd.SetServiceName();
            this.Cim.SetServiceName();
            this.Cdm.SetServiceName();
            this.Pin.SetServiceName();
            this.Idr.SetServiceName();
            this.Scr.SetServiceName();
            this.Ptr.SetServiceName();
            this.Siu.SetServiceName();
            this.Fpi.SetServiceName();
            this.Cam.SetServiceName();
            this.Tfc.SetServiceName();
            this.Spt.SetServiceName();
            this.Crd.OpenConnection();
            this.Pin.OpenConnection();
            this.Cim.OpenConnection();
            this.Cdm.OpenConnection();
            this.Ptr.OpenConnection();
            this.Idr.OpenConnection();
            this.Fpi.OpenConnection();
            this.Siu.OpenConnection();
            this.Scr.OpenConnection();
            this.Cam.OpenConnection();
            this.Tfc.OpenConnection();
            this.Spt.OpenConnection();
        },
        InitOpenFlag: function () {
            this.Jnl.WriteLogSync("START InitOpenFlag", 1);
            this.Crd.bDeviceStatus = false;
            this.Pin.bDeviceStatus = false;
            this.Cim.bDeviceStatus = false;
            this.Cdm.bDeviceStatus = false;
            this.Ptr.bDeviceStatus = false;
            this.Idr.bDeviceStatus = false;
            this.Fpi.bDeviceStatus = false;
            this.Siu.bDeviceStatus = false;
            this.Scr.bDeviceStatus = false;
            this.Cam.bDeviceStatus = false;
            this.Tfc.bDeviceStatus = false;
            this.Spt.bDeviceStatus = false;
			top.API.gbINQ_DEAL = false;
			top.API.gbQRYNAME_DEAL = false;
			top.API.gbPSW_DEAL = false;
			top.API.gbCARDCWD_DEAL = false;
			top.API.gbPBCWD_DEAL = false;
			top.API.gbCARDDEP_DEAL = false;
			top.API.gbPBDEP_DEAL = false;
			top.API.gbNOCARINQ_DEAL = false;
			top.API.gbNOCARDDEP_DEAL = false;
			top.API.gbEXCHANGE_DEAL = false;
			top.API.gbLARGEAMOUNT_DEAL = false;
			top.API.gbBUSINESSDEP_DEAL = false;
			top.API.gbACCDELETE_DEAL = false;
			top.API.gbTRANSFER_DEAL = false;
			top.API.gbTRANSFERCANCEL_DEAL = false;
			top.API.gbPCA_DEAL = false;
			top.API.gbCTR_DEAL = false;
			top.API.gbSAVEBACK_DEAL = false;
			top.API.gbWXCancel_DEAL = false;
        },
        CheckDeviceStatus: function () {
			this.InitOpenFlag();
			top.API.gPartsStatus = top.API.Sys.GetPartsStatusSync();
			top.API.gTransStatus = top.API.Sys.PossibleTransactionSync();
			if (top.API.gTransStatus == "-1") {
				top.API.displayMessage("-------获取各交易状态失败------");
				return false;
			} else {
				/*
				TransStatus[0]=账户余额查询
				TransStatus[1]=户名查询
				TransStatus[2]=改密
				TransStatus[3]=卡取款
				TransStatus[4]=折取款
				TransStatus[5]=卡存款
				TransStatus[6]=折存款
				TransStatus[7]=无卡无折存款查询
				TransStatus[8]=无卡无折存款
				TransStatus[9]=零钞兑换
				TransStatus[10]=大额交易
				TransStatus[11]=对公存款
				TransStatus[12]=卡折销户
				TransStatus[13]=转账汇款
				TransStatus[14]=转账撤销
				TransStatus[15]=定期转活期
				TransStatus[16]=活期转定期			
				TransStatus[17]=卡钞回存			
				TransStatus[18]=微信销户			
				*/
                top.API.displayMessage("读取交易状态top.API.gTransStatus=" + top.API.gTransStatus);
				var arrTransStatus = top.API.gTransStatus.split(",");
				if (parseInt(arrTransStatus[0]) == 1){
					top.API.gbINQ_DEAL = true;
				}
				if (parseInt(arrTransStatus[1]) == 1){
					top.API.gbQRYNAME_DEAL = true;
				}
				if (parseInt(arrTransStatus[2]) == 1){
					top.API.gbPSW_DEAL = true;
				}
				if (parseInt(arrTransStatus[3]) == 1){
					top.API.gbCARDCWD_DEAL = true;
				}
				if (parseInt(arrTransStatus[4]) == 1){
					top.API.gbPBCWD_DEAL = true;
				}
				if (parseInt(arrTransStatus[5]) == 1){
					top.API.gbCARDDEP_DEAL = true;
				}
				if (parseInt(arrTransStatus[6]) == 1){
					top.API.gbPBDEP_DEAL = true;
				}
				if (parseInt(arrTransStatus[7]) == 1){
					top.API.gbNOCARINQ_DEAL = true;
				}
				if (parseInt(arrTransStatus[8]) == 1){
					top.API.gbNOCARDDEP_DEAL = true;
				}
				if (parseInt(arrTransStatus[9]) == 1){
					top.API.gbEXCHANGE_DEAL = true;
				}
				if (parseInt(arrTransStatus[10]) == 1){
					top.API.gbLARGEAMOUNT_DEAL = true;
				}
				if (parseInt(arrTransStatus[11]) == 1){
					top.API.gbBUSINESSDEP_DEAL = true;
				}
				if (parseInt(arrTransStatus[12]) == 1){
					top.API.gbACCDELETE_DEAL = true;
				}
				if (parseInt(arrTransStatus[13]) == 1){
					top.API.gbTRANSFER_DEAL = true;
				}
				if (parseInt(arrTransStatus[14]) == 1){
					top.API.gbTRANSFERCANCEL_DEAL = true;
				}
				if (parseInt(arrTransStatus[15]) == 1){
					top.API.gbPCA_DEAL = true;
				}
				if (parseInt(arrTransStatus[16]) == 1){
					top.API.gbCTR_DEAL = true;
				}
				if (parseInt(arrTransStatus[17]) == 1){
					top.API.gbSAVEBACK_DEAL = true;
				}
				if (parseInt(arrTransStatus[18]) == 1){
					top.API.gbWXCancel_DEAL = true;
				}
			}			
			if (top.API.gPartsStatus == "") {
				top.API.displayMessage("-------获取各部件状态失败------");		
				return false;
			} else {
				/*
				SZABC_ALL = 0,
				SZABC_IDC = 1,
				SZABC_SCR = 2,
				SZABC_IDR = 5,
				SZABC_PIN = 9,
				SZABC_RPT = 12,
				SZABC_CDM = 16,
				SZABC_CIM = 17,
				SZABC_SIU = 19,
				SZABC_FPI = 27,
				SZABC_TNW1 = 32             //交易网络连接1
				------------------------------------
				SZABC_NO_DEVICE = '0',      //无此设备部件
				SZABC_NOMAL = 'Z',          //正常
				SZABC_UNNOMAL = '1',        //故障
				SZABC_LOW = '2',            //钞少
				SZABC_EMPTY = '3',          //钞箱空
				SZABC_FULL = '4'            //钞箱满
				*/				
				if ((top.API.gPartsStatus.substr(16,1) == "Z") && (top.API.gPartsStatus.substr(17,1) == "Z")) {
					this.Cim.bDeviceStatus = true;
					this.Cdm.bDeviceStatus = true;
				}
				if (top.API.gPartsStatus.substr(1,1) == "Z") {
					this.Crd.bDeviceStatus = true;
				}
				if (top.API.gPartsStatus.substr(27,1) == "Z") {
					this.Fpi.bDeviceStatus = true;
				}
				if (top.API.gPartsStatus.substr(5,1) == "Z") {
					this.Idr.bDeviceStatus = true;
				}
				if (top.API.gPartsStatus.substr(9,1) == "Z") {
					this.Pin.bDeviceStatus = true;
				}
				if (top.API.gPartsStatus.substr(12,1) == "Z") {
					this.Ptr.bDeviceStatus = true;
				}
				if (top.API.gPartsStatus.substr(2,1) == "Z") {
					this.Scr.bDeviceStatus = true;
				}
				if (top.API.Cam.StDetailedDeviceStatus() == "ONLINE"){
					this.Cam.bDeviceStatus = true;
				}
				if (top.API.Tfc.StDetailedDeviceStatus() == "ONLINE"){
					this.Tfc.bDeviceStatus = true;
				}
				if (top.API.Spt.StDetailedDeviceStatus() == "ONLINE"){
					this.Spt.bDeviceStatus = true;
				}

			}
			return true;
        },
		GetUnitInfo: function (arrParam) {
			var arrCurrentCount = new Array();
			var arrSplite = new Array();
			var arrReturnInfo = new Array();
			arrCurrentCount = arrParam;
			for (i = 0; i < arrCurrentCount.length; i++) {
				arrSplite = arrCurrentCount[i].split(":");
				arrReturnInfo[i] = parseInt(arrSplite[1]);
			}
			
			return arrReturnInfo;
		},
		IsOntherCashCWD: function () {
			var bRet = false;//判断零钞是否可取
			for (i = 0; i < top.API.CashInfo.nCountOfUnits; i++) {
				if (top.API.CashInfo.arrUnitRemain[i] > 45 && 
					top.API.CashInfo.arrUnitCurrency[i] != 100 &&
					top.API.CashInfo.arrUnitCurrency[i] != 0) {
					bRet =true;
				}
			}	
			return bRet;
		},
       
			
        displayMessage: function (strMsg) {
            strMsg = top.JsFilename + "   " + strMsg;
            var mode = arguments[1] ? arguments[1] : 1;
             this.Jnl.WriteLogSync(strMsg, mode);
        }
    };
})();
 
