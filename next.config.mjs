/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '5500',
            },
            {
                protocol: 'https',
                hostname: 'rent-nest-storage-server.onrender.com',
                port: '5500',
            },
        ],
    }
};

export default nextConfig;
