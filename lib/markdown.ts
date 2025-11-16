/**
 * Markdown 文档处理工具
 * 用途: 读取和解析 Markdown 文档,提取 Checklist 项
 * 业务逻辑: 从 docs 目录读取步骤文档,解析内容和元数据
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Markdown 文档数据结构
export interface MarkdownDoc {
  content: string;
  title: string;
  step: number;
  checklistItems: ChecklistItem[];
}

// Checklist 项目结构
export interface ChecklistItem {
  id: string;
  text: string;
  category?: string;
}

/**
 * 读取并解析 Markdown 文档
 */
export async function getMarkdownContent(
  filename: string
): Promise<MarkdownDoc | null> {
  try {
    const docsDir = path.join(process.cwd(), "docs");
    const filePath = path.join(docsDir, filename);

    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return null;
    }

    // 读取文件内容
    const fileContents = fs.readFileSync(filePath, "utf8");

    // 使用 gray-matter 解析 frontmatter
    const { data, content } = matter(fileContents);

    // 提取标题(从第一个 # 标题)
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : filename;

    // 提取步骤编号(从文件名)
    const stepMatch = filename.match(/^(\d+)_/);
    const step = stepMatch ? parseInt(stepMatch[1]) : 0;

    // 提取 Checklist 项
    const checklistItems = extractChecklistItems(content);

    return {
      content,
      title,
      step,
      checklistItems,
    };
  } catch (error) {
    console.error(`Error reading markdown file ${filename}:`, error);
    return null;
  }
}

/**
 * 从 Markdown 内容中提取 Checklist 项
 * 查找所有形如 "- [ ]" 或 "- [x]" 的列表项
 */
function extractChecklistItems(content: string): ChecklistItem[] {
  const items: ChecklistItem[] = [];
  
  // 匹配 Markdown 中的 checklist 格式: - [ ] 或 - [x]
  const checklistRegex = /^[\s]*-\s+\[([ x])\]\s+(.+)$/gm;
  let match;
  let index = 0;

  while ((match = checklistRegex.exec(content)) !== null) {
    const text = match[2].trim();
    items.push({
      id: `item-${index}`,
      text,
    });
    index++;
  }

  return items;
}

/**
 * 获取所有步骤文档的列表
 */
export function getAllStepFiles(): string[] {
  const docsDir = path.join(process.cwd(), "docs");
  
  try {
    const files = fs.readdirSync(docsDir);
    
    // 筛选出步骤文件(01-10)
    return files
      .filter((file) => /^\d{2}_.*\.md$/.test(file))
      .sort();
  } catch (error) {
    console.error("Error reading docs directory:", error);
    return [];
  }
}

/**
 * 处理 Markdown 内容,添加自定义样式
 * 将特定的文本模式转换为带样式的 HTML
 */
export function enhanceMarkdownContent(content: string): string {
  let enhanced = content;

  // 识别并转换警告框
  // 🔴 严重错误/强制要求
  enhanced = enhanced.replace(
    /^>\s*🔴\s+(.+)$/gm,
    '<div class="alert-error"><div class="alert-error-title">🔴 $1</div></div>'
  );

  // ⚠️ 重要提示/常见错误
  enhanced = enhanced.replace(
    /^>\s*⚠️\s+(.+)$/gm,
    '<div class="alert-warning"><div class="alert-warning-title">⚠️ $1</div></div>'
  );

  // 💡 贴心提示/优化建议
  enhanced = enhanced.replace(
    /^>\s*💡\s+(.+)$/gm,
    '<div class="alert-info"><div class="alert-info-title">💡 $1</div></div>'
  );

  // 💚 情绪缓解/鼓励话术
  enhanced = enhanced.replace(
    /^>\s*💚\s+(.+)$/gm,
    '<div class="alert-success"><div class="alert-success-title">💚 $1</div></div>'
  );

  return enhanced;
}

/**
 * 从文件名生成步骤 ID
 */
export function getStepIdFromFilename(filename: string): number {
  const match = filename.match(/^(\d+)_/);
  return match ? parseInt(match[1]) : 0;
}

