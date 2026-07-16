var FORMSUBMIT_ENDPOINT = process.env.FORMSUBMIT_ENDPOINT || 'https://formsubmit.co/ajax/c9945756a98664c3328f6bb9a15eadb8';
var MAX_BODY_SIZE = 4000;

function cleanString(value, maxLength) {
  if (value == null) return '';
  var text = String(value).trim();
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}

function getRequestSize(body) {
  try {
    return JSON.stringify(body || {}).length;
  } catch (err) {
    return MAX_BODY_SIZE + 1;
  }
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

  if (cleanString(body.website, 160)) {
    res.status(200).json({ ok: true, ignored: true });
    return;
  }

  var rating = cleanString(body.rating, 40);
  var calculatorType = cleanString(body.calculator_type, 80);
  var feedbackText = cleanString(body.feedback_text, 1000);

  if (!rating && !feedbackText) {
    res.status(400).json({ error: 'Missing feedback' });
    return;
  }

  var payload = new URLSearchParams();
  payload.set('_subject', 'PVSize calculator feedback');
  payload.set('form_type', 'calculator_feedback');
  payload.set('rating', rating || 'unset');
  payload.set('calculator_type', calculatorType || 'unknown');
  payload.set('feedback', feedbackText || '(no text)');
  payload.set('page', cleanString(body.page, 200));
  payload.set('source', cleanString(body.source, 200));

  try {
    var upstream = await fetch(FORMSUBMIT_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: payload.toString()
    });

    if (!upstream.ok) {
      res.status(502).json({ error: 'Feedback delivery failed' });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(502).json({ error: 'Feedback delivery failed' });
  }
}
