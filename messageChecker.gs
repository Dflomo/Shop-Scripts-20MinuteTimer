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
  var alreadyRecorded;
  var ssData;
  
  //  Email Variables
  var emailBody = "This email has been starred for over 20 minutes! Lets take care of it!";
  var emailDerek = "derek.florimonte@workshopcafe.com";
  var emailLaone = "laone.oagile@workshopcafe.com";
  var emailRich = "rich.menendez@workshopcafe.com";
  
  //  Spreadsheet Variables
  var ssURL = "https://docs.google.com/a/workshopcafe.com/spreadsheets/d/1wft0ninuYSdKJNriN0x6OtEHmPmNm8aSl-SPz4Kh954/edit?usp=sharing";
  var ss = SpreadsheetApp.openByUrl(ssURL);
  var ssMainRecorderSheet = ss.getSheetByName("20 Min Recorder");
  var ssDeleteSheet = ss.getSheetByName("Deleted");
  
  //TEST SHEET VARIABLE - FOR MOD METRICS
  var delSSURL = "https://docs.google.com/a/workshopcafe.com/spreadsheets/d/18AM0vRTZJ2KbMOXPRrOLbw9sg1DJNIul-lhk6xHsvkU/edit?usp=sharing";
  var delSS = SpreadsheetApp.openByUrl(delSSURL);
  var currSS = delSS.getSheets()[delSS.getSheets().length -1];
  var ssTemplate = delSS.getSheetByName("Template");
  
  var tomorrow = new Date(newDate.getTime() + (24 * 60 * 60 * 1000));
  var tomorrowStr = tomorrow.toDateString() + "\n"; 
  
  //  Google Script Properties (per script)
  var scriptProperties = PropertiesService.getScriptProperties();  
//  var newPropSet = {endRange: 1515045900000, tenTime: 1515045600000, sixTime: 1514988000000, startRange: 1514987700000};
//  scriptProperties.setProperties(newPropSet, true);
  
  var startRange = scriptProperties.getProperty("startRange"); 
  var sixTime = scriptProperties.getProperty("sixTime"); 
  var tenTime = scriptProperties.getProperty("tenTime"); 
  var endRange = scriptProperties.getProperty("endRange");
  
  //  Email threads, and spreadsheet initialization
  var tempMessageArray = gInbox.search('is:starred');
  
  //  Logger.log(newDate.getTime());
  //  Logger.log(newDate.getTime());
  Logger.log("Ten Time: " + tenTime);
  Logger.log("Six Time: " + sixTime);
  Logger.log("End Range: " + endRange);
  Logger.log("Start Range: " + startRange);  
  
  if((newDate <= tenTime) && (newDate >= sixTime)){
    Logger.log("Entered main loop\n");
    ssOverPopCleaner(ssMainRecorderSheet);
    ssNotiCleaner(ssMainRecorderSheet, ssDeleteSheet, currSS);
    ssUnstarredCleaner(tempMessageArray, ssMainRecorderSheet, ssDeleteSheet, currSS);
    
    //    FOR Loop - Traverses the GmailThread[] Array
    for(var i = 0; i < tempMessageArray.length; i++){
      
      emailDataSubject = messSubject = tempMessageArray[i].getFirstMessageSubject();
      emailDataTime = dateDiff = newDate - tempMessageArray[i].getLastMessageDate();
      emailDataID = tempMessageArray[i].getId();
      minDiff = parseInt(((dateDiff/1000)/60));
      
      ssData = ssMainRecorderSheet.getDataRange().getValues();
      alreadyRecorded = hasBeenRecorded (emailDataID, ssMainRecorderSheet);
      deleted = hasBeenDeleted(emailDataID, currSS);
      
      //CHECK - Compares to see if the difference of the email thread time and the current time is greater than 20 mins (in miliseconds)
      if(dateDiff >= 1200000 && !deleted){
        
        //FOR LOOP - Traverses the Spread Sheet Data 
        for(var each in ssData){
          
          //CHECK - Compares Email IDs recorded in SS Data, and the Email IDs from the email thread array
          if(parseInt(ssData[each][0]) == parseInt(emailDataID)){
            
            ssMainRecorderSheet.getRange("B" + (each + 1)).setValue(emailDataTime);
            
            //CHECK - Looks for emails that are 40 - 45 minutes old (miliseconds)
            if(ssData[each][1] >= 2400000 && ssData[each][1] <= 2700000){
        
              //Sets the email warning value
              ssMainRecorderSheet.getRange("D" + (each + 1)).setValue(2);
              MailApp.sendEmail(emailDerek, "(OLD EMAIL " + minDiff + "+ MINS) " +emailDataSubject, emailBody);
              MailApp.sendEmail(emailLaone, "(OLD EMAIL " + minDiff + "+ MINS) " + emailDataSubject, emailBody);
              MailApp.sendEmail(emailRich, "(OLD EMAIL " + minDiff + "+ MINS) " + emailDataSubject, emailBody);
            }
            //CHECK - Looks for emails that are 60 - 65 minutes old (milliseconds)
            else if (ssData[each][1] >= 3600000 && ssData[each][1] <= 3900000){
              
              //Sets the email warning value
              ssMainRecorderSheet.getRange("D" + (each + 1)).setValue(3);
              MailApp.sendEmail(emailDerek, "(OLD EMAIL " + minDiff + "+ MINS)" +emailDataSubject, emailBody);
              MailApp.sendEmail(emailLaone, "(OLD EMAIL " + minDiff + "+ MINS) " + emailDataSubject, emailBody);
              MailApp.sendEmail(emailRich, "(OLD EMAIL " + minDiff + "+ MINS) " + emailDataSubject, emailBody);
            }
            //CHECK - Looks for emails that are 80+ minutes old (possible manager email integration)
            else if(ssData[each][1] > 4800000){
              //Sets the email warning value
              ssMainRecorderSheet.getRange("D" + (each + 1)).setValue(4);
            }
          }
          else if(!alreadyRecorded){
            writeLogInfo(ssMainRecorderSheet, emailDataID, emailDataTime, emailDataSubject, 1);
            MailApp.sendEmail(emailDerek, "(OLD EMAIL " + minDiff + "+ MINS) " + emailDataSubject, emailBody);
            MailApp.sendEmail(emailLaone, "(OLD EMAIL " + minDiff + "+ MINS) " + emailDataSubject, emailBody);
            MailApp.sendEmail(emailRich, "(OLD EMAIL " + minDiff + "+ MINS) " + emailDataSubject, emailBody);           
          }
        }
      }//END Initial 20 Min comparison
      else if(deleted){
        //Send Manager Email
      }
    }//END For Loop: Inbox Messages
  }
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
    
    MailApp.sendEmail(emailDerek, "Going to Sleep!(20 Min Counter)", "The 20 Min Script has sensed that it is roughly 10:00 - 10:05pm! Time to shut 'er down captain!");
    MailApp.sendEmail(emailLaone, "Going to Sleep!(20 Min Counter)", "The 20 Min Script has sensed that it is roughly 10:00 - 10:05pm! Time to shut 'er down captain!");
    
    delSS.insertSheet(tomorrowStr, delSS.getNumSheets(), {template: ssTemplate});

  }
  else if(newDate >= startRange && newDate < sixTime){
//    Logger.log("Got to 5:55am - 6:00am\n");    
    MailApp.sendEmail(emailDerek, "Waking Up!(20 Min Counter)", "The 20 Min Script has sensed that it is roughly 5:55am - 6:00am! Yar! There be sun on the horizon!");
    MailApp.sendEmail(emailLaone, "Waking Up!(20 Min Counter)", "The 20 Min Script has sensed that it is roughly 5:55am - 6:00am! Yar! There be sun on the horizon!");
  }
  else if(newDate > endRange && newDate < startRange){ Logger.log("Currently Sleeping\n"); }
  Logger.log("Exiting Main Code");
}
