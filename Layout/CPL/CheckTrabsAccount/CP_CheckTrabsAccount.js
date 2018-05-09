;
(function () {
    var CallResponse = App.Cntl.ProcessOnce(function (Response) {
            //TO DO:
            Clearup();
            //Entry the flows control process.
            App.Cntl.ProcessDriven(Response);
        }),
        Initialize = function () {
            ButtonDisable();
            EventLogin();
            //@initialize scope start
            setData();

            //TODO 设置转入账号到数据库
            top.API.Dat.SetDataSync('PayeeAccount', 'STRING', [top.API.PayeeAccount]);
            App.Timer.TimeoutDisposal(TimeoutCallBack);
            ButtonEnable();
        }(); //Page Entry

    //@User ocde scope start
    document.getElementById('Back').onclick = function () {
        ButtonDisable();
        return CallResponse('Back');
    };
    document.getElementById('Exit').onclick = function () {
        ButtonDisable();
        return CallResponse('Exit');
    };

    document.getElementById('OK').onclick = function () {
        ButtonDisable();
		top.API.gTransactiontype = "ACCDELETE";
        top.API.Dat.SetDataSync('TFRCARDNO', 'STRING', [top.API.PayeeAccount]);
        top.API.Dat.SetDataSync('TFRCUSTNAME', 'STRING', [top.API.gCustomerName]);
        top.API.Dat.SetDataSync('CARDNO', 'STRING', [top.API.CancelCardNo]);
        return CallResponse('OK');
    };

    function ButtonDisable() {
        document.getElementById('Back').disabled = true;
        document.getElementById('OK').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Back').disabled = false;
        document.getElementById('OK').disabled = false;
    }

    //@User code scope end

    function setData(){
        $("#CancelAccount").text( top.API.CancelCardNo );
        $("#CancelName").text( top.changeName(top.API.gIdName) );
        $("#CustomerName").text( top.changeName(top.API.gCustomerName) );
        $("#PayeeAccount").text( top.API.PayeeAccount );
        $("#phoneNum").text( top.API.phoneNum );
    }

    //Register the event
    function EventLogin() {

    }

    function EventLogout() {

    }

    //Countdown function
    function TimeoutCallBack() {

        return CallResponse('TimeOut');
    }

    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
        App.Timer.ClearTime();
    }
})();