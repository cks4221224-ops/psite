"use client";

/**
 * PromptHub 메인 페이지 (반응형)
 * - 모바일: 하단 필터 드로어, 1열 카드
 * - 태블릿: 필터 드로어, 2열 카드
 * - 데스크톱: 고정 사이드바, 3열 카드
 */
import { useState, useCallback, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import PromptList from "@/components/PromptList";
import PromptFormModal from "@/components/Modal/PromptFormModal";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import PasswordModal from "@/components/Modal/PasswordModal";
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
  const [data, setData]               = useState<PromptListResponse | null>(null);
  const [isLoading, setIsLoading]     = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters]         = useState<FilterState>(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  // 모바일 필터 드로어
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // 비밀번호 모달 — 수정/삭제 전 검증
  const [pendingEdit, setPendingEdit]     = useState<Prompt | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  // 실제 작업 모달 (비밀번호 확인 후 열림)
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

  useEffect(() => { setCurrentPage(1); }, [searchQuery, filters]);
  useEffect(() => { loadPrompts(); }, [loadPrompts]);

  /* ── 필터 초기화 ── */
  const handleReset = () => {
    setSearchQuery("");
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  };

  /* ── 비밀번호 확인 후 작업 진행 ── */
  const handlePasswordConfirm = () => {
    if (pendingEdit) {
      setEditingPrompt(pendingEdit);
      setPendingEdit(null);
    } else if (pendingDeleteId) {
      setDeletingId(pendingDeleteId);
      setPendingDeleteId(null);
    }
  };

  const handlePasswordClose = () => {
    setPendingEdit(null);
    setPendingDeleteId(null);
  };

  /* ── CRUD 핸들러 ── */
  const handleCreate = async (payload: PromptCreatePayload) => {
    await createPrompt(payload);
    addToast("success", "프롬프트가 등록되었습니다.");
    loadPrompts();
  };

  const handleUpdate = async (payload: PromptCreatePayload) => {
    if (!editingPrompt) return;
    await updatePrompt(editingPrompt.id, payload);
    addToast("success", "프롬프트가 수정되었습니다.");
    loadPrompts();
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    await deletePrompt(deletingId);
    addToast("success", "프롬프트가 삭제되었습니다.");
    loadPrompts();
  };

  const handleLike = async (id: string) => {
    try {
      const updated = await toggleLike(id);
      setData((prev) =>
        prev
          ? { ...prev, items: prev.items.map((p) => p.id === id ? { ...p, like_count: updated.like_count } : p) }
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
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-screen-xl gap-8 px-4 sm:px-6 py-6 lg:py-8">

        {/* 사이드바: 데스크톱에서 고정 표시 */}
        <Sidebar
          filters={filters}
          onChange={setFilters}
          onReset={handleReset}
          isOpen={showFilterDrawer}
          onClose={() => setShowFilterDrawer(false)}
        />

        {/* 우측 영역: 검색바 + 목록 */}
        <section className="flex flex-1 flex-col gap-4 lg:gap-6 min-w-0">

          {/* 검색바 + 모바일 필터 버튼 */}
          <div className="flex gap-2">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />

            {/* 모바일/태블릿 전용 필터 버튼 */}
            <button
              onClick={() => setShowFilterDrawer(true)}
              className="lg:hidden shrink-0 flex items-center gap-1.5 rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] px-3 text-sm text-gray-400 transition-all hover:bg-[#222] hover:text-white active:scale-95"
              aria-label="필터 열기"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline text-xs">필터</span>
            </button>
          </div>

          {/* 프롬프트 목록 */}
          <PromptList
            data={data}
            isLoading={isLoading}
            onEdit={(p) => setPendingEdit(p)}
            onDelete={(id) => setPendingDeleteId(id)}
            onLike={handleLike}
            onReset={handleReset}
            onPageChange={setCurrentPage}
          />
        </section>
      </main>

      {/* ── 모달 영역 ── */}

      {/* 비밀번호 확인 모달 (수정/삭제 전) */}
      {(pendingEdit || pendingDeleteId) && (
        <PasswordModal
          onConfirm={handlePasswordConfirm}
          onClose={handlePasswordClose}
        />
      )}

      {showCreateModal && (
        <PromptFormModal
          mode="create"
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreate}
        />
      )}
      {editingPrompt && (
        <PromptFormModal
          mode="edit"
          initialData={editingPrompt}
          onClose={() => setEditingPrompt(null)}
          onSubmit={handleUpdate}
        />
      )}
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
