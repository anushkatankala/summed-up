/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/index",
        destination: "/api",
      },
    ];
  },
};

export default nextConfig;
