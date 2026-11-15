document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('whatsapp-link-form');
  const phoneInput = document.getElementById('phone-number');
  const messageInput = document.getElementById('prefilled-message');
  const outputSection = document.getElementById('output-section');
  const generatedLinkInput = document.getElementById('generated-link');
  const copyBtn = document.getElementById('btn-copy-link');
  const testBtn = document.getElementById('btn-test-link');
  const toast = document.getElementById('copy-toast');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      let phone = phoneInput.value.trim();
      const message = messageInput.value.trim();

      // Clean phone number: remove +, spaces, dashes, parentheses
      phone = phone.replace(/[+\s\-()]/g, '');

      // Validation: check if non-empty and contains only digits
      if (!phone || !/^\d+$/.test(phone)) {
        alert('Please enter a valid phone number containing only digits.');
        phoneInput.focus();
        return;
      }

      // Check if country code is present (at least 11 digits: e.g. 91 + 10 digits in India = 12)
      // Standard 10-digit number without country code
      if (phone.length <= 10) {
        alert('Please include your country code without "+" (e.g. 919876543210 for India).');
        phoneInput.focus();
        return;
      }

      // Construct URL
      let url = `https://wa.me/${phone}`;
      if (message) {
        const encodedMessage = encodeURIComponent(message);
        url += `?text=${encodedMessage}`;
      }

      // Display in output field
      generatedLinkInput.value = url;
      testBtn.href = url;

      // --- Google Sheet Tracking Logic Start ---
      try {
        fetch('https://script.google.com/macros/s/AKfycbwxw4uDokRN690sgluOkolbYruAF5s9CZl5rXbKis7qyGblBccQDzE6snDakWGoYXIp0Q/exec', {
          method: 'POST',
          mode: 'no-cors', // Required for Google Apps Script
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify({
            tool: 'WhatsApp Link Generator',
            input: 'Number: ' + phone + ', Message: ' + message,
            result: 'Link Generated',
            city: 'Unknown'
          })
        });
      } catch (error) {
        // Silently ignore errors so user experience isn't affected
        console.log('Tracking failed');
      }
      // --- Google Sheet Tracking Logic End ---

      // Reveal output section
      outputSection.classList.add('active');
      outputSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  // Copy to clipboard
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      const link = generatedLinkInput.value;
      if (!link) return;

      const copyToClipboard = () => {
        showToast();
        const origText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!';
        setTimeout(() => {
          copyBtn.innerHTML = origText;
        }, 2200);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(link).then(copyToClipboard).catch(() => {
          fallbackCopy();
        });
      } else {
        fallbackCopy();
      }

      function fallbackCopy() {
        generatedLinkInput.select();
        document.execCommand('copy');
        copyToClipboard();
      }
    });
  }

  function showToast() {
    if (!toast) return;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  // FAQ accordion toggles
  const faqButtons = document.querySelectorAll('.tool-faq-question');
  faqButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      const answer = this.nextElementSibling;

      // Close other FAQs
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

