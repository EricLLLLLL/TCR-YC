;(function () {
    var CallResponse = App.Cntl.ProcessOnce( function(Response){
        //TO DO:
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven( Response );
    });
    var Initialize = function () {
        top.API.UnitStatusflg=0;
        ButtonDisable();
        EventLogin();
        ButtonEnable();
    }();//Page Entry

    function ButtonDisable() {
        document.getElementById('backCPL').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('backCPL').disabled = false;
    }

    //@User ocde scope start

    function ButtonDisable() {
        document.getElementById('backCPL').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('backCPL').disabled = false;
    }

    document.getElementById('backCPL').onclick = function () {
        top.API.displayMessage("click-----backCPL按钮");
        ButtonDisable();
        top.API.Jnl.PrintSync("Back");
        top.API.Dat.SetDataSync("OPERATESTATE", "STRING", ["1"]);//供暂停服务状态轮询使用
        top.API.Sys.OpenFrontPage();
        top.API.Sys.OpenService();        
        top.API.UnitStatusflg=0;
        ButtonEnable();
    };

    //@User code scope end

    //event handler
    function onOpenManagePageComplete() {
        top.API.displayMessage("onOpenManagePageComplete()触发");
        return CallResponse("OK");
    }
    //Register the event
    function EventLogin() {
        top.API.Sys.addEvent('OpenManagePageComplete', onOpenManagePageComplete);
    }

    function EventLogout() {
        top.API.Sys.removeEvent('OpenManagePageComplete', onOpenManagePageComplete);
    }

    function Clearup(){
        //TO DO:
        EventLogout();
       // App.Timer.ClearTime();
    }
    // function CallResponse(Response) {
    //     EventLogout();
    //     App.Cntl.ProcessDriven(Response);
    // }
})();
