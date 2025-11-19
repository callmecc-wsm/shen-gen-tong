# PM 摘要（What & Why）
- 目标：将当前 `/overview` 页面视觉、布局、交互一比一对齐你给出的 UI 示例（含导航、头部信息、圆环进度、步骤卡片三态与抽屉）。
- 内容策略：保留现有文案；仅在需要展示副标题（desc）处，若 Markdown 未提供，则使用安全的默认短语，以保持视觉完整性。
- 体验收益：层级更清晰、卡片更精致、进度表达更直观；移动端与桌面端风格统一，打开详细清单抽屉后快速核对所有步骤。

# 技术方案（How）

## 改动范围
- 页面：`app/overview/page.tsx`（服务器预取数据）与 `app/overview/OverviewClient.tsx`（客户端 UI 与交互）。
- 组件：新增 `components/ErrorBoundary.tsx`（或在客户端内联）、完善 `components/OverviewChecklistDrawer.tsx`（样式与动效对齐示例）。
- 样式：使用 Tailwind 现有工具类，不新增包；加入“氛围光”背景层与圆环进度 SVG。

## 数据与状态
- 步骤列表：继续使用 `lib/markdown.ts:getAllSteps()`；在 `page.tsx` 预取每个步骤的 `checklistItems`。
- 完成状态：在客户端根据每步 checklist 完成度计算 `completed/current/upcoming` 三态。
- 副标题（desc）：优先读取 Markdown frontmatter 的 `desc`，无则根据步骤 ID 提供默认短语（如示例里：核对户籍与常住地、计算停留天数等）。

## 具体修改项
1) 服务器预取（已具备基础）
- 文件：`app/overview/page.tsx`
- 动作：在将 `steps` 传入的同时，组合 `stepsWithChecklist = [{id, title, items, desc}]` 传给客户端；`desc` 读取 frontmatter，无则注入默认映射。

2) 客户端完全重构为目标风格
- 文件：`app/overview/OverviewClient.tsx`
- 结构：
  - 顶部导航：左侧返回（至 `/countries`）、右侧“帮助中心”（至 `/faq`）；导航吸顶与毛玻璃背景。
  - 氛围光：居中浅蓝色椭圆模糊层（如示例）。
  - 头部区域：国旗+主标题、信息徽章（重庆领区 / 2025 官方标准流程）。
  - 进度概览：右侧卡片显示百分比与“2/8 步”，使用 SVG 圆环：`strokeDasharray="{progress}, 100"`。
  - 快捷入口：标题“申请步骤” + 右侧“打开详细清单”按钮（打开抽屉）。
  - 步骤卡片栅格：两列，三态样式与动效：
    - completed：白底、绿色边框与轻阴影、右下角“已完成”气泡；编号芯为绿。
    - current：白底、蓝色高亮边框、ring、抬升阴影；右下角“进行中”；箭头气泡蓝底；编号芯为蓝底白字。
    - upcoming：白底、浅灰边框与柔和阴影；右下角“待开始”；编号芯灰。
  - 箭头：右上角圆角按钮，默认轻灰，`hover` 透明度与位移动画。
  - 点击卡片：跳转 `/step/[id]`。
  - 错误边界：包裹整个内容，异常时给出“出错了，请刷新页面重试”。

3) 抽屉对齐示例风格
- 文件：`components/OverviewChecklistDrawer.tsx`
- 内容：
  - 宽度 `sm:w-[420px]`，毛玻璃与阴影；遮罩可点击关闭；ESC 关闭；打开时锁滚动。
  - 顶部：标题“准备清单”、完成项统计（从 `useChecklistSync` 取各步完成数）；关闭按钮。
  - 列表：按步骤分组折叠（默认展开当前步或第一个），每项勾选即更新；保留淡蓝展开态背景与边框；底部留白与提交按钮“完成并返回”。

4) 辅助：三态判定与 desc 映射
- 新增轻量工具（可内联至 `OverviewClient.tsx`）：
  - `computeStepState(stepId)`：根据完成百分比，100%→completed；首个非 100% → current；其余→upcoming。
  - `DEFAULT_DESC_MAP`：`{1:"核对户籍与常住地",2:"计算停留天数",3:"抢占 VFS 考位",4:"下载官方核对表",5:"机酒真实订单",6:"流水与盖章",7:"查漏补缺",8:"现场录指纹"}`。

## 依赖策略
- 方案A（MVP/速度）：不引入 `lucide-react`，使用内置 SVG（当前项目已实践），立即落地。
- 方案B（长期/统一）：引入 `lucide-react`，统一图标库与尺寸。
- 推荐：A 先实现，后续按需切换 B。

## 验证清单
- 打开 `http://localhost:3000/overview`：
  - 顶部导航吸顶与右侧“帮助中心”可跳转 `/faq`。
  - 头部徽章与圆环进度视觉一致；进度百分比与“完成步数/总步数”同步正确。
  - 步骤卡片的三态样式与动效符合示例；箭头与“已完成/进行中/待开始”气泡正确显示。
  - 打开抽屉，分组折叠与勾选交互正常；遮罩与关闭按钮可关闭；移动端表现不溢出。

## 提交说明（完成后）
```bash
git add .
git commit -m "feat: Overview页面一比一还原参考UI，含抽屉与圆环进度"
```

## 风险与回滚
- 若某些步骤缺少 `desc`，将使用默认映射，不影响交互与视觉；后续可在 Markdown frontmatter 中逐步补充 `desc`，UI自动接入。
- 不改动后端或 Markdown 结构，回滚仅需恢复 `OverviewClient.tsx` 与抽屉组件即可。