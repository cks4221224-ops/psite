/**
 * PromptHub API 클라이언트
 * FastAPI 백엔드와 통신하는 모든 fetch 함수 정의
 */
import type {
  Prompt,
  PromptListResponse,
  PromptCreatePayload,
  PromptUpdatePayload,
  FilterState,
} from "@/types/prompt";

// 백엔드 API 기본 URL (환경 변수에서 읽음)
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

/** API 오류 클래스 */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** 공통 fetch 헬퍼 함수 */
async function fetchApi<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${path}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "알 수 없는 오류" }));
    throw new ApiError(response.status, errorData.detail || `HTTP ${response.status} 오류`);
  }

  // 204 No Content 처리
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// ─────────────────────────────────────────
// 프롬프트 API 함수
// ─────────────────────────────────────────

/**
 * 프롬프트 목록 조회
 * 검색 키워드, 필터, 페이지네이션 파라미터를 URL 쿼리로 전달
 */
export async function fetchPrompts(params: {
  q?: string;
  filters: FilterState;
  page: number;
  size?: number;
}): Promise<PromptListResponse> {
  const query = new URLSearchParams();

  // 검색 키워드
  if (params.q && params.q.trim()) {
    query.set("q", params.q.trim());
  }

  // 정렬
  if (params.filters.sort) {
    query.set("sort", params.filters.sort);
  }

  // 필터 (빈 문자열 제외)
  if (params.filters.type) {
    query.set("type", params.filters.type);
  }
  if (params.filters.platform) {
    query.set("platform", params.filters.platform);
  }
  if (params.filters.category) {
    query.set("category", params.filters.category);
  }

  // 페이지네이션
  query.set("page", String(params.page));
  query.set("size", String(params.size || 12));

  return fetchApi<PromptListResponse>(`/prompts?${query.toString()}`);
}

/**
 * 프롬프트 단건 조회 (조회수 자동 증가)
 */
export async function fetchPromptById(id: string): Promise<Prompt> {
  return fetchApi<Prompt>(`/prompts/${id}`);
}

/**
 * 프롬프트 생성
 */
export async function createPrompt(payload: PromptCreatePayload): Promise<Prompt> {
  return fetchApi<Prompt>("/prompts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * 프롬프트 수정 (부분 업데이트)
 */
export async function updatePrompt(
  id: string,
  payload: PromptUpdatePayload
): Promise<Prompt> {
  return fetchApi<Prompt>(`/prompts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

/**
 * 프롬프트 삭제
 */
export async function deletePrompt(id: string): Promise<{ message: string }> {
  return fetchApi<{ message: string }>(`/prompts/${id}`, {
    method: "DELETE",
  });
}

/**
 * 좋아요 토글
 */
export async function toggleLike(id: string): Promise<Prompt> {
  return fetchApi<Prompt>(`/prompts/${id}/like`, {
    method: "POST",
  });
}
