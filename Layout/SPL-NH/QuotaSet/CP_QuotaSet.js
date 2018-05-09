/*@create by:  Will
*@time: 2016年09月27日
*/
; (function () {
    //键盘相关
    var strDEPAuthorized = "";
    var strBankbookDEPAuthorized = "";
    var strNoCardDEPAuthorized = "";
    var strCWDAuthorized = "";
    var strBankbookCWDAuthorized = "";

    var strDEPQuota = "";
    var strBankbookDEPQuota = "";
    var strNoCardDEPQuota = "";
    var strCWDQuota = "";
    var strBankbookCWDQuota = "";

    var DEPAuthorized = document.getElementById("DEPAuthorizedInput");
    var BankbookDEPAuthorized = document.getElementById("BankbookDEPAuthorizedInput");
    var NoCardDEPAuthorized = document.getElementById("NoCardDEPAuthorizedInput");
    var CWDAuthorized = document.getElementById("CWDAuthorizedInput");
    var BankbookCWDAuthorized = document.getElementById("BankbookCWDAuthorizedInput");
    var DEPQuota = document.getElementById("DEPQuotaInput");
    var BankbookDEPQuota = document.getElementById("BankbookDEPQuotaInput");
    var NoCardDEPQuota = document.getElementById("NoCardDEPQuotaInput");
    var CWDQuota = document.getElementById("CWDQuotaInput");
    var BankbookCWDQuota = document.getElementById("BankbookCWDQuotaInput");

    var InputFlag = 0;
    DEPAuthorized.focus();
    var lRetAuthorized;
    var lRetBigTranLimit;
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        top.API.Sys.ItemClearSync(top.API.MTRN_TRANSACTIONDIFFER);
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        ButtonDisable();
        EventLogin();
        //@initialize scope start  
        App.Plugin.Keyboard.show("2", "PageSubject", "KeyboardDiv");
        var nRet;

        //获取卡存款交易限额、授权限额
        nRet = top.API.Sys.DataSetSync(top.API.MTRN_TRANSACTIONDIFFER, top.API.MTRN_DEPOSIT_CARD);
        top.API.displayMessage("Trn DataSetSync MTRN_TRANSACTIONDIFFER MTRN_DEPOSIT_CARD 卡存款 Return:"+nRet);    
        lRetAuthorized = top.API.Sys.DataGetSync(top.API.MTRN_AUTHORIZEDAMOUNTRULE);
        DEPAuthorized.innerText = lRetAuthorized.toString();
        strDEPAuthorized = DEPAuthorized.value;
        lRetBigTranLimit = top.API.Sys.DataGetSync(top.API.MTRN_TRANLIMITAMOUNTRULE);        
        DEPQuota.innerText = lRetBigTranLimit.toString();
        strDEPQuota = DEPQuota.value;

        //获取存折存款交易限额、授权限额
        nRet = top.API.Sys.DataSetSync(top.API.MTRN_TRANSACTIONDIFFER, top.API.MTRN_DEPOSIT_PB);
        top.API.displayMessage("Trn DataSetSync MTRN_TRANSACTIONDIFFER MTRN_DEPOSIT_PB 折存款 Return:"+nRet);    
        lRetAuthorized = top.API.Sys.DataGetSync(top.API.MTRN_AUTHORIZEDAMOUNTRULE);
        BankbookDEPAuthorized.innerText = lRetAuthorized.toString();
        strBankbookDEPAuthorized = BankbookDEPAuthorized.value;
        lRetBigTranLimit = top.API.Sys.DataGetSync(top.API.MTRN_TRANLIMITAMOUNTRULE);        
        BankbookDEPQuota.innerText = lRetBigTranLimit.toString();
        strBankbookDEPQuota = BankbookDEPQuota.value;

        //获取无卡存款交易限额、授权限额
        nRet = top.API.Sys.DataSetSync(top.API.MTRN_TRANSACTIONDIFFER, top.API.MTRN_NOCARDDEPOSIT);
        top.API.displayMessage("Trn DataSetSync MTRN_TRANSACTIONDIFFER MTRN_NOCARDDEPOSIT 无折无卡存款 Return:"+nRet);   
        lRetAuthorized = top.API.Sys.DataGetSync(top.API.MTRN_AUTHORIZEDAMOUNTRULE);
        NoCardDEPAuthorized.innerText = lRetAuthorized.toString();
        strNoCardDEPAuthorized = NoCardDEPAuthorized.value;
        lRetBigTranLimit = top.API.Sys.DataGetSync(top.API.MTRN_TRANLIMITAMOUNTRULE);        
        NoCardDEPQuota.innerText = lRetBigTranLimit.toString();
        strNoCardDEPQuota = NoCardDEPQuota.value;

        //获取卡取款款交易限额、授权限额
        nRet = top.API.Sys.DataSetSync(top.API.MTRN_TRANSACTIONDIFFER, top.API.MTRN_WITHDRAW_CARD);
        top.API.displayMessage("Trn DataSetSync MTRN_TRANSACTIONDIFFER MTRN_WITHDRAW_CARD 卡取款 Return:"+nRet);    
        lRetAuthorized = top.API.Sys.DataGetSync(top.API.MTRN_AUTHORIZEDAMOUNTRULE);
        CWDAuthorized.innerText = lRetAuthorized.toString();
        strCWDAuthorized = CWDAuthorized.value;
        lRetBigTranLimit = top.API.Sys.DataGetSync(top.API.MTRN_TRANLIMITAMOUNTRULE);        
        CWDQuota.innerText = lRetBigTranLimit.toString();
        strCWDQuota = CWDQuota.value;

        //获取存折取款款交易限额、授权限额
        nRet = top.API.Sys.DataSetSync(top.API.MTRN_TRANSACTIONDIFFER, top.API.MTRN_WITHDRAW_PB);
        top.API.displayMessage("Trn DataSetSync MTRN_TRANSACTIONDIFFER MTRN_WITHDRAW_PB 折取款 Return:"+nRet);    
        lRetAuthorized = top.API.Sys.DataGetSync(top.API.MTRN_AUTHORIZEDAMOUNTRULE);
        BankbookCWDAuthorized.innerText = lRetAuthorized.toString();
        strBankbookCWDAuthorized = BankbookCWDAuthorized.value;
        lRetBigTranLimit = top.API.Sys.DataGetSync(top.API.MTRN_TRANLIMITAMOUNTRULE);        
        BankbookCWDQuota.innerText = lRetBigTranLimit.toString();
        strBankbookCWDQuota = BankbookCWDQuota.value;

        ButtonEnable();
    }();//Page Entry
    function ButtonDisable() {
        document.getElementById('Exit').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Exit').disabled = false;
    }


    var oKeyboardKeyInput = document.getElementsByTagName("input");
    for (var j = 0; j < oKeyboardKeyInput.length; j++) {
        var inpt = oKeyboardKeyInput[j];
        inpt.onclick = function (e) {
            inputId = document.activeElement.id;
            if (inputId == "DEPAuthorizedInput") {
                InputFlag = 0;
            } else if (inputId == "BankbookDEPAuthorizedInput") {
                InputFlag = 1;
            } else if (inputId == "NoCardDEPAuthorizedInput") {
                InputFlag = 2;
            } else if (inputId == "CWDAuthorizedInput") {
                InputFlag = 3;
            } else if (inputId == "BankbookCWDAuthorizedInput") {
                InputFlag = 4;
            } else if (inputId == "DEPQuotaInput") {
                InputFlag = 5;
            } else if (inputId == "BankbookDEPQuotaInput") {
                InputFlag = 6;
            } else if (inputId == "NoCardDEPQuotaInput") {
                InputFlag = 7;
            } else if (inputId == "CWDQuotaInput") {
                InputFlag = 8;
            } else if (inputId == "BankbookCWDQuotaInput") {
                InputFlag = 9;
            }
        }
    }

    function onClearNum() {
        if (InputFlag == 0) {
            DEPAuthorized.innerText = '';
            strDEPAuthorized = '';
            DEPAuthorized.focus();
        } else if (InputFlag == 1) {
            BankbookDEPAuthorized.innerText = '';
            strBankbookDEPAuthorized = '';
            BankbookDEPAuthorized.focus();
        } else if (InputFlag == 2) {
            NoCardDEPAuthorized.innerText = '';
            strNoCardDEPAuthorized = '';
            NoCardDEPAuthorized.focus();
        } else if (InputFlag == 3) {
            CWDAuthorized.innerText = '';
            strCWDAuthorized = '';
            CWDAuthorized.focus();
        } else if (InputFlag == 4) {
            BankbookCWDAuthorized.innerText = '';
            strBankbookCWDAuthorized = '';
            BankbookCWDAuthorized.focus();
        } else if (InputFlag == 5) {
            DEPQuota.innerText = '';
            strDEPQuota = '';
            DEPQuota.focus();
        } else if (InputFlag == 6) {
            BankbookDEPQuota.innerText = '';
            strBankbookDEPQuota = '';
            BankbookDEPQuota.focus();
        } else if (InputFlag == 7) {
            NoCardDEPQuota.innerText = '';
            strNoCardDEPQuota = '';
            NoCardDEPQuota.focus();
        } else if (InputFlag == 8) {
            CWDQuota.innerText = '';
            strCWDQuota = '';
            CWDQuota.focus();
        } else if (InputFlag == 9) {
            BankbookCWDQuota.innerText = '';
            strBankbookCWDQuota = '';
            BankbookCWDQuota.focus();
        }
    }

    var oKeyboardKey = document.getElementsByName("Name_Keyboard");
    for (var i = 0; i < oKeyboardKey.length; i++) {
        var keyEvent = oKeyboardKey[i];
        keyEvent.onclick = function (e) {            
            if ('清除' == this.innerText) {
                onClearNum();
            } else if ('退格' == this.innerText) {
                if (InputFlag == 0) {
                    strDEPAuthorized = strDEPAuthorized.substr(0, (strDEPAuthorized.length-1));                        
                    DEPAuthorized.innerText = strDEPAuthorized;
                } else if (InputFlag == 1) {
                    strBankbookDEPAuthorized = strBankbookDEPAuthorized.substr(0, (strBankbookDEPAuthorized.length-1));                        
                    BankbookDEPAuthorized.innerText = strBankbookDEPAuthorized;
                } else if (InputFlag == 2) {
                    strNoCardDEPAuthorized = strNoCardDEPAuthorized.substr(0, (strNoCardDEPAuthorized.length-1));                        
                    NoCardDEPAuthorized.innerText = strNoCardDEPAuthorized;
                } else if (InputFlag == 3) {
                    strCWDAuthorized = strCWDAuthorized.substr(0, (strCWDAuthorized.length-1));                        
                    CWDAuthorized.innerText = strCWDAuthorized;
                } else if (InputFlag == 4) {
                    strBankbookCWDAuthorized = strBankbookCWDAuthorized.substr(0, (strBankbookCWDAuthorized.length-1));                        
                    BankbookCWDAuthorized.innerText = strBankbookCWDAuthorized;
                } else if (InputFlag == 5) {
                    strDEPQuota = strDEPQuota.substr(0, (strDEPQuota.length-1));                        
                    DEPQuota.innerText = strDEPQuota;
                } else if (InputFlag == 6) {
                    strBankbookDEPQuota = strBankbookDEPQuota.substr(0, (strBankbookDEPQuota.length-1));                        
                    BankbookDEPQuota.innerText = strBankbookDEPQuota;
                } else if (InputFlag == 7) {
                    strNoCardDEPQuota = strNoCardDEPQuota.substr(0, (strNoCardDEPQuota.length-1));                        
                    NoCardDEPQuota.innerText = strNoCardDEPQuota;
                } else if (InputFlag == 8) {
                    strCWDQuota = strCWDQuota.substr(0, (strCWDQuota.length-1));                        
                    CWDQuota.innerText = strCWDQuota;
                } else if (InputFlag == 9) {
                    strBankbookCWDQuota = strBankbookCWDQuota.substr(0, (strBankbookCWDQuota.length-1));                        
                    BankbookCWDQuota.innerText = strBankbookCWDQuota;
                }
            } else {
                if (InputFlag == 0) {
                    if (strDEPAuthorized.length < 10) {   
                        if (!isNaN(this.innerText)) {
                            strDEPAuthorized += this.innerText;
                            DEPAuthorized.innerText = strDEPAuthorized;
                        }
                    }                
                } else if (InputFlag == 1) {
                     if (strBankbookDEPAuthorized.length < 10) {                          
                        strBankbookDEPAuthorized += this.innerText;
                        BankbookDEPAuthorized.innerText = strBankbookDEPAuthorized;
                      }                                   
                } else if (InputFlag == 2) {
                    if (strNoCardDEPAuthorized.length < 10) { 
                        if (!isNaN(this.innerText)) {
                            strNoCardDEPAuthorized += this.innerText;
                            NoCardDEPAuthorized.innerText = strNoCardDEPAuthorized;
                        }
                    }
                } else if (InputFlag == 3) {
                    if (strCWDAuthorized.length < 10) { 
                        if (!isNaN(this.innerText)) {
                            strCWDAuthorized += this.innerText;
                            CWDAuthorized.innerText = strCWDAuthorized;
                        }
                    }
                } else if (InputFlag == 4) {
                     if (strBankbookCWDAuthorized.length < 10) {                          
                        strBankbookCWDAuthorized += this.innerText;
                        BankbookCWDAuthorized.innerText = strBankbookCWDAuthorized;
                      }                                   
                } else if (InputFlag == 5) {
                    if (strDEPQuota.length < 10) { 
                        if (!isNaN(this.innerText)) {
                            strDEPQuota += this.innerText;
                            DEPQuota.innerText = strDEPQuota;
                        }
                    }
                } else if (InputFlag == 6) {
                    if (strBankbookDEPQuota.length < 10) { 
                        if (!isNaN(this.innerText)) {
                            strBankbookDEPQuota += this.innerText;
                            BankbookDEPQuota.innerText = strBankbookDEPQuota;
                        }
                    }
                } else if (InputFlag == 7) {
                     if (strNoCardDEPQuota.length < 10) {                          
                        strNoCardDEPQuota += this.innerText;
                        NoCardDEPQuota.innerText = strNoCardDEPQuota;
                      }                                   
                } else if (InputFlag == 8) {
                    if (strCWDQuota.length < 10) { 
                        if (!isNaN(this.innerText)) {
                            strCWDQuota += this.innerText;
                            CWDQuota.innerText = strCWDQuota;
                        }
                    }
                } else if (InputFlag == 9) {
                    if (strBankbookCWDQuota.length < 10) { 
                        if (!isNaN(this.innerText)) {
                            strBankbookCWDQuota += this.innerText;
                            BankbookCWDQuota.innerText = strBankbookCWDQuota;
                        }
                    }
                }
            }

        }
    }
    //@User ocde scope start
    document.getElementById('KeyboardKey_set').onclick = function () {
       if (strDEPAuthorized ==""||strBankbookDEPAuthorized ==""
        ||strNoCardDEPAuthorized ==""||strCWDAuthorized ==""
        ||strBankbookCWDAuthorized ==""||strDEPQuota ==""
        ||strBankbookDEPQuota ==""||strNoCardDEPQuota ==""
        ||strCWDQuota ==""||strBankbookCWDQuota =="") {
                document.getElementById("tipdiv").innerText = "输入不能为空！"; 
        }else {
            var nRet;
            //设置卡存款授权限额、交易限额
            nRet = top.API.Sys.DataSetSync(top.API.MTRN_TRANSACTIONDIFFER, top.API.MTRN_DEPOSIT_CARD);
            top.API.displayMessage("Trn DataSetSync MTRN_TRANSACTIONDIFFER MTRN_DEPOSIT_CARD 卡存款 Return:"+nRet);    
            nRet = top.API.Sys.DataSetSync(top.API.MTRN_AUTHORIZEDAMOUNTRULE,parseInt(strDEPAuthorized));
            nRet = top.API.Sys.DataSetSync(top.API.MTRN_TRANLIMITAMOUNTRULE,parseInt(strDEPQuota));        

             //设置存折存款授权限额、交易限额
            nRet = top.API.Sys.DataSetSync(top.API.MTRN_TRANSACTIONDIFFER, top.API.MTRN_DEPOSIT_PB);
            top.API.displayMessage("Trn DataSetSync MTRN_TRANSACTIONDIFFER MTRN_DEPOSIT_PB 折存款 Return:"+nRet);    
            nRet = top.API.Sys.DataSetSync(top.API.MTRN_AUTHORIZEDAMOUNTRULE,parseInt(strBankbookDEPAuthorized));
            nRet = top.API.Sys.DataSetSync(top.API.MTRN_TRANLIMITAMOUNTRULE,parseInt(strBankbookDEPQuota));        

            //设置无卡存款授权限额、交易限额
            nRet = top.API.Sys.DataSetSync(top.API.MTRN_TRANSACTIONDIFFER, top.API.MTRN_NOCARDDEPOSIT);
            top.API.displayMessage("Trn DataSetSync MTRN_TRANSACTIONDIFFER MTRN_NOCARDDEPOSIT 无折无卡存款 Return:"+nRet);    
            nRet = top.API.Sys.DataSetSync(top.API.MTRN_AUTHORIZEDAMOUNTRULE,parseInt(strNoCardDEPAuthorized));
            nRet = top.API.Sys.DataSetSync(top.API.MTRN_TRANLIMITAMOUNTRULE,parseInt(strNoCardDEPQuota));        

            //设置卡取款授权限额、交易限额
            nRet = top.API.Sys.DataSetSync(top.API.MTRN_TRANSACTIONDIFFER, top.API.MTRN_WITHDRAW_CARD);
            top.API.displayMessage("Trn DataSetSync MTRN_TRANSACTIONDIFFER MTRN_WITHDRAW_CARD 卡取款 Return:"+nRet);    
            nRet = top.API.Sys.DataSetSync(top.API.MTRN_AUTHORIZEDAMOUNTRULE,parseInt(strCWDAuthorized));
            nRet = top.API.Sys.DataSetSync(top.API.MTRN_TRANLIMITAMOUNTRULE,parseInt(strCWDQuota));        

            //设置存折存款授权限额、交易限额
            nRet = top.API.Sys.DataSetSync(top.API.MTRN_TRANSACTIONDIFFER, top.API.MTRN_WITHDRAW_PB);
            top.API.displayMessage("Trn DataSetSync MTRN_TRANSACTIONDIFFER MTRN_WITHDRAW_PB 折取款 Return:"+nRet);    
            nRet = top.API.Sys.DataSetSync(top.API.MTRN_AUTHORIZEDAMOUNTRULE,parseInt(strBankbookCWDAuthorized));
            nRet = top.API.Sys.DataSetSync(top.API.MTRN_TRANLIMITAMOUNTRULE,parseInt(strBankbookCWDQuota));        
            return CallResponse('OK');
        }
    }

    document.getElementById('Exit').onclick = function () {
        ButtonDisable();
        return CallResponse('Exit');
    }

    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        var arrGet = DataValue;
        var showinfo = arrGet[0];
        top.API.displayMessage("onDatGetPersistentDataComplete is done,DataName=" + DataName + ",DataType=" + DataType + ",DataValue=" + showinfo);
        if ('DEPQUOTA' == DataName) {
            DEPQuota.innerText = showinfo;
            strDEPQuota = DEPQuota.value;
            var nRet2 = top.API.Dat.GetPersistentData(top.API.NoCardDEPQuotaTag, top.API.NoCardDEPQuotaType);
            top.API.displayMessage("无折无卡存款：GetPersistentData NOCARDDEPQUOTA Return:" + nRet2);
        }
        if ('NOCARDDEPQUOTA' == DataName) {
            NoCardDEPQuota.innerText = showinfo;
            strNoCardDEPQuota = NoCardDEPQuota.value;
            var nRet3 = top.API.Dat.GetPersistentData(top.API.CWDQuotaTag, top.API.CWDQuotaType);
            top.API.displayMessage("有卡取款：GetPersistentData CWDQUOTA Return:" + nRet3);
        }
        if ('CWDQUOTA' == DataName) {
            CWDQuota.innerText = showinfo;
            strCWDQuota = CWDQuota.value;
            var nRet4 = top.API.Dat.GetPersistentData(top.API.BankbookCWDQuotaTag, top.API.BankbookCWDQuotaType);
            top.API.displayMessage("存折取款：GetPersistentData BANKBOOKCWDQUOTA Return:" + nRet4);
        }
        if ('BANKBOOKCWDQUOTA' == DataName) {
            BankbookCWDQuota.innerText = showinfo;
            strBankbookCWDQuota = BankbookCWDQuota.value;
        }
    }

    function onDatGetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatGetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        alert("读取失败");
		if ('DEPQUOTA' == DataName){
		    var nRet2 = top.API.Dat.GetPersistentData(top.API.NoCardDEPQuotaTag, top.API.NoCardDEPQuotaType);
            top.API.displayMessage("无折无卡存款：GetPersistentData NOCARDDEPQUOTA Return:"+nRet2);
		}
		if ('NOCARDDEPQUOTA' == DataName){
		    var nRet3 = top.API.Dat.GetPersistentData(top.API.CWDQuotaTag, top.API.CWDQuotaType);
            top.API.displayMessage("有卡取款：GetPersistentData CWDQUOTA Return:"+nRet3);
		}		
        if ('CWDQUOTA' == DataName) {
            var nRet4 = top.API.Dat.GetPersistentData(top.API.BankbookCWDQuotaTag, top.API.BankbookCWDQuotaType);
            top.API.displayMessage("存折取款：GetPersistentData BANKBOOKCWDQUOTA Return:" + nRet4);
        }
    }

    function onDatSetPersistentDataComplete(DataName) {
        top.API.displayMessage("onDatSetPersistentDataComplete is done,DataName=" + DataName);
        if ('DEPQUOTA' == DataName) {
            var inputvalue2 = new Array();
            inputvalue2[0] = parseInt(strNoCardDEPQuota);
            top.API.displayMessage('无折无卡存款：SetPersistentData NOCARDDEPQUOTA =' + inputvalue2);
            var nRet2 = top.API.Dat.SetPersistentData(top.API.NoCardDEPQuotaTag, top.API.NoCardDEPQuotaType, inputvalue2);
            top.API.displayMessage('无折无卡存款：SetPersistentData NOCARDDEPQUOTA Return:' + nRet2);
        }
        if ('NOCARDDEPQUOTA' == DataName) {
            var inputvalue3 = new Array();
            inputvalue3[0] = parseInt(strCWDQuota);
            top.API.displayMessage('有卡取款：SetPersistentData CWDQUOTA =' + inputvalue3);
            var nRet3 = top.API.Dat.SetPersistentData(top.API.CWDQuotaTag, top.API.CWDQuotaType, inputvalue3);
            top.API.displayMessage('有卡取款：SetPersistentData CWDQUOTA Return:' + nRet3);
        }
        if ('CWDQUOTA' == DataName) {
            var inputvalue4 = new Array();
            inputvalue4[0] = parseInt(strBankbookCWDQuota);
            top.API.displayMessage('存折取款：SetPersistentData BANKBOOKCWDQUOTA =' + inputvalue4);
            var nRet4 = top.API.Dat.SetPersistentData(top.API.BankbookCWDQuotaTag, top.API.BankbookCWDQuotaType, inputvalue4);
            top.API.displayMessage('存折取款：SetPersistentData BANKBOOKCWDQUOTA Return:' + nRet4);
        }
        if ('BANKBOOKCWDQUOTA' == DataName) {
            return CallResponse('OK');
        }
    }

    function onDatSetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatSetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
		alert("设定失败,请重新设定！");
    }

    //@User code scope end 

    //Register the event
    function EventLogin() {
        top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.addEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.addEvent("SetPersistentDataError", onDatSetPersistentDataError);
    }

    function EventLogout() {
        top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.removeEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.removeEvent("SetPersistentDataError", onDatSetPersistentDataError);
    }


    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
    }
})();
