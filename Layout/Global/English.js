(function () {
    window.global = function () {
        this.gTransactiontype = "";
        this.gCardno = ""; //卡号
        this.gPoundage = "";
        this.gResponsecode = "";
        this.gMasterkeyA = "";
        this.gMasterkeyB = "";
        this.gMasterkeyC = "";
        this.gIdCardpic = ""; //身份证全路径
        this.gCheckIdCardpic = "";
        this.gIdName = ""; //身份证名字
        this.gCustomerName = ""; //银行卡名字
        this.gIdNation = "";
        this.gIdSex = "";
        this.gIdNumber = ""; //身份证号码
        this.gChooseMoney = 0;
        this.gOldPinBlock = "";
        this.gNewPinBlock = "";
        this.gbAmountType = 0; //0:默认值   1:小额   2:大额
        this.gDispenseCounts = 0;
        this.gAcceptCounts = 0;
        this.gPrintFSN = false;
        this.gSubBankNum = "";
        this.gDevStatus = "";
        this.AdminStatus = 0; //0为主管理员 00
        this.gTslChooseType = ""; //交易类型 对公存款：BUSINESSDEP； 存折取款：BOOKCWD； 大额存款：CWD； 小额存款：DEP； 大额存款：NOCARDDEP
        this.gTslJnlNum = ""; //流水号
        this.gTslMoneyCount = ""; //金额
        this.gTslResult = "FAIL"; //交易结果 默认为失败。
        this.gTslDate = "";
        this.gTslTime = "";
        this.gTslFlag = false;
        this.gTslChooseJnlType = ""; //电子流水交易类型，0107代表存款，0108代表取款
        this.gTslSysrefnum = ""; //后台返回流水号
        this.gTslJnlBtn = ""; //设备流水批次号
        this.gTslFailType = ""; //异常状态类型（4位）
        this.gTslResponsecode = "";
        this.gstrIdCardInfo = ""; //身份信息返回字符串信息
        this.gIniFileName = "c:\\TCR\\jsapp\\ini\\TCR_CUSTOMIZE.INI"; //JS配置文件路径
        this.CreateBusiListHead = "";
        this.CreateBusiListUrl = "";
        this.CreateBusiListParam = "";
        this.CreateTaskHead = "";
        this.CreateTaskUrl = "";
        this.CreateTaskParam = "";
        this.RemoteID = "";
        this.gAmountQuota = 0;

        //add by hj
        this.gReadIdCardFlag = 0; //进入读身份证页面标志位 0：读交易第一次身份证；1：读持卡人本人身份证；2：读代理人身份证
        this.gCheckInfoFlag = false; //需要身份验证标志
        this.gAuthorRefuse = ""; //授权拒绝原因

        this.gLTotalItems = ""; //上一次验钞存入钞箱信息
        this.gLcount = "1"; //上一次验钞次数
        this.gCheckResult = ""; //联网核查结果
        this.gOldTellerRadioId = "TypeNo1"; //审核不通过或退出时保存的原柜员号,默认第一个。
        this.gIniFileName = "/TCR/jsapp/ini/TCR_CUSTOMIZE.INI"; //测试配置路劲

        this.gOldCimRefusedNums = 0; //add by art for 流水添加拒钞RJ张数: 本次验钞以前的所有拒钞数（不含本次)
        this.gbContinueTransFlag = false; //继续交易标识
        this.gbPartCashIn = false; //验钞部分入钞，卡钞

        this.gNoPtrSerFlag = false; //无凭条服务标志位

        this.gbPartCashInEnd = false;
        this.gbStartServiceOrNot = true; //add by tsx  判断管理员是否允许对外
        this.gTerminalID = ""; //终端号，该参数无需初始化，在opendevice、Trouble页面获取。

        this.gPHOTOIMAGURL = ""; //add by tsx  拍照图片路径。
        this.gTransStatus = "";
        this.gCardOrBookBank = 2; //add by tsx 应用根据位数判断存折还是卡号。卡号走大额存款，存折走ATM存款 银行卡：1  存折：2；
        this.gReINQ = false; //add by tsx 判断INQ流程
        this.gMixSelfCWD = false; //add by tsx 自配取款标志位
        this.gIdNumberForRisk = ""//add by tsx 查询风险等级用身份证
        this.gATMORTCR = ""//add by tsx 判断是否为贷记卡
        this.gShowPrintButton = true; //add by tsx 判断是否需要显示打印凭条按钮
        //add by grb for 交易区分 begin
        this.MTRN_NO = 0
        this.MTRN_NG = 0
        this.MTRN_OFF = 0
        this.MTRN_OK = 1
        this.MTRN_YES = 1
        this.MTRN_NEED = 1
        this.MTRN_ON = 1
        this.MTRN_CHANGED = 2

        //Mark of card type
        this.MTRN_PB = 260
        this.MTRN_NOCARD = 261
        this.MTRN_CARD = 262
        this.MTRN_ICCARD = 263
        this.MTRN_ICNG = 264
        this.MTRN_CASHINNG = 265
        this.MTRN_CASHOUTNG = 266
        this.MTRN_ABFUL = 267
        this.MTRN_IGNORE = 268

        //Transaction differ start
        this.MTRN_INQUIRYBALANCE = 100
        this.MTRN_TRANSFERACNTINQ = 101
        this.MTRN_PASSWORDCHANGE = 102
        this.MTRN_WITHDRAW_CARD = 103
        this.MTRN_WITHDRAW_PB = 104
        this.MTRN_DEPOSIT_CARD = 105
        this.MTRN_DEPOSIT_PB = 106
        this.MTRN_NOCARDDEPOSITACNTINQ = 107
        this.MTRN_NOCARDDEPOSIT = 108
        //Transaction differ end

        this.MTRN_TRNDIFFERNAME = 10
        this.MTRN_CANCELTRNNAME = 11
        this.MTRN_TRNDIFFERABBREVIATION = 12
        this.MTRN_CANCELTRNABBREVIATION = 13
        this.MTRN_ICTRNTYPE = 14
        this.MTRN_ECSERVICE = 15
        this.MTRN_TRNMSG = 16
        this.MTRN_CANCELMSG = 17
        this.MTRN_JNLFWDFMT = 18
        this.MTRN_CANCELJNLFWDFMT = 19
        this.MTRN_STATISTICALTYPE = 20
        this.MTRN_CANCELSTATISTICALTYPE = 21
        this.MTRN_TRNDIFFERNAMES = 23
        this.MTRN_CANCELTRNNAMES = 24
        this.MTRN_TRNDIFFERABBREVIATIONS = 25
        this.MTRN_CANCELTRNABBREVIATIONS = 26
        this.MTRN_TRNNAMES = 27
        this.MTRN_TRNSPOSSIBILITY = 28
        this.MTRN_POSSIBLETRNNAMES = 29
        this.MTRN_POSSIBLETRN = 30
        this.MTRN_POSSIBLETRNBK = 31
        this.MTRN_TRANSACTIONDIFFER = 32
        this.MTRN_TRANLIMITAMOUNTREAL = 33
        this.MTRN_TRANLIMITAMOUNTRULE = 35
        this.MTRN_AUTHORIZEDAMOUNTRULE = 36
        this.MTRN_REMAINDEPSITAMOUT = 37
        //add by grb for 交易区分 end

        //写交易记录
        this.MTSL_WRITETRANSRECORD = 0   //写交易记录0---y
        this.MTSL_WRITERETAINCARDRECORD = 1   //写吞卡记录1---y
        this.MTSL_WRITECHECKTRANSRECORD = 2   //写对账记录2
        this.MTSL_READTRANSRECORD = 3   //读交易记录3
        //this.MTSL_READRETAINCARDRECORD = 4   //读吞卡记录4---调2次
        this.MTSL_RENAMERECORD = 4   //重命名交易和吞卡记录5--y

        this.clearGlobalData = function () {
            this.gTransactiontype = "";
            this.gCardno = "";
            this.gPoundage = "";
            this.gResponsecode = "";
            this.gMasterkeyA = "";
            this.gMasterkeyB = "";
            this.gMasterkeyC = "";
            this.gIdCardpic = "";
            this.gCheckIdCardpic = "";
            this.gIdName = "";
            this.gIdNation = "";
            this.gIdSex = "";
            this.gIdNumber = "";
            this.gChooseMoney = 0;
            this.gOldPinBlock = "";
            this.gNewPinBlock = "";
            this.gbAmountType = 0;
            this.gDispenseCounts = 0;
            this.gPrintFSN = false;
            this.gAcceptCounts = 0;
            this.gMACKEY = false;
            this.gSubBankNum = "";
            this.gDevStatus = "";
            this.gTslChooseType = ""; //交易类型
            this.gTslJnlNum = ""; //流水号
            this.gTslMoneyCount = ""; //金额
            this.gTslResult = "FAIL"; //交易结果
            this.gTslDate = "";
            this.gTslTime = "";
            this.gTslFlag = false;
            this.gTslChooseJnlType = ""; //电子流水交易类型，0107代表存款，0108代表取款
            this.gTslSysrefnum = ""; //后台返回流水号
            this.gTslJnlBtn = ""; //设备流水批次号
            this.gTslFailType = ""; //异常状态类型（4位）
            this.gTslResponsecode = "";
            this.gCustomerName = "";
            this.gstrIdCardInfo = "";
            this.CreateBusiListHead = "";
            this.CreateBusiListUrl = "";
            this.CreateBusiListParam = "";
            this.CreateTaskHead = "";
            this.CreateTaskUrl = "";
            this.CreateTaskParam = "";
            this.RemoteID = "";
            this.gAmountQuota = 0;

            this.gCheckInfoFlag = false;
            this.gAuthorRefuse = false;

            this.gLTotalItems = ""; //上一次验钞存入钞箱信息
            this.gLcount = "1"; //上一次验钞次数
            this.gCheckResult = ""; //联网核查结果
            this.gOldTellerNo = "TypeNo1";

            this.gOldCimRefusedNums = 0; //add by art for 流水添加拒钞RJ张数: 本次验钞以前的所有拒钞数（不含本次)			
            this.gbContinueTransFlag = false; //继续交易标识
            this.gbPartCashIn = false; //验钞部分入钞，卡钞

            this.gNoPtrSerFlag = false; //无凭条服务标志位

            this.gbPartCashInEnd = false;

            this.gTransStatus = "";
            this.gReadIdCardFlag = 0;
            this.gCardOrBookBank = 2; //add by tsx 应用根据位数判断存折还是卡号。卡号走大额存款，存折走ATM存款 银行卡：1  存折：2；
            this.gReINQ = false; //add by tsx 判断INQ流程
            this.gMixSelfCWD = false; //add by tsx 自配取款标志位
            this.gIdNumberForRisk = ""//add by tsx 查询风险等级用身份证
            this.gATMORTCR = ""//add by tsx 判断是否为贷记卡
            this.gShowPrintButton = true; //add by tsx 判断是否需要显示打印凭条按钮

        };
        this.ContinueTransClearGlobalData = function () {
            this.gTransactiontype = "";
            this.gPoundage = "";
            this.gResponsecode = "";
            this.gIdCardpic = "";
            this.gCheckIdCardpic = "";
            this.gIdName = "";
            this.gIdNation = "";
            this.gIdSex = "";
            this.gIdNumber = "";
            this.gChooseMoney = 0;
            this.gOldPinBlock = "";
            this.gNewPinBlock = "";
            this.gbAmountType = 0;
            this.gDispenseCounts = 0;
            this.gPrintFSN = false;
            this.gAcceptCounts = 0;
            this.gAmountQuota = 0;

            this.gCheckInfoFlag = false;
            this.gAuthorRefuse = false;

            this.gLTotalItems = ""; //上一次验钞存入钞箱信息
            this.gLcount = "1"; //上一次验钞次数
            this.gCheckResult = ""; //联网核查结果
            this.gOldTellerNo = "TypeNo1";

            this.gOldCimRefusedNums = 0; //add by art for 流水添加拒钞RJ张数: 本次验钞以前的所有拒钞数（不含本次)          
            this.gbPartCashIn = false; //验钞部分入钞，卡钞
            this.gbPartCashInEnd = false;
            this.gReadIdCardFlag = 0;
            this.gPHOTOIMAGURL = "";
            this.gReINQ = false; //add by tsx 判断INQ流程
            this.gMixSelfCWD = false; //add by tsx 自配取款标志位
        };
    };
})();

