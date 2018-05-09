/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {
    var BService;
    var bReset = false;
	var bCimReset = false;
    var bCdmReset = false;
    var bCrdReset = false;
    var bFpiReset = false;
    var bIdrReset = false;
    var bPinReset = false;
    var timeoutId = null;
    var BreakDown=false;//是否有钞箱故障
    var TcpBreakDown=false;//是否有通讯故障
    var SptPaperStatus="";//A4打印状态
    var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        ButtonDisable();
        EventLogin();
        showstatusinfo();  
        NetStatu();   
		// onCheckExchangTime();    
		// if (top.API.gOutService == false) {
  //           document.getElementById('Service').value = "关闭服务";
  //           document.getElementById('SuperVise').style.display = "none";
  //       } else {
  //           document.getElementById('Service').value = "开启服务";
		// 	document.getElementById('SuperVise').style.display = "inline";
  //       }
        ButtonEnable();
        if(top.API.UnitStatusflg==0)//切后屏时
        {
            $('.BtnBack').css("display","none");
            $('.adminLogin').css("display","block");
            $("#PageRoot").text("开启服务");
        }else{
            $('.BtnBack').css("display","block");
            $('.adminLogin').css("display","none");
            $("#PageRoot").text("退出登录");
        }
    }();//Page Entry
    function ButtonDisable() {
        // document.getElementById('Service').disabled = true;
        // document.getElementById('Reset').disabled = true;
        // document.getElementById('Shutdown').disabled = true;
        // document.getElementById('Reboot').disabled = true;
        // document.getElementById('SuperVise').disabled = true;
        document.getElementById('PageRoot').disabled = true;
		document.getElementById('Back').disabled = true;
        document.getElementById('Tadmin').disabled = true;
        document.getElementById('Badmin').disabled = true;
        // document.getElementById('ExitImg').disabled = true;
    }

    function ButtonEnable() {
        // document.getElementById('Service').disabled = false;
        // document.getElementById('Reset').disabled = false;
        // document.getElementById('Shutdown').disabled = false;
        // document.getElementById('Reboot').disabled = false;
        // document.getElementById('SuperVise').disabled = false;
        document.getElementById('PageRoot').disabled = false;
		document.getElementById('Back').disabled = false;
        document.getElementById('Tadmin').disabled = false;
        document.getElementById('Badmin').disabled = false;
        // document.getElementById('ExitImg').disabled = false;
    }
	function showinfo(){
		if(!bReset){
			top.API.gTransStatus = top.API.Sys.PossibleTransactionSync();        
			top.API.gPartsStatus = top.API.Sys.GetPartsStatusSync();
			showstatusinfo();
		}		
	}
    //通讯状态
    function NetStatu(){
        var nCurNetState = top.API.Dat.GetDataSync("CURNETSTATE", "LONG")[0];
        if (nCurNetState == 0) { // Net Offline
            TcpBreakDown=true;
            if(TcpBreakDown){
               document.getElementById('faultContent3').innerText = "通讯故障";
               document.getElementById('normalInfo').style.display = "none";
            }
            showFault(); 
        }else{
            TcpBreakDown=false;  
            document.getElementById('faultContent3').innerText = ""; 
            showFault(); 

        }
    }
    //@User ocde scope start
    function showstatusinfo() {
        // if (top.API.gOutService) {
        //     document.getElementById('SuperVise').style.display = "inline";
        //     document.getElementById('Service').value = "开启服务";
        // } else {
        //     document.getElementById('SuperVise').style.display = "none";
        //     document.getElementById('Service').value = "关闭服务";
        // }
        showstatus();
        showmoney();
        showFault();
    }
	
    //显示故障
    function showFault(){
		var ErrorCode = "00000(00)";
		var ErrorCodeInfo = top.API.Sys.InfoGetSync(38);
		top.API.displayMessage("ErrorCodeInfo="+ErrorCodeInfo);
		if(ErrorCodeInfo != ""){
			var arrErrorCodeInfo = ErrorCodeInfo.split("|");
			var ErrorUintName = arrErrorCodeInfo[0];			
			var ErrorInfo = arrErrorCodeInfo[2];
			ErrorCode = arrErrorCodeInfo[1];
			document.getElementById('faultContent').innerText = ErrorUintName + ErrorInfo;
			document.getElementById('normalInfo').style.display = "none";
		}else if(TcpBreakDown||BreakDown){
                document.getElementById('faultContent').innerText = "";	
                document.getElementById('normalInfo').style.display = "none";				
		}
        else{
            document.getElementById('faultContent').innerText = "无";
            document.getElementById('normalInfo').style.display = "block";
        }
		// document.getElementById('DevStatus').innerText = ErrorCode;
    }
    // function CheckCusStatus() {//获得钞箱信息
    //     top.API.CheckDeviceStatus();
    //    // $("#shade").hide(); 
    //     var arrCurrentCount = new Array();
    //     var arrSplite = new Array();
    //     var arrReturnInfo = new Array();
    //     arrCurrentCount = top.API.Cdm.PUCurrentCount();
    //     for (i = 0; i < arrCurrentCount.length; i++) {
    //         arrSplite = arrCurrentCount[i].split(":");
    //         top.API.CashInfo.arrUnitName[i] = arrSplite[0];
    //         top.API.CashInfo.arrUnitRemain[i] = arrSplite[1];
    //     }
    //     //获取当前钞箱信息--钞箱面值
    //     top.API.CashInfo.arrUnitCurrency = top.API.GetUnitInfo(top.API.Cdm.CUNoteValue());//.toArray());
    //     //获取当前钞箱信息--钞箱个数
    //     top.API.CashInfo.nCountOfUnits = top.API.CashInfo.arrUnitRemain.length; 
    // }

    function showmoney() {//显示钞箱信息
        // CheckCusStatus();
        top.API.displayMessage("showmoney()");
        top.API.displayMessage("纸币余量top.API.CashInfo.arrUnitRemain" + top.API.CashInfo.arrUnitRemain);
        var cashboxid = "";
        var moneynumid = "";
        var Currencyid = "";
        var UintNameid = "";
        var Currency ="";
        var ClsCashBoxNum = "";
        var nAllMoney = 0;
        var custatus="";//钞箱状态
        var AllCusBreakDown="";//保存钞箱的所有故障信息
        var i = 0;
        var j = 0;
        var nRej = 0;
        var bTmp = false;
        var tmpArray = new Array();
        BreakDown=false;
        document.getElementById('faultContent2').innerText="";   
        for (i = 0; i < top.API.CashInfo.nCountOfUnits; i++) {
            tmpArray[i] = top.API.CashInfo.arrUnitRemain[i];            
        }

        for (i = 1; i < (top.API.CashInfo.nCountOfUnits + 1) ; i++) {
            cashboxid = "CashBox" + i.toString();
            UintNameid = "UintName" + i.toString();
            moneynumid = "MoneyNum" + i.toString();
            ClsCashBoxNum = "ClsCashBox" + i.toString();
           Currencyid = "CurrencyNo" + i.toString();
            document.getElementById(ClsCashBoxNum).style.display = "block";
           switch (top.API.CashInfo.arrUnitCurrency[i-1]) {
                case 100:
                    Currency = '100';                    
                    break;
                case 50:
                    Currency = '050';
                    break;
                case 20:
                    Currency = '020';
                    break;
                case 10:
                    Currency = '010';
                    break;
                case 5:
                    Currency = '005';
                    break;
                case 1:
                    Currency = '001';
                    break;
                default:
                   Currency = '000';
                    break;
                }
            nAllMoney += tmpArray[i - 1] * parseInt(Currency);
           document.getElementById(Currencyid).innerText = Currency;
           document.getElementById(UintNameid).innerText = top.API.CashInfo.arrUnitName[i-1];
            if (tmpArray[i - 1] == 0) {
                document.getElementById(cashboxid).style.backgroundImage = "url('Framework/style/Graphics/btn/cxzt0.png')";
            }
            else if (tmpArray[i - 1] <= 600) {
                document.getElementById(cashboxid).style.backgroundImage = "url('Framework/style/Graphics/btn/cxzt1.png')";
            }
            else if (tmpArray[i - 1] <= 1200) {
                document.getElementById(cashboxid).style.backgroundImage = "url('Framework/style/Graphics/btn/cxzt2.png')";
            }
            else if (tmpArray[i - 1] <= 1800) {
                document.getElementById(cashboxid).style.backgroundImage = "url('Framework/style/Graphics/btn/cxzt3.png')";
            }
            else if (tmpArray[i - 1] <= 2400) {
                document.getElementById(cashboxid).style.backgroundImage = "url('Framework/style/Graphics/btn/cxzt4.png')";
            }
            else {
                document.getElementById(cashboxid).style.backgroundImage = "url('Framework/style/Graphics/btn/cxzt5.png')";
            }

            custatus=top.API.Cim.CUStatus()[i-1]; 
            var tempCustatus=custatus.split(":")[1];          
            top.API.displayMessage("钞箱"+cashboxid+"状态："+tempCustatus);
            if(tempCustatus=="MISSING"||tempCustatus=="INOPERATIVE"||tempCustatus=="MANIPULATED"){//钞箱是否故障 MANIPULATED:钞箱进入维护状态（比如拔出钞箱在放回，须加钞才能恢复）
                AllCusBreakDown+="钞箱"+cashboxid+"故障("+tempCustatus+")."
                BreakDown=true;
                //document.getElementById(cashboxid).style.backgroundImage = "url('Framework/style/Graphics/btn/icon2.png')";
            }
            document.getElementById(moneynumid).innerText = tmpArray[i - 1];
        }
        if(BreakDown){
            document.getElementById('faultContent2').innerText = AllCusBreakDown;
            document.getElementById('normalInfo').style.display = "none";
        }
        document.getElementById('AllMoney').innerText = nAllMoney.toString() + ".00元";
    }

    function showstatus() {
        top.API.displayMessage("showstatus()");
		//获取保险门状态
        top.API.CheckDeviceStatus();
        $("#shade").hide(); 
		var doorstatus = top.API.Cim.StSafeDoorStatus();
        top.API.displayMessage("top.API.Cim.StSafeDoorStatus==" + doorstatus);
        if (doorstatus == "OPEN") {
            document.getElementById("WTip").style.display = "block";            
        }else{
			document.getElementById("WTip").style.display = "none";   
		}
		if (top.API.gTransStatus == "-1") {
            top.API.displayMessage("-------获取各交易状态失败------");
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
             var arrTransStatus = top.API.gTransStatus.split(",");
			if (parseInt(arrTransStatus[0]) == 1) {
				document.getElementById("TradeIcon1").style.backgroundImage = "url('Framework/style/Graphics/btn/icon1.png')";
			} else {
				document.getElementById("TradeIcon1").style.backgroundImage = "url('Framework/style/Graphics/btn/icon2.png')";
			}        
			if (parseInt(arrTransStatus[3]) == 1) {
				document.getElementById("TradeIcon2").style.backgroundImage = "url('Framework/style/Graphics/btn/icon1.png')";
			} else {
				document.getElementById("TradeIcon2").style.backgroundImage = "url('Framework/style/Graphics/btn/icon2.png')";
			}
			if (parseInt(arrTransStatus[5]) == 1) {
				document.getElementById("TradeIcon3").style.backgroundImage = "url('Framework/style/Graphics/btn/icon1.png')";
			} else {
				document.getElementById("TradeIcon3").style.backgroundImage = "url('Framework/style/Graphics/btn/icon2.png')";
			}
			if (parseInt(arrTransStatus[4]) == 1) {
				document.getElementById("TradeIcon4").style.backgroundImage = "url('Framework/style/Graphics/btn/icon1.png')";
			} else {
				document.getElementById("TradeIcon4").style.backgroundImage = "url('Framework/style/Graphics/btn/icon2.png')";
			}
            // if (parseInt(arrTransStatus[9]) == 1) {
            //     document.getElementById("TradeIcon5").style.backgroundImage = "url('Framework/style/Graphics/btn/icon1.png')";
            // } else {
            //     document.getElementById("TradeIcon5").style.backgroundImage = "url('Framework/style/Graphics/btn/icon2.png')";
            // }
            if (parseInt(arrTransStatus[8]) == 1) {
                document.getElementById("TradeIcon13").style.backgroundImage = "url('Framework/style/Graphics/btn/icon1.png')";
            } else {
                document.getElementById("TradeIcon13").style.backgroundImage = "url('Framework/style/Graphics/btn/icon2.png')";
            }
            // if (parseInt(arrTransStatus[12]) == 1) {
            //     document.getElementById("TradeIcon6").style.backgroundImage = "url('Framework/style/Graphics/btn/icon1.png')";
            // } else {
            //     document.getElementById("TradeIcon6").style.backgroundImage = "url('Framework/style/Graphics/btn/icon2.png')";
            // }
            if (parseInt(arrTransStatus[13]) == 1) {
                document.getElementById("TradeIcon7").style.backgroundImage = "url('Framework/style/Graphics/btn/icon1.png')";
            } else {
                document.getElementById("TradeIcon7").style.backgroundImage = "url('Framework/style/Graphics/btn/icon2.png')";
            }
            // if (parseInt(arrTransStatus[14]) == 1) {
            //     document.getElementById("TradeIcon8").style.backgroundImage = "url('Framework/style/Graphics/btn/icon1.png')";
            // } else {
            //     document.getElementById("TradeIcon8").style.backgroundImage = "url('Framework/style/Graphics/btn/icon2.png')";
            // }
            // if (parseInt(arrTransStatus[15]) == 1) {
            //     document.getElementById("TradeIcon9").style.backgroundImage = "url('Framework/style/Graphics/btn/icon1.png')";
            // } else {
            //     document.getElementById("TradeIcon9").style.backgroundImage = "url('Framework/style/Graphics/btn/icon2.png')";
            // }
            // if (parseInt(arrTransStatus[16]) == 1) {
            //     document.getElementById("TradeIcon10").style.backgroundImage = "url('Framework/style/Graphics/btn/icon1.png')";
            // } else {
            //     document.getElementById("TradeIcon10").style.backgroundImage = "url('Framework/style/Graphics/btn/icon2.png')";
            // }
            // if (parseInt(arrTransStatus[17]) == 1) {
            //     document.getElementById("TradeIcon11").style.backgroundImage = "url('Framework/style/Graphics/btn/icon1.png')";
            // } else {
            //     document.getElementById("TradeIcon11").style.backgroundImage = "url('Framework/style/Graphics/btn/icon2.png')";
            // }
            // if (parseInt(arrTransStatus[18]) == 1) {
            //     document.getElementById("TradeIcon12").style.backgroundImage = "url('Framework/style/Graphics/btn/icon1.png')";
            // } else {
            //     document.getElementById("TradeIcon12").style.backgroundImage = "url('Framework/style/Graphics/btn/icon2.png')";
            // }
             SptPaperStatus = top.API.Spt.StPaperStatus().split(",")[0];
            if(top.API.Idr.bDeviceStatus&&top.API.Fpi.bDeviceStatus&&top.API.Tfc.bDeviceStatus&&top.API.Spt.bDeviceStatus&&SptPaperStatus!="JAMMED"&&SptPaperStatus!="OUT"){//大额交易 身份证，指纹仪，A4打印（无纸，卡纸）不在线都不可做大额交易
                if (parseInt(arrTransStatus[5]) == 1) {//存款
                    document.getElementById("TradeIcon14").style.backgroundImage = "url('Framework/style/Graphics/btn/icon1.png')";
                } else {
                    document.getElementById("TradeIcon14").style.backgroundImage = "url('Framework/style/Graphics/btn/icon2.png')";
                }
                var tmplRetBigTranLimit = top.API.Dat.GetDataSync("POSSIBLEDISPENSE100AMOUNT", "LONG")[0];//大额可取款起始金额
                if (parseInt(arrTransStatus[3]) != 1|| tmplRetBigTranLimit < 20000) {//取款，小于20000不可取款
                    document.getElementById("TradeIcon15").style.backgroundImage = "url('Framework/style/Graphics/btn/icon2.png')";//不可取款                    
                } else {
                    document.getElementById("TradeIcon15").style.backgroundImage = "url('Framework/style/Graphics/btn/icon1.png')";//可取款
                }
                if (parseInt(arrTransStatus[13]) == 1) {//转账
                    document.getElementById("TradeIcon16").style.backgroundImage = "url('Framework/style/Graphics/btn/icon1.png')";
                } else {
                    document.getElementById("TradeIcon16").style.backgroundImage = "url('Framework/style/Graphics/btn/icon2.png')";
                }
                if (parseInt(arrTransStatus[8]) == 1) {//现金汇款
                    document.getElementById("TradeIcon17").style.backgroundImage = "url('Framework/style/Graphics/btn/icon1.png')";
                } else {
                    document.getElementById("TradeIcon17").style.backgroundImage = "url('Framework/style/Graphics/btn/icon2.png')";
                }

            }
            else{
                document.getElementById("TradeIcon14").style.backgroundImage = "url('Framework/style/Graphics/btn/icon2.png')";
                document.getElementById("TradeIcon15").style.backgroundImage = "url('Framework/style/Graphics/btn/icon2.png')";
                document.getElementById("TradeIcon16").style.backgroundImage = "url('Framework/style/Graphics/btn/icon2.png')";
                document.getElementById("TradeIcon17").style.backgroundImage = "url('Framework/style/Graphics/btn/icon2.png')";

            }
		}
		
		if (top.API.Cim.bDeviceStatus && top.API.Cdm.bDeviceStatus) {
			document.getElementById("CASH").style.backgroundImage = "url('Framework/style/Graphics/btn/icon1.png')";
		}else {
			document.getElementById("CASH").style.backgroundImage = "url('Framework/style/Graphics/btn/icon2.png')";
		}
		if (top.API.Crd.bDeviceStatus) {
			document.getElementById("CRD").style.backgroundImage = "url('Framework/style/Graphics/btn/icon1.png')";
		}else {
			document.getElementById("CRD").style.backgroundImage = "url('Framework/style/Graphics/btn/icon2.png')";
		}
		if (top.API.Fpi.bDeviceStatus) {
			document.getElementById("FPI").style.backgroundImage = "url('Framework/style/Graphics/btn/icon1.png')";
		}else {
			document.getElementById("FPI").style.backgroundImage = "url('Framework/style/Graphics/btn/icon2.png')";
		}
		if (top.API.Idr.bDeviceStatus) {
			document.getElementById("IDR").style.backgroundImage = "url('Framework/style/Graphics/btn/icon1.png')";
		}else {
			document.getElementById("IDR").style.backgroundImage = "url('Framework/style/Graphics/btn/icon2.png')";
		}
		if (top.API.Pin.bDeviceStatus && (top.API.Pin.KeyIsValidSync("MasterKey"))) {
			document.getElementById("PIN").style.backgroundImage = "url('Framework/style/Graphics/btn/icon1.png')";
		}else {
			document.getElementById("PIN").style.backgroundImage = "url('Framework/style/Graphics/btn/icon2.png')";    
		}
		if (top.API.Ptr.bDeviceStatus) {
			document.getElementById("PTR").style.backgroundImage = "url('Framework/style/Graphics/btn/icon1.png')";
			document.getElementById("JNL").style.backgroundImage = "url('Framework/style/Graphics/btn/icon1.png')";
		} else {
			document.getElementById("PTR").style.backgroundImage = "url('Framework/style/Graphics/btn/icon2.png')";
			document.getElementById("JNL").style.backgroundImage = "url('Framework/style/Graphics/btn/icon2.png')";
		}
		if (top.API.Scr.bDeviceStatus) {
			document.getElementById("SCR").style.backgroundImage = "url('Framework/style/Graphics/btn/icon1.png')";
		}else {
			document.getElementById("SCR").style.backgroundImage = "url('Framework/style/Graphics/btn/icon2.png')";
		}
        if (top.API.Tfc.bDeviceStatus) {
            document.getElementById("TFC").style.backgroundImage = "url('Framework/style/Graphics/btn/icon1.png')";
        }else {
            document.getElementById("TFC").style.backgroundImage = "url('Framework/style/Graphics/btn/icon2.png')";
        }
        SptPaperStatus = top.API.Spt.StPaperStatus().split(",")[0];
        if (top.API.Spt.bDeviceStatus&&SptPaperStatus!="JAMMED"&&SptPaperStatus!="OUT") {//A4打印机不在线，无纸或卡纸都不可用
            document.getElementById("SPT").style.backgroundImage = "url('Framework/style/Graphics/btn/icon1.png')";
        }else {
            document.getElementById("SPT").style.backgroundImage = "url('Framework/style/Graphics/btn/icon2.png')";
        }
		       
    }

  //   document.getElementById('Service').onclick = function () {
		// top.API.gOutService = !top.API.gOutService;
  //       if (top.API.gOutService == false) {
  //           document.getElementById('Service').value = "关闭服务";
  //           document.getElementById('SuperVise').style.display = "none";
  //       } else {
  //           document.getElementById('Service').value = "开启服务";
		// 	document.getElementById('SuperVise').style.display = "inline";
  //       }
  //   }

  //   document.getElementById('SuperVise').onclick = function () {
  //       return CallResponse('OK');
  //   }

  //   document.getElementById('Shutdown').onclick = function () {
		// return CallResponse("Shutdown");
  //   }

  //   document.getElementById('Reboot').onclick = function () {
		// return CallResponse("Reboot");
  //   }

  //   document.getElementById('Reset').onclick = function () {
  //       top.API.Jnl.PrintSync("Reset");
  //       ServiceReset();
  //   }
     document.getElementById('Back').onclick = function () {
        return CallResponse("Back");
    }
    document.getElementById('PageRoot').onclick = function () {
        if(top.API.UnitStatusflg==0){
             top.API.Jnl.PrintSync("Back");
             top.API.Dat.SetDataSync("OPERATESTATE", "STRING", ["1"]);//供暂停服务状态轮询使用
             top.API.Sys.OpenFrontPage();
             top.API.Sys.OpenService();            
             top.API.UnitStatusflg=0;
             return CallResponse("Exit");
        }else{
            return CallResponse("Exit");
        }
        
    }
    document.getElementById('Tadmin').onclick = function () {
        top.API.Manageflg=0;//技术管理员登录
        return CallResponse("OK");
    }
    document.getElementById('Badmin').onclick = function () {
        top.API.Manageflg=1;//主管和业务管理员登录
        return CallResponse("OK");
    }

    // document.getElementById('ExitImg').onclick = function () {
    //     top.API.Jnl.PrintSync("Back");
    //     ButtonDisable();
    //     if (top.API.gOutService == false) {
    //         top.API.Sys.OpenService();
    //     }
    //     top.API.Sys.OpenFrontPage();
    //     top.API.Sys.SetIsMaintain(false);
    //     return CallResponse('Back');
    // }   

    //@User code scope end 
  //   function ServiceReset() {
  //       top.API.displayMessage("开始Reset");
		// bReset = true;
		// bCdmReset = false;
		// bCrdReset = false;
		// bFpiReset = false;
		// bIdrReset = false;
		// bPinReset = false;
  //       top.API.Sys.Reset();
  //       App.Plugin.Wait.show();
  //       top.API.Cdm.Reset("RETRACT", 0,top.API.gResetTimeout);
  //       top.API.Crd.Reset("NOACTION", top.API.gResetTimeout);
  //       top.API.Fpi.Reset(top.API.gResetTimeout);
  //       top.API.Idr.Reset("NOACTION");
  //       top.API.Pin.Reset(top.API.gResetTimeout);
  //       timeoutId = setTimeout(function(){
  //           App.Plugin.Wait.disappear();
  //       },120000);
  //   }

    function onCheckStatus() {
		top.API.gTransStatus = top.API.Sys.PossibleTransactionSync();        
		top.API.gPartsStatus = top.API.Sys.GetPartsStatusSync();
        showinfo();
    }

    function onResetStatus() {
        if (bCdmReset && bCrdReset && bFpiReset && bIdrReset && bPinReset) {
            clearTimeout(timeoutId);
            bCdmReset = false;
            bCrdReset = false;
            bFpiReset = false;
            bIdrReset = false;
            bPinReset = false;
            App.Plugin.Wait.disappear();
			bReset = false;
			if(top.API.AdminStatus == 1 && top.API.Cdm.StOutputStatus() == "NOTEMPTY"){
				top.API.Cdm.OpenShutter(top.API.gOpenShutterTimeOut);	
			}else{
				showinfo();
			}
        }
    }
 //    //door
	function onShutterOpened(){
		top.API.displayMessage("onShutterOpened触发");
	}	
	function onCashTaken() {
        App.Timer.ClearIntervalTime();
        top.API.Cdm.CloseShutter(top.API.gCloseShutterTimeOut);		
    }
	function onShutterClosed(){
		top.API.displayMessage("onShutterClosed触发");
		showinfo();
	}
	function onShutterOpenFailed(){
		top.API.displayMessage("onShutterOpenFailed触发");
		showinfo();		
	}	
	function onShutterCloseFailed(){
		top.API.displayMessage("onShutterCloseFailed触发");
		showinfo();
	}
 //    //RESET COMPLETE
 //    function onCimResetComplete() {
 //        top.API.displayMessage("onCimResetComplete is done");
 //        bCimReset = true;
 //        onResetStatus();
 //    }
 //    function onCdmResetComplete() {
 //        top.API.displayMessage("onCdmResetComplete is done");
 //        bCdmReset = true;
 //        onResetStatus();
 //    }
 //    function onCrdResetComplete() {
 //        top.API.displayMessage("onCrdResetComplete is done");
 //        bCrdReset = true;
 //        onResetStatus();
 //    }

 //     function onCrdResetFailed() {
 //        top.API.displayMessage("onCrdResetFailed is done");
 //        bCrdReset = true;
 //        onResetStatus();
 //    }

 //    function onFpiResetComplete() {
 //        top.API.displayMessage("onFpiResetComplete is done");
 //        bFpiReset = true;
 //        onResetStatus();
 //    }
 //    function onIdrResetComplete() {
 //        top.API.displayMessage("onIdrResetComplete is done");
 //        bIdrReset = true;
 //        onResetStatus();
 //    }

 //    function onJnlResetComplete() {
 //        top.API.displayMessage("onJnlResetComplete is done");
 //    }

 //    function onPinResetComplete() {
 //        top.API.displayMessage("onPinResetComplete is done");
 //        bPinReset = true;
 //        onResetStatus();
 //    }

 //    function onPtrResetComplete() {
 //        top.API.displayMessage("onPtrResetComplete is done");
 //    }

 //    function onTcpResetComplete() {
 //        top.API.displayMessage("onTcpResetComplete is done");
 //    }

 //    function onCrdResetFailed() {
 //        top.API.displayMessage("onCrdResetFailed is done");
 //        bCrdReset = true;
 //        onResetStatus();
 //    }

 //    function onPinResetFailed() {
 //        top.API.displayMessage("onPinResetFailed is done");
 //        bPinReset = true;
 //        onResetStatus();
 //    }


 //    function onCimResetFailed() {
 //        top.API.displayMessage("onCimResetFailed is done");
 //        bCimReset = true;
 //        onResetStatus();
 //    }
 //    function onCdmResetFailed() {
 //        top.API.displayMessage("onCdmResetFailed is done");
 //        bCdmReset = true;
 //        onResetStatus();
 //    }

 //    function onFpiResetFailed() {
 //        top.API.displayMessage("onFpiResetFailed is done");
 //        bFpiReset = true;
 //        onResetStatus();
 //    }
 //    function onIdrResetFailed() {
 //        top.API.displayMessage("onIdrResetFailed is done");
 //        bIdrReset = true;
 //        onResetStatus();
 //    }

 //     function onPtrResetFailed() {
 //        top.API.displayMessage("onPtrResetFailed is done");
 //        bCrdReset = true;
 //        onResetStatus();
 //    }
    //DeviceError START
    function onCrdDeviceError() {
        top.API.displayMessage("onCrdDeviceError is done");
        bCrdReset = true;
        onResetStatus();
    }

    function onPinDeviceError() {
        top.API.displayMessage("onPinDeviceError is done");
        bPinReset = true;
        onResetStatus();
    }


    function onCimDeviceError() {
        top.API.displayMessage("onCimDeviceError is done");
        bCimReset = true;
        onResetStatus();
    }
    function onCdmDeviceError() {
        top.API.displayMessage("onCdmDeviceError is done");
        bCdmReset = true;
        onResetStatus();
    }

    function onFpiDeviceError() {
        top.API.displayMessage("onFpiDeviceError is done");
        bFpiReset = true;
        onResetStatus();
    }
    function onIdrDeviceError() {
        top.API.displayMessage("onIdrDeviceError is done");
        bIdrReset = true;
        onResetStatus();
    }
    //CHANGE STATUS
    function onCdmStatusChanged(PropertyName, OldValue, NewValue) {
        top.API.displayMessage("onCdmStatusChanged()触发");
        showinfo();
    }

    function onCrdStatusChanged(PropertyName, OldValue, NewValue) {
        top.API.displayMessage("onCrdStatusChanged()触发");
        showinfo();
    }

    function onFpiStatusChanged(PropertyName, OldValue, NewValue) {
        top.API.displayMessage("onFpiStatusChanged()触发");
        showinfo();
    }

    function onIdrStatusChanged(PropertyName, OldValue, NewValue) {
        top.API.displayMessage("onIdrStatusChanged()触发");
        showinfo();
    }

    function onJnlStatusChanged(PropertyName, OldValue, NewValue) {
        top.API.displayMessage("onJnlStatusChanged()触发");
        showinfo();
    }

    function onPinStatusChanged(PropertyName, OldValue, NewValue) {
        top.API.displayMessage("onPinStatusChanged()触发");
        showinfo();
    }

    function onPtrStatusChanged(PropertyName, OldValue, NewValue) {
        top.API.displayMessage("onPtrStatusChanged()触发");
        showinfo();
    }

    function onTcpStatusChanged(PropertyName, OldValue, NewValue) {
        top.API.displayMessage("onTcpStatusChanged()触发");
        showinfo();
    }

    function onScrStatusChanged(PropertyName, OldValue, NewValue) {
        top.API.displayMessage("onScrStatusChanged()触发");
        showinfo();
    }

    function onTfcStatusChanged(PropertyName, OldValue, NewValue) {
        top.API.displayMessage("onTfcStatusChanged()触发");
        showinfo();
    }

    function onSptStatusChanged(PropertyName, OldValue, NewValue) {
        top.API.displayMessage("onTptStatusChanged()触发");
        showinfo();
    }

    function onSafeDoorOpened() {
        document.getElementById("WTip").style.display = "block";
        showinfo();
    }

    function onSafeDoorClosed() {
        document.getElementById("WTip").style.display = "none";
		showinfo();
    }
	
	// 判断是否超过7天清机时间
	function onCheckExchangTime(){
		var strLastExchangeDate = top.API.Dat.GetPrivateProfileSync("Exchange", "ExchangeDate", "", top.API.gIniFileName);
		
		if("" == strLastExchangeDate){
			top.API.displayMessage("清机时间记录为空,不做提示" );
		}
		else{
			var createTime = strLastExchangeDate.substring(0,10);
			var time = new Date().getTime() - new Date(createTime.replace(/-/g,"/")).getTime();
			var days = parseInt(time/(1000*60*60*24));
			if(days>=6){
				top.API.displayMessage("距离上次清机已超过7天");
				//alert("请做清机处理");
			}
		}
	}

    function onNetChangeOnline() {
        top.API.displayMessage("onNetChangeOnline");
        TcpBreakDown=false;  
        document.getElementById('faultContent3').innerText = ""; 
        showFault();        
    }
    function onNetChangeOffline() {
        top.API.displayMessage("onNetChangeOffline");
        TcpBreakDown=true;
        if(TcpBreakDown){
            document.getElementById('faultContent3').innerText = "通讯故障";
            document.getElementById('normalInfo').style.display = "none";
        }
        showFault();        
    }
    //Register the event
    function EventLogin() {
        //RESET COMPLETE
        // top.API.Cim.addEvent("ResetComplete", onCimResetComplete);
        // top.API.Cim.addEvent("ResetFailed", onCimResetFailed);
        // top.API.Cdm.addEvent("ResetComplete", onCdmResetComplete);
        // top.API.Cdm.addEvent("ResetFailed", onCdmResetFailed);
        // top.API.Crd.addEvent("ResetComplete", onCrdResetComplete);
        // top.API.Crd.addEvent("ResetFailed", onCrdResetFailed);
        // top.API.Fpi.addEvent("ResetComplete", onFpiResetComplete);
        // top.API.Fpi.addEvent("ResetFailed", onFpiResetFailed);
        // top.API.Idr.addEvent("ResetComplete", onIdrResetComplete);
        // top.API.Idr.addEvent("ResetFailed", onIdrResetFailed);
        // top.API.Jnl.addEvent("ResetComplete", onJnlResetComplete);
        // top.API.Pin.addEvent("ResetComplete", onPinResetComplete);
        // top.API.Pin.addEvent("ResetFailed", onPinResetFailed);
        // top.API.Ptr.addEvent("ResetComplete", onPtrResetComplete);
        // top.API.Ptr.addEvent("ResetFailed", onPtrResetFailed);
        // top.API.Tcp.addEvent("ResetComplete", onTcpResetComplete);
        //CHANGE STATUS
        top.API.Cdm.addEvent("StatusChanged", onCdmStatusChanged);
        top.API.Crd.addEvent("StatusChanged", onCrdStatusChanged);
        top.API.Fpi.addEvent("StatusChanged", onFpiStatusChanged);
        top.API.Idr.addEvent("StatusChanged", onIdrStatusChanged);
        top.API.Jnl.addEvent("StatusChanged", onJnlStatusChanged);
        top.API.Pin.addEvent("StatusChanged", onPinStatusChanged);
        top.API.Ptr.addEvent("StatusChanged", onPtrStatusChanged);
        top.API.Tcp.addEvent("StatusChanged", onTcpStatusChanged);
        top.API.Scr.addEvent("StatusChanged", onScrStatusChanged);
        top.API.Tfc.addEvent("StatusChanged", onTfcStatusChanged);
        top.API.Spt.addEvent("StatusChanged", onSptStatusChanged);
        top.API.Sys.addEvent("CheckStatus", onCheckStatus);
        //DEVICEERROE          
        top.API.Crd.addEvent("DeviceError", onCrdDeviceError);
        top.API.Pin.addEvent("DeviceError", onPinDeviceError);
        top.API.Cim.addEvent("DeviceError", onCimDeviceError);
        top.API.Cdm.addEvent("DeviceError", onCdmDeviceError);
        top.API.Idr.addEvent("DeviceError", onIdrDeviceError);
        top.API.Fpi.addEvent("DeviceError", onFpiDeviceError);

        //保险柜门开关事件
        top.API.Cim.addEvent("SafeDoorClosed", onSafeDoorClosed);
        top.API.Cim.addEvent("SafeDoorOpened", onSafeDoorOpened);
		//Door
		top.API.Cdm.addEvent('ShutterOpened', onShutterOpened);
		top.API.Cdm.addEvent('ShutterOpenFailed', onShutterOpenFailed);
		top.API.Cdm.addEvent('ShutterClosed', onShutterClosed);
		top.API.Cdm.addEvent('ShutterCloseFailed', onShutterCloseFailed);
		
        top.API.Cdm.addEvent('CashTaken', onCashTaken);
        //通讯故障
        top.API.Sys.addEvent("NetChangeOffline", onNetChangeOffline);
        top.API.Sys.addEvent("NetChangeOnline", onNetChangeOnline);
    }

    function EventLogout() {
        // top.API.Cim.removeEvent("ResetComplete", onCimResetComplete);
        // top.API.Cim.removeEvent("ResetFailed", onCimResetFailed);
        // top.API.Cdm.removeEvent("ResetComplete", onCdmResetComplete);
        // top.API.Cdm.removeEvent("ResetFailed", onCdmResetFailed);
        // top.API.Crd.removeEvent("ResetComplete", onCrdResetComplete);
        // top.API.Crd.removeEvent("ResetFailed", onCrdResetFailed);
        // top.API.Fpi.removeEvent("ResetComplete", onFpiResetComplete);
        // top.API.Fpi.removeEvent("ResetFailed", onFpiResetFailed);
        // top.API.Idr.removeEvent("ResetComplete", onIdrResetComplete);
        // top.API.Idr.removeEvent("ResetFailed", onIdrResetFailed);
        // top.API.Jnl.removeEvent("ResetComplete", onJnlResetComplete);
        // top.API.Pin.removeEvent("ResetComplete", onPinResetComplete);
        // top.API.Pin.removeEvent("ResetFailed", onPinResetFailed);
        // top.API.Ptr.removeEvent("ResetComplete", onPtrResetComplete);
        // top.API.Ptr.removeEvent("ResetFailed", onPtrResetFailed);
        // top.API.Tcp.removeEvent("ResetComplete", onTcpResetComplete);
        //
        top.API.Crd.removeEvent("StatusChanged", onCrdStatusChanged);
        top.API.Pin.removeEvent("StatusChanged", onPinStatusChanged);
        top.API.Ptr.removeEvent("StatusChanged", onPtrStatusChanged);
        top.API.Cdm.removeEvent("StatusChanged", onCdmStatusChanged);
        top.API.Fpi.removeEvent("StatusChanged", onFpiStatusChanged);
        top.API.Idr.removeEvent("StatusChanged", onIdrStatusChanged);
        top.API.Jnl.removeEvent("StatusChanged", onJnlStatusChanged);
        top.API.Tcp.removeEvent("StatusChanged", onTcpStatusChanged);
        top.API.Scr.removeEvent("StatusChanged", onScrStatusChanged);
        top.API.Tfc.removeEvent("StatusChanged", onTfcStatusChanged);
        top.API.Spt.removeEvent("StatusChanged", onSptStatusChanged);
        top.API.Sys.removeEvent("CheckStatus", onCheckStatus);
        //DEVICEERROE          
        top.API.Crd.removeEvent("DeviceError", onCrdDeviceError);
        top.API.Pin.removeEvent("DeviceError", onPinDeviceError);
        top.API.Cim.removeEvent("DeviceError", onCimDeviceError);
        top.API.Cdm.removeEvent("DeviceError", onCdmDeviceError);
        top.API.Idr.removeEvent("DeviceError", onIdrDeviceError);
        top.API.Fpi.removeEvent("DeviceError", onFpiDeviceError);
        //保险柜门开关事件
        top.API.Cim.removeEvent("SafeDoorClosed", onSafeDoorClosed);
        top.API.Cim.removeEvent("SafeDoorOpened", onSafeDoorOpened);
		//Door
		top.API.Cdm.removeEvent('ShutterOpened', onShutterOpened);
		top.API.Cdm.removeEvent('ShutterOpenFailed', onShutterOpenFailed);
		top.API.Cdm.removeEvent('ShutterClosed', onShutterClosed);
		top.API.Cdm.removeEvent('ShutterCloseFailed', onShutterCloseFailed);
		
        top.API.Cdm.removeEvent('CashTaken', onCashTaken);

        //通讯故障
        top.API.Sys.removeEvent("NetChangeOffline", onNetChangeOffline);
        top.API.Sys.removeEvent("NetChangeOnline", onNetChangeOnline);

    }
    //remove all event handler
    function Clearup() {
        EventLogout();
    }
})();
