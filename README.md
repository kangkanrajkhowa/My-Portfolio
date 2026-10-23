# My Portfolio

The personal portfolio of **Kangkan Rajkhowa** — fullstack developer & UI/UX designer, Guwahati, Assam.

Rebuilt from scratch: a cinematic, shader-driven single page plus static case studies, a curated on-site assistant, a live GitHub dashboard and a generated résumé PDF. Every push to `main` builds, tests and publishes it.

**Live:** <https://kangkanrajkhowa.github.io/My-Portfolio/>

Lighthouse (mobile, live URL): **performance 95 · accessibility 100 · best practices 100 · SEO 100**, 410 KiB transferred.

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, static export) |
| UI | React 19 + TypeScript |
| Styling | Tailwind CSS 4 (CSS-first tokens) |
| 3D | Hand-written WebGL2 shader (no 3D framework, no 3D dependency) |
| Motion | GSAP + ScrollTrigger, Lenis smooth scroll, Motion |
| UI bits | cmdk command palette, lucide icons |
| Tooling | Biome, Vitest, Playwright, axe-core |
| Hosting | GitHub Pages (static) + GitHub Actions |

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

---

## Editing content

Everything you would normally change lives in `src/content/`:

| File | Contains |
| --- | --- |
| `profile.ts` | Name, roles, bio, location, email, phone, availability |
| `skills.ts` | Skills with group + level (1–5), including the **AI & ML** group |
| `projects.ts` | Case studies: summary, problem, approach, outcome, stack, links |
| `experience.ts` | Timeline entries |
| `socials.ts` | Footer/contact links |
| `knowledge.ts` | Q&A entries that power the on-site assistant |
| `github-stats.json` | Generated — do not edit by hand (the build refreshes it) |

Commit and push; the workflow handles the rest.

---

## Deployment

`.github/workflows/deploy.yml` runs on every push to `main`:

1. `npm ci`
2. Biome lint
3. `tsc --noEmit`
4. Vitest
5. Test build + Playwright suite (desktop, mobile, axe)
6. Deploy build (with the correct base path / site URL)
7. Résumé PDF, `.nojekyll`, optional `CNAME`
8. Publish to GitHub Pages

`.github/workflows/ci.yml` runs the same checks on pull requests without publishing.

### First-time GitHub setup

```bash
gh repo create My-Portfolio --public --source=. --remote=origin --push
```

Then set **Settings → Pages → Source: GitHub Actions**.

---

## Custom domain

The site works today at `https://<user>.github.io/My-Portfolio/`. To move it to `kangkanrajkhowa.in` (or any `.in` / `.co` / `.net`):

1. Buy the domain (Cloudflare Registrar, Namecheap, …).
2. Add DNS records:

   | Type | Name | Value |
   | --- | --- | --- |
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | CNAME | `www` | `<user>.github.io` |

3. In the repository: **Settings → Secrets and variables → Actions → Variables**, add
   `CUSTOM_DOMAIN = yourdomain.in`
4. Re-run the **Deploy to GitHub Pages** workflow.
5. Under **Settings → Pages → Custom domain**, confirm the domain (the workflow writes `CNAME` on every deploy).
6. Wait for the certificate (usually under 30 minutes), then enable **Enforce HTTPS**.

`SITE_URL` and `BASE_PATH` are derived automatically: with `CUSTOM_DOMAIN` set the site is served from the root; without it, from `/My-Portfolio`.

---

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
scripts/          GitHub stats, static server, PDF + OG generation
e2e/              Playwright specs (smoke, a11y, mobile)
unit/             Vitest specs
```

---

## Notes

- TypeScript is pinned to the version `create-next-app` shipped (5.x). TypeScript 7 is available but not required here.
- The 3D hero is lazy-loaded and skipped when WebGL is unavailable or `prefers-reduced-motion` is set.
- `src/content/github-stats.json` is refreshed at build time; if the GitHub API is unreachable the last committed values are kept.
