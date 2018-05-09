var log = {

  debugStringOutput : function( strOutput ){
     console.log( strOutput );
  },

  displayMessage : function ( strMsg ) {
     console.log( strOutput );
  }

};

function displayMessage( strMsg ){
	strMsg = top.JsFilename +"   "+ strMsg;
   log.debugStringOutput( strMsg );
}