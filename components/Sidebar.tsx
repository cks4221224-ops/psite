"use client";

/**
 * 사이드바 필터 컴포넌트 (반응형)
 * - lg+: 왼쪽 고정 사이드바
 * - 모바일/태블릿: 하단 드로어 (isOpen 제어)
 */
import { SlidersHorizontal, X } from "lucide-react";
import type { FilterState, SortOption } from "@/types/prompt";
import { PLATFORMS, CATEGORIES } from "@/types/prompt";

interface SidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  isOpen: boolean;
  onClose: () => void;
}

/** 라디오/체크 버튼 스타일 유틸 */
function isActive(current: string, value: string): boolean {
  return current === value;
}

/** 필터 내용 (데스크탑 + 모바일 공용) */
function FilterContent({
  filters,
  onChange,
  onReset,
  onClose,
  isMobile = false,
}: {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  onClose?: () => void;
  isMobile?: boolean;
}) {
  const handleChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onChange({ ...filters, [key]: value });
  };

  const handleToggle = <K extends keyof FilterState>(key: K, value: string) => {
    onChange({
      ...filters,
      [key]: filters[key] === value ? "" : value,
    });
  };

  return (
    <>
      {/* 필터 헤더 */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-semibold">
          <SlidersHorizontal className="h-4 w-4 text-indigo-400" />
          <span>필터</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="text-xs text-gray-500 transition-colors hover:text-indigo-400"
          >
            초기화
          </button>
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="rounded-md p-1 text-gray-500 transition-colors hover:bg-[#2a2a2a] hover:text-white"
              aria-label="닫기"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
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

      {/* 모바일: 적용 버튼 */}
      {isMobile && onClose && (
        <button
          onClick={onClose}
          className="mt-2 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-400 hover:to-purple-500 active:scale-95"
        >
          필터 적용
        </button>
      )}
    </>
  );
}

export default function Sidebar({ filters, onChange, onReset, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* 데스크탑 사이드바 */}
      <aside className="hidden lg:block w-56 shrink-0">
        <FilterContent filters={filters} onChange={onChange} onReset={onReset} />
      </aside>

      {/* 모바일 하단 드로어 */}
      {isOpen && (
        <div className="lg:hidden">
          {/* 배경 오버레이 */}
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* 드로어 패널 */}
          <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[85dvh] overflow-y-auto rounded-t-2xl border-t border-[#2a2a2a] bg-[#111111] px-4 pb-8 pt-4 shadow-2xl">
            {/* 드래그 핸들 */}
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#333]" />
            <FilterContent
              filters={filters}
              onChange={onChange}
              onReset={onReset}
              onClose={onClose}
              isMobile
            />
          </div>
        </div>
      )}
    </>
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
