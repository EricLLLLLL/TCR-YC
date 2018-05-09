/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function(){
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        App.Cntl.ProcessDriven( Response );
    });
    var Initialize = function() {     
    }();//Page Entry
    function ButtonDisable() {
        document.getElementById('Exit').disabled = true;
        document.getElementById('IPSet').disabled = true;
        document.getElementById('UnitSet').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Exit').disabled = false;
        document.getElementById('IPSet').disabled = false;
        document.getElementById('UnitSet').disabled = false;
    }
   //@User ocde scope start
    document.getElementById('Exit').onclick = function () {
        ButtonDisable();
        return CallResponse('Exit');
    }
    document.getElementById('IPSet').onclick = function(){
        ButtonDisable();
         return CallResponse('IPSet');
    }
    document.getElementById('UnitSet').onclick = function(){
        ButtonDisable();
         return CallResponse('UnitSet');
    }


})();
