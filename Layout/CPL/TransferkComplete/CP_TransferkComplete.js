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
        ButtonDisable();
        setData();
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        ButtonEnable();

        // var PtrPaperStatus = top.API.Ptr.StPaperStatus();
        // if (!(top.API.Ptr.bDeviceStatus && (PtrPaperStatus == "FULL" || PtrPaperStatus == "LOW"))) {
        //     $("#Print").hide();
        // }
        top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["交易完成"]);
        top.API.Jnl.PrintSync("Content");
    }(); //Page Entry
    function ButtonDisable() {
        document.getElementById('ExitCard').disabled = true;
        document.getElementById('Continue').disabled = true;
        document.getElementById('Print').disabled = true;
        document.getElementById('PageRoot').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('ExitCard').disabled = false;
        document.getElementById('Continue').disabled = false;
        document.getElementById('Print').disabled = false;
        document.getElementById('PageRoot').disabled = false;
    }


    document.getElementById("ExitCard").onclick = function () {
        ButtonDisable();
        top.ErrorInfo = top.API.PromptList.No2;
        return CallResponse("Exit");
    };

    document.getElementById("Continue").onclick = function () {
        ButtonDisable();
        top.API.gLastTranstype = top.API.gTranType;
        // top.API.gNoPtrSerFlag = true;
        top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["************************************"]);
        top.API.Jnl.PrintSync("Content");
        return CallResponse("NeedInitData");
    };
    document.getElementById("Print").onclick = function () {
        ButtonDisable();
        // document.getElementById('Print').display = "none";
        top.API.Ptr.Print("ReceiptCash_Print_szABC", "",top.API.gPrintTimeOut);
        //top.API.Ptr.Print("Receipt_Trans_szABC", "", top.API.gPrintTimeOut);
        ButtonEnable();
    };
    document.getElementById('PageRoot').onclick = function(){
        ButtonDisable();
        top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["************************************"]);
        top.API.Jnl.PrintSync("Content");
        top.API.gLastTranstype = top.API.gTranType;
        return CallResponse("NeedInitData");
        //return CallResponse('BackHomepage');
    };

    function setData(){
        $("#Print").hide();
        if(top.API.Ptr.bDeviceStatus && top.API.gNoPtrSerFlag == false){
            $("#Print").show();
        }

        // 设置数据
        switch (top.API.CashInfo.Dealtype){
            case "PeriodicCurrentAccount":
                top.API.Dat.SetDataSync("CURRENCY", "STRING", ["人民币"]); // 币种
                break;
            case "CurrentToRegular":
                top.API.Dat.SetDataSync("CURRENCY", "STRING", ["人民币"]); // 币种
                top.API.Dat.SetDataSync("WITHDRAWING", "STRING", ["全部提取"]); // 支取方式
                break;
            case "InLineFlag":
                top.API.Dat.SetDataSync("DEALTYPE", "STRING", ["行内转账"]);
                top.API.Dat.SetDataSync('POUNDAGE','STRING',["0.00"]);//手续费
                var comment;
                if (top.API.postScript != '') {
                    comment = top.API.CommentSelect + ' ' + top.API.postScript;
                } else {
                    comment = top.API.CommentSelect;
                }
                top.API.Dat.SetDataSync('COMMENTS','STRING',[comment]);//附言

                break;
            case "OutLineFlag":
                top.API.Dat.SetDataSync("DEALTYPE", "STRING", ["行外转账"]);
                top.API.Dat.SetDataSync('POUNDAGE','STRING',[top.API.TransferPoundage]);//手续费
                var comment;
                if (top.API.postScript != '') {
                    comment = top.API.CommentSelect + ' ' + top.API.postScript;
                } else {
                    comment = top.API.CommentSelect;
                }
                top.API.Dat.SetDataSync('COMMENTS','STRING',[comment]);//附言
                break;
            case "TransferCancellation":
                top.API.Dat.SetDataSync("DEALTYPE", "STRING", ["转账撤销"]);
                break;
            default:
                break;
        }

        // 打印流水
        switch (top.API.CashInfo.Dealtype){
            case "PeriodicCurrentAccount":
                top.API.Jnl.PrintSync("RTCComplete");
                break;
            case "CurrentToRegular":
                top.API.Jnl.PrintSync("CTRComplete");
                break;
            case "InLineFlag":
            case "OutLineFlag":
                top.API.Jnl.PrintSync("TransferComplete");
                break;
            case "TransferCancellation":
                top.API.Jnl.PrintSync("selectRevocation");
                break;
            default:
                break;
        }
    }

    //Page Return
    function onPrintComplete() {
        top.API.displayMessage("onPrintComplete");
        top.API.Dat.SetDataSync(top.API.ContentDataTag, top.API.ContentDataType, ["************************************"]);
        top.API.Jnl.PrintSync("Content");
        top.API.gLastTranstype = top.API.gTranType;
        return CallResponse("NeedInitData");
    }

    //event handler
    function onEjectTimeout() {
        top.API.displayMessage("onEjectTimeout");
        return CallResponse("Exit");
    }

    //event handler
    function onDeviceError() {
        top.API.displayMessage("onDeviceError触发");
        return CallResponse("Exit");
    }

    function onPrintFailed() {
        top.API.displayMessage("onPrintFailed触发");
        Files.errmsgTag("凭条打印失败！");
        top.API.gLastTranstype = top.API.gTranType;
        return CallResponse("NeedInitData");
    }

    //event handler
    function onPrintTaken() {
        top.API.displayMessage("onPrintTaken");
        top.API.gLastTranstype = top.API.gTranType;
        return CallResponse("NeedInitData");
    }

    function EventLogin() {
        top.API.Ptr.addEvent("PrintComplete", onPrintComplete);
        top.API.Ptr.addEvent("PrintFailed", onPrintFailed);
        top.API.Ptr.addEvent("DeviceError", onDeviceError);
        top.API.Ptr.addEvent("PrintTaken", onPrintTaken);
    }

    function EventLogout() {
        top.API.Ptr.removeEvent("PrintComplete", onPrintComplete);
        top.API.Ptr.removeEvent("PrintFailed", onPrintFailed);
        top.API.Ptr.removeEvent("DeviceError", onDeviceError);
        top.API.Ptr.removeEvent("PrintTaken", onPrintTaken);
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
})
();