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
        document.getElementById('InputA').disabled = true;
        document.getElementById('InputB').disabled = true;
        document.getElementById('InputC').disabled = true;
        document.getElementById('InitEPP').disabled = true;
        document.getElementById('Setkey').disabled = true;
        document.getElementById('DownloadKey').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Back').disabled = false;
        document.getElementById('InputA').disabled = false;
        document.getElementById('InputB').disabled = false;
        document.getElementById('InputC').disabled = false;
        document.getElementById('InitEPP').disabled = false;
        document.getElementById('Setkey').disabled = false;
        document.getElementById('DownloadKey').disabled = false;
    }
   //@User ocde scope start
    document.getElementById('InputA').onclick = function(){
         top.API.displayMessage("点击输入密钥A,响应<InputAMaster>"); 
         ButtonDisable();
         return CallResponse('InputAMaster');
    }

     document.getElementById('InputB').onclick = function () {
         top.API.displayMessage("点击输入密钥B,响应<InputBMaster>");
         ButtonDisable();
         return CallResponse('InputBMaster');
     }

     document.getElementById('InputC').onclick = function(){
         top.API.displayMessage("点击输入密钥C,响应<InputCMaster>"); 
         ButtonDisable();
         return CallResponse('InputCMaster');
    }

    document.getElementById('InitEPP').onclick = function(){
         top.API.displayMessage("点击初始化EPP键盘,响应<InitEPP>"); 
         ButtonDisable();
         return CallResponse('InitEpp');
    }

     document.getElementById('Setkey').onclick = function () {
         top.API.displayMessage("点击设定主密钥,响应<SetMasterKey>");
         ButtonDisable();
         return CallResponse('SetMasterKey');
     }

     document.getElementById('DownloadKey').onclick = function () {
         top.API.displayMessage("点击设定主密钥,响应<DownloadKey>");
         ButtonDisable();
         return CallResponse('DownloadKey');
     }

      document.getElementById('Back').onclick = function(){
         top.API.displayMessage("响应<Back>"); 
         ButtonDisable();
         return CallResponse('Back');
    }
   

})();
