
(function () {

    window.TimeControl = function () {
        var intervalId = 0;
        var timeoutId  = 0;
        var timeout = 0;
        var bQuit = false;
        var bIntervalExist = false;
        var bTimeroutExist = false;


        var setTimerout = function(TimeoutCallBack){
            var obj = document.getElementById("ShowTime");
            if (obj == null || timeout == 0 || (typeof TimeoutCallBack != 'function') ) {
                obj.innerText = "";
                return;
            }
            timeout--;
            if( timeout < 3 ){
                DisableAllButton("PageButton",true);
            }
            if (timeout > 0) {
                obj.innerText = timeout;       
                timeoutId = window.setTimeout( function(){
                             setTimerout(TimeoutCallBack);
                          }, 1000);
            } else {
                obj.innerText = "";
                DisableAllButton("PageButton",false);
                TimeoutCallBack();    
            }

        };

        this.TimeoutDisposal = function( TimeoutCallBack ){
            if( bTimeroutExist == false && (typeof TimeoutCallBack == 'function')){
                bTimeroutExist = true;
                setTimerout(TimeoutCallBack);
            }
            else{
                //top.API.displayMessage("Excess TimeoutDisposal is quitted ");
                return;
            }
        };
        var  DisableAllButton = function (DisableDiv,bIsable){
           var Obj = document.getElementById(DisableDiv);
	   if (Obj == null){
	      return;
	    }
	    if(Obj.all){
		   var elemSum = Obj.all.length;
		   for(var i=0; i<elemSum; i++){
		       Obj.all[i].disabled = bIsable;
		   	}
	     }else{
			var b = Obj.childNodes;
			for(var i=0;i<b.length;i++){
				if(b[i].nodeName == "A"){
					if(bIsable){
						b[i].onclick = 'javascript:void(0)';
					}
					b[i].setAttribute("disabled",bIsable);
				}
				if(b[i].nodeName == "DIV"){
					DisableAllButton(b[i].id,bIsable);
				}
			}
		}
        };
        var setintervalTimer = function(IntervalCallBack,ntimes){
            if( bQuit ){
                return;
            }
            IntervalCallBack();
            intervalId = window.setTimeout( function(){
                             setintervalTimer(IntervalCallBack,ntimes);
                          }, ntimes); 
        };


        this.SetIntervalDisposal = function(IntervalCallBack,ntimes){    
            if( bIntervalExist == false && (typeof IntervalCallBack == 'function')){
                bQuit = false;
                bIntervalExist = true;
                setintervalTimer(IntervalCallBack,ntimes);
            }
            else{
                //top.API.displayMessage("Excess IntervalDisposal is quitted ");
                return;
            }
        };

        this.SetPageTimeout = function (timeOption) {
            timeout = timeOption;
        };

        this.ClearTime = function () {
            timeout = 0;
            bTimeroutExist = false;
            window.clearTimeout(timeoutId);
        };

        this.ClearIntervalTime = function(){
            bQuit = true;
            bIntervalExist = false;
            window.clearTimeout(intervalId);
        };
    };

})();

