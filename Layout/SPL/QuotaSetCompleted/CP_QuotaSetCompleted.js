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
        document.getElementById('Back').disabled = true;
    }

   //@User ocde scope start
    document.getElementById('Back').onclick = function(){
        ButtonDisable();
        return CallResponse('Back');
    }
   

})();
