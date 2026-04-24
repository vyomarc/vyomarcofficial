'use strict';
document.addEventListener('DOMContentLoaded', function () {

  /* =========================
     NAVBAR TOGGLE (MOBILE)
  ========================== */
  const menuToggle = document.getElementById('mobile-menu');
  const navLinks = document.getElementById('nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      navLinks.classList.toggle('active');
    });
  } else {
    console.error('Navbar elements missing');
  }


  /* =========================
     MODAL SYSTEM
  ========================== */
  const modal = document.getElementById('quoteModal');
  const quoteButtons = document.querySelectorAll('.quote-trigger');
  const closeBtns = document.querySelectorAll('.close-modal, .close-modal-btn');

  if (!modal) {
    console.error('Modal not found');
    return;
  }

  function openModal(e) {
    if (e) e.preventDefault();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Open modal
  quoteButtons.forEach(btn => {
    btn.addEventListener('click', openModal);
  });
  
  // Close modal buttons
  closeBtns.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });
  
  // Click outside
  modal.addEventListener('click', function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // ESC key close
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
});