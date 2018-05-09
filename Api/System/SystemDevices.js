(function(){
	
window.SystemDevices = function(ocxId ){
        var xmldom = null;
        var urlXml = "./Api/System/SystemDevices.xml";
        //var urlXml = "./Api/System/SystemDevices_KAL.xml";
        try{
			xmldom= document.implementation.createDocument("","",null); 
			xmldom.async = false;
			xmldom.load(urlXml);
		}catch(e){
			var xmlhttp = new window.XMLHttpRequest();
			xmlhttp.open("GET",urlXml,false);
			xmlhttp.send(null);
			if(xmlhttp.readyState == 4){
				xmldom = xmlhttp.responseXML.documentElement;
			} 
		}
        //var xmldom = new ActiveXObject("Microsoft.XMLDOM");
		// SELF
        //xmldom.load('./Api/System/SystemDevices.xml');                  
		// KAL
		//xmldom.load('./Api/System/SystemDevices_KAL.xml');
        //if (xmldom.parseError != 0){
        //      throw new Error("XML parsing error: " + xmldom.parseError.reason);
        //}
		var controls = xmldom.getElementsByTagName("control");
		for( var i=0; i< controls.length; i++ ){
			 if(controls[i].getAttributeNode("id").nodeValue == ocxId ){
				this.OcxObjectName = controls[i].firstElementChild.firstChild.textContent;
				this.OcxClassId = controls[i].lastElementChild.firstChild.textContent;
				 break;
			 }
		}
		var devices = xmldom.getElementsByTagName("device");
		for( var i=0; i< devices.length; i++ ){
			 if(devices[i].getAttributeNode("id").nodeValue == ocxId ){
				this.serviceName = devices[i].firstElementChild.firstChild.textContent;
				this.controlName = devices[i].lastElementChild.firstChild.textContent;
				 break;
			 }
		}
};
})();
