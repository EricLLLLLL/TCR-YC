(function(){
window.JSApiCam = function(ServiceName, InstanceName, obj){
	//inherit the base calss attribute
	JSDevApi.call(this, ServiceName, InstanceName, obj);

	this.CloseCamera = function(timeout){
		displayMessage(obj.id + "->CloseCamera(" + timeout + ")");
		return obj.CloseCamera(timeout);
	};

	this.TakePhoto = function(picpath, camdata, unicode, timeout){
		displayMessage(obj.id + "->TakePhoto(" + picpath + "," + camdata + "," + unicode + "," + timeout +")");
		return obj.TakePhoto(picpath, camdata, unicode, timeout);
	};
	
	this.CancelTakePhoto = function(){
		displayMessage(obj.id + "->CancelTakePhoto()");
		return obj.CancelTakePhoto();
	};
	
	this.OpenCamera = function(width, height, x, y, timeout){
		displayMessage(obj.id + "->OpenCamera(" + width + "," + height + "," + x + "," + y + "," + timeout +")");
		return obj.OpenCamera(width, height, x, y, timeout);
	};
	
	this.Reset = function(timeout){
		displayMessage(obj.id + "->Reset(" + timeout + ")");
		return obj.Reset(timeout);
	};
	
	this.StMediaStatus = function(){
        displayMessage(obj.id + "->GetStMediaStatus()");
		return obj.GetStMediaStatus();
	};

};
})();

