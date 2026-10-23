export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const SITE_NAME = "Kangkan Rajkhowa";
export const SITE_TITLE =
  "Kangkan Rajkhowa — Fullstack Developer & UI/UX Designer";
export const SITE_DESCRIPTION =
  "Kangkan Rajkhowa is a fullstack developer and UI/UX designer from Guwahati, Assam. Laravel, React, PostgreSQL and practical AI — building public-sector platforms and products that last.";

/** Prefixes a public asset path with the deploy base path (GitHub Pages). */
export function asset(path: string) {
  if (!path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}

/** Absolute URL for canonical links and metadata. */
export function absoluteUrl(path = "/") {
  return `${SITE_URL}${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}
