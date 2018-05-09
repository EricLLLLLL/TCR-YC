/*@create by: Gni
 *@time: 2017年12月13日
 */ 
;(function () {
    var CallResponse = App.Cntl.ProcessOnce(function (Response) {
        Clearup();
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        getData();
        //SaveTheCloseRecord();
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

    // 二维码数据
    function getData(){
        // var qrcodeUrl = "   星北伟     48000    https://wx.abcchina.com/sz/wxbank/accd/qmall/qrType/1003/deviceNo/13018963/serialNo/ATM171116000000001/timestamp/20171116090123/md5/HGXC526HUVX";
        var qrcodeUrl = top.API.Dat.GetDataSync("WXACCDELETERESULT", "STRING").toArray()[0]; // 后台返回的数据中含有转账销户信息
        var qrcodeArr = $.trim(qrcodeUrl).split("https:")[1].split("/");
        console.log("获取的数据：  "+JSON.stringify(qrcodeArr));  // ["https:","","wx.abcchina.com","sz","wxbank","accd","qmall","qrType","1003","deviceNo","13018963","serialNo","ATM171116000000001","timestamp","20171116090123","md5","HGXC526HUVX"]

        // 获取相应值
        var qrType = qrcodeArr[ $.inArray("qrType",qrcodeArr) + 1 ],
            deviceNo = qrcodeArr[ $.inArray("deviceNo",qrcodeArr) + 1 ],
            serialNo = qrcodeArr[ $.inArray("serialNo",qrcodeArr) + 1 ],
            timestamp = qrcodeArr[ $.inArray("timestamp",qrcodeArr) + 1 ],
            MD5 = qrcodeArr[ $.inArray("md5",qrcodeArr) + 1 ];
        // top.API.displayMessage("分割数据值：  "+"qrType:"+qrType+",deviceNo:"+deviceNo+",serialNo:"+serialNo+",timestamp:"+timestamp);

        // set data
        top.API.Dat.SetDataSync("qrType", "STRING", [qrType]);
        top.API.Dat.SetDataSync("deviceNo", "STRING", [deviceNo]);
        top.API.Dat.SetDataSync("serialNo", "STRING", [serialNo]);
        top.API.Dat.SetDataSync("timestamp", "STRING", [timestamp]);
        top.API.Dat.SetDataSync("MD5", "STRING", [MD5]);

        // 获取最新md5值是否成功
        var nRet = top.API.Dat.GetMD5Data(); // 0 成功
        top.API.displayMessage("获取MD5值成功与否标志:"+nRet);

        if( nRet == 0 ){

            qrcodeArr[ $.inArray("md5",qrcodeArr) + 1 ] = top.API.Dat.GetDataSync("MD5VALUE", "STRING").toArray()[0]; // 重置MD5值

            // console.log( $.inArray("md5",qrcodeArr) );
            // top.API.displayMessage("获取新的MD5值:"+ qrcodeArr[ $.inArray("md5",qrcodeArr) + 1 ] );
            // console.log(JSON.stringify(qrcodeArr));

            qrcodeUrl = "https:" + qrcodeArr.join("/");
            // console.log("生成的二维码地址："+qrcodeUrl);

            var qrcode = new QRCode(document.getElementById("qrcode"), {
                width : 260,
                height : 260
            });

            qrcode.makeCode( qrcodeUrl ); // 生成二维码

            var qrcodeImgUrl = document.getElementById("qrcode").childNodes[0].toDataURL("image/png");  // 获取二维码图片数据
            var imgData = qrcodeImgUrl.split("base64,")[1];
            top.API.Dat.SetDataSync("PICBASE64", "STRING", [imgData]); // 设置生成的二维码图片src数据至内存，供凭条使用
            top.API.Dat.GetQRCodePic(); // 中间件接口，在文件中生成二维码图片
            top.API.Dat.SetDataSync("COMMENTS", "STRING", ["C:\\TCR\\jsapp\\Framework\\QRCode.bmp"]);

        }else{
            $(".qrcode-wrap").hide();
            $(".errTip").html("二维码获取失败，请联系银行工作人员！");
            top.API.Dat.SetDataSync("PICBASE64", "STRING", [""]); // 设置生成的二维码图片src数据至内存，供凭条使用
            top.API.Dat.SetDataSync("COMMENTS", "STRING", [""]);
        }
        // 打印凭条
        top.API.Dat.SetDataSync("DEALTYPE", "STRING", ["微信销户"]);
        setTimeout(function(){
            top.API.Ptr.Print("Receipt_SalesForWX_szABC", "", top.API.gPrintTimeOut);
        },5000); // 生成图片文件需要延时
        
    }
    function SaveTheCloseRecord(){
        // 将销户记录保存到本地
        var sAccoutNo = top.API.Dat.GetDataSync("CARDNO", "STRING").toArray()[0]; // 卡号
        var sTransNo = "无"; // 转入账户
        var sTransAmount = "无"; // 金额
        var sRetCode = top.API.gResponsecode; // 后台返回值
        
        top.API.displayMessage("保存销户信息到本地文件");
        top.API.Tsl.HandleRecordFileSync(top.API.MTSL_WRITECLOSEDCORD, sAccoutNo + ", " + sTransNo + ", " + sTransAmount + ", " + sRetCode + ", " + ["微信销户"]);
    }


    //Countdown function
    function TimeoutCallBack() {
        top.ErrorInfo = top.API.PromptList.No3;
        return CallResponse("TimeOut");
    }

    //Page Return

    //remove all event handler
    function Clearup() {
        App.Timer.ClearTime();
    }

})();