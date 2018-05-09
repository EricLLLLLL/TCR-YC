(function(){
window.JSApiScr = function(ServiceName, InstanceName, obj){
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

	this.Reset = function(resetaction, timeout){
		displayMessage(obj.id + "->Reset(" + resetaction + "," + timeout + ")");
		return obj.Reset(resetaction, timeout);
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

	this.StMediaStatus = function(){
		displayMessage(obj.id + "->GetStMediaStatus()");
		return obj.GetStMediaStatus();
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

};
})();

