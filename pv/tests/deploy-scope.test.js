const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, execSync, spawnSync } = require('node:child_process');

const sourceScript = path.resolve(__dirname, '..', 'deploy.sh');

function sh(cmd, cwd) {
  return execSync(cmd, {
    cwd,
    stdio: 'pipe',
    encoding: 'utf8',
  }).trim();
}

function setupRepo() {
  const repoDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pv-deploy-scope-'));
  fs.mkdirSync(path.join(repoDir, 'pv'), { recursive: true });
  fs.mkdirSync(path.join(repoDir, 'kr1688'), { recursive: true });

  fs.copyFileSync(sourceScript, path.join(repoDir, 'pv', 'deploy.sh'));
  fs.writeFileSync(path.join(repoDir, 'pv', 'app.txt'), 'pv-v1\n');
  fs.writeFileSync(path.join(repoDir, 'kr1688', 'story.txt'), 'kr-v1\n');

  sh('git init -b main', repoDir);
  sh('git config user.name "Codex Test"', repoDir);
  sh('git config user.email "codex-test@example.com"', repoDir);
  sh('git add pv kr1688', repoDir);
  sh('git commit -m "init"', repoDir);

  return repoDir;
}

test('blocks commits when non-pv changes are present', () => {
  const repoDir = setupRepo();
  fs.writeFileSync(path.join(repoDir, 'kr1688', 'story.txt'), 'kr-v2\n');

  const result = spawnSync('bash', ['pv/deploy.sh'], {
    cwd: repoDir,
    encoding: 'utf8',
  });

  assert.notEqual(result.status, 0, 'deploy should fail when non-pv changes exist');
  assert.match(
    `${result.stdout}\n${result.stderr}`,
    /non-pv|KR1688|pv-only|仓库边界|仅允许/i,
    'failure output should explain why deployment was blocked'
  );
  assert.equal(sh('git rev-list --count HEAD', repoDir), '1');
});

test('commits pv changes without touching kr1688', () => {
  const repoDir = setupRepo();
  fs.writeFileSync(path.join(repoDir, 'pv', 'app.txt'), 'pv-v2\n');

  execFileSync('bash', ['pv/deploy.sh'], {
    cwd: repoDir,
    stdio: 'pipe',
  });

  assert.equal(sh('git rev-list --count HEAD', repoDir), '2');
  assert.equal(sh('git show --name-only --pretty=format: HEAD', repoDir), 'pv/app.txt');
  assert.equal(fs.readFileSync(path.join(repoDir, 'kr1688', 'story.txt'), 'utf8'), 'kr-v1\n');
});

test('blocks renames that move files from pv into kr1688', () => {
  const repoDir = setupRepo();
  sh('git mv pv/app.txt kr1688/app.txt', repoDir);

  const result = spawnSync('bash', ['pv/deploy.sh'], {
    cwd: repoDir,
    encoding: 'utf8',
  });

  assert.notEqual(result.status, 0, 'deploy should fail when a pv file is renamed into kr1688');
  assert.equal(sh('git rev-list --count HEAD', repoDir), '1');
});
