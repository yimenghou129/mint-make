import type {
  InspirationCard,
  InspirationInput,
  ReuseSuggestion,
} from "@/lib/types";

/**
 * 根据用户输入生成灵感卡片（亮点总结 + 可复用建议）。
 * MVP：用规则生成占位内容，后续可改为 AI 生成。
 */
export function buildInspirationCard(input: InspirationInput): InspirationCard {
  const reuse: ReuseSuggestion = {};
  if (input.likePoints.includes("标题")) {
    reuse.title = {
      type: "冲突感标题",
      template: "[痛点/反差] + [结果]",
      rewrites: [
        "为什么你一直…其实只要…",
        "别再…了，试试…",
        "…的人，都做了这一件事",
        "从…到…，我用了…",
        "…？这个办法可能颠覆你的认知",
      ],
    };
  }
  if (input.likePoints.includes("封面")) {
    reuse.cover = {
      structure: "大字+人脸/关键元素",
      copywriting: ["主标题 3-5 字", "副标题补充", "留白突出主体"],
    };
  }
  if (input.likePoints.includes("结构")) {
    reuse.structure = {
      skeleton: {
        opening: "钩子：痛点或悬念",
        body: "分点论证/故事",
        closing: "行动号召或金句收束",
      },
      reason: "适合干货与说服类内容",
    };
  }
  if (
    input.likePoints.some((p) =>
      ["转场", "调色", "特效"].includes(p)
    )
  ) {
    reuse.visual = "观察要点：节奏与视觉重点；可复用描述：保持一致性，服务情绪。";
  }

  const highlightSummary =
    input.likePoints.length > 0
      ? `用户标注的亮点：${input.likePoints.join("、")}。${input.note ?? ""}`.trim()
      : input.note ?? "暂无总结";

  return {
    id: `insp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    meta: input.meta,
    likePoints: input.likePoints,
    note: input.note,
    highlightSummary,
    reuseSuggestion: reuse,
    createdAt: new Date().toISOString(),
  };
}

export async function listInspirations(): Promise<InspirationCard[]> {
  try {
    const res = await fetch("/api/inspirations", { credentials: "include" });
    const data = (await res.json()) as { inspirations?: InspirationCard[] };
    return data.inspirations ?? [];
  } catch {
    return [];
  }
}

export async function getInspiration(id: string): Promise<InspirationCard | null> {
  const list = await listInspirations();
  return list.find((c) => c.id === id) ?? null;
}

export async function addInspiration(card: InspirationCard): Promise<void> {
  const res = await fetch("/api/inspirations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(card),
  });
  if (!res.ok) {
    const data = (await res.json()) as { error?: string };
    throw new Error(data.error ?? "保存失败");
  }
}
