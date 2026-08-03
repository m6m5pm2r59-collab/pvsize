const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const listingPath = path.join(rootDir, 'opportunities', 'index.html');
const opportunitiesPath = path.join(rootDir, 'data', 'opportunities', 'opportunities.json');
const listingHtml = fs.readFileSync(listingPath, 'utf8');
const records = JSON.parse(fs.readFileSync(opportunitiesPath, 'utf8')).records || [];

const calculatorMarkers = {
  'solar-panel-size': 'href="/calculators/panel-count/"',
  'solar-battery-size': 'href="/calculators/battery-sizing/"',
};

const errors = [];

function requireMarker(html, marker, context) {
  if (!html.includes(marker)) {
    errors.push(`${context} missing marker: ${marker}`);
  }
}

requireMarker(listingHtml, '<script src="/pv-analytics.js" defer></script>', 'listing');

records.forEach((record) => {
  requireMarker(listingHtml, `href="/opportunities/${record.slug}/"`, `listing ${record.id}`);
  requireMarker(
    listingHtml,
    `href="${record.official_source_url}" rel="nofollow noopener" target="_blank"`,
    `listing ${record.id}`
  );

  (record.related_calculators || []).forEach((calculatorId) => {
    const marker = calculatorMarkers[calculatorId];
    if (marker) requireMarker(listingHtml, marker, `listing ${record.id}`);
  });

  const detailPath = path.join(rootDir, 'opportunities', record.slug, 'index.html');
  const detailHtml = fs.readFileSync(detailPath, 'utf8');
  requireMarker(detailHtml, '<script src="/pv-analytics.js" defer></script>', `detail ${record.id}`);
  requireMarker(detailHtml, 'href="/opportunities/"', `detail ${record.id}`);
  requireMarker(
    detailHtml,
    `href="${record.official_source_url}" rel="nofollow noopener" target="_blank"`,
    `detail ${record.id}`
  );

  (record.related_calculators || []).forEach((calculatorId) => {
    const marker = calculatorMarkers[calculatorId];
    if (marker) requireMarker(detailHtml, marker, `detail ${record.id}`);
  });
});

if (errors.length) {
  console.error(`Opportunities analytics/CTA verification FAIL: ${errors.length} issue(s)`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Opportunities analytics/CTA verification PASS: listing + ${records.length} detail page(s)`);
