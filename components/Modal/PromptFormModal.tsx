"use client";

/**
 * 프롬프트 생성/수정 통합 모달 컴포넌트
 * - mode="create" : 새 프롬프트 등록
 * - mode="edit"   : 기존 프롬프트 수정
 */
import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import type { Prompt, PromptCreatePayload, PromptType } from "@/types/prompt";
import { PLATFORMS, CATEGORIES } from "@/types/prompt";

interface PromptFormModalProps {
  mode: "create" | "edit";
  /** 수정 모드일 때 기존 데이터 */
  initialData?: Prompt;
  onClose: () => void;
  onSubmit: (payload: PromptCreatePayload) => Promise<void>;
}

const EMPTY_FORM: PromptCreatePayload = {
  title: "",
  content: "",
  type: "text",
  platform: PLATFORMS[0],
  category: CATEGORIES[0],
};

export default function PromptFormModal({
  mode,
  initialData,
  onClose,
  onSubmit,
}: PromptFormModalProps) {
  const [form, setForm] = useState<PromptCreatePayload>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof PromptCreatePayload, string>>>({});

  /* 수정 모드일 때 초기값 설정 */
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        title: initialData.title,
        content: initialData.content,
        type: initialData.type,
        platform: initialData.platform,
        category: initialData.category,
      });
    }
  }, [mode, initialData]);

  /* 유효성 검사 */
  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!form.title.trim()) newErrors.title = "제목을 입력해주세요.";
    if (!form.content.trim()) newErrors.content = "내용을 입력해주세요.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* 폼 제출 */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } catch {
      // 오류는 부모에서 처리
    } finally {
      setIsSubmitting(false);
    }
  };

  /* 배경 클릭 시 닫기 */
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const title = mode === "create" ? "프롬프트 등록" : "프롬프트 수정";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-lg rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] shadow-2xl">
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between border-b border-[#2a2a2a] px-6 py-4">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-[#2a2a2a] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* 제목 */}
          <FormField label="제목" error={errors.title} required>
            <input
              type="text"
              placeholder="프롬프트 제목을 입력하세요"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClass(!!errors.title)}
            />
          </FormField>

          {/* 유형 */}
          <FormField label="유형" required>
            <div className="flex gap-3">
              {(["text", "image"] as PromptType[]).map((t) => (
                <label key={t} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="type"
                    value={t}
                    checked={form.type === t}
                    onChange={() => setForm({ ...form, type: t })}
                    className="accent-indigo-500"
                  />
                  <span className="text-sm text-gray-300">
                    {t === "text" ? "텍스트" : "이미지"}
                  </span>
                </label>
              ))}
            </div>
          </FormField>

          {/* 플랫폼 / 카테고리 나란히 */}
          <div className="grid grid-cols-2 gap-3">
            <FormField label="플랫폼" required>
              <select
                value={form.platform}
                onChange={(e) => setForm({ ...form, platform: e.target.value })}
                className={selectClass()}
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </FormField>
            <FormField label="카테고리" required>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={selectClass()}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </FormField>
          </div>

          {/* 내용 */}
          <FormField label="내용" error={errors.content} required>
            <textarea
              rows={6}
              placeholder="프롬프트 내용을 입력하세요"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className={`${inputClass(!!errors.content)} resize-none`}
            />
          </FormField>

          {/* 버튼 영역 */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#2a2a2a] px-4 py-2 text-sm text-gray-400 transition-colors hover:border-[#3a3a3a] hover:text-white"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2 text-sm font-semibold text-white transition-all hover:from-indigo-400 hover:to-purple-500 disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {mode === "create" ? "등록하기" : "수정하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── 유틸 컴포넌트 ── */

function FormField({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-400">
        {label}
        {required && <span className="ml-0.5 text-indigo-400">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

function inputClass(hasError: boolean): string {
  return `w-full rounded-lg border ${
    hasError ? "border-red-500/60" : "border-[#2a2a2a]"
  } bg-[#111] px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30`;
}

function selectClass(): string {
  return "w-full rounded-lg border border-[#2a2a2a] bg-[#111] px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30";
}
