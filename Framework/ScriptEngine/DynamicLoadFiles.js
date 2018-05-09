(function () {

    window.dynamicLoadFiles = function () {

        this.parseXml = function (xml) {
            var xmldom = null;
            try{
    			xmldom= document.implementation.createDocument("","",null); 
    			xmldom.async = false;
    			xmldom.load(xml);
    		}catch(e){
    			var xmlhttp=new window.XMLHttpRequest();  
    			xmlhttp.open("GET",xml,false);  
    			xmlhttp.send(null);  
				if(xmlhttp.readyState == 4){
					xmldom = xmlhttp.responseXML.documentElement; 
				}
    		}
            //xmldom = new ActiveXObject("Microsoft.XMLDOM");
            //xmldom.load(xml);
            //if (xmldom.parseError != 0) {
            //    throw new Error("XML parsing error: " + xmldom.parseError.reason);
            //}
            return xmldom;
        };
		
		this.parseXmlText = function (xml) {
            var xmldom = null;
            try{
    			xmldom= document.implementation.createDocument("","",null); 
    			xmldom.async = false;
    			xmldom.load(xml);
    		}catch(e){
    			var xmlhttp=new window.XMLHttpRequest();  
    			xmlhttp.open("GET",xml,false);  
    			xmlhttp.send(null);  
				if(xmlhttp.readyState == 4){
					xmldom = xmlhttp; 
				}
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
                xmldom = this.parseXmlText(path);
                var xmldata = xmldom.responseText;
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
                // 后屏受理行号
                var oSubBankId = document.getElementById("SubBankId");
                if (oSubBankId != null) {
                    oSubBankId.innerText = top.API.gSubBankNum;
                    // oSubBankId.innerText = '4498322Z-61000106号机';
                }
				// 待机页面时间显示   星期三 13:40  下一行 2018年1月8日
				var oCurrentTimeShowIndex = document.getElementById("TimeShowIndex");
				if (oCurrentTimeShowIndex != null) {
					document.getElementById("TimeShowIndex").innerText = "";
					var TimeShowIndex = function () {
						var time = new Date();
						oCurrentTimeShowIndex.innerText = "星期" + "日一二三四五六".split(/(?!\b)/)[time.getDay()] + ' ' + time.dateHMToString() + ' ' + time.dateYMDToString();
					}
					setInterval(TimeShowIndex, 1000);
				}
				// 前屏时间显示  2018年1月8日 星期三 13:40
				var oCurrentTimeShow = document.getElementById("TimeShow");
				if (oCurrentTimeShow != null) {
					document.getElementById("TimeShow").innerText = "";
					var TimeShow = function () {
						var time = new Date();
						oCurrentTimeShow.innerText = time.dateYMDToString() + ' ' + "星期" + "日一二三四五六".split(/(?!\b)/)[time.getDay()] + ' ' + time.dateHMToString();
					}
					setInterval(TimeShow, 1000);
				}
				//获取当前日期字符串  2018年2月7日     by yangjl dateYMDToString
				Date.prototype.dateYMDToString = function (separator) {
					var s = separator || '';
					var AddZero = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09'];
					return this.getFullYear() + '年' + s + ' ' + +(AddZero[this.getMonth() + 1] || (this.getMonth() + 1)) + '月' + s + (AddZero[this.getDate()] || this.getDate()) + '日';
				};
				//获取当前日期字符串    15:33   by yangjl
				Date.prototype.dateHMToString = function (separator) {
					var s = separator || '';
					var AddZero = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09'];
					return (AddZero[this.getHours()] || this.getHours()) + ':' + (AddZero[this.getMinutes()] || this.getMinutes()) + ':' + (AddZero[this.getSeconds()] || this.getSeconds());
				};

				// 前屏网点机构号
				var oSubBankId = document.getElementById("numberDot");
				if (oSubBankId != null) {
				    oSubBankId.innerText = top.API.gSubBankNum; //top.API.Dat.GetPersistentDataSync("SUBBANKNUM", "STRING")[0];
				};
				// 前屏 设备号
				var oSubBankId = document.getElementById("numberDevice");
				if (oSubBankId != null) {
				    oSubBankId.innerText = top.API.gTerminalID; //top.API.Dat.GetPersistentDataSync("TERMINALNUM", "STRING")[0];
				};

				// 错误提示倒计时
				var oCurrentCountDown = document.getElementById("countDown");
				if (oCurrentCountDown != null) {
					document.getElementById("countDown").innerText = "03";
					// setInterval(showTime, 1000);
                }
                

            // 等待 调试   wait.show     /   showNoBankCard
            
/*                    var sWidth = document.body.scrollWidth;
                   var sHeight = document.body.scrollHeight;
                   var wHeight = document.documentElement.clientHeight;
                   sHeight = wHeight;               
                   var oMask = document.createElement("div");
                       oMask.id = "mask";
                       oMask.style.height = sHeight + "px";
                       oMask.style.width = sWidth + "px";
                       document.body.appendChild(oMask);                
                   var  oWait = document.createElement("div");
                       oWait.id = "wait";
                       oWait.innerHTML="<div class='waitCon'></div><div id='inform'></div></div>";
                       document.body.appendChild(oWait);
                       document.getElementById("inform").innerHTML = "正在处理中，请稍后"; */


                    // oWait.innerHTML="<div class='NoBankCard'></div></div>";
                    // document.body.appendChild(oWait);








            } catch (ex) {
                alert(ex.message);
            }
        };

        this.InsertPlgin = function (path, InsertdivId, plginId) {
            var xmldom = null;
            try {
                xmldom = this.parseXmlText(path);
                var xmldata = xmldom.responseText;
                var docObj = document.createElement('div');
                docObj.id = plginId;
                docObj.innerHTML = xmldata;
                //inserting the div which appeared in the html body
                document.getElementById(InsertdivId).appendChild(docObj);
            } catch (ex) {
                alert(ex.message);
            }
        };

		// 处理中提示框  显示 
		this.showNetworkMsg = function (msg) {
			// $("#errorWrap").css("display","block");
            $('#errorWrap').css("display","none");
            $('#networkWrap').css("display","block");
            $('#networkTip').html(msg);
			// document.getElementById("networkWrap").style.display = "block";
			// document.getElementById("networkTip").innerText = msg;
		};
		// 错误提示框 显示 3秒后消失
		this.ErrorMsg = function (msg) {
			var i = 3;
			var intervalid;
            document.getElementById("InfoTip").innerText = msg;
            document.getElementById("countDown").innerHTML = i;
            $('#networkWrap').css("display","none");
            $('#errorWrap').css("display","block");
			intervalid = setInterval( function () {
                if (i == 0) {
                    $('#errorWrap').css("display","none");
                    clearInterval(intervalid);
                }
                i--;
                // errorWrapDisplay = "block";
                document.getElementById("countDown").innerHTML = i;

            }, 1000);

        };
        

/*		  页面js中 调用提示框   示例
var Files = new dynamicLoadFiles();
Files.showNetworkMsg("正在处理中，请稍后.."); // 弹出处理中提示框  （黑框）
Files.ErrorMsg("读证失败，请重试。");  // 弹出错误提示框，3秒后自动消失 （白框）

*/


/**控制按钮是否可以点击 的方法 B */

// 存储 需要控制的按钮id的数组   可以保存到全局变量中取，JSGlobal
// 可以点击
this.BtnEnable = function(BtnIdArr) {
    for (var index = 0; index < BtnIdArr.length; index++) {
        var element = BtnIdArr[index];
        document.getElementById(element).disabled = false;
    }
};
// 不能 点击 失效
	this.BtnDisable = function(BtnIdArr) {
    for (var index = 0; index < BtnIdArr.length; index++) {
        var element = BtnIdArr[index];
        document.getElementById(element).disabled = true;
    }
};
/*
// 当前 js 页面的代码   示例
var BtnIdArr=['Ok','Exit'];
var Files = new dynamicLoadFiles();
  //需要控制的按钮的id
Files.BtnEnable (BtnIdArr);  // 可以点击
Files.BtnDisable (BtnIdArr);// 失效 不能点击
*/
/**控制按钮是否可以点击 的方法 E */

/** 导航条 待解决
var strSteps= ["业务选择","信息读取","插卡","验密","信息确认","交易完成"]
var arrySteps =  document.getElementById('steps');
this.steps = function(stepsStr,stepLi){   // ['',]  4
    for (var i = 0; i < arrySteps.length; i++) {
        arrySteps[index].innerHTML = "<li><span class='stepNum'>+(i+1)+</span>" +strSteps[i]+"</li>";
       if (i >4) {
        arrySteps[i].classList.add("over");
       } else {
        arrySteps[i].classList.add("middle");   
       }
       
        
    }
}

*/


	};
})();

