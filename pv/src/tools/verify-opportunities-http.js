const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

const port = Number(process.env.PVSIZE_OPPORTUNITIES_QA_PORT || 4199);
const baseUrl = `http://127.0.0.1:${port}`;
const projectRoot = path.resolve(__dirname, '..');
const paths = [
  '/opportunities/',
  '/opportunities/usgs-communications-site-infrastructure-idiq/',
  '/opportunities/178th-wing-base-microgrid-construction/',
  '/opportunities/jbmdl-power-generation-microgrid-construction/',
  '/opportunities/63rd-readiness-division-milcon-ercip-microgrid/',
  '/opportunities/solar-with-wildlife-and-ecosystem-benefits-2-solweb2/',
];

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function requestPath(path) {
  return new Promise((resolve, reject) => {
    const request = http.get(`${baseUrl}${path}`, (response) => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => {
        body += chunk;
      });
      response.on('end', () => {
        resolve({ statusCode: response.statusCode, body });
      });
    });

    request.setTimeout(5000, () => {
      request.destroy(new Error(`timeout: ${path}`));
    });
    request.on('error', reject);
  });
}

async function waitForServer() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await requestPath('/opportunities/');
      if (response.statusCode === 200) return;
    } catch (error) {
      await wait(150);
    }
  }

  throw new Error('local static server did not become ready');
}

async function verify() {
  const server = spawn('python3', ['-m', 'http.server', String(port), '--directory', projectRoot], {
    cwd: projectRoot,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let serverOutput = '';
  server.stdout.on('data', (chunk) => {
    serverOutput += chunk.toString();
  });
  server.stderr.on('data', (chunk) => {
    serverOutput += chunk.toString();
  });

  try {
    await waitForServer();

    for (const path of paths) {
      const response = await requestPath(path);
      if (response.statusCode !== 200) {
        throw new Error(`expected HTTP 200 for ${path}, found ${response.statusCode}`);
      }
      if (!response.body.includes('noindex,follow')) {
        throw new Error(`missing noindex,follow marker: ${path}`);
      }
      if (response.body.includes('<script type="application/ld+json">')) {
        throw new Error(`premature JSON-LD structured data: ${path}`);
      }
      console.log(`PASS ${response.statusCode} ${path}`);
    }
  } finally {
    server.kill('SIGINT');
    await wait(150);
  }

  if (server.exitCode && server.exitCode !== 0 && server.exitCode !== 130) {
    throw new Error(`local static server exited unexpectedly: ${server.exitCode}\n${serverOutput}`);
  }
}

verify()
  .then(() => {
    console.log(`Opportunities HTTP verification PASS: ${paths.length} page(s)`);
  })
  .catch((error) => {
    console.error(`Opportunities HTTP verification FAIL: ${error.message}`);
    process.exit(1);
  });
