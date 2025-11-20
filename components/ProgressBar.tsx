/**
 * 进度条组件
 * 用途: 显示当前在第几步(如 3/10)
 * 业务逻辑: 在步骤页面顶部显示进度条和步骤导航
 */

"use client";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className="bg-white border-b border-gray-200 py-4 px-4 sticky top-0 z-30 shadow-sm">
      <div className="max-w-5xl mx-auto">
        {/* 步骤指示 */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            步骤 {currentStep} / {totalSteps}
          </span>
          <span className="text-sm font-medium text-blue-600">
            {Math.round(percentage)}%
          </span>
        </div>

        {/* 进度条 */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        {/* 步骤点 */}
        <div className="flex justify-between mt-2">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <div
              key={step}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                step <= currentStep
                  ? "bg-blue-600 scale-125"
                  : "bg-gray-300"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

