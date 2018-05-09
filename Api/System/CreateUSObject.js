/**
 * Created by Administrator on 2017/1/6.
 */
(function() {

    window.CreateUSObject = function () {

        var insertObject = function (objID, CLASSID) {
            //var ActiveXobject = document.createElement("object");
            //ActiveXobject.setAttribute("id", objID);
            //ActiveXobject.setAttribute("classid", CLASSID);
            //ActiveXobject.setAttribute("width", "0");
            //ActiveXobject.setAttribute("height", "0");
            //ActiveXobject.setAttribute("style", "top:0px; left:0px;z-index:0; position:absolute;width:0px;height:0px;");
            //document.body.appendChild(ActiveXobject);
            //return document.getElementById(objID);
            eval("var ActiveXobject = window." + CLASSID);
            return ActiveXobject;
        };
        this.CreateTcpObj = function () {
            JSApiTcp.prototype = new JSApiTcp();
            var SysId = new SystemDevices("TCP");
            var obj = insertObject(SysId.OcxObjectName, SysId.OcxClassId);
            var JsTcp = new JSApiTcp(SysId.serviceName, SysId.controlName, obj);
            displayMessage(SysId.OcxObjectName + "|" + SysId.OcxClassId);
            return JsTcp;
        };
        this.CreateJnlObj = function () {
            JSApiJnl.prototype = new JSApiJnl();
            var SysId = new SystemDevices("JNL");
            var obj = insertObject(SysId.OcxObjectName, SysId.OcxClassId);
            var JsJnl = new JSApiJnl(SysId.serviceName, SysId.controlName, obj);
            displayMessage(SysId.OcxObjectName + "|" + SysId.OcxClassId);
            return JsJnl;
        };
        this.CreateSysObj = function () {
            JSApiSys.prototype = new JSApiSys();
            var SysId = new SystemDevices("SYS");
            var obj = insertObject(SysId.OcxObjectName, SysId.OcxClassId);
            var JsSys = new JSApiSys(SysId.serviceName, SysId.controlName, obj);
            displayMessage(SysId.OcxObjectName + "|" + SysId.OcxClassId);
            return JsSys;
        };
        this.CreateTslObj = function () {
            JSApiTsl.prototype = new JSApiTsl();
            var SysId = new SystemDevices("TSL");
            var obj = insertObject(SysId.OcxObjectName, SysId.OcxClassId);
            var JsTsl = new JSApiTsl(SysId.serviceName, SysId.controlName, obj);
            displayMessage(SysId.OcxObjectName + "|" + SysId.OcxClassId);
            return JsTsl;
        };
        this.CreateDatObj = function () {
        JSApiDat.prototype = new JSApiDat();
        var SysId = new SystemDevices("DAT");
        var obj = insertObject(SysId.OcxObjectName, SysId.OcxClassId);
        var JsDat = new JSApiDat(SysId.serviceName, SysId.controlName, obj);
        displayMessage(SysId.OcxObjectName + "|" + SysId.OcxClassId);
        return JsDat;
    };
    this.CreateImeObj = function () {
        JSApiIme.prototype = new JSApiIme();
        var SysId = new SystemDevices("IME");
        var obj = insertObject(SysId.OcxObjectName, SysId.OcxClassId);
        var JsIme = new JSApiIme(SysId.serviceName, SysId.controlName, obj);
        displayMessage(SysId.OcxObjectName + "|" + SysId.OcxClassId);
        return JsIme;
    };
   this.CreateJstObj = function () {
        JSApiJst.prototype = new JSApiJst();
        var SysId = new SystemDevices("JSTOOL");
        var obj = insertObject(SysId.OcxObjectName, SysId.OcxClassId);
        var JsJst = new JSApiJst(SysId.serviceName, SysId.controlName, obj);
        displayMessage(SysId.OcxObjectName + "|" + SysId.OcxClassId);
        return JsJst;
    };
/*
   this.CreateSudObj = function () {
        JSApiSud.prototype = new JSApiSud();
        var SysId = new SystemDevices("SUD");
        var obj = insertObject(SysId.OcxObjectName, SysId.OcxClassId);
        var JsSud = new JSApiSud(SysId.serviceName, SysId.controlName, obj);
        displayMessage(SysId.OcxObjectName + "|" + SysId.OcxClassId);
        return JsSud;
    };

   this.CreateDwnObj = function () {
        JSApiDwn.prototype = new JSApiDwn();
        var SysId = new SystemDevices("DWN");
        var obj = insertObject(SysId.OcxObjectName, SysId.OcxClassId);
        var JsDwn = new JSApiDwn(SysId.serviceName, SysId.controlName, obj);
        displayMessage(SysId.OcxObjectName + "|" + SysId.OcxClassId);
        return JsDwn;
    };
*/



    };
})()
