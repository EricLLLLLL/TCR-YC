(function () {
    window.JSCashInfo = function () {
        this.arrUnitRemain = new Array(); //各钞箱余额
        this.arrUnitName = new Array();   //各钞箱名字
        this.arrUnitCurrency = new Array(); //各钞箱面值
        this.arrMixDispense = new Array(); //单笔取款过程钞箱配钞记录
        this.arrDispenseCount = new Array(); //单笔取款过程钞箱出钞的记录
        this.arrSelfMixDispenset = new Array(); //自行配钞各钞箱出钞记录
        this.arrDispensetRJCount = new Array(); //各钞箱RJ数目
        this.arrAcceptorCount = new Array(); //存款各钞箱入钞数目
        this.arrCurrencyCashIn = new Array(6); //各面值入钞张数100,50,20,10,5,1
        this.strTransAmount = "0";
        this.nCountOfUnits = 0;
        this.bINQ = true;
        this.bCWD = false;
        this.bDEP = false;
        this.bExchange = false;
        this.bCASH = false;
        this.bCashFull = true;
        this.bCashEmpty = true;
		this.b100CashEmpty = true;
		this.bOtherCashEmpty = true;///其它面额是否大于预留张数
        this.strCardNum = "";
        this.Dealtype = ""; 
        this.InitData = function () {
            var i = 0;
            for (i = 0; i < this.nCountOfUnits; i++) {
                this.arrMixDispense[i] = 0;
                this.arrDispenseCount[i] = 0;
                this.arrSelfMixDispenset[i] = 0;
                this.arrDispensetRJCount[i] = 0;
                this.arrAcceptorCount[i] = 0;
            }
            for (i = 0; i < this.arrCurrencyCashIn.length; i++) {
                this.arrCurrencyCashIn[i] = "0";
            }
            this.strTransAmount = "0";
            this.strCardNum = "";
            this.Dealtype = "";
        };
        this.SpliceArr = function () {
            this.arrUnitRemain.splice(0, this.arrUnitRemain.length);
            this.arrUnitCurrency.splice(0, this.arrUnitCurrency.length);
            this.arrMixDispense.splice(0, this.arrMixDispense.length);
            this.arrDispenseCount.splice(0, this.arrDispenseCount.length);
            this.arrSelfMixDispenset.splice(0, this.arrSelfMixDispenset.length);
            this.arrDispensetRJCount.splice(0, this.arrDispensetRJCount.length);
            this.arrAcceptorCount.splice(0, this.arrAcceptorCount.length);
            this.arrCurrencyCashIn.splice(0, this.arrCurrencyCashIn.length);
        };
    };
})();

