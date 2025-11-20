/**
 * 认证工具函数
 * 用途: 管理用户认证Token的获取和清除
 */

const TOKEN_KEY = "visa_helper_token";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearAuthToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}