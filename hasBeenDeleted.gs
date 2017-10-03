function hasBeenDeleted(emailID, ssDeleteSheet) {
  var ssData = readLogInfo(ssDeleteSheet);
  
  for(var each in ssData){
    if(emailID == ssData[each][0]){
      return true;
    }
  }
  return false;
}
  
  
