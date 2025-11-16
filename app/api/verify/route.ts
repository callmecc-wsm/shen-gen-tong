/**
 * Token 验证 API
 * 用途: 验证用户的 JWT Token 是否有效
 * 业务逻辑: 用于检查用户登录状态
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyToken, extractToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = extractToken(authHeader);

    if (!token) {
      return NextResponse.json(
        { valid: false, error: "未提供 Token" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { valid: false, error: "Token 无效或已过期" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      valid: true,
      code: payload.code,
      productType: payload.productType,
    });
  } catch (error) {
    console.error("Token 验证失败:", error);
    return NextResponse.json(
      { valid: false, error: "验证失败" },
      { status: 500 }
    );
  }
}

