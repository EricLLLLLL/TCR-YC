;(function () {
    var tab = document.getElementById('tab');
    var Rslt = 1; //总页数
    var CurPage = 1;//当前页数
    var nType = 0; //显示内容条数
    var xmlDom;
    var pages; //所有页面对象
    var DetailBtn;
    var StartNum = 0;
    var bDetailBtn = false;
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        Clearup();
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        ButtonDisable();
        DetailBtn = document.getElementsByName("detailBtn");
		CurPage = top.API.gCurPage;
        GetCrownData();
        FirstPage();
        document.getElementById('Back').disabled = false;
    }(); //Page Entry

    function ButtonDisable() {
        document.getElementById('UpPage').disabled = true;
        document.getElementById('Back').disabled = true;
        document.getElementById('DownPage').disabled = true;
    }
	
    function ButtonEnable() {
        document.getElementById('UpPage').disabled = false;
        document.getElementById('Back').disabled = false;
        document.getElementById('DownPage').disabled = false;
    }

    document.getElementById('Back').onclick = function () {
        //退出时还原全局数据
        top.API.gCurPage = 1;
        top.API.displayMessage("Back");
        ButtonDisable();
        return CallResponse('Back');
    }

    document.getElementById('UpPage').onclick = function () {
        top.API.displayMessage("UpPage");
        ClearTab();
        document.getElementById('DownPage').style.backgroundPositionY = "-35px;";
        document.getElementById('DownPage').disabled = false;
        CurPage--;
        top.API.gCurPage = CurPage;
        document.getElementById('CurrentPage').value = CurPage.toString();
        if (CurPage == 1) {//当前页数是总页数
            ShowResult(1);
            document.getElementById('UpPage').disabled = true;
            document.getElementById('UpPage').style.backgroundPositionY = "0px;";
        } else {
            ShowResult(CurPage);
        }
    }

    document.getElementById('DownPage').onclick = function () {
        top.API.displayMessage("DownPage");
        ClearTab();
        document.getElementById('UpPage').style.backgroundPositionY = "-70px;";
        document.getElementById('UpPage').disabled = false;
        CurPage++;
        top.API.gCurPage = CurPage;
        document.getElementById('CurrentPage').value = CurPage.toString();
        if (CurPage == Rslt) {
            ShowResult(CurPage);
            document.getElementById('DownPage').disabled = true;
            document.getElementById('DownPage').style.backgroundPositionY = "-105px;";
        } else {
            ShowResult(CurPage);
        }
    }

    //细节按钮点击事件
    function SetDetailBtn(Element) {
        for (var j = 0; j < Element.length; j++) {
            (function () {
                var inpt = Element[j];
                var p = j
                inpt.onclick = function () {
                    if (!bDetailBtn) {
                        bDetailBtn = true;
                        var curNo = p;
                        //var curNo = StartNum - p;
                        top.API.displayMessage("curNo=" + curNo + ",p=" + p);
                        top.API.gNoteId = curNo;
                        ButtonDisable();
                        return CallResponse('OK');
                    }
                }
            })();
        }
    }

    //细节按钮屏蔽事件
    function SetNoneBtn() {
        for (var j = 0; j < DetailBtn.length; j++) {
            DetailBtn[j].style.display = "none";
        }
    }

    function GetCrownData() {
        var _sFileName = top.arrGenneralFsn;//"C:\\Users\\Demon\\Desktop\\TCR-ABC.xml"
        var Files = new dynamicLoadFiles();
        xmlDom = Files.parseXml("C:/DATA/tmpFSN.XML");
        pages = xmlDom.getElementsByTagName("page");
    }

    function FirstPage() {
        Rslt = pages.length;
        if (Rslt > 1 && CurPage != Rslt) {
            document.getElementById('LastPage').value = Rslt.toString();
            document.getElementById('DownPage').style.backgroundPositionY = "-35px";
            document.getElementById('DownPage').disabled = false;
        }
		document.getElementById('CurrentPage').value = CurPage.toString();
		if (CurPage == 1) {//当前页数是总页数
            ShowResult(1);
            document.getElementById('UpPage').disabled = true;
            document.getElementById('UpPage').style.backgroundPositionY = "0px;";
        } else {
			document.getElementById('UpPage').disabled = false;
            document.getElementById('UpPage').style.backgroundPositionY = "-70px;";
            ShowResult(CurPage);
        }
    }

    function ShowResult(restPage) {
		console.log("restPage="+restPage);
        SetDetailBtn(DetailBtn);
        SetNoneBtn();
        if (typeof(pages) != "undefined") {
            nType = pages[restPage - 1].getAttribute("num");
            for (var i = 0; i < nType; i++) {
                var item = pages[restPage - 1].getElementsByTagName("item");
                tab.rows[i].cells[0].innerText = item[i].getAttribute("DataTime");
                tab.rows[i].cells[1].innerText = item[i].getAttribute("DealType");
                tab.rows[i].cells[3].innerText = item[i].getAttribute("CrownNum");
                tab.rows[i].cells[4].innerText = item[i].getAttribute("Currency");
                tab.rows[i].cells[5].innerText = item[i].getAttribute("Denomination");
                tab.rows[i].cells[6].innerText = item[i].getAttribute("NoteType");

                var Imgaddr = "";
                if (item[i].getAttribute("Imgaddr") != "") {
                    Imgaddr = "<img width ='100px' height='20px' src='" + item[i].getAttribute("Imgaddr") + "'/>";
                    tab.rows[i].cells[2].innerHTML = Imgaddr;
                }
                DetailBtn[i].style.display = "inline";
            }
            ButtonEnable();
        }
    }

    function ClearTab() {
        for (i = 0; i < tab.rows.length; i++) {
            for (j = 0; j < 7; j++) {
                if (j == 0) {
                    tab.rows[i].cells[j].innerHTML = "";
                } else {
                    tab.rows[i].cells[j].innerText = "";
                }
            }
        }
    }



    //remove all event handler
    function Clearup() {
        top.API.Tsl.UnInitFsnSync();
    }
})();
