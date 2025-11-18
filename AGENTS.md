# 申根签证助手 - 架构概述

## 1. 项目概述

申根签证助手是一个基于Next.js的交互式签证准备指导平台，专注于帮助用户高质量完成意大利申根签证申请流程。项目采用现代化的全栈架构，提供详细的步骤指导和交互式Checklist功能。

**核心架构特点：**
- Next.js 14 App Router架构
- TypeScript全栈开发
- 客户端状态管理与云端同步
- Markdown内容渲染
- 响应式设计支持多端访问

## 2. 技术栈

**前端框架：**
- Next.js 14 (App Router)
- React 18
- TypeScript 5.4+
- Tailwind CSS 3.4+

**状态管理：**
- Zustand (客户端状态)
- localStorage (本地持久化)

**内容渲染：**
- React Markdown
- Gray Matter (Markdown元数据解析)
- remark-gfm (GitHub风格Markdown)

**开发工具：**
- ESLint (代码检查)
- TypeScript (类型检查)
- PostCSS + Autoprefixer (CSS处理)

## 3. 项目结构

```
/
├── app/                    # Next.js App Router页面
│   ├── api/               # API路由
│   │   ├── activate/      # 激活码验证
│   │   ├── verify/        # Token验证
│   │   └── progress/      # 用户进度管理
│   ├── countries/         # 国家选择页面
│   ├── overview/          # 步骤总览页面
│   ├── step/[id]/         # 动态步骤页面
│   ├── faq/               # FAQ页面
│   └── templates/         # 模板页面
├── components/            # React组件
│   ├── Checklist.tsx      # 任务清单组件
│   ├── ProgressBar.tsx    # 进度条组件
│   └── Navigation.tsx     # 导航组件
├── lib/                   # 工具库
│   ├── store.ts          # 状态管理
│   ├── markdown.ts       # Markdown解析
│   └── constants.ts      # 常量配置
├── docs/                  # Markdown内容文档
└── public/               # 静态资源
```

## 4. 开发命令

```bash
# 安装依赖
npm install

# 本地开发
npm run dev        # 启动开发服务器 (http://localhost:3000)

# 构建和部署
npm run build      # 构建生产版本
npm start          # 启动生产服务器
npm run lint       # 运行ESLint检查
```

## 5. 代码规范

**TypeScript配置：**
- 启用严格模式 (`strict: true`)
- 使用ES2017目标
- 模块解析采用bundler模式
- 支持路径别名 (`@/*`)

**ESLint规则：**
- 继承Next.js核心规则 (`next/core-web-vitals`)
- 自动检查React和Next.js最佳实践

**Tailwind CSS配置：**
- 自定义primary颜色系统
- 支持响应式设计
- 内容路径包含pages、components、app目录

## 6. 核心功能模块

**激活验证模块：**
- 演示模式支持直接跳过验证
- 激活状态本地持久化存储

**步骤导航系统：**
- 10步详细签证申请流程
- 动态路由渲染不同步骤内容
- 服务端组件读取Markdown内容

**交互式Checklist：**
- 每个步骤的任务清单
- 点击勾选状态自动保存
- 实时进度统计和显示

**响应式布局：**
- 移动优先设计策略
- PC端侧边栏快速导航
- 移动端抽屉式菜单

## 7. 状态管理

**客户端状态 (Zustand)：**
- 用户激活状态
- 步骤完成进度
- UI状态管理

**本地存储：**
- 激活状态持久化
- Checklist完成状态
- 用户偏好设置

## 8. 内容管理

**Markdown文档：**
- 步骤说明文档存储在docs目录
- 支持YAML前置元数据
- GitHub风格Markdown扩展

**内容渲染：**
- 服务端组件负责内容获取
- 客户端组件处理交互逻辑
- 自适应样式和动画效果

## 9. 部署配置

**Next.js配置：**
- 启用React严格模式
- 标准Next.js配置
- 支持Vercel部署

**环境要求：**
- Node.js 18+
- npm包管理器
- 现代浏览器支持

## 10. 开发注意事项

**组件设计：**
- 服务端组件用于数据获取和静态内容
- 客户端组件用于交互和状态管理
- 合理使用"use client"指令

**性能优化：**
- 利用Next.js内置优化
- 合理使用缓存策略
- 避免不必要的客户端状态

**错误处理：**
- API路由需要适当的错误处理
- 客户端状态变更需要异常捕获
- 提供用户友好的错误提示

## 11. 扩展性考虑

**多国家支持：**
- 国家选择页面已预留扩展接口
- 内容文档可按国家分类组织
- 路由结构支持多国家扩展

**用户系统：**
- 激活码验证机制可扩展为用户登录
- 进度同步可接入后端服务
- 本地存储可迁移到云端同步