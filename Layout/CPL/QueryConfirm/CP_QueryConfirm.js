/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function () {
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });
    var Initialize = function () {
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        ButtonDisable();
        EventLogin();
        //@initialize scope start
		var strBalance;
        var objGet3 = top.API.Dat.GetDataSync(top.API.currentbalanceTag, top.API.currentbalanceType);        
        if (null == objGet3) {
            top.API.displayMessage("GetDataSync CURRENTBALANCE objGet = null");
        }
        else {
            top.API.displayMessage("GetDataSync CURRENTBALANCE Return:" + objGet3.toArray());            
            if (objGet3.toArray()[0].length > 2) {
                strBalance = objGet3.toArray()[0].substr(0,(objGet3.toArray()[0].length-2));
                strBalance += ".";
                strBalance += objGet3.toArray()[0].substr((objGet3.toArray()[0].length-2),2);
            }else if (objGet3.toArray()[0].length == 2) {
                strBalance = "0."+ objGet3.toArray()[0];
            }else if (objGet3.toArray()[0].length == 1) {
                strBalance = "0.0"+ objGet3.toArray()[0];
            }
            document.getElementById("InputPwd-input").value = strBalance;
        }
        ButtonEnable();
        App.Plugin.Voices.play("voi_33");
    }();//Page Entry

    //@User ocde scope start
    function ButtonDisable() {
        top.API.displayMessage("ButtonDisable");
        document.getElementById('Exit').disabled = true;
        document.getElementById('Back').disabled = true;
    }

    function ButtonEnable() {
        top.API.displayMessage("ButtonEnable");
        document.getElementById('Exit').disabled = false;
        document.getElementById('Back').disabled = false;
    }

    document.getElementById("Exit").onclick = function () {
        ButtonDisable();
        return CallResponse("Exit");
    }

    document.getElementById("Back").onclick = function () {
        ButtonDisable();
        return CallResponse("Back");
    }

    //@User code scope end

    //event handler

    //Register the event
    function EventLogin() {
    }

    function EventLogout() {
    }
    //Countdown function
    function TimeoutCallBack() {     
        return CallResponse('TimeOut');
    }

    //Page Return
    

    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
        App.Plugin.Voices.del();
        App.Timer.ClearTime();
    }




})();