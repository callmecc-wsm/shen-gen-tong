# 激活码管理指南

## 📋 概述

激活码系统用于控制用户访问申根签证助手的权限。每个激活码类似于"房卡"，用户需要输入有效的激活码才能开始使用系统。

---

## 🔧 环境配置

### 1. 本地环境变量

项目根目录已经创建了 `.env.local` 文件，包含以下配置：

```bash
# InstantDB 配置
NEXT_PUBLIC_INSTANTDB_APP_ID=a95b5253-ff7c-43c8-a67d-edf95aa0d217
INSTANTDB_ADMIN_TOKEN=b9050311-bd71-4977-8075-7c1e26660826
JWT_SECRET=schengen_visa_helper_secret_key_2025_change_in_production
```

**⚠️ 安全提示：**
- `.env.local` 文件不会被 Git 追踪（已在 `.gitignore` 中排除）
- 不要将 Admin Token 分享给他人
- 生产环境的 JWT_SECRET 应该修改为更复杂的随机字符串

---

## 🎫 查看现有激活码

### 查看所有激活码

```bash
npx tsx scripts/list-codes.ts
```

### 只查看未使用的激活码

```bash
npx tsx scripts/list-codes.ts unused
```

### 只查看已激活的激活码

```bash
npx tsx scripts/list-codes.ts active
```

### 当前可用的激活码

以下是数据库中现有的 **5 个未使用** 激活码（有效期至 2026年11月16日）：

1. `VISA-2025-NRVXXWCC`
2. `VISA-2025-RQZPB72S`
3. `VISA-2025-HHAVJHBH`
4. `VISA-2025-U74MV3YA`
5. `VISA-2025-Y33JV2VP`

**💡 测试建议：** 使用其中任意一个激活码进行本地测试

---

## 🔨 生成新的激活码

### 基本用法

```bash
npx tsx scripts/generate-codes.ts [数量] [产品类型] [有效期天数]
```

### 参数说明

- **数量**（可选）：要生成的激活码数量，默认 10
- **产品类型**（可选）：`schengen`（申根签证）、`study_abroad`（留学咨询）、`consulting`（专业咨询），默认 `schengen`
- **有效期天数**（可选）：激活码的有效期，默认 365 天

### 使用示例

#### 生成 10 个申根签证激活码（默认 1 年有效期）

```bash
npx tsx scripts/generate-codes.ts
```

或

```bash
npx tsx scripts/generate-codes.ts 10 schengen 365
```

#### 生成 50 个激活码，有效期 2 年

```bash
npx tsx scripts/generate-codes.ts 50 schengen 730
```

#### 生成 5 个留学咨询激活码

```bash
npx tsx scripts/generate-codes.ts 5 study_abroad 365
```

#### 生成永久有效的激活码（有效期设为 0）

```bash
npx tsx scripts/generate-codes.ts 10 schengen 0
```

### 生成结果示例

```
📋 激活码生成配置:
   数量: 10
   产品类型: schengen
   有效期: 365 天

🔄 正在生成激活码...
✅ 已生成 10 个激活码

🔄 正在插入到 InstantDB...
✅ 激活码已成功插入到数据库

📋 生成的激活码列表:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. VISA-2025-A7B2C3D4
  2. VISA-2025-E5F6G7H8
  ...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💾 您可以将这些激活码保存下来，分发给用户。
```

---

## 🧪 测试激活码功能

### 1. 启动本地开发服务器

```bash
npm run dev
```

### 2. 访问应用

打开浏览器访问 `http://localhost:3000`

### 3. 输入激活码

使用上面列出的任意一个未使用的激活码进行测试，例如：

```
VISA-2025-NRVXXWCC
```

### 4. 验证功能

- ✅ 激活成功后会跳转到步骤 1（领区确认）
- ✅ 激活码状态会变为 "已激活"
- ✅ 用户进度会被保存

---

## 🔍 通过 InstantDB Dashboard 查看

除了使用脚本，你还可以直接在 InstantDB 后台查看和管理激活码：

1. 访问 [InstantDB Dashboard](https://instantdb.com/dash)
2. 选择应用（App ID: `a95b5253-ff7c-43c8-a67d-edf95aa0d217`）
3. 进入 **Explorer** 标签
4. 选择 `activationCodes` 表
5. 查看所有激活码及其状态

---

## 📊 激活码格式说明

激活码格式：`VISA-[年份]-[8位随机码]`

- **前缀**：`VISA` 固定前缀
- **年份**：激活码生成的年份（如 2025）
- **随机码**：8 位大写字母和数字组合（排除易混淆字符：I、O、0、1、L）

**示例**：`VISA-2025-NRVXXWCC`

---

## 💡 常见问题

### Q: 如何删除或禁用激活码？

A: 目前需要通过 InstantDB Dashboard 手动操作：
1. 进入 Explorer → activationCodes 表
2. 找到对应的激活码
3. 修改 `status` 字段为 `expired`

### Q: 激活码可以重复使用吗？

A: 不可以。每个激活码只能被使用一次。一旦状态变为 `active`，就不能再次使用。

### Q: 如何修改激活码的有效期？

A: 通过 InstantDB Dashboard：
1. 找到对应的激活码
2. 修改 `expiresAt` 字段（Unix 时间戳，单位：毫秒）

### Q: 生成脚本报错怎么办？

A: 检查以下几点：
1. `.env.local` 文件是否存在
2. `INSTANTDB_ADMIN_TOKEN` 是否正确
3. 网络连接是否正常
4. 是否安装了 `tsx`（运行 `npm install -g tsx`）

---

## 🔐 安全建议

1. **不要公开分享 Admin Token**
   - 只在服务端使用
   - 不要提交到 Git 仓库

2. **定期更新 JWT_SECRET**
   - 生产环境使用强随机字符串
   - 定期轮换密钥

3. **监控激活码使用情况**
   - 定期运行 `list-codes.ts` 查看状态
   - 及时禁用异常的激活码

4. **批量生成激活码**
   - 建议一次生成足够的数量
   - 避免频繁调用数据库

---

## 📝 相关文件

- `scripts/generate-codes.ts` - 激活码生成脚本
- `scripts/list-codes.ts` - 激活码查询脚本
- `lib/instantdb-admin.ts` - InstantDB 管理工具
- `app/api/activate/route.ts` - 激活码验证 API
- `.env.local` - 本地环境变量配置

---

**更新时间**：2025年11月17日

