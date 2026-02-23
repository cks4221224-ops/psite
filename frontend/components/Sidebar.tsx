"use client";

/**
 * 사이드바 필터 컴포넌트
 * - 정렬: 최신순 / 조회수 / 좋아요
 * - 유형: 이미지 / 텍스트
 * - 플랫폼 목록
 * - 카테고리 목록
 */
import { SlidersHorizontal } from "lucide-react";
import type { FilterState, SortOption } from "@/types/prompt";
import { PLATFORMS, CATEGORIES } from "@/types/prompt";

interface SidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
}

/** 라디오/체크 버튼 스타일 유틸 */
function isActive(current: string, value: string): boolean {
  return current === value;
}

export default function Sidebar({ filters, onChange, onReset }: SidebarProps) {
  /** 단일 필터 값 변경 핸들러 */
  const handleChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onChange({ ...filters, [key]: value });
  };

  /** 토글 핸들러 (같은 값 클릭 시 초기화) */
  const handleToggle = <K extends keyof FilterState>(key: K, value: string) => {
    onChange({
      ...filters,
      [key]: filters[key] === value ? "" : value,
    });
  };

  return (
    <aside className="w-56 shrink-0">
      {/* 필터 헤더 */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-semibold">
          <SlidersHorizontal className="h-4 w-4 text-indigo-400" />
          <span>필터</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-gray-500 transition-colors hover:text-indigo-400"
        >
          초기화
        </button>
      </div>

      {/* ── 정렬 ── */}
      <FilterSection title="정렬">
        {(
          [
            { label: "최신순", value: "latest" as SortOption },
            { label: "조회수순", value: "views" as SortOption },
            { label: "좋아요순", value: "likes" as SortOption },
          ] as { label: string; value: SortOption }[]
        ).map(({ label, value }) => (
          <FilterChip
            key={value}
            label={label}
            active={isActive(filters.sort, value)}
            onClick={() => handleChange("sort", value)}
          />
        ))}
      </FilterSection>

      {/* ── 유형 ── */}
      <FilterSection title="유형">
        {[
          { label: "이미지", value: "image" },
          { label: "텍스트", value: "text" },
        ].map(({ label, value }) => (
          <FilterChip
            key={value}
            label={label}
            active={isActive(filters.type, value)}
            onClick={() => handleToggle("type", value)}
          />
        ))}
      </FilterSection>

      {/* ── 플랫폼 ── */}
      <FilterSection title="플랫폼">
        {PLATFORMS.map((p) => (
          <FilterChip
            key={p}
            label={p}
            active={isActive(filters.platform, p)}
            onClick={() => handleToggle("platform", p)}
          />
        ))}
      </FilterSection>

      {/* ── 카테고리 ── */}
      <FilterSection title="카테고리">
        {CATEGORIES.map((c) => (
          <FilterChip
            key={c}
            label={c}
            active={isActive(filters.category, c)}
            onClick={() => handleToggle("category", c)}
          />
        ))}
      </FilterSection>
    </aside>
  );
}

/* ── 하위 컴포넌트 ── */

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
        active
          ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/30"
          : "bg-[#1a1a1a] text-gray-400 hover:bg-[#2a2a2a] hover:text-white border border-[#2a2a2a]"
      }`}
    >
      {label}
    </button>
  );
}
