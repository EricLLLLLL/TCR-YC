/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {
    var TaskId = "";//任务ID
    var bStartServer = false;//任务ID
    var bflag = true;//返回消息
    var ClientIp = "";//客户IP
    var TimeoutFlag = true;//是否已经打开倒计时
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });

    var Initialize = function () {
        EventLogin();
        // Gni test
        //return CallResponse('OK');
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        var IsSinglebeta = top.API.Dat.GetPrivateProfileSync("AssConfig", "IsSinglebeta", "0", top.API.gIniFileName);
        if (IsSinglebeta == "1") {
            return CallResponse("OK");
        }else{
            if (StartServer()) {//开启服务，准备远程审核
                document.getElementById("ErrorTip").innerText = "正在创建任务，请稍候...";
				top.API.displayMessage("开启创建任务！,CreateBusiListHead="+ top.API.CreateBusiListHead +"CreateBusiListParam=" + top.API.CreateBusiListParam); 
			    top.CreateBusiList(CallFunc,top.API.CreateBusiListHead,top.API.CreateBusiListParam,top.API.CreateBusiListUrl);
		    }else{
                top.API.displayMessage("开启远程审核失败！"); 	
                document.getElementById("ErrorTip").innerText = "开启远程审核失败！请选择退出或重新审核";
                top.ErrorInfo = "远程审核故障！";
            }
        }
        
    } (); //Page Entry

    function ButtonDisable() {
        top.API.displayMessage("ButtonDisable");
        document.getElementById('Exit').disabled = true;		
        document.getElementById('Back').disabled = true;
    }

    function ButtonEnable() {
        top.API.displayMessage("ButtonEnable");
        document.getElementById('Exit').disabled = false;		
        document.getElementById('Back').disabled = false;
    }

    document.getElementById("Exit").onclick = function () {
        top.API.displayMessage("点击Exit按钮");
		top.ErrorInfo = top.API.PromptList.No2;
        ButtonDisable();
        if (bStartServer) {
            top.API.Rpm.ClientConnect(ClientIp,7703);
		    top.API.Rpm.ClientSend("iden.com.bcd.ibank.canceltask");
        }
        return CallResponse("Exit");
    }
	
	document.getElementById("Back").onclick = function () {
        top.API.displayMessage("点击Back按钮");
        ButtonDisable();
        if (bStartServer) {
            top.API.Rpm.ClientConnect(ClientIp,7703);
		    top.API.Rpm.ClientSend("iden.com.bcd.ibank.canceltask");
        }
        return CallResponse("Back");
    }

    //@User ocde scope start
    function StartServer(){
        document.getElementById("ErrorTip").innerText = "正在开启服务，请稍候..."
        var bRet = false; 
            var bStartBCD = top.API.Sys.DataGetSync(top.API.MSYS_BCDSTARTSERVICESYNC);
            if (bStartBCD == 1) {
                bRet=true;
                top.API.displayMessage("打开北辰德设备成功");
                top.API.Rpm.ServerStart(7701);
            }else{
                top.API.displayMessage("打开北辰德设备失败");
            }
		
		return bRet;
	}

    function CallFunc(DealName,bResult,strMsg){
        var tmpHeadMsg='';
        var bSuccess = false;
        top.ErrorInfo = top.API.PromptList.No5;
		switch (DealName){
			case "CreateBusiList":
				if(bResult){
					bSuccess = true;
					top.CreateTask(CallFunc,top.API.CreateTaskHead,top.API.CreateTaskParam,top.API.CreateTaskUrl);					
				}else{
					if(strMsg == ""){
						strMsg = '通讯故障，交易取消';
					}
					top.API.displayMessage("DealName="+DealName+",strMsg="+strMsg); 
				}
				break;
			case "CreateTask":
				if(bResult){
					bSuccess = true;
					TaskId = strMsg;
                    document.getElementById("ErrorTip").innerText = "正在等待审核，请稍候...";
					top.API.displayMessage("DealName="+DealName+",TaskId="+TaskId); 
				}else{
					//CancelServer();
					if(strMsg == ""){
						strMsg = '通讯故障，交易取消';
					}
					top.API.displayMessage("DealName="+DealName+",strMsg="+strMsg); 
				}
				break;
			default:
				break;
		}
        if (!bSuccess) {
            top.API.displayMessage("审核通讯故障！"); 	
            document.getElementById("ErrorTip").innerText = "创建任务失败！请退出或重新审核";
        }
	}
    
    //event handler
    /********************************************************************************************************/    
    //远程审核控件事件
    function onClientConnect(info) {

    }
    function onServerReceiveIP(info1,info2) {
        //top.API.displayMessage("ServerReceiveIP!,strIP="+info1+",strMessage="+info2);  
		var arrayMessage = info2.split(".");
		if(arrayMessage.length == 4){
			if(arrayMessage[2] == "iscurrenttask"){
				top.API.Rpm.ClientConnect(info1,7703);
				top.API.Rpm.ClientSend("iden.com.bcd.ibank.currenttaskisok");
				top.API.displayMessage("currenttaskisok!,strIP="+info1+",taskId="+arrayMessage[3]); 
			}else{
				var arrayAudio = arrayMessage[2].split("|");
				document.getElementById("ErrorTip").innerText = arrayAudio[0].substring(4, (arrayAudio[0].length));
				var path = './ini/audio/'+arrayAudio[1]+'.wav';
				obj = document.createElement("bgsound");
				obj.id = "ModuleSound";
				obj.src = '';
				obj.autoplay = true;
				soundObj = obj;
				document.body.appendChild(soundObj);
				soundObj.src = path;	
				top.API.displayMessage("AudioName="+arrayAudio[1]); 
			}
		}
		
		if(arrayMessage.length == 6){
			if(arrayMessage[5] == "starttask"){
                bStartServer = true;
                ClientIp = info1;
				top.API.displayMessage("starttask!,strIP="+info1); 
			}
			if(arrayMessage[5].substring(0, 9) == "checkuser"){
				top.API.displayMessage("checkuserNo="+arrayMessage[5].substring(9, (arrayMessage[5].length))+",strIP="+info1); 
                document.getElementById("ErrorTip").innerText = "员工号:"+arrayMessage[5].substring(9, (arrayMessage[5].length))+",正在审核...";
                TimeoutFlag = false;
                App.Timer.ClearTime();
                document.getElementById("ShowTime").innerText ="";
			}
			if(arrayMessage[5] == "checksuccess"){
                if(bflag){
					bflag = false;
                    top.API.displayMessage("checksuccess!"); 
				    CallResponse('OK');
                }
			}
			
			if(arrayMessage[5].substring(0, 9) == "checkfail"){
				if(bflag){
					bflag = false;
					var arrayError = arrayMessage[5].split("|");
					var ErrorMSG=arrayError[1].substring(5, (arrayError[1].length));
					if(ErrorMSG == ""||ErrorMSG==null){
                        ErrorMSG = "审核失败！";
                    }
					top.API.displayMessage("checkfail!,strIP="+info1+",ErrorCode="+arrayError[1].substring(0, 5)+",ErrorMSG="+ErrorMSG); 
                    //top.ErrorInfo = ErrorMSG;
                    //CallResponse('Exit');
					top.API.Sys.DataGetSync(top.API.MSYS_BCDENDSERVICESYNC);					
					document.getElementById('prompting').style.display = "none";
					document.getElementById('promptError').style.display = "block";
					document.getElementById("promptErrorTip").innerText = ErrorMSG.replace(/\s+/g, "");
					App.Timer.SetPageTimeout(60);
					App.Timer.TimeoutDisposal(TimeoutCallBack);
				}				
			}			
		}
    }
    function onClientReceive(info) {
        top.API.displayMessage("ClientReceive!,strMessage="+info); 
    }
    //Register the event
    function EventLogin() {
        top.API.Rpm.addEvent("ServerReceiveIP", onServerReceiveIP);
        top.API.Rpm.addEvent("ClientConnect", onClientConnect);
        top.API.Rpm.addEvent("ClientReceive", onClientReceive);
	}

    function EventLogout() {
        top.API.Rpm.removeEvent("ServerReceiveIP", onServerReceiveIP);
        top.API.Rpm.removeEvent("ClientConnect", onClientConnect);
        top.API.Rpm.removeEvent("ClientReceive", onClientReceive);
    }

    //Countdown function
    function TimeoutCallBack() {
        top.ErrorInfo = top.API.PromptList.No3;
        return CallResponse('TimeOut');
    }
    //Page Return
    
    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
		top.API.Sys.DataGetSync(top.API.MSYS_BCDENDSERVICESYNC);
		App.Timer.ClearTime();
    }
})();
