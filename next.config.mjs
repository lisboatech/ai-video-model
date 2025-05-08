/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        //domains: ['static.website-files.org', 'openapi.akool.com', 'static.akool.com', 'drz0f01yeq1cx.cloudfront.net']
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'static.website-files.org',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'drz0f01yeq1cx.cloudfront.net',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'openapi.akool.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'static.akool.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'ik.imagekit.io',
                port: '',
                pathname: '/**',
            },

        ],
    }
};

export default nextConfig;
