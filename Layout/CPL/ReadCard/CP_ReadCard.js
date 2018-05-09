/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {
    var strCardNo = "";
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {         
        EventLogin();
        App.Plugin.Voices.play("voi_15");
        top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["************************************"]);
        top.API.Jnl.PrintSync("Content");
        //@initialize scope start
        if (top.API.Crd.StDetailedDeviceStatus() != "ONLINE"){
            Files.ErrorMsg("读卡器模块故障，请联系管理员!");
        setTimeout(function () {
            return CallResponse("Exit");
        }, 4000);
        }
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        var strCardType = "MAGCARD";
        var objGet = top.API.Dat.GetDataSync(top.API.cardtypeTag, top.API.cardtypeType);
        if (null == objGet) {
            top.API.displayMessage("GetDataSync CARDTYPE objGet = null");
        }
        else {
           strCardType = objGet.toString();
        }

        if(!top.API.BrushCard){

        top.API.displayMessage("111111111");
            if ("CHIPCARD" == strCardType) {
                //document.getElementById('PageTag').innerHTML = '正在读取IC卡，请稍候...';
                top.API.Crd.PBOCGetICInfo(40000);//待修正  超时时间需要考虑页面超时临界值
            } else {
                top.API.Crd.AcceptAndReadAvailableTracks('2,3', 40000);//待修正  超时时间需要考虑页面超时临界值
            }
        }else{
            strCardNo = top.API.gCardno;
            SetCardNo();
            ContinueTrans();
        }

    }();//Page Entry

    //@User ocde scope start
	//top.API.Crd.PBOCGetICInfo触发该事件
	function onGetICInfoCompleted() {
        top.API.displayMessage("onGetICInfoCompleted");
        strCardNo = top.API.Crd.CardNumber();
        SetCardNo();
        //document.getElementById('PageTag').innerHTML = '正在认证IC卡数据，请稍候...';
        top.API.Crd.PBOCReadIcTLV(50000);//读芯片卡数据（55域）
    }
	//top.API.Crd.PBOCReadIcTLV触发该事件
	function onReadIcTLVCompleted(Info) {
        top.API.displayMessage("ReadIcTLVCompleted");
        var arrICCardData = new Array(Info);
        var nRet = top.API.Dat.SetDataSync(top.API.iccarddataTag, top.API.iccarddataType, arrICCardData);
		ContinueTrans();
        
    }
	function ContinueTrans() {
		var PtrPaperStatus = top.API.Ptr.StPaperStatus();
        if (top.API.Ptr.bDeviceStatus && (PtrPaperStatus == "FULL" || PtrPaperStatus == "LOW")) {
            if (top.API.gbContinueTransFlag === true) {
				return CallResponse("CHIPCARDcontinue");
			}else{
				return CallResponse("OK");
			}
        } else {
            return CallResponse("NoPrint");
        }
	}
    function SetCardNo() {
        var arrCardNo = new Array(strCardNo);
        top.API.gCardno = strCardNo;
        top.API.gLastCardNum = strCardNo;
        top.API.gBrashCardType = 1;
        var nRet = top.API.Dat.SetDataSync(top.API.cardnoTag, top.API.cardnoType, arrCardNo);
        // 判断卡类别,再根据卡银行类别作相应处理,还包括支持的交易列表，总共 17 位
        // 1 为本行本省，2 为本行外省，3 为它行卡，4 为本行贷记卡，5 本省绿卡通，
        // 6 外省绿卡通，7 本省绿卡通副卡，8 外省绿卡通副卡, 0 本省存折，9 外省存折
        var strCardBankType = top.API.Crd.GetCardBankType(strCardNo);
        top.API.displayMessage("ReadCard.js GetCardBankType = " + strCardBankType);
        top.API.gSupportTransType = strCardBankType.substr(1, 16);
        top.API.gCardBankType = strCardBankType.substr(0, 1);
        top.API.Dat.SetDataSync("CARDBANKTYPE", "STRING", [top.API.gCardBankType]);

        top.API.Jnl.PrintSync("ReadCardAction");
    }

    //@User code scope end 

    //event handler
    function onCardInserted() {
        top.API.displayMessage("onCardInserted触发");
    }
    //event handler
    function onCardAccepted() {
        top.API.displayMessage("onCardAccepted触发");        
		var strTrack2 = top.API.Crd.Track2();
		var strTrack3 = top.API.Crd.Track3();
		if ("" === strTrack2 && "" === strTrack3) {
			top.API.displayMessage(top.API.PromptList.No10);
			top.ErrorInfo = top.API.PromptList.No10;
			return CallResponse("Exit");
		} else {
			var arrTrack2 = new Array();
			arrTrack2 = strTrack2.split("=");
			strCardNo = arrTrack2[0];
		}
		SetCardNo();
		ContinueTrans();     
    }

    function onCardInvalid() {
        top.API.displayMessage(top.API.PromptList.No7);
		top.ErrorInfo = top.API.PromptList.No7;
		return CallResponse("Exit");
    }
    function onChipInvalid() {
        top.API.displayMessage(top.API.PromptList.No7);
		top.ErrorInfo = top.API.PromptList.No7;
		return CallResponse("Exit");
    }

  function onCardAcceptFailed() {
        top.API.displayMessage("onCardAcceptFailed");
        top.ErrorInfo = top.API.PromptList.No7;
        return CallResponse('Exit');
    }


     function onChipPowerFailed() {
        top.API.displayMessage("onChipPowerFailed");
        top.ErrorInfo = top.API.PromptList.No7;
        return CallResponse('Exit');
    }

	function onGetICInfoFailed() {
        top.API.displayMessage("onGetICInfoFailed");
        top.ErrorInfo = top.API.PromptList.No7;
        return CallResponse('Exit');
    }

    function onReadIcTLVFailed() {
        top.API.displayMessage("onReadIcTLVFailed");
        top.ErrorInfo = top.API.PromptList.No7;
        return CallResponse('Exit');
    }

     function onDeviceError() {
        top.API.displayMessage("onDeviceError");
        top.ErrorInfo = top.API.PromptList.No4;
        return CallResponse('Exit');
    }

    

    //Register the event
    function EventLogin() {
        top.API.Crd.addEvent("CardInserted", onCardInserted);
        top.API.Crd.addEvent("CardAccepted", onCardAccepted);
        top.API.Crd.addEvent("CardInvalid", onCardInvalid);
        top.API.Crd.addEvent("DeviceError", onDeviceError);
        top.API.Crd.addEvent("GetICInfoCompleted", onGetICInfoCompleted);
        top.API.Crd.addEvent("ReadIcTLVCompleted", onReadIcTLVCompleted);
		//待修正  PBOC失败事件
        top.API.Crd.addEvent("ChipInvalid", onChipInvalid);
        top.API.Crd.addEvent("CardAcceptFailed", onCardAcceptFailed);
        top.API.Crd.addEvent("ChipPowerFailed", onChipPowerFailed);
        top.API.Crd.addEvent("GetICInfoFailed", onGetICInfoFailed);
        top.API.Crd.addEvent("ReadIcTLVFailed", onReadIcTLVFailed);

    }

    function EventLogout() {
        top.API.Crd.removeEvent("CardInserted", onCardInserted);
        top.API.Crd.removeEvent("CardAccepted", onCardAccepted);
        top.API.Crd.removeEvent("CardInvalid", onCardInvalid);
        top.API.Crd.removeEvent("DeviceError", onDeviceError);
        top.API.Crd.removeEvent("GetICInfoCompleted", onGetICInfoCompleted);
        top.API.Crd.removeEvent("ReadIcTLVCompleted", onReadIcTLVCompleted);
        top.API.Crd.removeEvent("ChipInvalid", onChipInvalid);
        top.API.Crd.removeEvent("CardAcceptFailed", onCardAcceptFailed);
        top.API.Crd.removeEvent("ChipPowerFailed", onChipPowerFailed);
        top.API.Crd.removeEvent("GetICInfoFailed", onGetICInfoFailed);
        top.API.Crd.removeEvent("ReadIcTLVFailed", onReadIcTLVFailed);
    }

    //Countdown function
    function TimeoutCallBack() {
        top.ErrorInfo = top.API.PromptList.No3;
        return CallResponse("TimeOut");
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
