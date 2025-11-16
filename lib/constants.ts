/**
 * 常量配置文件
 * 用途: 集中管理所有配置常量
 * 业务逻辑: 定义步骤、国家、路由等核心配置信息
 * 
 * 注意：步骤配置现在从 markdown frontmatter 动态读取
 * 服务端组件请直接使用 getAllSteps() from '@/lib/markdown'
 * 客户端组件通过 props 接收步骤数据
 */

// 申根国家配置
export const COUNTRIES = [
  {
    id: "italy",
    name: "意大利",
    nameEn: "Italy",
    flag: "🇮🇹",
    status: "active",
    regions: ["重庆", "四川", "贵州", "云南"],
    consulate: "意大利驻重庆总领事馆",
  },
  {
    id: "france",
    name: "法国",
    nameEn: "France",
    flag: "🇫🇷",
    status: "coming_soon",
    regions: [],
    consulate: "",
  },
  {
    id: "germany",
    name: "德国",
    nameEn: "Germany",
    flag: "🇩🇪",
    status: "coming_soon",
    regions: [],
    consulate: "",
  },
  {
    id: "spain",
    name: "西班牙",
    nameEn: "Spain",
    flag: "🇪🇸",
    status: "coming_soon",
    regions: [],
    consulate: "",
  },
  {
    id: "netherlands",
    name: "荷兰",
    nameEn: "Netherlands",
    flag: "🇳🇱",
    status: "coming_soon",
    regions: [],
    consulate: "",
  },
  {
    id: "greece",
    name: "希腊",
    nameEn: "Greece",
    flag: "🇬🇷",
    status: "coming_soon",
    regions: [],
    consulate: "",
  },
] as const;

// localStorage 键名
export const STORAGE_KEYS = {
  ACTIVATED: "visa_helper_activated",
  CHECKLIST: "visa_helper_checklist",
  CURRENT_STEP: "visa_helper_current_step",
} as const;

// 路由路径
export const ROUTES = {
  HOME: "/",
  COUNTRIES: "/countries",
  OVERVIEW: "/overview",
  STEP: (id: number) => `/step/${id}`,
  FAQ: "/faq",
  TEMPLATES: "/templates",
} as const;

