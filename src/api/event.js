function pickString(value, maxLength) {
  if (value == null) return '';
  var text = String(value);
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}

function pickNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  var body = req.body || {};
  var eventName = pickString(body.event, 80);
  if (!eventName) {
    res.status(400).json({ error: 'Missing event' });
    return;
  }

  console.log(
    JSON.stringify({
      type: 'pv_event',
      event: eventName,
      landing_page: pickString(body.landing_page, 200),
      page_type: pickString(body.page_type, 40),
      device: pickString(body.device, 40),
      source_param: pickString(body.source_param, 120),
      referrer_host: pickString(body.referrer_host, 120),
      calculator_type: pickString(body.calculator_type, 80),
      cta_type: pickString(body.cta_type, 80),
      destination: pickString(body.destination, 200),
      source: pickString(body.source, 120),
      form_type: pickString(body.form_type, 80),
      result_value: pickNumber(body.result_value),
      ts: pickString(body.ts, 80),
      server_ts: new Date().toISOString()
    })
  );

  res.status(200).json({ ok: true });
}
