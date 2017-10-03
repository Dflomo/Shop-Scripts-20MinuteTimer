function ssNotiCleaner(ssSheet, ssStorageSheet) {
  Logger.log("Entered ssNotiCleaner\n");
  var ssData = readLogInfo(ssSheet);
  if(ssData != null){
    for(var each in ssData){    
      if(parseInt(ssData[each][3]) == 4){
        
        if(ssData[each][0] != null){
          
          ssSheet.deleteRow(each + 1);
          //              Logger.log(ssData[each][0] + "  " + ssData[each][1] +"  " +  ssData[each][2] +"  " +  ssData[each][3] +"\n");
          ssStorageSheet.appendRow([ssData[each][0], ssData[each][1], ssData[each][2], ssData[each][3]]);
        }
      }
    }
  }
  Logger.log("Exiting ssNotiCleaner\n");
}
