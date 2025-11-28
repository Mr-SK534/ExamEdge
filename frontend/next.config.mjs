// frontend/next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ─────────────────────────────────────────────────────────────
  // Core Performance & Build Settings
  // ─────────────────────────────────────────────────────────────
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Faster builds & better tree-shaking
    optimizePackageImports: ["lucide-react", "sonner"],
  },

  // ─────────────────────────────────────────────────────────────
  // Images – Allow your formula sheets, mind maps, etc.
  // ─────────────────────────────────────────────────────────────
  images: {
    domains: [],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow any HTTPS images (you can tighten later)
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // PWA – Make ExamEdge installable & work offline
  // ─────────────────────────────────────────────────────────────
  pwa: {
    dest: "public",
    disable: process.env.NODE_ENV === "development", // Auto-disable in dev
    register: true,
    skipWaiting: true,
  },

  // ─────────────────────────────────────────────────────────────
  // Large File Handling – Important for NCERT PDFs (50–100 MB)
  // ─────────────────────────────────────────────────────────────
  webpack: (config, { isServer }) => {
    // Increase limit for static assets (PDFs in public/ncert-pdfs/)
    config.module.rules.push({
      test: /\.(pdf)$/,
      type: "asset",
      generator: {
        filename: "static/chunks/[name].[hash][ext]",
      },
    });

    // Prevent large PDFs from being inlined (critical for performance)
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    return config;
  },

  // Optional: Compress output for slower networks (great for tier-2/3 cities)
  compress: true,

  // ─────────────────────────────────────────────────────────────
  // Environment Variables (Client-side)
  // ─────────────────────────────────────────────────────────────
  env: {
    NEXT_PUBLIC_APP_NAME: "ExamEdge",
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  },
};

export default nextConfig;