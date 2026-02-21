"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { AppHeader } from "@/components/app-header/AppHeader";
import type { InspirationCard } from "@/lib/types";

function useCopy() {
  return useCallback((text: string) => {
    void navigator.clipboard?.writeText(text);
  }, []);
}

function CollapseSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-zinc-100 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left font-semibold text-zinc-900"
      >
        {title}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`shrink-0 transition ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

function CopyButton({ onCopy, text }: { onCopy: (t: string) => void; text: string }) {
  return (
    <button
      type="button"
      onClick={() => onCopy(text)}
      className="rounded p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
      title="复制"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    </button>
  );
}

interface DetailViewProps {
  card: InspirationCard;
}

export function DetailView({ card }: DetailViewProps) {
  const copy = useCopy();
  const addedDate = new Date(card.createdAt).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <div className="min-h-screen bg-white">
      <AppHeader />

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 lg:flex-row lg:gap-12 sm:px-6">
        {/* 左侧：灵感元数据 + 用户标签 */}
        <aside className="shrink-0 lg:w-80">
          <Link
            href="/vault"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-900"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            返回列表
          </Link>

          <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
            <div className="aspect-video w-full bg-zinc-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.meta.thumbnailUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-4">
              <h1 className="font-semibold text-zinc-900 line-clamp-2">
                {card.meta.title}
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                {card.meta.authorChannelName}
              </p>
              <p className="mt-1 text-xs text-zinc-400">{addedDate}</p>
              <a
                href={card.meta.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
              >
                查看原视频
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                </svg>
              </a>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium text-zinc-800">喜欢的方面</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {card.likePoints.map((p) => (
                <span
                  key={p}
                  className="rounded-full bg-zinc-100 px-3 py-1.5 text-sm text-zinc-700"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          <Link
            href="/find"
            className="mt-6 block w-full rounded-xl border border-zinc-200 py-3 text-center text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            寻找相似灵感
          </Link>
          <p className="mt-2 text-center text-xs text-zinc-400">
            会根据你选择的喜欢点与主题推荐
          </p>
        </aside>

        {/* 右侧：AI 拆解分析 */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-900">AI 拆解分析</h2>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
              已拆解
            </span>
          </div>

          <div className="mt-6 space-y-0 rounded-2xl border border-zinc-200 bg-white p-6">
            {/* 亮点摘要：优先 aiBreakdown.highlight，否则 highlightSummary */}
            <CollapseSection title="亮点摘要 Why it works" defaultOpen>
              <p className="text-sm leading-relaxed text-zinc-700">
                {card.aiBreakdown?.highlight?.summary ?? card.highlightSummary}
              </p>
              {card.aiBreakdown?.highlight?.coreHighlights && card.aiBreakdown.highlight.coreHighlights.length > 0 && (
                <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-zinc-600">
                  {card.aiBreakdown.highlight.coreHighlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              )}
              {card.aiBreakdown?.highlight?.whyForYou && (
                <p className="mt-3 text-sm text-zinc-600">{card.aiBreakdown.highlight.whyForYou}</p>
              )}
              {card.note && (
                <p className="mt-3 text-sm text-zinc-500">备注：{card.note}</p>
              )}
            </CollapseSection>

            {/* 标题套件：优先 aiBreakdown.titleKit，否则 reuseSuggestion.title */}
            {(card.aiBreakdown?.titleKit || card.reuseSuggestion.title) && (
              <CollapseSection title="标题套件 Title Kit" defaultOpen>
                {(() => {
                  const t = card.aiBreakdown?.titleKit ?? card.reuseSuggestion.title!;
                  const rewrites = "rewrites" in t ? t.rewrites : t.rewrites;
                  return (
                    <>
                      <p className="text-sm text-zinc-600">
                        <span className="font-medium text-zinc-800">标题类型：</span>
                        {t.type}
                      </p>
                      <div className="mt-3 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm text-white">
                        {t.template}
                      </div>
                      {"whyEffective" in t && t.whyEffective && t.whyEffective.length > 0 && (
                        <ul className="mt-3 list-inside list-disc text-sm text-zinc-600">
                          {t.whyEffective.map((w, i) => (
                            <li key={i}>{w}</li>
                          ))}
                        </ul>
                      )}
                      <p className="mt-4 text-xs font-medium text-zinc-500">同风格标题改写</p>
                      <ul className="mt-2 space-y-2">
                        {rewrites.map((r, i) => (
                          <li key={i} className="flex items-center justify-between gap-2 text-sm text-zinc-700">
                            <span className="min-w-0 flex-1">{r}</span>
                            <CopyButton onCopy={copy} text={r} />
                          </li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        onClick={() => copy(rewrites.join("\n"))}
                        className="mt-2 text-xs font-medium text-zinc-500 hover:text-zinc-700"
                      >
                        Copy all
                      </button>
                    </>
                  );
                })()}
              </CollapseSection>
            )}

            {/* 封面套件 */}
            {(card.aiBreakdown?.coverKit || card.reuseSuggestion.cover) && (
              <CollapseSection title="封面套件 Cover Kit" defaultOpen>
                {card.aiBreakdown?.coverKit ? (
                  <>
                    <p className="text-sm text-zinc-600">
                      <span className="font-medium text-zinc-800">封面结构：</span>
                      {card.aiBreakdown.coverKit.structure}
                    </p>
                    <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-zinc-600">
                      {card.aiBreakdown.coverKit.layoutTips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-zinc-600">
                      <span className="font-medium text-zinc-800">封面结构：</span>
                      {card.reuseSuggestion.cover!.structure}
                    </p>
                    <p className="mt-3 text-xs font-medium text-zinc-500">排版建议</p>
                    <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-zinc-600">
                      {card.reuseSuggestion.cover!.copywriting.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </>
                )}
              </CollapseSection>
            )}

            {/* 结构套件 */}
            {(card.aiBreakdown?.structureKit || card.reuseSuggestion.structure) && (
              <CollapseSection title="结构套件 Structure Kit" defaultOpen>
                {card.aiBreakdown?.structureKit ? (
                  <>
                    <p className="text-sm text-zinc-600">
                      <span className="font-medium text-zinc-800">结构类型：</span>
                      {card.aiBreakdown.structureKit.type}
                    </p>
                    <div className="mt-3 space-y-3 rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 text-sm">
                      <div>
                        <span className="font-medium text-zinc-700">开场：</span>
                        <span className="text-zinc-600">{card.aiBreakdown.structureKit.skeleton.opening}</span>
                      </div>
                      <div>
                        <span className="font-medium text-zinc-700">主体：</span>
                        <span className="text-zinc-600">{card.aiBreakdown.structureKit.skeleton.body}</span>
                      </div>
                      <div>
                        <span className="font-medium text-zinc-700">收束：</span>
                        <span className="text-zinc-600">{card.aiBreakdown.structureKit.skeleton.closing}</span>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-zinc-600">
                      <span className="font-medium text-zinc-800">适用原因：</span>
                      {card.aiBreakdown.structureKit.reason}
                    </p>
                    {card.aiBreakdown.structureKit.openingHooks && card.aiBreakdown.structureKit.openingHooks.length > 0 && (
                      <>
                        <p className="mt-4 text-xs font-medium text-zinc-500">开场钩子备选</p>
                        <ul className="mt-2 space-y-2">
                          {card.aiBreakdown.structureKit.openingHooks.map((h, i) => (
                            <li key={i} className="flex items-center justify-between gap-2 text-sm text-zinc-700">
                              <span>{h}</span>
                              <CopyButton onCopy={copy} text={h} />
                            </li>
                          ))}
                        </ul>
                        <button
                          type="button"
                          onClick={() => copy(card.aiBreakdown!.structureKit!.openingHooks!.join("\n"))}
                          className="mt-2 text-xs font-medium text-zinc-500 hover:text-zinc-700"
                        >
                          Copy all
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-zinc-800">三段骨架</p>
                    <div className="mt-3 space-y-3 rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 text-sm">
                      <div>
                        <span className="font-medium text-zinc-700">开场：</span>
                        <span className="text-zinc-600">{card.reuseSuggestion.structure!.skeleton.opening}</span>
                      </div>
                      <div>
                        <span className="font-medium text-zinc-700">主体：</span>
                        <span className="text-zinc-600">{card.reuseSuggestion.structure!.skeleton.body}</span>
                      </div>
                      <div>
                        <span className="font-medium text-zinc-700">收束：</span>
                        <span className="text-zinc-600">{card.reuseSuggestion.structure!.skeleton.closing}</span>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-zinc-600">
                      <span className="font-medium text-zinc-800">适用原因：</span>
                      {card.reuseSuggestion.structure!.reason}
                    </p>
                  </>
                )}
              </CollapseSection>
            )}

            {/* 表达金句：优先 aiBreakdown.expression，否则占位 */}
            <CollapseSection title="表达金句 Expression" defaultOpen>
              {card.aiBreakdown?.expression ? (
                <>
                  <p className="text-xs font-medium text-zinc-500">可复制金句</p>
                  <ul className="mt-2 space-y-2 text-sm text-zinc-700">
                    {card.aiBreakdown.expression.phrases.map((line, i) => (
                      <li key={i} className="flex items-center justify-between gap-2">
                        <span>{line}</span>
                        <CopyButton onCopy={copy} text={line} />
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs font-medium text-zinc-500">表达技法</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {card.aiBreakdown.expression.techniques.map((t) => (
                      <span key={t} className="rounded-lg bg-zinc-100 px-3 py-1.5 text-sm text-zinc-700">
                        {t}
                      </span>
                    ))}
                  </div>
                  {card.aiBreakdown.expression.toneSuggestions && card.aiBreakdown.expression.toneSuggestions.length > 0 && (
                    <>
                      <p className="mt-4 text-xs font-medium text-zinc-500">语气节奏建议</p>
                      <ul className="mt-2 list-inside list-disc text-sm text-zinc-600">
                        {card.aiBreakdown.expression.toneSuggestions.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </>
              ) : (
                <>
                  <p className="text-xs font-medium text-zinc-500">可复制金句</p>
                  <ul className="mt-2 space-y-2 text-sm text-zinc-700">
                    {["成功不是偶然，而是系统化的结果", "不要等完美，先开始再优化"].map((line, i) => (
                      <li key={i} className="flex items-center justify-between gap-2">
                        <span>{line}</span>
                        <CopyButton onCopy={copy} text={line} />
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs font-medium text-zinc-500">表达技法</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["对比强化", "金句植入", "口语化表达"].map((t) => (
                      <span key={t} className="rounded-lg bg-zinc-100 px-3 py-1.5 text-sm text-zinc-700">
                        {t}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </CollapseSection>

            {/* 视觉制作：优先 aiBreakdown.visualNotes，否则 reuseSuggestion.visual */}
            {(card.aiBreakdown?.visualNotes || card.reuseSuggestion.visual) && (
              <CollapseSection title="视觉制作 Visual Notes" defaultOpen>
                {card.aiBreakdown?.visualNotes ? (
                  <div className="space-y-4 text-sm text-zinc-600">
                    {card.aiBreakdown.visualNotes.editingRhythm && card.aiBreakdown.visualNotes.editingRhythm.length > 0 && (
                      <div>
                        <p className="font-medium text-zinc-800">剪辑节奏观察</p>
                        <ul className="mt-1 list-inside list-disc">
                          {card.aiBreakdown.visualNotes.editingRhythm.map((e, i) => (
                            <li key={i}>{e}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {card.aiBreakdown.visualNotes.transitions && card.aiBreakdown.visualNotes.transitions.length > 0 && (
                      <div>
                        <p className="font-medium text-zinc-800">转场观察</p>
                        <ul className="mt-1 list-inside list-disc">
                          {card.aiBreakdown.visualNotes.transitions.map((t, i) => (
                            <li key={i}>{t}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {card.aiBreakdown.visualNotes.colorAtmosphere && card.aiBreakdown.visualNotes.colorAtmosphere.length > 0 && (
                      <div>
                        <p className="font-medium text-zinc-800">色彩氛围</p>
                        <ul className="mt-1 list-inside list-disc">
                          {card.aiBreakdown.visualNotes.colorAtmosphere.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {card.aiBreakdown.visualNotes.reusableTips && card.aiBreakdown.visualNotes.reusableTips.length > 0 && (
                      <div>
                        <p className="font-medium text-zinc-800">可复用提示</p>
                        <ul className="mt-1 list-inside list-disc">
                          {card.aiBreakdown.visualNotes.reusableTips.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-600">
                    {card.reuseSuggestion.visual}
                  </p>
                )}
              </CollapseSection>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
