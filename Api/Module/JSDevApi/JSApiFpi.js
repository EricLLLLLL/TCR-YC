(function(){
window.JSApiFpi = function(ServiceName, InstanceName, obj){
	//inherit the base calss attribute
	JSDevApi.call(this, ServiceName, InstanceName, obj);

	this.Identify = function(timeout){
		displayMessage(obj.id + "->Identify(" + timeout + ")");
		return obj.Identify(timeout);
	};

	this.CancelIdentify = function(){
		displayMessage(obj.id + "->CancelIdentify()");
		return obj.CancelIdentify();
	};

	this.AcquireData = function(timeout){
		displayMessage(obj.id + "->AcquireData(" + timeout + ")");
		return obj.AcquireData(timeout);
	};

	this.CancelAcquireData = function(){
		displayMessage(obj.id + "->CancelAcquireData()");
		return obj.CancelAcquireData();
	};

	this.Reset = function(timeout){
		displayMessage(obj.id + "->Reset(" + timeout + ")");
		return obj.Reset(timeout);
	};

	this.DataMatch = function(timeout, data){
		displayMessage(obj.id + "->DataMatch(" + timeout + "," + data + ")");
		return obj.DataMatch(timeout, data);
	};

	this.StMediaStatus = function(){
        displayMessage(obj.id + "->GetStMediaStatus()");
		return obj.GetStMediaStatus();
	};

};
})();

