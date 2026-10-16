/**
 * Geeta Bhawan Mandir — Main Application Controller
 * Handles Navigation, Modals, Synthesizer Audio, Toast, and Page Interactions
 */

import { initLiveClock } from './clock.js';
import { toggleTanpuraDrone, playTempleBell, getAudioState } from './audio.js';
import { initGitaSection } from './gita.js';
import { init3DBackground } from './particles3d.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Toast Notification Utility
  const toastEl = document.getElementById('toast-notice');
  let toastTimer = null;

  function showToast(message) {
    if (!toastEl) return;
    toastEl.querySelector('.toast-text').textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 3800);
  }

  // 2. Initialize 3D Sacred Elements, Clocks & Gita Wisdom
  init3DBackground();
  initLiveClock();
  initGitaSection(showToast);

  // 3. Header Scrolled State
  const header = document.querySelector('.site-header');
  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // 4. Mobile Menu Drawer
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');

  function openMobileMenu() {
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    mobileNavDrawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileNavDrawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn && mobileNavDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close on navigation link tap
    mobileNavDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });
  }

  // 5. User-Controlled Synthetic Acoustics (Web Audio API)
  const audioBtn = document.getElementById('toggle-audio-btn');
  const audioMobileBtn = document.getElementById('toggle-audio-btn-mobile');

  function handleAudioToggle() {
    const isNowPlaying = toggleTanpuraDrone();
    const btns = [audioBtn, audioMobileBtn].filter(Boolean);

    btns.forEach((b) => {
      if (isNowPlaying) {
        b.classList.add('active');
        b.setAttribute('aria-pressed', 'true');
        b.querySelector('.audio-text').textContent = 'Tanpura Drone On';
      } else {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
        b.querySelector('.audio-text').textContent = 'Acoustic Sound';
      }
    });

    if (isNowPlaying) {
      showToast('शांत तानपुरा व घंटी (Pure Web Audio Synthesis Active) 🕉️');
    } else {
      showToast('Acoustic sound paused.');
    }
  }

  if (audioBtn) audioBtn.addEventListener('click', handleAudioToggle);
  if (audioMobileBtn) audioMobileBtn.addEventListener('click', handleAudioToggle);

  // 6. Sanctums Darshan Modal
  const sanctumsModal = document.getElementById('sanctums-modal');
  const openSanctumsBtns = document.querySelectorAll('.open-sanctums-btn');
  const closeSanctumsBtn = document.getElementById('close-sanctums-btn');

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openSanctumsBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(sanctumsModal);
    });
  });

  if (closeSanctumsBtn) {
    closeSanctumsBtn.addEventListener('click', () => closeModal(sanctumsModal));
  }

  // 7. Phase 02 Future Scope Modal
  const phase2Modal = document.getElementById('phase2-modal');
  const phase2Links = document.querySelectorAll('.phase2-future-link');
  const closePhase2Btn = document.getElementById('close-phase2-btn');
  const phase2FeatureName = document.getElementById('phase2-feature-name');

  phase2Links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const feature = link.getAttribute('data-feature') || 'This section';
      if (phase2FeatureName) {
        phase2FeatureName.textContent = feature;
      }
      openModal(phase2Modal);
    });
  });

  if (closePhase2Btn) {
    closePhase2Btn.addEventListener('click', () => closeModal(phase2Modal));
  }

  // Close modals on clicking overlay backdrop
  [sanctumsModal, phase2Modal].forEach((modal) => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    }
  });

  // Close modals & drawer on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(sanctumsModal);
      closeModal(phase2Modal);
      closeMobileMenu();
    }
  });

  // 8. Quick Inquiry Form
  const inquiryForm = document.getElementById('quick-inquiry-form');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('inquiry-name')?.value.trim();
      const phone = document.getElementById('inquiry-phone')?.value.trim();
      const service = document.getElementById('inquiry-service')?.value;

      if (!name || !phone) {
        showToast('Please provide your name and contact phone number.');
        return;
      }

      showToast(`Thank you, ${name}! Connecting you to Mandir Karyalay... 🙏`);
      // Offer direct telephone call to Mandir Karyalay
      setTimeout(() => {
        window.location.href = `tel:01147000208`;
      }, 1200);
    });
  }

  // 9. Interactive Bell Strike on Selected Ornamental Elements
  document.querySelectorAll('.trigger-bell-chime').forEach((item) => {
    item.addEventListener('click', () => {
      playTempleBell();
    });
  });
});
