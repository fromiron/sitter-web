/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    experimental: {
        forceSwcTransforms: true,
    },
    images: {
        domains: ['localhost'],
    },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.svg$/,
            issuer: /\.[jt]sx?$/,
            use: ["@svgr/webpack"],
        });
        return config;
    },
    async rewrites() {
        return [
            {
                source: '/zipcode/:path*',
                destination: 'https://zipcloud.ibsnet.co.jp/api/search?zipcode=:path*',
            },
        ]
    },
};

module.exports = nextConfig;
