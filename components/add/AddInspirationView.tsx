"use client";

import Link from "next/link";
import { AppHeader } from "@/components/app-header/AppHeader";
import type { YouTubeMeta } from "@/lib/types";
import {
  LIKE_POINTS_STRATEGY,
  LIKE_POINTS_VISUAL,
  type LikePoint,
} from "@/lib/types";

interface AddInspirationViewProps {
  url: string;
  onUrlChange: (v: string) => void;
  loading: boolean;
  error: string | null;
  meta: YouTubeMeta | null;
  onFetch: () => void;
  likePoints: LikePoint[];
  onToggleLike: (p: LikePoint) => void;
  note: string;
  onNoteChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
  canSave: boolean;
  saving?: boolean;
  saveNotice?: string | null;
}

function LikeChip({
  label,
  selected,
  onClick,
  icon,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
        selected
          ? "bg-zinc-900 text-white"
          : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

export function AddInspirationView({
  url,
  onUrlChange,
  loading,
  error,
  meta,
  onFetch,
  likePoints,
  onToggleLike,
  note,
  onNoteChange,
  onSave,
  onCancel,
  canSave,
  saving = false,
  saveNotice = null,
}: AddInspirationViewProps) {
  return (
    <div className="min-h-screen bg-white">
      <AppHeader current="add" />

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <Link
          href="/vault"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-900"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          返回灵感库
        </Link>

        <h1 className="mt-6 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          添加灵感
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          粘贴 YouTube 链接，系统将自动拆解分析
        </p>

        {/* URL input + Capture */}
        <div className="mt-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </span>
              <input
                type="url"
                value={url}
                onChange={(e) => onUrlChange(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>
            <button
              type="button"
              onClick={onFetch}
              disabled={loading || !url.trim()}
              className="shrink-0 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50"
            >
              {loading ? "抓取中…" : "抓取预览"}
            </button>
          </div>
          <p className="mt-2 text-xs text-zinc-400">不会立即保存，先预览</p>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        {/* Preview card */}
        {meta && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
            <div className="flex flex-col sm:flex-row">
              <div className="aspect-video w-full shrink-0 bg-zinc-100 sm:w-48">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={meta.thumbnailUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                  <h3 className="font-semibold text-zinc-900 line-clamp-2">
                    {meta.title}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500">
                    {meta.authorChannelName}
                    {meta.publishedAt && ` · ${meta.publishedAt.slice(0, 10)}`}
                  </p>
                  {meta.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-zinc-600">
                      {meta.description}
                    </p>
                  )}
                </div>
                <a
                  href={meta.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900"
                >
                  原视频链接
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* 我喜欢它哪里 */}
        {meta && (
          <>
            <div className="mt-10">
              <label className="block text-sm font-medium text-zinc-800">
                我喜欢它哪里？<span className="text-red-500">（多选）</span>
              </label>
              <div className="mt-3">
                <p className="text-xs font-medium text-zinc-500">文案/策略</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {LIKE_POINTS_STRATEGY.map((p) => (
                    <LikeChip
                      key={p}
                      label={p}
                      selected={likePoints.includes(p)}
                      onClick={() => onToggleLike(p)}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs font-medium text-zinc-500">视觉/制作</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {LIKE_POINTS_VISUAL.map((p) => (
                    <LikeChip
                      key={p}
                      label={p}
                      selected={likePoints.includes(p)}
                      onClick={() => onToggleLike(p)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 备注 */}
            <div className="mt-8">
              <label className="block text-sm font-medium text-zinc-800">
                备注<span className="text-zinc-400">（选填）</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => onNoteChange(e.target.value)}
                placeholder="记录一些个人想法或使用场景..."
                rows={4}
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>

            {/* 保存后提示（如 AI 未生成） */}
            {saveNotice && (
              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {saveNotice}
                <p className="mt-1 text-xs text-amber-600">
                  约 2 秒后自动跳转灵感库，或
                  <Link href="/vault" className="ml-1 font-medium underline">
                    立即前往
                  </Link>
                </p>
              </div>
            )}

            {/* Footer actions */}
            <div className="mt-10 flex flex-wrap items-center justify-end gap-3 border-t border-zinc-100 pt-8">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-xl border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={onSave}
                disabled={!canSave || saving}
                className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50"
              >
                {saving ? "拆解中…" : "保存并拆解"}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
