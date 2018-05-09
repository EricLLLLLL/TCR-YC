; (function () {
    var AdminObj;
    var TelInfo;	
    var TellerNo = document.getElementById("TellerNoInput");
	var IDCardNo = document.getElementById("IDCardNo");
    var tipinfo = document.getElementById("tipinfo");
    var strTypeValue = "";
    var operateFlag = "";
    var deletebtns;
    var bError = true;
    var AuthorType;
    var FpiPvr;
    var bInputTellNo = true;
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        //@initialize scope start
        EventLogin();
        strTypeValue = "00";//默认
        var ATypes = document.getElementsByName("TypeNo");   //获取类型号，以便将类型号放入到数据库中
        typesClick(ATypes);
        //1=本地授权;2=不对比指纹;3=后台比对
        AuthorType = top.API.Dat.GetPrivateProfileSync("MFPI", "bLocalPower", "3", "C:\\TCR\\Middle\\ini\\Setup.ini");
        top.API.displayMessage("GetPrivateProfileSync bLocalPower=" + AuthorType);
        if ("1" === AuthorType) {
            ATypes[3].onclick();
            document.getElementById("TypeNo1").style.display = "none";
            document.getElementById("TypeNo2").style.display = "none";
            document.getElementById("TypeNo3").style.display = "none";
            document.getElementById("label1").style.display = "none";
            document.getElementById("label2").style.display = "none";
            document.getElementById("label3").style.display = "none";
        } else{
			ATypes[0].onclick();
            document.getElementById("TypeNo4").style.display = "none";
            document.getElementById("TypeNo2").style.display = "none";
            document.getElementById("TypeNo3").style.display = "none";
            document.getElementById("label4").style.display = "none";
            document.getElementById("label2").style.display = "none";
            document.getElementById("label3").style.display = "none";
		};
        //指纹仪品牌   1：浙江维尔 2：天诚盛业
        FpiPvr = top.API.Dat.GetPrivateProfileSync("MFPI", "Fpiprovider", "1", "C:\\TCR\\Middle\\ini\\Setup.ini");
        top.API.displayMessage("GetPrivateProfileSync 1：浙江维尔 2：天诚盛业 Fpiprovider=" + FpiPvr);
        TellerNo.focus();
        App.Plugin.Keyboard.show("3", "KeysDiv", "Keyboards");
        funKeyInput();
        var nRet1 = top.API.Dat.GetPersistentData("TELLERNO", "STRING");  //获取柜员号
        top.API.displayMessage("柜员号：GetPersistentData TELLERNO Return:" + nRet1);  //获取柜员号是否成功
    }();//Page Entry

    //输入框输入事件
    document.onclick = function (e) {
        e = e || window.event;
        var dom = e.srcElement || e.target;
        if (dom.id == "TellerNoInput") {
            document.getElementById("KeysDiv").style.display = "block";
            funKeyInput();
        }
        /*if (dom.id != "TellerNoInput" && dom.id != "KeysDiv" && dom.id != "Keyboard" && dom.className != "KeyboardKey" && dom.id != "KeyboardKeys_set") {
         document.getElementById("KeysDiv").style.display = "none";
         }*/
    }


    function showTelInfo() {

        var tab = document.getElementById("c_tab");
		tab.innerHTML = "<tr class='title_tr'><td width='120px'>序号</td><td width='230px'>类型</td><td width='300px'>号码</td><td>操作</td></tr>";

        if (TelInfo.length == 0) {//无柜员数据
            document.getElementById("c_tab").rows[1].style.display = "none";
            document.getElementById("errortip").style.display = "block";
        }
        else {
            document.getElementById("errortip").style.display = "none";
            var strShowType = "";

                for (var i = 0; i < TelInfo.length; i++) {

                    var tr = document.createElement("tr");
                    tr.className = "doub_tr";

                    var td0 = document.createElement("td");
                    td0.width = "150px";
                    td0.innerText = i + 1;
                    tr.appendChild(td0);

                    if (TelInfo[i].teltype == "00") {
                        strShowType = "员工号"
                    } else if (TelInfo[i].teltype == "01") {
                        strShowType = "身份证号"
                    }
                    else if (TelInfo[i].teltype == "02") {
                        strShowType = "ABIS柜员号"
                    }
                    else if (TelInfo[i].teltype == "03") {
                        strShowType = "BOEING柜员号"
                    }

                    var td1 = document.createElement("td");
                    td1.width = "230px";
                    td1.innerText = strShowType;
                    tr.appendChild(td1);

                    var td2 = document.createElement("td");
                    td2.width = "300px";
                    td2.innerText = TelInfo[i].telno;
                    tr.appendChild(td2);

                    var td3 = document.createElement("td");
                    td3.width = "205px";
                    td3.innerHTML = "<input name ='delBtn' type='button' class='delBtn'/>";
                    tr.appendChild(td3);


                    if (undefined === TelInfo[i].fingerinfo) {
                        TelInfo[i].fingerinfo = "";
                    }
                    tab.appendChild(tr);
                }


				//style="height:230px;width:860px;overflow:auto;"
            if(TelInfo.length>9){
			   var pulleyDiv = document.getElementById("pulleyDiv");
			   pulleyDiv.style.height = "320px";//"height:250px;width:860px;overflow:auto;";	
			   pulleyDiv.style.width  = "1000px";
			    pulleyDiv.style.overflow  = "auto";
           }

            deletebtns = document.getElementsByName("delBtn");
            del_click(deletebtns);
        }
    }

    //控制单选按钮图片
    function typesClick(typebtns) {
        for (var i = 0; i < typebtns.length; i++) {
            (function () {
                var p = i;
                typebtns[p].onclick = function () {
                    for (var j = 0; j < typebtns.length; j++) {
                        typebtns[j].style.backgroundImage = "url('Framework/style/Graphics/btn/redio_noselct.png')";
                    }
                    typebtns[p].style.backgroundImage = "url('Framework/style/Graphics/btn/radio_select.png')";
                    strTypeValue = typebtns[p].getAttribute("tvalue");
                }
            })();
        }

    }

    //取消
    document.getElementById('Exit').onclick = function () {
        top.API.displayMessage("Exit onclick");
        document.getElementById('Exit').disabled = true;
        if (!bError) {
            top.API.displayMessage("Call CancelIdentify");
            top.API.Fpi.CancelIdentify();
        }
        return CallResponse('Exit');
    }


    //添加柜员号
    document.getElementById('AddTeller').onclick = function () {
        addTeller();
    }

	document.getElementById('AddTeller1').onclick = function () {

		if(IDCardNo.value.length == 0){			
			document.getElementById("addTellerIdtip").innerText = "身份证号不能为空！";
		}else if(IDCardNo.value.length < 18){
			document.getElementById("addTellerIdtip").innerText = "身份证号长度不够！";
		}else{
			AddNewJson(IDCardNo.value);
		}		
    }	

    //输入框点击事件
    TellerNo.onclick = function () {
        App.InputEdit.getCurPosition(TellerNo);
    }
	
	IDCardNo.onclick = function () {	
		document.getElementById("addTellerIdtip").innerText = "";
        App.InputEdit.getCurPosition(IDCardNo);
    }

    function funKeyInput() {
        var oKeyboardKey = document.getElementsByName("Name_Keyboard");
        for (var i = 0; i < oKeyboardKey.length; i++) {
            var keyEvent = oKeyboardKey[i];
            keyEvent.onclick = function (e) {
				if(bInputTellNo){
					TellerNo.focus();
					if (this.innerText == "清除") {
						TellerNo.innerText = '';
					} else if (this.innerText == "小写") {
						document.getElementById("KeysDiv").removeChild(document.getElementById("Keyboards"));
						App.Plugin.Keyboard.show("6", "KeysDiv", "Keyboards");
						funKeyInput();
					} else if (this.innerText == "大写") {
						document.getElementById("KeysDiv").removeChild(document.getElementById("Keyboards"));
						App.Plugin.Keyboard.show("3", "KeysDiv", "Keyboards");
						funKeyInput();
					} else {
						if (strTypeValue == "00") {  //员工号
							if (TellerNo.value.length < 10) {
								App.InputEdit.getInput(TellerNo, 0, this.innerText);
							}
						}
						else if (strTypeValue == '01') {//身份证号
							if (TellerNo.value.length < 19) {
								App.InputEdit.getInput(TellerNo, 0, this.innerText);
							}
						}
						else if (strTypeValue == '02') {//ABIS柜员号
							if (TellerNo.value.length < 7) {
								App.InputEdit.getInput(TellerNo, 0, this.innerText);
							}
						}
						else if (strTypeValue == '03') {//BOEING柜员号
							if (TellerNo.value.length < 11) {
								App.InputEdit.getInput(TellerNo, 0, this.innerText);
							}
						}
					}
				}else{
					IDCardNo.focus();
					document.getElementById("addTellerIdtip").innerText = "";
					if (this.innerText == "清除") {
						IDCardNo.innerText = '';
					} else {						
						if (IDCardNo.value.length < 18) {
							App.InputEdit.getInput(IDCardNo, 0, this.innerText);
						}						
					}
				}                
            }
        }
    }

    function addTeller() {
        top.API.displayMessage("addTeller is done");
        tipinfo.innerText = "";
        if (TellerNo.value == "") {
            tipinfo.innerText = "授权号输入不能为空！";
        } else {
            for (var i = 0; i < TelInfo.length; i++) {
                if (TellerNo.value == TelInfo[i].telno) {
                    tipinfo.innerText = "此授权信息已经存在！";
                    return;
                }
            }
            if ("1" === AuthorType) {
                document.getElementById("errortip").style.display = "none";
                document.getElementById("KeysDiv").style.display = "none";
                document.getElementById("TypeList").style.display = "none";
                document.getElementById("c_tab").style.display = "none";
                if ("1" === FpiPvr) {//指纹仪品牌   1：浙江维尔 2：天诚盛业
                    document.getElementById("PromptIcon1").style.backgroundImage = "url('Framework/style/Graphics/box_ico_4.png')";
                    document.getElementById("PromptIcon2").style.backgroundImage = "url('Framework/style/Graphics/box_ico_4.png')";
                    document.getElementById("PromptIcon3").style.backgroundImage = "url('Framework/style/Graphics/box_ico_4.png')";
                    document.getElementById("FingerPromptDiv").style.display = "block";
                    document.getElementById("FingerTipDiv").innerHTML = "温馨提示：请把手指放在指纹仪上进行指纹录入，<br/><br/>分3次放入。若录入失败，请再次放入手指进行指纹录入。";
                } else {
                    document.getElementById("PromptIconTC").style.backgroundImage = "url('Framework/style/Graphics/box_ico_4.png')";
                    document.getElementById("FingerPromptDivTC").style.display = "block";
                    document.getElementById("FingerTipDiv").innerHTML = "温馨提示：请把手指放在指纹仪上进行指纹录入，<br/><br/>请在滴~滴~滴~三声后再移开手指。若录入失败，请再次放入手指进行指纹录入。";
                }
                document.getElementById("FingerTipDiv").style.display = "block";
                bError = false;
                top.API.Fpi.AcquireData(-1);
            } else{
				bInputTellNo = false;
				document.getElementById("errortip").style.display = "none";
                document.getElementById("pulleyDiv").style.display = "none";
                document.getElementById("TypeList").style.display = "none";
                document.getElementById("c_tab").style.display = "none";
				document.getElementById("addTellerId").style.display = "block";
				IDCardNo.focus();
                //AddNewJson("");
                //setTimeout(function () { tipinfo.innerText = "";showTelInfo(); }, 1000);
            };
        }
    }

    Array.prototype.indexOf = function (val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) {
                return i;
            }
        }
        return -1;
    }
    Array.prototype.remove = function (val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    }

    function del_click(btns) {
        for (var i = 0; i < btns.length; i++) {
            (function () {
                var p = i;
                btns[p].onclick = function () {
                    TelInfo.remove(TelInfo[p]);
                    operateFlag = "del";
                    showTelInfo();
                    var arrTotalFlag = new Array(JSON.stringify(AdminObj));
                    nRet1 = top.API.Dat.SetPersistentData("TELLERNO", "STRING", arrTotalFlag);
                }
            })();
        }
    }

    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        var arrDataValue = DataValue;
        top.API.displayMessage("onDatGetPersistentDataComplete is done,DataName=" + DataName + ",DataType=" + DataType + ",DataValue=" + arrDataValue);
        //top.API.TelInfoObjStr = arrDataValue.toString();
        // top.API.displayMessage("top.API.TelInfoObjStr =" + top.API.TelInfoObjStr);
        AdminObj = eval('(' + arrDataValue.toString() + ')');
        TelInfo = AdminObj.TelInfo;
        showTelInfo();
        var deletebtns = document.getElementsByName("delBtn");
        del_click(deletebtns);
    }

    function onDatSetPersistentDataComplete(DataName) {
        top.API.displayMessage("onDatSetPersistentDataComplete is done,DataName=" + DataName);
        if (operateFlag == "add") {
            return CallResponse("OK");
        }
    }


    function onDatSetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatSetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
    }

    function onDatGetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatSetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        var arrParam = new Array('{"TelInfo":[]}');
        top.API.Dat.AddPersistentData("TELLERNO", "STRING", arrParam);
    }

    function onAddPersistentDataComplete(DataName) {
        top.API.displayMessage("onAddPersistentDataComplete is done,DataName=" + DataName);
        if ('TELLERNO' == DataName) {
            var tmpStr = '{"TelInfo":[]}';
            AdminObj = eval('(' + tmpStr + ')');
            TelInfo = AdminObj.TelInfo;
            showTelInfo();
            var deletebtns = document.getElementsByName("delBtn");
            del_click(deletebtns);
            bGetPswCompleted = true;
        }
    }

    function onAddPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onAddPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
    }

    function EventLogin() {
        top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.addEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.addEvent("SetPersistentDataError", onDatSetPersistentDataError);
        top.API.Dat.addEvent("AddPersistentDataComplete", onAddPersistentDataComplete);
        top.API.Dat.addEvent("AddPersistentDataError", onAddPersistentDataError);

        top.API.Fpi.addEvent('DataAcquired', onDataAcquired);
        top.API.Fpi.addEvent('Timeout', onFpiTimeout);
        top.API.Fpi.addEvent('DeviceError', onFpiDeviceError);
    }

    function EventLogout() {
        top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.removeEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.removeEvent("SetPersistentDataError", onDatSetPersistentDataError);
        top.API.Dat.removeEvent("AddPersistentDataComplete", onAddPersistentDataComplete);
        top.API.Dat.removeEvent("AddPersistentDataError", onAddPersistentDataError);

        top.API.Fpi.removeEvent('DataAcquired', onDataAcquired);
        top.API.Fpi.removeEvent('Timeout', onFpiTimeout);
        top.API.Fpi.removeEvent('DeviceError', onFpiDeviceError);
    }

    function AddNewJson(data) {
        var newJson = {
            "teltype": strTypeValue,
            "telno": TellerNo.value,
            "fingerinfo": data
        };
        TelInfo.push(newJson);
        showTelInfo();
        operateFlag = "add";
        TellerNo.innerText = '';
        tipinfo.innerText = "添加成功！";
        var arrTotalFlag = new Array(JSON.stringify(AdminObj));
        nRet1 = top.API.Dat.SetPersistentData("TELLERNO", "STRING", arrTotalFlag);
        top.API.displayMessage("增加授权号：SetPersistentData TELLERNO Return:" + nRet1);
    }

    function onDataAcquired(data) {
        top.API.displayMessage("onDataAcquired is done");
        var fingerData = data;
        if ((fingerData[0] != null) && (fingerData[0] != "") && (fingerData[0] != undefined)) {
            if ("1" === FpiPvr) {//指纹仪品牌   1：浙江维尔 2：天诚盛业
                if (fingerData[0] == "1") {
                    document.getElementById("PromptIcon1").style.backgroundImage = "url('Framework/style/Graphics/box_ico_3.png')";
                } else if (fingerData[0] == "2") {
                    document.getElementById("PromptIcon2").style.backgroundImage = "url('Framework/style/Graphics/box_ico_3.png')";
                } else {
                    AddNewJson(fingerData[0]);
                    document.getElementById("PromptIcon3").style.backgroundImage = "url('Framework/style/Graphics/box_ico_3.png')";
                    return CallResponse('OK');
                }
            } else {
                AddNewJson(fingerData[0]);
                document.getElementById("PromptIconTC").style.backgroundImage = "url('Framework/style/Graphics/box_ico_3.png')";
                return CallResponse('OK');
            }
        }
    }

    function onFpiTimeout() {
        top.API.displayMessage("onFpiTimeout is done");
        document.getElementById("FingerTipDiv").innerHTML = "指纹录入超时 ! !";
        bError = true;
        //setTimeout(function(){return CallResponse('Exit');},5000);
    }

    function onFpiDeviceError() {
        top.API.displayMessage("onFpiDeviceError is done");
        document.getElementById("FingerTipDiv").innerHTML = "指纹录入失败 ! !";
        bError = true;
        //setTimeout(function(){return CallResponse('Exit');},5000);        
    }

    //Page Return
    
    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
        App.Timer.ClearTime();
    }
})();

