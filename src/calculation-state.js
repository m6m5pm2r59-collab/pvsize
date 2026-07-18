(function () {
  if (window.PVCalculationState) return;

  var STORAGE_KEY = 'pvsize_calculation_state_v1';
  var countryDefaults = {
    us: {
      country: 'us',
      countryLabel: 'United States',
      currencySymbol: '$',
      electricityRate: 0.17,
      sunHours: 4.5,
      systemLoss: 20,
      installCostPerWatt: 3.0,
      installCostRange: '$2.50-$3.50/W'
    },
    au: {
      country: 'au',
      countryLabel: 'Australia',
      currencySymbol: 'A$',
      electricityRate: 0.30,
      sunHours: 5.0,
      systemLoss: 18,
      installCostPerWatt: 1.3,
      installCostRange: 'A$1.00-A$1.60/W'
    },
    uk: {
      country: 'uk',
      countryLabel: 'United Kingdom',
      currencySymbol: '£',
      electricityRate: 0.28,
      sunHours: 3.0,
      systemLoss: 22,
      installCostPerWatt: 2.2,
      installCostRange: '£1.80-£2.60/W'
    }
  };
  var baseDefaults = {
    monthlyKwh: 1000,
    panelWattage: 400,
    roofArea: 600,
    areaUnit: 'sqft',
    panelArea: 18.7,
    monthlyBill: 170,
    systemKw: 0,
    loadMode: 'fridge_lights_internet',
    backupHours: 8,
    customLoadKw: 0,
    dailyUsage: 0,
    batteryType: 'lifepo4',
    dod: 90,
    reserve: 10
  };
  var queryNames = {
    country: ['country', 'region'],
    monthlyKwh: ['monthly_kwh', 'monthlyKwh'],
    electricityRate: ['electricity_rate', 'rate'],
    sunHours: ['sun_hours', 'sunHours'],
    panelWattage: ['panel_wattage', 'panel_watts', 'panelWattage'],
    systemLoss: ['system_loss', 'loss'],
    roofArea: ['roof_area', 'roofArea'],
    areaUnit: ['area_unit'],
    panelArea: ['panel_area'],
    monthlyBill: ['monthly_bill'],
    systemKw: ['system_kw'],
    loadMode: ['load_mode'],
    backupHours: ['backup_hours'],
    customLoadKw: ['custom_load_kw'],
    dailyUsage: ['daily_usage', 'daily_kwh'],
    batteryType: ['battery_type'],
    dod: ['dod'],
    reserve: ['reserve']
  };
  var fieldIds = {
    country: 'country',
    monthlyKwh: 'monthlyKwh',
    electricityRate: 'electricityRate',
    sunHours: 'sunHours',
    panelWattage: 'panelWattage',
    systemLoss: 'systemLoss',
    roofArea: 'roofArea',
    areaUnit: 'areaUnit',
    panelArea: 'panelArea',
    monthlyBill: 'monthlyBill',
    systemKw: 'systemSize',
    loadMode: 'loadMode',
    backupHours: 'backupHours',
    customLoadKw: 'customLoadKw',
    dailyUsage: 'dailyUsage',
    batteryType: 'batteryType',
    dod: 'dod',
    reserve: 'reserve'
  };
  var numericKeys = {
    monthlyKwh: true,
    electricityRate: true,
    sunHours: true,
    panelWattage: true,
    systemLoss: true,
    roofArea: true,
    panelArea: true,
    monthlyBill: true,
    systemKw: true,
    backupHours: true,
    customLoadKw: true,
    dailyUsage: true,
    dod: true,
    reserve: true
  };

  function readStored() {
    try {
      var stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
      return stored && typeof stored === 'object' ? stored : {};
    } catch (err) {
      return {};
    }
  }

  function firstParam(params, names) {
    for (var i = 0; i < names.length; i += 1) {
      if (params.has(names[i]) && params.get(names[i]) !== '') return params.get(names[i]);
    }
    return '';
  }

  function readQuery() {
    var params = new URLSearchParams(window.location.search);
    var patch = {};
    Object.keys(queryNames).forEach(function (key) {
      var raw = firstParam(params, queryNames[key]);
      if (raw === '') return;
      patch[key] = numericKeys[key] ? Number(raw) : raw;
    });
    var dailyKwh = Number(params.get('daily_kwh'));
    if (!patch.monthlyKwh && dailyKwh > 0) patch.monthlyKwh = dailyKwh * 30;
    var efficiency = Number(params.get('system_efficiency'));
    if (!patch.systemLoss && efficiency > 0 && efficiency <= 100) patch.systemLoss = 100 - efficiency;
    var backupDays = Number(params.get('backup_days'));
    if (!patch.backupHours && backupDays > 0) patch.backupHours = backupDays * 24;
    if (patch.dailyUsage > 0 && !patch.loadMode) patch.loadMode = 'custom';
    return patch;
  }

  function sanitize(state) {
    var clean = Object.assign({}, state);
    clean.country = countryDefaults[clean.country] ? clean.country : 'us';
    Object.keys(numericKeys).forEach(function (key) {
      var value = Number(clean[key]);
      if (Number.isFinite(value) && value >= 0) clean[key] = value;
    });
    clean.monthlyKwh = Math.max(1, Number(clean.monthlyKwh) || baseDefaults.monthlyKwh);
    clean.electricityRate = Math.max(0.01, Number(clean.electricityRate) || countryDefaults[clean.country].electricityRate);
    clean.sunHours = Math.min(8, Math.max(1, Number(clean.sunHours) || countryDefaults[clean.country].sunHours));
    clean.systemLoss = Number.isFinite(Number(clean.systemLoss))
      ? Math.min(50, Math.max(0, Number(clean.systemLoss)))
      : countryDefaults[clean.country].systemLoss;
    clean.panelWattage = Math.min(1000, Math.max(100, Number(clean.panelWattage) || baseDefaults.panelWattage));
    clean.roofArea = Math.max(1, Number(clean.roofArea) || baseDefaults.roofArea);
    clean.backupHours = Math.min(168, Math.max(1, Number(clean.backupHours) || baseDefaults.backupHours));
    clean.dod = Math.min(100, Math.max(10, Number(clean.dod) || baseDefaults.dod));
    clean.reserve = Number.isFinite(Number(clean.reserve))
      ? Math.min(40, Math.max(0, Number(clean.reserve)))
      : baseDefaults.reserve;
    return clean;
  }

  var stored = readStored();
  var query = readQuery();
  var selectedCountry = countryDefaults[query.country] ? query.country : (countryDefaults[stored.country] ? stored.country : 'us');
  if (query.country && query.country !== stored.country) {
    delete stored.electricityRate;
    delete stored.sunHours;
    delete stored.systemLoss;
    delete stored.installCostPerWatt;
    delete stored.installCostRange;
  }
  var state = sanitize(Object.assign({}, baseDefaults, countryDefaults[selectedCountry], stored, query, { country: selectedCountry }));

  function persist() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {}
  }

  function isEditableField(field) {
    return field && /^(INPUT|SELECT|TEXTAREA)$/.test(field.tagName);
  }

  function setField(key, value) {
    var field = document.getElementById(fieldIds[key]);
    if (!isEditableField(field) || value == null) return;
    if (key === 'systemKw' && Number(value) <= 0) return;
    if ((key === 'customLoadKw' || key === 'dailyUsage') && Number(value) <= 0) return;
    field.value = String(value);
  }

  function syncFields(keys) {
    (keys || Object.keys(fieldIds)).forEach(function (key) {
      setField(key, state[key]);
    });
  }

  function capture(extra) {
    var patch = Object.assign({}, extra || {});
    Object.keys(fieldIds).forEach(function (key) {
      var field = document.getElementById(fieldIds[key]);
      if (!isEditableField(field) || field.value === '') return;
      patch[key] = numericKeys[key] ? Number(field.value) : field.value;
    });
    state = sanitize(Object.assign({}, state, patch));
    persist();
    window.dispatchEvent(new CustomEvent('pv:calculation-state', { detail: getState() }));
    return getState();
  }

  function getState() {
    return Object.assign({}, countryDefaults[state.country], state);
  }

  function setCountry(country) {
    if (!countryDefaults[country]) return getState();
    state = sanitize(Object.assign({}, state, countryDefaults[country], { country: country }));
    persist();
    syncFields(['country', 'electricityRate', 'sunHours', 'systemLoss']);
    window.dispatchEvent(new CustomEvent('pv:calculation-state', { detail: getState() }));
    return getState();
  }

  function toSearchParams(extra) {
    var params = new URLSearchParams();
    var names = {
      country: 'country', monthlyKwh: 'monthly_kwh', electricityRate: 'electricity_rate',
      sunHours: 'sun_hours', panelWattage: 'panel_wattage', systemLoss: 'system_loss',
      roofArea: 'roof_area', areaUnit: 'area_unit', panelArea: 'panel_area', monthlyBill: 'monthly_bill',
      systemKw: 'system_kw', loadMode: 'load_mode', backupHours: 'backup_hours',
      customLoadKw: 'custom_load_kw', dailyUsage: 'daily_usage', batteryType: 'battery_type',
      dod: 'dod', reserve: 'reserve'
    };
    Object.keys(names).forEach(function (key) {
      var value = state[key];
      if (value != null && value !== '' && !(key === 'systemKw' && Number(value) <= 0)) params.set(names[key], String(value));
    });
    Object.keys(extra || {}).forEach(function (key) {
      if (extra[key] == null || extra[key] === '') return;
      params.set(key, String(extra[key]));
    });
    return params;
  }

  function buildUrl(path, extra) {
    var url = new URL(path, window.location.origin);
    var params = toSearchParams(extra);
    params.forEach(function (value, key) { url.searchParams.set(key, value); });
    return url.pathname + '?' + url.searchParams.toString();
  }

  window.PVCalculationState = {
    countries: countryDefaults,
    get: getState,
    capture: capture,
    setCountry: setCountry,
    syncFields: syncFields,
    toSearchParams: toSearchParams,
    buildUrl: buildUrl
  };

  document.addEventListener('DOMContentLoaded', function () {
    syncFields();
    var countryField = document.getElementById('country');
    if (isEditableField(countryField)) {
      countryField.addEventListener('change', function () { setCountry(countryField.value); });
    }
    Object.keys(fieldIds).forEach(function (key) {
      var field = document.getElementById(fieldIds[key]);
      if (!isEditableField(field) || key === 'country') return;
      field.addEventListener('change', function () { capture(); });
    });
  });
})();
