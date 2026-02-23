"use client";

/**
 * 빈 상태(Empty State) 컴포넌트
 * - 검색/필터 결과가 없을 때 표시
 * - 돋보기 아이콘 + "결과가 없습니다" 메시지
 * - "필터 초기화" 버튼
 */
import { Search } from "lucide-react";

interface EmptyStateProps {
  /** 필터 초기화 핸들러 */
  onReset: () => void;
}

export default function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-24 text-center">
      {/* 돋보기 아이콘 */}
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#1a1a1a] border border-[#2a2a2a]">
        <Search className="h-10 w-10 text-gray-600" />
      </div>

      {/* 메시지 */}
      <h3 className="mb-2 text-xl font-semibold text-white">결과가 없습니다</h3>
      <p className="mb-8 text-sm text-gray-500">
        다른 검색어나 필터를 사용해보세요.
      </p>

      {/* 필터 초기화 버튼 */}
      <button
        onClick={onReset}
        className="rounded-lg border border-indigo-500/50 px-6 py-2.5 text-sm font-medium text-indigo-400 transition-all duration-200 hover:bg-indigo-500/10 hover:border-indigo-400 active:scale-95"
      >
        필터 초기화
      </button>
    </div>
  );
}
