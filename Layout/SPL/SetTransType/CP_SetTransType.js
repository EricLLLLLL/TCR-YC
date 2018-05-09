/*@create by:  tsxiong
 *@time: 2016年03月20日
 */
;(function () {

    // var box = document.getElementsByName("TransRadio"),
    //     arr = null,
    //     BankCardCwdFlag,//银行卡取款
    //     PassbookCwdFlag,//存折取款
    //     BankCardDepFlag,//银行卡存款
    //     NoCardDepFlag,//无卡无折存款
    //     ZeroExchangeFlag,//零钞兑换
    //     CancelAccountFlag,//卡折销户
    //     BlockTradeFlag,//大额交易
    //     CompanyDepFlag,//对公存款
    //     OrderCWDFlag,//对公存款

    //     TransferRemittanceFlag,//转账汇款
    //     TransferCancellationFlag,//转账撤销
    //     PCAFlag,//定期转活期
    //     CTRFlag,//活期转定期
    //     SaveBackFlag;//卡钞回存

    var $setBtnWrap = $(".set-btn-wrap"),
        TransactionArr = ["Transaction4","Transaction5","Transaction6","Transaction9","Transaction10","Transaction11","Transaction12","TransactionConfig","Transaction13","Transaction14","Transaction15","Transaction16","Transaction17","Transaction18","Transaction19"], // 配置中需要按钮控制的项
        Transaction = "Transaction4", // 配置读取第一个参数
        TransactionUrl = "C:\\TCR\\Middle\\ini\\MTransaction.ini"; // 配置文件路径

	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        ButtonDisable();
        bulidList();
        btnClick();
        ButtonEnable();
    }();//Page Entry
    function ButtonDisable() {
        document.getElementById('Back').disabled = true;
        document.getElementById('OK').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Back').disabled = false;
        document.getElementById('OK').disabled = false;
    }

    function bulidList(){

        var $ul = $("<ul></ul>"),
            $li,
            btnFlag = 0, // 0不支持 1支持
            btnName = ""; // 交易名称

        $.each( TransactionArr,function(i,data){
            Transaction = data;

            if( Transaction == "TransactionConfig" ){
                btnName = "对公存款";
                btnFlag = top.API.Dat.GetPrivateProfileSync(Transaction, "bOrderCWD", "0", top.API.gIniFileName);
            }else{
                btnName = top.API.Dat.GetPrivateProfileSync(Transaction, "TransName", "0", TransactionUrl);
                btnFlag = top.API.Dat.GetPrivateProfileSync(Transaction, "TransactionSupport", "0", TransactionUrl);
            }
            //console.log("获取配置中btnName:"+btnName+";btnFlag:"+btnFlag);

            $li = $(['<li>',
                    '<span>' + btnName + '：</span>',
                    '<input class="TranstypeRadio" type="button" flag="' + btnFlag + '"/>',
                    '</li>'
                    ].join(""));
            $ul.append($li);
        });
        $setBtnWrap.append($ul);

        //获取服务标志
        // BankCardCwdFlag = top.API.Dat.GetPrivateProfileSync("Transaction4", "TransactionSupport", "0", "C:\\TCR\\Middle\\ini\\MTransaction.ini");
        // PassbookCwdFlag = top.API.Dat.GetPrivateProfileSync("Transaction5", "TransactionSupport", "0", "C:\\TCR\\Middle\\ini\\MTransaction.ini");
        // BankCardDepFlag = top.API.Dat.GetPrivateProfileSync("Transaction6", "TransactionSupport", "0", "C:\\TCR\\Middle\\ini\\MTransaction.ini");
        // NoCardDepFlag = top.API.Dat.GetPrivateProfileSync("Transaction9", "TransactionSupport", "0", "C:\\TCR\\Middle\\ini\\MTransaction.ini");
        // ZeroExchangeFlag = top.API.Dat.GetPrivateProfileSync("Transaction10", "TransactionSupport", "0", "C:\\TCR\\Middle\\ini\\MTransaction.ini");
        // BlockTradeFlag = top.API.Dat.GetPrivateProfileSync("Transaction11", "TransactionSupport", "0", "C:\\TCR\\Middle\\ini\\MTransaction.ini");
        // CompanyDepFlag = top.API.Dat.GetPrivateProfileSync("Transaction12", "TransactionSupport", "0", "C:\\TCR\\Middle\\ini\\MTransaction.ini");
        // OrderCWDFlag = top.API.Dat.GetPrivateProfileSync("TransactionConfig", "bOrderCWD", "0", top.API.gIniFileName);
        // CancelAccountFlag = top.API.Dat.GetPrivateProfileSync("Transaction13", "TransactionSupport", "0", "C:\\TCR\\Middle\\ini\\MTransaction.ini");

        // TransferRemittanceFlag = top.API.Dat.GetPrivateProfileSync("Transaction14", "TransactionSupport", "0", "C:\\TCR\\Middle\\ini\\MTransaction.ini");
        // TransferCancellationFlag = top.API.Dat.GetPrivateProfileSync("Transaction15", "TransactionSupport", "0", "C:\\TCR\\Middle\\ini\\MTransaction.ini");
        // PCAFlag = top.API.Dat.GetPrivateProfileSync("Transaction16", "TransactionSupport", "0", "C:\\TCR\\Middle\\ini\\MTransaction.ini");
        // CTRFlag = top.API.Dat.GetPrivateProfileSync("Transaction17", "TransactionSupport", "0", "C:\\TCR\\Middle\\ini\\MTransaction.ini");
        // SaveBackFlag = top.API.Dat.GetPrivateProfileSync("Transaction18", "TransactionSupport", "0", "C:\\TCR\\Middle\\ini\\MTransaction.ini");
        // SaveBackFlag = top.API.Dat.GetPrivateProfileSync("TransactionConfig", "CWCSupport", "0", "C:\\TCR\\jsapp\\ini\\TCR_CUSTOMIZE.INI");

        // arr = [
        //     {"flag": BankCardCwdFlag},
        //     {"flag": PassbookCwdFlag},
        //     {"flag": BankCardDepFlag},
        //     {"flag": NoCardDepFlag},
        //     {"flag": ZeroExchangeFlag},
        //     {"flag": BlockTradeFlag},
        //     {"flag": CompanyDepFlag},
        //     {"flag": OrderCWDFlag},
        //     {"flag": CancelAccountFlag},
        //     {"flag": TransferRemittanceFlag},
        //     {"flag": TransferCancellationFlag},
        //     {"flag": PCAFlag},
        //     {"flag": CTRFlag},
        //     {"flag": SaveBackFlag}
        // ];
        // for (i = 0; i < box.length; i++) {
        //     if (arr[i].flag == "1") {
        //         box[i].setAttribute("style", "background-image: url('Framework/style/Graphics/btn/btn_on.png')");
        //         box[i].setAttribute("flag", "1");
        //     } else if (arr[i].flag == "0") {
        //         box[i].setAttribute("style", "background-image: url('Framework/style/Graphics/btn/btn_off.png')");
        //         box[i].setAttribute("flag", "0");
        //     }
        // }
        // radioClick(box);
    }

    function btnClick(){

        var btnClickFlag = "0"; // 按钮当前状态
        $setBtnWrap.on("click",".TranstypeRadio",function(){

            btnClickFlag = $(this).attr("flag") == 0 ? 1 : 0; // 0变成1,1变成0
            $(this).attr("flag", btnClickFlag );

        });
    }

    function setData(){

        var dataFlag = ""; // 按钮元素的flag属性值，设置时需重新设置进配置文件中

        $.each( TransactionArr,function(i,data){
            dataFlag = $(".TranstypeRadio").eq(i).attr("flag");
            if( data == "TransactionConfig" ){
                top.API.Dat.WritePrivateProfileSync(data, "bOrderCWD", dataFlag, top.API.gIniFileName);
            }else{
                top.API.Dat.WritePrivateProfileSync(data, "TransactionSupport", dataFlag, TransactionUrl);
            }
            //console.log("设置配置data:"+data+";dataFlag:"+dataFlag);
        });

    }

    // function radioClick() {
    //     var i = box.length;
    //     var j = 0;
    //     for (j = 0; j < i; j++) {
    //         (function () {
    //             var p = j;
    //             box[p].onclick = function () {
    //                 change(p);
    //             }
    //         })();
    //     }

    //     function change(j) {

    //         top.API.displayMessage("点击id=" + box[j].getAttribute("id"));
    //         top.API.displayMessage("点击前CancelAccountFlag=" + box[j].getAttribute("flag"));
    //         if (box[j].getAttribute("flag") == 0) {
    //             box[j].setAttribute("style", "background-image: url('Framework/style/Graphics/btn/btn_on.png')");
    //             box[j].setAttribute("flag", "1");
    //             arr[j].flag = "1";
    //         } else if (box[j].getAttribute("flag") == 1) {
    //             box[j].setAttribute("style", "background-image: url('Framework/style/Graphics/btn/btn_off.png')");
    //             box[j].setAttribute("flag", "0");
    //             arr[j].flag = "0";
    //         }
    //         top.API.displayMessage("点击后CancelAccountFlag=" + box[j].getAttribute("flag"));
    //     }
    // }

    //@User ocde scope start
    document.getElementById('Back').onclick = function () {
        ButtonDisable();
        return CallResponse('Back');
    }

    document.getElementById('OK').onclick = function () {
        ButtonDisable();

        setData();
        // top.API.Dat.WritePrivateProfileSync("Transaction4", "TransactionSupport", arr[0].flag, "C:\\TCR\\Middle\\ini\\MTransaction.ini");
        // top.API.Dat.WritePrivateProfileSync("Transaction5", "TransactionSupport", arr[1].flag, "C:\\TCR\\Middle\\ini\\MTransaction.ini");
        // top.API.Dat.WritePrivateProfileSync("Transaction6", "TransactionSupport", arr[2].flag, "C:\\TCR\\Middle\\ini\\MTransaction.ini");
        // top.API.Dat.WritePrivateProfileSync("Transaction9", "TransactionSupport", arr[3].flag, "C:\\TCR\\Middle\\ini\\MTransaction.ini");
        // top.API.Dat.WritePrivateProfileSync("Transaction10", "TransactionSupport", arr[4].flag, "C:\\TCR\\Middle\\ini\\MTransaction.ini");
        // top.API.Dat.WritePrivateProfileSync("Transaction13", "TransactionSupport", arr[8].flag, "C:\\TCR\\Middle\\ini\\MTransaction.ini");
        // top.API.Dat.WritePrivateProfileSync("Transaction11", "TransactionSupport", arr[5].flag, "C:\\TCR\\Middle\\ini\\MTransaction.ini");
        // top.API.Dat.WritePrivateProfileSync("Transaction12", "TransactionSupport", arr[6].flag, "C:\\TCR\\Middle\\ini\\MTransaction.ini");
        // top.API.Dat.WritePrivateProfileSync("TransactionConfig", "bOrderCWD", arr[7].flag, top.API.gIniFileName);
        // top.API.Dat.WritePrivateProfileSync("Transaction14", "TransactionSupport", arr[9].flag, "C:\\TCR\\Middle\\ini\\MTransaction.ini");
        // top.API.Dat.WritePrivateProfileSync("Transaction15", "TransactionSupport", arr[10].flag, "C:\\TCR\\Middle\\ini\\MTransaction.ini");
        // top.API.Dat.WritePrivateProfileSync("Transaction16", "TransactionSupport", arr[11].flag, "C:\\TCR\\Middle\\ini\\MTransaction.ini");
        // top.API.Dat.WritePrivateProfileSync("Transaction17", "TransactionSupport", arr[12].flag, "C:\\TCR\\Middle\\ini\\MTransaction.ini");
        // top.API.Dat.WritePrivateProfileSync("Transaction18", "TransactionSupport", arr[13].flag, "C:\\TCR\\Middle\\ini\\MTransaction.ini");
        // top.API.Dat.WritePrivateProfileSync("TransactionConfig", "CWCSupport", arr[13].flag, "C:\\TCR\\jsapp\\ini\\TCR_CUSTOMIZE.INI");
        return CallResponse('OK');
    }



})();
