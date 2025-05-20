const SHEET_NAME = 'internship';
const UPLOAD_FOLDER_ID = '1bLO4ilNvj-312eI7-cYosyJRc5yr6n0f';
const EMAIL_RECIPIENT = 'diylabvigyanashram@gmail.com';

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error(`Sheet '${SHEET_NAME}' not found.`);

    const formData = e.parameter;
    const timestamp = new Date();

    let fileUrl = 'Not uploaded';
    if (formData.resume) {
      fileUrl = saveResumeToDrive(formData.name, formData.resume);
    }

    const row = [
      timestamp,
      formData.name || '',
      formData.email || '',
      formData.phone || '',
      formData.program || '',
      fileUrl,
      formData.background || '',
      formData.motivation || ''
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

function saveResumeToDrive(name, base64String) {
  const folder = DriveApp.getFolderById(UPLOAD_FOLDER_ID);
  const decodedBytes = Utilities.base64Decode(base64String);
  const blob = Utilities.newBlob(decodedBytes, 'application/pdf', `${name}_Resume.pdf`);
  const file = folder.createFile(blob);
  return file.getUrl();
}

function sendEmailNotification(row) {
  const emailBody = `
    New Internship Application Received:
    Timestamp: ${row[0]}
    Name: ${row[1]}
    Email: ${row[2]}
    Phone: ${row[3]}
    Program: ${row[4]}
    Resume Link: ${row[5]}
    Background: ${row[6]}
    Motivation: ${row[7]}
  `;
  const emailSubject = `New Internship Application_${row[1]}`;
  MailApp.sendEmail(EMAIL_RECIPIENT, emailSubject, emailBody);
}
