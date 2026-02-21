/**
 * 用户建档（Creator Profile）领域类型
 * 与 PRD 4.1 对齐，与 UI 无关
 */

export const CONTENT_FIELDS = [
  "AI工具",
  "终身学习",
  "读书",
  "生活方式",
  "其他",
] as const;
export const PLATFORMS = ["YouTube", "小红书", "B站"] as const;
export const OUTPUT_FORMATS = [
  "横版口播",
  "竖版短视频",
  "图文",
] as const;
export const STYLE_KEYWORDS = [
  "克制",
  "犀利",
  "温柔",
  "学术",
  "幽默",
  "故事化",
  "高能快节奏",
  "生活化",
  "反差感",
] as const;

export type ContentField = (typeof CONTENT_FIELDS)[number];
export type Platform = (typeof PLATFORMS)[number];
export type OutputFormat = (typeof OUTPUT_FORMATS)[number];
export type StyleKeyword = (typeof STYLE_KEYWORDS)[number];

export interface CreatorProfileForm {
  contentFields: ContentField[];
  platforms: Platform[];
  outputFormats: OutputFormat[];
  description: string;
  styleKeywords?: StyleKeyword[];
  youtubeChannelUrl?: string;
}

/** 系统生成的创作者画像摘要（可编辑） */
export interface ProfileSummary {
  topicKeywords: string[];
  dimensionWeights: Record<string, number>;
  strategyHints: string[];
}

export interface CreatorProfile extends CreatorProfileForm {
  id: string;
  summary?: ProfileSummary;
  updatedAt: string;
}
