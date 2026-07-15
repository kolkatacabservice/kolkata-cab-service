/**
 * Google Apps Script — Kolkata Cab Service Booking Sheet
 * VERSION 2.0 — Production Ready
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://sheets.google.com → Create new sheet → Name it "Kolkata Cab Bookings"
 * 2. Go to Extensions → Apps Script
 * 3. Delete all existing code in Code.gs
 * 4. Paste this entire file
 * 5. Save (Ctrl+S)
 * 6. Click "Deploy" → "New deployment"
 * 7. Type: Web app
 * 8. Execute as: Me
 * 9. Who has access: Anyone
 * 10. Click Deploy → Authorize → Copy the Web App URL
 * 11. Add to Cloudflare: wrangler secret put GOOGLE_SCRIPT_URL
 *     Paste the URL and press Enter
 * 
 * COLUMN ORDER IN SHEET:
 * A: Timestamp | B: Trip Type | C: Pickup City | D: Drop City
 * E: Travel Date | F: Car Type | G: Name | H: Mobile No | I: Source
 */

// ============================================================
// CONFIGURATION
// ============================================================
var NOTIFICATION_EMAIL = "kolkatacabsservice@gmail.com";
var SHEET_NAME = "Bookings";

// ============================================================
// 1. WEBSITE API — handles POST requests from /api/booking
// ============================================================
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }
    
    // Create headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      var headers = ['Timestamp', 'Trip Type', 'Pickup City', 'Drop City',
                     'Travel Date', 'Car Type', 'Name', 'Mobile No', 'Source'];
      sheet.appendRow(headers);
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#1A237E');
      headerRange.setFontColor('#FFFFFF');
      sheet.setFrozenRows(1);
      // Auto-resize columns
      sheet.autoResizeColumns(1, headers.length);
    }
    
    var timestamp  = new Date();
    var tripType   = data.tripType   || 'One-Way';
    var pickup     = data.pickupCity || data.from || '';
    var drop       = data.dropCity   || data.to   || 'N/A';
    var travelDate = data.travelDate || data.date  || '';
    var carType    = data.carType    || 'Sedan';
    var name       = data.name       || '';
    var phone      = data.phone      || '';
    var source     = data.source     || 'website';
    
    // Append booking row
    sheet.appendRow([timestamp, tripType, pickup, drop,
                     travelDate, carType, name, phone, source]);
    
    // Color-code new row
    var lastRow = sheet.getLastRow();
    var rowRange = sheet.getRange(lastRow, 1, 1, 9);
    rowRange.setBackground(lastRow % 2 === 0 ? '#E8EAF6' : '#FFFFFF');
    
    // Send email notification
    try {
      var subject = "🚖 New Cab Booking – " + pickup + " → " + drop;
      var body = [
        "📩 New booking from WEBSITE — Kolkata Cab Service",
        "",
        "👤 Name: "        + name,
        "📞 Mobile: "      + phone,
        "🔄 Trip Type: "   + tripType,
        "📍 Pickup: "      + pickup,
        "🏁 Drop: "        + drop,
        "📅 Date: "        + travelDate,
        "🚗 Car: "         + carType,
        "🕒 Submitted: "   + timestamp,
        "",
        "📊 View all bookings: " + SpreadsheetApp.getActiveSpreadsheet().getUrl(),
        "",
        "— Kolkata Cab Service | kolkatacabservice.com | +916204811752"
      ].join("\n");
      
      MailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);
    } catch (emailErr) {
      Logger.log("Email failed (non-fatal): " + emailErr.toString());
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: 'Booking saved successfully' 
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log("doPost error: " + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Health check endpoint (GET request)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ 
      status: 'ok', 
      message: 'Kolkata Cab Booking API running',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// 2. GOOGLE FORM TRIGGER (optional)
//    Set up: Triggers → onFormSubmit → On form submit
// ============================================================
function onFormSubmit(e) {
  try {
    var sheet = e.range.getSheet();
    var row = e.range.getRow();
    var values = sheet.getRange(row, 1, 1, 9).getValues()[0];
    
    var subject = "🚖 New Cab Booking (Form) – Kolkata Cab Service";
    var body = [
      "📩 New booking from GOOGLE FORM",
      "",
      "🕒 Time: "      + values[0],
      "🔄 Trip Type: " + values[1],
      "📍 Pickup: "    + values[2],
      "🏁 Drop: "      + values[3],
      "📅 Date: "      + values[4],
      "🚗 Car: "       + values[5],
      "👤 Name: "      + values[6],
      "📞 Mobile: "    + values[7],
      "",
      "— Kolkata Cab Service | kolkatacabservice.com"
    ].join("\n");
    
    MailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);
  } catch (err) {
    Logger.log("onFormSubmit error: " + err.toString());
  }
}
