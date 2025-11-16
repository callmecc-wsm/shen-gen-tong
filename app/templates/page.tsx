/**
 * 模板下载页面
 * 用途: 展示可下载的模板文件
 * 业务逻辑: 列出所有可用模板(演示版显示占位符)
 */

"use client";

import Link from "next/link";

export default function TemplatesPage() {
  const templates = [
    {
      category: "表格类",
      items: [
        { name: "申根签证申请表", description: "空白申请表,需填写后打印", status: "coming_soon" },
        { name: "申请表填写示例", description: "参考示例,帮助正确填写", status: "coming_soon" },
      ],
    },
    {
      category: "证明类",
      items: [
        { name: "在职证明模板", description: "中英双语Word模板", status: "coming_soon" },
        { name: "解释信范文", description: "适用于特殊情况说明", status: "coming_soon" },
      ],
    },
    {
      category: "工具类",
      items: [
        { name: "行程单模板", description: "Excel格式,自动计算天数", status: "coming_soon" },
        { name: "材料清单", description: "完整的材料核对清单", status: "coming_soon" },
        { name: "费用计算器", description: "自动计算签证相关费用", status: "coming_soon" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8 fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📥 模板下载中心
          </h1>
          <p className="text-lg text-gray-600">
            各类签证申请材料模板
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

        {/* 演示提示 */}
        <div className="mb-6 fade-in">
          <div className="alert-warning">
            <div className="alert-warning-title">
              ⏳ 演示版提示
            </div>
            <div className="alert-warning-content text-sm">
              模板文件功能正在开发中,将在正式版中提供完整的下载功能。
            </div>
          </div>
        </div>

        {/* 模板分类列表 */}
        <div className="space-y-6">
          {templates.map((category, index) => (
            <div
              key={category.category}
              className="card p-6 fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                {category.category}
              </h2>
              <div className="space-y-3">
                {category.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      {item.status === "coming_soon" ? (
                        <span className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm">
                          即将上线
                        </span>
                      ) : (
                        <button className="btn btn-primary">
                          下载
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 底部说明 */}
        <div className="mt-8 fade-in">
          <div className="alert-info">
            <div className="alert-info-title">
              💡 关于模板使用
            </div>
            <div className="alert-info-content text-sm space-y-1">
              <p>• 所有模板仅供参考,请根据实际情况调整</p>
              <p>• 下载前请确认是否为最新版本</p>
              <p>• 部分模板需要根据个人情况填写</p>
              <p>• 建议结合步骤指南一起使用</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

