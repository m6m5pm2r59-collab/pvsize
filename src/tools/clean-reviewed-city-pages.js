const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const cityDir = path.join(root, 'city');
const reviewPath = path.join(root, 'data', 'city-page-review.json');
const reportPath = path.join(root, 'data', 'city-page-review.md');

const renamePages = {
  'ann-arbor-city': { to: 'ann-arbor', fromText: 'Ann Arbor city, MI', toText: 'Ann Arbor, MI' },
  'boise-city': { to: 'boise', fromText: 'Boise City, ID', toText: 'Boise, ID' },
  'burbank-city': { to: 'burbank-ca', fromText: 'Burbank city, CA', toText: 'Burbank, CA' },
  'carmel': { to: 'carmel-in', fromText: 'Carmel, IN', toText: 'Carmel, IN' },
  'fairfield': { to: 'fairfield-ca', fromText: 'Fairfield, CA', toText: 'Fairfield, CA' },
  'flint-city': { to: 'flint-mi', fromText: 'Flint city, MI', toText: 'Flint, MI' },
  'frankfurt': { to: 'frankfurt-de', fromText: 'Frankfurt, Germany', toText: 'Frankfurt, Germany' },
  'grand-rapids-city': { to: 'grand-rapids-mi', fromText: 'Grand Rapids city, MI', toText: 'Grand Rapids, MI' },
  'hanover': { to: 'hanover-de', fromText: 'Hanover, Germany', toText: 'Hanover, Germany' },
  'kalamazoo-city': { to: 'kalamazoo-mi', fromText: 'Kalamazoo city, MI', toText: 'Kalamazoo, MI' },
  'lancaster': { to: 'lancaster-ca', fromText: 'Lancaster, CA', toText: 'Lancaster, CA' },
  'lansing-city': { to: 'lansing-mi', fromText: 'Lansing city, MI', toText: 'Lansing, MI' },
  'mesquite-city': { to: 'mesquite-tx', fromText: 'Mesquite city, TX', toText: 'Mesquite, TX' },
  'mountain-view-city': { to: 'mountain-view-ca', fromText: 'Mountain View city, CA', toText: 'Mountain View, CA' },
  'oakland': { to: 'oakland-ca', fromText: 'Oakland, California', toText: 'Oakland, California' },
  'orange': { to: 'orange-au', fromText: 'Orange, Australia', toText: 'Orange, Australia' },
  'paradise': { to: 'paradise-nv', fromText: 'Paradise, NV', toText: 'Paradise, NV' },
  'paris': { to: 'paris-fr', fromText: 'Paris, France', toText: 'Paris, France' },
  'plantation-city': { to: 'plantation-fl', fromText: 'Plantation city, FL', toText: 'Plantation, FL' },
  'portsmouth': { to: 'portsmouth-uk', fromText: 'Portsmouth, UK', toText: 'Portsmouth, UK' },
  'reading-city': { to: 'reading-pa', fromText: 'Reading city, PA', toText: 'Reading, PA' },
  'rochester': { to: 'rochester-mn', fromText: 'Rochester, MN', toText: 'Rochester, MN' },
  'rochester-city': { to: 'rochester-ny', fromText: 'Rochester city, NY', toText: 'Rochester, NY' },
  'salem': { to: 'salem-or', fromText: 'Salem, OR', toText: 'Salem, OR' },
  'southfield-city': { to: 'southfield-mi', fromText: 'Southfield city, MI', toText: 'Southfield, MI' },
  'sunderland': { to: 'sunderland-uk', fromText: 'Sunderland, UK', toText: 'Sunderland, UK' },
  'troy-city': { to: 'troy-mi', fromText: 'Troy city, MI', toText: 'Troy, MI' },
  'urban-honolulu': { to: 'honolulu', fromText: 'Urban Honolulu, HI', toText: 'Honolulu, HI' },
  'warren-city': { to: 'warren-mi', fromText: 'Warren city, MI', toText: 'Warren, MI' }
};

const removePages = {
  arlington: { to: 'arlington-va', reason: 'Duplicate of region-qualified Arlington, VA page.' },
  aurora: { to: 'aurora-il', reason: 'Duplicate of region-qualified Aurora, IL page.' },
  bloomington: { to: 'bloomington-il', reason: 'Duplicate of region-qualified Bloomington, IL page.' },
  glendale: { to: 'glendale-ca', reason: 'Duplicate of region-qualified Glendale, CA page.' },
  lafayette: { to: 'lafayette-in', reason: 'Duplicate of region-qualified Lafayette, IN page.' },
  pasadena: { to: 'pasadena-ca', reason: 'Duplicate of region-qualified Pasadena, CA page.' },
  richmond: { to: 'richmond-ca', reason: 'Duplicate of region-qualified Richmond, CA page.' },
  springfield: { to: 'springfield-il', reason: 'Duplicate of region-qualified Springfield, IL page.' },
  westminster: { to: 'westminster-ca', reason: 'Duplicate of region-qualified Westminster, CA page.' }
};

const keepNoindexPages = {
  'athens-clarke-county': 'County-level page; keep out of index until rewritten as Athens, GA or regional content.',
  'augusta-richmond-county': 'County-level consolidated government page; keep out of index until rewritten.',
  clarkstown: 'Town-level page; keep out of index until there is a stronger local template.',
  'clinton-charter-township': 'Township page; keep out of index until rewritten.',
  'dale-city': 'CDP/special locality page; keep out of index until validated.',
  'hamilton-township': 'Township page; keep out of index until rewritten.',
  'macon-bibb-county': 'County-level consolidated government page; keep out of index until rewritten as Macon, GA.',
  'north-hempstead': 'Town-level page; keep out of index until there is a stronger local template.',
  'shelby-charter-township': 'Township page; keep out of index until rewritten.',
  'town-n-country': 'Special locality spelling; keep out of index until validated.'
};

const allowIndexPages = {
  'kansas-city-mo': 'Valid region-qualified Kansas City, MO page.',
  'kuwait-city': 'Valid city name.',
  'missouri-city': 'Valid city name in Texas.',
  'west-valley-city': 'Valid city name in Utah.'
};

function fileFor(slug) {
  return path.join(cityDir, `${slug}-solar-calculator.html`);
}

function replaceAll(text, search, replacement) {
  return text.split(search).join(replacement);
}

function updateHtml(html, fromSlug, toSlug, fromText, toText, robots) {
  let next = html;
  next = replaceAll(next, `/city/${fromSlug}-solar-calculator/`, `/city/${toSlug}-solar-calculator/`);
  next = replaceAll(next, `source=city-${fromSlug}`, `source=city-${toSlug}`);
  if (fromText && fromText !== toText) next = replaceAll(next, fromText, toText);
  next = next.replace(/<meta name="robots" content="[^"]+">/, `<meta name="robots" content="${robots}">`);
  return next;
}

function movePage(fromSlug, item) {
  const fromPath = fileFor(fromSlug);
  const toPath = fileFor(item.to);
  if (!fs.existsSync(fromPath)) return false;
  if (fs.existsSync(toPath)) {
    throw new Error(`Cannot rename ${fromSlug}; target exists: ${item.to}`);
  }

  const html = updateHtml(
    fs.readFileSync(fromPath, 'utf8'),
    fromSlug,
    item.to,
    item.fromText,
    item.toText,
    'index,follow'
  );
  fs.writeFileSync(toPath, html);
  fs.unlinkSync(fromPath);
  return true;
}

function removePage(slug) {
  const fullPath = fileFor(slug);
  if (!fs.existsSync(fullPath)) return false;
  fs.unlinkSync(fullPath);
  return true;
}

function setRobots(slug, value) {
  const fullPath = fileFor(slug);
  if (!fs.existsSync(fullPath)) return false;
  const html = fs.readFileSync(fullPath, 'utf8').replace(
    /<meta name="robots" content="[^"]+">/,
    `<meta name="robots" content="${value}">`
  );
  fs.writeFileSync(fullPath, html);
  return true;
}

function updateVercelRedirects(redirects) {
  const vercelPath = path.join(root, 'vercel.json');
  const config = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
  const existing = Array.isArray(config.redirects) ? config.redirects : [];
  const seen = new Set(existing.map((item) => item.source));
  redirects.forEach((item) => {
    if (!seen.has(item.source)) existing.push(item);
  });
  config.redirects = existing;
  fs.writeFileSync(vercelPath, `${JSON.stringify(config, null, 2)}\n`);
}

function writeReviewReport(review) {
  fs.writeFileSync(reviewPath, `${JSON.stringify(review, null, 2)}\n`);

  const lines = [
    '# PVSize City Page Review',
    '',
    `Generated: ${review.generated_at}`,
    '',
    `- Rename: ${review.rename.length}`,
    `- Remove: ${review.remove.length}`,
    `- Keep noindex: ${review.keep_noindex.length}`,
    `- Valid false positive, index allowed: ${review.allow_index.length}`,
    '',
    '## Rename',
    ...review.rename.map((item) => `- ${item.from} -> ${item.to}: ${item.note}`),
    '',
    '## Remove',
    ...review.remove.map((item) => `- ${item.from} -> redirect to ${item.to}: ${item.reason}`),
    '',
    '## Keep Noindex',
    ...review.keep_noindex.map((item) => `- ${item.slug}: ${item.reason}`),
    '',
    '## Valid False Positives',
    ...review.allow_index.map((item) => `- ${item.slug}: ${item.reason}`)
  ];

  fs.writeFileSync(reportPath, `${lines.join('\n')}\n`);
}

function main() {
  const redirects = [];
  const review = {
    generated_at: new Date().toISOString(),
    rename: [],
    remove: [],
    keep_noindex: [],
    allow_index: []
  };

  Object.entries(renamePages).forEach(([from, item]) => {
    if (movePage(from, item)) {
      redirects.push({
        source: `/city/${from}-solar-calculator/`,
        destination: `/city/${item.to}-solar-calculator/`,
        permanent: true
      });
    }
    review.rename.push({ from, to: item.to, note: `${item.fromText} -> ${item.toText}` });
  });

  Object.entries(removePages).forEach(([from, item]) => {
    removePage(from);
    redirects.push({
      source: `/city/${from}-solar-calculator/`,
      destination: `/city/${item.to}-solar-calculator/`,
      permanent: true
    });
    review.remove.push({ from, to: item.to, reason: item.reason });
  });

  Object.entries(keepNoindexPages).forEach(([slug, reason]) => {
    setRobots(slug, 'noindex,follow');
    review.keep_noindex.push({ slug, reason });
  });

  Object.entries(allowIndexPages).forEach(([slug, reason]) => {
    setRobots(slug, 'index,follow');
    review.allow_index.push({ slug, reason });
  });

  updateVercelRedirects(redirects);
  writeReviewReport(review);

  console.log(`Renamed: ${review.rename.length}`);
  console.log(`Removed: ${review.remove.length}`);
  console.log(`Kept noindex: ${review.keep_noindex.length}`);
  console.log(`Allowed index: ${review.allow_index.length}`);
  console.log(`Redirects ensured: ${redirects.length}`);
}

main();
