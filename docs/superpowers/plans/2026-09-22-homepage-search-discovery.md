# Homepage Search Discovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a descriptive homepage search title, correct the GitHub Pages site metadata and sitemap URLs, and prepare the site for Google Search Console ownership verification and indexing.

**Architecture:** Keep the visible masthead identity short by rendering `site.name`, while using the more descriptive `site.title` for search metadata. Configure the production URL and repository in Jekyll so canonical and sitemap URLs are absolute. Use the theme's existing `google_site_verification` setting once Search Console supplies the account-specific token.

**Tech Stack:** Jekyll, Liquid, YAML, GitHub Pages, Google Search Console

---

### Task 1: Add pre-change SEO assertions

**Files:**
- Test: shell assertions run against `_config.yml`, `_includes/masthead.html`, and the generated `_site` output

- [x] **Step 1: Run source assertions that describe the desired configuration**

```bash
rg -n '^title\s+: "Zhengxian Wu \| Personal Homepage"$' _config.yml
rg -n '^url\s+: "https://dingwu1021.github.io"$' _config.yml
rg -n '^repository\s+: "DingWu1021/DingWu1021.github.io"$' _config.yml
rg -n '\{\{ site\.name \| default: site\.title \}\}' _includes/masthead.html
```

Expected: all assertions fail before implementation because the production metadata and masthead fallback are not configured yet.

### Task 2: Correct Jekyll site metadata

**Files:**
- Modify: `_config.yml:2-8`
- Modify: `_includes/masthead.html:9`
- Modify: `_includes/seo.html:26-30,51-53`

- [x] **Step 1: Update the production metadata**

```yaml
title                    : "Zhengxian Wu | Personal Homepage"
title_separator          : "-"
name                     : "Zhengxian Wu"
description              : &description "Personal homepage of Zhengxian Wu, an AI researcher at Tsinghua University working on multimodal search, self-improving agents, and long-horizon agent systems."
url                      : "https://dingwu1021.github.io"
baseurl                  : ""
repository               : "DingWu1021/DingWu1021.github.io"
```

Keep the internal implementation plan out of the generated website by adding `docs` to the existing `exclude` list.

- [x] **Step 2: Preserve the concise visible masthead identity**

Change the masthead link in `_includes/masthead.html` to:

```liquid
<li class="masthead__menu-item masthead__menu-item--lg"><a href="{{ base_path }}/">{{ site.name | default: site.title }}</a></li>
```

- [x] **Step 3: Emit the configured description for search engines and social previews**

After the `seo_description` assignment in `_includes/seo.html`, emit:

```liquid
<meta name="description" content="{{ seo_description }}">
```

Use the same resolved description for `og:description`, even when the page does not define a separate excerpt.

- [x] **Step 4: Re-run the source assertions**

Run the four commands from Task 1.

Expected: every command finds exactly one matching line.

### Task 3: Build and verify search-facing output

**Files:**
- Generated only: `_site/index.html`, `_site/sitemap.xml`, `_site/robots.txt`

- [x] **Step 1: Build the production site**

```bash
PATH=/opt/homebrew/opt/ruby@3.1/bin:$PATH JEKYLL_ENV=production bundle exec jekyll build
```

Expected: Jekyll exits successfully and writes `_site`.

- [x] **Step 2: Verify homepage metadata**

```bash
rg -n '<title>Zhengxian Wu \| Personal Homepage</title>' _site/index.html
rg -n '<meta property="og:site_name" content="Zhengxian Wu \| Personal Homepage">' _site/index.html
rg -n '<link rel="canonical" href="https://dingwu1021.github.io/">' _site/index.html
rg -n '<meta name="description" content="Personal homepage of Zhengxian Wu' _site/index.html
rg -n '<meta property="og:description" content="Personal homepage of Zhengxian Wu' _site/index.html
rg -n '>Zhengxian Wu</a>' _site/index.html
```

Expected: each check matches the generated homepage.

- [x] **Step 3: Verify absolute sitemap URLs**

```bash
rg -n '<loc>https://dingwu1021.github.io/' _site/sitemap.xml
```

Expected: sitemap entries use absolute production URLs.

### Task 4: Prepare and complete Search Console connection

**Files:**
- Modify after Google supplies a token: `_config.yml:82`

- [ ] **Step 1: Add the URL-prefix property in Google Search Console**

Use the exact property URL:

```text
https://dingwu1021.github.io/
```

- [ ] **Step 2: Select the HTML tag verification method**

Copy only the value from:

```html
<meta name="google-site-verification" content="ACCOUNT_SPECIFIC_TOKEN">
```

- [ ] **Step 3: Configure the supplied token**

Set:

```yaml
google_site_verification : "ACCOUNT_SPECIFIC_TOKEN"
```

- [ ] **Step 4: Rebuild and verify the verification tag**

```bash
JEKYLL_ENV=production bundle exec jekyll build
rg -n '<meta name="google-site-verification" content="[^\"]+"' _site/index.html
```

Expected: the generated homepage contains the exact Search Console token.

- [ ] **Step 5: Deploy, verify ownership, and submit the sitemap**

After deployment, confirm the live token, click **Verify** in Search Console, submit:

```text
https://dingwu1021.github.io/sitemap.xml
```

Then inspect `https://dingwu1021.github.io/` and request indexing.

### Task 5: Commit and deploy

**Files:**
- Modify: `_config.yml`
- Modify: `_includes/masthead.html`
- Modify: `_includes/seo.html`
- Create: `docs/superpowers/plans/2026-09-22-homepage-search-discovery.md`

- [x] **Step 1: Review the diff**

```bash
git diff --check
git diff -- _config.yml _includes/masthead.html _includes/seo.html docs/superpowers/plans/2026-09-22-homepage-search-discovery.md
```

Expected: no whitespace errors and only the planned SEO changes.

- [ ] **Step 2: Commit the changes**

```bash
git add _config.yml _includes/masthead.html _includes/seo.html docs/superpowers/plans/2026-09-22-homepage-search-discovery.md
git commit -m "Improve homepage search metadata"
```

- [ ] **Step 3: Push the Pages source branch and verify production**

Push the repository's configured GitHub Pages source, then verify the live page title, canonical URL, description, sitemap, and masthead match the generated output.
