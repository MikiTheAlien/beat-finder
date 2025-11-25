const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['undrstnd.ch'],
  },
  output: 'standalone',
  env: {
    _next_intl_trailing_slash: 'false',
    NEXT_PUBLIC_API_TOKEN: process.env.NEXT_PUBLIC_API_TOKEN,
  },
};

module.exports = withNextIntl(nextConfig);

