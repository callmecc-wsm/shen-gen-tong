/**
 * 步骤总览页面
 * 用途: 显示所有10个步骤和整体完成进度
 * 业务逻辑: 从云端加载用户进度,支持多设备同步
 */

import { getAllSteps } from "@/lib/markdown";
import OverviewClient from "./OverviewClient";

export default async function OverviewPage() {
  const steps = getAllSteps();
  return <OverviewClient steps={steps} />;
}

