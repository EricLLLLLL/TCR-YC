(function(){
	
window.SystemDevices = function(ocxId ){
/*         var xmldom = new ActiveXObject("Microsoft.XMLDOM");
		// SELF
		xmldom.load('./Api/System/SystemDevices.xml');		
		// KAL
		//xmldom.load('./Api/System/SystemDevices_KAL.xml');
        if (xmldom.parseError != 0){
              throw new Error("XML parsing error: " + xmldom.parseError.reason);
		} */
		


		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", './Api/System/SystemDevices.xml', false);
		xmlhttp.setRequestHeader('Content-Type', 'text/xml');
		xmlhttp.send();
	var xmldom = xmlhttp.responseXML;



		var controls = xmldom.getElementsByTagName("control");
		for( var i=0; i< controls.length; i++ ){
			 if(controls[i].getAttributeNode("id").nodeValue == ocxId ){
			     this.OcxObjectName = controls[i].children[0].innerHTML;
			     this.OcxClassId = controls[i].children[1].innerHTML;
				 break;
			 }
		}
		var devices = xmldom.getElementsByTagName("device");
		for( var i=0; i< devices.length; i++ ){
			 if(devices[i].getAttributeNode("id").nodeValue == ocxId ){
			     this.serviceName = devices[i].children[0].innerHTML;
			     this.controlName = devices[i].children[1].innerHTML;
				 break;
			 }
		}
};
})();
