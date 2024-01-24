/** @type {import('next').NextConfig} */
// const nextConfig = {}

module.exports = {
    experimental: {
        // appDir: true, 
        serverComponentsExternalPackages: ["sequelize", "pg"],
        // instrumentationHook: true
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"]
        });
        config.experiments = {
            ...config.experiments, topLevelAwait: true
        }


        return config;
    },
    //https://www.bigtv.ru/storage/goodsImages/198/198085/clear_198085_1.jpg
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'www.bigtv.ru',
                pathname: '/storage/goodsImages/**'
                // pathname: '/account123/**',
            },
            {
                protocol: 'https',
                hostname: 'avatars.mds.yandex.net',
                // pathname: '/storage/goodsImages/**'
                // pathname: '/account123/**',
            },
        ],
    }
};