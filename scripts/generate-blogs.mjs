import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const BLOGS_DIR = path.join(ROOT_DIR, "blogs");
const POSTS_DIR = path.join(BLOGS_DIR, "posts");
const SITE_URL = "https://luppichristian.github.io";
const PROFILE = {
  email: "business.luppichristian@gmail.com",
  github: "https://github.com/luppichristian",
  itch: "https://christian-luppi.itch.io/",
  youtube: "https://www.youtube.com/@christianluppi"
};
const GENERATED_MARKER = "<!-- GENERATED: BLOG PAGE -->";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}

function slugify(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseFrontMatter(source) {
  const normalized = source.replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) {
    throw new Error("Blog post is missing front matter.");
  }

  const endIndex = normalized.indexOf("\n---\n", 4);
  if (endIndex === -1) {
    throw new Error("Blog post front matter is not closed with '---'.");
  }

  const rawMeta = normalized.slice(4, endIndex).split("\n");
  const body = normalized.slice(endIndex + 5).trim();
  const metadata = {};

  for (const line of rawMeta) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    metadata[key] = value;
  }

  return { metadata, body };
}

function renderInline(text) {
  const placeholders = [];
  let html = String(text ?? "");

  html = html.replace(/`([^`]+)`/g, (_, code) => {
    const token = `__CODE_SPAN_${placeholders.length}__`;
    placeholders.push(`<code>${escapeHtml(code)}</code>`);
    return token;
  });

  html = escapeHtml(html);

  html = html.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => {
    return `<a href="${escapeAttribute(href)}">${label}</a>`;
  });

  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");

  placeholders.forEach((value, index) => {
    html = html.replace(`__CODE_SPAN_${index}__`, value);
  });

  return html;
}

function renderMarkdown(source) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let paragraphLines = [];
  let listType = null;
  let listItems = [];
  let quoteLines = [];
  let codeFence = null;

  const flushParagraph = () => {
    if (!paragraphLines.length) return;
    html.push(`<p>${renderInline(paragraphLines.join(" ").trim())}</p>`);
    paragraphLines = [];
  };

  const flushList = () => {
    if (!listType || !listItems.length) return;
    const tag = listType === "ol" ? "ol" : "ul";
    html.push(`<${tag}>${listItems.map((item) => `<li>${renderInline(item)}</li>`).join("")}</${tag}>`);
    listType = null;
    listItems = [];
  };

  const flushQuote = () => {
    if (!quoteLines.length) return;
    html.push(`<blockquote><p>${renderInline(quoteLines.join(" ").trim())}</p></blockquote>`);
    quoteLines = [];
  };

  const flushAll = () => {
    flushParagraph();
    flushList();
    flushQuote();
  };

  for (const line of lines) {
    if (codeFence) {
      if (line.startsWith("```")) {
        const className = codeFence.language ? ` class="language-${escapeAttribute(codeFence.language)}"` : "";
        html.push(`<pre><code${className}>${escapeHtml(codeFence.lines.join("\n"))}</code></pre>`);
        codeFence = null;
      } else {
        codeFence.lines.push(line);
      }
      continue;
    }

    const trimmed = line.trim();
    if (!trimmed) {
      flushAll();
      continue;
    }

    const fenceMatch = trimmed.match(/^```([a-zA-Z0-9_-]+)?$/);
    if (fenceMatch) {
      flushAll();
      codeFence = { language: fenceMatch[1] || "", lines: [] };
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      flushAll();
      const level = headingMatch[1].length;
      html.push(`<h${level}>${renderInline(headingMatch[2].trim())}</h${level}>`);
      continue;
    }

    const orderedMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (orderedMatch) {
      flushParagraph();
      flushQuote();
      if (listType && listType !== "ol") flushList();
      listType = "ol";
      listItems.push(orderedMatch[1].trim());
      continue;
    }

    const unorderedMatch = trimmed.match(/^[-*]\s+(.+)$/);
    if (unorderedMatch) {
      flushParagraph();
      flushQuote();
      if (listType && listType !== "ul") flushList();
      listType = "ul";
      listItems.push(unorderedMatch[1].trim());
      continue;
    }

    const quoteMatch = trimmed.match(/^>\s?(.*)$/);
    if (quoteMatch) {
      flushParagraph();
      flushList();
      quoteLines.push(quoteMatch[1]);
      continue;
    }

    flushList();
    flushQuote();
    paragraphLines.push(trimmed);
  }

  flushAll();

  if (codeFence) {
    throw new Error("Code fence was opened but never closed.");
  }

  return html.join("\n\n");
}

function buildPage(post, articleHtml) {
  const title = escapeHtml(post.title);
  const description = escapeAttribute(post.description);
  const canonicalUrl = `${SITE_URL}/blogs/${post.slug}/`;
  const tagChips = post.tags.map((tag) => `            <span class="blog-chip">${escapeHtml(tag)}</span>`).join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="dark">
  <meta name="theme-color" content="#06080d">
  <title>${title} | Christian Luppi</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${canonicalUrl}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/styles.css">
</head>
<body>
  ${GENERATED_MARKER}
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
          <a href="/">Home</a>
          <a href="/#skills">Skills</a>
          <a href="/#blogs">Blogs</a>
          <a href="/#released-projects">Released Projects</a>
          <a href="/#open-source-projects">Open Source Projects</a>
          <a href="/#contacts">Contacts</a>
        </nav>
      </div>
    </header>
    <main>
      <section class="blog-hero">
        <div class="content-wrap">
          <p class="blog-kicker" data-stagger>${escapeHtml(post.category)}</p>
          <h1 class="blog-title" data-stagger>${title}</h1>
          <p class="blog-summary" data-stagger>${escapeHtml(post.description)}</p>
          <div class="blog-meta-row" data-stagger>
            <span class="blog-chip">${escapeHtml(post.published)}</span>
${tagChips}
          </div>
        </div>
      </section>
      <section class="blog-article">
        <div class="content-wrap">
          <article class="blog-prose" data-stagger>
${indentBlock(articleHtml, 12)}
          </article>
        </div>
      </section>
      <section class="section" id="contacts">
        <div class="content-wrap">
          <div class="section-head" data-stagger>
            <p class="section-kicker">Contacts</p>
            <div class="section-line"></div>
          </div>
          <div class="contact-grid">
            <article class="contact-card simple-list-item" data-stagger>
              <h3>Email</h3>
              <a href="mailto:${PROFILE.email}">${PROFILE.email}</a>
            </article>
            <article class="contact-card simple-list-item" data-stagger>
              <h3>GitHub</h3>
              <a href="${PROFILE.github}" target="_blank" rel="noopener">github.com/luppichristian</a>
            </article>
            <article class="contact-card simple-list-item" data-stagger>
              <h3>itch.io</h3>
              <a href="${PROFILE.itch}" target="_blank" rel="noopener">christian-luppi.itch.io</a>
            </article>
            <article class="contact-card simple-list-item" data-stagger>
              <h3>YouTube</h3>
              <a href="${PROFILE.youtube}" target="_blank" rel="noopener">youtube.com/@christianluppi</a>
            </article>
          </div>
        </div>
      </section>
    </main>
    <footer class="site-footer">
      <div class="content-wrap site-footer-inner">
        <p class="footer-copy">© ${new Date().getFullYear()} Christian Luppi · Systems and graphics engineering</p>
        <nav class="footer-links" aria-label="Social links">
          <a href="mailto:${PROFILE.email}">Email</a>
          <a href="${PROFILE.github}" target="_blank" rel="noopener">GitHub</a>
          <a href="${PROFILE.itch}" target="_blank" rel="noopener">itch.io</a>
        </nav>
      </div>
    </footer>
  </div>
  <script defer src="/assets/js/main.js"></script>
</body>
</html>
`;
}

function indentBlock(value, spaces) {
  const padding = " ".repeat(spaces);
  return value
    .split("\n")
    .map((line) => `${padding}${line}`)
    .join("\n");
}

async function listMarkdownPosts() {
  try {
    const entries = await readdir(POSTS_DIR, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".md"))
      .map((entry) => path.join(POSTS_DIR, entry.name));
  } catch (error) {
    if (error && error.code === "ENOENT") {
      await mkdir(POSTS_DIR, { recursive: true });
      return [];
    }
    throw error;
  }
}

async function loadPosts() {
  const files = await listMarkdownPosts();
  const posts = [];

  for (const filePath of files) {
    const raw = await readFile(filePath, "utf8");
    const { metadata, body } = parseFrontMatter(raw);
    const title = metadata.title;
    const description = metadata.description;
    const published = metadata.published;
    const slug = metadata.slug ? slugify(metadata.slug) : slugify(path.basename(filePath, ".md"));
    const tags = (metadata.tags || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const category = metadata.category || tags[0] || "Blog";

    if (!title || !description || !published || !slug) {
      throw new Error(`Post '${path.basename(filePath)}' is missing title, description, published, or slug metadata.`);
    }

    posts.push({
      title,
      description,
      published,
      slug,
      tags,
      category,
      body,
      sourcePath: filePath
    });
  }

  posts.sort((a, b) => new Date(b.published) - new Date(a.published));
  return posts;
}

async function writeGeneratedPost(post) {
  const articleHtml = renderMarkdown(post.body);
  const outputDir = path.join(BLOGS_DIR, post.slug);
  const outputFile = path.join(outputDir, "index.html");
  await mkdir(outputDir, { recursive: true });
  await writeFile(outputFile, buildPage(post, articleHtml), "utf8");
}

async function writeIndex(posts) {
  const indexData = posts.map((post) => ({
    title: post.title,
    description: post.description,
    url: `/blogs/${post.slug}/`,
    published: post.published,
    tags: post.tags
  }));

  await writeFile(path.join(BLOGS_DIR, "index.json"), `${JSON.stringify(indexData, null, 2)}\n`, "utf8");
}

async function removeStaleGeneratedPosts(activeSlugs) {
  const entries = await readdir(BLOGS_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name === "posts" || entry.name === "templates") continue;
    if (activeSlugs.has(entry.name)) continue;

    const htmlPath = path.join(BLOGS_DIR, entry.name, "index.html");
    try {
      const info = await stat(htmlPath);
      if (!info.isFile()) continue;
      const html = await readFile(htmlPath, "utf8");
      if (!html.includes(GENERATED_MARKER)) continue;
      await rm(path.join(BLOGS_DIR, entry.name), { recursive: true, force: true });
    } catch (error) {
      if (!error || error.code !== "ENOENT") throw error;
    }
  }
}

async function main() {
  const posts = await loadPosts();
  const activeSlugs = new Set(posts.map((post) => post.slug));
  await removeStaleGeneratedPosts(activeSlugs);
  for (const post of posts) {
    await writeGeneratedPost(post);
  }
  await writeIndex(posts);
  process.stdout.write(`Generated ${posts.length} blog page(s).\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
