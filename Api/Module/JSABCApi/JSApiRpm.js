(function () {
    window.JSApiRpm = function (ServiceName, InstanceName, obj) {
        //inherit the base calss attribute
        this.addEvent = function (event, handler) {
            displayMessage(obj.id + "->attachEvent(" + event + ")");
            return obj.attachEvent(event, handler);
        };
        this.removeEvent = function (event, handler) {
            displayMessage(obj.id + "->detachEvent(" + event + ")");
            return obj.detachEvent(event, handler);
        };

        this.ServerStart = function (nPortNo) {
            displayMessage(obj.id + "->ServerStart(" + nPortNo + ")");
            return obj.ServerStart(nPortNo);
        };

        this.ServerClose = function () {
            displayMessage(obj.id + "->ServerClose()");
            return obj.ServerClose();
        };

        this.ServerSend = function (strMsg) {
            displayMessage(obj.id + "->ServerSend(" + strMsg + ")");
            return obj.ServerSend(strMsg);
        };

        this.ClientConnect = function (strIp, nPortNo) {
            displayMessage(obj.id + "->ClientConnect(" + strIp + "," + nPortNo + ")");
            return obj.ClientConnect(strIp, nPortNo);
        };

        this.ClientClose = function () {
            displayMessage(obj.id + "->ClientClose()");
            return obj.ClientClose();
        };

        this.ClientSend = function (strMsg) {
            displayMessage(obj.id + "->ClientSend(" + strMsg + ")");
            return obj.ClientSend(strMsg);
        };

        this.ServerSendByIP = function (strIp, nPortNo) {
            displayMessage(obj.id + "->ServerSendByIP(" + strIp + "," + nPortNo + ")");
            return obj.ServerSendByIP(strIp, nPortNo);
        };
    };
})();

