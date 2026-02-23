"use client";

/**
 * 삭제 확인 모달 컴포넌트
 * - 위험한 작업(삭제) 전에 사용자 확인 요청
 */
import { AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export default function ConfirmModal({
  title,
  message,
  confirmLabel = "삭제",
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-sm rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 shadow-2xl">
        {/* 경고 아이콘 */}
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
          <AlertTriangle className="h-5 w-5 text-red-400" />
        </div>

        {/* 제목 & 메시지 */}
        <h3 className="mb-2 text-base font-semibold text-white">{title}</h3>
        <p className="mb-6 text-sm text-gray-500">{message}</p>

        {/* 버튼 영역 */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-[#2a2a2a] py-2.5 text-sm text-gray-400 transition-colors hover:border-[#3a3a3a] hover:text-white"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-500 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-400 disabled:opacity-60"
          >
            {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
