(function () {
    window.global = function () {
        //业务类型可办理的标志位
        this.gbINQ_DEAL = false;
        this.gbQRYNAME_DEAL = false;
        this.gbPSW_DEAL = false;
        this.gbCARDCWD_DEAL = false; // 卡取款
        this.gbPBCWD_DEAL = false;  // 存折取款
        this.gbCARDDEP_DEAL = false;  // 卡存款
        this.gbPBDEP_DEAL = false;   // 存折存款
        this.gbNOCARINQ_DEAL = false;
        this.gbNOCARDDEP_DEAL = false; // 无卡无折
        this.gbEXCHANGE_DEAL = false; // 零钞兑换
        this.gbACCDELETE_DEAL = false; // 卡折销户 by Gni
        this.gbLARGEAMOUNT_DEAL = false;
        this.gbBUSINESSDEP_DEAL = false; // 对公存款
        this.gbTRANSFER_DEAL = false; // 转账汇款 by Gni
        this.gbTRANSFERCANCEL_DEAL = false; // 转账撤销 by Gni
        this.gbPCA_DEAL = false; // 定期转活期 by Gni
        this.gbCTR_DEAL = false; // 活期转定期 by Gni
        this.gbSAVEBACK_DEAL = false; // 卡钞回存 by Gni
        this.gbWXCancel_DEAL = false; // 微信销户 by Gni
        //
        this.gVersion = "";//版本号 by tsx
        this.gOrderCWDFlag = "0";//预约取款标志 by tsx 0：不支持  1：支持
        this.gTransactiontype = "";
        this.gCardno = ""; //卡号
        this.gTFRCardNo = "";//转账卡号  汇款卡号
        this.gNocardDepCardNo = "";//汇款账号
        this.gPoundage = "";
        this.gResponsecode = "";
        this.gMasterkeyA = "";
        this.gMasterkeyB = "";
        this.gMasterkeyC = "";
        this.gIdCardpic = ""; //身份证全路径

        this.gCURRENTBALANCE = ""; //银行卡当前余额
        this.gAVAILABLEBALANCE = ""; //银行卡可用余额
        this.gCustomerName = ""; //银行卡名字

        this.gIdName = ""; //身份证名字
        this.gIdNation = ""; //身份证名族
        this.gIdSex = ""; // 身份证性别
        this.gIdNumber = ""; //身份证号码
        this.gIdFrontImage = "";//身份证正面图
        this.gIdBackImage = ""; //身份证反面图
        this.gIdAddress = ""; //身份证地址
        this.gIdDepartment = "";
        this.gIdEndtime = "";
        this.gIdStarttime = "";

        this.gCheckIdCardpic = "";
        this.gFaceCheckPic = "";

        this.gChooseMoney = 0;
        this.gOldPinBlock = "";
        this.gNewPinBlock = "";
        this.gbAmountType = true; //默认小额  大额： false
        this.gDispenseCounts = 0;
        this.gAcceptCounts = 0;
        this.gPrintFSN = false;
        this.gSubBankNum = "";
        this.gDevStatus = "";
        this.AdminStatus = 0; //0为技术管理员 00;1为业务主管;2为业务管理员
        this.UnitStatusflg = 0; //后屏查看状态是否是第一个页面
        this.Manageflg = 0; //0是技术管理员登录，1是主管和业务管理员登录
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
        this.gIniFileName = "/TCR/jsapp/ini/TCR_CUSTOMIZE.INI"; //JS配置文件路径
        this.gIniSetupName = "/TCR/Middle/ini/Setup.ini"; //JS配置文件路径 
        this.gIniTranCode = "/TCR/jsapp/ini/TRANCODE.INI"; //JS配置文件路径
        this.CreateBusiListHead = "";
        this.CreateBusiListUrl = "";
        this.CreateBusiListParam = "";
        this.CreateTaskHead = "";
        this.CreateTaskUrl = "";
        this.CreateTaskParam = "";
        this.RemoteID = "";
        this.gAmountQuota = 0;
        this.gResetTimeout = 40000;
        this.gCaptureTimeout = 40000;
        this.gStoreEscrowedCashTimeOut = 40000;
        this.gPrintTimeOut = 60000;
        this.gEjectCardTimeOut = 60000;
        this.gOpenShutterTimeOut = 30000;
        this.gCloseShutterTimeOut = 30000;

        this.gMaxCashTimes = 4; // 最多5次放钞后屏蔽继续放钞按钮

        //add by hj
        this.gReadIdCardFlag = 0; //进入读身份证页面标志位 0：读交易第一次身份证；1：读持卡人本人身份证；2：读代理人身份证
        this.gCheckInfoFlag = false; //需要身份验证标志
        this.gAuthorRefuse = ""; //授权拒绝原因

        this.garrTotalItems = new Array(0, 0, 0, 0, 0, 0); //上一次验钞存入钞箱信息
        this.gLcount = 1; //上一次验钞次数
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
        this.gPartsStatus = "";
        this.gCardOrBookBank = 1; //add by tsx 应用根据位数判断存折还是卡号。卡号走大额存款，存折走ATM存款 银行卡：1  存折：2；
        this.gMixSelfCWD = false; //add by tsx 自配取款标志位
        this.gIdNumberForRisk = ""//add by tsx 查询风险等级用身份证
        this.gATMORTCR = ""//add by tsx 判断是否为贷记卡
        this.gShowPrintButton = true; //add by tsx 判断是否需要显示打印凭条按钮
        this.gTakeCardAndPrint = false; //add by tsx 判断退卡页面是否打印凭条
        this.gOutService = true; //add by tsx 判断后屏是否暂停服务
        this.gnCWDMoney = 0; //add by tsx 取款已取金额
        this.gbOrderCWD = false; //add by tsx 预约取款标志
        this.gBUSSINESSDEPINFO = ""; //add by tsx 对公存款附言
        this.gAddNoteSuccess = true; //add by tsx 后屏管理使用，默认加钞成功
        this.gReadIdCardFlag = 0;
        this.gCurPage = 1;
        this.gNoteId = 1;
        //add by tsx 远程审核办理类型
        //0：持卡人本人办理，放置持卡人身份证
        //1：代理人办理
        //2：代理人办理

        //add by LL 保存数据统计时间以及交易数据
        this.gDSTimeScope = "";
        this.gDSResultData = "";


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
        this.MTRN_TRANLIMITAMOUNTREAL = 33  // 交易限额
        this.MTRN_TRANLIMITAMOUNTRULE = 35
        this.MTRN_AUTHORIZEDAMOUNTRULE = 36  // 设置授权限额
        this.MTRN_REMAINDEPSITAMOUT = 37  // 钞箱剩余可存金额
        //add by grb for 交易区分 end

        //启动北辰德接口DataGetSync
        this.MSYS_BCDSTARTSERVICESYNC = 40     //北辰德影像软件启动
        this.MSYS_BCDENDSERVICESYNC = 41       //北辰德影像软件关闭

        //写交易记录
        this.MTSL_WRITETRANSRECORD = 0   //写交易记录0---y
        this.MTSL_WRITERETAINCARDRECORD = 1   //写吞卡记录1---y
        this.MTSL_WRITECHECKTRANSRECORD = 2   //写对账记录2
        this.MTSL_READTRANSRECORD = 3   //读交易记录3
        //this.MTSL_READRETAINCARDRECORD = 4   //读吞卡记录4---调2次
        this.MTSL_RENAMERECORD = 4   //重命名交易和吞卡记录5--y
        this.MTSL_WRITECLOSEDCORD = 5 // 写销户记录---y


        //初始化和记录可开通面值的数组(用于控制相关面值满后不进回收箱的情况),默认开通100的面值
        this.gSupportValue = [];

        this.gArrUnitRemain = [];
        this.gArrUnitStatus = [];

        this.partCwcTip = false;//存款卡钞部分上账结果
        this.needPrintReDEPCash = false;  //是否打取款卡钞凭条

        /**
         *  转账汇款交易数据
         */
        this.PayeeAccount = '';//转入账号
        this.PayeeName = '';//转入账号户名
        this.PayeeBank = '';//转入账行方
        this.CommentSelect = '';//附言1
        this.postScript = '';//附言2
        this.transferWay = '';//转账方式
        this.TransferMoney = '';//转账金额
        this.TransferPoundage = '';//转账手续费
        this.MONEYLIMIT = "0";// add by Gni 大小额标识 0大额 1小额
        this.TRANSFERTIMES = "1";// add by Gni 1：第一次转账 2：第二次转账
        this.BankName = ""; // add by Gni 获取银行名

        /**
         * 转账撤销交易数据
         */
        this.TrasferCancelList = null;
        this.ChoosedCancellAccount = null;


        /**
         * 销户交易数据
         */
        this.CancellationAccountList = [];
        this.CancelCardNo = "";  // add by Gni 需销户卡号
        this.SaveBack = false; // add by Gni 是否允许回存
        this.iniTellerNo = ""; // add by Gni 柜员号默认选择值
        this.phoneNum = ""; // add by Gni 手机号

        /**
         * add by Gni
         */
        // 活转定流程
        this.balance = 0;  // 活转定余额
        this.CTRMoney = ""; // 活转定用户输入金额
        this.saveTime = ""; // 存期 M003、M006、Y001、Y002、Y003、Y005
        this.saveToType = ""; // 转存类型 1约定 0不约定
        this.saveToTime = ""; // 转存时间 M003、M006、Y001、Y002、Y003、Y005

        // 定转活
        this.PCAAccount = ""; // 选择定转活子账户
        this.PCABalance = 0;  // 定转活余额
        this.RemittanceFlag = ""; // 定转活利率
        this.PCARMoney = ""; // 定转活用户输入金额
        // this.PaymentMethod = ""; // 定转活支取方式，全部提取，部分提取

        // 取款
        this.resetFlag = false; // 复位标志
        this.depErrFlag = false; // 取款卡钞标志

        // 存款
        this.CWDType = "card"; // 无卡无折类型 无卡：card 无折：passbook
        this.noPassbookCWDMoney = 0; // 无折存款已存金额
        this.nAcceptCashTimes = 0;  // 继续存款交易次数，目前限制在5次

        //是否继续存款标志
        top.API.gIsContinueDep = false;

        //无卡交易
        this.NoCardDeal = false;


        //交易类型记录
        this.gTranType = "";

        //存款、无卡交易加钞页面判断
        this.ContinueAddCash = 0;   //0：首次放钞 1:多次放钞

        //openDevice页面处理通过检验校验文件处理该标志，判断是否支持人脸识别
        this.isFaceCheckOK = false;
        this.gBACKUSERFLAG = "";

        //后屏登录账号、密码(员工号)
        this.User = "";
        this.PasswordLogin = "";

        //新增管理员账号、密码、身份证、机构号
        this.AddUser = "";
        this.AddPassword = "";
        this.AddIDCardNum = "";
        this.AddAgencyNum = "";
        //新增管理员账号类型,1:业务主管,2:业务管理员
        this.AddUserType = 0;
        this.SignType = "";

        //初始化业务记录
        this.InitBusinessFlag = "";
        this.gTransDetail = "";
        this.gNotINQ = false;
        //大额是否插卡，如果已经插卡在 大额一级菜单里判断是否显示 现金汇款
        this.gLargeInsertCard = false;
        this.gTFRCustomerName = "";//转账客户名
        this.gEmpno = "";

        this.gCardBankType = ""; // 银行卡类别，如本行卡、他行卡
        this.gErrorInfo = "";//信息提示页面

        this.gLastTranstype = "";
        this.BrushCard = false;
        this.gSupportTransType = ""; // 插卡后根据卡表返回的被支持的交易列表
        this.gHaveTakeCard = true;   // 默认是否支持插卡，反应在卡是否拔出读卡器

        this.gFaceCheckOK = false;

        this.gBrashCardType = 0; //1插卡 2刷卡

        this.gLastCardNum = "";

        this.clearGlobalData = function () {
            this.gBrashCardType = 0; //1插卡 2刷卡
            this.gFaceCheckOK = false;
            this.BrushCard = false;
            this.gTransactiontype = "";
            this.gCardno = "";
            this.gTFRCardNo = "";//转账卡号
            this.gNocardDepCardNo = "";
            this.gPoundage = "";
            this.gResponsecode = "";
            this.gMasterkeyA = "";
            this.gMasterkeyB = "";
            this.gMasterkeyC = "";
            this.gIdCardpic = "";
            this.gCheckIdCardpic = "";
            this.gFaceCheckPic = "";

            this.gIdName = "";
            this.gIdFrontImage = "";
            this.gIdBackImage = "";
            this.gIdAddress = "";
            this.gIdNation = "";
            this.gIdSex = "";
            this.gIdNumber = "";
            this.gIdDepartment = "";
            this.gIdEndtime = "";
            this.gIdStarttime = "";

            this.gChooseMoney = 0;
            this.gOldPinBlock = "";
            this.gNewPinBlock = "";
            this.gbAmountType = true; //默认小额  大额： false
            this.gDispenseCounts = 0;
            this.gPrintFSN = false;
            this.gAcceptCounts = 0;
            this.gMACKEY = false;
            //this.gSubBankNum = "";
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
            this.gCURRENTBALANCE = ""; //银行卡当前余额
            this.gAVAILABLEBALANCE = ""; //银行卡可用余额
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
            this.gLcount = 1; //上一次验钞次数
            this.gCheckResult = ""; //联网核查结果
            this.gOldTellerNo = "TypeNo1";

            this.gOldCimRefusedNums = 0; //add by art for 流水添加拒钞RJ张数: 本次验钞以前的所有拒钞数（不含本次)			
            this.gbContinueTransFlag = false; //继续交易标识
            this.gbPartCashIn = false; //验钞部分入钞，卡钞

            this.gNoPtrSerFlag = false; //无凭条服务标志位

            this.gbPartCashInEnd = false;

            this.gTransStatus = "";
            this.gPartsStatus = "";
            this.gReadIdCardFlag = 0;
            this.gCardOrBookBank = 1; //add by tsx 应用根据位数判断存折还是卡号。卡号走大额存款，存折走ATM存款 银行卡：1  存折：2；
            this.gMixSelfCWD = false; //add by tsx 自配取款标志位
            this.gIdNumberForRisk = "";//add by tsx 查询风险等级用身份证
            this.gATMORTCR = "";//add by tsx 判断是否为贷记卡
            this.gShowPrintButton = true; //add by tsx 判断是否需要显示打印凭条按钮		
            this.gShowPrintButton = true;//add by tsx 显示打印凭条标志位
            this.gTakeCardAndPrint = false; //add by tsx 判断退卡页面是否打印凭条
            this.gnCWDMoney = 0; //add by tsx 取款已取金额
            this.gbOrderCWD = false; //add by tsx 预约取款标志
            this.gBUSSINESSDEPINFO = ""; //add by tsx 对公存款附言

            this.gArrUnitRemain = [];
            this.gArrUnitStatus = [];

            this.partCwcTip = false;//存款卡钞部分上账结果
            this.needPrintReDEPCash = false;  //是否打取款卡钞凭条

            //清除转账汇款交易数据
            this.PayeeAccount = '';
            this.PayeeName = '';
            this.PayeeBank = '';
            this.TransferMoney = '';
            this.CommentSelect = '';
            this.postScript = ''; // 附言
            this.transferWay = '';
            this.TransferPoundage = '';
            this.MONEYLIMIT = "0";// add by Gni 大小额标识 0大额 1小额
            this.TRANSFERTIMES = "1";// add by Gni 1：第一次转账 2：第二次转账
            this.BankName = ""; // add by Gni 获取银行名


            /**
             * 转账撤销交易数据
             */
            this.TrasferCancelList = null;
            this.ChoosedCancellAccount = null;

            /**
             * 销户交易数据
             */
            this.CancellationAccountList = [];
            this.CancelCardNo = "";  // add by Gni 需销户卡号
            this.SaveBack = false; // add by Gni 是否允许回存
            this.iniTellerNo = ""; // add by Gni 柜员号默认选择值
            this.phoneNum = ""; // add by Gni 手机号


            /**
             * add by Gni
             */
            // 活转定流程
            this.balance = 0;  // 活转定余额
            this.CTRMoney = ""; // 活转定用户输入金额
            this.saveTime = ""; // 存期
            this.saveToType = ""; // 转存类型
            this.saveToTime = ""; // 转存时间

            // 定转活
            this.PCAAccount = ""; // 选择定转活子账户
            this.PCABalance = 0;  // 定转活余额
            this.RemittanceFlag = "", // 定转活利率
                this.PCARMoney = ""; // 定转活用户输入金额
            // this.PaymentMethod = ""; // 定转活支取方式，全部提取，部分提取

            // 取款
            this.resetFlag = false; // 复位标志
            this.depErrFlag = false; // 取款卡钞标志

            // 存款
            this.CWDType = "card"; // 无卡无折类型 无卡：card 无折：passbook
            this.noPassbookCWDMoney = 0; // 无折存款已存金额

            top.API.gIsContinueDep = false;

            //无卡交易
            this.NoCardDeal = false;

            this.gTranType = "";

            //存款、无卡交易加钞页面判断
            this.ContinueAddCash = 0;   //0：首次放钞 1:多次放钞

            this.isFaceCheckOK = false;
            this.gBACKUSERFLAG = "";

            //后屏登录账号(员工号)
            this.User = "";
            this.PasswordLogin = "";

            //初始化业务记录
            this.InitBusinessFlag = "";

            this.gTransDetail = "";
            this.gNotINQ = false;
            this.gCardBankType = ""; // 银行卡类别，如本行卡、他行卡
            this.gLargeInsertCard = false;

            this.gTFRCustomerName = "";//转账客户名、汇款客户
            this.gEmpno = "";
            this.nAcceptCashTimes = 0;
            this.gLastTranstype = "";
            this.gSupportTransType = ""
        };
        this.ContinueTransClearGlobalData = function () {
            top.API.gIsContinueDep = false;
            //this.gTransactiontype = "";
            this.gPoundage = "";
            this.gResponsecode = "";
            //this.gIdCardpic = "";
            //this.gCheckIdCardpic = "";
            //this.gIdName = "";
            //this.gIdFrontImage = "";
            // this.gIdBackImage = "";
            //this.gIdAddress = "";
            //this.gIdNation = "";
            //this.gIdSex = "";
            //this.gIdNumber = "";
            // this.gChooseMoney = 0;
            this.gOldPinBlock = "";
            this.gNewPinBlock = "";
            this.gbAmountType = true; //默认小额  大额： false
            this.gDispenseCounts = 0;
            this.gPrintFSN = false;
            this.gAcceptCounts = 0;
            this.gAmountQuota = 0;

            this.gCheckInfoFlag = false;
            this.gAuthorRefuse = false;

            this.gLcount = 1; //上一次验钞次数
            //this.gCheckResult = ""; //联网核查结果
            this.gOldTellerNo = "TypeNo1";

            this.gOldCimRefusedNums = 0; //add by art for 流水添加拒钞RJ张数: 本次验钞以前的所有拒钞数（不含本次)          
            this.gbPartCashIn = false; //验钞部分入钞，卡钞
            this.gbPartCashInEnd = false;
            this.gReadIdCardFlag = 0;
            this.gPHOTOIMAGURL = "";
            this.gMixSelfCWD = false; //add by tsx 自配取款标志位
            this.gShowPrintButton = true;//add by tsx 显示打印凭条标志位
            this.gTakeCardAndPrint = false; //add by tsx 判断退卡页面是否打印凭条
            this.gnCWDMoney = 0; //add by tsx 取款已取金额
            this.gbOrderCWD = false; //add by tsx 预约取款标志
            this.gBUSSINESSDEPINFO = ""; //add by tsx 对公存款附言
            this.partCwcTip = false;
            this.needPrintReDEPCash = false;  //是否打取款卡钞凭条
            this.CommentSelect = '';//附言1
            this.postScript = '';//附言2

            //存款、无卡交易加钞页面判断
            this.ContinueAddCash = 0;   //0：首次放钞 1:多次放钞
            this.nAcceptCashTimes = 0;
        };
    };
})();

