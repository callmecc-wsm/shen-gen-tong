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
  frontmatter: {
    id: number;
    title: string;
    [key: string]: any;
  };
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

    // 优先从 frontmatter 读取标题和 ID
    const frontmatterId = data.id;
    const frontmatterTitle = data.title;

    // 提取标题(从第一个 # 标题)，作为备用
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = frontmatterTitle || (titleMatch ? titleMatch[1] : filename);

    // 提取步骤编号：优先从 frontmatter，然后从文件名
    const stepMatch = filename.match(/^(\d+)_/);
    const step = frontmatterId || (stepMatch ? parseInt(stepMatch[1]) : 0);

    // 提取 Checklist 项（从 frontmatter 读取）
    const checklistItems = extractChecklistItems(data);

    return {
      content,
      title,
      step,
      checklistItems,
      frontmatter: {
        id: frontmatterId || step,
        title: frontmatterTitle || title,
        ...data,
      },
    };
  } catch (error) {
    console.error(`Error reading markdown file ${filename}:`, error);
    return null;
  }
}

/**
 * 从 Frontmatter 中提取 Checklist 项
 * 现在从 frontmatter 的 checklist 数组读取，不再从正文解析
 */
function extractChecklistItems(frontmatter: any): ChecklistItem[] {
  const items: ChecklistItem[] = [];
  
  // 从 frontmatter 读取 checklist
  if (frontmatter.checklist && Array.isArray(frontmatter.checklist)) {
    frontmatter.checklist.forEach((item: any, index: number) => {
      // 支持两种格式：简单字符串格式或对象格式
      if (typeof item === 'string') {
        items.push({
          id: `item-${index}`,
          text: item,
        });
      } else if (typeof item === 'object' && item.text) {
        items.push({
          id: item.id || `item-${index}`,
          text: item.text,
          category: item.category,
        });
      }
    });
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
 * 步骤配置接口
 */
export interface Step {
  id: number;
  title: string;
  file: string;
  path: string;
}

/**
 * 自动扫描 docs 目录，构建步骤列表
 * 从每个 markdown 文件的 frontmatter 中读取配置
 */
export function getAllSteps(): Step[] {
  const docsDir = path.join(process.cwd(), "docs");
  
  try {
    const files = fs.readdirSync(docsDir);
    
    // 筛选出步骤文件(01-10)
    const stepFiles = files
      .filter((file) => /^\d{2}_.*\.md$/.test(file))
      .sort();

    const steps: Step[] = [];

    for (const file of stepFiles) {
      try {
        const filePath = path.join(docsDir, file);
        const fileContents = fs.readFileSync(filePath, "utf8");
        const { data } = matter(fileContents);

        // 从 frontmatter 读取 id 和 title
        const id = data.id || parseInt(file.match(/^(\d+)_/)?.[1] || "0");
        const title = data.title || file.replace(/^\d+_/, "").replace(/\.md$/, "");

        steps.push({
          id,
          title,
          file,
          path: `/step/${id}`,
        });
      } catch (error) {
        console.error(`Error reading step file ${file}:`, error);
      }
    }

    // 按 id 排序
    return steps.sort((a, b) => a.id - b.id);
  } catch (error) {
    console.error("Error scanning docs directory:", error);
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

