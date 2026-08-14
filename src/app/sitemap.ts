import type { MetadataRoute } from "next";

// Only the public routes. /admin and /orcamento are access-controlled and
// already disallowed in robots.ts — listing them here would be an invitation.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://freeband.com.br/",
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://freeband.com.br/portfolio",
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
