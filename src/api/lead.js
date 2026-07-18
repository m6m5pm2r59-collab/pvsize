var FORMSUBMIT_ENDPOINT = process.env.FORMSUBMIT_ENDPOINT || 'https://formsubmit.co/ajax/c9945756a98664c3328f6bb9a15eadb8';
var TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || '';
var MAX_BODY_SIZE = 12000;
var MIN_SUBMIT_MS = 1500;
var MAX_SUBMIT_AGE_MS = 24 * 60 * 60 * 1000;
var rateStore = globalThis.__pvLeadRateStore || new Map();

if (!globalThis.__pvLeadRateStore) {
  globalThis.__pvLeadRateStore = rateStore;
}

function cleanString(value, maxLength) {
  if (value == null) return '';
  var text = String(value).trim();
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}

function detectFormType(body) {
  if (body.formType) return cleanString(body.formType, 80);
  if (body.companyName || body.productCategory || body.annualCapacity) return 'partner_inquiry';
  if (body.location || body.bill || body.homeSize) return 'solar_plan';
  if (body.message) return 'contact';
  return 'calculator_report';
}

function isValidEmail(email) {
  if (!email) return false;
  if (email.length > 160) return false;
  if (/[\r\n]/.test(email)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
}

function getClientIp(req) {
  var forwarded = cleanString(req.headers['x-forwarded-for'] || '', 200);
  if (forwarded) return forwarded.split(',')[0].trim();
  return cleanString(req.headers['x-real-ip'] || req.socket && req.socket.remoteAddress || '', 120);
}

function parsePositiveInteger(value) {
  if (value == null || value === '') return 0;
  var number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.floor(number));
}

function getFormSubmitEndpoint(formType, hasEstimateSummary) {
  if (formType === 'calculator_report' && hasEstimateSummary) {
    return FORMSUBMIT_ENDPOINT.replace('/ajax/', '/');
  }

  return FORMSUBMIT_ENDPOINT;
}

function getRequestSize(body) {
  try {
    return JSON.stringify(body || {}).length;
  } catch (err) {
    return MAX_BODY_SIZE + 1;
  }
}

function pruneRateStore(now) {
  rateStore.forEach(function (entry, key) {
    if (!entry || entry.expiresAt <= now) rateStore.delete(key);
  });
}

function checkRateLimit(bucket, value, limit, windowMs) {
  if (!value) return null;
  var now = Date.now();
  pruneRateStore(now);
  var key = bucket + ':' + value;
  var entry = rateStore.get(key);

  if (!entry || entry.expiresAt <= now) {
    rateStore.set(key, { count: 1, expiresAt: now + windowMs });
    return null;
  }

  if (entry.count >= limit) {
    return bucket;
  }

  entry.count += 1;
  rateStore.set(key, entry);
  return null;
}

function hasRateLimitHit(context) {
  return (
    checkRateLimit('ip', context.ip, 5, 10 * 60 * 1000) ||
    checkRateLimit('email', context.email, 3, 60 * 60 * 1000) ||
    checkRateLimit('session', context.sessionId, 6, 10 * 60 * 1000)
  );
}

async function verifyTurnstile(token, ip) {
  if (!TURNSTILE_SECRET_KEY) return { ok: true, skipped: true };
  if (!token) return { ok: false };

  var body = new URLSearchParams();
  body.set('secret', TURNSTILE_SECRET_KEY);
  body.set('response', token);
  if (ip) body.set('remoteip', ip);

  try {
    var response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    });
    var json = await response.json();
    return { ok: !!json.success };
  } catch (err) {
    return { ok: false };
  }
}

function buildPayload(formType, body, source) {
  var payload = new URLSearchParams();
  payload.set('_subject', 'PVSize lead: ' + formType);
  payload.set('form_type', formType);
  payload.set('email', cleanString(body.email, 160));
  payload.set('source', source);

  if (formType === 'partner_inquiry') {
    payload.set('companyName', cleanString(body.companyName, 160));
    payload.set('annualCapacity', cleanString(body.annualCapacity, 80));
    payload.set('productCategory', cleanString(body.productCategory, 120));
    payload.set('message', cleanString(body.message, 2000));
  } else if (formType === 'solar_plan') {
    payload.set('name', cleanString(body.name, 120));
    payload.set('location', cleanString(body.location, 160));
    payload.set('bill', cleanString(body.bill, 40));
    payload.set('homeSize', cleanString(body.homeSize, 160));
    payload.set('batteryInterest', cleanString(body.batteryInterest, 80));
    payload.set('timing', cleanString(body.timing, 80));
    payload.set('phone', cleanString(body.phone, 80));
    payload.set('notes', cleanString(body.notes, 2000));
    payload.set('consent', 'yes');
  } else if (formType === 'contact') {
    payload.set('name', cleanString(body.name, 120));
    payload.set('message', cleanString(body.message, 2000));
  } else {
    payload.set('calculator_type', cleanString(body.calculatorType || body.calculator_type, 80));
    var estimateSummary = cleanString(body.estimate_summary, 4000);
    if (estimateSummary) {
      payload.set('estimate_summary', estimateSummary);
      payload.set(
        '_autoresponse',
        'Your PVSize planning estimate\n\n' + estimateSummary +
        '\n\nThis is a planning estimate, not an installation quote, engineering design, or financial promise. Your email was not submitted for installer matching.'
      );
    }
  }

  return payload;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  var contentType = cleanString(req.headers['content-type'] || '', 120);
  if (contentType.indexOf('application/json') === -1) {
    res.status(415).json({ error: 'Unsupported content type' });
    return;
  }

  var body = req.body || {};
  if (getRequestSize(body) > MAX_BODY_SIZE) {
    res.status(413).json({ error: 'Request too large' });
    return;
  }

  if (cleanString(body.website || body.company_website, 160)) {
    res.status(200).json({ ok: true, ignored: true });
    return;
  }

  var email = cleanString(body.email, 160);
  if (!isValidEmail(email)) {
    res.status(400).json({ error: 'Invalid email' });
    return;
  }

  var formType = detectFormType(body);
  var source = cleanString(body.source || req.headers.referer || '', 200);
  var sessionId = cleanString(body.session_id, 120);
  var anonymousId = cleanString(body.anonymous_id, 120);
  var ip = getClientIp(req);
  var startedAt = parsePositiveInteger(body.submission_started_at);
  var elapsed = startedAt ? Date.now() - startedAt : 0;

  if (!startedAt || elapsed < MIN_SUBMIT_MS || elapsed > MAX_SUBMIT_AGE_MS) {
    res.status(400).json({ error: 'Submission validation failed' });
    return;
  }

  if (formType === 'solar_plan' && cleanString(body.consent, 20) !== 'yes') {
    res.status(400).json({ error: 'Consent required' });
    return;
  }

  var limitReason = hasRateLimitHit({
    ip: ip,
    email: email.toLowerCase(),
    sessionId: sessionId
  });
  if (limitReason) {
    res.status(429).json({ error: 'Too many submissions' });
    return;
  }

  var turnstile = await verifyTurnstile(
    cleanString(body.turnstile_token || body.cf_turnstile_response || body['cf-turnstile-response'], 4096),
    ip
  );
  if (!turnstile.ok) {
    res.status(400).json({ error: 'Verification failed' });
    return;
  }

  var payload = buildPayload(formType, body, source);
  var hasEstimateSummary = formType === 'calculator_report' && !!cleanString(body.estimate_summary, 4000);
  var formSubmitEndpoint = getFormSubmitEndpoint(formType, hasEstimateSummary);

  try {
    var upstream = await fetch(formSubmitEndpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: payload.toString()
    });

    var upstreamJson = null;
    try {
      upstreamJson = await upstream.json();
    } catch (err) {}

    console.log(
      JSON.stringify({
        type: 'pv_lead',
        form_type: formType,
        source: source,
        email_domain: email.split('@').pop(),
        anonymous_id: anonymousId,
        session_id: sessionId,
        upstream_ok: upstream.ok,
        server_ts: new Date().toISOString()
      })
    );

    if (!upstream.ok) {
      res.status(502).json({ error: (upstreamJson && upstreamJson.error) || 'Lead delivery failed' });
      return;
    }

    res.status(200).json({ ok: true, form_type: formType });
  } catch (error) {
    res.status(500).json({ error: 'Lead request failed' });
  }
}
