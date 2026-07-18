const { spawnSync } = require('child_process');
const fs = require('fs');
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

function buildReport(since, limit, rows) {
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
  let feedbackRequests = 0;
  let runtimeConfigRequests = 0;
  let pageViewEvents = 0;
  let calculatorStartEvents = 0;
  let calculatorCompleteEvents = 0;
  let leadSubmitSuccessEvents = 0;
  let leadSubmitErrorEvents = 0;
  let externalLandingEvents = 0;
  let resultCopyEvents = 0;
  let resultShareEvents = 0;
  let feedbackSubmitEvents = 0;
  let utmExternalLandingEvents = 0;
  let referrerExternalLandingEvents = 0;

  rows.forEach((row) => {
    increment(topPaths, row.requestPath || 'unknown');

    if (row.requestPath === '/api/runtime-config/') runtimeConfigRequests += 1;
    if (row.requestPath === '/api/event/') eventRequests += 1;
    if (row.requestPath === '/api/lead/') leadRequests += 1;
    if (row.requestPath === '/api/feedback/') feedbackRequests += 1;

    const payload = parseEmbeddedJson(row);
    if (!payload) return;
    if (payload.event === 'codex_probe' || payload.source_param === 'codex_check') return;
    if (payload.internal_traffic) return;
    if (payload.bot_user_agent) return;

    increment(topEvents, payload.event || 'unknown');
    increment(topPages, payload.landing_page || 'unknown');
    increment(topPageTypes, payload.page_type || 'unknown');
    increment(topSources, payload.utm_source || payload.referrer_host || payload.source_param || '(direct)');

    if (payload.anonymous_id) anonymousIds.add(payload.anonymous_id);
    if (payload.session_id) sessionIds.add(payload.session_id);

    if (payload.event === 'pv_page_view') pageViewEvents += 1;
    if (payload.event === 'calculator_start') calculatorStartEvents += 1;
    if (payload.event === 'external_landing') {
      externalLandingEvents += 1;
      if (payload.external_landing_reason === 'utm' || payload.has_utm) utmExternalLandingEvents += 1;
      else if (payload.external_landing_reason === 'referrer' || payload.external_referrer) referrerExternalLandingEvents += 1;
    }
    if (payload.event === 'calculator_complete') calculatorCompleteEvents += 1;
    if (payload.event === 'result_copy') resultCopyEvents += 1;
    if (payload.event === 'result_share') resultShareEvents += 1;
    if (payload.event === 'feedback_submit') feedbackSubmitEvents += 1;
    if (payload.event === 'lead_submit_success') {
      leadSubmitSuccessEvents += 1;
      increment(topLeadForms, payload.form_type || 'unknown');
    }
    if (payload.event === 'lead_submit_error') {
      leadSubmitErrorEvents += 1;
      increment(topLeadErrors, payload.reason || 'unknown');
    }
  });

  return {
    generated_at: new Date().toISOString(),
    since,
    limit,
    raw_log_rows: rows.length,
    metrics: {
      event_requests: eventRequests,
      lead_requests: leadRequests,
      feedback_requests: feedbackRequests,
      runtime_config_requests: runtimeConfigRequests,
      page_view_events: pageViewEvents,
      calculator_start_events: calculatorStartEvents,
      calculator_complete_events: calculatorCompleteEvents,
      external_landing_events: externalLandingEvents,
      utm_external_landing_events: utmExternalLandingEvents,
      referrer_external_landing_events: referrerExternalLandingEvents,
      result_copy_events: resultCopyEvents,
      result_share_events: resultShareEvents,
      feedback_submit_events: feedbackSubmitEvents,
      lead_submit_success_events: leadSubmitSuccessEvents,
      lead_submit_error_events: leadSubmitErrorEvents,
      unique_anonymous_ids: anonymousIds.size,
      unique_session_ids: sessionIds.size
    },
    top_request_paths: sortEntries(topPaths),
    top_event_names: sortEntries(topEvents),
    top_landing_pages: sortEntries(topPages),
    top_page_types: sortEntries(topPageTypes),
    top_traffic_sources: sortEntries(topSources),
    lead_success_by_form: sortEntries(topLeadForms),
    lead_errors_by_reason: sortEntries(topLeadErrors)
  };
}

function printReport(report) {
  console.log(`PVSize traffic report (${report.since}, max ${report.limit} log rows)`);
  console.log(`- raw log rows: ${report.raw_log_rows}`);
  console.log(`- /api/event requests: ${report.metrics.event_requests}`);
  console.log(`- /api/lead requests: ${report.metrics.lead_requests}`);
  console.log(`- /api/feedback requests: ${report.metrics.feedback_requests}`);
  console.log(`- /api/runtime-config requests: ${report.metrics.runtime_config_requests}`);
  console.log(`- pv_page_view events: ${report.metrics.page_view_events}`);
  console.log(`- calculator_start events: ${report.metrics.calculator_start_events}`);
  console.log(`- calculator_complete events: ${report.metrics.calculator_complete_events}`);
  console.log(`- external_landing events: ${report.metrics.external_landing_events}`);
  console.log(`- external_landing via UTM: ${report.metrics.utm_external_landing_events}`);
  console.log(`- external_landing via referrer: ${report.metrics.referrer_external_landing_events}`);
  console.log(`- result_copy events: ${report.metrics.result_copy_events}`);
  console.log(`- result_share events: ${report.metrics.result_share_events}`);
  console.log(`- feedback_submit events: ${report.metrics.feedback_submit_events}`);
  console.log(`- lead_submit_success events: ${report.metrics.lead_submit_success_events}`);
  console.log(`- lead_submit_error events: ${report.metrics.lead_submit_error_events}`);
  console.log(`- unique anonymous ids: ${report.metrics.unique_anonymous_ids}`);
  console.log(`- unique session ids: ${report.metrics.unique_session_ids}`);
  console.log('');

  printTop('Top request paths', report.top_request_paths, 10);
  console.log('');
  printTop('Top event names', report.top_event_names, 10);
  console.log('');
  printTop('Top landing pages', report.top_landing_pages, 10);
  console.log('');
  printTop('Top page types', report.top_page_types, 10);
  console.log('');
  printTop('Top traffic sources', report.top_traffic_sources, 10);
  console.log('');
  printTop('Lead success by form', report.lead_success_by_form, 10);
  console.log('');
  printTop('Lead errors by reason', report.lead_errors_by_reason, 10);
}

function writeMarkdownReport(report, markdownOut) {
  const outputPath = path.isAbsolute(markdownOut) ? markdownOut : path.join(__dirname, '..', markdownOut);
  const lines = [
    `# PVSize traffic report`,
    '',
    `Generated at: ${report.generated_at}`,
    `Window: ${report.since}`,
    '',
    '## Metrics',
    '',
    '| Metric | Count |',
    '|---|---:|',
    `| raw log rows | ${report.raw_log_rows} |`,
    `| /api/event requests | ${report.metrics.event_requests} |`,
    `| pv_page_view | ${report.metrics.page_view_events} |`,
    `| external_landing | ${report.metrics.external_landing_events} |`,
    `| external_landing via UTM | ${report.metrics.utm_external_landing_events} |`,
    `| external_landing via referrer | ${report.metrics.referrer_external_landing_events} |`,
    `| calculator_start | ${report.metrics.calculator_start_events} |`,
    `| calculator_complete | ${report.metrics.calculator_complete_events} |`,
    `| result_copy | ${report.metrics.result_copy_events} |`,
    `| result_share | ${report.metrics.result_share_events} |`,
    `| feedback_submit | ${report.metrics.feedback_submit_events} |`,
    `| lead_submit_success | ${report.metrics.lead_submit_success_events} |`,
    '',
    '## Top traffic sources',
    '',
    ...(report.top_traffic_sources.length ? report.top_traffic_sources.slice(0, 10).map(([key, count]) => `- ${key}: ${count}`) : ['- none']),
    '',
    '## Top landing pages',
    '',
    ...(report.top_landing_pages.length ? report.top_landing_pages.slice(0, 10).map(([key, count]) => `- ${key}: ${count}`) : ['- none']),
    '',
    '## Notes',
    '',
    '- Filters out `codex_probe`, `source_param=codex_check`, `internal_traffic=true`, and likely bot user agents.',
    '- Does not include private raw log payloads.'
  ];
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${lines.join('\n')}\n`);
  console.log('');
  console.log(`Wrote Markdown report: ${outputPath}`);
}

function main() {
  const since = parseArg('--since', '24h');
  const limit = Number(parseArg('--limit', '500')) || 500;
  const jsonOut = parseArg('--json-out', '');
  const markdownOut = parseArg('--markdown-out', '');
  const rows = runVercelLogs(since, limit);
  const report = buildReport(since, limit, rows);

  printReport(report);

  if (jsonOut) {
    const outputPath = path.isAbsolute(jsonOut) ? jsonOut : path.join(__dirname, '..', jsonOut);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
    console.log('');
    console.log(`Wrote JSON report: ${outputPath}`);
  }

  if (markdownOut) writeMarkdownReport(report, markdownOut);
}

main();
