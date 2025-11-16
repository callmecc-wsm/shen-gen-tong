/**
 * InstantDB 配置文件
 * 用途: 初始化 InstantDB 客户端，提供类型定义和查询接口
 * 业务逻辑: 连接到 InstantDB 数据库，支持激活码验证和用户进度同步
 */

import { init } from "@instantdb/react";
import schema from "../instant.schema";

// Checklist 数据结构（业务逻辑类型）
export type ChecklistData = {
  [stepId: string]: {
    [itemId: string]: boolean;
  };
};

// 从 schema 导出类型
export type ActivationCode = {
  id: string;
  code: string;
  status: "unused" | "active";
  productType: "schengen" | "study_abroad" | "consulting";
  userId: string | null;
  activatedAt: number | null;
  expiresAt: number | null;
  createdAt: number;
};

export type UserProgress = {
  id: string;
  code: string;
  currentStep: number;
  checklist: ChecklistData;
  updatedAt: number;
};

// 初始化 InstantDB
const APP_ID = process.env.NEXT_PUBLIC_INSTANTDB_APP_ID!;

if (!APP_ID) {
  throw new Error("缺少 NEXT_PUBLIC_INSTANTDB_APP_ID 环境变量");
}

// 导出 InstantDB 实例（使用 schema）
export const db = init({
  appId: APP_ID,
  schema,
});

// 导出常用的查询和变更方法
export const { useQuery, transact, auth } = db;

