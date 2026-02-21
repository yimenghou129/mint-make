"use client";

import Link from "next/link";
import { useState } from "react";
import type {
  ContentField,
  Platform,
  OutputFormat,
  StyleKeyword,
} from "@/lib/types";
import {
  CONTENT_FIELDS,
  PLATFORMS,
  OUTPUT_FORMATS,
  STYLE_KEYWORDS,
} from "@/lib/types";

const LeafIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    className="text-zinc-800"
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

function ChipSection<T extends string>({
  label,
  required,
  options,
  value,
  onToggle,
}: {
  label: string;
  required?: boolean;
  options: readonly T[];
  value: T[];
  onToggle: (item: T) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={`rounded-lg px-4 py-2.5 text-sm font-medium transition ${
              value.includes(opt)
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export interface OnboardingFormState {
  contentFields: ContentField[];
  platforms: Platform[];
  outputFormats: OutputFormat[];
  description: string;
  styleKeywords: StyleKeyword[];
  youtubeChannelUrl: string;
}

interface OnboardingViewProps {
  form: OnboardingFormState;
  onFieldChange: <K extends keyof OnboardingFormState>(
    field: K,
    value: OnboardingFormState[K]
  ) => void;
  onToggle: <T extends string>(
    field: "contentFields" | "platforms" | "outputFormats" | "styleKeywords",
    item: T
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  canSubmit: boolean;
  saving?: boolean;
  submitError?: string | null;
  backHref: string;
}

export function OnboardingView({
  form,
  onFieldChange,
  onToggle,
  onSubmit,
  canSubmit,
  saving = false,
  submitError = null,
  backHref,
}: OnboardingViewProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-xl px-6 py-8">
        {/* Back */}
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-900"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          返回
        </Link>

        {/* Title block */}
        <div className="mt-8 flex flex-col items-center text-center">
          <LeafIcon />
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            建立你的创作档案
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-600">
            帮助我们更好地为你推荐和分析灵感。这些信息会用来个性化你的拆解与推荐，之后随时可以修改。
          </p>
        </div>

        {/* Form card */}
        <form onSubmit={onSubmit} className="mt-8">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-8">
            <div className="space-y-6">
              <ChipSection
                label="内容领域"
                required
                options={CONTENT_FIELDS}
                value={form.contentFields}
                onToggle={(item) =>
                  onToggle("contentFields", item as ContentField)
                }
              />
              <ChipSection
                label="平台偏好"
                required
                options={PLATFORMS}
                value={form.platforms}
                onToggle={(item) => onToggle("platforms", item as Platform)}
              />
              <ChipSection
                label="输出形式"
                options={OUTPUT_FORMATS}
                value={form.outputFormats}
                onToggle={(item) =>
                  onToggle("outputFormats", item as OutputFormat)
                }
              />

              {/* 进阶定制：可折叠 */}
              <div className="border-t border-zinc-100 pt-6">
                <button
                  type="button"
                  onClick={() => setAdvancedOpen(!advancedOpen)}
                  className="flex w-full items-center justify-between text-left text-sm font-medium text-zinc-700"
                >
                  <span>进阶定制</span>
                  <span className="text-zinc-400">
                    （可选，稍后也能填）
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`shrink-0 transition ${advancedOpen ? "rotate-180" : ""}`}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {advancedOpen && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-500">
                        风格关键词（选 3–5 个）
                      </label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {STYLE_KEYWORDS.map((k) => (
                          <button
                            key={k}
                            type="button"
                            onClick={() =>
                              onToggle("styleKeywords", k as StyleKeyword)
                            }
                            className={`rounded-lg px-3 py-1.5 text-sm ${
                              form.styleKeywords.includes(k as StyleKeyword)
                                ? "bg-zinc-900 text-white"
                                : "bg-zinc-100 text-zinc-600"
                            }`}
                          >
                            {k}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-500">
                        博主类型与内容描述（1–3 句）
                      </label>
                      <textarea
                        value={form.description}
                        onChange={(e) =>
                          onFieldChange("description", e.target.value)
                        }
                        required
                        rows={3}
                        placeholder="例：我做 AI 工具与学习方法内容，偏干货…"
                        className="mt-2 w-full rounded-lg border border-zinc-200 bg-zinc-50/50 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-500">
                        YouTube Channel 链接
                      </label>
                      <input
                        type="url"
                        value={form.youtubeChannelUrl}
                        onChange={(e) =>
                          onFieldChange("youtubeChannelUrl", e.target.value)
                        }
                        placeholder="https://youtube.com/@..."
                        className="mt-2 w-full rounded-lg border border-zinc-200 bg-zinc-50/50 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                      />
                    </div>
                  </div>
                )}
                {!advancedOpen && (
                  <p className="mt-2 text-xs text-zinc-400">
                    风格关键词、博主描述、频道链接
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Validation + Submit */}
          <div className="mt-6 flex flex-col items-center">
            {submitError && (
              <p className="mb-2 text-sm text-red-600">{submitError}</p>
            )}
            {!canSubmit && !submitError && (
              <p className="mb-2 text-sm text-zinc-500">
                请选择内容领域与平台偏好，并填写博主描述
              </p>
            )}
            <button
              type="submit"
              disabled={!canSubmit || saving}
              className="w-full max-w-sm rounded-xl py-3.5 text-base font-medium transition sm:max-w-md disabled:bg-zinc-300 disabled:text-zinc-500 enabled:bg-zinc-900 enabled:text-white enabled:hover:bg-zinc-800"
            >
              {saving ? "保存中…" : "保存档案"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
