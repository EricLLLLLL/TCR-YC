//
//功能函数文件
//
//判断日期时间是否有效，格式YYYY-MM-DD-HH-MM-SS
function CheckDateTimeS(str) {
    var reg = /^(\d+)-(\d{1,2})-(\d{1,2})-(\d{1,2})-(\d{1,2})-(\d{1,2})$/;
    var r = str.match(reg);
    if (r == null) return false;
    r[2] = r[2] - 1;
    var d = new Date(r[1], r[2], r[3], r[4], r[5], r[6]);
    if (d.getFullYear() != r[1]) return false;
    if (d.getMonth() != r[2]) return false;
    if (d.getDate() != r[3]) return false;
    if (d.getHours() != r[4]) return false;
    if (d.getMinutes() != r[5]) return false;
    if (d.getSeconds() != r[6]) return false;
    return true;
}
//判断日期时间是否有效，格式YYYY-MM-DD-HH-MM
function CheckDateTime(str) {
    var reg = /^(\d+)-(\d{1,2})-(\d{1,2})-(\d{1,2})-(\d{1,2})$/;
    var r = str.match(reg);
    if (r == null) return false;
    r[2] = r[2] - 1;
    var d = new Date(r[1], r[2], r[3], r[4], r[5]);
    if (d.getFullYear() != r[1]) return false;
    if (d.getMonth() != r[2]) return false;
    if (d.getDate() != r[3]) return false;
    if (d.getHours() != r[4]) return false;
    if (d.getMinutes() != r[5]) return false;
    return true;
}
//判断日期是否有效，格式YYYY-MM-DD
function CheckDate(str) {
    var reg = /^(\d+)-(\d{1,2})-(\d{1,2})$/;
    var r = str.match(reg);
    if (r == null) return false;
    r[2] = r[2] - 1;
    var d = new Date(r[1], r[2], r[3]);
    if (d.getFullYear() != r[1]) return false;
    if (d.getMonth() != r[2]) return false;
    if (d.getDate() != r[3]) return false;
    return true;
}

function getHtmlFileName() {
    var a = location.href;
    var b = a.split("/");
    var c = b.slice(b.length - 1, b.length).toString(String).split(".");
    // alert(c);
    console.log(c);
    return c.slice(0, 1);
}

function GetDate12byte() {
    var Datetime = new Date();
    return Datetime.dateToString() + Datetime.timeToString();
}

//函数功能：字符串转Hex
function stringToHex(str) {
    var hexArray = new Array();
    for (var index = 0; index < str.length; index = index + 2) {
        var i = index / 2;
        hexArray[i] = parseInt(str.substr(index, 2), 16);
    }
    return hexArray;
}

//函数功能：字符串异或，输入为字符串。
function stringXORstring(stringA, stringB, stringC, stringLen) {
    var DesString = '';
    var tmpDesString = '';
    for (var index = 0; index < stringLen; index++) {
        tmpDesString = parseInt(stringA.substr(index, 1), 16) ^ parseInt(stringB.substr(index, 1), 16) ^ parseInt(stringC.substr(index, 1), 16);
        if (tmpDesString < 10) {
            DesString = DesString + String.fromCharCode(tmpDesString + 48);
        } else {
            DesString = DesString + String.fromCharCode(tmpDesString + 55);
        }
    }
    return DesString;
}

//获取网页可见区域宽： document.body.offsetWidth (包括边线的宽)
function getWebWidth(percent) {
    if (arguments.length != 0)
        return parseInt(document.body.offsetWidth * percent);
    else
        return document.body.offsetWidth;
}
//获取网页可见区域高： document.body.offsetHeight (包括边线的高)
function getWebHeight(percent) {
    if (arguments.length != 0)
        return parseInt(document.body.offsetHeight * percent);
    else
        return document.body.offsetHeight;
}


//获取函数的函数名称
function getFnName(fn) {
    var tmp = fn.toString();
    var re = /function\s*(\w*)/i;
    var matches = re.exec(tmp);
    return matches[1];
}

///----------start-------------
///给js原始对象增加扩展方法部分


///----------start-------------
//获取当前日期字符串 
Date.prototype.dateToString = function (separator) {
    var s = separator || '';
    var AddZero = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09'];
    return this.getFullYear() + s + (AddZero[this.getMonth() + 1] || (this.getMonth() + 1)) + s + (AddZero[this.getDate()] || this.getDate());
};
//获取当时间期字符串 
Date.prototype.timeToString = function (separator) {
    var s = separator || '';
    var AddZero = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09'];
    return (AddZero[this.getHours()] || this.getHours()) + s + (AddZero[this.getMinutes()] || this.getMinutes()) + s + (AddZero[this.getSeconds()] || this.getSeconds());
};
//函数对象扩展方法bind/*针对ie8扩展*/
if (!Function.prototype.bind) {
    Function.prototype.bind = function (obj) {
        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {},
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && obj ? this : obj, aArgs.concat(Array.prototype.slice.call(arguments)));
            };
        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();
        return fBound;
    }
}

//Unicode -> ASCII转换
function UnicodeToASCII(str) {
    var strArray = new Array(); //存放unicode字符
    if (str == '') {
        return;
    }
    var text = "";
    var firstPosition = 0;
    var lastPosition = 0;
    var flag = false;
    for (var i = 0; i < str.length; i++) {
        var ch = str.charAt(i); //取字符
        if (ch == '&') { //unicode begin
            flag = true;
            firstPosition = i;
        } else if (ch == ';') {
            lastPosition = i;
            strArray[strArray.length] = str.substring(firstPosition, lastPosition + 1);
            var s = str.substring(firstPosition, lastPosition + 1);
            //alert(str.substring(firstPosition,lastPosition+1));
            //alert(firstPosition + "==" + lastPosition);
            text += String.fromCharCode(s.replace(/[&#;]/g, ''));
            flag = false;
        } else {
            if (flag) {

            } else { //非Unicode字符存入
                strArray[strArray.length] = ch;
                text += ch;
            }
        }
    }
    // for(var i=0;i<strArray.length;i++){
    //  alert(strArray[i]);
    // }
    return text;
}

//转成人民币大写金额形式   
function cmycurd(num) {
    var str1 = '零壹贰叁肆伍陆柒捌玖'; //0-9所对应的汉字   
    var str2 = '万仟佰拾亿仟佰拾万仟佰拾元角分'; //数字位所对应的汉字   
    var str3; //从原num值中取出的值   
    var str4; //数字的字符串形式   
    var str5 = ''; //人民币大写金额形式   
    var i; //循环变量   
    var j; //num的值乘以100的字符串长度   
    var ch1; //数字的汉语读法   
    var ch2; //数字位的汉字读法   
    var nzero = 0; //用来计算连续的零值是几个   
    num = num.replace(",", ""); //把逗号替换  
    num = Math.abs(num).toFixed(2); //将num取绝对值并四舍五入取2位小数   
    str4 = (num * 100).toFixed(0).toString(); //将num乘100并转换成字符串形式   
    j = str4.length; //找出最高位   
    str2 = str2.substr(15 - j); //取出对应位数的str2的值。如：200.55,j为5所以str2=佰拾元角分   

    //循环取出每一位需要转换的值   
    for (i = 0; i < j; i++) {
        str3 = str4.substr(i, 1); //取出需转换的某一位的值   
        if (i != (j - 3) && i != (j - 7) && i != (j - 11) && i != (j - 15)) { //当所取位数不为元、万、亿、万亿上的数字时   
            if (str3 == '0') {
                ch1 = '';
                ch2 = '';
                nzero = nzero + 1;
            } else {
                if (str3 != '0' && nzero != 0) {
                    ch1 = '零' + str1.substr(str3 * 1, 1);
                    ch2 = str2.substr(i, 1);
                    nzero = 0;
                } else {
                    ch1 = str1.substr(str3 * 1, 1);
                    ch2 = str2.substr(i, 1);
                    nzero = 0;
                }
            }
        } else { //该位是万亿，亿，万，元位等关键位   
            if (str3 != '0' && nzero != 0) {
                ch1 = "零" + str1.substr(str3 * 1, 1);
                ch2 = str2.substr(i, 1);
                nzero = 0;
            } else {
                if (str3 != '0' && nzero == 0) {
                    ch1 = str1.substr(str3 * 1, 1);
                    ch2 = str2.substr(i, 1);
                    nzero = 0;
                } else {
                    if (str3 == '0' && nzero >= 3) {
                        ch1 = '';
                        ch2 = '';
                        nzero = nzero + 1;
                    } else {
                        if (j >= 11) {
                            ch1 = '';
                            nzero = nzero + 1;
                        } else {
                            ch1 = '';
                            ch2 = str2.substr(i, 1);
                            nzero = nzero + 1;
                        }
                    }
                }
            }
        }
        if (i == (j - 11) || i == (j - 3)) { //如果该位是亿位或元位，则必须写上   
            ch2 = str2.substr(i, 1);
        }
        str5 = str5 + ch1 + ch2;

        if (i == j - 1 && str3 == '0') { //最后一位（分）为0时，加上“整”   
            //str5 = str5 + '整';
        }
    }
    if (num == 0) {
        //str5 = '零元整';
        str5 = '';
    }
    return str5;
}
//每隔Num插入字符Char
function InsertChar(InData, Num, Char) {
    var OutData = "";
    var nlength = InData.length
    var nRslt = Math.floor(nlength / Num);
    var ResetNum = nlength % Num;
    if (ResetNum == 0) {
        nRslt--;
        ResetNum = Num;
    }
    OutData = InData.substr(0, ResetNum)
    while (nRslt > 0) {
        OutData += Char + InData.substr((nlength - nRslt * Num), Num)
        nRslt--;
    }
    return OutData;
};

// 屏蔽姓氏 by Gni
function changeName(name) {
    name = name.split("");
    name.splice(0, 1, "*");
    name = name.join("");
    // alert(name);
    return name;
};
// 屏蔽卡号 by Gni
function changeCardNum(cardNum) {
    cardNum = cardNum.split("");
    cardNum.splice(cardNum.length - 5, 4, "****");
    cardNum = cardNum.join("");
    // alert(cardNum);
    return cardNum;
};







