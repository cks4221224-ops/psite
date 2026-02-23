# PromptHub — AI 프롬프트 공유 플랫폼

다크모드 기반 프롬프트 공유 플랫폼. FastAPI + Next.js 14 + Supabase 조합으로 구성.

---

## 프로젝트 구조

```
psite/
├── supabase/
│   └── schema.sql           # DB 스키마 (Supabase SQL 에디터에서 실행)
├── backend/                 # FastAPI 백엔드
│   ├── main.py
│   ├── database.py
│   ├── requirements.txt
│   ├── render.yaml          # Render 배포 설정
│   ├── models/
│   │   └── prompt.py
│   └── routers/
│       └── prompts.py
└── frontend/                # Next.js 14 프론트엔드
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── globals.css
    ├── components/
    │   ├── Header.tsx
    │   ├── Sidebar.tsx
    │   ├── SearchBar.tsx
    │   ├── PromptList.tsx
    │   ├── PromptCard.tsx
    │   ├── EmptyState.tsx
    │   ├── Toast.tsx
    │   └── Modal/
    │       ├── PromptFormModal.tsx
    │       └── ConfirmModal.tsx
    ├── lib/
    │   └── api.ts            # API fetch 함수 모음
    ├── types/
    │   └── prompt.ts         # TypeScript 타입 정의
    └── vercel.json           # Vercel 배포 설정
```

---

## 시작하기

### 1단계: Supabase 설정

1. [supabase.com](https://supabase.com) 에서 프로젝트 생성
2. SQL 에디터에서 `supabase/schema.sql` 내용 실행
3. Project URL과 anon key 복사

### 2단계: 백엔드 (FastAPI) 실행

```bash
cd backend
cp .env.example .env
# .env 파일에 SUPABASE_URL, SUPABASE_KEY 입력

pip install -r requirements.txt
python main.py
# → http://localhost:8000
# → API 문서: http://localhost:8000/docs
```

### 3단계: 프론트엔드 (Next.js) 실행

```bash
cd frontend
cp .env.local.example .env.local
# .env.local: NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

npm install
npm run dev
# → http://localhost:3000
```

---

## 배포

### 백엔드 → Render (무료)

1. GitHub에 코드 push
2. [render.com](https://render.com) → New Web Service
3. `backend/` 폴더 루트로 설정
4. 환경 변수: `SUPABASE_URL`, `SUPABASE_KEY`, `ALLOWED_ORIGINS` 입력
5. 배포 완료 후 URL 복사 (예: `https://prompthub-api.onrender.com`)

### 프론트엔드 → Vercel (무료)

1. [vercel.com](https://vercel.com) → Import GitHub Repo
2. `frontend/` 폴더를 Root Directory로 설정
3. 환경 변수: `NEXT_PUBLIC_API_URL=https://prompthub-api.onrender.com/api/v1`
4. Deploy

---

## API 엔드포인트

| 메서드   | 경로                         | 설명                    |
|---------|------------------------------|-------------------------|
| GET     | `/api/v1/prompts`            | 목록 조회 (검색/필터/페이징) |
| POST    | `/api/v1/prompts`            | 프롬프트 생성            |
| GET     | `/api/v1/prompts/{id}`       | 단건 조회 (조회수 +1)    |
| PATCH   | `/api/v1/prompts/{id}`       | 프롬프트 수정            |
| DELETE  | `/api/v1/prompts/{id}`       | 프롬프트 삭제            |
| POST    | `/api/v1/prompts/{id}/like`  | 좋아요                  |

### 목록 조회 쿼리 파라미터

| 파라미터   | 설명                          | 기본값  |
|-----------|-------------------------------|--------|
| `q`       | 키워드 검색 (제목, 내용)        | -      |
| `sort`    | 정렬: `latest` / `views` / `likes` | `latest` |
| `type`    | 유형 필터: `image` / `text`   | -      |
| `platform`| 플랫폼 필터                   | -      |
| `category`| 카테고리 필터                  | -      |
| `page`    | 페이지 번호 (1부터)            | `1`    |
| `size`    | 페이지 크기 (최대 100)         | `12`   |

---

## 기술 스택

- **프론트엔드**: Next.js 14 (App Router), Tailwind CSS, Lucide React
- **백엔드**: FastAPI (Python 3.10+), Pydantic v2
- **데이터베이스**: Supabase (PostgreSQL)
- **배포**: Vercel (프론트) + Render (백엔드)
