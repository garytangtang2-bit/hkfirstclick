/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    generateBuildId: async () => {
        return `build-${Date.now()}`;
    },
};

export default nextConfig;
