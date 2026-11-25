/**
 * VYOMARC Instant Quote Estimator
 * Dynamic calculation, live breakdown, WhatsApp pre-fill & PDF export
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const requirementRadios = document.querySelectorAll('input[name="requirementType"]');
  const businessSelect = document.getElementById('businessTypeSelect');
  const otherBusinessWrapper = document.getElementById('otherBusinessWrapper');
  const otherBusinessInput = document.getElementById('otherBusinessInput');
  const featureCheckboxes = document.querySelectorAll('.feature-checkbox');
  const adminPanelCheckbox = document.getElementById('adminPanelCheckbox');
  const seoCheckboxes = document.querySelectorAll('.seo-checkbox');

  // Result Elements
  const livePriceEl = document.getElementById('livePriceDisplay');
  const breakdownListEl = document.getElementById('breakdownList');
  const btnShareWhatsApp = document.getElementById('btnShareWhatsApp');
  const btnDownloadPdf = document.getElementById('btnDownloadPdf');

  // Print Elements
  const printQuoteDateEl = document.getElementById('printQuoteDate');

  if (printQuoteDateEl) {
    printQuoteDateEl.textContent = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  // Base Package Matrix
  const PACKAGES = {
    'landing': {
      name: 'Landing Page',
      price: 5999,
      freeFeatures: 5
    },
    '3-page': {
      name: '3-Page Website',
      price: 9999,
      freeFeatures: 4
    },
    '5-page': {
      name: '5-Page Website',
      price: 15999,
      freeFeatures: 5
    },
    'pwa': {
      name: 'Progressive Web App (PWA)',
      price: 19999,
      freeFeatures: 5
    },
    'android': {
      name: 'Android App',
      price: 29999,
      freeFeatures: 5
    }
  };

  // Google Apps Script endpoint for silent logging
  const TRACKING_URL = 'https://script.google.com/macros/s/AKfycbwxw4uDokRN690sgluOkolbYruAF5s9CZl5rXbKis7qyGblBccQDzE6snDakWGoYXIp0Q/exec';

  // Toggle Other Business text input
  function handleBusinessTypeChange() {
    if (businessSelect.value === 'Other') {
      otherBusinessWrapper.classList.add('active');
      otherBusinessInput.focus();
    } else {
      otherBusinessWrapper.classList.remove('active');
    }
    calculateQuote();
  }

  businessSelect.addEventListener('change', handleBusinessTypeChange);
  otherBusinessInput.addEventListener('input', calculateQuote);

  // Attach event listeners to all interactive inputs
  requirementRadios.forEach(radio => radio.addEventListener('change', calculateQuote));
  featureCheckboxes.forEach(cb => cb.addEventListener('change', calculateQuote));
  if (adminPanelCheckbox) {
    adminPanelCheckbox.addEventListener('change', calculateQuote);
  }
  seoCheckboxes.forEach(cb => cb.addEventListener('change', calculateQuote));

  // Main Calculation Function
  function calculateQuote() {
    // 1. Selected Requirement Package
    let selectedReq = '5-page';
    requirementRadios.forEach(radio => {
      if (radio.checked) selectedReq = radio.value;
    });

    const currentPkg = PACKAGES[selectedReq] || PACKAGES['5-page'];
    let basePrice = currentPkg.price;
    let includedFeaturesCount = currentPkg.freeFeatures;

    // 2. Business Type
    let businessLabel = businessSelect.value;
    if (businessLabel === 'Other' && otherBusinessInput.value.trim() !== '') {
      businessLabel = `Other (${otherBusinessInput.value.trim()})`;
    }

    // 3. Features & Add-ons
    let selectedStandardFeatures = [];
    featureCheckboxes.forEach(cb => {
      if (cb.checked) {
        selectedStandardFeatures.push(cb.getAttribute('data-feature-name') || cb.value);
      }
    });

    // Extra feature calculation (+₹1,000 per extra feature beyond base allowance)
    let extraFeaturesCount = Math.max(0, selectedStandardFeatures.length - includedFeaturesCount);
    let extraFeaturesCost = extraFeaturesCount * 1000;

    // 4. Admin Panel (+₹5,000)
    let adminPanelCost = 0;
    const hasAdminPanel = adminPanelCheckbox && adminPanelCheckbox.checked;
    if (hasAdminPanel) {
      adminPanelCost = 5000;
    }

    // 5. SEO Add-ons
    let seoCost = 0;
    let selectedSeoList = [];
    seoCheckboxes.forEach(cb => {
      if (cb.checked) {
        const cost = parseInt(cb.getAttribute('data-cost') || '0', 10);
        seoCost += cost;
        selectedSeoList.push(cb.getAttribute('data-name') || cb.value);
      }
    });

    // 6. Total Calculation
    const totalPrice = basePrice + extraFeaturesCost + adminPanelCost + seoCost;
    const formattedTotal = '₹' + totalPrice.toLocaleString('en-IN');

    // Update Live Price Display
    if (livePriceEl) {
      livePriceEl.textContent = formattedTotal;
    }

    // Build Itemized Breakdown
    if (breakdownListEl) {
      let breakdownHtml = `
        <li class="breakdown-item">
          <span>${currentPkg.name} (Base)</span>
          <span>₹${basePrice.toLocaleString('en-IN')}</span>
        </li>
        <li class="breakdown-item">
          <span>Industry / Type</span>
          <span>${businessLabel}</span>
        </li>
        <li class="breakdown-item">
          <span>Included Features (${Math.min(selectedStandardFeatures.length, includedFeaturesCount)} of ${includedFeaturesCount} free)</span>
          <span>Included</span>
        </li>
      `;

      if (extraFeaturesCost > 0) {
        breakdownHtml += `
          <li class="breakdown-item">
            <span>Extra Features (${extraFeaturesCount} &times; ₹1,000)</span>
            <span>+₹${extraFeaturesCost.toLocaleString('en-IN')}</span>
          </li>
        `;
      }

      if (hasAdminPanel) {
        breakdownHtml += `
          <li class="breakdown-item">
            <span>Basic Admin Dashboard</span>
            <span>+₹${adminPanelCost.toLocaleString('en-IN')}</span>
          </li>
        `;
      }

      if (selectedSeoList.length > 0) {
        breakdownHtml += `
          <li class="breakdown-item">
            <span>SEO: ${selectedSeoList.join(', ')}</span>
            <span>+₹${seoCost.toLocaleString('en-IN')}</span>
          </li>
        `;
      }

      breakdownListEl.innerHTML = breakdownHtml;
    }

    // Prepare WhatsApp Message
    const waFeatures = selectedStandardFeatures.length > 0 ? selectedStandardFeatures.join(', ') : 'Standard';
    const waAdmin = hasAdminPanel ? 'Yes (+₹5,000)' : 'No';
    const waSeo = selectedSeoList.length > 0 ? selectedSeoList.join(', ') : 'None';

    const waText = `Hello VYOMARC Team, I generated a custom estimate using your Instant Quote Estimator:%0A%0A` +
      `*Package:* ${currentPkg.name} (Base: ₹${basePrice.toLocaleString('en-IN')})%0A` +
      `*Business Type:* ${businessLabel}%0A` +
      `*Features Selected:* ${waFeatures}%0A` +
      `*Admin Dashboard:* ${waAdmin}%0A` +
      `*SEO Choice:* ${waSeo}%0A` +
      `*Estimated Price:* ${formattedTotal}%0A%0A` +
      `Please review this specification and let me know the timeline to begin development.`;

    btnShareWhatsApp.href = `https://wa.me/918252702699?text=${waText}`;

    // Store state for tracking
    window.__currentQuoteState = {
      package: currentPkg.name,
      business: businessLabel,
      features: waFeatures,
      admin: waAdmin,
      seo: waSeo,
      total: formattedTotal
    };
  }

  // Silent Google Apps Script Logging
  function logQuoteEvent(actionType) {
    const state = window.__currentQuoteState || {};
    try {
      fetch(TRACKING_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          tool: 'Quote Estimator',
          input: `Action: ${actionType} | Package: ${state.package || 'N/A'} | Business: ${state.business || 'N/A'} | Features: ${state.features || 'N/A'} | Admin: ${state.admin || 'N/A'} | SEO: ${state.seo || 'N/A'}`,
          result: `Estimated Price: ${state.total || 'N/A'}`,
          city: 'Unknown'
        })
      });
    } catch (err) {
      // Silent fail
    }
  }

  // Action Buttons
  btnShareWhatsApp.addEventListener('click', () => {
    logQuoteEvent('Share on WhatsApp');
  });

  btnDownloadPdf.addEventListener('click', (e) => {
    e.preventDefault();
    logQuoteEvent('Download Quote as PDF');
    window.print();
  });

  // FAQ Accordion (Homepage Logic)
  var questions = document.querySelectorAll('.faq-question');

  questions.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopImmediatePropagation();
      var expanded = this.getAttribute('aria-expanded') === 'true';
      var answerId = this.getAttribute('aria-controls');
      var answer   = document.getElementById(answerId);

      /* Close all others */
      questions.forEach(function (other) {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          var otherId = other.getAttribute('aria-controls');
          var otherAnswer = document.getElementById(otherId);
          if (otherAnswer) {
            otherAnswer.setAttribute('aria-hidden', 'true');
          }
          var otherItem = other.closest('.faq-item');
          if (otherItem) {
            otherItem.classList.remove('open');
          }
        }
      });

      /* Toggle current */
      var nextState = !expanded;
      this.setAttribute('aria-expanded', String(nextState));
      if (answer) {
        answer.setAttribute('aria-hidden', String(!nextState));
      }
      var parentItem = this.closest('.faq-item');
      if (parentItem) {
        parentItem.classList.toggle('open', nextState);
      }
    }, true);
  });

  // Initial Calculation
  calculateQuote();
});
