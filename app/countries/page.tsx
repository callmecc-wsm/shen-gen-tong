/**
 * 国家选择页面
 * 用途: 展示所有申根国家,用户选择要申请签证的目标国家
 * 业务逻辑: 意大利完全开放可点击,其他国家置灰显示"即将上线"
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { COUNTRIES } from "@/lib/constants";
import { getAuthToken } from "@/app/page";

export default function CountriesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // 基于 Token 校验访问权限
  useEffect(() => {
    const verify = async () => {
      const token = getAuthToken();
      if (!token) {
        router.push("/");
        return;
      }
      try {
        const res = await fetch("/api/verify", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          setIsLoading(false);
        } else {
          router.push("/");
        }
      } catch (e) {
        router.push("/");
      }
    };
    verify();
  }, [router]);

  // 处理国家选择
  const handleCountrySelect = (countryId: string) => {
    if (countryId === "italy") {
      router.push("/overview");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-12 fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            选择您要申请的国家
          </h1>
          <p className="text-lg text-gray-600">
            目前支持意大利申根签证(重庆领区),更多国家即将上线
          </p>
        </div>

        {/* 国家卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COUNTRIES.map((country, index) => {
            const isActive = country.status === "active";
            
            return (
              <div
                key={country.id}
                className={`card p-6 fade-in transition-all duration-200 ${
                  isActive
                    ? "cursor-pointer hover:shadow-lg hover:scale-105"
                    : "opacity-50 cursor-not-allowed"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => isActive && handleCountrySelect(country.id)}
              >
                {/* 国家标志和名称 */}
                <div className="text-center mb-4">
                  <div
                    className={`text-6xl mb-3 ${
                      !isActive && "grayscale"
                    }`}
                  >
                    {country.flag}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {country.name}
                  </h3>
                  <p className="text-sm text-gray-500">{country.nameEn}</p>
                </div>

                {/* 状态标识 */}
                {isActive ? (
                  <div>
                    <div className="bg-green-50 text-green-700 text-sm font-medium px-3 py-2 rounded-lg text-center mb-3">
                      ✅ 已开放
                    </div>
                    {country.regions.length > 0 && (
                      <div className="text-xs text-gray-600 text-center">
                        适用领区: {country.regions.join("、")}
                      </div>
                    )}
                    <button className="btn btn-primary w-full mt-4">
                      开始准备 →
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="bg-gray-100 text-gray-500 text-sm font-medium px-3 py-2 rounded-lg text-center">
                      ⏳ 即将上线
                    </div>
                    <p className="text-xs text-gray-400 text-center mt-3">
                      该国家签证指南正在开发中
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 底部间距 */}
        <div className="mt-16"></div>
      </div>
    </div>
  );
}

