import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    title: {
      default: "小狗的森林学堂 V4",
      template: "%s｜小狗的森林学堂",
    },
    description: "3至12岁孩子的八级智能学习平台，让系统自动出题、整理错题并安排复习。",
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title: "小狗的森林学堂 V4",
      description: "3–12岁 · 八级成长路线",
      type: "website",
      images: [{ url: `${origin}/og.png`, width: 1200, height: 630, alt: "小狗的森林学堂 V4" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "小狗的森林学堂 V4",
      description: "3–12岁 · 八级成长路线",
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
