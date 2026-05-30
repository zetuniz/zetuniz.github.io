// ═══════════════════════════════════════════════
//   MBEYA EAT — main.js
// ═══════════════════════════════════════════════

// Loading Screen
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 2800);
});

// Navbar scroll
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active nav link
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
  });
});

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  spans[0].style.transform = navLinksEl.classList.contains('open') ? 'rotate(45deg) translate(5px,5px)' : '';
  spans[1].style.opacity = navLinksEl.classList.contains('open') ? '0' : '1';
  spans[2].style.transform = navLinksEl.classList.contains('open') ? 'rotate(-45deg) translate(5px,-5px)' : '';
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinksEl.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Counter animation
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString();
  }, 16);
}

const countersObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
      countersObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) countersObserver.observe(statsBar);

// Menu tabs
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById(tab);
    if (panel) panel.classList.add('active');
  });
});

// Reservation form
const resForm = document.getElementById('res-form');
const resBtn = document.getElementById('res-btn');

if (resForm) {
  resForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = resForm.querySelector('input[type="text"]').value;
    const phone = resForm.querySelector('input[type="tel"]').value;
    const date = resForm.querySelector('input[type="date"]').value;

    if (!name || !phone || !date) {
      alert('Please fill in all required fields.');
      return;
    }

    resBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Sending...</span>';
    resBtn.disabled = true;

    setTimeout(() => {
      resBtn.innerHTML = '<i class="fas fa-check"></i><span>Reservation Confirmed!</span>';
      resBtn.style.background = '#22c55e';
      resBtn.style.backgroundImage = 'none';

      // Open WhatsApp with reservation details
      const dateStr = date || 'TBD';
      const msg = `Hello Mbeya Eat! I'd like to make a reservation.%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0ADate: ${dateStr}`;
      setTimeout(() => {
        window.open(`https://wa.me/255621335993?text=${msg}`, '_blank');
        resBtn.innerHTML = '<i class="fas fa-calendar-check"></i><span>Confirm Reservation</span>';
        resBtn.style.background = '';
        resBtn.style.backgroundImage = '';
        resBtn.disabled = false;
        resForm.reset();
      }, 1500);
    }, 2000);
  });
}

// WhatsApp quick order
function openWhatsApp(item) {
  const msg = `Hello Mbeya Eat! I'd like to order: *${item}*. Please confirm availability and pricing.`;
  window.open(`https://wa.me/255621335993?text=${encodeURIComponent(msg)}`, '_blank');
}

// Newsletter
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
  newsletterForm.querySelector('button').addEventListener('click', () => {
    const email = newsletterForm.querySelector('input').value;
    if (email && email.includes('@')) {
      newsletterForm.querySelector('button').innerHTML = '<i class="fas fa-check"></i>';
      newsletterForm.querySelector('button').style.background = '#22c55e';
      newsletterForm.querySelector('input').value = '';
      setTimeout(() => {
        newsletterForm.querySelector('button').innerHTML = '<i class="fas fa-arrow-right"></i>';
        newsletterForm.querySelector('button').style.background = '';
      }, 2500);
    }
  });
}

// Card hover 3D tilt
document.querySelectorAll('.dish-card, .why-card, .event-card, .tier-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = (y - cy) / cy * 6;
    const ry = (cx - x) / cx * 6;
    card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// Gallery lightbox (simple)
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    item.style.transform = 'scale(0.97)';
    setTimeout(() => { item.style.transform = ''; }, 150);
  });
});

// AOS init
AOS.init({
  duration: 750,
  easing: 'ease-out-cubic',
  once: true,
  offset: 80,
});

// Swiper testimonials
new Swiper('.testimonials-swiper', {
  loop: true,
  slidesPerView: 1,
  spaceBetween: 24,
  autoplay: { delay: 5000, disableOnInteraction: false },
  pagination: { el: '.swiper-pagination', clickable: true },
  navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
  breakpoints: {
    768: { slidesPerView: 2 },
    1100: { slidesPerView: 3 },
  },
});

// Delivery tracker step animation
const trackerSteps = document.querySelectorAll('.ts-step');
let currentStep = 2;

setInterval(() => {
  trackerSteps.forEach((step, i) => {
    step.classList.remove('done', 'active', 'pending');
    if (i < currentStep) step.classList.add('done');
    else if (i === currentStep) step.classList.add('active');
    else step.classList.add('pending');
  });

  const icon = trackerSteps[currentStep]?.querySelector('.ts-icon i');
  currentStep = currentStep >= trackerSteps.length - 1 ? 0 : currentStep;
}, 3000);

console.log('%c🍽️ Mbeya Eat', 'font-size:24px;font-weight:bold;color:#D4AF37;');
console.log('%cBuilt with ♥ by Zetu — zetuniz.github.io', 'font-size:13px;color:#b8a98a;');
