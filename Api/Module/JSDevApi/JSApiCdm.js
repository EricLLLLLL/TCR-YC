(function(){
window.JSApiCdm = function(ServiceName, InstanceName, obj){
	//inherit the base calss attribute
	JSDevApi.call(this, ServiceName, InstanceName, obj);

	this.Mix = function(amount, currency, mixalgorithm){
		displayMessage(obj.id + "->Mix(" + amount + "," + currency + "," + mixalgorithm + ")");
		return obj.Mix(amount, currency, mixalgorithm);
	};

	this.MixAndDispense = function(amount, currency, mixalgorithm){
		displayMessage(obj.id + "->MixAndDispense(" + amount + "," + currency + "," + mixalgorithm + ")");
		return obj.MixAndDispense(amount, currency, mixalgorithm);
	};

	this.Dispense = function(amount, notecounts, currency, mixalgorithm){
		displayMessage(obj.id + "->Dispense(" + amount + "," + notecounts + "," + currency + "," + mixalgorithm + ")");
		return obj.Dispense(amount, notecounts, currency, mixalgorithm);
	};

	this.Present = function(timeout){
		displayMessage(obj.id + "->Present(" + timeout + ")");
		return obj.Present(timeout);
	};

	this.Reset = function(retractarea, id, timeout){
		displayMessage(obj.id + "->Reset(" + retractarea + "," + id + "," + timeout + ")");
		return obj.Reset(retractarea, id, timeout);
	};

	this.SetUnitTypeSync = function(type){
		displayMessage(obj.id + "->SetUnitTypeSync(" + type + ")");
		return obj.SetUnitTypeSync(type);
	};

	this.StartExchange = function(){
		displayMessage(obj.id + "->StartExchange()");
		return obj.StartExchange();
	};

	this.EndExchange = function(){
		displayMessage(obj.id + "->EndExchange()");
		return obj.EndExchange();
	};

	this.SetUnitCountSync = function(unit){
		displayMessage(obj.id + "->SetUnitCountSync(" + unit + ")");
		return obj.SetUnitCountSync(unit);
	};

	this.SetUnitValueSync = function(value){
		displayMessage(obj.id + "->SetUnitValueSync(" + value + ")");
		return obj.SetUnitValueSync(value);
	};

	this.SetDispenseAmount = function(amount){
		displayMessage(obj.id + "->SetDispenseAmount(" + amount + ")");
		return obj.SetDispenseAmount(amount);
	};

	this.OpenShutter = function(timeout){
		displayMessage(obj.id + "->OpenShutter(" + timeout + ")");
		return obj.OpenShutter(timeout);
	};

	this.CloseShutter = function(timeout){
		displayMessage(obj.id + "->CloseShutter(" + timeout + ")");
		return obj.CloseShutter(timeout);
	};

	this.NumLogicalCashUnits = function(){
        displayMessage(obj.id + "->GetNumLogicalCashUnits()");
		return obj.GetNumLogicalCashUnits();
	};

	this.CUNumber = function(){
        displayMessage(obj.id + "->GetCUNumber()");
		return obj.GetCUNumber();
	};

	this.CUType = function(){
        displayMessage(obj.id + "->GetCUType()");
		return obj.GetCUType();
	};

	this.CUId = function(){
        displayMessage(obj.id + "->GetCUId()");
		return obj.GetCUId();
	};

	this.CUStatus = function(){
        displayMessage(obj.id + "->GetCUStatus()");
		return obj.GetCUStatus();
	};

	this.CUCurrentCount = function(){
        displayMessage(obj.id + "->GetCUCurrentCount()");
		return obj.GetCUCurrentCount();
	};

	this.CUCurrency = function(){
        displayMessage(obj.id + "->GetCUCurrency()");
		return obj.GetCUCurrency();
	};

	this.CUNoteValue = function(){
        displayMessage(obj.id + "->GetCUNoteValue()");
		return obj.GetCUNoteValue();
	};

	this.CUInitialCount = function(){
        displayMessage(obj.id + "->GetCUInitialCount()");
		return obj.GetCUInitialCount();
	};

	this.CUMaxThreshold = function(){
        displayMessage(obj.id + "->GetCUMaxThreshold()");
		return obj.GetCUMaxThreshold();
	};

	this.CUMinThreshold = function(){
        displayMessage(obj.id + "->GetCUMinThreshold()");
		return obj.GetCUMinThreshold();
	};

	this.PUId = function(){
        displayMessage(obj.id + "->GetPUId()");
		return obj.GetPUId();
	};

	this.PUCUNumber = function(){
        displayMessage(obj.id + "->GetPUCUNumber()");
		return obj.GetPUCUNumber();
	};

	this.PUCurrentCount = function(){
        displayMessage(obj.id + "->GetPUCurrentCount()");
		return obj.GetPUCurrentCount();
	};

	this.PUCUId = function(){
        displayMessage(obj.id + "->GetPUCUId()");
		return obj.GetPUCUId();
	};

	this.PUStatus = function(){
        displayMessage(obj.id + "->GetPUStatus()");
		return obj.GetPUStatus();
	};

	this.PUInitialCount = function(){
        displayMessage(obj.id + "->GetPUInitialCount()");
		return obj.GetPUInitialCount();
	};

	this.PURejectCount = function(){
        displayMessage(obj.id + "->GetPURejectCount()");
		return obj.GetPURejectCount();
	};

	this.CpCanRetract = function(){
        displayMessage(obj.id + "->GetCpCanRetract()");
		return obj.GetCpCanRetract();
	};

	this.StSafeDoorStatus = function(){
        displayMessage(obj.id + "->GetStSafeDoorStatus()");
		return obj.GetStSafeDoorStatus();
	};

	this.StDispenserStatus = function(){
        displayMessage(obj.id + "->GetStDispenserStatus()");
		return obj.GetStDispenserStatus();
	};

	this.MixNumber = function(){
        displayMessage(obj.id + "->GetMixNumber()");
		return obj.GetMixNumber();
	};

	this.StStackerStatus = function(){
        displayMessage(obj.id + "->GetStStackerStatus()");
		return obj.GetStStackerStatus();
	};

	this.StTransportStatus = function(){
        displayMessage(obj.id + "->GetStTransportStatus()");
		return obj.GetStTransportStatus();
	};

	this.StOutputStatus = function(){
        displayMessage(obj.id + "->GetStOutputStatus()");
		return obj.GetStOutputStatus();
	};

	this.StShutterStatus = function(){
        displayMessage(obj.id + "->GetStShutterStatus()");
		return obj.GetStShutterStatus();
	};

	this.CpCanDetectCashTaken = function(){
        displayMessage(obj.id + "->GetCpCanDetectCashTaken()");
		return obj.GetCpCanDetectCashTaken();
	};

	this.RemainCount = function(){
        displayMessage(obj.id + "->GetRemainCount()");
		return obj.GetRemainCount();
	};

};
})();

