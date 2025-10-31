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

  // initialize subtle particle background
  initBgParticles();
});

/* ----------------- background particles ----------------- */
function initBgParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let DPR = Math.max(1, window.devicePixelRatio || 1);
  let w, h, particles;

  function resize() {
    DPR = Math.max(1, window.devicePixelRatio || 1);
    w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function createParticles(count = Math.round((w * h) / 90000)) {
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: 6 + Math.random() * 14,
        alpha: 0.06 + Math.random() * 0.14,
        hue: 110 + Math.random() * 40
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    // faint gradient backdrop
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, 'rgba(5,8,6,0.015)');
    g.addColorStop(1, 'rgba(10,12,10,0.02)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // draw particles
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      // wrap
      if (p.x < -50) p.x = w + 50;
      if (p.x > w + 50) p.x = -50;
      if (p.y < -50) p.y = h + 50;
      if (p.y > h + 50) p.y = -50;

      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      const color = `hsla(${p.hue}, 75%, 55%, ${p.alpha})`;
      grad.addColorStop(0, color);
      grad.addColorStop(0.4, `hsla(${p.hue}, 75%, 45%, ${p.alpha * 0.6})`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  function start() {
    resize();
    createParticles();
    draw();
  }

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  }, { passive: true });

  start();
}