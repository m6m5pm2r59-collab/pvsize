const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const dataPath = path.join(rootDir, 'data', 'opportunities', 'opportunities.json');
const outputDir = path.join(rootDir, 'opportunities');
const records = JSON.parse(fs.readFileSync(dataPath, 'utf8')).records || [];

const detailSlugs = [
  'usgs-communications-site-infrastructure-idiq',
  '178th-wing-base-microgrid-construction',
  'jbmdl-power-generation-microgrid-construction',
];

const sourceLabels = {
  src_us_sam_contract_opportunities: 'SAM.gov',
  src_us_grants_search: 'Grants.gov',
};

const calculatorLinks = {
  'solar-panel-size': {
    href: '/calculators/panel-count/',
    label: 'Panel calculator',
  },
  'solar-battery-size': {
    href: '/calculators/battery-sizing/',
    label: 'Battery calculator',
  },
};

const detailNotes = {
  'usgs-communications-site-infrastructure-idiq': [
    'Relevant to contractors working on remote communications site power and electrical infrastructure.',
    'Solar power systems and backup battery arrays are visible in the official notice scope.',
    'The response deadline was recorded as August 6, 2026 at intake time.',
  ],
  '178th-wing-base-microgrid-construction': [
    'Relevant to solar EPC, microgrid, and storage contractors because PV and battery options are visible in the official notice.',
    'The opportunity is tied to a U.S. federal procurement source with a stable SAM.gov notice URL.',
    'The response deadline was recorded as August 3, 2026 at intake time.',
  ],
  'jbmdl-power-generation-microgrid-construction': [
    'Relevant as a closed microgrid construction signal for contractors tracking federal PV and storage procurement patterns.',
    'The official notice references photovoltaic systems, battery energy storage, switchboards, and natural gas generators.',
    'The response date had passed at intake time, so this page must stay clearly marked as closed.',
  ],
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(value) {
  if (!value) return 'Not listed';
  const date = new Date(`${value}T00:00:00Z`);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

function titleCase(value) {
  return String(value)
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function renderCalculatorLinks(record) {
  const links = (record.related_calculators || [])
    .map((id) => calculatorLinks[id])
    .filter(Boolean);

  return links
    .map((link) => `<a class="detail-secondary" href="${link.href}">${link.label}</a>`)
    .join('\n          ');
}

function renderDetailPage(record) {
  const sourceLabel = sourceLabels[record.source_id] || 'Official source';
  const whyItMatters = (detailNotes[record.slug] || [record.relevance_notes])
    .map((note) => `          <li>${escapeHtml(note)}</li>`)
    .join('\n');
  const meta = `${titleCase(record.status)} · ${titleCase(record.opportunity_type)} · ${titleCase(record.region || record.country)}`;
  const description = `PVSize opportunity brief for ${record.title}.`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex,follow">
  <title>${escapeHtml(record.title)} | PVSize Opportunities</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="https://pvsize.com/opportunities/${record.slug}/">
  <link rel="stylesheet" href="/style.css">
  <script src="/pv-analytics.js" defer></script>
  <style>
    .opportunity-detail {
      max-width: 960px;
      margin: 0 auto;
      padding: 64px 20px 76px;
    }

    .opportunity-detail a {
      color: #0f766e;
      font-weight: 800;
    }

    .detail-kicker,
    .detail-meta {
      color: #64748b;
      font-size: 0.84rem;
      font-weight: 800;
      letter-spacing: 0;
      text-transform: uppercase;
    }

    .opportunity-detail h1 {
      margin: 10px 0 16px;
      color: #0f172a;
      font-size: clamp(2rem, 4vw, 3.7rem);
      line-height: 1.04;
      letter-spacing: 0;
    }

    .detail-summary {
      color: #475569;
      font-size: 1.08rem;
      line-height: 1.7;
      margin: 0 0 26px;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 280px;
      gap: 22px;
      align-items: start;
    }

    .detail-section,
    .detail-side {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: #fff;
      padding: 22px;
      box-shadow: 0 12px 32px rgba(15, 23, 42, 0.06);
    }

    .detail-section h2,
    .detail-side h2 {
      margin: 0 0 12px;
      color: #0f172a;
      font-size: 1.2rem;
      letter-spacing: 0;
    }

    .detail-section p,
    .detail-section li,
    .detail-side p {
      color: #475569;
      line-height: 1.65;
    }

    .detail-section ul {
      padding-left: 20px;
      margin: 0;
    }

    .detail-actions {
      display: grid;
      gap: 10px;
      margin-top: 16px;
    }

    .detail-actions a {
      border-radius: 8px;
      padding: 12px 14px;
      text-align: center;
      text-decoration: none;
    }

    .detail-primary {
      background: #0f766e;
      color: #fff !important;
    }

    .detail-secondary {
      border: 1px solid #cbd5e1;
      color: #0f172a !important;
      background: #fff;
    }

    @media (max-width: 780px) {
      .opportunity-detail {
        padding-top: 42px;
      }

      .detail-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <nav class="navbar">
    <div class="nav-container">
      <a href="/" class="nav-logo">PVSize</a>
      <ul class="nav-links">
        <li><a href="/calculators/">Calculators</a></li>
        <li><a href="/learn/">Learn</a></li>
        <li><a href="/partners/">Partners</a></li>
        <li><a href="/opportunities/">Opportunities</a></li>
      </ul>
    </div>
  </nav>

  <main class="opportunity-detail">
    <a href="/opportunities/">Back to opportunities</a>
    <div class="detail-kicker">Opportunity brief · Non-indexed baseline</div>
    <h1>${escapeHtml(record.title)}</h1>
    <p class="detail-summary">${escapeHtml(record.overview)}</p>

    <div class="detail-grid">
      <section class="detail-section">
        <h2>Why it matters</h2>
        <ul>
${whyItMatters}
        </ul>
      </section>

      <aside class="detail-side">
        <h2>Source snapshot</h2>
        <p class="detail-meta">${escapeHtml(meta)}</p>
        <p>Source: ${escapeHtml(sourceLabel)}<br>Agency: ${escapeHtml(record.buyer_or_issuer)}<br>Last verified: ${formatDate(record.last_verified)}</p>
        <div class="detail-actions">
          <a class="detail-primary" href="${record.official_source_url}" rel="nofollow noopener" target="_blank">Official source</a>
          ${renderCalculatorLinks(record)}
        </div>
      </aside>
    </div>
  </main>
</body>
</html>
`;
}

detailSlugs.forEach((slug) => {
  const record = records.find((item) => item.slug === slug);
  if (!record) {
    throw new Error(`Missing opportunity record for detail slug: ${slug}`);
  }
  const detailDir = path.join(outputDir, slug);
  fs.mkdirSync(detailDir, { recursive: true });
  fs.writeFileSync(path.join(detailDir, 'index.html'), renderDetailPage(record));
});

console.log(`Generated ${detailSlugs.length} opportunity detail page(s).`);
