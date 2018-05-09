/*@create by:  tsxiong
 *@time: 2016年03月20日
 */
;
(function () {

    var HostIP;
    var HostPORT; //键盘相关  
    var strHostIP1 = ""; // 主机ip 4 
    var strHostIP2 = "";
    var strHostIP3 = "";
    var strHostIP4 = "";

    var strHostPort = ""; //前置端口

    var MonitorHostIpPort; //监控地址 
    var strMonitorHostIP1 = ""; // 监控ip 4 
    var strMonitorHostIP2 = "";
    var strMonitorHostIP3 = "";
    var strMonitorHostIP4 = "";

    var strMonitorHostPort = ""; //监控端口

    // id 获取元素
    var HostIP1 = document.getElementById("HostIP1Input");
    var HostIP2 = document.getElementById("HostIP2Input");
    var HostIP3 = document.getElementById("HostIP3Input");
    var HostIP4 = document.getElementById("HostIP4Input");
    var HostPort = document.getElementById("HostPortInput");

    var MonitorHostIP1 = document.getElementById("MonitorHostIP1Input");
    var MonitorHostIP2 = document.getElementById("MonitorHostIP2Input");
    var MonitorHostIP3 = document.getElementById("MonitorHostIP3Input");
    var MonitorHostIP4 = document.getElementById("MonitorHostIP4Input");
    var MonitorHostPort = document.getElementById("MonitorHostPortInput");

    var InputFlag = 1;
    HostIP1.focus();
    var CallResponse = App.Cntl.ProcessOnce(function (Response) {
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        ButtonDisable();
        showText();
        //@initialize scope start 
        App.Plugin.Keyboard.show("2", "PageSubject", "KeyboardDiv");


        ButtonEnable();
    }(); //Page Entry
    function ButtonDisable() {
        top.API.displayMessage("ButtonDisable");
        document.getElementById('Back').disabled = true;
        document.getElementById('PageRoot').disabled = true;
    }

    function ButtonEnable() {
        top.API.displayMessage("ButtonEnable");
        document.getElementById('Back').disabled = false;
        document.getElementById('PageRoot').disabled = false;
    }

    // 数据填充 读取配置文件中的ip和port
    function showText() {
        HostIP = top.API.Dat.GetPrivateProfileSync("MTCP", "HOSTIP", "", top.API.Dat.GetBaseDir() + top.API.gIniSetupName);
        top.API.displayMessage("GetPrivateProfileSync HOSTIP Return:" + HostIP);
        var strIP = HostIP.split(".");
        for (var i = 0; i < 4; i++) {
            var displayid = "HostIP" + (i + 1) + "Input";
            document.getElementById(displayid).value = strIP[i];

        }
        strHostIP1 = HostIP1.value;
        strHostIP2 = HostIP2.value;
        strHostIP3 = HostIP3.value;
        strHostIP4 = HostIP4.value;
        // 回显端口号
        HostPORT = top.API.Dat.GetPrivateProfileSync("MTCP", "HOSTPORT", "", top.API.Dat.GetBaseDir() + top.API.gIniSetupName);
        top.API.displayMessage("GetPrivateProfileSync HOSTPORT Return:" + HostPORT);
        document.getElementById("HostPortInput").value = HostPORT;
        strHostPort = HostPort.value;
        // 回显监控ip  http://20.5.193.81:7002"
        MonitorHostIpPort = top.API.Dat.GetPrivateProfileSync("MTCP", "MONITORHOSTIP", "", top.API.Dat.GetBaseDir() + top.API.gIniSetupName);
        top.API.displayMessage("GetPrivateProfileSync MONITORHOSTIP Return:" + MonitorHostIpPort);
        var arrMonitor = MonitorHostIpPort.substr(7, MonitorHostIpPort.length - 7).split(":");
        var strMonitorIP = arrMonitor[0].split(".");
        for (var i = 0; i < 4; i++) {
            var displayid = "MonitorHostIP" + (i + 1) + "Input";
            document.getElementById(displayid).value = strMonitorIP[i];

        }
        strMonitorHostIP1 = MonitorHostIP1.value;
        strMonitorHostIP2 = MonitorHostIP2.value;
        strMonitorHostIP3 = MonitorHostIP3.value;
        strMonitorHostIP4 = MonitorHostIP4.value;
        // 回显监控 端口
        document.getElementById("MonitorHostPortInput").value = arrMonitor[1];
        strMonitorHostPort = MonitorHostPort.value;
        // alert(arr[0]);
        // alert(arr[1]);



    }
    var oKeyboardKeyInput = document.getElementsByTagName("input");
    for (var j = 0; j < oKeyboardKeyInput.length; j++) {
        var inpt = oKeyboardKeyInput[j];
        inpt.onclick = function (e) {
            inputId = document.activeElement.id;
            if (inputId == "HostIP1Input") {
                InputFlag = 1;
            } else if (inputId == "HostIP2Input") {
                InputFlag = 2;
            } else if (inputId == "HostIP3Input") {
                InputFlag = 3;
            } else if (inputId == "HostIP4Input") {
                InputFlag = 4;
            } else if (inputId == "HostPortInput") {
                InputFlag = 5;
            } else if (inputId == "MonitorHostIP1Input") {
                InputFlag = 6;
            } else if (inputId == "MonitorHostIP2Input") {
                InputFlag = 7;
            } else if (inputId == "MonitorHostIP3Input") {
                InputFlag = 8;
            } else if (inputId == "MonitorHostIP4Input") {
                InputFlag = 9;
            } else if (inputId == "MonitorHostPortInput") {
                InputFlag = 10;
            }
        }
    }

    function onClearNum() {
        if (InputFlag == 1) {
            HostIP1.value = '';
            strHostIP1 = '';
            HostIP1.focus();
        } else if (InputFlag == 2) {
            HostIP2.value = '';
            strHostIP2 = '';
            HostIP2.focus();
        } else if (InputFlag == 3) {
            HostIP3.value = '';
            strHostIP3 = '';
            HostIP3.focus();
        } else if (InputFlag == 4) {
            HostIP4.value = '';
            strHostIP4 = '';
            HostIP4.focus();
        } else if (InputFlag == 5) {
            HostPort.value = '';
            strHostPort = '';
            HostPort.focus();
        } else if (InputFlag == 6) {
            MonitorHostIP1.value = '';
            strMonitorHostIP1 = '';
            MonitorHostIP1.focus();
        } else if (InputFlag == 7) {
            MonitorHostIP2.value = '';
            strMonitorHostIP2 = '';
            MonitorHostIP2.focus();
        } else if (InputFlag == 8) {
            MonitorHostIP3.value = '';
            strMonitorHostIP3 = '';
            MonitorHostIP3.focus();
        } else if (InputFlag == 9) {
            MonitorHostIP4.value = '';
            strMonitorHostIP4 = '';
            MonitorHostIP4.focus();
        } else if (InputFlag == 10) {
            MonitorHostPort.value = '';
            strMonitorHostPort = '';
            MonitorHostPort.focus();
        }
    }

    var oKeyboardKey = document.getElementsByClassName("KeyboardKey");
    for (var i = 0; i < oKeyboardKey.length; i++) {
        var keyEvent = oKeyboardKey[i];
        keyEvent.onclick = function (e) {
            if ('退格' == this.innerText) {
                if (InputFlag == 1) {
                    if (strHostIP1.length != 0) {
                        strHostIP1 = strHostIP1.substr(0, (strHostIP1.length - 1));
                        HostIP1.value = strHostIP1;
                        HostIP1.focus();
                    }
                } else if (InputFlag == 2) {
                    if (strHostIP2.length != 0) {
                        strHostIP2 = strHostIP2.substr(0, (strHostIP2.length - 1));
                        HostIP2.value = strHostIP2;
                        HostIP2.focus();
                    }
                } else if (InputFlag == 3) {
                    if (strHostIP3.length != 0) {
                        strHostIP3 = strHostIP3.substr(0, (strHostIP3.length - 1));
                        HostIP3.value = strHostIP3;
                        HostIP3.focus();
                    }
                } else if (InputFlag == 4) {
                    if (strHostIP4.length != 0) {
                        strHostIP4 = strHostIP4.substr(0, (strHostIP4.length - 1));
                        HostIP4.value = strHostIP4;
                        HostIP4.focus();
                    }
                } else if (InputFlag == 5) {
                    if (strHostPort.length != 0) {
                        strHostPort = strHostPort.substr(0, (strHostPort.length - 1));
                        HostPort.value = strHostPort;
                        HostPort.focus();
                    }
                } else if (InputFlag == 6) {
                    if (strMonitorHostIP1.length != 0) {
                        strMonitorHostIP1 = strMonitorHostIP1.substr(0, (strMonitorHostIP1.length - 1));
                        MonitorHostIP1.value = strMonitorHostIP1;
                        MonitorHostIP1.focus();
                    }
                } else if (InputFlag == 7) {
                    if (strMonitorHostIP2.length != 0) {
                        strMonitorHostIP2 = strMonitorHostIP2.substr(0, (strMonitorHostIP2.length - 1));
                        MonitorHostIP2.value = strMonitorHostIP2;
                        MonitorHostIP2.focus();
                    }
                } else if (InputFlag == 8) {
                    if (strMonitorHostIP3.length != 0) {
                        strMonitorHostIP3 = strMonitorHostIP3.substr(0, (strMonitorHostIP3.length - 1));
                        MonitorHostIP3.value = strMonitorHostIP3;
                        MonitorHostIP3.focus();
                    }
                } else if (InputFlag == 9) {
                    if (strMonitorHostIP4.length != 0) {
                        strMonitorHostIP4 = strMonitorHostIP4.substr(0, (strMonitorHostIP4.length - 1));
                        MonitorHostIP4.value = strMonitorHostIP4;
                        MonitorHostIP4.focus();
                    }
                } else if (InputFlag == 10) {
                    if (strMonitorHostPort.length != 0) {
                        strMonitorHostPort = strMonitorHostPort.substr(0, (strMonitorHostPort.length - 1));
                        MonitorHostPort.value = strMonitorHostPort;
                        MonitorHostPort.focus();
                    }
                }

            } else if ('清除' == this.innerText) {
                onClearNum();
            } else {
                if (InputFlag == 1) {
                    if (strHostIP1.length < 3) {
                        strHostIP1 += this.innerText;
                        HostIP1.value = strHostIP1;
                    }
                } else if (InputFlag == 2) {
                    if (strHostIP2.length < 3) {
                        strHostIP2 += this.innerText;
                        HostIP2.value = strHostIP2;
                    }
                } else if (InputFlag == 3) {
                    if (strHostIP3.length < 3) {
                        strHostIP3 += this.innerText;
                        HostIP3.value = strHostIP3;
                    }
                } else if (InputFlag == 4) {
                    if (strHostIP4.length < 3) {
                        strHostIP4 += this.innerText;
                        HostIP4.value = strHostIP4;
                    }
                } else if (InputFlag == 5) {
                    if (strHostPort.length < 5) {
                        strHostPort += this.innerText;
                        HostPort.value = strHostPort;
                    }
                } else if (InputFlag == 6) {
                    if (strMonitorHostIP1.length < 3) {
                        strMonitorHostIP1 += this.innerText;
                        MonitorHostIP1.value = strMonitorHostIP1;
                    }
                } else if (InputFlag == 7) {
                    if (strMonitorHostIP2.length < 3) {
                        strMonitorHostIP2 += this.innerText;
                        MonitorHostIP2.value = strMonitorHostIP2;
                    }
                } else if (InputFlag == 8) {
                    if (strMonitorHostIP3.length < 3) {
                        strMonitorHostIP3 += this.innerText;
                        MonitorHostIP3.value = strMonitorHostIP3;
                    }
                } else if (InputFlag == 9) {
                    if (strMonitorHostIP4.length < 3) {
                        strMonitorHostIP4 += this.innerText;
                        MonitorHostIP4.value = strMonitorHostIP4;
                    }
                } else if (InputFlag == 10) {
                    if (strMonitorHostPort.length < 5) {
                        strMonitorHostPort += this.innerText;
                        MonitorHostPort.value = strMonitorHostPort;
                    }
                }
            }
        }
    }

    document.getElementById('KeyboardKey_set').onclick = function () {
        console.log('KeyboardKey_set:1-' + strHostIP1 + '-2-' + strHostIP2 + '-3-' + strHostIP3 + '-4-' + strHostIP4 + '端口-' + strHostPort);
        if ((strHostIP1 == "") || (strHostIP2 == "") || (strHostIP3 == "") || (strHostIP4 == "")||(strMonitorHostIP1 == "") || (strMonitorHostIP2 == "") || (strMonitorHostIP3 == "") || (strMonitorHostIP4 == "")) {
            document.getElementById("tipdiv").innerText = "输入的IP地址不能为空！";
        } else if ((strHostPort == "")||(strMonitorHostPort == "")) {
            document.getElementById("tipdiv").innerText = "输入的端口不能为空！";
        } else if ((strHostIP1 > 255) || (strHostIP2 > 255) || (strHostIP3 > 255) || (strHostIP4 > 255)||(strMonitorHostIP1 > 255) || (strMonitorHostIP2 > 255) || (strMonitorHostIP3 > 255) || (strMonitorHostIP4 > 255)) {
            document.getElementById("tipdiv").innerText = "IP地址输入错误！";
        } else if ((strHostPort > 65535) || (strHostPort < 1)||(strMonitorHostPort > 65535) || (strMonitorHostPort < 1)) {
            document.getElementById("tipdiv").innerText = "端口输入错误！";
        } else {
            var inputvalue1 = strHostIP1 + "." + strHostIP2 + "." + strHostIP3 + "." + strHostIP4;
            top.API.displayMessage('HOSTIP=' + inputvalue1);
            var net1 = top.API.Dat.WritePrivateProfileSync("MTCP", "HOSTIP", inputvalue1, top.API.Dat.GetBaseDir() + top.API.gIniSetupName);
            top.API.displayMessage("WritePrivateProfileSync HOSTPORT Return:" + net1);
            var inputvalue2 = strHostPort;
            top.API.displayMessage('HOSTPORT=' + inputvalue2);
            var net2 = top.API.Dat.WritePrivateProfileSync("MTCP", "HOSTPORT", inputvalue2, top.API.Dat.GetBaseDir() + top.API.gIniSetupName);
            top.API.displayMessage("WritePrivateProfileSync HOSTPORT Return:" + net2);
            // var addr = "http://" + arr[0] + ":" + arr[1];   
            var inputvalue3 = strMonitorHostIP1 + "." + strMonitorHostIP2 + "." + strMonitorHostIP3 + "." + strMonitorHostIP4;
            top.API.displayMessage('MonitorHOSTIP=' + inputvalue3);
            var inputvalue4 = strMonitorHostPort;
            top.API.displayMessage('MonitorHOSTPORT=' + inputvalue4);
            var inputvalueAddr = "http://" + inputvalue3 + ":" + inputvalue4;
            var net3 = top.API.Dat.WritePrivateProfileSync("MTCP", "MONITORHOSTIP", inputvalueAddr, top.API.Dat.GetBaseDir() + top.API.gIniSetupName);
            top.API.displayMessage("WritePrivateProfileSync MONITORHOSTIP Return:" + net3);

            return CallResponse('TradeSuccess');
        }
    }

    document.getElementById('Back').onclick = function () {
        ButtonDisable();
        return CallResponse('Back');
    }
    document.getElementById('PageRoot').onclick = function () {
        ButtonDisable();
        return CallResponse('Exit');
    }




    //Register the event


    //Countdown function
    function TimeoutCallBack() {

        return CallResponse('TimeOut');
    }
    //Page Return

    //remove all event handler
    function Clearup() {
        //TO DO:

    }
})();