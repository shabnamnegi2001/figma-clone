/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'liveblocks.io',
            port: '',
            pathname: '/avatars/**',
          },
        ],
      },
};

export default nextConfig;
