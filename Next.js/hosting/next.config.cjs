// next.config.js
/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  future: {
    webpack5: true, // Ensure webpack 5 is enabled if you're using it
  },
  // output: 'export',
  reactStrictMode: false,
  swcMinify: false,
  // distDir: 'build',
  assetPrefix: isProd ? 'https://www.sgsro.com/' : undefined,
};

export default nextConfig;
