(function(){
window.JSApiCrd = function(ServiceName, InstanceName, obj){
	//inherit the base calss attribute
	JSDevApi.call(this, ServiceName, InstanceName, obj);

	this.AcceptAndReadAvailableTracks = function(trackmap, timeout){
		displayMessage(obj.id + "->AcceptAndReadAvailableTracks(" + trackmap + "," + timeout + ")");
		return obj.AcceptAndReadAvailableTracks(trackmap, timeout);
	};

	this.AcceptAndReadTracks = function(trackmap, timeout){
		displayMessage(obj.id + "->AcceptAndReadTracks(" + trackmap + "," + timeout + ")");
		return obj.AcceptAndReadTracks(trackmap, timeout);
	};

	this.CancelAccept = function(){
		displayMessage(obj.id + "->CancelAccept()");
		return obj.CancelAccept();
	};

	this.Eject = function(timeout){
		displayMessage(obj.id + "->Eject(" + timeout + ")");
		return obj.Eject(timeout);
	};

	this.Capture = function(timeout){
		displayMessage(obj.id + "->Capture(" + timeout + ")");
		return obj.Capture(timeout);
	};

	this.AcceptAndChipInitialise = function(token, timeout){
		displayMessage(obj.id + "->AcceptAndChipInitialise(" + token + "," + timeout + ")");
		return obj.AcceptAndChipInitialise(token, timeout);
	};

	this.ChipPower = function(action){
		displayMessage(obj.id + "->ChipPower(" + action + ")");
		return obj.ChipPower(action);
	};

	this.ResetBinCountSync = function(){
		displayMessage(obj.id + "->ResetBinCountSync()");
		return obj.ResetBinCountSync();
	};

	this.Reset = function(resetaction, timeout){
		displayMessage(obj.id + "->Reset(" + resetaction + "," + timeout + ")");
		return obj.Reset(resetaction, timeout);
	};

	this.PBOCGetICInfo = function(timeout){
		displayMessage(obj.id + "->PBOCGetICInfo(" + timeout + ")");
		return obj.PBOCGetICInfo(timeout);
	};

	this.PBOCReadIcTLV = function(timeout){
		displayMessage(obj.id + "->PBOCReadIcTLV(" + timeout + ")");
		return obj.PBOCReadIcTLV(timeout);
	};

	this.GetCardBankType = function(strTracks){
		displayMessage(obj.id + "->GetCardBankType(" + strTracks + ")");
		return obj.GetCardBankType(strTracks);
	};

	this.CpBinSize = function(){
        displayMessage(obj.id + "->GetCpBinSize()");
		return obj.GetCpBinSize();
	};

	this.CpCanCapture = function(){
        displayMessage(obj.id + "->GetCpCanCapture()");
		return obj.GetCpCanCapture();
	};

	this.CpCanEject = function(){
        displayMessage(obj.id + "->GetCpCanEject()");
		return obj.GetCpCanEject();
	};

	this.CpCanReadTrack1 = function(){
        displayMessage(obj.id + "->GetCpCanReadTrack1()");
		return obj.GetCpCanReadTrack1();
	};

	this.CpCanReadTrack2 = function(){
        displayMessage(obj.id + "->GetCpCanReadTrack2()");
		return obj.GetCpCanReadTrack2();
	};

	this.CpCanReadTrack3 = function(){
        displayMessage(obj.id + "->GetCpCanReadTrack3()");
		return obj.GetCpCanReadTrack3();
	};

	this.CpCanReadTrackJIS2 = function(){
        displayMessage(obj.id + "->GetCpCanReadTrackJIS2()");
		return obj.GetCpCanReadTrackJIS2();
	};

	this.CpCanWriteTrack1 = function(){
        displayMessage(obj.id + "->GetCpCanWriteTrack1()");
		return obj.GetCpCanWriteTrack1();
	};

	this.CpCanWriteTrack2 = function(){
        displayMessage(obj.id + "->GetCpCanWriteTrack2()");
		return obj.GetCpCanWriteTrack2();
	};

	this.CpCanWriteTrack3 = function(){
        displayMessage(obj.id + "->GetCpCanWriteTrack3()");
		return obj.GetCpCanWriteTrack3();
	};

	this.CpSecurity = function(){
        displayMessage(obj.id + "->GetCpSecurity()");
		return obj.GetCpSecurity();
	};

	this.CpVariant = function(){
        displayMessage(obj.id + "->GetCpVariant()");
		return obj.GetCpVariant();
	};

	this.CpChipPower = function(){
        displayMessage(obj.id + "->GetCpChipPower()");
		return obj.GetCpChipPower();
	};

	this.CpPowerSaveModeControl = function(){
        displayMessage(obj.id + "->GetCpPowerSaveModeControl()");
		return obj.GetCpPowerSaveModeControl();
	};

	this.CpSupportedGuidelights = function(){
        displayMessage(obj.id + "->GetCpSupportedGuidelights()");
		return obj.GetCpSupportedGuidelights();
	};

	this.StBinCount = function(){
        displayMessage(obj.id + "->GetStBinCount()");
		return obj.GetStBinCount();
	};

	this.StBinStatus = function(){
        displayMessage(obj.id + "->GetStBinStatus()");
		return obj.GetStBinStatus();
	};

	this.StMediaStatus = function(){
        displayMessage(obj.id + "->GetStMediaStatus()");
		return obj.GetStMediaStatus();
	};

	this.StChipStatus = function(){
        displayMessage(obj.id + "->GetStChipStatus()");
		return obj.GetStChipStatus();
	};

	this.Track1 = function(){
        displayMessage(obj.id + "->GetTrack1()");
		return obj.GetTrack1();
	};

	this.Track2 = function(){
        displayMessage(obj.id + "->GetTrack2()");
		return obj.GetTrack2();
	};

	this.Track3 = function(){
        displayMessage(obj.id + "->GetTrack3()");
		return obj.GetTrack3();
	};

	this.Track1Status = function(){
        displayMessage(obj.id + "->GetTrack1Status()");
		return obj.GetTrack1Status();
	};

	this.Track2Status = function(){
        displayMessage(obj.id + "->GetTrack2Status()");
		return obj.GetTrack2Status();
	};

	this.Track3Status = function(){
        displayMessage(obj.id + "->GetTrack3Status()");
		return obj.GetTrack3Status();
	};

	this.AnswerToReset = function(){
        displayMessage(obj.id + "->GetAnswerToReset()");
		return obj.GetAnswerToReset();
	};

	this.CardNumber = function(){
        displayMessage(obj.id + "->GetCardNumber()");
		return obj.GetCardNumber();
	};

	this.CardSerial = function(){
        displayMessage(obj.id + "->GetCardSerial()");
		return obj.GetCardSerial();
	};

	this.StartTime = function(){
        displayMessage(obj.id + "->GetStartTime()");
		return obj.GetStartTime();
	};

	this.EndTime = function(){
        displayMessage(obj.id + "->GetEndTime()");
		return obj.GetEndTime();
	};

	this.Name = function(){
        displayMessage(obj.id + "->GetName()");
		return obj.GetName();
	};

	this.NameExpend = function(){
        displayMessage(obj.id + "->GetNameExpend()");
		return obj.GetNameExpend();
	};

	this.IDNumber = function(){
        displayMessage(obj.id + "->GetIDNumber()");
		return obj.GetIDNumber();
	};

	this.IType = function(){
        displayMessage(obj.id + "->GetIType()");
		return obj.GetIType();
	};

};
})();

