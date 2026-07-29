const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const dataPath = path.join(rootDir, 'data', 'opportunities', 'opportunities.json');
const sitemapPath = path.join(rootDir, 'sitemap.xml');
const robotsPath = path.join(rootDir, 'robots.txt');
const listingPath = path.join(rootDir, 'opportunities', 'index.html');
const records = JSON.parse(fs.readFileSync(dataPath, 'utf8')).records || [];
const sitemap = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, 'utf8') : '';
const robots = fs.existsSync(robotsPath) ? fs.readFileSync(robotsPath, 'utf8') : '';
const errors = [];

const opportunityUrls = [
  'https://pvsize.com/opportunities/',
  ...records.map((record) => `https://pvsize.com/opportunities/${record.slug}/`),
];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

function validateIndexPolicy(context) {
  const {
    detailHtmlBySlug,
    feedByPath,
    records,
    sitemap,
  } = context;

  const opportunityUrls = [
    'https://pvsize.com/opportunities/',
    ...records.map((record) => `https://pvsize.com/opportunities/${record.slug}/`),
  ];

  opportunityUrls.forEach((url, index) => {
    assert(!sitemap.includes(url), `opportunity URL must not be in sitemap before production QA: ${url}`);
    if (sitemap.includes(url) && index > 0) {
      const record = records[index - 1];
      assert(record.review_status === 'published', `sitemap opportunity must be published: ${record.id}`);
    }
  });

  records.forEach((record) => {
    const html = detailHtmlBySlug[record.slug] || '';
    const detailUrl = `https://pvsize.com/opportunities/${record.slug}/`;

    if (html.includes('<script type="application/ld+json">')) {
      assert(record.review_status === 'published', `schema opportunity must be published: ${record.id}`);
    }
    if (html.includes('<link rel="alternate" type="application/rss+xml"') || sitemap.includes(detailUrl)) {
      assert(record.review_status === 'published', `indexable opportunity must be published: ${record.id}`);
    }

    Object.values(feedByPath).forEach((feed) => {
      if (feed.includes(detailUrl) || feed.includes(`/opportunities/${record.slug}/`)) {
        assert(record.review_status === 'published', `RSS opportunity must be published: ${record.id}`);
      }
    });
  });
}

function runSelfTest() {
  const record = records[0];
  const before = errors.length;
  const detailUrl = `https://pvsize.com/opportunities/${record.slug}/`;
  const fixtureDetailHtml = '<script type="application/ld+json">{"@type":"Event"}</script>';
  const fixtureFeed = `<item><link>${detailUrl}</link></item>`;

  validateIndexPolicy({
    detailHtmlBySlug: {
      [record.slug]: fixtureDetailHtml,
    },
    feedByPath: {
      'fixture.rss': fixtureFeed,
    },
    records: [record],
    sitemap: `<url><loc>${detailUrl}</loc></url>`,
  });

  const selfTestErrors = errors.slice(before);
  const expected = [
    'opportunity URL must not be in sitemap before production QA',
    'sitemap opportunity must be published',
    'schema opportunity must be published',
    'indexable opportunity must be published',
    'RSS opportunity must be published',
  ];

  expected.forEach((marker) => {
    if (!selfTestErrors.some((error) => error.includes(marker))) {
      console.error(`Self-test FAIL: missing ${marker}`);
      process.exit(1);
    }
  });

  errors.splice(before);
  console.log('Self-test PASS: non-published opportunity in sitemap/schema/RSS');
}

assert(records.length > 0, 'expected at least one opportunity record');
assert(fs.existsSync(listingPath), 'missing opportunities listing page');
assert(robots.includes('Sitemap: https://pvsize.com/sitemap.xml'), 'robots.txt must keep sitemap pointer');

records.forEach((record) => {
  assert(record.review_status !== 'published', `record must not be published before production QA: ${record.id}`);
});

[
  listingPath,
  ...records.map((record) => path.join(rootDir, 'opportunities', record.slug, 'index.html')),
].forEach((filePath) => {
  const html = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(rootDir, filePath);
  assert(html.includes('<meta name="robots" content="noindex,follow">'), `${relativePath} must stay noindex`);
  assert(!html.includes('<script type="application/ld+json">'), `${relativePath} must not include JSON-LD before schema QA`);
  assert(!html.includes('<link rel="alternate" type="application/rss+xml"'), `${relativePath} must not expose RSS before feed QA`);
});

const rssCandidates = [
  path.join(rootDir, 'opportunities.xml'),
  path.join(rootDir, 'opportunities.rss'),
  path.join(rootDir, 'opportunities', 'feed.xml'),
  path.join(rootDir, 'opportunities', 'rss.xml'),
];

const feedByPath = {};
rssCandidates.forEach((filePath) => {
  assert(!fs.existsSync(filePath), `RSS file must not exist before feed QA: ${path.relative(rootDir, filePath)}`);
  if (fs.existsSync(filePath)) {
    feedByPath[filePath] = fs.readFileSync(filePath, 'utf8');
  }
});

const detailHtmlBySlug = {};
records.forEach((record) => {
  const detailPath = path.join(rootDir, 'opportunities', record.slug, 'index.html');
  detailHtmlBySlug[record.slug] = fs.readFileSync(detailPath, 'utf8');
});

validateIndexPolicy({
  detailHtmlBySlug,
  feedByPath,
  records,
  sitemap,
});

if (process.argv.includes('--self-test')) {
  runSelfTest();
}

if (errors.length) {
  console.error(`Opportunities index-policy verification FAIL: ${errors.length} issue(s)`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Opportunities index-policy verification PASS: ${opportunityUrls.length} URL(s) remain noindex and out of sitemap/RSS/schema`);
