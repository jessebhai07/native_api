export const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  CLOUDINARY_URL: process.env.CLOUDINARY_URL,
};

const nextConfig = {
  output: "standalone",
  images: {
    unoptimized: true, // Required if you're using Next.js image optimization
  },
  env, // Environment variables for use in the app
};

export default nextConfig;
