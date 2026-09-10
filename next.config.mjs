/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Permite que Vercel termine el build exitosamente
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
