"use client";

/**
 * 프롬프트 목록 컴포넌트
 * - 그리드 레이아웃으로 카드 렌더링
 * - 로딩 스켈레톤
 * - 빈 상태 표시
 * - 하단 페이지네이션
 */
import { Loader2 } from "lucide-react";
import type { Prompt, PromptListResponse } from "@/types/prompt";
import PromptCard from "./PromptCard";
import EmptyState from "./EmptyState";

interface PromptListProps {
  data: PromptListResponse | null;
  isLoading: boolean;
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
  onLike: (id: string) => void;
  onReset: () => void;
  onPageChange: (page: number) => void;
}

export default function PromptList({
  data,
  isLoading,
  onEdit,
  onDelete,
  onLike,
  onReset,
  onPageChange,
}: PromptListProps) {
  /* ── 로딩 상태 ── */
  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-6">
        {/* 스켈레톤 카드 그리드 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-52 animate-pulse rounded-xl border border-[#2a2a2a] bg-[#1a1a1a]"
            />
          ))}
        </div>
        {/* 로딩 인디케이터 */}
        <div className="flex justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
        </div>
      </div>
    );
  }

  /* ── 데이터 없거나 빈 결과 ── */
  if (!data || data.items.length === 0) {
    return <EmptyState onReset={onReset} />;
  }

  const { items, page, total_pages, total } = data;

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* 결과 요약 */}
      <p className="text-xs text-gray-600">
        총 <span className="font-semibold text-gray-400">{total}</span>개의 프롬프트
      </p>

      {/* 카드 그리드 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((prompt) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            onEdit={onEdit}
            onDelete={onDelete}
            onLike={onLike}
          />
        ))}
      </div>

      {/* 페이지네이션 */}
      {total_pages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={total_pages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

/* ── 페이지네이션 하위 컴포넌트 ── */
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  /** 표시할 페이지 번호 배열 생성 (최대 5개) */
  const getPageNumbers = () => {
    const delta = 2;
    const range: number[] = [];
    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(totalPages, currentPage + delta);
      i++
    ) {
      range.push(i);
    }
    return range;
  };

  return (
    <div className="flex items-center justify-center gap-1">
      {/* 이전 버튼 */}
      <PageButton
        label="‹"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />

      {/* 페이지 번호 */}
      {getPageNumbers().map((p) => (
        <PageButton
          key={p}
          label={String(p)}
          onClick={() => onPageChange(p)}
          active={p === currentPage}
        />
      ))}

      {/* 다음 버튼 */}
      <PageButton
        label="›"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
    </div>
  );
}

function PageButton({
  label,
  onClick,
  active = false,
  disabled = false,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-all duration-150 ${
        active
          ? "bg-indigo-500 text-white"
          : disabled
          ? "cursor-not-allowed text-gray-700"
          : "text-gray-400 hover:bg-[#2a2a2a] hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}
