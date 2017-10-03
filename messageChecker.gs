function messageChecker() {
  var gInbox = GmailApp;
  
//  Basic Variable
  var emailDataTime;
  var emailDataID;
  var emailDataSubject
  var messSubject; 
  var newDate  = new Date();
  var dateDiff = 0;
  var minDiff = 0;
  var newDateProperty;
  var deleted;
  var ssData;
  
//  Email Variables
  var emailBody = "This email has been starred for over 20 minutes! Lets take care of it!";
  var emailDerek = "derek.florimonte@workshopcafe.com";
  var emailLaone = "laone.oagile@workshopcafe.com";
  var emailRich = "rich.menendez@workshopcafe.com";
  
//  Spreadsheet Variables
  var ssURL = "fill in spreadsheet URL here!!!!!";
  var ss = SpreadsheetApp.openByUrl(ssURL);
  var ssSheet = ss.getSheetByName("20 Min Recorder");
  var ssDeleteSheet = ss.getSheetByName("Deleted");
  
//  Google Script Properties (per script)
  var scriptProperties = PropertiesService.getScriptProperties();  
  var startRange = scriptProperties.getProperty("startRange"); 
  var sixTime = scriptProperties.getProperty("sixTime"); 
  var tenTime = scriptProperties.getProperty("tenTime"); 
  var endRange = scriptProperties.getProperty("endRange");
  
//  Email threads, and spreadsheet initialization
  var tempMessageArray = gInbox.search('is:starred');

  if(newDate <= tenTime && newDate >= sixTime){
    Logger.log("Entered main loop\n");
    ssNotiCleaner(ssSheet, ssDeleteSheet);
    ssUnstarredCleaner(tempMessageArray, ssSheet, ssDeleteSheet);
    
//    FOR Loop - Traverses the GmailThread[] Array
    for(var i = 0; i < tempMessageArray.length; i++){
      
      emailDataSubject = messSubject = tempMessageArray[i].getFirstMessageSubject();
      emailDataTime = dateDiff = newDate - tempMessageArray[i].getLastMessageDate();
      emailDataID = tempMessageArray[i].getId();
      minDiff = parseInt(((dateDiff/1000)/60));
      deleted = hasBeenDeleted(emailDataID, ssDeleteSheet);
      
//      Read Data From Spreadsheet - [0][0]: Email ID, [0][1]: Email Time Difference(in ms), [0][2]: Email Subject Line, [0][3]: Email Warning count
      ssData = readLogInfo(ssSheet);

      if(dateDiff >= 1200000 && !deleted){
    
        for( var each in ssData){
          
          if(parseInt(ssData[each][0]) == parseInt(emailDataID)){
            ssSheet.getRange("B" + (each + 1)).setValue(emailDataTime);
            
            if(ssData[each][1] >= 2400000 && ssData[each][1] <= 2700000){
              Logger.log("Second Email Warning Sent\n");
              ssSheet.getRange("D" + (each + 1)).setValue(2);
              MailApp.sendEmail(emailDerek, "(OLD EMAIL "+minDiff+"+ MINS)" +emailDataSubject, emailBody);
            }
            else if (ssData[each][1] >= 3600000 && ssData[each][1] <= 3900000){
              MailApp.sendEmail(emailDerek, "(OLD EMAIL "+minDiff+"+ MINS)" +emailDataSubject, emailBody);
              Logger.log("Third Email Warning Sent\n");
              ssSheet.getRange("D" + (each + 1)).setValue(3);
            }
            else if(ssData[each][1] > 4800000){
              ssSheet.getRange("D" + (each + 1)).setValue(4);
            }
          }
          else if(ssData[each][0] != emailDataID){
            writeLogInfo(ss, emailDataID, emailDataTime, emailDataSubject, 1);
            MailApp.sendEmail(emailDerek, "(OLD EMAIL " + minDiff + "+ MINS)" + emailDataSubject, emailBody);
            Logger.log("First Email Warning Sent\n");            
          }
          else if(deleted){
            //Send Manager Email!!!!
          }
        }//END For Loop: spread sheet data object
      }//END Initial 20 Min comparison
    }//END For Loop: Inbox Message
  }
  else if(newDate >= tenTime && newDate <= endRange){
    Logger.Log("Got to 10:00pm - 10:05pm\n");
    
    //NEW END RANGE - For 24hr Comparison
    var tempEndRange = parseInt(endRange) + 86400000;
    var newEndRange = {endRange: tempEndRange};
    scriptProperties.setProperties(newEndRange,true);
    //NEW TEN TIME - For 24hr comparison
    var tempTenTime = parseInt(tenTime) + 86400000;
    var newTenTime = {tenTime: tempTenTime};
    scriptProperties.setProperties(newTenTime,true);
    //NEW START TIME - For 24hr comparison
    var tempStartRange = parseInt(startRange) + 86400000;
    var newStartRange = {startRange: tempStartRange};
    scriptProperties.setProperties(newStartRange, true);
    //NEW SIX TIME - For 24hr comparison
    var tempSixTime = parseInt(sixTime) + 86400000;
    var newSixTime = {sixTime: tempSixTime};
    scriptProperties.setProperties(newSixTime, true);
    
    MailApp.sendEmail(emailDerek, "Going to Sleep!", "The 20 Min Script has sensed that it is roughly 10:00 - 10:05pm! Time to shut 'er down captain!");
  }
  else if(newDate >= startRange && newDate <= sixTime){
    Logger.Log("Got to 5:55am - 6:00am\n");    
    MailApp.sendEmail(emailDerek, "Waking Up!", "The 20 Min Script has sensed that it is roughly 5:55am - 6:00am! Yar! There be sun on the horizon!");
  }
  else if(newDate > endRange && newDate < startRange){ Logger.log("Currently Sleeping\n"); }
}
