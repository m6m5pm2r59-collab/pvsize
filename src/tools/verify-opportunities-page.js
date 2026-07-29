const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, '..', 'opportunities', 'index.html');
const html = fs.readFileSync(pagePath, 'utf8');
const opportunitiesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'data', 'opportunities', 'opportunities.json'), 'utf8')
);
const records = opportunitiesData.records || [];
const generatorPath = path.join(__dirname, 'generate-opportunity-detail-pages.js');
const detailSlugs = [
  'usgs-communications-site-infrastructure-idiq',
  '178th-wing-base-microgrid-construction',
];

const requiredMarkers = [
  '<meta name="robots" content="noindex,follow">',
  '<link rel="canonical" href="https://pvsize.com/opportunities/">',
  '<script src="/pv-analytics.js" defer></script>',
  'href="/calculators/panel-count/"',
  'href="/calculators/battery-sizing/"',
  'href="/opportunities/usgs-communications-site-infrastructure-idiq/"',
  'href="/opportunities/178th-wing-base-microgrid-construction/"',
];

const internalEntryFiles = [
  path.join(__dirname, '..', 'index.html'),
  path.join(__dirname, '..', 'partners', 'index.html'),
];

const errors = [];

requiredMarkers.forEach((marker) => {
  if (!html.includes(marker)) errors.push(`missing marker: ${marker}`);
});

if (!fs.existsSync(generatorPath)) {
  errors.push('missing reusable detail page generator');
}

records.forEach((record) => {
  if (!html.includes(record.title)) errors.push(`listing missing opportunity title: ${record.id}`);
  if (!html.includes(record.official_source_url)) errors.push(`listing missing official source URL: ${record.id}`);
});

records.map((record) => record.official_source_url).forEach((url) => {
  const linkMarker = `href="${url}" rel="nofollow noopener" target="_blank"`;
  if (!html.includes(linkMarker)) errors.push(`official source link missing nofollow/noopener: ${url}`);
});

detailSlugs.forEach((slug) => {
  const record = records.find((item) => item.slug === slug);
  const detailPath = path.join(__dirname, '..', 'opportunities', slug, 'index.html');
  const detailHtml = fs.readFileSync(detailPath, 'utf8');
  const detailMarkers = [
    '<meta name="robots" content="noindex,follow">',
    `<link rel="canonical" href="https://pvsize.com/opportunities/${slug}/">`,
    '<script src="/pv-analytics.js" defer></script>',
    record.title,
    'href="/opportunities/"',
    'href="/calculators/panel-count/"',
    'href="/calculators/battery-sizing/"',
    `href="${record.official_source_url}" rel="nofollow noopener" target="_blank"`,
  ];

  detailMarkers.forEach((marker) => {
    if (!detailHtml.includes(marker)) errors.push(`detail ${slug} missing marker: ${marker}`);
  });

  if (detailHtml.includes('<script type="application/ld+json">')) {
    errors.push(`detail ${slug} structured data must not be added before Phase 5C SEO/schema verification`);
  }
});

internalEntryFiles.forEach((filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('href="/opportunities/"')) {
    errors.push(`missing internal opportunities link: ${path.relative(path.join(__dirname, '..'), filePath)}`);
  }
});

const cardCount = (html.match(/<article class="opportunity-card">/g) || []).length;
if (cardCount !== records.length) errors.push(`expected ${records.length} opportunity cards, found ${cardCount}`);

if (html.includes('<script type="application/ld+json">')) {
  errors.push('structured data must not be added before Phase 5C SEO/schema verification');
}

if (errors.length) {
  console.error(`Opportunities page verification FAIL: ${errors.length} issue(s)`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Opportunities page verification PASS: noindex listing/${detailSlugs.length} details, ${records.length} cards, official links, calculator links`);
