/* ========================================
   PAN Solutions — Premium Scripts v2
   ======================================== */

const isTouch = window.matchMedia('(pointer: coarse)').matches;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* -----------------------------------
   0. PAGE LOADER with Percentage
   ----------------------------------- */
(function () {
  const loader = document.getElementById('pageLoader');
  const percentEl = document.getElementById('loaderPercent');
  const barInner = document.getElementById('loaderBarInner');
  let progress = 0;
  const startTime = Date.now();

  function updateLoader() {
    const elapsed = Date.now() - startTime;
    // Simulate progress: fast to 80%, slow to 95%, then wait for load
    if (progress < 80) {
      progress += (80 - progress) * 0.08;
    } else if (progress < 95) {
      progress += (95 - progress) * 0.02;
    }
    percentEl.textContent = Math.round(progress) + '%';
    barInner.style.width = progress + '%';
    if (progress < 95) {
      requestAnimationFrame(updateLoader);
    }
  }
  if (!prefersReducedMotion) requestAnimationFrame(updateLoader);

  window.addEventListener('load', () => {
    progress = 100;
    percentEl.textContent = '100%';
    barInner.style.width = '100%';
    setTimeout(() => {
      loader.classList.add('loaded');
    }, 400);
  });
})();

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------
     1. THEME TOGGLE
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
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* -----------------------------------
     3. TYPING EFFECT (Hero)
     ----------------------------------- */
  const words = ['AI.', 'Cyber Security.', 'Data.', 'Integration.'];
  const typingEl = document.getElementById('typingText');
  let wordIndex = 0, charIndex = 0, isDeleting = false, typingSpeed = 100;

  function typeLoop() {
    const currentWord = words[wordIndex];
    if (!isDeleting) {
      typingEl.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentWord.length) { isDeleting = true; typingSpeed = 2000; }
      else { typingSpeed = 80 + Math.random() * 40; }
    } else {
      typingEl.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) { isDeleting = false; wordIndex = (wordIndex + 1) % words.length; typingSpeed = 400; }
      else { typingSpeed = 40; }
    }
    setTimeout(typeLoop, typingSpeed);
  }
  typeLoop();

  /* -----------------------------------
     4. SCROLL REVEAL with Stagger
     ----------------------------------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = entry.target.dataset.index;
        const stagger = idx ? parseInt(idx) * 120 : 0;
        setTimeout(() => entry.target.classList.add('revealed'), stagger);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* -----------------------------------
     5. EXPANDABLE CAPABILITY CARDS
     ----------------------------------- */
  document.querySelectorAll('.capability-card').forEach(card => {
    const header = card.querySelector('.capability-card-header');
    header.addEventListener('click', () => {
      const isActive = card.classList.contains('active');
      document.querySelectorAll('.capability-card').forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-expanded', 'false');
      });
      if (!isActive) {
        card.classList.add('active');
        card.setAttribute('aria-expanded', 'true');
      }
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
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        statNumbers.forEach(num => animateCounter(num));
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) statsObserver.observe(statsSection);

  /* -----------------------------------
     7. CONTACT FORM (static demo)
     ----------------------------------- */
  const contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Message Sent!'; btn.disabled = true; btn.style.opacity = '.7';
    setTimeout(() => { btn.textContent = orig; btn.disabled = false; btn.style.opacity = '1'; contactForm.reset(); }, 3000);
  });

  /* -----------------------------------
     8. FOOTER YEAR
     ----------------------------------- */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -----------------------------------
     9. SMOOTH SCROLL for anchor links
     ----------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.width = (docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  /* -----------------------------------
     11. FLOATING BACK-TO-TOP
     ----------------------------------- */
  const floatingTop = document.getElementById('floatingTop');
  function updateFloatingTop() {
    floatingTop.classList.toggle('visible', window.scrollY > window.innerHeight * 0.5);
  }
  window.addEventListener('scroll', updateFloatingTop, { passive: true });
  floatingTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* -----------------------------------
     12. CUSTOM CURSOR (desktop only)
     ----------------------------------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  if (!isTouch && cursorDot && cursorRing) {
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const hoverTargets = document.querySelectorAll('a, button, .capability-card-header, .showcase-item, .faq-question, input, textarea');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
    });
  }

  /* -----------------------------------
     13. PARALLAX EFFECT
     ----------------------------------- */
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  function updateParallax() {
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.05;
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const viewCenter = window.innerHeight / 2;
      el.style.transform = `translateY(${(center - viewCenter) * speed}px)`;
    });
  }
  if (!isTouch && !prefersReducedMotion) {
    window.addEventListener('scroll', updateParallax, { passive: true });
    updateParallax();
  }

  /* -----------------------------------
     14. PARTICLE NETWORK (Hero Canvas)
     ----------------------------------- */
  const canvas = document.getElementById('particleCanvas');
  if (canvas && !isTouch && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let cW, cH, mx = -1000, my = -1000;
    const PARTICLE_COUNT = 45;
    const CONNECT_DIST = 120;
    const MOUSE_RADIUS = 150;

    function resizeCanvas() {
      const hero = canvas.parentElement;
      cW = canvas.width = hero.offsetWidth;
      cH = canvas.height = hero.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function getColor() {
      const style = getComputedStyle(document.documentElement);
      return style.getPropertyValue('--particle-color').trim();
    }

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * cW;
        this.y = Math.random() * cH;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.r = Math.random() * 2 + 1;
      }
      update() {
        // Mouse repulsion
        const dx = this.x - mx, dy = this.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 0.8;
          this.vx += (dx / dist) * force;
          this.vy += (dy / dist) * force;
        }
        // Damping
        this.vx *= 0.98; this.vy *= 0.98;
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > cW) this.vx *= -1;
        if (this.y < 0 || this.y > cH) this.vy *= -1;
        this.x = Math.max(0, Math.min(cW, this.x));
        this.y = Math.max(0, Math.min(cH, this.y));
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    canvas.parentElement.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    });
    canvas.parentElement.addEventListener('mouseleave', () => { mx = -1000; my = -1000; });

    function animateParticles() {
      ctx.clearRect(0, 0, cW, cH);
      const color = getColor();
      particles.forEach(p => p.update());
      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.15;
            ctx.strokeStyle = `rgba(${color},${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      // Draw dots
      particles.forEach(p => {
        ctx.fillStyle = `rgba(${color},0.4)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* -----------------------------------
     15. 3D CARD TILT (desktop only)
     ----------------------------------- */
  if (!isTouch && !prefersReducedMotion) {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotateX = ((y - cy) / cy) * -5;
        const rotateY = ((x - cx) / cx) * 5;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s ease';
        setTimeout(() => { card.style.transition = ''; }, 500);
      });
    });
  }

  /* -----------------------------------
     16. MAGNETIC BUTTONS (desktop only)
     ----------------------------------- */
  if (!isTouch && !prefersReducedMotion) {
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
      const RADIUS = 80;
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const bx = rect.left + rect.width / 2;
        const by = rect.top + rect.height / 2;
        const dx = e.clientX - bx;
        const dy = e.clientY - by;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < RADIUS) {
          const pull = (RADIUS - dist) / RADIUS;
          btn.style.transform = `translate(${dx * pull * 0.3}px, ${dy * pull * 0.3}px)`;
        }
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.4s cubic-bezier(.4,0,.2,1)';
        setTimeout(() => { btn.style.transition = ''; }, 400);
      });
    });
  }

  /* -----------------------------------
     17. SVG DRAW ON SCROLL
     ----------------------------------- */
  const svgDrawObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger based on parent's index
        const parentCard = entry.target.closest('[data-index]');
        const idx = parentCard ? parseInt(parentCard.dataset.index) : 0;
        setTimeout(() => {
          entry.target.classList.add('drawn');
        }, idx * 200);
        svgDrawObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.svg-draw').forEach(el => svgDrawObserver.observe(el));

  /* -----------------------------------
     18. HIGHLIGHT TEXT ON SCROLL
     ----------------------------------- */
  const highlightObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        highlightObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.highlight-text').forEach(el => highlightObserver.observe(el));

  /* -----------------------------------
     19. SECTION DOTS NAVIGATION
     ----------------------------------- */
  const sectionDots = document.getElementById('sectionDots');
  if (sectionDots) {
    const dots = sectionDots.querySelectorAll('.dot');
    const sections = [];
    dots.forEach(dot => {
      const targetId = dot.dataset.target;
      const section = document.getElementById(targetId);
      if (section) sections.push({ dot, section });
      dot.addEventListener('click', () => {
        if (section) {
          const offset = navbar.offsetHeight + 10;
          window.scrollTo({ top: section.offsetTop - offset, behavior: 'smooth' });
        }
      });
    });

    function updateDots() {
      const scrollPos = window.scrollY + window.innerHeight / 3;
      let currentSection = sections[0];
      sections.forEach(s => {
        if (s.section.offsetTop <= scrollPos) currentSection = s;
      });
      dots.forEach(d => d.classList.remove('active'));
      if (currentSection) currentSection.dot.classList.add('active');
    }
    window.addEventListener('scroll', updateDots, { passive: true });
    updateDots();
  }

  /* -----------------------------------
     20. TESTIMONIAL CAROUSEL
     ----------------------------------- */
  const slides = document.querySelectorAll('.testimonial-slide');
  const testDots = document.querySelectorAll('#testDots button');
  const testPrev = document.getElementById('testPrev');
  const testNext = document.getElementById('testNext');
  let currentSlide = 0;
  let autoRotate;

  function showSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    testDots.forEach(d => d.classList.remove('active'));
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    testDots[currentSlide].classList.add('active');
  }

  function startAutoRotate() {
    autoRotate = setInterval(() => showSlide(currentSlide + 1), 5000);
  }

  if (testNext) testNext.addEventListener('click', () => { clearInterval(autoRotate); showSlide(currentSlide + 1); startAutoRotate(); });
  if (testPrev) testPrev.addEventListener('click', () => { clearInterval(autoRotate); showSlide(currentSlide - 1); startAutoRotate(); });
  testDots.forEach((dot, i) => dot.addEventListener('click', () => { clearInterval(autoRotate); showSlide(i); startAutoRotate(); }));
  startAutoRotate();

  /* -----------------------------------
     21. FAQ ACCORDION
     ----------------------------------- */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isActive = item.classList.contains('active');
      // Close all
      document.querySelectorAll('.faq-item').forEach(f => {
        f.classList.remove('active');
        f.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!isActive) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* -----------------------------------
     22. NEWSLETTER FORM (static)
     ----------------------------------- */
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = newsletterForm.querySelector('button');
      const orig = btn.textContent;
      btn.textContent = 'Subscribed!';
      btn.disabled = true;
      setTimeout(() => { btn.textContent = orig; btn.disabled = false; newsletterForm.reset(); }, 3000);
    });
  }

  /* -----------------------------------
     23. GDPR COOKIE BANNER
     ----------------------------------- */
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAccept = document.getElementById('cookieAccept');
  const cookieDecline = document.getElementById('cookieDecline');

  if (!localStorage.getItem('pan-cookie-consent')) {
    setTimeout(() => cookieBanner.classList.add('visible'), 1500);
  }

  function handleCookie(choice) {
    localStorage.setItem('pan-cookie-consent', choice);
    cookieBanner.classList.remove('visible');
  }

  if (cookieAccept) cookieAccept.addEventListener('click', () => handleCookie('accepted'));
  if (cookieDecline) cookieDecline.addEventListener('click', () => handleCookie('declined'));

  /* -----------------------------------
     24. CHAT WIDGET (demo)
     ----------------------------------- */
  const chatWidget = document.getElementById('chatWidget');
  const chatToggle = document.getElementById('chatToggle');
  const chatPanel = document.getElementById('chatPanel');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');

  if (chatToggle) {
    chatToggle.addEventListener('click', () => {
      chatWidget.classList.toggle('open');
    });
  }

  // Close on click outside
  document.addEventListener('click', e => {
    if (chatWidget && chatWidget.classList.contains('open') &&
        !chatWidget.contains(e.target)) {
      chatWidget.classList.remove('open');
    }
  });

  if (chatForm) {
    const botResponses = [
      'Thanks for your message! Our team typically responds within one business day.',
      'Great question! We\'d be happy to schedule a call to discuss this in detail.',
      'I appreciate your interest. Could you share more about your current tech stack?',
      'Our consultants specialise in exactly that area. Let me connect you with the right person.',
    ];

    chatForm.addEventListener('submit', e => {
      e.preventDefault();
      const msg = chatInput.value.trim();
      if (!msg) return;

      // Add user message
      const userDiv = document.createElement('div');
      userDiv.className = 'chat-msg user';
      userDiv.innerHTML = `<p>${msg}</p>`;
      chatMessages.appendChild(userDiv);
      chatInput.value = '';
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Bot response after delay
      setTimeout(() => {
        const botDiv = document.createElement('div');
        botDiv.className = 'chat-msg bot';
        botDiv.innerHTML = `<p>${botResponses[Math.floor(Math.random() * botResponses.length)]}</p>`;
        chatMessages.appendChild(botDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 800);
    });
  }

});
