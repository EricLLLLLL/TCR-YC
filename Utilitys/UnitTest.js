(function(){
	top.API = "";
    var ArrayCPLFiles   = new Array(); 
	var ArraySPLFiles   = new Array(); 
    var Files = new dynamicLoadFiles();
	var mydiv1,mydiv2;
	var mode = 2 //1 = index  2 = supervise;
	var dynamicCreateLine = function( Msg ){
	   var mydiv=document.getElementById("ShowDiv");
	   var input =document.createElement("input");
	   input.type = "button";
	   input.name = "input_line";
	   input.style.color = "white";
	   input.value= Msg;
       input.style.left = "0px";
	   input.style.fontSize ="30px";
	   input.style.width = "1280px";
       input.style.backgroundColor= "red";
	   mydiv.appendChild(input);
	}
         
    var dynamicCreateButton = function( msg ,nId,ArrayFiles){
    	    var mydiv=document.getElementById("ShowDiv");
            var input =document.createElement("input");
            input.id=nId;
            input.type="button";
            input.value=msg;
            input.style.color = "white";
            input.style.left = "0px";
			input.style.fontSize ="15px";
            input.style.backgroundColor= "green";
            input.style.float="left";
            input.onclick = function( ){
                var delDiv= document.getElementById("PageId");
                if( delDiv != null ){
                   document.body.removeChild(delDiv); 
                }
                mydiv.style.display="none";
                Files.xml(ArrayFiles[this.value]);
            };
            mydiv.appendChild(input);
           return input;
    } 

    var LoadCPLAllPage  = function(){
        var xmldom = Files.parseXml("./Framework/FlowXml/C_FlowConfig.xml");
        var PageItems = xmldom.getElementsByTagName("PageItem");
    	var id;
    	var filename;
        for( var i=0; i<PageItems.length; i++){
            var Pages = PageItems[i].getElementsByTagName("Page");
            for(var j=0; j<Pages.length; j++ ) {
            	 id = Pages[j].getAttributeNode("id").nodeValue;
                var foldername = "Layout\\CPL\\" + Pages[j].getAttributeNode("foldername").nodeValue;
                filename =  foldername + "\\"  + Pages[j].getAttributeNode("tracename").nodeValue;
                filename += ".xml";
                ArrayCPLFiles[id ] = filename;
                var Page;
                Page += j;
                dynamicCreateButton(id,Page,ArrayCPLFiles);
            }
        }
        
    } 
	
	var LoadSPLAllPage  = function(){
        var xmldom = Files.parseXml("./Framework/FlowXml/S_FlowConfig.xml");
    	var PageItems = xmldom.getElementsByTagName("PageItem");
    	var id;
    	var filename;
        for( var i=0; i<PageItems.length; i++){
            var Pages = PageItems[i].getElementsByTagName("Page");
            for(var j=0; j<Pages.length; j++ ) {
            	 id = Pages[j].getAttributeNode("id").nodeValue;
                var foldername = "Layout\\SPL\\" + Pages[j].getAttributeNode("foldername").nodeValue;
                filename =  foldername + "\\"  + Pages[j].getAttributeNode("tracename").nodeValue;
                filename += ".xml";
                ArraySPLFiles[id ] = filename;
                var Page;
                Page += j;
                dynamicCreateButton(id,Page,ArraySPLFiles);
            }
        }
        
    } 

	var StartUnitTest = function () {
		if (mode == 1){
			Files.css("./Framework/style/style.css");
			Files.css("./Framework/style/Button.css");
		}else{
			Files.css("./Framework/style/SPL_style.css");
		}
	    

	    //
		dynamicCreateLine("客户交易界面");
      	LoadCPLAllPage();
		dynamicCreateLine("系统维护界面");
		LoadSPLAllPage();
     }();
})();
