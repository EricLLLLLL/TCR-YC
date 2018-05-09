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
            document.getElementById('tip').innerText = "设备故障,请检查设备！";
        } else {
            if (top.API.gNoPtrSerFlag) {
                document.getElementById('NoPtrTip').style.display = "block";
            }else{
				document.getElementById('NoPtrTip').style.display = "none";
			}
            document.getElementById('tip').innerText = "是否确定进行轧账操作?";
        }
        ButtonEnable();
    }();//Page Entry
    function ButtonDisable() {
        document.getElementById('Back').disabled = true;
        document.getElementById('OK').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Back').disabled = false;
        document.getElementById('OK').disabled = false;
    }
   //@User ocde scope start
    document.getElementById("Back").onclick = function(){
        ButtonDisable();
         return CallResponse("Back");
    }

    document.getElementById("OK").onclick = function(){
        ButtonDisable();
         return CallResponse("OK");
    }

    document.getElementById("PageRoot").onclick = function () {
        ButtonDisable();
        return CallResponse("Exit");
    }

   
})();