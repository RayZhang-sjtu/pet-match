import type { Metadata } from "next";
import "./globals.css";

const repository = process.env.GITHUB_REPOSITORY;
const githubPagesUrl = repository
  ? `https://${repository.split("/")[0]}.github.io/${repository.split("/")[1]}/`
  : "http://localhost:3000/";

export const metadata: Metadata = {
  metadataBase: new URL(githubPagesUrl),
  title: "Pet Match 宠物人格测试",
  description: "为每一个想养宠物的年轻人，快速找到更适合他们的宠物。",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Pet Match 宠物人格测试",
    description: "30 道生活场景，找到更适合你的宠物伙伴。",
    images: [
      {
        url: "/og.png",
        width: 1536,
        height: 1024,
        alt: "Pet Match 宠物人格测试",
      },
    ],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
