import type { InspirationCard, FindCardType, GeneratedPlan } from "@/lib/types";

export type { FindCardType };

/**
 * 根据卡点类型从灵感库中筛选推荐（MVP：按喜欢点匹配，后续可改为 embedding 相似度）
 */
export function getRecommendedInspirations(
  inspirations: InspirationCard[],
  cardType: FindCardType
): InspirationCard[] {
  return inspirations.filter((c) => c.likePoints.includes(cardType));
}

/**
 * MVP：返回静态生成方案示例，后续可改为 AI 生成
 */
export function getGeneratedPlans(
  _query: string,
  cardType: FindCardType
): GeneratedPlan[] {
  const byType: Record<FindCardType, GeneratedPlan[]> = {
    封面: [
      {
        id: "plan-1",
        title: "终身学习从认知升级开始",
        description:
          "左侧大标题+右侧书籍堆叠图，使用深蓝渐变背景，标题白色粗体",
      },
      {
        id: "plan-2",
        title: "构建你的知识复利系统",
        description:
          "中心对称，上方标题下方线性图标，极简黑白配色+一抹橙色点缀",
      },
      {
        id: "plan-3",
        title: "学习方法论实战指南",
        description:
          "左右分屏，左侧文字右侧人物阅读特写，温暖色调营造亲和感",
      },
    ],
    标题: [
      {
        id: "plan-1",
        title: "为什么你一直…其实只要…",
        description: "痛点+反差结构，适合干货与认知类内容",
      },
      {
        id: "plan-2",
        title: "别再…了，试试…",
        description: "否定旧习惯+新方案，适合方法类",
      },
      {
        id: "plan-3",
        title: "…的人，都做了这一件事",
        description: "群体认同+单一行动，适合总结与清单",
      },
    ],
    结构: [
      {
        id: "plan-1",
        title: "钩子—分点—金句收束",
        description: "开场抛痛点或悬念，中间 3 点论证，结尾行动号召或金句",
      },
      {
        id: "plan-2",
        title: "故事—方法—升华",
        description: "个人经历引入，提炼可复用方法，最后升华到更大主题",
      },
      {
        id: "plan-3",
        title: "问题—原因—方案",
        description: "直击问题，拆解原因，给出可执行方案与步骤",
      },
    ],
  };
  return byType[cardType] ?? byType.封面;
}
