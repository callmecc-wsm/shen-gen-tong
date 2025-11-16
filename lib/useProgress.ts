/**
 * 用户进度管理 Hook
 * 用途: 封装 InstantDB 实时查询和更新逻辑
 * 业务逻辑: 通过 InstantDB 实时订阅用户进度，自动同步多设备
 */

"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@/lib/instantdb";
import type { ChecklistData } from "@/lib/instantdb";
import { getAuthToken } from "@/app/page";

interface ProgressData {
  currentStep: number;
  checklist: ChecklistData;
}

interface UseProgressReturn {
  progress: ProgressData | null;
  isLoading: boolean;
  error: string | null;
  updateProgress: (data: Partial<ProgressData>) => Promise<boolean>;
  refreshProgress: () => Promise<void>;
}

/**
 * 用户进度管理 Hook
 * @param code 激活码（可选，如果不提供则从 Token 中提取）
 */
export function useProgress(code?: string): UseProgressReturn {
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activationCode, setActivationCode] = useState<string | null>(null);

  // 从 Token 中提取激活码
  useEffect(() => {
    const extractCodeFromToken = async () => {
      if (code) {
        setActivationCode(code);
        return;
      }

      const token = getAuthToken();
      if (!token) {
        setError("未登录");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/verify", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setActivationCode(data.code);
        } else {
          setError("Token 无效");
          setIsLoading(false);
        }
      } catch (err) {
        console.error("验证 Token 失败:", err);
        setError("验证失败");
        setIsLoading(false);
      }
    };

    extractCodeFromToken();
  }, [code]);

  // 使用 InstantDB 实时查询（仅在有激活码时）
  const { data, isLoading: queryLoading, error: queryError } = useQuery(
    activationCode
      ? {
          userProgress: {
            $: {
              where: { code: activationCode },
            },
          },
        }
      : undefined
  );

  // 处理查询结果
  useEffect(() => {
    if (!activationCode) return;

    if (queryError) {
      console.error("查询进度失败:", queryError);
      setError("加载进度失败");
      setIsLoading(false);
      return;
    }

    if (!queryLoading && data) {
      const userProgressArray = data.userProgress as any[];
      
      if (userProgressArray && userProgressArray.length > 0) {
        const progress = userProgressArray[0];
        setProgressData({
          currentStep: progress.currentStep || 1,
          checklist: progress.checklist || {},
        });
      } else {
        // 没有进度数据，使用默认值
        setProgressData({
          currentStep: 1,
          checklist: {},
        });
      }
      
      setError(null);
      setIsLoading(false);
    }
  }, [data, queryLoading, queryError, activationCode]);

  // 更新进度（调用后端 API）
  const updateProgress = async (updateData: Partial<ProgressData>): Promise<boolean> => {
    const token = getAuthToken();
    if (!token) {
      console.error("未登录");
      return false;
    }

    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        // 更新本地状态
        setProgressData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            ...updateData,
          };
        });
        return true;
      } else {
        console.error("更新进度失败:", await response.json());
        return false;
      }
    } catch (err) {
      console.error("更新进度请求失败:", err);
      return false;
    }
  };

  // 手动刷新进度
  const refreshProgress = async (): Promise<void> => {
    const token = getAuthToken();
    if (!token) {
      console.error("未登录");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/progress", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProgressData({
          currentStep: data.currentStep,
          checklist: data.checklist,
        });
        setError(null);
      } else {
        setError("刷新进度失败");
      }
    } catch (err) {
      console.error("刷新进度失败:", err);
      setError("刷新进度失败");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    progress: progressData,
    isLoading,
    error,
    updateProgress,
    refreshProgress,
  };
}

/**
 * 简化版 Hook：仅用于 Checklist 同步
 */
export function useChecklistSync() {
  const { progress, updateProgress } = useProgress();

  const toggleItem = async (stepId: string, itemId: string): Promise<boolean> => {
    if (!progress) return false;

    const currentChecklist = progress.checklist || {};
    const stepChecklist = currentChecklist[stepId] || {};
    const newValue = !stepChecklist[itemId];

    const newChecklist = {
      ...currentChecklist,
      [stepId]: {
        ...stepChecklist,
        [itemId]: newValue,
      },
    };

    return await updateProgress({ checklist: newChecklist });
  };

  const isItemChecked = (stepId: string, itemId: string): boolean => {
    if (!progress) return false;
    return progress.checklist?.[stepId]?.[itemId] || false;
  };

  const getStepProgress = (stepId: string): { completed: number; total: number } => {
    if (!progress || !progress.checklist[stepId]) {
      return { completed: 0, total: 0 };
    }

    const items = Object.values(progress.checklist[stepId]);
    return {
      completed: items.filter(Boolean).length,
      total: items.length,
    };
  };

  return {
    checklist: progress?.checklist || {},
    toggleItem,
    isItemChecked,
    getStepProgress,
  };
}

