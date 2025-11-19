## 为何之前能读到、现在读不到（PM 视角）
- 之前：我们把步骤列表硬编码在代码里作为常量 `STEPS`（像把菜单写死在应用里），浏览器拿到打包后的常量，自然能 `map`。
- 现在：项目改为从 Markdown 的 frontmatter 读取步骤（真实的“菜谱文件”），该读取用 `fs` 在服务器/构建阶段执行；浏览器不能直接读磁盘文件。
- 导致：`constants.ts` 不再导出 `STEPS`，但概览页仍在依赖它（`/app/overview/page.tsx:12`、`/app/overview/page.tsx:136-143`），运行时 `STEPS === undefined`，在 `map` 处报错。

## 当前代码的信号
- `/lib/constants.ts`：已不含 `STEPS`，并提示使用 `getAllSteps()`（服务器侧读取）。
- `/lib/markdown.ts`：`getAllSteps()` 扫描 `docs/*.md`，用 frontmatter 生成步骤列表（唯一数据源）。
- `/app/overview/OverviewClient.tsx`：已按“通过 props 接收 steps”来渲染，契合新架构。
- `/app/step/[id]/StepContent.tsx`：仍引用废弃的 `STEPS` 并用它算总步数，与新架构不一致。

## 方案目标
- 继续把内容维护在 Markdown 文件（您喜欢、也最可控）。
- 在服务端读取 `steps`，客户端仅展示与交互（浏览器不再直接读文件）。
- 移除对废弃 `STEPS` 的依赖，避免类似错误再次发生。

## 实施步骤
1. 概览页改为服务端读取并渲染：
   - `app/overview/page.tsx` 去掉 `"use client"` 与 `import { STEPS }`。
   - 引入 `getAllSteps()`，`const steps = getAllSteps();`。
   - 返回 `<OverviewClient steps={steps} />`，其内部已处理激活态与进度计算。
2. 步骤页客户端组件对齐：
   - `StepContent.tsx` 移除对 `STEPS` 的依赖，props 增加 `steps: Step[]`（类型来自 `lib/markdown.ts`）。
   - 用传入的 `steps.length` 传给 `ProgressBar` 和 `Sidebar`；`Sidebar` 本来就需要 `steps`。
   - 目前 `docs` 的 frontmatter 未提供 `estimatedTime` / `importance` 字段，先隐藏这些展示或标为可选；如后续需要，我们在 frontmatter 增加并在 `getAllSteps()` 解析。

## 验证
- 启动后访问 `/overview`：列表与整体进度正常渲染。
- 访问 `/step/1`：顶部进度条、侧边栏导航与 Checklist 正常交互。

## 备选快速修复（可选）
- 方案 A（MVP/快速）：临时在 `constants.ts` 恢复一个静态 `STEPS` 常量以消除报错，但会与 Markdown 真实数据源发生偏差，后续易出错。
- 方案 B（长期/可扩展）：上述“服务端读取 → 客户端展示”统一方案。推荐 B。

## 完成后提交命令
```bash
git add .
git commit -m "fix: 概览页改为服务端读取 Markdown；客户端通过 props 展示 steps 并移除废弃 STEPS 引用"
```