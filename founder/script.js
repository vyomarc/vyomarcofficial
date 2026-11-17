/**
 * Phase 1 — Premium Founder Hero Section Interactions
 * Subtle 3D mouse parallax and cinematic load animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial Fade-in & Typing Reveal for Title and Philosophy
  initTextReveals();

  // 2. Subtle 3D Parallax on Mouse Movement
  initParallaxEffect();
});

function initTextReveals() {
  const greeting = document.getElementById('greetingText');
  const heroTitle = document.getElementById('heroTitle');
  const philosophy = document.getElementById('philosophyText');
  const founderImg = document.getElementById('founderImg');

  // Set initial hidden state with smooth transition classes
  [greeting, heroTitle, philosophy].forEach((el) => {
    if (el) {
      el.classList.add('fade-in-init');
    }
  });

  // Staggered cinematic reveal
  setTimeout(() => {
    if (greeting) greeting.classList.add('fade-in-active');
  }, 200);

  setTimeout(() => {
    if (heroTitle) {
      typeWriterEffect(heroTitle, 'Founder & Software Engineer', 35);
      heroTitle.classList.add('fade-in-active');
    }
  }, 450);

  setTimeout(() => {
    if (philosophy) philosophy.classList.add('fade-in-active');
  }, 1000);

  if (founderImg) {
    founderImg.style.opacity = '0';
    founderImg.style.transform = 'translateY(25px) scale(0.97)';
    founderImg.style.transition = 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
    
    setTimeout(() => {
      founderImg.style.opacity = '1';
      founderImg.style.transform = 'translateY(0) scale(1)';
    }, 150);
  }
}

function typeWriterEffect(element, fullText, speed = 40) {
  let index = 0;
  element.textContent = '';
  
  function typeChar() {
    if (index < fullText.length) {
      element.textContent += fullText.charAt(index);
      index++;
      setTimeout(typeChar, speed);
    }
  }
  
  typeChar();
}

function initParallaxEffect() {
  const cards = document.querySelectorAll('.project-card');
  const founderImg = document.getElementById('founderImg');
  const ambientGlow = document.querySelector('.ambient-glow');

  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  // Track cursor position
  window.addEventListener('mousemove', (e) => {
    const { innerWidth, innerHeight } = window;
    // Normalized coordinates between -1 and 1
    targetX = (e.clientX - innerWidth / 2) / (innerWidth / 2);
    targetY = (e.clientY - innerHeight / 2) / (innerHeight / 2);
  });

  // Base transforms for 3D cards
  const baseCardTransforms = [
    { ry: 45, rx: 4, tz: -80, scale: 0.9, ox: 0, oy: 0 },
    { ry: 26, rx: 2, tz: -40, scale: 0.95, ox: 0, oy: 0 },
    { ry: -26, rx: 2, tz: -40, scale: 0.95, ox: 0, oy: 0 },
    { ry: -45, rx: 4, tz: -80, scale: 0.9, ox: 0, oy: 0 }
  ];

  // Smooth lerp loop with requestAnimationFrame
  function render() {
    mouseX += (targetX - mouseX) * 0.06;
    mouseY += (targetY - mouseY) * 0.06;

    // Shift 3D project cards
    cards.forEach((card, i) => {
      const base = baseCardTransforms[i] || { ry: 0, rx: 0, tz: 0, scale: 1 };
      const depthMultiplier = (i === 0 || i === 3) ? 22 : 14;
      const rotMultiplier = (i === 0 || i === 3) ? 6 : 4;

      const posX = mouseX * depthMultiplier;
      const posY = mouseY * (depthMultiplier * 0.7);
      const rotY = base.ry + (mouseX * rotMultiplier);
      const rotX = base.rx - (mouseY * rotMultiplier);

      card.style.transform = `translate3d(${posX}px, ${posY}px, ${base.tz}px) rotateY(${rotY}deg) rotateX(${rotX}deg) scale(${base.scale})`;
    });

    // Subtle parallax on founder image
    if (founderImg && window.innerWidth > 768) {
      const fX = -mouseX * 9;
      const fY = -mouseY * 5;
      founderImg.style.transform = `translate3d(${fX}px, ${fY}px, 0)`;
    }

    // Glow movement
    if (ambientGlow) {
      const gX = mouseX * 25;
      const gY = mouseY * 15;
      ambientGlow.style.transform = `translate(calc(-50% + ${gX}px), calc(-20% + ${gY}px))`;
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

document.addEventListener("DOMContentLoaded", function () {
  // Select all elements with reveal classes
  const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-left, .reveal-fade-right');

  // Set up the Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        // Optional: Stop observing once revealed
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15, // Trigger when 15% of the element is visible
    rootMargin: "0px 0px -50px 0px" // Trigger slightly before it hits the bottom
  });

  // Observe each element
  revealElements.forEach(el => observer.observe(el));
});

// Scroll to Top Logic
document.addEventListener("DOMContentLoaded", function () {
  const scrollBtn = document.getElementById("scrollToTopBtn");

  if (scrollBtn) {
    // Show/Hide button based on scroll position
    window.addEventListener("scroll", function () {
      if (window.scrollY > 300) {
        scrollBtn.classList.add("show");
      } else {
        scrollBtn.classList.remove("show");
      }
    });

    // Smooth scroll to top on click
    scrollBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }
});
