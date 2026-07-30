const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const dataPath = path.join(rootDir, 'data', 'opportunities', 'opportunities.json');
const listingPath = path.join(rootDir, 'opportunities', 'index.html');
const records = JSON.parse(fs.readFileSync(dataPath, 'utf8')).records || [];
const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractMeta(content, name) {
  const pattern = new RegExp(`<meta name="${escapeRegExp(name)}" content="([^"]+)">`);
  const match = content.match(pattern);
  return match ? match[1] : '';
}

function verifyHtmlSeo({ canonical, descriptionPrefix, filePath, title }) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(rootDir, filePath);
  const description = extractMeta(content, 'description');

  assert(content.includes(`<title>${title}</title>`), `${relativePath} missing exact title`);
  assert(content.includes('<meta name="robots" content="noindex,follow">'), `${relativePath} must remain noindex`);
  assert(content.includes(`<link rel="canonical" href="${canonical}">`), `${relativePath} missing exact canonical`);
  assert(description.startsWith(descriptionPrefix), `${relativePath} description must start with approved prefix`);
  assert(description.length >= 50 && description.length <= 160, `${relativePath} description length must stay between 50 and 160 characters`);
  assert(!content.includes('<script type="application/ld+json">'), `${relativePath} must not include JSON-LD in SEO metadata task`);
  assert(!content.includes('<link rel="alternate" type="application/rss+xml"'), `${relativePath} must not include RSS alternate in SEO metadata task`);
  assert(!content.includes('<form'), `${relativePath} must not include newsletter form in SEO metadata task`);
}

verifyHtmlSeo({
  canonical: 'https://pvsize.com/opportunities/',
  descriptionPrefix: 'A verified, early-stage PVSize solar opportunities listing',
  filePath: listingPath,
  title: 'Solar Opportunities | PVSize',
});

records.forEach((record) => {
  verifyHtmlSeo({
    canonical: `https://pvsize.com/opportunities/${record.slug}/`,
    descriptionPrefix: `PVSize opportunity brief for ${record.title}`,
    filePath: path.join(rootDir, 'opportunities', record.slug, 'index.html'),
    title: `${record.title} | PVSize Opportunities`,
  });
});

records.forEach((record) => {
  assert(record.review_status !== 'published', `record must stay below published during SEO metadata verification: ${record.id}`);
});

if (errors.length) {
  console.error(`Opportunities SEO metadata verification FAIL: ${errors.length} issue(s)`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Opportunities SEO metadata verification PASS: listing + ${records.length} detail page(s)`);
