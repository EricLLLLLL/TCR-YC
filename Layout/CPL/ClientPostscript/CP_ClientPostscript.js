; (function(){
	
	var TextAreaDom = document.getElementById("postScript");
    var showFlag = 0; //0不显示  存放输入法状态
    var currentID = "";//当前光标所在input的id
    var TextData = "";
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven( Response );
    });
    var Initialize = function() {
        EventLogin();
        //@initialize scope start
		top.API.gBUSSINESSDEPINFO = "";
        currentID = "postScript";
        //页面加载时将光标定位到最后并使其获得焦点
        App.Plugin.ImeHM.cursorEnd(currentID);
        ButtonEnable();
        App.Timer.TimeoutDisposal(TimeoutCallBack);

    }();//Page Entry

    //@User ocde scope start
    document.getElementById("Back").onclick = function(){
        ButtonDisable();
        if (showFlag == 1) {
            //隐藏输入法
            top.API.Ime.HideIME('');
        }
        return CallResponse("Back");
    };
	
	document.getElementById("Exit").onclick = function(){
        ButtonDisable();
        if (showFlag == 1) {
            //隐藏输入法
            top.API.Ime.HideIME('');
        }
        return CallResponse("Exit");
    };

    document.getElementById("OK").onclick = function(){
        if (showFlag == 1) {
            //隐藏输入法
            top.API.Ime.HideIME('');
        }
		var tmpChar = TextAreaDom.innerText;
		var strlen = 0;
		for(var i=0;i<tmpChar.length;i++){
			if(tmpChar.charCodeAt(i)>255){
				strlen+=2;
			}else{
				strlen++
			}
		}
		if(strlen > 39){
			document.getElementById("Check-tip").style.display = "block";
		}else{
			top.API.gBUSSINESSDEPINFO = TextAreaDom.innerText;
			var tempCOMMENTS = new Array(top.API.gBUSSINESSDEPINFO);
            top.API.Dat.SetDataSync("COMMENTS", "STRING", tempCOMMENTS);
			ButtonDisable();
			return CallResponse("OK");
		}        
    };
    function ButtonDisable() {
        document.getElementById('Back').disabled = true;
		document.getElementById('Exit').disabled = true;
        document.getElementById('OK').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Back').disabled = false;
		document.getElementById('Exit').disabled = false;
        document.getElementById('OK').disabled = false;
    };

    
    TextAreaDom.onclick = function(){
		//点击 textarea框 调出输入法键盘
		document.getElementById("Check-tip").style.display = "none";
		App.Plugin.ImeHM.getCurPosition(currentID);
        showFlag = 1;
        //显示某种格式的输入法
		top.API.Ime.ShowIME('0', '', '');
    };
    //点击页面其他处 隐藏键盘
    document.onclick = function (e) {
    //点击 textarea框 调去输入法键盘
        e = e || window.event;
        var dom = e.srcElement || e.target;
        if (dom.id != "postScript"&& showFlag == 1) {
            top.API.Ime.HideIME('');
        }
    }

    //@User code scope end

    //event handler

    function onShowIMECompleted() {
        showFlag = 1;
    }
    function onHideIMECompleted() {
        showFlag = 0;
    }
    function onInputResult(type, value) {
        if (value == "CONFIRM" || value == "CANCEL") {
            top.API.Ime.HideIME('');
        } else {
            App.Plugin.ImeHM.getInput(currentID, type, value);
        }
    }
    //Register the event
    function EventLogin() {
        top.API.Ime.addEvent("ShowIMECompleted", onShowIMECompleted);
        top.API.Ime.addEvent("HideIMECompleted", onHideIMECompleted);
		top.API.Ime.addEvent("InputResult", onInputResult);
		
    }
    function EventLogout() {
        top.API.Ime.removeEvent("ShowIMECompleted", onShowIMECompleted);
        top.API.Ime.removeEvent("HideIMECompleted", onHideIMECompleted);
		top.API.Ime.removeEvent("InputResult", onInputResult);

    }
    //Countdown function
    function TimeoutCallBack() {
        top.API.displayMessage("TimeoutCallBack触发");
        var strErrMsg = "操作超时，交易结束！";
        var ErrMsg = new Array(strErrMsg);
        var nRet = top.API.Dat.SetDataSync(top.API.errmsgTag, top.API.errmsgType, ErrMsg);
        top.API.displayMessage("SetDataSync ERRMSG Return:" + nRet);
        if (showFlag == 1) {
            top.API.Ime.HideIME('');
        }
        return CallResponse('TimeOut');
    };
    //Page Return
    
    //remove all event handler
    function Clearup(){
        //TO DO:
        EventLogout();
        App.Timer.ClearTime();
    }
})();