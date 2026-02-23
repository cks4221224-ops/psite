"""
프롬프트 CRUD API 라우터
- GET    /prompts          : 목록 조회 (검색, 필터, 페이지네이션)
- POST   /prompts          : 프롬프트 생성
- GET    /prompts/{id}     : 단건 조회 (조회수 증가)
- PATCH  /prompts/{id}     : 프롬프트 수정
- DELETE /prompts/{id}     : 프롬프트 삭제
- POST   /prompts/{id}/like: 좋아요 토글
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from supabase import Client
from typing import Optional
import math

from database import get_supabase
from models.prompt import (
    PromptCreate,
    PromptUpdate,
    PromptResponse,
    PromptListResponse,
    MessageResponse,
)

router = APIRouter(prefix="/prompts", tags=["프롬프트"])

# 정렬 옵션 매핑
SORT_FIELD_MAP = {
    "latest":  ("created_at", False),   # 최신순 (내림차순)
    "views":   ("view_count", False),   # 조회수순 (내림차순)
    "likes":   ("like_count", False),   # 좋아요순 (내림차순)
}


@router.get("", response_model=PromptListResponse, summary="프롬프트 목록 조회")
async def list_prompts(
    q: Optional[str] = Query(None, description="검색 키워드"),
    sort: str = Query("latest", description="정렬: latest(최신), views(조회수), likes(좋아요)"),
    type: Optional[str] = Query(None, description="유형 필터: image 또는 text"),
    platform: Optional[str] = Query(None, description="플랫폼 필터"),
    category: Optional[str] = Query(None, description="카테고리 필터"),
    page: int = Query(1, ge=1, description="페이지 번호 (1부터 시작)"),
    size: int = Query(12, ge=1, le=100, description="페이지 크기"),
    db: Client = Depends(get_supabase),
):
    """
    프롬프트 목록을 조회합니다.
    키워드 검색, 필터링, 정렬, 페이지네이션을 지원합니다.
    """
    try:
        # 전체 개수 조회 쿼리
        count_query = db.table("prompts").select("id", count="exact")
        # 데이터 조회 쿼리
        data_query = db.table("prompts").select("*")

        # 키워드 검색 (제목 또는 내용에서 대소문자 무시)
        if q and q.strip():
            search_term = q.strip()
            count_query = count_query.or_(f"title.ilike.%{search_term}%,content.ilike.%{search_term}%")
            data_query  = data_query.or_(f"title.ilike.%{search_term}%,content.ilike.%{search_term}%")

        # 유형 필터
        if type:
            count_query = count_query.eq("type", type)
            data_query  = data_query.eq("type", type)

        # 플랫폼 필터
        if platform:
            count_query = count_query.eq("platform", platform)
            data_query  = data_query.eq("platform", platform)

        # 카테고리 필터
        if category:
            count_query = count_query.eq("category", category)
            data_query  = data_query.eq("category", category)

        # 전체 개수 조회
        count_result = count_query.execute()
        total = count_result.count if count_result.count is not None else 0

        # 정렬 적용
        sort_field, ascending = SORT_FIELD_MAP.get(sort, ("created_at", False))
        data_query = data_query.order(sort_field, desc=not ascending)

        # 페이지네이션 적용
        offset = (page - 1) * size
        data_query = data_query.range(offset, offset + size - 1)

        # 데이터 조회 실행
        data_result = data_query.execute()
        items = data_result.data or []

        # 전체 페이지 수 계산
        total_pages = math.ceil(total / size) if total > 0 else 1

        return PromptListResponse(
            items=items,
            total=total,
            page=page,
            size=size,
            total_pages=total_pages,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"목록 조회 중 오류가 발생했습니다: {str(e)}")


@router.post("", response_model=PromptResponse, status_code=201, summary="프롬프트 생성")
async def create_prompt(
    payload: PromptCreate,
    db: Client = Depends(get_supabase),
):
    """새로운 프롬프트를 생성합니다."""
    try:
        result = db.table("prompts").insert(payload.model_dump()).execute()

        if not result.data:
            raise HTTPException(status_code=500, detail="프롬프트 생성에 실패했습니다.")

        return result.data[0]

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"생성 중 오류가 발생했습니다: {str(e)}")


@router.get("/{prompt_id}", response_model=PromptResponse, summary="프롬프트 단건 조회")
async def get_prompt(
    prompt_id: str,
    db: Client = Depends(get_supabase),
):
    """
    특정 프롬프트를 조회합니다.
    조회 시 view_count(조회수)가 1 증가합니다.
    """
    try:
        # 프롬프트 조회
        result = db.table("prompts").select("*").eq("id", prompt_id).execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="프롬프트를 찾을 수 없습니다.")

        prompt = result.data[0]

        # 조회수 1 증가 (fire-and-forget 방식)
        db.table("prompts").update(
            {"view_count": prompt["view_count"] + 1}
        ).eq("id", prompt_id).execute()

        return prompt

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"조회 중 오류가 발생했습니다: {str(e)}")


@router.patch("/{prompt_id}", response_model=PromptResponse, summary="프롬프트 수정")
async def update_prompt(
    prompt_id: str,
    payload: PromptUpdate,
    db: Client = Depends(get_supabase),
):
    """특정 프롬프트를 수정합니다. 전달된 필드만 업데이트됩니다."""
    try:
        # 존재 여부 확인
        existing = db.table("prompts").select("id").eq("id", prompt_id).execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="프롬프트를 찾을 수 없습니다.")

        # None이 아닌 필드만 업데이트 (부분 업데이트)
        update_data = {k: v for k, v in payload.model_dump().items() if v is not None}

        if not update_data:
            raise HTTPException(status_code=400, detail="수정할 데이터가 없습니다.")

        result = db.table("prompts").update(update_data).eq("id", prompt_id).execute()

        if not result.data:
            raise HTTPException(status_code=500, detail="프롬프트 수정에 실패했습니다.")

        return result.data[0]

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"수정 중 오류가 발생했습니다: {str(e)}")


@router.delete("/{prompt_id}", response_model=MessageResponse, summary="프롬프트 삭제")
async def delete_prompt(
    prompt_id: str,
    db: Client = Depends(get_supabase),
):
    """특정 프롬프트를 삭제합니다."""
    try:
        # 존재 여부 확인
        existing = db.table("prompts").select("id").eq("id", prompt_id).execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="프롬프트를 찾을 수 없습니다.")

        db.table("prompts").delete().eq("id", prompt_id).execute()

        return MessageResponse(message="프롬프트가 성공적으로 삭제되었습니다.")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"삭제 중 오류가 발생했습니다: {str(e)}")


@router.post("/{prompt_id}/like", response_model=PromptResponse, summary="좋아요 토글")
async def toggle_like(
    prompt_id: str,
    db: Client = Depends(get_supabase),
):
    """
    프롬프트 좋아요를 토글합니다.
    (단순화: 매 호출마다 like_count +1)
    """
    try:
        result = db.table("prompts").select("*").eq("id", prompt_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="프롬프트를 찾을 수 없습니다.")

        prompt = result.data[0]
        new_like_count = prompt["like_count"] + 1

        updated = db.table("prompts").update(
            {"like_count": new_like_count}
        ).eq("id", prompt_id).execute()

        return updated.data[0]

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"좋아요 처리 중 오류가 발생했습니다: {str(e)}")
