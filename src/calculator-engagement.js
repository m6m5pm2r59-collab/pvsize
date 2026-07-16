(function () {
  if (window.__pvCalculatorEngagementLoaded) return;
  window.__pvCalculatorEngagementLoaded = true;

  var configs = {
    '/calculators/panel-count/': {
      type: 'panel_count',
      inputs: {
        roof_area: 'roofArea',
        area_unit: 'areaUnit',
        panel_wattage: 'panelWattage',
        sun_hours: 'location',
        panel_area: 'panelArea'
      },
      results: ['panelCount', 'systemSize', 'annualGen', 'roofUtil'],
      labels: {
        panelCount: 'Panels',
        systemSize: 'System size',
        annualGen: 'Annual generation',
        roofUtil: 'Roof utilization'
      }
    },
    '/calculators/battery-sizing/': {
      type: 'battery_sizing',
      inputs: {
        daily_usage: 'dailyUsage',
        backup_days: 'backupDays',
        battery_type: 'batteryType',
        dod: 'dod'
      },
      results: ['usableCapacity', 'totalCapacity', 'estCost', 'equivUnits'],
      labels: {
        usableCapacity: 'Usable capacity',
        totalCapacity: 'Total rated capacity',
        estCost: 'Estimated cost',
        equivUnits: 'Equivalent units'
      }
    },
    '/calculators/savings/': {
      type: 'savings',
      inputs: {
        monthly_bill: 'monthlyBill',
        rate: 'rateSelect',
        custom_rate: 'rateCustom',
        system_kw: 'systemSize',
        system_cost: 'systemCost'
      },
      results: ['annualSavings', 'monthlySavings', 'paybackYears', 'savings25yr'],
      labels: {
        annualSavings: 'Annual savings',
        monthlySavings: 'Monthly savings',
        paybackYears: 'Payback period',
        savings25yr: '25-year savings'
      }
    },
    '/calculators/carbon/': {
      type: 'carbon',
      inputs: {
        system_kw: 'systemSize',
        emission_factor: 'emissionSelect',
        custom_emission: 'emissionCustom'
      },
      results: ['annualGen', 'co2Offset', 'treesPlanted', 'carMiles'],
      labels: {
        annualGen: 'Annual generation',
        co2Offset: 'CO2 offset',
        treesPlanted: 'Equivalent trees',
        carMiles: 'Car miles avoided'
      }
    }
  };

  function normalizePath(pathname) {
    return pathname.replace(/\/index\.html$/, '/');
  }

  function getConfig() {
    return configs[normalizePath(window.location.pathname)] || null;
  }

  function track(name, detail) {
    if (typeof window.pvTrack === 'function') {
      window.pvTrack(name, detail || {});
    }
  }

  function isExternalReferrer() {
    if (!document.referrer) return false;
    try {
      var referrerUrl = new URL(document.referrer);
      return referrerUrl.host && referrerUrl.host !== window.location.host;
    } catch (err) {
      return false;
    }
  }

  function setFieldValue(id, value) {
    if (value == null || value === '') return;
    var field = document.getElementById(id);
    if (!field) return;
    field.value = value;
    try {
      field.dispatchEvent(new Event('change', { bubbles: true }));
    } catch (err) {}
  }

  function collectInputs(config) {
    var values = {};
    Object.keys(config.inputs).forEach(function (param) {
      var field = document.getElementById(config.inputs[param]);
      if (field && field.value) values[param] = field.value;
    });
    return values;
  }

  function collectSummary(config) {
    var parts = ['Technical feedback wanted: assumptions are editable and easy to challenge.', 'PVSize result'];
    config.results.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      var value = (el.textContent || '').trim();
      if (!value || value === '-') return;
      parts.push((config.labels[id] || id) + ': ' + value);
    });
    parts.push('Editable inputs: tweak the calculator page assumptions, then share or copy the result.');
    parts.push('Calculator: ' + window.location.origin + window.location.pathname);
    return parts.join('\n');
  }

  function buildShareUrl(config) {
    var url = new URL(window.location.origin + window.location.pathname);
    var inputs = collectInputs(config);
    Object.keys(inputs).forEach(function (key) {
      url.searchParams.set(key, inputs[key]);
    });
    url.searchParams.set('autocalc', '1');
    url.searchParams.set('utm_source', 'result_share');
    url.searchParams.set('utm_medium', 'copy_link');
    url.searchParams.set('utm_campaign', config.type + '_result');
    url.searchParams.set('utm_content', 'technical_feedback_wanted');
    return url.toString();
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', 'readonly');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
    return Promise.resolve();
  }

  function setStatus(container, text) {
    var status = container.querySelector('[data-pv-result-status]');
    if (!status) return;
    status.textContent = text;
    window.setTimeout(function () {
      status.textContent = '';
    }, 2400);
  }

  function applyEmbedMode() {
    var params = new URLSearchParams(window.location.search);
    if (params.get('embed') !== '1') return;
    document.documentElement.classList.add('pv-embed-mode');
    document.body.classList.add('pv-embed-mode');
    if (document.getElementById('pv-embed-style')) return;
    var style = document.createElement('style');
    style.id = 'pv-embed-style';
    style.textContent = [
      'body.pv-embed-mode nav,',
      'body.pv-embed-mode #pv-main-hero,',
      'body.pv-embed-mode #pv-share-strip,',
      'body.pv-embed-mode #pv-lead-capture,',
      'body.pv-embed-mode #pv-installer-cta,',
      'body.pv-embed-mode #pv-site-footer { display: none !important; }',
      'body.pv-embed-mode #pv-calculator-shell { padding-top: 16px !important; padding-bottom: 16px !important; }',
      'body.pv-embed-mode #pv-calculator-shell > div { border-radius: 16px !important; padding: 16px !important; box-shadow: none !important; }',
      'body.pv-embed-mode #results { margin-top: 20px !important; }'
    ].join('\n');
    document.head.appendChild(style);
  }

  function makeButton(label, action) {
    var button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.className = 'px-4 py-3 rounded-lg font-semibold text-sm border border-slate-300 bg-white text-slate-800 hover:border-[#F5A623] hover:shadow-sm';
    button.addEventListener('click', action);
    return button;
  }

  function ensureTools(config) {
    if (document.getElementById('pv-result-tools')) return;
    var results = document.getElementById('results');
    if (!results || results.classList.contains('hidden')) return;
    var inner = results.querySelector('.bg-gray-50') || results;
    var container = document.createElement('div');
    container.id = 'pv-result-tools';
    container.className = 'mt-6 rounded-xl border border-slate-200 bg-white p-5';
    container.innerHTML =
      '<div class="flex flex-col gap-4">' +
      '<div><h4 class="text-sm font-bold text-slate-900">Use or share this result</h4>' +
      '<p class="text-xs text-slate-500 mt-1">Copy the estimate, share a link with the same inputs, print it, or leave quick feedback.</p></div>' +
      '<div data-pv-result-actions class="grid sm:grid-cols-3 gap-3"></div>' +
      '<div class="border-t border-slate-100 pt-4">' +
      '<p class="text-sm font-semibold text-slate-800 mb-3">Was this estimate useful?</p>' +
      '<div data-pv-feedback-buttons class="flex flex-wrap gap-2 mb-3"></div>' +
      '<textarea data-pv-feedback-text rows="2" class="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Optional: what looked inaccurate or confusing?"></textarea>' +
      '<button type="button" data-pv-feedback-submit class="mt-3 px-4 py-2 rounded-lg font-semibold text-sm bg-[#1a2a3a] text-[#F5A623]">Send feedback</button>' +
      '</div>' +
      '<p data-pv-result-status class="text-xs text-emerald-700 min-h-[1rem]"></p>' +
      '</div>';

    var actions = container.querySelector('[data-pv-result-actions]');
    actions.appendChild(makeButton('Copy result summary', function () {
      copyText(collectSummary(config)).then(function () {
        setStatus(container, 'Result summary copied.');
        track('result_copy', { calculator_type: config.type, copy_type: 'summary' });
      });
    }));
    actions.appendChild(makeButton('Copy share link', function () {
      copyText(buildShareUrl(config)).then(function () {
        setStatus(container, 'Share link copied.');
        track('result_share', { calculator_type: config.type, share_type: 'copy_link' });
      });
    }));
    actions.appendChild(makeButton('Download / print result', function () {
      track('result_share', { calculator_type: config.type, share_type: 'print' });
      window.print();
    }));

    var selectedRating = '';
    var feedbackButtons = container.querySelector('[data-pv-feedback-buttons]');
    ['Yes', 'Partly', 'No'].forEach(function (label) {
      var button = makeButton(label, function () {
        selectedRating = label.toLowerCase();
        Array.prototype.forEach.call(feedbackButtons.querySelectorAll('button'), function (item) {
          item.classList.remove('border-[#F5A623]', 'bg-amber-50');
        });
        button.classList.add('border-[#F5A623]', 'bg-amber-50');
      });
      feedbackButtons.appendChild(button);
    });

    container.querySelector('[data-pv-feedback-submit]').addEventListener('click', function () {
      var text = container.querySelector('[data-pv-feedback-text]').value || '';
      fetch('/api/feedback/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          rating: selectedRating || 'unset',
          calculator_type: config.type,
          feedback_text: text.slice(0, 1000),
          page: window.location.pathname,
          source: new URLSearchParams(window.location.search).get('source') || '',
          website: ''
        })
      }).then(function (response) {
        if (!response.ok) throw new Error('feedback_failed');
        track('feedback_submit', {
          calculator_type: config.type,
          rating: selectedRating || 'unset',
          feedback_length: text.length
        });
        setStatus(container, 'Feedback recorded. Thank you.');
      }).catch(function () {
        track('feedback_submit_error', {
          calculator_type: config.type,
          rating: selectedRating || 'unset',
          feedback_length: text.length
        });
        setStatus(container, 'Feedback could not be sent. Please try again.');
      });
    });

    inner.appendChild(container);
  }

  function applyPrefill(config) {
    var params = new URLSearchParams(window.location.search);
    Object.keys(config.inputs).forEach(function (param) {
      setFieldValue(config.inputs[param], params.get(param));
    });
    if (params.get('autocalc') === '1') {
      window.setTimeout(function () {
        var button = document.getElementById('calcBtn');
        if (!button) return;
        button.dataset.pvAutoTriggered = '1';
        button.click();
        window.setTimeout(function () {
          delete button.dataset.pvAutoTriggered;
        }, 0);
      }, 350);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var config = getConfig();
    if (!config) return;
    var params = new URLSearchParams(window.location.search);
    applyEmbedMode();
    applyPrefill(config);

    if (params.get('utm_source') || params.get('utm_medium') || params.get('utm_campaign') || isExternalReferrer()) {
      track('external_landing', {
        calculator_type: config.type,
        source: params.get('source') || '',
        utm_source: params.get('utm_source') || '',
        utm_medium: params.get('utm_medium') || '',
        utm_campaign: params.get('utm_campaign') || ''
      });
    }

    document.addEventListener('click', function (event) {
      if (event.target && event.target.id === 'calcBtn') {
        window.setTimeout(function () {
          ensureTools(config);
        }, 120);
      }
    });
  });
})();
