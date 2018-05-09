/*@create by:  tsxiong
 *@time: 2016年03月20日
 */
;
(function () {
    var CallResponse = App.Cntl.ProcessOnce(function (Response) {
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        ButtonDisable();
        EventLogin();
        //@initialize scope start  
        App.Plugin.Keyboard.show("3", "KeysDiv", "Keyboards");
        $("#KeysDiv").css({
            "left": "152px",
            "top": "400px"
        });
        funKeyInput();
        top.API.Dat.GetPersistentData(top.API.subbanknumTag, top.API.subbanknumType);
        ButtonEnable();
    }(); //Page Entry
    function ButtonDisable() {
        document.getElementById('Back').disabled = true;
        document.getElementById('OK').disabled = true;
        document.getElementById('PageRoot').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Back').disabled = false;
        document.getElementById('OK').disabled = false;
        document.getElementById('PageRoot').disabled = false;
    }
    document.getElementById('PageRoot').onclick = function () {
        ButtonDisable();
        return CallResponse('Exit');
    }
    //键盘相关
    var strBranchNo = "";
    var BranchNo = document.getElementById("BranchNoInput");
    BranchNo.focus();

    function funKeyInput() {
        var oKeyboardKey = document.getElementsByName("Name_Keyboard");
        for (var i = 0; i < oKeyboardKey.length; i++) {
            var keyEvent = oKeyboardKey[i];
            keyEvent.onclick = function (e) {
                document.getElementById("tipdiv").innerText = "";
                if (this.innerText == "清除") {
                    onClearNum();
                } else if (this.innerText == "小写") {
                    document.getElementById("KeysDiv").removeChild(document.getElementById("Keyboards"));
                    App.Plugin.Keyboard.show("6", "KeysDiv", "Keyboards");
                    keyflag = 1;
                    funKeyInput();
                } else if (this.innerText == "大写") {
                    document.getElementById("KeysDiv").removeChild(document.getElementById("Keyboards"));
                    App.Plugin.Keyboard.show("3", "KeysDiv", "Keyboards");
                    keyflag = 1;
                    funKeyInput();
                } else {
                    if (strBranchNo.length < 10) {
                        strBranchNo += this.innerText;
                        BranchNo.value = strBranchNo;
                    }
                    BranchNo.focus();
                }
            }
        }
    }


    function onClearNum() {
        BranchNo.value = '';
        strBranchNo = '';
        BranchNo.focus();
    }


    //@User ocde scope start
    document.getElementById('OK').onclick = function () {
        if (strBranchNo == "") {
            document.getElementById("tipdiv").innerText = "输入的机构号不能为空！";
        } else {
            // return CallResponse('TradeSuccess');

            var inputvalue = new Array(strBranchNo);
            top.API.displayMessage('机构号：SetPersistentData SUBBANKNUM =' + inputvalue);
            var nRet = top.API.Dat.SetPersistentData(top.API.subbanknumTag, top.API.subbanknumType, inputvalue);
            top.API.displayMessage('机构号：SetPersistentData SUBBANKNUM Return:' + nRet);
        }

    }
    // TradeSuccess	TradeFail

    document.getElementById('Back').onclick = function () {
        ButtonDisable();
        return CallResponse('Back');
    }

    // BranchNoInput  受理行号 --  机构号
    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        var arrGet = DataValue;
        // var arrGet = DataValue
        var showinfo = arrGet[0];
        top.API.displayMessage("onDatGetPersistentDataComplete is done,DataName=" + DataName + ",DataType=" + DataType + ",DataValue=" + showinfo);
        if ('SUBBANKNUM' == DataName) {
            BranchNo.value = showinfo;
            strBranchNo = BranchNo.value;
        }
    }

    function onDatGetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatGetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        alert("读取失败");
    }

    function onDatSetPersistentDataComplete(DataName) {
        top.API.displayMessage("onDatSetPersistentDataComplete is done,DataName=" + DataName);
        return CallResponse('TradeSuccess');

    }

    function onDatSetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatSetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        // alert("设定失败,请重新设定！");
        return CallResponse('TradeFail');
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

    function Clearup() {
        EventLogout();
    }
})();