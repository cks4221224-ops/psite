"use client";

/**
 * 프롬프트 카드 컴포넌트
 * - 제목, 내용 미리보기, 유형/플랫폼/카테고리 뱃지
 * - 조회수, 좋아요 수 표시
 * - 수정 / 삭제 버튼
 * - 좋아요 버튼
 */
import { Eye, Heart, ImageIcon, FileText, Edit2, Trash2 } from "lucide-react";
import type { Prompt } from "@/types/prompt";

interface PromptCardProps {
  prompt: Prompt;
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
  onLike: (id: string) => void;
}

/** 유형 뱃지 설정 */
const TYPE_CONFIG = {
  image: {
    label: "이미지",
    icon: ImageIcon,
    className: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
  },
  text: {
    label: "텍스트",
    icon: FileText,
    className: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  },
} as const;

/** 날짜 포맷 (한국어) */
function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

/** 숫자 포맷 (1000 → 1K) */
function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export default function PromptCard({
  prompt,
  onEdit,
  onDelete,
  onLike,
}: PromptCardProps) {
  const typeConfig = TYPE_CONFIG[prompt.type];
  const TypeIcon = typeConfig.icon;

  return (
    <article className="group relative flex flex-col rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-5 transition-all duration-200 hover:border-indigo-500/40 hover:bg-[#1e1e1e] hover:shadow-lg hover:shadow-indigo-500/5">
      {/* 상단: 유형 뱃지 + 수정/삭제 버튼 */}
      <div className="mb-3 flex items-start justify-between gap-2">
        {/* 유형 뱃지 */}
        <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${typeConfig.className}`}>
          <TypeIcon className="h-3 w-3" />
          {typeConfig.label}
        </span>

        {/* 수정/삭제 버튼 (모바일: 항상 표시 / 데스크탑: 호버 시 표시) */}
        <div className="flex items-center gap-1 opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100">
          <button
            onClick={() => onEdit(prompt)}
            aria-label="수정"
            className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-[#2a2a2a] hover:text-indigo-400"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(prompt.id)}
            aria-label="삭제"
            className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 제목 */}
      <h3 className="mb-2 line-clamp-1 text-sm font-semibold text-white">
        {prompt.title}
      </h3>

      {/* 내용 미리보기 */}
      <p className="mb-4 line-clamp-3 flex-1 text-xs leading-relaxed text-gray-500">
        {prompt.content}
      </p>

      {/* 플랫폼 + 카테고리 뱃지 */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        <span className="rounded-md bg-[#222] px-2 py-0.5 text-xs text-gray-400 border border-[#2a2a2a]">
          {prompt.platform}
        </span>
        <span className="rounded-md bg-[#222] px-2 py-0.5 text-xs text-gray-400 border border-[#2a2a2a]">
          {prompt.category}
        </span>
      </div>

      {/* 하단: 날짜 + 통계 + 좋아요 버튼 */}
      <div className="flex items-center justify-between text-xs text-gray-600">
        {/* 날짜 */}
        <span>{formatDate(prompt.created_at)}</span>

        {/* 통계 + 좋아요 버튼 */}
        <div className="flex items-center gap-3">
          {/* 조회수 */}
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {formatCount(prompt.view_count)}
          </span>

          {/* 좋아요 버튼 */}
          <button
            onClick={() => onLike(prompt.id)}
            aria-label="좋아요"
            className="flex items-center gap-1 text-gray-500 transition-colors hover:text-pink-400"
          >
            <Heart className="h-3 w-3" />
            {formatCount(prompt.like_count)}
          </button>
        </div>
      </div>
    </article>
  );
}
