/* =============================================
   SEIDON GLASS — main.js
   Keep this simple. No frameworks needed.
   ============================================= */

  //  --- GSAP ---
gsap.registerPlugin(ScrollTrigger);
console.log("GSAP connected");

/* --- PINNED SERVICES SHOWCASE --- */
const serviceData = [
  {
    number: "01",
    title: "Showers & Enclosures",
    text: "Frameless, semi-frameless, and framed enclosures built to fit your space cleanly.",
    link: "services/shower-doors.html",
    linkText: "View options →"
  },
  {
    number: "02",
    title: "Storefront Systems",
    text: "Aluminum storefronts, entrances, door systems, and retail glass solutions.",
    link: "#estimate",
    linkText: "See storefronts →"
  },
  {
    number: "03",
    title: "Commercial Glazing",
    text: "Office partitions, glass walls, conference rooms, and interior glazing systems.",
    link: "#estimate",
    linkText: "Explore commercial →"
  },
  {
    number: "04",
    title: "Window & Glass Replacement",
    text: "Broken glass, failed IGUs, mirrors, and residential or light commercial replacement.",
    link: "#estimate",
    linkText: "View glass services →"
  }
];

const section = document.querySelector(".services-showcase");

if (section && typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  const mediaItems = gsap.utils.toArray(".showcase-media");
  const buttons = gsap.utils.toArray(".showcase-progress button");
  const card = document.querySelector(".showcase-card");
  const number = document.querySelector(".showcase-number");
  const title = document.querySelector(".showcase-title");
  const text = document.querySelector(".showcase-text");
  const link = document.querySelector(".showcase-link");

  let current = 0;

  function setService(index) {
    index = Math.max(0, Math.min(index, serviceData.length - 1));
    if (index === current) return;

    current = index;

    mediaItems.forEach((item, i) => {
      item.classList.toggle("is-active", i === index);
      if (item.tagName === "VIDEO") {
        if (i === index) item.play().catch(() => {});
        else item.pause();
      }
    });

    buttons.forEach((btn, i) => {
      btn.classList.toggle("is-active", i === index);
    });

    gsap.to(card, {
      opacity: 0,
      y: -22,
      duration: 0.22,
      ease: "power2.in",
      onComplete: () => {
      if (number) {
        number.textContent = serviceData[index].number;
      }
        title.textContent = serviceData[index].title;
        text.textContent = serviceData[index].text;
        link.href = serviceData[index].link;
        link.textContent = serviceData[index].linkText;

        gsap.fromTo(card,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.42, ease: "power3.out" }
        );
      }
    });
  }

  setService(0);

  const trigger = ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: "+=2400",
    scrub: true,
    pin: true,
    pinSpacing: true, 
    onUpdate: (self) => {
      const index = Math.min(
        serviceData.length - 1,
        Math.floor(self.progress * serviceData.length)
      );
      setService(index);
    }
  });

  buttons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const targetScroll =
        trigger.start + (trigger.end - trigger.start) * (index / serviceData.length);

      gsap.to(window, {
        scrollTo: targetScroll,
        duration: 0.7,
        ease: "power3.out"
      });
    });
  });
}
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
/* --- PARALLAX ON HERO IMAGE --- */
window.addEventListener("scroll", () => {
  const y = window.scrollY * 0.18;
  document.documentElement.style.setProperty("--hero-parallax", `${y}px`);
}, { passive: true });

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
