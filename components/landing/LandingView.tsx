"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

/** Props: 仅数据与入口，无业务逻辑 */
interface LandingViewProps {
  isLoggedIn?: boolean;
  hasProfile?: boolean;
}

const Logo = () => (
  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black">
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="text-white"
      aria-hidden
    >
      <path
        d="M12 3c-1.5 0-2.5 1-3 2.5C8.5 7 9 9 10 10.5c1 1.5 2.5 2.5 4 2.5s3-1 4-2.5c1-1.5 1.5-3.5 1-5C14.5 4 13.5 3 12 3z"
        fill="currentColor"
      />
      <path
        d="M12 12c-2 0-4 1.5-5 4 0 0 2 4 5 4s5-4 5-4c-1-2.5-3-4-5-4z"
        fill="currentColor"
        opacity={0.9}
      />
    </svg>
  </div>
);

const FeatureCard = ({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <Link
    href={href}
    className="group flex flex-col rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-black hover:bg-black hover:shadow-xl"
  >
    <div className="mb-4 flex h-10 w-10 items-center justify-center text-black transition-colors group-hover:text-white">
      {icon}
    </div>
    <h3 className="text-lg font-semibold tracking-tight text-zinc-900 transition-colors group-hover:text-white">
      {title}
    </h3>
    <p className="mt-2 text-sm leading-relaxed text-zinc-600 transition-colors group-hover:text-zinc-300">
      {description}
    </p>
  </Link>
);

export function LandingView({ isLoggedIn, hasProfile }: LandingViewProps) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* 顶栏：右上角 登录/注册 或 灵感库 + 退出 */}
      <header className="fixed top-0 left-0 right-0 z-10 flex h-14 items-center justify-between border-b border-zinc-200/80 bg-white/95 px-4 backdrop-blur sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-zinc-900">
          <span className="font-semibold">Mint & Make</span>
        </Link>
        <nav className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              {hasProfile && (
                <Link
                  href="/vault"
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
                >
                  灵感库
                </Link>
              )}
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
              >
                退出
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              登录 / 注册
            </Link>
          )}
        </nav>
      </header>

      <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 pt-14 pb-16">
        {/* Logo + title */}
        <div className="flex flex-col items-center text-center">
          <Logo />
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
            Mint & Make
          </h1>
          <p className="mt-3 text-lg text-zinc-600 sm:text-xl">
            为自媒体创作者打造的灵感收藏与创作助手
          </p>
        </div>

        {/* Feature cards：未登录点任意卡片跳登录；已登录分别跳 add / vault / find */}
        <div className="mt-14 grid w-full gap-6 sm:grid-cols-3">
          <FeatureCard
            href={isLoggedIn ? "/add" : "/login"}
            icon={
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M12 8v8M8 12h8" />
              </svg>
            }
            title="快速收藏"
            description="粘贴 YouTube 链接，一键保存优质内容"
          />
          <FeatureCard
            href={isLoggedIn ? "/vault" : "/login"}
            icon={
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            }
            title="智能拆解"
            description="自动分析标题、封面、结构和表达技巧"
          />
          <FeatureCard
            href={isLoggedIn ? "/find" : "/login"}
            icon={
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18h6M10 22h4M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
                <path d="M12 2v2M6 6l1.5 1.5M18 6l-1.5 1.5M12 20v-2" />
              </svg>
            }
            title="创作助手"
            description="卡壳时获取灵感推荐和创作建议"
          />
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <Link
            href={hasProfile ? "/vault" : "/onboarding"}
            className="rounded-xl bg-black px-8 py-3.5 text-center text-base font-medium text-white transition hover:bg-zinc-800"
          >
            开始使用
          </Link>
          {hasProfile && (
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <Link href="/add" className="text-zinc-500 underline hover:text-zinc-900">
                添加灵感
              </Link>
              <Link href="/find" className="text-zinc-500 underline hover:text-zinc-900">
                寻找灵感
              </Link>
              <Link href="/settings/export" className="text-zinc-500 underline hover:text-zinc-900">
                导出
              </Link>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="mt-16 text-center text-sm text-zinc-500">
          支持 YouTube、小红书 · B站创作者
        </p>
      </div>
    </div>
  );
}
