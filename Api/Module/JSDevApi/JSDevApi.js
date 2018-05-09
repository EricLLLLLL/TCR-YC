(function(){
window.JSDevApi = function(ServiceName, InstanceName, obj){
	var object = obj;
	var ServiceName = ServiceName;
	var InstanceName = InstanceName;
	this.bOpenDevice = false;
	this.bDeviceStatus = false;
	this.LastEventData;
	this.StDeviceStatus;

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

	this.openSuccessful =  function(){
		this.bOpenDevice = true;
	}

	this.RegisterMessage = function(){
	    displayMessage(obj.id + "->RegisterMessage()");
	    return obj.RegisterMessage();
	};

	this.UnRegisterMessage = function(){
	    displayMessage(obj.id + "->UnRegisterMessage()");
	    return obj.UnRegisterMessage();
	};

	this.CloseConnection = function(){
		displayMessage(obj.id + "->CloseConnection()");
		return obj.CloseConnection();
	};

	this.OpenConnection = function(){
		displayMessage(obj.id + "->OpenConnection()");
		return obj.OpenConnection();
	};

	this.SetServiceName = function(){
		displayMessage(obj.id + "->SetServiceName("+ServiceName+")");
		return obj.SetServiceName(ServiceName);
	};

	this.StDetailedDeviceStatus = function(){
		displayMessage(obj.id + "->GetStDetailedDeviceStatus()");
		return obj.GetStDetailedDeviceStatus();
	};

};
})();

