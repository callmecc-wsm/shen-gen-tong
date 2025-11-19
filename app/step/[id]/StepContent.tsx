/**
 * 步骤内容客户端组件
 * 用途: 渲染步骤的详细内容,处理交互
 * 业务逻辑: 从云端加载进度，支持实时同步
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/app/page";
import { MarkdownDoc, Step } from "@/lib/markdown";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import TodoSidebar from "@/components/TodoSidebar";
import ProgressBar from "@/components/ProgressBar";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import MobileMenu from "@/components/MobileMenu";

interface StepContentProps {
  stepId: number;
  stepInfo: Step;
  steps: Step[];
  markdownData: MarkdownDoc;
}

export default function StepContent({
  stepId,
  stepInfo,
  steps,
  markdownData,
}: StepContentProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isTodoOpen, setIsTodoOpen] = useState(false);

  // 检查登录状态
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push("/");
      return;
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部进度条 */}
      <ProgressBar currentStep={stepId} totalSteps={steps.length} />

      {/* 主内容区 */}
      <div className="flex">
        {/* 侧边栏 (仅 PC 端显示) */}
        <Sidebar currentStep={stepId} steps={steps} />

        {/* 中心内容区 */}
        <div className="flex-1 lg:ml-72 pb-24">
          <div className="max-w-4xl mx-auto px-4 py-8">
            {/* 步骤标题卡片 */}
            <div className="card p-6 mb-6 fade-in">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                  {stepId}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {stepInfo.title}
                  </h1>
                </div>
                <div className="flex-shrink-0">
                  <button
                    onClick={() => setIsTodoOpen(true)}
                    className="btn btn-secondary"
                    aria-label="打开本步骤待办"
                  >
                    📋 本步骤待办
                  </button>
                </div>
              </div>
            </div>

            {/* Markdown 内容 */}
            <div className="card p-6 mb-6 fade-in">
              <MarkdownRenderer content={markdownData.content} />
            </div>

            {/* 待办侧拉窗入口已移到标题右上角 */}

            
          </div>
        </div>
      </div>

      {/* 底部导航栏 */}
      <Navigation currentStep={stepId} totalSteps={steps.length} />

      {/* 移动端菜单 */}
      <MobileMenu currentStep={stepId} steps={steps} />

      {/* 待办侧拉窗 */}
      <TodoSidebar
        stepId={`step${stepId}`}
        items={markdownData.checklistItems}
        isOpen={isTodoOpen}
        onClose={() => setIsTodoOpen(false)}
      />
    </div>
  );
}

