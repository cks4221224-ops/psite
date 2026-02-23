"use client";

/**
 * 검색바 컴포넌트
 * - 대형 중앙 배치 검색 입력창
 * - 엔터 또는 검색 버튼으로 검색 실행
 * - 입력 중 실시간 debounce 검색 지원
 */
import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  /** 현재 검색어 */
  value: string;
  /** 검색어 변경 핸들러 */
  onChange: (q: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 외부에서 value가 초기화될 때 동기화 (필터 리셋 등)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  /** 입력 변경 시 300ms debounce 후 부모에 전달 */
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setLocalValue(q);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange(q);
    }, 300);
  };

  /** 엔터 키 즉시 검색 */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      onChange(localValue);
    }
  };

  /** 검색어 초기화 */
  const handleClear = () => {
    setLocalValue("");
    onChange("");
  };

  return (
    <div className="relative w-full">
      {/* 검색 아이콘 (좌측) */}
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 pointer-events-none" />

      {/* 검색 입력창 */}
      <input
        type="text"
        placeholder="프롬프트 제목이나 내용으로 검색..."
        value={localValue}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        className="w-full rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] py-4 pl-12 pr-12 text-base text-white placeholder-gray-600 outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
      />

      {/* 초기화 버튼 (우측, 입력값 있을 때만 표시) */}
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-white"
          aria-label="검색어 지우기"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
