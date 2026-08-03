const fs = require('fs');
const path = require('path');

const cityDir = path.join(__dirname, '..', 'city');
const CITY_SUFFIX = '-solar-calculator.html';

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

function listCityFiles() {
  return fs
    .readdirSync(cityDir)
    .filter((file) => file.endsWith(CITY_SUFFIX))
    .sort();
}

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

function auditSlug(slug) {
  const issues = [];
  const root = rootWithoutQualifier(slug);

  if (
    (slug.endsWith('-city') || slug.includes('-city-')) &&
    !allowedCityEndingSlugs.has(slug)
  ) {
    issues.push('contains suspicious "-city" slug pattern');
  }

  if (ambiguousRootsNeedingRegion.has(root) && root === slug) {
    issues.push('ambiguous city name without region qualifier');
  }

  suspiciousAdminPatterns.forEach((pattern) => {
    if (pattern.test(slug)) {
      if (pattern.source === 'city$' && allowedCityEndingSlugs.has(slug)) return;
      if (pattern.source === '-city-' && allowedCityEndingSlugs.has(slug)) return;
      issues.push(`matches admin/special-case pattern: ${pattern}`);
    }
  });

  return Array.from(new Set(issues));
}

function main() {
  const files = listCityFiles();
  const findings = [];

  files.forEach((file) => {
    const slug = slugFromFile(file);
    const issues = auditSlug(slug);
    if (issues.length) findings.push({ file, slug, issues });
  });

  console.log(`City pages scanned: ${files.length}`);
  console.log(`Flagged for manual review: ${findings.length}`);

  if (!findings.length) return;

  console.log('');
  findings.slice(0, 80).forEach((item) => {
    console.log(`- ${item.file}`);
    item.issues.forEach((issue) => {
      console.log(`  * ${issue}`);
    });
  });

  if (findings.length > 80) {
    console.log('');
    console.log(`... ${findings.length - 80} more flagged pages omitted from console output`);
  }

  if (process.argv.includes('--strict')) {
    process.exitCode = 1;
  }
}

main();
