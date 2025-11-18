# 申根签证准备助手 - 架构概述

## 项目概述

申根签证准备助手是一个基于Next.js 14的全栈Web应用，专注于为用户提供交互式的申根签证准备指导。项目采用现代化的技术栈，结合实时数据库和JWT认证，为用户提供个性化的签证准备体验。

**核心架构特点：**
- 前后端一体化：Next.js App Router + API Routes
- 实时数据同步：InstantDB实时数据库
- 状态管理：Zustand + localStorage双模式
- 内容管理：Markdown文档驱动
- 响应式设计：移动优先的Tailwind CSS

## 技术栈

### 核心技术
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **数据库**: InstantDB (实时数据库)
- **认证**: JWT Token
- **状态管理**: Zustand + localStorage
- **内容渲染**: React Markdown + Gray Matter

### 开发工具
- **包管理**: npm
- **代码检查**: ESLint + Next.js配置
- **类型检查**: TypeScript
- **部署平台**: Vercel

## 项目结构

```
app/                    # Next.js App Router页面
├── api/               # 后端API路由
│   ├── activate/      # 激活码验证
│   ├── verify/        # Token验证
│   └── progress/      # 用户进度管理
├── step/[id]/         # 动态步骤页面
├── countries/         # 国家选择
├── overview/          # 步骤总览
└── ...

components/            # React组件
├── Checklist.tsx     # 交互式任务清单
├── ProgressBar.tsx   # 进度条
├── Navigation.tsx    # 导航组件
└── ...

lib/                  # 工具函数和配置
├── instantdb.ts      # 数据库客户端
├── jwt.ts           # JWT工具
├── markdown.ts      # Markdown处理
├── constants.ts     # 常量配置
└── ...

docs/                # Markdown内容文档
scripts/             # 管理脚本
```

## 核心功能模块

### 1. 用户认证系统
- **激活码验证**: 基于JWT的激活码验证机制
- **Token管理**: 本地存储 + 自动续期
- **权限控制**: 步骤访问权限验证

### 2. 进度管理系统
- **实时同步**: 用户进度实时保存到云端
- **本地缓存**: localStorage双重保障
- **状态恢复**: 页面刷新后自动恢复进度

### 3. 内容管理系统
- **Markdown驱动**: 所有步骤内容为Markdown格式
- **动态渲染**: 服务端读取，客户端渲染
- **Checklist集成**: 自动提取任务清单项

### 4. 响应式UI系统
- **移动优先**: 适配手机、平板、PC
- **组件化**: 可复用的React组件
- **动画效果**: 流畅的过渡和交互动画

## 开发命令

```bash
# 安装依赖
npm install

# 本地开发
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

## 环境配置

### 必需环境变量
```env
# InstantDB配置
NEXT_PUBLIC_INSTANTDB_APP_ID=your_app_id
INSTANTDB_ADMIN_TOKEN=your_admin_token

# JWT配置
JWT_SECRET=your_jwt_secret_key
```

### 配置说明
- **INSTANTDB_APP_ID**: InstantDB应用ID，前端可见
- **INSTANTDB_ADMIN_TOKEN**: 管理员Token，仅后端使用
- **JWT_SECRET**: JWT签名密钥，生产环境需使用强随机密钥

## 代码规范

### TypeScript规范
- 严格模式启用 (`strict: true`)
- 使用类型推断，避免显式any
- 接口定义清晰，避免过度嵌套

### 组件规范
- 优先使用服务端组件 (Server Components)
- 客户端组件明确标记 "use client"
- 组件职责单一，避免过度复杂

### 命名规范
- 文件命名: 小写字母 + 连字符 (kebab-case)
- 组件命名: PascalCase
- 函数命名: camelCase
- 常量命名: UPPER_SNAKE_CASE

## 安全考虑

### 数据安全
- JWT Token本地存储，不包含敏感信息
- 激活码验证后端处理，避免前端绕过
- 用户数据云端加密存储

### 环境安全
- 敏感环境变量绝不提交到Git
- Admin Token仅用于后端API调用
- 生产环境使用强随机JWT密钥

### 内容安全
- Markdown内容服务端渲染，避免XSS
- 用户输入验证和清理
- 静态资源安全策略

## 性能优化

### 构建优化
- Next.js静态生成 (SSG) 优化
- 代码分割和懒加载
- 图片优化和压缩

### 运行时优化
- 组件懒加载和代码分割
- 状态管理优化，避免不必要的重渲染
- localStorage读写优化

## 部署指南

### Vercel部署
1. 连接GitHub仓库
2. 配置环境变量
3. 自动构建和部署
4. 自定义域名配置

### 环境要求
- Node.js 18+
- 支持Next.js的运行环境
- InstantDB服务可用

## 故障排查

### 常见问题
1. **激活码验证失败**: 检查JWT密钥和激活码生成
2. **进度同步失败**: 检查InstantDB连接和Token
3. **Markdown渲染异常**: 检查文件路径和格式

### 调试工具
- 浏览器开发者工具
- InstantDB Dashboard
- Vercel部署日志

## 扩展开发

### 添加新步骤
1. 在`docs/`目录添加Markdown文件
2. 更新步骤配置常量
3. 系统自动生成对应页面

### 添加新国家
1. 更新`COUNTRIES`常量配置
2. 添加对应领区和领事馆信息
3. 更新国家选择页面

### 自定义样式
1. 修改`tailwind.config.ts`主题配置
2. 更新`app/globals.css`自定义样式
3. 保持响应式设计原则

---

**最后更新**: 2025年11月
**维护团队**: 申根签证助手开发团队