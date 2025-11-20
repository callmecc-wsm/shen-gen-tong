## PM 摘要（What & Why）
- 现在每一行的复选框（checkbox）和右侧文字没有垂直对齐，文字看起来偏高。
- 我们将只调整这块的排版，让复选框与文字在视觉上居中对齐，提高可读性与整洁度，不改动任何业务逻辑。

## 技术方案（How）
### 方案对比
- 方案 A（最快）：把行容器从 `items-start` 改为 `items-center`，去掉复选框上的 `mt-0.5`，并把文字的行高设置为与复选框一致的 20px（`leading-5`）。
  - 优点：改动极小、效果稳定、对现有样式影响最小。
  - 风险：多行文本时会让复选框垂直居中整个文本块（通常仍符合预期）。
- 方案 B（更精细）：使用 `inline-flex align-middle` 或微调 `translate-y` 来对齐到首行基线。
  - 优点：多行时更贴近“首行对齐”的视觉习惯。
  - 风险：实现更复杂，可能引入跨浏览器细微差异。

### 推荐
- 采用方案 A，满足当前页面的统一视觉需求与实现成本。

### 具体改动文件与位置
- 文件：`components/OverviewChecklistDrawer.tsx`
- 行级改动：
  1. 将行容器改为居中对齐
     - 原：`components/OverviewChecklistDrawer.tsx:132` → `className="flex items-start gap-3 group cursor-pointer select-none"`
     - 改：`className="flex items-center gap-3 group cursor-pointer select-none"`
  2. 去掉复选框上的上边距，避免额外下压
     - 原：`components/OverviewChecklistDrawer.tsx:136` → `className=\`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ...\``
     - 改：删除 `mt-0.5`，其余保持不变。
  3. 统一文字行高到 20px，与 20px 复选框高度一致
     - 原：`components/OverviewChecklistDrawer.tsx:149` → `className=\`text-sm leading-tight transition-colors select-none ...\``
     - 改：将 `leading-tight` 改为 `leading-5`（即 1.25rem，约 20px）。

### 验证方法
- 打开抽屉，观察单行与可能的换行项：复选框与文字应垂直居中对齐；文字不再显得偏高。
- 确认无交互变化：点击整行仍可勾选，乐观更新逻辑保持不变。

### 回滚与兼容
- 若发现多行项居中不符合预期，可追加微调（仅在文本 `span` 上加 `sm:leading-5` 保持移动端居中、桌面端更紧凑，或在复选框上轻微 `translate-y-[1px]`）。