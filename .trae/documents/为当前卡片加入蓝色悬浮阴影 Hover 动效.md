# PM 摘要（What & Why）
- 目标：当鼠标移到“当前步骤”卡片上时，出现蓝色高亮的悬浮阴影与边框（非悬停时保持中性灰），与示例一致；“已完成”卡片保持绿色静态；其他卡片保持灰色轻悬浮。
- 体验：用户在浏览总览时，一眼识别当前步骤，悬停即获得明显的行动暗示（箭头与蓝色光效）。

# 技术实现（How）

## 修改范围
- 文件：`app/overview/OverviewClient.tsx`
- 位置：步骤列表渲染处（map over `steps`）的卡片容器 `div` 与内部箭头气泡与状态气泡。

## 具体类名与逻辑
- 卡片容器（仅 current）：
  - 添加：`group-hover:border-blue-500 group-hover:ring-1 group-hover:ring-blue-500 group-hover:shadow-[0_10px_40px_-10px_rgba(37,99,235,0.2)] group-hover:-translate-y-1`
  - 默认（非悬停）：保持 `bg-white border-slate-200/60 shadow-sm`
- 非 current 容器：
  - 保持灰色：`hover:border-slate-300 hover:shadow-md hover:-translate-y-1`（无蓝色）
- 箭头气泡：
  - 默认隐藏：`opacity-0 translate-x-[-10px]`
  - 悬停显现：`group-hover:opacity-100 group-hover:translate-x-0`
  - 颜色：仅 current 悬停为 `group-hover:bg-blue-50 group-hover:text-blue-600`；其他为 `group-hover:bg-slate-50 group-hover:text-slate-400`
- 右下角状态气泡：
  - current：默认中性灰；悬停转蓝：`group-hover:bg-blue-50 group-hover:border-blue-100 group-hover:text-blue-600`
  - completed：保持绿色静态气泡（不随悬停变化）
- 编号芯：
  - completed：绿色芯 `bg-green-100 text-green-700 border-green-300`
  - 非 completed：灰色芯；不随悬停变蓝，保持与示例一致

## 判定逻辑
- `isCompleted`：100% 完成 → 绿色静态卡片
- `isCurrent`：第一个未达到 100% 的步骤 → 应用“蓝色仅悬停”的类名
- 其他步骤：灰色轻悬浮，无蓝色效果

## 验证
- 悬停当前步骤卡片：出现蓝色边框、ring、强阴影与蓝色箭头；移开恢复灰色
- 悬停其他卡片：仅轻微悬浮与灰色阴影，无蓝色
- 已完成卡片：保持绿色静态，无蓝色悬停

## 提交
```bash
git add .
git commit -m "feat: 当前卡片加入蓝色悬浮阴影 Hover，绿色仅完成态"
```