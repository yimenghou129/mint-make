"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useAppStore } from "@/lib/store";
import { fetchYouTubeMeta } from "@/lib/services/youtube";
import { buildInspirationCard } from "@/lib/services/inspiration";
import { fetchAIBreakdown } from "@/lib/services/analyze";
import type { InspirationInput } from "@/lib/types";
import type { LikePoint } from "@/lib/types";
import { AddInspirationView } from "@/components/add/AddInspirationView";

export default function AddPage() {
  const router = useRouter();
  const { profile, addInspiration: addToStore } = useAppStore();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const [meta, setMeta] = useState<InspirationInput["meta"] | null>(null);
  const [likePoints, setLikePoints] = useState<LikePoint[]>([]);
  const [note, setNote] = useState("");

  const toggleLike = (p: LikePoint) => {
    setLikePoints((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const handleFetch = useCallback(async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setMeta(null);
    try {
      const result = await fetchYouTubeMeta(url.trim());
      if (result) setMeta(result);
      else setError("无法解析该 URL 或暂不支持");
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [url]);

  const handleSave = useCallback(async () => {
    if (!meta) return;
    setSaving(true);
    setSaveNotice(null);
    let aiFailed = false;
    try {
      const input: InspirationInput = { meta, likePoints, note: note || undefined };
      const card = buildInspirationCard(input);
      try {
        const aiBreakdown = await fetchAIBreakdown({
          meta,
          likePoints,
          note: note || undefined,
          profileSummary: profile?.summary
            ? profile.summary.topicKeywords.join("、") + "；" + (profile.summary.strategyHints?.[0] ?? "")
            : undefined,
        });
        card.aiBreakdown = aiBreakdown;
      } catch {
        aiFailed = true;
        setSaveNotice(
          "灵感已保存。AI 拆解因 API 额度限制未生成（OpenAI 配额已用尽），详情页将显示基础拆解。"
        );
      }
      await addToStore(card);
      if (aiFailed) {
        setTimeout(() => router.push("/vault"), 2200);
      } else {
        router.push("/vault");
      }
    } catch (err) {
      setSaveNotice(err instanceof Error ? err.message : "保存失败");
    } finally {
      setSaving(false);
    }
  }, [meta, likePoints, note, profile, addToStore, router]);

  const handleCancel = useCallback(() => {
    router.push("/vault");
  }, [router]);

  const canSave = !!meta && likePoints.length > 0;

  return (
    <AddInspirationView
      url={url}
      onUrlChange={setUrl}
      loading={loading}
      error={error}
      meta={meta}
      onFetch={handleFetch}
      likePoints={likePoints}
      onToggleLike={toggleLike}
      note={note}
      onNoteChange={setNote}
      onSave={handleSave}
      onCancel={handleCancel}
      canSave={canSave}
      saving={saving}
      saveNotice={saveNotice}
    />
  );
}
