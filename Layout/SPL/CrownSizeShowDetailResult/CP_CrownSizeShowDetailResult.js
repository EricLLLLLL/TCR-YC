; (function(){
    var xmldom;
    var arrArray = new Array();
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        App.Cntl.ProcessDriven( Response );
    });
    var Initialize = function() {
        ButtonDisable();
        ShowInfo();
    }();//Page Entry

   //@User ocde scope start
    document.getElementById('Back').onclick = function(){
         return CallResponse('Back');
    }

    function ButtonDisable() {
		document.getElementById('Back').disabled = true;		
    }

    function ButtonEnable(){
         document.getElementById('Back').disabled = false;
    } 



	function ShowInfo() {
        var Files = new dynamicLoadFiles();
        xmlDom = Files.parseXml("C:/DATA/tmpFSN.XML");
        var pages = xmlDom.getElementsByTagName("page");
        //需要当前页面的页数
        var item = pages[top.API.gCurPage-1].getElementsByTagName("item");
        var Imgaddr = "";
        if(item[top.API.gNoteId].getAttribute("Imgaddr")!= ""){
            Imgaddr = "<img width ='120px' height='25px' src='" + item[top.API.gNoteId].getAttribute("Imgaddr") + "'/>";
		}
        document.getElementById('CrownImg').innerHTML = Imgaddr;
        document.getElementById('CrownNum').innerHTML = item[top.API.gNoteId].getAttribute("CrownNum");
        document.getElementById('DateTime').innerHTML = item[top.API.gNoteId].getAttribute("DataTime");
        document.getElementById('NoteId').innerHTML = item[top.API.gNoteId].getAttribute("NoteId");
        document.getElementById('Denomination').innerHTML =item[top.API.gNoteId].getAttribute("Denomination");
        document.getElementById('Currency').innerHTML = item[top.API.gNoteId].getAttribute("Currency");
        document.getElementById('DealType').innerHTML = item[top.API.gNoteId].getAttribute("DealType");
        document.getElementById('JnlNum').innerHTML = item[top.API.gNoteId].getAttribute("JnlNum");
        document.getElementById('CardNum').innerHTML = item[top.API.gNoteId].getAttribute("CardNum");
        document.getElementById('NoteType').innerHTML = item[top.API.gNoteId].getAttribute("NoteType");
        ButtonEnable();
    }


})();
