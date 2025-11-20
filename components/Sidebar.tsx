/**
 * 侧边栏目录组件
 * 用途: 在 PC 端显示步骤目录,快速跳转
 * 业务逻辑: 仅在大屏设备显示,移动端隐藏
 */

"use client";

import { useRouter } from "next/navigation";
import { Step } from "@/lib/markdown";

interface SidebarProps {
  currentStep: number;
  steps: Step[];
}

export default function Sidebar({ currentStep, steps }: SidebarProps) {
  const router = useRouter();

  const goToStep = (stepId: number) => {
    router.push(`/step/${stepId}`);
  };

  return (
    <div className="hidden lg:block fixed left-4 top-24 w-64 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="card p-4">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">
          步骤导航
        </h3>
        <nav className="space-y-1">
          {steps.map((step) => {
            const isCurrent = step.id === currentStep;

            return (
              <button
                key={step.id}
                onClick={() => goToStep(step.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                  isCurrent
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    isCurrent
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}>
                    {step.id}
                  </span>
                  <span className="flex-1 line-clamp-2">
                    {step.title}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* 返回总览链接 */}
        <button
          onClick={() => router.push("/overview")}
          className="w-full mt-4 pt-4 border-t border-gray-200 text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          返回总览
        </button>
      </div>
    </div>
  );
}

