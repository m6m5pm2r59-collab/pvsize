var FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/c9945756a98664c3328f6bb9a15eadb8';

function cleanString(value, maxLength) {
  if (value == null) return '';
  var text = String(value).trim();
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}

function detectFormType(body) {
  if (body.formType) return cleanString(body.formType, 80);
  if (body.companyName || body.productCategory || body.annualCapacity) return 'partner_inquiry';
  if (body.message) return 'contact';
  return 'calculator_report';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  var body = req.body || {};
  var email = cleanString(body.email, 160);
  if (!email) {
    res.status(400).json({ error: 'Missing email' });
    return;
  }

  var formType = detectFormType(body);
  var payload = new URLSearchParams();
  payload.set('_subject', 'PVSize lead: ' + formType);
  payload.set('form_type', formType);
  payload.set('email', email);
  payload.set('source', cleanString(body.source || req.headers.referer || '', 200));

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
    payload.set('consent', cleanString(body.consent, 20));
  } else if (formType === 'contact') {
    payload.set('name', cleanString(body.name, 120));
    payload.set('message', cleanString(body.message, 2000));
  }

  try {
    var upstream = await fetch(FORMSUBMIT_ENDPOINT, {
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
        source: cleanString(body.source || '', 200),
        email_domain: email.indexOf('@') > -1 ? email.split('@').pop() : '',
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
