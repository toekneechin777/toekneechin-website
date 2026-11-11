/**
 * Blog engine — loads markdown posts from /posts and renders them.
 *
 * To add a new blog post:
 *   1. Create a new .md file in the /posts directory.
 *   2. Add YAML-style front matter at the top:
 *        ---
 *        title: My Project
 *        date: 2025-01-15
 *        tags: [ML, Research]
 *        summary: A short description shown on the blog list.
 *        ---
 *   3. Write your post in Markdown below the front matter.
 *   4. Add the filename to POSTS array below (or use auto-discovery).
 *
 * The post will automatically appear on the blog page.
 */

/** Manually list posts here (filename in /posts without extension). */
const POSTS = [
  "welcome",
  "gemini-agentic-coding",
  "joined-google-moved-to-sf",
];

/**
 * Parse front matter + markdown body from raw text.
 */
function parsePost(raw, slug) {
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) {
    return { slug, title: slug, date: "", tags: [], summary: "", body: raw };
  }
  const frontMatter = fmMatch[1];
  const body = fmMatch[2];

  const meta = {};
  frontMatter.split("\n").forEach((line) => {
    const idx = line.indexOf(":");
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    // Parse arrays like [a, b, c]
    if (val.startsWith("[") && val.endsWith("]")) {
      val = val
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    meta[key] = val;
  });

  return {
    slug,
    title: meta.title || slug,
    date: meta.date || "",
    tags: meta.tags || [],
    summary: meta.summary || "",
    body,
  };
}

/**
 * Minimal markdown -> HTML converter.
 * Supports: headings, bold, italic, code blocks, inline code,
 * links, images, lists, blockquotes, paragraphs, hr.
 */
function markdownToHtml(md) {
  let html = md;

  // Code blocks (```lang\n...```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (m, lang, code) => {
    const escaped = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `<pre><code>${escaped}</code></pre>`;
  });

  // Escape remaining HTML
  html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Headings
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");

  // Horizontal rule
  html = html.replace(/^---$/gm, "<hr>");

  // Blockquote
  html = html.replace(/^&gt; (.+)$/gm, "<blockquote>$1</blockquote>");

  // Bold and italic
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Images: ![alt](url)
  html = html.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1">'
  );

  // Links: [text](url)
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // Unordered lists
  html = html.replace(/(?:^|\n)((?:- .+\n?)+)/g, (m, block) => {
    const items = block
      .trim()
      .split("\n")
      .map((l) => l.replace(/^- /, "").trim())
      .map((l) => `  <li>${l}</li>`)
      .join("\n");
    return `\n<ul>\n${items}\n</ul>`;
  });

  // Ordered lists
  html = html.replace(/(?:^|\n)((?:\d+\. .+\n?)+)/g, (m, block) => {
    const items = block
      .trim()
      .split("\n")
      .map((l) => l.replace(/^\d+\. /, "").trim())
      .map((l) => `  <li>${l}</li>`)
      .join("\n");
    return `\n<ol>\n${items}\n</ol>`;
  });

  // Paragraphs (lines not already wrapped in tags)
  html = html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (/^<(h\d|ul|ol|pre|blockquote|hr|img)/.test(trimmed)) return trimmed;
      return `<p>${trimmed.replace(/\n/g, "<br>")}</p>`;
    })
    .join("\n");

  return html;
}

/** Format date string nicely. */
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Fetch and parse a single post by slug. */
async function fetchPost(slug) {
  const res = await fetch(`posts/${slug}.md`);
  if (!res.ok) throw new Error(`Post "${slug}" not found`);
  const raw = await res.text();
  return parsePost(raw, slug);
}

/** Render the blog list page. */
async function renderBlogList(container) {
  if (!container) return;
  container.innerHTML = '<div class="loading">Loading posts…</div>';

  const posts = [];
  for (const slug of POSTS) {
    try {
      const post = await fetchPost(slug);
      posts.push(post);
    } catch (e) {
      console.warn(e.message);
    }
  }

  // Sort by date descending
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (posts.length === 0) {
    container.innerHTML =
      '<div class="loading">No posts yet. Check back soon!</div>';
    return;
  }

  container.innerHTML = posts
    .map(
      (p) => `
      <a class="blog-post-link" href="post.html?slug=${p.slug}">
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">${p.title}</div>
              <div class="card-subtitle">${p.summary}</div>
            </div>
            <div class="card-date">${formatDate(p.date)}</div>
          </div>
          ${
            p.tags && p.tags.length
              ? `<div>${p.tags
                  .map((t) => `<span class="card-tag">${t}</span>`)
                  .join("")}</div>`
              : ""
          }
        </div>
      </a>`
    )
    .join("");
}

/** Render a single post page based on ?slug= query param. */
async function renderPost(container) {
  if (!container) return;
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  if (!slug) {
    container.innerHTML =
      '<div class="loading">No post specified. <a href="blog.html">Back to blog</a></div>';
    return;
  }

  container.innerHTML = '<div class="loading">Loading…</div>';

  try {
    const post = await fetchPost(slug);
    document.title = `${post.title} — ${SITE_CONFIG.name}`;

    container.innerHTML = `
      <a class="back-link" href="blog.html">← Back to blog</a>
      <h1>${post.title}</h1>
      <div class="article-meta">${formatDate(post.date)}${
      post.tags && post.tags.length
        ? " · " + post.tags.map((t) => `#${t}`).join(" ")
        : ""
    }</div>
      <div class="article-body">${markdownToHtml(post.body)}</div>`;
  } catch (e) {
    container.innerHTML = `
      <a class="back-link" href="blog.html">← Back to blog</a>
      <div class="loading">Post not found. <a href="blog.html">Return to blog</a></div>`;
  }
}

window.renderBlogList = renderBlogList;
window.renderPost = renderPost;
window.markdownToHtml = markdownToHtml;

