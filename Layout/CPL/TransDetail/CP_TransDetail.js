;(function () {
    var CallResponse = App.Cntl.ProcessOnce(function (Response) {
            //TO DO:
            Clearup();
            App.Cntl.ProcessDriven(Response);
        }),
        Initialize = function () {
            ButtonDisable();
            EventLogin();
            showDetail();
            App.Timer.TimeoutDisposal(TimeoutCallBack);
            ButtonEnable();
        }();//Page Entry


    function showDetail() {
        var data = top.API.gTransDetail + "";
        var detailList = data.split("|");
        var detailLine;
        var ul = $("#detailLists");
        var line = "";
        var x;
        var y;
        for (x in detailList) {
            line += "<li>";

            detailLine = detailList[x].split(",");

            for (y in detailLine) {
                if (( y > 0 ) && ( y / 2 == 0)) {
                    line += "<span style='display: inline-block;text-align: right;margin-left: -70px;margin-right: 70px;'>" + detailLine[y] + "</span>";
                } else {
                    line += "<span>" + detailLine[y] + "</span>";
                }
            }
            line += "</li>";

        }
        ul.html(line);
    }

    function ButtonDisable() {
        document.getElementById('Exit').disabled = true;
        //document.getElementById('OK').disabled = true;
        document.getElementById('PageRoot').disabled = true;
        document.getElementById('Continue').disabled = true;
    }

    function ButtonEnable() {
        //document.getElementById('OK').disabled = false;
        document.getElementById('Exit').disabled = false;
        document.getElementById('PageRoot').disabled = false;
        document.getElementById('Continue').disabled = false;
    }

    document.getElementById("PageRoot").onclick = function () {
        ButtonDisable();
        return CallResponse("BackHomepage");
    };
    //@User ocde scope start
    document.getElementById('Exit').onclick = function () {
        ButtonDisable();
        return CallResponse('Exit');
    };

    document.getElementById('Continue').onclick = function () {
        ButtonDisable();
        top.API.gNotINQ = true;
        return CallResponse("NeedInitData");
    };

    //@User code scope end

    //Register the event
    function EventLogin() {
    }

    function EventLogout() {
    }

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
