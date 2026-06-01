/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.simpleicons.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.iconify.design",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        pathname: "/npm/simple-icons/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/.well-known/ai-profile/:username.json",
        destination: "/.well-known/ai-profile/:username",
      },
    ];
  },
};

export default nextConfig;
