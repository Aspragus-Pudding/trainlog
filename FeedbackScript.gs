/**
 * Trainlog → shared feedback sheet (alpha testers' notes)
 *
 * NOT the backup receiver. AppsScript.gs rewrites its whole sheet on every
 * post; this one only ever APPENDS a row, and has no way to read anything
 * back out — so a tester who has this URL (it's in their setup link and their
 * backup file) can add a note but can't see anyone else's.
 *
 * Setup: new Google Sheet → Extensions → Apps Script → paste this → Deploy as
 * web app (execute as you, access: anyone) → put the URL in each tester's
 * setup link as &feedback=<url-encoded URL>.
 *
 * The app sends exactly: kind, name, tag, text, app_version, ts. Nothing from
 * a tester's training log.
 */

function doPost(e) {
  try {
    var body = (e && e.postData && e.postData.contents) || '';
    var o = JSON.parse(body);
    if (!o || o.kind !== 'trainlog_feedback') return ok('ignored');
    var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Feedback');
    if (!sh) {
      sh = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Feedback');
      sh.appendRow(['Received', 'Written', 'Tester', 'Kind', 'Version', 'Note']);
      sh.setFrozenRows(1);
      sh.getRange(1, 1, 1, 6).setFontWeight('bold');
      sh.setColumnWidth(6, 520);
    }
    var clip = function (v, n) { return String(v == null ? '' : v).slice(0, n); };
    sh.appendRow([new Date(), clip(o.ts, 40), clip(o.name, 40), clip(o.tag, 20),
                  clip(o.app_version, 20), clip(o.text, 4000)]);
    return ok('ok');
  } catch (err) {
    return ok('error');
  }
}

/* Deliberately no data in doGet — there is nothing here a tester should read. */
function doGet() {
  return ok('Trainlog feedback receiver is live. The app posts here.');
}

function ok(msg) {
  return ContentService.createTextOutput(msg).setMimeType(ContentService.MimeType.TEXT);
}
