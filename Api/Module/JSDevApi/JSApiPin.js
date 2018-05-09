(function(){
window.JSApiPin = function(ServiceName, InstanceName, obj){
	//inherit the base calss attribute
	JSDevApi.call(this, ServiceName, InstanceName, obj);

	this.LoadMasterKey = function(keyname, keyvalue, timeout){
		displayMessage(obj.id + "->LoadMasterKey(" + keyname + "," + keyvalue + "," + timeout + ")");
		return obj.LoadMasterKey(keyname, keyvalue, timeout);
	};

	this.LoadMasterKey_Ex = function(keyname, keyvalue, timeout, controlVector, keyCheckMode, keyCheckValue){
		displayMessage(obj.id + "->LoadMasterKey_Ex(" + keyname + "," + keyvalue + "," + timeout + "," + controlVector + "," + keyCheckMode + "," + keyCheckValue + ")");
		return obj.LoadMasterKey_Ex(keyname, keyvalue, timeout, controlVector, keyCheckMode, keyCheckValue);
	};

	this.Initialize = function(){
		displayMessage(obj.id + "->Initialize()");
		return obj.Initialize();
	};

	this.LoadWorkKey = function(keyname, keyvalue, enckeyname){
		displayMessage(obj.id + "->LoadWorkKey(" + keyname + "," + keyvalue + "," + enckeyname + ")");
		return obj.LoadWorkKey(keyname, keyvalue, enckeyname);
	};
	this.LoadWorkKey_Ex = function(keyname, keyvalue, timeout, controlVector, keyCheckMode, keyCheckValue){
		displayMessage(obj.id + "->LoadWorkKey_Ex(" + keyname + "," + keyvalue + "," + timeout + "," + controlVector + "," + keyCheckMode + "," + keyCheckValue + ")");
		return obj.LoadWorkKey_Ex(keyname, keyvalue, timeout, controlVector, keyCheckMode, keyCheckValue);
	};

	this.EncryptChinaSM = function(value, keyname, padchar, algorithm){
		displayMessage(obj.id + "->EncryptChinaSM(" + value + "," + keyname + "," + padchar + "," + algorithm + ")");
		return obj.EncryptChinaSM(value, keyname, padchar, algorithm);
	};

	this.DecryptChinaSM = function(value, keyname, padchar, algorithm){
		displayMessage(obj.id + "->DecryptChinaSM(" + value + "," + keyname + "," + padchar + "," + algorithm + ")");
		return obj.DecryptChinaSM(value, keyname, padchar, algorithm);
	};

	this.EncryptECB = function(value, keyname, padchar){
		displayMessage(obj.id + "->EncryptECB(" + value + "," + keyname + "," + padchar + ")");
		return obj.EncryptECB(value, keyname, padchar);
	};

	this.DecryptECB = function(value, keyname, padchar){
		displayMessage(obj.id + "->DecryptECB(" + value + "," + keyname + "," + padchar + ")");
		return obj.DecryptECB(value, keyname, padchar);
	};

	this.EncryptCBC = function(value, keyname, ivname, padchar){
		displayMessage(obj.id + "->EncryptCBC(" + value + "," + keyname + "," + ivname + "," + padchar + ")");
		return obj.EncryptCBC(value, keyname, ivname, padchar);
	};

	this.DecryptCBC = function(value, keyname, ivname, padchar){
		displayMessage(obj.id + "->DecryptCBC(" + value + "," + keyname + "," + ivname + "," + padchar + ")");
		return obj.DecryptCBC(value, keyname, ivname, padchar);
	};

	this.GenerateMAC = function(value, keyname, ivname, padchar, modeAndAlgorithm){
		displayMessage(obj.id + "->GenerateMAC(" + value + "," + keyname + "," + ivname + "," + padchar + "," + modeAndAlgorithm + ")");
		return obj.GenerateMAC(value, keyname, ivname, padchar, modeAndAlgorithm);
	};

	this.GenerateMACClearIV = function(value, keyname, iv, padchar, modeAndAlgorithm){
		displayMessage(obj.id + "->GenerateMACClearIV(" + value + "," + keyname + "," + iv + "," + padchar + "," + modeAndAlgorithm + ")");
		return obj.GenerateMACClearIV(value, keyname, iv, padchar, modeAndAlgorithm);
	};

	this.GetPin = function(minlength, maxlength, autoend, activekeys, terminatorkeys, timeout){
		displayMessage(obj.id + "->GetPin(" + minlength + "," + maxlength + "," + autoend + "," + activekeys + "," + terminatorkeys + "," + timeout + ")");
		return obj.GetPin(minlength, maxlength, autoend, activekeys, terminatorkeys, timeout);
	};

	this.PinBlock = function(format, customerdata, padchar, keyname, xordata, secondkeyname, algorithm){
		displayMessage(obj.id + "->PinBlock(" + format + "," + customerdata + "," + padchar + "," + keyname + "," + xordata + "," + secondkeyname + "," + algorithm + ")");
		return obj.PinBlock(format, customerdata, padchar, keyname, xordata, secondkeyname, algorithm);
	};

	this.CancelGetPin = function(){
		displayMessage(obj.id + "->CancelGetPin()");
		return obj.CancelGetPin();
	};

	this.GetData = function(maxkeys, autoend, activekeys, terminatorkeys, timeout){
		displayMessage(obj.id + "->GetData(" + maxkeys + "," + autoend + "," + activekeys + "," + terminatorkeys + "," + timeout + ")");
		return obj.GetData(maxkeys, autoend, activekeys, terminatorkeys, timeout);
	};

	this.CancelGetData = function(){
		displayMessage(obj.id + "->CancelGetData()");
		return obj.CancelGetData();
	};

	this.GetKeyNamesSync = function(){
		displayMessage(obj.id + "->GetKeyNamesSync()");
		return obj.GetKeyNamesSync();
	};

	this.GetKeyUseFlagsSync = function(keyname){
		displayMessage(obj.id + "->GetKeyUseFlagsSync(" + keyname + ")");
		return obj.GetKeyUseFlagsSync(keyname);
	};

	this.KeyIsValidSync = function(keyname){
		displayMessage(obj.id + "->KeyIsValidSync(" + keyname + ")");
		return obj.KeyIsValidSync(keyname);
	};

	this.GetKeyNamesSync_Ex = function(){
		displayMessage(obj.id + "->GetKeyNamesSync_Ex()");
		return obj.GetKeyNamesSync_Ex();
	};

	this.GetKeyUseFlagsSync_Ex = function(keyname){
		displayMessage(obj.id + "->GetKeyUseFlagsSync_Ex(" + keyname + ")");
		return obj.GetKeyUseFlagsSync_Ex(keyname);
	};

	this.KeyIsValidSync_Ex = function(keyname){
		displayMessage(obj.id + "->KeyIsValidSync_Ex(" + keyname + ")");
		return obj.KeyIsValidSync_Ex(keyname);
	};


	this.ExtendedLoadKey = function(keyname, keyvalue, useflags, identification){
		displayMessage(obj.id + "->ExtendedLoadKey(" + keyname + "," + keyvalue + "," + useflags + "," + identification + ")");
		return obj.ExtendedLoadKey(keyname, keyvalue, useflags, identification);
	};

	this.ExtendedLoadEncryptedKey = function(keyname, keyvalue, enckeyname, useflags, identification){
		displayMessage(obj.id + "->ExtendedLoadEncryptedKey(" + keyname + "," + keyvalue + "," + enckeyname + "," + useflags + "," + identification + ")");
		return obj.ExtendedLoadEncryptedKey(keyname, keyvalue, enckeyname, useflags, identification);
	};

	this.ExtendedLoadKey_Ex = function(keyname, keyvalue, useflags, identification, controlVector, keyCheckMode, keyCheckValue){
		displayMessage(obj.id + "->ExtendedLoadKey_Ex(" + keyname + "," + keyvalue + "," + useflags + "," + identification + "," + controlVector + "," + keyCheckMode + "," + keyCheckValue + ")");
		return obj.ExtendedLoadKey_Ex(keyname, keyvalue, useflags, identification, controlVector, keyCheckMode, keyCheckValue);
	};

	this.ExtendedLoadEncryptedKey_Ex = function(keyname, keyvalue, enckeyname, useflags, identification, controlVector, keyCheckMode, keyCheckValue){
		displayMessage(obj.id + "->ExtendedLoadEncryptedKey_Ex(" + keyname + "," + keyvalue + "," + enckeyname + "," + useflags + "," + identification + "," + controlVector + "," + keyCheckMode + "," + keyCheckValue + ")");
		return obj.ExtendedLoadEncryptedKey_Ex(keyname, keyvalue, enckeyname, useflags, identification, controlVector, keyCheckMode, keyCheckValue);
	};


	this.CaCanCustomMAC = function(algorithm){
		displayMessage(obj.id + "->GetCaCanCustomMAC(" + algorithm + ")");
		return obj.GetCaCanCustomMAC(algorithm);
	};

	this.CaCanCHINASM = function(algorithm){
		displayMessage(obj.id + "->GetCaCanCHINASM(" + algorithm + ")");
		return obj.GetCaCanCHINASM(algorithm);
	};

	this.Reset = function(timeout){
		displayMessage(obj.id + "->Reset(" + timeout + ")");
		return obj.Reset(timeout);
	};

	this.PublicKeyEnc = function(AlgType,PlainData){
		displayMessage(obj.id + "->PublicKeyEnc(" + AlgType + ","+ PlainData + ")");
		return obj.PublicKeyEnc(AlgType,PlainData);
	};

	this.PrivateKeyDec = function(AlgType,EncData){
		displayMessage(obj.id + "->PrivateKeyDec(" + AlgType + ","+ EncData + ")");
		return obj.PrivateKeyDec(AlgType,EncData);
	};

	this.GetCertifiate = function(AlgType){
		displayMessage(obj.id + "->GetCertifiate(" + AlgType + ")");
		return obj.GetCertifiate(AlgType);
	};

	this.VerifyPIN = function(UsrPIN){
		displayMessage(obj.id + "->VerifyPIN(" + UsrPIN + ")");
		return obj.VerifyPIN(UsrPIN);
	};

	this.CpCanCBC = function(){
		displayMessage(obj.id + "->GetCpCanCBC()");
		return obj.GetCpCanCBC();
	};

	this.CpCanECB = function(){
		return obj.GetCpCanECB();
	};

	this.CpCanRSA = function(){
		return obj.GetCpCanRSA();
	};

	this.CpCanMAC = function(){
		return obj.GetCpCanMAC();
	};

	this.CpCanTripleECB = function(){
		return obj.GetCpCanTripleECB();
	};

	this.CpCanTripleCBC = function(){
		return obj.GetCpCanTripleCBC();
	};

	this.CpCanTripleCFB = function(){
		return obj.GetCpCanTripleCFB();
	};

	this.CpCanTripleMAC = function(){
		return obj.GetCpCanTripleMAC();
	};

	this.CpKeysSupported = function(){
		return obj.GetCpKeysSupported();
	};

	this.PINLength = function(){
		return obj.GetPINLength();
	};

	this.CpPINFormatsSupported = function(){
		return obj.GetCpPINFormatsSupported();
	};

};
})();

