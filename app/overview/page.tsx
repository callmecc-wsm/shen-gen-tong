/**
 * 步骤总览页面
 * 用途: 显示所有10个步骤和整体完成进度
 * 业务逻辑: 从云端加载用户进度,支持多设备同步
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProgress } from "@/lib/useProgress";
import { STEPS } from "@/lib/constants";
import { getAuthToken } from "@/app/page";

export default function OverviewPage() {
  const router = useRouter();
  const { progress, isLoading, error } = useProgress();

  // 检查登录状态
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push("/");
    }
  }, [router]);

  // 计算总体进度
  const calculateTotalProgress = () => {
    if (!progress || !progress.checklist) {
      return { completed: 0, total: 0 };
    }

    let completed = 0;
    let total = 0;

    Object.values(progress.checklist).forEach((stepItems) => {
      const items = Object.values(stepItems);
      total += items.length;
      completed += items.filter(Boolean).length;
    });

    return { completed, total };
  };

  const totalProgress = calculateTotalProgress();
  const progressPercentage = totalProgress.total > 0
    ? Math.round((totalProgress.completed / totalProgress.total) * 100)
    : 0;

  // 计算单个步骤进度
  const getStepProgress = (stepId: string) => {
    if (!progress || !progress.checklist || !progress.checklist[stepId]) {
      return { completed: 0, total: 0 };
    }

    const items = Object.values(progress.checklist[stepId]);
    return {
      completed: items.filter(Boolean).length,
      total: items.length,
    };
  };

  // 跳转到指定步骤
  const goToStep = (stepId: number) => {
    router.push(`/step/${stepId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">加载进度中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4">
        <div className="card p-8 max-w-md">
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">加载失败</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => router.push("/")}
              className="btn btn-primary"
            >
              返回首页
            </button>
          </div>
        </div>
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
              <p>• 每个步骤都有详细的 Checklist,勾选后会自动同步到云端</p>
              <p>• 您可以随时返回任意步骤查看或修改</p>
              <p>• 所有数据实时同步,您可以在任何设备上使用同一个激活码查看进度</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

