import type { YouTubeMeta } from "@/lib/types";

/**
 * 根据 URL 抓取视频元数据。
 * MVP：先返回 mock，后续接真实抓取或 oEmbed/API。
 */
export async function fetchYouTubeMeta(url: string): Promise<YouTubeMeta | null> {
  // 简单校验是否为 YouTube URL
  if (
    !url.includes("youtube.com") &&
    !url.includes("youtu.be")
  ) {
    return null;
  }

  // TODO: 真实实现（服务端抓取 / oEmbed / 无头等）
  // 当前返回 mock 以便先跑通流程
  const id = extractVideoId(url) ?? "mock-id";
  return {
    url,
    title: `[Mock] 视频标题 ${id}`,
    authorChannelName: "[Mock] 频道名",
    thumbnailUrl: `https://img.youtube.com/vi/${id}/mqdefault.jpg`,
    publishedAt: new Date().toISOString().slice(0, 10),
    description: "Mock 描述，用于测试流程。",
    duration: "10:00",
    viewCount: "1.2k",
  };
}

function extractVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1) || null;
    return u.searchParams.get("v");
  } catch {
    return null;
  }
}
