document;
/* Consolidated scripts for ocean_explorer_site-4_enhanced.html */
("use strict");

(function () {
  // Utility: safe query
  const $id = (id) => document.getElementById(id);

  // ----- Visual particles (stars + floating particles) -----
  function createStars(containerId, count = 120) {
    const container = $id(containerId);
    if (!container) return;
    container.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const star = document.createElement("div");
      star.className = "star";
      star.style.left = Math.random() * 100 + "%";
      star.style.top = Math.random() * 100 + "%";
      star.style.animationDelay = Math.random() * 3 + "s";
      container.appendChild(star);
    }
  }

  function createParticles(containerId, count = 8) {
    const container = $id(containerId);
    if (!container) return;
    container.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      const size = Math.random() * 60 + 20;
      p.style.width = size + "px";
      p.style.height = size + "px";
      p.style.left = Math.random() * 100 + "%";
      p.style.top = Math.random() * 100 + "%";
      p.style.animationDelay = Math.random() * 20 + "s";
      p.style.animationDuration = Math.random() * 10 + 15 + "s";
      container.appendChild(p);
    }
  }

  // Expose simple global helpers used by inline handlers in HTML
  window.scrollToSection = function (id) {
    const el = $id(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  window.scrollToTop = function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Modal open/close used by inline onclick attributes
  window.openModal = function (title, desc, imageSrc) {
    const modal = $id("modal");
    if (!modal) return;
    const t = $id("modalTitle");
    const d = $id("modalDesc");
    const img = $id("modalImage");
    if (t) t.textContent = title || "";
    if (d) d.textContent = desc || "";
    if (img) {
      if (imageSrc) {
        img.src = imageSrc;
        img.alt = title || "";
        img.style.display = "";
      } else {
        img.style.display = "none";
      }
    }
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  window.closeModal = function () {
    const modal = $id("modal");
    if (!modal) return;
    modal.classList.remove("active");
    document.body.style.overflow = "";
  };

  // ----- Intersection observers: reveal + counters -----
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("fade-in-visible");
        // trigger counter inside stat-item
        if (entry.target.classList.contains("stat-item")) {
          const num = entry.target.querySelector(".stat-number");
          if (num && !num.classList.contains("counted")) {
            num.classList.add("counted");
            animateCounter(num);
          }
        }
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );

  function animateCounter(el) {
    const raw = el.getAttribute("data-target") || el.getAttribute("data-count");
    const target = parseInt(raw || "0", 10);
    if (!target || isNaN(target)) return;
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const t = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target.toLocaleString();
        clearInterval(t);
      } else {
        el.textContent = Math.floor(current).toLocaleString();
      }
    }, 16);
  }

  // ----- DOMContentLoaded: initialize features once -----
  document.addEventListener("DOMContentLoaded", () => {
    // Create visual elements
    createStars("starsContainer", 150);
    createParticles("particlesContainer", 12);

    // Wire up reveal observer for common selectors
    const revealSelectors =
      ".feature-card, .equipment-card, .impact-card, .stat-item, .timeline-item, .gallery-item, .reef-sidebar, .reef-info, .metric, .section-title, .explorer-intro";
    document.querySelectorAll(revealSelectors).forEach((el) => {
      el.classList.add("fade-in");
      revealObserver.observe(el);
    });

    // Navbar and scroll behaviors
    const navbar = $id("navbar");
    const scrollTopBtn = $id("scrollTop");
    window.addEventListener("scroll", () => {
      const y = window.scrollY || window.pageYOffset;
      if (navbar) {
        navbar.classList.toggle("scrolled", y > 100);
      }
      if (scrollTopBtn) {
        scrollTopBtn.classList.toggle("visible", y > 500);
      }
    });

    // Theme toggle
    const themeToggle = $id("themeToggle");
    const body = document.body;
    const stored = localStorage.getItem("theme") || "dark";
    if (stored === "light") body.classList.add("light-mode");
    if (themeToggle) {
      const setLabel = (isLight) => {
        themeToggle.textContent = isLight ? "Light" : "Dark";
        themeToggle.setAttribute("aria-pressed", isLight ? "true" : "false");
      };
      setLabel(body.classList.contains("light-mode"));
      themeToggle.addEventListener("click", () => {
        body.classList.toggle("light-mode");
        const isLight = body.classList.contains("light-mode");
        setLabel(isLight);
        localStorage.setItem("theme", isLight ? "light" : "dark");
      });
    }

    // Progress bar
    const progressBar = document.createElement("div");
    progressBar.className = "scroll-progress";
    document.body.appendChild(progressBar);
    window.addEventListener("scroll", () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      progressBar.style.width = pct + "%";
    });

    // Smooth nav links
    document.querySelectorAll('nav a[href^="#"]').forEach((a) => {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target)
          target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    // Back-to-top button (also created in HTML)
    if (scrollTopBtn) {
      scrollTopBtn.addEventListener(
        "click",
        window.scrollToTop || window.scrollToTop
      );
      scrollTopBtn.setAttribute("tabindex", "0");
      scrollTopBtn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          window.scrollToTop();
        }
      });
    }

    // Simple form handling
    const contactForm = $id("contactForm");
    if (contactForm) {
      contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const btnText = $id("btnText");
        const btnLoader = $id("btnLoader");
        if (btnText && btnLoader) {
          btnText.style.display = "none";
          btnLoader.style.display = "inline-block";
          setTimeout(() => {
            btnLoader.style.display = "none";
            btnText.style.display = "inline";
            alert("Thank you! Your message has been sent.");
            contactForm.reset();
          }, 1400);
        }
      });
    }

    // Gallery lightbox
    (function setupLightbox() {
      const imgs = document.querySelectorAll(".gallery-item img");
      if (!imgs.length) return;
      const lightbox = document.createElement("div");
      lightbox.className = "lightbox";
      lightbox.innerHTML =
        '<span class="lightbox-close">&times;</span><img src="" alt=""><div class="lightbox-nav"><button class="lightbox-prev">\u276e</button><button class="lightbox-next">\u276f</button></div>';
      document.body.appendChild(lightbox);
      const imgEl = lightbox.querySelector("img");
      const prev = lightbox.querySelector(".lightbox-prev");
      const next = lightbox.querySelector(".lightbox-next");
      const close = lightbox.querySelector(".lightbox-close");
      const list = Array.from(imgs);
      let index = 0;
      function show(i) {
        index = (i + list.length) % list.length;
        imgEl.src = list[index].src;
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden";
      }
      function hide() {
        lightbox.classList.remove("active");
        document.body.style.overflow = "";
      }
      list.forEach((im, i) => im.addEventListener("click", () => show(i)));
      close && close.addEventListener("click", hide);
      lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) hide();
      });
      prev &&
        prev.addEventListener("click", (e) => {
          e.stopPropagation();
          show(index - 1);
        });
      next &&
        next.addEventListener("click", (e) => {
          e.stopPropagation();
          show(index + 1);
        });
      document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("active")) return;
        if (e.key === "Escape") hide();
        if (e.key === "ArrowLeft") show(index - 1);
        if (e.key === "ArrowRight") show(index + 1);
      });
    })();

    // Search (simple) — append search to nav container if present
    (function setupSearch() {
      const navContainer = document.querySelector("nav .container");
      if (!navContainer) return;
      const sc = document.createElement("div");
      sc.className = "search-container";
      sc.innerHTML =
        '<input type="text" class="search-input" placeholder="🔍 Search projects, research, species..."><div class="search-results"></div>';
      navContainer.appendChild(sc);
      const input = sc.querySelector(".search-input");
      const results = sc.querySelector(".search-results");
      if (!input) return;
      input.addEventListener("input", function () {
        const q = this.value.trim().toLowerCase();
        if (q.length < 2) {
          results.innerHTML = "";
          results.classList.remove("active");
          return;
        }
        const sections = document.querySelectorAll("section, .project-section");
        const found = [];
        sections.forEach((s) => {
          const h = s.querySelector("h2,h3");
          if (!h) return;
          if (s.innerText.toLowerCase().includes(q))
            found.push({ title: h.innerText, el: s });
        });
        if (!found.length) {
          results.innerHTML =
            '<div class="search-result-item">No results found</div>';
          results.classList.add("active");
          return;
        }
        results.innerHTML = found
          .slice(0, 5)
          .map((f) => `<div class="search-result-item">${f.title}</div>`)
          .join("");
        results.classList.add("active");
        results.querySelectorAll(".search-result-item").forEach((r, i) =>
          r.addEventListener("click", () => {
            found[i].el.scrollIntoView({ behavior: "smooth" });
            results.classList.remove("active");
            input.value = "";
          })
        );
      });
      document.addEventListener("click", (e) => {
        if (!sc.contains(e.target)) results.classList.remove("active");
      });
    })();

    // Tooltips
    document.querySelectorAll("[data-tooltip]").forEach((el) => {
      el.addEventListener("mouseenter", function () {
        const tt = document.createElement("div");
        tt.className = "tooltip";
        tt.textContent = this.getAttribute("data-tooltip");
        document.body.appendChild(tt);
        const r = this.getBoundingClientRect();
        tt.style.left = `${r.left + r.width / 2 - tt.offsetWidth / 2}px`;
        tt.style.top = `${r.top - tt.offsetHeight - 10}px`;
        setTimeout(() => tt.classList.add("visible"), 10);
        this._tooltip = tt;
      });
      el.addEventListener("mouseleave", function () {
        if (this._tooltip) {
          this._tooltip.remove();
          this._tooltip = null;
        }
      });
    });

    // Remove loading overlay on full load
    window.addEventListener("load", () =>
      document.body.classList.add("loaded")
    );
  });
})();

// Form submission
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const btnText = document.getElementById("btnText");
  const btnLoader = document.getElementById("btnLoader");

  btnText.style.display = "none";
  btnLoader.style.display = "inline-block";

  setTimeout(() => {
    btnLoader.style.display = "none";
    btnText.style.display = "inline";
    alert(
      "Thank you for your interest in collaboration! Dr. Marina Wave will review your message and respond shortly. 🌊"
    );
    this.reset();
  }, 2000);
});

// Modal functions
function openModal(title, desc, imageSrc) {
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalDesc").textContent = desc;

  const modalImage = document.getElementById("modalImage");
  if (imageSrc) {
    modalImage.src = imageSrc;
    modalImage.alt = title;
    modalImage.style.display = "block";
  } else {
    modalImage.style.display = "none";
  }

  document.getElementById("modal").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modal").classList.remove("active");
  document.body.style.overflow = "auto";
}

// Close modal on outside click
document.getElementById("modal").addEventListener("click", function (e) {
  if (e.target === this) {
    closeModal();
  }
});

// Parallax effect
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll(".hero-content");
  parallaxElements.forEach((el) => {
    el.style.transform = `translateY(${scrolled * 0.5}px)`;
  });
});

// Enhanced Functionality Scripts
document.addEventListener("DOMContentLoaded", function () {
  // ==================== THEME TOGGLE ====================
  const themeToggle = document.getElementById("themeToggle");
  const body = document.body;

  const currentTheme = localStorage.getItem("theme") || "dark";
  if (currentTheme === "light") {
    body.classList.add("light-mode");
  }
  if (themeToggle) {
    // initialize label and aria state
    const setToggleLabel = (isLight) => {
      themeToggle.textContent = isLight ? "Light" : "Dark";
      themeToggle.setAttribute("aria-pressed", isLight ? "true" : "false");
    };

    setToggleLabel(body.classList.contains("light-mode"));

    themeToggle.addEventListener("click", function () {
      body.classList.toggle("light-mode");
      const isLight = body.classList.contains("light-mode");
      setToggleLabel(isLight);
      const theme = isLight ? "light" : "dark";
      localStorage.setItem("theme", theme);
    });
  }

  // ==================== SCROLL PROGRESS INDICATOR ====================
  const progressBar = document.createElement("div");
  progressBar.className = "scroll-progress";
  document.body.appendChild(progressBar);

  window.addEventListener("scroll", function () {
    const windowHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = scrolled + "%";
  });

  // ==================== SMOOTH SCROLL FOR NAVIGATION ====================
  document.querySelectorAll('nav a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // ==================== SCROLL REVEAL ANIMATIONS ====================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in-visible");
      }
    });
  }, observerOptions);

  document
    .querySelectorAll(
      ".stat-card, .expertise-card, .equipment-card, .impact-card, .gallery-item, .timeline-item"
    )
    .forEach((el) => {
      el.classList.add("fade-in");
      observer.observe(el);
    });

  // ==================== ANIMATED COUNTERS ====================
  const counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (
          entry.isIntersecting &&
          !entry.target.classList.contains("counted")
        ) {
          entry.target.classList.add("counted");
          animateCounter(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll(".stat-number, .metric-value").forEach((el) => {
    const text = el.textContent.replace(/[^0-9]/g, "");
    if (text && !isNaN(text)) {
      el.setAttribute("data-count", text);
      el.textContent = "0";
      counterObserver.observe(el);
    }
  });

  // ==================== BACK TO TOP BUTTON ====================
  const backToTop = document.createElement("button");
  backToTop.className = "back-to-top";
  backToTop.innerHTML = "↑";
  backToTop.setAttribute("aria-label", "Back to top");
  document.body.appendChild(backToTop);

  window.addEventListener("scroll", function () {
    if (window.scrollY > 500) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  });

  backToTop.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // ==================== FORM VALIDATION ====================
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const inputs = form.querySelectorAll(
        "input[required], textarea[required]"
      );
      let isValid = true;

      inputs.forEach((input) => {
        if (!input.value.trim()) {
          input.classList.add("error");
          isValid = false;
        } else {
          input.classList.remove("error");
        }
      });

      const email = form.querySelector('input[type="email"]');
      if (email && email.value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value)) {
          email.classList.add("error");
          isValid = false;
        }
      }

      if (isValid) {
        // Show success message
        const successMsg = document.createElement("div");
        successMsg.className = "form-success";
        successMsg.textContent =
          "✓ Message sent successfully! We will get back to you soon.";
        form.appendChild(successMsg);

        setTimeout(() => {
          successMsg.remove();
          form.reset();
        }, 3000);
      }
    });

    // Real-time validation
    form.querySelectorAll("input, textarea").forEach((input) => {
      input.addEventListener("blur", function () {
        if (this.hasAttribute("required") && !this.value.trim()) {
          this.classList.add("error");
        } else {
          this.classList.remove("error");
        }
      });
    });
  }

  // ==================== GALLERY LIGHTBOX ====================
  const galleryItems = document.querySelectorAll(".gallery-item img");
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = `
          <span class="lightbox-close">&times;</span>
          <img src="" alt="">
          <div class="lightbox-nav">
              <button class="lightbox-prev">❮</button>
              <button class="lightbox-next">❯</button>
          </div>
      `;
  document.body.appendChild(lightbox);

  let currentImageIndex = 0;
  const images = Array.from(galleryItems);

  galleryItems.forEach((img, index) => {
    img.style.cursor = "pointer";
    img.addEventListener("click", function () {
      currentImageIndex = index;
      showLightbox(this.src);
    });
  });

  function showLightbox(src) {
    lightbox.querySelector("img").src = src;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  lightbox
    .querySelector(".lightbox-close")
    .addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  lightbox
    .querySelector(".lightbox-prev")
    .addEventListener("click", function (e) {
      e.stopPropagation();
      currentImageIndex =
        (currentImageIndex - 1 + images.length) % images.length;
      showLightbox(images[currentImageIndex].src);
    });

  lightbox
    .querySelector(".lightbox-next")
    .addEventListener("click", function (e) {
      e.stopPropagation();
      currentImageIndex = (currentImageIndex + 1) % images.length;
      showLightbox(images[currentImageIndex].src);
    });

  // Keyboard navigation for lightbox
  document.addEventListener("keydown", function (e) {
    if (lightbox.classList.contains("active")) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft")
        lightbox.querySelector(".lightbox-prev").click();
      if (e.key === "ArrowRight")
        lightbox.querySelector(".lightbox-next").click();
    }
  });

  // ==================== SEARCH FUNCTIONALITY ====================
  const searchContainer = document.createElement("div");
  searchContainer.className = "search-container";
  searchContainer.innerHTML = `
          <input type="text" class="search-input" placeholder="🔍 Search projects, research, species...">
          <div class="search-results"></div>
      `;

  const nav = document.querySelector("nav .container");
  if (nav) {
    nav.appendChild(searchContainer);
  }

  const searchInput = document.querySelector(".search-input");
  const searchResults = document.querySelector(".search-results");

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const query = this.value.toLowerCase().trim();

      if (query.length < 2) {
        searchResults.innerHTML = "";
        searchResults.classList.remove("active");
        return;
      }

      const allText = document.body.innerText.toLowerCase();
      const sections = document.querySelectorAll("section, .project-section");
      const results = [];

      sections.forEach((section) => {
        const heading = section.querySelector("h2, h3");
        const text = section.innerText.toLowerCase();

        if (text.includes(query) && heading) {
          results.push({
            title: heading.innerText,
            element: section,
          });
        }
      });

      if (results.length > 0) {
        searchResults.innerHTML = results
          .slice(0, 5)
          .map(
            (result) => `<div class="search-result-item">${result.title}</div>`
          )
          .join("");
        searchResults.classList.add("active");

        document
          .querySelectorAll(".search-result-item")
          .forEach((item, index) => {
            item.addEventListener("click", function () {
              results[index].element.scrollIntoView({
                behavior: "smooth",
              });
              searchResults.classList.remove("active");
              searchInput.value = "";
            });
          });
      } else {
        searchResults.innerHTML =
          '<div class="search-result-item">No results found</div>';
        searchResults.classList.add("active");
      }
    });

    // Close search results when clicking outside
    document.addEventListener("click", function (e) {
      if (!searchContainer.contains(e.target)) {
        searchResults.classList.remove("active");
      }
    });
  }

  // ==================== LOADING ANIMATION ====================
  window.addEventListener("load", function () {
    document.body.classList.add("loaded");
  });

  // ==================== PARALLAX EFFECT ====================
  window.addEventListener("scroll", function () {
    const scrolled = window.scrollY;
    const parallaxElements = document.querySelectorAll(
      ".hero, .project-header"
    );

    parallaxElements.forEach((el) => {
      const speed = 0.5;
      el.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });

  // ==================== TOOLTIP FUNCTIONALITY ====================
  document.querySelectorAll("[data-tooltip]").forEach((element) => {
    element.addEventListener("mouseenter", function (e) {
      const tooltip = document.createElement("div");
      tooltip.className = "tooltip";
      tooltip.textContent = this.getAttribute("data-tooltip");
      document.body.appendChild(tooltip);

      const rect = this.getBoundingClientRect();
      tooltip.style.left =
        rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + "px";
      tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + "px";

      setTimeout(() => tooltip.classList.add("visible"), 10);

      this._tooltip = tooltip;
    });

    element.addEventListener("mouseleave", function () {
      if (this._tooltip) {
        this._tooltip.remove();
        this._tooltip = null;
      }
    });
  });

  console.log("✓ All enhanced functionalities loaded successfully!");
});

// Make scrollTop operable by keyboard when focused
const scrollTopEl = document.getElementById("scrollTop");
if (scrollTopEl) {
  scrollTopEl.setAttribute("tabindex", "0");
  scrollTopEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      scrollToTop();
    }
  });
}
