# 공통 컴포넌트 사용법

## 헤더(메뉴) 컴포넌트

모든 페이지에서 동일한 네비게이션을 쓰기 위해 **헤더를 한 곳에서 관리**합니다.

### 파일

- **`header.html`** – 메뉴 HTML (링크는 `{{BASE}}` 플레이스홀더 사용)
- **`../js/nav-loader.js`** – 헤더를 불러와 넣고, 활성 메뉴를 표시

### 신규 페이지 추가 시

1. **헤더 대신** 아래 두 줄을 넣습니다.

   ```html
   <div id="header-placeholder"></div>
   <script id="nav-loader" src="경로/nav-loader.js" data-base="경로"></script>
   ```

2. **경로 규칙**
   - **루트** (index.html, ai-analysis.html 등):  
     `src="assets/js/nav-loader.js"` · `data-base=""`
   - **하위 폴더** (color-tone, makeup, skincare 등):  
     `src="../assets/js/nav-loader.js"` · `data-base="../"`

3. **현재 페이지 표시**  
   `<body>`에 `data-current="현재페이지 경로"`를 넣으면 해당 메뉴에 활성 스타일이 적용됩니다.

   - 루트: `data-current="index.html"` 또는 `data-current="ai-analysis.html"`
   - color-tone: `data-current="color-tone/personal-color.html"` 등
   - makeup: `data-current="makeup/makeup-style.html"` 등
   - skincare: `data-current="skincare/skin-type.html"` 등

### 예시 (루트 페이지)

```html
<body data-current="index.html">
  <div class="page-wrapper">
    <div id="header-placeholder"></div>
    <script id="nav-loader" src="assets/js/nav-loader.js" data-base=""></script>
    <!-- 본문 -->
  </div>
  <script src="assets/js/main.js"></script>
</body>
```

### 예시 (하위 폴더 페이지, 예: makeup/new-page.html)

```html
<body data-current="makeup/new-page.html">
  <div class="page-wrapper">
    <div id="header-placeholder"></div>
    <script id="nav-loader" src="../assets/js/nav-loader.js" data-base="../"></script>
    <!-- 본문 -->
  </div>
  <script src="../assets/js/main.js"></script>
</body>
```

### 메뉴 수정

메뉴 항목을 바꾸거나 추가할 때는 **`assets/components/header.html`** 만 수정하면 됩니다.  
링크에는 반드시 `{{BASE}}`를 붙여 두세요. (예: `href="{{BASE}}color-tone/personal-color.html"`)

---

## 푸터 컴포넌트

Google AdSense 승인을 위해 **개인정보처리방침**, **이용약관**, **사이트 소개**, **문의하기** 링크가 포함된 공통 푸터를 사용합니다.

### 파일

- **`footer.html`** – 푸터 HTML (링크는 `{{BASE}}` 플레이스홀더 사용)
- **`../js/footer-loader.js`** – 푸터를 불러와 `#footer-placeholder`에 삽입

### 신규 페이지 추가 시

1. 본문 끝, `</div>` (page-wrapper 닫기) 직전에 아래 두 줄을 넣습니다.

   ```html
   <div id="footer-placeholder"></div>
   <script id="footer-loader" src="경로/footer-loader.js" data-base="경로"></script>
   ```

2. **경로 규칙** (헤더와 동일)
   - **루트**: `src="assets/js/footer-loader.js"` · `data-base=""`
   - **하위 폴더**: `src="../assets/js/footer-loader.js"` · `data-base="../"`

### 푸터 수정

**`assets/components/footer.html`** 만 수정하면 모든 페이지에 반영됩니다.  
정책·소개 페이지: `privacy.html`, `terms.html`, `about.html` (루트에 있음).  
문의 이메일은 footer.html 내 `mailto:` 링크에서 변경할 수 있습니다.
