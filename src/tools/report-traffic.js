const { spawnSync } = require('child_process');
const path = require('path');

const projectRoot = path.join(__dirname, '..', '..');

function parseArg(flag, fallback) {
  const args = process.argv.slice(2);
  const index = args.indexOf(flag);
  if (index === -1 || index === args.length - 1) return fallback;
  return args[index + 1];
}

function runVercelLogs(since, limit) {
  const result = spawnSync(
    'vercel',
    ['logs', '--environment', 'production', '--since', since, '--limit', String(limit), '--json'],
    {
      cwd: projectRoot,
      encoding: 'utf8'
    }
  );

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || 'vercel logs failed');
  }

  return result.stdout
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => line.startsWith('{'))
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch (error) {
        return null;
      }
    })
    .filter(Boolean);
}

function sortEntries(map) {
  return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
}

function increment(map, key) {
  if (!key) return;
  map.set(key, (map.get(key) || 0) + 1);
}

function parseEmbeddedJson(logItem) {
  const candidates = [];
  if (typeof logItem.message === 'string' && logItem.message.trim().startsWith('{')) {
    candidates.push(logItem.message.trim());
  }
  if (Array.isArray(logItem.logs)) {
    logItem.logs.forEach((entry) => {
      if (entry && typeof entry.message === 'string' && entry.message.trim().startsWith('{')) {
        candidates.push(entry.message.trim());
      }
    });
  }

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate);
    } catch (error) {}
  }

  return null;
}

function printTop(label, entries, limit) {
  console.log(label);
  if (!entries.length) {
    console.log('- none');
    return;
  }
  entries.slice(0, limit).forEach(([key, count]) => {
    console.log(`- ${key}: ${count}`);
  });
}

function main() {
  const since = parseArg('--since', '24h');
  const limit = Number(parseArg('--limit', '500')) || 500;
  const rows = runVercelLogs(since, limit);

  const topPaths = new Map();
  const topPages = new Map();
  const topPageTypes = new Map();
  const topSources = new Map();
  const topEvents = new Map();
  const topLeadForms = new Map();
  const topLeadErrors = new Map();
  const anonymousIds = new Set();
  const sessionIds = new Set();

  let eventRequests = 0;
  let leadRequests = 0;
  let runtimeConfigRequests = 0;
  let pageViewEvents = 0;
  let calculatorCompleteEvents = 0;
  let leadSubmitSuccessEvents = 0;
  let leadSubmitErrorEvents = 0;

  rows.forEach((row) => {
    increment(topPaths, row.requestPath || 'unknown');

    if (row.requestPath === '/api/runtime-config/') runtimeConfigRequests += 1;
    if (row.requestPath === '/api/event/') eventRequests += 1;
    if (row.requestPath === '/api/lead/') leadRequests += 1;

    const payload = parseEmbeddedJson(row);
    if (!payload) return;

    increment(topEvents, payload.event || 'unknown');
    increment(topPages, payload.landing_page || 'unknown');
    increment(topPageTypes, payload.page_type || 'unknown');
    increment(topSources, payload.utm_source || payload.source_param || '(direct)');

    if (payload.anonymous_id) anonymousIds.add(payload.anonymous_id);
    if (payload.session_id) sessionIds.add(payload.session_id);

    if (payload.event === 'pv_page_view') pageViewEvents += 1;
    if (payload.event === 'calculator_complete') calculatorCompleteEvents += 1;
    if (payload.event === 'lead_submit_success') {
      leadSubmitSuccessEvents += 1;
      increment(topLeadForms, payload.form_type || 'unknown');
    }
    if (payload.event === 'lead_submit_error') {
      leadSubmitErrorEvents += 1;
      increment(topLeadErrors, payload.reason || 'unknown');
    }
  });

  console.log(`PVSize traffic report (${since}, max ${limit} log rows)`);
  console.log(`- raw log rows: ${rows.length}`);
  console.log(`- /api/event requests: ${eventRequests}`);
  console.log(`- /api/lead requests: ${leadRequests}`);
  console.log(`- /api/runtime-config requests: ${runtimeConfigRequests}`);
  console.log(`- pv_page_view events: ${pageViewEvents}`);
  console.log(`- calculator_complete events: ${calculatorCompleteEvents}`);
  console.log(`- lead_submit_success events: ${leadSubmitSuccessEvents}`);
  console.log(`- lead_submit_error events: ${leadSubmitErrorEvents}`);
  console.log(`- unique anonymous ids: ${anonymousIds.size}`);
  console.log(`- unique session ids: ${sessionIds.size}`);
  console.log('');

  printTop('Top request paths', sortEntries(topPaths), 10);
  console.log('');
  printTop('Top event names', sortEntries(topEvents), 10);
  console.log('');
  printTop('Top landing pages', sortEntries(topPages), 10);
  console.log('');
  printTop('Top page types', sortEntries(topPageTypes), 10);
  console.log('');
  printTop('Top traffic sources', sortEntries(topSources), 10);
  console.log('');
  printTop('Lead success by form', sortEntries(topLeadForms), 10);
  console.log('');
  printTop('Lead errors by reason', sortEntries(topLeadErrors), 10);
}

main();
