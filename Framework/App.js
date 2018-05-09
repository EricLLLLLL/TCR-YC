

(function(){

window.App = {
	initialize : function(){
		//new the object must be an order.
		this.Timer = new TimeControl();
		this.InputEdit = new InputMethod();
		this.Cntl  = this.CreateControl();
		this.Plugin  = new Plugin();
		this.Func = new InnerFunction();

        return this.AppStart();
	},

	AppStart : function(){
	   top.API.displayMessage("Start system .....");
	   this.Cntl.StartBusiness();
	},

	CreateControl : function(){
		var htmlName = top.getHtmlFileName();
		var FloxXmlName = null;
		var PagePath = null;

	    //load customer operate flow 
		if( htmlName == 'index'){
		    FloxXmlName = "./Framework/FlowXml/C_FlowConfig.xml";
           PagePath = "Layout\\CPL\\";
        //load supervise page flow
		} else if (htmlName == 'Supervise') {
			PagePath = "Layout\\SPL\\";
            FloxXmlName =  "./Framework/FlowXml/S_FlowConfig.xml";
		}else{
			alert("Cann't find the html, please conform your html name.");
		}
		return new FlowsControl(FloxXmlName,PagePath);
	}
};

})();
