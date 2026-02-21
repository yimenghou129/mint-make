"use client";

import Link from "next/link";
import { AppHeader } from "@/components/app-header/AppHeader";
import type { InspirationCard, FindCardType, GeneratedPlan } from "@/lib/types";

export type { FindCardType, GeneratedPlan };

interface FindViewProps {
  query: string;
  onQueryChange: (v: string) => void;
  cardType: FindCardType;
  onCardTypeChange: (v: FindCardType) => void;
  onGetRecommendations: () => void;
  loading?: boolean;
  hasResults: boolean;
  recommended: InspirationCard[];
  plans: GeneratedPlan[];
  onCopyPlan?: (plan: GeneratedPlan) => void;
}

const CARD_TYPES: { value: FindCardType; label: string }[] = [
  { value: "封面", label: "封面" },
  { value: "标题", label: "标题" },
  { value: "结构", label: "结构" },
];

const LeafIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-zinc-800" aria-hidden>
    <path d="M12 3c-1.5 0-2.5 1-3 2.5C8.5 7 9 9 10 10.5c1 1.5 2.5 2.5 4 2.5s3-1 4-2.5c1-1.5 1.5-3.5 1-5C14.5 4 13.5 3 12 3z" fill="currentColor" />
    <path d="M12 12c-2 0-4 1.5-5 4 0 0 2 4 5 4s5-4 5-4c-1-2.5-3-4-5-4z" fill="currentColor" opacity={0.9} />
  </svg>
);

export function FindView({
  query,
  onQueryChange,
  cardType,
  onCardTypeChange,
  onGetRecommendations,
  loading,
  hasResults,
  recommended,
  plans,
  onCopyPlan,
}: FindViewProps) {
  return (
    <div className="min-h-screen bg-white">
      <AppHeader current="find" />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="flex items-center gap-2">
          <LeafIcon />
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            寻找灵感
          </h1>
        </div>
        <p className="mt-2 text-sm text-zinc-500">
          告诉我你在做什么内容、卡在哪里，我来帮你
        </p>

        {/* Input + 选择卡点 + 获取推荐 */}
        <div className="mt-8">
          <label className="block text-sm font-medium text-zinc-800">
            你在做什么内容？卡在哪里了？
          </label>
          <textarea
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="例如:我在做终身学习主题的视频,想讲知识管理,但封面一直没灵感..."
            rows={4}
            className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
          />

          <div className="mt-6">
            <p className="mb-2 text-sm font-medium text-zinc-800">选择卡点</p>
            <div className="flex flex-wrap gap-2">
              {CARD_TYPES.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onCardTypeChange(opt.value)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    cardType === opt.value
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onGetRecommendations}
            disabled={loading}
            className="mt-8 w-full rounded-xl bg-zinc-900 py-3.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50"
          >
            {loading ? "生成中…" : "获取推荐"}
          </button>
        </div>

        {/* Results: 推荐灵感 + 生成方案 */}
        {hasResults && (
          <div className="mt-12 grid gap-8 border-t border-zinc-100 pt-10 lg:grid-cols-2">
            <section>
              <h2 className="text-lg font-semibold text-zinc-900">推荐灵感</h2>
              <ul className="mt-4 space-y-4">
                {recommended.length === 0 ? (
                  <li className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-6 text-center text-sm text-zinc-500">
                    暂无匹配灵感，先去添加一些收藏吧
                  </li>
                ) : (
                  recommended.slice(0, 5).map((c) => (
                    <li key={c.id}>
                      <Link
                        href={`/detail/${c.id}`}
                        className="flex gap-4 overflow-hidden rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-300 hover:shadow-sm"
                      >
                        <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={c.meta.thumbnailUrl}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-zinc-900 line-clamp-2">
                            {c.meta.title}
                          </p>
                          <p className="mt-0.5 text-xs text-zinc-500">
                            {c.meta.authorChannelName}
                          </p>
                          <p className="mt-2 line-clamp-2 text-xs text-zinc-600">
                            {c.highlightSummary}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900">生成方案</h2>
              <ul className="mt-4 space-y-4">
                {plans.map((plan) => (
                  <li
                    key={plan.id}
                    className="relative rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-300"
                  >
                    <button
                      type="button"
                      onClick={() => onCopyPlan?.(plan)}
                      className="absolute right-3 top-3 rounded p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
                      title="复制"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    </button>
                    <p className="pr-8 font-medium text-zinc-900">{plan.title}</p>
                    <p className="mt-1 text-sm text-zinc-600">{plan.description}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
