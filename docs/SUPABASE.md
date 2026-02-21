# Supabase 配置

## 1. 环境变量

在 `.env.local` 中已添加：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://你的项目.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=   # 必填！从 Supabase 控制台获取
```

**SUPABASE_SERVICE_ROLE_KEY**：在 Supabase 控制台 → Project Settings → API → `service_role`（secret）。用于服务端操作（注册、profile、inspirations），**不要**暴露到前端。

## 2. 执行迁移

在 Supabase 控制台创建好项目后，执行迁移创建表结构：

```bash
# 链接到远程项目（首次需要）
supabase link --project-ref 你的项目ref

# 推送迁移
supabase db push
```

或手动在 Supabase SQL Editor 中执行 `supabase/migrations/20250221000000_create_users_profiles_inspirations.sql` 的内容。

## 3. 表结构

- **users**：用户账号（id, email, password_hash）
- **profiles**：创作者档案（按 user_id 关联）
- **inspirations**：灵感卡片（按 user_id 关联）

## 4. 验证

1. 填写 `SUPABASE_SERVICE_ROLE_KEY`
2. 执行迁移
3. 运行 `pnpm dev`，注册新用户并登录
4. 完成 onboarding，添加一条灵感，确认数据持久化
