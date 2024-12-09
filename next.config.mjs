/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: false,
    serverComponentsExternalPackages: ["pino", "pino-pretty"],
  },
  webpack: (config) => {
    config.externals.push("encoding", "p5");
    return config;
  },
};

export default nextConfig;
