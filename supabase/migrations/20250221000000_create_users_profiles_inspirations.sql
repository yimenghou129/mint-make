-- Mint & Make: 用户、创作者档案、灵感卡片
-- 与 NextAuth Credentials + JWT 配合使用

-- 1. 用户表（替代 data/users.json）
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (LOWER(email));

-- 2. 创作者档案（按 user_id 关联）
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content_fields TEXT[] NOT NULL DEFAULT '{}',
  platforms TEXT[] NOT NULL DEFAULT '{}',
  output_formats TEXT[] NOT NULL DEFAULT '{}',
  description TEXT NOT NULL DEFAULT '',
  style_keywords TEXT[] DEFAULT '{}',
  youtube_channel_url TEXT,
  summary JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles (user_id);

-- 3. 灵感卡片（按 user_id 关联）
CREATE TABLE IF NOT EXISTS public.inspirations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  meta JSONB NOT NULL,
  like_points TEXT[] NOT NULL DEFAULT '{}',
  note TEXT,
  highlight_summary TEXT NOT NULL DEFAULT '',
  reuse_suggestion JSONB NOT NULL DEFAULT '{}',
  ai_breakdown JSONB,
  embedding JSONB,  -- 可选，存 [float...] 用于 Find 推荐
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inspirations_user_id ON public.inspirations (user_id);
CREATE INDEX IF NOT EXISTS idx_inspirations_created_at ON public.inspirations (created_at DESC);

-- 启用 RLS（Row Level Security），服务端用 service_role 可绕过
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspirations ENABLE ROW LEVEL SECURITY;

-- 策略：anon 和 authenticated 默认无直接访问，由 API 用 service_role 操作
-- 如需客户端直连，可在此添加策略
