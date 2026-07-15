const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const repoRoot = path.join(root, '..');
const reviewPath = path.join(root, 'data', 'city-page-review.json');
const sitemapPath = path.join(root, 'sitemap.xml');
const reportPath = path.join(repoRoot, 'reports', 'city-migration-report.json');
const origin = 'https://pvsize.com';

function toCleanPath(slug) {
  return `/city/${slug}-solar-calculator/`;
}

async function checkRedirect(oldPath, expectedPath) {
  const response = await fetch(`${origin}${oldPath}`, { redirect: 'manual' });
  const status = response.status;
  const location = response.headers.get('location') || '';
  const normalizedLocation = location.startsWith('http') ? new URL(location).pathname : location;
  return {
    status,
    location: normalizedLocation,
    ok: [301, 308].includes(status) && normalizedLocation === expectedPath
  };
}

async function checkNewPage(newPath) {
  const response = await fetch(`${origin}${newPath}`, { redirect: 'manual' });
  const html = await response.text();
  const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)">/);
  const robotsMatch = html.match(/<meta name="robots" content="([^"]+)">/);
  const canonical = canonicalMatch ? canonicalMatch[1] : '';
  const robots = robotsMatch ? robotsMatch[1] : '';
  return {
    status: response.status,
    canonical,
    canonical_ok: canonical === `${origin}${newPath}`,
    robots,
    indexable: robots === 'index,follow'
  };
}

function loadMigrationItems() {
  const review = JSON.parse(fs.readFileSync(reviewPath, 'utf8'));
  return []
    .concat((review.rename || []).map((item) => ({ type: 'rename', from: item.from, to: item.to })))
    .concat((review.remove || []).map((item) => ({ type: 'remove', from: item.from, to: item.to })));
}

async function main() {
  const sitemap = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, 'utf8') : '';
  const rows = [];

  for (const item of loadMigrationItems()) {
    const oldPath = toCleanPath(item.from);
    const oldHtmlPath = oldPath.slice(0, -1) + '.html';
    const newPath = toCleanPath(item.to);
    const redirect = await checkRedirect(oldPath, newPath);
    const htmlRedirect = await checkRedirect(oldHtmlPath, newPath);
    const page = await checkNewPage(newPath);
    rows.push({
      type: item.type,
      old_url: `${origin}${oldPath}`,
      old_html_url: `${origin}${oldHtmlPath}`,
      new_url: `${origin}${newPath}`,
      old_status: redirect.status,
      redirect_location: redirect.location,
      redirect_ok: redirect.ok,
      old_html_status: htmlRedirect.status,
      old_html_redirect_location: htmlRedirect.location,
      old_html_redirect_ok: htmlRedirect.ok,
      new_status: page.status,
      canonical: page.canonical,
      canonical_ok: page.canonical_ok,
      robots: page.robots,
      old_in_sitemap: sitemap.includes(`${origin}${oldPath}`),
      new_in_sitemap: sitemap.includes(`${origin}${newPath}`),
      expected_in_sitemap: page.indexable,
      ok:
        redirect.ok &&
        htmlRedirect.ok &&
        page.status === 200 &&
        page.canonical_ok &&
        !sitemap.includes(`${origin}${oldPath}`) &&
        !sitemap.includes(`${origin}${oldHtmlPath}`) &&
        sitemap.includes(`${origin}${newPath}`) === page.indexable
    });
  }

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify({
    generated_at: new Date().toISOString(),
    totals: {
      checked: rows.length,
      ok: rows.filter((row) => row.ok).length,
      failed: rows.filter((row) => !row.ok).length
    },
    rows
  }, null, 2)}\n`);

  console.log(`Migration checks: ${rows.length}`);
  console.log(`OK: ${rows.filter((row) => row.ok).length}`);
  console.log(`Failed: ${rows.filter((row) => !row.ok).length}`);
  console.log(`Report: ${reportPath}`);
  if (rows.some((row) => !row.ok)) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
