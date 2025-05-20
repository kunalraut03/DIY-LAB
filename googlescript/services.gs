const SHEET_NAME = 'services';
const EMAIL_RECIPIENT = 'diylabvigyanashram@gmail.com';

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error(`Sheet '${SHEET_NAME}' not found.`);

    const formData = e.parameter;
    const timestamp = new Date();

    // Process services (checkboxes)
    let services = '';
    if (formData.service) {
      // If multiple services were selected, formData.service will be an array
      if (Array.isArray(formData.service)) {
        services = formData.service.join(', ');
      } else {
        services = formData.service;
      }
    }

    // Create row data array
    const row = [
      timestamp,
      formData.name || '',
      formData.email || '',
      formData.mobile || '',
      services,
      formData.description || '',
      formData.timeline || '',
      formData.hours || '',
      formData.material || ''
    ];
    
    // Append to sheet
    sheet.appendRow(row);

    // Send email notification
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
    New Service Enquiry Received:
    Timestamp: ${row[0]}
    Name: ${row[1]}
    Email: ${row[2]}
    Mobile: ${row[3]}
    Services Requested: ${row[4]}
    Description: ${row[5]}
    Timeline (days): ${row[6]}
    Hours (per day): ${row[7]}
    Material from DIY LAB: ${row[8]}
  `;
  const emailSubject = `New Service Enquiry_${row[1]}`;
  MailApp.sendEmail(EMAIL_RECIPIENT, emailSubject, emailBody);
}
