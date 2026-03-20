import { PROJECTS } from "../data/site-data.js";
import { createSvgForProject, escapeHtml, highlightCode } from "../lib/dom.js";

export function getCaseStudyBySlug(slug) {
  return PROJECTS.find((project) => project.slug === slug) || null;
}

function section(title, body) {
  return `
    <section class="case-section panel" data-stagger>
      <h2>${escapeHtml(title)}</h2>
      ${body}
    </section>
  `;
}

export function renderCaseStudyPage(project) {
  const transitionName = `project-visual-${project.slug}`;
  const stack = project.stackDetails.map((item) => `<span class="stack-item">${escapeHtml(item)}</span>`).join("");
  const results = project.results
    .map((item) => `<a class="button" href="${item.href}" target="_blank" rel="noopener">${escapeHtml(item.text)}</a>`)
    .join("");

  return `
    <article class="case-study">
      <div class="content-wrap">
        <a class="button" data-link href="/" style="margin-bottom:1rem;display:inline-flex;">Back to Home</a>

        <header class="case-hero panel">
          <div class="case-hero-art" style="view-transition-name: ${transitionName}">
            ${createSvgForProject(project.diagram)}
          </div>
          <div class="case-hero-body" data-stagger>
            <p class="hero-tag">Case Study</p>
            <h1>${escapeHtml(project.title)}</h1>
            <p>${escapeHtml(project.summary)}</p>
          </div>
        </header>

        <div class="case-layout">
          ${section("The Challenge", `<p>${escapeHtml(project.challenge)}</p>`)}
          ${section("Technical Stack", `<div class="stack-list">${stack}</div>`)}
          ${section(
            "Key Implementation Details",
            `<p>${escapeHtml(project.implementation)}</p><div class="codeblock"><pre><code>${highlightCode(project.code)}</code></pre></div>`
          )}
          ${section("Architecture Diagram", `<div class="diagram">${createSvgForProject(project.diagram)}</div>`)}
          ${section("Results / Links", `<div class="result-links">${results}</div>`)}
        </div>
      </div>
    </article>
  `;
}
