const path = require('path');
const { spawnSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');

const steps = [
  ['Data validator', [path.join(PROJECT_ROOT, 'tools/validate-opportunities.js'), '--self-test'], {}],
  ['Detail generator', [path.join(PROJECT_ROOT, 'tools/generate-opportunity-detail-pages.js')], {}],
  ['SEO metadata verification', [path.join(PROJECT_ROOT, 'tools/verify-opportunities-seo-metadata.js')], {}],
  ['Structured data rules verification', [path.join(PROJECT_ROOT, 'tools/verify-opportunities-structured-data-rules.js'), '--self-test'], {}],
  ['Sitemap/RSS rules verification', [path.join(PROJECT_ROOT, 'tools/verify-opportunities-sitemap-rss-rules.js'), '--self-test'], {}],
  ['Newsletter rules verification', [path.join(PROJECT_ROOT, 'tools/verify-opportunities-newsletter-rules.js'), '--self-test'], {}],
  ['Production QA readiness verification', [path.join(PROJECT_ROOT, 'tools/verify-opportunities-production-qa-readiness.js'), '--self-test'], {}],
  ['Production QA execution checklist verification', [path.join(PROJECT_ROOT, 'tools/verify-opportunities-production-qa-execution-checklist.js'), '--self-test'], {}],
  ['Indexed release fallback checklist verification', [path.join(PROJECT_ROOT, 'tools/verify-opportunities-indexed-release-fallback-checklist.js'), '--self-test'], {}],
  ['Indexed release archive closure checklist verification', [path.join(PROJECT_ROOT, 'tools/verify-opportunities-indexed-release-archive-closure-checklist.js'), '--self-test'], {}],
  ['Production QA artifact index verification', [path.join(PROJECT_ROOT, 'tools/verify-opportunities-production-qa-artifact-index.js'), '--self-test'], {}],
  ['Production QA handoff checklist verification', [path.join(PROJECT_ROOT, 'tools/verify-opportunities-production-qa-handoff-checklist.js'), '--self-test'], {}],
  ['Production QA run manifest verification', [path.join(PROJECT_ROOT, 'tools/verify-opportunities-production-qa-run-manifest.js'), '--self-test'], {}],
  ['Production QA evidence bundle checklist verification', [path.join(PROJECT_ROOT, 'tools/verify-opportunities-production-qa-evidence-bundle-checklist.js'), '--self-test'], {}],
  ['Production QA signoff checklist verification', [path.join(PROJECT_ROOT, 'tools/verify-opportunities-production-qa-signoff-checklist.js'), '--self-test'], {}],
  ['Production QA decision log template verification', [path.join(PROJECT_ROOT, 'tools/verify-opportunities-production-qa-decision-log-template.js'), '--self-test'], {}],
  ['Production QA go/no-go criteria verification', [path.join(PROJECT_ROOT, 'tools/verify-opportunities-production-qa-go-no-go-criteria.js'), '--self-test'], {}],
  ['Production QA release notes template verification', [path.join(PROJECT_ROOT, 'tools/verify-opportunities-production-qa-release-notes-template.js'), '--self-test'], {}],
  ['Production QA monitoring handoff verification', [path.join(PROJECT_ROOT, 'tools/verify-opportunities-production-qa-monitoring-handoff-checklist.js'), '--self-test'], {}],
  ['Production QA post-release watch verification', [path.join(PROJECT_ROOT, 'tools/verify-opportunities-production-qa-post-release-watch-checklist.js'), '--self-test'], {}],
  ['Production QA search indexing hold verification', [path.join(PROJECT_ROOT, 'tools/verify-opportunities-production-qa-search-indexing-request-hold-checklist.js'), '--self-test'], {}],
  ['Published record preflight matrix verification', [path.join(PROJECT_ROOT, 'tools/verify-opportunities-published-record-preflight-matrix.js'), '--self-test'], {}],
  ['Indexed output activation preflight matrix verification', [path.join(PROJECT_ROOT, 'tools/verify-opportunities-indexed-output-activation-preflight-matrix.js'), '--self-test'], {}],
  ['Newsletter activation hold checklist verification', [path.join(PROJECT_ROOT, 'tools/verify-opportunities-newsletter-activation-hold-checklist.js'), '--self-test'], {}],
  ['Phase 5C indexed-release planning summary verification', [path.join(PROJECT_ROOT, 'tools/verify-opportunities-phase5c-indexed-release-planning-summary.js'), '--self-test'], {}],
  ['Phase 5C planning-only long-run board verification', [path.join(PROJECT_ROOT, 'tools/verify-opportunities-phase5c-planning-only-long-run-board.js'), '--self-test'], {}],
  ['Phase 5C pre-implementation long-run board verification', [path.join(PROJECT_ROOT, 'tools/verify-opportunities-phase5c-pre-implementation-long-run-board.js'), '--self-test'], {}],
  ['Phase 5C pre-implementation command contract verification', [path.join(PROJECT_ROOT, 'tools/verify-opportunities-phase5c-pre-implementation-command-contract.js'), '--self-test'], {}],
  ['Phase 5C status rollup template verification', [path.join(PROJECT_ROOT, 'tools/verify-opportunities-phase5c-status-rollup-template.js'), '--self-test'], {}],
  ['Phase 5C indexed implementation dependency map verification', [path.join(PROJECT_ROOT, 'tools/verify-opportunities-phase5c-indexed-implementation-dependency-map.js'), '--self-test'], {}],
  ['Phase 5C implementation stage packet skeleton verification', [path.join(PROJECT_ROOT, 'tools/verify-opportunities-phase5c-implementation-stage-packet-skeleton.js'), '--self-test'], {}],
  ['Phase 5C planning-only long-run handoff verification', [path.join(PROJECT_ROOT, 'tools/verify-opportunities-phase5c-planning-only-long-run-handoff.js'), '--self-test'], {}],
  ['Page verification', [path.join(PROJECT_ROOT, 'tools/verify-opportunities-page.js')], {}],
  ['Indexed readiness verification', [path.join(PROJECT_ROOT, 'tools/verify-opportunities-indexed-readiness.js')], {}],
  ['Index policy verification', [path.join(PROJECT_ROOT, 'tools/verify-opportunities-index-policy.js'), '--self-test'], {}],
  ['Analytics CTA verification', [path.join(PROJECT_ROOT, 'tools/verify-opportunities-analytics-cta.js')], {}],
  ['HTTP verification', [path.join(PROJECT_ROOT, 'tools/verify-opportunities-http.js')], {}],
];

if (process.env.PVSIZE_VERIFY_PRODUCTION === '1') {
  steps.push(['Production noindex verification', [path.join(PROJECT_ROOT, 'tools/verify-opportunities-production-noindex.js')], {}]);
}

steps.forEach(([label, args, options]) => {
  console.log(`\n== ${label} ==`);
  const result = spawnSync('node', args, {
    cwd: PROJECT_ROOT,
    stdio: 'inherit',
    ...options,
  });

  if (result.status !== 0) {
    console.error(`Opportunities aggregate QA FAIL: ${label}`);
    process.exit(result.status || 1);
  }
});

console.log('\nOpportunities aggregate QA PASS');
