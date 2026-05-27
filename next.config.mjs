/** @type {import('next').NextConfig} */
const nextConfig = {
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
