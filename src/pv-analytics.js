(function () {
  if (window.__pvAnalyticsLoaded) return;
  window.__pvAnalyticsLoaded = true;

  var formStarted = new WeakSet();

  function inferPageType(pathname) {
    if (pathname.indexOf('/calculators/') === 0) return 'calculator';
    if (pathname.indexOf('/city/') === 0) return 'city';
    if (pathname.indexOf('/learn/') === 0) return 'learn';
    if (pathname.indexOf('/request-solar-plan/') === 0) return 'solar_plan';
    if (pathname.indexOf('/contact/') === 0) return 'contact';
    if (pathname.indexOf('/partners/') === 0) return 'partners';
    return pathname === '/' ? 'home' : 'page';
  }

  function inferDevice() {
    var width = window.innerWidth || 0;
    if (width && width < 768) return 'mobile';
    if (width && width < 1024) return 'tablet';
    return 'desktop';
  }

  function trimValue(value, maxLength) {
    if (value == null) return '';
    var text = String(value);
    return text.length > maxLength ? text.slice(0, maxLength) : text;
  }

  function sanitizeDetail(detail) {
    var clean = {};
    Object.keys(detail || {}).forEach(function (key) {
      var value = detail[key];
      if (value == null) return;
      if (typeof value === 'string') clean[key] = trimValue(value, 160);
      else if (typeof value === 'number' || typeof value === 'boolean') clean[key] = value;
      else clean[key] = trimValue(JSON.stringify(value), 240);
    });
    return clean;
  }

  function safeReferrerHost() {
    if (!document.referrer) return '';
    try {
      return new URL(document.referrer).host || '';
    } catch (err) {
      return '';
    }
  }

  function postEvent(payload) {
    var body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      try {
        var blob = new Blob([body], { type: 'application/json' });
        if (navigator.sendBeacon('/api/event', blob)) return;
      } catch (err) {}
    }

    try {
      fetch('/api/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
        keepalive: true
      });
    } catch (err) {}
  }

  window.pvTrack = function (name, detail) {
    var payload = Object.assign(
      {
        event: trimValue(name, 80),
        landing_page: trimValue(window.location.pathname, 200),
        page_type: inferPageType(window.location.pathname),
        device: inferDevice(),
        source_param: trimValue(new URLSearchParams(window.location.search).get('source') || '', 120),
        referrer_host: trimValue(safeReferrerHost(), 120),
        ts: new Date().toISOString()
      },
      sanitizeDetail(detail || {})
    );

    try {
      if (typeof window.clarity === 'function') {
        window.clarity('event', name, payload);
      }
    } catch (err) {}

    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: name, ...payload });
    } catch (err) {}

    postEvent(payload);
  };

  document.addEventListener('DOMContentLoaded', function () {
    window.pvTrack('page_view');

    document.addEventListener('click', function (event) {
      var target = event.target.closest('[data-pv-event]');
      if (!target) return;
      window.pvTrack(target.getAttribute('data-pv-event'), {
        calculator_type: target.getAttribute('data-pv-calculator') || '',
        cta_type: target.getAttribute('data-pv-cta') || '',
        source: target.getAttribute('data-pv-source') || '',
        destination: target.getAttribute('data-pv-destination') || target.getAttribute('href') || ''
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-pv-form]'), function (form) {
      form.addEventListener('focusin', function () {
        if (formStarted.has(form)) return;
        formStarted.add(form);
        var formType = form.getAttribute('data-pv-form');
        window.pvTrack(formType + '_start', { form_type: formType });
      });
    });
  });
})();
