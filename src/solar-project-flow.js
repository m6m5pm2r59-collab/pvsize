(function () {
  if (window.__pvSolarProjectFlowLoaded) return;
  window.__pvSolarProjectFlowLoaded = true;

  var defaults = {
    us: { label: 'United States', rate: 0.17, sun: 4.5, loss: 20, cost: '$2.50-$3.50/W' },
    au: { label: 'Australia', rate: 0.30, sun: 5.0, loss: 18, cost: 'A$1.00-A$1.60/W' },
    uk: { label: 'United Kingdom', rate: 0.28, sun: 3.0, loss: 22, cost: 'GBP1.80-GBP2.60/W' }
  };

  var flows = {
    '/calculators/panel-count/': {
      type: 'panel_count',
      title: 'Panel Count Solar Project Summary',
      next: [
        { label: 'Next: calculate savings', to: 'savings', href: '/calculators/savings/', campaign: 'panel_to_savings' },
        { label: 'Next: estimate battery size', to: 'battery_sizing', href: '/calculators/battery-sizing/', campaign: 'panel_to_battery' }
      ]
    },
    '/calculators/savings/': {
      type: 'savings',
      title: 'Savings Solar Project Summary',
      next: [
        { label: 'Next: check panel count', to: 'panel_count', href: '/calculators/panel-count/', campaign: 'savings_to_panel' },
        { label: 'Next: estimate battery backup', to: 'battery_sizing', href: '/calculators/battery-sizing/', campaign: 'savings_to_battery' }
      ]
    },
    '/calculators/battery-sizing/': {
      type: 'battery_sizing',
      title: 'Battery Solar Project Summary',
      next: [
        { label: 'Next: check required panels', to: 'panel_count', href: '/calculators/panel-count/', campaign: 'battery_to_panel' },
        { label: 'Next: estimate annual savings', to: 'savings', href: '/calculators/savings/', campaign: 'battery_to_savings' }
      ]
    }
  };

  function normalizePath(pathname) {
    return pathname.replace(/\/index\.html$/, '/');
  }

  function currentFlow() {
    return flows[normalizePath(window.location.pathname)] || null;
  }

  function track(name, detail) {
    if (typeof window.pvTrack === 'function') window.pvTrack(name, detail || {});
  }

  function text(id) {
    var el = document.getElementById(id);
    return el ? (el.textContent || '').trim() : '';
  }

  function value(id) {
    var el = document.getElementById(id);
    return el ? (el.value || '').trim() : '';
  }

  function numberFromText(raw) {
    var n = parseFloat(String(raw || '').replace(/[^0-9.]/g, ''));
    return isNaN(n) ? 0 : n;
  }

  function selectedDefault() {
    var select = document.getElementById('pv-country-defaults');
    return defaults[select && select.value ? select.value : 'us'];
  }

  function appendParams(path, params) {
    var url = new URL(path, window.location.origin);
    Object.keys(params).forEach(function (key) {
      if (params[key] != null && params[key] !== '') url.searchParams.set(key, params[key]);
    });
    return url.pathname + '?' + url.searchParams.toString();
  }

  function buildNextUrl(item) {
    var params = {
      utm_source: 'calculator_result',
      utm_medium: 'next_step',
      utm_campaign: item.campaign
    };
    var systemKw = numberFromText(text('systemSize')) || numberFromText(value('systemSize'));
    var annualGen = numberFromText(text('annualGen'));
    var dailyUsage = numberFromText(value('dailyUsage'));
    if (systemKw) params.system_kw = systemKw.toFixed(2);
    if (annualGen) params.annual_kwh = Math.round(annualGen);
    if (dailyUsage) params.daily_usage = dailyUsage;
    if (value('monthlyBill')) params.monthly_bill = value('monthlyBill');
    if (value('panelWattage')) params.panel_wattage = value('panelWattage');
    return appendParams(item.href, params);
  }

  function ensureCountryDefaults(flow) {
    if (document.getElementById('pv-country-defaults')) return;
    var calcButton = document.getElementById('calcBtn');
    if (!calcButton || !calcButton.parentNode) return;
    var wrapper = document.createElement('div');
    wrapper.className = 'mb-5 rounded-xl border border-amber-100 bg-amber-50 p-4';
    wrapper.innerHTML =
      '<label for="pv-country-defaults" class="block text-sm font-semibold text-slate-800 mb-2">Country defaults</label>' +
      '<select id="pv-country-defaults" class="border rounded-lg px-4 py-3 w-full min-w-select bg-white">' +
      '<option value="us">United States - $0.17/kWh, 4.5 sun-hours, 20% losses</option>' +
      '<option value="au">Australia - A$0.30/kWh, 5.0 sun-hours, 18% losses</option>' +
      '<option value="uk">United Kingdom - GBP0.28/kWh, 3.0 sun-hours, 22% losses</option>' +
      '</select>' +
      '<p class="text-xs text-slate-600 mt-2">Defaults are editable planning assumptions and are repeated in the result summary.</p>';
    calcButton.parentNode.insertBefore(wrapper, calcButton);
    wrapper.querySelector('select').addEventListener('change', function () {
      applyDefaults(flow);
    });
  }

  function applyDefaults(flow) {
    var preset = selectedDefault();
    var location = document.getElementById('location');
    if (location) location.value = String(preset.sun);
    var rateSelect = document.getElementById('rateSelect');
    var rateCustom = document.getElementById('rateCustom');
    if (rateSelect && rateCustom && !rateCustom.value) {
      var hasPresetOption = Array.prototype.some.call(rateSelect.options, function (option) {
        return option.value === String(preset.rate);
      });
      if (hasPresetOption) {
        rateSelect.value = String(preset.rate);
      } else {
        rateCustom.value = String(preset.rate);
      }
    }
  }

  function makeSummaryLines(flow) {
    var preset = selectedDefault();
    var lines = [];
    var panelCount = text('panelCount');
    var systemSize = text('systemSize') || (value('systemSize') ? value('systemSize') + ' kW' : '');
    var roofArea = value('roofArea');
    var annualGen = text('annualGen');
    var annualSavings = text('annualSavings');
    var totalBattery = text('totalCapacity');
    var batteryAdvice = flow.type === 'battery_sizing' ? 'Battery has been estimated; next compare panels or savings.' : 'Yes - estimate battery backup after checking panel count and savings.';

    lines.push(['Recommended panel count / capacity', panelCount || totalBattery || 'Use the calculator result above']);
    lines.push(['System capacity', systemSize || 'Estimate from panel count or enter system size']);
    lines.push(['Roof / usable area', roofArea ? roofArea + ' ' + (value('areaUnit') || 'sq ft') + ' entered' : 'Not entered on this calculator']);
    lines.push(['Annual generation', annualGen || (systemSize ? 'Estimated from system size, sun-hours, and losses' : 'Not enough inputs yet')]);
    lines.push(['Estimated savings', annualSavings || 'Run Savings to estimate bill impact']);
    lines.push(['Continue to battery?', batteryAdvice]);
    lines.push(['Assumptions', preset.label + ': ' + preset.rate + '/kWh, ' + preset.sun + ' peak sun-hours/day, ' + preset.loss + '% system losses, install cost range ' + preset.cost + '. User inputs override defaults where available.']);
    lines.push(['Boundary', 'Planning estimate only. Local roof layout, shade, utility rules, installation pricing, incentives, and final engineering can change the result.']);
    return lines;
  }

  function summaryText(flow) {
    return [flow.title].concat(makeSummaryLines(flow).map(function (row) {
      return row[0] + ': ' + row[1];
    })).join('\n');
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

  function renderSummary(flow) {
    var results = document.getElementById('results');
    if (!results || results.classList.contains('hidden')) return;
    var panel = document.getElementById('pv-solar-project-summary');
    if (!panel) {
      panel = document.createElement('section');
      panel.id = 'pv-solar-project-summary';
      panel.className = 'mt-6 rounded-xl border border-amber-100 bg-white p-6 shadow-sm';
      results.appendChild(panel);
    }
    var rows = makeSummaryLines(flow).map(function (row) {
      return '<div class="grid sm:grid-cols-[220px_1fr] gap-1 border-b border-slate-100 py-3">' +
        '<dt class="text-sm font-semibold text-slate-700">' + row[0] + '</dt>' +
        '<dd class="text-sm text-slate-600">' + row[1] + '</dd>' +
        '</div>';
    }).join('');
    var links = flow.next.map(function (item) {
      return '<a class="pv-next-step text-center px-4 py-3 rounded-lg font-semibold text-sm bg-[#F5A623] text-[#1a2a3a] hover:opacity-90" href="' + buildNextUrl(item) + '" data-to="' + item.to + '" data-campaign="' + item.campaign + '">' + item.label + '</a>';
    }).join('');
    panel.innerHTML =
      '<h3 class="text-xl font-bold mb-2" style="color:#1a2a3a">Solar Project Summary</h3>' +
      '<p class="text-sm text-slate-600 mb-4">A compact project handoff you can copy, print, or use as the next calculator step.</p>' +
      '<dl>' + rows + '</dl>' +
      '<div class="grid sm:grid-cols-2 gap-3 mt-5">' + links + '</div>' +
      '<div class="grid sm:grid-cols-2 gap-3 mt-3">' +
      '<button type="button" id="pv-copy-project-summary" class="px-4 py-3 rounded-lg font-semibold text-sm border border-slate-300 bg-white text-slate-800">Copy project summary</button>' +
      '<button type="button" id="pv-print-project-summary" class="px-4 py-3 rounded-lg font-semibold text-sm border border-slate-300 bg-white text-slate-800">Download / print project summary</button>' +
      '</div>' +
      '<p id="pv-summary-status" class="text-xs text-emerald-700 min-h-[1rem] mt-2"></p>';
    panel.querySelector('#pv-copy-project-summary').addEventListener('click', function () {
      copyText(summaryText(flow)).then(function () {
        panel.querySelector('#pv-summary-status').textContent = 'Project summary copied.';
        track('result_copy', { calculator_type: flow.type, copy_type: 'solar_project_summary' });
      });
    });
    panel.querySelector('#pv-print-project-summary').addEventListener('click', function () {
      track('result_print', { calculator_type: flow.type, print_type: 'solar_project_summary' });
      window.print();
    });
    Array.prototype.forEach.call(panel.querySelectorAll('.pv-next-step'), function (link) {
      link.addEventListener('click', function () {
        track('next_step_click', {
          from_calculator: flow.type,
          to_calculator: link.getAttribute('data-to'),
          campaign: link.getAttribute('data-campaign')
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var flow = currentFlow();
    if (!flow) return;
    ensureCountryDefaults(flow);
    applyDefaults(flow);
    document.addEventListener('click', function (event) {
      if (event.target && event.target.id === 'calcBtn') {
        window.setTimeout(function () {
          renderSummary(flow);
        }, 160);
      }
    });
    var button = document.getElementById('calcBtn');
    if (button && button.dataset && button.dataset.pvAutoTriggered === '1') {
      window.setTimeout(function () { renderSummary(flow); }, 500);
    }
  });
})();
