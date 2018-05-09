(function () {

    window.dynamicLoadFiles = function () {

        this.parseXml = function (xml) {
            var xmldom = null;
            xmldom = new ActiveXObject("Microsoft.XMLDOM");
            xmldom.load(xml);
            if (xmldom.parseError != 0) {
                throw new Error("XML parsing error: " + xmldom.parseError.reason);
            }
            return xmldom;
        };

        this.css = function (path) {
            if (!path || path.length === 0) {
                throw new Error('argument "path" is required !');
            }
            var head = document.getElementsByTagName('head')[0];
            var link = document.createElement('link');
            link.href = path;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            head.appendChild(link);
        };

        this.js = function (path) {
            if (!path || path.length === 0) {
                throw new Error('argument "path" is required !');
            }
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.onload = script.onreadystatechange = function () {
                if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                        // Handle memory leak in IE 
                        script.onload = script.onreadystatechange = null;
                }
            };
            script.src = path;
            head.appendChild(script);
        };

        this.xml = function (path) {
            var xmldom = null;
            try {
                xmldom = this.parseXml(path);
                var xmldata = xmldom.xml;
                var docObj = document.createElement('Newdiv');
                docObj.className = 'PageDiv';
                docObj.id = 'PageId';
                docObj.innerHTML = xmldata;
                //docObj.style.backgroundImage = "./Framework/style/Graphics/bg.jpg";
                document.body.appendChild(docObj);//页面DIV插入到body中

                //$("#PageId").slideDown(500);

                //屏蔽a标签锚链接
                var aTags = document.getElementsByTagName("a");
                for (var i = 0; i < aTags.length; i++) {
                    if (aTags[i].hasAttribute("href"))
                        aTags[i].removeAttribute("href");
                }

                //显示后台管理页面当前时间
                var oCurrentTime = document.getElementById("LocalTime");
                if (oCurrentTime != null) {
                    document.getElementById("LocalTime").innerText = "";
                    var showTime = function () {
                        var time = new Date();
                        oCurrentTime.innerText = time.toLocaleString().replace(/年/, "-").replace(/月/, "-").replace(/日/, "");
                    }
                    setInterval(showTime, 1000);
                }
                var oSubBankId = document.getElementById("SubBankId");
                if (oSubBankId != null) {
                    oSubBankId.innerText = top.API.gSubBankNum;
                }
            } catch (ex) {
                alert(ex.message);
            }
        };

        this.InsertPlgin = function (path, InsertdivId, plginId) {
            var xmldom = null;
            try {
                xmldom = this.parseXml(path);
                var xmldata = xmldom.xml;
                var docObj = document.createElement('div');
                docObj.id = plginId;
                docObj.innerHTML = xmldata;
                //inserting the div which appeared in the html body
                document.getElementById(InsertdivId).appendChild(docObj);
            } catch (ex) {
                alert(ex.message);
            }
        };
    };

})();

