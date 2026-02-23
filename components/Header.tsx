"use client";

/**
 * 헤더 컴포넌트
 * - 좌측: PromptHub 로고
 * - 우측: 프롬프트 등록 버튼 (보라색 그라디언트)
 */
import { Zap } from "lucide-react";

interface HeaderProps {
  /** 프롬프트 등록 버튼 클릭 핸들러 */
  onCreateClick: () => void;
}

export default function Header({ onCreateClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#2a2a2a] bg-[#111111]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-6">
        {/* 로고 영역 */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Prompt<span className="text-indigo-400">Hub</span>
          </span>
        </div>

        {/* 프롬프트 등록 버튼 */}
        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-400 hover:to-purple-500 hover:shadow-indigo-500/40 active:scale-95"
        >
          <span className="text-base leading-none">+</span>
          <span>프롬프트 등록</span>
        </button>
      </div>
    </header>
  );
}
