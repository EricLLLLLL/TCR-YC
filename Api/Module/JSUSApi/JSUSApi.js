/**
 * Created by Administrator on 2017/1/6.
 */
(function(){
window.JSUSApi=function(obj){

    //event handler
	this.addEvent = function(event,handler){
		displayMessage(obj.id + "->connect (" + event+ ")");
        if (typeof handler == 'undefined') {
		    displayMessage("handler is undefined");
            return;
        }
		var signalBind = "var objEvent = obj."+event;
		eval(signalBind);
		if (typeof objEvent == 'undefined') {
			displayMessage("objEvent is undefined");
			return;
		}
		return objEvent.connect(handler);	  
		//return obj.attachEvent(event,handler);
	};
	this.removeEvent = function(event, handler){
		displayMessage(obj.id + "->disconnect (" + event+ ")");
        	//var signalBind="obj."+event+".disconnect("+handler+")";
		if (typeof handler == 'undefined') {
		    displayMessage("handler is undefined");
            return;
        }
		var signalBind = "var objEvent = obj."+event;
		eval(signalBind);
		if (typeof objEvent == 'undefined') {
			displayMessage("objEvent is undefined");
			return;
		}
        return objEvent.disconnect(handler);	
		//return obj.detachEvent(event,handler);
	};

    this.RegisterMessage = function () {
        displayMessage(obj.id + "->RegisterMessage()");
        return obj.RegisterMessage();
    };

    this.UnRegisterMessage = function () {
        displayMessage(obj.id + "->UnRegisterMessage()");
        return obj.UnRegisterMessage();
    };
    
};
})();