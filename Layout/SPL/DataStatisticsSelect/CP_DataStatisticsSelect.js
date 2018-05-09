;(function () {
    var strDate = "";//当前日期
    var StartEndTimeNum = 0;
    var StartEndTime = null;
    var arrStrStartTime = new Array();
    var arrStrEndTime = new Array();

    var Initialize = function () {
        ButtonDisable();
        //获得开始和结束时间的对象
        StartEndTime = document.getElementsByName("StartEndTime1");
        StartEndTimeClick(StartEndTime);
        //获取当前时间
        var tmpStrDate = top.GetDate12byte();
        //todo
        strDate = tmpStrDate.substr(0, 4) + "#" + tmpStrDate.substr(4, 2) + "#" + tmpStrDate.substr(6, 2) + "#" +
            tmpStrDate.substr(0, 4) + "#" + tmpStrDate.substr(4, 2) + "#" + tmpStrDate.substr(6, 2);
        //显示当前时间到输入框
        onClearTime();
        //显示小键盘
        App.Plugin.Keyboard.show("2", "PageSubject", "KeyboardDiv");
        KeyboardClick();
        ButtonEnable();
    }();//Page Entry

    function ButtonDisable() {
        document.getElementById('Back').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Back').disabled = false;
    }


    //输入框点击事件
    function StartEndTimeClick(Element) {
        for (var j = 0; j < Element.length; j++) {
            (function () {
                var input = Element[j];
                var p = j;
                input.onclick = function () {
                    StartEndTimeNum = p;
                    App.InputEdit.getCurPosition(input);
                }
            })();
        }
    }

    //输入时间框获得目标
    function onClearTime() {
        top.API.displayMessage("onClearTime()");
        var i = 0;
        var arrSplitValue = new Array();
        arrSplitValue = strDate.split("#");
        for (i = 0; i < arrSplitValue.length; i++) {
            StartEndTime[i].value = arrSplitValue[i];
            if (i < 3) {
                arrStrStartTime[i] = arrSplitValue[i];
            } else {
                arrStrEndTime[i - 3] = arrSplitValue[i];
            }
        }
    }


    function KeyboardClick() {
        var arrKeyboardKey = document.getElementsByName("Name_Keyboard");
        for (var i = 0; i < arrKeyboardKey.length; i++) {
            var keyEvent = arrKeyboardKey[i];
            keyEvent.onclick = function (e) {
                document.getElementById('Crown_Select_tip').style.display = "none";
                if ('退格' == this.innerText) {
                    App.InputEdit.getInput(StartEndTime[StartEndTimeNum], 1, "BS");
                    if (StartEndTimeNum < 3) {
                        arrStrStartTime[StartEndTimeNum] = StartEndTime[StartEndTimeNum].value;
                    } else {
                        arrStrEndTime[StartEndTimeNum - 3] = StartEndTime[StartEndTimeNum].value;
                    }
                } else if ('清除' == this.innerText) {
                    StartEndTime[StartEndTimeNum].value = "";
                    if (StartEndTimeNum < 3) {
                        arrStrStartTime[StartEndTimeNum] = StartEndTime[StartEndTimeNum].value;
                    } else {
                        arrStrEndTime[StartEndTimeNum - 3] = StartEndTime[StartEndTimeNum].value;
                    }
                } else {

                    var MaxLen = 2;
                    if (StartEndTimeNum == 0 || StartEndTimeNum == 3) {
                        MaxLen = 4;
                    }

                    if (StartEndTimeNum < 3) {
                        if (arrStrStartTime[StartEndTimeNum].length < MaxLen) {
                            App.InputEdit.getInput(StartEndTime[StartEndTimeNum], 0, this.innerText);
                            arrStrStartTime[StartEndTimeNum] = StartEndTime[StartEndTimeNum].value;
                        }
                    } else {
                        if (arrStrEndTime[StartEndTimeNum - 3].length < MaxLen) {
                            App.InputEdit.getInput(StartEndTime[StartEndTimeNum], 0, this.innerText);
                            arrStrEndTime[StartEndTimeNum - 3] = StartEndTime[StartEndTimeNum].value;
                        }
                    }
                }
            }
        }
    }

    document.getElementById('KeyboardKey_set').onclick = function () {
        var strStart = arrStrStartTime[0] + arrStrStartTime[1] + arrStrStartTime[2];
        var strEnd = arrStrEndTime[0]  + arrStrEndTime[1] + arrStrEndTime[2];
        top.API.displayMessage("开始时间=" + strStart + ",结束时间=" + strEnd);
        //保存时间到top
        top.API.gDSTimeScope = strStart.trim() + "-" + strEnd.trim();
        //todo


        top.API.gDSResultData = top.API.Tsl.SumDataSync(strStart, strEnd);
        console.log("top.API.gDSResultData=" + top.API.gDSResultData);
        //调用获取统计数据的接口,添加事件等,获取的数去需要trim()
        return CallResponse('OK');
    };

    //@User ocde scope start
    document.getElementById('Back').onclick = function () {
        ButtonDisable();
        return CallResponse('Back');
    };

    function CallResponse(Response) {
        App.Cntl.ProcessDriven(Response);
    }
})();
