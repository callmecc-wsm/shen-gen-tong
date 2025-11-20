"use client";

import { useEffect, useState, useCallback } from "react";
import { useChecklistSync } from "@/lib/useProgress";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  stepsWithChecklist: { id: number; title: string; items: { id: string; text: string }[] }[];
  onSaved?: () => void;
}

export default function OverviewChecklistDrawer({ isOpen, onClose, stepsWithChecklist, onSaved }: DrawerProps) {
  const { isItemChecked, toggleItem, getStepProgress } = useChecklistSync();
  const [expanded, setExpanded] = useState<number | null>(null);
  const [stagedUpdates, setStagedUpdates] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);

  // 优化的切换函数，带乐观更新
  const handleToggle = useCallback((stepId: string, itemId: string) => {
    const key = `${stepId}-${itemId}`;
    setStagedUpdates(prev => {
      const base = isItemChecked(stepId, itemId);
      const current = Object.prototype.hasOwnProperty.call(prev, key) ? prev[key] : base;
      return { ...prev, [key]: !current };
    });
  }, [isItemChecked]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setStagedUpdates({});
    }
  }, [isOpen]);

  useEffect(() => {
    if (stepsWithChecklist.length > 0) {
      setExpanded(stepsWithChecklist[0].id);
    }
  }, [stepsWithChecklist]);

  const total = stepsWithChecklist.reduce((acc, s) => acc + s.items.length, 0);
  const completed = stepsWithChecklist.reduce((acc, s) => {
    const sp = getStepProgress(`step${s.id}`);
    return acc + sp.completed;
  }, 0);
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <>
      <div
        className={`fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white/95 backdrop-blur-xl z-50 shadow-2xl transform transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100/50">
            <div>
              <h2 className="text-xl font-bold text-slate-900">准备清单</h2>
              <p className="text-xs text-slate-400 mt-1">已完成 {completed} / {total} 个主要步骤</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" aria-label="关闭">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {stepsWithChecklist.map((step) => {
              const sp = getStepProgress(`step${step.id}`);
              const isOpenGroup = expanded === step.id;
              const isDone = sp.total > 0 && sp.completed === sp.total;
              const isCurrent = !isDone && sp.completed > 0;
              
              return (
                <div key={step.id} className={`border rounded-2xl transition-all duration-300 overflow-hidden ${isOpenGroup ? 'border-blue-200 bg-blue-50/50' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                  <button onClick={() => setExpanded(isOpenGroup ? null : step.id)} className="w-full flex items-center justify-between p-4 text-left">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${isDone ? 'bg-green-500' : isCurrent ? 'bg-blue-500' : 'bg-slate-300'}`} />
                      <span className={`text-sm font-bold ${isOpenGroup ? 'text-blue-900' : 'text-slate-700'}`}>
                        {step.title}
                      </span>
                    </div>
                    {isOpenGroup ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" className="text-blue-400 -rotate-90" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" className="text-slate-300" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                    )}
                  </button>

                  {isOpenGroup && (
                    <div className="px-4 pb-4 pl-9 space-y-3 animate-in slide-in-from-top-2 duration-200">
                      {step.items.map((todo, idx) => {
                        const baseChecked = isItemChecked(`step${step.id}`, todo.id);
                        const stagedKey = `step${step.id}-${todo.id}`;
                        const checked = Object.prototype.hasOwnProperty.call(stagedUpdates, stagedKey)
                          ? stagedUpdates[stagedKey]
                          : baseChecked;
                        
                        return (
                          <div 
                            key={todo.id} 
                            className="flex items-center gap-3 group cursor-pointer select-none"
                            onClick={() => handleToggle(`step${step.id}`, todo.id)}
                          >
                            <div
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                                checked 
                                  ? 'bg-blue-500 border-blue-500 shadow-sm shadow-blue-200' 
                                  : 'border-slate-300 bg-white group-hover:border-blue-400'
                              }`}
                              aria-label={checked ? "已勾选" : "未勾选"}
                            >
                              {checked && (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                                </svg>
                              )}
                            </div>
                            <span className={`text-sm leading-5 transition-colors select-none ${checked ? 'text-slate-400 line-through' : 'text-slate-700 group-hover:text-slate-900'}`}>
                              {todo.text}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
            <div className="h-24" />
          </div>

          <div className="p-6 border-t border-slate-100 bg-white">
            <button
              onClick={async () => {
                if (saving) return;
                setSaving(true);
                try {
                  const entries = Object.entries(stagedUpdates);
                  await Promise.all(entries.map(async ([key, desired]) => {
                    const parts = key.split('-');
                    const stepKey = parts[0];
                    const itemId = parts.slice(1).join('-');
                    const base = isItemChecked(stepKey, itemId);
                    if (base !== desired) {
                      await toggleItem(stepKey, itemId);
                    }
                  }));
                  setStagedUpdates({});
                  if (onSaved) onSaved();
                  onClose();
                } catch (e) {
                  console.error('保存清单失败:', e);
                } finally {
                  setSaving(false);
                }
              }}
              disabled={saving}
              className={`w-full py-3.5 ${saving ? 'bg-slate-700' : 'bg-slate-900 hover:bg-slate-800'} text-white rounded-2xl font-bold active:scale-[0.98] transition-all shadow-xl shadow-slate-200`}
            >
              {saving ? '保存中...' : '保存并返回'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}