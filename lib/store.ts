/**
 * Zustand 状态管理
 * 用途: 全局状态管理(激活状态、Checklist、当前步骤等)
 * 业务逻辑: 提供统一的状态管理接口,与 localStorage 同步
 */

import { create } from "zustand";
import { STORAGE_KEYS } from "./constants";

// 定义 Checklist 数据结构
// 格式: { stepId: { itemId: boolean } }
export type ChecklistState = {
  [stepId: string]: {
    [itemId: string]: boolean;
  };
};

interface AppState {
  // 当前步骤
  currentStep: number;
  setCurrentStep: (step: number) => void;

  // Checklist 状态
  checklist: ChecklistState;
  toggleChecklistItem: (stepId: string, itemId: string) => void;
  getStepProgress: (stepId: string) => { completed: number; total: number };
  getTotalProgress: () => { completed: number; total: number };

  // 初始化(从 localStorage 加载)
  initializeFromStorage: () => void;

  // 清除所有数据
  clearAllData: () => void;
}

// 从 localStorage 读取数据
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === "undefined") return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// 保存到 localStorage
const saveToStorage = (key: string, value: any) => {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export const useStore = create<AppState>((set, get) => ({
  // 默认状态
  currentStep: 1,
  checklist: {},

  // 设置当前步骤
  setCurrentStep: (step: number) => {
    set({ currentStep: step });
    saveToStorage(STORAGE_KEYS.CURRENT_STEP, step);
  },

  // 切换 Checklist 项状态
  toggleChecklistItem: (stepId: string, itemId: string) => {
    const currentChecklist = get().checklist;
    const stepChecklist = currentChecklist[stepId] || {};
    const newValue = !stepChecklist[itemId];

    const newChecklist = {
      ...currentChecklist,
      [stepId]: {
        ...stepChecklist,
        [itemId]: newValue,
      },
    };

    set({ checklist: newChecklist });
    saveToStorage(STORAGE_KEYS.CHECKLIST, newChecklist);
  },

  // 获取单个步骤的进度
  getStepProgress: (stepId: string) => {
    const checklist = get().checklist;
    const stepChecklist = checklist[stepId] || {};
    const items = Object.values(stepChecklist);
    
    return {
      completed: items.filter(Boolean).length,
      total: items.length,
    };
  },

  // 获取总体进度
  getTotalProgress: () => {
    const checklist = get().checklist;
    let completed = 0;
    let total = 0;

    Object.values(checklist).forEach((stepItems) => {
      const items = Object.values(stepItems);
      total += items.length;
      completed += items.filter(Boolean).length;
    });

    return { completed, total };
  },

  // 从 localStorage 初始化状态
  initializeFromStorage: () => {
    const currentStep = loadFromStorage(STORAGE_KEYS.CURRENT_STEP, 1);
    const checklist = loadFromStorage(STORAGE_KEYS.CHECKLIST, {});

    set({ currentStep, checklist });
  },

  // 清除所有数据
  clearAllData: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_STEP);
      localStorage.removeItem(STORAGE_KEYS.CHECKLIST);
    }
    set({ currentStep: 1, checklist: {} });
  },
}));

