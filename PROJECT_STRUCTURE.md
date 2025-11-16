# 项目文件结构说明

本文档说明申根签证助手全栈应用的文件组织结构。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **后端**: Next.js API Routes + InstantDB
- **数据库**: InstantDB (实时数据库)
- **认证**: JWT Token
- **Markdown**: React Markdown + Gray Matter
- **部署**: Vercel

---

## 📁 目录结构

```
/
├── app/                        # Next.js App Router 页面
│   ├── layout.tsx              # 根布局,定义全局 HTML 结构
│   ├── page.tsx                # 首页:激活码验证页面(已连接真实API)
│   ├── globals.css             # 全局样式和自定义 CSS
│   │
│   ├── api/                    # ⭐ 后端 API 路由
│   │   ├── activate/           # 激活码验证 API
│   │   │   └── route.ts        # POST: 验证激活码,生成JWT Token
│   │   ├── verify/             # Token验证 API
│   │   │   └── route.ts        # POST: 验证JWT Token是否有效
│   │   └── progress/           # 用户进度 API
│   │       └── route.ts        # GET: 获取进度 | POST: 更新进度
│   │
│   ├── countries/              # 国家选择页面
│   │   └── page.tsx            # 显示申根国家卡片
│   │
│   ├── overview/               # 步骤总览页面
│   │   └── page.tsx            # 显示10步进度(从云端加载)
│   │
│   ├── step/[id]/              # 动态步骤页面
│   │   ├── page.tsx            # 服务端组件,读取 Markdown
│   │   └── StepContent.tsx     # 客户端组件,处理交互(云端同步)
│   │
│   ├── faq/                    # 常见问题页面
│   │   └── page.tsx            # 展示 FAQ 内容
│   │
│   └── templates/              # 模板下载页面
│       └── page.tsx            # 模板列表
│
├── components/                 # 可复用 React 组件
│   ├── Checklist.tsx           # ⭐ 交互式任务清单(实时同步到云端)
│   ├── ProgressBar.tsx         # 顶部进度条
│   ├── Navigation.tsx          # 底部导航按钮(上一步/下一步)
│   ├── Sidebar.tsx             # PC端侧边栏目录
│   ├── MobileMenu.tsx          # 移动端抽屉式菜单
│   └── MarkdownRenderer.tsx    # Markdown 内容渲染器
│
├── lib/                        # 工具函数和配置
│   ├── instantdb.ts            # ⭐ InstantDB 客户端配置
│   ├── instantdb-admin.ts      # ⭐ InstantDB Admin 工具(后端使用)
│   ├── useProgress.ts          # ⭐ 用户进度管理 Hook
│   ├── jwt.ts                  # ⭐ JWT Token 工具函数
│   ├── store.ts                # Zustand 状态管理(已弃用,保留兼容)
│   ├── markdown.ts             # Markdown 文档读取和解析
│   └── constants.ts            # 常量配置(步骤、国家等)
│
├── scripts/                    # ⭐ 管理脚本
│   └── generate-codes.ts       # 激活码批量生成脚本
│
├── docs/                       # Markdown 内容文档
│   ├── PRD_主文档.md           # 产品需求文档
│   ├── 01_领区确认.md          # 步骤1内容
│   ├── 02_主目的地判断.md      # 步骤2内容
│   ├── ... (03-10)             # 其他步骤文档
│   ├── 附录_常见问题FAQ.md     # FAQ内容
│   ├── 附录_材料模板说明.md    # 模板说明
│   └── 项目文件结构说明.md     # 文件结构详解
│
├── public/                     # 静态资源
│
├── .env.local                  # ⭐ 环境变量配置(不提交到Git)
├── ENV_SETUP.md                # ⭐ 环境变量配置说明
├── DEPLOYMENT_GUIDE.md         # ⭐ 部署完整指南
├── package.json                # 项目依赖和脚本
├── tsconfig.json               # TypeScript 配置
├── tailwind.config.ts          # Tailwind CSS 配置
├── next.config.js              # Next.js 配置
├── README.md                   # 项目说明
├── CHANGELOG.md                # 更新日志
├── PROJECT_STRUCTURE.md        # 本文档
├── 使用说明.md                  # 使用指南
└── 项目交付总结.md              # 项目交付总结

⭐ = 全栈升级新增文件

```

---

## 📄 核心文件说明

### 页面组件 (app/)

#### `app/page.tsx` - 激活码验证页面 ⭐已升级
- **用途**: 系统入口,验证用户激活码
- **业务逻辑**: 调用后端 API 验证激活码,生成 JWT Token
- **状态管理**: Token 存储到 localStorage,支持自动登录
- **特性**: 已移除演示模式,连接真实 API

#### `app/api/` - 后端 API 路由 ⭐新增
- **用途**: 提供后端服务接口
- **技术**: Next.js API Routes + InstantDB Admin SDK
- **接口列表**:
  - `POST /api/activate`: 激活码验证
  - `POST /api/verify`: Token 验证
  - `GET /api/progress`: 获取用户进度
  - `POST /api/progress`: 更新用户进度

#### `app/countries/page.tsx` - 国家选择页面
- **用途**: 展示申根国家列表
- **业务逻辑**: 意大利为彩色可点击,其他国家置灰显示"即将上线"
- **跳转**: 选择意大利后进入步骤总览页

#### `app/overview/page.tsx` - 步骤总览页面
- **用途**: 显示10个步骤的完成进度
- **业务逻辑**: 
  - 计算每个步骤的完成百分比
  - 显示总体进度条
  - 快速跳转到任意步骤

#### `app/step/[id]/page.tsx` - 动态步骤页面(服务端)
- **用途**: 服务端组件,负责读取 Markdown 文档
- **业务逻辑**:
  - 根据 URL 参数读取对应步骤的 Markdown 文件
  - 解析文档内容和 Checklist 项
  - 传递数据给客户端组件

#### `app/step/[id]/StepContent.tsx` - 步骤内容(客户端)
- **用途**: 客户端组件,处理用户交互
- **业务逻辑**:
  - 渲染 Markdown 内容
  - 管理 Checklist 状态
  - 显示导航和进度条

### 可复用组件 (components/)

#### `Checklist.tsx` - 交互式任务清单
- **功能**: 
  - 显示本步骤的所有任务项
  - 用户点击勾选/取消勾选
  - 自动计算完成进度
  - 状态保存到 localStorage
- **动画**: 勾选时有弹跳动画效果

#### `ProgressBar.tsx` - 进度条
- **功能**:
  - 显示当前步骤(如 3/10)
  - 显示进度百分比
  - 显示进度点(已完成/未完成)

#### `Navigation.tsx` - 底部导航
- **功能**:
  - "上一步"按钮(第1步时禁用)
  - "返回总览"按钮
  - "下一步"按钮(第10步时禁用)

#### `Sidebar.tsx` - 侧边栏目录
- **功能**: 仅在 PC 端显示(lg:block)
- **交互**: 点击任意步骤快速跳转

#### `MobileMenu.tsx` - 移动端菜单
- **功能**: 仅在移动端显示
- **交互**: 点击按钮打开抽屉式菜单

#### `MarkdownRenderer.tsx` - Markdown 渲染器
- **功能**:
  - 使用 react-markdown 渲染内容
  - 支持 GitHub Flavored Markdown
  - 自定义样式(标题、表格、列表等)

### 工具函数 (lib/)

#### `store.ts` - Zustand 状态管理
- **状态**:
  - `isActivated`: 激活状态
  - `currentStep`: 当前步骤
  - `checklist`: Checklist 完成状态
- **方法**:
  - `toggleChecklistItem()`: 切换 Checklist 项
  - `getStepProgress()`: 获取步骤进度
  - `getTotalProgress()`: 获取总体进度
  - `clearAllData()`: 清除所有数据

#### `markdown.ts` - Markdown 工具
- **功能**:
  - `getMarkdownContent()`: 读取并解析 Markdown 文档
  - `extractChecklistItems()`: 提取 Checklist 项
  - `getAllStepFiles()`: 获取所有步骤文件列表

#### `constants.ts` - 常量配置
- **配置**:
  - `STEPS`: 10个步骤的元数据(标题、文件名、路径等)
  - `COUNTRIES`: 申根国家列表
  - `STORAGE_KEYS`: localStorage 键名
  - `ROUTES`: 路由路径常量

---

## 🎨 样式系统

### Tailwind CSS 配置

项目使用 Tailwind CSS 进行样式管理,主要配置在:
- `tailwind.config.ts`: 自定义主题配置
- `app/globals.css`: 全局样式和组件类

### 自定义 CSS 类

#### 按钮样式
- `.btn`: 基础按钮样式
- `.btn-primary`: 主要按钮(蓝色)
- `.btn-secondary`: 次要按钮(灰色)
- `.btn-success`: 成功按钮(绿色)

#### 卡片样式
- `.card`: 白色卡片,带阴影和圆角

#### 提示框样式(对应4种信息层级)
- `.alert-error`: 🔴 严重错误(红色背景)
- `.alert-warning`: ⚠️ 重要提示(黄色边框)
- `.alert-info`: 💡 贴心建议(蓝色背景)
- `.alert-success`: 💚 情绪缓解(绿色文字)

#### Markdown 内容样式
- `.markdown-content`: 应用于 Markdown 渲染容器
- 包含标题、段落、列表、表格等自定义样式

#### 动画
- `.fade-in`: 淡入动画
- `.spinner`: 加载动画
- `.checkbox-bounce`: 复选框弹跳动画

---

## 📊 数据流

### 激活流程
1. 用户访问首页 → `app/page.tsx`
2. 输入激活码或点击"开始演示"
3. 激活状态存储到 localStorage
4. 跳转到国家选择页

### 步骤浏览流程
1. 国家选择 → 步骤总览 → 具体步骤
2. 每个步骤页面:
   - 服务端读取 Markdown
   - 客户端渲染内容
   - 用户勾选 Checklist
   - 状态保存到 localStorage

### 状态持久化
- 使用 localStorage 存储:
  - 激活状态
  - 当前步骤
  - Checklist 完成状态
- 页面刷新后自动恢复状态

---

## 🔧 开发指南

### 添加新步骤
1. 在 `docs/` 目录添加 Markdown 文件(如 `11_新步骤.md`)
2. 更新 `lib/constants.ts` 中的 `STEPS` 数组
3. 系统会自动生成对应页面

### 修改步骤内容
1. 直接编辑 `docs/` 目录下的 Markdown 文件
2. 无需修改代码,重启服务即可生效

### 自定义样式
1. 修改 `app/globals.css` 添加全局样式
2. 修改 `tailwind.config.ts` 自定义主题

---

## 📱 响应式设计

### 断点设置
- **手机**: < 768px
- **平板**: 768px - 1024px
- **PC**: > 1024px

### 移动端优化
- 侧边栏改为抽屉式菜单
- 字体大小适配
- 按钮和点击区域加大
- 表格改为卡片式布局

---

## 🚀 性能优化

- 使用 Next.js 静态生成(SSG)
- Markdown 文档服务端渲染
- 图片懒加载
- CSS 按需加载

---

**最后更新**: 2025年11月
**维护者**: Claude + PM

