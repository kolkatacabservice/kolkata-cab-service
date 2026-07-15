/**
 * Google Apps Script — Kolkata Cab Service Booking Sheet
 * 
 * This script handles TWO submission channels:
 * 1. Website API (doPost) — receives JSON from /api/booking on the website
 * 2. Google Form (onFormSubmit) — triggered when a Google Form response is submitted
 * 
 * Both channels write to the same sheet and send email notifications.
 * 
 * SETUP INSTRUCTIONS:
 * 
 * 1. Open your Google Sheet that receives bookings
 * 2. Go to Extensions → Apps Script
 * 3. Replace the Code.gs content with this entire file
 * 4. Click "Deploy" → "New deployment" (or update existing)
 * 5. Select type: "Web app"
 * 6. Set "Who has access" to "Anyone"
 * 7. Click "Deploy" and copy the Web App URL
 * 8. Add the URL to your Vercel environment variables:
 *    GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
 * 9. Redeploy your Vercel project
 * 
 * SHEET COLUMN ORDER (must match):
 * A: Timestamp | B: Trip Type | C: Pickup City | D: Drop City
 * E: Travel Date | F: Car Type | G: Name | H: Mobile No
 */

// ============================================================
// 1. WEBSITE API — handles POST requests from the website
// ============================================================

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Bookings') || ss.getSheets()[0];
    
    // Create headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp', 'Trip Type', 'Pickup City', 'Drop City',
        'Travel Date', 'Car Type', 'Name', 'Mobile No'
      ]);
      var headerRange = sheet.getRange(1, 1, 1, 8);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#1A237E');
      headerRange.setFontColor('#FFFFFF');
      sheet.setFrozenRows(1);
    }
    
    var timestamp = data.timestamp || new Date().toISOString();
    var tripType  = data.tripType || 'One-Way';
    var pickup    = data.pickupCity || '';
    var drop      = data.dropCity || 'N/A';
    var travelDate = data.travelDate || '';
    var carType   = data.carType || 'Sedan';
    var name      = data.name || '';
    var phone     = data.phone || '';
    
    // Append row — SAME column order as Google Form
    sheet.appendRow([
      timestamp, tripType, pickup, drop,
      travelDate, carType, name, phone
    ]);
    
    // Send email notification
    try {
      var subject = "🚖 New Cab Booking – Kolkata Cab Service (Website)";
      var body =
        "📩 New booking enquiry received from WEBSITE!\n\n" +
        "🕒 Time Received: " + timestamp + "\n" +
        "👤 Name: " + name + "\n" +
        "📞 Mobile: " + phone + "\n" +
        "🔄 Trip Type: " + tripType + "\n" +
        "📍 Pickup City: " + pickup + "\n" +
        "🏁 Drop City: " + drop + "\n" +
        "📅 Travel Date: " + travelDate + "\n" +
        "🚗 Car Type: " + carType + "\n\n" +
        "— Kolkata Cab Service | kolkatacabservice.com | +916204811752";
      
      MailApp.sendEmail("kolkatacabsservice@gmail.com", subject, body);
    } catch (emailErr) {
      // Email failed but data is saved — don't fail the response
      Logger.log("Email sending failed: " + emailErr.toString());
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Booking saved to sheet + email sent' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log("doPost error: " + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Kolkata Cab Service Booking API is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// 2. GOOGLE FORM TRIGGER — handles form submissions
//    (Set up via Triggers → onFormSubmit → From spreadsheet → On form submit)
// ============================================================

function onFormSubmit(e) {
  var sheet = e.range.getSheet();
  var row = e.range.getRow();

  var timestamp    = sheet.getRange(row, 1).getValue();
  var tripType     = sheet.getRange(row, 2).getValue();
  var pickupCity   = sheet.getRange(row, 3).getValue();
  var dropCity     = sheet.getRange(row, 4).getValue();
  var travelDate   = sheet.getRange(row, 5).getValue();
  var carType      = sheet.getRange(row, 6).getValue();
  var name         = sheet.getRange(row, 7).getValue();
  var mobileNo     = sheet.getRange(row, 8).getValue();

  var subject = "🚖 New Cab Booking – Kolkata Cab Service";

  var body =
    "📩 New booking enquiry received! | Kolkata Cab Service\n\n" +
    "🕒 Time Received: " + timestamp + "\n" +
    "👤 Name: " + name + "\n" +
    "📞 Mobile: " + mobileNo + "\n" +
    "🔄 Trip Type: " + tripType + "\n" +
    "📍 Pickup City: " + pickupCity + "\n" +
    "🏁 Drop City: " + dropCity + "\n" +
    "📅 Travel Date: " + travelDate + "\n" +
    "🚗 Car Type: " + carType + "\n\n" +
    "— Kolkata Cab Service | kolkatacabservice.com | +916204811752";

  MailApp.sendEmail(
    "kolkatacabsservice@gmail.com",
    subject,
    body
  );
}
