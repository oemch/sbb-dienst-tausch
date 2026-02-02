import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Erlaubt Zugriff von Mobilgeräten im lokalen Netzwerk (z.B. 192.168.x.x)
  allowedDevOrigins: ["192.168.112.32"],
  // Optimize images
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Enable strict mode in development
  reactStrictMode: true,
};

export default nextConfig;
