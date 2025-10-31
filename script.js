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

/* ---------- Page Loader: center-burst starfield (fast outward burst, white stars) ---------- */
(function initPageLoader() {
  const overlay = document.getElementById('loader-overlay');
  const canvas = document.getElementById('loader-canvas');
  if (!overlay || !canvas) return;

  const ctx = canvas.getContext('2d');
  let DPR = Math.max(1, window.devicePixelRatio || 1);
  let W = 0, H = 0;
  let particles = [];
  let raf = null;
  const MIN_VISIBLE = 15000; // ensure loader stays at least 15s
  const MAX_VISIBLE = 35000; // safety max 35s
  let startTime = Date.now();
  let hideScheduled = false;
  const CENTER = { x: 0, y: 0 };

  // number of particles (auto-scale)
  function particleCountForSize(w, h) {
    const area = w * h;
    const base = Math.round(area / 90000);
    return Math.min(Math.max(1200, base), 3500);
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
    CENTER.x = W / 2;
    CENTER.y = H / 2;
    createParticles();
  }

  function createParticles() {
    const count = particleCountForSize(W, H);
    particles = new Array(count);
    for (let i = 0; i < count; i++) {
      const jitter = (Math.random() - 0.5) * 6;
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.6 + Math.random() * 6.0;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const core = 0.4 + Math.random() * 1.6;
      particles[i] = {
        x: CENTER.x + jitter,
        y: CENTER.y + jitter,
        vx,
        vy,
        r: core,
        alpha: 0.7 + Math.random() * 0.6,
        life: 0,
        maxLife: 40 + Math.round(Math.random() * 160)
      };
    }
  }

  function respawn(p) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.8 + Math.random() * 7.0;
    p.x = CENTER.x + (Math.random() - 0.5) * 4;
    p.y = CENTER.y + (Math.random() - 0.5) * 4;
    p.vx = Math.cos(angle) * speed;
    p.vy = Math.sin(angle) * speed;
    p.r = 0.4 + Math.random() * 1.6;
    p.alpha = 0.6 + Math.random() * 0.6;
    p.life = 0;
    p.maxLife = 40 + Math.round(Math.random() * 160);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // pure black background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;
      p.life++;

      const lifeT = p.life / p.maxLife;
      const flick = 0.7 + Math.sin(p.life * 0.08 + i) * 0.35;
      const alpha = Math.max(0, p.alpha * (1 - lifeT) * flick);

      // white glowing star (center -> bright white, mid -> softer white)
      const size = Math.max(0.3, p.r * (1 + lifeT * 0.6));
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 5);
      const centerColor = `rgba(255,255,255, ${alpha})`;
      const midColor = `rgba(255,255,255, ${Math.min(0.35, alpha * 0.35)})`;
      grad.addColorStop(0, centerColor);
      grad.addColorStop(0.18, midColor);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(1, size * 3), 0, Math.PI * 2);
      ctx.fill();

      if (p.life > p.maxLife || p.x < -30 || p.x > W + 30 || p.y < -30 || p.y > H + 30) {
        respawn(p);
      }
    }

    raf = requestAnimationFrame(draw);
  }

  function hideOverlay() {
    if (!overlay || hideScheduled) return;
    hideScheduled = true;
    overlay.classList.add('hidden');
    setTimeout(() => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      try { overlay.remove(); } catch (e) {}
    }, 600);
  }

  function start() {
    cancelAnimationFrame(raf);
    resize();
    draw();
    setTimeout(() => { hideOverlay(); }, MAX_VISIBLE);
  }

  // ensure loader stays visible at least MIN_VISIBLE even if page loads early
  window.addEventListener('load', () => {
    const elapsed = Date.now() - startTime;
    if (elapsed >= MIN_VISIBLE) {
      hideOverlay();
    } else {
      setTimeout(hideOverlay, MIN_VISIBLE - elapsed);
    }
  });

  window.addEventListener('resize', resize, { passive: true });

  // start immediately
  start();
})();