const STORE_OWNERS_EXPORT_URL = 'https://YOUR-UNBLEY-DOMAIN.com/api/store-owners';
const STORE_OWNERS_EXPORT_TOKEN = 'PASTE_YOUR_EXPORT_TOKEN_HERE';
const STORE_OWNERS_SHEET_NAME = 'Store Owners';

function refreshStoreOwners() {
  const response = UrlFetchApp.fetch(STORE_OWNERS_EXPORT_URL, {
    method: 'get',
    headers: { 'x-store-owners-token': STORE_OWNERS_EXPORT_TOKEN },
    muteHttpExceptions: true
  });

  if (response.getResponseCode() !== 200) {
    throw new Error(`Store owner export failed: ${response.getContentText()}`);
  }

  const payload = JSON.parse(response.getContentText());
  const rows = payload.data || [];
  const headers = [...new Set(rows.flatMap((row) => Object.keys(row)))];

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(STORE_OWNERS_SHEET_NAME)
    || spreadsheet.insertSheet(STORE_OWNERS_SHEET_NAME);

  const values = headers.length
    ? [headers, ...rows.map((row) => headers.map((header) => row[header] ?? ''))]
    : [];
  sheet.clearContents();
  if (values.length) {
    sheet.getRange(1, 1, values.length, headers.length).setValues(values);
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);
  }
}

function createDailyStoreOwnerRefresh() {
  ScriptApp.newTrigger('refreshStoreOwners')
    .timeBased()
    .everyDays(1)
    .atHour(7)
    .create();
}