/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  experimental: {
    swcPlugins: [["@swc-jotai/react-refresh", {}]],
  },
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
