# Anthony Chen — Personal Website

A personal website with a homepage, about page, and a markdown-powered blog.

## Structure

```
website/
├── index.html        # Homepage
├── about.html        # About page
├── blog.html / post.html
├── css/ js/ images/ posts/
├── infra/            # Terraform (S3 + CloudFront + ACM + Route 53)
├── scripts/deploy.sh # Sync site + invalidate CDN
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

## Hosting on AWS (Terraform)

Stack: **S3** (files) + **CloudFront** (HTTPS CDN) + **ACM** (cert) + **Route 53** (DNS).
Domain is assumed registered at GoDaddy; DNS is moved to Route 53 via nameservers.

### 1. Install tools + log in

```bash
brew install awscli
brew tap hashicorp/tap
brew install hashicorp/tap/terraform
aws configure   # Access Key ID, Secret, region (e.g. us-west-2)
aws sts get-caller-identity
```

### 2. Deploy infrastructure

```bash
cd infra
cp terraform.tfvars.example terraform.tfvars   # edit domain if needed
terraform init
terraform apply
```

`apply` prints **nameservers**. In GoDaddy: Domain → DNS → Nameservers → change to custom → paste the 4 NS values from Terraform. Wait for DNS (often ~15–60 min; can be longer).

Until NS propagate, you can still preview via the `cloudfront_domain_name` output.

### 3. Upload the site

```bash
./scripts/deploy.sh
```

Re-run that script whenever you change HTML/CSS/JS/posts/images.

### Adding a short homepage update

Edit `SITE_CONFIG.updates` in `js/config.js` (not a blog post), then redeploy.
