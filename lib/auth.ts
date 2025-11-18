/**
 * 认证相关工具函数
 * 用途: 管理用户认证状态
 */

const TOKEN_KEY = "visa_helper_token";

/**
 * 获取认证Token
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * 清除认证Token
 */
export function clearAuthToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * 保存认证Token
 */
export function saveAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}