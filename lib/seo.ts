/**
 * SEO helpers: canonical site URL and safe JSON-LD serialisation.
 *
 * Set NEXT_PUBLIC_SITE_URL in the environment for production
 * (e.g. https://www.example.sg); falls back to localhost for development.
 */
const FALLBACK_SITE_URL = "http://localhost:3000";

export const siteName = "Whampoa Nan Xiang Chicken Rice";
export const siteDescription =
  "Preorder chicken rice and signature dry laksa from Whampoa Nan Xiang Chicken Rice and collect your order freshly prepared at the stall.";

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return (raw && raw.length > 0 ? raw : FALLBACK_SITE_URL).replace(/\/+$/, "");
}

export function absoluteUrl(path = "/"): string {
  return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * JSON.stringify with `<` escaped as < so the output is safe to embed
 * inside an inline <script type="application/ld+json"> tag.
 */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
