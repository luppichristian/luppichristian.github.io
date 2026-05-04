const PROFILE = {
  name: "Christian Luppi",
  email: "business.luppichristian@gmail.com",
  github: "https://github.com/luppichristian",
  itch: "https://christian-luppi.itch.io/",
  x: "https://x.com/luppi_christian",
  youtube: "https://www.youtube.com/@christianluppi",
  kofi: "https://ko-fi.com/christianluppi"
};

const ITCH_PROJECTS = [
  {
    title: "GFX Support View",
    url: "https://christian-luppi.itch.io/gfx-support-view",
    description: "Desktop utility for inspecting your system's graphics API support in one place.",
    price: "$1.99",
    category: "Tool",
    status: "Released",
    published: "Mar 2026",
    platforms: ["Windows", "macOS", "Linux"],
    tags: ["Vulkan", "OpenGL", "DirectX", "Metal"],
    image: "https://img.itch.zone/aW1nLzI2Mzk3ODY0LnBuZw==/315x250%23c/PIQY%2BL.png"
  },
  {
    title: "Win32 Input Tester",
    url: "https://christian-luppi.itch.io/win32-input-tester",
    description: "Native Windows utility for inspecting low-level keyboard, mouse, controller, tablet, raw input, HID, and clipboard data.",
    price: "$2.99",
    category: "Tool",
    status: "Released",
    published: "Mar 2026",
    platforms: ["Windows"],
    tags: ["Win32", "Input", "HID", "Diagnostics"],
    image: "https://img.itch.zone/aW1nLzI2MjcxOTM4LnBuZw==/315x250%23c/ThZr4R.png"
  }
];

const REPOSITORIES = [
  { name: "based-sdk", url: "https://github.com/luppichristian/based-sdk", description: "Low-level C framework for general computing, graphics, and audio work.", language: "C", stars: 1, updated: "2026-03-25T16:07:01Z" },
  { name: "gamedev_resources", url: "https://github.com/luppichristian/gamedev_resources", description: "Collected articles, tools, and reference material for learning low-level game development in C/C++.", language: null, stars: 1, updated: "2026-01-30T17:16:46Z" },
  { name: "GameTest", url: "https://github.com/luppichristian/GameTest", description: "Record/replay testing framework for C/C++ games. Deterministic input capture and injection for automated testing.", language: "C", stars: 5, updated: "2026-03-20T17:49:00Z" },
  { name: "xccmeta", url: "https://github.com/luppichristian/xccmeta", description: "Static metadata parser for C/C++ projects, useful for preprocessing and build-time tooling.", language: "C++", stars: 3, updated: "2026-03-20T17:49:10Z" }
];

const SKILLS = [
  "Core languages: C, C++, Python, JavaScript, SQL, HTML, and TypeScript.",
  "Graphics programming: OpenGL, Vulkan, DirectX, SDL3 GPU, bgfx, modern GPU pipelines, and real-time rendering architecture.",
  "Game programming: custom engine development and cross-platform work with SDL3, Raylib, and SFML.",
  "Shader programming: fragment, vertex, and geometry shaders written in GLSL and HLSL.",
  "Systems programming: low-level architecture, memory management, data structures, and cache-efficient design.",
  "Performance engineering: SIMD optimization, CPU and GPU profiling, frame-time optimization, and data-oriented design.",
  "Concurrency and parallelism: multithreaded programming, task-based systems, synchronization primitives, and high-performance runtime systems.",
  "Tools and toolchains: RenderDoc, Tracy, CMake, Premake, Visual Studio, VS Code, Clang, GCC, MSVC, and GPU debugging workflows.",
  "AI-assisted development: codegen pipelines, agent-assisted workflows, and productivity systems while keeping code quality standards.",
  "Web and backend: full-stack web development, database design, and backend architecture."
];

const CONTACTS = [
  { title: "Email", label: PROFILE.email, href: `mailto:${PROFILE.email}` },
  { title: "GitHub", label: "github.com/luppichristian", href: PROFILE.github, external: true },
  { title: "itch.io", label: "christian-luppi.itch.io", href: PROFILE.itch, external: true },
  { title: "YouTube", label: "youtube.com/@christianluppi", href: PROFILE.youtube, external: true }
];

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sortRepositories(repos) {
  return [...repos].sort((a, b) => {
    const starDiff = (b.stars || b.stargazers_count || 0) - (a.stars || a.stargazers_count || 0);
    if (starDiff !== 0) return starDiff;
    return new Date(b.updated || b.updated_at) - new Date(a.updated || a.updated_at);
  });
}

function getStarredRepositories(repos) {
  return repos.filter((repo) => (repo.stars || repo.stargazers_count || 0) >= 1);
}

function repoListItem(repo) {
  const language = repo.language || "n/a";
  const repoUrl = repo.html_url || repo.url;
  return `
    <li class="simple-list-item" data-stagger>
      <h3><a href="${repoUrl}" target="_blank" rel="noopener">${escapeHtml(repo.name)}</a></h3>
      <p>${escapeHtml(repo.description || "No description provided.")}</p>
      <p class="simple-meta">${escapeHtml(language)}</p>
    </li>
  `;
}

function skillItem(item) {
  return `
    <li class="simple-list-item" data-stagger>
      <p>${escapeHtml(item)}</p>
    </li>
  `;
}

function sectionHeader(title) {
  return `
    <div class="section-head" data-stagger>
      <p class="section-kicker">${escapeHtml(title)}</p>
      <div class="section-line"></div>
    </div>
  `;
}

function projectListItem(project) {
  return `
    <li class="simple-list-item" data-stagger>
      <h3><a href="${project.url}" target="_blank" rel="noopener">${escapeHtml(project.title)}</a></h3>
      <p>${escapeHtml(project.description)}</p>
      <p class="simple-meta">${escapeHtml(project.platforms.join(" / "))}</p>
    </li>
  `;
}

function contactCard(contact) {
  const externalAttrs = contact.external ? ' target="_blank" rel="noopener"' : "";
  return `
    <article class="contact-card simple-list-item" data-stagger>
      <h3>${escapeHtml(contact.title)}</h3>
      <a href="${contact.href}"${externalAttrs}>${escapeHtml(contact.label)}</a>
    </article>
  `;
}

function renderLayout(content) {
  return `
    <div class="layout-shell">
      <div class="grid-overlay" aria-hidden="true"></div>
      <div class="noise-overlay" aria-hidden="true"></div>
      <header class="site-header">
        <div class="content-wrap site-header-inner">
          <a class="brand" href="/" aria-label="Go to homepage">
            <span class="brand-chip" aria-hidden="true"></span>
            christian luppi
          </a>
          <nav class="top-nav" aria-label="Primary">
            <a href="/" aria-current="page">Home</a>
            <a href="/#skills">Skills</a>
            <a href="/#released-projects">Released Projects</a>
            <a href="/#open-source-projects">Open Source Projects</a>
            <a href="/#contacts">Contacts</a>
          </nav>
        </div>
      </header>
      <main id="app-main" tabindex="-1">${content}</main>
      <footer class="site-footer">
        <div class="content-wrap site-footer-inner">
          <p class="footer-copy">© ${new Date().getFullYear()} ${PROFILE.name} · Systems and graphics engineering</p>
          <nav class="footer-links" aria-label="Social links">
            <a href="${PROFILE.github}" target="_blank" rel="noopener">GitHub</a>
            <a href="${PROFILE.itch}" target="_blank" rel="noopener">itch.io</a>
            <a href="${PROFILE.x}" target="_blank" rel="noopener">X</a>
            <a href="${PROFILE.youtube}" target="_blank" rel="noopener">YouTube</a>
            <a href="${PROFILE.kofi}" target="_blank" rel="noopener">Ko-fi</a>
          </nav>
        </div>
      </footer>
    </div>
  `;
}

function renderHomePage() {
  const allRepos = sortRepositories(getStarredRepositories(REPOSITORIES));
  return `
    <section class="section" id="skills">
      <div class="content-wrap">
        ${sectionHeader("Skills")}
        <ul class="simple-list">
          ${SKILLS.map(skillItem).join("")}
        </ul>
      </div>
    </section>

    <section class="section" id="released-projects">
      <div class="content-wrap">
        ${sectionHeader("Released Projects")}
        <ul class="simple-list">
          ${ITCH_PROJECTS.map(projectListItem).join("")}
        </ul>
        <p class="section-link" data-stagger><a href="${PROFILE.itch}" target="_blank" rel="noopener">View all on itch.io</a></p>
      </div>
    </section>

    <section class="section" id="open-source-projects">
      <div class="content-wrap">
        ${sectionHeader("Open Source Projects")}
        <ul class="simple-list repo-list" id="repo-list" aria-live="polite">
          ${allRepos.map(repoListItem).join("")}
        </ul>
        <p class="section-link" data-stagger><a href="${PROFILE.github}" target="_blank" rel="noopener">View all on GitHub</a></p>
      </div>
    </section>

    <section class="section" id="contacts">
      <div class="content-wrap">
        ${sectionHeader("Contacts")}
        <div class="contact-grid">
          ${CONTACTS.map(contactCard).join("")}
        </div>
      </div>
    </section>
  `;
}

let gsapInstance = null;

async function loadGsap() {
  if (gsapInstance) return gsapInstance;
  try {
    const mod = await import("https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm");
    gsapInstance = mod.gsap;
  } catch {
    gsapInstance = null;
  }
  return gsapInstance;
}

async function runPageEntrance(root) {
  const gsap = await loadGsap();
  const items = [...root.querySelectorAll("[data-stagger]")];
  if (!items.length) return;
  if (!gsap || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach((item) => {
      item.style.opacity = "1";
      item.style.transform = "none";
    });
    return;
  }
  gsap.fromTo(items, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.58, stagger: 0.08, ease: "power2.out" });
}

async function hydrateHomePage() {
  const repoListEl = document.getElementById("repo-list");
  if (!repoListEl) return;
  try {
    const reposRes = await fetch("https://api.github.com/users/luppichristian/repos?per_page=100");
    if (!reposRes.ok) throw new Error("github failed");
    const repos = await reposRes.json();
    const visible = repos.filter((repo) => !repo.fork && (repo.stargazers_count || 0) >= 1);
    const allSorted = sortRepositories(visible);
    repoListEl.innerHTML = allSorted.length
      ? allSorted.map(repoListItem).join("")
      : '<li class="repo-loading">No repositories found.</li>';
  } catch {
    repoListEl.innerHTML = `<li class="repo-loading">Repository list unavailable. Visit <a href="${PROFILE.github}" target="_blank" rel="noopener">GitHub</a>.</li>`;
  }
}

async function init() {
  const app = document.getElementById("app");
  if (!app) return;
  app.innerHTML = renderLayout(renderHomePage());
  document.getElementById("app-main")?.focus({ preventScroll: true });
  await runPageEntrance(app);
  hydrateHomePage();
  if (location.hash) {
    const section = document.querySelector(location.hash);
    if (section) {
      setTimeout(() => section.scrollIntoView({ behavior: "smooth", block: "start" }), 24);
    }
  }
}

init();
