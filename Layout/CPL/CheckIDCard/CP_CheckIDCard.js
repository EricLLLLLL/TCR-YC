/*@create by:  tsxiong
 *@time: 2016年03月20日
 */
;(function () {
    var URL = "";//测试机房地址--http://10.232.53.166:9080/CIIS/services/IdchkService
    var PicBase64 = "";//联网核查base64
    var strBusinessNo = "";//PimageID
    var strBatchNo = "";//批次号
    var ClientIp = "";//审核ip
    var PictureMD5 = "";//联网核查图像MD5值
    var CheckPicPath = "";//联网核查图像路径
    var CertID = "";//客户ID
    var CheckSystemParams = "";//联网核查标志
    var BusiId = "";//业务ID
    var TaskId = "";//任务ID
    var TerminalId = "";//设备编号
    var strHeadParams = ""//Vts头数据
    var VtsAddr = 'http://10.191.3.241:8052/VTSWS29/Service.svc/';//Vts接口地址
    var MachNO = "";//设备号
    var PointNo = "";//机构号
    var TradeTypeId = "";//交易类型0078
    var TellerNo = "";//柜员号
    var TerminalNo = "";//设备编号
    var bISCreateBusi = false;//是否为创建任务
    var bISRiskLevel = false;//是否为查询风险等级
    var RequestIdType = "";//交易类型
    var RequestId = "";//业务批次号
    var MachID = "";

    var arrCardInfo = top.API.gstrIdCardInfo.split(",");
    var CallResponse = App.Cntl.ProcessOnce(function (Response) {
        //TO DO:
        if (Response == "OK" && top.API.gReadIdCardFlag == 2) {
            Response = "Audit";
        }
        Clearup();
        //Entry the flows control process.
        App.Cntl.ProcessDriven(Response);
    });

    var Initialize = function () {
        EventLogin();
        // Gni test
        // return CallResponse('OK');
        //@initialize scope start
        App.Timer.TimeoutDisposal(TimeoutCallBack);
        var IsSinglebeta = top.API.Dat.GetPrivateProfileSync("AssConfig", "IsSinglebeta", "0", top.API.gIniFileName);
        if (IsSinglebeta == "1") {
            top.ErrorInfo = "00|公民身份号码与姓名一致，且存在照片";
            return CallResponse("OK");
        } else {
            //InitIdCardInfo();
            GetVTSParams();
            RequestId = GetAndSetBusiNo("RequestId");
            top.API.Dat.GetPersistentData("IDCHECKURL", "STRING");
        }
    }(); //Page Entry

    //@User ocde scope start
    function InitIdCardInfo() {
        if (arrCardInfo[1] == '男') {
            arrCardInfo[1] = '1';
        } else if (arrCardInfo[1] == '女') {
            arrCardInfo[1] = '2';
        }
        arrCardInfo[2].replace("族", "");
        var tmp1 = arrCardInfo[7].substr(0, 4) + "-" + arrCardInfo[7].substr(4, 2) + "-" + arrCardInfo[7].substr(6, 2);
        arrCardInfo[7] = tmp1;
        var tmp2 = arrCardInfo[8].substr(0, 4) + "-" + arrCardInfo[8].substr(4, 2) + "-" + arrCardInfo[8].substr(6, 2);
        arrCardInfo[8] = tmp2;

    }

    function GetVTSParams() {
        var strRet = '';
        var xmldom = new ActiveXObject("Microsoft.XMLDOM");
        xmldom.load('./ini/TCR_Params.xml');
        if (xmldom.parseError != 0) {
            throw new Error("XML parsing error: " + xmldom.parseError.reason);
        }
        var Params = xmldom.getElementsByTagName("VTS");
        VtsAddr = Params[0].getAttribute("VtsAddr");
        MachNO = Params[0].getAttribute("MachNO");
        TradeTypeId = Params[0].getAttribute("TradeTypeId");
        TerminalNo = Params[0].getAttribute("TerminalNo");
        TellerNo = Params[0].getAttribute("TellerNo");
        PointNo = Params[0].getAttribute("PointNo");
    }

    function GetAndSetBusiNo(keyname) {
        var tmpBusinessNo = top.API.Dat.GetPrivateProfileSync("AssConfig", keyname, "", top.API.gIniFileName);//"41000";
        var strRet = '';
        var sDate = top.GetDate12byte().substring(0, 8);
        var tmpPointNo = PointNo;
        if (keyname == "BusinessNo") {
            if (sDate != tmpBusinessNo.substring(0, 8)) {
                strRet = sDate + tmpPointNo + TellerNo + "0001";
                var nRet = top.API.Dat.WritePrivateProfileSync("AssConfig", keyname, strRet, top.API.gIniFileName);//"41000";
            } else {
                var tmpStr = "0000";
                var tmpNo = (parseInt(tmpBusinessNo.substring(18, 22)) + 1).toString();
                if (tmpNo.length < 4 && tmpNo != "") {
                    tmpNo = tmpStr.substr(0, (4 - tmpNo.length)) + tmpNo;
                }
                var NewBusinessNo = sDate + tmpPointNo + TellerNo + tmpNo;
                strRet = NewBusinessNo;
                var nRet = top.API.Dat.WritePrivateProfileSync("AssConfig", keyname, NewBusinessNo, top.API.gIniFileName);//"41000";
            }
        } else {
            if (sDate != tmpBusinessNo.substring(0, 8)) {
                strRet = sDate + TerminalNo + "0001";
                var nRet = top.API.Dat.WritePrivateProfileSync("AssConfig", keyname, strRet, top.API.gIniFileName);//"41000";
            } else {
                var tmpStr = "0000";
                var tmpNo = (parseInt(tmpBusinessNo.substring(16, 20)) + 1).toString();
                if (tmpNo.length < 4 && tmpNo != "") {
                    tmpNo = tmpStr.substr(0, (4 - tmpNo.length)) + tmpNo;
                }
                var NewBusinessNo = sDate + TerminalNo + tmpNo;
                strRet = NewBusinessNo;
                var nRet = top.API.Dat.WritePrivateProfileSync("AssConfig", keyname, NewBusinessNo, top.API.gIniFileName);//"41000";
            }
        }

        return strRet;
    }

    function GetHeadParams() {
        var strRet = "";
        var tmpPointNo = PointNo;
        if (bISRiskLevel) {
            bISRiskLevel = false;
            if (PointNo.length > 4) {
                tmpPointNo = PointNo.substr(PointNo.length - 4, 4);
            }
        }
        strRet = ',"MachNO":"' + MachNO + '","PointNo":"' + tmpPointNo + '","TradeTypeId":"' + TradeTypeId + '","TellerNo":"' + TellerNo + '","TerminalNo":"' + TerminalNo + '"';
        return strRet;
    }

    function GetHeadMsg() {
        var strRet = '';
        strHeadParams = GetHeadParams();
        strRet = '{"RequestId":"' + RequestId + '"' + strHeadParams + '}';
        return strRet;
    }

    function UploadPic() {
        var xmldom = new ActiveXObject("Microsoft.XMLDOM");
        xmldom.load('./ini/TCR_Params.xml');
        if (xmldom.parseError != 0) {
            throw new Error("XML parsing error: " + xmldom.parseError.reason);
        }
        var Params = xmldom.getElementsByTagName("ASS");
        var strAssAddr = Params[0].getAttribute("AssAddr");
        var strAppCheck = Params[0].getAttribute("AppCheck");
        var strAppNo = Params[0].getAttribute("AppNo");
        var strUserNo = Params[0].getAttribute("UserNo");
        var strBranchCode = Params[0].getAttribute("BranchCode");
        strBatchNo = Params[0].getAttribute("BatchNo");

        var str = TerminalId + new Date().getTime();//利用设备号+时间戳生成MD5
        strBusinessNo = str.MD5();
        top.API.displayMessage("上传影像平台生成BusinessNo=" + strBusinessNo);
        top.API.Ass.OpenConnectionSync(strAssAddr, strAppNo, strAppCheck, strUserNo, strBranchCode, strBusinessNo, strBatchNo);
        top.API.Ass.AssUpload(arrCardInfo[10] + "," + arrCardInfo[11] + "," + CheckPicPath + "," + arrCardInfo[9]);
    }

    //人脸识别接口
    function bFaceCheck() {
        var IsCheckFace = top.API.Dat.GetPrivateProfileSync("TestConfig", "IsCheckFace", "0", top.API.gIniFileName);
        if (IsCheckFace == "2") {
            return true;
        }
        var paramInfo = new Object();
        paramInfo.methodName = "";
        paramInfo.channel = "0408";
        paramInfo.img1 = top.API.gCheckIdCardpic;
        paramInfo.img2 = arrCardInfo[9];
        if (IsCheckFace == "1") {
            paramInfo.img2 = top.API.gCheckIdCardpic;
        }
        paramInfo.channelTradingFlowNum = RequestId;
        paramInfo.equipmentNum = TerminalNo;
        paramInfo.organizationNum = "41" + PointNo;
        paramInfo.tellerNum = TellerNo;
        paramInfo.citycode = "41";
        paramInfo.cId = arrCardInfo[4];
        var strParam = JSON.stringify(paramInfo);
        var retMsg = "";
        var sh_facecheckresult = top.API.Fck.faceMatch(strParam);
        var jsonResult = eval('(' + sh_facecheckresult + ')');
        top.API.displayMessage("请求结果：" + jsonResult.result + "\相似度结果：" + jsonResult.simResult + "/相似度分数：" + jsonResult.sim + "\识别流水号：" + jsonResult.flowCode + "\识别平台响应结果：" + sh_facecheckresult);
        if (jsonResult.result == "0" && jsonResult.simResult == "1") {
            return true;
        } else {
            return false;
        }
    }

    function StartServer() {
        var bRet = false;
        var nRet = RemoteObj.ServerStart(7701);
        if (nRet == 0) {
            var bStartBCD = op.API.Ass.BcdStartServiceSync('Server', '初始化', 'D:\\PRelease\\API\RemoteVideo\\RemoteVideo_TestServer.exe');
            if (bStartBCD) {
                bRet = true;
                top.API.displayMessage("打开北辰德设备成功");
            } else {
                top.API.displayMessage("打开北辰德设备失败");
            }
        } else {
            top.API.displayMessage("开启远程审核服务失败");
        }
        return bRet;
    }

    function CallFunc(DealName, bResult, strMsg) {
        var tmpHeadMsg = '';
        var bSuccess = false;
        switch (DealName) {
            case "FindMachInfo":
                if (bResult) {
                    top.API.displayMessage("FindMachInfo成功,strMsg=" + strMsg);
                    var arrRetMsg = strMsg.split(",");
                    bSuccess = true;
                    MachID = arrRetMsg[0];
                    TerminalNo = arrRetMsg[1];
                    TellerNo = arrRetMsg[2];
                    PointNo = arrRetMsg[3];
                    var tmpUrl = VtsAddr + 'FindAllParams';
                    tmpHeadMsg = GetHeadMsg();
                    top.API.displayMessage("开始远程审核,FindAllParams,tmpHeadMsg=" + tmpHeadMsg);
                    top.FindAllParams(CallFunc, tmpHeadMsg, tmpUrl);
                } else {
                    if (strMsg == "") {
                        strMsg = '通讯故障，交易取消';
                    }
                    top.API.displayMessage("DealName=" + DealName + ",strMsg=" + strMsg);
                }
                break;
            case "FindAllParams":
                if (bResult) {
                    var strParam = arrCardInfo[0] + "," + arrCardInfo[4] + "," + strMsg + "," + URL;
                    CheckSystemParams = 2;//1为行内  2为行外
                    if (top.CheckInfo(strParam)) {
                        top.ErrorInfo = top.getStrRetMsg();
                        PicBase64 = top.getStrB64();
                        // top.API.displayMessage("联网核查成功,strParam= "+strParam);
                        top.API.displayMessage("联网核查成功");
                        CheckPicPath = top.API.Ass.SaveBase64ToFileSync(PicBase64);
                        top.API.gCheckIdCardpic = CheckPicPath;
                        var strPictureMD5 = top.API.Ass.GetMD5ByFileSync(CheckPicPath, true);
                        PictureMD5 = strPictureMD5.toUpperCase();
                        if (bFaceCheck()) {
                            bSuccess = true;
                            var tmpUrl = VtsAddr + 'QueryCertInfo';
                            tmpHeadMsg = GetHeadMsg();
                            if (arrCardInfo[1] == '男') {
                                arrCardInfo[1] = '1';
                            } else if (arrCardInfo[1] == '女') {
                                arrCardInfo[1] = '2';
                            }
                            arrCardInfo[2] = arrCardInfo[2].replace("族", "");
                            var tmp1 = arrCardInfo[3].substr(0, 4) + "-" + arrCardInfo[3].substr(4, 2) + "-" + arrCardInfo[3].substr(6, 2);
                            arrCardInfo[3] = tmp1;
                            strParam = arrCardInfo[4] + ',' + arrCardInfo[1] + ',' + arrCardInfo[7] + ',' + arrCardInfo[8] + ',' + PictureMD5 + ',' + arrCardInfo[3];
                            // top.API.displayMessage("证件人脸识别成功,开始QueryCertInfo,strParam= "+strParam);
                            top.API.displayMessage("证件人脸识别成功,开始QueryCertInfo");
                            top.QueryCertInfo(CallFunc, tmpHeadMsg, strParam, tmpUrl);
                        } else {
                            strMsg = '证件人脸识别失败，交易取消';
                            top.API.displayMessage("DealName=FaceCheck,strMsg=" + strMsg);
                        }
                    } else {
                        strMsg = '联网核查失败，交易取消';
                        top.API.displayMessage("DealName=CheckInfo,strMsg=" + top.getStrRetMsg());
                    }
                } else {
                    if (strMsg == "") {
                        strMsg = '通讯故障，交易取消';
                    }
                    top.API.displayMessage("DealName=" + DealName + ",strMsg=" + strMsg);
                }
                break;
            case "QueryRiskLevel":
                if (bResult) {
                    if (strMsg == "20" || strMsg == "30") {
                        top.ErrorInfo = "高风险客户!"
                        top.API.displayMessage("高风险客户");
                    } else {
                        bSuccess = true;
                        top.API.displayMessage("查询客户风险等级成功!");
                        return CallResponse('OK');
                    }
                } else {
                    if (strMsg == "") {
                        strMsg = '通讯故障，交易取消';
                    }
                    top.API.displayMessage("DealName=" + DealName + ",strMsg=" + strMsg);
                }
                break;
            case "UpdateCertInfo":
                if (bResult) {
                    bSuccess = true;
                    var Date = top.GetDate12byte().substring(0, 4) + "-" + top.GetDate12byte().substring(4, 6) + "-" + top.GetDate12byte().substring(6, 8);
                    BusiId = GetAndSetBusiNo("BusinessNo");
                    top.API.displayMessage("UpdateCertInfo成功，创建审核信息以及任务，BusinessNo=" + BusiId);
                    bISCreateBusi = true;
                    top.API.CreateBusiListHead = GetHeadMsg();
                    top.API.CreateBusiListUrl = VtsAddr + 'CreateBusiList';
                    //top.API.CreateBusiListParam = BusiId+','+arrCardInfo[4]+','+arrCardInfo[0]+','+Date+','+CertID;
                    top.API.CreateBusiListParam = BusiId + ',' + top.API.gCardno + ',' + top.API.gCustomerName + ',' + Date + ',' + CertID + ',' + MachID;
                    top.API.CreateTaskHead = GetHeadMsg();
                    top.API.CreateTaskUrl = VtsAddr + 'CreateTask';
                    top.API.CreateTaskParam = BusiId;
                    var tmpUrl = VtsAddr + 'QueryRiskLevel';
                    bISRiskLevel = true;
                    tmpHeadMsg = GetHeadMsg();
                    //top.API.displayMessage("查询客户风险等级，QueryRiskLevel，top.API.gIdNumberForRisk="+top.API.gIdNumberForRisk);
                    top.API.displayMessage("查询客户风险等级，QueryRiskLevel，");
                    top.QueryRiskLevel(CallFunc, tmpHeadMsg, top.API.gIdNumberForRisk, tmpUrl);
                } else {
                    if (strMsg == "") {
                        strMsg = '通讯故障，交易取消';
                    }
                    top.API.displayMessage("DealName=" + DealName + ",strMsg=" + strMsg);
                }
                break;
            case "QueryCertInfo":
                if (bResult) {
                    top.API.displayMessage("QueryCertInfo成功,客户为留存客户");
                    var arrRetMsg = strMsg.split(",");
                    bSuccess = true;
                    //arrRetMsg[2] ="aaa";
                    if (PictureMD5 != arrRetMsg[2]) {
                        bSuccess = true;
                        top.API.displayMessage("MD5值不一样，重新新建客户，开始上传影像平台。PictureMD5=" + PictureMD5 + ",arrRetMsgMD5=" + arrRetMsg[2]);
                        UploadPic();
                    } else {
                        CertID = arrRetMsg[0];
                        strBusinessNo = arrRetMsg[1];
                        PictureMD5 = arrRetMsg[2];
                        strBatchNo = arrRetMsg[3];
                        var retCheckSystem = arrRetMsg[4];
                        top.API.displayMessage("retCheckSystem=" + retCheckSystem);
                        if (CheckSystemParams != retCheckSystem) {
                            if (arrCardInfo[1] == '男') {
                                arrCardInfo[1] = '1';
                            } else if (arrCardInfo[1] == '女') {
                                arrCardInfo[1] = '2';
                            }
                            var strParam = CertID + ',' + arrCardInfo[0] + ',' + arrCardInfo[0] + ',' + arrCardInfo[1] + ',' + CheckSystemParams;
                            tmpHeadMsg = GetHeadMsg();
                            var tmpUrl = VtsAddr + 'UpdateCertInfo';
                            // top.API.displayMessage("联网核查标志不同，需要UpdateCertInfo，strParam="+strParam);
                            top.API.displayMessage("联网核查标志不同，需要UpdateCertInfo");
                            top.UpdateCertInfo(CallFunc, tmpHeadMsg, strParam, tmpUrl);
                        } else {
                            var Date = top.GetDate12byte().substring(0, 4) + "-" + top.GetDate12byte().substring(4, 6) + "-" + top.GetDate12byte().substring(6, 8);
                            BusiId = GetAndSetBusiNo("BusinessNo");
                            bISCreateBusi = true;
                            top.API.displayMessage("创建审核信息以及任务，BusinessNo=" + BusiId);
                            top.API.CreateBusiListHead = GetHeadMsg();
                            top.API.CreateBusiListUrl = VtsAddr + 'CreateBusiList';
                            //top.API.CreateBusiListParam = BusiId+','+arrCardInfo[4]+','+arrCardInfo[0]+','+Date+','+CertID;
                            top.API.CreateBusiListParam = BusiId + ',' + top.API.gCardno + ',' + top.API.gCustomerName + ',' + Date + ',' + CertID + ',' + MachID;
                            top.API.CreateTaskHead = GetHeadMsg();
                            top.API.CreateTaskUrl = VtsAddr + 'CreateTask';
                            top.API.CreateTaskParam = BusiId;
                            var tmpUrl = VtsAddr + 'QueryRiskLevel';
                            bISRiskLevel = true;
                            tmpHeadMsg = GetHeadMsg();
                            // top.API.displayMessage("查询客户风险等级，QueryRiskLevel，top.API.gIdNumberForRisk="+top.API.gIdNumberForRisk);
                            top.API.displayMessage("查询客户风险等级，QueryRiskLevel");
                            top.QueryRiskLevel(CallFunc, tmpHeadMsg, top.API.gIdNumberForRisk, tmpUrl);
                        }
                    }
                } else {
                    if (strMsg == "InsertCertInfo") {
                        top.API.displayMessage("InsertCertInfo");
                        top.API.displayMessage("QueryCertInfo成功,需要新建客户信息，开始上传影像平台");
                        bSuccess = true;
                        UploadPic();
                    } else {
                        if (strMsg == "") {
                            strMsg = '通讯故障，交易取消';
                        }
                        top.API.displayMessage("DealName=" + DealName + ",strMsg=" + strMsg);
                    }
                }
                break;
            case "InsertCertInfo":
                if (bResult) {
                    bSuccess = true;
                    CertID = strMsg;
                    var Date = top.GetDate12byte().substring(0, 4) + "-" + top.GetDate12byte().substring(4, 6) + "-" + top.GetDate12byte().substring(6, 8);
                    BusiId = GetAndSetBusiNo("BusinessNo");
                    bISCreateBusi = true;
                    top.API.displayMessage("InsertCertInfo成功，创建审核信息以及任务，BusinessNo=" + BusiId);
                    top.API.CreateBusiListHead = GetHeadMsg();
                    top.API.CreateBusiListUrl = VtsAddr + 'CreateBusiList';
                    //top.API.CreateBusiListParam = BusiId+','+arrCardInfo[4]+','+arrCardInfo[0]+','+Date+','+CertID;
                    top.API.CreateBusiListParam = BusiId + ',' + top.API.gCardno + ',' + top.API.gCustomerName + ',' + Date + ',' + CertID + ',' + MachID;
                    top.API.CreateTaskHead = GetHeadMsg();
                    top.API.CreateTaskUrl = VtsAddr + 'CreateTask';
                    top.API.CreateTaskParam = BusiId;
                    var tmpUrl = VtsAddr + 'QueryRiskLevel';
                    bISRiskLevel = true;
                    tmpHeadMsg = GetHeadMsg();
                    // top.API.displayMessage("查询客户风险等级，QueryRiskLevel，top.API.gIdNumberForRisk="+top.API.gIdNumberForRisk);
                    top.API.displayMessage("查询客户风险等级，QueryRiskLevel");
                    top.QueryRiskLevel(CallFunc, tmpHeadMsg, top.API.gIdNumberForRisk, tmpUrl);
                } else {
                    if (strMsg == "") {
                        strMsg = '通讯故障，交易取消';
                    }
                    top.API.displayMessage("DealName=" + DealName + ",strMsg=" + strMsg);
                }
                break;
            default:
                break;
        }
        if (!bSuccess) {
            top.API.displayMessage("审核通讯故障！");
            top.ErrorInfo = strMsg;
            return CallResponse("Exit");
        }
    }

    /********************************************************************************************************/
    //上传影像平台事件
    function onAssUploadComplete() {
        //top.API.displayMessage("上传成功！"); 		
        var strParam = top.API.gstrIdCardInfo + "," + strBusinessNo + "," + PictureMD5 + "," + strBatchNo + "," + CheckSystemParams;
        tmpHeadMsg = GetHeadMsg();
        var tmpUrl = VtsAddr + 'InsertCertInfo';
        //top.API.displayMessage("上传影像平台成功，开始InsertCertInfo，strParam="+strParam+"//tmpHeadMsg="+tmpHeadMsg);
        top.API.displayMessage("上传影像平台成功，开始InsertCertInfo，" + "tmpHeadMsg=" + tmpHeadMsg);
        top.InsertCertInfo(CallFunc, tmpHeadMsg, strParam, tmpUrl);
    }

    function onAssUploadFail() {
        top.API.displayMessage("上传失败！");
        top.ErrorInfo = "审核通讯故障！";
        return CallResponse("Exit");
    }

    //event handler
    /********************************************************************************************************/
    //永久数据模块
    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        var arrDataValue = DataValue.toArray();
        if ('IDCHECKURL' == DataName) {
            URL = arrDataValue[0];
            if (URL == "") {
                top.API.displayMessage("联网核查地址为空！");
                top.ErrorInfo = "联网核查异常！";
                return CallResponse('Exit');
            } else {
                //判断是否为代理人流程，代理人流程中持卡人本人身份证联网核查，直接调用CheckInfo

                if (top.API.gReadIdCardFlag == 1) {
                    var strParam = arrCardInfo[0] + "," + arrCardInfo[4] + "," + "" + "," + URL;
                    if (top.CheckInfo(strParam)) {
                        top.ErrorInfo = top.getStrRetMsg();
                        PicBase64 = top.getStrB64();
                        // top.API.displayMessage("代理人放置户主身份证进行联网核查成功,strParam= "+strParam);
                        top.API.displayMessage("代理人放置户主身份证进行联网核查成功");
                        CheckPicPath = top.API.Ass.SaveBase64ToFileSync(PicBase64);
                        top.API.gCheckIdCardpic = CheckPicPath;
                        if (bFaceCheck()) {
                            top.API.gReadIdCardFlag = 2;
                            return CallResponse("OK");
                        } else {
                            top.API.displayMessage("证件人脸识别失败，交易取消！");
                            top.ErrorInfo = "证件人脸识别失败，交易取消！";
                            return CallResponse("Exit");
                        }
                    } else {
                        top.API.displayMessage("代理人放置户主身份证联网核查失败！");
                        top.ErrorInfo = "联网核查失败！";
                        return CallResponse("Exit");
                    }
                } else {
                    //代理人身份证联网核查，将标志位恢复，以便控制联网核查完成画面流程跳转。
                    if (top.API.gReadIdCardFlag == 2) {
                        top.API.gReadIdCardFlag = 0;
                    }
                    var tmpUrl = VtsAddr + 'FindMachInfo';
                    var tmpHeadMsg = '{"RequestId":"' + RequestId + '","MachNo":"' + MachNO + '"}';
                    top.API.displayMessage("开始远程审核,FindMachInfo,tmpHeadMsg=" + tmpHeadMsg);
                    top.FindMachInfo(CallFunc, tmpHeadMsg, tmpUrl);
                }
            }
        }
    }

    function onDatGetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatGetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
    }

    //Register the event
    function EventLogin() {
        top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Ass.addEvent("AssUploadComplete", onAssUploadComplete);
        top.API.Ass.addEvent("AssUploadFail", onAssUploadFail);
    }

    function EventLogout() {
        top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Ass.removeEvent("AssUploadComplete", onAssUploadComplete);
        top.API.Ass.removeEvent("AssUploadFail", onAssUploadFail);
    }

    //Countdown function
    function TimeoutCallBack() {
        top.ErrorInfo = top.API.PromptList.No3;
        return CallResponse('TimeOut');
    }

    //Page Return

    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
        App.Timer.ClearTime();
    }
})();
