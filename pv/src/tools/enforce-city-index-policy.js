const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const repoRoot = path.join(root, '..');
const cityDir = path.join(root, 'city');
const policyPath = path.join(root, 'data', 'city-index-policy.json');
const reportPath = path.join(repoRoot, 'reports', 'city-quality-report.json');

const policy = JSON.parse(fs.readFileSync(policyPath, 'utf8'));
const pilotSlugs = new Set(policy.pilot_index_slugs || []);
const alwaysNoindexSlugs = new Set(policy.always_noindex_slugs || []);
const minimumBasicScore = Number(policy.minimum_basic_score) || 55;

function slugFromFile(file) {
  return file.replace(/-solar-calculator\.html$/, '');
}

function hasRegionSignal(slug, html) {
  return (
    /,\s[A-Z]{2}\b/.test(html) ||
    /,\s(UK|Germany|Australia|Canada|New Zealand|France|Spain|Japan|Singapore|UAE)\b/.test(html) ||
    /-[a-z]{2}$/.test(slug)
  );
}

function scoreCityPage(slug, html) {
  const checks = [
    ['title', /<title>Solar Calculator in .+ \| PVSize<\/title>/.test(html), 10],
    ['description', /<meta name="description" content="Free solar calculator for .+ homes\./.test(html), 10],
    ['self_canonical', html.includes(`href="https://pvsize.com/city/${slug}-solar-calculator/"`), 10],
    ['h1', /<h1>Solar Calculator for .+<\/h1>/.test(html), 10],
    ['region_signal', hasRegionSignal(slug, html), 10],
    ['core_calculator_links', [
      '/calculators/panel-count/',
      '/calculators/savings/',
      '/calculators/battery-sizing/',
      '/request-solar-plan/'
    ].every((needle) => html.includes(needle)), 10],
    ['source_tracking', html.includes(`source=city-${slug}`), 10],
    ['planning_disclaimer', html.includes('Planning estimate:'), 10],
    ['analytics', html.includes('/pv-analytics.js'), 10],
    ['clean_slug', !/(^|-)(city|county|township)($|-)/.test(slug), 10]
  ];

  const score = checks.reduce((sum, [, passed, points]) => sum + (passed ? points : 0), 0);
  const missing = checks.filter(([, passed]) => !passed).map(([name]) => name);
  const missingAdvanced = [
    'local_sun_hours_with_source',
    'local_electricity_rate_with_date',
    'local_currency',
    'city_specific_example',
    'prefilled_local_calculator_parameters',
    'last_updated_content_note'
  ];

  return { score, missing, missing_advanced: missingAdvanced };
}

function setRobots(html, value) {
  if (/<meta name="robots" content="[^"]+">/.test(html)) {
    return html.replace(/<meta name="robots" content="[^"]+">/, `<meta name="robots" content="${value}">`);
  }
  return html.replace('</head>', `<meta name="robots" content="${value}">\n</head>`);
}

function main() {
  if (pilotSlugs.size > Number(policy.max_indexed_city_pages || 50)) {
    throw new Error('pilot_index_slugs exceeds max_indexed_city_pages');
  }

  const rows = [];
  let indexed = 0;
  let noindexed = 0;

  fs.readdirSync(cityDir)
    .filter((file) => file.endsWith('-solar-calculator.html'))
    .sort()
    .forEach((file) => {
      const slug = slugFromFile(file);
      const fullPath = path.join(cityDir, file);
      const html = fs.readFileSync(fullPath, 'utf8');
      const result = scoreCityPage(slug, html);
      const allowedPilot = pilotSlugs.has(slug);
      const forcedNoindex = alwaysNoindexSlugs.has(slug);
      const shouldIndex = allowedPilot && !forcedNoindex && result.score >= minimumBasicScore;
      const robots = shouldIndex ? 'index,follow' : 'noindex,follow';
      const nextHtml = setRobots(html, robots);

      if (nextHtml !== html) fs.writeFileSync(fullPath, nextHtml);
      if (shouldIndex) indexed += 1;
      else noindexed += 1;

      rows.push({
        slug,
        robots,
        pilot: allowedPilot,
        forced_noindex: forcedNoindex,
        basic_score: result.score,
        missing_basic: result.missing,
        missing_advanced: result.missing_advanced
      });
    });

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify({
    generated_at: new Date().toISOString(),
    policy: {
      mode: policy.mode,
      max_indexed_city_pages: policy.max_indexed_city_pages,
      minimum_basic_score: minimumBasicScore
    },
    totals: { indexed, noindexed, city_pages: indexed + noindexed },
    rows
  }, null, 2)}\n`);

  console.log(`City pages indexed: ${indexed}`);
  console.log(`City pages noindex: ${noindexed}`);
  console.log(`Quality report: ${reportPath}`);
}

main();
