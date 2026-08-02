const { spawnSync } = require('child_process');

const steps = [
  ['Data validator', ['src/tools/validate-opportunities.js', '--self-test'], {}],
  ['Detail generator', ['src/tools/generate-opportunity-detail-pages.js'], {}],
  ['SEO metadata verification', ['src/tools/verify-opportunities-seo-metadata.js'], {}],
  ['Structured data rules verification', ['src/tools/verify-opportunities-structured-data-rules.js', '--self-test'], {}],
  ['Sitemap/RSS rules verification', ['src/tools/verify-opportunities-sitemap-rss-rules.js', '--self-test'], {}],
  ['Newsletter rules verification', ['src/tools/verify-opportunities-newsletter-rules.js', '--self-test'], {}],
  ['Production QA readiness verification', ['src/tools/verify-opportunities-production-qa-readiness.js', '--self-test'], {}],
  ['Production QA execution checklist verification', ['src/tools/verify-opportunities-production-qa-execution-checklist.js', '--self-test'], {}],
  ['Indexed release fallback checklist verification', ['src/tools/verify-opportunities-indexed-release-fallback-checklist.js', '--self-test'], {}],
  ['Indexed release archive closure checklist verification', ['src/tools/verify-opportunities-indexed-release-archive-closure-checklist.js', '--self-test'], {}],
  ['Production QA artifact index verification', ['src/tools/verify-opportunities-production-qa-artifact-index.js', '--self-test'], {}],
  ['Production QA handoff checklist verification', ['src/tools/verify-opportunities-production-qa-handoff-checklist.js', '--self-test'], {}],
  ['Production QA run manifest verification', ['src/tools/verify-opportunities-production-qa-run-manifest.js', '--self-test'], {}],
  ['Production QA evidence bundle checklist verification', ['src/tools/verify-opportunities-production-qa-evidence-bundle-checklist.js', '--self-test'], {}],
  ['Production QA signoff checklist verification', ['src/tools/verify-opportunities-production-qa-signoff-checklist.js', '--self-test'], {}],
  ['Production QA decision log template verification', ['src/tools/verify-opportunities-production-qa-decision-log-template.js', '--self-test'], {}],
  ['Production QA go/no-go criteria verification', ['src/tools/verify-opportunities-production-qa-go-no-go-criteria.js', '--self-test'], {}],
  ['Production QA release notes template verification', ['src/tools/verify-opportunities-production-qa-release-notes-template.js', '--self-test'], {}],
  ['Production QA monitoring handoff verification', ['src/tools/verify-opportunities-production-qa-monitoring-handoff-checklist.js', '--self-test'], {}],
  ['Production QA post-release watch verification', ['src/tools/verify-opportunities-production-qa-post-release-watch-checklist.js', '--self-test'], {}],
  ['Production QA search indexing hold verification', ['src/tools/verify-opportunities-production-qa-search-indexing-request-hold-checklist.js', '--self-test'], {}],
  ['Page verification', ['src/tools/verify-opportunities-page.js'], {}],
  ['Indexed readiness verification', ['src/tools/verify-opportunities-indexed-readiness.js'], {}],
  ['Index policy verification', ['src/tools/verify-opportunities-index-policy.js', '--self-test'], {}],
  ['Analytics CTA verification', ['src/tools/verify-opportunities-analytics-cta.js'], {}],
  ['HTTP verification', ['src/tools/verify-opportunities-http.js'], {}],
];

if (process.env.PVSIZE_VERIFY_PRODUCTION === '1') {
  steps.push(['Production noindex verification', ['src/tools/verify-opportunities-production-noindex.js'], {}]);
}

steps.forEach(([label, args, options]) => {
  console.log(`\n== ${label} ==`);
  const result = spawnSync('node', args, {
    cwd: process.cwd(),
    stdio: 'inherit',
    ...options,
  });

  if (result.status !== 0) {
    console.error(`Opportunities aggregate QA FAIL: ${label}`);
    process.exit(result.status || 1);
  }
});

console.log('\nOpportunities aggregate QA PASS');
