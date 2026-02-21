import type { AIBreakdown } from "@/lib/types";
import type { YouTubeMeta } from "@/lib/types";

export const maxDuration = 30;

type Body = {
  meta: YouTubeMeta;
  likePoints: string[];
  note?: string;
  profileSummary?: string;
};

function buildPrompt(body: Body): string {
  const { meta, likePoints, note, profileSummary } = body;
  return `你是一个短视频/自媒体内容分析助手。根据以下灵感信息，输出一份结构化的「AI 拆解分析」JSON，用于展示在灵感卡片详情页。只输出合法 JSON，不要 markdown 包裹或解释。

## 输入
- 视频标题：${meta.title}
- 频道：${meta.authorChannelName}
- 描述：${meta.description ?? "（无）"}
- 用户标注的喜欢点：${likePoints.join("、")}
- 用户备注：${note ?? "（无）"}
${profileSummary ? `- 用户创作档案摘要：${profileSummary}` : ""}

## 输出 JSON 结构（必须严格符合，字段名用英文）
{
  "highlight": {
    "summary": "一段话总结这个视频为什么有效、做对了什么（结合用户喜欢的点）",
    "coreHighlights": ["亮点1", "亮点2", "亮点3"],
    "whyForYou": "根据用户档案说明为什么适合他借鉴（若无档案可省略或简短泛化）"
  },
  "titleKit": {
    "type": "标题类型简述",
    "template": "可套用的模板公式",
    "rewrites": ["同风格改写1", "同风格改写2", "同风格改写3", "同风格改写4", "同风格改写5"],
    "whyEffective": ["有效原因1", "有效原因2", "有效原因3"]
  },
  "coverKit": {
    "structure": "封面结构类型简述",
    "layoutTips": ["排版建议1", "排版建议2", "排版建议3"]
  },
  "structureKit": {
    "type": "结构类型简述",
    "skeleton": {
      "opening": "开场（前10%）要点",
      "body": "主体（中间70-80%）要点",
      "closing": "收束（最后10-20%）要点"
    },
    "reason": "适用原因一句话",
    "openingHooks": ["开场钩子备选1", "开场钩子备选2", "开场钩子备选3"]
  },
  "expression": {
    "phrases": ["可复制金句1", "可复制金句2"],
    "techniques": ["表达技法1", "表达技法2", "表达技法3"],
    "toneSuggestions": ["语气节奏建议1", "语气节奏建议2"]
  },
  "visualNotes": {
    "editingRhythm": ["剪辑节奏观察1", "剪辑节奏观察2"],
    "transitions": ["转场观察1", "转场观察2"],
    "colorAtmosphere": ["色彩氛围1", "色彩氛围2"],
    "reusableTips": ["可复用提示1", "可复用提示2"]
  }
}

请直接输出上述 JSON，不要包含 \`\`\`json 等标记。`;
}

async function callOpenAI(prompt: string): Promise<AIBreakdown> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set. Add it to .env.local to enable AI breakdown.");
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "你只输出合法 JSON，不输出任何其他文字。确保 JSON 可被 JSON.parse 解析。",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error: ${res.status} ${err}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("Empty response from OpenAI");

  // 去掉可能的 markdown 代码块
  const jsonStr = content.replace(/^```(?:json)?\s*|\s*```$/g, "").trim();
  return JSON.parse(jsonStr) as AIBreakdown;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    if (!body.meta?.title || !Array.isArray(body.likePoints)) {
      return Response.json(
        { error: "Missing meta or likePoints" },
        { status: 400 }
      );
    }

    const prompt = buildPrompt(body);
    const aiBreakdown = await callOpenAI(prompt);
    return Response.json({ aiBreakdown });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[analyze-inspiration]", message);
    return Response.json(
      { error: message },
      { status: message.includes("OPENAI_API_KEY") ? 501 : 500 }
    );
  }
}
