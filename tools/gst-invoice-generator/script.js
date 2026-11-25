/**
 * VYOMARC Free GST Invoice Generator
 * Interactive calculations, dynamic item rows, Indian currency formatting,
 * print PDF output, WhatsApp dispatch, and event tracking.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Business Form Inputs
  const inputBizName = document.getElementById('bizName');
  const inputBizGstin = document.getElementById('bizGstin');
  const inputBizAddress = document.getElementById('bizAddress');
  const inputBizPhone = document.getElementById('bizPhone');
  const selectSellerState = document.getElementById('sellerState');

  // Customer Form Inputs
  const inputCustName = document.getElementById('custName');
  const inputCustPhone = document.getElementById('custPhone');
  const inputCustAddress = document.getElementById('custAddress');
  const selectPlaceOfSupply = document.getElementById('placeOfSupply');

  // Invoice Meta Inputs
  const inputInvNumber = document.getElementById('invNumber');
  const inputInvDate = document.getElementById('invDate');

  // Preview Elements
  const prevBizName = document.getElementById('prevBizName');
  const prevBizGstin = document.getElementById('prevBizGstin');
  const prevBizAddress = document.getElementById('prevBizAddress');
  const prevBizPhone = document.getElementById('prevBizPhone');

  const prevCustName = document.getElementById('prevCustName');
  const prevCustPhone = document.getElementById('prevCustPhone');
  const prevCustAddress = document.getElementById('prevCustAddress');

  const prevInvNumber = document.getElementById('prevInvNumber');
  const prevInvDate = document.getElementById('prevInvDate');
  const prevPlaceOfSupply = document.getElementById('prevPlaceOfSupply');

  const itemsTableBody = document.getElementById('itemsTableBody');
  const prevItemsBody = document.getElementById('prevItemsBody');

  const prevSubtotal = document.getElementById('prevSubtotal');
  const prevCgstRow = document.getElementById('prevCgstRow');
  const prevCgst = document.getElementById('prevCgst');
  const prevSgstRow = document.getElementById('prevSgstRow');
  const prevSgst = document.getElementById('prevSgst');
  const prevIgstRow = document.getElementById('prevIgstRow');
  const prevIgst = document.getElementById('prevIgst');
  const prevGrandTotal = document.getElementById('prevGrandTotal');
  const prevWords = document.getElementById('prevWords');

  // Action Buttons
  const btnAddItem = document.getElementById('btnAddItem');
  const btnGenerateInvoice = document.getElementById('btnGenerateInvoice');
  const btnPrintInvoice = document.getElementById('btnPrintInvoice');
  const btnWhatsAppShare = document.getElementById('btnWhatsAppShare');

  // Set today's date if empty
  if (inputInvDate && !inputInvDate.value) {
    const today = new Date().toISOString().split('T')[0];
    inputInvDate.value = today;
  }

  // Format Date for Preview (DD-MM-YYYY)
  function formatDatePreview(dateStr) {
    if (!dateStr) return 'N/A';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  }

  // Indian Rupee Currency Formatter
  function formatINR(num) {
    const val = Number(num) || 0;
    return '₹' + val.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  // Indian Number to Words Algorithm
  function convertNumberToWords(num) {
    const a = [
      '', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ',
      'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ',
      'Seventeen ', 'Eighteen ', 'Nineteen '
    ];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    num = Math.floor(Number(num) || 0);
    if (num === 0) return 'Zero Rupees Only';
    if (num.toString().length > 9) return 'Amount Exceeds Conversion Limit';

    const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return '';

    let str = '';
    str += (Number(n[1]) !== 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
    str += (Number(n[2]) !== 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
    str += (Number(n[3]) !== 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
    str += (Number(n[4]) !== 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
    str += (Number(n[5]) !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';

    return str.trim() + ' Rupees Only';
  }

  // Add Item Row
  function addItemRow(desc = '', hsn = '', qty = 1, rate = 0, gst = 18) {
    const row = document.createElement('tr');
    row.className = 'item-input-row';
    row.innerHTML = `
      <td><input type="text" class="inv-input item-desc" placeholder="Item or Service Name" value="${desc}"></td>
      <td><input type="text" class="inv-input item-hsn" placeholder="HSN/SAC" value="${hsn}" style="width: 90px;"></td>
      <td><input type="number" class="inv-input item-qty" min="1" step="1" value="${qty}" style="width: 70px;"></td>
      <td><input type="number" class="inv-input item-rate" min="0" step="0.01" value="${rate}" style="width: 100px;"></td>
      <td>
        <select class="inv-select item-gst" style="width: 85px;">
          <option value="0" ${gst === 0 ? 'selected' : ''}>0%</option>
          <option value="5" ${gst === 5 ? 'selected' : ''}>5%</option>
          <option value="12" ${gst === 12 ? 'selected' : ''}>12%</option>
          <option value="18" ${gst === 18 ? 'selected' : ''}>18%</option>
          <option value="28" ${gst === 28 ? 'selected' : ''}>28%</option>
        </select>
      </td>
      <td style="text-align: center;">
        <button type="button" class="item-delete-btn" aria-label="Delete Item">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </td>
    `;

    // Row input listeners
    row.querySelectorAll('input, select').forEach(input => {
      input.addEventListener('input', updateInvoice);
      input.addEventListener('change', updateInvoice);
    });

    // Delete handler
    row.querySelector('.item-delete-btn').addEventListener('click', () => {
      const allRows = itemsTableBody.querySelectorAll('.item-input-row');
      if (allRows.length > 1) {
        row.remove();
        updateInvoice();
      } else {
        // Clear row instead of deleting last row
        row.querySelector('.item-desc').value = '';
        row.querySelector('.item-hsn').value = '';
        row.querySelector('.item-qty').value = 1;
        row.querySelector('.item-rate').value = 0;
        row.querySelector('.item-gst').value = 18;
        updateInvoice();
      }
    });

    itemsTableBody.appendChild(row);
    updateInvoice();
  }

  // Update Preview & Calculations
  function updateInvoice() {
    // Sync Business Details
    if (prevBizName) prevBizName.textContent = inputBizName.value.trim() || 'Your Business Name';
    if (prevBizGstin) prevBizGstin.textContent = inputBizGstin.value.trim() || '22AAAAA0000A1Z5';
    if (prevBizAddress) prevBizAddress.textContent = inputBizAddress.value.trim() || 'Registered Business Address, City, State, PIN';
    if (prevBizPhone) prevBizPhone.textContent = inputBizPhone.value.trim() || '+91 9876543210';

    // Sync Customer Details
    if (prevCustName) prevCustName.textContent = inputCustName.value.trim() || 'Client / Customer Name';
    if (prevCustPhone) prevCustPhone.textContent = inputCustPhone.value.trim() || '+91 9123456789';
    if (prevCustAddress) prevCustAddress.textContent = inputCustAddress.value.trim() || 'Client Billing Address, City, PIN';

    // Sync Invoice Meta
    if (prevInvNumber) prevInvNumber.textContent = inputInvNumber.value.trim() || 'INV-2026-001';
    if (prevInvDate) prevInvDate.textContent = formatDatePreview(inputInvDate.value);
    const placeVal = selectPlaceOfSupply.value || 'Bihar (10)';
    if (prevPlaceOfSupply) prevPlaceOfSupply.textContent = placeVal;

    // Check Intra-State vs Inter-State
    const sellerStateVal = selectSellerState ? selectSellerState.value : 'Bihar (10)';
    const isIntraState = (sellerStateVal === placeVal);

    // Calculate Items
    const rows = itemsTableBody.querySelectorAll('.item-input-row');
    let subtotalVal = 0;
    let totalTaxVal = 0;
    let previewHtml = '';

    rows.forEach((r, idx) => {
      const desc = r.querySelector('.item-desc').value.trim() || `Item ${idx + 1}`;
      const hsn = r.querySelector('.item-hsn').value.trim() || '-';
      const qty = parseFloat(r.querySelector('.item-qty').value) || 0;
      const rate = parseFloat(r.querySelector('.item-rate').value) || 0;
      const gstPercent = parseFloat(r.querySelector('.item-gst').value) || 0;

      const taxable = qty * rate;
      const tax = (taxable * gstPercent) / 100;
      const total = taxable + tax;

      subtotalVal += taxable;
      totalTaxVal += tax;

      previewHtml += `
        <tr>
          <td style="text-align: center; color: #64748b;">${idx + 1}</td>
          <td>
            <strong>${escapeHtml(desc)}</strong>
          </td>
          <td style="font-family: monospace; font-size: 0.85rem;">${escapeHtml(hsn)}</td>
          <td style="text-align: center;">${qty}</td>
          <td style="text-align: right;">${formatINR(rate)}</td>
          <td style="text-align: right;">${formatINR(taxable)}</td>
          <td style="text-align: center;">${gstPercent}%</td>
          <td style="text-align: right; font-weight: 600;">${formatINR(total)}</td>
        </tr>
      `;
    });

    if (prevItemsBody) {
      prevItemsBody.innerHTML = previewHtml;
    }

    const grandTotalVal = subtotalVal + totalTaxVal;

    // Update Totals Display
    if (prevSubtotal) prevSubtotal.textContent = formatINR(subtotalVal);

    if (isIntraState) {
      const cgstVal = totalTaxVal / 2;
      const sgstVal = totalTaxVal / 2;

      if (prevCgstRow) prevCgstRow.style.display = 'flex';
      if (prevSgstRow) prevSgstRow.style.display = 'flex';
      if (prevIgstRow) prevIgstRow.style.display = 'none';

      if (prevCgst) prevCgst.textContent = formatINR(cgstVal);
      if (prevSgst) prevSgst.textContent = formatINR(sgstVal);
    } else {
      if (prevCgstRow) prevCgstRow.style.display = 'none';
      if (prevSgstRow) prevSgstRow.style.display = 'none';
      if (prevIgstRow) prevIgstRow.style.display = 'flex';

      if (prevIgst) prevIgst.textContent = formatINR(totalTaxVal);
    }

    if (prevGrandTotal) prevGrandTotal.textContent = formatINR(grandTotalVal);
    if (prevWords) prevWords.textContent = convertNumberToWords(grandTotalVal);
  }

  // HTML sanitizer
  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  // Google Sheet Logging Function
  function logInvoiceActivity(actionType) {
    const endpoint = 'https://script.google.com/macros/s/AKfycbwxw4uDokRN690sgluOkolbYruAF5s9CZl5rXbKis7qyGblBccQDzE6snDakWGoYXIp0Q/exec';
    const payload = {
      tool: 'GST Invoice Generator',
      action: actionType,
      businessName: inputBizName.value.trim() || 'Unnamed Business',
      gstin: inputBizGstin.value.trim() || 'N/A',
      customerName: inputCustName.value.trim() || 'Unnamed Client',
      invoiceNumber: inputInvNumber.value.trim() || 'N/A',
      grandTotal: prevGrandTotal ? prevGrandTotal.textContent : '0',
      timestamp: new Date().toISOString()
    };

    fetch(endpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    }).catch(() => {
      // Silent error catching for background logging
    });
  }

  // Wire Listeners for Main Form Inputs
  [
    inputBizName, inputBizGstin, inputBizAddress, inputBizPhone, selectSellerState,
    inputCustName, inputCustPhone, inputCustAddress, selectPlaceOfSupply,
    inputInvNumber, inputInvDate
  ].forEach(el => {
    if (el) {
      el.addEventListener('input', updateInvoice);
      el.addEventListener('change', updateInvoice);
    }
  });

  // Wire Add Item Button
  if (btnAddItem) {
    btnAddItem.addEventListener('click', () => {
      addItemRow('', '', 1, 0, 18);
    });
  }

  // Wire Generate Invoice Button
  if (btnGenerateInvoice) {
    btnGenerateInvoice.addEventListener('click', () => {
      updateInvoice();
      logInvoiceActivity('generate_preview');
      const previewCard = document.getElementById('invoicePreviewPaper');
      if (previewCard) {
        previewCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Wire Download / Print PDF Button
  if (btnPrintInvoice) {
    btnPrintInvoice.addEventListener('click', () => {
      updateInvoice();
      logInvoiceActivity('download_pdf');
      window.print();
    });
  }

  // Wire WhatsApp Share Button
  if (btnWhatsAppShare) {
    btnWhatsAppShare.addEventListener('click', (e) => {
      e.preventDefault();
      updateInvoice();
      logInvoiceActivity('whatsapp_share');

      const biz = inputBizName.value.trim() || 'Our Business';
      const invNum = inputInvNumber.value.trim() || 'INV-2026-001';
      const cust = inputCustName.value.trim() || 'Client';
      const total = prevGrandTotal ? prevGrandTotal.textContent : '0';

      const msg = `Hello ${cust}, please find the GST Tax Invoice details from ${biz}:\n\n` +
        `• Invoice No: ${invNum}\n` +
        `• Date: ${formatDatePreview(inputInvDate.value)}\n` +
        `• Total Amount: ${total}\n\n` +
        `Generated securely via VYOMARC GST Billing Tools. Contact us on 918252702699 for custom software and business automation.`;

      const targetUrl = `https://wa.me/918252702699?text=${encodeURIComponent(msg)}`;
      window.open(targetUrl, '_blank');
    });
  }

  // Seed with standard starter items
  addItemRow('Custom Web Design & Architecture', '998311', 1, 15000, 18);
  addItemRow('Cloud Hosting & Security Setup', '998315', 1, 5000, 18);

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
});
