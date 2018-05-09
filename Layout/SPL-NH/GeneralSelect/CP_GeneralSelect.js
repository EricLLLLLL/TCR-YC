/*@create by:  liaolei
*@time: 2016年9月19日
*/
; (function(){
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        App.Cntl.ProcessDriven( Response );
    });
    var Initialize = function() {     
    }();//Page Entry

   //@User ocde scope start
    document.getElementById('TransImg1').onclick = function(){

         return CallResponse('Exchange');
    }

    document.getElementById('TransImg6').onclick = function(){

        return CallResponse('FingerInput');
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
    document.getElementById('TransImg9').onclick = function () {

        return CallResponse('FingerSign');
    }

    document.getElementById('TransImg11').onclick = function(){

        return CallResponse('DataStatistics');
    }

    document.getElementById('Exit').onclick = function(){

         return CallResponse('Exit');
    }


})();
