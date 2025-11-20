/**
 * 移动端菜单组件
 * 用途: 在移动端显示步骤导航抽屉
 * 业务逻辑: 点击按钮打开/关闭菜单,显示所有步骤
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Step } from "@/lib/markdown";

interface MobileMenuProps {
  currentStep?: number;
  steps: Step[];
}

export default function MobileMenu({ currentStep, steps }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const goToStep = (stepId: number) => {
    router.push(`/step/${stepId}`);
    setIsOpen(false);
  };

  const goToOverview = () => {
    router.push("/overview");
    setIsOpen(false);
  };

  return (
    <>
      {/* 打开菜单按钮 */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-20 right-4 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center z-40 hover:bg-blue-700 transition-all"
        aria-label="打开菜单"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* 遮罩层 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* 抽屉菜单 */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 lg:hidden transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "80vh" }}
      >
        {/* 菜单头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">步骤导航</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="关闭菜单"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 菜单内容 */}
        <div className="overflow-y-auto p-4" style={{ maxHeight: "calc(80vh - 80px)" }}>
          <nav className="space-y-2">
            {steps.map((step) => {
              const isCurrent = step.id === currentStep;

              return (
                <button
                  key={step.id}
                  onClick={() => goToStep(step.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                    isCurrent
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        isCurrent
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {step.id}
                    </span>
                    <span className="flex-1">{step.title}</span>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* 返回总览按钮 */}
          <button
            onClick={goToOverview}
            className="w-full mt-4 pt-4 border-t border-gray-200 text-blue-600 hover:text-blue-700 font-medium"
          >
            返回总览
          </button>
        </div>
      </div>
    </>
  );
}

