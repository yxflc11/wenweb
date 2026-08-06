/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: { root: process.env.WENWEB_TURBOPACK_ROOT ?? process.cwd() },
  ...(process.env.WENWEB_STATIC_EXPORT === "1"
    ? {
        output: "export",
        images: { unoptimized: true }
      }
    : {}),
  // three.js / drei ship ESM that Next transpiles fine; nothing special needed.
};

export default nextConfig;
