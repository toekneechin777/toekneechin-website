# Anthony Chen — Personal Website

A personal website with a homepage, about page, and a markdown-powered blog.

## Structure

```
website/
├── index.html        # Homepage
├── about.html        # About page (experience, education, publications, skills)
├── blog.html         # Blog listing page
├── post.html         # Individual blog post renderer
├── css/
│   └── style.css     # All styling
├── js/
│   ├── config.js     # Site config (name, social links, navbar, footer)
│   └── blog.js       # Blog engine (markdown parsing, post rendering)
├── posts/
│   ├── welcome.md
│   └── gemini-agentic-coding.md
└── README.md
```

## Adding a Blog Post

1. Create a new `.md` file in `posts/` (e.g., `my-project.md`).
2. Add front matter at the top:

```markdown
---
title: My Project
date: 2025-07-10
tags: [ML, Research]
summary: A short description shown on the blog list.
---

Write your post in Markdown here...
```

3. Add the filename (without `.md`) to the `POSTS` array in `js/blog.js`:

```js
const POSTS = [
  "welcome",
  "gemini-agentic-coding",
  "my-project",  // <-- add here
];
```

4. The post will automatically appear on the blog page and homepage.

## Customizing

- **Social links / name / tagline:** Edit `js/config.js`
- **About page content:** Edit `about.html`
- **Styling:** Edit `css/style.css`

## Running Locally

This is a static site — just open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploying

Push to GitHub and enable GitHub Pages, or deploy to any static host (Netlify, Vercel, etc.).
