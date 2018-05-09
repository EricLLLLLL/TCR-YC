;(function() {
    var $cardNum  = $(".cardNum"),
        $name     = $(".name"),
        $money    = $(".money"),
        $errTip   = $(".errTip"),
        $saveTime = $(".saveTime"),
        $saveToType = $(".saveToType"),
        $saveToTime = $(".saveToTime"),

        cardNum = top.API.gCardno,  // 账户
        name    = top.API.gCustomerName,  // 户名
        money   = 0;  // 金额

    var Inputdata = "";
    var EnterKey = false;
    var bFirstKey = true;
        
    var CallResponse = App.Cntl.ProcessOnce(function(Response) {
        //TO DO:
        Clearup();
        top.API.Siu.SetPinPadLight('OFF');
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    }),
    Initialize = function() {
        EventLogin();
        //@initialize scope start

        // 初始值回填
        $cardNum.html( top.changeCardNum(cardNum) ); // 卡号
        $name.html( top.changeName(name) );  //  姓名

        App.Timer.TimeoutDisposal(TimeoutCallBack);
        top.API.Pin.GetData(0, false, "0,1,2,3,4,5,6,7,8,9,ENTER,CLEAR,CANCEL", "CANCEL", -1);
        top.API.Siu.SetPinPadLight('CONTINUOUS');
    }(); //Page Entry


    function ButtonDisable() {
        document.getElementById('Exit').disabled = true;
        document.getElementById('OK').disabled = true;

    }

    function ButtonEnable() {
        document.getElementById('Exit').disabled = false;
        document.getElementById('OK').disabled = false;
    }
    //@User ocde scope start
    document.getElementById('Exit').onclick = function() {

        top.ErrorInfo = top.API.PromptList.No2;
        return CallResponse('Exit');
    }

    document.getElementById('OK').onclick = function() {
        
        // return CallResponse('OK');
        top.API.displayMessage("点击OK按钮");
        EnterKey = true;
        $errTip.html("");
        if (Inputdata == "") {
            $errTip.html("交易金额不能为空！");
            Reinput();
        } else {
            getData();
        }
    }

    $saveToType.change(function(){
        if( $saveToType.val() == "1" ){
            $(".saveToTimeWrap").show();
        }else{ $(".saveToTimeWrap").hide(); }
    });

    //@User code scope end

    function getData(){
        if( parseInt(Inputdata) > parseInt(top.API.balance) ){
            $errTip.html("交易金额大于卡内余额，请重新输入！");
            Reinput();
        }else if( parseInt(Inputdata) < 50 ){
            $errTip.html("交易金额不能小于50元，请重新输入！");
            Reinput();
        }else{
            top.API.CTRMoney = Inputdata;
            // top.API.svaeTime = $(".svaeTime option:selected").text();
            // top.API.saveToType = $(".saveToType option:selected").text();
            // top.API.saveToTime = $(".saveToTime option:selected").text();
            // top.API.svaeTime = $(".saveTime").val();
            // top.API.saveToType = $saveToType.val();
            // top.API.saveToTime = $(".saveToTime").val();

            // [交易金额]设置
			var tmp = Inputdata + "00";
			var arrINPUTMONEY = new Array(tmp);

			top.API.Dat.SetDataSync(top.API.transamountTag, top.API.transamountType, arrINPUTMONEY);
            
            // [存期]设置
            var arrSAVETIME = $saveTime.val();
            switch ( arrSAVETIME ) {
                case "M006":
                    top.API.saveTime = "六个月";
                    break;
                case "Y001":
                    top.API.saveTime = "一年";
                    break;
                case "Y003":
                    top.API.saveTime = "三年";
                    break;
                case "Y005":
                    top.API.saveTime = "五年";
                    break;
                default:
                    top.API.saveTime = "三个月";
                    break;
            }
            top.API.Dat.SetDataSync("DEPOSIT", "STRING", [arrSAVETIME]);

            // [转存类型]设置
            var arrSAVETOTYPE = $saveToType.val();
            top.API.saveToType = arrSAVETOTYPE == "1" ? "约定转存" : "不约定转存";
            top.API.Dat.SetDataSync("DEALTYPEFLAG", "STRING", [arrSAVETOTYPE]);

            // [约定转存存期]设置
            if(arrSAVETOTYPE != "1"){
                var arrSAVETOTIME = "无";
            }else{
                var arrSAVETOTIME = $saveToTime.val();
                switch ( arrSAVETOTIME ) {
                    case "M003":
                        top.API.saveToTime = "三个月";
                        break;
                    case "M006":
                        top.API.saveToTime = "六个月";
                        break;
                    case "Y001":
                        top.API.saveToTime = "一年";
                        break;
                    case "Y003":
                        top.API.saveToTime = "三年";
                        break;
                    case "Y005":
                        top.API.saveToTime = "五年";
                        break;
                    default:
                        top.API.saveToTime = "";
                        break;
                }
            }
            
            top.API.Dat.SetDataSync("AGREEMENT", "STRING", [arrSAVETOTIME]);


            // top.API.displayMessage("saveTime="+top.API.saveTime +"--saveToType="+top.API.saveToType+"--saveToTime="+top.API.saveToTime);
            // top.API.displayMessage("balance="+top.API.balance);
            // top.API.displayMessage("Inputdata="+Inputdata);

            
            top.API.gTransactiontype = 'QRYEXECUTERATE';  // 查询活转定利率

            return CallResponse('OK');
        }
    }
    //重新输入金额
    function Reinput() {
        ButtonEnable();
        EnterKey = false;
        bFirstKey = true;
        Inputdata = "";
        //document.getElementById("CNMoney").innerText = Inputdata;
        $money.val(Inputdata);
    }

    function onKeyPressed(key, keyCode) {
        var tmpInputdata = "";
        $errTip.html("");
        if (((0 == key || 00 == key) && bFirstKey == true) && Inputdata.length < 9) {
            top.API.displayMessage("第一个数字不能为0");
        } else if (0 <= key || key <= 9 || 00 == key) {
            tmpInputdata = Inputdata;
            tmpInputdata += key;
            // if (tmpInputdata.length == 7) {
            //     $errTip.html("");
            // } else if ((parseInt(tmpInputdata, 10) > 10000) && (top.API.CashInfo.Dealtype == "存折取款")) {
            //     $errTip.html("存折取款不可大于10000元");
            // } else {
                Inputdata = tmpInputdata;
                bFirstKey = false;
            // }
            // document.getElementById("CNMoney").innerText = top.InsertChar(Inputdata, 3, ',');
            $money.val( top.InsertChar(Inputdata, 3, ',') );
            // document.getElementById("CNMoney").innerText = top.cmycurd(Inputdata);
        } else if (key == "CLEAR") {
            Reinput();
        } else if (key == "CANCEL") {
            Reinput();
            // document.getElementById('Exit').onclick();
        } else if (key == "ENTER") {
            if (!EnterKey) {
                EnterKey = true;
                // document.getElementById('OK').onclick();
            }
        }
    }
    function onDeviceError() {
        top.API.displayMessage("onDeviceError触发");
        top.ErrorInfo = top.API.PromptList.No4;
        return CallResponse("Exit");
    }


    //Register the event
    function EventLogin() {
        top.API.Pin.addEvent("KeyPressed", onKeyPressed);
        top.API.Pin.addEvent("DeviceError", onDeviceError);

    }

    function EventLogout() {
        top.API.Pin.removeEvent("KeyPressed", onKeyPressed);
        top.API.Pin.removeEvent("DeviceError", onDeviceError);

    }

    //Countdown function
    function TimeoutCallBack() {
        top.ErrorInfo = top.API.PromptList.No3;
        return CallResponse('TimeOut');
    }
    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
        top.API.Pin.CancelGetData();
        App.Timer.ClearTime();
    }
})();