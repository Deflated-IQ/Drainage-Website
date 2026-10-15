// ============================================================
// GOOGLE ADS & CONVERSION TRACKING
// Drainage Repair Services Ltd — 01865 236211
// ============================================================

/**
 * GOOGLE ADS CONFIGURATION
 * ------------------------------------------------------------
 * 1. Replace 'AW-CONVERSION_ID' below with your Google Ads Tag ID (e.g. 'AW-123456789').
 * 2. If you use specific conversion labels, paste them below.
 * 3. Phone calls and contact form submissions are automatically tracked as conversions.
 */
const GOOGLE_ADS_CONFIG = {
  conversionId: 'AW-CONVERSION_ID',          // e.g. 'AW-123456789'
  phoneCallConversionLabel: '',             // e.g. 'AbCdEfGhIjKlMnOpQrS' (Optional)
  formSubmitConversionLabel: ''             // e.g. 'ZyXwVuTsRqPoNmLkJiH' (Optional)
};

/**
 * Dispatch Google Ads conversion event safely
 */
function trackGoogleAdsConversion(action, label) {
  if (typeof window.gtag === 'function') {
    const payload = {
      event_category: 'Lead',
      event_label: label,
      value: 1.0,
      currency: 'GBP'
    };

    if (GOOGLE_ADS_CONFIG.conversionId && GOOGLE_ADS_CONFIG.conversionId !== 'AW-CONVERSION_ID') {
      let sendTo = GOOGLE_ADS_CONFIG.conversionId;
      if (action === 'phone_call' && GOOGLE_ADS_CONFIG.phoneCallConversionLabel) {
        sendTo += '/' + GOOGLE_ADS_CONFIG.phoneCallConversionLabel;
      } else if (action === 'form_submission' && GOOGLE_ADS_CONFIG.formSubmitConversionLabel) {
        sendTo += '/' + GOOGLE_ADS_CONFIG.formSubmitConversionLabel;
      }
      payload.send_to = sendTo;
    }

    window.gtag('event', 'conversion', payload);
    console.log('[Google Ads] Tracked conversion:', action, payload);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Track all telephone link clicks (phone calls are the primary conversion for emergency drainage)
  document.querySelectorAll('a[href^="tel:"]').forEach(function(link) {
    link.addEventListener('click', function() {
      const phoneNumber = link.getAttribute('href').replace('tel:', '');
      trackGoogleAdsConversion('phone_call', 'Phone Call: ' + phoneNumber);
    });
  });

  // Track contact form submissions
  const forms = document.querySelectorAll('form');
  forms.forEach(function(form) {
    form.addEventListener('submit', function() {
      trackGoogleAdsConversion('form_submission', 'Contact Form Submission');
    });
  });
});
