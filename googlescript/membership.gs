const SHEET_NAME = 'membership';
const EMAIL_RECIPIENT = 'diylabvigyanashram@gmail.com';

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error(`Sheet '${SHEET_NAME}' not found.`);

    const formData = e.parameter;
    const timestamp = new Date();

    const row = [
      timestamp,
      formData.enquirerName || '',
      formData.studentName || '',
      formData.schoolName || '',
      formData.email || '',
      formData.studentEmail || '',
      formData.phone || '',
      formData.membershipType || ''
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
    New Membership Application Received:
    Timestamp: ${row[0]}
    Enquirer Name: ${row[1]}
    Student Name: ${row[2]}
    School/College Name: ${row[3]}
    Email: ${row[4]}
    Student Email: ${row[5]}
    Phone: ${row[6]}
    Membership Type: ${row[7]}
  `;
  const emailSubject = `New Membership Application: ${row[2]}`;
  MailApp.sendEmail(EMAIL_RECIPIENT, emailSubject, emailBody);
}
