# AI 拆解分析实现方案

## 目标

把详情页右侧「AI 拆解分析」从**规则占位**改为**真实 AI 生成**，包含：亮点摘要、标题套件、封面套件、结构套件、表达金句、视觉制作。

---

## 一、数据流

```
用户保存灵感 (Add)                    用户打开详情 (Detail)
        │                                      │
        ▼                                      ▼
 buildInspirationCard()               getInspiration(id)
        │                                      │
        ▼                                      │
 调用 AI 分析 API ◄───────────────────────────┘
 (或延后到首次查看时调用)                   若尚无 aiAnalysis，可触发分析
        │                                      │
        ▼                                      ▼
 合并结果写入 card.aiAnalysis           展示 aiAnalysis / 规则兜底
        │
        ▼
 存入 store + localStorage
```

**两种时机：**

| 时机 | 做法 | 优点 | 缺点 |
|------|------|------|------|
| **保存时** | 在 Add 页点击「保存并拆解」后调用 API，拿到结果再写入卡片 | 详情页打开即完整展示，无等待 | 保存需等几秒；需在服务端调 API |
| **查看时** | 打开详情页时若没有 aiAnalysis 则调 API，结果缓存到卡片 | 保存快；按需算力 | 首次打开详情需等待加载 |

推荐：**保存时**调用（与按钮「保存并拆解」语义一致），详情页只读已存数据；可选在详情页加「重新拆解」触发二次分析。

---

## 二、类型扩展（存 AI 返回结果）

在 `lib/types/inspiration.ts` 中增加 `AIBreakdown`，并在 `InspirationCard` 上增加可选字段 `aiBreakdown?: AIBreakdown`。  
这样现有 `highlightSummary` / `reuseSuggestion` 仍可作为规则兜底，AI 有结果时优先展示 `aiBreakdown`。

（见下方「已添加类型」）

---

## 三、API 设计

### 3.1 请求

- **路由**：`POST /api/analyze-inspiration`
- **Body**：`{ meta, likePoints, note?, profileSummary? }`  
  - `profileSummary` 可选，用于「为什么适合你」等个性化句子。
- **响应**：`{ aiBreakdown: AIBreakdown }`，或 `{ error: string }`。

### 3.2 调用方

- **保存时**：Add 页在 `buildInspirationCard(input)` 之后，请求 `POST /api/analyze-inspiration`，把返回的 `aiBreakdown` 赋给 `card.aiBreakdown`，再 `addToStore(card)`。
- **查看时（可选）**：Detail 页若 `!card.aiBreakdown` 且需要「首次自动分析」，可请求同一 API，用返回结果更新 store 中该条并写回 localStorage。

---

## 四、Prompt 设计要点

给大模型的输入建议包含：

- **视频信息**：标题、作者、描述（若有）、用户备注。
- **用户偏好**：`likePoints`（如 开场钩子、调色），便于突出「为什么这个点做得好」。
- **输出格式**：严格要求 JSON，对应 `AIBreakdown` 各字段（亮点摘要、标题类型/模板/改写、封面结构/排版、结构骨架/开场钩子备选、表达金句/技法/语气建议、视觉观察/可复用提示）。

可在 API 内用 `JSON.parse` + 校验，失败时返回 500 或重试。

---

## 五、环境与安全

- **API Key**：在服务端使用（如 `OPENAI_API_KEY` 或 `ANTHROPIC_API_KEY`），仅写在 `process.env`，不要下发给前端。
- **限流**：按用户或 IP 限制调用频率，避免滥用。
- **降级**：API 超时或失败时，保存/详情仍使用当前规则生成的 `highlightSummary` + `reuseSuggestion`，不阻塞用户。

---

## 六、实现清单

- [x] 在 `lib/types/inspiration.ts` 增加 `AIBreakdown` 与 `InspirationCard.aiBreakdown`。
- [x] 新增 `app/api/analyze-inspiration/route.ts`，接收 body，调 OpenAI，返回 `aiBreakdown`。
- [x] 新增 `lib/services/analyze.ts` 的 `fetchAIBreakdown(body)`，供 Add 页调用。
- [x] Detail 页：优先渲染 `card.aiBreakdown`，若无则用现有 `highlightSummary` + `reuseSuggestion`。
- [x] **Add 页**：保存时先 `buildInspirationCard(input)`，再 `await fetchAIBreakdown(...)`，将返回的 `aiBreakdown` 赋给 `card.aiBreakdown`，最后 `addToStore(card)`。API 失败时仍保存卡片，详情页用规则兜底。
- [ ] （可选）详情页「重新拆解」按钮：再次调用 API 并更新该卡片的 `aiBreakdown`。

## 七、本地开启 AI 拆解

1. 在项目根目录创建 `.env.local`，添加：
   ```bash
   OPENAI_API_KEY=sk-xxx
   ```
2. 重启 `npm run dev`。
3. 在 Add 页添加一条灵感并点击「保存并拆解」时，在 Add 页逻辑中调用 `fetchAIBreakdown` 并将结果写入卡片（见上方清单），保存后打开详情页即可看到 AI 生成的拆解内容。

未配置 API Key 或接口失败时，详情页仍显示规则生成的兜底内容。

**常见错误 429 (insufficient_quota)**：表示 OpenAI 账号额度已用尽。解决方式：
1. 登录 [OpenAI Platform](https://platform.openai.com) → Billing → 绑定付款方式或充值。
2. 或改用其他模型：在 `app/api/analyze-inspiration/route.ts` 中接入 Claude / 国内大模型等，并设置对应环境变量。
