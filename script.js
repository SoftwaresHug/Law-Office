/* ═══════════════════════════════════════════════════════
   Law Office — script.js
   تفاعلات بسيطة: قائمة الموبايل + سنة الفوتر
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── سنة الفوتر ─── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ─── قائمة الموبايل ─── */
  const toggle  = document.querySelector('.nav-toggle');
  const mobileNav = document.getElementById('mobile-menu');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      mobileNav.hidden = isOpen;
    });

    /* إغلاق القائمة عند الضغط على أي رابط داخلها */
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        mobileNav.hidden = true;
      });
    });

    /* إغلاق عند الضغط خارج القائمة */
    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !mobileNav.contains(e.target)) {
        toggle.setAttribute('aria-expanded', 'false');
        mobileNav.hidden = true;
      }
    });

    /* إغلاق بـ Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        toggle.setAttribute('aria-expanded', 'false');
        mobileNav.hidden = true;
        toggle.focus();
      }
    });
  }

  /* ─── Scroll سلس للروابط الداخلية (Polyfill للمتصفحات القديمة) ─── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = anchor.getAttribute('href').slice(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        /* تحريك الـ focus للقسم للوصولية */
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        target.addEventListener('blur', function () {
          target.removeAttribute('tabindex');
        }, { once: true });
      }
    });
  });

  /* ─── Intersection Observer: بطاقات الميزات تظهر عند التمرير ─── */
  if ('IntersectionObserver' in window) {
    const cards = document.querySelectorAll('.feature-card');

    /* إضافة الـ CSS لأول مرة */
    const style = document.createElement('style');
    style.textContent = [
      '.feature-card { opacity: 0; transform: translateY(20px); transition: opacity .4s ease, transform .4s ease; }',
      '.feature-card.visible { opacity: 1; transform: none; }',
      '@media (prefers-reduced-motion: reduce) {',
      '  .feature-card { opacity: 1 !important; transform: none !important; transition: none !important; }',
      '}'
    ].join('\n');
    document.head.appendChild(style);

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    cards.forEach(function (card) { observer.observe(card); });
  }

})();
