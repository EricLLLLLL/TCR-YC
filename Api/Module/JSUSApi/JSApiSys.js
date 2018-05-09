(function(){
window.JSApiSys = function(ServiceName, InstanceName, obj){
	//inherit the base calss attribute
	JSUSApi.call(this, obj);

	this.Reset = function(){
		displayMessage(obj.id + "->Reset()");
		return obj.Reset();
	};

	this.ShutDown = function(){
		displayMessage(obj.id + "->ShutDown()");
		return obj.ShutDown();
	};

	this.Reboot = function(){
		displayMessage(obj.id + "->Reboot()");
		return obj.Reboot();
	};

	this.OpenService = function(){
		displayMessage(obj.id + "->OpenService()");
		return obj.OpenService();
	};

	this.CloseService = function(){
		displayMessage(obj.id + "->CloseService()");
		return obj.CloseService();
	};

	this.OpenFrontPage = function(){
		displayMessage(obj.id + "->OpenFrontPage()");
		return obj.OpenFrontPage();
	};

	this.OpenManagePage = function(){
		displayMessage(obj.id + "->OpenManagePage()");
		return obj.OpenManagePage();
	};

	this.StartPollingStatusCheckSync = function(){
		displayMessage(obj.id + "->StartPollingStatusCheckSync()");
		return obj.StartPollingStatusCheckSync();
	};

	this.UpTransFile = function(){
		displayMessage(obj.id + "->UpTransFile()");
		return obj.UpTransFile();
	};

	this.InitialSync = function(){
		displayMessage(obj.id + "->InitialSync()");
		return obj.InitialSync();
	};

	this.PossibleTransactionSync = function(){
		displayMessage(obj.id + "->PossibleTransactionSync()");
		return obj.PossibleTransactionSync();
	};

	this.PossibleTransaction = function(){
		displayMessage(obj.id + "->PossibleTransaction()");
		return obj.PossibleTransaction();
	};

	this.ClearSync = function(cleardiffer){
		displayMessage(obj.id + "->ClearSync(" + cleardiffer + ")");
		return obj.ClearSync(cleardiffer);
	};

	this.ItemClearSync = function(item){
		displayMessage(obj.id + "->ItemClearSync(" + item + ")");
		return obj.ItemClearSync(item);
	};

	this.DataSetSync = function(item, value){
		displayMessage(obj.id + "->DataSetSync(" + item + "," + value + ")");
		return obj.DataSetSync(item, value);
	};

	this.DataGetSync = function(item){
		displayMessage(obj.id + "->DataGetSync(" + item + ")");
		return obj.DataGetSync(item);
	};

	this.InfoGetSync = function(item){
		displayMessage(obj.id + "->InfoGetSync(" + item + ")");
		return obj.InfoGetSync(item);
	};

	this.GetPartsStatusSync = function(){
		displayMessage(obj.id + "->GetPartsStatusSync()");
		return obj.GetPartsStatusSync();
	};

	this.GetPartsStatus = function(){
		displayMessage(obj.id + "->GetPartsStatus()");
		return obj.GetPartsStatus();
	};

	this.SetMainProcessSync = function(){
		displayMessage(obj.id + "->SetMainProcessSync()");
		return obj.SetMainProcessSync();
	};

	this.WriteFlushesDataSync = function(){
		displayMessage(obj.id + "->WriteFlushesDataSync()");
		return obj.WriteFlushesDataSync();
	};

	this.ClearFlushesDataSync = function(){
		displayMessage(obj.id + "->ClearFlushesDataSync()");
		return obj.ClearFlushesDataSync();
	};

	this.SetFlushesDataSync = function(){
		displayMessage(obj.id + "->SetFlushesDataSync()");
		return obj.SetFlushesDataSync();
	};

	this.IsBusying = function(){
		return obj.GetIsBusying();
	};

	this.SetIsBusying = function(newval){
		displayMessage(obj.id + "->SetIsBusying("+newval+")");
        return obj.SetIsBusying(newval);
	};

    this.IsMaintain = function(){
        return obj.GetIsMaintain();
    }

    this.SetIsMaintain = function(newval){
		displayMessage(obj.id + "->SetIsMaintain("+newval+")");
        return obj.SetIsMaintain(newval);
    }


};
})();

