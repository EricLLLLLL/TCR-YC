     Print #1, "; (function(){"
     Print #1, "    var Initialize = function() {"
     Print #1, "      document.getElementById('PageTitle').innerText = '';"
     Print #1, "    EventLogin();"
     Print #1, "    //@initialize scope start"
     Print #1, "    top.API.Crd.AcceptAndReadTracks('2,3', 20000); "
     Print #1, "    "
     Print #1, "    //"
     Print #1, "      App.Timer.TimeoutDisposal(TimeoutCallBack);"
     Print #1, "    }();//Page Entry"
     Print #1, 
     Print #1, "   //@User ocde scope start"
     Print #1, "    document.getElementById('Exit').onclick = function(){"
     Print #1, 
     Print #1, "         return CallResponse('Exit');"
     Print #1, "    }"
     Print #1, 
     Print #1, "    document.getElementById('OK').onclick = function(){"
     Print #1, "      "
     Print #1, "         return CallResponse('OK');"
     Print #1, "    }"
     Print #1, "   "
     Print #1, "   //@User code scope end "
     Print #1, 
     Print #1, "    //event handler"
     Print #1, "    var onCardInserted = function(){"
     Print #1, 
     Print #1, "    }"
     Print #1, "    //event handler"
     Print #1, "    var onCardAccepted = function(){"
     Print #1, "       return CallResponse('CardAccepted');"
     Print #1, "   }   "
     Print #1, "   "
     Print #1, "    //Register the event"
     Print #1, "    function EventLogin() {"
     Print #1, "        top.API.Crd.addEvent('CardInserted',onCardInserted);"
     Print #1, "        top.API.Crd.addEvent('CardAccepted',onCardAccepted);"
     Print #1, "    }"
     Print #1, 
     Print #1, "    function EventLogout() {"
     Print #1, "       top.API.Crd.removeEvent('CardInserted',onCardInserted);"
     Print #1, "       top.API.Crd.removeEvent('CardAccepted',onCardAccepted);"
     Print #1, "    }"
     Print #1, 
     Print #1, "       //Countdown function"
     Print #1, "    function TimeoutCallBack() {"
     Print #1, "        "
     Print #1, "        return CallResponse('TimeOut');"
     Print #1, "     }"
     Print #1, "       //Page Return"
     Print #1, "    function  CallResponse ( Response ) { "
     Print #1, "    //TO DO:"
     Print #1, "        Clearup();"
     Print #1, "        //Entry the flows control process."
     Print #1, "        App.Cntl.ProcessDriven( Response );"
     Print #1, "    }"
     Print #1, "      //remove all event handler"
     Print #1, "    function Clearup(){"
     Print #1, "      //TO DO:"
     Print #1, "    EventLogout();"
     Print #1, "      App.Timer.ClearTime();"
     Print #1, "    }"
     Print #1, "})();"     