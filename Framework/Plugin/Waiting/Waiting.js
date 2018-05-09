(function(){

window.Waiting = function(){

    this.show = function(){
        var sWidth = document.body.scrollWidth;
        var sHeight = document.body.scrollHeight;
        var wHeight = document.documentElement.clientHeight;
        sHeight = wHeight;               
        var oMask = document.createElement("div");
            oMask.id = "mask";
            oMask.style.height = 1024 + "px";
            oMask.style.width = 1280 + "px";
            document.body.appendChild(oMask);                
        var  oWait = document.createElement("div");
            oWait.id = "wait";
            oWait.innerHTML="<div class='waitCon'></div><div id='inform'></div></div>";
            document.body.appendChild(oWait);
            document.getElementById("inform").innerHTML = "正在处理中，请稍后";
    },
        this.showNoBankCard = function(){
            var sWidth = document.body.scrollWidth;
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
                oWait.innerHTML="<div class='NoBankCard'></div></div>";
                document.body.appendChild(oWait);
        },

    this.disappear = function() {
    	var oWait = document.getElementById("wait");
    	var oMask = document.getElementById("mask");
    	if( oWait != null ){
       	    document.body.removeChild(oWait);
    	}
    	if( oMask != null ){
    		document.body.removeChild(oMask);
    	}
    }
};

})();

