; (function () {
    var AdminObj;
    var AdminInfo;
	var Element;
	var User = document.getElementById("UserInput");
	var Password = document.getElementById("PswInput");
	var ComfirmInput = document.getElementById("ComfirmInput");
    var span_tip = document.getElementById("span_tip");
	User.focus();
    var operateFlag = "";
    var deletebtns;
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        EventLogin();
        App.Plugin.Keyboard.show("2", "PageSubject", "KeyboardDiv");
		Element = User;
		top.API.Dat.GetPersistentData("ADMININFO", "STRING");  //获取柜员号
		
    }();//Page Entry

   //输入框点击事件
	User.onclick = function() {
		Element = User;
		App.InputEdit.getCurPosition(Element);
	}

	Password.onclick = function() {
		Element = Password;
		App.InputEdit.getCurPosition(Element);
	}

	ComfirmInput.onclick = function() {
		Element = ComfirmInput;
		App.InputEdit.getCurPosition(Element);
	}


    function showAdminInfo() {
        var tab = document.getElementById('tab');
        for (i = 0; i < tab.rows.length ; i++) {
            tab.rows[i].style.display = "none";
        }
       if (AdminInfo.length == 0 ) {//无管理员信息
            document.getElementById("c_tab").rows[1].style.display = "none";
            document.getElementById("errortip").style.display = "block";
        }
	   else{
            document.getElementById("errortip").style.display = "none";
			
			var strShowType = "";
            for (var i = 0; i < AdminInfo.length; i++) {
                tab.rows[i].style.display = "block";
                tab.rows[i].cells[0].innerHTML = i + 1;
                tab.rows[i].cells[1].innerHTML = AdminInfo[i].user;
                tab.rows[i].cells[2].innerHTML =  "******";       // AdminInfo[i].pw; //
                tab.rows[i].cells[3].innerHTML = "<input name ='delBtn' type='button' class='delBtn'/>";
				tab.rows[i].cells[4].innerHTML = "<input name ='chgBtn' type='button' class='chgBtn'/>";
            }
			document.getElementById("Keyboard").style.display = "block";
		    if ( AdminInfo.length == 5 )
		    {
				span_tip.innerText = "最多可添加5个授权号！";
		    }
			
            deletebtns = document.getElementsByName("delBtn");
            del_click(deletebtns);
			
			changebtns = document.getElementsByName("chgBtn");
            change_click(changebtns);
        }
    }
 

    //取消
    document.getElementById('Back').onclick = function () {
        document.getElementById('Back').disabled = true;
        return CallResponse('Back');
    }


    //添加柜员号
    document.getElementById('addAdmin').onclick = function () {
		    addAdmin();
    }
	
	document.getElementById('KeyboardKey_set').onclick = function () {
			 addAdmin();
       
    }
	
	
function addAdmin() 
{
	if((User.value == "") || (Password.value == "") || (ComfirmInput.value == "")) {
		span_tip.innerText = "输入信息不能为空！";
	}
	else 
	{
		if(AdminInfo.length == 5)
		{
			 span_tip.innerText = "最多可添加5个授权号！";
             document.getElementById("Keyboard").style.display = "none";
		}
	    else
		{
			if(PswInput.value != ComfirmInput.value) 
			{
				span_tip.innerText = "两次密码不一致！";
			} 
			else 
			{
				var flag = false;
				for(var i = 0; i < AdminInfo.length; i++) {
					if(User.value == AdminInfo[i].user) {
						span_tip.innerText = "此账号已经存在！";
						flag = true;
						break;
					}
				}
				if(!flag) {
					var newName = User.value;
					var newPw = Password.value;
					var newJson = {
						"user": newName,
						"pw": newPw
					};
					if(operateFlag != "change")
					{
						operateFlag = "add";
					}
					AdminInfo.push(newJson);
					var arrTotalFlag = new Array(JSON.stringify(AdminObj));
					top.API.Dat.SetPersistentData("ADMININFO", "STRING", arrTotalFlag);
				}
			}
		}
	}
}
	
	
var oKeyboardKey = document.getElementsByName("Name_Keyboard");
for(var i = 0; i < oKeyboardKey.length; i++) {
	var keyEvent = oKeyboardKey[i];
	keyEvent.onclick = function(e) {
		ClearTip();
		if('退格' == this.innerText) {
			App.InputEdit.getInput(Element, 1, "BS");
		} else if('清除' == this.innerText) {
			App.InputEdit.getInput(Element, 1, "CLEAR");
		} else {
			if(Element.value.length < 6) {
				App.InputEdit.getInput(Element, 0, this.innerText);
			}
		}
	}
}
	
    function ClearTip() {
		span_tip.innerText = "";
	}
	
    Array.prototype.indexOf = function (val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) { return i; }
        }
        return -1;
    }
    Array.prototype.remove = function (val) {
        var index = this.indexOf(val);
        if (index > -1) { this.splice(index, 1); }
    }

    function del_click(btns) {
		ClearTip();
        for (var i = 0; i < btns.length; i++) {
            (function () {
                var p = i;
                btns[p].onclick = function () {
				if("00" == AdminInfo[p].user) {
					span_tip.innerText = "这是超级管理员权限，您不能进行删除";
					return;
				}
				AdminInfo.remove(AdminInfo[p]);
				operateFlag = "del";
				showAdminInfo();
				var arrTotalFlag = new Array(JSON.stringify(AdminObj));
				nRet1 = top.API.Dat.SetPersistentData("ADMININFO", "STRING", arrTotalFlag);
				top.API.Dat.SetPersistentData(top.API.MFPIIDLISTTag, top.API.MFPIIDLISTType, FpiIDList);
                }
            })();
        }
    }

	//修改密码
	function change_click(btns) {
		ClearTip();
        for (var i = 0; i < btns.length; i++) {
            (function () {
                var p = i;
                btns[p].onclick = function () {
				operateFlag = "change";
				User.value = AdminInfo[p].user;
				Password.value = "";
				ComfirmInput.value ="";
				document.getElementById('addAdmin').innerText = "修改";
				document.getElementById("Keyboard").style.display = "block";
				AdminInfo.remove(AdminInfo[p]);
                }
            })();
        }
    }
  function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        var arrDataValue = DataValue;
        top.API.displayMessage("onDatGetPersistentDataComplete is done,DataName=" + DataName + ",DataType=" + DataType + ",DataValue=" + arrDataValue);
        top.API.AdminInfoObjStr = arrDataValue.toString();
        top.API.displayMessage("top.API.AdminInfoObjStr =" + top.API.AdminInfoObjStr);
        AdminObj = eval('(' + top.API.AdminInfoObjStr + ')');
        AdminInfo = AdminObj.AdminInfo;
        showAdminInfo();
        var deletebtns = document.getElementsByName("delBtn");
        del_click(deletebtns);
    }
	
	 function onDatSetPersistentDataComplete(DataName) {
        top.API.displayMessage("onDatSetPersistentDataComplete is done,DataName=" + DataName);
        if (operateFlag == "add") {
			span_tip.innerText = "添加成功！";
			operateFlag = "";
            return CallResponse("OK");
        }
		else if(operateFlag =="change")
		{
			span_tip.innerText = "修改成功！";
			operateFlag ="";
			return CallResponse("OK");
		}
    }
	
	function onDatGetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatSetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
    }



    function onDatSetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatSetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
    }


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

