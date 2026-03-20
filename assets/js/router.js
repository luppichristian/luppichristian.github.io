import { renderLayout } from "./components/layout.js";
import { hydrateHomePage, renderHomePage } from "./pages/home.js";
import { getCaseStudyBySlug, renderCaseStudyPage } from "./pages/case-study.js";
import { initHeroShader, initParticleField } from "./lib/graphics.js";
import { initParallax, runPageEntrance, runViewTransition } from "./lib/motion.js";

function normalize(pathname) {
  if (!pathname) return "/";
  return pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
}

function getRoute(pathname) {
  const path = normalize(pathname);
  if (path === "/") return { page: "home" };
  const match = path.match(/^\/case-study\/([a-z0-9-]+)$/i);
  if (match) return { page: "case", slug: match[1] };
  return { page: "notfound" };
}

function renderNotFound() {
  return `
    <section class="section">
      <div class="content-wrap panel" style="padding:1.4rem;">
        <h1 style="margin:0;">404</h1>
        <p style="color:var(--text-1);">This route was not found.</p>
        <a class="button" data-link href="/">Go Home</a>
      </div>
    </section>
  `;
}

let shaderCleanup = () => {};
let particlesCleanup = () => {};

function cleanGraphics() {
  shaderCleanup();
  particlesCleanup();
  shaderCleanup = () => {};
  particlesCleanup = () => {};
}

async function afterRender(route) {
  await runPageEntrance(document.getElementById("app"));
  if (route.page === "home") {
    const shaderCanvas = document.getElementById("hero-shader-canvas");
    const particleCanvas = document.getElementById("hero-particles-canvas");
    shaderCleanup = initHeroShader(shaderCanvas);
    particlesCleanup = initParticleField(particleCanvas);
    initParallax(".project-card");
    hydrateHomePage();
  }
}

async function render(pathname) {
  cleanGraphics();

  const route = getRoute(pathname);
  let pageHtml = "";

  if (route.page === "home") {
    pageHtml = renderHomePage();
    document.title = "Christian Luppi | Systems Programmer & Creative Developer";
  } else if (route.page === "case") {
    const study = getCaseStudyBySlug(route.slug);
    if (!study) {
      pageHtml = renderNotFound();
      document.title = "Not Found | Christian Luppi";
    } else {
      pageHtml = renderCaseStudyPage(study);
      document.title = `${study.title} | Christian Luppi`;
    }
  } else {
    pageHtml = renderNotFound();
    document.title = "Not Found | Christian Luppi";
  }

  const app = document.getElementById("app");
  app.innerHTML = renderLayout(pageHtml, pathname);
  document.getElementById("app-main")?.focus({ preventScroll: true });
  await afterRender(route);

  if (location.hash && route.page === "home") {
    const section = document.querySelector(location.hash);
    if (section) {
      setTimeout(() => section.scrollIntoView({ behavior: "smooth", block: "start" }), 24);
    }
  }
}

function toAbsolutePath(url) {
  const parsed = new URL(url, window.location.origin);
  return parsed.pathname + parsed.search + parsed.hash;
}

export async function navigate(url, options = {}) {
  const next = toAbsolutePath(url);
  const doRender = () => render(new URL(next, window.location.origin).pathname);
  if (!options.replace) {
    history.pushState({}, "", next);
  } else {
    history.replaceState({}, "", next);
  }
  runViewTransition(doRender);
}

export async function initRouter() {
  const redirectedPath = new URLSearchParams(location.search).get("p");
  if (redirectedPath && redirectedPath.startsWith("/")) {
    history.replaceState({}, "", redirectedPath + location.hash);
  }

  document.addEventListener("click", (ev) => {
    const anchor = ev.target.closest("a[data-link]");
    if (!anchor) return;
    const href = anchor.getAttribute("href");
    if (!href) return;
    if (href.startsWith("http")) return;
    ev.preventDefault();
    navigate(href);
  });

  window.addEventListener("popstate", () => {
    render(location.pathname);
  });

  await render(location.pathname);
}
