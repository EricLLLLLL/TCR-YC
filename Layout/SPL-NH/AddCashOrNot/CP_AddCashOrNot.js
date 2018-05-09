/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function(){
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        App.Cntl.ProcessDriven( Response );
    });
    var Initialize = function() {      
	    ButtonDisable();
        if (top.API.Cim.StDetailedDeviceStatus() != "ONLINE") {
            document.getElementById('OK').style.display = "none";
            document.getElementById('tip').innerText = "设备故障,请尝试复位！";
        }else{
            if (top.API.gNoPtrSerFlag) {
                document.getElementById('NoPtrTip').style.display = "block";
            }else{
				document.getElementById('NoPtrTip').style.display = "none";
			}
            document.getElementById('tip').innerText = "是否确定进行加钞操作?";
        }
        ButtonEnable();
    }();//Page Entry
    function ButtonDisable() {
        document.getElementById('Exit').disabled = true;
        document.getElementById('OK').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Exit').disabled = false;
        document.getElementById('OK').disabled = false;
    }
   //@User ocde scope start
    document.getElementById("Exit").onclick = function(){
        ButtonDisable();
         return CallResponse("Exit");
    }

    document.getElementById("OK").onclick = function(){
        ButtonDisable();
         return CallResponse("OK");
    }
   
        
   
})();