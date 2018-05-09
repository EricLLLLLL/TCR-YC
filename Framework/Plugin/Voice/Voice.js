(function(){
window.Voice = function(){
	var soundObj = null;
	var xmlDoc = null;
	var urlXml = "./Framework/Plugin/Voice/Voice.xml";
    
    this.init = function(){
        //var obj;
	    //obj = document.createElement("bgsound");
		//obj = document.createElement("embed");

		try{
			xmlDoc= document.implementation.createDocument("","",null); 
			xmlDoc.async = false;
			xmlDoc.load(urlXml);
		}catch(e){
			var xmlhttp=new window.XMLHttpRequest();  
			xmlhttp.open("GET",urlXml,false);  
			xmlhttp.send(null);  
			if(xmlhttp.readyState == 4){
				xmlDoc = xmlhttp.responseXML.documentElement; 
			}
		}
		//xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		//xmlDoc.async = false;
		//xmlDoc.load(urlXml);

		//obj.id = "ModuleSound";
		//obj.src = "";
		//obj.autostart = true;
		//obj.loop = false;
		//obj.hidden = true;
		//obj.height = 0;
		//obj.width = 0;

		soundObj = top.API.Jst;
		//document.body.appendChild(soundObj);
    };

    this.play = function( code ){
        var temp = null;
	    if (/^[0-9a-zA-Z_]+$/.test(code)) {
	        if (xmlDoc != null) {
	            var childList = xmlDoc.getElementsByTagName(code);
	            if (childList.length >= 1) {
	                temp = childList[0].getAttribute("path");
	            }
	        }
	    }
	    else {
	        temp = code;
	    }
	    if (soundObj == null){
	        init();
	    }
	    //if (temp != null){
	    //    soundObj.src = temp;
	    //}
	   // else{
	    //    soundObj.src = code;
	    //}
		soundObj.PlaySound(temp);
	    return true;
    };

    this.del = function(){
    	if (soundObj == null)
			init();
	soundObj.StopSound();
    };
};

})();
