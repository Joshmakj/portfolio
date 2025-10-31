document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("toggleBtn");
  const sections = ["about", "skills", "education", "projects", "contact"];
  const links = sidebar ? sidebar.querySelectorAll("a") : [];

  // Sidebar toggle (safe guard)
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("active");
      document.body.classList.toggle("sidebar-open", sidebar.classList.contains("active"));
    });
  }

  // Helper: hide all main sections + container
  function hideAll() {
    sections.forEach(sec => {
      const el = document.getElementById(sec);
      if (el) el.style.display = "none";
    });
    const mainContainer = document.querySelector(".container");
    if (mainContainer) mainContainer.style.display = "none";
  }

  // Section navigation (links in sidebar)
  links.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      // read only visible text (icon <i> won't affect .trim())
      const target = (link.textContent || "").trim().toLowerCase();

      hideAll();

      if (target === "home") {
        const mainContainer = document.querySelector(".container");
        if (mainContainer) mainContainer.style.display = "flex";
      } else {
        const sec = document.getElementById(target);
        if (sec) {
          sec.style.display = "block";
          sec.classList.add('show');
          if (target === 'about') animateSkillBars();
        }
      }

      // Close sidebar after click
      if (sidebar) {
        sidebar.classList.remove("active");
        document.body.classList.remove("sidebar-open");
      }

      // keep user at top of the new section
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 60);
    });
  });

  // Web3Forms contact submit (if form exists)
  const contactForm = document.querySelector("#contact form");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      formData.append("access_key", "c6e68daa-84b0-40fb-a70f-91fb22b63c96");

      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData
        });
        if (response.ok) {
          alert("✅ Message sent successfully!");
          contactForm.reset();
        } else {
          alert("❌ Something went wrong. Please try again later.");
        }
      } catch (err) {
        console.error("Contact submit error:", err);
        alert("⚠️ Network error. Please check your connection.");
      }
    });
  }

  // Hire Me button -> show contact
  const hireMeBtn = document.getElementById("hireMeBtn");
  if (hireMeBtn) {
    hireMeBtn.addEventListener("click", () => {
      hideAll();
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.style.display = "block";
        contactSection.classList.add('show');
      }
      if (sidebar) {
        sidebar.classList.remove("active");
        document.body.classList.remove("sidebar-open");
      }
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 80);
    });
  }

  // Projects button -> show projects
  const projectsBtn = document.getElementById("projectsBtn");
  if (projectsBtn) {
    projectsBtn.addEventListener("click", () => {
      hideAll();
      const projectsSection = document.getElementById("projects");
      if (projectsSection) {
        projectsSection.style.display = "block";
        projectsSection.classList.add('show');
      }
      if (sidebar) {
        sidebar.classList.remove("active");
        document.body.classList.remove("sidebar-open");
      }
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 80);
    });
  }

  // Role rotation animation for the profile card
  (function rotateProfileRole() {
    const roleEl = document.querySelector('.card .role');
    if (!roleEl) return;

    const roles = [
      "Python Full Stack Developer",
      "Front End Developer",
      "Web Developer",
      "Software Developer"
    ];

    let idx = 0;
    const duration = 3000; // ms each role is visible
    const fadeTime = 350;  // should match CSS transition

    // Initialize text
    roleEl.textContent = roles[0];

    setInterval(() => {
      // fade out
      roleEl.classList.add('fade-out');

      // after fade out, swap text and fade in
      setTimeout(() => {
        idx = (idx + 1) % roles.length;
        roleEl.textContent = roles[idx];
        roleEl.classList.remove('fade-out');
        roleEl.classList.add('fade-in');

        // remove fade-in after animation completes
        setTimeout(() => roleEl.classList.remove('fade-in'), fadeTime);
      }, fadeTime);
    }, duration);
  })();

  // animate skill bars inside About
  function animateSkillBars() {
    const about = document.getElementById('about');
    if (!about) return;
    about.classList.add('show');

    const bars = about.querySelectorAll('.skill-bar');
    bars.forEach((bar, i) => {
      const percent = parseInt(bar.getAttribute('data-percent') || '0', 10);
      const inner = bar.querySelector('i');
      if (inner) {
        // small delay for stagger effect
        const delay = 120 * i;
        // reset before animating (allows repeat)
        inner.style.width = '0%';
        setTimeout(() => {
          inner.style.width = percent + '%';
        }, delay);
      }
    });
  }

  // If About is visible on load, animate
  const aboutOnLoad = document.getElementById('about');
  if (aboutOnLoad && aboutOnLoad.style.display !== 'none') {
    animateSkillBars();
  }

  // About CTA -> show contact
  const aboutContactBtn = document.getElementById('aboutContactBtn');
  if (aboutContactBtn) {
    aboutContactBtn.addEventListener('click', () => {
      hideAll();
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.style.display = "block";
        contactSection.classList.add('show');
      }
      if (sidebar) {
        sidebar.classList.remove("active");
        document.body.classList.remove("sidebar-open");
      }
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 80);
    });
  }
});

/* ---------- Page Loader: high-density star field (15s, small stars) ---------- */
(function initPageLoader() {
  const overlay = document.getElementById('loader-overlay');
  const canvas = document.getElementById('loader-canvas');
  if (!overlay || !canvas) return;

  const ctx = canvas.getContext('2d');
  let DPR = Math.max(1, window.devicePixelRatio || 1);
  let W = 0, H = 0;
  let particles = [];
  let raf = null;
  let mouse = { x: -9999, y: -9999 };

  const LOADER_DURATION = 15000; // 15 seconds
  let hideTimeout = null;

  // compute particle count (thousands on large screens), but keep them very small
  function particleCountForSize(w, h) {
    const area = w * h;
    // one particle per ~80k px -> yields 1000-2500 depending on screen
    const count = Math.round(area / 80000);
    return Math.min(Math.max(1000, count), 3500); // clamp 1000..3500
  }

  function resize() {
    DPR = Math.max(1, window.devicePixelRatio || 1);
    W = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    H = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    createParticles();
  }

  function createParticles() {
    const count = particleCountForSize(W, H);
    particles = new Array(count);
    for (let i = 0; i < count; i++) {
      // very small stars
      const r = 0.4 + Math.random() * 1.6; // core radius (px)
      particles[i] = {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: r,
        hue: Math.random() < 0.82 ? 60 + Math.random() * 30 : 200 + Math.random() * 30, // mostly warm yellow, some bluish
        alpha: 0.5 + Math.random() * 0.9,
        tw: Math.random() * Math.PI * 2,
        twS: 0.006 + Math.random() * 0.014
      };
    }
  }

  // pointer interaction (soft parallax)
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });
  window.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    mouse.x = t.clientX;
    mouse.y = t.clientY;
  }, { passive: true });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // pure black background for strong contrast
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);

    // draw stars (small radial gradients for glow)
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // twinkle factor
      p.tw += p.twS;
      const flick = 0.6 + Math.sin(p.tw) * 0.6;

      // subtle movement + pointer parallax
      if (mouse.x > -9000) {
        const dx = (mouse.x - W * 0.5) * 0.00006;
        const dy = (mouse.y - H * 0.5) * 0.00006;
        p.x += p.vx + dx * (Math.random() * 6);
        p.y += p.vy + dy * (Math.random() * 6);
      } else {
        p.x += p.vx;
        p.y += p.vy;
      }

      // wrap around
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;

      const size = Math.max(0.4, p.r * flick);
      // star core (bright)
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 6);
      const colorCenter = `hsla(${p.hue}, 95%, 70%, ${Math.min(1, p.alpha)})`;
      const colorMid = `hsla(${p.hue}, 80%, 55%, ${Math.min(0.35, p.alpha * 0.45)})`;
      grad.addColorStop(0, colorCenter);
      grad.addColorStop(0.15, colorMid);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(1, size * 4), 0, Math.PI * 2);
      ctx.fill();
    }

    raf = requestAnimationFrame(draw);
  }

  function start() {
    cancelAnimationFrame(raf);
    resize();
    draw();

    // set auto-hide after LOADER_DURATION if still visible
    if (hideTimeout) clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      hideOverlay();
    }, LOADER_DURATION);
  }

  function hideOverlay() {
    if (!overlay) return;
    overlay.classList.add('hidden');
    // give fade time, then remove canvas and listeners
    setTimeout(() => {
      cancelAnimationFrame(raf);
      // cleanup listeners
      window.removeEventListener('mousemove', () => {});
      window.removeEventListener('touchstart', () => {});
      window.removeEventListener('resize', resize);
      try { overlay.remove(); } catch (e) { /* ignore */ }
    }, 600);
  }

  // hide early if page fully loads
  window.addEventListener('load', () => {
    hideOverlay();
    if (hideTimeout) clearTimeout(hideTimeout);
  });

  window.addEventListener('resize', resize, { passive: true });

  // start
  start();
})();