/**
 * FAQ 常见问题页面
 * 用途: 展示常见问题和解答
 * 业务逻辑: 读取并渲染 FAQ Markdown 文档
 */

import { getMarkdownContent } from "@/lib/markdown";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import Link from "next/link";

export const metadata = {
  title: "常见问题 FAQ - 申根签证准备助手",
  description: "申根签证申请常见问题解答",
};

export default async function FAQPage() {
  const faqData = await getMarkdownContent("附录_常见问题FAQ.md");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8 fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ❓ 常见问题 FAQ
          </h1>
          <p className="text-lg text-gray-600">
            快速找到您关心的问题答案
          </p>
        </div>

        {/* 返回导航 */}
        <div className="mb-6 fade-in">
          <Link
            href="/overview"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            ← 返回总览
          </Link>
        </div>

        {/* FAQ 内容 */}
        {faqData ? (
          <div className="card p-6 fade-in">
            <MarkdownRenderer content={faqData.content} />
          </div>
        ) : (
          <div className="card p-6">
            <p className="text-gray-600 text-center">
              FAQ 文档加载中...
            </p>
          </div>
        )}

        {/* 底部联系提示 */}
        <div className="mt-8 fade-in">
          <div className="alert-info">
            <div className="alert-info-title">
              💡 没有找到您的问题?
            </div>
            <div className="alert-info-content text-sm">
              如果以上FAQ没有解决您的疑问,建议查阅官方网站或咨询签证中心客服。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

