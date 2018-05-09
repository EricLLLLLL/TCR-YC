/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
    } (); //Page Entry
    function ButtonDisable() {
        document.getElementById('Back').disabled = true;
        document.getElementById('OK').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Back').disabled = false;
        document.getElementById('OK').disabled = false;
    }
    //@User ocde scope start
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
        document.getElementById("tip").innerHTML = "正在关机，请稍候...";
        top.API.Jnl.PrintSync("ReBoot");
        top.API.Sys.Reboot();        
    }

    
})();