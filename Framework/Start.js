(function () {
    function include(url, callback) {
        if (typeof url == 'string') {
            if (/\.[^\.]+$/.exec(url) == '.js') {
                var head = document.getElementsByTagName('head')[0];
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.onload = script.onreadystatechange = function () {
                    if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                        callback();
                        // Handle memory leak in IE 
                        script.onload = script.onreadystatechange = null;
                        //displayMessage(url);
                    }
                };
                script.src = url;
                head.appendChild(script);
            } else if (/\.[^\.]+$/.exec(url) == '.css') {
                var head = document.getElementsByTagName('head')[0];
                var link = document.createElement('link');
                link.href = url;
                link.rel = 'stylesheet';
                link.type = 'text/css';
                head.appendChild(link);
                callback();

            }
        }

        else {//
            if ((typeof url == 'object') && (url.length > 0)) {
                var tempArr = new Array();
                for (x in url) {
                    tempArr[x] = url[x]; //
                }
                include(tempArr.shift(), function () {
                    if (tempArr.length == 0)
                        callback();
                    else
                        include(tempArr, callback);
                });
            }
            else {
                throw 'Parameter error!';
            }
        }
    }
    window.onbeforeunload = function () {
        top.API.Jnl.PrintSync("CloseApp");
        top.API.OCXUnregister();
    }

    var Start = function () {
        top.API.initialize();
        top.API.OCXRegister();
        App.initialize();
    }

    $(document).ready(function () {
        var includeList = new Array();
        //*********************公共css、js文件加载**************************//
        includeList.push('./Framework/Plugin/Waiting/Waiting.css');
        includeList.push('./Framework/ScriptEngine/DynamicLoadFiles.js');
        includeList.push('./Framework/Function/InnerFunction.js');
		//includeList.push('./Framework/Function/GlobalFunction.js');
        includeList.push('./Framework/ScriptEngine/TimeControl.js');
        includeList.push('./Framework/ScriptEngine/FlowsControl.js');
        includeList.push('./Framework/Plugin/Waiting/Waiting.js');
        includeList.push('./Framework/Plugin/keyboard/keyboard.css');
        includeList.push('./Framework/Plugin/keyboard/keyboard.js');
        includeList.push('./Framework/Plugin/Advert/Advert.css');
        includeList.push('./Framework/Plugin/Advert/Advert.js');
        includeList.push('./Framework/Plugin/Voice/Voice.js');
        includeList.push('./Framework/Plugin/ImeHM/ImeHM.js');
        includeList.push('./Utilitys/InputMethod.js');
        includeList.push('./Utilitys/MD5.js');
        //*****************************************************************//
        var htmlName = top.getHtmlFileName();
        //*******************交易页面css、js文件加载***********************//
        if (htmlName == 'index') {
            includeList.push('./Framework/style/style.css');
            includeList.push('./Framework/style/Button.css');
        } else if (htmlName == 'Supervise') {
            //*******************管理员页面css、js文件加载***********************//
            includeList.push('./Framework/style/SPL_style.css');
        } else {
            alert("Cann't find the html, please conform your html name.");
        }
        //*****************************************************************//
        //the last file
        includeList.push('./Framework/Plugin/Plugin.js');
        includeList.push('./Framework/App.js');
        try {
            include(includeList, Start);
        }
        catch (err) {
            alert(err);
        }

    }); // executing the function when the js file  is loaded first.
})();