/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
		EventLogin();
    } (); 
    function ButtonDisable() {
        document.getElementById('Exit').disabled = true;
        document.getElementById('OK').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Exit').disabled = false;
        document.getElementById('OK').disabled = false;
    }
    //@User ocde scope start
    document.getElementById("Exit").onclick = function () {
        ButtonDisable();
        return CallResponse("OK");
    }

    document.getElementById("OK").onclick = function () {
        ButtonDisable();
	top.API.Jnl.PrintSync("ShutDown");
		top.API.Sys.UpTransFile();
	document.getElementById("tip").innerHTML = "正在上传对账文件，请稍候..."; 
      
    }

    function onUploadFileFailed() {
        top.API.displayMessage("onUploadFileFailed触发");
document.getElementById("tip").innerHTML = "正在关机，请稍候...";
		top.API.Sys.ShutDown(); 
    }
    //event handler
    function onUploadFileSucceed() {
        top.API.displayMessage("onUploadFileSucceed触发");
document.getElementById("tip").innerHTML = "正在关机，请稍候...";
		top.API.Sys.ShutDown(); 
    }

    //Register the event
    function EventLogin() {
		top.API.Sys.addEvent('UploadFileFailed', onUploadFileFailed);
        top.API.Sys.addEvent('UploadFileSucceed', onUploadFileSucceed);
    }

    function EventLogout() {
		top.API.Sys.removeEvent('UploadFileFailed', onUploadFileFailed);
        top.API.Sys.removeEvent('UploadFileSucceed', onUploadFileSucceed);
    }


    //remove all event handler
    function Clearup() {
        EventLogout();
    }
})();