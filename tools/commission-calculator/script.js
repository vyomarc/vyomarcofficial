// Commission Loss Calculator Script
document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const dailyOrdersInput = document.getElementById('daily-orders');
  const orderValueInput = document.getElementById('order-value');
  const commissionRateInput = document.getElementById('commission-rate');
  const calcBtn = document.getElementById('btn-calculate-loss');

  const resultsWrapper = document.getElementById('results-wrapper');
  const shockNumber = document.getElementById('shock-annual-loss');
  const dailyLossVal = document.getElementById('daily-loss-val');
  const monthlyLossVal = document.getElementById('monthly-loss-val');
  const annualLossVal = document.getElementById('annual-loss-val');

  const barFillZomato = document.getElementById('bar-fill-zomato');
  const barCutText = document.getElementById('bar-cut-text');

  const ctaLossHeadline = document.getElementById('cta-loss-headline');

  // Format currency into Indian Comma System
  function formatINR(val) {
    const rounded = Math.round(val);
    return '₹' + rounded.toLocaleString('en-IN');
  }

  // Calculate losses
  function calculateLosses() {
    const dailyOrders = parseFloat(dailyOrdersInput.value) || 0;
    const orderValue = parseFloat(orderValueInput.value) || 0;
    const commissionRate = parseFloat(commissionRateInput.value) || 0;

    // Formulas:
    // Daily Loss = (Avg Order Value * Commission Rate) / 100 * Daily Orders
    // Monthly Loss = Daily Loss * 30
    // Annual Loss = Monthly Loss * 12
    const dailyLoss = (orderValue * commissionRate / 100) * dailyOrders;
    const monthlyLoss = dailyLoss * 30;
    const annualLoss = monthlyLoss * 12;

    // Update DOM
    shockNumber.textContent = formatINR(annualLoss);
    dailyLossVal.textContent = formatINR(dailyLoss);
    monthlyLossVal.textContent = formatINR(monthlyLoss);
    annualLossVal.textContent = formatINR(annualLoss);

    // Update Dynamic CTA
    ctaLossHeadline.innerHTML = `Stop losing <span>${(annualLoss >= 100000 ? '₹' + (annualLoss / 100000).toFixed(2) + ' Lakhs' : formatINR(annualLoss))}</span>/year.`;

    // Update Graph
    const barWidthPercent = Math.min(100, Math.max(15, commissionRate * 2.5));
    barFillZomato.style.width = `${barWidthPercent}%`;
    barCutText.textContent = `${commissionRate}% Cut (${formatINR(annualLoss)}/yr)`;

    const calculatedAnnualLoss = formatINR(annualLoss);
    // --- Google Sheet Tracking Logic Start ---
    try {
      fetch('https://script.google.com/macros/s/AKfycbwxw4uDokRN690sgluOkolbYruAF5s9CZl5rXbKis7qyGblBccQDzE6snDakWGoYXIp0Q/exec', {
        method: 'POST',
        mode: 'no-cors', // Required for Google Apps Script
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          tool: 'Commission Calculator',
          input: 'Daily Orders: ' + dailyOrders + ', Order Value: ' + orderValue + ', Comm: ' + commissionRate + '%',
          result: 'Annual Loss: ' + calculatedAnnualLoss,
          city: 'Unknown'
        })
      });
    } catch (error) {
      // Silently ignore errors so user experience isn't affected
      console.log('Tracking failed');
    }
    // --- Google Sheet Tracking Logic End ---

    // Reveal Results
    resultsWrapper.classList.add('visible');

    // Smooth Scroll to Results
    setTimeout(() => {
      resultsWrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }

  // Button click listener
  if (calcBtn) {
    calcBtn.addEventListener('click', (e) => {
      e.preventDefault();
      calculateLosses();
    });
  }

  // Re-calculate if inputs change when results are already visible
  [dailyOrdersInput, orderValueInput, commissionRateInput].forEach(input => {
    if (input) {
      input.addEventListener('input', () => {
        if (resultsWrapper && resultsWrapper.classList.contains('visible')) {
          calculateLosses();
        }
      });
    }
  });
});

// FAQ Accordion Logic
document.addEventListener('DOMContentLoaded', function() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', function(e) {
      e.stopImmediatePropagation();
      const answer = this.nextElementSibling;
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      
      // Close others
      faqQuestions.forEach(q => {
        q.setAttribute('aria-expanded', 'false');
        if (q.nextElementSibling) {
          q.nextElementSibling.classList.remove('active');
          q.nextElementSibling.setAttribute('aria-hidden', 'true');
        }
      });

      // Toggle current
      if (!isExpanded) {
        this.setAttribute('aria-expanded', 'true');
        if (answer) {
          answer.classList.add('active');
          answer.setAttribute('aria-hidden', 'false');
        }
      }
    }, true);
  });
});
