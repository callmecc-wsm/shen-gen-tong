/**
 * 常量配置文件
 * 用途: 集中管理所有配置常量
 * 业务逻辑: 定义步骤、国家、路由等核心配置信息
 */

// 10个核心步骤配置
export const STEPS = [
  {
    id: 1,
    title: "确认签证受理领区",
    file: "01_领区确认.md",
    path: "/step/1",
    estimatedTime: "5-10分钟",
    importance: 5,
  },
  {
    id: 2,
    title: "判断主目的地",
    file: "02_主目的地判断.md",
    path: "/step/2",
    estimatedTime: "10-15分钟",
    importance: 5,
  },
  {
    id: 3,
    title: "时间规划与预约",
    file: "03_时间规划与预约.md",
    path: "/step/3",
    estimatedTime: "20-30分钟",
    importance: 5,
  },
  {
    id: 4,
    title: "材料清单总览",
    file: "04_材料清单总览.md",
    path: "/step/4",
    estimatedTime: "3-5天",
    importance: 5,
  },
  {
    id: 5,
    title: "行程与预订",
    file: "05_行程与预订.md",
    path: "/step/5",
    estimatedTime: "2-3小时",
    importance: 5,
  },
  {
    id: 6,
    title: "财力与在职证明",
    file: "06_财力与在职证明.md",
    path: "/step/6",
    estimatedTime: "1-2天",
    importance: 5,
  },
  {
    id: 7,
    title: "细节检查",
    file: "07_细节检查.md",
    path: "/step/7",
    estimatedTime: "1-2小时",
    importance: 4,
  },
  {
    id: 8,
    title: "递交流程",
    file: "08_递交流程.md",
    path: "/step/8",
    estimatedTime: "1-3小时",
    importance: 4,
  },
  {
    id: 9,
    title: "费用说明",
    file: "09_费用说明.md",
    path: "/step/9",
    estimatedTime: "5分钟",
    importance: 3,
  },
  {
    id: 10,
    title: "审理与取证",
    file: "10_审理与取证.md",
    path: "/step/10",
    estimatedTime: "7-15天",
    importance: 4,
  },
] as const;

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

