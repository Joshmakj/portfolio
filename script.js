const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleBtn");
const sections = ["about", "skills", "education", "projects", "contact"];
const links = sidebar.querySelectorAll("a");

// Sidebar toggle
toggleBtn.onclick = () => sidebar.classList.toggle("active");

// Section navigation
links.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const target = link.textContent.trim().toLowerCase();

    // Hide all sections
    sections.forEach(sec => {
      const el = document.getElementById(sec);
      if (el) el.style.display = "none";
    });

    // Show target section instantly (no scroll)
    if (target === "home") {
      document.querySelector(".container").style.display = "flex";
    } else {
      document.querySelector(".container").style.display = "none";
      const sec = document.getElementById(target);
      if (sec) sec.style.display = "block";
    }

    // Close sidebar after clicking
    sidebar.classList.remove("active");
  });
});


// ==========================
// ✅ Web3Forms Contact Submit
// ==========================
const contactForm = document.querySelector("#contact form");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    formData.append("access_key", "c6e68daa-84b0-40fb-a70f-91fb22b63c96"); // ✅ Your key

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
    } catch (error) {
      console.error("Error:", error);
      alert("⚠️ Network error. Please check your connection.");
    }
  });
}



const hireMeBtn = document.getElementById("hireMeBtn");
if (hireMeBtn) {
  hireMeBtn.addEventListener("click", () => {
    // Hide all sections
    sections.forEach(sec => {
      const el = document.getElementById(sec);
      if (el) el.style.display = "none";
    });

    // Show contact section
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      document.querySelector(".container").style.display = "none";
      contactSection.style.display = "block";
    }
  });
}


// "Projects" button opens Projects section instantly
const projectsBtn = document.getElementById("projectsBtn");
if (projectsBtn) {
  projectsBtn.addEventListener("click", () => {
    // Hide all sections
    sections.forEach(sec => {
      const el = document.getElementById(sec);
      if (el) el.style.display = "none";
    });

    // Show projects section
    const projectsSection = document.getElementById("projects");
    if (projectsSection) {
      document.querySelector(".container").style.display = "none";
      projectsSection.style.display = "block";
    }
  });
}