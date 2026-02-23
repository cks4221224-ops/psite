"""
데이터베이스 연결 모듈
Supabase 클라이언트 싱글턴 패턴으로 관리
"""
import os
from supabase import create_client, Client
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

# 환경 변수에서 Supabase 설정 읽기
SUPABASE_URL: str = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY: str = os.environ.get("SUPABASE_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("SUPABASE_URL과 SUPABASE_KEY 환경 변수를 설정해주세요.")

# Supabase 클라이언트 생성 (모듈 로드 시 1회만 실행)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def get_supabase() -> Client:
    """FastAPI 의존성 주입용 Supabase 클라이언트 반환 함수"""
    return supabase
