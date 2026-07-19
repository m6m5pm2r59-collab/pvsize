const fs = require('fs');
const path = require('path');

const cityDir = path.join(__dirname, '..', 'city');
const policyPath = path.join(__dirname, '..', 'data', 'city-index-policy.json');
const CITY_SUFFIX = '-solar-calculator.html';
// Managed script dependencies (fixed order, must be complete)
const managedScripts = [
  '<script src="/pv-analytics.js" defer></script>',
  '<script src="/country-context.js" defer></script>',
  '<script src="/city-country-map.js" defer></script>',
  '<script src="/pvsize-share-card.js" defer></script>',
];
const managedScriptBlock = managedScripts.map(s => `    ${s}`).join('\n');
// Regex matching any of the 4 managed scripts (handles attribute order variants)
const managedScriptPattern = /^\s*<script\s+(?:src="\/(?:pv-analytics|country-context|city-country-map|pvsize-share-card)\.js"\s+defer|defer\s+src="\/(?:pv-analytics|country-context|city-country-map|pvsize-share-card)\.js")>\s*<\/script>\s*$/gm;
const analyticsScript = managedScripts[0];
const shareCardScript = managedScripts[3];
const indexPolicy = JSON.parse(fs.readFileSync(policyPath, 'utf8'));
const pilotIndexSlugs = new Set(indexPolicy.pilot_index_slugs || []);
const alwaysNoindexSlugs = new Set(indexPolicy.always_noindex_slugs || []);

const allowedCityEndingSlugs = new Set([
  'daly-city',
  'ellicott-city',
  'ho-chi-minh-city',
  'iowa-city',
  'jersey-city',
  'johnson-city',
  'kansas-city',
  'kansas-city-ks',
  'kansas-city-mo',
  'kuwait-city',
  'league-city',
  'missouri-city',
  'oklahoma-city',
  'quebec-city',
  'quezon-city',
  'rapid-city',
  'redwood-city',
  'salt-lake-city',
  'sioux-city',
  'west-valley-city'
]);

const ambiguousRootsNeedingRegion = new Set([
  'arlington',
  'aurora',
  'bloomington',
  'carmel',
  'fairfield',
  'frankfurt',
  'glendale',
  'hanover',
  'lafayette',
  'lancaster',
  'newport',
  'oakland',
  'orange',
  'paradise',
  'paris',
  'pasadena',
  'portsmouth',
  'richmond',
  'rochester',
  'salem',
  'springfield',
  'sunderland',
  'westminster'
]);

const suspiciousAdminPatterns = [
  /charter-township/,
  /bibb-county/,
  /urban-honolulu/,
  /town-n-country/,
  /city$/,
  /-city-/,
  /county$/,
  /township$/,
  /hempstead$/,
  /clarkstown$/
];

function slugFromFile(file) {
  return file.slice(0, -CITY_SUFFIX.length);
}

function rootWithoutQualifier(slug) {
  const qualifiers = [
    'al',
    'az',
    'au',
    'ca',
    'co',
    'ct',
    'de',
    'fl',
    'fr',
    'ga',
    'id',
    'il',
    'in',
    'ks',
    'ma',
    'mi',
    'mn',
    'mo',
    'nv',
    'ny',
    'or',
    'pa',
    'tx',
    'uk',
    'ut',
    'va'
  ];
  const parts = slug.split('-');
  if (parts.length > 1 && qualifiers.includes(parts[parts.length - 1])) {
    return parts.slice(0, -1).join('-');
  }
  return slug;
}

function isFlaggedSlug(slug) {
  const root = rootWithoutQualifier(slug);

  if ((slug.endsWith('-city') || slug.includes('-city-')) && !allowedCityEndingSlugs.has(slug)) {
    return true;
  }

  if (ambiguousRootsNeedingRegion.has(root) && root === slug) {
    return true;
  }

  return suspiciousAdminPatterns.some((pattern) => {
    if ((pattern.source === 'city$' || pattern.source === '-city-') && allowedCityEndingSlugs.has(slug)) {
      return false;
    }
    return pattern.test(slug);
  });
}

function updateFile(file) {
  const fullPath = path.join(cityDir, file);
  const slug = slugFromFile(file);
  const flagged = isFlaggedSlug(slug);
  let html = fs.readFileSync(fullPath, 'utf8');
  let changed = false;

  const shouldIndex = pilotIndexSlugs.has(slug) && !alwaysNoindexSlugs.has(slug) && !flagged;
  const desiredRobots = shouldIndex
    ? '<meta name="robots" content="index,follow">'
    : '<meta name="robots" content="noindex,follow">';

  if (html.includes('<meta name="robots" content="noindex,follow">')) {
    html = html.replace('<meta name="robots" content="noindex,follow">', desiredRobots);
    changed = true;
  } else if (html.includes('<meta name="robots" content="index,follow">')) {
    html = html.replace('<meta name="robots" content="index,follow">', desiredRobots);
    changed = true;
  }

  // Normalize managed scripts: strip all existing, re-insert complete block before </body>
  const beforeScripts = html;
  html = html.replace(managedScriptPattern, '');
  // Clean up trailing blank lines left by removal
  html = html.replace(/\n{3,}/g, '\n\n');
  // Insert managed script block before </body>
  if (html.includes('</body>')) {
    html = html.replace('</body>', `${managedScriptBlock}\n</body>`);
  }
  if (html !== beforeScripts) {
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(fullPath, html);
  }

  return { flagged, changed };
}

function main() {
  const files = fs
    .readdirSync(cityDir)
    .filter((file) => file.endsWith(CITY_SUFFIX))
    .sort();

  let changedCount = 0;
  let flaggedCount = 0;
  let indexedCount = 0;

  files.forEach((file) => {
    const result = updateFile(file);
    if (result.changed) changedCount += 1;
    if (result.flagged) flaggedCount += 1;
    if (pilotIndexSlugs.has(slugFromFile(file)) && !result.flagged && !alwaysNoindexSlugs.has(slugFromFile(file))) {
      indexedCount += 1;
    }
  });

  console.log(`City pages processed: ${files.length}`);
  console.log(`Indexed pages: ${indexedCount}`);
  console.log(`Noindex pages kept for review: ${flaggedCount}`);
  console.log(`Files changed: ${changedCount}`);
}

main();
