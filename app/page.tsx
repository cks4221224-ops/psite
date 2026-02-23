"use client";

/**
 * PromptHub 메인 페이지
 * ─────────────────────────────────────────────
 * 레이아웃:
 *   [Header]
 *   ┌─────────────┬─────────────────────────────┐
 *   │  Sidebar    │  SearchBar                  │
 *   │  (필터)     │  PromptList (카드 그리드)    │
 *   └─────────────┴─────────────────────────────┘
 * ─────────────────────────────────────────────
 * 기능:
 *   - 프롬프트 목록 조회 (검색, 필터, 페이지네이션)
 *   - 프롬프트 생성/수정/삭제 모달
 *   - 좋아요 토글
 *   - 토스트 알림
 */
import { useState, useCallback, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import PromptList from "@/components/PromptList";
import PromptFormModal from "@/components/Modal/PromptFormModal";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import Toast from "@/components/Toast";
import type { ToastMessage } from "@/components/Toast";
import type {
  Prompt,
  PromptListResponse,
  PromptCreatePayload,
  FilterState,
} from "@/types/prompt";
import { DEFAULT_FILTERS } from "@/types/prompt";
import {
  fetchPrompts,
  createPrompt,
  updatePrompt,
  deletePrompt,
  toggleLike,
} from "@/lib/api";

export default function HomePage() {
  /* ── 상태 관리 ── */
  const [data, setData]             = useState<PromptListResponse | null>(null);
  const [isLoading, setIsLoading]   = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters]       = useState<FilterState>(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  // 모달 상태
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPrompt, setEditingPrompt]     = useState<Prompt | null>(null);
  const [deletingId, setDeletingId]           = useState<string | null>(null);

  // 토스트 알림
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  /* ── 토스트 유틸 ── */
  const addToast = (type: ToastMessage["type"], message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /* ── 데이터 조회 ── */
  const loadPrompts = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await fetchPrompts({
        q: searchQuery,
        filters,
        page: currentPage,
        size: 12,
      });
      setData(result);
    } catch {
      addToast("error", "프롬프트 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, filters, currentPage]);

  // 검색어 또는 필터 변경 시 1페이지로 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  // 의존값 변경 시 데이터 재로드
  useEffect(() => {
    loadPrompts();
  }, [loadPrompts]);

  /* ── 필터 초기화 ── */
  const handleReset = () => {
    setSearchQuery("");
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  };

  /* ── 생성 ── */
  const handleCreate = async (payload: PromptCreatePayload) => {
    await createPrompt(payload);
    addToast("success", "프롬프트가 등록되었습니다.");
    loadPrompts();
  };

  /* ── 수정 ── */
  const handleUpdate = async (payload: PromptCreatePayload) => {
    if (!editingPrompt) return;
    await updatePrompt(editingPrompt.id, payload);
    addToast("success", "프롬프트가 수정되었습니다.");
    loadPrompts();
  };

  /* ── 삭제 ── */
  const handleDelete = async () => {
    if (!deletingId) return;
    await deletePrompt(deletingId);
    addToast("success", "프롬프트가 삭제되었습니다.");
    loadPrompts();
  };

  /* ── 좋아요 ── */
  const handleLike = async (id: string) => {
    try {
      const updated = await toggleLike(id);
      // 목록에서 해당 항목 즉시 업데이트 (낙관적 UI)
      setData((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.map((p) =>
                p.id === id ? { ...p, like_count: updated.like_count } : p
              ),
            }
          : prev
      );
    } catch {
      addToast("error", "좋아요 처리에 실패했습니다.");
    }
  };

  /* ── 렌더링 ── */
  return (
    <>
      {/* 헤더 */}
      <Header onCreateClick={() => setShowCreateModal(true)} />

      {/* 메인 컨텐츠 */}
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-screen-xl gap-8 px-6 py-8">
        {/* 사이드바 */}
        <Sidebar
          filters={filters}
          onChange={(f) => setFilters(f)}
          onReset={handleReset}
        />

        {/* 우측 영역: 검색바 + 목록 */}
        <section className="flex flex-1 flex-col gap-6 min-w-0">
          {/* 검색바 */}
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          {/* 프롬프트 목록 */}
          <PromptList
            data={data}
            isLoading={isLoading}
            onEdit={(p) => setEditingPrompt(p)}
            onDelete={(id) => setDeletingId(id)}
            onLike={handleLike}
            onReset={handleReset}
            onPageChange={setCurrentPage}
          />
        </section>
      </main>

      {/* ── 모달 영역 ── */}

      {/* 프롬프트 생성 모달 */}
      {showCreateModal && (
        <PromptFormModal
          mode="create"
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreate}
        />
      )}

      {/* 프롬프트 수정 모달 */}
      {editingPrompt && (
        <PromptFormModal
          mode="edit"
          initialData={editingPrompt}
          onClose={() => setEditingPrompt(null)}
          onSubmit={handleUpdate}
        />
      )}

      {/* 삭제 확인 모달 */}
      {deletingId && (
        <ConfirmModal
          title="프롬프트 삭제"
          message="이 프롬프트를 삭제하시겠습니까? 삭제된 데이터는 복구할 수 없습니다."
          confirmLabel="삭제"
          onConfirm={handleDelete}
          onClose={() => setDeletingId(null)}
        />
      )}

      {/* 토스트 알림 */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
