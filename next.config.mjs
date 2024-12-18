import withPlugins from "next-compose-plugins";
import withPWA from "next-pwa";
import typescript from "next-plugin-graphql";

const nextConfig = {
  reactStrictMode: false,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: [
      "localhost",
      "*",
      "clotheser-s3-bucket.s3.ap-northeast-2.amazonaws.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "clotheser-s3-bucket.s3.ap-northeast-2.amazonaws.com",
        pathname: "/rentals/**",
      },
      {
        protocol: "https",
        hostname: "clotheser-s3-bucket.s3.ap-northeast-2.amazonaws.com",
        pathname: "/profiles/**",
      },
      {
        protocol: "https",
        hostname: "clotheser-s3-bucket.s3.ap-northeast-2.amazonaws.com",
        pathname: "/users/**",
      },
      {
        protocol: "https",
        hostname: "clotheser-s3-bucket.s3.ap-northeast-2.amazonaws.com",
        pathname: "/chat/**",
      },
      {
        protocol: "https",
        hostname: "clotheser-s3-bucket.s3.ap-northeast-2.amazonaws.com",
        pathname: "/closet/**",
      },
      {
        protocol: "https",
        hostname: "clotheser-s3-bucket.s3.ap-northeast-2.amazonaws.com",
        pathname: "/mycloset/**",
      },
    ],
  },
};

export default withPlugins(
  [
    [
      withPWA,
      {
        pwa: {
          dest: "public",
        },
      },
    ],
    [
      typescript,
      {
        typescriptLoaderOptions: {
          transpileOnly: false,
        },
      },
    ],
  ],
  nextConfig
);
