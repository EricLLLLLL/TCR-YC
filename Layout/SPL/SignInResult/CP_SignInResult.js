; (function(){
    var CallResponse = App.Cntl.ProcessOnce (function (Response) { 
    //TO DO:
         Clearup();
        //Entry the flows control process.
          App.Cntl.ProcessDriven( Response );
        }),
       Initialize = function() {
        EventLogin();
      //@initialize scope start                 

        if (top.ErrorInfo == "") {
            if (top.API.SignType == "SignIn") {
                $("#SignTitle").text("签到结果");
                $("#SuccessedDiv").text("指纹通过，签到成功");
            } else {
                $("#SignTitle").text("签退结果");
                $("#SuccessedDiv").text("指纹通过，签退成功");
            }
        } else {
            if (top.API.SignType == "SignIn") {
                $("#SignTitle").text("签到结果");
                $("#SuccessedDiv").text(top.ErrorInfo);
            } else {
                $("#SignTitle").text("签退结果");
                $("#SuccessedDiv").text(top.ErrorInfo);
            }
        }
      }();//Page Entry

   //@User ocde scope start
    document.getElementById('Back').onclick = function(){
         document.getElementById('Back').disabled = true;
         return CallResponse('Back');
    }

    document.getElementById('PageRoot').onclick = function () {
        document.getElementById('PageRoot').disabled = true;
        return CallResponse('Exit');
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
      //remove all event handler
    function Clearup(){
      //TO DO:
        EventLogout();
        top.ErrorInfo == "";
        //App.Timer.ClearTime();
    }
})();
