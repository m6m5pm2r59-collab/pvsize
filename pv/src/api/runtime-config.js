export default function handler(req, res) {
  res.status(200).json({
    turnstileSiteKey: process.env.TURNSTILE_SITE_KEY || '',
    internalCookieName: 'pv_internal'
  });
}
