/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function(){
	var strMasterKey = "";
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        Clearup();
        App.Cntl.ProcessDriven( Response );
    });
    var Initialize = function() {              
        ButtonDisable();
        EventLogin();
		top.API.gMasterkeyA = "";
        App.Plugin.Keyboard.show("1", "PageSubject", "KeyboardDiv");
        ButtonEnable();
    }();//Page Entry
    function ButtonDisable() {
        document.getElementById('OK').disabled = true;
        document.getElementById('Back').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('OK').disabled = false;
        document.getElementById('Back').disabled = false;
    }
   //全局变量：inputId，编辑框ID。
   var InputA = document.getElementById("FirstInput");
   var InputB = document.getElementById("SecondInput");
   var AMasterKey1 = "";
   var AMasterKey2 = "";
   
   InputA.focus();//将光标定义在第一个编辑框

    function onClearNum(){      
        InputA.value = '';                   
        InputB.value = '';                   
        AMasterKey1 = '';
        AMasterKey2 = '';
        InputA.focus();
    }

    function getLinePos(pInputId) {
        var range;
        var cursurPosition;
        pInputId.focus();
        range = document.selection.createRange();
        range.moveStart("character", -pInputId.value.length);
        cursurPosition = range.text.length;
        return cursurPosition;
    }     
	
    //将按键内容显示在当前编辑框内
    var oKeyboardKey = document.getElementsByClassName("KeyboardKey");
    for (var i = 0; i < oKeyboardKey.length; i++) {
        var keyEvent = oKeyboardKey[i];
        keyEvent.onclick = function (e) {            
            if ('退格' == this.innerText) {                    
                if ((AMasterKey1.length < 17) && (AMasterKey2.length == 0) && (AMasterKey1.length > 0)) {                        
                    AMasterKey1 = AMasterKey1.substr(0, (AMasterKey1.length-1));                        
                    InputA.value = AMasterKey1;
                }else if(AMasterKey2.length > 0){                    
                    AMasterKey2 = AMasterKey2.substr(0, (AMasterKey2.length-1));                    
                    InputB.value = AMasterKey2;                   
                }                    
		     }else if ('清除' == this.innerText) {
                onClearNum();
		     }else {
                document.getElementById("ErrorTip").style.display="none";
                if (AMasterKey1.length < 16) {
                        AMasterKey1  += this.innerText;
                    document.getElementById("FirstInput").value = AMasterKey1;           			    
                }else if(AMasterKey2.length < 16){
                    AMasterKey2  += this.innerText;
                    document.getElementById("SecondInput").value = AMasterKey2;  
                }
              }
                
            }
        }
    //退出按钮，响应触发事件
    document.getElementById('Back').onclick = function(){   
        ButtonDisable();   
        return CallResponse('Back');
    }

    document.getElementById('OK').onclick = function(){   
        ButtonDisable();   
        top.API.gMasterkeyA = strMasterKey;
        return CallResponse('OK');
    }
    document.getElementById('KeyboardKey_set').onclick = function(){
		strMasterKey= AMasterKey1+AMasterKey2;       
        if (strMasterKey.length == 32) { 
            var HexMasterKey=top.stringToHex(strMasterKey);
            var strKeyname='MasterKey';
            var tmphexArray = new Array(0);
            top.API.Pin.ExtendedLoadKey("MasterKey",HexMasterKey,"CRYPT,FUNCTION,MACING,KEYENCKEY",tmphexArray);   
        }else{
            onClearNum();
            document.getElementById("ErrorTip").style.display="inline";
		}
    } 
    //@User code scope end 

    //event handler
    function onKeyLoaded(){
        top.API.displayMessage('主密钥A加载成功');
        //获取校验值
        var objGetKVC = top.API.Dat.GetDataSync("KVC", "STRING");
        if (objGetKVC == "" || null == objGetKVC) {
            top.API.displayMessage("GetDataSync KVC  objGetKVC = null 读取失败");
            document.getElementById("CheckCode").value = "校验值获取失败";
        }
        else {
            top.API.displayMessage("GetDataSync DEALTYPE Return:" + objGetKVC);
            document.getElementById("CheckCode").value = objGetKVC[0];
        }        
        document.getElementById("OK").style.display = "block"; 
        ButtonEnable(); 
    }

   //event handler
	function onDeviceError(){
		 return CallResponse("Back");
	}
	function onKeyLoadFailed(){
		 return CallResponse("Back");
	}
   
    //Register the event
    function EventLogin() {
		top.API.Pin.addEvent('KeyLoadFailed', onKeyLoadFailed);
        top.API.Pin.addEvent('KeyLoaded',onKeyLoaded);
		top.API.Pin.addEvent('DeviceError ',onDeviceError );
    }

    function EventLogout() {
		top.API.Pin.removeEvent('KeyLoadFailed', onKeyLoadFailed);
        top.API.Pin.removeEvent('KeyLoaded',onKeyLoaded);
        top.API.Pin.removeEvent('DeviceError ',onDeviceError );     
    }


      //remove all event handler
    function Clearup(){
        EventLogout();
    }
})();
