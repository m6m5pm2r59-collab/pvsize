const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, '..', 'opportunities', 'index.html');
const html = fs.readFileSync(pagePath, 'utf8');
const detailPath = path.join(__dirname, '..', 'opportunities', 'usgs-communications-site-infrastructure-idiq', 'index.html');
const detailHtml = fs.readFileSync(detailPath, 'utf8');

const requiredMarkers = [
  '<meta name="robots" content="noindex,follow">',
  '<link rel="canonical" href="https://pvsize.com/opportunities/">',
  '<script src="/pv-analytics.js" defer></script>',
  'USGS Communications Site Infrastructure IDIQ',
  '178th Wing Base Microgrid Construction',
  'Solar with Wildlife and Ecosystem Benefits 2 (SolWEB2)',
  'Power Generation with Microgrid at Joint Base McGuire-Dix-Lakehurst',
  'U.S. Army 63rd Readiness Division MILCON ERCIP Microgrid',
  'href="/calculators/panel-count/"',
  'href="/calculators/battery-sizing/"',
  'href="/opportunities/usgs-communications-site-infrastructure-idiq/"',
];

const detailMarkers = [
  '<meta name="robots" content="noindex,follow">',
  '<link rel="canonical" href="https://pvsize.com/opportunities/usgs-communications-site-infrastructure-idiq/">',
  '<script src="/pv-analytics.js" defer></script>',
  'USGS Communications Site Infrastructure IDIQ',
  'href="/opportunities/"',
  'href="/calculators/panel-count/"',
  'href="/calculators/battery-sizing/"',
];

const internalEntryFiles = [
  path.join(__dirname, '..', 'index.html'),
  path.join(__dirname, '..', 'partners', 'index.html'),
];

const officialSourceUrls = [
  'https://sam.gov/opp/3e27febdf4b54d8594cec4e8fcc49ea3/view',
  'https://sam.gov/opp/c935ca4506e444b58b1a1a00d32d2b4a/view',
  'https://simpler.grants.gov/opportunity/8f684555-0665-425d-a840-28ade8965278',
  'https://sam.gov/opp/ffc3c8e97e2447be9ff7f43d21968af7/view',
  'https://sam.gov/workspace/contract/opp/15fc1555290e4c70bcbfadfff5faec65/view',
];

const errors = [];

requiredMarkers.forEach((marker) => {
  if (!html.includes(marker)) errors.push(`missing marker: ${marker}`);
});

detailMarkers.forEach((marker) => {
  if (!detailHtml.includes(marker)) errors.push(`detail page missing marker: ${marker}`);
});

officialSourceUrls.forEach((url) => {
  const linkMarker = `href="${url}" rel="nofollow noopener" target="_blank"`;
  if (!html.includes(linkMarker)) errors.push(`official source link missing nofollow/noopener: ${url}`);
});

const detailOfficialLink = 'href="https://sam.gov/opp/3e27febdf4b54d8594cec4e8fcc49ea3/view" rel="nofollow noopener" target="_blank"';
if (!detailHtml.includes(detailOfficialLink)) {
  errors.push('detail page official source link missing nofollow/noopener');
}

internalEntryFiles.forEach((filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('href="/opportunities/"')) {
    errors.push(`missing internal opportunities link: ${path.relative(path.join(__dirname, '..'), filePath)}`);
  }
});

const cardCount = (html.match(/<article class="opportunity-card">/g) || []).length;
if (cardCount !== 5) errors.push(`expected 5 opportunity cards, found ${cardCount}`);

if (html.includes('<script type="application/ld+json">')) {
  errors.push('structured data must not be added before Phase 5C SEO/schema verification');
}

if (detailHtml.includes('<script type="application/ld+json">')) {
  errors.push('detail structured data must not be added before Phase 5C SEO/schema verification');
}

if (errors.length) {
  console.error(`Opportunities page verification FAIL: ${errors.length} issue(s)`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('Opportunities page verification PASS: noindex listing/detail, 5 cards, official links, calculator links');
