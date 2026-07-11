import type { NextConfig } from "next";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === "true";
const shouldExport = process.env.BUILD_TARGET === "pages";
const basePath =
  isGitHubPagesBuild && repositoryName ? `/${repositoryName}` : "";

const nextConfig: NextConfig = {
  output: shouldExport ? "export" : undefined,
  basePath: shouldExport ? basePath : undefined,
  assetPrefix: shouldExport ? basePath : undefined,
  trailingSlash: shouldExport,
  images: shouldExport ? { unoptimized: true } : undefined,
};

export default nextConfig;
