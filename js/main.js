/* =============================================
   SEIDON GLASS — main.js
   Keep this simple. No frameworks needed.
   ============================================= */

/* --- STICKY HEADER SHADOW ON SCROLL --- */
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* --- MOBILE MENU --- */
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  // Close menu when a link is tapped
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
}

/* --- ESTIMATE FORM SUBMISSION (Formspree) ---
   ----------------------------------------- */
const estimateForm = document.getElementById('estimate-form');
const formSuccess  = document.getElementById('form-success');

if (estimateForm) {
  estimateForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = estimateForm.querySelector('.form-submit');
    const origText = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    try {
      const response = await fetch('https://formspree.io/f/xvzjgjbg', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(estimateForm),
      });
      if (response.ok) {
        estimateForm.reset();
        if (formSuccess) {
          formSuccess.style.display = 'block';
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } else {
        alert('Something went wrong. Please call us directly at (801) 555-0000.');
      }
    } catch {
      alert('Something went wrong. Please call us directly at (801) 555-0000.');
    } finally {
      btn.textContent = origText;
      btn.disabled = false;
    }
  });
}
/* --- parallax on hero image--- */
<script>
  window.addEventListener("scroll", () => {
    const y = window.scrollY * 0.18;
    document.documentElement.style.setProperty("--hero-parallax", `${y}px`);
  });
</script>

/* --- SMOOTH ANCHOR SCROLL (accounts for fixed header height) --- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = (header ? header.offsetHeight : 0) + 16;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

/* --- LAZY LOAD IMAGES --- */
if ('IntersectionObserver' in window) {
  const lazyImages = document.querySelectorAll('img[data-src]');
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });
  lazyImages.forEach(img => io.observe(img));
}
