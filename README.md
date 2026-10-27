# My Portfolio

The personal portfolio of **Kangkan Rajkhowa** — fullstack developer & UI/UX designer, Guwahati, Assam.

Rebuilt from scratch: a cinematic, shader-driven single page plus static case studies, a curated on-site assistant, a live GitHub dashboard and a generated résumé PDF. Every push to `main` builds, tests and publishes it.

**Live:** <https://kangkan.dev>

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
| `skills.ts` | Skills with group + depth (1–5), rendered as the capability heatmap; includes the **AI & ML** group |
| `projects.ts` | Case studies: summary, problem, approach, outcome, stack, links |
| `experience.ts` | Timeline entries |
| `socials.ts` | Footer/contact links |
| `knowledge.ts` | Q&A entries that power the on-site assistant |
| `github-stats.json` | Generated — do not edit by hand (the build refreshes it) |

Commit and push; the workflow handles the rest.

---## Deployment

The site is a static export: `npm run build` writes `out/`, and any web server can serve it. There is no Node runtime, database or server code in production.

Target: **`kangkan.dev`** at a domain root on shared hosting (Hostinger, BigRock, Namecheap, GoDaddy). The complete cutover guide — which server config to upload, DNS records, SSL, verification and troubleshooting — lives in **[deploy/README.md](deploy/README.md)**.

Two deployment workflows are provided. Enable **one** and delete the other:

| Workflow | Use when | Required secrets |
| --- | --- | --- |
| [deploy-ftp.yml](.github/workflows/deploy-ftp.yml) | Any of the four hosts | `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, `FTP_SERVER_DIR` |
| [deploy-sftp.yml](.github/workflows/deploy-sftp.yml) | The plan includes SSH | `SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`, `SSH_KNOWN_HOSTS`, `SSH_PATH` |

Both build on every push to `main` — lint, typecheck, unit tests, static export, résumé PDF, server config — and then publish. Until the matching secrets exist the deploy job skips itself with a notice rather than failing red.

Set the optional repository variable `SITE_URL` only if the domain changes; it defaults to `https://kangkan.dev`.

### Deploying by hand

```bash
npm run build
npm run package:static                    # Apache / LiteSpeed (.htaccess)
npm run package:static -- --server nginx  # config written beside the zip
npm run package:static -- --server iis
```

`dist/kangkan.dev-static.zip` is ready for a file-manager upload. A local build still emits the production canonical URL — `SITE_URL` falls back to the real domain, never to localhost.

### DNS and SSL

1. Buy `kangkan.dev`, add it in the hosting panel, and point DNS at the host (its nameservers, or an `A` record for `@` plus a `CNAME` for `www`).
2. Enable **AutoSSL / Let's Encrypt** and wait for the certificate. `.dev` is on the HSTS preload list, so HTTPS is not optional — a missing certificate makes the domain look completely offline.
3. Enable **Force HTTPS** in the panel, then upload the server config and files.
4. Run the verification commands in [deploy/README.md](deploy/README.md#5-verify-the-deploy) and confirm `content-encoding: br`.

GitHub Pages is retired: its workflow has been deleted, so no further builds publish there. The old `github.io` site keeps serving its last deployment until you unpublish it under **Settings → Pages**.

## Contact form

The form posts to [Web3Forms](https://web3forms.com) (free, no backend).

1. Create an access key for `kangkan.raj@gmail.com`.
2. Add it as a repository secret: **Settings → Secrets → Actions → `WEB3FORMS_KEY`**.
3. Push (or re-run the workflow).

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
