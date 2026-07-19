/**
 * PVSize Country Context — shared configuration
 * Single source of truth for country defaults: locale, currency, area unit.
 * Cost, electricity price, incentive percentage MUST NOT be auto-generated
 * from this file. They require verified data sources.
 *
 * Last reviewed: 2026-07-19
 */
(function () {
  'use strict';

  var COUNTRY_CONTEXT = {
    us: { locale: 'en-US', currency: 'USD', areaUnit: 'sqft', countryName: 'United States' },
    uk: { locale: 'en-GB', currency: 'GBP', areaUnit: 'sqm',   countryName: 'United Kingdom' },
    au: { locale: 'en-AU', currency: 'AUD', areaUnit: 'sqm',   countryName: 'Australia' },
    ca: { locale: 'en-CA', currency: 'CAD', areaUnit: 'sqm',   countryName: 'Canada' },
    de: { locale: 'de-DE', currency: 'EUR', areaUnit: 'sqm',   countryName: 'Germany' },
    fr: { locale: 'fr-FR', currency: 'EUR', areaUnit: 'sqm',   countryName: 'France' },
    nl: { locale: 'nl-NL', currency: 'EUR', areaUnit: 'sqm',   countryName: 'Netherlands' },
    be: { locale: 'nl-BE', currency: 'EUR', areaUnit: 'sqm',   countryName: 'Belgium' },
    es: { locale: 'es-ES', currency: 'EUR', areaUnit: 'sqm',   countryName: 'Spain' },
    it: { locale: 'it-IT', currency: 'EUR', areaUnit: 'sqm',   countryName: 'Italy' },
    ie: { locale: 'en-IE', currency: 'EUR', areaUnit: 'sqm',   countryName: 'Ireland' },
    jp: { locale: 'ja-JP', currency: 'JPY', areaUnit: 'sqm',   countryName: 'Japan' },
    kr: { locale: 'ko-KR', currency: 'KRW', areaUnit: 'sqm',   countryName: 'South Korea' },
    in: { locale: 'en-IN', currency: 'INR', areaUnit: 'sqm',   countryName: 'India' },
    nz: { locale: 'en-NZ', currency: 'NZD', areaUnit: 'sqm',   countryName: 'New Zealand' },
    ch: { locale: 'de-CH', currency: 'CHF', areaUnit: 'sqm',   countryName: 'Switzerland' },
    ae: { locale: 'ar-AE', currency: 'AED', areaUnit: 'sqm',   countryName: 'UAE' },
    sa: { locale: 'ar-SA', currency: 'SAR', areaUnit: 'sqm',   countryName: 'Saudi Arabia' },
    qa: { locale: 'ar-QA', currency: 'QAR', areaUnit: 'sqm',   countryName: 'Qatar' },
    kw: { locale: 'ar-KW', currency: 'KWD', areaUnit: 'sqm',   countryName: 'Kuwait' },
    bh: { locale: 'ar-BH', currency: 'BHD', areaUnit: 'sqm',   countryName: 'Bahrain' },
    om: { locale: 'ar-OM', currency: 'OMR', areaUnit: 'sqm',   countryName: 'Oman' },
    id: { locale: 'id-ID', currency: 'IDR', areaUnit: 'sqm',   countryName: 'Indonesia' },
    th: { locale: 'th-TH', currency: 'THB', areaUnit: 'sqm',   countryName: 'Thailand' },
    ph: { locale: 'en-PH', currency: 'PHP', areaUnit: 'sqm',   countryName: 'Philippines' },
    vn: { locale: 'vi-VN', currency: 'VND', areaUnit: 'sqm',   countryName: 'Vietnam' },
    my: { locale: 'ms-MY', currency: 'MYR', areaUnit: 'sqm',   countryName: 'Malaysia' },
    sg: { locale: 'en-SG', currency: 'SGD', areaUnit: 'sqm',   countryName: 'Singapore' },
    tw: { locale: 'zh-TW', currency: 'TWD', areaUnit: 'sqm',   countryName: 'Taiwan' },
    hk: { locale: 'zh-HK', currency: 'HKD', areaUnit: 'sqm',   countryName: 'Hong Kong' },
    pk: { locale: 'en-PK', currency: 'PKR', areaUnit: 'sqm',   countryName: 'Pakistan' },
    bd: { locale: 'bn-BD', currency: 'BDT', areaUnit: 'sqm',   countryName: 'Bangladesh' },
    lk: { locale: 'si-LK', currency: 'LKR', areaUnit: 'sqm',   countryName: 'Sri Lanka' }
  };

  /**
   * Get country context by code.
   * Returns null for unknown codes — caller must handle fallback.
   */
  function getCountryContext(countryCode) {
    if (!countryCode) return null;
    return COUNTRY_CONTEXT[countryCode] || null;
  }

  /**
   * Format a numeric value as currency using Intl.NumberFormat.
   * Returns formatted string if currencyCode is known, otherwise formatted number without symbol.
   * Never defaults to '$'.
   */
  function formatCurrency(value, countryCode) {
    if (value == null || isNaN(value)) return '—';
    var ctx = COUNTRY_CONTEXT[countryCode];
    if (!ctx || !ctx.currency || !ctx.locale) {
      // No currency context: return formatted number only, no symbol
      return Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 });
    }
    try {
      return new Intl.NumberFormat(ctx.locale, {
        style: 'currency',
        currency: ctx.currency,
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
      }).format(value);
    } catch (e) {
      // Fallback if Intl fails (e.g. unsupported locale)
      return ctx.currency + ' ' + Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 });
    }
  }

  /**
   * Get currency symbol for a country code.
   * Returns empty string if unknown — caller must not default to '$'.
   */
  function getCurrencySymbol(countryCode) {
    var ctx = COUNTRY_CONTEXT[countryCode];
    if (!ctx || !ctx.currency) return '';
    return ctx.currency;
  }

  /**
   * Get default area unit for a country.
   * Returns 'sqm' if unknown (metric is the global default).
   */
  function getAreaUnit(countryCode) {
    var ctx = COUNTRY_CONTEXT[countryCode];
    if (!ctx) return 'sqm';
    return ctx.areaUnit || 'sqm';
  }

  // Expose
  window.PVCountryContext = {
    get: getCountryContext,
    formatCurrency: formatCurrency,
    getCurrencySymbol: getCurrencySymbol,
    getAreaUnit: getAreaUnit,
    COUNTRY_CONTEXT: COUNTRY_CONTEXT
  };
})();
