(function(){
window.JSApiTcp = function(ServiceName, InstanceName, obj){
	//inherit the base calss attribute
	JSUSApi.call(this, obj);

	this.SendToHost = function(mac, timeout){
		displayMessage(obj.id + "->SendToHost(" + mac + "," + timeout + ")");
		return obj.SendToHost(mac, timeout);
	};

	this.CompositionData = function(transactiontype){
		displayMessage(obj.id + "->CompositionData(" + transactiontype + ")");
		return obj.CompositionData(transactiontype);
	};

};
})();

