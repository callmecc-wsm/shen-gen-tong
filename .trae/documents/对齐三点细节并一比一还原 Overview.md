# PM 摘要（What & Why）
- 将 `/overview` 页面进一步对齐你标注的三个重点：
  1) 标题与徽章（重庆领区 / 2025官方标准流程）和“进度卡片”位于同一行：左侧标题，右侧进度卡片。
  2) 绿色只用于“已完成”的卡片，未完成的卡片不出现任何绿色视觉（与其他卡片一致为中性灰）。
  3) 蓝色是交互态：只有当鼠标悬停到“当前步骤”卡片上，才出现蓝色高亮与动效；默认不蓝。箭头气泡也仅在悬停时出现。
- 保留现有文案；目标是一比一还原你提供的视觉与交互语言，移动端表现一致。

# 技术方案（How）

## 修改点
- Header 合并为单行左右布局：
  - 左侧：国旗 + 标题“意大利签证指南” + 徽章（重庆领区 / 2025 官方标准流程）。
  - 右侧：圆环“进度卡片”。
  - 技术：修改 `app/overview/OverviewClient.tsx` 的头部容器为 `flex justify-between items-end`，将现有两个块合并到同一行。

- 卡片三态样式调整：
  - completed（已完成）：
    - 白底 + 绿色实边（`border-green-500/40`）+ 状态气泡“已完成”（绿色），编号芯为绿；无强阴影。
  - current（当前步骤）：
    - 默认与普通卡片相同（中性灰边、不蓝不高亮）；仅在 `hover` 时出现蓝色 ring（`hover:ring-blue-500`）、加强阴影与箭头气泡蓝底；编号芯默认灰，`hover` 不改变编号芯色。
  - upcoming（未开始）：
    - 中性灰边 + 轻阴影；`hover` 仅轻微悬浮，无蓝色元素。
  - 技术：在 `OverviewClient.tsx` 的 `cardStyle` 基于状态给出类名；对箭头气泡与状态气泡使用 `group-hover:*` 控制；去除 current 的静态蓝边与蓝芯。

- 箭头气泡与动效：
  - 默认隐藏（`opacity-0 translate-x-[-10px]`），悬停时显现。
  - 对 current 卡片：悬停时使用 `group-hover:bg-blue-50 group-hover:text-blue-600`；其余卡保持 `group-hover:bg-slate-50 group-hover:text-slate-400`。

## 不变与兼容
- 进度计算仍使用现有 `useStore`/`useChecklistSync`；圆环进度使用当前 SVG 方案。
- Markdown 文案与 desc 保留当前映射；后续可在 frontmatter 填写 `desc` 自动接入。

## 验证
- 打开 `http://localhost:3000/overview`：
  - 头部标题与进度卡片同一行，两端对齐。
  - 非完成卡片不出现绿色；完成卡片显示绿色边与“已完成”气泡。
  - 将鼠标悬停到“当前步骤”卡片：出现蓝色 ring、高阴影与蓝色箭头气泡；移开后恢复中性灰。
  - 移动端下：布局不溢出，抽屉与卡片交互正常。

## 提交
```bash
git add .
git commit -m "feat: Overview 头部合并与卡片三态交互优化，蓝色仅在悬停"
```