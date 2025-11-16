# 部署指南

本文档提供完整的部署步骤和配置说明。

---

## 📋 目录

1. [InstantDB 配置](#instantdb-配置)
2. [生成激活码](#生成激活码)
3. [本地开发环境设置](#本地开发环境设置)
4. [Vercel 部署](#vercel-部署)
5. [测试清单](#测试清单)

---

## 1. InstantDB 配置

### 1.1 注册并创建应用

1. 访问 [InstantDB Dashboard](https://instantdb.com/dash)
2. 使用您的应用 ID: `a95b5253-ff7c-43c8-a67d-edf95aa0d217`

### 1.2 配置数据库 Schema

在 InstantDB Dashboard 中创建以下两张表：

#### 表1: `activationCodes`

```json
{
  "id": "string (UUID)",
  "code": "string",
  "status": "string",
  "productType": "string",
  "userId": "string | null",
  "activatedAt": "number | null",
  "expiresAt": "number | null",
  "createdAt": "number"
}
```

#### 表2: `userProgress`

```json
{
  "id": "string (UUID)",
  "code": "string",
  "currentStep": "number",
  "checklist": "object (JSON)",
  "updatedAt": "number"
}
```

### 1.3 配置权限规则（重要！）

在 InstantDB Dashboard → Settings → Permissions 中添加：

```javascript
{
  "activationCodes": {
    "allow": {
      "read": "false",      // 前端不能直接读取激活码表
      "create": "false",    // 只能通过 Admin API 创建
      "update": "false",    // 只能通过 Admin API 更新
      "delete": "false"
    }
  },
  
  "userProgress": {
    "allow": {
      "read": "auth.code == data.code",   // 只能读取自己的进度
      "create": "false",                   // 通过 API 创建
      "update": "auth.code == data.code",  // 只能更新自己的进度
      "delete": "false"
    }
  }
}
```

**说明：**
- 这些规则确保用户只能访问自己的数据
- JWT Token 中的 `code` 字段作为身份标识
- 防止用户绕过前端直接操作数据库

### 1.4 获取 Admin Token

1. 在 InstantDB Dashboard → Settings → Admin Token
2. 点击 "Generate Token" 或复制现有 Token
3. 保存到环境变量（下一步使用）

---

## 2. 生成激活码

### 2.1 配置环境变量

在项目根目录创建 `.env.local` 文件：

```env
NEXT_PUBLIC_INSTANTDB_APP_ID=a95b5253-ff7c-43c8-a67d-edf95aa0d217
INSTANTDB_ADMIN_TOKEN=your_admin_token_here
JWT_SECRET=your_strong_random_secret_key_here
```

**获取 JWT_SECRET 强密钥：**

```bash
openssl rand -base64 32
```

### 2.2 运行生成脚本

```bash
# 生成 10 个申根签证激活码（默认值）
npx tsx scripts/generate-codes.ts

# 生成 100 个申根签证激活码，有效期 365 天
npx tsx scripts/generate-codes.ts 100 schengen 365

# 生成 50 个留学咨询激活码
npx tsx scripts/generate-codes.ts 50 study_abroad 730
```

**参数说明：**
- 第1个参数：生成数量（默认 10）
- 第2个参数：产品类型 `schengen` | `study_abroad` | `consulting`（默认 schengen）
- 第3个参数：有效期天数（默认 365）

### 2.3 保存激活码

脚本执行后会在控制台输出所有激活码，格式如：

```
VISA-2025-A3F7B2K9
VISA-2025-M8N4P6R1
VISA-2025-T2V5W7X9
...
```

**建议：**
- 复制到 Excel 表格保存
- 或直接将控制台输出保存到文本文件
- 妥善保管，分发给购买用户

---

## 3. 本地开发环境设置

### 3.1 安装依赖

```bash
npm install
```

### 3.2 配置环境变量

创建 `.env.local`（参考上面的示例）

### 3.3 运行开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 3.4 测试流程

1. 输入生成的激活码
2. 进入国家选择页
3. 选择意大利
4. 查看步骤总览
5. 进入任意步骤，勾选 Checklist
6. 打开浏览器开发者工具 → Network，查看 API 请求
7. 确认进度已保存到云端

---

## 4. Vercel 部署

### 4.1 推送代码到 GitHub

```bash
git add .
git commit -m "feat: 完成全栈升级，集成 InstantDB"
git push origin main
```

### 4.2 连接 Vercel

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "New Project"
3. 导入您的 GitHub 仓库
4. Framework Preset: Next.js（自动检测）
5. 点击 "Deploy"

### 4.3 配置环境变量

在 Vercel Dashboard → Project Settings → Environment Variables 中添加：

| 变量名 | 值 | 说明 |
|--------|---|------|
| `NEXT_PUBLIC_INSTANTDB_APP_ID` | `a95b5253-ff7c-43c8-a67d-edf95aa0d217` | InstantDB App ID（公开） |
| `INSTANTDB_ADMIN_TOKEN` | `your_admin_token` | InstantDB Admin Token（私密） |
| `JWT_SECRET` | `your_random_secret` | JWT 密钥（私密） |

**注意：**
- 所有环境添加：Production, Preview, Development
- 保存后需要重新部署才能生效

### 4.4 重新部署

1. 在 Vercel Dashboard → Deployments
2. 点击最新部署旁的 "..." → Redeploy
3. 勾选 "Use existing Build Cache"
4. 点击 "Redeploy"

### 4.5 验证部署

1. 访问您的 Vercel 域名（如 `your-app.vercel.app`）
2. 输入激活码测试
3. 检查功能是否正常

---

## 5. 测试清单

部署完成后，请按以下清单进行测试：

### ✅ 基础功能

- [ ] 首页加载正常
- [ ] 输入无效激活码显示错误提示
- [ ] 输入有效激活码成功进入
- [ ] 国家选择页正常显示
- [ ] 步骤总览页正常显示

### ✅ 进度同步

- [ ] 勾选 Checklist 后刷新页面，状态保持
- [ ] 在设备 A 勾选，设备 B 输入同一激活码能看到进度
- [ ] 进度条百分比正确计算
- [ ] 步骤完成状态正确显示

### ✅ 多设备测试

- [ ] 在电脑上激活并勾选几项任务
- [ ] 在手机上输入同一激活码
- [ ] 确认手机上能看到电脑勾选的进度
- [ ] 在手机上勾选更多任务
- [ ] 回到电脑刷新，确认同步成功

### ✅ 边界情况

- [ ] 已使用的激活码可以重复登录（显示"欢迎回来"）
- [ ] 清除浏览器 Token 后需要重新输入激活码
- [ ] 网络断开时勾选任务的错误处理
- [ ] 长时间未操作后 Token 是否仍有效（365天）

### ✅ 性能

- [ ] 页面加载速度 < 2秒
- [ ] Checklist 勾选响应速度 < 500ms
- [ ] 移动端流畅度良好

---

## 🎉 部署完成！

恭喜您成功部署了全栈版本的申根签证准备助手！

**后续步骤：**
1. 生成并分发激活码给用户
2. 收集用户反馈
3. 根据需求迭代功能
4. 扩展到更多申根国家

**技术支持：**
- InstantDB 文档: https://instantdb.com/docs
- Next.js 文档: https://nextjs.org/docs
- Vercel 文档: https://vercel.com/docs

---

**祝您的产品成功！** 🚀

