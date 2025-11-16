/**
 * 激活码验证页面
 * 用途: 作为用户进入系统的第一个页面,验证激活码
 * 业务逻辑: 用户输入激活码 → 调用后端API验证 → 存储Token → 跳转
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Token 存储键名
const TOKEN_KEY = "visa_helper_token";

export default function HomePage() {
  const router = useRouter();
  const [activationCode, setActivationCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 检查是否已登录
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      
      if (token) {
        // 验证 Token 是否有效
        try {
          const response = await fetch("/api/verify", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            // Token 有效,直接跳转
            router.push("/countries");
            return;
          } else {
            // Token 无效,清除
            localStorage.removeItem(TOKEN_KEY);
          }
        } catch (err) {
          console.error("验证失败:", err);
          localStorage.removeItem(TOKEN_KEY);
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  // 处理激活码提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedCode = activationCode.trim();

    if (!trimmedCode) {
      setError("请输入激活码");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/activate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: trimmedCode }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // 激活成功,保存 Token
        localStorage.setItem(TOKEN_KEY, data.token);
        
        // 跳转到国家选择页
        router.push("/countries");
      } else {
        // 激活失败,显示错误
        setError(data.error || "激活失败，请重试");
      }
    } catch (err) {
      console.error("激活请求失败:", err);
      setError("网络错误，请检查您的网络连接");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">正在验证...</p>
        </div>
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

          <p className="text-sm text-gray-600 mb-6">
            请输入您购买的激活码开始使用。激活码格式如：VISA-2025-XXXX
          </p>

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
                onChange={(e) => setActivationCode(e.target.value.toUpperCase())}
                placeholder="VISA-2025-XXXX"
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed font-mono"
                autoCapitalize="characters"
              />
              {error && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  验证中...
                </span>
              ) : (
                "激活"
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>提示：</strong>激活码一经使用，您可以在任何设备上使用同一个激活码登录，进度会自动同步。
            </p>
          </div>
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

// 导出 Token 管理工具函数（供其他页面使用）
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearAuthToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

