// CGPA & Percentage Calculator Script
document.addEventListener('DOMContentLoaded', () => {
  // State variables
  let currentDirection = 'cgpa-to-percent'; // 'cgpa-to-percent' or 'percent-to-cgpa'
  let currentScale = '10'; // '10' or '7'

  // DOM Elements
  const dirButtons = document.querySelectorAll('[data-dir]');
  const scaleButtons = document.querySelectorAll('[data-scale]');
  const scaleGroup = document.getElementById('scale-toggle-group');
  const scaleHelper = document.getElementById('scale-helper-text');
  
  const inputTitle = document.getElementById('input-title');
  const inputUnitBadge = document.getElementById('input-unit-badge');
  const scoreInput = document.getElementById('score-input');
  const scoreSlider = document.getElementById('score-slider');
  const unitSymbol = document.getElementById('unit-symbol');
  const sliderMinLabel = document.getElementById('slider-min-label');
  const sliderMaxLabel = document.getElementById('slider-max-label');

  const formulaDisplay = document.getElementById('formula-display');
  const formulaNote = document.getElementById('formula-note');

  const primaryResultLabel = document.getElementById('primary-result-label');
  const primaryResultValue = document.getElementById('primary-result-val');
  const primaryResultSub = document.getElementById('primary-result-sub');

  const gpaResultVal = document.getElementById('gpa-result-val');
  const divisionResultVal = document.getElementById('division-result-val');
  const perfBadge = document.getElementById('perf-badge');
  const perfMarker = document.getElementById('perf-marker');
  const studyAbroadText = document.getElementById('study-abroad-text');

  // Initialize bounds and values
  function updateInputBounds() {
    if (currentDirection === 'cgpa-to-percent') {
      const maxVal = currentScale === '10' ? 10 : 7;
      scoreInput.min = '0';
      scoreInput.max = maxVal.toString();
      scoreInput.step = '0.01';

      scoreSlider.min = '0';
      scoreSlider.max = maxVal.toString();
      scoreSlider.step = '0.01';

      sliderMinLabel.textContent = '0.0';
      sliderMaxLabel.textContent = `${maxVal}.0`;
      unitSymbol.textContent = 'CGPA';
      inputUnitBadge.textContent = `Max: ${maxVal}.0 CGPA`;
      inputTitle.textContent = 'Enter Your CGPA';

      // Set default value if out of bounds
      let val = parseFloat(scoreInput.value);
      if (isNaN(val) || val > maxVal) {
        val = currentScale === '10' ? 8.0 : 5.5;
      }
      scoreInput.value = val.toFixed(2);
      scoreSlider.value = val.toString();
    } else {
      // Percentage to CGPA
      scoreInput.min = '0';
      scoreInput.max = '100';
      scoreInput.step = '0.1';

      scoreSlider.min = '0';
      scoreSlider.max = '100';
      scoreSlider.step = '0.1';

      sliderMinLabel.textContent = '0%';
      sliderMaxLabel.textContent = '100%';
      unitSymbol.textContent = '%';
      inputUnitBadge.textContent = '0% - 100%';
      inputTitle.textContent = 'Enter Your Percentage';

      let val = parseFloat(scoreInput.value);
      if (isNaN(val) || val > 100) {
        val = 76.0;
      }
      scoreInput.value = val.toFixed(1);
      scoreSlider.value = val.toString();
    }
  }

  // Calculate and update UI
  function recalculate() {
    let inputValue = parseFloat(scoreInput.value);
    if (isNaN(inputValue)) inputValue = 0;

    let computedPercent = 0;
    let computedCgpa = 0;

    if (currentDirection === 'cgpa-to-percent') {
      const maxScale = currentScale === '10' ? 10 : 7;
      inputValue = Math.min(maxScale, Math.max(0, inputValue));

      if (currentScale === '10') {
        computedPercent = inputValue * 9.5;
        formulaDisplay.textContent = 'Percentage (%) = CGPA × 9.5';
        formulaNote.textContent = 'CBSE / AICTE standard multiplier of 9.5';
      } else {
        computedPercent = inputValue >= 0.75 ? (inputValue - 0.75) * 10 : 0;
        formulaDisplay.textContent = 'Percentage (%) = (CGPA - 0.75) × 10';
        formulaNote.textContent = 'Mumbai University & UGC 7-point scale standard';
      }
      computedPercent = Math.min(100, Math.max(0, computedPercent));

      primaryResultLabel.textContent = 'Equivalent Percentage';
      primaryResultValue.textContent = `${computedPercent.toFixed(2)}%`;
      primaryResultSub.textContent = `Based on a score of ${inputValue.toFixed(2)} on a ${maxScale}-point scale`;
    } else {
      // Percentage to CGPA
      inputValue = Math.min(100, Math.max(0, inputValue));
      computedPercent = inputValue;

      if (currentScale === '10') {
        computedCgpa = computedPercent / 9.5;
        formulaDisplay.textContent = 'CGPA = Percentage (%) ÷ 9.5';
        formulaNote.textContent = 'CBSE / AICTE standard 10-point divisor of 9.5';
      } else {
        computedCgpa = (computedPercent / 10) + 0.75;
        formulaDisplay.textContent = 'CGPA = (Percentage (%) ÷ 10) + 0.75';
        formulaNote.textContent = 'Mumbai University 7-point scale conversion';
      }
      const maxScale = currentScale === '10' ? 10 : 7;
      computedCgpa = Math.min(maxScale, Math.max(0, computedCgpa));

      primaryResultLabel.textContent = 'Equivalent CGPA';
      primaryResultValue.textContent = `${computedCgpa.toFixed(2)} / ${maxScale}`;
      primaryResultSub.textContent = `Based on an aggregate score of ${computedPercent.toFixed(1)}%`;
    }

    // US 4.0 GPA Mapping based on computed percentage
    let gpaString = '';
    if (computedPercent >= 90) {
      gpaString = '3.9 - 4.0 / 4.0 (A+)';
    } else if (computedPercent >= 80) {
      gpaString = '3.5 - 3.8 / 4.0 (A)';
    } else if (computedPercent >= 70) {
      gpaString = '3.0 - 3.4 / 4.0 (B+)';
    } else if (computedPercent >= 60) {
      gpaString = '2.5 - 2.9 / 4.0 (B)';
    } else if (computedPercent >= 50) {
      gpaString = '2.0 - 2.4 / 4.0 (C)';
    } else {
      gpaString = '1.5 - 1.9 / 4.0 (D)';
    }
    gpaResultVal.textContent = gpaString;

    // Division / Class Classification
    let divisionString = '';
    if (computedPercent >= 75) {
      divisionString = 'First Class with Distinction';
    } else if (computedPercent >= 60) {
      divisionString = 'First Class';
    } else if (computedPercent >= 50) {
      divisionString = 'Second Class';
    } else {
      divisionString = 'Pass Class';
    }
    divisionResultVal.textContent = divisionString;

    // Academic Performance Band & Marker
    let bandName = '';
    if (computedPercent >= 85) {
      bandName = 'Outstanding';
    } else if (computedPercent >= 75) {
      bandName = 'Distinction';
    } else if (computedPercent >= 60) {
      bandName = 'First Division';
    } else if (computedPercent >= 50) {
      bandName = 'Second Division';
    } else {
      bandName = 'Pass Class';
    }
    perfBadge.textContent = bandName;
    perfMarker.style.left = `${Math.min(100, Math.max(0, computedPercent))}%`;

    // Study Abroad Eligibility
    let abroadAdvice = '';
    if (computedPercent >= 85) {
      abroadAdvice = 'Eligible for Ivy League & Top 20 Global Universities (MIT, Stanford, Oxford, Cambridge, Toronto) with high scholarship potential.';
    } else if (computedPercent >= 75) {
      abroadAdvice = "Eligible for Tier-1 Global Universities in USA, UK, Canada, Germany & Australia (Direct Master's / STEM Programs).";
    } else if (computedPercent >= 60) {
      abroadAdvice = "Eligible for Direct Master's Admission across recognized public universities in UK, Ireland, Europe, Canada, and Australia.";
    } else if (computedPercent >= 50) {
      abroadAdvice = "Eligible for Pathway, Pre-Master's, and Graduate Certificate Programs at reputable international universities.";
    } else {
      abroadAdvice = 'Eligible for Conditional Admission, Foundation Bridges, and specialized technical diploma tracks.';
    }
    studyAbroadText.textContent = abroadAdvice;

    const direction = currentDirection;
    const scale = currentScale;
    const calculatedResult = currentDirection === 'cgpa-to-percent' ? (computedPercent.toFixed(2) + '%') : (computedCgpa.toFixed(2));

    // Debounced Google Sheet Tracking
    clearTimeout(window.__cgpaTrackTimer);
    window.__cgpaTrackTimer = setTimeout(() => {
      // --- Google Sheet Tracking Logic Start ---
      try {
        fetch('https://script.google.com/macros/s/AKfycbwxw4uDokRN690sgluOkolbYruAF5s9CZl5rXbKis7qyGblBccQDzE6snDakWGoYXIp0Q/exec', {
          method: 'POST',
          mode: 'no-cors', // Required for Google Apps Script
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify({
            tool: 'CGPA Converter',
            input: 'Input Value: ' + inputValue + ', Direction: ' + direction + ', Scale: ' + scale,
            result: 'Converted Value: ' + calculatedResult,
            city: 'Unknown'
          })
        });
      } catch (error) {
        // Silently ignore errors so user experience isn't affected
        console.log('Tracking failed');
      }
      // --- Google Sheet Tracking Logic End ---
    }, 400);
  }

  // Event Listeners for Direction buttons
  dirButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      dirButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentDirection = btn.getAttribute('data-dir');

      updateInputBounds();
      recalculate();
    });
  });

  // Event Listeners for Scale buttons
  scaleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      scaleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentScale = btn.getAttribute('data-scale');

      if (currentScale === '10') {
        scaleHelper.textContent = 'Standard for CBSE, AICTE, VTU, AKTU, Anna Univ, and most Indian colleges.';
      } else {
        scaleHelper.textContent = 'Standard for Mumbai University and select UGC autonomous colleges.';
      }

      updateInputBounds();
      recalculate();
    });
  });

  // Input & Slider Synchronization
  scoreInput.addEventListener('input', () => {
    let val = parseFloat(scoreInput.value);
    const maxVal = parseFloat(scoreInput.max);
    const minVal = parseFloat(scoreInput.min);

    if (!isNaN(val)) {
      if (val > maxVal) val = maxVal;
      if (val < minVal) val = minVal;
      scoreSlider.value = val.toString();
    }
    recalculate();
  });

  scoreSlider.addEventListener('input', () => {
    const val = parseFloat(scoreSlider.value);
    if (currentDirection === 'cgpa-to-percent') {
      scoreInput.value = val.toFixed(2);
    } else {
      scoreInput.value = val.toFixed(1);
    }
    recalculate();
  });

  // Initial setup
  updateInputBounds();
  recalculate();
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

