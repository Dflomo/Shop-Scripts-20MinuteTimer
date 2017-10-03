function writeLogInfo(ss, emailDataID, emailDataTime, emailDataSubject, ssWarningCount) {
  
  //Inputs all data into the spreadsheet, and records the time of the last email that was checked
  ss.appendRow([emailDataID, emailDataTime, emailDataSubject, ssWarningCount]);
  
}
