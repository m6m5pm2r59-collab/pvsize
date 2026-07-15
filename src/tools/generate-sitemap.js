const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const cityDir = path.join(root, 'city');
const sitemapPath = path.join(root, 'sitemap.xml');
const siteOrigin = 'https://pvsize.com';
const lastmod = '2026-07-15';

const fixedUrls = [
  ['/', 'weekly', '1.0'],
  ['/calculators/', 'weekly', '0.9'],
  ['/calculators/panel-count/', 'weekly', '0.9'],
  ['/calculators/savings/', 'weekly', '0.9'],
  ['/calculators/battery-sizing/', 'weekly', '0.9'],
  ['/calculators/carbon/', 'weekly', '0.9'],
  ['/request-solar-plan/', 'weekly', '0.8'],
  ['/contact/', 'weekly', '0.8'],
  ['/learn/', 'weekly', '0.8'],
  ['/learn/how-many-solar-panels-for-2000-sq-ft-house/', 'weekly', '0.8'],
  ['/learn/how-many-solar-panels-for-1500-sq-ft-house/', 'weekly', '0.8'],
  ['/learn/how-many-solar-panels-to-run-a-refrigerator/', 'weekly', '0.8'],
  ['/learn/how-much-can-i-save-with-solar-panels/', 'weekly', '0.8'],
  ['/learn/what-size-solar-battery-do-i-need-for-my-home/', 'weekly', '0.8'],
  ['/learn/is-solar-worth-it-in-texas/', 'weekly', '0.8'],
  ['/learn/how-many-solar-panels-for-1000-kwh-per-month/', 'weekly', '0.8'],
  ['/learn/how-many-solar-panels-for-1500-kwh-per-month/', 'weekly', '0.8'],
  ['/learn/solar-payback-period-calculator-guide/', 'weekly', '0.8'],
  ['/learn/solar-battery-backup-for-power-outage/', 'weekly', '0.8'],
  ['/learn/solar-panels-for-2500-sq-ft-house/', 'weekly', '0.8'],
  ['/learn/solar-panels-for-ev-charging-at-home/', 'weekly', '0.8'],
  ['/learn/solar-panels-for-500-kwh-per-month/', 'weekly', '0.8'],
  ['/learn/solar-panels-for-2000-kwh-per-month/', 'weekly', '0.8'],
  ['/learn/solar-system-size-for-home/', 'weekly', '0.8'],
  ['/learn/off-grid-solar-system-sizing-guide/', 'weekly', '0.8'],
  ['/learn/solar-panels-for-air-conditioner/', 'weekly', '0.8'],
  ['/learn/solar-panels-for-heat-pump/', 'weekly', '0.8'],
  ['/learn/solar-panel-cost-calculator-guide/', 'weekly', '0.8'],
  ['/learn/solar-calculator-for-cloudy-climate/', 'weekly', '0.8'],
  ['/learn/solar-panels-for-remote-cabin/', 'weekly', '0.8'],
  ['/learn/solar-panels-for-water-pump/', 'weekly', '0.8'],
  ['/about/', 'weekly', '0.8'],
  ['/editorial-policy/', 'weekly', '0.8'],
  ['/privacy/', 'weekly', '0.8'],
  ['/terms/', 'weekly', '0.8'],
  ['/sponsored-disclosure/', 'weekly', '0.8']
];

function isIndexableCityPage(file) {
  const html = fs.readFileSync(path.join(cityDir, file), 'utf8');
  return html.includes('<meta name="robots" content="index,follow">');
}

function cityUrls() {
  return fs
    .readdirSync(cityDir)
    .filter((file) => file.endsWith('-solar-calculator.html'))
    .filter(isIndexableCityPage)
    .sort()
    .map((file) => {
      const slug = file.replace(/\.html$/, '');
      return [`/city/${slug}/`, 'monthly', '0.6'];
    });
}

function renderUrl([url, changefreq, priority]) {
  return [
    '  <url>',
    `    <loc>${siteOrigin}${url}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>'
  ].join('\n');
}

function main() {
  const urls = fixedUrls.concat(cityUrls());
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(renderUrl),
    '</urlset>',
    ''
  ].join('\n');

  fs.writeFileSync(sitemapPath, xml);
  console.log(`Sitemap URLs: ${urls.length}`);
  console.log(`City URLs included: ${urls.length - fixedUrls.length}`);
}

main();
