(function () {
    function include(url, callback) {
        if (typeof url == 'string') {
            if (/\.[^\.]+$/.exec(url) == '.js') {
                var head = document.getElementsByTagName('head')[0];
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = url;
                head.appendChild(script);
                script.onload = script.onreadystatechange = function () {
                    if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                        callback();
                        // Handle memory leak in IE 
                        //script.onload = script.onreadystatechange = null;
                    }
                };
                //script.src = url;
                //head.appendChild(script);
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
				for (x in url)
				{
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

    var loadMainHtml = function () {
        document.getElementById("MAIN").src = "main.html";
    };

    var loadTopJs = function () {
        var includeList = new Array();
        includeList.push('./Utilitys/jquery-3.3.1.min.js');
        includeList.push('./Utilitys/Common.js');
        includeList.push('./Utilitys/Log.js');        
        //includeList.push('./Utilitys/jquery.js');         
        includeList.push('./Utilitys/RemoteVts.js'); 
        includeList.push('./Api/System/SystemDevices.js');
        includeList.push('./Api/System/CreateDevObject.js');
        includeList.push('./Api/System/CreateUSObject.js');
        includeList.push('./Api/Module/JSDevApi/JSApiCrd.js');
        includeList.push('./Api/Module/JSDevApi/JSDevApi.js');
        includeList.push('./Api/Module/JSDevApi/JSApiCim.js');
        includeList.push('./Api/Module/JSDevApi/JSApiCdm.js');
        includeList.push('./Api/Module/JSDevApi/JSApiFpi.js');
        includeList.push('./Api/Module/JSDevApi/JSApiPin.js');
        includeList.push('./Api/Module/JSDevApi/JSApiPtr.js');
        includeList.push('./Api/Module/JSDevApi/JSApiIdr.js');
        includeList.push('./Api/Module/JSDevApi/JSApiScr.js');
        includeList.push('./Api/Module/JSDevApi/JSApiSiu.js');
		includeList.push('./Api/Module/JSDevApi/JSApiCam.js');
		includeList.push('./Api/Module/JSDevApi/JSApiTfc.js');
        includeList.push('./Api/Module/JSDevApi/JSApiSpt.js');
        includeList.push('./Api/Module/JSUSApi/JSApiTcp.js');
        includeList.push('./Api/Module/JSUSApi/JSApiJnl.js');
        includeList.push('./Api/Module/JSUSApi/JSApiTsl.js');
        includeList.push('./Api/Module/JSUSApi/JSApiSys.js');
        includeList.push('./Api/Module/JSUSApi/JSApiDat.js');
        includeList.push('./Api/Module/JSUSApi/JSUSApi.js');
        includeList.push('./Api/Module/JSUSApi/JSApiIme.js');
        includeList.push('./Api/Module/JSUSApi/JSApiJst.js');
        includeList.push('./Api/Module/JSData.js');
        includeList.push('./Api/Module/JSCashInfo.js');
        includeList.push('./Api/Module/JSGlobal.js');
        includeList.push('./Api/API.js');
//		includeList.push('./Api/System/CreateABCObject.js');
//		includeList.push('./Api/Module/JSABCApi/JSApiAss.js');
//		includeList.push('./Api/Module/JSABCApi/JSApiFck.js');
//		includeList.push('./Api/Module/JSABCApi/JSApiRpm.js');
        try {
            include(includeList, loadMainHtml);
        }
        catch (err) {
            alert(err);
        }
    } ();  // executing the function when the js file  is loaded first.
})();