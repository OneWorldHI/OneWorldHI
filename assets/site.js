(() => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav-links");

  const setMenu = (open) => {
    if (!toggle || !nav) return;
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("menu-open", open);
  };

  if (toggle && nav) {
    toggle.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("open")) {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 1051px)").addEventListener("change", (event) => {
      if (event.matches) setMenu(false);
    });
  }

  document.querySelectorAll("details").forEach((details) => {
    const summary = details.querySelector("summary");
    if (!summary) return;
    summary.setAttribute("aria-expanded", String(details.open));
    details.addEventListener("toggle", () => {
      summary.setAttribute("aria-expanded", String(details.open));
    });
  });

  const revealItems = document.querySelectorAll(".reveal");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!("IntersectionObserver" in window) || reducedMotion) {
    revealItems.forEach((item) => item.classList.add("visible"));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  }

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
