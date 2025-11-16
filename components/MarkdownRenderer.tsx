/**
 * Markdown 渲染组件
 * 用途: 将 Markdown 内容渲染为美化的 HTML
 * 业务逻辑: 支持 GitHub Flavored Markdown,自定义样式
 */

"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 自定义标题渲染
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-blue-500">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-3 pb-2 border-b border-gray-200">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-semibold text-gray-700 mt-3 mb-2">
              {children}
            </h4>
          ),
          
          // 自定义段落渲染
          p: ({ children }) => (
            <p className="text-gray-700 leading-relaxed my-3">{children}</p>
          ),
          
          // 自定义列表渲染
          ul: ({ children }) => (
            <ul className="list-disc list-inside my-3 space-y-1 ml-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside my-3 space-y-1 ml-4">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-700 leading-relaxed">{children}</li>
          ),
          
          // 自定义表格渲染
          table: ({ children }) => (
            <div className="overflow-x-auto my-6">
              <table className="min-w-full border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-100">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-800">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-300 px-4 py-2 text-gray-700">
              {children}
            </td>
          ),
          
          // 自定义引用块渲染
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4 bg-blue-50 py-2">
              {children}
            </blockquote>
          ),
          
          // 自定义代码块渲染
          code: ({ inline, children, ...props }: any) => {
            if (inline) {
              return (
                <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-pink-600">
                  {children}
                </code>
              );
            }
            return (
              <code
                className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"
                {...props}
              >
                {children}
              </code>
            );
          },
          
          // 自定义链接渲染
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 underline font-medium"
            >
              {children}
            </a>
          ),
          
          // 自定义强调渲染
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-600">{children}</em>
          ),
          
          // 自定义水平线渲染
          hr: () => <hr className="my-8 border-t-2 border-gray-200" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

