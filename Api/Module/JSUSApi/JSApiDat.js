(function(){
window.JSApiDat = function(ServiceName, InstanceName, obj){
	//inherit the base calss attribute
	JSUSApi.call(this, obj);

	this.AddPersistentData = function(dataname, datatype, datavalue){
		displayMessage(obj.id + "->AddPersistentData(" + dataname + "," + datatype + "," + datavalue + ")");
		return obj.AddPersistentData(dataname, datatype, datavalue);
	};

	this.GetPersistentData = function(dataname, datatype){
		displayMessage(obj.id + "->GetPersistentData(" + dataname + "," + datatype + ")");
		return obj.GetPersistentData(dataname, datatype);
	};

	this.SetPersistentData = function(dataname, datatype, newdatavalue){
		displayMessage(obj.id + "->SetPersistentData(" + dataname + "," + datatype + "," + newdatavalue + ")");
		return obj.SetPersistentData(dataname, datatype, newdatavalue);
	};

	this.TimedLock = function(timeout){
		displayMessage(obj.id + "->TimedLock(" + timeout + ")");
		return obj.TimedLock(timeout);
	};

	this.GetDataSync = function(dataname, datatype){
		displayMessage(obj.id + "->GetDataSync(" + dataname + "," + datatype + ")");
		return obj.GetDataSync(dataname, datatype);
	};

	this.SetDataSync = function(dataname, datatype, newdatavalue){
		displayMessage(obj.id + "->SetDataSync(" + dataname + "," + datatype + "," + newdatavalue + ")");
		return obj.SetDataSync(dataname, datatype, newdatavalue);
	};

	this.InitDatasSync = function(){
		displayMessage(obj.id + "->InitDatasSync()");
		return obj.InitDatasSync();
	};

	this.GetPersistentDataSync = function(dataname, datatype){
		displayMessage(obj.id + "->GetPersistentDataSync(" + dataname + "," + datatype + ")");
		return obj.GetPersistentDataSync(dataname, datatype);
	};

	this.SetPersistentDataSync = function(dataname, datatype, newdatavalue){
		displayMessage(obj.id + "->SetPersistentDataSync(" + dataname + "," + datatype + "," + newdatavalue + ")");
		return obj.SetPersistentDataSync(dataname, datatype, newdatavalue);
	};

	this.GetPrivateProfileSync = function(sectionname, keyname, defaultvalue, filename){
		top.API.displayMessage(obj.id + "->GetPrivateProfileSync(" + sectionname + "," + keyname + "," + defaultvalue + "," + filename + ")");
		return obj.GetPrivateProfileSync(sectionname, keyname, defaultvalue, filename);
	};

	this.WritePrivateProfileSync = function(sectionname, keyname, value, filename){
		displayMessage(obj.id + "->WritePrivateProfileSync(" + sectionname + "," + keyname + "," + value + "," + filename + ")");
		return obj.WritePrivateProfileSync(sectionname, keyname, value, filename);
	};

	this.IsGetDataSyncOK = function(){
		return obj.GetIsGetDataSyncOK();
	};
	
	this.GetBankCodeJsonData = function(){
		return obj.GetBankCodeJsonData();
	};
	
	this.GetProcCodeJsonData = function(){
		return obj.GetProcCodeJsonData();
	};
	
	this.GetQRCodePic = function(){
		return obj.GetQRCodePic();
	};
	
	this.GetMD5Data = function(){
		return obj.GetMD5Data();
	};

    this.GetBaseDir = function(){
		return obj.GetBaseDir();
	};

};
})();

