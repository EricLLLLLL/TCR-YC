;
(function () {
    // var data = top.API.TrasferCancelList,
    var Data = top.API.Dat.GetDataSync("QRYTFSCANCELRESULT", "STRING").toArray(), // 后台返回数据

        TransferTime  = "", // 会计日期（原交易日期）
        OperatingTime = "", // 操作时间（原交易时间）
        TransfereAccount = "", // 转入账号
        TransferName  = "", // 转入户名
        TransferMoney = "", // 转账金额
        SystemFlag    = "", // 系统标识
        originallogno = "", // 原始日志号
        rqstserialnum = "", // 请求流水号
        paynum = "",// 支付交易序号

        CallResponse = App.Cntl.ProcessOnce(function (Response) {
            //TO DO:
            Clearup();
            //Entry the flows control process.
            App.Cntl.ProcessDriven(Response);
        }),
        Initialize = function () {
            ButtonDisable();
            EventLogin();

            if( Data == null || Data == "" ){
                $("#AgentErrTip").html("未查询出可撤销交易！如有疑问请咨询工作人员！");
            }else{
                addToTable();
            }
            
            App.Timer.TimeoutDisposal(TimeoutCallBack);
            ButtonEnable();
            $("#OK").hide();
        }(); //Page Entry

    //@User ocde scope start
    document.getElementById('Exit').onclick = function () {
        ButtonDisable();
        top.ErrorInfo = top.API.PromptList.No2;
        return CallResponse('Exit');
    };

    document.getElementById('OK').onclick = function () {
        ButtonDisable();

        // 数据设置内存中
        var $radioChecked = $("input[type='radio']:checked"),
            TRANSFERTIME  = $radioChecked.parent().parent().parent("tr").find("td").eq(1).html(), // 会计日期（原交易日期）
            OPERATINGTIME = $radioChecked.parent().parent().parent("tr").find("td").eq(2).html(), // 操作时间（原交易时间）
            TRANSFEREACCOUNT = $radioChecked.parent().parent().parent("tr").find("td").eq(3).html(), // 转入账号
            TRANSFERNAME  = $radioChecked.parent().parent().parent("tr").find("td").eq(4).html(), // 转入户名
            TRANSFERMONEY = (parseFloat( $radioChecked.parent().parent().parent("tr").find("td").eq(5).html() ) *100).toString(); // 转账金额
            RQSTSERIALNUM = $radioChecked.parent().parent().parent("tr").find("td").eq(5).attr("rqstserialnum"), // 请求流水号
            ORIGINALLOGNO = $radioChecked.parent().parent().parent("tr").find("td").eq(5).attr("originallogno"), // 原始日志号
            PAYNUM = $radioChecked.parent().parent().parent("tr").find("td").eq(5).attr("paynum"), // 支付交易序号
            SYSTEMFLAG = $radioChecked.parent().parent().parent("tr").find("td").eq(6).html(); // 系统标识

        top.API.Dat.SetDataSync("TRANSFERTIME", "STRING", [TRANSFERTIME]);
        top.API.Dat.SetDataSync("OPERATINGTIME", "STRING", [OPERATINGTIME]);
        top.API.Dat.SetDataSync("TRANSFEREACCOUNT", "STRING", [TRANSFEREACCOUNT]);
        top.API.Dat.SetDataSync("TFRCARDNO", "STRING", [TRANSFEREACCOUNT]);
        top.API.Dat.SetDataSync("TRANSFERNAME", "STRING", [TRANSFERNAME]);
        top.API.Dat.SetDataSync("TRANSAMOUNT", "STRING", [TRANSFERMONEY]);
        top.API.Dat.SetDataSync("RQSTSERIALNUM", "STRING", [RQSTSERIALNUM]);
        top.API.Dat.SetDataSync("ORIGINALLOGNO", "STRING", [ORIGINALLOGNO]);
        top.API.Dat.SetDataSync("PAYNUM", "STRING", [PAYNUM]);
        top.API.Dat.SetDataSync("SYSTEMFLAG", "STRING", [SYSTEMFLAG]);

        top.API.gTransactiontype = 'TRANSFERCANCEL';

        return CallResponse('OK');
    };

    function ButtonDisable() {
        document.getElementById('Exit').disabled = true;
        document.getElementById('OK').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Exit').disabled = false;
        document.getElementById('OK').disabled = false;
    }
    $("input[type='radio']").on("click", function(){
        $("#OK").show();
    })


    //@User code scope end
    // 处理数据
    function getData(data){
        var arr = data.split("A");

        // TransferTime = data.substr(0,8); // 会计日期（原交易日期）
        // OperatingTime = data.substr(8,6); // 操作时间（原交易时间）
        // TransfereAccount = data.substr(14,20); // 转入账号
        // TransferName = data.substr(34,17); // 转入户名
        // TransferMoney = data.substr(51,19); // 转账金额
        // SystemFlag = data.substr(70,1); // 系统标识
        // originallogno = data.substr(71,9); // 原始日志号
        // rqstserialnum = data.substr(80,22); // 请求流水号
        // paynum = data.substr(102,8); // 支付交易序号

        TransferTime  = arr[0]; // 会计日期（原交易日期）
        OperatingTime = arr[1]; // 操作时间（原交易时间）
        TransfereAccount = arr[2]; // 转入账号
        TransferName  = arr[3]; // 转入户名
        TransferMoney = arr[4]; // 转账金额
        SystemFlag    = arr[5]; // 系统标识
        originallogno = arr[6]; // 原始日志号
        rqstserialnum = arr[7]; // 请求流水号
        paynum = arr[8]; // 支付交易序号

    }
    function addToTable() {

        var table = $('#accountTable'),
            arrData = Data[0].split("B");
            // strLen = 110, // 每一个子账户数据长度
            // dataStrLen = Data[0].length, // 后台返回子账户总长度
            // arrDataLen = Data[0].length/strLen; // 子账户个数

        // 将子账户信息分隔成数组
        // for( var i=0, len=arrDataLen; i<arrDataLen; i++ ){
        //     arrData[i] = Data[0].substr(i*strLen, strLen);
        // }

        var table = $('#accountTable');
        for (var o in arrData) {
            getData(arrData[o]);
            var tr = $("<tr></tr>");
            var td1 = $("<td></td>");
            var div = $("<div></div>");
            div.attr('class', 'radio-wrap');

            var input = $("<input />");
            input.attr('type', 'radio');
            var idAndFor = 'radio' + o;
            input.attr('id', idAndFor);
            input.attr('name', 'radio')
            input.attr('value', o);

            var label = $("<label></label>");
            label.attr('for', idAndFor);
            div.append(input);
            input.after(label);
            td1.append(div);

            var td2 = $("<td></td>");
            td2.text(TransferTime);

            var td3 = $("<td></td>");
            td3.text(OperatingTime);

            var td4 = $("<td></td>");
            td4.text(TransfereAccount);

            var td5 = $("<td></td>");
            td5.text(TransferName);

            var td6 = $("<td paynum='"+paynum+"' originallogno='"+originallogno+"' rqstserialnum='"+rqstserialnum+"'></td>");
            td6.text(TransferMoney);

            var td7 = $("<td></td>");
            td7.text(SystemFlag);


            tr.append(td1);
            // tr.append(td2);
            td1.after(td2);
            td2.after(td3);
            td3.after(td4);
            td4.after(td5);
            td5.after(td6);
            td6.after(td7);

            table.append(tr);
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