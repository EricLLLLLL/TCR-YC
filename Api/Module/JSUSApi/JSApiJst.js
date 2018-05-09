(function(){
window.JSApiJst = function(ServiceName, InstanceName, obj){
	//inherit the base calss attribute
	JSUSApi.call(this, obj);

	    this.setData = function(url,path){
			displayMessage("CJSToolCtrl->setData(" + url + "," + path +")");
			return obj.setData(url,path);
		};
	    this.getFile = function(){
			displayMessage("CJSToolCtrl->getFile");
			return obj.getFile();
		};
	    this.PlaySound = function(strFileName){
			displayMessage("CJSToolCtrl->PlaySound(" + strFileName +")");
			return obj.PlaySound(strFileName);
		};
	    this.StopSound = function(){
			displayMessage("CJSToolCtrl->StopSound");
			return obj.StopSound();
		};
		this.WriteReceiptFile = function(filepath,receiptdata){
			displayMessage("CJSToolCtrl->WriteReceiptFile("+filepath + "," + receiptdata + ")");
			return obj.WriteReceiptFile(filepath,receiptdata);
		};
		this.ClearMemoryCache = function(){
			displayMessage("CJSToolCtrl->ClearMemoryCache");
			return obj.ClearMemoryCache();
		};
		this.ReloadPage = function(){
			displayMessage("CJSToolCtrl->ReloadPage");
			return obj.ReloadPage();
		};
};
})();

