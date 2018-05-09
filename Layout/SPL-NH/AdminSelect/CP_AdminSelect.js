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
        document.getElementById('Exit').disabled = true;
        document.getElementById('Add').disabled = true;
        document.getElementById('Change').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Exit').disabled = false;
        document.getElementById('Add').disabled = false;
        document.getElementById('Change').disabled = false;
    }
    //@User ocde scope start
    document.getElementById('Exit').onclick = function () {
        ButtonDisable();
        return CallResponse('Exit');
    }
    document.getElementById('Add').onclick = function () {
        ButtonDisable();
        return CallResponse('OK');
    }
    document.getElementById('Change').onclick = function () {
        ButtonDisable();
        return CallResponse('ChangePsw');
    }


   
})();
