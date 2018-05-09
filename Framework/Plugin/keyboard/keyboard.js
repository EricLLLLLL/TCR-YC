(function () {

    window.Keyboard = function () {

        this.show = function (type, InsertdivId, plginId) {
            var loadFiles = new dynamicLoadFiles();
            if (type == '1' || type == '' || type == null || type == undefined) {
                loadFiles.InsertPlgin('./Framework/Plugin/keyboard/keyboard.xml', InsertdivId, plginId);
            }

            if (type == '2') {
                loadFiles.InsertPlgin('./Framework/Plugin/keyboard/keyboard2.xml', InsertdivId, plginId);
            }

            if (type == '3') {
                loadFiles.InsertPlgin('./Framework/Plugin/keyboard/keyboard3.xml', InsertdivId, plginId);
            }
			if (type == '4') {
                loadFiles.InsertPlgin('./Framework/Plugin/keyboard/keyboard4.xml', InsertdivId, plginId);
			}
			if (type == '5') {
			    loadFiles.InsertPlgin('./Framework/Plugin/keyboard/keyboard5.xml', InsertdivId, plginId);
			}
			if (type == '6') {
			    loadFiles.InsertPlgin('./Framework/Plugin/keyboard/keyboard6.xml', InsertdivId, plginId);
			}
			if (type == '7') {
			    loadFiles.InsertPlgin('./Framework/Plugin/keyboard/keyboard7.xml', InsertdivId, plginId);
			}
            if (type == '9') {
                loadFiles.InsertPlgin('./Framework/Plugin/keyboard/keyboard9.xml', InsertdivId, plginId);
            }
        },

        this.disappear = function (plginId) {
            var oKeyboard = document.getElementById(plginId);
            if (oKeyboard != null) {
                document.getElementById("PageSubject").removeChild(oKeyboard);
            }
        }
    };

})();

