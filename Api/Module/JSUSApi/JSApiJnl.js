(function(){
window.JSApiJnl = function(ServiceName, InstanceName, obj){
	//inherit the base calss attribute
	JSUSApi.call(this, obj);

	this.PrintSync = function(strjnlfromname){
		displayMessage(obj.id + "->PrintSync(" + strjnlfromname + ")");
		return obj.PrintSync(strjnlfromname);
	};

	this.WriteLogSync = function(buffer, loglevel){
		displayMessage(obj.id + "->WriteLogSync(" + buffer + "," + loglevel + ")");
		return obj.WriteLogSync(buffer, loglevel);
	};

};
})();

