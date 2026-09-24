# AdSense 승인 & 배포 전 체크리스트

## 배포 전 필수 수정

1. **도메인 일괄 변경**  
   프로젝트에서 `YOUR-DOMAIN.com`을 **실제 도메인**으로 찾아 바꾸세요.
   - `index.html`, `about.html`, `blog.html`, `blog/*.html`, `privacy.html`, `terms.html`, `ai-analysis.html`, `contact.html` (canonical, og:url)
   - `sitemap.xml` (모든 loc URL)
   - `robots.txt` (Sitemap URL)

2. **문의 이메일**  
   `contact@colormoretonelab.example.com`을 **실제 사용 이메일**로 변경하세요.
   - `assets/components/footer.html` (문의하기 링크는 contact 페이지로 연결됨)
   - `contact.html` (문의 방법 섹션의 메일 주소 및 mailto 링크)

---

## AdSense 승인 요건 점검 (현재 구현 상태)

| 항목 | 상태 | 비고 |
|------|------|------|
| 개인정보처리방침 | ✅ | `privacy.html` |
| 이용약관 | ✅ | `terms.html` |
| 사이트 소개 | ✅ | `about.html` |
| 문의하기 페이지 | ✅ | `contact.html` (신규) |
| 정보성 콘텐츠 | ✅ | 메인 하단 퍼스널 컬러·메이크업 가이드 |
| 사이트 목적 문구 | ✅ | 푸터 "퍼스널 컬러 분석을 기반으로..." |
| 충분한 페이지·콘텐츠 | ✅ | 메인·사이트소개·테스트 페이지·블로그 글 다수 |
| 블로그·정보성 글 | ✅ | 블로그 메뉴 + 퍼스널컬러·립컬러·스킨케어 등 읽을거리 |
| 네비게이션 | ✅ | 헤더·푸터 메뉴 |

---

## SEO 적용 내용

- **canonical**, **Open Graph** (og:title, og:description, og:url, og:locale): 메인·서비스소개·about·privacy·terms·contact·AI분석
- **robots** meta: index, follow
- **JSON-LD** (WebSite 스키마): `index.html`
- **sitemap.xml**: 전체 주요 URL 수록
- **robots.txt**: Sitemap 경로 명시

배포 후 Google Search Console에서 sitemap 제출을 권장합니다.
