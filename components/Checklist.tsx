/**
 * 交互式 Checklist 组件
 * 用途: 渲染可勾选的任务清单
 * 业务逻辑: 用户点击勾选框时,状态保存到 localStorage,带有动画效果
 */

"use client";

import { useStore } from "@/lib/store";
import { ChecklistItem } from "@/lib/markdown";

interface ChecklistProps {
  stepId: string;
  items: ChecklistItem[];
}

export default function Checklist({ stepId, items }: ChecklistProps) {
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

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="card p-6 my-6">
      {/* Checklist 标题和进度 */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          📋 本步骤任务清单
        </h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {percentage}%
          </div>
          <div className="text-xs text-gray-500">
            {completedCount}/{totalCount}
          </div>
        </div>
      </div>

      {/* 进度条 */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
        <div
          className={`h-3 rounded-full transition-all duration-500 ${
            percentage === 100
              ? "bg-gradient-to-r from-green-500 to-green-600"
              : "bg-gradient-to-r from-blue-500 to-blue-600"
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {/* Checklist 项目列表 */}
      <div className="space-y-3">
        {items.map((item, index) => {
          const isChecked = stepChecklist[item.id] || false;

          return (
            <div
              key={item.id}
              className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-200 ${
                isChecked
                  ? "bg-green-50 border border-green-200"
                  : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* 自定义勾选框 */}
              <button
                onClick={() => handleToggle(item.id)}
                className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                  isChecked
                    ? "bg-green-500 border-green-500 checkbox-bounce"
                    : "bg-white border-gray-300 hover:border-blue-500"
                }`}
                aria-label={isChecked ? "取消勾选" : "勾选完成"}
              >
                {isChecked && (
                  <svg
                    className="w-4 h-4 text-white"
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
              <label
                className={`flex-1 cursor-pointer select-none transition-all duration-200 ${
                  isChecked
                    ? "text-gray-500 line-through"
                    : "text-gray-800"
                }`}
                onClick={() => handleToggle(item.id)}
              >
                {item.text}
              </label>
            </div>
          );
        })}
      </div>

      {/* 完成提示 */}
      {percentage === 100 && (
        <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg fade-in">
          <div className="flex items-center gap-2 text-green-800 font-semibold">
            <span>🎉</span>
            <span>太棒了!本步骤所有任务已完成!</span>
          </div>
          <p className="text-green-700 text-sm mt-1">
            您可以继续下一步,或者返回总览查看整体进度。
          </p>
        </div>
      )}
    </div>
  );
}

