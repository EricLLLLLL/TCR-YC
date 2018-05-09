/*@create by:  tsxiong
*@time: 2016年03月20日
*/
; (function(){
    var objGet = new Array();
    var tmpArray = new Array();
	var CallResponse = App.Cntl.ProcessOnce( function(Response){
        App.Cntl.ProcessDriven( Response );
    });
    var Initialize = function() {     
	    ButtonDisable();
        SetLabel();
        showinfo();
        ButtonEnable();
    }();//Page Entry
    function ButtonDisable() {
        document.getElementById('Back').disabled = true;
        document.getElementById('OK').disabled = true;
    }

    function ButtonEnable() {
        document.getElementById('Back').disabled = false;
        document.getElementById('OK').disabled = false;
    }
    document.getElementById('OK').onclick = function(){
        ButtonDisable();
         return CallResponse('OK');
    }

    document.getElementById('Back').onclick = function(){
        ButtonDisable();
         return CallResponse('Back');
    }

    function SetLabel() {
        var i;
        var nplu = 0;
        var labelnum = "";
        var j = 0;
        var nRej = 0;
        var bTmp = false;  
        //var tmpArray = new Array();
        for(i = 0; i < top.API.CashInfo.nCountOfUnits; i++)
        {
            if (top.API.CashInfo.arrUnitCurrency[i] == 0) {
                if (!bTmp) {
                    bTmp = true;
                    nRej = j;
                    tmpArray[nRej] = top.API.CashInfo.arrUnitRemain[i];
					j++;
                }else{
                    tmpArray[nRej] += top.API.CashInfo.arrUnitRemain[i];
                }
            }else{
                tmpArray[j] = top.API.CashInfo.arrUnitRemain[i];
                j++;
            }            
        }
        for (i= 0; i < tmpArray.length; i++) {
            nplu = i + 1;
            labelnum = "CountOfUnits" + nplu.toString();
            document.getElementById(labelnum).style.display = "block";
        }
		j = 1;
        top.API.displayMessage("UnitCurrency[0]=" + top.API.CashInfo.arrUnitCurrency[0] + ";UnitCurrency[1]=" + top.API.CashInfo.arrUnitCurrency[1] + ";UnitCurrency[2]=" + top.API.CashInfo.arrUnitCurrency[2] + ";UnitCurrency[3]=" + top.API.CashInfo.arrUnitCurrency[3] + ";UnitCurrency[4]=" + top.API.CashInfo.arrUnitCurrency[4]);
        for (i= 0; i < top.API.CashInfo.nCountOfUnits; i++) {
            if (i == nRej) {
                nplu = i + 1;
                labelnum = "NoteValueLabel" + j.toString();
                document.getElementById(labelnum).innerText = "纸币钱箱" + nplu.toString() + "(000)：";
                j++;
            }else{
                switch (top.API.CashInfo.arrUnitCurrency[i]) {
                    case 100:
                        nplu = i + 1;
                        labelnum = "NoteValueLabel" + j.toString();
                        document.getElementById(labelnum).innerText = "纸币钱箱" + nplu.toString() + "(100)：";
                        j++;
						top.API.displayMessage("100"+labelnum);
                        break;
                    case 50:
                        nplu = i + 1;
                        labelnum = "NoteValueLabel" + j.toString();
                        document.getElementById(labelnum).innerText = "纸币钱箱" + nplu.toString() + "(050)：";
                        j++;
						top.API.displayMessage("50"+labelnum);
                        break;
                    case 20:
                        nplu = i + 1;
                        labelnum = "NoteValueLabel" + j.toString();
                        document.getElementById(labelnum).innerText = "纸币钱箱" + nplu.toString() + "(020)：";
                        j++;
						top.API.displayMessage("20"+labelnum);
                        break;
                    case 10:
                        nplu = i + 1;
                        labelnum = "NoteValueLabel" + j.toString();
                        document.getElementById(labelnum).innerText = "纸币钱箱" + nplu.toString() + "(010)：";
                        j++;
						top.API.displayMessage("10"+labelnum);
                        break;
                    case 5:
                        nplu = i + 1;
                        labelnum = "NoteValueLabel" + j.toString();
                        document.getElementById(labelnum).innerText = "纸币钱箱" + nplu.toString() + "(005)：";
                        j++;
						top.API.displayMessage("5"+labelnum);
                        break;
                    case 1:
                        nplu = i + 1;
                        labelnum = "NoteValueLabel" + j.toString();
                        document.getElementById(labelnum).innerText = "纸币钱箱" + nplu.toString() + "(001)：";
                        j++;
						top.API.displayMessage("1"+labelnum);
                        break;
                    default:                    
                        break;
                    }
                }
            }
    }

    function showinfo() {
        var i = 0;
        var nplu = 0;
        var display = "";
        for ( i= 0  ;  i < tmpArray.length ; i++){
            nplu = i + 1;
            display = "CashBox" + nplu.toString();
            document.getElementById(display).innerText = tmpArray[i];
        }    
    }


})();
