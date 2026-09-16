/**
 * Trainlog → Google Sheets backup receiver
 *
 * Paste this into Apps Script on a new Google Sheet, deploy it as a web app,
 * and give the app the deployment URL. Every finished session then writes
 * your entire log to the sheet.
 *
 * The app sends the whole backup each time, so this just rewrites the sheets.
 * That makes it idempotent — a missed sync repairs itself on the next one,
 * and syncing twice does no harm.
 */

function doPost(e) {
  try {
    var body = (e && e.postData && e.postData.contents) || '';
    if (!body) return ok('empty');

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var lines = body.split('\n').filter(function (l) { return l.trim(); });

    var config = null;
    var events = [];
    lines.forEach(function (l) {
      var o;
      try { o = JSON.parse(l); } catch (err) { return; }
      if (o.type === 'config_snapshot') config = o; else events.push(o);
    });

    writeRaw(ss, lines);
    writeSets(ss, events);
    writeSessions(ss, events);
    writeNotes(ss, events);
    writeStatus(ss, config, events.length);

    return ok('wrote ' + events.length + ' events');
  } catch (err) {
    return ok('error: ' + err.message);
  }
}

function doGet(e) {
  var params = (e && e.parameter) || {};
  if (params.action !== 'fetch') {
    return ok('Trainlog receiver is live. The app posts here.');
  }
  return fetchRaw(params.callback);
}

/** Serves the Raw backup sheet back to the app, same NDJSON shape it posted.
    A plain fetch() can't read a cross-origin response from a script.google.com
    exec URL, so this also supports JSONP (?callback=) for the app to use. */
function fetchRaw(callback) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName('Raw backup');
  var text = '';
  if (sh) {
    var lastRow = sh.getLastRow();
    if (lastRow >= 3) {
      var values = sh.getRange(3, 1, lastRow - 2, 1).getValues();
      text = values.map(function (r) { return r[0]; }).filter(function (v) { return v; }).join('\n');
    }
  }
  if (callback) {
    var payload = callback + '(' + JSON.stringify(text) + ')';
    return ContentService.createTextOutput(payload).setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(text).setMimeType(ContentService.MimeType.TEXT);
}

function ok(msg) {
  return ContentService.createTextOutput(msg).setMimeType(ContentService.MimeType.TEXT);
}

function sheetFor(ss, name) {
  var sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  sh.clear();
  return sh;
}

/** Verbatim backup. This is the sheet that can actually restore the app. */
function writeRaw(ss, lines) {
  var sh = sheetFor(ss, 'Raw backup');
  sh.getRange(1, 1).setValue('One JSON event per row. Copy this column into a .jsonl file to restore.');
  if (!lines.length) return;
  var rows = lines.map(function (l) { return [l]; });
  sh.getRange(3, 1, rows.length, 1).setValues(rows);
  sh.setColumnWidth(1, 900);
}

/** Human-readable set log. */
function writeSets(ss, events) {
  var sh = sheetFor(ss, 'Sets');
  var head = ['Date', 'Time', 'Exercise', 'Weight', 'Unit', 'Reps', 'RPE',
              'Kind', 'Est 1RM', 'PR', 'Session'];
  sh.getRange(1, 1, 1, head.length).setValues([head]).setFontWeight('bold');
  sh.setFrozenRows(1);

  // corrections replay over the raw events, same as the app does
  var patch = {};
  events.forEach(function (e) { if (e.type === 'correction') patch[e.target_id] = e; });

  var rows = [];
  events.forEach(function (e) {
    if (e.type !== 'set') return;
    var p = patch[e.id];
    if (p) { if (p.patch === null) return; for (var k in p.patch) e[k] = p.patch[k]; }
    var d = new Date(e.ts);
    var lb = e.weight ? (e.weight.unit === 'kg' ? e.weight.value * 2.2046226 : e.weight.value) : null;
    rows.push([
      Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd'),
      Utilities.formatDate(d, Session.getScriptTimeZone(), 'HH:mm'),
      e.exercise_id || '',
      e.weight ? e.weight.value : '',
      e.weight ? e.weight.unit : '',
      e.reps || '',
      e.rpe == null ? '' : e.rpe,
      e.set_kind || '',
      (lb && e.reps && e.reps <= 15) ? Math.round(e1rm(lb, e.reps)) : '',
      e.pr ? 'PR' : '',
      e.session_id || ''
    ]);
  });
  if (rows.length) sh.getRange(2, 1, rows.length, head.length).setValues(rows);
}

/** One row per finished session. */
function writeSessions(ss, events) {
  var sh = sheetFor(ss, 'Sessions');
  var head = ['Date', 'Day', 'Session RPE', 'Working sets', 'Joints flagged'];
  sh.getRange(1, 1, 1, head.length).setValues([head]).setFontWeight('bold');
  sh.setFrozenRows(1);

  var setCount = {};
  events.forEach(function (e) {
    if (e.type === 'set' && e.set_kind !== 'warmup')
      setCount[e.session_id] = (setCount[e.session_id] || 0) + 1;
  });

  var rows = [];
  events.forEach(function (e) {
    if (e.type !== 'session_end') return;
    rows.push([
      Utilities.formatDate(new Date(e.ts), Session.getScriptTimeZone(), 'yyyy-MM-dd'),
      e.day_name || '',
      e.session_rpe == null ? '' : e.session_rpe,
      setCount[e.session_id] || 0,
      e.joints ? Object.keys(e.joints).join(', ') : ''
    ]);
  });
  if (rows.length) sh.getRange(2, 1, rows.length, head.length).setValues(rows);
}

/** Notes written in the app, so you can read them off the sheet at your desk. */
function writeNotes(ss, events) {
  var sh = sheetFor(ss, 'Notes');
  var head = ['Date', 'Kind', 'Note', 'Version', 'Context', 'Status'];
  sh.getRange(1, 1, 1, head.length).setValues([head]).setFontWeight('bold');
  sh.setFrozenRows(1);

  var resolved = {};
  events.forEach(function (e) { if (e.type === 'note_resolved') resolved[e.target_id] = true; });

  var rows = [];
  events.forEach(function (e) {
    if (e.type !== 'note') return;
    rows.push([
      Utilities.formatDate(new Date(e.ts), Session.getScriptTimeZone(), 'yyyy-MM-dd'),
      e.tag || '',
      e.text || '',
      e.app_version || '',
      e.context || '',
      resolved[e.id] ? 'done' : 'open'
    ]);
  });
  if (rows.length) sh.getRange(2, 1, rows.length, head.length).setValues(rows);
  sh.setColumnWidth(3, 460);
}

function writeStatus(ss, config, count) {
  var sh = sheetFor(ss, 'Status');
  var cfg = (config && config.cfg) || {};
  sh.getRange(1, 1, 7, 2).setValues([
    ['Last sync', new Date()],
    ['Events', count],
    ['App version', (config && config.app_version) || ''],
    ['Program start', cfg.start || ''],
    ['Target date', cfg.target || ''],
    ['Split', cfg.split || ''],
    ['Goal lifts', (cfg.goals || []).join(', ')]
  ]);
  sh.getRange(1, 1, 7, 1).setFontWeight('bold');
  sh.setColumnWidth(1, 140);
  sh.setColumnWidth(2, 260);
}

/** Same estimator the app uses: mean of Epley, Brzycki and Wathan. */
function e1rm(w, reps) {
  if (!w || !reps || reps < 1 || reps > 15) return 0;
  var ep = w * (1 + reps / 30);
  var br = w * 36 / (37 - reps);
  var wa = w * 100 / (48.8 + 53.8 * Math.exp(-0.075 * reps));
  return (ep + br + wa) / 3;
}
