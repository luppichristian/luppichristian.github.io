import { CONTRIBUTIONS, PROFILE, PROJECTS, SKILL_GROUPS } from "../data/site-data.js";
import { compactNumber, createSvgForProject, escapeHtml } from "../lib/dom.js";

function projectCard(project, index) {
  const sizeClass = project.size === "lg" ? "project-card--lg" : project.size === "md" ? "project-card--md" : "project-card--sm";
  const transitionName = `project-visual-${project.slug}`;
  return `
    <a class="project-card ${sizeClass} scanline" data-project-card data-link href="/case-study/${project.slug}" data-slug="${project.slug}" data-stagger>
      <div class="project-visual" style="view-transition-name: ${transitionName}">
        ${createSvgForProject(project.diagram)}
      </div>
      <div class="project-content">
        <div class="project-meta">
          <span class="project-chip">${escapeHtml(project.label)}</span>
          ${project.stack.map((tag) => `<span class="project-chip">${escapeHtml(tag)}</span>`).join("")}
        </div>
        <h3>${escapeHtml(project.title)}</h3>
        <p>${escapeHtml(project.summary)}</p>
        <div class="project-links">
          <span>Case Study #${index + 1}</span>
          <span>Open</span>
        </div>
      </div>
    </a>
  `;
}

function skillCard(group) {
  return `
    <article class="skills-card" data-stagger>
      <h3>${escapeHtml(group.title)}</h3>
      <ul class="skills-list">
        ${group.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </article>
  `;
}

function contribution(item) {
  return `
    <li class="contrib-item" data-stagger>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.description)}</p>
    </li>
  `;
}

export function renderHomePage() {
  return `
    <section class="hero">
      <div class="content-wrap hero-grid">
        <article class="hero-copy scanline" data-stagger>
          <p class="hero-tag">Engine Room Portfolio</p>
          <h1 class="hero-title">Building systems where performance is a feature.<span class="mono">Christian Luppi</span></h1>
          <p class="hero-body">
            I design low-level software for rendering, runtime architecture, and toolchains.
            This portfolio focuses on how systems are actually built: constraints, implementation detail,
            and measurable outcomes.
          </p>
          <div class="hero-points">
            <p class="hero-point">C/C++ runtime architecture for game and tools code</p>
            <p class="hero-point">GPU pipeline and shader packaging across backends</p>
            <p class="hero-point">Deterministic testing workflows for engine reliability</p>
          </div>
          <div class="hero-actions">
            <a class="button button--primary" data-link href="/#featured">Explore Case Studies</a>
            <a class="button" href="${PROFILE.github}" target="_blank" rel="noopener">GitHub</a>
          </div>
        </article>
        <aside class="hero-render" data-stagger>
          <canvas id="hero-shader-canvas" aria-hidden="true"></canvas>
          <canvas id="hero-particles-canvas" aria-hidden="true" style="position:absolute;inset:0;"></canvas>
          <div class="hero-hud" aria-hidden="true">
            <div class="hud-item"><span class="hud-label">Target</span><span class="hud-value">16.6 ms</span></div>
            <div class="hud-item"><span class="hud-label">Domain</span><span class="hud-value">GPU / Systems</span></div>
            <div class="hud-item"><span class="hud-label">Status</span><span class="hud-value">Shipping</span></div>
          </div>
        </aside>
      </div>
    </section>

    <section class="section" id="featured">
      <div class="content-wrap">
        <div class="section-head" data-stagger>
          <p class="section-kicker">Featured Projects</p>
          <div class="section-line"></div>
        </div>
        <h2 class="section-title" data-stagger>Bento case-study grid</h2>
        <p class="section-description" data-stagger>Each project expands into a detailed technical case study with challenge, stack, implementation details, and architecture diagrams.</p>
        <div class="bento-grid" id="project-bento">
          ${PROJECTS.map(projectCard).join("")}
        </div>
      </div>
    </section>

    <section class="section" id="skills">
      <div class="content-wrap">
        <div class="section-head" data-stagger>
          <p class="section-kicker">Technical Skills</p>
          <div class="section-line"></div>
        </div>
        <h2 class="section-title" data-stagger>Interactive systems profile</h2>
        <p class="section-description" data-stagger>Focused on runtime correctness, rendering depth, and performance-conscious engineering across native and tooling code.</p>
        <div class="skills-matrix">
          ${SKILL_GROUPS.map(skillCard).join("")}
        </div>
      </div>
    </section>

    <section class="section" id="oss">
      <div class="content-wrap">
        <div class="section-head" data-stagger>
          <p class="section-kicker">Open Source Contributions</p>
          <div class="section-line"></div>
        </div>
        <h2 class="section-title" data-stagger>From architecture intent to public code</h2>
        <div class="oss-grid">
          <article class="oss-panel" data-stagger>
            <h3 class="sr-only">Contribution timeline</h3>
            <ul class="contrib-list">
              ${CONTRIBUTIONS.map(contribution).join("")}
            </ul>
          </article>
          <article class="oss-panel" data-stagger>
            <h3 style="margin-top:0;font:700 0.84rem/1.2 var(--mono);letter-spacing:0.06em;text-transform:uppercase;color:var(--text-1);">Live GitHub Stats</h3>
            <div class="stats-grid" id="github-stats" aria-live="polite">
              <div class="stat"><p class="stat-label">Public Repos</p><p class="stat-value">--</p></div>
              <div class="stat"><p class="stat-label">Followers</p><p class="stat-value">--</p></div>
              <div class="stat"><p class="stat-label">Stars</p><p class="stat-value">--</p></div>
              <div class="stat"><p class="stat-label">Top Language</p><p class="stat-value">--</p></div>
            </div>
            <p style="margin:0.8rem 0 0;color:var(--text-2);font:500 0.75rem/1.5 var(--mono);">
              Designed for lightweight loading. Data is fetched once and rendered with no framework runtime.
            </p>
          </article>
        </div>
      </div>
    </section>

    <section class="section" id="contact">
      <div class="content-wrap">
        <div class="section-head" data-stagger>
          <p class="section-kicker">Contact</p>
          <div class="section-line"></div>
        </div>
        <h2 class="section-title" data-stagger>Let&apos;s build engine-grade software</h2>
        <div class="contact-grid">
          <article class="contact-card" data-stagger>
            <h3>Email</h3>
            <a href="mailto:${PROFILE.email}">${PROFILE.email}</a>
          </article>
          <article class="contact-card" data-stagger>
            <h3>GitHub</h3>
            <a href="${PROFILE.github}" target="_blank" rel="noopener">github.com/luppichristian</a>
          </article>
          <article class="contact-card" data-stagger>
            <h3>Social</h3>
            <a href="${PROFILE.x}" target="_blank" rel="noopener">x.com/luppi_christian</a>
          </article>
        </div>
      </div>
    </section>
  `;
}

export async function hydrateHomePage() {
  const statsEl = document.getElementById("github-stats");
  if (!statsEl) return;

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch("https://api.github.com/users/luppichristian"),
      fetch("https://api.github.com/users/luppichristian/repos?per_page=100")
    ]);
    if (!userRes.ok || !reposRes.ok) throw new Error("github failed");
    const user = await userRes.json();
    const repos = await reposRes.json();
    const visible = repos.filter((repo) => !repo.fork);

    let topLanguage = "n/a";
    const map = new Map();
    let stars = 0;

    for (const repo of visible) {
      stars += repo.stargazers_count || 0;
      if (repo.language) map.set(repo.language, (map.get(repo.language) || 0) + 1);
    }
    if (map.size) {
      topLanguage = [...map.entries()].sort((a, b) => b[1] - a[1])[0][0];
    }

    statsEl.innerHTML = `
      <div class="stat"><p class="stat-label">Public Repos</p><p class="stat-value">${compactNumber(user.public_repos)}</p></div>
      <div class="stat"><p class="stat-label">Followers</p><p class="stat-value">${compactNumber(user.followers)}</p></div>
      <div class="stat"><p class="stat-label">Stars</p><p class="stat-value">${compactNumber(stars)}</p></div>
      <div class="stat"><p class="stat-label">Top Language</p><p class="stat-value">${escapeHtml(topLanguage)}</p></div>
    `;
  } catch {
    statsEl.innerHTML = `
      <div class="stat"><p class="stat-label">GitHub</p><p class="stat-value">Unavailable</p></div>
      <div class="stat"><p class="stat-label">Fallback</p><p class="stat-value">Profile link only</p></div>
    `;
  }
}
