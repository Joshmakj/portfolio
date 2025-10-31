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

/* ---------- Page Loader: center-burst starfield (fast outward burst) ---------- */
(function initPageLoader() {
  const overlay = document.getElementById('loader-overlay');
  const canvas = document.getElementById('loader-canvas');
  if (!overlay || !canvas) return;

  const ctx = canvas.getContext('2d');
  let DPR = Math.max(1, window.devicePixelRatio || 1);
  let W = 0, H = 0;
  let particles = [];
  let raf = null;
  const LOADER_DURATION = 35000; // 35s max
  let hideTimeout = null;
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
      // burst: start exactly at center with random direction & fast speed
      const angle = Math.random() * Math.PI * 2;
      // speed distribution biased toward faster speeds for burst effect
      const speed = 1.6 + Math.random() * 3.6; // px per frame
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const core = 0.4 + Math.random() * 1.4; // small cores
      // mostly white with slight warm tint on some
      const hue = Math.random() < 0.86 ? 50 + Math.random() * 30 : 210 + Math.random() * 20;
      particles[i] = {
        x: CENTER.x,
        y: CENTER.y,
        vx,
        vy,
        r: core,
        hue,
        alpha: 0.7 + Math.random() * 0.6,
        life: 0,
        maxLife: 60 + Math.round(Math.random() * 140) // frames before respawn
      };
    }
  }

  // respawn particle at center with random direction (keeps continuous burst)
  function respawn(p) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.2 + Math.random() * 4.0;
    p.x = CENTER.x;
    p.y = CENTER.y;
    p.vx = Math.cos(angle) * speed;
    p.vy = Math.sin(angle) * speed;
    p.r = 0.4 + Math.random() * 1.4;
    p.hue = Math.random() < 0.86 ? 50 + Math.random() * 30 : 210 + Math.random() * 20;
    p.alpha = 0.6 + Math.random() * 0.6;
    p.life = 0;
    p.maxLife = 60 + Math.round(Math.random() * 140);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // pure black background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // advance
      p.x += p.vx;
      p.y += p.vy;
      p.life++;

      // twinkle + fade out toward end of life
      const lifeT = p.life / p.maxLife;
      const flick = 0.7 + Math.sin(p.life * 0.08 + i) * 0.35;
      const alpha = Math.max(0, p.alpha * (1 - lifeT) * flick);

      // draw small glowing star
      const size = Math.max(0.3, p.r * (1 + lifeT * 0.6));
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 5);
      const centerColor = `hsla(${p.hue}, 95%, 85%, ${alpha})`;
      const midColor = `hsla(${p.hue}, 85%, 55%, ${alpha * 0.35})`;
      grad.addColorStop(0, centerColor);
      grad.addColorStop(0.18, midColor);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(1, size * 3), 0, Math.PI * 2);
      ctx.fill();

      // if particle is out of bounds or life ended, respawn back at center for continuous burst
      if (p.life > p.maxLife || p.x < -20 || p.x > W + 20 || p.y < -20 || p.y > H + 20) {
        respawn(p);
      }
    }

    raf = requestAnimationFrame(draw);
  }

  function start() {
    cancelAnimationFrame(raf);
    resize();
    draw();

    if (hideTimeout) clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      hideOverlay();
    }, LOADER_DURATION);
  }

  function hideOverlay() {
    if (!overlay) return;
    overlay.classList.add('hidden');
    setTimeout(() => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      try { overlay.remove(); } catch (e) {}
    }, 600);
  }

  // hide early if page finishes loading
  window.addEventListener('load', () => {
    hideOverlay();
    if (hideTimeout) clearTimeout(hideTimeout);
  });

  window.addEventListener('resize', resize, { passive: true });

  // start immediately
  start();
})();