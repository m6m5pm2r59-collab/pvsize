const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, '..', 'opportunities', 'index.html');
const html = fs.readFileSync(pagePath, 'utf8');
const opportunitiesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'data', 'opportunities', 'opportunities.json'), 'utf8')
);
const records = opportunitiesData.records || [];
const generatorPath = path.join(__dirname, 'generate-opportunity-detail-pages.js');
const httpVerifierPath = path.join(__dirname, 'verify-opportunities-http.js');
const analyticsCtaVerifierPath = path.join(__dirname, 'verify-opportunities-analytics-cta.js');
const indexPolicyVerifierPath = path.join(__dirname, 'verify-opportunities-index-policy.js');
const indexedReadinessVerifierPath = path.join(__dirname, 'verify-opportunities-indexed-readiness.js');
const seoMetadataVerifierPath = path.join(__dirname, 'verify-opportunities-seo-metadata.js');
const structuredDataRulesVerifierPath = path.join(__dirname, 'verify-opportunities-structured-data-rules.js');
const sitemapRssRulesVerifierPath = path.join(__dirname, 'verify-opportunities-sitemap-rss-rules.js');
const newsletterRulesVerifierPath = path.join(__dirname, 'verify-opportunities-newsletter-rules.js');
const aggregateVerifierPath = path.join(__dirname, 'verify-opportunities-all.js');
const productionNoindexVerifierPath = path.join(__dirname, 'verify-opportunities-production-noindex.js');
const detailSlugs = [
  'usgs-communications-site-infrastructure-idiq',
  '178th-wing-base-microgrid-construction',
  'jbmdl-power-generation-microgrid-construction',
  '63rd-readiness-division-milcon-ercip-microgrid',
  'solar-with-wildlife-and-ecosystem-benefits-2-solweb2',
];

const requiredMarkers = [
  '<meta name="robots" content="noindex,follow">',
  '<link rel="canonical" href="https://pvsize.com/opportunities/">',
  '<script src="/pv-analytics.js" defer></script>',
  'href="/calculators/panel-count/"',
  'href="/calculators/battery-sizing/"',
  'href="/opportunities/usgs-communications-site-infrastructure-idiq/"',
  'href="/opportunities/178th-wing-base-microgrid-construction/"',
  'href="/opportunities/jbmdl-power-generation-microgrid-construction/"',
  'href="/opportunities/63rd-readiness-division-milcon-ercip-microgrid/"',
  'href="/opportunities/solar-with-wildlife-and-ecosystem-benefits-2-solweb2/"',
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

if (!fs.existsSync(httpVerifierPath)) {
  errors.push('missing repeatable HTTP QA verifier');
}

if (!fs.existsSync(analyticsCtaVerifierPath)) {
  errors.push('missing analytics/CTA marker verifier');
}

if (!fs.existsSync(indexPolicyVerifierPath)) {
  errors.push('missing index-policy verifier');
}
if (!fs.existsSync(indexedReadinessVerifierPath)) {
  errors.push('missing indexed-readiness verifier');
}
if (!fs.existsSync(seoMetadataVerifierPath)) {
  errors.push('missing SEO metadata verifier');
}
if (!fs.existsSync(structuredDataRulesVerifierPath)) {
  errors.push('missing structured-data rules verifier');
}
if (!fs.existsSync(sitemapRssRulesVerifierPath)) {
  errors.push('missing sitemap/RSS rules verifier');
}
if (!fs.existsSync(newsletterRulesVerifierPath)) {
  errors.push('missing newsletter rules verifier');
}

if (!fs.existsSync(aggregateVerifierPath)) {
  errors.push('missing aggregate opportunities QA verifier');
}
if (!fs.existsSync(productionNoindexVerifierPath)) {
  errors.push('missing production noindex opportunities verifier');
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
  const calculatorMarkers = {
    'solar-panel-size': 'href="/calculators/panel-count/"',
    'solar-battery-size': 'href="/calculators/battery-sizing/"',
  };
  const detailMarkers = [
    '<meta name="robots" content="noindex,follow">',
    `<link rel="canonical" href="https://pvsize.com/opportunities/${slug}/">`,
    '<script src="/pv-analytics.js" defer></script>',
    record.title,
    'href="/opportunities/"',
    `href="${record.official_source_url}" rel="nofollow noopener" target="_blank"`,
    ...(record.related_calculators || []).map((id) => calculatorMarkers[id]).filter(Boolean),
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
