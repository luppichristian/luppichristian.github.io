import { PROFILE } from "../data/site-data.js";

export function renderLayout(content, routePath) {
  const isCaseStudy = routePath.startsWith("/case-study/");
  return `
    <div class="layout-shell">
      <div class="grid-overlay" aria-hidden="true"></div>
      <div class="noise-overlay" aria-hidden="true"></div>
      <header class="site-header">
        <div class="content-wrap site-header-inner">
          <a class="brand" data-link href="/" aria-label="Go to homepage">
            <span class="brand-chip" aria-hidden="true"></span>
            christian luppi
          </a>
          <nav class="top-nav" aria-label="Primary">
            <a data-link href="/" ${!isCaseStudy ? "aria-current=\"page\"" : ""}>Home</a>
            <a data-link href="/#featured">Projects</a>
            <a data-link href="/#skills">Skills</a>
            <a data-link href="/#oss">Open Source</a>
            <a data-link href="/#contact">Contact</a>
          </nav>
        </div>
      </header>
      <main id="app-main" tabindex="-1">${content}</main>
      <footer class="site-footer">
        <div class="content-wrap site-footer-inner">
          <p class="footer-copy">© ${new Date().getFullYear()} ${PROFILE.name} · Systems and graphics engineering</p>
          <nav class="footer-links" aria-label="Social links">
            <a href="${PROFILE.github}" target="_blank" rel="noopener">GitHub</a>
            <a href="${PROFILE.x}" target="_blank" rel="noopener">X</a>
            <a href="${PROFILE.youtube}" target="_blank" rel="noopener">YouTube</a>
            <a href="${PROFILE.kofi}" target="_blank" rel="noopener">Ko-fi</a>
          </nav>
        </div>
      </footer>
    </div>
  `;
}
