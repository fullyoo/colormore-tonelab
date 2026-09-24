# Netlify 배포 및 문의 폼 체크리스트

## 404 (contact.html을 찾을 수 없음) 해결

`https://color-more.netlify.app/contact.html` 이 404인 경우, **배포된 결과물에 contact.html이 없음**을 의미합니다.

### 1. 배포 방식에 따른 설정

**A) Git 저장소 연동으로 배포하는 경우**

- Netlify 대시보드 → **Site configuration** → **Build & deploy** → **Build settings**
- **Base directory**
  - 저장소 **최상위**에 `index.html`, `contact.html`이 있으면 → **비워두기**
  - 프로젝트가 **하위 폴더**(예: `컬러미`) 안에 있으면 → **`컬러미`** 입력 (해당 폴더명만)
- **Publish directory**
  - **비워두기** → `netlify.toml`의 `publish = "."` 사용
  - 또는 직접 **`.`** 입력 (Base directory가 가리키는 폴더 전체가 사이트 루트가 됨)

**B) 드래그 앤 드롭(수동 업로드)으로 배포하는 경우**

- **반드시** `index.html`, `contact.html`, `assets` 등이 **들어 있는 폴더**를 그대로 업로드
- 상위 폴더만 올리면 그 안에 있는 `contact.html`이 루트에 포함되지 않을 수 있음

### 2. 배포 결과 확인

- **Deploys** → 가장 최근 배포 클릭 → **Deploy file explorer** (또는 "Browse deploy")  
- 열린 파일 목록 **맨 위(루트)** 에 `contact.html`, `index.html`이 보여야 함  
- 없으면 Base directory / Publish directory를 수정한 뒤 **Trigger deploy** → **Deploy site**로 재배포

### 3. 재배포 후 확인

- 브라우저에서 `https://color-more.netlify.app/contact.html` 접속  
- 페이지가 보이면 배포 설정이 맞는 것이고, 이제 문의 폼 제출도 동작합니다.

## 문의 폼(Netlify Forms) 동작 확인

1. **Forms 활성화**  
   Site configuration → **Forms** → Form detection **Enabled** 인지 확인

2. **폼이 배포 HTML에 포함되는지**  
   - 이 사이트는 정적 HTML이라 폼이 이미 `contact.html` 안에 있음  
   - `contact.html`이 배포에 포함되어 있어야 Netlify가 폼을 인식함 (위 404 해결이 선행)

3. **재배포**  
   - Base/Publish를 바꾼 경우 또는 Forms를 막았다가 켠 경우 **Trigger deploy**로 다시 배포

4. **제출 테스트**  
   - `https://사이트주소/contact.html` 접속 후 문의 보내기 실행  
   - Netlify 대시보드 → Forms → 해당 폼 이름(contact)에서 제출 건수 확인

## netlify.toml

- `publish = "."` → 이 폴더 내용이 사이트 루트로 배포됨  
- `command = ""` → 빌드 명령 없음(정적 사이트)
