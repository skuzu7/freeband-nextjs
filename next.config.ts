import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';
// Vercel sets VERCEL_ENV at build time. Preview deployments inject the Vercel
// Toolbar (comments, share, feedback) from vercel.live; a policy that allows
// only 'self' blocks it and leaves a broken toolbar plus console errors on
// every preview. Production never loads the toolbar, so it keeps the strict
// policy unchanged.
const isPreview = process.env.VERCEL_ENV === 'preview';
const toolbar = (sources: string) => (isPreview ? ` ${sources}` : '');

// One static policy for every route. The site is prerendered, so a per-request
// nonce (which would force dynamic rendering of every page) is off the table;
// 'unsafe-inline' stays for the scripts Next.js itself inlines and for style
// attributes. What the policy does lock: no script from another origin, no
// framing, no plugins, no base-uri or form-action hijack.
//
// The PDFs (portfolio and proposal) are laid out by @react-pdf's Yoga engine,
// which ships as WebAssembly inlined as a data: URL. Without 'wasm-unsafe-eval'
// the browser refuses to compile it and every PDF fails in production (dev
// hides this behind 'unsafe-eval'). 'wasm-unsafe-eval' allows compiling
// WebAssembly only, not eval() of JavaScript; data: in connect-src lets the
// loader read that inlined module instead of failing over with a console error.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'${isDev ? " 'unsafe-eval'" : ''}${toolbar('https://vercel.live')}`,
  `style-src 'self' 'unsafe-inline'${toolbar('https://vercel.live')}`,
  `img-src 'self' data: blob:${toolbar('https://vercel.live https://vercel.com')}`,
  `font-src 'self' data:${toolbar('https://vercel.live https://assets.vercel.com')}`,
  "media-src 'self' blob:",
  `connect-src 'self' data:${isDev ? ' ws: wss:' : ''}${toolbar('https://vercel.live wss://ws-us3.pusher.com')}`,
  `frame-src 'self'${toolbar('https://vercel.live')}`,
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ');

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
  },
  turbopack: {
    // Pin the Turbopack workspace root to this project. A stray
    // package-lock.json in C:\Users\anton confuses Turbopack's auto-detection
    // and causes external module resolution to fail during production builds.
    root: __dirname,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          // Two years, subdomains included; no `preload` — that is a
          // one-way registration for the whole domain, the owner's call.
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/admin",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/orcamento/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
