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
        document.getElementById('InputA').disabled = true;
        document.getElementById('InitEPP').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Exit').disabled = false;
        document.getElementById('InputA').disabled = false;
        document.getElementById('InitEPP').disabled = false;
    }
   //@User ocde scope start
    document.getElementById('InputA').onclick = function(){
         top.API.displayMessage("点击输入密钥A,响应<InputAMaster>"); 
         ButtonDisable();
         return CallResponse('InputAMaster');
    }

    document.getElementById('InitEPP').onclick = function(){
         top.API.displayMessage("点击初始化EPP键盘,响应<InitEPP>"); 
         ButtonDisable();
         return CallResponse('InitEpp');
    }

      document.getElementById('Exit').onclick = function(){
         top.API.displayMessage("响应<Exit>"); 
         ButtonDisable();
         return CallResponse('Exit');
    }
   

})();
