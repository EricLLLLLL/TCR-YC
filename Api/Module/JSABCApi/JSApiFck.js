(function () {
    window.JSApiFck = function (ServiceName, InstanceName, obj) {
        //inherit the base calss attribute
        this.faceMatch = function (strParam) {
            displayMessage(obj.id + "->faceMatch(" + strParam + ")");
            return obj.faceMatch(strParam);
        };
    };
})();

