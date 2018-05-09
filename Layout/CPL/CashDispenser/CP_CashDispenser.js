/*@create by:  tsxiong
 *@time: 2016年03月20日
 */
;(function () {
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

    var nCashUnitErrRetry = 0;
    var strPRESENTRESULT = "失败";

    var tmpCurrentInfo = new Array();
    var CurrentInfo = new Array();//实际出钞数据
    var rCurrentInfo = new Array();//回收箱数据
    var responseFlag = null;//跳转标志
    var partCwcFlag = false;//是否进入部分上账
    var partCwcJNL = 0;
    var shutterOpenFlag = false; // add by Gni 是否开钞门
    var saveBackFlag = false; // add by Gni 是否回存（针对卡钞时已取一部分款做判断）
    var Files = new dynamicLoadFiles();
    var CallResponse = App.Cntl.ProcessOnce(function (Response) {
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

        arrRJCount = top.API.GetUnitInfo(top.API.Cdm.PURejectCount());

        AllMoney = parseInt(top.API.CashInfo.strTransAmount);
        top.API.displayMessage("需要出钞的总金额:" + AllMoney);
        DispenseMoney = AllMoney;
        top.API.Cdm.SetDispenseAmount(DispenseMoney);
        var arrTransactionResult = new Array("出钞失败");
        top.API.gTakeCardAndPrint = true;
        top.API.Dat.SetDataSync("TRANSACTIONRESULT", "STRING", arrTransactionResult);
        top.API.displayMessage("Mix金额: " + DispenseMoney);
        Files.showNetworkMsg("正在出钞,请稍候...");
        top.API.Cdm.Mix(DispenseMoney, "CNY", "1");
        ButtonEnable();
        App.Plugin.Voices.play("voi_14");


    }();//Page Entry
    function ButtonDisable() {
        document.getElementById('OK').disabled = true;
        document.getElementById('ExitCard').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('OK').disabled = false;
        document.getElementById('ExitCard').disabled = false;
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

    function ShowLoading() {
        //document.getElementById("CinfoMoney").style.display = "none";
        //document.getElementById("CinfoTip").style.display = "none";
        $('#IsCwdPart').css('display', 'none');
        //document.getElementById("TipDiv").innerText = "正在出钞，请稍候...";
        //document.getElementById("AD").style.display = "block";
    }

    function showinfo() {
        $('#IsCwdPart').css('display', 'none');
        top.API.displayMessage("总额=" + AllMoney + ";已出:" + nOutMoneyAllTime);
        //document.getElementById("AD").style.display = "none";
        //document.getElementById("CinfoMoney").style.display = "block";
        //document.getElementById("CinfoTip").style.display = "block";
        //document.getElementById("cwdMoney").value = nOutMoneyAllTime;
        //document.getElementById("RemainMoney").value = AllMoney - nOutMoneyAllTime;
        //document.getElementById("TipDiv").innerText = "请取走您的钞票";
        //document.getElementById("CurOutMoney").innerText = cOutMoneyThisTime;
    }

    function ShowFailedInfo() {
        //top.API.displayMessage("是否回存saveBackFlag:" + saveBackFlag);

        saveBackFlag = shutterOpenFlag ? true : false; // 调用开钞门命令，又卡钞即回存 by Gni

        //$('#AD').css('display', 'none');
        //$('#CinfoTip').css('display', 'none');
        //$('#TipDiv').text('出钞失败，请核对已出钞票！');
        //$('#CinfoMoney').css('display', 'block');
        $('#cwdMoney').val(nTakenMoneyAllTime);
        //$('#RemainMoney').val(AllMoney - nTakenMoneyAllTime);
        //$("#CurOutMoney").html(cOutMoneyThisTime);
        $('#ExitCard').css('display', 'block');

        //取款冲正配置
        var CWCSupport = top.API.Dat.GetPrivateProfileSync("TransactionConfig", "CWCSupport", "0", top.API.Dat.GetBaseDir() + top.API.gIniFileName);

        //取款卡钞回存配置
        // var SetPartCwcFlag = top.API.Dat.GetPrivateProfileSync("TransactionConfig", "SetPartCwcFlag", "0", top.API.gIniFileName);

        //注意！ 如果取款冲正配置未来开启，则卡钞回存功能也不能用
        if( top.API.SaveBack ){  // 是否是银行卡允许卡钞回存
            if (CWCSupport == '1' && top.API.gbSAVEBACK_DEAL) {
                // if (cOutMoneyThisTime != 0 || saveBackFlag) {
                if (saveBackFlag) {
                    //$('#TipDiv').css('display', 'none');
                    //$('#CinfoMoney').css('display', 'none');
                    //$("#IsCwdPart").css('display', 'block');
                    var nNotTakenMoneyAllTime = AllMoney - nTakenMoneyAllTime;
                    //$('#cOutMoneyThisTime').text(cOutMoneyThisTime);
                    //$('#nTakenMoneyAllTime').text(nTakenMoneyAllTime);
                    //$('#nNotTakenMoneyAllTime').text(nNotTakenMoneyAllTime);
                    $('#OK').css('display', 'block');
                    $('#OK').text('同意');
                    $('#ExitCard').text('不同意');
                    SetPartCwc();
                }
            }
        }
        
        top.API.displayMessage("before---UpdateRecord");
        nCompleteOrError = false;
        top.API.Tsl.UpdateRecord(top.API.gCardno + ", " + "CWD" + ", " + top.API.CashInfo.strTransAmount + ", " + nTakenMoneyAllTime + ", " + top.API.gResponsecode + ", " + "PF");
        top.API.displayMessage("after---UpdateRecord");
        // upLoadTSL();
        App.Timer.SetPageTimeout(60);
    }

    function upLoadTSL() {

        if (top.API.gTslFlag) {
            //“日期|时间|卡号|流水号|交易类型|金额|身份证号|身份证头像路径|交易结果”TSL数据库日志
            top.API.gTslFlag = false;
            var TslLog = top.API.gTslDate;
            TslLog += "|" + top.API.gTslTime;
            TslLog += "|" + top.API.gCardno;
            TslLog += "|" + top.API.gTslJnlNum;
            TslLog += "|" + top.API.gTslChooseType;
            TslLog += "|" + top.API.gTslMoneyCount;
            TslLog += "|" + top.API.gIdNumber;
            TslLog += "|" + top.API.gIdCardpic;
            TslLog += "|" + top.API.gTslResult;
            top.API.Tsl.AddTransLogSync(TslLog); //CreateUpJnlFile
            //终端号（8位），交易日期（8位），交易时间（6位），交易类型（4位，0107代表存款，0108代表取款），
            //帐号（19位），交易金额（10位包含两位小数位），设备流水号（6位），设备流水批次号（6位），
            //后台返回码（2位），后台返回流水号（12位），设备交易状态（2位，00代表交易成功，01代表异常交易），异常状态类型（4位）
            var strUpJnl = top.API.gTerminalID;
            strUpJnl += "|!" + top.API.gTslDate;
            strUpJnl += "|!" + top.API.gTslTime;
            strUpJnl += "|!" + top.API.gTslChooseJnlType;
            strUpJnl += "|!" + top.API.gCardno;
            strUpJnl += "|!" + top.API.gTslMoneyCount.replace(".", "");
            strUpJnl += "|!" + top.API.gTslJnlNum;
            strUpJnl += "|!" + top.API.gTslJnlBtn;
            strUpJnl += "|!" + top.API.gTslResponsecode;
            strUpJnl += "|!" + top.API.gTslSysrefnum;
            strUpJnl += "|!00|!交易成功";
            top.API.Tsl.HandleRecordFileSync(top.API.MTSL_WRITECHECKTRANSRECORD, strUpJnl);
            //top.API.Tsl.HandleRecordFileSync(0, strUpJnl);

            /*top.API.Tsl.HandleRecordFileSync(top.API.MTSL_WRITETRANSRECORD, top.API.gCardno +
                ", " + "CWD" + ", " + top.API.CashInfo.strTransAmount + ", " + nTakenMoneyAllTime +
                ", " + top.API.gResponsecode + ", " + "PF");*/

            // 设置回存金额
            // top.API.CashInfo.strTransAmount = top.API.CashInfo.strTransAmount - nTakenMoneyAllTime;
            // top.API.displayMessage("top.API.CashInfo.strTransAmount1=" + top.API.CashInfo.strTransAmount);
        }
        /*function upLoadTSL() {

            //“日期|时间|卡号|流水号|交易类型|金额|身份证号|身份证头像路径|交易结果”TSL数据库日志
            var TslLog = top.API.gTslDate;
            TslLog += "|" + top.API.gTslTime;
            TslLog += "|" + top.API.gCardno;
            TslLog += "|" + top.API.gTslJnlNum;
            TslLog += "|" + top.API.gTslChooseType;
            TslLog += "|" + top.API.gTslMoneyCount;
            TslLog += "|" + top.API.gIdNumber;
            TslLog += "|" + top.API.gIdCardpic;
            TslLog += "|" + top.API.gTslResult;
            top.API.Tsl.AddTransLogSync(TslLog); //CreateUpJnlFile
            //终端号（8位），交易日期（8位），交易时间（6位），交易类型（4位，0107代表存款，0108代表取款），
            //帐号（19位），交易金额（10位包含两位小数位），设备流水号（6位），设备流水批次号（6位），
            //后台返回码（2位），后台返回流水号（12位），设备交易状态（2位，00代表交易成功，01代表异常交易），异常状态类型（4位）
            var strUpJnl = top.API.gTerminalID;
            strUpJnl += "|!" + top.API.gTslDate;
            strUpJnl += "|!" + top.API.gTslTime;
            strUpJnl += "|!" + top.API.gTslChooseJnlType;
            strUpJnl += "|!" + top.API.gCardno;
            strUpJnl += "|!" + top.API.gTslMoneyCount.replace(".", "");
            strUpJnl += "|!" + top.API.gTslJnlNum;
            strUpJnl += "|!" + top.API.gTslJnlBtn;
            strUpJnl += "|!" + top.API.gTslResponsecode;
            strUpJnl += "|!" + top.API.gTslSysrefnum;
            strUpJnl += "|!00|!交易成功";
            top.API.Tsl.HandleRecordFileSync(top.API.MTSL_WRITECHECKTRANSRECORD, strUpJnl);

            top.API.Tsl.HandleRecordFileSync(top.API.MTSL_WRITETRANSRECORD, top.API.gCardno +
                ", " + "CWD" + ", " + top.API.CashInfo.strTransAmount +
                ", " + nTakenMoneyAllTime + ", " +
                top.API.gResponsecode + ", " + "PF")

            // 设置回存金额
            // top.API.CashInfo.strTransAmount = top.API.CashInfo.strTransAmount - nTakenMoneyAllTime;
            top.API.displayMessage("top.API.CashInfo.strTransAmount2=" + top.API.CashInfo.strTransAmount);

        }*/
    }

    function SetPartCwc() {
        // nOutMoneyAllTime 已出金额
        top.API.displayMessage("AllMoney: " + AllMoney + "-----nTakenMoneyAllTime:" + nTakenMoneyAllTime + '----nOutMoneyAllTime:' + nOutMoneyAllTime);
        var partCwcMoney = AllMoney - nTakenMoneyAllTime;
        top.API.displayMessage("partCwcMoney:" + partCwcMoney);
        if (partCwcMoney > 0 && nOutMoneyAllTime != 0) {
            partCwcFlag = true;
        }
        if (partCwcFlag) {
            //设置流水号
            top.API.needPrintReDEPCash = true;
            top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);
            //判断冲正类型(存款类型)
            if (top.API.CashInfo.Dealtype == "CWD取款") {
                top.API.CashInfo.Dealtype = "REDEP";
                var arrDealType = new Array(top.API.CashInfo.Dealtype);
                top.API.Dat.SetDataSync(top.API.dealtypeTag, top.API.dealtypeType, arrDealType);
                top.API.Sys.DataSetSync(top.API.MTRN_TRANSACTIONDIFFER, top.API.MTRN_DEPOSIT_CARD);
                top.API.gTransactiontype = "DEP";
            } else if (top.API.CashInfo.Dealtype == "存折取款") {
                top.API.CashInfo.Dealtype = "REDEP";
                top.API.gATMORTCR = "TCR";
                top.API.gTransactiontype = "NOCARDDEP";
                var arrDealType = new Array(top.API.CashInfo.Dealtype);
                top.API.Dat.SetDataSync(top.API.dealtypeTag, top.API.dealtypeType, arrDealType);
                top.API.Sys.DataSetSync(top.API.MTRN_TRANSACTIONDIFFER, top.API.MTRN_DEPOSIT_PB);
            }
            //设置为存款类型
            //top.API.gTransactiontype = "DEP";
            //设置冲正(存款)金额
            var tmp = partCwcMoney + "00";
            var arrCashAmount = new Array(tmp);
            top.API.Dat.SetDataSync(top.API.transamountTag, top.API.transamountType, arrCashAmount);

            //for 回存凭条
            top.API.Dat.SetDataSync("DISPENAMOUNT", "STRING", new Array(AllMoney + '00'));  //总金额

            top.API.Dat.SetDataSync("TAKENAMOUNT", "STRING", new Array(nTakenMoneyAllTime + '00'));  //已金额

            //设置跳转标志
            responseFlag = 'partCwc';
        }
    }

    function ShowSuccessInfo() {
        ButtonEnable();
        top.API.displayMessage("出钞成功，总额=" + AllMoney + ";已出:" + nOutMoneyAllTime);
        nCompleteOrError = true;
        //document.getElementById("CnextTip").innerHTML = "出钞完毕，请点击<确定>按钮";
        document.getElementById("OK").style.display = "block";

        top.API.Tsl.UpdateRecord(top.API.gCardno + ", " + "CWD" + ", " + top.API.CashInfo.strTransAmount + ", " + nOutMoneyAllTime + ", " + top.API.gResponsecode + ", " + "");
        return CallResponse('OK');
        //App.Timer.SetPageTimeout(60);
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
                            nRoundCount = nRoundCount - ArrDispense[nUnits];
                            top.API.displayMessage("钞箱" + (nUnits + 1) + "配钞张数=" + ArrDispense[nUnits]);
                        } else {
                            ArrDispense[nUnits] = ArrMixResult[nUnits];
                            nRoundCount = nRoundCount - ArrDispense[nUnits];
                            top.API.displayMessage("钞箱" + (nUnits + 1) + "配钞张数=" + ArrDispense[nUnits]);
                            continue;//为了确保出钞总张数为100张。
                        }
                    }
                    top.API.displayMessage("当次各钞箱出钞情况:" + ArrDispense);
                    top.API.Cdm.Dispense(0, ArrDispense, "CNY", "0");
                    break;
                }
            }
        }
        for (nUnits = 0; nUnits < top.API.CashInfo.nCountOfUnits; nUnits++) {
            ArrMixResult[nUnits] = 0;
        }
    }


    function VoicesPlay() {
        App.Plugin.Voices.play("voi_7");
    }

    //@User code scope end 

    //event handler
    function onCashDispensed(info, Amount) {
        top.API.displayMessage("onCashDispensed触发");
        cOutMoneyThisTime = Amount;
        nOutMoneyAllTime += Amount;
        var arrInfo = new Array();
        arrInfo = info;
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
			top.API.displayMessage("OutputStatus: " + top.API.Cdm.StOutputStatus());
            top.API.Cdm.OpenShutter(top.API.gOpenShutterTimeOut);
			if(top.API.Cdm.StOutputStatus() == "EMPTY"){
				setTimeout(function(){
				top.API.Cdm.CloseShutter(top.API.gCloseShutterTimeOut);},10000);
			}
        }
    }

    function onNotDispensable() {
        top.ErrorInfo = top.API.PromptList.No4;
        if (nOutMoneyAllTime == 0) {
            var arrCWCFlag = new Array();
            arrCWCFlag[0] = 1;
            top.API.Dat.SetPersistentData(top.API.cwcflagTag, top.API.cwcflagType, arrCWCFlag);
        } else {
            showinfo();
            ShowFailedInfo();
        }
    }

    function onMixFailed() {
        top.ErrorInfo = top.API.PromptList.No4;
        if (nOutMoneyAllTime == 0) {
            var arrCWCFlag = new Array();
            arrCWCFlag[0] = 1;
            top.API.Dat.SetPersistentData(top.API.cwcflagTag, top.API.cwcflagType, arrCWCFlag);
        } else {
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

    function onMixComplete(MixResult) {
        ArrMixResult = MixResult;
        var i = 0;
        var bStartDispense = true;
        for (i = 0; i < ArrMixResult.length; i++) {
            if ((ArrMixResult[i] != 0) && (top.API.CashInfo.arrUnitCurrency[i] != 100 )) {
                bStartDispense = false;
                break;
            }
        }
        if (bStartDispense) {
            StartDispense();
        } else {
            top.API.displayMessage("Mix结果返回存在零钞");
            showinfo();
            ShowFailedInfo();
        }
    }

    function onCashDispenseFailed(info, Amount) {
        top.API.displayMessage("onCashDispenseFailed ,出钞情况：" + Amount);
        var arrInfo = new Array();
        arrInfo = info;
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


        if (nCashUnitErrRetry > 3 || (cdmStatus == "HARDWAREERROR" || cdmStatus == "OFFLINE")) {
            top.ErrorInfo = top.API.PromptList.No4;
            if (nOutMoneyAllTime == 0) {
                //修改冲正标志
                var arrCWCFlag = new Array();
                arrCWCFlag[0] = 1;
                top.API.Dat.SetPersistentData(top.API.cwcflagTag, top.API.cwcflagType, arrCWCFlag);
            } else {
                //showinfo();
                ShowFailedInfo();
            }
        } else {
            showinfo();
            nCashUnitErrRetry++;
            var tmp1 = top.API.Cdm.StOutputStatus();
            if (tmp1 == "EMPTY") {
                top.API.displayMessage("CashUnitError，Mix,金额=" + DispenseMoney);
                top.API.Cdm.Mix(DispenseMoney, "CNY", "1");
                ShowLoading();
            } else {
                top.API.Cdm.OpenShutter(top.API.gOpenShutterTimeOut);
            }
        }
    }

    //*****************取款钞口有钞方案*************************
    function onOutPositionNotEmpty() {
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

    function onShutterOpened() {
        top.API.displayMessage("onShutterOpened触发,提示客户拿走钞票");
        shutterOpenFlag = true; // 调用开钞门命令，即视为已取款 by Gni
        App.Timer.SetIntervalDisposal(VoicesPlay, 12000);
        App.Timer.SetPageTimeout(180);
    }

    function onShutterClosed() {
        top.API.displayMessage("onShutterClosed触发");
        if (AllMoney > nOutMoneyAllTime) {
            DispenseMoney = AllMoney - nOutMoneyAllTime;
            top.API.Cdm.Mix(DispenseMoney, "CNY", "1");
            ShowLoading();
        } else if (AllMoney == nOutMoneyAllTime) {
            ShowSuccessInfo();
        } else {
            ShowFailedInfo();
        }
    }

    function onShutterOpenFailed() {
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

    function onShutterCloseFailed() {
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

    function onSubDispenseOk(info, Amount) {
        top.API.displayMessage("onSubDispenseOk触发");
        nOutMoneyAllTime += Amount;
        cOutMoneyThisTime = Amount;//当笔已出金额
        if (nOutMoneyAllTime != AllMoney) {
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


    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        var arrDataValue = DataValue;
        var JnlNum = 0;
        if ('JNLNUM' == DataName) {
            JnlNum = arrDataValue[0] + 1;
            if (JnlNum.toString().length === 7) {
                JnlNum = 0;
            }
            partCwcJNL = JnlNum;
            //设置交易流水号
            var arrJnlNum = new Array();
            arrJnlNum[0] = JnlNum;
            top.API.Dat.SetPersistentData(top.API.jnlnumTag, top.API.jnlnumType, arrJnlNum);
        }
        //设置上一次取款的流水号
        top.API.Dat.SetDataSync("JNLNUM2", "LONG", arrDataValue);
    }

    function onDatGetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatGetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        top.ErrorInfo = top.API.PromptList.No4;
        return CallResponse('Exit');
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
        top.API.CashInfo.arrUnitRemain = top.API.GetUnitInfo(top.API.Cdm.PUCurrentCount());
        //获取RJ信息
        var NewarrRJCount = new Array();
        NewarrRJCount = top.API.GetUnitInfo(top.API.Cdm.PURejectCount());
        //
        var nRJCount = 0;
        for (i = 0; i < top.API.CashInfo.nCountOfUnits; i++) {
            rCurrentInfo[i] = NewarrRJCount[i] - arrRJCount[i];
            CurrentInfo[i] += rCurrentInfo[i];
            nRJCount += rCurrentInfo[i];
        }
        CurrentInfo[3] = 0 - nRJCount;
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

        if('partCwc' == responseFlag){
            top.API.Jnl.PrintSync("selectReDep");
        }
    }

    document.getElementById('OK').onclick = function () {
        ButtonDisable();
        if (!partCwcFlag) {
            responseFlag = "OK";
            upLoadTSL();
            top.API.Jnl.PrintSync("CwdComplete");
        }else if(saveBackFlag && top.API.gbSAVEBACK_DEAL){
            top.API.CashInfo.strTransAmount = top.API.CashInfo.strTransAmount - nTakenMoneyAllTime;
			
			var arrTmp = new Array("2");
			top.API.Dat.SetDataSync("DEPFLAG", "STRING", arrTmp);//卡存款48域为1，取款回存为2
        }
        //打印取款卡钞，部分上账的异常的凭条
        return CallResponse(responseFlag);
    }
    document.getElementById('ExitCard').onclick = function () {
        ButtonDisable();
        responseFlag = 'Exit';
        top.API.needPrintReDEPCash = false;
        top.API.displayMessage("Exit------responseFlag:" + responseFlag)
        return CallResponse(responseFlag);
    }

    //**************************************************************
    //Register the event
    function EventLogin() {
        top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.addEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.addEvent("SetPersistentDataError", onDatSetPersistentDataError);
        /////
        top.API.Cdm.addEvent('MixComplete', onMixComplete);
        top.API.Cdm.addEvent('MixFailed', onMixFailed);
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
        top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.removeEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.removeEvent("SetPersistentDataError", onDatSetPersistentDataError);
        ///
        top.API.Cdm.removeEvent('MixComplete', onMixComplete);
        top.API.Cdm.removeEvent('MixFailed', onMixFailed);
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
        responseFlag = 'TimeOut';
        top.API.displayMessage("TimeoutCallBack----responseFlag:" + responseFlag);
        var tmp1 = top.API.Cdm.StOutputStatus();
        var tmp2 = top.API.Cim.StInputStatus();
        if (tmp1 != "EMPTY" || tmp2 != "EMPTY") {
            top.API.displayMessage("客户未取钞");
            strPRESENTRESULT = "客户未取钞"
            top.ErrorInfo = top.API.PromptList.No3;
            var arrTransactionResult = new Array("客户未取钞");
            top.API.gTakeCardAndPrint = true;
            top.API.Dat.SetDataSync("TRANSACTIONRESULT", "STRING", arrTransactionResult);
            return CallResponse(responseFlag);
        } else {
            if (nCompleteOrError) {
                return CallResponse('OK');
            } else {
                top.ErrorInfo = top.API.PromptList.No3;
                return CallResponse(responseFlag);
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
