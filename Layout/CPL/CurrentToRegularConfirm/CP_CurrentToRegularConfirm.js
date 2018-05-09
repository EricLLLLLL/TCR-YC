;
(function() {
    var CallResponse = App.Cntl.ProcessOnce(function(Response) {
            //TO DO:
            Clearup();
            //Entry the flows control process.
            App.Cntl.ProcessDriven(Response);
        }),
        Initialize = function() {
            EventLogin();
            setInfo();
            //@initialize scope start
            App.Timer.TimeoutDisposal(TimeoutCallBack);
        }(); //Page Entry

    function ButtonDisable() {
        document.getElementById('Back').disabled = true;
        document.getElementById('Exit').disabled = true;
        document.getElementById('OK').disabled = true;

    }

    function ButtonEnable() {
        document.getElementById('Back').disabled = false;
        document.getElementById('Exit').disabled = false;
        document.getElementById('OK').disabled = false;
    }

    //@User ocde scope start
    document.getElementById('Exit').onclick = function() {
        ButtonEnable();
        top.ErrorInfo = top.API.PromptList.No2;
        return CallResponse('Exit');
    }
    document.getElementById('Back').onclick = function() {
        ButtonEnable();
        return CallResponse('Back');
    }

    document.getElementById('OK').onclick = function() {
        ButtonEnable();
        top.API.gTransactiontype = 'CURRENTACCOUNTTOSAVINGS';  // 活期转整整
        return CallResponse('OK');
    }

    //@User code scope end

    // 回写数据到页面显示
    function setInfo(){
        $("#Username").html( top.changeName(top.API.gCustomerName) );  // 户名
        $("#AccountNumber").html( top.changeCardNum(top.API.gCardno) );  // 账号
        $("#RemittanceFlag").html( top.API.Dat.GetDataSync("QRYEXECUTERATERESULT","STRING").toArray()[0] );  // 利率
        $("#TransferAmount").html( top.API.CTRMoney );  // 转存金额
        $("#AmountInWords").html( top.cmycurd(top.API.CTRMoney) );  // 大写金额
        $("#saveTime").html( top.API.saveTime );  // 存期
        $("#ArchivedType").html( top.API.saveToType );  // 转存类型
        if(top.API.Dat.GetDataSync("DEALTYPEFLAG", "STRING").toArray()[0] == "1"){
            $(".saveToTimeWrap").show();
            $("#saveToTime").html( top.API.saveToTime );  // 约定转存存期
        }else{
            $(".saveToTimeWrap").hide();
        }
        
    }

    //Register the event
    function EventLogin() {

    }

    function EventLogout() {

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
        App.Timer.ClearTime();
    }
})();