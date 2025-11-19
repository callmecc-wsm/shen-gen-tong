/**
 * 步骤总览页面
 * 用途: 显示所有10个步骤和整体完成进度
 * 业务逻辑: 从云端加载用户进度,支持多设备同步
 */

import { getAllSteps, getMarkdownContent } from "@/lib/markdown";
import OverviewClient from "./OverviewClient";

export default async function OverviewPage() {
  const steps = getAllSteps();

  const stepsWithChecklist = await Promise.all(
    steps.map(async (s) => {
      const md = await getMarkdownContent(s.file);
      return {
        id: s.id,
        title: s.title,
        items: md?.checklistItems || [],
      };
    })
  );

  return <OverviewClient steps={steps} stepsWithChecklist={stepsWithChecklist} />;
}

