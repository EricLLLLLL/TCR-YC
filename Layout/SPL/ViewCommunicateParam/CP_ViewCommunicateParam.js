/*@create by:  tsxiong
 *@time: 2016年03月20日
 */
;
(function () {
    var HostIP,
        HostPORT;
    var MonitorHostIpPort;
    var CallResponse = App.Cntl.ProcessOnce(function (Response) {
        //TO DO:
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        ButtonDisable();

        //@initialize scope start 
        showText();
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
    document.getElementById('Back').onclick = function () {
        ButtonDisable();
        return CallResponse('Back');

    }
    document.getElementById('PageRoot').onclick = function () {
        ButtonDisable();
        return CallResponse('Exit');
    }
    function showText() {
        HostIP = top.API.Dat.GetPrivateProfileSync("MTCP", "HOSTIP", "", top.API.Dat.GetBaseDir() + top.API.gIniSetupName);
        top.API.displayMessage("GetPrivateProfileSync HOSTIP Return:" + HostIP);
        document.getElementById("HOSTIP").value = HostIP
        // $("#HOSTIP").value = HostIP
        // 回显端口号
        HostPORT = top.API.Dat.GetPrivateProfileSync("MTCP", "HOSTPORT", "", top.API.Dat.GetBaseDir() + top.API.gIniSetupName);
        top.API.displayMessage("GetPrivateProfileSync HOSTPORT Return:" + HostPORT);
        document.getElementById("HOSTPORT").value = HostPORT;

        MonitorHostIpPort = top.API.Dat.GetPrivateProfileSync("MTCP", "MONITORHOSTIP", "", top.API.Dat.GetBaseDir() + top.API.gIniSetupName);
        top.API.displayMessage("GetPrivateProfileSync MONITORHOSTIP Return:" + MonitorHostIpPort);
        var arrMonitor = MonitorHostIpPort.substr(7, MonitorHostIpPort.length - 7).split(":");

        document.getElementById("MONITORSERVERIP").value = arrMonitor[0]
        document.getElementById("MONITORSERVERPORT").value = arrMonitor[1]

    }


})();
