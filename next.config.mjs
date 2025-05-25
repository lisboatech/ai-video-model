/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
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
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
    // Configurações para produção
    experimental: {
        serverComponentsExternalPackages: ['@remotion/cli'],
    },
    // Permitir importação de arquivos MP3
    webpack(config, { isServer }) {
        config.module.rules.push({
            test: /\.(mp3)$/,
            type: 'asset/resource',
            generator: {
                filename: 'static/chunks/[path][name].[hash][ext]'
            }
        });

        // Configurações específicas para Remotion
        if (isServer) {
            config.externals.push('@remotion/cli');
        }

        return config;
    }
};

export default nextConfig;
