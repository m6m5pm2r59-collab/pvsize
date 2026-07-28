const fs = require('fs');
const path = require('path');

const CITY_SUFFIX = '-solar-calculator.html';

const pilotSlugs = [
  'san-diego',
  'phoenix',
  'miami',
  'sydney',
  'berlin',
];

function sourceFromSlug(slug) {
  return `city-${slug}`;
}

function stylesheetTag() {
  return '<link rel="stylesheet" href="/city-pages.css">';
}

function renderCityPathStrip(slug) {
  const source = sourceFromSlug(slug);
  return [
    '<div class="hint">',
    '  <strong>Best next move:</strong> start with panel count, then compare savings, then check battery sizing only if backup matters.',
    '</div>',
    '',
    '<div class="path-grid">',
    `  <div class="path-card"><strong>Panel count first</strong><a href="/calculators/panel-count/?source=${source}">Open the panel-count calculator</a></div>`,
    `  <div class="path-card"><strong>Savings next</strong><a href="/calculators/savings/?source=${source}">Compare the bill impact</a></div>`,
    `  <div class="path-card"><strong>Battery later</strong><a href="/calculators/battery-sizing/?source=${source}">Check backup sizing after fit</a></div>`,
    '</div>',
  ].join('\n');
}

function cityFilePath(root, slug) {
  return path.join(root, 'city', `${slug}${CITY_SUFFIX}`);
}

function insertCityPathStrip(html, slug) {
  let nextHtml = html;
  let changed = false;
  const tag = stylesheetTag();

  if (!nextHtml.includes(tag)) {
    nextHtml = nextHtml.replace('</head>', `${tag}\n</head>`);
    changed = true;
  }

  const strip = renderCityPathStrip(slug);
  if (nextHtml.includes(strip)) {
    return { html: nextHtml, changed };
  }

  const leadPattern = /(<p class="lead">[\s\S]*?<\/p>\n\n)(?:<div class="hint">[\s\S]*?<div class="path-grid">[\s\S]*?<\/div>\n\n)?/;
  if (leadPattern.test(nextHtml)) {
    nextHtml = nextHtml.replace(leadPattern, `$1${strip}\n\n`);
    return { html: nextHtml, changed: true };
  }

  const introPattern = /(<p>Use this page as a planning estimate[\s\S]*?<\/p>\n\n)/;
  if (introPattern.test(nextHtml)) {
    nextHtml = nextHtml.replace('<p>Use this page as a planning estimate', '<p class="lead">Use this page as a planning estimate');
    nextHtml = nextHtml.replace(introPattern, `$1${strip}\n\n`);
    return { html: nextHtml, changed: true };
  }

  return { html: nextHtml, changed, error: 'could not find city intro paragraph' };
}

function verifyCityPathStrip(root, slug) {
  const filePath = cityFilePath(root, slug);
  const html = fs.readFileSync(filePath, 'utf8');
  const expected = renderCityPathStrip(slug);
  const errors = [];

  if (!html.includes(stylesheetTag())) {
    errors.push('missing shared city stylesheet');
  }

  if (!html.includes(expected)) {
    errors.push('path strip does not match the shared template');
  }

  return { filePath, slug, errors };
}

module.exports = {
  insertCityPathStrip,
  pilotSlugs,
  renderCityPathStrip,
  sourceFromSlug,
  stylesheetTag,
  verifyCityPathStrip,
};
