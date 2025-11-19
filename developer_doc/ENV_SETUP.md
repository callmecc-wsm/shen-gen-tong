# 环境变量配置说明

## 本地开发环境

请在项目根目录创建 `.env.local` 文件，添加以下内容：

```env
# InstantDB App ID（公开，前端可见）
NEXT_PUBLIC_INSTANTDB_APP_ID=a95b5253-ff7c-43c8-a67d-edf95aa0d217

# InstantDB Admin Token（私密，仅后端使用）
# 获取方式：登录 InstantDB 后台 → Settings → Admin Token
INSTANTDB_ADMIN_TOKEN=your_admin_token_here

# JWT 密钥（用于生成激活码验证 Token）
# 生产环境请使用强随机密钥，可用 openssl rand -base64 32 生成
JWT_SECRET=schengen_visa_helper_secret_key_2025_change_in_production
```

## 获取 InstantDB Admin Token

1. 访问 [InstantDB Dashboard](https://instantdb.com/dash)
2. 选择您的应用（App ID: a95b5253-ff7c-43c8-a67d-edf95aa0d217）
3. 进入 Settings → Admin Token
4. 复制 Admin Token 并填入 `.env.local`

## Vercel 生产环境

在 Vercel Dashboard 的项目设置中，添加以下环境变量：

- `NEXT_PUBLIC_INSTANTDB_APP_ID`
- `INSTANTDB_ADMIN_TOKEN`
- `JWT_SECRET`

## 安全提示

⚠️ **切勿将 `.env.local` 文件提交到 Git！**  
⚠️ **INSTANTDB_ADMIN_TOKEN 和 JWT_SECRET 必须保密！**

