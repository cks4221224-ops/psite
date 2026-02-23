-- PromptHub 데이터베이스 스키마
-- Supabase (PostgreSQL) 에서 실행하세요

-- UUID 확장 활성화 (Supabase는 기본 활성화됨)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- prompts 테이블 생성
CREATE TABLE IF NOT EXISTS prompts (
    id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,                          -- 프롬프트 제목
    content     TEXT        NOT NULL,                           -- 프롬프트 내용
    type        VARCHAR(50) NOT NULL CHECK (type IN ('image', 'text')),  -- 유형: 이미지/텍스트
    platform    VARCHAR(100) NOT NULL,                          -- 플랫폼 (예: ChatGPT, Midjourney)
    category    VARCHAR(100) NOT NULL,                          -- 카테고리 (예: 마케팅, 개발)
    view_count  INTEGER     DEFAULT 0 NOT NULL,                 -- 조회수
    like_count  INTEGER     DEFAULT 0 NOT NULL,                 -- 좋아요 수
    created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL              -- 생성일시
);

-- 검색 성능을 위한 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_prompts_type      ON prompts(type);
CREATE INDEX IF NOT EXISTS idx_prompts_platform  ON prompts(platform);
CREATE INDEX IF NOT EXISTS idx_prompts_category  ON prompts(category);
CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON prompts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prompts_view_count ON prompts(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_prompts_like_count ON prompts(like_count DESC);

-- 전문 검색(Full-text search)을 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_prompts_fts ON prompts
    USING GIN (to_tsvector('simple', title || ' ' || content));

-- 샘플 데이터 삽입 (테스트용)
INSERT INTO prompts (title, content, type, platform, category, view_count, like_count) VALUES
(
    '전문적인 마케팅 카피 작성',
    '당신은 10년 경력의 마케팅 전문가입니다. 다음 제품에 대한 설득력 있는 카피를 작성해주세요. 제품: {제품명}. 타겟 고객: {타겟}. 핵심 혜택: {혜택}. 톤: 전문적이고 신뢰감 있게.',
    'text', 'ChatGPT', '마케팅',
    245, 89
),
(
    '미드저니 판타지 풍경 이미지',
    'Epic fantasy landscape, ancient ruins overgrown with glowing vines, mystical purple mist, towering mountains in background, golden hour lighting, hyper-detailed, 8K resolution, cinematic composition --ar 16:9 --v 6',
    'image', 'Midjourney', '아트',
    512, 201
),
(
    'Python 코드 리뷰 도우미',
    '당신은 시니어 Python 개발자입니다. 제가 제공하는 코드를 리뷰하고 다음 항목을 분석해주세요: 1) 버그 및 오류 2) 성능 최적화 방안 3) PEP 8 준수 여부 4) 보안 취약점. 코드: {코드}',
    'text', 'Claude', '개발',
    378, 145
),
(
    '인스타그램 제품 사진 스타일',
    'Professional product photography, minimalist white background, soft natural lighting, luxury cosmetic bottle, shallow depth of field, Instagram aesthetic, commercial quality, high-end brand feel --ar 1:1 --style raw',
    'image', 'DALL-E 3', '사진',
    189, 67
),
(
    'SEO 최적화 블로그 포스트',
    '당신은 SEO 전문 콘텐츠 작성자입니다. 다음 키워드로 2000자 분량의 블로그 포스트를 작성해주세요. 메인 키워드: {키워드}. 서론-본론-결론 구조로 작성하고, H2/H3 태그를 활용하세요.',
    'text', 'ChatGPT', '콘텐츠',
    423, 178
);

-- RLS (Row Level Security) 정책 설정 (선택사항 - 인증 없이 공개 접근)
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

-- 기존 정책 제거 후 재생성 (중복 실행 시 에러 방지)
DROP POLICY IF EXISTS "prompts_select_policy" ON prompts;
DROP POLICY IF EXISTS "prompts_insert_policy" ON prompts;
DROP POLICY IF EXISTS "prompts_update_policy" ON prompts;
DROP POLICY IF EXISTS "prompts_delete_policy" ON prompts;

-- 모든 사용자가 읽기 가능
CREATE POLICY "prompts_select_policy" ON prompts
    FOR SELECT USING (true);

-- 모든 사용자가 삽입 가능 (실제 서비스에서는 인증 필요)
CREATE POLICY "prompts_insert_policy" ON prompts
    FOR INSERT WITH CHECK (true);

-- 모든 사용자가 수정 가능 (실제 서비스에서는 인증 필요)
CREATE POLICY "prompts_update_policy" ON prompts
    FOR UPDATE USING (true);

-- 모든 사용자가 삭제 가능 (실제 서비스에서는 인증 필요)
CREATE POLICY "prompts_delete_policy" ON prompts
    FOR DELETE USING (true);
