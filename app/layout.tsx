/**
 * 根布局文件
 * 用途: 定义全局 HTML 结构和元数据
 * 业务逻辑: 包裹所有页面组件,提供统一的页面框架
 */

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "申根通",
  description: "让签证准备变得简单、省心、高质量。专注于意大利申根签证申请的一站式引导平台。",
  keywords: "申根签证,意大利签证,旅游签证,签证申请,重庆领区",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}

