/**
 * JWT Token 工具函数
 * 用途: 生成和验证激活码 Token
 * 业务逻辑: 使用 JWT 保护用户身份（激活码），避免前端伪造
 */

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_change_me";

export interface TokenPayload {
  code: string; // 激活码
  productType: string; // 产品类型
  iat?: number; // 签发时间
  exp?: number; // 过期时间
}

/**
 * 生成 JWT Token
 */
export function generateToken(code: string, productType: string): string {
  const payload: TokenPayload = {
    code,
    productType,
  };

  // Token 有效期 365 天
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "365d",
  });
}

/**
 * 验证 JWT Token
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error("Token 验证失败:", error);
    return null;
  }
}

/**
 * 从请求头中提取 Token
 */
export function extractToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}

