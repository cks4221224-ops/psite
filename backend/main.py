"""
PromptHub FastAPI 메인 애플리케이션
프롬프트 공유 플랫폼 백엔드 서버
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routers import prompts

# 환경 변수 로드
load_dotenv()

# FastAPI 앱 인스턴스 생성
app = FastAPI(
    title="PromptHub API",
    description="프롬프트 공유 플랫폼 PromptHub의 REST API",
    version="1.0.0",
    docs_url="/docs",       # Swagger UI 경로
    redoc_url="/redoc",     # ReDoc 경로
)

# ─────────────────────────────────────────
# CORS 미들웨어 설정
# ─────────────────────────────────────────
# 환경 변수에서 허용 오리진 읽기 (쉼표로 구분)
raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
allowed_origins = [origin.strip() for origin in raw_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,      # 허용할 프론트엔드 도메인
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────
# 라우터 등록
# ─────────────────────────────────────────
app.include_router(prompts.router, prefix="/api/v1")


# ─────────────────────────────────────────
# 헬스 체크 엔드포인트
# ─────────────────────────────────────────
@app.get("/", tags=["헬스 체크"], summary="서버 상태 확인")
async def root():
    """서버 상태를 반환합니다."""
    return {
        "status": "정상",
        "service": "PromptHub API",
        "version": "1.0.0",
    }


@app.get("/health", tags=["헬스 체크"], summary="헬스 체크")
async def health_check():
    """Render 헬스 체크용 엔드포인트입니다."""
    return {"status": "ok"}


# ─────────────────────────────────────────
# 로컬 개발 서버 실행
# ─────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn

    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))

    print(f"PromptHub API 서버 시작: http://{host}:{port}")
    print(f"API 문서: http://{host}:{port}/docs")

    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True,    # 개발 환경에서 자동 리로드
    )
