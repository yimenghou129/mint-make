/** 寻找灵感页的卡点选项 */
export type FindCardType = "封面" | "标题" | "结构";

/** 生成方案（MVP 为规则/示例，后续可改为 AI 生成） */
export interface GeneratedPlan {
  id: string;
  title: string;
  description: string;
}
