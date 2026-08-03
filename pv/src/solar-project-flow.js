(function () {
  if (window.__pvSolarProjectFlowLoaded) return;
  window.__pvSolarProjectFlowLoaded = true;

  var flows = {
    '/calculators/panel-count/': {
      type: 'panel_count',
      title: 'Solar Project Summary',
      next: { label: 'Continue to savings calculation', to: 'savings', href: '/calculators/savings/', campaign: 'panel_to_savings' }
    },
    '/calculators/savings/': {
      type: 'savings',
      title: 'Solar Project Summary',
      next: { label: 'Continue to battery calculation', to: 'battery_sizing', href: '/calculators/battery-sizing/', campaign: 'savings_to_battery' }
    },
    '/calculators/battery-sizing/': {
      type: 'battery_sizing',
      title: 'Solar Project Summary',
      next: { label: 'Continue to system size calculation', to: 'panel_count', href: '/calculators/panel-count/', campaign: 'battery_to_panel' }
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
    return el && /^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName) ? (el.value || '').trim() : '';
  }

  function escapeHtml(raw) {
    return String(raw || '').replace(/[&<>"']/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
    });
  }

  function fallbackState() {
    // Derive country context dynamically; never hardcode a US label/symbol.
    var code = 'us';
    var ctx = (window.PVCountryContext && window.PVCountryContext.get) ? window.PVCountryContext.get(code) : null;
    var label = (ctx && ctx.countryName) ? ctx.countryName : 'United States';
    var currency = (ctx && ctx.currency) ? ctx.currency : 'USD';
    var areaUnit = (ctx && ctx.areaUnit) ? ctx.areaUnit : 'sqft';
    return {
      country: code, countryLabel: label, countryName: label, currency: currency, currencySymbol: currency,
      electricityRate: 0.17, sunHours: 4.5, systemLoss: 20, panelWattage: 400, monthlyKwh: 1000,
      roofArea: 600, areaUnit: areaUnit, installCostRange: '$2.50-$3.50/W', hasFinancialDefaults: true
    };
  }

  function state() {
    return window.PVCalculationState ? window.PVCalculationState.get() : fallbackState();
  }

  function buildNextUrl(flow) {
    var extra = {
      utm_source: 'calculator_result',
      utm_medium: 'next_step',
      utm_campaign: flow.next.campaign
    };
    if (window.PVCalculationState) return window.PVCalculationState.buildUrl(flow.next.href, extra);
    var url = new URL(flow.next.href, window.location.origin);
    Object.keys(extra).forEach(function (key) { url.searchParams.set(key, extra[key]); });
    return url.pathname + '?' + url.searchParams.toString();
  }

  function commonAssumptions(current) {
    var countryName = current.countryName || current.countryLabel || (current.country || 'us');
    if (current.hasFinancialDefaults) {
      return 'Based on ' + countryName + ' defaults: ' + Number(current.electricityRate).toFixed(2) + '/kWh, ' +
        Number(current.sunHours).toFixed(1) + ' peak sun-hours/day, ' +
        Number(current.systemLoss).toFixed(0) + '% system losses, ' +
        Number(current.panelWattage).toFixed(0) + ' W panels. Inputs remain editable.';
    }
    // No local financial defaults: do not substitute US values. Prompt for input.
    var sunNote = current.sunHoursIsGeneric ? ' (generic planning default, not a measured value)' : '';
    return 'Location identified as ' + countryName + '. Enter your local electricity rate and installation cost for a financial estimate.' +
      ' Planning inputs: ' + Number(current.sunHours).toFixed(1) + ' peak sun-hours/day' + sunNote + ', ' +
      Number(current.systemLoss).toFixed(0) + '% system losses, ' +
      Number(current.panelWattage).toFixed(0) + ' W panels. Inputs remain editable.';
  }

  function makeSummaryLines(flow) {
    var current = state();
    if (flow.type === 'panel_count') {
      return [
        ['Panels needed for electricity use', text('panelCount') || 'Not calculated'],
        ['Maximum panels that fit the roof', text('maxPanelsFit') || 'Not calculated'],
        ['Target system capacity', text('systemSize') || 'Not calculated'],
        ['Target annual generation', text('annualGen') || 'Not calculated'],
        ['Sizing constraint', text('limitingFactor') || 'Compare electricity need with roof capacity'],
        ['Assumptions', commonAssumptions(current) + ' Gross roof area: ' + current.roofArea + ' ' + current.areaUnit + '; 75% treated as usable.'],
        ['Data source / basis', 'Monthly kWh is annualized, then divided by peak sun-hours and system efficiency. Roof fit uses panel area and a planning allowance for spacing.'],
        ['Limitations', 'Planning estimate only. Shade, setbacks, orientation, structure, fire code, inverter design, and local rules require professional verification.']
      ];
    }
    if (flow.type === 'savings') {
      return [
        ['Solar system capacity', value('systemSize') ? value('systemSize') + ' kW' : 'Not calculated'],
        ['Annual solar generation', text('annualGen') || 'Not calculated'],
        ['Estimated annual bill reduction', text('annualSavings') || 'Not calculated'],
        ['Simple payback', text('paybackYears') || 'Not calculated'],
        ['Assumptions', commonAssumptions(current) + ' Monthly use: ' + Number(current.monthlyKwh).toLocaleString() + ' kWh. Install cost basis: ' + current.installCostRange + '.'],
        ['Data source / basis', 'Solar production uses the shared sun-hours and loss assumptions. Bill reduction is capped at estimated annual consumption.'],
        ['Limitations', 'Not a quote or financial advice. Export credits, tariffs, incentives, financing, taxes, degradation, and local costs can change the result.']
      ];
    }
    return [
      ['Selected load', text('estimatedLoad') || 'Not calculated'],
      ['Backup duration', text('backupDuration') || 'Not calculated'],
      ['Required usable battery', text('usableCapacity') || 'Not calculated'],
      ['Suggested nominal battery', text('totalCapacity') || 'Not calculated'],
      ['Assumptions', text('batteryAssumptions') || 'Selected load profile, backup hours, 92% inverter efficiency, depth of discharge, and reserve margin.'],
      ['Data source / basis', 'Continuous load is multiplied by backup hours, then adjusted for inverter loss, depth of discharge, and reserve.'],
      ['Limitations', 'Not an electrician design. Starting surge, HVAC behavior, temperature derating, inverter limits, code, and measured circuits can change the requirement.']
    ];
  }

  function summaryText(flow) {
    return [flow.title].concat(makeSummaryLines(flow).map(function (row) {
      return row[0] + ': ' + row[1];
    })).join('\n');
  }

  function renderSummary(flow) {
    var results = document.getElementById('results');
    if (!results || results.classList.contains('hidden')) return;
    var panel = document.getElementById('pv-solar-project-summary');
    if (!panel) {
      panel = document.createElement('section');
      panel.id = 'pv-solar-project-summary';
      panel.className = 'mt-6 rounded-xl border border-amber-100 bg-white p-6 shadow-sm';
      var resultBody = results.querySelector('.bg-gray-50') || results;
      var related = resultBody.querySelector('#pv-related-questions');
      if (related) resultBody.insertBefore(panel, related);
      else resultBody.appendChild(panel);
    }
    var rows = makeSummaryLines(flow).map(function (row) {
      return '<div class="grid sm:grid-cols-[220px_1fr] gap-1 border-b border-slate-100 py-3">' +
        '<dt class="text-sm font-semibold text-slate-700">' + escapeHtml(row[0]) + '</dt>' +
        '<dd class="text-sm text-slate-600">' + escapeHtml(row[1]) + '</dd>' +
        '</div>';
    }).join('');
    panel.innerHTML =
      '<h3 class="text-xl font-bold mb-2" style="color:#1a2a3a">Solar Project Summary</h3>' +
      '<p class="text-sm text-slate-600 mb-4">One consistent handoff across system size, savings, and backup.</p>' +
      '<dl>' + rows + '</dl>' +
      '<div class="pv-result-actions">' +
      '<a id="pv-primary-next-step" class="bg-[#F5A623] text-[#1a2a3a]" href="' + escapeHtml(buildNextUrl(flow)) + '">' + escapeHtml(flow.next.label) + '</a>' +
      '<a id="pv-email-estimate" class="border border-[#1a2a3a] bg-white text-[#1a2a3a]" href="#pv-lead-capture">Email me this estimate</a>' +
      '</div>' +
      '<div class="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-4 text-sm">' +
      '<a id="pv-technical-feedback-link" class="underline text-slate-700" href="/technical-feedback/?utm_source=calculator_result&utm_medium=internal&utm_campaign=project_summary_feedback">Review technical assumptions</a>' +
      '<a class="underline text-slate-700" href="/request-solar-plan/?source=' + escapeHtml(flow.type) + '-result">Request a free project summary</a>' +
      '</div>';
    window.PVCalculatorSummary = summaryText(flow);
    panel.querySelector('#pv-primary-next-step').addEventListener('click', function () {
      track('next_step_click', {
        from_calculator: flow.type,
        to_calculator: flow.next.to,
        campaign: flow.next.campaign
      });
    });
    panel.querySelector('#pv-email-estimate').addEventListener('click', function () {
      track('email_estimate_click', { calculator_type: flow.type, source: 'solar_project_summary' });
    });
    panel.querySelector('#pv-technical-feedback-link').addEventListener('click', function () {
      track('technical_feedback_click', { from_calculator: flow.type, campaign: 'project_summary_feedback' });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var flow = currentFlow();
    if (!flow) return;
    document.addEventListener('click', function (event) {
      if (event.target && event.target.id === 'calcBtn') {
        window.setTimeout(function () { renderSummary(flow); }, 160);
      }
    });
  });
})();
