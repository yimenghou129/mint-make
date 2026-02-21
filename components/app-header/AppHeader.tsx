"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

type NavItem = { label: string; href: string; icon?: "grid" | "search" | "plus" };

const LeafLogo = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    className="text-zinc-900"
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
);

const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const ExportIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
  </svg>
);
const ProfileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="4" />
    <path d="M20 21a8 8 0 0 0-16 0" />
  </svg>
);

interface AppHeaderProps {
  current?: "vault" | "find" | "add";
}

const NAV: NavItem[] = [
  { label: "灵感库", href: "/vault", icon: "grid" },
  { label: "寻找灵感", href: "/find", icon: "search" },
  { label: "添加灵感", href: "/add", icon: "plus" },
];

export function AppHeader({ current }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-zinc-900 hover:opacity-80"
        >
          <LeafLogo />
          <span className="font-semibold tracking-tight">Mint & Make</span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV.map((item) => {
            const isActive = current === item.href.slice(1) || (item.href === "/vault" && !current);
            const Icon = item.icon === "grid" ? GridIcon : item.icon === "search" ? SearchIcon : PlusIcon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive ? "bg-zinc-100 text-zinc-900" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                <Icon />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/settings/export"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
            title="导出"
          >
            <ExportIcon />
            <span className="hidden sm:inline">导出</span>
          </Link>
          <Link
            href="/onboarding"
            className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
            title="创作档案"
          >
            <ProfileIcon />
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="rounded-lg px-2 py-1.5 text-sm text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700"
            title="退出登录"
          >
            退出
          </button>
        </div>
      </div>
    </header>
  );
}
