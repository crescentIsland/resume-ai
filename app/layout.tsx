import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 简历优化助手",
  description: "用 AI 帮你优化简历，推荐提升课程",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-50">{children}</body>
    </html>
  );
}
