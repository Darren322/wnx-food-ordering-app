import { jsonLdString } from "@/lib/seo";

/**
 * Renders a JSON-LD script tag. The payload is serialised with `<` escaped
 * (see lib/seo.ts) so it cannot break out of the script element.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdString(data) }}
    />
  );
}
