/**
 * 用户进度 API
 * 用途: 获取和更新用户的 Checklist 进度
 * 业务逻辑: 
 *   GET: 根据 Token 获取用户进度
 *   POST: 更新用户进度到云端
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyToken, extractToken } from "@/lib/jwt";
import {
  findUserProgress,
  updateUserProgress,
  createInitialProgress,
} from "@/lib/instantdb-admin";
import type { ChecklistData } from "@/lib/instantdb";

/**
 * GET 获取用户进度
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = extractToken(authHeader);

    if (!token) {
      return NextResponse.json(
        { error: "未授权，请先登录" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "Token 无效" },
        { status: 401 }
      );
    }

    // 查询用户进度
    const progress = await findUserProgress(payload.code);

    if (!progress) {
      // 如果没有进度，创建初始进度
      await createInitialProgress(payload.code);
      
      return NextResponse.json({
        currentStep: 1,
        checklist: {},
        message: "已创建初始进度",
      });
    }

    return NextResponse.json({
      currentStep: progress.currentStep,
      checklist: progress.checklist,
      updatedAt: progress.updatedAt,
    });
  } catch (error) {
    console.error("获取进度失败:", error);
    return NextResponse.json(
      { error: "获取进度失败" },
      { status: 500 }
    );
  }
}

/**
 * POST 更新用户进度
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = extractToken(authHeader);

    if (!token) {
      return NextResponse.json(
        { error: "未授权，请先登录" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "Token 无效" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentStep, checklist } = body;

    // 验证数据
    if (currentStep !== undefined && (typeof currentStep !== "number" || currentStep < 1 || currentStep > 10)) {
      return NextResponse.json(
        { error: "无效的步骤编号" },
        { status: 400 }
      );
    }

    // 查询现有进度
    const progress = await findUserProgress(payload.code);

    if (!progress) {
      return NextResponse.json(
        { error: "未找到用户进度" },
        { status: 404 }
      );
    }

    // 更新进度
    const updateData: {
      currentStep?: number;
      checklist?: ChecklistData;
    } = {};

    if (currentStep !== undefined) {
      updateData.currentStep = currentStep;
    }

    if (checklist !== undefined) {
      updateData.checklist = checklist;
    }

    const success = await updateUserProgress(progress.id, updateData);

    if (!success) {
      return NextResponse.json(
        { error: "更新进度失败" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "进度已保存",
    });
  } catch (error) {
    console.error("更新进度失败:", error);
    return NextResponse.json(
      { error: "更新进度失败" },
      { status: 500 }
    );
  }
}

