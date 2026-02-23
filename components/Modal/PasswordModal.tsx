"use client";

/**
 * 비밀번호 확인 모달
 * - 수정/삭제 전에 비밀번호 검증
 */
import { useState, useRef, useEffect } from "react";
import { Lock, Eye, EyeOff, X } from "lucide-react";

const CORRECT_PASSWORD = "2380qudcks12!!";

interface PasswordModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

export default function PasswordModal({ onConfirm, onClose }: PasswordModalProps) {
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === CORRECT_PASSWORD) {
      onConfirm();
    } else {
      setError(true);
      setValue("");
      inputRef.current?.focus();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-sm rounded-t-2xl sm:rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 pb-8 sm:pb-6 shadow-2xl">
        {/* 모바일 드래그 핸들 */}
        <div className="sm:hidden mx-auto -mt-3 mb-4 h-1 w-10 rounded-full bg-[#333]" />

        {/* 헤더 */}
        <div className="mb-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/10 border border-indigo-500/20">
              <Lock className="h-4 w-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">비밀번호 확인</h3>
              <p className="text-xs text-gray-500">계속하려면 비밀번호를 입력하세요</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-600 transition-colors hover:bg-[#2a2a2a] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <input
              ref={inputRef}
              type={show ? "text" : "password"}
              placeholder="비밀번호 입력"
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(false); }}
              className={`w-full rounded-lg border ${
                error ? "border-red-500/60" : "border-[#2a2a2a]"
              } bg-[#111] px-3 py-2.5 pr-10 text-sm text-white placeholder-gray-600 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30`}
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
              tabIndex={-1}
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-400">비밀번호가 틀렸습니다.</p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-[#2a2a2a] py-2.5 text-sm text-gray-400 transition-colors hover:border-[#3a3a3a] hover:text-white"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 py-2.5 text-sm font-semibold text-white transition-all hover:from-indigo-400 hover:to-purple-500 active:scale-95"
            >
              확인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
