/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
	    ButtonDisable();
        App.Plugin.Keyboard.show("2", "PageSubject", "KeyboardDiv");
        ButtonEnable();
    }();//Page Entry
    function ButtonDisable() {
        document.getElementById('Back').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Back').disabled = false;
    }

    var strCashBox1Type = "";
    var strCashBox2Type = "";
    var strCashBox3Type = "";
    var strCashBox4Type = "";
    var strCashBox5Type = "";
    var strMoneyType1 = "";
    var strMoneyType2 = "";
    var strMoneyType3 = "";
    var strMoneyType4 = "";
    var strMoneyType5 = "";
    var strDEPAllowMoney1 = "";
    var strDEPAllowMoney2 = "";
    var strDEPAllowMoney3 = "";
    var strDEPAllowMoney4 = "";
    var strDEPMaxNum = "";
    var strCWDMaxNum = "";
    var CashBox1Type = document.getElementById("CashBox1TypeInput");
    var CashBox2Type = document.getElementById("CashBox2TypeInput");
    var CashBox3Type = document.getElementById("CashBox3TypeInput");
    var CashBox4Type = document.getElementById("CashBox4TypeInput");
    var CashBox5Type = document.getElementById("CashBox5TypeInput");
    var MoneyType1 = document.getElementById("MoneyType1Input");
    var MoneyType2 = document.getElementById("MoneyType2Input");
    var MoneyType3 = document.getElementById("MoneyType3Input");
    var MoneyType4 = document.getElementById("MoneyType4Input");
    var MoneyType5 = document.getElementById("MoneyType5Input");
    var DEPAllowMoney1 = document.getElementById("DEPAllowMoney1Input");
    var DEPAllowMoney2 = document.getElementById("DEPAllowMoney2Input");
    var DEPAllowMoney3 = document.getElementById("DEPAllowMoney3Input");
    var DEPAllowMoney4 = document.getElementById("DEPAllowMoney4Input");
    var DEPMaxNum = document.getElementById("DEPMaxNumInput");
    var CWDMaxNum = document.getElementById("CWDMaxNumInput");
    var InputFlag = 1;
    CashBox1Type.focus();

    // 设定flag
    var oKeyboardKeyInput = document.getElementsByTagName("input");
    for (var j = 0; j < oKeyboardKeyInput.length; j++) {
        var inpt = oKeyboardKeyInput[j];
        inpt.onclick = function (e) {
            inputId = document.activeElement.id;
            if (inputId == "CashBox1TypeInput") {
                InputFlag = 1;
            } else if (inputId == "CashBox2TypeInput") {
                InputFlag = 2;
            } else if (inputId == "CashBox3TypeInput") {
                InputFlag = 3;
            } else if (inputId == "CashBox4TypeInput") {
                InputFlag = 4;
            } else if (inputId == "CashBox5TypeInput") {
                InputFlag = 5;
            } else if (inputId == "MoneyType1Input") {
                InputFlag = 6;
            } else if (inputId == "MoneyType2Input") {
                InputFlag = 7;
            } else if (inputId == "MoneyType3Input") {
                InputFlag = 8;
            } else if (inputId == "MoneyType4Input") {
                InputFlag = 9;
            } else if (inputId == "MoneyType5Input") {
                InputFlag = 10;
            } else if (inputId == "DEPAllowMoney1Input") {
                InputFlag = 11;
            } else if (inputId == "DEPAllowMoney2Input") {
                InputFlag = 12;
            } else if (inputId == "DEPAllowMoney3Input") {
                InputFlag = 13;
            } else if (inputId == "DEPAllowMoney4Input") {
                InputFlag = 14;
            } else if (inputId == "DEPMaxNumInput") {
                InputFlag = 15;
            } else if (inputId == "CWDMaxNumInput") {
                InputFlag = 16;
            }
        }
    }

    function onClearNum() {
        if (InputFlag == 1) {
            CashBox1Type.value = '';
            strCashBox1Type = '';
            CashBox1Type.focus();
        } else if (InputFlag == 2) {
            CashBox2Type.value = '';
            strCashBox2Type = '';
            CashBox2Type.focus();
        } else if (InputFlag == 3) {
            CashBox3Type.value = '';
            strCashBox3Type = '';
            CashBox3Type.focus();
        } else if (InputFlag == 4) {
            CashBox4Type.value = '';
            strCashBox4Type = '';
            CashBox4Type.focus();
        } else if (InputFlag == 5) {
            CashBox5Type.value = '';
            strCashBox5Type = '';
            CashBox5Type.focus();
        } else if (InputFlag == 6) {
            MoneyType1.value = '';
            strMoneyType1 = '';
            MoneyType1.focus();
        } else if (InputFlag == 7) {
            MoneyType2.value = '';
            strMoneyType2 = '';
            MoneyType2.focus();
        } else if (InputFlag == 8) {
            MoneyType3.value = '';
            strMoneyType3 = '';
            MoneyType3.focus();
        } else if (InputFlag == 9) {
            MoneyType4.value = '';
            strMoneyType4 = '';
            MoneyType4.focus();
        } else if (InputFlag == 10) {
            MoneyType5.value = '';
            strMoneyType5 = '';
            MoneyType5.focus();
        } else if (InputFlag == 11) {
            DEPAllowMoney1.value = '';
            strDEPAllowMoney1 = '';
            DEPAllowMoney1.focus();
        } else if (InputFlag == 12) {
            DEPAllowMoney2.value = '';
            strDEPAllowMoney2 = '';
            DEPAllowMoney3.focus();
        } else if (InputFlag == 13) {
            DEPAllowMoney3.value = '';
            strDEPAllowMoney3 = '';
            DEPAllowMoney3.focus();
        } else if (InputFlag == 14) {
            DEPAllowMoney4.value = '';
            strDEPAllowMoney4 = '';
            DEPAllowMoney4.focus();
        } else if (InputFlag == 15) {
            DEPMaxNum.value = '';
            strDEPMaxNum = '';
            DEPMaxNum.focus();
        } else if (InputFlag == 16) {
            CWDMaxNum.value = '';
            strCWDMaxNum = '';
            CWDMaxNum.focus();
        }
    }
    // 赋值
    var oKeyboardKey = document.getElementsByClassName("KeyboardKey");
    for (var i = 0; i < oKeyboardKey.length; i++) {
        var keyEvent = oKeyboardKey[i];
        keyEvent.onclick = function (e) {
            if ('退格' == this.innerText) {
                if (InputFlag == 1) {
                    if (strCashBox1Type.length != 0) {
                        strCashBox1Type = strCashBox1Type.substr(0, (strCashBox1Type.length - 1));
                        CashBox1Type.value = strCashBox1Type;
                        CashBox1Type.focus();
                    }
                } else if (InputFlag == 2) {
                    if (strCashBox2Type.length != 0) {
                        strCashBox2Type = strCashBox2Type.substr(0, (strCashBox2Type.length - 1));
                        CashBox2Type.value = strCashBox2Type;
                        CashBox2Type.focus();
                    }
                } else if (InputFlag == 3) {
                    if (strCashBox3Type.length != 0) {
                        strCashBox3Type = strCashBox3Type.substr(0, (strCashBox3Type.length - 1));
                        CashBox3Type.value = strCashBox3Type;
                        CashBox3Type.focus();
                    }
                } else if (InputFlag == 4) {
                    if (strCashBox4Type.length != 0) {
                        strCashBox4Type = strCashBox4Type.substr(0, (CashBox4Type.length - 1));
                        CashBox4Type.value = strCashBox4Type;
                        CashBox4Type.focus();
                    }
                } else if (InputFlag == 5) {
                    if (strCashBox5Type.length != 0) {
                        strCashBox5Type = strCashBox5Type.substr(0, (strCashBox5Type.length - 1));
                        CashBox5Type.value = strCashBox5Type;
                        CashBox5Type.focus();
                    }
                } else if (InputFlag == 6) {
                    if (strMoneyType1.length != 0) {
                        strMoneyType1 = strMoneyType1.substr(0, (strMoneyType1.length - 1));
                        MoneyType1.value = strMoneyType1;
                        MoneyType1.focus();
                    }
                } else if (InputFlag == 7) {
                    if (strMoneyType2.length != 0) {
                        strMoneyType2 = strMoneyType2.substr(0, (strMoneyType2.length - 1));
                        MoneyType2.value = strMoneyType2;
                        MoneyType2.focus();
                    }
                } else if (InputFlag == 8) {
                    if (strMoneyType3.length != 0) {
                        strMoneyType3 = strMoneyType3.substr(0, (strMoneyType3.length - 1));
                        MoneyType3.value = strMoneyType3;
                        MoneyType3.focus();
                    }
                } else if (InputFlag == 9) {
                    if (strMoneyType4.length != 0) {
                        strMoneyType4 = strMoneyType4.substr(0, (strMoneyType4.length - 1));
                        MoneyType4.value = strMoneyType4;
                        MoneyType4.focus();
                    }
                } else if (InputFlag == 10) {
                    if (strMoneyType5.length != 0) {
                        strMoneyType5 = strMoneyType5.substr(0, (strMoneyType5.length - 1));
                        MoneyType5.value = strMoneyType5;
                        MoneyType5.focus();
                    }
                } else if (InputFlag == 11) {
                    if (strDEPAllowMoney1.length != 0) {
                        strDEPAllowMoney1 = strDEPAllowMoney1.substr(0, (strDEPAllowMoney1.length - 1));
                        DEPAllowMoney1.value = strDEPAllowMoney1;
                        DEPAllowMoney1.focus();
                    }
                } else if (InputFlag == 12) {
                    if (strDEPAllowMoney2.length != 0) {
                        strDEPAllowMoney2 = strDEPAllowMoney2.substr(0, (strDEPAllowMoney2.length - 1));
                        DEPAllowMoney2.value = strDEPAllowMoney2;
                        DEPAllowMoney2.focus();
                    }
                } else if (InputFlag == 13) {
                    if (strDEPAllowMoney3.length != 0) {
                        strDEPAllowMoney3 = strDEPAllowMoney3.substr(0, (strDEPAllowMoney3.length - 1));
                        DEPAllowMoney3.value = strDEPAllowMoney3;
                        DEPAllowMoney3.focus();
                    }
                } else if (InputFlag == 14) {
                    if (strDEPAllowMoney4.length != 0) {
                        strDEPAllowMoney4 = strDEPAllowMoney4.substr(0, (strDEPAllowMoney4.length - 1));
                        DEPAllowMoney4.value = strDEPAllowMoney4;
                        DEPAllowMoney4.focus();
                    }
                } else if (InputFlag == 15) {
                    if (strDEPMaxNum.length != 0) {
                        strDEPMaxNum = strDEPMaxNum.substr(0, (strDEPMaxNum.length - 1));
                        DEPMaxNum.value = strDEPMaxNum;
                        DEPMaxNum.focus();
                    }
                } else if (InputFlag == 16) {
                    if (strCWDMaxNum.length != 0) {
                        strCWDMaxNum = strCWDMaxNum.substr(0, (strCWDMaxNum.length - 1));
                        CWDMaxNum.value = strCWDMaxNum;
                        CWDMaxNum.focus();
                    }
                }
            } else if ('清除' == this.innerText) {
                onClearNum();
            } else {
                if (InputFlag == 1) {
                    //if (strCashBox1Type.length < 6) {                          
                    strCashBox1Type += this.innerText;
                    CashBox1Type.value = strCashBox1Type;
                    //  }                
                } else if (InputFlag == 2) {
                    // if (strPsw.length < 6) {                          
                    strCashBox2Type += this.innerText;
                    CashBox2Type.value = strCashBox2Type;
                    //  }                                   
                } else if (InputFlag == 3) {
                    strCashBox3Type += this.innerText;
                    CashBox3Type.value = strCashBox3Type;
                } else if (InputFlag == 4) {
                    strCashBox4Type += this.innerText;
                    CashBox4Type.value = strCashBox4Type;
                } else if (InputFlag == 5) {
                    strCashBox5Type += this.innerText;
                    CashBox5Type.value = strCashBox5Type;
                } else if (InputFlag == 6) {
                    //if (strMoneyType1.length < 6) {                          
                    strMoneyType1 += this.innerText;
                    MoneyType1.value = strMoneyType1;
                    //  }                
                } else if (InputFlag == 7) {
                    // if (strPsw.length < 6) {                          
                    strMoneyType2 += this.innerText;
                    MoneyType2.value = strMoneyType2;
                    //  }                                   
                } else if (InputFlag == 8) {
                    strMoneyType3 += this.innerText;
                    MoneyType3.value = strMoneyType3;
                } else if (InputFlag == 9) {
                    strMoneyType4 += this.innerText;
                    MoneyType4.value = strMoneyType4;
                } else if (InputFlag == 10) {
                    strMoneyType5 += this.innerText;
                    MoneyType5.value = strMoneyType5;
                } else if (InputFlag == 11) {
                    //if (strMonitorHostIP1.length < 6) {                          
                    strDEPAllowMoney1 += this.innerText;
                    DEPAllowMoney1.value = strDEPAllowMoney1;
                    //  }                
                } else if (InputFlag == 12) {
                    //if (strMonitorHostIP1.length < 6) {                          
                    strDEPAllowMoney2 += this.innerText;
                    DEPAllowMoney2.value = strDEPAllowMoney2;
                    //  }                
                } else if (InputFlag == 13) {
                    //if (strMonitorHostIP1.length < 6) {                          
                    strDEPAllowMoney3 += this.innerText;
                    DEPAllowMoney3.value = strDEPAllowMoney3;
                    //  }                
                } else if (InputFlag == 14) {
                    //if (strMonitorHostIP1.length < 6) {                          
                    strDEPAllowMoney4 += this.innerText;
                    DEPAllowMoney4.value = strDEPAllowMoney4;
                    //  }                
                } else if (InputFlag == 15) {
                    //if (strMonitorHostIP1.length < 6) {                          
                    strDEPMaxNum += this.innerText;
                    DEPMaxNum.value = strDEPMaxNum;
                    //  }                
                } else if (InputFlag == 16) {
                    //if (strMonitorHostIP1.length < 6) {                          
                    strCWDMaxNum += this.innerText;
                    CWDMaxNum.value = strCWDMaxNum;
                    //  }                
                }
            }

        }
    }


    //@HostIP1 ocde scope start
    document.getElementById('KeyboardKey_set').onclick = function () {

       alert(11)
    }


    document.getElementById('Back').onclick = function () {
        ButtonDisable();
        return CallResponse('Back');
    }


})();
