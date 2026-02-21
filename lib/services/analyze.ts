import type { AIBreakdown } from "@/lib/types";
import type { YouTubeMeta } from "@/lib/types";

export interface AnalyzeRequestBody {
  meta: YouTubeMeta;
  likePoints: string[];
  note?: string;
  profileSummary?: string;
}

/**
 * 调用服务端 AI 拆解接口，返回 aiBreakdown。保存灵感时在 Add 页调用，将结果赋给 card.aiBreakdown 再写入 store。
 */
export async function fetchAIBreakdown(body: AnalyzeRequestBody): Promise<AIBreakdown> {
  const res = await fetch("/api/analyze-inspiration", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as { aiBreakdown?: AIBreakdown; error?: string };
  if (!res.ok) {
    throw new Error(data.error ?? `Request failed: ${res.status}`);
  }
  if (!data.aiBreakdown) {
    throw new Error("No aiBreakdown in response");
  }
  return data.aiBreakdown;
}
