(function () {

    window.InputMethod = function () {
        var cursurPosition = 0;
        var inputObj;
        var inputData;
        //将光标定位在输入框最后位置
        this.cursorEnd = function (inputId) {
            inputObj = document.getElementById(inputId);
            inputObj.focus();
            var r = inputObj.createTextRange();
            r.moveStart('character', inputObj.value.length);
            r.collapse(true);
            r.select();
        }
        //获取当前光标所在位置
        this.getCurPosition = function (Element) {
           inputObj = Element;
            cursurPosition =  inputObj.selectionStart;
		// return;
         //    var range = document.selection.createRange();
         //    range.moveStart("character", -Element.value.length);
         //    cursurPosition = range.text.length;
        };

        this.getInput = function (Element, type, value) {
            //inputObj = document.getElementById(inputId);
            inputData = Element.value;
            //功能键  CLEAR BS CANCEL CONFIRM
            if (type == 1) {
                if (value == "CLEAR") {
                    Element.value = "";
                }
                if (value == "BS") {
                    bs(Element);
                }
            }
            //值键
            if (type == 0) {
                insertCharacter(Element, value);
            }

        };

        // 插入字符
        var insertCharacter = function (Element, character) {
            inputData = Element.value;
            var textlen = Element.value.length;
            var str = inputData.substring(0, cursurPosition) + character + inputData.substring(cursurPosition, inputData.length);//insert_flg(inputData, 'M', cursurPosition);
            Element.value = str;
            if (cursurPosition <= textlen) {
                cursurPosition = cursurPosition + 1;
            }
            setCaretPosition(Element, cursurPosition);
        };

        //设置光标位置
        var setCaretPosition = function (ctrl, pos) {
            ctrl.selectionEnd = pos;
            //设置光标位置函数
            // if (ctrl.setSelectionRange) {
            //     ctrl.focus();
            //     ctrl.setSelectionRange(pos, pos);
            // } else if (ctrl.createTextRange) {
            //     var range = ctrl.createTextRange();
            //     range.collapse(true);
            //     range.moveEnd('character', pos);
            //     range.moveStart('character', pos);
            //     range.select();
            // }
        }

        //退格
        var bs = function (Element) {
            inputData = Element.value;
            var textlen = Element.value.length;
			if(textlen<=1){
				Element.value = "";
			}else{
				inputData = inputData.substring(0, cursurPosition - 1) + inputData.substring(cursurPosition, inputData.length);
				Element.value = inputData;
			}
            if (cursurPosition > 0) {
                cursurPosition = cursurPosition - 1;
            }
            setCaretPosition(Element, cursurPosition);
        }

    };
})();

