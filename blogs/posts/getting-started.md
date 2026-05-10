---
title: How To Add A Blog Post To This Site
description: Reference post for the website blog setup, including the page template, blog registration flow, and homepage listing behavior.
published: 2026-05-10
slug: getting-started
category: Website Setup
tags: Setup, Static Site, Blog
---

The site now includes a dedicated `/blogs/` area for standalone blog posts. Each post is just a Markdown file inside `blogs/posts/`, which keeps GitHub Pages deployment simple without forcing you to hand-maintain the final HTML page.

## Where to create new posts

Create a new file like `/blogs/posts/my-post-slug.md`. Add the front matter at the top for the title, summary, published date, slug, category, and tags, then write the article body in normal Markdown.

## How generation works

The repo includes `scripts/generate-blogs.mjs`. It reads every Markdown file in `/blogs/posts/`, converts the content into the site blog layout, and writes both:

- `/blogs/<slug>/index.html`
- `/blogs/index.json`

That keeps the homepage blog section and the standalone post pages in sync.

## Local workflow

Running `run.bat` now generates blog pages before starting the local web server. You can also run the generator directly with `node scripts/generate-blogs.mjs`.

## Recommended workflow

1. Create a new Markdown file under `/blogs/posts/`.
2. Fill in the front matter metadata.
3. Write the article body in Markdown.
4. Run `node scripts/generate-blogs.mjs` or just start the site with `run.bat`.
5. Commit both the Markdown source and the generated blog output.

> GitHub Pages serves static files from the repository, so the generated HTML pages still need to exist in the repo when you publish changes.
