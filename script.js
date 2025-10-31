document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById("sidebar");
  const toggleBtn = document.getElementById("toggleBtn");
  const sections = ["about", "skills", "education", "projects", "contact"];
  const links = sidebar ? sidebar.querySelectorAll("a") : [];

  // Sidebar toggle (safe guard)
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", () => sidebar.classList.toggle("active"));
  }

  // Section navigation (links in sidebar)
  links.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.textContent.trim().toLowerCase();

      // Hide all sections and container
      sections.forEach(sec => {
        const el = document.getElementById(sec);
        if (el) el.style.display = "none";
      });
      const mainContainer = document.querySelector(".container");
      if (mainContainer) mainContainer.style.display = "none";

      // Show target section or home
      if (target === "home") {
        if (mainContainer) mainContainer.style.display = "flex";
      } else {
        const sec = document.getElementById(target);
        if (sec) sec.style.display = "block";
      }

      // Close sidebar after click
      if (sidebar) sidebar.classList.remove("active");
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
      sections.forEach(sec => {
        const el = document.getElementById(sec);
        if (el) el.style.display = "none";
      });
      const contactSection = document.getElementById("contact");
      const mainContainer = document.querySelector(".container");
      if (mainContainer) mainContainer.style.display = "none";
      if (contactSection) contactSection.style.display = "block";
    });
  }

  // Projects button -> show projects
  const projectsBtn = document.getElementById("projectsBtn");
  if (projectsBtn) {
    projectsBtn.addEventListener("click", () => {
      sections.forEach(sec => {
        const el = document.getElementById(sec);
        if (el) el.style.display = "none";
      });
      const projectsSection = document.getElementById("projects");
      const mainContainer = document.querySelector(".container");
      if (mainContainer) mainContainer.style.display = "none";
      if (projectsSection) projectsSection.style.display = "block";
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

});