/**
 * 步骤内容客户端组件
 * 用途: 渲染步骤的详细内容,处理交互
 * 业务逻辑: 从云端加载进度，支持实时同步
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/lib/auth";
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

      {/* 主内容区 */}
      <div className="flex">
        {/* 侧边栏 (仅 PC 端显示) */}
        <Sidebar currentStep={stepId} steps={steps} />

        {/* 中心内容区 */}
        <div className="flex-1 lg:ml-72 pb-24">
          <ProgressBar currentStep={stepId} totalSteps={steps.length} />
          <div className="max-w-3xl mx-auto px-4 py-8 md:px-6 md:py-10">
            {/* 步骤标题卡片 */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 fade-in">
              <div className="flex items-center gap-5">
                <div className="flex items-center justify-center w-14 h-14 bg-blue-600 text-white text-2xl font-bold rounded-2xl shadow-blue-200 shadow-lg shrink-0">
                  {stepId}
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                    {stepInfo.title}
                  </h1>
                  <p className="text-gray-500 text-sm mt-1">预计耗时: 5-10 分钟</p>
                </div>
              </div>
              {/* 暂时隐藏：本步骤待办入口，待后续优化恢复
              <button
                onClick={() => setIsTodoOpen(true)}
                className="self-start md:self-center bg-orange-50 text-orange-700 px-4 py-2 rounded-lg text-sm font-medium border border-orange-100 flex items-center gap-2 shrink-0 hover:bg-orange-100 transition-colors cursor-pointer"
                aria-label="打开本步骤待办"
              >
                <span className="text-lg">📋</span>
                本步骤待办
              </button>
              */}
              
            </div>

            {/* Markdown 内容 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6 fade-in">
              {/* 卡片头部装饰线 */}
              <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600 w-full"></div>
              <div className="p-8 md:p-10">
                <MarkdownRenderer content={markdownData.content} />
              </div>
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

