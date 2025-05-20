const SHEET_NAME = 'facility';
const EMAIL_RECIPIENT = 'diylabvigyanashram@gmail.com';

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error(`Sheet '${SHEET_NAME}' not found.`);

    const formData = e.parameter;
    const timestamp = new Date();
    
    // Format the visit purpose
    let visitPurpose = formData.purpose || '';
    if (visitPurpose === 'Others' && formData.otherPurpose) {
      visitPurpose = `Others: ${formData.otherPurpose}`;
    }
    
    // Prepare row data
    const row = [
      timestamp,
      formData.fullName || '',
      formData.email || '',
      formData.mobile || '',
      formData.organization || '',
      visitPurpose,
      formData.visitDate || 'Not specified',
      formData.visitorCount || '1',
      formData.specialRequirements || 'None'
    ];
    
    // Add the data to the spreadsheet
    sheet.appendRow(row);

    // Send email notification
    sendEmailNotification(row);

    return ContentService.createTextOutput(JSON.stringify({ 
      result: 'success', 
      row: sheet.getLastRow()
    }))
    .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      result: 'error', 
      error: error.message 
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendEmailNotification(row) {
  const emailBody = `
    New Visit Request Received:
    
    Timestamp: ${row[0]}
    Name: ${row[1]}
    Email: ${row[2]}
    Mobile: ${row[3]}
    Organization: ${row[4]}
    Visit Purpose: ${row[5]}
    Preferred Date: ${row[6]}
    Number of Visitors: ${row[7]}
    Special Requirements: ${row[8]}
  `;
  
  const emailSubject = `New Visit Request - ${row[1]} from ${row[4]}`;
  MailApp.sendEmail(EMAIL_RECIPIENT, emailSubject, emailBody);
}

// For testing in the Apps Script editor
function testSetup() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    const newSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);
    const headers = [
      'Timestamp',
      'Full Name',
      'Email',
      'Mobile',
      'Organization',
      'Visit Purpose',
      'Preferred Date',
      'Visitor Count',
      'Special Requirements'
    ];
    newSheet.appendRow(headers);
    newSheet.setFrozenRows(1);
    Logger.log('Sheet created with headers');
  } else {
    Logger.log('Sheet already exists');
  }
}
