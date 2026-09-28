/**
 * Alzarus Landing Page JavaScript Logic
 * Features: Dark/Light Mode Switch, Scroll Reveal Observer, Smooth Anchoring
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileMenu();
  initScrollReveal();
  initLanguagePreference();
});

/**
 * Initialize Light/Dark theme switching with system fallback and localStorage persistence
 */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  const sunIcon = document.getElementById('sun-icon');
  const moonIcon = document.getElementById('moon-icon');
  const isEnglish = document.documentElement.lang && document.documentElement.lang.toLowerCase().startsWith('en');

  // Check stored theme or system preference
  const storedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  let currentTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
  applyTheme(currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(currentTheme);
    localStorage.setItem('theme', currentTheme);
  });

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (sunIcon) sunIcon.style.display = 'block';
      if (moonIcon) moonIcon.style.display = 'none';
      themeToggleBtn.setAttribute('aria-label', isEnglish ? 'Switch to light mode' : 'Alternar para modo claro');
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'block';
      themeToggleBtn.setAttribute('aria-label', isEnglish ? 'Switch to dark mode' : 'Alternar para modo escuro');
    }
  }
}

/**
 * Persist language choice in localStorage when user toggles language
 */
function initLanguagePreference() {
  const langButtons = document.querySelectorAll('.lang-btn');

  // Ensure direct file navigation works smoothly when running locally via file://
  if (window.location.protocol === 'file:') {
    langButtons.forEach(btn => {
      const href = btn.getAttribute('href');
      if (href === 'en/' || href === './en/') {
        btn.setAttribute('href', 'en/index.html');
      } else if (href === '../' || href === './') {
        btn.setAttribute('href', '../index.html');
      }
    });
  }

  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.textContent.trim().toLowerCase();
      const targetLang = text === 'en' ? 'en' : 'pt';
      localStorage.setItem('preferred_lang', targetLang);
    });
  });
}

/**
 * Initialize Intersection Observer for smooth reveal-on-scroll effects
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/**
 * Initialize Mobile Menu toggle overlay logic
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!menuBtn || !navLinks) return;

  const hamburgerIcon = menuBtn.querySelector('.hamburger-icon');
  const closeIcon = menuBtn.querySelector('.close-icon');

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navLinks.classList.toggle('is-active');
    menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    
    if (hamburgerIcon) hamburgerIcon.style.display = isOpen ? 'none' : 'block';
    if (closeIcon) closeIcon.style.display = isOpen ? 'block' : 'none';
  });

  // Close mobile menu when clicking any navigation link
  const links = navLinks.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('is-active') && !e.target.closest('.header')) {
      closeMenu();
    }
  });

  function closeMenu() {
    navLinks.classList.remove('is-active');
    menuBtn.setAttribute('aria-expanded', 'false');
    if (hamburgerIcon) hamburgerIcon.style.display = 'block';
    if (closeIcon) closeIcon.style.display = 'none';
  }
}
