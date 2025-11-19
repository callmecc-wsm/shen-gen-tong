/**
 * 步骤总览客户端组件
 * 用途: 显示所有10个步骤和整体完成进度（客户端交互部分）
 * 业务逻辑: 用户可以查看每个步骤的完成情况,并快速跳转到任意步骤
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Step } from "@/lib/markdown";
import { getAuthToken } from "@/app/page";
import OverviewChecklistDrawer from "@/components/OverviewChecklistDrawer";
import Link from "next/link";
import ErrorBoundary from "@/components/ErrorBoundary";

interface OverviewClientProps {
  steps: Step[];
  stepsWithChecklist: { id: number; title: string; items: any[] }[];
}

export default function OverviewClient({ steps, stepsWithChecklist }: OverviewClientProps) {
  const router = useRouter();
  const { initializeFromStorage, getStepProgress } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);

  const DEFAULT_DESC_MAP: Record<number, string> = {
    1: "核对户籍与常住地",
    2: "计算停留天数",
    3: "抢占 VFS 考位",
    4: "下载官方核对表",
    5: "机酒真实订单",
    6: "流水与盖章",
    7: "查漏补缺",
    8: "现场录指纹",
  };

  useEffect(() => {
    initializeFromStorage();
  }, [initializeFromStorage]);

  useEffect(() => {
    const verify = async () => {
      const token = getAuthToken();
      if (!token) {
        router.push("/");
        return;
      }
      try {
        const res = await fetch("/api/verify", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          setIsLoading(false);
        } else {
          router.push("/");
        }
      } catch (e) {
        router.push("/");
      }
    };
    verify();
  }, [router]);

  // 计算每步完成百分比与总体步数进度
  const perStep = steps.map((s) => {
    const sp = getStepProgress(`step${s.id}`);
    const pct = sp.total > 0 ? Math.round((sp.completed / sp.total) * 100) : 0;
    return { id: s.id, pct, completed: sp.total > 0 && pct === 100 };
  });
  const completedSteps = perStep.filter((x) => x.completed).length;
  const progressPercentage = steps.length > 0 ? Math.round((completedSteps / steps.length) * 100) : 0;

  // 跳转到指定步骤
  const goToStep = (stepId: number) => {
    router.push(`/step/${stepId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
    <div className="min-h-screen bg-[#F5F7FA] pb-24 relative overflow-x-hidden">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[400px] bg-blue-200/20 blur-[120px] rounded-full pointer-events-none -z-10" />
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/countries")}
            className="p-2 -ml-2 rounded-full hover:bg-black/5 transition-colors text-slate-500 hover:text-slate-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-slate-500">申根通 · 意大利</span>
        </div>
        <Link href="/faq" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">帮助中心</Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 sm:px-8 pt-12">
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-4xl">🇮🇹</span>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">意大利签证指南</h1>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <div className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wide">重庆领区</div>
                <span className="text-slate-300">/</span>
                <p className="text-sm">2025 官方标准流程</p>
              </div>
            </div>
            <div className="flex items-center gap-6 bg-white/60 backdrop-blur-sm border border-white/60 p-4 rounded-2xl shadow-sm">
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-400 uppercase mb-0.5">整体完成度</p>
                <div className="flex items-baseline justify-end gap-1.5">
                  <span className="text-3xl font-bold text-slate-900 leading-none">{progressPercentage}%</span>
                  <span className="text-xs text-slate-500 font-medium">{completedSteps}/{steps.length} 步</span>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                  <path className="text-blue-600 transition-all duration-1000 ease-out" strokeDasharray={`${progressPercentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">申请步骤</h2>
          <button onClick={() => setIsChecklistOpen(true)} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
            打开详细清单
            <svg width="16" height="16" viewBox="0 0 24 24" className="transition-transform"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step) => {
            // 调试日志：检查步骤数据
            console.log(`Step ${step.id}: title="${step.title}", desc="${DEFAULT_DESC_MAP[step.id] || "未找到描述"}"`);
            
            const sp = getStepProgress(`step${step.id}`);
            const pct = sp.total > 0 ? Math.round((sp.completed / sp.total) * 100) : 0;
            const isCompleted = sp.total > 0 && pct === 100;
            const isCurrent = !isCompleted && perStep.find((x) => x.pct !== 100)?.id === step.id;
            const desc = DEFAULT_DESC_MAP[step.id] || "";

            // 为所有非完成状态的卡片添加蓝色悬浮感效果
            const cardStyle = isCompleted
              ? "bg-white border-slate-200/60 shadow-sm transition-all duration-300 group-hover:border-blue-500 group-hover:shadow-[0_10px_40px_-10px_rgba(37,99,235,0.2)] group-hover:ring-1 group-hover:ring-blue-500 group-hover:-translate-y-1 z-10"
              : "bg-white border-slate-200/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)] transition-all duration-300 hover:border-blue-300 hover:shadow-[0_8px_30px_rgb(37,99,235,0.1)] hover:-translate-y-1 z-10";  // 非完成卡片：默认状态与已完成一致，hover时才有蓝色效果

            return (
              <div key={step.id} className={`group relative p-6 rounded-[20px] border transition-all duration-500 ease-out cursor-pointer flex flex-col justify-between min-h-[160px] ${cardStyle}`} onClick={() => goToStep(step.id)}>
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold transition-colors ${isCompleted ? "bg-green-100 text-green-700 border border-green-300" : "bg-slate-50 text-slate-400 border border-slate-100"}`}>{step.id}</div>
                  <div className={`p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-[-10px] ${isCurrent ? "group-hover:bg-blue-50 group-hover:text-blue-600" : "group-hover:bg-slate-50 group-hover:text-slate-400"}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                  </div>
                </div>
                <div>
                  <h3 className={`text-lg font-bold mb-1 ${isCompleted ? "text-slate-700" : "text-slate-700 group-hover:text-slate-900"}`}>{desc || step.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm font-medium text-slate-500">{step.title}</p>
                    {isCompleted ? (
                      <div className="px-2.5 py-1 rounded-lg bg-green-100 border border-green-300 text-green-800">
                        <span className="text-xs font-bold">已完成</span>
                      </div>
                    ) : (
                      <div className={`px-2.5 py-1 rounded-lg border text-xs font-medium ${isCurrent ? "bg-white border-slate-200 text-slate-500 group-hover:bg-blue-50 group-hover:border-blue-100 group-hover:text-blue-600" : "bg-slate-50 border-slate-100 text-slate-400"}`}>{isCurrent ? "进行中" : "待开始"}</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <OverviewChecklistDrawer
        isOpen={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
        stepsWithChecklist={stepsWithChecklist}
      />
    </div>
    </ErrorBoundary>
  );
}

