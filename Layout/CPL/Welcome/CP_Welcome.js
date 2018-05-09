
; (function () {

    //@User ocde scope start

    var OnReadyclick = function () {


        return CallResponse("ReadCard");
    }
    //button event
    var InvokeBtn = document.getElementById("AsynInvoke");
    InvokeBtn.attachEvent('onclick', OnReadyclick);

    //@User code scope end

    var onCardInserted = function () {

    }

    var onCardAccepted = function () {
        return CallResponse("CardAccepted");
    }

    //automate generate code


    //Page Return
	


    //remove all event handler
    var Clearup = function () {
        //TO DO:
        logout();
    }

    //Register the event
    var eventLogin = function () {
        top.API.Crd.addEvent("CardInserted", onCardInserted);
        top.API.Crd.addEvent("CardAccepted", onCardAccepted);
    }

    var eventLogout = function () {
        top.API.Crd.removeEvent("CardInserted", onCardInserted);
        top.API.Crd.removeEvent("CardAccepted", onCardAccepted);
    }
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        Clearup();
        App.Cntl.ProcessDriven( Response );
    });
    //Page Initialize
    var Initialize = function () {
        //@initialize scope start
        alert("Initialize");
        var ErrorArray = top.API.openDevice();

        document.getElementById("PageTitle").innerText = "";


        //document.getElementById("PageTitle").innerText = "Failed to Open the Card Reader";

        top.API.Crd.AcceptAndReadTracks('2,3', 20000);
        login();
        //@initialize scope end
    }
    //Page Entry
    Initialize();
})();