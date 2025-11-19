# 申根签证助手 - 架构概览

## 1. 项目概述

申根签证助手是一个基于Next.js 14的全栈应用，专注于为用户提供意大利申根签证的完整申请指导。项目采用现代化的技术栈，支持激活码验证、多设备同步和实时数据更新。

**核心架构特点：**
- 前后端一体化（Next.js App Router）
- 实时数据库（InstantDB）
- JWT身份认证
- Markdown内容管理
- 响应式设计（移动优先）

## 2. 技术栈

### 前端技术
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript 5.4+
- **样式**: Tailwind CSS 3.4+
- **状态管理**: Zustand（逐步淘汰）+ InstantDB实时同步
- **Markdown渲染**: React Markdown + Gray Matter

### 后端技术
- **API**: Next.js API Routes
- **数据库**: InstantDB（实时数据库）
- **认证**: JWT Token（365天有效期）
- **权限控制**: InstantDB规则引擎

### 开发工具
- **包管理**: npm
- **代码检查**: ESLint + Next.js配置
- **部署**: Vercel（推荐）

## 3. 项目结构

```
app/                    # Next.js App Router页面
├── api/               # 后端API路由
│   ├── activate/      # 激活码验证
│   ├── verify/        # Token验证
│   └── progress/      # 用户进度管理
├── countries/         # 国家选择
├── overview/          # 步骤总览
├── step/[id]/         # 动态步骤页面
│   ├── page.tsx       # 服务端组件（读取Markdown）
│   └── StepContent.tsx # 客户端组件（交互逻辑）
└── layout.tsx         # 根布局

components/             # React组件
├── Checklist.tsx      # 交互式任务清单（云端同步）
├── ProgressBar.tsx    # 进度条
├── Navigation.tsx     # 底部导航
├── Sidebar.tsx        # PC端侧边栏
├── MobileMenu.tsx     # 移动端菜单
└── MarkdownRenderer.tsx # Markdown渲染器

lib/                  # 工具函数
├── instantdb.ts       # InstantDB客户端配置
├── instantdb-admin.ts # Admin工具（服务端专用）
├── useProgress.ts     # 进度管理Hook
├── jwt.ts            # JWT工具函数
├── markdown.ts       # Markdown解析工具
└── constants.ts      # 常量配置

docs/                 # Markdown内容文件
├── 01_领区确认.md    # 步骤1-10的内容文档
├── 附录_*.md         # FAQ和模板说明
└── PRD_*.md          # 产品需求文档

scripts/              # 管理脚本
└── generate-codes.ts # 激活码生成工具
```

## 4. 核心功能架构

### 4.1 激活码验证系统
**流程**: 用户输入 → 后端API验证 → JWT Token生成 → 本地存储

**关键文件**:
- `app/api/activate/route.ts` - 激活码验证API
- `lib/jwt.ts` - JWT生成和验证
- `app/page.tsx` - 激活码输入页面

**安全机制**:
- 激活码验证必须在服务端完成
- 前端无法直接访问激活码数据库表
- JWT Token包含激活码信息，防止伪造

### 4.2 进度同步系统
**数据流**: 用户操作 → 乐观更新 → API请求 → 云端更新 → 实时推送

**关键文件**:
- `lib/useProgress.ts` - 进度管理Hook
- `app/api/progress/route.ts` - 进度API
- `components/Checklist.tsx` - 任务清单组件

**特性**:
- 多设备实时同步（WebSocket）
- 乐观更新提升用户体验
- 错误回滚机制
- 防抖处理（500ms延迟）

### 4.3 内容管理系统
**架构**: Markdown文件 → 服务端解析 → 前端渲染 → 交互组件

**关键文件**:
- `lib/markdown.ts` - Markdown解析工具
- `app/step/[id]/page.tsx` - 服务端组件
- `components/MarkdownRenderer.tsx` - 渲染器

**内容组织**:
- 内容和代码完全分离
- 支持GitHub Flavored Markdown
- Front Matter定义Checklist项
- 动态生成步骤页面

## 5. 开发命令

```bash
# 开发环境
npm run dev          # 启动开发服务器 (http://localhost:3000)

# 构建和部署
npm run build        # 构建生产版本
npm start           # 启动生产服务器
npm run lint         # 代码检查

# 激活码管理
npx tsx scripts/generate-codes.ts 10    # 生成10个激活码
npx tsx scripts/generate-codes.ts 100 schengen 365  # 生成100个，有效期365天
```

## 6. 环境配置

### 必需环境变量（.env.local）
```env
NEXT_PUBLIC_INSTANTDB_APP_ID=your_app_id
INSTANTDB_ADMIN_TOKEN=your_admin_token
JWT_SECRET=your_jwt_secret_key
```

### 配置获取
1. **InstantDB App ID**: 在InstantDB Dashboard创建应用后获取
2. **Admin Token**: Dashboard → Settings → Admin Token
3. **JWT Secret**: `openssl rand -base64 32` 生成

## 7. 数据库架构

### 数据表结构

**activationCodes（激活码表）**:
```typescript
{
  code: string,           // 激活码（唯一索引）
  status: 'unused' | 'active', // 激活状态
  productType: string,    // 产品类型
  userId?: string,        // 预留：关联用户ID
  activatedAt?: Date,     // 激活时间
  expiresAt: Date,        // 过期时间
  createdAt: Date         // 创建时间
}
```

**userProgress（用户进度表）**:
```typescript
{
  code: string,           // 关联激活码
  currentStep: number,    // 当前步骤（1-10）
  checklist: object,      // Checklist状态（JSON）
  updatedAt: Date         // 更新时间
}
```

### 权限规则
```javascript
{
  "activationCodes": {
    "allow": "false"  // 前端完全不可访问
  },
  "userProgress": {
    "allow": {
      "read": "auth.code == data.code",
      "update": "auth.code == data.code"
    }
  }
}
```

## 8. 代码规范

### 文件命名
- **组件**: PascalCase（如 `ProgressBar.tsx`）
- **工具函数**: camelCase（如 `useProgress.ts`）
- **常量**: UPPER_CASE（如 `STORAGE_KEYS`）
- **文件名**: kebab-case（如 `generate-codes.ts`）

### 注释规范
**文件头部注释**（说明用途和业务逻辑）：
```typescript
/**
 * 用途: 激活码验证API
 * 业务逻辑: 验证激活码有效性，生成JWT Token
 */
```

**业务逻辑注释**（解释为什么，而非语法）：
```typescript
// ✅ 好的注释（业务逻辑）
// 检查用户是否为VIP，VIP用户显示折扣价格
if (user.isVIP) { ... }

// ❌ 不好的注释（语法注释）
// 循环10次
for (let i = 0; i < 10; i++) { ... }
```

### 组件设计原则
1. **单一职责**: 一个组件只做一件事
2. **服务端优先**: 能服务端渲染的绝不用客户端
3. **类型安全**: 完整的TypeScript类型定义
4. **错误处理**: 完善的错误边界和回退机制

## 9. 安全考虑

### 数据安全
- **激活码保护**: 前端无法直接访问激活码数据库
- **用户隔离**: 用户只能访问自己的进度数据
- **JWT验证**: 所有API请求都需要有效Token
- **权限控制**: InstantDB规则引擎确保数据安全

### 前端安全
- **输入验证**: 激活码格式验证在前端
- **XSS防护**: React自动转义，Markdown使用安全渲染
- **CSRF防护**: Next.js内置防护机制

### 部署安全
- **环境变量**: 敏感信息绝不提交到Git
- **HTTPS**: Vercel自动提供SSL证书
- **Headers**: 安全响应头自动配置

## 10. 性能优化

### 构建优化
- **静态生成**: 步骤页面使用SSG
- **代码分割**: 自动按路由分割
- **图片优化**: Next.js Image组件自动优化

### 运行时优化
- **数据缓存**: Markdown内容构建时缓存
- **实时同步**: WebSocket连接复用
- **防抖处理**: 避免频繁API请求

### 监控建议
- **Vercel Analytics**: 性能监控
- **错误追踪**: 建议集成Sentry
- **用户行为**: 建议添加分析工具

## 11. 测试建议

### 测试策略
- **单元测试**: 核心工具函数（如JWT、Markdown解析）
- **集成测试**: API接口测试
- **E2E测试**: 核心用户流程（激活→步骤浏览→Checklist）

### 测试框架推荐
- **Jest**: 单元测试和集成测试
- **React Testing Library**: 组件测试
- **Cypress**: E2E测试

## 12. 扩展开发

### 添加新步骤
1. 在`docs/`目录创建`11_新步骤.md`
2. 在`lib/constants.ts`的`STEPS`数组中添加配置
3. 系统自动识别并生成对应页面

### 添加新国家
1. 在`lib/constants.ts`的`COUNTRIES`数组中添加
2. 更新相关文案和路由
3. 考虑多语言支持需求

### 功能扩展方向
- **用户系统**: 邮箱注册、多设备管理
- **内容管理**: 富文本编辑器、版本控制
- **AI集成**: 智能问答、个性化推荐
- **移动端**: PWA、离线支持、推送通知

## 13. 故障排查

### 常见问题

**激活码验证失败**:
- 检查激活码是否存在于数据库
- 确认Admin Token配置正确
- 查看API响应的具体错误信息

**多设备不同步**:
- 检查WebSocket连接状态
- 确认Token有效性
- 查看InstantDB实时订阅

**构建失败**:
- 检查TypeScript类型错误
- 确认环境变量配置
- 查看构建日志详细信息

### 调试工具
- **浏览器DevTools**: Network、Console标签
- **InstantDB Dashboard**: 实时数据查看
- **Vercel Logs**: 服务端日志分析

---

**最后更新**: 2025年11月  
**维护建议**: 随着项目迭代，请定期更新本文档  
**文档版本**: v1.0