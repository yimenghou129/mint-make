"use client";

import Link from "next/link";
import { AppHeader } from "@/components/app-header/AppHeader";
import type { InspirationCard } from "@/lib/types";
import { LIKE_POINTS_STRATEGY, LIKE_POINTS_VISUAL } from "@/lib/types";

const FILTER_TABS = [
  ...LIKE_POINTS_STRATEGY,
  "封面",
  "视觉制作",
] as const;

const LeafIconLarge = () => (
  <svg
    width="80"
    height="80"
    viewBox="0 0 24 24"
    fill="none"
    className="text-zinc-200"
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

interface VaultViewProps {
  inspirations: InspirationCard[];
  searchQuery?: string;
  filterTab?: string;
  onSearchChange?: (q: string) => void;
  onFilterChange?: (tab: string) => void;
}

export function VaultView({
  inspirations,
  searchQuery = "",
  filterTab,
  onSearchChange,
  onFilterChange,
}: VaultViewProps) {
  const filtered = inspirations.filter((c) => {
    const matchSearch =
      !searchQuery ||
      c.meta.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.meta.authorChannelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.likePoints.some((p) => p.includes(searchQuery));
    const matchFilter = !filterTab
      ? true
      : filterTab === "视觉制作"
        ? c.likePoints.some((p) => LIKE_POINTS_VISUAL.includes(p))
        : c.likePoints.includes(filterTab);
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-white">
      <AppHeader current="vault" />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          灵感库
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          已收藏 {inspirations.length} 个灵感
        </p>

        {/* Search + Add */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="搜索标题/标签/作者"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
            />
          </div>
          <Link
            href="/add"
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            添加灵感
          </Link>
        </div>

        {/* Filter tabs */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onFilterChange?.(filterTab === tab ? "" : tab)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filterTab === tab
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              {tab}
            </button>
          ))}
          <span className="ml-1 text-sm text-zinc-400">更多筛选</span>
        </div>

        {/* Content: empty state or list */}
        <div className="mt-10">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 py-20 text-center">
              <LeafIconLarge />
              <p className="mt-6 text-lg font-medium text-zinc-900">
                还没有收藏灵感
              </p>
              <p className="mt-2 text-sm text-zinc-500">
                粘贴你的第一个 YouTube 链接开始吧
              </p>
              <Link
                href="/add"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                添加灵感
              </Link>
              <p className="mt-6 max-w-sm text-xs text-zinc-400">
                先存一条试试，系统会自动生成标题模板与封面文案。
              </p>
            </div>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/detail/${c.id}`}
                    className="group block overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:border-zinc-300 hover:shadow-md"
                  >
                    <div className="aspect-video w-full bg-zinc-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={c.meta.thumbnailUrl}
                        alt=""
                        className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                      />
                    </div>
                    <div className="p-4">
                      <p className="line-clamp-2 font-medium text-zinc-900 group-hover:text-zinc-700">
                        {c.meta.title}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {c.meta.authorChannelName}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {c.likePoints.slice(0, 3).map((p) => (
                          <span
                            key={p}
                            className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
