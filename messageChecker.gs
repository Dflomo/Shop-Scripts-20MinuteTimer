//messageChecker (MAIN FUNCTION) - Program start

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
  var alreadyDeleted;
  var alreadyRecorded;
  var ssData;
  
  //  Email Variables
  var emailBody = "This email has been starred for over 20 minutes! Lets take care of it!";
  var email1 = "blah@blah.com";
  var email2 = "blah@blah.com;
  var email3 = "blah@blah.com";
  
  //  Spreadsheet Variables
  var ssURL = "";
  var ss = SpreadsheetApp.openByUrl(ssURL);
  var ssMainRecorderSheet = ss.getSheetByName("20 Min Recorder");
  var ssDeleteSheet = ss.getSheetByName("Deleted");
  
  //TEST SHEET VARIABLE - FOR MOD METRICS
  var delSSURL = "";
  var delSS = SpreadsheetApp.openByUrl(delSSURL);
  var currSS = delSS.getSheets()[delSS.getSheets().length -1];
  var ssTemplate = delSS.getSheetByName("Template");
  
  var tomorrow = new Date(newDate.getTime() + (24 * 60 * 60 * 1000));
  var tomorrowStr = tomorrow.toDateString() + "\n"; 
  
  //  Google Script Properties (per script)
  var scriptProperties = PropertiesService.getScriptProperties();  
//  var newPropSet = {endRange: 1518501900000, tenTime: 1518501600000, sixTime: 1518444000000, startRange: 1518443700000};
//  scriptProperties.setProperties(newPropSet, true);
  
  var startRange = scriptProperties.getProperty("startRange"); 
  var sixTime = scriptProperties.getProperty("sixTime"); 
  var tenTime = scriptProperties.getProperty("tenTime"); 
  var endRange = scriptProperties.getProperty("endRange");
  
  //  Email threads, and spreadsheet initialization
  var tempMessageArray = gInbox.search('is:starred');
 
  Logger.log("Ten Time: " + tenTime);
  Logger.log("Six Time: " + sixTime);
  Logger.log("End Range: " + endRange);
  Logger.log("Start Range: " + startRange);  
  
  //#1 IF STATEMENT
  if((newDate <= tenTime) && (newDate >= sixTime)){
    Logger.log("Entered main loop\n");
    
    ssNotiCleaner(ssMainRecorderSheet, ssDeleteSheet, currSS);
    ssUnstarredCleaner(ssMainRecorderSheet, ssDeleteSheet, currSS);
    
    for(var i = 0; i < tempMessageArray.length; i++){
      
      emailDataSubject = messSubject = tempMessageArray[i].getFirstMessageSubject();
      emailDataTime = dateDiff = newDate - tempMessageArray[i].getLastMessageDate();
      emailDataID = tempMessageArray[i].getId();
     
      minDiff = parseInt(((dateDiff/1000)/60));
      ssData = ssMainRecorderSheet.getDataRange().getValues();
      
      alreadyRecorded = hasBeenRecorded(emailDataID, ssMainRecorderSheet, errSS);
      alreadyDeleted = hasBeenDeleted(emailDataID, currSS, errSS);
      
      Logger.log(emailDataID + "\n\n SUBJECT LINE = " + emailDataSubject);
      Logger.log(emailDataID + " OVER 20 MINUTES? = " + (dateDiff >= 1200000));
      Logger.log(emailDataID + " HAS BEEN RECORDED? = " + alreadyRecorded);
      Logger.log(emailDataID + " HAS BEEN DELETED? = " + alreadyDeleted + "\n\n");
      
      if(dateDiff >= 1200000 && !alreadyRecorded && !alreadyDeleted){
        Logger.log(emailDataID + " + " + emailDataTime + " + " + emailDataSubject);
        ssMainRecorderSheet.appendRow([emailDataID, emailDataTime, emailDataSubject, 1]);
        MailApp.sendEmail(email1, "(OLD EMAIL " + minDiff + "+ MINS [FiDi]) " + emailDataSubject, emailBody, {cc: ""});
//            MailApp.sendEmail(emailLaone, "(OLD EMAIL " + minDiff + "+ MINS [FiDi]) " + emailDataSubject, emailBody);
        //            MailApp.sendEmail(emailRich, "(OLD EMAIL " + minDiff + "+ MINS [FiDi]) " + emailDataSubject, emailBody);           
      }
      else if(dateDiff >= 1200000 && !alreadyDeleted && alreadyRecorded){
         
        for(var each in ssData){
          Logger.log("The Length of ssData.length =" + ssData.length);
          Logger.log("The Length of tempMessageArray =" + tempMessageArray.length);
          if(ssData[each][0] == emailDataID){
            
            ssMainRecorderSheet.getRange("B" + (parseInt(each) + 1)).setValue(emailDataTime);
            
            if(ssData[each][1] >= 2400000 && ssData[each][1] <= 2700000){
        
              ssMainRecorderSheet.getRange("D" + (parseInt(each) + 1)).setValue(2);
              MailApp.sendEmail(email1, "(OLD EMAIL " + minDiff + "+ MINS [FiDi]) " +emailDataSubject, emailBody ,{cc: ""});
//              MailApp.sendEmail(emailLaone, "(OLD EMAIL " + minDiff + "+ MINS [FiDi]) " + emailDataSubject, emailBody);
//              MailApp.sendEmail(emailRich, "(OLD EMAIL " + minDiff + "+ MINS [FiDi]) " + emailDataSubject, emailBody);
            }
            else if (ssData[each][1] >= 3600000 && ssData[each][1] <= 3900000){
              
              ssMainRecorderSheet.getRange("D" + (parseInt(each)+ 1)).setValue(3);
              MailApp.sendEmail(email1, "(OLD EMAIL " + minDiff + "+ MINS [FiDi])" +emailDataSubject, emailBody, {cc: ""});
//              MailApp.sendEmail(emailLaone, "(OLD EMAIL " + minDiff + "+ MINS [FiDi]) " + emailDataSubject, emailBody);
//              MailApp.sendEmail(emailRich, "(OLD EMAIL " + minDiff + "+ MINS [FiDi]) " + emailDataSubject, emailBody);
            }
            else if(ssData[each][1] > 4800000){
              //Sets the email warning value
              ssMainRecorderSheet.getRange("D" + (parseInt(each) + 1)).setValue(4);
            }
          }
        }
      }
    }
  }
  //#1b IF STATEMENT
  else if(newDate >= tenTime && newDate <= endRange){
//    Logger.log("Got to 10:00pm - 10:05pm\n");
    var temp = 0;
    
    temp = endRange;
    temp=+temp;
    var tempEndRange = temp + 86400000;
   
    temp = tenTime;
    temp=+temp;
    var tempTenTime = temp + 86400000;
    
    temp = startRange;
    temp=+temp;
    var tempStartRange = temp + 86400000;
    
    temp = sixTime;
    temp=+temp;
    var tempSixTime = temp + 86400000;
    
    var newPropSet = {endRange: tempEndRange, tenTime: tempTenTime, sixTime: tempSixTime, startRange: tempStartRange};
    scriptProperties.setProperties(newPropSet, true);
    
    MailApp.sendEmail(email1, "Going to Sleep!(20 Min Counter[FiDi])", "The 20 Min Script has sensed that it is roughly 10:00 - 10:05pm! Time to shut 'er down captain!");
    MailApp.sendEmail(email2, "Going to Sleep!(20 Min Counter[FiDi])", "The 20 Min Script has sensed that it is roughly 10:00 - 10:05pm! Time to shut 'er down captain!");
    
    delSS.insertSheet(tomorrowStr, delSS.getNumSheets(), {template: ssTemplate});

  }
  else if(newDate >= startRange && newDate < sixTime){
//    Logger.log("Got to 5:55am - 6:00am\n");    
    MailApp.sendEmail(email1, "Waking Up!(20 Min Counter[FiDi])", "The 20 Min Script has sensed that it is roughly 5:55am - 6:00am! Yar! There be sun on the horizon!");
    MailApp.sendEmail(email2, "Waking Up!(20 Min Counter[FiDi])", "The 20 Min Script has sensed that it is roughly 5:55am - 6:00am! Yar! There be sun on the horizon!");
  }
  else if(newDate > endRange && newDate < startRange){ Logger.log("Currently Sleeping\n"); }
  Logger.log("Exiting Main Code");
}
