/**
 * 步骤内容客户端组件
 * 用途: 渲染步骤的详细内容,处理交互
 * 业务逻辑: 客户端组件,负责状态管理和用户交互
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
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
  markdownData: MarkdownDoc;
  allSteps: Step[];
}

export default function StepContent({
  stepId,
  stepInfo,
  markdownData,
  allSteps,
}: StepContentProps) {
  const router = useRouter();
  const { isActivated, initializeFromStorage, setCurrentStep, checklist } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isTodoOpen, setIsTodoOpen] = useState(false);

  // 检查激活状态并初始化 Checklist
  useEffect(() => {
    initializeFromStorage();
    setCurrentStep(stepId);

    // 如果这个步骤还没有 checklist 数据,初始化它
    const stepKey = `step${stepId}`;
    // 🔧 修复点1: 直接从 store 获取最新状态，避免将 checklist 放入依赖数组导致循环
    const currentChecklist = useStore.getState().checklist;
    
    if (!currentChecklist[stepKey] && markdownData.checklistItems.length > 0) {
      // 初始化所有 checklist 项为 false
      const initialChecklist: { [key: string]: boolean } = {};
      markdownData.checklistItems.forEach((item) => {
        initialChecklist[item.id] = false;
      });
      
      // 保存到 store
      useStore.setState((state) => ({
        checklist: {
          ...state.checklist,
          [stepKey]: initialChecklist,
        },
      }));
    }

    setIsLoading(false);
  }, [stepId, markdownData.checklistItems]); // 🔧 修复点2: 只监听真正需要的值，移除 checklist、initializeFromStorage、setCurrentStep

  useEffect(() => {
    if (!isActivated && !isLoading) {
      router.push("/");
    }
  }, [isActivated, isLoading, router]);

  // 计算 Todo 完成进度
  const stepKey = `step${stepId}`;
  const stepChecklist = checklist[stepKey] || {};
  const completedCount = markdownData.checklistItems.filter((item) => stepChecklist[item.id]).length;
  const totalCount = markdownData.checklistItems.length;

  if (isLoading || !isActivated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部进度条 */}
      <ProgressBar currentStep={stepId} totalSteps={allSteps.length} />

      {/* 主内容区 */}
      <div className="flex">
        {/* 侧边栏 (仅 PC 端显示) */}
        <Sidebar currentStep={stepId} steps={allSteps} />

        {/* 中心内容区 */}
        <div className="flex-1 lg:ml-72 pb-24">
          <div className="max-w-4xl mx-auto px-4 py-8">
            {/* 步骤标题卡片 */}
            <div className="card p-6 mb-6 fade-in">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                  {stepId}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {stepInfo.title}
                  </h1>
                </div>
                
                {/* Todo 按钮（右上角） */}
                {totalCount > 0 && (
                  <button
                    onClick={() => setIsTodoOpen(true)}
                    className="flex-shrink-0 btn btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                  >
                    <span className="hidden sm:inline">查看本步骤 Todo</span>
                    <span className="sm:hidden">Todo</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      completedCount === totalCount && totalCount > 0
                        ? "bg-green-500 text-white"
                        : "bg-white/30 text-white"
                    }`}>
                      {completedCount}/{totalCount}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Markdown 内容 */}
            <div className="card p-6 mb-6 fade-in">
              <MarkdownRenderer content={markdownData.content} />
            </div>

            {/* 底部提示 */}
            <div className="mt-6 fade-in">
              <div className="alert-info">
                <div className="alert-info-title">
                  💡 使用提示
                </div>
                <div className="alert-info-content text-sm">
                  完成本步骤后,请勾选上方的任务清单。您的进度会自动保存,可以随时返回查看或修改。
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部导航栏 */}
      <Navigation currentStep={stepId} totalSteps={allSteps.length} />

      {/* 移动端菜单 */}
      <MobileMenu currentStep={stepId} steps={allSteps} />

      {/* Todo 侧拉窗 */}
      <TodoSidebar
        stepId={`step${stepId}`}
        items={markdownData.checklistItems}
        isOpen={isTodoOpen}
        onClose={() => setIsTodoOpen(false)}
      />
    </div>
  );
}

