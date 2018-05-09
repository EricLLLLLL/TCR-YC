(function(){
window.JSApiTfc = function(ServiceName, InstanceName, obj){
	//inherit the base calss attribute
	JSDevApi.call(this, ServiceName, InstanceName, obj);

	this.IdentifyLicFile = function(filedata,timeout){
		displayMessage(obj.id + "->IdentifyLicFile(" + filedata + "," + timeout + ")");
		return obj.IdentifyLicFile(filedata,timeout);
	};

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

	this.PhotoMatch = function(pic1path, pic2path,timeout){
		displayMessage(obj.id + "->PhotoMatch(" + pic1path + "," + pic2path + "," + timeout +")");
		return obj.PhotoMatch(pic1path, pic2path, timeout);
	};
	
	this.Reset = function(timeout){
		displayMessage(obj.id + "->Reset(" + timeout + ")");
		return obj.Reset(timeout);
	};
	
	this.StMediaStatus = function(){
        displayMessage(obj.id + "->GetStMediaStatus()");
		return obj.GetStMediaStatus();
	};
	
	this.StDeviceInfo = function(){
        displayMessage(obj.id + "->GetStDeviceInfo()");
		return obj.GetStDeviceInfo();
	};

	this.OpenConnAndCamera = function(width, height, x, y, timeout){
        displayMessage(obj.id + "->OpenConnAndCamera(" + width + "," + height + "," + x + "," + y + "," + timeout +")");
		return obj.OpenConnAndCamera(width, height, x, y, timeout);
	};

	this.CloseCameraAndConn = function(timeout){
        displayMessage(obj.id + "->CloseCameraAndConn(" + timeout +")");
		return obj.CloseCameraAndConn(timeout);
	};
};
})();

