# Deploying to shared hosting

The site is a static export: `npm run build` writes everything to `out/`, and any
web server that can serve HTML/CSS/JS can host it. There is no Node runtime, no
database and no server-side code involved — the contact form talks to Web3Forms
from the browser and the assistant runs from a local knowledge file.

Target domain: **`kangkan.dev`** (root, no base path).

---

## 1. Pick the config for your host

| Host | File to upload | Where it goes |
| --- | --- | --- |
| **Hostinger** (LiteSpeed) | [`apache/.htaccess`](apache/.htaccess) | `public_html/.htaccess` |
| **BigRock** (cPanel/Apache) | [`apache/.htaccess`](apache/.htaccess) | `public_html/.htaccess` |
| **Namecheap** (cPanel/Apache) | [`apache/.htaccess`](apache/.htaccess) | `public_html/.htaccess` |
| **GoDaddy** Linux (cPanel/Apache) | [`apache/.htaccess`](apache/.htaccess) | `public_html/.htaccess` |
| **GoDaddy** Windows (IIS) | [`iis/web.config`](iis/web.config) | `wwwroot/web.config` |
| VPS / Cloudways / any nginx | [`nginx/portfolio.conf`](nginx/portfolio.conf) | `/etc/nginx/sites-available/` |

LiteSpeed reads `.htaccess` directives, so Hostinger needs no separate file. The
file is named `.htaccess` **with the leading dot** — FTP clients hide dotfiles by
default, so check your client's "show hidden files" setting before concluding it
did not upload.

Both the Apache and nginx configs do the same five things:

1. Force HTTPS and strip `www` (canonical host is the bare domain).
2. Serve `/work/slug/` from `work/slug/index.html` and redirect `/work/slug` to
   the trailing-slash form, so each page has exactly one URL.
3. Return the exported `404.html` for anything missing.
4. Compress HTML/CSS/JS/JSON/SVG with Brotli (Apache/nginx) or gzip.
5. Cache `_next/static/*` for a year as `immutable`, while HTML and the RSC
   `.txt` payloads revalidate on every request.

That last pair matters more than it sounds. `out/_next` is ~1.3 MB of raw
JavaScript and CSS; shared hosts usually ship with compression **off**, so
without step 4 every visitor downloads all of it uncompressed.

---

## 2. Point the domain at the host

Add `kangkan.dev` in your host's panel first, then choose one DNS approach:

**Option A — host's nameservers (simplest).** In your registrar's DNS settings,
replace the nameservers with the pair your host gives you (e.g.
`ns1.dns-parking.com` / `ns2.dns-parking.com` on Hostinger). The host then
manages every record, including the ones AutoSSL needs.

**Option B — keep the registrar's DNS.** Create these records instead, using the
IP address from your host's panel:

| Type | Name | Value | TTL |
| --- | --- | --- | --- |
| `A` | `@` | your host's IPv4 address | 3600 |
| `A` | `@` | your host's second IPv4, if it lists one | 3600 |
| `CNAME` | `www` | `kangkan.dev` | 3600 |

Propagation is usually minutes, occasionally a few hours. Check with
`nslookup kangkan.dev` before you upload anything.

---

## 3. Turn on SSL before the first visit

`.dev` is on the HSTS preload list, so browsers refuse to load the site over
plain HTTP — a missing certificate means the domain appears completely dead
rather than showing a warning.

Enable **AutoSSL / Let's Encrypt** in the hosting panel and wait for it to issue
(the panel shows the certificate state). There is no chicken-and-egg problem:
Let's Encrypt validates over HTTP server-to-server, which still works even though
browsers will not speak plain HTTP to a `.dev` domain. Enable **Force HTTPS** in
the panel too — the config files enforce it, but the panel setting covers the
window before `.htaccess` is uploaded.

---

## 4. Publish

### Automated (recommended)

Two workflows build on every push to `main` that touches the site. Enable
exactly one and delete the other:

- [`deploy-ftp.yml`](../.github/workflows/deploy-ftp.yml) — works on every host
  in the table above. Required secrets: `FTP_SERVER`, `FTP_USERNAME`,
  `FTP_PASSWORD`, `FTP_SERVER_DIR`.
- [`deploy-sftp.yml`](../.github/workflows/deploy-sftp.yml) — faster, and
  removes files that no longer exist. Needs SSH, which Hostinger includes on
  Business plans and above. Required secrets: `SSH_HOST`, `SSH_USER`,
  `SSH_PRIVATE_KEY`, `SSH_KNOWN_HOSTS`, `SSH_PATH`.

Add them under **Settings → Secrets and variables → Actions → Secrets**. The
optional repository variable `SITE_URL` overrides the default
`https://kangkan.dev`.

`FTP_SERVER_DIR` must end with a slash, e.g. `/public_html/`. For SFTP,
`SSH_PATH` is the absolute path to the document root, e.g.
`/home/u123456789/domains/kangkan.dev/public_html`.

Keep `.github/workflows/ci.yml` — it still lints, type-checks, tests and runs the
end-to-end suite on every pull request.

### Manual (no CI)

```bash
npm run build
npm run package:static          # Apache/.htaccess by default
npm run package:static -- --server nginx
npm run package:static -- --server iis
```

This writes `dist/kangkan.dev-static.zip`, containing `out/` plus the matching
server config, ready to drop into hPanel or cPanel's File Manager → Upload →
Extract. For nginx the config is written **next to** the zip rather than inside
it, because a `.conf` file in a web root is downloadable.

If you are uploading by hand, delete the host's default `default.php`,
`index.html` placeholder or `public_html/index.php` first — otherwise it keeps
winning the directory index.

---

## 5. Verify the deploy

```bash
# Certificate and compression on the document
curl -sI https://kangkan.dev/ | grep -Ei "http/|content-encoding|cache-control|strict-transport"

# Fingerprinted assets must be immutable and compressed
curl -sI https://kangkan.dev/_next/static/chunks/ | head -1

# Redirects
curl -sI http://kangkan.dev/   | head -3   # 301 -> https://kangkan.dev/
curl -sI https://www.kangkan.dev/ | head -3 # 301 -> https://kangkan.dev/

# A real page, the 404, and the résumé
curl -s -o /dev/null -w "%{http_code}\n" https://kangkan.dev/work/
curl -s -o /dev/null -w "%{http_code}\n" https://kangkan.dev/does-not-exist/
curl -s -o /dev/null -w "%{http_code}\n" https://kangkan.dev/resume.pdf
```

`content-encoding: br` (or `gzip`) on the first two is the quick proof that
compression is live. If it is missing, the host has the module disabled — enable
"Compress static content" in the panel, or in cPanel use **Optimize Website**.

Also confirm the canonical URL in the page source is the new domain:

```bash
curl -s https://kangkan.dev/ | grep -o '<link rel="canonical"[^>]*>'
```

---

## Troubleshooting

| Symptom | Cause |
| --- | --- |
| **500 Internal Server Error** right after uploading `.htaccess` | The host restricts a directive via `AllowOverride`. Comment out the `Options` line first, then the `<IfModule mod_headers.c>` block, and check `error_log`. |
| Site loads over HTTP but the certificate says invalid | AutoSSL has not finished. Wait, then re-run AutoSSL in the panel. |
| `.htaccess` uploads but is ignored | It must sit in the document root, not inside the extracted `out/` folder. Check for a stray `public_html/out/.htaccess`. |
| Plain `.html` files download instead of rendering | The file manager mangled the extension, or the host's default handler is missing. Re-upload. |
| Changes do not appear | HTML is cached for 0 seconds and revalidated, so this is almost always a stale upload, not caching. Confirm the file timestamp on the server. |
| `/resume.pdf` returns 404 | The PDF is generated at build time by `npm run pdf`, which needs Playwright's Chromium. The automated workflows run it; a bare `npm run build` does not. Run `npx playwright install chromium && npm run pdf` before packaging by hand. |
