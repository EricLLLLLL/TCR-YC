/**
 * Created by Administrator on 2017/1/6.
 */
(function() {

    window.CreateABCObject = function () {

        var insertObject = function (objID, CLASSID) {
            var ActiveXobject = document.createElement("object");
            ActiveXobject.setAttribute("id", objID);
            ActiveXobject.setAttribute("classid", CLASSID);
            ActiveXobject.setAttribute("width", "0");
            ActiveXobject.setAttribute("height", "0");
            ActiveXobject.setAttribute("style", "top:0px; left:0px;z-index:0; position:absolute;width:0px;height:0px;");
            document.body.appendChild(ActiveXobject);
            return document.getElementById(objID);
        };
		  this.CreateAssObj = function () {
			  //To do
			  JSApiAss.prototype = new JSApiAss();
			  var SysId = new SystemDevices("ASS");
			  var obj = insertObject(SysId.OcxObjectName, SysId.OcxClassId);
			  var JsAss = new JSApiAss(SysId.serviceName, SysId.controlName, obj);
			  displayMessage(SysId.OcxObjectName + "|" + SysId.OcxClassId);
			  return JsAss;
		  };

		  this.CreateRpmObj = function () {
			  //To do
			  JSApiRpm.prototype = new JSApiRpm();
			  var SysId = new SystemDevices("RPM");
			  var obj = insertObject(SysId.OcxObjectName, SysId.OcxClassId);
			  var JsRpm = new JSApiRpm(SysId.serviceName, SysId.controlName, obj);
			  displayMessage(SysId.OcxObjectName + "|" + SysId.OcxClassId);
			  return JsRpm;
		  };

		  this.CreateFckObj = function () {
			  //To do
			  JSApiFck.prototype = new JSApiFck();
			  var SysId = new SystemDevices("FCK");
			  var obj = insertObject(SysId.OcxObjectName, SysId.OcxClassId);
			  var JsFck = new JSApiFck(SysId.serviceName, SysId.controlName, obj);
			  displayMessage(SysId.OcxObjectName + "|" + SysId.OcxClassId);
			  return JsFck;
		  };

    };
})()
