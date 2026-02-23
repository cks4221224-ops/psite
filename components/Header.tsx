"use client";

/**
 * 헤더 컴포넌트 (반응형)
 * - 모바일: + 아이콘만 표시
 * - sm+: "프롬프트 등록" 텍스트 표시
 */
import { Zap, Plus } from "lucide-react";

interface HeaderProps {
  onCreateClick: () => void;
}

export default function Header({ onCreateClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#2a2a2a] bg-[#111111]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 sm:h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6">
        {/* 로고 */}
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
            <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
          </div>
          <span className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Prompt<span className="text-indigo-400">Hub</span>
          </span>
        </div>

        {/* 등록 버튼 */}
        <button
          onClick={onCreateClick}
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-3 sm:px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-400 hover:to-purple-500 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">프롬프트 등록</span>
        </button>
      </div>
    </header>
  );
}
