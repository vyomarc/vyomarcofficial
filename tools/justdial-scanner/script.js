document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('justdial-calc-form');
  const monthlySpendInput = document.getElementById('monthly-spend');
  const monthlyLeadsInput = document.getElementById('monthly-leads');
  const clientValueInput = document.getElementById('client-value');
  const resultSection = document.getElementById('result-section');

  const shockAmountEl = document.getElementById('shock-annual-cost');
  const shockTitleEl = document.getElementById('shock-statement-title');
  const oppLostAmountEl = document.getElementById('opp-lost-amount');
  const oppNoteEl = document.getElementById('opp-note-text');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const monthlySpend = parseFloat(monthlySpendInput.value) || 0;
      const monthlyLeads = parseFloat(monthlyLeadsInput.value) || 0;
      const clientValue = parseFloat(clientValueInput.value) || 0;

      if (monthlySpend <= 0 || monthlyLeads <= 0 || clientValue <= 0) {
        alert('Please enter valid positive numbers for all three fields.');
        return;
      }

      // Calculations:
      // 1. Annual JustDial Cost = Monthly Spend * 12
      const annualCost = monthlySpend * 12;

      // 2. Lost Revenue = (Monthly Leads * 0.25) * Avg Client Value * 12 (Assuming 25% of leads are lost directly to competitors)
      const lostLeadsMonthly = Math.round(monthlyLeads * 0.25) || (monthlyLeads * 0.25);
      const lostRevenue = (monthlyLeads * 0.25) * clientValue * 12;

      const formattedAnnualCost = '₹' + Math.round(annualCost).toLocaleString('en-IN');
      const formattedLostRevenue = '₹' + Math.round(lostRevenue).toLocaleString('en-IN');

      // Update DOM
      if (shockAmountEl) {
        shockAmountEl.textContent = formattedAnnualCost;
      }
      if (shockTitleEl) {
        shockTitleEl.innerHTML = `You are spending <span style="text-decoration: underline; color: #dc2626;">${formattedAnnualCost}/year</span> just to fight for your own customers.`;
      }
      if (oppLostAmountEl) {
        oppLostAmountEl.textContent = formattedLostRevenue;
      }
      if (oppNoteEl) {
        oppNoteEl.textContent = `If you lose just ~${lostLeadsMonthly} clients a month to competing businesses bidding on the exact same lead, you are leaving ${formattedLostRevenue} in revenue on the table every single year.`;
      }

      const calculatedAnnualLoss = formattedAnnualCost;
      // --- Google Sheet Tracking Logic Start ---
      try {
        fetch('https://script.google.com/macros/s/AKfycbwxw4uDokRN690sgluOkolbYruAF5s9CZl5rXbKis7qyGblBccQDzE6snDakWGoYXIp0Q/exec', {
          method: 'POST',
          mode: 'no-cors', // Required for Google Apps Script
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify({
            tool: 'JustDial Scanner',
            input: 'Spend: ' + monthlySpend + ', Leads: ' + monthlyLeads + ', Client Value: ' + clientValue,
            result: 'Annual Loss: ' + calculatedAnnualLoss,
            city: 'Unknown'
          })
        });
      } catch (error) {
        // Silently ignore errors so user experience isn't affected
        console.log('Tracking failed');
      }
      // --- Google Sheet Tracking Logic End ---

      // Reveal Result Section
      resultSection.classList.add('active');
      resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  // FAQ accordion toggles
  const faqButtons = document.querySelectorAll('.tool-faq-question');
  faqButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      const answer = this.nextElementSibling;

      faqButtons.forEach(otherBtn => {
        if (otherBtn !== btn) {
          otherBtn.setAttribute('aria-expanded', 'false');
          if (otherBtn.nextElementSibling) {
            otherBtn.nextElementSibling.style.display = 'none';
          }
        }
      });

      this.setAttribute('aria-expanded', String(!isExpanded));
      if (answer) {
        answer.style.display = isExpanded ? 'none' : 'block';
      }
    });
  });
});

