const fs = require('fs');
const path = require('path');
const { pages, siteOrigin, sourcePath } = require('./indexable-pages');

const root = path.join(__dirname, '..');
const sitemapPath = path.join(root, 'sitemap.xml');
const robotsPath = path.join(root, 'robots.txt');
const vercelPath = path.join(root, 'vercel.json');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') walk(file, files);
    else if (entry.name.endsWith('.html')) files.push(file);
  }
  return files;
}

function canonical(html) {
  const tag = (html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*>/i) || [])[0] || '';
  return (tag.match(/\bhref=["']([^"']+)["']/i) || [])[1] || '';
}

function robotsMeta(html) {
  const tag = (html.match(/<meta\b[^>]*\bname=["']robots["'][^>]*>/i) || [])[0] || '';
  return (tag.match(/\bcontent=["']([^"']+)["']/i) || [])[1] || '';
}

function locs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

function urlPathForFile(file) {
  const relative = path.relative(root, file).replace(/\\/g, '/');
  if (relative === 'index.html') return '/';
  if (relative.endsWith('/index.html')) return `/${relative.slice(0, -'index.html'.length)}`;
  if (relative.endsWith('.html')) return `/${relative.slice(0, -'.html'.length)}/`;
  return '';
}

function localFileForUrl(rawHref) {
  let pathname;
  try {
    pathname = new URL(rawHref, siteOrigin).pathname;
  } catch (error) {
    return null;
  }
  if (!pathname.startsWith('/')) return null;
  if (pathname === '/') return path.join(root, 'index.html');
  const clean = pathname.replace(/^\//, '').replace(/\/$/, '');
  const candidates = [
    path.join(root, clean, 'index.html'),
    path.join(root, `${clean}.html`),
    path.join(root, clean)
  ];
  return candidates.find((file) => fs.existsSync(file)) || null;
}

function internalLinks(html) {
  return [...html.matchAll(/\bhref=["']([^"']+)["']/gi)]
    .map((match) => match[1])
    .filter((href) => href.startsWith('/'))
    .filter((href) => !href.startsWith('//'));
}

function uniqueDuplicates(items) {
  return [...new Set(items.filter((item, index) => items.indexOf(item) !== index))];
}

function main() {
  const sitemap = read(sitemapPath);
  const sitemapUrls = locs(sitemap);
  const allowlistUrls = pages.map((page) => page.url);
  const vercel = JSON.parse(read(vercelPath));
  const redirects = new Map((vercel.redirects || []).map((item) => [item.source, item.destination]));
  const errors = [];
  const warnings = [];

  const robots = read(robotsPath);
  if (!/User-agent:\s*\*/i.test(robots) || !/Allow:\s*\//i.test(robots)) {
    errors.push('robots.txt does not explicitly allow normal crawling.');
  }
  if (!robots.includes('Sitemap: https://pvsize.com/sitemap.xml')) {
    errors.push('robots.txt does not advertise the production sitemap.');
  }

  for (const page of pages) {
    const file = sourcePath(root, page);
    if (!fs.existsSync(file)) {
      errors.push(`Missing allowlisted source: ${page.source}`);
      continue;
    }
    const html = read(file);
    const pageCanonical = canonical(html);
    const pageRobots = robotsMeta(html);
    if (/noindex/i.test(pageRobots)) errors.push(`Allowlisted page is noindex: ${page.urlPath}`);
    if (pageCanonical !== page.url) errors.push(`Canonical mismatch: ${page.urlPath} -> ${pageCanonical || '(missing)'}`);
  }

  for (const url of sitemapUrls) {
    if (!allowlistUrls.includes(url)) errors.push(`Sitemap URL is outside allowlist: ${url}`);
  }
  for (const url of allowlistUrls) {
    if (!sitemapUrls.includes(url)) errors.push(`Allowlisted URL missing from sitemap: ${url}`);
  }
  for (const duplicate of uniqueDuplicates(sitemapUrls)) errors.push(`Duplicate sitemap URL: ${duplicate}`);
  if (sitemapUrls.some((url) => url.includes('/city/'))) errors.push('City URL found in sitemap.');

  const allHtml = walk(root).filter((file) => !file.includes(`${path.sep}city${path.sep}`));
  const canonicalOwners = new Map();
  const cityEntryLinks = [];
  const brokenLinks = [];
  const indexableOutsideAllowlist = [];

  for (const file of allHtml) {
    const html = read(file);
    const pagePath = urlPathForFile(file);
    const pageCanonical = canonical(html);
    const pageRobots = robotsMeta(html);
    const isRedirectSource = redirects.has(pagePath) || redirects.has(pagePath.replace(/\/$/, '.html'));
    if (pageCanonical && !/noindex/i.test(pageRobots)) {
      const owners = canonicalOwners.get(pageCanonical) || [];
      owners.push(path.relative(root, file));
      canonicalOwners.set(pageCanonical, owners);
    }
    if (!/noindex/i.test(pageRobots) && !isRedirectSource && !pages.some((page) => page.source === path.relative(root, file).replace(/\\/g, '/'))) {
      indexableOutsideAllowlist.push(pagePath);
    }

    for (const href of internalLinks(html)) {
      const pathname = new URL(href, siteOrigin).pathname;
      if (pathname.startsWith('/city/')) cityEntryLinks.push(`${path.relative(root, file)} -> ${pathname}`);
      if (/\.(?:css|js|png|jpg|jpeg|webp|svg|ico|json|xml|txt|pdf)$/i.test(pathname)) continue;
      if (pathname.startsWith('/api/') || pathname.startsWith('/internal/')) continue;
      if (localFileForUrl(href)) continue;
      if (redirects.has(pathname) || redirects.has(pathname.replace(/\/$/, '.html'))) continue;
      brokenLinks.push(`${path.relative(root, file)} -> ${pathname}`);
    }
  }

  for (const [url, owners] of canonicalOwners.entries()) {
    const liveOwners = owners.filter((file) => {
      const pagePath = urlPathForFile(path.join(root, file));
      return !redirects.has(pagePath) && !redirects.has(pagePath.replace(/\/$/, '.html'));
    });
    if (liveOwners.length > 1) warnings.push(`Duplicate canonical ${url}: ${liveOwners.join(', ')}`);
  }

  if (cityEntryLinks.length) errors.push(...[...new Set(cityEntryLinks)].map((item) => `Old city entry link: ${item}`));
  if (brokenLinks.length) errors.push(...[...new Set(brokenLinks)].map((item) => `Broken internal link: ${item}`));
  if (indexableOutsideAllowlist.length) {
    warnings.push(`Indexable HTML outside sitemap allowlist: ${[...new Set(indexableOutsideAllowlist)].sort().join(', ')}`);
  }

  const result = {
    ok: errors.length === 0,
    sitemap_url_count: sitemapUrls.length,
    sitemap_city_url_count: sitemapUrls.filter((url) => url.includes('/city/')).length,
    allowlisted_page_count: pages.length,
    redirects_checked: redirects.size,
    noindex_html_count: allHtml.filter((file) => /noindex/i.test(robotsMeta(read(file)))).length,
    city_entry_link_count: cityEntryLinks.length,
    broken_internal_link_count: [...new Set(brokenLinks)].length,
    errors,
    warnings,
    sitemap_urls: sitemapUrls
  };

  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exitCode = 1;
}

main();
