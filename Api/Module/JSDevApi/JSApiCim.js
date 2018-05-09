(function(){
window.JSApiCim = function(ServiceName, InstanceName, obj){
	//inherit the base calss attribute
	JSDevApi.call(this, ServiceName, InstanceName, obj);

	this.AcceptCash = function(timeout){
		displayMessage(obj.id + "->AcceptCash(" + timeout + ")");
		return obj.AcceptCash(timeout);
	};

	this.CancelAcceptCash = function(){
		displayMessage(obj.id + "->CancelAcceptCash()");
		return obj.CancelAcceptCash();
	};

	this.StoreEscrowedCash = function(timeout){
		displayMessage(obj.id + "->StoreEscrowedCash(" + timeout + ")");
		return obj.StoreEscrowedCash(timeout);
	};

	this.EjectEscrowedCash = function(timeout){
		displayMessage(obj.id + "->EjectEscrowedCash(" + timeout + ")");
		return obj.EjectEscrowedCash(timeout);
	};

	this.OpenShutter = function(timeout){
		displayMessage(obj.id + "->OpenShutter(" + timeout + ")");
		return obj.OpenShutter(timeout);
	};

	this.CloseShutter = function(timeout){
		displayMessage(obj.id + "->CloseShutter(" + timeout + ")");
		return obj.CloseShutter(timeout);
	};

	this.Reset = function(retractarea, id, timeout){
		displayMessage(obj.id + "->Reset(" + retractarea + "," + id + "," + timeout + ")");
		return obj.Reset(retractarea, id, timeout);
	};

	this.GetLastAcceptedAmountSync = function(currency, validity){
		displayMessage(obj.id + "->GetLastAcceptedAmountSync(" + currency + "," + validity + ")");
		return obj.GetLastAcceptedAmountSync(currency, validity);
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

	this.SetUnitTypeSync = function(type){
		displayMessage(obj.id + "->SetUnitTypeSync(" + type + ")");
		return obj.SetUnitTypeSync(type);
	};

	this.SetSupportValue = function(value){
		displayMessage(obj.id + "->SetSupportValue(" + value + ")");
		return obj.SetSupportValue(value);
	};

	this.PrepareForAcceptCash = function(){
		displayMessage(obj.id + "->PrepareForAcceptCash()");
		return obj.PrepareForAcceptCash();
	};

	this.StatisticsData = function(){
		displayMessage(obj.id + "->StatisticsData()");
		return obj.StatisticsData();
	};

	this.StEscrowStatus = function(){
		displayMessage(obj.id + "->GetStEscrowStatus()");
		return obj.GetStEscrowStatus();
	};

	this.StShutterStatus = function(){
		displayMessage(obj.id + "->GetStShutterStatus()");
		return obj.GetStShutterStatus();
	};

	this.StTransportStatus = function(){
		displayMessage(obj.id + "->GetStTransportStatus()");
		return obj.GetStTransportStatus();
	};

	this.StInputStatus = function(){
		displayMessage(obj.id + "->GetStInputStatus()");
		return obj.GetStInputStatus();
	};

	this.StAcceptorStatus = function(){
		displayMessage(obj.id + "->GetStAcceptorStatus()");
		return obj.GetStAcceptorStatus();
	};

	this.StSafeDoorStatus = function(){
		displayMessage(obj.id + "->GetStSafeDoorStatus()");
		return obj.GetStSafeDoorStatus();
	};

	this.CpCanEscrow = function(){
		displayMessage(obj.id + "->GetCpCanEscrow()");
		return obj.GetCpCanEscrow();
	};

	this.CpShutterControlSupported = function(){
		displayMessage(obj.id + "->GetCpShutterControlSupported()");
		return obj.GetCpShutterControlSupported();
	};

	this.CpMaxAcceptItems = function(){
		displayMessage(obj.id + "->GetCpMaxAcceptItems()");
		return obj.GetCpMaxAcceptItems();
	};

	this.CpCanDetectCashInserted = function(){
		displayMessage(obj.id + "->GetCpCanDetectCashInserted()");
		return obj.GetCpCanDetectCashInserted();
	};

	this.CpCanDetectCashTaken = function(){
		displayMessage(obj.id + "->GetCpCanDetectCashTaken()");
		return obj.GetCpCanDetectCashTaken();
	};

	this.CpRetractAreas = function(){
		displayMessage(obj.id + "->GetCpRetractAreas()");
		return obj.GetCpRetractAreas();
	};

	this.CpExchangeTypes = function(){
		displayMessage(obj.id + "->GetCpExchangeTypes()");
		return obj.GetCpExchangeTypes();
	};

	this.LastAcceptStatus = function(){
		displayMessage(obj.id + "->GetLastAcceptStatus()");
		return obj.GetLastAcceptStatus();
	};

	this.NumOfRefused = function(){
		displayMessage(obj.id + "->GetNumOfRefused()");
		return obj.GetNumOfRefused();
	};

    this.CUStatus = function(){
		displayMessage(obj.id + "->GetCUStatus()");
        return obj.GetCUStatus();
    };

    this.BankNoteTypes = function(){
    	displayMessage(obj.id + "->GetBankNoteTypes()");
    	return obj.GetBankNoteTypes();
    };
};
})();

