# 登录与注册

## 流程

1. **未登录**：访问任意受保护页面会跳转到 `/login`。
2. **注册**：打开 `/register`，填写邮箱与密码（至少 6 位），提交后跳转登录页。
3. **登录**：在 `/login` 输入邮箱与密码，登录后进入首页。
4. **未建档**：登录后若尚未创建创作档案，首页会自动跳转到 `/onboarding`。
5. **已建档**：可正常使用灵感库、添加灵感、寻找灵感、导出等。

顶栏提供「退出」按钮，退出后回到登录页。

## 环境变量

在项目根目录的 `.env.local` 中增加：

```bash
# NextAuth（必填）
NEXTAUTH_SECRET=随便一串随机字符串
NEXTAUTH_URL=http://localhost:3000
```

生成随机字符串示例：`openssl rand -base64 32`。

生产环境请将 `NEXTAUTH_URL` 改为实际域名。

## 数据存储说明（Supabase）

- **用户账号**：存于 Supabase `users` 表（密码 bcrypt 哈希）。
- **创作档案与灵感**：存于 Supabase `profiles`、`inspirations` 表，按 `user_id` 隔离。

详见 [docs/SUPABASE.md](./SUPABASE.md)。
