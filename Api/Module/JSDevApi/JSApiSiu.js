(function(){
window.JSApiSiu = function(ServiceName, InstanceName, obj){
	//inherit the base calss attribute
	JSDevApi.call(this, ServiceName, InstanceName, obj);

	this.SetCardReaderLight = function(flashrate){
		displayMessage(obj.id + "->SetCardReaderLight(" + flashrate + ")");
		return obj.SetCardReaderLight(flashrate);
	};

	this.SetPinPadLight = function(flashrate){
		displayMessage(obj.id + "->SetPinPadLight(" + flashrate + ")");
		return obj.SetPinPadLight(flashrate);
	};

	this.SetReceiptPrinterLight = function(flashrate){
		displayMessage(obj.id + "->SetReceiptPrinterLight(" + flashrate + ")");
		return obj.SetReceiptPrinterLight(flashrate);
	};

	this.SetCustomLight = function(customlightname, flashrate){
		displayMessage(obj.id + "->SetCustomLight(" + customlightname + "," + flashrate + ")");
		return obj.SetCustomLight(customlightname, flashrate);
	};

	this.GetCustomLightStatusSync = function(customlightname){
		displayMessage(obj.id + "->GetCustomLightStatusSync(" + customlightname + ")");
		return obj.GetCustomLightStatusSync(customlightname);
	};

	this.SetScannerLight = function(flashrate){
		displayMessage(obj.id + "->SetScannerLight(" + flashrate + ")");
		return obj.SetScannerLight(flashrate);
	};

	this.Reset = function(timeout){
		displayMessage(obj.id + "->Reset(" + timeout + ")");
		return obj.Reset(timeout);
	};

	this.StCardReaderLightStatus = function(){
		displayMessage(obj.id + "->GetStCardReaderLightStatus()");
		return obj.GetStCardReaderLightStatus();
	};

	this.StPinPadLightStatus = function(){
		displayMessage(obj.id + "->GetStPinPadLightStatus()");
		return obj.GetStPinPadLightStatus();
	};

	this.StReceiptPrinterLightStatus = function(){
		displayMessage(obj.id + "->GetStReceiptPrinterLightStatus()");
		return obj.GetStReceiptPrinterLightStatus();
	};

	this.StScannerLightStatus = function(){
		displayMessage(obj.id + "->GetStScannerLightStatus()");
		return obj.GetStScannerLightStatus();
	};

};
})();

