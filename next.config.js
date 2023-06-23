/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  //allow images from any domain, might change this later
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
