/*@create by:  liaolei
 *@time: 2016年03月20日
 */
;(function () {
    var CallResponse = App.Cntl.ProcessOnce(function (Response) {
        Clearup();
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        EventLogin();
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        setData();
		//SaveTheCloseRecord();
        top.API.Ptr.Print("Receipt_Sales_szABC", "", top.API.gPrintTimeOut);
    }(); //Page Entry
    function ButtonDisable() {
        document.getElementById('Exit').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Exit').disabled = false;
    }


    document.getElementById("Exit").onclick = function () {
        ButtonDisable();
        top.ErrorInfo = top.API.PromptList.No2;
        return CallResponse("Exit");
    }

    function setData(){
        var CARDNO = top.API.Dat.GetDataSync("CARDNO", "STRING")[0],
            TRANSAMOUNT = top.API.Dat.GetDataSync("TRANSAMOUNT", "STRING")[0],
            INTEREST = top.API.Dat.GetDataSync("INTEREST", "STRING")[0],
            TAXABLE = top.API.Dat.GetDataSync("TAXABLE", "STRING")[0],
            TAXRATE = top.API.Dat.GetDataSync("TAXRATE", "STRING")[0],
            TAX = top.API.Dat.GetDataSync("TAX", "STRING")[0],
            TOTAL = top.API.Dat.GetDataSync("TOTAL", "STRING")[0],
            CUSTOMERNAME = top.API.Dat.GetDataSync("CUSTOMERNAME", "STRING")[0];

        $("#CARDNO").text(top.changeCardNum(CARDNO));
        $("#TRANSAMOUNT").text(TRANSAMOUNT);
        $("#INTEREST").text(INTEREST);
        $("#TAXABLE").text(TAXABLE);
        $("#TAXRATE").text(TAXRATE);
        $("#TAX").text(TAX);
        $("#TOTAL").text(TOTAL);
        $("#CUSTOMERNAME").text(top.changeName(CUSTOMERNAME));

        top.API.Dat.SetDataSync("DEALTYPE", "STRING", ["卡折销户"]);

        // 打印流水
        top.API.Jnl.PrintSync("SalesComplete");
    }
	
	function SaveTheCloseRecord(){
		// 将销户记录保存到本地
        var sAccoutNo = top.API.Dat.GetDataSync("CARDNO", "STRING")[0]; // 卡号
        var sTransNo = top.API.Dat.GetDataSync("TFRCARDNO", "STRING")[0]; // 转入账户
        var sTransAmount = top.API.Dat.GetDataSync("TOTAL", "STRING")[0]; // 金额
        var sRetCode = top.API.gResponsecode; // 后台返回值
		
		top.API.displayMessage("保存销户信息到本地文件");
		top.API.Tsl.HandleRecordFileSync(top.API.MTSL_WRITECLOSEDCORD, sAccoutNo + ", " + sTransNo + ", " + sTransAmount + ", " + sRetCode + ", " + ["销户成功"]);
	}
    function onPrintFailed() {
        top.API.displayMessage("onPrintFailed");
        $(".errTip").html("打印机故障，暂时无法提供凭条");
    }
    //Register the event
    function EventLogin() {
        top.API.Ptr.addEvent("PrintFailed", onPrintFailed);
    }

    function EventLogout() {
        top.API.Ptr.removeEvent("PrintFailed", onPrintFailed);
    }


    //Countdown function
    function TimeoutCallBack() {
        top.ErrorInfo = top.API.PromptList.No3;
        return CallResponse("TimeOut");
    }

    //Page Return

    //remove all event handler
    function Clearup() {
        EventLogout();
        App.Timer.ClearTime();
    }
})();