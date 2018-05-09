/*@create by:  Gni
*@time: 2017年11月21日
*/
; (function () {
    var $areaInfo  = $(".area-info"),
        $areaWrap  = $(".area-wrap"),
        $provinceBtn = $(".province").find("button"),
        $areaBtn  = $(".area").find("button"),
        $bankBtn   = $(".bank").find("button"),
        $branchBtn = $(".branch").find("button"),
        $BackBtn  = $("#Back"),
        $ExitBtn  = $("#Exit"),
        $OKBtn    = $("#OK"),
        $TipDiv   = $("#TipDiv"),
        $TipError = $("#TipError"),
        $clickBtn, // 被点击的btn元素
        areaFlag = "bank", // 点击输入框标识  bank || branch || province || area
        provinceCode = "", // 联动关联码:省
        areaCode     = "", // 联动关联码:市/区
        BankCode     = "", // 联动关联码:银行
        BranchCode   = "", // 联动关联码:支行
        BankName     = "", // 所选银行名
        jsonUrl = "", // 本地省市ajax访问路径
        strMsg  = "", // 错误提示信息
        TipDivMsg = "", // 标题

        VtsAddr = 'http://10.191.3.241:8052/VTSWS29/Service.svc/',// 联行号Vts接口地址
        MachNO  = "",//设备号
        TradeTypeId = "",//交易类型0078
        TerminalNo = "",//设备编号
        TellerNo = "",//柜员号
        RequestId = "",//业务批次号
        PointNo = "";//机构号

  var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });

    // 初始化
    var Initialize = function () {
        ButtonDisable();
        App.Timer.TimeoutDisposal(TimeoutCallBack);

        // 获取联行号上送数据
        GetVTSParams();
        $areaBtn.prop("disabled",true);
        $bankBtn.prop("disabled",true);
        $branchBtn.prop("disabled",true);
        clickFn();

        ButtonEnable();
    }();

    function ButtonDisable() {
        document.getElementById('Exit').disabled = true;
        document.getElementById('OK').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Exit').disabled = false;
        document.getElementById('OK').disabled = false;
    }

    // get data
    function getData(url, TipDivMsg){

        // get data info
        $.ajax({
            url: url,
            type: "get",
            cache: false,
            dataType: "json",
            success: function(json){
                buildList(json);
                $areaInfo.hide();
                $areaWrap.show();
                $BackBtn.hide();
                $TipDiv.html(TipDivMsg);
            },
            error: function(e){
                // top.ErrorInfo = "信息查询失败，交易结束";
                // return CallResponse('Back');
                strMsg = '获取支行信息失败，请重试！';
                $TipError.show().html(strMsg);
            }  
        });

    }

    function GetVTSParams() {
        var strRet = '';
        var xmldom = new ActiveXObject("Microsoft.XMLDOM");
        xmldom.load('./ini/TCR_Params.xml');
        if (xmldom.parseError != 0){
            throw new Error("XML parsing error: " + xmldom.parseError.reason);
        }
        var Params = xmldom.getElementsByTagName("VTS");
        VtsAddr = Params[0].getAttribute("VtsAddr");
        MachNO = Params[0].getAttribute("MachNO");
        TradeTypeId = Params[0].getAttribute("TradeTypeId");
        TerminalNo = Params[0].getAttribute("TerminalNo");
        TellerNo = Params[0].getAttribute("TellerNo");
        PointNo = Params[0].getAttribute("PointNo");
    }
    function GetHeadMsg() {
        var strRet = '';        
        strHeadParams = GetHeadParams();
        strRet = '{"RequestId":"' + RequestId + '"'+strHeadParams+'}';
        return strRet;
    }
    function GetHeadParams() {
        var strRet = "";
        var tmpPointNo = PointNo;
        strRet = ',"MachNO":"'+MachNO+'","PointNo":"'+tmpPointNo+'","TradeTypeId":"'+TradeTypeId+'","TellerNo":"'+TellerNo+'","TerminalNo":"'+TerminalNo+'"';
        return strRet;
    }
    function GetAndSetBusiNo(keyname) {
        var tmpBusinessNo = top.API.Dat.GetPrivateProfileSync("AssConfig", keyname, "", top.API.gIniFileName);//"41000";
        var strRet='';
        var sDate = top.GetDate12byte().substring(0, 8);
        var tmpPointNo = PointNo;

        if (sDate != tmpBusinessNo.substring(0, 8)) {
            strRet = sDate + TerminalNo + "0001";
            var nRet = top.API.Dat.WritePrivateProfileSync("AssConfig", keyname, strRet, top.API.gIniFileName);//"41000";
        }else{
            var tmpStr = "0000";
            var tmpNo = (parseInt(tmpBusinessNo.substring(16,20))+1).toString();
            if (tmpNo.length < 4 && tmpNo != "") {
                tmpNo = tmpStr.substr(0,(4-tmpNo.length)) + tmpNo;
            }
            var NewBusinessNo = sDate + TerminalNo + tmpNo;
            strRet = NewBusinessNo;
            var nRet = top.API.Dat.WritePrivateProfileSync("AssConfig", keyname, NewBusinessNo, top.API.gIniFileName);//"41000";
        }
        
        return strRet;
    }

    // click function
    function clickFn(){

        $BackBtn.on("click", function(){
            ButtonDisable();
            return CallResponse('Back');
        });

        $ExitBtn.on("click", function(){
            ButtonDisable();
            top.ErrorInfo = top.API.PromptList.No2;
            return CallResponse('Exit');
        });

        $OKBtn.on("click", function(){
            ButtonDisable();
            // 设置联行号
            top.API.displayMessage("联行号,BranchCode=" + BranchCode);
            top.API.Dat.SetDataSync("TRANSFERINNUM", "STRING", [BranchCode]);
            top.API.BankName = BankName;
            return CallResponse("OK");
        });

        // 银行/省/市区点击按钮事件
        $areaInfo.on("click", "button",function(){
            var Data;
            $clickBtn = $(this);
            areaFlag = $(this).attr("flag");
            $TipError.html("");
            $areaWrap.removeClass("branch-wrap");

            switch (areaFlag){
                case "province":
                    TipDivMsg = "请选择收款方账户所属地区";
                    jsonUrl = "Framework/jsonData/prov.json";

                    // 按钮置灰
                    $areaBtn.prop("disabled",true);
                    $bankBtn.prop("disabled",true);
                    $branchBtn.prop("disabled",true);

                    // 数据重置
                    $areaBtn.siblings("input").val("");
                    $bankBtn.siblings("input").val("");
                    $branchBtn.siblings("span").html("");
                    areaCode   = "";
                    BankCode   = "";
                    BranchCode = "";           

                    break;
                case "area":
                    TipDivMsg = "请选择收款方账户所属地区";
                    jsonUrl = "Framework/jsonData/json/area"+provinceCode+".json";
                    
                    // 按钮置灰
                    $bankBtn.prop("disabled",true);
                    $branchBtn.prop("disabled",true);

                    // 数据重置
                    $bankBtn.siblings("input").val("");
                    $branchBtn.siblings("span").html("");
                    BankCode   = "";
                    BranchCode = "";  

                    break;
                case "bank":
                    TipDivMsg = "请选择收款方账户所属银行";
                    jsonUrl = "Framework/jsonData/bank.json";

                    // 支行值重置
                    $branchBtn.prop("disabled",true);
                    $branchBtn.siblings("span").html("");
                    BranchCode = ""; 
                    $branchBtn.attr("code",BranchCode);
                    break;
            }

            if( areaFlag == "branch" ){

                // 获取支行信息
                RequestId = GetAndSetBusiNo("RequestId");
                HeadMsg = GetHeadMsg();
                strUrl = VtsAddr + "FindBankCodes";
                var BankAjaxData = top.FindBankCodes(HeadMsg, BankCode, areaCode, strUrl);

                // CallFunc(BankAjaxData);
                if( BankAjaxData == null || BankAjaxData.length == 0 ){
                    if(strMsg == ""){
                        strMsg = '获取支行信息失败，请重试！';
                    }
                    top.API.displayMessage("DealName=FindBankCodes,strMsg="+strMsg); 
                    $TipError.show().html(strMsg);
                }else{
                    // top.API.displayMessage("FindBankCodes成功:data="+JSON.stringify(BankAjaxData)); 
                    buildList(BankAjaxData);
                    $areaInfo.hide();
                    $areaWrap.show().addClass("branch-wrap");
                    $BackBtn.hide();
                    $TipDiv.html("请选择收款方账户所属支行");
                }

            }else{
                getData(jsonUrl, TipDivMsg);
            }

        });

        // 选择银行/省/市区/支行
        $areaWrap.on("click", "li", function(){

            $TipDiv.html("请选择跨行地区信息");

            switch (areaFlag){
                case "province":
                    provinceCode = $(this).attr("code");
                    $clickBtn.siblings("input").val( $(this).html() );
                    $areaBtn.prop("disabled",false);
                    break;
                case "area":
                    areaCode = $(this).attr("code");
                    $clickBtn.siblings("input").val( $(this).html() );
                    $bankBtn.prop("disabled",false);
                    break;
                case "bank":
                    BankCode = $(this).attr("code");
                    $branchBtn.prop("disabled",false);
                    $clickBtn.siblings("input").val( $(this).html() );
                    break;
                case "branch":
                    BranchCode = $(this).attr("code").split(" ")[0];
                    BankName   = $(this).html();
                    $clickBtn.siblings("span").html( $(this).html() );
                    $clickBtn.attr("code",BranchCode);
                    break;
            }

            $areaInfo.show();
            $areaWrap.hide();
            $BackBtn.show();

            if( BranchCode!="" && areaCode!="" ){
                $OKBtn.show();
            }

        });

    }

    // build list
    function buildList(Data){

        var $li,
            $ul = $("ul");
        $ul.empty();

        if (areaFlag == "bank") {

            // build bank list
            $.each( Data, function(i, n){
                $li = $("<li code="+n.bankcod+">"+n.banknam+"</li>");
                $ul.append($li);
            });

        }else if(areaFlag == "branch"){

            // build branch list
            $.each( Data, function(i, n){
                $li = $("<li code="+n.BankCode+">"+n.BankName+"</li>");
                $ul.append($li);
            });

        }else if(areaFlag == "province"){

            // build province list
            $.each( Data, function(i, n){
                $li = $("<li code="+n.provcod+">"+n.gargnnam+"</li>");
                $ul.append($li);
            });

        }else if(areaFlag == "area"){

            // build area list
            $.each( Data[0].area, function(i, n){
                $li = $("<li code="+n.gafeecod+">"+n.gargnnam+"</li>");
                $ul.append($li);
            });

        };
    }




    //Countdown function
    function TimeoutCallBack() {
        top.ErrorInfo = top.API.PromptList.No3;
        return CallResponse("TimeOut");
    }
    //Page Return
    
    //remove all event handler
    function Clearup() {
        //TO DO:
        App.Plugin.Voices.del();
        App.Timer.ClearTime();
    }
})();
