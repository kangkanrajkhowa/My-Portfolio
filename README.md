# My Portfolio

The personal portfolio of **Kangkan Rajkhowa** — fullstack developer & UI/UX designer, Guwahati, Assam.

Rebuilt from scratch: a cinematic, shader-driven single page plus static case studies, a curated on-site assistant, a live GitHub dashboard and a generated résumé PDF. Every push to `main` builds, tests and publishes it.

**Live:** <https://www.kangkan.in>

Lighthouse (mobile, last measured on the GitHub Pages build): **performance 95 · accessibility 100 · best practices 100 · SEO 100**, 410 KiB transferred. Re-run after the hosting cutover — see [deploy/README.md](deploy/README.md).

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, static export) |
| UI | React 19 + TypeScript |
| Styling | Tailwind CSS 4 (CSS-first tokens) |
| 3D | Hand-written WebGL2 shader (no 3D framework, no 3D dependency) |
| Motion | Lenis smooth scroll, CSS transitions, IntersectionObserver reveals — no animation library |
| UI bits | cmdk command palette, lucide icons, lottie-web (lazy, in-view only) |
| Tooling | Biome, Vitest, Playwright, axe-core |
| Hosting | Static export on shared hosting (Hostinger / BigRock / Namecheap / GoDaddy) via GitHub Actions |

No tracking, no analytics, no ads, no cookies. That is a feature.

---

## Local development

```bash
npm install
npx playwright install chromium   # only needed for e2e, PDF and OG image
npm run dev                       # http://localhost:3000
```

Production build, locally identical to the deployed site:

```bash
npm run build   # writes out/ (prebuild refreshes GitHub stats)
npm run serve   # http://127.0.0.1:4173
```

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Next dev server |
| `npm run build` | Static export to `out/` (refreshes GitHub stats first) |
| `npm run serve` | Serves the exported site on :4173 |
| `npm run lint` | Biome lint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Vitest unit tests |
| `npm run e2e` | Playwright tests against `out/` |
| `npm run stats` | Refresh `src/content/github-stats.json` |
| `npm run pdf` | Regenerate `out/resume.pdf` from `/resume/` |
| `npm run og` | Regenerate `public/og.png` |
| `npm run package:static` | Zip `out/` + a server config for a file-manager upload |

---

## Editing content

Everything you would normally change lives in `src/content/`:

| File | Contains |
| --- | --- |
| `profile.ts` | Name, roles, bio, location, email, phone, availability |
| `skills.ts` | Skills with group + depth (1–5), each rendered as a named row with a five-step depth meter; includes the **AI & ML** group |
| `projects.ts` | Case studies: summary, problem, approach, outcome, stack, links |
| `experience.ts` | Timeline entries |
| `socials.ts` | Footer/contact links |
| `knowledge.ts` | Q&A entries that power the on-site assistant |
| `github-stats.json` | Generated — do not edit by hand (the build refreshes it) |

Commit and push; the workflow handles the rest.

---

## Deployment

The site is a static export: `npm run build` writes `out/`, and any web server can serve it. There is no Node runtime, database or server code in production.

Target: **`www.kangkan.in`** on **GitHub Pages**, published from `main` by [deploy-pages.yml](.github/workflows/deploy-pages.yml). Push to `main` and the live site follows. Lint, typecheck, unit tests, the static export and the résumé PDF all run first, so a broken commit fails the deploy instead of publishing.

### One-time GitHub setup

1. **Settings → Pages → Build and deployment → Source:** choose **GitHub Actions**.
2. **Settings → Pages → Custom domain:** enter `www.kangkan.in`. The same value is committed in [public/CNAME](public/CNAME), so every deploy keeps it. GitHub Pages then redirects `kangkan.in` to `www` with a 301, which is the canonical host the build advertises.
3. **Settings → Secrets and variables → Actions → secret `WEB3FORMS_KEY`** — see [Contact form](#contact-form).
4. Optionally set the repository variable `SITE_URL` if the domain ever changes; it defaults to `https://www.kangkan.in`.

### DNS at GoDaddy

GoDaddy → **My Products → `kangkan.in` → DNS** → delete the parked records and add:

| Type | Name | Value | TTL |
| --- | --- | --- | --- |
| `A` | `@` | `185.199.108.153` | 600 |
| `A` | `@` | `185.199.109.153` | 600 |
| `A` | `@` | `185.199.110.153` | 600 |
| `A` | `@` | `185.199.111.153` | 600 |
| `CNAME` | `www` | `kangkanrajkhowa.github.io` | 600 |

Remove GoDaddy's default parking `A` record on `@` and its `CNAME www → kangkan.in`, or the domain keeps resolving to the parking page. Confirm with `nslookup kangkan.in 8.8.8.8`, then tick **Enforce HTTPS** in **Settings → Pages** once GitHub has issued the certificate — usually within an hour of DNS resolving. Only one host is canonical; GitHub redirects the other.

### Deploying by hand

```bash
npm run build
npm run package:static                    # Apache / LiteSpeed (.htaccess)
npm run package:static -- --server nginx  # config written beside the zip
npm run package:static -- --server iis
```

`dist/kangkan.in-static.zip` is ready for a file-manager upload. A local build still emits the production canonical URL — `SITE_URL` falls back to the real domain, never to localhost.

### Moving to shared hosting instead

The `deploy/` folder and the two FTP workflows are kept for a later move to Hostinger, BigRock, Namecheap or GoDaddy — [deploy/README.md](deploy/README.md) holds the full cutover guide, including the `.htaccess` that turns on Brotli and `immutable` caching. Those workflows skip themselves while their secrets are unset, so they never interfere with Pages. Delete them if you stay on Pages.

## Contact form

GitHub Pages serves static files only, so it cannot run code that sends email. The form therefore posts to [Web3Forms](https://web3forms.com) — a free form-to-inbox relay. Submissions arrive as ordinary email in the inbox the access key was created with; nobody needs an email client open.

1. Open [web3forms.com](https://web3forms.com), enter `kangkan.raj@gmail.com`, and copy the access key it emails you.
2. Add it as a repository secret: **Settings → Secrets and variables → Actions → `WEB3FORMS_KEY`**.
3. Re-run the Pages workflow (or push). The key is baked into the build at compile time, so it only takes effect after a new deploy.

The key is a public identifier rather than a secret — it ships in the browser bundle by design — but Web3Forms lets you restrict it to `www.kangkan.in`, which stops anyone reusing it on another site. It cannot send from your address; replies go to whatever the visitor types.

Locally, put it in `.env.local`:

```bash
NEXT_PUBLIC_WEB3FORMS_KEY=your-key
```

Until a key exists the form degrades gracefully: submitting opens a prefilled email draft instead of failing silently.

---

## Résumé PDF

`/resume/` is a print-optimised page. `npm run pdf` serves the exported site and prints that route to `out/resume.pdf`, so the PDF can never drift from the site. CI regenerates it on every deploy.

---

## Project structure

```
src/
  app/            routes: /, /work/[slug], /resume, 404, sitemap, robots
  components/
    shell/        nav, footer, preloader, cursor, palette, theme, scroll
    sections/     hero, about, skills, work, experience, stats, ask-ai, contact
    three/        hero shader scene
    ui/           reveal, counters, toasts, brand icons
  content/        typed content — the only files you normally edit
  lib/            ask matcher, motion helpers, site constants, utils
deploy/           per-host server configs (Apache/.htaccess, nginx, IIS) + cutover guide
scripts/          GitHub stats, static server, PDF + OG generation, static packager
e2e/              Playwright specs (smoke, a11y, mobile)
unit/             Vitest specs
```

---

## Notes

- TypeScript stays on 5.9 on purpose. TypeScript 7's npm package is the native port and no longer ships the JS compiler API that Next.js resolves, so `next build` aborts on it; support is canary-only behind an experimental flag as of Next 16.4.3.
- `out/_next` is ~1.3 MB of uncompressed JS/CSS. The `.htaccess` and nginx configs turn on Brotli/gzip — without them, shared hosting serves all of it raw.
- The 3D hero is lazy-loaded and skipped when WebGL is unavailable or `prefers-reduced-motion` is set.
- `src/content/github-stats.json` is refreshed at build time; if the GitHub API is unreachable the last committed values are kept.
