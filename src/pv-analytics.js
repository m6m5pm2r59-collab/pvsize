(function () {
  if (window.__pvAnalyticsLoaded) return;
  window.__pvAnalyticsLoaded = true;

  var formStarted = new WeakSet();
  var runtimeConfig = { turnstileSiteKey: '', internalCookieName: 'pv_internal' };
  var internalTraffic = false;

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

  function readStorage(storage, key) {
    try {
      return storage.getItem(key) || '';
    } catch (err) {
      return '';
    }
  }

  function writeStorage(storage, key, value) {
    try {
      storage.setItem(key, value);
    } catch (err) {}
  }

  function readCookie(name) {
    var parts = document.cookie ? document.cookie.split('; ') : [];
    for (var i = 0; i < parts.length; i += 1) {
      var section = parts[i].split('=');
      if (section[0] === name) return decodeURIComponent(section.slice(1).join('='));
    }
    return '';
  }

  function writeCookie(name, value, days) {
    var maxAge = days * 24 * 60 * 60;
    document.cookie = name + '=' + encodeURIComponent(value) + '; path=/; max-age=' + maxAge + '; SameSite=Lax';
  }

  function generateId(prefix) {
    var randomPart = '';
    try {
      randomPart = Array.from(window.crypto.getRandomValues(new Uint32Array(2))).map(function (item) {
        return item.toString(36);
      }).join('');
    } catch (err) {
      randomPart = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    }
    return prefix + '_' + Date.now().toString(36) + '_' + randomPart.slice(0, 12);
  }

  function getAnonymousId() {
    var existing = readStorage(window.localStorage, 'pv_anonymous_id');
    if (existing) return existing;
    var next = generateId('anon');
    writeStorage(window.localStorage, 'pv_anonymous_id', next);
    return next;
  }

  function getSessionId() {
    var existing = readStorage(window.sessionStorage, 'pv_session_id');
    if (existing) return existing;
    var next = generateId('sess');
    writeStorage(window.sessionStorage, 'pv_session_id', next);
    return next;
  }

  function applyInternalTrafficSetting() {
    var params = new URLSearchParams(window.location.search);
    if (params.get('internal') === '1') {
      writeStorage(window.localStorage, 'pv_internal', '1');
      writeCookie(runtimeConfig.internalCookieName, '1', 30);
    } else if (params.get('internal') === '0') {
      writeStorage(window.localStorage, 'pv_internal', '0');
      writeCookie(runtimeConfig.internalCookieName, '0', 30);
    }

    internalTraffic =
      readStorage(window.localStorage, 'pv_internal') === '1' ||
      readCookie(runtimeConfig.internalCookieName) === '1' ||
      window.location.hostname.indexOf('vercel.app') > -1 ||
      window.location.hostname.indexOf('localhost') > -1;
  }

  function getUtmValue(name) {
    return trimValue(new URLSearchParams(window.location.search).get(name) || '', 120);
  }

  function loadRuntimeConfig() {
    return fetch('/api/runtime-config/')
      .then(function (response) {
        if (!response.ok) throw new Error('config_failed');
        return response.json();
      })
      .then(function (json) {
        runtimeConfig.turnstileSiteKey = trimValue(json.turnstileSiteKey || '', 160);
        runtimeConfig.internalCookieName = trimValue(json.internalCookieName || 'pv_internal', 80);
        applyInternalTrafficSetting();
        if (runtimeConfig.turnstileSiteKey) renderTurnstileWidgets();
      })
      .catch(function () {
        applyInternalTrafficSetting();
      });
  }

  function ensureHiddenInput(form, name, value) {
    var input = form.querySelector('input[name="' + name + '"]');
    if (!input) {
      input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      form.appendChild(input);
    }
    input.value = value;
    return input;
  }

  function loadScriptOnce(src) {
    return new Promise(function (resolve, reject) {
      if (document.querySelector('script[data-pv-runtime="' + src + '"]')) {
        resolve();
        return;
      }
      var script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.defer = true;
      script.dataset.pvRuntime = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function renderTurnstileWidgets() {
    var slots = document.querySelectorAll('[data-pv-turnstile]');
    if (!slots.length) return;

    loadScriptOnce('https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit')
      .then(function () {
        if (!window.turnstile || !runtimeConfig.turnstileSiteKey) return;
        Array.prototype.forEach.call(slots, function (slot) {
          if (slot.dataset.turnstileReady === '1') return;
          var parentForm = slot.closest('form');
          if (!parentForm && slot.parentNode) {
            parentForm = slot.parentNode.querySelector('form[data-pv-form]');
          }
          window.turnstile.render(slot, {
            sitekey: runtimeConfig.turnstileSiteKey,
            callback: function (token) {
              if (parentForm) ensureHiddenInput(parentForm, 'turnstile_token', token);
            }
          });
          slot.dataset.turnstileReady = '1';
        });
      })
      .catch(function () {});
  }

  function attachFormGuards(form) {
    ensureHiddenInput(form, 'anonymous_id', getAnonymousId());
    ensureHiddenInput(form, 'session_id', getSessionId());
    ensureHiddenInput(form, 'submission_started_at', String(Date.now()));
    ensureHiddenInput(form, 'website', '');
  }

  function postEvent(payload) {
    if (internalTraffic) return;
    var body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      try {
        var blob = new Blob([body], { type: 'application/json' });
        if (navigator.sendBeacon('/api/event/', blob)) return;
      } catch (err) {}
    }

    try {
      fetch('/api/event/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
        keepalive: true
      });
    } catch (err) {}
  }

  window.pvTrack = function (name, detail) {
    if (internalTraffic) return;
    var payload = Object.assign(
      {
        event: trimValue(name, 80),
        landing_page: trimValue(window.location.pathname, 200),
        page_type: inferPageType(window.location.pathname),
        device: inferDevice(),
        source_param: trimValue(new URLSearchParams(window.location.search).get('source') || '', 120),
        referrer_host: trimValue(safeReferrerHost(), 120),
        utm_source: getUtmValue('utm_source'),
        utm_medium: getUtmValue('utm_medium'),
        utm_campaign: getUtmValue('utm_campaign'),
        anonymous_id: getAnonymousId(),
        session_id: getSessionId(),
        internal_traffic: false,
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

  window.pvLeadMeta = function (form) {
    if (form) attachFormGuards(form);
    return {
      anonymous_id: form ? (form.querySelector('input[name="anonymous_id"]') || {}).value || getAnonymousId() : getAnonymousId(),
      session_id: form ? (form.querySelector('input[name="session_id"]') || {}).value || getSessionId() : getSessionId(),
      submission_started_at: form ? (form.querySelector('input[name="submission_started_at"]') || {}).value || String(Date.now()) : String(Date.now()),
      website: form ? (form.querySelector('input[name="website"]') || {}).value || '' : '',
      turnstile_token: form ? (form.querySelector('input[name="turnstile_token"]') || {}).value || '' : ''
    };
  };

  document.addEventListener('DOMContentLoaded', function () {
    applyInternalTrafficSetting();
    loadRuntimeConfig();

    Array.prototype.forEach.call(document.querySelectorAll('[data-pv-form]'), function (form) {
      attachFormGuards(form);
    });

    window.pvTrack('pv_page_view');

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
        attachFormGuards(form);
        var formType = form.getAttribute('data-pv-form');
        window.pvTrack(formType + '_start', { form_type: formType });
      });
    });
  });
})();
