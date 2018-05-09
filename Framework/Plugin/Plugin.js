(function(){
	window.Plugin = function(){
	    this.Wait = new Waiting();
	    this.Keyboard = new Keyboard();
	    this.Advert = new Advert();
	    this.Voices = new Voice();
	    this.Voices.init();
        this.ImeHM = new ImeHM();
	};
})();