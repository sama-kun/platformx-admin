/** @type {import('next').NextConfig} */
const nextConfig = {
<<<<<<< HEAD
  // reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'],
  },
=======
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['res.cloudinary.com'],
  },
  experimental: {
    appDir: true, // Включение новой структуры `app`
  },
>>>>>>> 439e523e895fe3b601e096ae8c75148a79a219b8
};

export default nextConfig;
