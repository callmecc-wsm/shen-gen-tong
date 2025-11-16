/**
 * InstantDB Admin 工具函数
 * 用途: 提供服务端 InstantDB 操作接口（仅用于 API Routes）
 * 业务逻辑: 使用 Admin Token 进行数据库管理操作
 */

import { init, tx, id } from "@instantdb/admin";
import type { ActivationCode, UserProgress, ChecklistData } from "./instantdb";

// 延迟初始化，避免在模块加载时检查环境变量
let db: ReturnType<typeof init> | null = null;

function getDb() {
  if (db) return db;
  
  const APP_ID = process.env.NEXT_PUBLIC_INSTANTDB_APP_ID;
  const ADMIN_TOKEN = process.env.INSTANTDB_ADMIN_TOKEN;

  if (!APP_ID || !ADMIN_TOKEN) {
    throw new Error("缺少 InstantDB 配置环境变量");
  }

  // 初始化 Admin 客户端
  db = init({
    appId: APP_ID,
    adminToken: ADMIN_TOKEN,
  });
  
  return db;
}

/**
 * 查询激活码信息
 */
export async function findActivationCode(code: string): Promise<ActivationCode | null> {
  try {
    const result = await getDb().query({
      activationCodes: {
        $: {
          where: { code },
        },
      },
    });

    const codes = result.activationCodes as ActivationCode[];
    return codes.length > 0 ? codes[0] : null;
  } catch (error) {
    console.error("查询激活码失败:", error);
    return null;
  }
}

/**
 * 激活激活码（标记为已使用）
 */
export async function activateCode(codeId: string): Promise<boolean> {
  try {
    await getDb().transact([
      tx.activationCodes[codeId].update({
        status: "active",
        activatedAt: Date.now(),
      }),
    ]);
    return true;
  } catch (error) {
    console.error("激活码激活失败:", error);
    return false;
  }
}

/**
 * 创建初始用户进度
 */
export async function createInitialProgress(code: string): Promise<boolean> {
  try {
    const progressId = id();
    await getDb().transact([
      tx.userProgress[progressId].update({
        code,
        currentStep: 1,
        checklist: {},
        updatedAt: Date.now(),
      }),
    ]);
    return true;
  } catch (error) {
    console.error("创建用户进度失败:", error);
    return false;
  }
}

/**
 * 查询用户进度
 */
export async function findUserProgress(code: string): Promise<UserProgress | null> {
  try {
    const result = await getDb().query({
      userProgress: {
        $: {
          where: { code },
        },
      },
    });

    const progress = result.userProgress as UserProgress[];
    return progress.length > 0 ? progress[0] : null;
  } catch (error) {
    console.error("查询用户进度失败:", error);
    return null;
  }
}

/**
 * 更新用户进度
 */
export async function updateUserProgress(
  progressId: string,
  data: {
    currentStep?: number;
    checklist?: ChecklistData;
  }
): Promise<boolean> {
  try {
    await getDb().transact([
      tx.userProgress[progressId].update({
        ...data,
        updatedAt: Date.now(),
      }),
    ]);
    return true;
  } catch (error) {
    console.error("更新用户进度失败:", error);
    return false;
  }
}

/**
 * 批量插入激活码（用于生成脚本）
 */
export async function batchInsertCodes(codes: Array<{
  code: string;
  productType: "schengen" | "study_abroad" | "consulting";
  expiresAt?: number;
}>): Promise<boolean> {
  try {
    const transactions = codes.map((codeData) => {
      const codeId = id();
      return tx.activationCodes[codeId].update({
        ...codeData,
        status: "unused",
        userId: null,
        activatedAt: null,
        expiresAt: codeData.expiresAt || null,
        createdAt: Date.now(),
      });
    });

    await getDb().transact(transactions);
    return true;
  } catch (error) {
    console.error("批量插入激活码失败:", error);
    return false;
  }
}

export { getDb as adminDb };

