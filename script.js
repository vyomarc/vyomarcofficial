document.addEventListener("DOMContentLoaded", () => {
  // ---------- Mobile Menu ----------
  const mobileBtn = document.getElementById("mobile-menu");
  const navLinks = document.getElementById("nav-links");
  const navAnchors = document.querySelectorAll(".nav-links a");

  if (mobileBtn && navLinks) {
    const toggleMenu = () => {
      navLinks.classList.toggle("active");
      mobileBtn.setAttribute("aria-expanded", navLinks.classList.contains("active"));
      const icon = mobileBtn.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-bars");
        icon.classList.toggle("fa-times");
      }
    };
    mobileBtn.addEventListener("click", toggleMenu);

    navAnchors.forEach(link => {
      link.addEventListener("click", () => {
        if (link.classList.contains("dropdown-toggle") || link.closest(".dropdown-toggle")) {
          return;
        }
        navLinks.classList.remove("active");
        mobileBtn.setAttribute("aria-expanded", "false");
        const icon = mobileBtn.querySelector("i");
        if (icon) {
          icon.classList.add("fa-bars");
          icon.classList.remove("fa-times");
        }
        document.querySelectorAll(".nav-dropdown.is-open, .nav-dropdown.active").forEach(dropdown => {
          dropdown.classList.remove("is-open", "active");
          const toggle = dropdown.querySelector(".dropdown-toggle");
          if (toggle) toggle.setAttribute("aria-expanded", "false");
        });
      });
    });
  }

  // ---------- Navbar Services Dropdown ----------
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle");
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const parent = toggle.closest(".nav-dropdown");
      if (!parent) return;

      const isOpen = parent.classList.toggle("is-open");
      parent.classList.toggle("active", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));

      // Close any other open dropdowns
      document.querySelectorAll(".nav-dropdown").forEach(other => {
        if (other !== parent) {
          other.classList.remove("is-open", "active");
          const otherToggle = other.querySelector(".dropdown-toggle");
          if (otherToggle) otherToggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav-dropdown")) {
      document.querySelectorAll(".nav-dropdown.is-open, .nav-dropdown.active").forEach(dropdown => {
        dropdown.classList.remove("is-open", "active");
        const toggle = dropdown.querySelector(".dropdown-toggle");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
      });
    }
  });

  // Close dropdown when pressing Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".nav-dropdown.is-open, .nav-dropdown.active").forEach(dropdown => {
        dropdown.classList.remove("is-open", "active");
        const toggle = dropdown.querySelector(".dropdown-toggle");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
      });
    }
  });

  // ---------- Smooth Scroll (only for # anchors) ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});

(function () {
  var questions = document.querySelectorAll('.faq-question');

  questions.forEach(function (btn) {
    btn.addEventListener('click', function () {
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
        }
      });

      /* Toggle current */
      this.setAttribute('aria-expanded', String(!expanded));
      if (answer) {
          answer.setAttribute('aria-hidden', String(expanded));
      }
    });
  });
})();
