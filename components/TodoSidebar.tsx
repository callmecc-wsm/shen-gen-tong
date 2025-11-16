/**
 * Todo 侧拉窗组件
 * 用途: 从右侧滑出展示待办事项列表
 * 业务逻辑: 显示当前步骤的所有 checklist 项，支持勾选/取消勾选
 */

"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { ChecklistItem } from "@/lib/markdown";

interface TodoSidebarProps {
  stepId: string;
  items: ChecklistItem[];
  isOpen: boolean;
  onClose: () => void;
}

export default function TodoSidebar({
  stepId,
  items,
  isOpen,
  onClose,
}: TodoSidebarProps) {
  const { checklist, toggleChecklistItem } = useStore();

  // 获取当前步骤的 checklist 状态
  const stepChecklist = checklist[stepId] || {};

  // 处理勾选框点击
  const handleToggle = (itemId: string) => {
    toggleChecklistItem(stepId, itemId);
  };

  // 计算完成进度
  const completedCount = items.filter((item) => stepChecklist[item.id]).length;
  const totalCount = items.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // ESC 键关闭
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // 侧拉窗打开时锁定背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      {/* 遮罩层 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-300"
          onClick={onClose}
          aria-label="关闭待办事项"
        />
      )}

      {/* 侧拉窗 */}
      <div
        className={`fixed right-0 top-0 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          w-[85vw] max-w-[400px] sm:w-[400px]
        `}
      >
        {/* 顶部标题栏 */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              📋 本步骤待办
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="关闭"
            >
              <svg
                className="w-5 h-5"
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

          {/* 进度显示 */}
          <div className="flex items-center justify-between text-white/90 text-sm mb-2">
            <span>完成进度</span>
            <span className="font-bold text-lg">{percentage}%</span>
          </div>

          {/* 进度条 */}
          <div className="w-full bg-white/30 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                percentage === 100
                  ? "bg-green-400"
                  : "bg-white"
              }`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          <div className="text-xs text-white/80 mt-1">
            {completedCount} / {totalCount} 项已完成
          </div>
        </div>

        {/* 任务列表（可滚动） */}
        <div className="overflow-y-auto h-[calc(100%-200px)] px-4 py-4">
          <div className="space-y-2">
            {items.map((item, index) => {
              const isChecked = stepChecklist[item.id] || false;

              return (
                <div
                  key={item.id}
                  className={`flex items-start gap-3 p-4 rounded-lg transition-all duration-200 cursor-pointer
                    ${
                      isChecked
                        ? "bg-green-50 border-2 border-green-200"
                        : "bg-gray-50 border-2 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                    }
                  `}
                  style={{ animationDelay: `${index * 0.03}s` }}
                  onClick={() => handleToggle(item.id)}
                >
                  {/* 自定义勾选框 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle(item.id);
                    }}
                    className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200
                      ${
                        isChecked
                          ? "bg-green-500 border-green-500"
                          : "bg-white border-gray-300 hover:border-blue-500"
                      }
                    `}
                    aria-label={isChecked ? "取消勾选" : "勾选完成"}
                  >
                    {isChecked && (
                      <svg
                        className="w-4 h-4 text-white animate-[scale-in_0.2s_ease-out]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>

                  {/* 任务文本 */}
                  <span
                    className={`flex-1 text-sm select-none transition-all duration-200
                      ${
                        isChecked
                          ? "text-gray-500 line-through"
                          : "text-gray-800"
                      }
                    `}
                  >
                    {item.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 完成提示（底部固定） */}
        {percentage === 100 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-r from-green-500 to-green-600 text-white">
            <div className="flex items-center gap-2 font-semibold text-center justify-center">
              <span className="text-xl">🎉</span>
              <span>太棒了！本步骤所有任务已完成！</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

