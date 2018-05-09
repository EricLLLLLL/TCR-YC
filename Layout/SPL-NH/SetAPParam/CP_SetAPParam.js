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
        document.getElementById('Version').disabled = true;
        document.getElementById('TransType').disabled = true;
        document.getElementById('Terminal').disabled = true;
        document.getElementById('QuotaSet').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Exit').disabled = false;
        document.getElementById('Version').disabled = false;
        document.getElementById('TransType').disabled = false;
        document.getElementById('Terminal').disabled = false;
        document.getElementById('QuotaSet').disabled = false;
    }
   //@User ocde scope start
    document.getElementById('Version').onclick = function(){
        ButtonDisable();
         return CallResponse('Version');
    }
    document.getElementById('TransType').onclick = function(){
        ButtonDisable();
         return CallResponse('TransType');
    }
    document.getElementById('Terminal').onclick = function(){
        ButtonDisable();
         return CallResponse('Terminal');
    }
    document.getElementById('QuotaSet').onclick = function(){
        ButtonDisable();
         return CallResponse('QuotaSet');
    }
    document.getElementById('Exit').onclick = function(){
        ButtonDisable();
         return CallResponse('Exit');
    }
   

})();
