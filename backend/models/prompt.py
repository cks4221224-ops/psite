"""
프롬프트 Pydantic 모델 정의
요청/응답 데이터 유효성 검사 및 직렬화
"""
from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime
import uuid


# 허용된 플랫폼 목록
PLATFORMS = ["ChatGPT", "Claude", "Gemini", "Midjourney", "DALL-E 3", "Stable Diffusion", "기타"]

# 허용된 카테고리 목록
CATEGORIES = ["마케팅", "개발", "아트", "사진", "콘텐츠", "교육", "비즈니스", "기타"]


class PromptBase(BaseModel):
    """프롬프트 기본 필드 (생성/수정 공통)"""
    title: str = Field(..., min_length=1, max_length=255, description="프롬프트 제목")
    content: str = Field(..., min_length=1, description="프롬프트 내용")
    type: Literal["image", "text"] = Field(..., description="유형: image(이미지) 또는 text(텍스트)")
    platform: str = Field(..., description="플랫폼 (예: ChatGPT, Midjourney)")
    category: str = Field(..., description="카테고리 (예: 마케팅, 개발)")


class PromptCreate(PromptBase):
    """프롬프트 생성 요청 모델"""
    pass


class PromptUpdate(BaseModel):
    """프롬프트 수정 요청 모델 (모든 필드 선택적)"""
    title: Optional[str] = Field(None, min_length=1, max_length=255, description="프롬프트 제목")
    content: Optional[str] = Field(None, min_length=1, description="프롬프트 내용")
    type: Optional[Literal["image", "text"]] = Field(None, description="유형")
    platform: Optional[str] = Field(None, description="플랫폼")
    category: Optional[str] = Field(None, description="카테고리")


class PromptResponse(PromptBase):
    """프롬프트 응답 모델 (DB 데이터 포함)"""
    id: str = Field(..., description="UUID")
    view_count: int = Field(default=0, description="조회수")
    like_count: int = Field(default=0, description="좋아요 수")
    created_at: datetime = Field(..., description="생성일시")

    class Config:
        from_attributes = True


class PromptListResponse(BaseModel):
    """프롬프트 목록 응답 모델 (페이지네이션 포함)"""
    items: list[PromptResponse] = Field(..., description="프롬프트 목록")
    total: int = Field(..., description="전체 개수")
    page: int = Field(..., description="현재 페이지")
    size: int = Field(..., description="페이지 크기")
    total_pages: int = Field(..., description="전체 페이지 수")


class MessageResponse(BaseModel):
    """단순 메시지 응답 모델"""
    message: str = Field(..., description="응답 메시지")
