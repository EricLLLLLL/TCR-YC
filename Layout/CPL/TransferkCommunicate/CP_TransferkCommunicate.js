/**
 * @anther: LeoLei
 * @Time: 20170915
 */
;(function () {
    var TransType = null,
        strErrMsg = "",
        strCallResponse = 'Error',
        JnlNum = null,//�����ȡ������ˮ�ű���
        bNextPageFlag = false,
        bTimeOutStart = false,
        timeoutFlag = false,
        Check = "",//�ж��Ƿ���ʾ������Ϣ
        CallResponse = App.Cntl.ProcessOnce(function (Response) {
            //TO DO:
            AfterSendDisposal();
            Clearup();
            //Entry the flows control process.
            App.Cntl.ProcessDriven(Response);
        }),
        Initialize = function () {
            EventLogin();
            App.Plugin.Voices.play("voi_28");
            App.Timer.TimeoutDisposal(TimeoutCallBack);
            top.ErrorInfo = top.API.PromptList.No1;
            SetCashUnitInfoToTCP();
            //������֮ǰ���ã���������
            if(top.API.gTransactiontype=="QRYINCUSTNAME"){

            }
            else{
                top.API.gTransactiontype="NOCARDTFR";
            }
            TransType = top.API.gTransactiontype;
           // NoTcpForData(TransType);
            var arrTRANSACTIONTYPE = new Array(TransType);
            top.API.Dat.SetDataSync(top.API.transactiontypeTag, top.API.transactiontypeType, arrTRANSACTIONTYPE);
            top.API.Dat.GetPersistentData(top.API.jnlnumTag, top.API.jnlnumType);
        }();//Page Entry


    function NoTcpForData(transType) {
        var ResponseCode;
        switch
            (transType) {
            case
            'QueryTransInfo'
            :
                top.API.gResponsecode = '00';
                top.API.PayeeName = '��С��';
                top.API.PayeeBank = 'ũҵ����';
                ResponseCode = 'QueryTransInfo_OK';
                break;
            case
            'Transfer'
            :
                top.API.gResponsecode = '00';
                top.API.TransferPoundage = '5.00'
                ResponseCode = 'TransferComplete_OK';
                break;
            case
            'QueryCancelInfo'
            :
                top.API.TrasferCancelList = [{
                    TransferTime: '20170801',
                    PayeeName: '�з���',
                    PayeeAccount: '3465756756354345',
                    Currency: '�����',
                    TransferMoney: '343455'
                }, {
                    TransferTime: '20170801',
                    PayeeName: '����',
                    PayeeAccount: '345642346456',
                    Currency: '�����',
                    TransferMoney: '4454'
                }, {
                    TransferTime: '20170801',
                    PayeeName: '������Դ��',
                    PayeeAccount: '3453456756756',
                    Currency: '�����',
                    TransferMoney: '8000000'
                }, {
                    TransferTime: '20170801',
                    PayeeName: '��Ʒ��',
                    PayeeAccount: '23423423234421',
                    Currency: '�����',
                    TransferMoney: '7890000'
                }, {
                    TransferTime: '20170801',
                    PayeeName: '������',
                    PayeeAccount: '23423423234421',
                    Currency: '�����',
                    TransferMoney: '7890000'
                }, {
                    TransferTime: '20170801',
                    PayeeName: 'Ӧ�ÿ���',
                    PayeeAccount: '23423423234421',
                    Currency: '�����',
                    TransferMoney: '7890000'
                }, {
                    TransferTime: '20170801',
                    PayeeName: 'ƽ̨����',
                    PayeeAccount: '23423423234421',
                    Currency: '�����',
                    TransferMoney: '7890000'
                }, {
                    TransferTime: '20170801',
                    PayeeName: '�ۺ�',
                    PayeeAccount: '23423423234421',
                    Currency: '�����',
                    TransferMoney: '7890000'
                }];
                ResponseCode = 'QueryCancelInfo_OK';
                break;
            case
            'TransferCancel'
            :
                top.API.gResponsecode = '00';
                // top.API.TransferPoundage = '5.00'
                ResponseCode = 'TransferCancel_OK';
                break;
            case
            'INQC'
            :
                top.API.gResponsecode = '00';
                top.API.CancellationAccountList = ['5444322354566533','7754334233214776','689993323372','32223111233321111'];
                //top.API.PayeeBank = 'ũҵ����';
                ResponseCode = 'QRYACCOUNTCANCEL_OK';
                break;
            case
            'ACCDELETE'
            :
                top.API.gResponsecode = '00';
               // top.API.TrasferCancelList = [5444322354566533,7754334233214776,689993323372,32223111233321111];
                //top.API.PayeeBank = 'ũҵ����';
                ResponseCode = 'ACCOUNTCANCELLTION_OK';
                break;
        }
        return CallResponse(ResponseCode);
    }


    function SetCashUnitInfoToTCP() {
        var strCounts = "";
        var strCurrency = "";
        var strInfo = "";
        for (i = 0; i < top.API.CashInfo.nCountOfUnits; i++) {
            switch (top.API.CashInfo.arrUnitCurrency[i]) {
                case 100:
                    strCurrency = "15650100";
                    break;
                case 50:
                    strCurrency = "15650050";
                    break;
                case 20:
                    strCurrency = "15650020";
                    break;
                case 10:
                    strCurrency = "15650010";
                    break;
                case 5:
                    strCurrency = "15650005";
                    break;
                case 1:
                    strCurrency = "15650001";
                    break;
                default:
                    strCurrency = "00000000";
                    break;
            }
            switch (top.API.CashInfo.arrUnitRemain[i].toString().length) {
                case 1:
                    strCounts = "000" + top.API.CashInfo.arrUnitRemain[i].toString();
                    break;
                case 2:
                    strCounts = "00" + top.API.CashInfo.arrUnitRemain[i].toString();
                    break;
                case 3:
                    strCounts = "0" + top.API.CashInfo.arrUnitRemain[i].toString();
                    break;
                case 4:
                    strCounts = top.API.CashInfo.arrUnitRemain[i].toString();
                    break;
                default:
                    strCounts = "0000";
                    break;
            }
            strInfo = strInfo + strCurrency + strCounts;
        }
        var arrDeviceState = new Array(strInfo);
        top.API.Dat.SetDataSync("DEVICESTATE", "STRING", arrDeviceState);
    }


    function BeforeSendDisposal() {
        var arrTransactionResult = new Array("ͨѶʧ��");
        //top.API.gTakeCardAndPrint = true;
        top.API.Dat.SetDataSync("TRANSACTIONRESULT", "STRING", arrTransactionResult);
        switch (TransType) {
            case "INQC":
                SetTransKind("������ѯ");
                break;
            case "WXACCDELETE":
                SetTransKind("΢������");
                break;
            case "ACCDELETE":
                SetTransKind("����");
                break;
            case "PeriodicCurrentAccount":
                SetTransKind("����ת����");
                break;
            case "QRYEXCHANGE":
                SetTransKind("��ѯ���ת�˻���Ϣ");
                break;
            case "QRYEXECUTERATE":
                SetTransKind("��ѯ��ת������");
                break;
            case "CURRENTACCOUNTTOSAVINGS":
                SetTransKind("��ת��");
                break;
            case "SAVINGSTOCURRENTACCOUNT":
                SetTransKind("��ת��");
                break;
            case "QRYINCUSTNAME":
                SetTransKind("����ת�˲�ѯ����");
                break;
            case "QRYFEE":
                SetTransKind("����ת�˲�������");
                break;
            case "QRYTFSCANCEL":
                SetTransKind("ת�˳�����ѯ");
                break;
            case "TRANSFERCANCEL":
                SetTransKind("ת�˳�������");
                break;
            case "TRANSFERACTS":
                SetTransKind("ת�˻��");
                break;
            default:
                top.API.displayMessage("�������ʹ���,TransType=" + TransType);
                break;
        }
        top.API.Jnl.PrintSync("BeforeSendDisposal");
    }
    
    function AfterSendDisposal() {
        if (Check == "00") {
            var tmpstrErrMsg = "TRANSUCCESS";
            top.API.gTakeCardAndPrint = false;
        } else {
            var tmpstrErrMsg = "TRANFAIL";
            top.API.gTakeCardAndPrint = true; //�˿�ҳ���ӡƾ��
        }
        var arrTransactionResult = new Array(tmpstrErrMsg);
        top.API.Dat.SetDataSync("TRANSACTIONRESULT", "STRING", arrTransactionResult);
        
        switch (TransType){
            case "INQC":
            // case "WXACCDELETE":
            case "ACCDELETE":
            case "PeriodicCurrentAccount":
            case "QRYEXCHANGE":
            case "QRYEXECUTERATE":
            case "CURRENTACCOUNTTOSAVINGS":
            case "SAVINGSTOCURRENTACCOUNT":
            case "QRYINCUSTNAME":
            case "QRYFEE":
            case "QRYTFSCANCEL":
            case "TRANSFERCANCEL":
            case "TRANSFERACTS":
                top.API.Jnl.PrintSync("Transaction");
                break;
            default:
                top.API.displayMessage("�������ʹ���,TransType=" + TransType);
                break;
        }
    }

    function SetTransKind(TransKindType) {
        var arrTransKindType = new Array(TransKindType);
        top.API.Dat.SetDataSync(top.API.TransKindTag, top.API.TransKindType, arrTransKindType);
    }

    function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {
        if ('JNLNUM' == DataName) {
            var arrDataValue = DataValue.toArray();
            JnlNum = arrDataValue[0] + 1;
            if (JnlNum.toString().length === 7) {
                JnlNum = 0;
            }
            //���ý�����ˮ��
            var arrJnlNum = new Array();
            arrJnlNum[0] = JnlNum;
            var nRet1 = top.API.Dat.SetPersistentData(top.API.jnlnumTag, top.API.jnlnumType, arrJnlNum);
        }
    }

    function onDatGetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("DatGetPersistentDataError" + DataName + ",ErrorCode=" + ErrorCode);
        bNextPageFlag = false;
        TradeCompleted();
    }

    function onDatSetPersistentDataComplete(DataName) {
        if ('JNLNUM' == DataName) {
            BeforeSendDisposal();
            top.API.Tcp.CompositionData(TransType);
        }
    }

    function onDatSetPersistentDataError(DataName, ErrorCode) {
        top.API.displayMessage("onDatSetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
        bNextPageFlag = false;
        TradeCompleted();
    }


    function onCompositionDataCompleted(arrData) {
        var objArrData = arrData.toArray();
        top.API.Pin.GenerateMAC(objArrData, "MACKEY", '', 0,0);
    }


    // function onCompositionDataFail() {
        function onCompositionDataFail() {
            top.API.displayMessage("onCompositionDataFail is done");
            strErrMsg = "ͨѶʧ�ܣ����׽���";
            WriteAcctFileAfterTCP("AT", "");
            bNextPageFlag = false;
            TradeCompleted();
        }
    // }


    function onMACGenerated(MacData) {
        top.API.displayMessage("onMACGenerated is done");
        var objMacData = MacData.toArray();
        top.API.Tcp.SendToHost(objMacData, 60000);
    }

    //event handler
    function onDeviceError() {
        top.API.displayMessage('���̴����¼���onDeviceError()');
        strErrMsg = "ϵͳ����";
        bNextPageFlag = false;
        TradeCompleted();
    }

    //event handler
    function onCryptFailed() {
        top.API.displayMessage('���̼ӽ���ʧ�ܣ�onCryptFailed');
        strErrMsg = "ϵͳ����";
        bNextPageFlag = false;
        TradeCompleted();
    }


    function onTcpSendFailed() {
        top.API.displayMessage("onTcpSendFailed is done");
        strErrMsg = "ͨѶʧ�ܣ����׽���";
        WriteAcctFileAfterTCP("AT", ""); //add by art for д���׼�¼�ļ�
        bNextPageFlag = false;
        TradeCompleted();
    }

    function onTcpOnRecved(tmpCheck) {
        Check = tmpCheck;
        top.API.gResponsecode = tmpCheck;
        top.API.displayMessage("onTcpOnRecved is done,CheckCode:" + Check);
        var bSuccess = false;
        var ErrMsg = null;
        var nRet;
        // top.API.displayMessage("tmpResponse=" + TransType);
        switch (Check) {
            case '00':
                bNextPageFlag = true;
                //����
                if (TransType == "INQC") {
                    var objGet3 = top.API.Dat.GetDataSync("ACCOUNTLIST", "STRING");
                    if (null == objGet3 || objGet3.toArray()[0].indexOf("A") == -1) {
                        top.API.displayMessage("GetDataSync ACCOUNTLIST objGet = null");
                        strErrMsg = "δ��ѯ���������˺ţ�������������ѯ������Ա��"
                    } else {
                        var ACCOUNTLIST = objGet3.toArray()[0].split('A');
                        top.API.CancellationAccountList = ACCOUNTLIST;
                        bSuccess = true;
                        strErrMsg = "���׳ɹ�";
                    }
                // } else if (TransType == "ACCDELETE") {
                //     var objGet3 = top.API.Dat.GetDataSync("ACCDELETERES", "STRING");
                //     top.API.displayMessage("objGet3=" + objGet3);
                //     if (null == objGet3) {
                //         top.API.displayMessage("GetDataSync ACCDELETERES objGet = null");
                //     } else {
                //         var tmpResponse = objGet3.toArray()[0].substr(0, 2);
                //         top.API.displayMessage("tmpResponse=" + tmpResponse);
                //         if (tmpResponse == "00") {
                //             bSuccess = true;
                //             strErrMsg = "���׳ɹ�";
                //         } else if (tmpResponse == "02" || tmpResponse == "08") {
                //             bSuccess = true;
                //             strErrMsg = "���׳ɹ�";
                //         } else {
                //             bNextPageFlag = false;
                //             strErrMsg = "�����п��ݲ�֧�ֽ���";
                //         }
                //     }
                } else {
                    bSuccess = true;
                    strErrMsg = "���׳ɹ�";
                }
                break;
            case '01':
                strErrMsg = "�����п��ݲ�֧�ֽ���";//"��ѯ��������";
                break;
            case '04':
                strErrMsg = "���п��쳣,��������";//"û�տ�";
                break;
            case '12':
                strErrMsg = "�ݲ��ܰ������ҵ��";//"��Ч����";
                break;
            case '13':
                strErrMsg = "���׽�����ҵ��ϵͳ����";//"��Ч������100";
                break;
            case '14':
                strErrMsg = "���˻������쳣���뵽��̨����ҵ��";//"��Ч����";
                break;
            case '15':
                strErrMsg = "�����п��ݲ�֧�ֽ���";//"�޴˷�����";
                break;
            case '33':
                strErrMsg = "���ѹ���,��������";//"���ڵĿ�";
                break;
            case '38':
                strErrMsg = "������󳬴���";//"���������PIN�����루û�տ���";
                break;
            case '40':
                strErrMsg = "ϵͳ��֧�ָ�ҵ���뵽��̨����ҵ��";//����ʱ����40һ���ǿ��ۺ�һ����Ҫ����̨����;
                break;
            case '41':
                strErrMsg = "�˻��Ѷ���,��������";//"��ʧ����û�տ���";
                break;
            case '43':
                strErrMsg = "�Ƿ��˻�,��������";//"���Կ���û�տ���";
                break;
            case '51':
                strErrMsg = "����";//"�ʽ���";
                break;
            case '54':
                strErrMsg = "���ѹ���,��������";//"���ڵĿ�";
                break;
            case '55':
                strErrMsg = "����������벻��ȷ";
                break;
            case '61':
                strErrMsg = "ȡ�����";//"�ʽ���";
                break;
            case '65':
                strErrMsg = "�ѳ����տ�ȡ�����";//"����ȡ�ִ�������";
                break;
            case '75':
                strErrMsg = "������󳬴���";//"���������PIN��������";
                break;
            case '81':
			    strErrMsg = "��Ӧ��ʱ������ϵ������Ա��ʵ����"; // ת�˳����쳣��ʾ
				break;
            case '82':
                strErrMsg = "����δ�����˻����뵽��̨����";//"��δ�����˻����ܾ�����";
                break;
            case '83':
                strErrMsg = "�û���Ȩ�޲����������";//"�û���Ȩ�޲����������";
                break;
            case '84':
                strErrMsg = "�����Ա�������";//"�����Ա�������";
                break;
            case '85':
                strErrMsg = "���۳���ȡ����";//"���۳���ȡ����"��������ȡ;
                break;
            case '86':
                strErrMsg = "�û��ֽ����޴˱���";//"�û��ֽ����޴˱���";
                break;
            case '87':
                strErrMsg = "ARQCУ��ʧ��";//"��ƬУ�鲻����ͬ�Ż�����������";
                break;
            case '88':
                strErrMsg = "��ǰ���״���Ϊ�����ۣ�����ϵ����!";//"�������˻�";
                break;
            case '89':
                strErrMsg = "��Ч�ն�";//"��Ч�ն�";
                break;
            case '90':
            case '91':
            case '96':
            case '30':
            default:
                strErrMsg = "����ʧ��,����ϵ����!";//"�����쳣";
                break;
        }
        ;
        if (!bSuccess) {
            bNextPageFlag = false;
        }
        WriteAcctFileAfterTCP("", "");    //add by art for д���׼�¼�ļ�
        TradeCompleted();
    }

    function onTcpTimeout() {
        top.API.displayMessage("onTcpTimeout is done,TransType=" + TransType);
        if (!timeoutFlag) {
            timeoutFlag = true;
            WriteAcctFileAfterTCP("AT", ""); //add by art for д���׼�¼�ļ�
            strErrMsg = "ͨѶ��ʱ�����׽���";
            bNextPageFlag = false;
            TradeCompleted();
            // setTimeout(function(){
            //     return CallResponse("Exit");
            // },10000);
            // App.Timer.SetPageTimeout(8);
            // return CallResponse("TimeOut");
        }
    }

    function onAnalysisFailed() {
        top.API.displayMessage("onAnalysisFailed is done");
        WriteAcctFileAfterTCP("AT", "");
        strErrMsg = "���Ľ���ʧ�ܣ����׽���";

        bNextPageFlag = false;
        TradeCompleted();

    }


    /**
     * д�쳣��¼�ļ�
     * @param Reason ԭ��
     * @param InOutAmount
     * @constructor
     */
    function WriteAcctFileAfterTCP(Reason, InOutAmount) {

        var sRetCode = top.API.gResponsecode,
            sTransAmount = " ";// ���

		if(TransType == 'ACCDELETE' || TransType == "WXACCDELETE"){
			top.API.gTslFlag = true;
			var sAccoutNo = top.API.Dat.GetDataSync("CARDNO", "STRING").toArray()[0]; // ����
			// var sTransNo = top.API.Dat.GetDataSync("TFRCARDNO", "STRING").toArray()[0]; // ת���˻�
			var sTransNo = " ";
			var sTypeTmp;
			var sResult;
			var type;

			if(sRetCode != "00"){
				sResult = "����ʧ��";
				top.API.gTslResult = "FAIL";
			} else {
				sResult = "�����ɹ�";
				top.API.gTslResult = "SUCCESS"
			}
			
			if ("WXACCDELETE" == top.API.gTransactiontype){
				sTypeTmp = "΢������";

				type = "WXDELETE";
			} else if (top.API.gTransactiontype == top.API.gTransactiontype){
				sTypeTmp = "ת������"
				sTransNo = top.API.Dat.GetDataSync("TFRCARDNO", "STRING").toArray()[0]; // ת���˻�
				type = "TFDELETE";
				if(sRetCode == "00"){
					sTransAmount = top.API.Dat.GetDataSync("TOTAL", "STRING").toArray()[0]; // ���
				}else{
					sTransAmount = "0";
				}
			}
			top.API.displayMessage("��������ʧ����Ϣ�������ļ�");
			// ���������ݼ�¼������ļ���
			top.API.Tsl.HandleRecordFileSync(top.API.MTSL_WRITECLOSEDCORD, sAccoutNo + ", " + sTransNo + ", " + sTransAmount + ", " + sRetCode + ", " + sResult + ", " + sTypeTmp);
			// ���������ݼ�¼�����ݿ���
			top.API.gCardno = sAccoutNo;
			top.API.gTslMoneyCount = sTransAmount;
			TslFunction(type);
			upLoadTSL();
			
		}else if( TransType == 'TRANSFERACTS' ){
            // add by Gni for ��¼ת�����������ݿ�
            if( !(top.API.CashInfo.Dealtype == "OutLineFlag" && sRetCode != 00 && top.API.MONEYLIMIT == "0") ){ // ������ʧ��ʱ����¼

                top.API.gTslFlag = true;
                top.API.gTslMoneyCount = parseInt(top.API.Dat.GetDataSync("TRANSAMOUNT", "STRING").toArray()[0]) / 100;
                top.API.gTslResult = sRetCode == "00" ? "SUCCESS" : "FAIL";
                TslFunction(top.API.CashInfo.Dealtype);
                upLoadTSL();

            }

        }else if( TransType == 'TRANSFERCANCEL' ){
            // add by Gni for ��¼ת�˳������������ݿ�
            top.API.gTslFlag = true;
            top.API.gTslResult = sRetCode == "00" ? "SUCCESS" : "FAIL";
            top.API.gTslMoneyCount = "0";
            TslFunction(TransType);

            upLoadTSL(); //��ת�˳������ݼ�¼���ݿ�
        }
			
    }

    /**
     *
     * @describe �������֮��������ת�ı�־
     */
    function TradeCompleted() {
        if (bNextPageFlag) {
            var arrTransactionResult = new Array("���׳ɹ�");
            //top.API.gTakeCardAndPrint = false;
            top.API.Dat.SetDataSync("TRANSACTIONRESULT", "STRING", arrTransactionResult);
        }
        switch (TransType) {
            case 'INQC':
                if (bNextPageFlag == true) {
                    strCallResponse = "QRYACCOUNTCANCEL_OK";
                } else {
                    strCallResponse = "QRYACCOUNTCANCEL_NG";
                }
                break;
            case 'WXACCDELETE':
                if (bNextPageFlag == true) {
                    strCallResponse = "WXCancelAccount_OK";
                } else {
                    strCallResponse = "WXCancelAccount_NG";
                }
                break;
            case 'ACCDELETE':
                if (bNextPageFlag == true) {
                    strCallResponse = "ACCOUNTCANCELLTION_OK";
                } else {
                    strCallResponse = "ACCOUNTCANCELLTION_NG";
                }
                break;
            case 'QRYEXCHANGE':
                if (bNextPageFlag == true) {
                    strCallResponse = top.API.CashInfo.Dealtype == "CurrentToRegular" ? "QueryCurrentAccount_OK" : "QueryRegularAccount_OK";
                } else {
                    strCallResponse = top.API.CashInfo.Dealtype == "CurrentToRegular" ? "QueryCurrentAccount_NG" : "QueryRegularAccount_NG";
                }
                break;
            case 'QRYEXECUTERATE':
                if (bNextPageFlag == true) {
                    strCallResponse = "QueryInterestRate_OK";
                } else {
                    strCallResponse = "QueryInterestRate_NG";
                }
                break;
            case 'CURRENTACCOUNTTOSAVINGS':
                if (bNextPageFlag == true) {
                    strCallResponse = "CurrentToRegular_OK";
                } else {
                    strCallResponse = "CurrentToRegular_NG";
                }
                break;
            case 'SAVINGSTOCURRENTACCOUNT':
                if (bNextPageFlag == true) {
                    strCallResponse = "RegularToCurrent_OK";
                } else {
                    strCallResponse = "RegularToCurrent_NG";
                }
                break;
            case 'QRYINCUSTNAME':
                if (bNextPageFlag == true) {
                    strCallResponse = "QRYCUSTNAME_OK";
                } else {
                    strCallResponse = "QRYCUSTNAME_NG";
                }
                break;
            case 'QRYFEE':
                if (bNextPageFlag == true) {
                    strCallResponse = "QueryCharge_OK";
                } else {
                    strCallResponse = "QueryCharge_NG";
                }
                break;
            case 'TRANSFERACTS':
                if (bNextPageFlag == true) {
                    strCallResponse = top.API.MONEYLIMIT == "0" ? "TransferComplete_OK" : "SmallComplete_OK";
                } else {
                    if( top.API.CashInfo.Dealtype == "OutLineFlag" ){
                        if( top.API.MONEYLIMIT == "0" ){
                            top.API.MONEYLIMIT = "1"; // ���תС��
                            top.API.Dat.SetDataSync("MONEYLIMIT", "STRING", [top.API.MONEYLIMIT]); // ���ô�С���ʶ�� 0��� 1С��
                            top.API.TRANSFERTIMES = "2"; // ���תС��ڶ��η��ͱ���
                            top.API.Dat.SetDataSync("TRANSFERTIMES", "STRING", [top.API.TRANSFERTIMES]); // ���õ�һ��ת�˱�ʶ 1��һ�� 2�ڶ���
                            bNextPageFlag = true;
                            strCallResponse = "TransferComplete_NG";
                        }else{
                            strCallResponse = "SmallComplete_NG";
                        }
                    }else{
                        strCallResponse = "SmallComplete_NG";
                    }      
                }
                break;
            case 'NOCARDTFR':
                strCallResponse ="TransferComplete_OK";
                break;  
            case 'QRYTFSCANCEL':
                if (bNextPageFlag == true) {
                    strCallResponse = "QueryCancelInfo_OK";
                } else {
                    strCallResponse = "QueryCancelInfo_NG";
                }
                break;
            case 'TRANSFERCANCEL':
                if (bNextPageFlag == true) {
                    strCallResponse = "TransferCancel_OK";
                } else {
                    strCallResponse = "TransferCancel_NG";
                }
                break;
            default:
                top.API.displayMessage("�������ʹ���,TransType=" + TransType);
                break;
        }
        if (top.API.gResponsecode == "55") {
            strCallResponse = "ReInputPsw";
        }
        if (top.API.gResponsecode == "04" || top.API.gResponsecode == "33" ||
            top.API.gResponsecode == "41" || top.API.gResponsecode == "43" ||
            top.API.gResponsecode == "07" || top.API.gResponsecode == "34" ||
            top.API.gResponsecode == "35" || top.API.gResponsecode == "36" ||
            top.API.gResponsecode == "37" || top.API.gResponsecode == "67") {
            strCallResponse = "Capture";
        }

        // top.API.displayMessage("bNextPageFlag: "+bNextPageFlag+"---"+"strCallResponse: "+strCallResponse);
        if (bNextPageFlag == false) {
            top.ErrorInfo = top.API.PromptList.No6;
            if (timeoutFlag) {
                strCallResponse = "TimeOut";
            }
            document.getElementById('Loading').style.display = "none";
            document.getElementById('Tipdiv').style.display = "block";
            document.getElementById('tip_label').innerText = strErrMsg;
            bTimeOutStart = true;

            App.Timer.ClearTime();
            App.Timer.SetPageTimeout(8);
            App.Timer.TimeoutDisposal(TimeoutCallBack);
        } else {
            return CallResponse(strCallResponse);
        }
    }

    function upLoadTSL() {
        if (top.API.gTslFlag) {
            //������|ʱ��|����|��ˮ��|��������|���|���֤��|���֤ͷ��·��|���׽����TSL���ݿ���־
            top.API.gTslFlag = false;
            var TslLog = top.API.gTslDate;
            TslLog += "|" + top.API.gTslTime;
            TslLog += "|" + top.API.gCardno;
            TslLog += "|" + top.API.gTslJnlNum;
            TslLog += "|" + top.API.gTslChooseType;
            TslLog += "|" + top.API.gTslMoneyCount;
            TslLog += "|" + top.API.gIdNumber;
            TslLog += "|" + top.API.gIdCardpic;
            TslLog += "|" + top.API.gTslResult;
            top.API.Tsl.AddTransLogSync(TslLog); //CreateUpJnlFile
            //�ն˺ţ�8λ�����������ڣ�8λ��������ʱ�䣨6λ�����������ͣ�4λ��0107�����0108����ȡ���
            //�ʺţ�19λ�������׽�10λ������λС��λ�����豸��ˮ�ţ�6λ�����豸��ˮ���κţ�6λ����
            //��̨�����루2λ������̨������ˮ�ţ�12λ�����豸����״̬��2λ��00�����׳ɹ���01�����쳣���ף����쳣״̬���ͣ�4λ��
            top.API.displayMessage(TslLog);
        }
    }
    function TslFunction(type) {
        var myData = top.GetDate12byte();
        top.API.gTslDate = myData.substr(0, 8);
        top.API.gTslTime = myData.substr(8, 6);
        top.API.gTslChooseType = type;
        top.API.gTslJnlNum = JnlNum;
    }

    //Register the event
    function EventLogin() {
        top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.addEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.addEvent("SetPersistentDataError", onDatSetPersistentDataError);

        top.API.Tcp.addEvent("CompositionDataCompleted", onCompositionDataCompleted);
        top.API.Tcp.addEvent("CompositionDataFail", onCompositionDataFail);
        top.API.Tcp.addEvent("SendFailed", onTcpSendFailed);
        top.API.Tcp.addEvent("OnRecved", onTcpOnRecved);
        top.API.Tcp.addEvent("Timeout", onTcpTimeout);
        top.API.Tcp.addEvent("AnalysisFailed", onAnalysisFailed);

        top.API.Pin.addEvent("MACGenerated", onMACGenerated);
        top.API.Pin.addEvent("CryptFailed", onCryptFailed);
        top.API.Pin.addEvent('DeviceError ', onDeviceError);

    }

    function EventLogout() {
        top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);
        top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);
        top.API.Dat.removeEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);
        top.API.Dat.removeEvent("SetPersistentDataError", onDatSetPersistentDataError);

        top.API.Tcp.removeEvent("CompositionDataCompleted", onCompositionDataCompleted);
        top.API.Tcp.removeEvent("CompositionDataFail", onCompositionDataFail);
        top.API.Tcp.removeEvent("SendFailed", onTcpSendFailed);
        top.API.Tcp.removeEvent("OnRecved", onTcpOnRecved);
        top.API.Tcp.removeEvent("Timeout", onTcpTimeout);
        top.API.Tcp.removeEvent("AnalysisFailed", onAnalysisFailed);

        top.API.Pin.removeEvent("MACGenerated", onMACGenerated);
        top.API.Pin.removeEvent("CryptFailed", onCryptFailed);
        top.API.Pin.removeEvent('DeviceError ', onDeviceError);

    }

    //Countdown function
    function TimeoutCallBack() {
        if (bTimeOutStart) {
            return CallResponse(strCallResponse);
        }
        if (!timeoutFlag) {
            timeoutFlag = true;
            strErrMsg = "ͨѶ��ʱ�����׽���";
            if (TransType == "CWD") {
                var arrCWCFlag = new Array();
                arrCWCFlag[0] = 1;
                var nRet1 = top.API.Dat.SetPersistentData(top.API.cwcflagTag, top.API.cwcflagType, arrCWCFlag);
            } else {
                bNextPageFlag = false;
                TradeCompleted();
            }
        }
    }

    //remove all event handler
    function Clearup() {
        //TO DO:
        EventLogout();
        App.Plugin.Voices.del();
        App.Timer.ClearTime();
    }
})();
