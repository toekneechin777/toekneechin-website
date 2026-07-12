/**
 * Site configuration — edit this file to update social links and metadata.
 */
const SITE_CONFIG = {
  name: "Anthony Chen",
  email: "achen@anthonylchen.com",
  tagline: "ML tinkerer. Curious about all of it.",
  socials: [
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/anthony-l-chen/",
      icon: "linkedin",
    },
    {
      label: "Google Scholar",
      url: "https://scholar.google.com/",
      icon: "scholar",
    },
    {
      label: "GitHub",
      url: "https://github.com/toekneechin777",
      icon: "github",
    },
    {
      label: "Email",
      url: "mailto:achen@anthonylchen.com",
      icon: "email",
    },
  ],
};

/** SVG icons keyed by name. */
const ICONS = {
  linkedin: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg>`,
  scholar: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 24a7 7 0 110-14 7 7 0 010 14zm0-24L0 9.5l4.8 3.5L12 7.7l7.2 5.3L24 9.5z"/></svg>`,
  github: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 .5A11.5 11.5 0 00.5 12a11.5 11.5 0 007.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.1-.75.4-1.27.73-1.56-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 015.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0023.5 12 11.5 11.5 0 0012 .5z"/></svg>`,
  email: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5z"/></svg>`,
};

/** Render social links into any container with id="social-links". */
function renderSocialLinks(container) {
  if (!container) return;
  container.innerHTML = SITE_CONFIG.socials
    .map(
      (s) => `
      <a class="social-link" href="${s.url}" target="_blank" rel="noopener noreferrer">
        ${ICONS[s.icon] || ""}
        <span>${s.label}</span>
      </a>`
    )
    .join("");
}

/** Inject navbar into any page. */
function renderNavbar(activePage) {
  const nav = document.getElementById("navbar");
  if (!nav) return;
  const links = [
    { href: "index.html", label: "Home", key: "home" },
    { href: "about.html", label: "About", key: "about" },
    { href: "blog.html", label: "Blog", key: "blog" },
  ];
  nav.innerHTML = `
    <nav class="navbar">
      <div class="navbar-inner">
        <a class="navbar-brand" href="index.html">${SITE_CONFIG.name}</a>
        <ul class="navbar-links">
          ${links
            .map(
              (l) =>
                `<li><a href="${l.href}" class="${
                  l.key === activePage ? "active" : ""
                }">${l.label}</a></li>`
            )
            .join("")}
        </ul>
      </div>
    </nav>`;
}

/** Inject footer. */
function renderFooter() {
  const footer = document.getElementById("footer");
  if (!footer) return;
  footer.innerHTML = `
    <div class="footer">
      &copy; ${new Date().getFullYear()} ${SITE_CONFIG.name}. Built with care.
    </div>`;
}

window.SITE_CONFIG = SITE_CONFIG;
window.ICONS = ICONS;
window.renderSocialLinks = renderSocialLinks;
window.renderNavbar = renderNavbar;
window.renderFooter = renderFooter;
