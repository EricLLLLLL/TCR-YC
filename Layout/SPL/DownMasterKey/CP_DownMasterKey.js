/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function(){
    var keyFlag = 1;//主密钥：1      工作密钥：2
    var Akey = "";
    var Bkey = "";
    var Ckey = "";
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
    //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven( Response );
    });
    var Initialize = function() {    
        ButtonDisable();  
        EventLogin();
        if (checkkey()) {
            DownMasterKey();
        }else{
            document.getElementById("PromptDiv3").style.display = "block";
            document.getElementById("PromptDiv2").style.display = "none";
            document.getElementById("PromptDiv1").style.display = "none";
            document.getElementById("OK").style.display = "block"; 
            ButtonEnable();
        }
    }();//Page Entry
    //@User ocde scope start   
    function ButtonDisable() {
        document.getElementById('OK').disabled = true;
        document.getElementById('Back').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('OK').disabled = false;
        document.getElementById('Back').disabled = false;
    }
    
    function checkkey() {
        Akey = top.API.gMasterkeyA;
        Bkey = top.API.gMasterkeyB;
        Ckey = top.API.gMasterkeyC;
        if (Akey == "" || Bkey == "" || Ckey == ""){
            return false;
        }else{
            return true;
        }        
    }
   //@User ocde scope start
    function DownMasterKey(){
        var strMasterKey = top.stringXORstring(Akey, Bkey, Ckey, 32);
        var HexMasterKey = top.stringToHex(strMasterKey);
        var strKeyname = 'MasterKey';
        var tmphexArray = new Array(0);
        //top.API.displayMessage("A密钥：" + Akey + "/B密钥：" + Bkey + "/C密钥：" + Ckey + "/主密钥：" + HexMasterKey);
        top.API.Pin.ExtendedLoadKey("MasterKey", HexMasterKey, "CRYPT,FUNCTION,MACING,KEYENCKEY", tmphexArray);           
    }

    function DownWorkKey() {
        var strWorkKey = '0123456789ABCDEF1122334455667788';
        var HexWorkKey=top.stringToHex(strWorkKey);
        var tmphexArray = new Array();
        top.API.Pin.ExtendedLoadEncryptedKey("WorkingKey",HexWorkKey,"MasterKey","CRYPT,FUNCTION,MACING,KEYENCKEY",tmphexArray);        
   }

    document.getElementById('OK').onclick = function(){
        ButtonDisable();
        top.API.gMasterkeyA = "";
        top.API.gMasterkeyB = "";
        top.API.gMasterkeyC = "";
        return CallResponse("OK");
    }   
    document.getElementById('Back').onclick = function(){
        ButtonDisable();
        return CallResponse("Back");
    }   
    //@User code scope end 

    //event handler
    function onKeyLoaded(){
        top.API.displayMessage('主密钥下载成功');
        document.getElementById("PromptDiv3").style.display = "none";
        document.getElementById("PromptDiv2").style.display = "block";
        document.getElementById("PromptDiv1").style.display = "none";
        document.getElementById("OK").style.display = "block"; 
        ButtonEnable(); 
    }

   //event handler
    function onDeviceError(){
        top.API.displayMessage('触发事件：onDeviceError()');
        document.getElementById("PromptDiv3").style.display = "block";
        document.getElementById("PromptDiv2").style.display = "none";
        document.getElementById("PromptDiv1").style.display = "none";
        document.getElementById("Back").style.display = "block"; 
        ButtonEnable(); 
         return CallResponse("Back");
   }
   
   function onKeyLoadFailed(){
        top.API.displayMessage('触发事件：onKeyLoadFailed()');
        document.getElementById("PromptDiv3").style.display = "block";
        document.getElementById("PromptDiv2").style.display = "none";
        document.getElementById("PromptDiv1").style.display = "none";
        document.getElementById("Back").style.display = "block"; 
        ButtonEnable(); 
         return CallResponse("Back");
   }
   
    //Register the event
    function EventLogin() {
        top.API.Pin.addEvent('KeyLoaded',onKeyLoaded);
		top.API.Pin.addEvent('KeyLoadFailed', onKeyLoadFailed); 
		top.API.Pin.addEvent('DeviceError ',onDeviceError );
    }

    function EventLogout() {
        top.API.Pin.removeEvent('KeyLoaded',onKeyLoaded);
		top.API.Pin.removeEvent('KeyLoadFailed', onKeyLoadFailed); 
        top.API.Pin.removeEvent('DeviceError ',onDeviceError );     
    }

      //remove all event handler
    function Clearup(){
		EventLogout();
    }
})();
