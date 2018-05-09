/*@create by:  liaolei
*@time: 2016年9月19日
*/
; (function(){
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        App.Cntl.ProcessDriven( Response );
    });
    var Initialize = function() {     
    }();
    document.getElementById('TransImg2').onclick = function(){

         return CallResponse('SetMasterKey');
    }

    document.getElementById('TransImg3').onclick = function(){

         return CallResponse('SetSysInfo');
    }

    document.getElementById('TransImg4').onclick = function(){

         return CallResponse('Digital');
    }

    document.getElementById('TransImg5').onclick = function(){

         return CallResponse('AppSetup');
    }

	document.getElementById('TransImg7').onclick = function () {

        return CallResponse('CrownSize');
    }
	
	document.getElementById('TransImg8').onclick = function () {

        return CallResponse('AddNewAdmin');
    }

    document.getElementById('TransImg11').onclick = function(){

        return CallResponse('DataStatistics');
    }

    document.getElementById('Exit').onclick = function(){

         return CallResponse('Exit');
    }


})();
