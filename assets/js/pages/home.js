import { ITCH_PROJECTS, PROFILE, REPOSITORIES } from "../data/site-data.js";
import { compactNumber, escapeHtml } from "../lib/dom.js";
const WHAT_I_DO = [
  "I build C and C++ tools for graphics, rendering, and low-level systems work.",
  "I work on custom engine code, multithreaded systems, and performance-focused runtime design.",
  "I make desktop diagnostic apps like GFX Support View and Win32 Input Tester.",
  "I share open source projects for testing, parsing, math, shaders, and developer tooling on GitHub."
];

function getStarredRepositories(repos) {
  return repos.filter((repo) => (repo.stars || repo.stargazers_count || 0) >= 1);
}

function sortRepositories(repos) {
  return [...repos].sort((a, b) => {
    const starDiff = (b.stars || b.stargazers_count || 0) - (a.stars || a.stargazers_count || 0);
    if (starDiff !== 0) return starDiff;
    return new Date(b.updated || b.updated_at) - new Date(a.updated || a.updated_at);
  });
}

function repoListItem(repo) {
  const language = repo.language || "n/a";
  const repoUrl = repo.url || repo.html_url;
  const stars = compactNumber(repo.stars || repo.stargazers_count || 0);
  const updated = new Date(repo.updated || repo.updated_at).toLocaleDateString("en", { month: "short", year: "numeric" });
  return `
    <a class="repo-row" href="${repoUrl}" target="_blank" rel="noopener">
      <div>
        <h3>${escapeHtml(repo.name)}</h3>
        <p>${escapeHtml(repo.description || "No description provided.")}</p>
      </div>
      <div class="repo-row-meta">
        <span>${escapeHtml(language)}</span>
        <span>${stars} stars</span>
        <span>Updated ${updated}</span>
      </div>
    </a>
  `;
}

function whatIDoItem(item) {
  return `
    <li class="contrib-item" data-stagger>
      <p>${escapeHtml(item)}</p>
    </li>
  `;
}

function itchProjectCard(project) {
  return `
    <a class="itch-card" href="${project.url}" target="_blank" rel="noopener" data-stagger>
      <div class="itch-card-media">
        <img src="${project.image}" alt="${escapeHtml(project.title)} cover art" loading="lazy">
      </div>
      <div class="itch-card-body">
        <div class="itch-card-meta">
          <span class="project-chip project-chip--itch">${escapeHtml(project.category)}</span>
          <span class="project-chip">${escapeHtml(project.status)}</span>
          <span class="project-chip">${escapeHtml(project.price)}</span>
        </div>
        <h3>${escapeHtml(project.title)}</h3>
        <p>${escapeHtml(project.description)}</p>
        <div class="itch-card-tags">
          ${project.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
        </div>
        <div class="itch-card-footer">
          <span>${escapeHtml(project.platforms.join(" / "))}</span>
          <span>Published ${escapeHtml(project.published)}</span>
          <span>Open on itch.io</span>
        </div>
      </div>
    </a>
  `;
}

export function renderHomePage() {
  const allRepos = sortRepositories(getStarredRepositories(REPOSITORIES));

  return `
    <section class="section" id="what-i-do">
      <div class="content-wrap">
        <div class="section-head" data-stagger>
          <p class="section-kicker">What I Do</p>
          <div class="section-line"></div>
        </div>
        <div class="single-panel">
          <article class="oss-panel" data-stagger>
            <ul class="contrib-list">
              ${WHAT_I_DO.map(whatIDoItem).join("")}
            </ul>
          </article>
        </div>
      </div>
    </section>

    <section class="section" id="releases">
      <div class="content-wrap">
        <div class="section-head" data-stagger>
          <p class="section-kicker">Releases</p>
          <div class="section-line"></div>
        </div>
        <div class="itch-intro" data-stagger>
          <div class="summary-panel scanline">
            <div class="summary-panel-copy">
              <p class="summary-panel-overline">Itch</p>
              <p class="summary-panel-count">${ITCH_PROJECTS.length} projects</p>
            </div>
            <a class="button button--itch" href="${PROFILE.itch}" target="_blank" rel="noopener">Visit Itch Profile</a>
          </div>
        </div>
        <div class="itch-grid">
          ${ITCH_PROJECTS.map(itchProjectCard).join("")}
        </div>
      </div>
    </section>

    <section class="section" id="open-source">
      <div class="content-wrap">
        <div class="section-head" data-stagger>
          <p class="section-kicker">Open Source</p>
          <div class="section-line"></div>
        </div>
        <div class="repo-intro" data-stagger>
          <div class="summary-panel scanline">
            <div class="summary-panel-copy">
              <p class="summary-panel-overline">GitHub</p>
              <p class="summary-panel-count">${allRepos.length} repositories</p>
            </div>
            <a class="button" href="${PROFILE.github}" target="_blank" rel="noopener">Visit GitHub</a>
          </div>
        </div>
        <div class="repo-list" id="repo-list" aria-live="polite">
          ${allRepos.map(repoListItem).join("")}
        </div>
      </div>
    </section>

    <section class="section" id="contacts">
      <div class="content-wrap">
        <div class="section-head" data-stagger>
          <p class="section-kicker">Contacts</p>
          <div class="section-line"></div>
        </div>
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
            <h3>itch.io</h3>
            <a href="${PROFILE.itch}" target="_blank" rel="noopener">christian-luppi.itch.io</a>
          </article>
          <article class="contact-card" data-stagger>
            <h3>YouTube</h3>
            <a href="${PROFILE.youtube}" target="_blank" rel="noopener">youtube.com/@christianluppi</a>
          </article>
        </div>
      </div>
    </section>
  `;
}

export async function hydrateHomePage() {
  const repoListEl = document.getElementById("repo-list");
  if (!repoListEl) return;

  try {
    const reposRes = await fetch("https://api.github.com/users/luppichristian/repos?per_page=100");
    if (!reposRes.ok) throw new Error("github failed");

    const repos = await reposRes.json();
    const visible = repos.filter((repo) => !repo.fork && (repo.stargazers_count || 0) >= 1);
    const allSorted = sortRepositories(visible);

    if (repoListEl) {
      repoListEl.innerHTML = allSorted.length
        ? allSorted.map(repoListItem).join("")
        : `<p class="repo-loading">No repositories found.</p>`;
    }
  } catch {
    if (repoListEl) {
      repoListEl.innerHTML = `<p class="repo-loading">Repository list unavailable. Visit <a href="${PROFILE.github}" target="_blank" rel="noopener">GitHub</a>.</p>`;
    }
  }
}
