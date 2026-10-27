/**
 * Canonical origin. Falls back to the production domain rather than localhost so a
 * hand-built `out/` (zipped and uploaded through a hosting file manager) never ships
 * canonical, Open Graph or sitemap URLs pointing at a developer machine.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://kangkan.dev";

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const SITE_NAME = "Kangkan Rajkhowa";
export const SITE_TITLE =
  "Kangkan Rajkhowa — Fullstack Developer & Product Engineer";
export const SITE_DESCRIPTION =
  "Kangkan Rajkhowa is a fullstack developer and product engineer from Guwahati, Assam. Laravel, React and PostgreSQL — building public-sector platforms and products that last.";

/** Prefixes a public asset path with the deploy base path (GitHub Pages). */
export function asset(path: string) {
  if (!path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}

/** Absolute URL for canonical links and metadata. */
export function absoluteUrl(path = "/") {
  return `${SITE_URL}${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}
