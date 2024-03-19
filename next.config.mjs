/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'rent-nest-storage-server.onrender.com',
            },
        ],
    }
};

export default nextConfig;
