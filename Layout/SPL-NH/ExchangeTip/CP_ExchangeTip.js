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
    }

    document.getElementById("Exit").onclick = function(){
        ButtonDisable();
         return CallResponse("Exit");
    }


})();