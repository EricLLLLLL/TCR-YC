;
(function () {
    var data = top.API.CancellationAccountList,
        selectedValue = '';
        CallResponse = App.Cntl.ProcessOnce(function (Response) {
            //TO DO:
            Clearup();
            //Entry the flows control process.
            App.Cntl.ProcessDriven(Response);
        }),
        Initialize = function () {
            ButtonDisable();
            EventLogin();
            checkData(data);
            $("#name p").text( "户名："+top.changeName(top.API.gIdName) );
            $("#OK").hide();
            addToTable();
            App.Timer.TimeoutDisposal(TimeoutCallBack);
            ButtonEnable();
        }(); //Page Entry

    //@User ocde scope start
    document.getElementById('Exit').onclick = function () {
        ButtonDisable();
        return CallResponse('Exit');
    };

    document.getElementById('OK').onclick = function () {
        ButtonDisable();
        var index = $("input[type='radio']:checked").val();
        selectedValue = data[index];
        top.API.Dat.SetDataSync('CARDNO','STRING',[selectedValue]);
        top.API.CancelCardNo = selectedValue;
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

    // 验证返回的数据内容
    function checkData(data){
        if(data[0] == null || data[0] == ""){
            $("#AgentErrTip p").html("未查询出可销户账号！如有疑问请咨询工作人员！");
            document.getElementById('OK').disabled = false;
            App.Timer.SetPageTimeout(8);
        }else{
            if( data.length >18 ){
                App.Plugin.Voices.play("voi_49");
            }else{
                App.Plugin.Voices.play("voi_48"); 
            }
        }
    }

    function addToTable() {
        var table = $('#accountTable');
        var tr = $("<tr></tr>");
        for (var o in data) {
            if (o % 2 == 0) {
                tr = $("<tr></tr>");
            }
            var td = $("<td></td>");
            var div = $("<div></div>");
            div.attr('class', 'radio-line-double')
            var input = $("<input />");
            input.attr('type', 'radio');
            var idAndFor = 'radio' + o;
            input.attr('id', idAndFor);
            input.attr('name', 'radio')
            input.attr('value', o);
            var label = $("<label></label>");
            label.attr('for', idAndFor);
            label.text(data[o]);
            div.append(input);
            input.after(label);
            td.append(div);
            tr.append(td);
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