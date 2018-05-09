(function(){
window.JSApiPtr = function(ServiceName, InstanceName, obj){
	//inherit the base calss attribute
	JSDevApi.call(this, ServiceName, InstanceName, obj);

	this.Print = function(formname, fieldvalues, timeout){
		displayMessage(obj.id + "->Print(" + formname + "," + fieldvalues + "," + timeout + ")");
		return obj.Print(formname, fieldvalues, timeout);
	};

	this.ControlMedia = function(mediaaction, timeout){
		displayMessage(obj.id + "->ControlMedia(" + mediaaction + "," + timeout + ")");
		return obj.ControlMedia(mediaaction, timeout);
	};

	this.GetFormNamesSync = function(){
		displayMessage(obj.id + "->GetFormNamesSync()");
		return obj.GetFormNamesSync();
	};

	this.UpdateFormInfoSync = function(formname){
		displayMessage(obj.id + "->UpdateFormInfoSync(" + formname + ")");
		return obj.UpdateFormInfoSync(formname);
	};

	this.GetMediaNamesSync = function(){
		displayMessage(obj.id + "->GetMediaNamesSync()");
		return obj.GetMediaNamesSync();
	};

	this.UpdateMediaInfoSync = function(medianame){
		displayMessage(obj.id + "->UpdateMediaInfoSync(" + medianame + ")");
		return obj.UpdateMediaInfoSync(medianame);
	};

	this.PrintFile = function(filename, timeout, deletefile){
		displayMessage(obj.id + "->PrintFile(" + filename + "," + timeout + "," + deletefile + ")");
		return obj.PrintFile(filename, timeout, deletefile);
	};

	this.Reset = function(resetaction, timeout){
		displayMessage(obj.id + "->Reset(" + resetaction + "," + timeout + ")");
		return obj.Reset(resetaction, timeout);
	};

	this.StInkStatus = function(){
		displayMessage(obj.id + "->GetStInkStatus()");
		return obj.GetStInkStatus();
	};

	this.StMediaStatus = function(){
		displayMessage(obj.id + "->GetStMediaStatus()");
		return obj.GetStMediaStatus();
	};

	this.StPaperStatus = function(){
		displayMessage(obj.id + "->GetStPaperStatus()");
		return obj.GetStPaperStatus();
	};

	this.CpCanEject = function(){
		displayMessage(obj.id + "->GetCpCanEject()");
		return obj.GetCpCanEject();
	};

	this.CpCanCapture = function(){
		displayMessage(obj.id + "->GetCpCanCapture()");
		return obj.GetCpCanCapture();
	};

	this.CpCanStack = function(){
		displayMessage(obj.id + "->GetCpCanStack()");
		return obj.GetCpCanStack();
	};

	this.CpCanDetectMediaTaken = function(){
		displayMessage(obj.id + "->GetCpCanDetectMediaTaken()");
		return obj.GetCpCanDetectMediaTaken();
	};

	this.FormName = function(){
		displayMessage(obj.id + "->GetFormName()");
		return obj.GetFormName();
	};

	this.FormBase = function(){
		displayMessage(obj.id + "->GetFormBase()");
		return obj.GetFormBase();
	};

	this.FormUnitX = function(){
		displayMessage(obj.id + "->GetFormUnitX()");
		return obj.GetFormUnitX();
	};

	this.FormUnitY = function(){
		displayMessage(obj.id + "->GetStInkStatus()");
		return obj.GetFormUnitY();
	};

	this.FormWidth = function(){
		displayMessage(obj.id + "->GetFormWidth()");
		return obj.GetFormWidth();
	};

	this.FormHeight = function(){
		displayMessage(obj.id + "->GetFormHeight()");
		return obj.GetFormHeight();
	};

	this.FormAlignment = function(){
		displayMessage(obj.id + "->GetFormAlignment()");
		return obj.GetFormAlignment();
	};

	this.FormOrientation = function(){
		displayMessage(obj.id + "->GetFormOrientation()");
		return obj.GetFormOrientation();
	};

	this.FormOffsetX = function(){
		displayMessage(obj.id + "->GetFormOffsetX()");
		return obj.GetFormOffsetX();
	};

	this.FormOffsetY = function(){
		displayMessage(obj.id + "->GetFormOffsetY()");
		return obj.GetFormOffsetY();
	};

	this.FormVersionMajor = function(){
		displayMessage(obj.id + "->GetFormVersionMajor()");
		return obj.GetFormVersionMajor();
	};

	this.FormVersionMinor = function(){
		displayMessage(obj.id + "->GetFormVersionMinor()");
		return obj.GetFormVersionMinor();
	};

	this.FormUserPrompt = function(){
		displayMessage(obj.id + "->GetFormUserPrompt()");
		return obj.GetFormUserPrompt();
	};

	this.FormFields = function(){
		displayMessage(obj.id + "->GetFormFields()");
		return obj.GetFormFields();
	};

	this.FormFieldsIndexCount = function(){
		displayMessage(obj.id + "->GetFormFieldsIndexCount()");
		return obj.GetFormFieldsIndexCount();
	};

	this.FormFieldsType = function(){
		displayMessage(obj.id + "->GetFormFieldsType()");
		return obj.GetFormFieldsType();
	};

	this.FormFieldsClass = function(){
		displayMessage(obj.id + "->GetFormFieldsClass()");
		return obj.GetFormFieldsClass();
	};

	this.FormFieldsAccess = function(){
		displayMessage(obj.id + "->GetFormFieldsAccess()");
		return obj.GetFormFieldsAccess();
	};

	this.FormFieldsOverflow = function(){
		displayMessage(obj.id + "->GetFormFieldsOverflow()");
		return obj.GetFormFieldsOverflow();
	};

	this.FormFieldsInitialValue = function(){
		displayMessage(obj.id + "->GetFormFieldsInitialValue()");
		return obj.GetFormFieldsInitialValue();
	};

	this.FormFieldsFormat = function(){
		displayMessage(obj.id + "->GetFormFieldsFormat()");
		return obj.GetFormFieldsFormat();
	};

	this.MediaName = function(){
		displayMessage(obj.id + "->GetMediaName()");
		return obj.GetMediaName();
	};

	this.MediaType = function(){
		displayMessage(obj.id + "->GetMediaType()");
		return obj.GetMediaType();
	};

	this.MediaBase = function(){
		displayMessage(obj.id + "->GetMediaBase()");
		return obj.GetMediaBase();
	};

	this.MediaUnitX = function(){
		displayMessage(obj.id + "->GetMediaUnitX()");
		return obj.GetMediaUnitX();
	};

	this.MediaUnitY = function(){
		displayMessage(obj.id + "->GetMediaUnitY()");
		return obj.GetMediaUnitY();
	};

	this.MediaSizeWidth = function(){
		displayMessage(obj.id + "->GetMediaSizeWidth()");
		return obj.GetMediaSizeWidth();
	};

	this.MediaSizeHeight = function(){
		displayMessage(obj.id + "->GetMediaSizeHeight()");
		return obj.GetMediaSizeHeight();
	};

	this.MediaPageCount = function(){
		displayMessage(obj.id + "->GetMediaPageCount()");
		return obj.GetMediaPageCount();
	};

	this.MediaLineCount = function(){
		displayMessage(obj.id + "->GetMediaLineCount()");
		return obj.GetMediaLineCount();
	};

	this.MediaPrintAreaX = function(){
		displayMessage(obj.id + "->GetMediaPrintAreaX()");
		return obj.GetMediaPrintAreaX();
	};

	this.MediaPrintAreaY = function(){
		displayMessage(obj.id + "->GetMediaPrintAreaY()");
		return obj.GetMediaPrintAreaY();
	};

	this.MediaPrintAreaWidth = function(){
		displayMessage(obj.id + "->GetMediaPrintAreaWidth()");
		return obj.GetMediaPrintAreaWidth();
	};

	this.MediaPrintAreaHeight = function(){
		displayMessage(obj.id + "->GetMediaPrintAreaHeight()");
		return obj.GetMediaPrintAreaHeight();
	};

	this.MediaRestrictedAreaX = function(){
		displayMessage(obj.id + "->GetMediaRestrictedAreaX()");
		return obj.GetMediaRestrictedAreaX();
	};

	this.MediaRestrictedAreaY = function(){
		displayMessage(obj.id + "->GetMediaRestrictedAreaY()");
		return obj.GetMediaRestrictedAreaY();
	};

	this.MediaRestrictedAreaWidth = function(){
		displayMessage(obj.id + "->GetMediaRestrictedAreaWidth()");
		return obj.GetMediaRestrictedAreaWidth();
	};

	this.MediaRestrictedAreaHeight = function(){
		displayMessage(obj.id + "->GetMediaRestrictedAreaHeight()");
		return obj.GetMediaRestrictedAreaHeight();
	};

	this.MediaStagger = function(){
		displayMessage(obj.id + "->GetMediaStagger()");
		return obj.GetMediaStagger();
	};

	this.MediaFoldType = function(){
		displayMessage(obj.id + "->GetMediaFoldType()");
		return obj.GetMediaFoldType();
	};

};
})();

