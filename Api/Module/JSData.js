(function () {
    window.data = function () {
        this.PromptList = {
            No1: "交易成功！",
            No2: "交易取消！",
            No3: "操作超时，交易结束！",
            No4: "设备故障，交易失败！",
            No5: "通讯失败，交易结束！",
            No6: "交易结束！",
            No7: "该卡不支持！",
            No8: "钞票被保留，交易结束！",
            No9: "该存折不支持！",
            No10: "获取卡片信息失败！"
        }
        this.jnlnumTag = "JNLNUM"
        this.jnlnumType = "LONG"

        this.cwcflagTag = "CWCFLAG"
        this.cwcflagType = "LONG"

        this.terminalnumTag = "TERMINALNUM"
        this.terminalnumType = "STRING"

        this.hostipTag = "HOSTIP"
        this.hostipType = "STRING"

        this.hostportTag = "HOSTPORT"
        this.hostportType = "STRING"

        this.monitorserveripTag = "MONITORSERVERIP"
        this.monitorserveripType = "STRING"

        this.monitorserverportTag = "MONITORSERVERPORT"
        this.monitorserverportType = "STRING"

        this.monitorservermodeTag = "MONITORSERVERMODE"
        this.monitorservermodeType = "STRING"

        this.subbanknumTag = "SUBBANKNUM"
        this.subbanknumType = "STRING"

        this.bankcodeTag = "BANKCODE"
        this.bankcodeType = "STRING"

        this.telleridTag = "TELLERID"
        this.telleridType = "STRING"

        this.cwcjnlnumTag = "CWCJNLNUM"
        this.cwcjnlnumType = "LONG"

        this.cwcreasonTag = "CWCREASON"
        this.cwcreasonType = "LONG"

        this.cardnoTag = "CARDNO"
        this.cardnoType = "STRING"

        this.transamountTag = "TRANSAMOUNT"
        this.transamountType = "STRING"

        this.currentbalanceTag = "CURRENTBALANCE"
        this.currentbalanceType = "STRING"

        this.availablebalanceTag = "AVAILABLEBALANCE"
        this.availablebalanceType = "STRING"

        this.idnoTag = "IDNO"
        this.idnoType = "STRING"

        this.cashtakenflagTag = "CASHTAKENFLAG"
        this.cashtakenflagType = "LONG"

        this.cashintotalTag = "CASHINTOTAL"
        this.cashintotalType = "STRING"

        this.billrejectflagTag = "BILLREJECTFLAG"
        this.billrejectflagType = "STRING"

        this.dealtypeTag = "DEALTYPE"
        this.dealtypeType = "STRING"

        this.masterkeyaTag = "MASTERKEYA"
        this.masterkeyaType = "STRING"

        this.masterkeybTag = "MASTERKEYB"
        this.masterkeybType = "STRING"

        this.masterkeycTag = "MASTERKEYC"
        this.masterkeycType = "STRING"

        this.cardtypeTag = "CARDTYPE"
        this.cardtypeType = "STRING"

        this.iccarddataTag = "ICCARDDATA"
        this.iccarddataType = "STRING"

        this.mixresultTag = "MIXRESULT"
        this.mixresultType = "LONG"

        this.servicestateTag = "SERVICESTATE"
        this.servicestateType = "LONG"

        this.cashinboxresultTag = "CASHINBOXRESULT"
        this.cashinboxresultType = "LONG"

        this.inrboxflagTag = "INRBOXFLAG"
        this.inrboxflagType = "LONG"

        this.customernameTag = "CUSTOMERNAME"
        this.customernameType = "STRING"

        this.addnoteflagTag = "ADDNOTEFLAG"
        this.addnoteflagType = "LONG"

        this.transactiontypeTag = "TRANSACTIONTYPE"
        this.transactiontypeType = "STRING"

        this.responsecodeTag = "RESPONSECODE"
        this.responsecodeType = "STRING"

        this.errmsgTag = "ERRMSG"
        this.errmsgType = "STRING"

        this.pinkeyTag = "PINKEY"
        this.pinkeyType = "STRING"

        this.mackeyTag = "MACKEY"
        this.mackeyType = "STRING"

        this.poundageTag = "POUNDAGE"
        this.poundageType = "STRING"

        this.inputpasswordtimesTag = "INPUTPASSWORDTIMES"
        this.inputpasswordtimesType = "LONG"

        this.DEPQuotaTag = "DEPQUOTA"
        this.DEPQuotaType = "LONG"

        this.NoCardDEPQuotaTag = "NOCARDDEPQUOTA"
        this.NoCardDEPQuotaType = "LONG"

        this.CWDQuotaTag = "CWDQUOTA"
        this.CWDQuotaType = "LONG"

        this.BankbookCWDQuotaTag = "BANKBOOKCWDQUOTA"
        this.BankbookCWDQuotaType = "LONG"

        this.BalanceInquiryTag = "BALANCEINQUIRYTYPE" //add by grb 余额查询种别
        this.BalanceInquiryType = "STRING"

        this.AccountNameTag = "ACCOUNTNAME"// //add by grb 继续交易户名
        this.AccountNameType = "STRING"
        this.CWDDealTypeTag = "CWDDEALTYPE"// //add by grb 取款种别（卡或折）
        this.CWDDealTypeType = "STRING"

        this.TransKindTag = "TRANSKIND"   //打印流水的交易名
        this.TransKindType = "STRING"

        this.ContentDataTag = "CONTENTDATA"   //打印流水附加数据
        this.ContentDataType = "STRING"

        this.FallBackCardTag = "FALLBACKCARD"   //是否降级卡标志
        this.FallBackCardType = "LONG"

        this.MFPIDATAKEYTag = "MFPIDATAKEY"    //录入指纹前设置
        this.MFPIDATAKEYType= "STRING"    

        this.MFPIIDLISTTag = "MFPIIDLIST"    //录入指纹前设置
        this.MFPIIDLISTType= "STRING"    

        this.FIRSTADMINTag = "FIRSTADMIN"   //第一次登录后屏
        this.FIRSTADMINType = "STRING"
    };
})();

