/**
 * 动态步骤页面
 * 用途: 显示单个步骤的详细内容
 * 业务逻辑: 读取对应的 Markdown 文档,渲染内容,显示 Checklist 和导航
 */

import { notFound } from "next/navigation";
import { getAllSteps, getMarkdownContent } from "@/lib/markdown";
import StepContent from "./StepContent";

interface StepPageProps {
  params: Promise<{
    id: string;
  }>;
}

// 生成静态参数(用于静态生成)
export async function generateStaticParams() {
  const STEPS = getAllSteps();
  return STEPS.map((step) => ({
    id: step.id.toString(),
  }));
}

// 生成页面元数据
export async function generateMetadata({ params }: StepPageProps) {
  const { id } = await params;
  const stepId = parseInt(id);
  const STEPS = getAllSteps();
  const step = STEPS.find((s) => s.id === stepId);

  if (!step) {
    return {
      title: "步骤未找到",
    };
  }

  return {
    title: `步骤${stepId}: ${step.title} - 申根签证准备助手`,
    description: `详细了解${step.title}的要求和注意事项`,
  };
}

export default async function StepPage({ params }: StepPageProps) {
  const { id } = await params;
  const stepId = parseInt(id);
  const STEPS = getAllSteps();

  // 验证步骤 ID
  if (isNaN(stepId) || stepId < 1 || stepId > STEPS.length) {
    notFound();
  }

  const step = STEPS.find((s) => s.id === stepId);
  
  if (!step) {
    notFound();
  }

  // 读取 Markdown 内容
  const markdownData = await getMarkdownContent(step.file);

  if (!markdownData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            内容加载失败
          </h1>
          <p className="text-gray-600">
            无法读取步骤文档: {step.file}
          </p>
        </div>
      </div>
    );
  }

  return (
    <StepContent
      stepId={stepId}
      stepInfo={step}
      steps={STEPS}
      markdownData={markdownData}
    />
  );
}

