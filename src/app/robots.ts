import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/orcamento"],
    },
    sitemap: "https://freeband.com.br/sitemap.xml",
  };
}
