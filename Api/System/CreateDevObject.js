/*@module:CreateObject
 *@create by:  hyhua
 *@time: 2015年11月20日
 ****************************************
 *@功能描述:
 *动态创建OCX类对象。
 *同时创建各子类的OCX对象。
 *需要增加模块时模拟CreateCrdObj编写
 ***************************************
 */

(function(){

window.CreateDevObject = function(){

     var insertObject = function(objID, CLASSID){
     	    //var ActiveXobject = document.createElement("object");
            //ActiveXobject.setAttribute("id",objID);
            //ActiveXobject.setAttribute("classid",CLASSID);
            //ActiveXobject.setAttribute("width","0");
            //ActiveXobject.setAttribute("height","0");
            //ActiveXobject.setAttribute("style","top:0px; left:0px;z-index:0; position:absolute;width:0px;height:0px;");
            //document.body.appendChild(ActiveXobject);
            //return document.getElementById(objID);
            eval("var ActiveXobject = window."+CLASSID);
            return ActiveXobject;
     };
	 

     this.CreateCrdObj = function(){
     	  JSApiCrd.prototype = new JSApiCrd();
		  var SysId = new SystemDevices("IDC");
          var obj = insertObject(SysId.OcxObjectName,SysId.OcxClassId);
          var JsCrd = new JSApiCrd(SysId.serviceName,SysId.controlName,obj);
		  displayMessage(SysId.OcxObjectName + "|" + SysId.OcxClassId);
          return JsCrd;
     };

     this.CreateCimObj = function () {
          JSApiCim.prototype = new JSApiCim();
          var SysId = new SystemDevices("CIM");
          var obj = insertObject(SysId.OcxObjectName, SysId.OcxClassId);
          var JsCim = new JSApiCim(SysId.serviceName, SysId.controlName, obj);
          displayMessage(SysId.OcxObjectName + "|" + SysId.OcxClassId);
          return JsCim;
      };
      this.CreateCdmObj = function () {
          JSApiCdm.prototype = new JSApiCdm();
          var SysId = new SystemDevices("CDM");
          var obj = insertObject(SysId.OcxObjectName, SysId.OcxClassId);
          var JsCdm = new JSApiCdm(SysId.serviceName, SysId.controlName, obj);
          displayMessage(SysId.OcxObjectName + "|" + SysId.OcxClassId);
          return JsCdm;
      };
  this.CreateFpiObj = function () {
          JSApiFpi.prototype = new JSApiFpi();
          var SysId = new SystemDevices("FPI");
          var obj = insertObject(SysId.OcxObjectName, SysId.OcxClassId);
          var JsFpi = new JSApiFpi(SysId.serviceName, SysId.controlName, obj);
          displayMessage(SysId.OcxObjectName + "|" + SysId.OcxClassId);
          return JsFpi;
      };
  this.CreatePinObj = function(){
          JSApiPin.prototype = new JSApiPin();
		  var SysId = new SystemDevices("PIN");
          var obj = insertObject(SysId.OcxObjectName,SysId.OcxClassId);
          var JsPin= new JSApiPin(SysId.serviceName,SysId.controlName,obj);
		  displayMessage(SysId.OcxObjectName + "|" + SysId.OcxClassId);
          return JsPin;
      };
  this.CreatePtrObj = function () {
          JSApiPtr.prototype = new JSApiPtr();
          var SysId = new SystemDevices("PTR");
          var obj = insertObject(SysId.OcxObjectName, SysId.OcxClassId);
          var JsPtr = new JSApiPtr(SysId.serviceName, SysId.controlName, obj);
          displayMessage(SysId.OcxObjectName + "|" + SysId.OcxClassId);
          return JsPtr;
      };
   this.CreateIdrObj = function () {
          JSApiIdr.prototype = new JSApiIdr();
          var SysId = new SystemDevices("IDR");
          var obj = insertObject(SysId.OcxObjectName, SysId.OcxClassId);
          var JsIdr = new JSApiIdr(SysId.serviceName, SysId.controlName, obj);
          displayMessage(SysId.OcxObjectName + "|" + SysId.OcxClassId);
          return JsIdr;
      };
   this.CreateScrObj = function () {
        JSApiScr.prototype = new JSApiScr();
        var SysId = new SystemDevices("SCR");
        var obj = insertObject(SysId.OcxObjectName, SysId.OcxClassId);
        var JsScr = new JSApiScr(SysId.serviceName, SysId.controlName, obj);
        displayMessage(SysId.OcxObjectName + "|" + SysId.OcxClassId);
        return JsScr;
    };
    this.CreateSiuObj = function () {
        JSApiSiu.prototype = new JSApiSiu();
        var SysId = new SystemDevices("SIU");
        var obj = insertObject(SysId.OcxObjectName, SysId.OcxClassId);
        var JsSiu = new JSApiSiu(SysId.serviceName, SysId.controlName, obj);
        displayMessage(SysId.OcxObjectName + "|" + SysId.OcxClassId);
        return JsSiu;
    };
    this.CreateCamObj = function () {
        JSApiCam.prototype = new JSApiCam();
        var SysId = new SystemDevices("CAM");
        var obj = insertObject(SysId.OcxObjectName, SysId.OcxClassId);
        var JsCam = new JSApiCam(SysId.serviceName, SysId.controlName, obj);
        displayMessage(SysId.OcxObjectName + "|" + SysId.OcxClassId);
        return JsCam;
    };
    this.CreateTfcObj = function () {
        JSApiTfc.prototype = new JSApiTfc();
        var SysId = new SystemDevices("TFC");
        var obj = insertObject(SysId.OcxObjectName, SysId.OcxClassId);
        var JsTfc = new JSApiTfc(SysId.serviceName, SysId.controlName, obj);
        displayMessage(SysId.OcxObjectName + "|" + SysId.OcxClassId);
        return JsTfc;
    };
    this.CreateSptObj = function () {
        JSApiTfc.prototype = new JSApiSpt();
        var SysId = new SystemDevices("SPT");
        var obj = insertObject(SysId.OcxObjectName, SysId.OcxClassId);
        var JsSpt = new JSApiSpt(SysId.serviceName, SysId.controlName, obj);
        displayMessage(SysId.OcxObjectName + "|" + SysId.OcxClassId);
        return JsSpt;
    };
 };

 })();