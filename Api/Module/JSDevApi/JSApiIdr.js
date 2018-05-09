(function(){
window.JSApiIdr = function(ServiceName, InstanceName, obj){
	//inherit the base calss attribute
	JSDevApi.call(this, ServiceName, InstanceName, obj);

	this.AcceptAndRead = function(timeout){
		displayMessage(obj.id + "->AcceptAndRead(" + timeout + ")");
		return obj.AcceptAndRead(timeout);
	};

	this.Eject = function(timeout){
		displayMessage(obj.id + "->Eject(" + timeout + ")");
		return obj.Eject(timeout);
	};

	this.Capture = function(timeout){
		displayMessage(obj.id + "->Capture(" + timeout + ")");
		return obj.Capture(timeout);
	};

	this.CancelAccept = function(){
		displayMessage(obj.id + "->CancelAccept()");
		return obj.CancelAccept();
	};

	this.CancelWait = function(){
		displayMessage(obj.id + "->CancelWait()");
		return obj.CancelWait();
	};

	this.Reset = function(resetaction){
		displayMessage(obj.id + "->Reset(" + resetaction + ")");
		return obj.Reset(resetaction);
	};

	this.StMediaStatus = function(){
        displayMessage(obj.id + "->GetStMediaStatus()");
		return obj.GetStMediaStatus();
	};

	this.CpCanEject = function(){
        displayMessage(obj.id + "->GetCpCanEject()");
		return obj.GetCpCanEject();
	};

	this.CpCanCapture = function(){
        displayMessage(obj.id + "->GetCpCanCapture()");
		return obj.GetCpCanCapture();
	};

	this.Name = function(){
        displayMessage(obj.id + "->GetName()");
		return obj.GetName();
	};

	this.Sex = function(){
        displayMessage(obj.id + "->GetSex()");
		return obj.GetSex();
	};

	this.Nation = function(){
        displayMessage(obj.id + "->GetNation()");
		return obj.GetNation();
	};

	this.Birthday = function(){
        displayMessage(obj.id + "->GetBirthday()");
		return obj.GetBirthday();
	};

	this.Address = function(){
        displayMessage(obj.id + "->GetAddress()");
		return obj.GetAddress();
	};

	this.Number = function(){
        displayMessage(obj.id + "->GetNumber()");
		return obj.GetNumber();
	};

	this.Department = function(){
        displayMessage(obj.id + "->GetDepartment()");
		return obj.GetDepartment();
	};

	this.StartTime = function(){
        displayMessage(obj.id + "->GetStartTime()");
		return obj.GetStartTime();
	};

	this.EndTime = function(){
        displayMessage(obj.id + "->GetEndTime()");
		return obj.GetEndTime();
	};

	this.PortraitFilePath = function(){
        displayMessage(obj.id + "->GetPortraitFilePath()");
		return obj.GetPortraitFilePath();
	};

	this.FrontFilePath = function(){
        displayMessage(obj.id + "->GetFrontFilePath()");
		return obj.GetFrontFilePath();
	};

	this.SetFrontFilePath = function(newval){
        displayMessage(obj.id + "->SetFrontFilePath("+newval+")");
        return obj.SetFrontFilePath(newval);
	};

	this.BackFilePath = function(){
        displayMessage(obj.id + "->GetBackFilePath()");
		return obj.GetBackFilePath();
	};

	this.SetBackFilePath = function(newval){
        displayMessage(obj.id + "->SetBackFilePath("+newval+")");
        return obj.SetBackFilePath(newval);
	};

};
})();

