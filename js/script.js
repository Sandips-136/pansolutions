/* ========================================
   PAN Solutions — Enhanced Scripts
   ======================================== */

/* -----------------------------------
   0. PAGE LOADER
   ----------------------------------- */
window.addEventListener('load', () => {
  const loader = document.getElementById('pageLoader');
  // Minimum display time of 600ms
  setTimeout(() => {
    loader.classList.add('loaded');
  }, 600);
});

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------
     1. THEME TOGGLE (Light / Dark)
     ----------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('pan-theme', theme);
  }

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') || 'dark';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  /* -----------------------------------
     2. NAVBAR — Scroll & Mobile Toggle
     ----------------------------------- */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('navHamburger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* -----------------------------------
     3. TYPING EFFECT (Hero)
     ----------------------------------- */
  const words = ['AI.', 'Cyber Security.', 'Data.', 'Integration.'];
  const typingEl = document.getElementById('typingText');
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeLoop() {
    const currentWord = words[wordIndex];

    if (!isDeleting) {
      typingEl.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentWord.length) {
        isDeleting = true;
        typingSpeed = 2000;
      } else {
        typingSpeed = 80 + Math.random() * 40;
      }
    } else {
      typingEl.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typingSpeed = 400;
      } else {
        typingSpeed = 40;
      }
    }

    setTimeout(typeLoop, typingSpeed);
  }

  typeLoop();

  /* -----------------------------------
     4. SCROLL REVEAL with Stagger
     ----------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = entry.target.dataset.index;
          const stagger = idx ? parseInt(idx) * 120 : 0;

          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, stagger);

          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* -----------------------------------
     5. EXPANDABLE CAPABILITY CARDS
     ----------------------------------- */
  const capabilityCards = document.querySelectorAll('.capability-card');

  capabilityCards.forEach((card) => {
    const header = card.querySelector('.capability-card-header');
    header.addEventListener('click', () => {
      const isActive = card.classList.contains('active');
      capabilityCards.forEach((c) => c.classList.remove('active'));
      if (!isActive) card.classList.add('active');
    });
  });

  /* -----------------------------------
     6. ANIMATED STATS COUNTER
     ----------------------------------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          statNumbers.forEach((num) => animateCounter(num));
          statsObserver.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) statsObserver.observe(statsSection);

  /* -----------------------------------
     7. CONTACT FORM (static demo)
     ----------------------------------- */
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Message Sent!';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
      btn.style.opacity = '1';
      form.reset();
    }, 3000);
  });

  /* -----------------------------------
     8. FOOTER YEAR
     ----------------------------------- */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -----------------------------------
     9. SMOOTH SCROLL for anchor links
     ----------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 20;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* -----------------------------------
     10. SCROLL PROGRESS BAR
     ----------------------------------- */
  const scrollProgress = document.getElementById('scrollProgress');

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  /* -----------------------------------
     11. FLOATING BACK-TO-TOP BUTTON
     ----------------------------------- */
  const floatingTop = document.getElementById('floatingTop');

  function updateFloatingTop() {
    floatingTop.classList.toggle('visible', window.scrollY > window.innerHeight * 0.5);
  }

  window.addEventListener('scroll', updateFloatingTop, { passive: true });

  floatingTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* -----------------------------------
     12. CUSTOM CURSOR (desktop only)
     ----------------------------------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  if (!isTouch && cursorDot && cursorRing) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    // Smooth ring follow
    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effect on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .capability-card-header, .showcase-item, input, textarea');
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
    });
  }

  /* -----------------------------------
     13. PARALLAX EFFECT
     ----------------------------------- */
  const parallaxElements = document.querySelectorAll('[data-parallax]');

  function updateParallax() {
    const scrollY = window.scrollY;

    parallaxElements.forEach((el) => {
      const speed = parseFloat(el.dataset.parallax) || 0.05;
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const viewCenter = window.innerHeight / 2;
      const offset = (center - viewCenter) * speed;

      el.style.transform = `translateY(${offset}px)`;
    });
  }

  // Only on desktop
  if (!isTouch) {
    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();
  }
});
