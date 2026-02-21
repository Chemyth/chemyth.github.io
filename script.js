// ── Smooth Scrolling ──────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// ── Header scroll + Active Nav (merged into one listener) ─────────
const header   = document.querySelector(".header");
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-menu a");

window.addEventListener("scroll", () => {
  if (header) header.classList.toggle("is-scrolled", window.pageYOffset > 5);

  let current = "";
  sections.forEach((s) => {
    if (window.pageYOffset >= s.offsetTop - 200) current = s.getAttribute("id");
  });
  navLinks.forEach((link) =>
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`)
  );
}, { passive: true });

if (header) header.classList.toggle("is-scrolled", window.pageYOffset > 5);

// ── Mobile Menu ───────────────────────────────────────────────────
const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const navMenu       = document.querySelector(".nav-menu");

const navOverlay = document.createElement("div");
navOverlay.classList.add("nav-overlay");
document.body.appendChild(navOverlay);

if (mobileMenuBtn) {
  const openMenu = () => {
    navMenu.classList.add("active");
    navOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
    mobileMenuBtn.querySelector("i").className = "fas fa-times";
  };
  const closeMenu = () => {
    navMenu.classList.remove("active");
    navOverlay.classList.remove("active");
    document.body.style.overflow = "";
    mobileMenuBtn.querySelector("i").className = "fas fa-bars";
  };

  mobileMenuBtn.addEventListener("click", () =>
    navMenu.classList.contains("active") ? closeMenu() : openMenu()
  );
  navMenu.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", closeMenu)
  );
  navOverlay.addEventListener("click", closeMenu);
}

// ── Typing Effect ─────────────────────────────────────────────────
const typingEl = document.querySelector(".typing-text");
if (typingEl) {
  const text = typingEl.textContent;
  typingEl.textContent = "";
  let i = 0;
  const type = () => {
    if (i < text.length) {
      typingEl.textContent += text[i++];
      setTimeout(type, 100);
    }
  };
  setTimeout(type, 1000);
}

// ── Animate Stats ─────────────────────────────────────────────────
window.addEventListener("load", () => {
  document.querySelectorAll(".stat-item-mini strong").forEach((el) => {
    const full  = el.textContent;
    const match = full.match(/(\d+)/);
    if (!match) return;
    const target = parseInt(match[1]);
    const suffix = full.replace(/\d+/, "");
    let current  = 0;
    const step   = target / 50;
    const timer  = setInterval(() => {
      current += step;
      if (current >= target) { el.textContent = full; clearInterval(timer); }
      else el.textContent = Math.floor(current) + suffix;
    }, 30);
  });
});

// ── 3D Tilt on Project Cards ──────────────────────────────────────
document.querySelectorAll(".project-card[data-tilt]").forEach((card) => {
  const MAX = 12;
  card.addEventListener("mousemove", (e) => {
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${y * MAX}deg) rotateY(${x * -MAX}deg)`;
  });
  card.addEventListener("mouseenter", () => { card.style.transition = "transform 0.15s ease"; });
  card.addEventListener("mouseleave", () => {
    card.style.transition = "transform 0.35s ease";
    card.style.transform  = "";
  });
});

// ── Scroll Fade ───────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );

  document.querySelectorAll(
    ".badge, .hero-title, .hero-description, .hero-buttons, .hero-stats, " +
    ".image-wrapper, .project-card, .section-title, .contact-box"
  ).forEach((el) => {
    el.classList.add("scroll-fade");
    observer.observe(el);
  });
});

// ── Contact Form ──────────────────────────────────────────────────
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  const feedbackEl = contactForm.querySelector(".form-feedback");

  const showFeedback = (msg, type) => {
    if (!feedbackEl) return;
    feedbackEl.textContent = msg;
    feedbackEl.className   = `form-feedback ${type}`;
    setTimeout(() => {
      feedbackEl.textContent = "";
      feedbackEl.className   = "form-feedback";
    }, 5000);
  };

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name    = contactForm.querySelector("#name").value.trim();
    const email   = contactForm.querySelector("#email").value.trim();
    const message = contactForm.querySelector("#message").value.trim();

    if (!name || !email || !message) {
      showFeedback("Please fill in all fields.", "error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFeedback("Please enter a valid email address.", "error");
      return;
    }

    const btn      = contactForm.querySelector(".btn-primary");
    const original = btn.innerHTML;
    btn.innerHTML  = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled   = true;

    setTimeout(() => {
      showFeedback("✓ Message sent! I'll get back to you soon.", "success");
      contactForm.reset();
      btn.innerHTML = original;
      btn.disabled  = false;
    }, 1500);
  });
}
