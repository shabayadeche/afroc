function setupMobileNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const header = document.querySelector(".site-header");

  if (!toggle || !header) {
    return;
  }

  toggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.querySelectorAll(".nav-links a, .nav-actions a").forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setupSectionObserver() {
  const sectionLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  if (!sectionLinks.length) {
    return;
  }

  const linkMap = new Map(sectionLinks.map((link) => [link.getAttribute("href"), link]));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const href = `#${entry.target.id}`;
        const link = linkMap.get(href);
        if (!link) {
          return;
        }

        sectionLinks.forEach((item) => item.classList.remove("is-active"));
        link.classList.add("is-active");
      });
    },
    {
      rootMargin: "-35% 0px -50% 0px",
      threshold: 0.1
    }
  );

  linkMap.forEach((_, href) => {
    const section = document.querySelector(href);
    if (section) {
      observer.observe(section);
    }
  });
}

function setupSessionFilters() {
  const search = document.querySelector("[data-session-search]");
  const specialty = document.querySelector("[data-session-specialty]");
  const date = document.querySelector("[data-session-date]");
  const cards = Array.from(document.querySelectorAll("[data-session-card]"));
  const count = document.querySelector("[data-session-count]");

  if (!search || !specialty || !date || !cards.length || !count) {
    return;
  }

  const updateCount = (visible) => {
    count.textContent = `${visible} session${visible === 1 ? "" : "s"} shown`;
  };

  const applyFilters = () => {
    const term = search.value.trim().toLowerCase();
    const specialtyValue = specialty.value;
    const dateValue = date.value;
    let visible = 0;

    cards.forEach((card) => {
      const haystack = [
        card.dataset.sessionTitle,
        card.dataset.sessionTopics,
        card.dataset.sessionPeople
      ]
        .join(" ")
        .toLowerCase();
      const matchesTerm = !term || haystack.includes(term);
      const matchesSpecialty = !specialtyValue || card.dataset.sessionSpecialty === specialtyValue;
      const matchesDate = !dateValue || card.dataset.sessionDate === dateValue;
      const show = matchesTerm && matchesSpecialty && matchesDate;
      card.hidden = !show;
      if (show) {
        visible += 1;
      }
    });

    updateCount(visible);
  };

  [search, specialty, date].forEach((element) => {
    element.addEventListener("input", applyFilters);
    element.addEventListener("change", applyFilters);
  });

  updateCount(cards.length);
}

document.addEventListener("DOMContentLoaded", () => {
  setupMobileNav();
  setupSectionObserver();
  setupSessionFilters();
});
