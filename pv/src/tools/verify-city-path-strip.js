const path = require('path');
const {
  pilotSlugs,
  verifyCityPathStrip,
} = require('./city-path-strip');

function main() {
  const root = path.join(__dirname, '..');
  const slugs = process.argv.slice(2);
  const targetSlugs = slugs.length ? slugs : pilotSlugs;
  const results = targetSlugs.map((slug) => verifyCityPathStrip(root, slug));
  const failures = results.filter((result) => result.errors.length);

  results.forEach((result) => {
    if (result.errors.length) {
      console.log(`${result.slug}: FAIL - ${result.errors.join('; ')}`);
    } else {
      console.log(`${result.slug}: PASS`);
    }
  });

  if (failures.length) {
    process.exitCode = 1;
  }
}

main();
