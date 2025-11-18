/**
 * 获取所有步骤的API
 * 用途: 为前端提供步骤列表数据
 */

import { NextRequest, NextResponse } from "next/server";
import { getAllSteps } from "@/lib/markdown";

export async function GET(request: NextRequest) {
  try {
    const steps = getAllSteps();
    
    return NextResponse.json({
      success: true,
      steps,
      count: steps.length,
    });
  } catch (error) {
    console.error("获取步骤列表失败:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "获取步骤列表失败",
        details: error instanceof Error ? error.message : "未知错误"
      },
      { status: 500 }
    );
  }
}