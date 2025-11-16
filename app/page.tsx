/**
 * 激活码验证页面(演示版)
 * 用途: 作为用户进入系统的第一个页面,验证激活码
 * 业务逻辑: 演示模式下,用户可以直接点击"开始演示"跳过验证
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export default function HomePage() {
  const router = useRouter();
  const { isActivated, setActivated, initializeFromStorage } = useStore();
  const [activationCode, setActivationCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // 初始化时从 localStorage 加载状态
  useEffect(() => {
    initializeFromStorage();
    setIsLoading(false);
  }, [initializeFromStorage]);

  // 如果已激活,自动跳转到国家选择页
  useEffect(() => {
    if (isActivated && !isLoading) {
      router.push("/countries");
    }
  }, [isActivated, isLoading, router]);

  // 处理激活码提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 演示模式:接受任意非空激活码
    if (activationCode.trim().length > 0) {
      setActivated(true);
      router.push("/countries");
    } else {
      setError("请输入激活码");
    }
  };

  // 演示模式:直接跳过验证
  const handleDemoMode = () => {
    setActivated(true);
    router.push("/countries");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4">
      <div className="max-w-md w-full">
        {/* Logo 和标题 */}
        <div className="text-center mb-8 fade-in">
          <div className="text-6xl mb-4">🇮🇹</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            申根签证准备助手
          </h1>
          <p className="text-gray-600">
            让签证准备变得简单、省心、高质量
          </p>
        </div>

        {/* 激活卡片 */}
        <div className="card p-8 fade-in">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            激活您的账号
          </h2>

          {/* 演示提示 */}
          <div className="alert-info mb-6">
            <div className="alert-info-title">
              💡 演示模式
            </div>
            <div className="alert-info-content text-sm">
              这是演示版本,您可以直接点击下方&ldquo;开始演示&rdquo;按钮体验完整功能
            </div>
          </div>

          {/* 激活码输入表单 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="activation-code"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                激活码
              </label>
              <input
                id="activation-code"
                type="text"
                value={activationCode}
                onChange={(e) => setActivationCode(e.target.value)}
                placeholder="请输入您的激活码"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {error && (
                <p className="text-red-600 text-sm mt-2">{error}</p>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-full">
              激活
            </button>
          </form>

          {/* 分隔线 */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">或</span>
            </div>
          </div>

          {/* 演示按钮 */}
          <button
            onClick={handleDemoMode}
            className="btn btn-success w-full"
          >
            开始演示 →
          </button>
        </div>

        {/* 底部信息 */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>覆盖国家: 意大利(重庆领区)</p>
          <p className="mt-1">适用领区: 重庆、四川、贵州、云南</p>
        </div>
      </div>
    </div>
  );
}

