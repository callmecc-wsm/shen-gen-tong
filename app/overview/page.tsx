/**
 * 步骤总览页面（服务端组件）
 * 用途: 加载步骤数据并传递给客户端组件
 */

import { getAllSteps } from "@/lib/markdown";
import OverviewClient from "./OverviewClient";

export default function OverviewPage() {
  const steps = getAllSteps();
  
  return <OverviewClient steps={steps} />;
}

