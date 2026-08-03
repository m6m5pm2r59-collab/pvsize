const path = require('path');

const siteOrigin = 'https://pvsize.com';

const pages = [
  ['/', 'index.html', 'weekly', '1.0'],
  ['/calculators/', 'calculators/index.html', 'weekly', '0.9'],
  ['/calculators/panel-count/', 'calculators/panel-count/index.html', 'weekly', '0.9'],
  ['/calculators/savings/', 'calculators/savings/index.html', 'weekly', '0.9'],
  ['/calculators/battery-sizing/', 'calculators/battery-sizing/index.html', 'weekly', '0.9'],
  ['/calculators/carbon/', 'calculators/carbon/index.html', 'monthly', '0.6'],
  ['/data/monthly-electricity-usage-solar-panel-count/', 'data/monthly-electricity-usage-solar-panel-count/index.html', 'monthly', '0.9'],
  ['/guides/solar-panels-for-1000-kwh-per-month/', 'guides/solar-panels-for-1000-kwh-per-month/index.html', 'monthly', '0.9'],
  ['/guides/battery-size-for-8-hour-outage/', 'guides/battery-size-for-8-hour-outage/index.html', 'monthly', '0.9'],
  ['/guides/solar-system-size-for-home-ev-charging/', 'guides/solar-system-size-for-home-ev-charging/index.html', 'monthly', '0.9'],
  ['/guides/5kw-vs-10kw-solar-system/', 'guides/5kw-vs-10kw-solar-system/index.html', 'monthly', '0.9'],
  ['/examples/1500-kwh-per-month-solar-panels/', 'examples/1500-kwh-per-month-solar-panels/index.html', 'monthly', '0.8'],
  ['/examples/overnight-home-battery-backup/', 'examples/overnight-home-battery-backup/index.html', 'monthly', '0.8'],
  ['/examples/off-grid-cabin-8-kwh-day/', 'examples/off-grid-cabin-8-kwh-day/index.html', 'monthly', '0.8'],
  ['/technical-feedback/', 'technical-feedback/index.html', 'monthly', '0.8'],
  ['/embed/', 'embed/index.html', 'monthly', '0.7'],
  ['/request-solar-plan/', 'request-solar-plan/index.html', 'monthly', '0.8'],
  ['/contact/', 'contact/index.html', 'monthly', '0.7'],
  ['/learn/', 'learn/index.html', 'weekly', '0.8'],
  ['/learn/how-many-solar-panels-for-2000-sq-ft-house/', 'learn/how-many-solar-panels-for-2000-sq-ft-house.html', 'monthly', '0.7'],
  ['/learn/how-many-solar-panels-for-1500-sq-ft-house/', 'learn/how-many-solar-panels-for-1500-sq-ft-house.html', 'monthly', '0.7'],
  ['/learn/how-many-solar-panels-to-run-a-refrigerator/', 'learn/how-many-solar-panels-to-run-a-refrigerator.html', 'monthly', '0.7'],
  ['/learn/how-much-can-i-save-with-solar-panels/', 'learn/how-much-can-i-save-with-solar-panels.html', 'monthly', '0.7'],
  ['/learn/what-size-solar-battery-do-i-need-for-my-home/', 'learn/what-size-solar-battery-do-i-need-for-my-home.html', 'monthly', '0.7'],
  ['/learn/is-solar-worth-it-in-texas/', 'learn/is-solar-worth-it-in-texas.html', 'monthly', '0.7'],
  ['/learn/how-many-solar-panels-for-1500-kwh-per-month/', 'learn/how-many-solar-panels-for-1500-kwh-per-month.html', 'monthly', '0.7'],
  ['/learn/solar-payback-period-calculator-guide/', 'learn/solar-payback-period-calculator-guide.html', 'monthly', '0.7'],
  ['/learn/solar-battery-backup-for-power-outage/', 'learn/solar-battery-backup-for-power-outage.html', 'monthly', '0.7'],
  ['/learn/solar-panels-for-2500-sq-ft-house/', 'learn/solar-panels-for-2500-sq-ft-house.html', 'monthly', '0.7'],
  ['/learn/solar-panels-for-500-kwh-per-month/', 'learn/solar-panels-for-500-kwh-per-month.html', 'monthly', '0.7'],
  ['/learn/solar-panels-for-2000-kwh-per-month/', 'learn/solar-panels-for-2000-kwh-per-month.html', 'monthly', '0.7'],
  ['/learn/solar-system-size-for-home/', 'learn/solar-system-size-for-home.html', 'monthly', '0.7'],
  ['/learn/off-grid-solar-system-sizing-guide/', 'learn/off-grid-solar-system-sizing-guide.html', 'monthly', '0.7'],
  ['/learn/solar-panels-for-air-conditioner/', 'learn/solar-panels-for-air-conditioner.html', 'monthly', '0.7'],
  ['/learn/solar-panels-for-heat-pump/', 'learn/solar-panels-for-heat-pump.html', 'monthly', '0.7'],
  ['/learn/solar-panel-cost-calculator-guide/', 'learn/solar-panel-cost-calculator-guide.html', 'monthly', '0.7'],
  ['/learn/solar-calculator-for-cloudy-climate/', 'learn/solar-calculator-for-cloudy-climate.html', 'monthly', '0.7'],
  ['/learn/solar-panels-for-remote-cabin/', 'learn/solar-panels-for-remote-cabin.html', 'monthly', '0.7'],
  ['/learn/solar-panels-for-water-pump/', 'learn/solar-panels-for-water-pump.html', 'monthly', '0.7'],
  ['/about/', 'about/index.html', 'yearly', '0.5'],
  ['/editorial-policy/', 'editorial-policy/index.html', 'yearly', '0.5'],
  ['/privacy/', 'privacy/index.html', 'yearly', '0.4'],
  ['/terms/', 'terms/index.html', 'yearly', '0.4'],
  ['/sponsored-disclosure/', 'sponsored-disclosure/index.html', 'yearly', '0.4']
].map(([urlPath, source, changefreq, priority]) => ({
  urlPath,
  source,
  changefreq,
  priority,
  url: `${siteOrigin}${urlPath}`
}));

function sourcePath(root, page) {
  return path.join(root, page.source);
}

module.exports = { pages, siteOrigin, sourcePath };
