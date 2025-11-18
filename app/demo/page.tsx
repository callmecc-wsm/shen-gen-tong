/**
 * 演示模式支持 - 临时解决方案
 * 用途: 在开发环境中提供快速访问，无需激活码
 * 使用方法: 访问 http://localhost:3000/demo 直接进入系统
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DemoPage() {
  const router = useRouter();

  useEffect(() => {
    // 设置演示模式的激活状态
    localStorage.setItem("visa_helper_activated", "true");
    localStorage.setItem("visa_helper_token", "demo_token_for_development");
    localStorage.setItem("visa_helper_current_step", "1");
    localStorage.setItem("visa_helper_checklist", "{}");
    
    // 跳转到国家选择页面
    router.push("/countries");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">正在进入演示模式...</p>
      </div>
    </div>
  );
}