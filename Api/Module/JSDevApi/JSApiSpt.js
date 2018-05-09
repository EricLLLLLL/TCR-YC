(function(){
window.JSApiSpt = function(ServiceName, InstanceName, obj){
	//inherit the base calss attribute
	JSDevApi.call(this, ServiceName, InstanceName, obj);

	this.ControlMedia = function(ctrlparam, timeout){
		displayMessage(obj.id + "->ControlMedia(" + ctrlparam + "," + timeout + ")");
		return obj.ControlMedia(ctrlparam, timeout);
	};
	
	this.CtrlEject = function(timeout){
		displayMessage(obj.id + "->CtrlEject(" + timeout + ")");
		return obj.CtrlEject(timeout);
	};

	this.CtrlFlush = function(timeout){
		displayMessage(obj.id + "->CtrlFlush(" + timeout + ")");
		return obj.CtrlFlush(timeout);
	};

	this.CtrlAlarm = function(timeout){
		displayMessage(obj.id + "->CtrlAlarm(" + timeout + ")");
		return obj.CtrlAlarm(timeout);
	};

	this.RawData = function(rawdata,timeout){
		displayMessage(obj.id + "->RawData(" + rawdata + "," + timeout + ")");
		return obj.RawData(rawdata,timeout);
	};

	this.Reset = function(timeout){
		displayMessage(obj.id + "->Reset(" + timeout + ")");
		return obj.Reset(timeout);
	};

	this.StMediaStatus = function(){
        displayMessage(obj.id + "->GetStMediaStatus()");
		return obj.GetStMediaStatus();
	};

	this.StPaperStatus = function(){
        displayMessage(obj.id + "->GetStPaperStatus()");
		return obj.GetStPaperStatus();
	};
	
};
})();

