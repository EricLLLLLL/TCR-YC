(function () {

    window.FlowsControl = function (FlowXmlName, PagePath) {

        var currentBusiness = null;
        var CurrentPage = null;
        var PageFilesPath = PagePath;
        var Files = new dynamicLoadFiles();
        var xmldom = Files.parseXml(FlowXmlName);
        //save the previous business.
        var businessArray = new Array();

        this.ProcessDriven = function (Rescode) {
            var BusinessItems = xmldom.getElementsByTagName("BusinessItem");
            var nextStepId;
            var sMessage = "Business=[" + currentBusiness + "],Page=[" + CurrentPage + "],Response=[" + Rescode + "]";
            top.API.displayMessage(sMessage);
            for (var i = 0; i < BusinessItems.length; i++) {
                if (BusinessItems[i].getAttributeNode("id").nodeValue == currentBusiness) {
                    var Items = BusinessItems[i].getElementsByTagName("Item");
                    for (var j = 0; j < Items.length; j++) {
                        if (Items[j].getAttributeNode("name").nodeValue == CurrentPage) {
                            var Responses = Items[j].getElementsByTagName("Response");
                            for (var k = 0; k < Responses.length; k++) {
                                if (Responses[k].getAttributeNode("code").nodeValue == Rescode) {
                                    nextStepId = Responses[k].getAttributeNode("next").nodeValue;
                                    if (nextStepId == "E") {
                                        CurrentPage = currentBusiness;
                                        currentBusiness = businessArray.pop();
                                        if (currentBusiness == 'Start') {
                                            this.StartBusiness();
                                        } else {
                                            this.ProcessDriven(Rescode);
                                        }
                                        return;

                                    }
                                    break;
                                }
                            }//end Response
                            break;
                        }
                    }//end Item
                    NextAction(Items, nextStepId);
                    return;
                }

            }//end FlowItem

        };

        this.StartBusiness = function () {
            GotoBusiness("Start");
            businessArray.splice(0, businessArray.length);
            businessArray.push("Start");
        };

        var NextAction = function (Items, nextStepId) {
            var nextItem;
            for (var j = 0; j < Items.length; j++) {
                if (Items[j].getAttributeNode("id").nodeValue == nextStepId) {
                    if (Items[j].getAttributeNode("type").nodeValue == "C") {
                        //save the current business type
                        businessArray.push(currentBusiness);
                        var nextTransaction = Items[j].getAttributeNode("name").nodeValue;
                        GotoBusiness(nextTransaction);
                        return;
                    } else if (Items[j].getAttributeNode("type").nodeValue == "F") {
                        nextItem = Items[j].getAttributeNode("name").nodeValue;
                        LoadingFunction(nextItem);
                        return;
                    } else if (Items[j].getAttributeNode("type").nodeValue == "P") {
                        nextItem = Items[j].getAttributeNode("name").nodeValue;
                        LoadingPageStuff(nextItem);
                        return;
                    } else {
                        alert("Error direction");
                    }
                }
            }
        };

        var GotoBusiness = function (Entrance) {
            var BusinessItems = xmldom.getElementsByTagName("BusinessItem");
            var nextItem;
            var entrance;
            for (var i = 0; i < BusinessItems.length; i++) {
                if (BusinessItems[i].getAttributeNode("id").nodeValue == Entrance) {
                    var Items = BusinessItems[i].getElementsByTagName("Item");
                    entrance = BusinessItems[i].getAttributeNode("entrance").nodeValue;
                    for (var j = 0; j < Items.length; j++) {
                        if (Items[j].getAttributeNode("id").nodeValue == entrance) {
                            nextItem = Items[j].getAttributeNode("name").nodeValue;
                            break;
                        }
                    }
                    break;
                }
            }
            currentBusiness = Entrance; //Save the current business type 
            NextAction(Items, entrance);
        };

        var GetPageName = function (chname) {
            var foldername;
            var filename;
            var PageItems = xmldom.getElementsByTagName("PageItem");
            for (var i = 0; i < PageItems.length; i++) {
                var Pages = PageItems[i].getElementsByTagName("Page");
                for (var j = 0; j < Pages.length; j++) {
                    if (Pages[j].getAttributeNode("id").nodeValue == chname) {
                        var TimeOut = Pages[j].getAttributeNode("timeout").nodeValue;
                        App.Timer.SetPageTimeout(TimeOut);
                        foldername = PageFilesPath + Pages[j].getAttributeNode("foldername").nodeValue;
                        filename = foldername + "\\" + Pages[j].getAttributeNode("tracename").nodeValue;
                        return filename;
                    }
                }
            }
            return null;
        };

        var GetFunctionName = function (chname) {
            var method;
            var filename;
            var FunctionItems = xmldom.getElementsByTagName("FunctionItem");
            for (var i = 0; i < FunctionItems.length; i++) {
                var Functions = FunctionItems[i].getElementsByTagName("Function");
                for (var j = 0; j < Functions.length; j++) {
                    if (Functions[j].getAttributeNode("id").nodeValue == chname) {
                        var filename = Functions[j].getAttributeNode("filename").nodeValue;
                        var tracename = Functions[j].getAttributeNode("tracename").nodeValue;
                        // method = filename + '.' + tracename;
                        top.JsFilename = filename + '.js->' + tracename;
                        return tracename;
                    }
                }
            }
            return null;
        };

        var LoadingPageStuff = function (nextitem) {

            CurrentPage = nextitem;//Save the current page 
            var Nextfile = GetPageName(nextitem);

            var cssfile = Nextfile + ".css";
            var jsfile = Nextfile + ".js";
            var xmlfile = Nextfile + ".xml";
            top.JsFilename = jsfile;

            var delDiv = document.getElementById("PageId");
            if (delDiv != null) {
              //  $("#PageId").animate({
                 //   left: "0px",
                   // opacity: '0.1'
                //}, 400, function () {
                    document.body.removeChild(delDiv);
                    Files.xml(xmlfile);
                    Files.js(jsfile);
             //   });

            } else {
                Files.xml(xmlfile);
                Files.js(jsfile);
            }

            //----------------------屏蔽浏览器事件start------------------------
            function eventIgnore(e) {
                e.preventDefault();
                return false;
            }
            if (document.layers) {
                document.captureEvents(Event.MOUSEDOWN);
            }
            //document.ontouchstart = eventIgnore;
            document.ontouchmove = eventIgnore;
            //document.ontouchend = eventIgnore;
            document.ondragstart = eventIgnore;
            //document.onselectstart = eventIgnore;
            document.ondrag = eventIgnore;
            document.ondragend = eventIgnore;
            //document.onselect = eventIgnore;
            document.onscroll = eventIgnore;
            document.ondblclick = eventIgnore;
            document.ondrop = eventIgnore;
            //document.oncontextmenu = eventIgnore;
            //-----------------------屏蔽浏览器事件end-------------------------

        };

        var LoadingFunction = function (nextitem) {
            CurrentPage = nextitem;
            var CallFunction = GetFunctionName(nextitem);
            CallFunction = "App.Func." + CallFunction;
            top.API.displayMessage("Entry->" + CallFunction + "()");
            eval(CallFunction + '()');  //invoke the method
        };

		//然函数只执行一次
        this.ProcessOnce = function(fn, context) { 
           var result;
           return function() { 
			   if(fn) {
					result = fn.apply(context || this, arguments);
					fn = null;
				}
				return result;
			};
		}
    };

})();
