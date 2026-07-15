const fs = require('fs');
const path = require('path');

const cityDir = path.join(__dirname, '..', 'city');
const CITY_SUFFIX = '-solar-calculator.html';
const analyticsScript = '<script src="/pv-analytics.js" defer></script>';
const shareCardScript = '<script src="/pvsize-share-card.js" defer></script>';

const allowedCityEndingSlugs = new Set([
  'daly-city',
  'ellicott-city',
  'ho-chi-minh-city',
  'iowa-city',
  'jersey-city',
  'johnson-city',
  'kansas-city',
  'kansas-city-ks',
  'league-city',
  'oklahoma-city',
  'quebec-city',
  'quezon-city',
  'rapid-city',
  'redwood-city',
  'salt-lake-city',
  'sioux-city'
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
  const qualifiers = ['ca', 'tx', 'va', 'ks', 'ct', 'mo', 'mn', 'ma', 'az', 'in', 'au'];
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

  const desiredRobots = flagged
    ? '<meta name="robots" content="noindex,follow">'
    : '<meta name="robots" content="index,follow">';

  if (html.includes('<meta name="robots" content="noindex,follow">')) {
    html = html.replace('<meta name="robots" content="noindex,follow">', desiredRobots);
    changed = true;
  } else if (html.includes('<meta name="robots" content="index,follow">')) {
    html = html.replace('<meta name="robots" content="index,follow">', desiredRobots);
    changed = true;
  }

  if (!html.includes(analyticsScript)) {
    if (html.includes(shareCardScript)) {
      html = html.replace(shareCardScript, `${analyticsScript}\n    ${shareCardScript}`);
    } else if (html.includes('</body>')) {
      html = html.replace('</body>', `    ${analyticsScript}\n</body>`);
    }
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
    else indexedCount += 1;
  });

  console.log(`City pages processed: ${files.length}`);
  console.log(`Indexed pages: ${indexedCount}`);
  console.log(`Noindex pages kept for review: ${flaggedCount}`);
  console.log(`Files changed: ${changedCount}`);
}

main();
