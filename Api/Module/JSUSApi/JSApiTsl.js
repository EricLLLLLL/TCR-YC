(function(){
window.JSApiTsl = function(ServiceName, InstanceName, obj){
	//inherit the base calss attribute
	JSUSApi.call(this, obj);

	this.AddTransLogSync = function(strtranslog){
		displayMessage(obj.id + "->AddTransLogSync(" + strtranslog + ")");
		return obj.AddTransLogSync(strtranslog);
	};

	this.CountTypeSync = function(strstartdate, strenddate, strtype){
		displayMessage(obj.id + "->CountTypeSync(" + strstartdate + "," + strenddate + "," + strtype + ")");
		return obj.CountTypeSync(strstartdate, strenddate, strtype);
	};

	this.SumTypeMoneySync = function(strstartdate, strenddate, strtype){
		displayMessage(obj.id + "->SumTypeMoneySync(" + strstartdate + "," + strenddate + "," + strtype + ")");
		return obj.SumTypeMoneySync(strstartdate, strenddate, strtype);
	};

	this.HandleRecordFileSync = function(id, strtransdata){
		displayMessage(obj.id + "->HandleRecordFileSync(" + id + "," + strtransdata + ")");
		return obj.HandleRecordFileSync(id, strtransdata);
	};

	this.InitJnlSync = function(strfilename, nlinesperpage){
		displayMessage(obj.id + "->InitJnlSync(" + strfilename + "," + nlinesperpage + ")");
		return obj.InitJnlSync(strfilename, nlinesperpage);
	};

	this.UnInitJnlSync = function(){
		displayMessage(obj.id + "->UnInitJnlSync()");
		return obj.UnInitJnlSync();
	};

	this.ReadJNLSync = function(nupdownflag, nlineorpageflag){
		displayMessage(obj.id + "->ReadJNLSync(" + nupdownflag + "," + nlineorpageflag + ")");
		return obj.ReadJNLSync(nupdownflag, nlineorpageflag);
	};

	this.SearchJNLSync = function(nbeginflag, ntype, ssubstring){
		displayMessage(obj.id + "->SearchJNLSync(" + nbeginflag + "," + ntype + "," + ssubstring + ")");
		return obj.SearchJNLSync(nbeginflag, ntype, ssubstring);
	};

	this.InitFsnSync = function(strfilename){
		displayMessage(obj.id + "->InitFsnSync(" + strfilename + ")");
		return obj.InitFsnSync(strfilename);
	};

	this.UnInitFsnSync = function(){
		displayMessage(obj.id + "->UnInitFsnSync()");
		return obj.UnInitFsnSync();
	};

	this.ReadFSNSync = function(){
		displayMessage(obj.id + "->ReadFSNSync()");
		return obj.ReadFSNSync();
	};

	this.SearchFSN = function(starttime, endtime, strsno, strjnlnum, straccountno){
		displayMessage(obj.id + "->SearchFSN(" + starttime + "," + endtime + "," + strsno + "," + strjnlnum + "," + straccountno + ")");
		return obj.SearchFSN(starttime, endtime, strsno, strjnlnum, straccountno);
	};

	this.UpdateRecord = function(data){
		displayMessage(obj.id + "->UpdateRecord(" + data + ")");
		return obj.UpdateRecord(data);
	};

	this.UpdateCheckRecord = function(data){
		displayMessage(obj.id + "->UpdateCheckRecord(" + data + ")");
		return obj.UpdateCheckRecord(data);
	};

	this.UpdateTransLogSync = function(strtranslog){
		displayMessage(obj.id + "->UpdateTransLogSync(" + strtranslog + ")");
		return obj.UpdateTransLogSync(strtranslog);
	};

	this.SumDataSync = function(strstartdate, strenddate){
		displayMessage(obj.id + "->SumDataSync(" + strstartdate + "," + strenddate + ")");
		return obj.SumDataSync(strstartdate, strenddate);
	};

};
})();

