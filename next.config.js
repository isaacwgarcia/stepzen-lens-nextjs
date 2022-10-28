/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    REFRESH_MILISECONDS_INTERVAL: process.env.REFRESH_MILISECONDS_INTERVAL,
  },
  images: {
    domains: ["files.readme.io"],
  },
};

module.exports = nextConfig;
