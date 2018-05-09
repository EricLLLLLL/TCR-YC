function FindMachInfo(Callfunc, HeadMsg,strUrl) {	
		var tmpString = HeadMsg;
		$(document).ready(function() {	
			$.ajax({
			    url: strUrl,
				data:tmpString,
				type:'post',
				dataType:'json',					
				contentType:'application/json;charset=utf-8',					
				success:function(data){					
					if(data.OpInfo.OpFlag == "1"){
						var ErrMsg = data.MachID + ',' + data.TerminalNo + ',' + data.SysUID + ',' + data.PointNo;
						if(typeof Callfunc == 'function'){
							Callfunc('FindMachInfo',true,ErrMsg);
						}
					}else{
						if(typeof Callfunc == 'function'){
							Callfunc('FindMachInfo',false,data.OpInfo.ErrMsg);
						}
					}	
				},
				error:function(xhr){
					console.log( xhr.responseText );
					console.log("FindMachInfo--Error");
					if(typeof Callfunc == 'function'){
						Callfunc('FindMachInfo',false,'');
					}					
				}
			});			
		}); 
	
	}
	
function FindAllParams(Callfunc, HeadMsg,strUrl) {	
		var tmpString = HeadMsg;
		$(document).ready(function() {	
			$.ajax({
			    url: strUrl,
				data:tmpString,
				type:'post',
				dataType:'json',					
				contentType:'application/json;charset=utf-8',					
				success:function(data){					
					var ParamKey;
					var ParamName;
					var ParamValue;
					var ParamState;
					
					for(var i in data)
					{
						if(data[i].ParamKey == "4"){
							ParamKey = data[i].ParamKey;
							ParamName = data[i].ParamName;
							ParamValue = data[i].ParamValue;
							ParamState = data[i].ParamState;
						}
					}					
					//console.log("FindAllParams--success!ParamValue="+ParamValue);
					if(typeof Callfunc == 'function'){
						Callfunc('FindAllParams',true,ParamValue);
					}
				},
				error:function(xhr){
					console.log( xhr.responseText );
					console.log("FindAllParams--Error");
					if(typeof Callfunc == 'function'){
						Callfunc('FindAllParams',false,'');
					}					
				}
			});			
		}); 
	
	}

	function QueryCertInfo(Callfunc, HeadMsg, IDCardInfo, strUrl) {	
			var arrCardInfo = IDCardInfo.split(",");
		    var tmpString = '{"source":'+ HeadMsg + ',"certInfo":{"CertType":"110001","CertNo":"' + arrCardInfo[0] + '","Sex":"' + arrCardInfo[1] + '","Born":"' + arrCardInfo[5] + '","StartDate":"' + arrCardInfo[2] + '","EndDate":"' + arrCardInfo[3] + '","MD5":"' + arrCardInfo[4] + '"}}';
		//var tmpString ='{"source":{"RequestId":"'+sDate+'13018285'+sTime+'","MachNO":"HM001","PointNo":"0078","TradeTypeId":"1201","TellerNo":"8285","TerminalNo":"13018285"},"certInfo":{"CertType":"110001","CertNo":"'+IDCardNo+'"}}';
		//console.log("QueryCertInfo--tmpString="+tmpString);	
		$(document).ready(function() {
			$.ajax({
			    url: strUrl,
				data:tmpString,
				type:'post',
				dataType:'json',					
				contentType:'application/json;charset=utf-8',					
				success:function(data){	
					var s = JSON.stringify(data);
					for(var i in data)
					{
						var OpFlag = data[i].OpInfo.OpFlag;
						var ErrMsg = data[i].OpInfo.ErrMsg;
						var CertID = data[i].CertID;
						var	PimageID = data[i].PimageID;
						var	MD5 = data[i].MD5;
						var	BatchNO = data[i].BatchNO;
						var	CheckSystem = data[i].CheckSystem;
					}
					if(OpFlag == '1'){//成功
						ErrMsg = CertID + ',' + PimageID + ',' + MD5 + ',' + BatchNO + ',' + CheckSystem;
						if(typeof Callfunc == 'function'){
							Callfunc('QueryCertInfo',true,ErrMsg);
						}						
					}else{
						if(ErrMsg == '客户身份证信息未留存'){
							Callfunc('QueryCertInfo',false,'InsertCertInfo');
						}else {							
							Callfunc('QueryCertInfo',false,ErrMsg);
						}
					}						
					console.log("QueryCertInfo--success!data="+s+",CertID="+CertID);	
		
				},
				error:function(xhr){
					console.log( xhr.responseText );
					if(typeof Callfunc == 'function'){
							Callfunc('QueryCertInfo',false,'');
					}			
				}
			});			
		}); 
	
	}

	function QueryRiskLevel(Callfunc, HeadMsg, IDCardNo, strUrl) {		
	
		    var tmpString = '{"source":' + HeadMsg + ',"identityInfo":{"CertType":"110001","CertNo":"' + IDCardNo + '"}}';
			//var tmpString ='{"source":{"RequestId":"'+sDate+'13018285'+sTime+'","MachNO":"HM001","PointNo":"0078","TradeTypeId":"1201","TellerNo":"8285","TerminalNo":"13018285"},"identityInfo":{"CertType":"110001","CertNo":"'+IDCardNo+'"}}';
		$(document).ready(function() {
			$.ajax({
			    url: strUrl,
				data:tmpString,	
				type:'post',
				dataType:'json',					
				contentType:'application/json;charset=utf-8',					
				success:function(data){
					var OpFlag;
					var ErrMsg;
					var OpDate;
					var OpTime;
					var RiskLvlMark;
					var s = JSON.stringify(data);					
					for(var i in data)
					{
						OpFlag = data[i].OpFlag;
						ErrMsg = data[i].ErrMsg;
						OpDate = data[i].OpDate;
						OpTime = data[i].OpTime;
						RiskLvlMark = data[i].RiskLvlMark;
					}
					if(OpFlag == '1'){//成功						
						if(typeof Callfunc == 'function'){
							Callfunc('QueryRiskLevel',true,RiskLvlMark.substring(2, 4));
						}						
					}else{						
						if(typeof Callfunc == 'function'){
							Callfunc('QueryRiskLevel',false,ErrMsg);
							//Callfunc('QueryRiskLevel',true,'00');
						}
					}					
					//console.log("QueryRiskLevel--success!data="+OpFlag+",ErrMsg="+ErrMsg+",RiskLvlMark="+RiskLvlMark.substring(2, 4));
				},
				error:function(xhr){
					console.log( xhr.responseText );
					console.log("QueryRiskLevel--Error");
					if(typeof Callfunc == 'function'){
							Callfunc('QueryRiskLevel',false,'');
					}
				}
			});			
		}); 
	
	}
	
//涂商雄,男,汉族,19920418,430181199204188813,长沙市芙蓉区解放路丰盈里6号1栋1门304房,长沙市公安局芙蓉分局,20090427,20190427,D:\\Data\\IDCardPic\430181199204188813_20160928101315_head.bmp,D:\\Data\\IDCardPic\430181199204188813_20160928101315_front.jpg,D:\\Data\\IDCardPic\430181199204188813_20160928101315_back.jpg,PimageID,MD5,BatchNO,CheckSystem;
	function InsertCertInfo(Callfunc, HeadMsg, IDCardInfo, strUrl) {		
		$(document).ready(function() {				
			var arrCardInfo = IDCardInfo.split(",");
			if(arrCardInfo[1] == '男'){
				arrCardInfo[1] = '1';
			}else if(arrCardInfo[1] == '女'){
				arrCardInfo[1] = '2';
			}
			arrCardInfo[2] = arrCardInfo[2].replace("族", "");
			var tmp1 = arrCardInfo[3].substr(0,4)+"-"+ arrCardInfo[3].substr(4,2)+"-" + arrCardInfo[3].substr(6,2);
			arrCardInfo[3] = tmp1;
            var tmpString = '{"source":' + HeadMsg + ',"certInfo":{"CertName":"' + arrCardInfo[0] + '","CIFName":"' + arrCardInfo[0] + '","CertType":"110001","CertNo":"' + arrCardInfo[4] + '","Sex":"' + arrCardInfo[1] + '","Nation":"' + arrCardInfo[2] + '","Born":"' + arrCardInfo[3] + '","StartDate":"' + arrCardInfo[7] + '","EndDate":"' + arrCardInfo[8] + '","Police":"' + arrCardInfo[6] + '","Address":"' + arrCardInfo[5] + '","PimageID":"' + arrCardInfo[12] + '","MD5":"' + arrCardInfo[13] + '","BatchNO":"' + arrCardInfo[14] + '","CheckSystem":' + arrCardInfo[15] + '}}';
			//var tmpString ='{"source":{"RequestId":"'+sDate+'13018285'+sTime+'","MachNO":"HM001","PointNo":"0078","TradeTypeId":"1201","TellerNo":"8285","TerminalNo":"13018285"},"certInfo":{"CertName":"'+arrCardInfo[0]+'","CIFName":"'+arrCardInfo[0]+'","CertType":"110001","CertNo":"'+arrCardInfo[4]+'","Sex":"'+arrCardInfo[1]+'","Nation":"'+arrCardInfo[2]+'","Born":"'+arrCardInfo[3]+'","StartDate":"'+arrCardInfo[7]+'","EndDate":"'+arrCardInfo[8]+'","Police":"'+arrCardInfo[6]+'","Address":"'+arrCardInfo[5]+'","PimageID":"'+arrCardInfo[12]+'","MD5":"'+arrCardInfo[13]+'","BatchNO":"'+arrCardInfo[14]+'","CheckSystem":'+arrCardInfo[15]+'}}';			
			$.ajax({				
				url:strUrl,
				data:tmpString,
				dataType:'json',					
				contentType:'application/json;charset=utf-8',		
				type:'post',
						
				success:function(data){					
					var OpFlag;
					var ErrMsg;
					var OpDate;
					var OpTime;
					//var CertID;
					var s = JSON.stringify(data);
					console.log(s);
					for(var i in data)
					{
						OpFlag = data[i].OpFlag;
						ErrMsg = data[i].ErrMsg;
						OpDate = data[i].OpDate;
						OpTime = data[i].OpTime;
						CertID = data[i].CertID;
					}		
					if(OpFlag == '1'){//成功						
						if(typeof Callfunc == 'function'){
							Callfunc('InsertCertInfo',true,CertID);
						}						
					}else{						
						if(typeof Callfunc == 'function'){
							Callfunc('InsertCertInfo',false,ErrMsg);
						}
					}
					console.log("InsertCertInfo--tmpString="+tmpString);
					//CreateBusiList(strBusinessNo);
				},
				error:function(xhr){
					console.log( xhr.responseText );
					console.log("InsertCertInfo--Error");
					if(typeof Callfunc == 'function'){
							Callfunc('InsertCertInfo',false,'');
					}
				}
			});			
		}); 
	
	}
	
	//"CertID":1,"CertName":"雷荣辉","CIFName":"雷荣辉 ","Sex":1,"CheckSystem":1
	function UpdateCertInfo(Callfunc, HeadMsg, IDCardInfo, strUrl) {
	    $(document).ready(function () {
	        var arrCardInfo = IDCardInfo.split(",");
	        var tmpString = '{"source":' + HeadMsg + ',"certInfo":{"CertID":' + arrCardInfo[0] + ',"CertName":"' + arrCardInfo[1] + '","CIFName":"' + arrCardInfo[2] + ' ","Sex":' + arrCardInfo[3] + ',"CheckSystem":' + arrCardInfo[4] + '}}';
	        //var tmpString = '{"source":{"RequestId":"' + sDate + '13018285' + sTime + '","MachNO":"HM001","PointNo":"0078","TradeTypeId":"1201","TellerNo":"8285","TerminalNo":"13018285"},"certInfo":{"CertID":' + arrCardInfo[0] + ',"CertName":"' + arrCardInfo[1] + '","CIFName":"' + arrCardInfo[2] + ' ","Sex":' + arrCardInfo[3] + ',"CheckSystem":' + arrCardInfo[4] + '}}';
	        $.ajax({
	            url: strUrl,
	            data: tmpString,
	            type: 'post',
	            dataType: 'json',
	            contentType: 'application/json;charset=utf-8',
	            success: function (data) {
	                var OpFlag;
	                var ErrMsg;
	                var OpDate;
	                var OpTime;
	                var TaskId;
	                var s = JSON.stringify(data);
	                for (var i in data) {
	                    OpFlag = data[i].OpFlag;
	                    ErrMsg = data[i].ErrMsg;
	                    OpDate = data[i].OpDate;
	                    OpTime = data[i].OpTime;
	                }
	                if (OpFlag == '1') {//成功						
	                    if (typeof Callfunc == 'function') {
	                        Callfunc('UpdateCertInfo', true, '');
	                    }
	                } else {
	                    if (typeof Callfunc == 'function') {
	                        Callfunc('UpdateCertInfo', false, ErrMsg);
	                    }
	                }
	            },
	            error: function (xhr) {
	                console.log(xhr.responseText);
	                console.log("UpdateCertInfo--Error");
	                if (typeof Callfunc == 'function') {
	                    Callfunc('UpdateCertInfo', false, '');
	                }
	            }
	        });
	    }); 
	
	}

	function CreateBusiList(Callfunc, HeadMsg, ArrParam, strUrl) {
	$(document).ready(function() {
		var ArrParamInfo = ArrParam.split(",");
		console.log("ArrParamInfo"+ArrParamInfo);
		var tmpString = '{"source":' + HeadMsg + ',"busiInfo":{"BusiID":"' + ArrParamInfo[0] + '","AccNo":"' + ArrParamInfo[1] + '","AccName":"' + ArrParamInfo[2] + '","BusiDate":"' + ArrParamInfo[3] + '","CertID":' + ArrParamInfo[4] + ',"MachID":"' + ArrParamInfo[5] + '"}}';
		//var tmpString ='{"source":{"RequestId":"'+sDate+'13018285'+sTime+'","MachNO":"HM001","PointNo":"0078","TradeTypeId":"1201","TellerNo":"8285","TerminalNo":"13018285"},"busiInfo":{"BusiID":"'+ArrParamInfo[0]+'","AccNo":"610524199208174038","AccName":"雷荣辉","BusiDate":"2016-10-11","CertID":'+ArrParamInfo[1]+'}}';
		console.log(tmpString);
		$.ajax({
		    url: strUrl,
			data:tmpString,
			type:'post',
			dataType:'json',
			contentType:'application/json;charset=utf-8',
			success:function(data){
				var s = JSON.stringify(data);			
				for(var i in data){
					var OpFlag = data[i].OpFlag;
					var ErrMsg = data[i].ErrMsg;
				} 
				if(OpFlag == '1'){//成功						
					if(typeof Callfunc == 'function'){
						Callfunc('CreateBusiList',true,'');
					}						
				}else{						
					if(typeof Callfunc == 'function'){
						Callfunc('CreateBusiList',false,ErrMsg);
					}
				}
			},
			error:function(xhr){
				console.log( xhr.responseText );
				console.log("CreateBusiList--Error");
				if(typeof Callfunc == 'function'){
					Callfunc('CreateBusiList',false,'');
				}
			}
		});	
	})
}

function CreateTask(Callfunc, HeadMsg, ArrParamInfo, strUrl) {
	    $(document).ready(function () {
	        var tmpString = '{"source":' + HeadMsg + ',"taskInfo":{"BusiID":"' + ArrParamInfo + '","QueueID":1,"OpUID":"","Priority":1,"CheckType":1}}';
	        //var tmpString ='{"source":{"RequestId":"'+sDate+'13018285'+sTime+'","MachNO":"HM001","PointNo":"0078","TradeTypeId":"1201","TellerNo":"8285","TerminalNo":"13018285"},"taskInfo":{"BusiID":"'+ArrParamInfo+'","QueueID":1,"OpUID":"418888","Priority":1,"CheckType":1}}';
	        $.ajax({
	            url: strUrl,
	            data: tmpString,
	            type: 'post',
	            dataType: 'json',
	            contentType: 'application/json;charset=utf-8',
	            success: function (data) {
	                var OpFlag;
	                var ErrMsg;
	                var OpDate;
	                var OpTime;
	                var TaskId;
	                var s = JSON.stringify(data);

	                for (var i in data) {
	                    OpFlag = data[i].OpFlag;
	                    ErrMsg = data[i].ErrMsg;
	                    OpDate = data[i].OpDate;
	                    OpTime = data[i].OpTime;
	                    TaskId = data[i].TaskId;
	                }
	                if (OpFlag == '1') {//成功
	                    if (typeof Callfunc == 'function') {
	                        Callfunc('CreateTask', true, TaskId);
	                    }
	                } else {
	                    if (typeof Callfunc == 'function') {
	                        Callfunc('CreateTask', false, ErrMsg);
	                    }
	                }
	                console.log("CreateTask--success!data=" + s + ",TaskId=" + TaskId);
	            },
	            error: function (xhr) {
	                console.log(xhr.responseText);
	                console.log("CreateTask--Error");
	                if (typeof Callfunc == 'function') {
	                    Callfunc('QueryRiskLevel', false, '');
	                }
	            }
	        });
	    }); 
	
	}

    // 查找跨行联行号
    function FindBankCodes(HeadMsg, BankCode, areaCode, strUrl){
    	var BankAjaxData = [];
        $(document).ready(function() {
            var tmpString = '{"source":' + HeadMsg + ',"condtion":{"ClsCode":"' + BankCode + '","CityCode":"' + areaCode + '"}}';;
            console.log(tmpString);
            $.ajax({
                url: strUrl,
                data:tmpString,
                type:'post',
                dataType:'json',
                async:false,
                contentType:'application/json;charset=utf-8',
                success: function (data){

                    var s = JSON.stringify(data);
                    
	                BankAjaxData = data;
                    
                    console.log("FindBankCodes--success!data=" + s);
                },
                error: function(xhr){
                    console.log(xhr.responseText);
                    console.log("xhr.status"+xhr.status + "xhr.readyState:"+xhr.readyState);
                    console.log("FindBankCodes--Error");
                }
            });
        });
		return BankAjaxData;
    }

var b64 = "";
var strRetMsg = "";
function getStrRetMsg() {
    return strRetMsg;
}
function getStrB64() {
    return b64;
}
function CheckInfo(strParamInfo){
	var ArrParamInfo = strParamInfo.split(",");
	var data;
	data = '<?xml version="1.0" encoding="utf-8"?>'; 
	data = data + '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">'; 
	data = data + '<soap:Body>'; 
	data = data + '<PbcIdchk xmlns="">'; 
	data = data + '<ChannelCode>AUTODC</ChannelCode>'; 
	data = data + '<ProNo>41</ProNo>'; 
	data = data + '<OrgNo>0080</OrgNo>'; 
	data = data + '<TlNo>0000</TlNo>'; 
	data = data + '<TrType>01</TrType>'; 
	data = data + '<TrCode>ADCM</TrCode>'; 
	data = data + '<AcName>'+ArrParamInfo[0]+'</AcName>'; 
	data = data + '<CerNo>'+ArrParamInfo[1]+'</CerNo>'; 
	data = data + '<CerType>1</CerType>'; 
	data = data + '<CardidFlag>02</CardidFlag>'; 
	data = data + '</PbcIdchk>'; 
	data = data + '</soap:Body>'; 
	data = data + '</soap:Envelope>'; 

	var xmlhttp = null; 
	if(window.ActiveXObject)
	{ 
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP"); 
	}
	else if(window.XMLHttpRequest)
	{ 
		xmlhttp=new XMLHttpRequest(); 
	}

	var URL = ArrParamInfo[3];

	xmlhttp.open("POST",URL, false); //同步
	xmlhttp.setRequestHeader ("Content-Type","text/xml; charset=utf-8"); 
	xmlhttp.setRequestHeader ("SOAPAction","");
	xmlhttp.send(data); 
	var strResponse=xmlhttp.responseXML.text;
	b64 = "";
	strRetMsg = "";
	var arrayResult = strResponse.split("|");
	//
	if (arrayResult[0] == "0") {
	    strRetMsg = arrayResult[3] + "|" + arrayResult[4];
	    if (arrayResult[3] == "00") {
	        b64 = arrayResult[2]; //人行返回身份证照片信息,Base64编码格式                
			return true;
	    }
	    
	} else if (arrayResult[0] == "-1") {
	    strRetMsg = "联网核查失败！";
	} else if (arrayResult[0] == "-2") {
	    strRetMsg = "联网核查异常！"; //"人民银行核查系统繁忙！";
	} else {
	    strRetMsg = "联网核查异常！";
	}
    //
	return false;
}

function itm_getRandomNum(len){ 
   var Num=""; 
   if(len==undefined||len==""){
       len=16;
   }else{
       len=len*1;
   }
   for(var i=0;i<len;i++){ 
       Num+=Math.floor(Math.random()*10); 
   }
   return Num;
}
