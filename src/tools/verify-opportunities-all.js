const { spawnSync } = require('child_process');

const steps = [
  ['Data validator', ['src/tools/validate-opportunities.js', '--self-test'], {}],
  ['Detail generator', ['src/tools/generate-opportunity-detail-pages.js'], {}],
  ['Page verification', ['src/tools/verify-opportunities-page.js'], {}],
  ['Index policy verification', ['src/tools/verify-opportunities-index-policy.js'], {}],
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
