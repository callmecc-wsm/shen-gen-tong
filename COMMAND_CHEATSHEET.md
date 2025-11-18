# 常用命令速查表

快速查找项目中常用的命令和操作。

---

## 🚀 项目启动

### 启动开发服务器

```bash
npm run dev
```

访问地址：`http://localhost:3000`

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器（需要先 build）

```bash
npm start
```

---

## 🎫 激活码管理

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

### 生成激活码（默认：10个，申根签证，1年有效期）

```bash
npx tsx scripts/generate-codes.ts
```

### 生成指定数量的激活码

```bash
# 生成 50 个激活码
npx tsx scripts/generate-codes.ts 50
```

### 生成指定有效期的激活码

```bash
# 生成 10 个激活码，有效期 2 年（730 天）
npx tsx scripts/generate-codes.ts 10 schengen 730
```

### 生成永久有效的激活码

```bash
# 有效期设为 0 表示永不过期
npx tsx scripts/generate-codes.ts 10 schengen 0
```

### 生成不同产品类型的激活码

```bash
# 申根签证（默认）
npx tsx scripts/generate-codes.ts 10 schengen 365

# 留学咨询
npx tsx scripts/generate-codes.ts 10 study_abroad 365

# 专业咨询
npx tsx scripts/generate-codes.ts 10 consulting 365
```

---

## 📦 依赖管理

### 安装所有依赖

```bash
npm install
```

### 安装新的依赖包

```bash
# 安装到 dependencies
npm install 包名

# 安装到 devDependencies
npm install -D 包名
```

### 更新依赖包

```bash
# 更新所有包到最新版本
npm update

# 更新特定包
npm update 包名
```

### 查看过时的依赖

```bash
npm outdated
```

---

## 🔍 代码检查

### 运行 TypeScript 类型检查

```bash
npx tsc --noEmit
```

### 运行 ESLint 检查

```bash
npm run lint
```

### 自动修复 ESLint 问题

```bash
npm run lint -- --fix
```

---

## 🗄️ 数据库相关

### 当前可用的测试激活码

> ⚠️ 注意：目前开发和生产环境共用数据库

```
VISA-2025-NRVXXWCC
VISA-2025-RQZPB72S
VISA-2025-HHAVJHBH
VISA-2025-U74MV3YA
VISA-2025-Y33JV2VP
```

### 查看 InstantDB 数据（浏览器）

1. 访问：https://instantdb.com/dash
2. 登录账号
3. 选择应用（App ID: `a95b5253-ff7c-43c8-a67d-edf95aa0d217`）
4. 进入 **Explorer** 标签
5. 选择数据表：`activationCodes` 或 `userProgress`

---

## 🌐 部署相关

### 推送代码到 GitHub

```bash
# 查看当前状态
git status

# 添加所有修改的文件
git add .

# 提交（用中文描述）
git commit -m "feat: 添加新功能"

# 推送到远程仓库
git push
```

### 查看 Vercel 部署状态

访问：https://vercel.com/dashboard

### 查看线上环境变量（Vercel）

1. 访问 Vercel Dashboard
2. 选择项目 `shen-gen-tong`
3. Settings → Environment Variables

---

## 🛠️ 开发工具

### 清理缓存和重装依赖

```bash
# 删除 node_modules 和 lock 文件
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

### 清理 Next.js 构建缓存

```bash
rm -rf .next
npm run dev
```

### 查看项目占用的端口

```bash
# macOS/Linux
lsof -i :3000

# 杀死占用端口的进程
kill -9 [PID]
```

---

## 📝 文档生成

### 查看项目结构

```bash
tree -L 3 -I 'node_modules|.next'
```

### 统计代码行数

```bash
find . -name '*.ts' -o -name '*.tsx' | xargs wc -l
```

---

## 🔐 环境变量

### 本地环境变量文件

文件位置：`.env.local`（不会提交到 Git）

```bash
# 查看环境变量文件（如果存在）
cat .env.local

# 编辑环境变量
code .env.local  # 使用 VS Code
# 或
nano .env.local  # 使用命令行编辑器
```

### 必需的环境变量

```bash
NEXT_PUBLIC_INSTANTDB_APP_ID=a95b5253-ff7c-43c8-a67d-edf95aa0d217
INSTANTDB_ADMIN_TOKEN=你的admin_token
JWT_SECRET=schengen_visa_helper_secret_key_2025_change_in_production
```

---

## 🧪 测试相关

### 当前激活码测试流程

```bash
# 1. 启动开发服务器
npm run dev

# 2. 浏览器访问
# http://localhost:3000

# 3. 输入测试激活码（任选一个）
# VISA-2025-NRVXXWCC

# 4. 查看激活状态
npx tsx scripts/list-codes.ts
```

---

## 📚 常用文档路径

| 文档 | 路径 | 说明 |
|------|------|------|
| 激活码使用指南 | `ACTIVATION_CODE_GUIDE.md` | 激活码完整使用说明 |
| 项目结构说明 | `PROJECT_STRUCTURE.md` | 文件组织和架构 |
| 部署指南 | `DEPLOYMENT_GUIDE.md` | Vercel 部署步骤 |
| 环境配置 | `ENV_SETUP.md` | 环境变量配置 |
| 变更日志 | `CHANGELOG.md` | 功能更新记录 |
| 未来优化计划 | `FUTURE_OPTIMIZATIONS.md` | 待优化项目清单 |
| 使用说明 | `使用说明.md` | 用户使用指南 |

---

## 🆘 常见问题解决

### 问题：端口 3000 已被占用

```bash
# 查找占用进程
lsof -i :3000

# 杀死进程
kill -9 [PID]

# 或者使用其他端口
npm run dev -- -p 3001
```

### 问题：依赖安装失败

```bash
# 清理 npm 缓存
npm cache clean --force

# 删除 node_modules 重新安装
rm -rf node_modules package-lock.json
npm install
```

### 问题：TypeScript 报错

```bash
# 重启 TypeScript 服务器（VS Code）
# Command + Shift + P → "TypeScript: Restart TS Server"

# 或者重新生成类型定义
rm -rf .next
npm run dev
```

### 问题：激活码脚本报错

```bash
# 检查环境变量是否配置
cat .env.local

# 检查网络连接
ping instantdb.com

# 查看详细错误信息
npx tsx scripts/generate-codes.ts --verbose
```

### 问题：Git 推送失败

```bash
# 查看远程仓库
git remote -v

# 拉取最新代码后再推送
git pull origin main
git push
```

---

## 💡 快捷键提示

### VS Code 常用快捷键

| 功能 | macOS | Windows/Linux |
|------|-------|---------------|
| 打开终端 | `Control + `` | `Ctrl + `` |
| 命令面板 | `Cmd + Shift + P` | `Ctrl + Shift + P` |
| 快速打开文件 | `Cmd + P` | `Ctrl + P` |
| 格式化代码 | `Shift + Option + F` | `Shift + Alt + F` |
| 查找文件内容 | `Cmd + Shift + F` | `Ctrl + Shift + F` |

---

## 🔖 保存常用命令别名（可选）

在 `~/.zshrc` 或 `~/.bashrc` 中添加：

```bash
# 申根通项目快捷命令
alias sgt-dev="cd ~/Documents/shen-gen-tong && npm run dev"
alias sgt-codes="cd ~/Documents/shen-gen-tong && npx tsx scripts/list-codes.ts"
alias sgt-gen="cd ~/Documents/shen-gen-tong && npx tsx scripts/generate-codes.ts"
```

保存后执行：

```bash
source ~/.zshrc  # 或 source ~/.bashrc
```

之后就可以用简短命令：

```bash
sgt-dev       # 启动开发服务器
sgt-codes     # 查看激活码
sgt-gen 10    # 生成 10 个激活码
```

---

**最后更新**：2025年11月17日

**💡 提示**：将此文档加入浏览器书签，随时快速查找命令！

