/**
 * 导航按钮组件
 * 用途: 提供"上一步"、"下一步"、"返回总览"等导航功能
 * 业务逻辑: 根据当前步骤显示合适的导航选项
 */

"use client";

import { useRouter } from "next/navigation";

interface NavigationProps {
  currentStep: number;
  totalSteps: number;
}

export default function Navigation({ currentStep, totalSteps }: NavigationProps) {
  const router = useRouter();

  const goToPrevious = () => {
    if (currentStep > 1) {
      router.push(`/step/${currentStep - 1}`);
    }
  };

  const goToNext = () => {
    if (currentStep < totalSteps) {
      router.push(`/step/${currentStep + 1}`);
    }
  };

  const goToOverview = () => {
    router.push("/overview");
  };

  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-200 py-4 px-4 shadow-lg">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          {/* 上一步按钮 */}
          <button
            onClick={goToPrevious}
            disabled={currentStep === 1}
            className={`btn flex-1 sm:flex-initial ${
              currentStep === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "btn-secondary"
            }`}
          >
            ← 上一步
          </button>

          {/* 返回总览按钮 */}
          <button
            onClick={goToOverview}
            className="btn btn-secondary flex-1 sm:flex-initial"
          >
            返回总览
          </button>

          {/* 下一步按钮 */}
          <button
            onClick={goToNext}
            disabled={currentStep === totalSteps}
            className={`btn flex-1 sm:flex-initial ${
              currentStep === totalSteps
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "btn-primary"
            }`}
          >
            {currentStep === totalSteps ? "已完成" : "下一步 →"}
          </button>
        </div>
      </div>
    </div>
  );
}

