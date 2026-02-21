# Figma 设计接入与后续大改指南

## 一、把 Figma 设计接进项目的方式

### 方式 A：按设计稿手写组件（推荐，可控度最高）

1. 在 Figma 里打开 Dev Mode 或「检查」面板，看标注（尺寸、颜色、字体、圆角等）。
2. 在项目里**只动这两个地方**：
   - **`components/`**：新增或修改展示/交互组件（按钮、卡片、表单、布局等），样式用 `globals.css` 里的**设计 token**（见下）。
   - **`app/**/page.tsx`**：用 `lib` 的数据和事件，**只负责**把数据传给组件、把用户操作转成对 `lib` 的调用。
3. 不把业务逻辑写进组件：组件只接收 `props`（数据 + 回调），不直接 `useAppStore()` 或调 `lib/services`（由页面层调）。

这样「Figma → 组件 + 页面壳」的边界清晰，以后大改时替换组件即可。

### 方式 B：用 Figma 的「生成代码」或插件

- 若使用 Figma 自带或插件的代码导出：**只把导出的内容当作「组件 UI」**，粘贴到 `components/` 下的新文件里。
- 再在页面里用这些组件，并**把数据来源改为从页面传入**（页面从 `useAppStore()` 取数据），避免组件内直接依赖 store/services。
- 导出代码里若有硬编码颜色/字体，尽量改成用 `globals.css` 的 CSS 变量，方便以后一键换肤或大改风格。

### 方式 C：用 Cursor 的 Figma 能力（有 Figma 链接时）

- 若你有 Figma 设计稿的**可分享链接**，可以说「根据这个 Figma 链接实现 [某页面] 的 UI，数据用现有 lib，不要改 lib」。
- 实现时仍遵守：新 UI 放在 `components/` + 页面只做「取数据 → 传 props → 绑事件调 lib」。

---

## 二、如何保证「以后大改」而不是从头重做

### 1. 页面与 lib 的「契约」固定不变

每个页面只做三件事，**大改 UI 时这三件事的「接口」不要变**：

| 页面 | 从 lib 拿什么 | 调 lib 做什么 | 大改时你只换什么 |
|------|----------------|----------------|------------------|
| Landing | `profile`（是否已建档） | 无 | 首页的布局和组件 |
| Onboarding | `profile`（回填）、`saveProfile` | 提交时 `saveProfile(profile)` | 表单样式和布局，**不**改提交时传的数据结构 |
| Add | `addToStore` | `fetchYouTubeMeta` → 用户标注 → `buildInspirationCard` → `addToStore(card)` | URL 输入、元信息展示、喜欢点选择、备注的 UI |
| Vault | `inspirations` | 无 | 列表和卡片的展示样式 |
| Detail | `getInspiration(id)` | 无 | 详情页的排版和样式 |
| Find | `profile`、`inspirations` | 无（后续推荐逻辑在 service） | 推荐结果的展示方式 |
| Export | `profile`、`inspirations` | 无（导出逻辑可在页面或 service） | 导出按钮和结果展示的 UI |

只要**数据从 store 取、写回用 store/services**，换 UI 就只换「用这些数据画什么、点哪里触发什么」。

### 2. 用设计 token，不写死样式

- 颜色、字重、圆角、间距等都在 **`app/globals.css`** 的 `:root` / `@theme` 里用 CSS 变量定义（见下节）。
- 组件里用 `var(--color-primary)`、`var(--radius-md)` 这类变量，**不要**在组件里写死 `#3B82F6`、`12px`。
- 以后大改：只改 `globals.css` 和 Figma 里的变量，整站风格一起变；组件不用重写。

### 3. 按「页面/功能」拆组件，不按「Figma 画板」混在一起

- 例如：`components/onboarding/ProfileForm.tsx`、`components/add/UrlInput.tsx`、`components/vault/InspirationList.tsx`。
- 以后重做某一页的 Figma：只换对应目录下的组件，或新建 `components/onboarding/v2/` 再在页面里切过去，逻辑层（页面里对 lib 的调用）不变。

### 4. 不把路由和数据结构绑死在 UI 上

- 路由（`/onboarding`、`/add`、`/vault` 等）保持不变。
- `CreatorProfile`、`InspirationCard` 等类型在 `lib/types` 里，不因为 UI 大改而改字段（除非产品需求新增）。
- 这样「换一版 Figma」= 换组件 + 必要时换 token，**不是**重写数据流或路由。

---

## 三、设计 token 示例（在 globals.css 中扩展）

在 `app/globals.css` 里已有 `:root`，可按 Figma 的变量名或你的设计系统扩展，例如：

```css
:root {
  /* 品牌/主色 */
  --color-primary: #000000;
  --color-primary-foreground: #ffffff;
  /* 中性色 */
  --color-muted: #71717a;
  --color-muted-bg: #f4f4f5;
  /* 圆角、间距（和 Figma 保持一致） */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --space-section: 24px;
}
```

组件里写：`backgroundColor: 'var(--color-primary)'`、`borderRadius: 'var(--radius-md)'`。Figma 大改时只改这里，所有用这些 token 的组件会一起更新。

---

## 四、实际操作清单（接 Figma 设计时）

1. [ ] 在 `globals.css` 里把当前 Figma 用到的颜色、字重、圆角、间距做成 CSS 变量。
2. [ ] 为每个要接的页面建对应组件目录（如 `components/onboarding/`、`components/add/`），组件只收 `props`，不直接用 store。
3. [ ] 在 `app/**/page.tsx` 里：`useAppStore()` / 调 service → 把数据和回调传给新组件 → 渲染新组件。
4. [ ] 跑通：建档 / 添加灵感 / 灵感库 / 详情 / 导出 流程，确认数据仍正确。
5. [ ] 以后大改：只替换组件实现或换 token，不删不改页面里「取数据、调 lib」的那几行。

按这个做，Figma 设计可以稳定接进项目，且以后大改 UI 时不会从头重做，只做「换壳」。
