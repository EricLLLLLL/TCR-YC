/*@create by:  tsxiong
 *@time: 2016年03月20日
 */
;
(function () {

    var CallResponse = App.Cntl.ProcessOnce(function (Response) {
        //TO DO:
        Clearup();
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        EventLogin();
    }();

    function ButtonDisable() {
        document.getElementById('Back').disabled = true;
        document.getElementById('OK').disabled = true;
        document.getElementById('PageRoot').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Back').disabled = false;
        document.getElementById('OK').disabled = false;
        document.getElementById('PageRoot').disabled = false;
    }
    //@User ocde scope start
    document.getElementById("Back").onclick = function () {
        ButtonDisable();
        return CallResponse("Back");
    }
    document.getElementById("Back").onclick = function () {
        ButtonDisable();
        return CallResponse("Back");
    }
    document.getElementById("PageRoot").onclick = function () {
        ButtonDisable();
        return CallResponse("Exit");
    }

    document.getElementById("OK").onclick = function () {
        ButtonDisable();
        top.API.Jnl.PrintSync("ShutDown");
        top.API.Sys.UpTransFile();
        document.getElementById("tip").innerHTML = "正在上传对账文件，请稍候..."; 

    }

    document.getElementById("PageRoot").onclick = function () {
        ButtonDisable();
        return CallResponse("Exit");
    }



    function onUploadFileFailed() {
        top.API.displayMessage("onUploadFileFailed触发");
        document.getElementById("tip").innerHTML = "上传文件失败，正在关机请稍候...";
        top.API.Sys.ShutDown();
    }
    function onUploadFileSucceed() {
        top.API.displayMessage("onUploadFileSucceed触发");
        document.getElementById("tip").innerHTML = "正在关机，请稍候...";
        top.API.Sys.ShutDown();
    }
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