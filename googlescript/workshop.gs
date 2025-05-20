const SHEET_NAME = 'workshop';
const EMAIL_RECIPIENT = 'diylabvigyanashram@gmail.com';

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error(`Sheet '${SHEET_NAME}' not found.`);

    const formData = e.parameter;
    const timestamp = new Date();
    
    // Extract workshop selections
    let workshops = formData.workshop || '';
    if (formData.otherWorkshop) {
      workshops += workshops ? `, ${formData.otherWorkshop}` : formData.otherWorkshop;
    }

    const row = [
      timestamp,
      formData.name || '',
      formData.email || '',
      formData.phone || '',
      formData.institution || '',
      workshops,
      formData.startDate || ''
    ];
    sheet.appendRow(row);

    sendEmailNotification(row);

    return ContentService.createTextOutput(JSON.stringify({ result: 'success', row: sheet.getLastRow() }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendEmailNotification(row) {
  const emailBody = `
    New Workshop Registration Received:
    Timestamp: ${row[0]}
    Name: ${row[1]}
    Email: ${row[2]}
    Phone: ${row[3]}
    Institution: ${row[4]}
    Workshops Selected: ${row[5]}
    Preferred Start Date: ${row[6]}
  `;
  const emailSubject = `New Workshop Registration_${row[1]}`;
  MailApp.sendEmail(EMAIL_RECIPIENT, emailSubject, emailBody);
}
