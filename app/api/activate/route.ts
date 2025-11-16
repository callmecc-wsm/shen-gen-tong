/**
 * 激活码验证 API
 * 用途: 验证用户输入的激活码，生成 JWT Token
 * 业务逻辑: 
 *   1. 检查激活码是否存在、是否已使用、是否过期
 *   2. 标记激活码为已使用
 *   3. 创建初始用户进度
 *   4. 返回 JWT Token
 */

import { NextRequest, NextResponse } from "next/server";
import {
  findActivationCode,
  activateCode,
  createInitialProgress,
  findUserProgress,
} from "@/lib/instantdb-admin";
import { generateToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    // 验证输入
    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "请输入有效的激活码" },
        { status: 400 }
      );
    }

    // 规范化激活码（转大写，去除空格）
    const normalizedCode = code.trim().toUpperCase();

    // 查询激活码
    const activationCode = await findActivationCode(normalizedCode);

    if (!activationCode) {
      return NextResponse.json(
        { error: "激活码无效，请检查后重试" },
        { status: 404 }
      );
    }

    // 检查是否已激活
    if (activationCode.status === "active") {
      // 如果已激活，检查是否有进度数据
      const existingProgress = await findUserProgress(normalizedCode);
      
      if (existingProgress) {
        // 已激活且有进度，允许重新登录
        const token = generateToken(normalizedCode, activationCode.productType);
        
        return NextResponse.json({
          success: true,
          token,
          message: "欢迎回来！已加载您的进度",
          progress: {
            currentStep: existingProgress.currentStep,
            checklist: existingProgress.checklist,
          },
        });
      }
    }

    // 检查是否过期
    if (activationCode.expiresAt && activationCode.expiresAt < Date.now()) {
      return NextResponse.json(
        { error: "激活码已过期，请联系客服" },
        { status: 403 }
      );
    }

    // 首次激活：标记为已使用
    if (activationCode.status === "unused") {
      const activated = await activateCode(activationCode.id);
      if (!activated) {
        return NextResponse.json(
          { error: "激活失败，请稍后重试" },
          { status: 500 }
        );
      }

      // 创建初始进度
      const progressCreated = await createInitialProgress(normalizedCode);
      if (!progressCreated) {
        console.error("创建进度失败，但激活码已标记为已使用");
      }
    }

    // 生成 JWT Token
    const token = generateToken(normalizedCode, activationCode.productType);

    return NextResponse.json({
      success: true,
      token,
      message: "激活成功！开始您的申根签证准备之旅",
      productType: activationCode.productType,
    });
  } catch (error) {
    console.error("激活码验证失败:", error);
    return NextResponse.json(
      { error: "服务器错误，请稍后重试" },
      { status: 500 }
    );
  }
}

