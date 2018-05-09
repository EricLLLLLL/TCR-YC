;

(function () {
  var AdminObj;
  var AdminInfo;
  var FpiIDList;
var clearTime;
  var span_tip = document.getElementById("span_tip");
 var Files = new dynamicLoadFiles();
  var deletebtns;
  var CallResponse = App.Cntl.ProcessOnce(function (Response) {
    //TO DO:
    Clearup();

    //Entry the flows control process.
    App.Cntl.ProcessDriven(Response);
  });

  var Initialize = function () {

    EventLogin();
     top.API.Dat.GetPersistentData(top.API.MFPIIDLISTTag, top.API.MFPIIDLISTType); //获取柜员号指纹数据  01 02 8800
  }(); //Page Entry
  function showAdminInfo() {
    var tab = document.getElementById('tab');
    for (i = 0; i < tab.rows.length; i++) {
      tab.rows[i].style.display = "none";
    }

    if (AdminInfo.length == 0) { //无管理员信息
      document.getElementById("right_div2").rows[1].style.display = "none";
      document.getElementById("errortip").style.display = "block";
    }
/*     else if (AdminInfo.length > 9) { //无管理员信息
      document.getElementById("right_div2").style.overflowY= "scroll";
      document.getElementById("errortip").style.display = "block";
    } */
     else {

      document.getElementById("errortip").style.display = "none";
      var strShowType = "";

      for (var i = 0; i < AdminInfo.length; i++) {
        // $("#tab").append("<tr><td>" + (i+1) + "</td><td>" + AdminInfo[i].user + "</td><td>" + "******" + "</td><td><input name ='delBtn' type='button' class='delBtn'/></td></tr>");
        if (AdminInfo[i].user == "00") {
          AdminInfo[i].idcardno="";
          AdminInfo[i].agencyno="";
        }
        $("#tab").append("<tr><td>" + (i+1) + "</td><td>" + AdminInfo[i].user + "</td><td>" + "******" + "</td><td>" + AdminInfo[i].idcardno + "</td><td>" + AdminInfo[i].agencyno + "</td><td><input name ='delBtn' type='button' class='delBtn'/></td></tr>");
      }
      deletebtns = document.getElementsByName("delBtn");
      del_click(deletebtns);
    }
  }

  //取消

  document.getElementById('Back').onclick = function () {
   document.getElementById('Back').disabled = true;
    return CallResponse('Back');
  }

  document.getElementById('PageRoot').onclick = function () {
    document.getElementById('PageRoot').disabled = true;
    return CallResponse('Exit');
  }



  function ClearTip() {
    span_tip.innerText = "";
  }



  Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] == val) {
        return i; }
    }
    return -1;
  }

  Array.prototype.remove = function (val) {

    var index = this.indexOf(val);

    if (index > -1) {

      this.splice(index, 1);

    }

  }



  function del_click(btns) {

    console.log(888888);

    ClearTip();

    for (var i = 0; i < btns.length; i++) {

      (function () {

        var p = i;

        btns[p].onclick = function () {

          console.log("AdminInfo[p].user----:" + AdminInfo[p].user); //00 01 02 8800

          if ("00" == AdminInfo[p].user) {

            span_tip.innerText = "这是超级管理员权限，您不能进行删除";

            return;

          }

          FpiIDList = FpiIDList.toString()
          FpiIDList = FpiIDList.split(',');
          var indexIn = FpiIDList.indexOf(AdminInfo[p].user);
          if (indexIn > -1) {
            FpiIDList.splice(indexIn, 1);   //删除指纹列表中对应的id
          }
          AdminInfo.remove(AdminInfo[p]); //删除账号
          showAdminInfo();
          var arrTotalFlag = new Array(JSON.stringify(AdminObj));
          nRet1 = top.API.Dat.SetPersistentData("ADMININFO", "STRING", arrTotalFlag);
          top.API.Dat.SetPersistentData(top.API.MFPIIDLISTTag, top.API.MFPIIDLISTType, FpiIDList);

        }

      })();

    }

  }



  function onDatGetPersistentDataComplete(DataName, DataType, DataValue) {

    if ('ADMININFO' == DataName) {

      var arrDataValue = DataValue;

      top.API.displayMessage("onDatGetPersistentDataComplete is done,DataName=" + DataName + ",DataType=" + DataType + ",DataValue=" + arrDataValue);

      top.API.AdminInfoObjStr = arrDataValue.toString();

      top.API.displayMessage("top.API.AdminInfoObjStr =" + top.API.AdminInfoObjStr);

      AdminObj = eval('(' + top.API.AdminInfoObjStr + ')');

      AdminInfo = AdminObj.AdminInfo;

      showAdminInfo();

      var deletebtns = document.getElementsByName("delBtn");

      del_click(deletebtns);

    } else {

      top.API.displayMessage("onDatGetPersistentDataComplete is done,DataName=" + DataName + ",DataType=" + DataType + ",DataValue=" + DataValue);



      // FpiIDList = DataValue.split(",");   // ["01","02","8800"]

      FpiIDList = DataValue; // ["01","02","8800"]

      top.API.displayMessage("FpiIDList =" + FpiIDList);

      top.API.Dat.GetPersistentData("ADMININFO", "STRING"); //获取柜员号 00 01 02 8800



    }



  }



  function onDatSetPersistentDataComplete(DataName) {

    top.API.displayMessage("onDatSetPersistentDataComplete is done,DataName=" + DataName);
    Files.showNetworkMsg("删除管理员成功！");
	 clearTime = setTimeout(function () {
   return CallResponse("OK");
  }, 1500);
    

  }



  function onDatGetPersistentDataError(DataName, ErrorCode) {

    top.API.displayMessage("onDatSetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);


  }


  // TradeSuccess	



  function onDatSetPersistentDataError(DataName, ErrorCode) {

    top.API.displayMessage("onDatSetPersistentDataError is done,DataName=" + DataName + ",ErrorCode=" + ErrorCode);
    top.API.InitBusinessFlag = "BusinessAdminList";

return CallResponse("TradeFail");
    

  }


  function EventLogin() {

    top.API.Dat.addEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);

    top.API.Dat.addEvent("GetPersistentDataError", onDatGetPersistentDataError);

    top.API.Dat.addEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);

    top.API.Dat.addEvent("SetPersistentDataError", onDatSetPersistentDataError);

  }

  function EventLogout() {

    top.API.Dat.removeEvent("GetPersistentDataComplete", onDatGetPersistentDataComplete);

    top.API.Dat.removeEvent("GetPersistentDataError", onDatGetPersistentDataError);

    top.API.Dat.removeEvent("SetPersistentDataComplete", onDatSetPersistentDataComplete);

    top.API.Dat.removeEvent("SetPersistentDataError", onDatSetPersistentDataError);

  }

  //remove all event handler

  function Clearup() {

    //TO DO:
 window.clearTimeout(clearTime); 
    EventLogout();

  }

})();
