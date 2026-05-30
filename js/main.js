/* ═══════════════════════════════════════════════════════════
   THOMAS PORTFOLIO — MAIN JAVASCRIPT
   Particles · Cursor · Typed Text · Counters · Animations
═══════════════════════════════════════════════════════════ */

'use strict';

/* ─── Loading Screen ────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }, 2800);
});

document.body.style.overflow = 'hidden';

/* ─── Custom Cursor ─────────────────────────────────────── */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top  = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

// Cursor hover effects
document.querySelectorAll('a, button, .service-card, .project-card, .skill-card, .filter-btn, .social-link, .contact-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '16px';
    cursor.style.height = '16px';
    cursor.style.background = 'var(--neon-3)';
    follower.style.width = '52px';
    follower.style.height = '52px';
    follower.style.borderColor = 'rgba(168,85,247,0.6)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '10px';
    cursor.style.height = '10px';
    cursor.style.background = 'var(--neon)';
    follower.style.width = '36px';
    follower.style.height = '36px';
    follower.style.borderColor = 'rgba(0,212,255,0.5)';
  });
});

/* ─── Particles Canvas ──────────────────────────────────── */
const canvas = document.getElementById('particles-canvas');
const ctx    = canvas.getContext('2d');
let particles = [];
let animFrame;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x     = Math.random() * canvas.width;
    this.y     = Math.random() * canvas.height;
    this.size  = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color  = Math.random() > 0.6
      ? `rgba(0,212,255,${this.opacity})`
      : Math.random() > 0.5
        ? `rgba(124,58,237,${this.opacity})`
        : `rgba(168,85,247,${this.opacity})`;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < -10 || this.x > canvas.width + 10 || this.y < -10 || this.y > canvas.height + 10) {
      this.reset();
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function initParticles() {
  const count = Math.min(120, Math.floor((canvas.width * canvas.height) / 12000));
  particles = Array.from({ length: count }, () => new Particle());
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const alpha = (1 - dist / 120) * 0.15;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  animFrame = requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// Pause particles when tab is hidden (perf)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) cancelAnimationFrame(animFrame);
  else animateParticles();
});

/* ─── Typed Text Effect ─────────────────────────────────── */
const typedEl = document.getElementById('typed-text');
const phrases = [
  'Premium Websites',
  'AI Automations',
  'Mobile Apps',
  'Brand Identities',
  'Digital Experiences',
  'Smart Systems',
];
let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;
let typingTimer;

function typeText() {
  const currentPhrase = phrases[phraseIndex];
  if (!isDeleting) {
    typedEl.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentPhrase.length) {
      isDeleting = true;
      typingTimer = setTimeout(typeText, 1800);
      return;
    }
  } else {
    typedEl.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingTimer = setTimeout(typeText, 400);
      return;
    }
  }
  const speed = isDeleting ? 50 : 80;
  typingTimer = setTimeout(typeText, speed);
}

setTimeout(typeText, 3200);

/* ─── Navbar Scroll ─────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function handleScroll() {
  const scrollY = window.scrollY;

  // Scrolled class
  navbar.classList.toggle('scrolled', scrollY > 50);

  // Back to top
  const backBtn = document.getElementById('back-to-top');
  backBtn.classList.toggle('show', scrollY > 400);

  // Active nav link
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (scrollY >= sectionTop) current = section.getAttribute('id');
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
  });

  // Progress bars (trigger when in view)
  triggerProgressBars();
}

window.addEventListener('scroll', handleScroll, { passive: true });

/* ─── Hamburger Menu ────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinksEl.classList.toggle('open');
});

navLinksEl.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinksEl.classList.remove('open');
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('active');
    navLinksEl.classList.remove('open');
  }
});

/* ─── Theme Toggle ──────────────────────────────────────── */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon   = document.getElementById('theme-icon');
const html        = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

/* ─── Smooth Scroll ─────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─── Back to Top ───────────────────────────────────────── */
document.getElementById('back-to-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─── Animated Counters ─────────────────────────────────── */
const counters = document.querySelectorAll('.stat-num[data-target]');
let countersStarted = false;

function startCounters() {
  if (countersStarted) return;
  const heroStats = document.querySelector('.hero-stats');
  if (!heroStats) return;
  const rect = heroStats.getBoundingClientRect();
  if (rect.top < window.innerHeight) {
    countersStarted = true;
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target);
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current);
        }
      }, 16);
    });
  }
}

/* ─── Progress Bars ─────────────────────────────────────── */
let progressTriggered = false;

function triggerProgressBars() {
  if (progressTriggered) return;
  const bars = document.querySelectorAll('.progress-fill');
  if (!bars.length) return;

  bars.forEach(bar => {
    const rect = bar.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      progressTriggered = true;
      bars.forEach(b => {
        const width = b.getAttribute('data-width');
        b.style.width = width + '%';
      });
    }
  });

  startCounters();
}

/* ─── Project Filter ────────────────────────────────────── */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');
    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeInUp 0.4s ease both';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ─── Contact Form ──────────────────────────────────────── */
const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const btnText = document.getElementById('btn-text');
const btnIcon = document.getElementById('btn-icon');
const formSuccess = document.getElementById('form-success');

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(fieldId, message) {
  const errorEl = document.getElementById(fieldId + '-error');
  const input = document.getElementById(fieldId);
  if (errorEl) errorEl.textContent = message;
  if (input) input.style.borderColor = 'rgba(239,68,68,0.5)';
}

function clearErrors() {
  document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
  document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => {
    el.style.borderColor = '';
  });
}

form && form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  let valid = true;

  if (!name) { showError('name', 'Please enter your name.'); valid = false; }
  if (!email) { showError('email', 'Please enter your email.'); valid = false; }
  else if (!validateEmail(email)) { showError('email', 'Please enter a valid email.'); valid = false; }
  if (!message) { showError('message', 'Please enter a message.'); valid = false; }

  if (!valid) return;

  // Simulate sending
  submitBtn.disabled = true;
  btnText.textContent = 'Sending...';
  btnIcon.className = 'fas fa-spinner fa-spin';

  await new Promise(r => setTimeout(r, 2000));

  btnText.textContent = 'Message Sent!';
  btnIcon.className = 'fas fa-check';
  submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
  formSuccess.classList.add('show');

  setTimeout(() => {
    form.reset();
    submitBtn.disabled = false;
    btnText.textContent = 'Send Message';
    btnIcon.className = 'fas fa-paper-plane';
    submitBtn.style.background = '';
    formSuccess.classList.remove('show');
  }, 4000);
});

/* ─── Swiper Testimonials ───────────────────────────────── */
new Swiper('.testimonials-swiper', {
  slidesPerView: 1,
  spaceBetween: 28,
  centeredSlides: false,
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    640: { slidesPerView: 1 },
    900: { slidesPerView: 2 },
    1200: { slidesPerView: 3 },
  },
});

/* ─── AOS Init ──────────────────────────────────────────── */
AOS.init({
  duration: 700,
  easing: 'ease-out-cubic',
  once: true,
  offset: 60,
  delay: 0,
});

/* ─── Service card spotlight effect ────────────────────── */
document.querySelectorAll('.service-card, .project-card, .skill-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', x + '%');
    card.style.setProperty('--mouse-y', y + '%');

    const rotateX = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
    const rotateY = ((e.clientX - rect.left) / rect.width - 0.5) * -6;
    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ─── Glowing orbit lines in hero (decorative) ──────────── */
function addHeroDecorations() {
  const hero = document.querySelector('.hero-container');
  if (!hero) return;
}

/* ─── Nav link active on scroll ─────────────────────────── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-50% 0px -50% 0px' });

sections.forEach(s => observer.observe(s));

/* ─── Animate progress bars on scroll into view ─────────── */
const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fills = entry.target.querySelectorAll('.progress-fill');
      fills.forEach(fill => {
        fill.style.width = fill.getAttribute('data-width') + '%';
      });
      progressObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const progressSection = document.querySelector('.skills-progress-grid');
if (progressSection) progressObserver.observe(progressSection);

/* ─── Counter observer ──────────────────────────────────── */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { counter.textContent = target; clearInterval(timer); }
          else counter.textContent = Math.floor(current);
        }, 16);
      });
      counterObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.hero-stats');
if (statsEl) counterObserver.observe(statsEl);

/* ─── Console easter egg ─────────────────────────────────── */
console.log('%c👋 Hey there, fellow developer!', 'color:#00d4ff;font-size:18px;font-weight:bold;');
console.log('%cLike what you see? Thomas built this. Get in touch → thomas@example.com', 'color:#a855f7;font-size:13px;');
