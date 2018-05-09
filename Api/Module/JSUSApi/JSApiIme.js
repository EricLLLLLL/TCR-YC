(function(){
window.JSApiIme = function(ServiceName, InstanceName, obj){
	//inherit the base calss attribute
	JSUSApi.call(this, obj);

	this.ShowIME = function(type, disable, style){
		displayMessage(obj.id + "->ShowIME(" + type + "," + disable + "," + style + ")");
		return obj.ShowIME(type, disable, style);
	};

	this.HideIME = function(style){
		displayMessage(obj.id + "->HideIME(" + style + ")");
		return obj.HideIME(style);
	};

	this.SetIMEPos = function(posx, posy){
		displayMessage(obj.id + "->SetIMEPos(" + posx + "," + posy + ")");
		return obj.SetIMEPos(posx, posy);
	};

};
})();

