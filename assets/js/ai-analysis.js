/* ==========================================
   AI 퍼스널 컬러 분석 스크립트
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 요소 참조
  const btnStartAnalysis = document.getElementById('btnStartAnalysis');
  const btnStartAnalysisBottom = document.getElementById('btnStartAnalysisBottom');
  const uploadSection = document.getElementById('uploadSection');
  const uploadArea = document.getElementById('uploadArea');
  const uploadPlaceholder = document.getElementById('uploadPlaceholder');
  const uploadPreview = document.getElementById('uploadPreview');
  const previewImage = document.getElementById('previewImage');
  const fileInput = document.getElementById('fileInput');
  const btnRemoveImage = document.getElementById('btnRemoveImage');
  const btnAnalyze = document.getElementById('btnAnalyze');
  const analyzingSection = document.getElementById('analyzingSection');
  const analyzingImage = document.getElementById('analyzingImage');
  const analyzingStep = document.getElementById('analyzingStep');
  const resultSection = document.getElementById('resultSection');
  const aiHero = document.querySelector('.ai-hero');
  const faqSection = document.querySelector('.ai-faq-section');
  const samplePhotosFemale = document.getElementById('samplePhotosFemale');
  const samplePhotosMale = document.getElementById('samplePhotosMale');

  let uploadedImage = null;

  const MAX_FILE_SIZE_MB = 10;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
  const SAMPLE_BASE = 'assets/images/sample/';
  const FEMALE_SAMPLE_IMAGES = Array.from({ length: 20 }, (_, i) =>
    SAMPLE_BASE + (i + 1) + '.webp'
  );
  const MALE_SAMPLE_IMAGES = Array.from({ length: 20 }, (_, i) =>
    SAMPLE_BASE + 'm' + (i + 1) + '.webp'
  );

  // AI 분석 결과 데이터
  const analysisResults = {
    spring: {
      badge: '봄 웜톤',
      badgeClass: 'spring',
      title: '🌸 봄 웜톤 (Spring Warm)',
      subtitle: '화사하고 생기 넘치는 당신!',
      description: `
        <strong>AI 분석 결과</strong>, 당신은 <strong>봄 웜톤</strong>입니다!<br><br>
        피부에서 따뜻한 복숭아빛이 감지되었어요. 밝고 선명한 컬러를 사용하면 
        얼굴이 환해지고 건강해 보입니다. 코랄, 피치, 오렌지 계열의 화사한 색상이 잘 어울려요.<br><br>
        <strong>💡 스타일링 팁:</strong> 파스텔 + 비비드 컬러 믹스가 잘 어울려요.
      `,
      warmPercent: 82,
      coolPercent: 18,
      skinTones: ['#F5D0C5', '#FFCBA4', '#E8B090'],
      palette: [
        { name: '코랄', color: '#FF7F50' },
        { name: '피치', color: '#FFDAB9' },
        { name: '살몬 핑크', color: '#FA8072' },
        { name: '라이트 오렌지', color: '#FFA07A' },
        { name: '골든 옐로우', color: '#FFD700' },
        { name: '라이트 그린', color: '#90EE90' },
        { name: '아쿠아', color: '#7FFFD4' },
        { name: '웜 아이보리', color: '#FFFFF0' }
      ],
      products: [
        { name: '코랄 핑크 립', color: '#FF6F61' },
        { name: '피치 베이지 립', color: '#E8A090' },
        { name: '살몬 블러셔', color: '#FA8072' },
        { name: '골드 하이라이터', color: '#FFD700' }
      ],
      avoidColors: [
        { name: '블루 그레이', color: '#6B8E9E' },
        { name: '머스타드', color: '#C9A227' },
        { name: '다크 버건디', color: '#4A0E0E' }
      ],
      subType: '봄 웜 라이트 가능성이 높아요 (추정)',
      hairColors: [
        { name: '골드 브라운', color: '#B8860B' },
        { name: '허니 브라운', color: '#C9A227' },
        { name: '카라멜 브라운', color: '#C68E17' },
        { name: '웜 애쉬', color: '#8B7355' }
      ],
      jewelry: '골드 / 옐로우골드 / 로즈골드',
      fashionCoordi: [
        { text: '코랄 + 화이트 조합 추천', colors: ['#FF7F50', '#FFFFFF'] },
        { text: '피치 + 베이지 조합 추천', colors: ['#FFDAB9', '#D2B48C'] },
        { text: '오렌지 + 아이보리 조합 추천', colors: ['#FFA500', '#FFFFF0'] }
      ],
      avoidMakeupReason: '블루 그레이/머스타드는 피부를 칙칙하게 보이게 할 수 있어요.',
      productListLabel: '봄웜 립·블러셔 추천',
      lipSearchQuery: '봄웜 립',
      blushSearchQuery: '봄웜 블러셔',
      hairDyeSearchQuery: '봄웜 염색',
      eyeShadowSearchQuery: '봄웜 아이쉐도우',
      fashionSearchQuery: '봄웜 패션'
    },
    summer: {
      badge: '여름 쿨톤',
      badgeClass: 'summer',
      title: '💙 여름 쿨톤 (Summer Cool)',
      subtitle: '부드럽고 우아한 당신!',
      description: `
        <strong>AI 분석 결과</strong>, 당신은 <strong>여름 쿨톤</strong>입니다!<br><br>
        피부에서 차가운 핑크빛이 감지되었어요. 채도가 낮은 파스텔 계열의 쿨한 컬러가 
        피부를 더욱 빛나게 합니다. 로즈, 라벤더, 스카이블루 계열이 잘 어울려요.<br><br>
        <strong>💡 스타일링 팁:</strong> 부드러운 쿨톤 파스텔이 베스트!
      `,
      warmPercent: 22,
      coolPercent: 78,
      skinTones: ['#F8E0E6', '#E8C8D0', '#D4B0B8'],
      palette: [
        { name: '로즈 핑크', color: '#FFB6C1' },
        { name: '라벤더', color: '#E6E6FA' },
        { name: '스카이 블루', color: '#87CEEB' },
        { name: '소프트 퍼플', color: '#DDA0DD' },
        { name: '민트', color: '#98FB98' },
        { name: '코코아 핑크', color: '#D4A0A0' },
        { name: '그레이 블루', color: '#6699CC' },
        { name: '소프트 화이트', color: '#F8F0F0' }
      ],
      products: [
        { name: '로즈 핑크 립', color: '#DB7093' },
        { name: 'MLBB 립', color: '#C77186' },
        { name: '피치 핑크 블러셔', color: '#FFB6C1' },
        { name: '핑크 하이라이터', color: '#FFE4E1' }
      ],
      avoidColors: [
        { name: '오렌지', color: '#FF8C00' },
        { name: '브라운', color: '#8B4513' },
        { name: '카키', color: '#6B6B47' }
      ],
      subType: '여름 쿨 라이트 가능성이 높아요 (추정)',
      hairColors: [
        { name: '애쉬 블론드', color: '#C5B8A8' },
        { name: '베이지 브라운', color: '#A0826D' },
        { name: '로즈 그레이', color: '#B8A99A' },
        { name: '쿨 브라운', color: '#6B5344' }
      ],
      jewelry: '실버 / 화이트골드 / 로즈골드',
      fashionCoordi: [
        { text: '로즈 + 화이트 조합 추천', colors: ['#FFB6C1', '#FFFFFF'] },
        { text: '라벤더 + 그레이 조합 추천', colors: ['#E6E6FA', '#808080'] },
        { text: '민트 + 아이보리 조합 추천', colors: ['#98FB98', '#FFFFF0'] }
      ],
      avoidMakeupReason: '오렌지/브라운은 피부를 어둡게 보이게 할 수 있어요.',
      productListLabel: '여름쿨 립·블러셔 추천',
      lipSearchQuery: '여름쿨 립',
      blushSearchQuery: '여름쿨 블러셔',
      hairDyeSearchQuery: '여름쿨 염색',
      eyeShadowSearchQuery: '여름쿨 아이쉐도우',
      fashionSearchQuery: '여름쿨 패션'
    },
    autumn: {
      badge: '가을 웜톤',
      badgeClass: 'autumn',
      title: '🍂 가을 웜톤 (Autumn Warm)',
      subtitle: '깊이감 있고 세련된 당신!',
      description: `
        <strong>AI 분석 결과</strong>, 당신은 <strong>가을 웜톤</strong>입니다!<br><br>
        피부에서 따뜻한 황금빛이 감지되었어요. 채도가 낮고 무게감 있는 어스톤 컬러가 
        피부를 건강하게 만듭니다. 카키, 브라운, 머스타드 계열이 잘 어울려요.<br><br>
        <strong>💡 스타일링 팁:</strong> 자연에서 온 듯한 어스 톤이 베스트!
      `,
      warmPercent: 75,
      coolPercent: 25,
      skinTones: ['#E8C8A0', '#D4B088', '#C0986C'],
      palette: [
        { name: '머스타드', color: '#DAA520' },
        { name: '테라코타', color: '#E2725B' },
        { name: '올리브 그린', color: '#808000' },
        { name: '카키', color: '#BDB76B' },
        { name: '버건디', color: '#800020' },
        { name: '카라멜', color: '#C68E17' },
        { name: '브라운', color: '#8B4513' },
        { name: '웜 베이지', color: '#D2B48C' }
      ],
      products: [
        { name: '테라코타 립', color: '#C2452D' },
        { name: '브릭 레드 립', color: '#A0522D' },
        { name: '피치 브라운 블러셔', color: '#CD853F' },
        { name: '골드 브론저', color: '#B8860B' }
      ],
      avoidColors: [
        { name: '퓨시아', color: '#FF00FF' },
        { name: '로열 블루', color: '#4169E1' },
        { name: '실버', color: '#C0C0C0' }
      ],
      subType: '가을 웜 딥 가능성이 높아요 (추정)',
      hairColors: [
        { name: '다크 브라운', color: '#3D2314' },
        { name: '버건디 브라운', color: '#5C4033' },
        { name: '초콜릿 브라운', color: '#4A3728' },
        { name: '레드 브라운', color: '#6B2D2D' }
      ],
      jewelry: '골드 / 앤티크 골드 / 코퍼',
      fashionCoordi: [
        { text: '버건디 + 베이지 조합 추천', colors: ['#800020', '#D2B48C'] },
        { text: '네이비 + 골드 조합 추천', colors: ['#000080', '#FFD700'] },
        { text: '올리브 + 브라운 조합 추천', colors: ['#808000', '#8B4513'] }
      ],
      avoidMakeupReason: '퓨시아/로열 블루는 피부 톤과 어울리지 않을 수 있어요.',
      productListLabel: '가을웜 립·블러셔 추천',
      lipSearchQuery: '가을웜 립',
      blushSearchQuery: '가을웜 블러셔',
      hairDyeSearchQuery: '가을웜 염색',
      eyeShadowSearchQuery: '가을웜 아이쉐도우',
      fashionSearchQuery: '가을웜 패션'
    },
    winter: {
      badge: '겨울 쿨톤',
      badgeClass: 'winter',
      title: '❄️ 겨울 쿨톤 (Winter Cool)',
      subtitle: '선명하고 시크한 당신!',
      description: `
        <strong>AI 분석 결과</strong>, 당신은 <strong>겨울 쿨톤</strong>입니다!<br><br>
        피부에서 차갑고 맑은 톤이 감지되었어요. 채도가 높고 대비가 강한 비비드 컬러가 
        피부를 더욱 맑게 합니다. 블랙, 화이트, 로열 블루 계열이 잘 어울려요.<br><br>
        <strong>💡 스타일링 팁:</strong> 강렬하고 확실한 컬러가 베스트!
      `,
      warmPercent: 15,
      coolPercent: 85,
      skinTones: ['#F0E0E8', '#E0D0D8', '#D0C0C8'],
      palette: [
        { name: '퓨어 화이트', color: '#FFFFFF' },
        { name: '제트 블랙', color: '#1A1A1A' },
        { name: '로열 블루', color: '#4169E1' },
        { name: '퓨시아', color: '#FF00FF' },
        { name: '에메랄드', color: '#50C878' },
        { name: '체리 레드', color: '#DE3163' },
        { name: '아이시 핑크', color: '#FFE4E1' },
        { name: '네이비', color: '#000080' }
      ],
      products: [
        { name: '체리 레드 립', color: '#B22222' },
        { name: '와인 립', color: '#722F37' },
        { name: '로즈 블러셔', color: '#FF69B4' },
        { name: '실버 하이라이터', color: '#E8E8E8' }
      ],
      avoidColors: [
        { name: '코랄', color: '#FF7F50' },
        { name: '머스타드', color: '#DAA520' },
        { name: '피치', color: '#FFDAB9' }
      ],
      subType: '겨울 쿨 브라이트 가능성이 높아요 (추정)',
      hairColors: [
        { name: '블루 블랙', color: '#1A1A2E' },
        { name: '다크 애쉬 브라운', color: '#4A4A5C' },
        { name: '버건디 브라운', color: '#5C4033' },
        { name: '쿨 블랙', color: '#2C2C3E' }
      ],
      jewelry: '실버 / 화이트골드 / 플래티넘',
      fashionCoordi: [
        { text: '블랙 + 로열블루 조합 추천', colors: ['#1A1A1A', '#4169E1'] },
        { text: '네이비 + 화이트 조합 추천', colors: ['#000080', '#FFFFFF'] },
        { text: '체리레드 + 블랙 조합 추천', colors: ['#DE3163', '#1A1A1A'] }
      ],
      avoidMakeupReason: '머스타드/피치는 피부를 칙칙하게 보이게 만들 수 있어요.',
      productListLabel: '겨울쿨 립·블러셔 추천',
      lipSearchQuery: '겨울쿨 립',
      blushSearchQuery: '겨울쿨 블러셔',
      hairDyeSearchQuery: '겨울쿨 염색',
      eyeShadowSearchQuery: '겨울쿨 아이쉐도우',
      fashionSearchQuery: '겨울쿨 패션'
    }
  };

  const OLIVE_YOUNG_SEARCH = 'https://www.oliveyoung.co.kr/store/search/getSearchMain.do?query=';
  // 쿠팡 파트너스 단축 링크 (타입별·카테고리별)
  const COUPANG_PARTNER_LINKS = {
    spring: {
      lip: 'https://link.coupang.com/a/dPAGc2',
      blush: 'https://link.coupang.com/a/dPDfU4',
      hairDye: 'https://link.coupang.com/a/dPDtVv',
      eyeShadow: 'https://link.coupang.com/a/dPDy3w',
      fashion: 'https://link.coupang.com/a/dPDDfL'
    },
    summer: {
      lip: 'https://link.coupang.com/a/dPDbOD',
      blush: 'https://link.coupang.com/a/dPDlFV',
      hairDye: 'https://link.coupang.com/a/dPDvbk',
      eyeShadow: 'https://link.coupang.com/a/dPDz1r',
      fashion: 'https://link.coupang.com/a/dPDEc9'
    },
    autumn: {
      lip: 'https://link.coupang.com/a/dPDdjh',
      blush: 'https://link.coupang.com/a/dPDmVM',
      hairDye: 'https://link.coupang.com/a/dPDwmX',
      eyeShadow: 'https://link.coupang.com/a/dPDBbN',
      fashion: 'https://link.coupang.com/a/dPDFeL'
    },
    winter: {
      lip: 'https://link.coupang.com/a/dPDeDc',
      blush: 'https://link.coupang.com/a/dPDotS',
      hairDye: 'https://link.coupang.com/a/dPDxp0',
      eyeShadow: 'https://link.coupang.com/a/dPDB4C',
      fashion: 'https://link.coupang.com/a/dPDGiV'
    }
  };

  // 업로드 화면으로 전환
  function showUploadView() {
    aiHero.classList.add('hidden');
    if (faqSection) faqSection.classList.add('hidden');
    uploadSection.classList.remove('hidden');
    uploadSection.scrollIntoView({ behavior: 'smooth' });
  }

  // 인트로 화면으로 전환 (AI 분석 첫 화면)
  function showIntroView() {
    aiHero.classList.remove('hidden');
    if (faqSection) faqSection.classList.remove('hidden');
    uploadSection.classList.add('hidden');
  }

  // 시작 버튼 클릭 (상단 + ai-detail-section 하단)
  function onStartClick() {
    history.pushState({ view: 'upload' }, '', window.location.pathname);
    showUploadView();
  }
  btnStartAnalysis.addEventListener('click', onStartClick);
  if (btnStartAnalysisBottom) {
    btnStartAnalysisBottom.addEventListener('click', onStartClick);
  }

  // 브라우저 뒤로가기 시 인트로 화면으로 복귀
  window.addEventListener('popstate', (e) => {
    if (!uploadSection.classList.contains('hidden')) {
      showIntroView();
    }
  });

  // 업로드 영역 클릭
  uploadArea.addEventListener('click', () => {
    fileInput.click();
  });

  // 드래그 앤 드롭
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
  });

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  });

  // 파일 선택
  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  });

  // 파일 처리
  function handleFile(file) {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      alert(`파일 용량은 최대 ${MAX_FILE_SIZE_MB}MB까지 가능해요.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedImage = e.target.result;
      previewImage.src = uploadedImage;
      uploadPlaceholder.classList.add('hidden');
      uploadPreview.classList.remove('hidden');
      btnAnalyze.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  }

  // 이미지 제거(다시 선택)
  btnRemoveImage.addEventListener('click', (e) => {
    e.stopPropagation();
    uploadedImage = null;
    previewImage.src = '';
    fileInput.value = '';
    uploadPlaceholder.classList.remove('hidden');
    uploadPreview.classList.add('hidden');
    btnAnalyze.classList.add('hidden');
  });

  // 샘플 사진: 여성/남성 드롭다운 각각 동적 생성
  function buildSampleDropdown(container, images, labelPrefix) {
    if (!container) return;
    images.forEach((url, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sample-photo-item';
      btn.dataset.src = url;
      btn.setAttribute('aria-label', labelPrefix + (i + 1));
      btn.setAttribute('role', 'option');
      const img = document.createElement('img');
      img.src = url;
      img.alt = labelPrefix + (i + 1);
      btn.appendChild(img);
      container.appendChild(btn);
    });
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.sample-photo-item');
      if (!btn || !btn.dataset.src) return;
      previewImage.src = btn.dataset.src;
      uploadedImage = btn.dataset.src;
      uploadPlaceholder.classList.add('hidden');
      uploadPreview.classList.remove('hidden');
      btnAnalyze.classList.remove('hidden');
      document.querySelectorAll('.sample-drop-trigger').forEach(t => {
        t.classList.remove('open');
        t.setAttribute('aria-expanded', 'false');
      });
      document.querySelectorAll('.sample-drop-panel').forEach(p => p.classList.remove('open'));
      // 샘플 선택 시(처음·다른 사진으로 변경 시) 업로드 섹션으로 스크롤
      uploadSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  const sampleDropTriggerFemale = document.getElementById('sampleDropTriggerFemale');
  const sampleDropListFemale = document.getElementById('sampleDropListFemale');
  const sampleDropTriggerMale = document.getElementById('sampleDropTriggerMale');
  const sampleDropListMale = document.getElementById('sampleDropListMale');

  buildSampleDropdown(samplePhotosFemale, FEMALE_SAMPLE_IMAGES, '여성 샘플 ');
  buildSampleDropdown(samplePhotosMale, MALE_SAMPLE_IMAGES, '남성 샘플 ');

  function bindDropTrigger(trigger, panel) {
    if (!trigger || !panel) return;
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = trigger.classList.toggle('open');
      panel.classList.toggle('open', isOpen);
      trigger.setAttribute('aria-expanded', isOpen);
      document.querySelectorAll('.sample-drop-trigger').forEach(t => {
        if (t !== trigger) {
          t.classList.remove('open');
          t.setAttribute('aria-expanded', 'false');
        }
      });
      document.querySelectorAll('.sample-drop-panel').forEach(p => {
        if (p !== panel) p.classList.remove('open');
      });
    });
  }
  bindDropTrigger(sampleDropTriggerFemale, sampleDropListFemale);
  bindDropTrigger(sampleDropTriggerMale, sampleDropListMale);

  document.addEventListener('click', (e) => {
    if (e.target.closest('.sample-drop-wrap')) return;
    document.querySelectorAll('.sample-drop-trigger').forEach(t => {
      t.classList.remove('open');
      t.setAttribute('aria-expanded', 'false');
    });
    document.querySelectorAll('.sample-drop-panel').forEach(p => p.classList.remove('open'));
  });

  // 분석 시작
  btnAnalyze.addEventListener('click', () => {
    if (!uploadedImage) return;

    // UI 전환
    uploadSection.classList.add('hidden');
    analyzingSection.classList.remove('hidden');
    analyzingImage.src = uploadedImage;

    // 분석 시뮬레이션
    simulateAnalysis();
  });

  // 분석 시뮬레이션
  function simulateAnalysis() {
    const steps = [
      '피부톤을 확인하고 있어요...',
      '언더톤을 분석하고 있어요...',
      '색상 조화를 계산하고 있어요...',
      '최적의 컬러를 찾고 있어요...',
      '결과를 생성하고 있어요...'
    ];

    let stepIndex = 0;

    const stepInterval = setInterval(() => {
      if (stepIndex < steps.length) {
        analyzingStep.textContent = steps[stepIndex];
        stepIndex++;
      }
    }, 800);

    // 4초 후 결과 표시
    setTimeout(() => {
      clearInterval(stepInterval);
      showResult();
    }, 4000);
  }

  // 결과 표시
  function showResult() {
    // 랜덤으로 결과 선택 (실제로는 AI 분석 결과 사용)
    const seasons = ['spring', 'summer', 'autumn', 'winter'];
    const randomSeason = seasons[Math.floor(Math.random() * seasons.length)];
    const result = analysisResults[randomSeason];

    // 결과 렌더링
    document.getElementById('resultPhoto').src = uploadedImage;
    document.getElementById('resultBadge').textContent = result.badge;
    document.getElementById('resultBadge').className = `ai-result-badge ${result.badgeClass}`;
    document.getElementById('resultTitle').textContent = result.title;
    document.getElementById('resultSubtitle').textContent = result.subtitle;
    document.getElementById('resultDescription').innerHTML = result.description;

    // 분석 바
    document.getElementById('warmBar').style.width = result.warmPercent + '%';
    document.getElementById('warmValue').textContent = result.warmPercent + '%';
    document.getElementById('coolBar').style.width = result.coolPercent + '%';
    document.getElementById('coolValue').textContent = result.coolPercent + '%';

    // 피부톤
    const detectedColors = document.getElementById('detectedColors');
    detectedColors.innerHTML = result.skinTones.map(color =>
      `<div class="detected-color" style="background: ${color}"></div>`
    ).join('');

    // 팔레트
    const paletteGrid = document.getElementById('resultPalette');
    paletteGrid.innerHTML = result.palette.map(c => `
      <div class="palette-color">
        <div class="palette-circle" style="background:${c.color}"></div>
        <span class="palette-name">${c.name}</span>
      </div>
    `).join('');

    // 추천 제품
    const productColors = document.getElementById('resultProducts');
    productColors.innerHTML = result.products.map(p => `
      <div class="product-color-item">
        <div class="product-swatch" style="background:${p.color}"></div>
        <span class="product-color-name">${p.name}</span>
      </div>
    `).join('');

    // 피해야 할 컬러
    const avoidColorsEl = document.getElementById('avoidColors');
    avoidColorsEl.innerHTML = result.avoidColors.map(c => `
      <div class="avoid-color-item">
        <div class="avoid-swatch" style="background:${c.color}"></div>
        <span class="avoid-color-name">${c.name}</span>
      </div>
    `).join('');

    const avoidMakeupReasonEl = document.getElementById('avoidMakeupReason');
    if (avoidMakeupReasonEl && result.avoidMakeupReason) {
      avoidMakeupReasonEl.textContent = result.avoidMakeupReason;
      avoidMakeupReasonEl.style.display = '';
    }

    // 세부 타입
    const resultSubTypeEl = document.getElementById('resultSubType');
    if (resultSubTypeEl && result.subType) {
      resultSubTypeEl.textContent = '세부 타입: ' + result.subType;
      resultSubTypeEl.style.display = '';
    }

    // 헤어 컬러 추천 (컬러칩 포함)
    const resultHairColorsEl = document.getElementById('resultHairColors');
    if (resultHairColorsEl && result.hairColors && result.hairColors.length) {
      resultHairColorsEl.innerHTML = result.hairColors.map(item =>
        `<span class="hair-color-tag">
          <span class="hair-color-chip" style="background:${item.color}"></span>
          ${item.name}
        </span>`
      ).join('');
    }

    // 주얼리 추천
    const resultJewelryEl = document.getElementById('resultJewelry');
    if (resultJewelryEl && result.jewelry) {
      resultJewelryEl.textContent = result.jewelry;
    }

    // 패션 코디 추천 (컬러칩 포함)
    const resultFashionCoordiEl = document.getElementById('resultFashionCoordi');
    if (resultFashionCoordiEl && result.fashionCoordi && result.fashionCoordi.length) {
      resultFashionCoordiEl.innerHTML = result.fashionCoordi.map(item => {
        const chips = (item.colors || []).map(c =>
          `<span class="fashion-color-chip" style="background:${c}"></span>`
        ).join('');
        return `<div class="fashion-coordi-card"><div class="fashion-coordi-chips">${chips}</div><span class="fashion-coordi-text">${item.text || item}</span></div>`;
      }).join('');
    }

    // 추천 컬러 (코드 + 텍스트) 표시
    const resultProductColorsEl = document.getElementById('resultProductColors');
    if (resultProductColorsEl && result.products && result.products.length) {
      resultProductColorsEl.innerHTML = `
        <p class="product-colors-label">추천 컬러</p>
        <div class="product-colors-list">
          ${result.products.map(p =>
            `<div class="product-color-code-item">
              <span class="product-color-code-swatch" style="background:${p.color}"></span>
              <span class="product-color-code-name">${p.name}</span>
              <code class="product-color-code-hex">${p.color}</code>
            </div>`
          ).join('')}
        </div>
      `;
    }

    // 추천 제품 버튼: 카테고리별 올리브영(검색) + 쿠팡(파트너스 단축 링크)
    // 표시할 카테고리: 나중에 염색약·패션을 보이게 하려면 ['lip','blush','hairDye','eyeShadow','fashion'] 로 변경
    const PRODUCT_CATEGORIES_VISIBLE = ['lip', 'blush', 'eyeShadow'];
    const resultProductButtonsEl = document.getElementById('resultProductButtons');
    if (resultProductButtonsEl && result.productListLabel) {
      const allCategories = [
        { key: 'lip', label: '립', query: result.lipSearchQuery || (result.productListLabel.replace('·블러셔 추천', ' 립')) },
        { key: 'blush', label: '블러셔', query: result.blushSearchQuery || (result.productListLabel.replace(' 립·블러셔 추천', ' 블러셔')) },
        { key: 'hairDye', label: '염색약', query: result.hairDyeSearchQuery || (result.productListLabel.replace(' 립·블러셔 추천', ' 염색')) },
        { key: 'eyeShadow', label: '아이쉐도우', query: result.eyeShadowSearchQuery || (result.productListLabel.replace(' 립·블러셔 추천', ' 아이쉐도우')) },
        { key: 'fashion', label: '패션', query: result.fashionSearchQuery || (result.productListLabel.replace(' 립·블러셔 추천', ' 패션')) }
      ];
      const categories = allCategories.filter(cat => PRODUCT_CATEGORIES_VISIBLE.includes(cat.key));
      const seasonKey = randomSeason; // 'spring'|'summer'|'autumn'|'winter'
      const partnerLinks = COUPANG_PARTNER_LINKS[seasonKey] || {};
      resultProductButtonsEl.innerHTML = categories.map(cat => {
        const oliveUrl = OLIVE_YOUNG_SEARCH + encodeURIComponent(cat.query);
        const coupangUrl = partnerLinks[cat.key] || COUPANG_PARTNER_LINKS.spring[cat.key] || '#';
        return `
          <div class="product-category-row">
            <span class="product-category-name">${cat.label}</span>
            <div class="product-category-buttons">
              <a href="${coupangUrl}" class="btn-product-list btn-product-list-coupang" target="_blank" rel="noopener">쿠팡에서 제품 보기</a>
              <a href="${oliveUrl}" class="btn-product-list" target="_blank" rel="noopener">올리브영에서 검색 결과 보기</a>
            </div>
          </div>
        `;
      }).join('');
    }

    // UI 전환
    analyzingSection.classList.add('hidden');
    resultSection.classList.remove('hidden');
    resultSection.scrollIntoView({ behavior: 'smooth' });
  }

  // 다시 분석하기
  document.getElementById('btnRetryAI')?.addEventListener('click', () => {
    uploadedImage = null;
    previewImage.src = '';
    fileInput.value = '';
    uploadPlaceholder.classList.remove('hidden');
    uploadPreview.classList.add('hidden');
    btnAnalyze.classList.add('hidden');

    resultSection.classList.add('hidden');
    uploadSection.classList.remove('hidden');
    uploadSection.scrollIntoView({ behavior: 'smooth' });
  });

  // FAQ 토글 (여러 질문 동시에 열린 상태 유지)
  document.querySelectorAll('.ai-faq-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.ai-faq-item');
      const isOpen = item.classList.contains('open');
      if (isOpen) {
        item.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
});
