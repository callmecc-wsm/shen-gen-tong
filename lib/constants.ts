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

// 步骤配置（用于客户端组件）
// 注意：这是一个简化版本，完整数据请从 markdown 文件动态读取
export const STEPS = [
  { id: 1, title: "确认签证受理领区", description: "确认您的户籍是否属于重庆领区", file: "01_领区确认.md", path: "/step/1" },
  { id: 2, title: "判断主目的地", description: "确保意大利是您停留时间最长的国家", file: "02_主目的地判断.md", path: "/step/2" },
  { id: 3, title: "时间规划与预约", description: "计算申请时间窗口并完成签证预约", file: "03_时间规划与预约.md", path: "/step/3" },
  { id: 4, title: "材料清单总览", description: "了解意大利签证所需的全部材料清单", file: "04_材料清单总览.md", path: "/step/4" },
  { id: 5, title: "行程与预订", description: "准备机票、酒店预订单及详细行程单", file: "05_行程与预订.md", path: "/step/5" },
  { id: 6, title: "财力与在职证明", description: "准备银行流水和在职证明等资金证明", file: "06_财力与在职证明.md", path: "/step/6" },
  { id: 7, title: "细节检查", description: "逐项检查材料完整性和准确性", file: "07_细节检查.md", path: "/step/7" },
  { id: 8, title: "递交流程", description: "了解线下递交材料的流程和注意事项", file: "08_递交流程.md", path: "/step/8" },
  { id: 9, title: "费用说明", description: "了解签证费、服务费等各项费用明细", file: "09_费用说明.md", path: "/step/9" },
  { id: 10, title: "审理与取证", description: "了解审理流程、查询方式和取证安排", file: "10_审理与取证.md", path: "/step/10" },
] as const;

// localStorage 键名
export const STORAGE_KEYS = {
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

