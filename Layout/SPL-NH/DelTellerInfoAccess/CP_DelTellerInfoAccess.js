; (function(){
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        App.Cntl.ProcessDriven( Response );
    });
    var Initialize = function() {
    }();//Page Entry

    document.getElementById('OK').onclick = function(){
        document.getElementById('OK').disabled = true;
         return CallResponse('Exit');
    }
   

})();
