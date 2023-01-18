/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  // if you don't need to debug service worker in dev, you can set disable:
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  // next.js config
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['ipfs.io', 'png.pngtree.com', 'svgrepo.com'],
  },
  // webpack: true,
  // webpack: (config, options) => {
  //   config.resolve.fallback = { fs: false };
  //   config.module.rules.push({
  //     test: /\.mdx/,
  //     use: [
  //       options.defaultLoaders.babel,
  //       {
  //         loader: '@mdx-js/loader',
  //       },
  //     ],
  //   });

  //   return config;
  // },
});
