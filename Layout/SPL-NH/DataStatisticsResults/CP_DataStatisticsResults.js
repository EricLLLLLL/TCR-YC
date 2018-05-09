;(function () {
    var DSArray = new Array(),
        $td = $("td");

    var Initialize = function () {
        ButtonDisable();
        getData();
        ButtonEnable();
    }();//Page Entry

    //@User ocde scope start
    document.getElementById('Exit').onclick = function () {
        ButtonDisable();
        return CallResponse('Exit');
    };
    function ButtonDisable() {
        document.getElementById('Exit').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Exit').disabled = false;
    }

    //@User code scope end
    function getData(){
        DSArray = top.API.gDSResultData;
        $("#timeScope").html(top.API.gDSTimeScope); // 时间

        // 循环显示数据
        $.each(DSArray,function(i,n){
            $td.eq(i).html(n);
        });

    }
    // function FillingData() {
    //     //行数据
    //     var LineData = new Array();

    //     //填充时间
    //     document.getElementById("timeScope").innerText = top.API.gDSTimeScope;

    //     //计算统计数据开始
    //     var CwdCounts = 0; 
    //     var CwdMoney = 0;
    //     var CwdFailCounts = 0;

    //     var DepCounts = 0;
    //     var DepMoney = 0;
    //     var DepFailCounts = 0;
    //     //填充统计除外的其他数据
    //     for (var i = 0 ; i<datas.length; i++){
    //         LineData = DSArray[i].split(":");
    //         for(var j = 0 ; j<3 ; j++){
    //             datas[i].getElementsByTagName("td")[j+1].innerText = LineData[j];
    //         }
    //         if(i>=3){
    //             DepCounts += parseInt(LineData[0]);
    //             DepMoney += parseInt(LineData[1]);
    //             DepFailCounts += parseInt(LineData[2]);

    //         }else{
    //             CwdCounts += parseInt(LineData[0]);
    //             CwdMoney += parseInt(LineData[1]);
    //             CwdFailCounts += parseInt(LineData[2]);
    //         }
    //     }


    //     var Counts = CwdCounts+DepCounts;
    //     var Money = CwdMoney+DepMoney;
    //     var FailCounts = CwdFailCounts+DepFailCounts;
    //     //计算统计数据结束

    //     //填充计算后的数据
    //     var cwd = document.getElementById("cwd").getElementsByTagName("td");
    //     var dep = document.getElementById("dep").getElementsByTagName("td");
    //     var total = document.getElementById("total").getElementsByTagName("td");

    //     cwd[1].innerText = CwdCounts;
    //     cwd[2].innerText = CwdMoney;
    //     cwd[3].innerText = CwdFailCounts;

    //     dep[1].innerText = DepCounts;
    //     dep[2].innerText = DepMoney;
    //     dep[3].innerText = DepFailCounts;

    //     total[1].innerText = Counts;
    //     total[2].innerText = Money;
    //     total[3].innerText = FailCounts;
    // }

    function CallResponse(Response) {
        App.Cntl.ProcessDriven(Response);
    }
})();
