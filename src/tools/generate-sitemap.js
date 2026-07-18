const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const { pages, sourcePath } = require('./indexable-pages');

const root = path.join(__dirname, '..');
const sitemapPath = path.join(root, 'sitemap.xml');

function realLastmod(page) {
  const file = sourcePath(root, page);
  if (!fs.existsSync(file)) {
    throw new Error(`Missing sitemap source: ${page.source}`);
  }

  try {
    const repoRoot = path.join(root, '..');
    const repoPath = path.join('src', page.source);
    const workingTreeStatus = childProcess.execFileSync(
      'git',
      ['status', '--porcelain', '--', repoPath],
      { cwd: repoRoot, encoding: 'utf8' }
    ).trim();
    if (workingTreeStatus) return fs.statSync(file).mtime.toISOString().slice(0, 10);

    const date = childProcess.execFileSync(
      'git',
      ['log', '-1', '--format=%cs', '--', repoPath],
      { cwd: repoRoot, encoding: 'utf8' }
    ).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  } catch (error) {
    // Fall back to the real file modification date outside a Git checkout.
  }

  return fs.statSync(file).mtime.toISOString().slice(0, 10);
}

function renderUrl(page) {
  return [
    '  <url>',
    `    <loc>${page.url}</loc>`,
    `    <lastmod>${realLastmod(page)}</lastmod>`,
    `    <changefreq>${page.changefreq}</changefreq>`,
    `    <priority>${page.priority}</priority>`,
    '  </url>'
  ].join('\n');
}

function main() {
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...pages.map(renderUrl),
    '</urlset>',
    ''
  ].join('\n');

  fs.writeFileSync(sitemapPath, xml);
  console.log(`Sitemap URLs: ${pages.length}`);
  console.log('City URLs included: 0 (explicit allowlist)');
}

main();
