/**
 * 步骤总览页面
 * 用途: 显示所有10个步骤和整体完成进度
 * 业务逻辑: 用户可以查看每个步骤的完成情况,并快速跳转到任意步骤
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { STEPS } from "@/lib/constants";

export default function OverviewPage() {
  const router = useRouter();
  const { isActivated, initializeFromStorage, getTotalProgress, getStepProgress } = useStore();

  // 检查激活状态
  useEffect(() => {
    initializeFromStorage();
  }, [initializeFromStorage]);

  useEffect(() => {
    if (!isActivated) {
      router.push("/");
    }
  }, [isActivated, router]);

  // 获取总体进度
  const totalProgress = getTotalProgress();
  const progressPercentage = totalProgress.total > 0
    ? Math.round((totalProgress.completed / totalProgress.total) * 100)
    : 0;

  // 跳转到指定步骤
  const goToStep = (stepId: number) => {
    router.push(`/step/${stepId}`);
  };

  if (!isActivated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8 fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🇮🇹 意大利签证准备指南
          </h1>
          <p className="text-lg text-gray-600">
            重庆领区 · 10步完整流程 · 详细指导
          </p>
        </div>

        {/* 总体进度卡片 */}
        <div className="card p-6 mb-8 fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              整体进度
            </h2>
            <span className="text-3xl font-bold text-blue-600">
              {progressPercentage}%
            </span>
          </div>
          
          {/* 进度条 */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          <p className="text-sm text-gray-600">
            已完成 {totalProgress.completed} / {totalProgress.total} 项任务
          </p>
        </div>

        {/* 步骤列表 */}
        <div className="space-y-4">
          {STEPS.map((step, index) => {
            const stepProgress = getStepProgress(`step${step.id}`);
            const stepPercentage = stepProgress.total > 0
              ? Math.round((stepProgress.completed / stepProgress.total) * 100)
              : 0;
            const isCompleted = stepProgress.total > 0 && stepPercentage === 100;

            return (
              <div
                key={step.id}
                className="card p-6 cursor-pointer hover:shadow-lg transition-all duration-200 fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => goToStep(step.id)}
              >
                <div className="flex items-start gap-4">
                  {/* 步骤编号 */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                    isCompleted
                      ? "bg-green-500 text-white"
                      : "bg-blue-100 text-blue-600"
                  }`}>
                    {isCompleted ? "✓" : step.id}
                  </div>

                  {/* 步骤信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          步骤 {step.id}: {step.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>⏱️ {step.estimatedTime}</span>
                          <span>
                            {"⭐".repeat(step.importance)}
                          </span>
                        </div>
                      </div>
                      
                      {/* 完成状态 */}
                      {stepProgress.total > 0 && (
                        <div className="text-right flex-shrink-0">
                          <div className="text-lg font-semibold text-blue-600">
                            {stepPercentage}%
                          </div>
                          <div className="text-xs text-gray-500">
                            {stepProgress.completed}/{stepProgress.total}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 步骤进度条 */}
                    {stepProgress.total > 0 && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            isCompleted
                              ? "bg-green-500"
                              : "bg-blue-500"
                          }`}
                          style={{ width: `${stepPercentage}%` }}
                        ></div>
                      </div>
                    )}
                  </div>

                  {/* 箭头图标 */}
                  <div className="flex-shrink-0 text-gray-400">
                    →
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 底部操作区 */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => goToStep(1)}
            className="btn btn-primary"
          >
            开始第一步 →
          </button>
          <button
            onClick={() => router.push("/countries")}
            className="btn btn-secondary"
          >
            ← 返回国家选择
          </button>
        </div>

        {/* 底部提示 */}
        <div className="mt-8">
          <div className="alert-info">
            <div className="alert-info-title">
              💡 使用提示
            </div>
            <div className="alert-info-content text-sm space-y-1">
              <p>• 建议按顺序完成每个步骤,确保不遗漏关键信息</p>
              <p>• 每个步骤都有详细的 Checklist,勾选后会自动保存进度</p>
              <p>• 您可以随时返回任意步骤查看或修改</p>
              <p>• 所有数据保存在本地浏览器,请勿清除浏览器数据</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

