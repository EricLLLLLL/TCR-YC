(function(){
window.JSApiSud = function(ServiceName, InstanceName, obj){
	//inherit the base calss attribute
	JSUSApi.call(this, obj);

	    this.PlaySound = function(strFileName){
			displayMessage("CSoundCtrl->PlaySound(" + strFileName +")");
			return obj.PlaySound(strFileName);
		};
	    this.StopSound = function(){
			displayMessage("CSoundCtrl->StopSound");
			return obj.StopSound();
		};
};
})();

