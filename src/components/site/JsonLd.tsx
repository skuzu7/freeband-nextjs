// src/components/site/JsonLd.tsx
// One block of structured data. The objects come from src/lib/seo/jsonld.ts;
// this only writes them into the page, escaped.
import { serialise } from '@/lib/seo/jsonld';

interface JsonLdProps {
  /** A schema.org object, or several. */
  data: object | object[];
}

export function JsonLd({ data }: JsonLdProps) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialise(data) }} />;
}
