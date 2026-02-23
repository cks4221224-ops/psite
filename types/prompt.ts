/**
 * PromptHub 프론트엔드 타입 정의
 */

/** 프롬프트 유형 */
export type PromptType = "image" | "text";

/** 프롬프트 정렬 옵션 */
export type SortOption = "latest" | "views" | "likes";

/** 프롬프트 단건 데이터 */
export interface Prompt {
  id: string;
  title: string;
  content: string;
  type: PromptType;
  platform: string;
  category: string;
  view_count: number;
  like_count: number;
  created_at: string;
}

/** 프롬프트 목록 응답 (페이지네이션 포함) */
export interface PromptListResponse {
  items: Prompt[];
  total: number;
  page: number;
  size: number;
  total_pages: number;
}

/** 프롬프트 생성 요청 */
export interface PromptCreatePayload {
  title: string;
  content: string;
  type: PromptType;
  platform: string;
  category: string;
}

/** 프롬프트 수정 요청 */
export interface PromptUpdatePayload {
  title?: string;
  content?: string;
  type?: PromptType;
  platform?: string;
  category?: string;
}

/** 필터 상태 */
export interface FilterState {
  sort: SortOption;
  type: string;
  platform: string;
  category: string;
}

/** 사이드바 필터 초기값 */
export const DEFAULT_FILTERS: FilterState = {
  sort: "latest",
  type: "",
  platform: "",
  category: "",
};

/** 플랫폼 목록 */
export const PLATFORMS = [
  "ChatGPT",
  "Claude",
  "Gemini",
  "Midjourney",
  "DALL-E 3",
  "Stable Diffusion",
  "기타",
] as const;

/** 카테고리 목록 */
export const CATEGORIES = [
  "마케팅",
  "개발",
  "아트",
  "사진",
  "콘텐츠",
  "교육",
  "비즈니스",
  "기타",
] as const;
