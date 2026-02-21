# 架构说明：逻辑与 UI 分离

## 目标

- **现在**：先把底层逻辑和架构打起来，验证数据流与核心流程能跑通，暴露技术风险。
- **未来**：Figma 设计大改时，只替换「视图层」，不重写业务逻辑。

## 原则：UI 可替换

```
┌─────────────────────────────────────────────────────────┐
│  app/ (路由 + 页面壳)                                    │
│  - 只做：路由、组合 hooks/服务、渲染当前 UI               │
│  - 大改 UI 时：只改这里的组件和样式，不动 lib/            │
└────────────────────────┬────────────────────────────────┘
                         │ 仅依赖
                         ▼
┌─────────────────────────────────────────────────────────┐
│  lib/ (类型 + 状态 + 服务)                               │
│  - types/    领域模型与 DTO，与 UI 无关                   │
│  - store/    全局/功能级状态（如 profile、inspirations）  │
│  - services/ 用例与副作用（保存档案、抓取 URL、生成卡片）  │
└─────────────────────────────────────────────────────────┘
```

- **页面（app/**/page.tsx）**：不写业务逻辑，只调用 `lib` 的 hooks / 服务，并渲染 UI。
- **lib**：不依赖任何具体 UI 组件或页面；不 import 来自 `app/` 或 `components/` 的东西。

这样以后你从 Figma 重做 Landing / Onboarding / Vault / Add / Detail / Find / Export 时，只需：

1. 保留路由与 `page.tsx` 里对 `lib` 的调用方式；
2. 把当前「壳 UI」替换成新组件（或新页面结构），数据与事件接口保持不变。

## 目录约定

| 路径 | 职责 | 大改 UI 时 |
|------|------|------------|
| `app/**/page.tsx` | 路由入口 + 组合 hooks/服务 + 渲染 | ✅ 可整体替换视图 |
| `components/` | 可复用的展示/交互组件 | ✅ 可替换或重写 |
| `lib/types/` | 领域类型、API 入参出参 | ❌ 尽量不改，只扩展 |
| `lib/store/` | 状态与持久化（如 Context + localStorage） | ❌ 尽量不改 |
| `lib/services/` | 用例、API、第三方调用 | ❌ 尽量不改，只扩展 |

## 数据流（MVP 可测）

- **Onboarding**：表单提交 → `profileService.save()` → `store` 更新 + 持久化 → 跳转。
- **Add**：输入 URL → `youtubeService.fetchMeta()` → 用户标注喜欢点 → `inspirationService.create()` → 写入 `store` + 持久化 → 跳转/留在本页。
- **Vault**：读 `store.inspirations`（或通过 service 读），列表展示；点击进 Detail。
- **Detail**：根据 id 从 `store`/service 取单条灵感，展示；逻辑在 lib，UI 在页面/组件。
- **Find**：用 store 里的 profile + inspirations（后续可加 embedding）做推荐；逻辑在 service，页面只展示结果。
- **Export**：从 store/service 取数据，生成导出结果；页面只触发 + 展示。

当前用 **localStorage** 做持久化即可，方便本地跑通；后续可换成服务端/DB 而不改页面与 store 的**接口**（仅改 store 或 service 的实现）。

## 如何验证「能跑通」

1. **建档**：Onboarding 填必填项 → 提交 → 刷新或重进 Onboarding，能看到已填数据（或首页显示「已建档」）。
2. **录入**：Add 输入一个 YouTube URL（可先 mock 抓取）→ 选喜欢点 → 保存 → Vault 列表出现一条。
3. **查看**：Vault 点进某条 → Detail 页展示该条完整信息。
4. **导出**：Export 页点击导出 → 能拿到当前 profile + 灵感列表的数据（格式可先 JSON）。

以上都通过 lib 的 types + store + services 完成，页面只做「壳」；之后大改 UI 时，只换壳不换 lib。

## 如何本地验证

1. **建档**：打开 `/onboarding`，填必填项并提交 → 回首页应看到「已建档」。
2. **录入**：打开 `/add`，输入任意 YouTube URL（如 `https://www.youtube.com/watch?v=dQw4w9WgXcQ`），点「获取」→ 选喜欢点 → 保存 → 应跳转到 `/vault` 并出现一条。
3. **查看**：在 `/vault` 点某条 → 进入 `/detail/[id]` 查看详情。
4. **导出**：打开 `/settings/export`，点「导出为 JSON」→ 应看到 profile + inspirations 的 JSON。

数据存在浏览器 localStorage（键：`mint-make:creator-profile`、`mint-make:inspirations`），清空即重置。

## Figma 设计接入与以后大改

详见 **`docs/FIGMA_TO_CODE.md`**，要点：

- 把 Figma 设计接进来：只动 `components/` 和 `app/**/page.tsx`，用 `lib` 的数据与事件，组件只收 props 不直接调 store。
- 用 **设计 token**（`app/globals.css` 里的 CSS 变量）统一颜色/圆角/间距，大改时只改 token 和组件，不动 lib。
- 每个页面的「从 lib 拿什么、调 lib 做什么」在文档里写成**契约**，换 UI 时保持契约，只换组件和样式。
