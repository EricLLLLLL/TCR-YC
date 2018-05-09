(function(){
window.JSApiAss = function(ServiceName, InstanceName, obj){
	//inherit the base calss attribute
    this.addEvent = function (event, handler) {
        displayMessage(obj.id + "->attachEvent(" + event + ")");
        return obj.attachEvent(event, handler);
    };
    this.removeEvent = function (event, handler) {
        displayMessage(obj.id + "->detachEvent(" + event + ")");
        return obj.detachEvent(event, handler);
    };

    this.OpenConnectionSync = function (strAissAddr, strAppNo, strAppCheck, strUserNo, strBranchCode, strBusinessNo, strBatchNo) {
        displayMessage(obj.id + "->OpenConnectionSync(" + strAissAddr + "," + strAppNo + "," + strAppCheck + "," + strUserNo + "," + strBranchCode + "," + strBusinessNo + "," + strBatchNo + ")");
        return obj.OpenConnectionSync(strAissAddr, strAppNo, strAppCheck, strUserNo, strBranchCode, strBusinessNo, strBatchNo);
	};

    this.SaveBase64ToFileSync = function (strBase64) {
        displayMessage(obj.id + "->SaveBase64ToFileSync(" + strBase64 + ")");
        return obj.SaveBase64ToFileSync(strBase64);
    };

    this.GetMD5ByFileSync = function (strCheckPicPath,bByte) {
        displayMessage(obj.id + "->GetMD5ByFileSync(" + strCheckPicPath + "," + bByte + ")");
        return obj.GetMD5ByFileSync(strCheckPicPath, bByte);
	};

    this.AssUpload = function (strFileNeme) {
        displayMessage(obj.id + "->AssUpload(" + strFileNeme + ")");
        return obj.AssUpload(strFileNeme);
    };

    this.AssDownload = function () {
        displayMessage(obj.id + "->AssDownload()");
        return obj.AssDownload();
    };

    this.BcdStartServiceSync = function (strWndName, strBtnName, strExeFolder) {
        displayMessage(obj.id + "->BcdStartServiceSync(" + strWndName + "," + strBtnName + "," + strExeFolder + ")");
        return obj.BcdStartServiceSync(strWndName, strBtnName, strExeFolder);
    };

    this.BcdEndServiceSync = function () {
        displayMessage(obj.id + "->BcdEndServiceSync()");
        return obj.BcdEndServiceSync();
    };
};
})();

