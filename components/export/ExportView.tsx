"use client";

import { AppHeader } from "@/components/app-header/AppHeader";
import type { InspirationCard } from "@/lib/types";

const PROFILE_KEY = "mint-make:creator-profile";
const INSPIRATIONS_KEY = "mint-make:inspirations";

function escapeCsvCell(s: string): string {
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function buildCsv(inspirations: InspirationCard[]): string {
  const header = "标题,作者,发布日期,原始视频链接,喜欢的方式,个人备注,收藏时间";
  const rows = inspirations.map((c) =>
    [
      c.meta.title,
      c.meta.authorChannelName,
      c.meta.publishedAt ?? "",
      c.meta.url,
      c.likePoints.join("；"),
      c.note ?? "",
      c.createdAt.slice(0, 19),
    ]
      .map(escapeCsvCell)
      .join(",")
  );
  return "\uFEFF" + header + "\n" + rows.join("\n");
}

function downloadCsv(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

interface ExportViewProps {
  inspirations: InspirationCard[];
  onExportCsv: () => void;
  onDeleteAll: () => void;
}

function StatCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="shrink-0 text-zinc-500">{icon}</div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-zinc-900">{title}</h3>
          <p className="mt-1 text-sm text-zinc-500">{description}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

export function ExportView({
  inspirations,
  onExportCsv,
  onDeleteAll,
}: ExportViewProps) {
  const count = inspirations.length;
  const thisMonth = inspirations.filter((c) => {
    const t = new Date(c.createdAt);
    const now = new Date();
    return t.getMonth() === now.getMonth() && t.getFullYear() === now.getFullYear();
  }).length;
  const withHook = inspirations.filter((c) => c.likePoints.includes("开场钩子")).length;

  const handleExportCsv = () => {
    const csv = buildCsv(inspirations);
    downloadCsv(csv, `mint-make-灵感库-${new Date().toISOString().slice(0, 10)}.csv`);
    onExportCsv();
  };

  return (
    <div className="min-h-screen bg-white">
      <AppHeader />

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          导出与设置
        </h1>
        <p className="mt-1 text-sm text-zinc-500">管理你的灵感数据</p>

        <div className="mt-8 space-y-6">
          {/* 导出数据 */}
          <StatCard
            icon={
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-600">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
            }
            title="导出数据"
            description="将你的灵感库导出为 CSV 文件"
          >
            <div className="mt-4 text-sm text-zinc-600">
              <p className="font-medium text-zinc-800">导出字段包含:</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>标题、作者、发布日期</li>
                <li>原始视频链接</li>
                <li>喜欢的方式（标签）</li>
                <li>个人备注</li>
                <li>收藏时间</li>
              </ul>
            </div>
            <button
              type="button"
              onClick={handleExportCsv}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              导出 CSV（{count}条）
            </button>
          </StatCard>

          {/* Notion 同步 */}
          <StatCard
            icon={
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
              </svg>
            }
            title="Notion 同步"
            description="将灵感自动同步到 Notion 数据库"
          >
            <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />
              </svg>
              <span>Coming Soon 此功能正在开发中，敬请期待</span>
            </div>
            <button
              type="button"
              disabled
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 py-3 text-sm font-medium text-zinc-400 cursor-not-allowed"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              连接 Notion
            </button>
          </StatCard>

          {/* 数据与隐私 */}
          <StatCard
            icon={
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            }
            title="数据与隐私"
            description="删除所有数据并重置应用"
          >
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="font-semibold text-red-800">危险操作</p>
              <p className="mt-1 text-sm text-red-700">
                删除后无法恢复，请确保已导出重要数据
              </p>
            </div>
            <button
              type="button"
              onClick={onDeleteAll}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-medium text-white transition hover:bg-red-700"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
              删除所有数据
            </button>
          </StatCard>

          {/* 使用统计 */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-zinc-900">使用统计</h3>
            <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-zinc-900">{count}</p>
                <p className="mt-1 text-xs text-zinc-500">收藏灵感</p>
              </div>
              <div className="border-l border-zinc-100 text-center sm:border-l">
                <p className="text-2xl font-bold text-zinc-900">{withHook}</p>
                <p className="mt-1 text-xs text-zinc-500">开场钩子</p>
              </div>
              <div className="border-l border-zinc-100 text-center">
                <p className="text-2xl font-bold text-zinc-900">{thisMonth}</p>
                <p className="mt-1 text-xs text-zinc-500">本月新增</p>
              </div>
              <div className="border-l border-zinc-100 text-center">
                <p className="text-2xl font-bold text-zinc-900">—</p>
                <p className="mt-1 text-xs text-zinc-500">使用天数</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
