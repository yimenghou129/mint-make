/**
 * 灵感录入（Inspiration Card）领域类型
 * 与 PRD 4.2 对齐，与 UI 无关
 */

/** 用户标注的「喜欢点」 */
export const LIKE_POINTS_STRATEGY = [
  "标题",
  "开场钩子",
  "结构",
  "表达金句",
] as const;
export const LIKE_POINTS_VISUAL = [
  "封面",
  "转场",
  "调色",
  "特效",
] as const;
export const LIKE_POINTS = [
  ...LIKE_POINTS_STRATEGY,
  ...LIKE_POINTS_VISUAL,
] as const;

export type LikePoint = (typeof LIKE_POINTS)[number];

/** 从 URL 抓取到的元数据 */
export interface YouTubeMeta {
  url: string;
  title: string;
  authorChannelName: string;
  thumbnailUrl: string;
  publishedAt?: string;
  description?: string;
  duration?: string;
  viewCount?: string;
}

/** 用户标注 + 可选备注 */
export interface InspirationInput {
  meta: YouTubeMeta;
  likePoints: LikePoint[];
  note?: string;
}

/** 系统生成的可复用建议（按维度） */
export interface ReuseSuggestion {
  title?: {
    type: string;
    template: string;
    rewrites: string[];
  };
  cover?: {
    structure: string;
    copywriting: string[];
  };
  structure?: {
    skeleton: { opening: string; body: string; closing: string };
    reason: string;
  };
  visual?: string;
}

/**
 * AI 拆解分析返回结构（与详情页右侧各区块对应）
 * 由 /api/analyze-inspiration 生成，存于 card.aiBreakdown
 */
export interface AIBreakdown {
  /** 亮点摘要 Why it works */
  highlight: {
    summary: string;
    coreHighlights?: string[];
    whyForYou?: string;
  };
  /** 标题套件 */
  titleKit?: {
    type: string;
    template: string;
    rewrites: string[];
    whyEffective?: string[];
  };
  /** 封面套件 */
  coverKit?: {
    structure: string;
    layoutTips: string[];
  };
  /** 结构套件 */
  structureKit?: {
    type: string;
    skeleton: { opening: string; body: string; closing: string };
    reason: string;
    openingHooks?: string[];
  };
  /** 表达金句 */
  expression?: {
    phrases: string[];
    techniques: string[];
    toneSuggestions?: string[];
  };
  /** 视觉制作 */
  visualNotes?: {
    editingRhythm?: string[];
    transitions?: string[];
    colorAtmosphere?: string[];
    reusableTips?: string[];
  };
}

export interface InspirationCard {
  id: string;
  meta: YouTubeMeta;
  likePoints: LikePoint[];
  note?: string;
  /** 亮点总结（规则生成兜底） */
  highlightSummary: string;
  /** 可复用建议（规则生成兜底） */
  reuseSuggestion: ReuseSuggestion;
  /** AI 拆解分析结果，有则详情页优先展示 */
  aiBreakdown?: AIBreakdown;
  /** 预留：embedding 用于 Find 推荐 */
  embedding?: number[];
  createdAt: string;
}
