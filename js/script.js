/* ============================================================
   PAN Solutions — Interactions
   ============================================================ */

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Theme Toggle --- */
  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('pan-theme', next);
    });
  }

  /* --- Navbar Scroll State --- */
  var navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* --- Mobile Nav Toggle --- */
  var hamburger = document.getElementById('navHamburger');
  var navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* --- Smooth Scroll for Anchors --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      var offset = navbar ? navbar.offsetHeight + 20 : 20;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* --- Scroll Reveal --- */
  if (!prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var index = parseInt(el.getAttribute('data-index') || '0', 10);
          setTimeout(function () {
            el.classList.add('revealed');
          }, index * 80);
          revealObserver.unobserve(el);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('revealed');
    });
  }

  /* --- Capability Card Accordion --- */
  document.querySelectorAll('.capability-card-header').forEach(function (header) {
    header.addEventListener('click', function () {
      var card = this.closest('.capability-card');
      var isActive = card.classList.contains('active');

      document.querySelectorAll('.capability-card.active').forEach(function (c) {
        c.classList.remove('active');
        c.querySelector('.capability-card-header').setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        card.classList.add('active');
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* --- Stats Counter --- */
  var statsSection = document.getElementById('stats');
  if (statsSection && !prefersReducedMotion) {
    var statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          document.querySelectorAll('.stat-number').forEach(function (num) {
            var target = parseInt(num.getAttribute('data-target'), 10);
            var duration = 2000;
            var start = performance.now();

            function tick(now) {
              var progress = Math.min((now - start) / duration, 1);
              var eased = 1 - Math.pow(1 - progress, 3);
              num.textContent = Math.round(target * eased);
              if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
          });
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  } else if (statsSection) {
    document.querySelectorAll('.stat-number').forEach(function (num) {
      num.textContent = num.getAttribute('data-target');
    });
  }

  /* --- FAQ Accordion --- */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = this.closest('.faq-item');
      var isActive = item.classList.contains('active');

      document.querySelectorAll('.faq-item.active').forEach(function (i) {
        i.classList.remove('active');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* --- Testimonial Carousel --- */
  var slides = document.querySelectorAll('.testimonial-slide');
  var dots = document.querySelectorAll('.testimonial-dot');
  var prevBtn = document.getElementById('testimonialPrev');
  var nextBtn = document.getElementById('testimonialNext');
  var currentSlide = 0;
  var autoInterval;

  function showSlide(n) {
    currentSlide = ((n % slides.length) + slides.length) % slides.length;
    slides.forEach(function (s) { s.classList.remove('active'); });
    dots.forEach(function (d) { d.classList.remove('active'); });
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function startAuto() {
    autoInterval = setInterval(function () { showSlide(currentSlide + 1); }, 5000);
  }

  function resetAuto() {
    clearInterval(autoInterval);
    startAuto();
  }

  if (slides.length > 0) {
    if (prevBtn) prevBtn.addEventListener('click', function () { showSlide(currentSlide - 1); resetAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { showSlide(currentSlide + 1); resetAuto(); });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { showSlide(i); resetAuto(); });
    });
    startAuto();
  }

  /* --- Contact Form --- */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = this.querySelector('button[type="submit"]');
      var originalHTML = btn.innerHTML;
      btn.innerHTML = 'Message Sent!';
      btn.disabled = true;
      btn.style.opacity = '0.7';
      setTimeout(function () {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        btn.style.opacity = '';
        contactForm.reset();
      }, 3000);
    });
  }

  /* --- Newsletter Form --- */
  var newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = this.querySelector('button[type="submit"]');
      var original = btn.textContent;
      btn.textContent = 'Subscribed!';
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = original;
        btn.disabled = false;
        newsletterForm.reset();
      }, 3000);
    });
  }

  /* --- Back to Top --- */
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('visible', window.scrollY > window.innerHeight * 0.5);
    }, { passive: true });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --- Cookie Banner --- */
  var cookieBanner = document.getElementById('cookieBanner');
  if (cookieBanner && !localStorage.getItem('pan-cookie-consent')) {
    setTimeout(function () {
      cookieBanner.classList.add('visible');
    }, 1500);

    document.getElementById('cookieAccept').addEventListener('click', function () {
      localStorage.setItem('pan-cookie-consent', 'accepted');
      cookieBanner.classList.remove('visible');
    });

    document.getElementById('cookieDecline').addEventListener('click', function () {
      localStorage.setItem('pan-cookie-consent', 'declined');
      cookieBanner.classList.remove('visible');
    });
  }

  /* --- Footer Year --- */
  var yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
