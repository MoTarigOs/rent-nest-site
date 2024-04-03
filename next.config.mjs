/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            // {
            //     protocol: 'http',
            //     hostname: 'localhost'
            // }
            {
                protocol: 'https',
                hostname: 'rent-nest-storage-server.onrender.com',
            },
        ],
    }
};

export default nextConfig;
