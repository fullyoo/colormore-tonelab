/* ==========================================
   퍼스널 컬러 테스트 사이트 - 메인 스크립트
   ========================================== */

/* ---------- 모바일 메뉴 ---------- */
function initMobileMenu() {
  const btn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.nav-list');
  const header = document.querySelector('.header');
  if (!btn || !nav) return;

  function closeMenu() {
    nav.classList.remove('open');
    btn.textContent = '☰';
    if (header) header.classList.remove('menu-open');
    document.body.classList.remove('menu-open');
    var overlay = document.getElementById('nav-overlay');
    if (overlay) overlay.remove();
  }

  function openMenu() {
    if (header) header.classList.add('menu-open');
    document.body.classList.add('menu-open');
    var overlay = document.createElement('div');
    overlay.id = 'nav-overlay';
    overlay.className = 'nav-overlay';
    overlay.setAttribute('aria-hidden', 'false');
    overlay.addEventListener('click', closeMenu);
    document.body.appendChild(overlay);
  }

  btn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    btn.textContent = isOpen ? '✕' : '☰';
    if (isOpen) openMenu();
    else closeMenu();
  });

  document.addEventListener('click', (e) => {
    var overlay = document.getElementById('nav-overlay');
    if (!btn.contains(e.target) && !nav.contains(e.target) && !(overlay && overlay.contains(e.target))) {
      closeMenu();
    }
  });
}

/* ---------- 드롭다운 메뉴 (모바일 토글) ---------- */
function initNavDropdown() {
  document.querySelectorAll('.nav-dropdown-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const parent = trigger.closest('.nav-item-dropdown');
      if (!parent) return;
      if (window.innerWidth <= 1024) {
        e.preventDefault();
        parent.classList.toggle('open');
      }
    });
  });
}

/* ---------- 테스트 엔진 ---------- */
class TestEngine {
  constructor(config) {
    this.questions = config.questions;
    this.results = config.results;
    this.currentIndex = 0;
    this.answers = {};
    this.onComplete = config.onComplete || null;

    this.quizSection = document.querySelector('.quiz-section');
    this.resultSection = document.querySelector('.result-section');
    this.progressFill = document.querySelector('.progress-fill');
    this.progressText = document.querySelector('.progress-text');
    this.introSection = document.querySelector('.test-intro');

    this.init();
  }

  init() {
    this.renderQuestions();
    this.bindEvents();
  }

  renderQuestions() {
    const container = document.querySelector('.quiz-container');
    if (!container) return;

    container.innerHTML = '';

    this.questions.forEach((q, idx) => {
      const card = document.createElement('div');
      card.className = `question-card ${idx === 0 ? 'active' : ''}`;
      card.dataset.index = idx;

      let optionsHTML = '';

      if (q.type === 'visual') {
        optionsHTML = `<div class="options-visual">`;
        const visualOpts = q.addDontKnow ? [...q.options, { label: '잘 모르겠어요 (중간값)', labelEmoji: '🤷', value: 'neutral', colors: null }] : q.options;
        visualOpts.forEach((opt, oIdx) => {
          const swatches = opt.colors
            ? opt.colors.map(c => `<div class="color-swatch" style="background:${c}"></div>`).join('')
            : '';
          const isDontKnow = opt.value === 'neutral';
          const visualLabel = isDontKnow
            ? `<span class="option-dont-know-emoji">${opt.labelEmoji || '🤷'}</span><span>${opt.label || '잘 모르겠어요 (중간값)'}</span>`
            : `<span>${opt.label}</span>`;
          optionsHTML += `
            <button class="option-visual-btn${isDontKnow ? ' option-visual-btn--dont-know' : ''}" data-value="${opt.value}" data-question="${idx}">
              <div class="color-swatch-group">${swatches}</div>
              ${visualLabel}
            </button>`;
        });
        optionsHTML += `</div>`;
      } else if (q.type === 'illustrated') {
        optionsHTML = `<div class="options-illustrated">`;
        const illOpts = q.addDontKnow ? [...q.options, { label: '잘 모르겠어요 (중간값)', labelEmoji: '🤷', value: 'neutral', illustration: null }] : q.options;
        illOpts.forEach((opt, oIdx) => {
          const isDontKnow = opt.value === 'neutral';
          const illustrationHTML = opt.illustration ? `<div class="option-illustration">${opt.illustration}</div>` : (isDontKnow ? '' : '');
          const illLabel = isDontKnow
            ? `<span class="option-dont-know-emoji">${opt.labelEmoji || '🤷'}</span><span class="option-illustrated-label">${opt.label || '잘 모르겠어요 (중간값)'}</span>`
            : `<span class="option-illustrated-label">${opt.label}</span>`;
          optionsHTML += `
            <button class="option-illustrated-btn${isDontKnow ? ' option-illustrated-btn--dont-know' : ''}" data-value="${opt.value}" data-question="${idx}">
              ${illustrationHTML}
              ${illLabel}
            </button>`;
        });
        optionsHTML += `</div>`;
      } else {
        optionsHTML = `<div class="options-list">`;
        const opts = q.addDontKnow
          ? [...q.options, { label: '잘 모르겠어요 (중간값)', labelEmoji: '🤷', value: 'neutral' }]
          : q.options;
        const markers = Array.from({ length: opts.length }, (_, i) => String.fromCharCode(65 + i));
        opts.forEach((opt, oIdx) => {
          const isDontKnow = opt.value === 'neutral';
          const chipHTML = opt.color
            ? `<span class="option-chip" style="background:${opt.color}"></span>`
            : (opt.colors && opt.colors.length)
              ? `<span class="option-chips">${opt.colors.map(c => `<span class="option-chip" style="background:${c}"></span>`).join('')}</span>`
              : '';
          const labelContent = isDontKnow
            ? `<span class="option-dont-know-inner"><span class="option-dont-know-emoji">${opt.labelEmoji || '🤷'}</span><span class="option-label">${opt.label || '잘 모르겠어요 (중간값)'}</span></span>`
            : `<span class="option-label">${opt.label}</span>`;
          optionsHTML += `
            <button class="option-btn${isDontKnow ? ' option-btn--dont-know' : ''}" data-value="${opt.value}" data-question="${idx}">
              <span class="option-marker">${markers[oIdx] ?? String.fromCharCode(65 + oIdx)}</span>
              ${chipHTML ? `<span class="option-chip-wrap">${chipHTML}</span>` : ''}
              ${labelContent}
            </button>`;
        });
        optionsHTML += `</div>`;
      }

      const categoryHTML = q.category ? `<div class="question-category-badge">${q.category}</div>` : '';
      const hintHTML = q.hint ? `<div class="question-hint">${q.hint}</div>` : '';
      const whyHTML = q.why
        ? `<div class="quiz-why-wrap">
            <button type="button" class="quiz-why-trigger" aria-expanded="false">이 질문 왜 물어보나요? <span class="quiz-why-arrow">▼</span></button>
            <div class="quiz-why-content" hidden>${q.why}</div>
          </div>`
        : '';

      card.innerHTML = `
        ${categoryHTML}
        <div class="question-number">Q${idx + 1}.</div>
        <div class="question-text">${q.text}</div>
        ${hintHTML}
        ${optionsHTML}
        ${whyHTML}
      `;

      container.appendChild(card);
    });

    // 네비게이션
    const nav = document.createElement('div');
    nav.className = 'quiz-nav';
    nav.innerHTML = `
      <button class="btn-prev hidden">← 이전</button>
      <button class="btn-next" disabled>다음 →</button>
    `;
    container.appendChild(nav);

    // 안내 문구 (옵션 미선택 / 결과보기 유도)
    const messageEl = document.createElement('div');
    messageEl.className = 'quiz-message';
    messageEl.setAttribute('aria-live', 'polite');
    container.appendChild(messageEl);

    this.updateProgress();
  }

  showQuizMessage(text) {
    const el = document.querySelector('.quiz-message');
    if (!el) return;
    el.textContent = text;
    el.classList.toggle('visible', !!text);
    if (text) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  bindEvents() {
    const container = document.querySelector('.quiz-container');
    if (!container) return;

    // "이 질문 왜 물어보나요?" 토글
    container.addEventListener('click', (e) => {
      const trigger = e.target.closest('.quiz-why-trigger');
      if (trigger) {
        e.preventDefault();
        const wrap = trigger.closest('.quiz-why-wrap');
        const content = wrap?.querySelector('.quiz-why-content');
        const arrow = trigger.querySelector('.quiz-why-arrow');
        if (!content) return;
        const isOpen = content.hidden === false;
        content.hidden = isOpen;
        trigger.setAttribute('aria-expanded', !isOpen);
        if (arrow) arrow.textContent = isOpen ? '▼' : '▲';
        return;
      }
    });

    // 옵션 선택
    container.addEventListener('click', (e) => {
      const optionBtn = e.target.closest('.option-btn, .option-visual-btn, .option-illustrated-btn');
      if (!optionBtn) return;

      const questionIdx = parseInt(optionBtn.dataset.question);
      const value = optionBtn.dataset.value;

      // 같은 질문의 다른 옵션 선택 해제
      const siblings = optionBtn.parentElement.querySelectorAll('.option-btn, .option-visual-btn, .option-illustrated-btn');
      siblings.forEach(s => s.classList.remove('selected'));

      optionBtn.classList.add('selected');
      this.answers[questionIdx] = value;

      // 다음 버튼 활성화
      const nextBtn = container.querySelector('.btn-next, .btn-submit');
      if (nextBtn) nextBtn.disabled = false;

      // 마지막 문항에서 옵션 선택 시: 결과보기 버튼 안내
      if (questionIdx === this.questions.length - 1) {
        this.showQuizMessage('결과보기 버튼을 누르세요.');
      }

      // 자동 넘기기 (짧은 딜레이 후)
      setTimeout(() => {
        if (this.currentIndex < this.questions.length - 1) {
          this.goNext();
        }
      }, 400);
    });

    // 이전 / 다음 / 결과보기 버튼
    container.addEventListener('click', (e) => {
      if (e.target.closest('.btn-prev')) {
        this.goPrev();
        return;
      }
      if (e.target.closest('.btn-next')) {
        this.goNext();
        return;
      }
      if (e.target.closest('.btn-submit')) {
        if (this.answers[this.currentIndex] === undefined) {
          this.showQuizMessage('옵션을 선택해 주세요.');
          return;
        }
        this.showQuizMessage('');
        this.showResult();
        return;
      }
    });

    // 시작 버튼
    const startBtn = document.querySelector('.btn-start');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        if (this.introSection) {
          this.introSection.classList.add('hidden');
          const min = this.introSection.dataset.minutes ?? '';
          const q = this.introSection.dataset.questions ?? '';
          const r = this.introSection.dataset.results ?? '';
          const quizMeta = this.quizSection?.querySelector('.quiz-meta');
          if (quizMeta) {
            const minEl = quizMeta.querySelector('.quiz-meta-min');
            const qEl = quizMeta.querySelector('.quiz-meta-q');
            const rEl = quizMeta.querySelector('.quiz-meta-r');
            if (minEl) minEl.textContent = min;
            if (qEl) qEl.textContent = q;
            if (rEl) rEl.textContent = r;
          }
        }
        if (this.quizSection) this.quizSection.classList.remove('hidden');
        document.querySelector('.progress-section')?.classList.remove('hidden');
      });
    }

    // 다시하기 버튼
    document.querySelectorAll('.btn-retry').forEach(btn => {
      btn.addEventListener('click', () => this.restart());
    });

    // 홈으로 버튼 (공통 네비 기준 경로 사용)
    document.querySelectorAll('.btn-home').forEach(btn => {
      btn.addEventListener('click', () => {
        const base = typeof window.NAV_BASE !== 'undefined' ? window.NAV_BASE : '';
        window.location.href = base + 'index.html';
      });
    });

    // 공유 버튼
    document.querySelectorAll('.btn-share').forEach(btn => {
      btn.addEventListener('click', () => this.share());
    });
  }

  goNext() {
    if (this.answers[this.currentIndex] === undefined) return;

    this.showQuizMessage('');
    const cards = document.querySelectorAll('.question-card');
    const nav = document.querySelector('.quiz-nav');

    cards[this.currentIndex].classList.remove('active');
    this.currentIndex++;

    if (this.currentIndex >= this.questions.length) {
      this.showResult();
      return;
    }

    cards[this.currentIndex].classList.add('active');
    this.updateProgress();
    this.updateNav();
  }

  goPrev() {
    if (this.currentIndex === 0) return;

    this.showQuizMessage('');
    const cards = document.querySelectorAll('.question-card');
    cards[this.currentIndex].classList.remove('active');
    this.currentIndex--;
    cards[this.currentIndex].classList.add('active');
    this.updateProgress();
    this.updateNav();
  }

  updateProgress() {
    const pct = ((this.currentIndex + 1) / this.questions.length) * 100;
    if (this.progressFill) this.progressFill.style.width = pct + '%';
    if (this.progressText) this.progressText.textContent = `${this.currentIndex + 1} / ${this.questions.length}`;
  }

  updateNav() {
    const nav = document.querySelector('.quiz-nav');
    const prevBtn = nav?.querySelector('.btn-prev');
    const nextBtn = nav?.querySelector('.btn-next');
    const submitBtn = nav?.querySelector('.btn-submit');

    if (prevBtn) {
      prevBtn.classList.toggle('hidden', this.currentIndex === 0);
    }

    if (this.currentIndex === this.questions.length - 1) {
      // 마지막 문항: 결과 보기 버튼 표시 (다음 버튼이 있으면 교체)
      if (nextBtn) {
        const submit = document.createElement('button');
        submit.className = 'btn-submit';
        submit.textContent = '결과 보기 ✨';
        submit.type = 'button';
        nextBtn.replaceWith(submit);
      }
    } else {
      // 마지막이 아닐 때: 다음 버튼 표시 (결과 보기 버튼이 있으면 교체)
      if (submitBtn) {
        const next = document.createElement('button');
        next.className = 'btn-next';
        next.textContent = '다음 →';
        next.disabled = this.answers[this.currentIndex] === undefined;
        next.type = 'button';
        submitBtn.replaceWith(next);
      }
    }

    const currentNext = nav?.querySelector('.btn-next');
    if (currentNext) {
      currentNext.disabled = this.answers[this.currentIndex] === undefined;
    }
  }

  calculateResult() {
    const scores = {};

    Object.values(this.answers).forEach(val => {
      if (val === 'neutral') return; // 잘 모르겠어요 = 중립(0점), 집계 제외
      scores[val] = (scores[val] || 0) + 1;
    });

    let maxKey = null;
    let maxVal = 0;
    for (const [key, val] of Object.entries(scores)) {
      if (val > maxVal) {
        maxVal = val;
        maxKey = key;
      }
    }

    return this.results[maxKey] || this.results[Object.keys(this.results)[0]];
  }

  showResult() {
    this.showQuizMessage('');
    const loading = document.querySelector('.loading-overlay');
    if (loading) loading.classList.add('active');

    setTimeout(() => {
      if (loading) loading.classList.remove('active');

      const result = this.calculateResult();

      if (this.quizSection) this.quizSection.classList.add('hidden');
      document.querySelector('.progress-section')?.classList.add('hidden');
      document.querySelector('.test-page-hero')?.classList.add('hidden');

      if (this.resultSection) {
        this.resultSection.classList.add('active');
        this.renderResult(result);
      }

      if (this.onComplete) this.onComplete(result);
    }, 1800);
  }

  renderResult(result) {
    const card = this.resultSection.querySelector('.result-card');
    if (!card) return;

    const badge = card.querySelector('.result-season-badge');
    const title = card.querySelector('.result-title');
    const subtitle = card.querySelector('.result-subtitle');
    const desc = card.querySelector('.result-description');
    const paletteGrid = card.querySelector('.palette-grid');
    const faceIllustration = card.querySelector('.result-face-illustration');

    if (badge) {
      badge.className = `result-season-badge ${result.badgeClass || ''}`;
      badge.textContent = result.badge;
    }
    if (title) title.textContent = result.title;
    if (subtitle) subtitle.textContent = result.subtitle || '';
    if (desc) desc.innerHTML = result.description;

    // 얼굴 일러스트
    if (faceIllustration) {
      if (result.faceIllustration) {
        faceIllustration.innerHTML = result.faceIllustration;
        faceIllustration.style.display = 'flex';
      } else {
        faceIllustration.innerHTML = '';
        faceIllustration.style.display = 'none';
      }
    }

    if (paletteGrid && result.palette) {
      paletteGrid.innerHTML = result.palette.map(c => `
        <div class="palette-color">
          <div class="palette-circle" style="background:${c.color}"></div>
          <span class="palette-name">${c.name}</span>
        </div>
      `).join('');
    }

    // 추천 제품 컬러
    const productSection = card.querySelector('.product-colors');
    if (productSection && result.products) {
      productSection.innerHTML = result.products.map(p => `
        <div class="product-color-item">
          <div class="product-swatch" style="background:${p.color}"></div>
          <span class="product-color-name">${p.name}</span>
        </div>
      `).join('');
    }

    // === 추가 섹션 렌더링 ===
    const resultBody = card.querySelector('.result-body');
    if (!resultBody) return;

    // 기존 추가 섹션 제거 (재시작 시 중복 방지)
    resultBody.querySelectorAll('.result-extra-section').forEach(el => el.remove());

    let extraHTML = '';

    // 한줄 요약
    if (result.summary) {
      extraHTML += `<div class="result-extra-section result-summary-box"><strong>💡 요약:</strong> ${result.summary}</div>`;
    }

    // 추천 대상 / 비추천 대상
    if (result.recommendFor || result.notRecommendFor) {
      extraHTML += '<div class="result-extra-section result-target-section">';
      if (result.recommendFor && result.recommendFor.length) {
        extraHTML += `<div class="target-box recommend"><h5>✅ 이런 분께 추천해요</h5><ul>${result.recommendFor.map(t => `<li>${t}</li>`).join('')}</ul></div>`;
      }
      if (result.notRecommendFor && result.notRecommendFor.length) {
        extraHTML += `<div class="target-box not-recommend"><h5>⚠️ 이 스타일이 어려울 수 있어요</h5><ul>${result.notRecommendFor.map(t => `<li>${t}</li>`).join('')}</ul></div>`;
      }
      extraHTML += '</div>';
    }

    // 관리 난이도 / 소요시간 / 지속력 배지
    if (result.difficulty) {
      const stars = '★'.repeat(result.difficulty.stars || 0) + '☆'.repeat(5 - (result.difficulty.stars || 0));
      const longevityStars = result.difficulty.longevity != null ? '★'.repeat(result.difficulty.longevity) + '☆'.repeat(5 - result.difficulty.longevity) : '';
      extraHTML += `<div class="result-extra-section result-difficulty">
        <h5>📌 추천 난이도 / 소요시간</h5>
        <div class="difficulty-grid">
          <div class="difficulty-item"><span class="diff-label">난이도</span><span class="diff-value stars">${stars}</span></div>
          ${result.difficulty.duration ? `<div class="difficulty-item"><span class="diff-label">소요시간</span><span class="diff-value">${result.difficulty.duration}</span></div>` : ''}
          ${result.difficulty.time ? `<div class="difficulty-item"><span class="diff-label">손질 시간</span><span class="diff-value">${result.difficulty.time}</span></div>` : ''}
          ${longevityStars ? `<div class="difficulty-item"><span class="diff-label">지속력</span><span class="diff-value stars">${longevityStars}</span></div>` : ''}
          ${result.difficulty.tools ? `<div class="difficulty-item"><span class="diff-label">추천 도구</span><span class="diff-value">${result.difficulty.tools}</span></div>` : ''}
        </div>
      </div>`;
    }

    // ⭐ 추천 상황
    if (result.recommendedSituations && result.recommendedSituations.length) {
      extraHTML += `<div class="result-extra-section result-recommended-situations">
        <h5>⭐ 추천 상황</h5>
        <div class="situation-chips">${result.recommendedSituations.map(s => `<span class="situation-chip">${s}</span>`).join('')}</div>
      </div>`;
    }

    // ❌ 주의 포인트
    if (result.cautionPoints && result.cautionPoints.length) {
      extraHTML += `<div class="result-extra-section result-caution-points">
        <h5>❌ 주의 포인트</h5>
        <ul class="caution-list">${result.cautionPoints.map(c => `<li>${c}</li>`).join('')}</ul>
      </div>`;
    }

    // 🎯 메이크업 단계별 루틴(순서)
    if (result.makeupRoutine && result.makeupRoutine.length) {
      const routineTitle = result.routineSectionTitle ? '🎯 ' + result.routineSectionTitle : '🎯 메이크업 순서';
      extraHTML += `<div class="result-extra-section result-makeup-routine">
        <h5>${routineTitle}</h5>
        <ol class="routine-list">${result.makeupRoutine.map((step, i) => `<li><span class="routine-num">${i + 1}</span> ${step}</li>`).join('')}</ol>
      </div>`;
    }

    // 💡 톤별 추천 조합 (퍼스널컬러 연결)
    if (result.toneCombos && result.toneCombos.length) {
      const base = typeof window.NAV_BASE !== 'undefined' ? window.NAV_BASE : '';
      extraHTML += `<div class="result-extra-section result-tone-combos">
        <h5>💡 톤별 추천 컬러 조합</h5>
        <p class="tone-combos-desc">퍼스널컬러에 맞춰 조합하면 더 잘 어울려요.</p>
        <div class="tone-combos-grid">${result.toneCombos.map(t => {
          const url = (t.url || '../color-tone/personal-color.html');
          return `<a href="${base}${url}" class="tone-combo-card"><span class="tone-name">${t.tone}</span><span class="tone-colors">${t.colors}</span></a>`;
        }).join('')}</div>
      </div>`;
    }

    // 🧴 제품 카테고리 추천
    if (result.productCategories && result.productCategories.length) {
      extraHTML += `<div class="result-extra-section result-product-categories">
        <h5>🧴 제품 카테고리 추천</h5>
        <ul class="product-category-list">${result.productCategories.map(p => `<li><strong>${p.category}</strong> ${p.tip}</li>`).join('')}</ul>
      </div>`;
    }

    // 📊 완성 무드 (게이지)
    if (result.moodGauge && Object.keys(result.moodGauge).length) {
      const gaugeItems = Object.entries(result.moodGauge).map(([label, value]) => {
        const pct = Math.min(100, Math.max(0, Number(value) || 0));
        return `<div class="mood-row"><span class="mood-label">${label}</span><div class="mood-bar-wrap"><div class="mood-bar" style="width:${pct}%"></div></div><span class="mood-value">${pct}%</span></div>`;
      }).join('');
      extraHTML += `<div class="result-extra-section result-mood-gauge">
        <h5>📊 완성 무드</h5>
        <div class="mood-gauge-inner">${gaugeItems}</div>
      </div>`;
    }

    // Q&A 섹션
    if (result.qaSection && result.qaSection.length) {
      extraHTML += `<div class="result-extra-section result-qa-section">
        <h5>💬 자주 묻는 질문</h5>
        <div class="qa-list">${result.qaSection.map(qa => `<div class="qa-item"><p class="qa-q">${qa.q}</p><p class="qa-a">${qa.a}</p></div>`).join('')}</div>
      </div>`;
    }

    // 추천 제품/도구
    if (result.recommendedProducts && result.recommendedProducts.length) {
      extraHTML += `<div class="result-extra-section result-products-list">
        <h5>🛒 추천 제품/도구</h5>
        <ul>${result.recommendedProducts.map(p => `<li>${p}</li>`).join('')}</ul>
      </div>`;
    }

    // 함께 하면 좋은 테스트
    if (result.relatedTests && result.relatedTests.length) {
      const base = typeof window.NAV_BASE !== 'undefined' ? window.NAV_BASE : '';
      extraHTML += `<div class="result-extra-section result-related-tests">
        <h5>🔗 함께 하면 좋은 테스트</h5>
        <div class="related-tests-grid">${result.relatedTests.map(t => `<a href="${base}${t.url}" class="related-test-card"><span class="related-icon">${t.icon || '📋'}</span><span class="related-name">${t.name}</span></a>`).join('')}</div>
      </div>`;
    }

    if (extraHTML) {
      resultBody.insertAdjacentHTML('beforeend', extraHTML);
    }

    // 참고용 안내문구 (푸터 바로 위)
    const disclaimer = card.querySelector('.result-disclaimer');
    if (disclaimer) disclaimer.remove();
    if (result.disclaimer !== false) {
      const defaultDisclaimer = '본 테스트는 참고용이며, 개인의 상태에 따라 실제 결과는 달라질 수 있습니다.';
      card.insertAdjacentHTML('beforeend', `<p class="result-disclaimer">${result.disclaimer || defaultDisclaimer}</p>`);
    }
  }

  restart() {
    this.currentIndex = 0;
    this.answers = {};

    document.querySelectorAll('.option-btn, .option-visual-btn, .option-illustrated-btn').forEach(b => b.classList.remove('selected'));

    const cards = document.querySelectorAll('.question-card');
    cards.forEach((c, i) => c.classList.toggle('active', i === 0));

    if (this.resultSection) this.resultSection.classList.remove('active');
    if (this.quizSection) this.quizSection.classList.remove('hidden');
    document.querySelector('.progress-section')?.classList.remove('hidden');
    document.querySelector('.test-page-hero')?.classList.remove('hidden');

    const nav = document.querySelector('.quiz-nav');
    const submitBtn = nav?.querySelector('.btn-submit');
    if (submitBtn) {
      const nextBtn = document.createElement('button');
      nextBtn.className = 'btn-next';
      nextBtn.textContent = '다음 →';
      nextBtn.disabled = true;
      submitBtn.replaceWith(nextBtn);
    }

    this.updateProgress();
    this.updateNav();
  }

  share() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: '퍼스널 컬러 테스트 결과', url });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        alert('링크가 복사되었습니다!');
      });
    }
  }
}

/* ---------- 부드러운 스크롤 ---------- */
function smoothScrollToTests() {
  const cta = document.querySelector('.hero-cta');
  if (cta) {
    cta.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector('#tests');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

/* ---------- 카드 링크 ---------- */
function initTestCards() {
  document.querySelectorAll('.test-card').forEach(card => {
    card.addEventListener('click', () => {
      const url = card.dataset.href;
      if (url) window.location.href = url;
    });
  });
}

/* ---------- 결과 이미지로 저장 ---------- */
function initSaveResultImage() {
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-save-image');
    if (!btn) return;

    const resultSection = document.querySelector('.result-section.active');
    const card = resultSection?.querySelector('.result-card');
    if (!card || typeof html2canvas === 'undefined') {
      alert('이미지 저장을 지원하지 않는 환경입니다.');
      return;
    }

    btn.disabled = true;
    btn.textContent = '저장 중...';

    const originalActions = card.querySelector('.result-actions');
    if (originalActions) originalActions.style.display = 'none';

    html2canvas(card, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: card.scrollWidth,
      windowHeight: card.scrollHeight
    }).then(canvas => {
      if (originalActions) originalActions.style.display = '';
      btn.disabled = false;
      btn.textContent = '이미지로 저장';

      const link = document.createElement('a');
      link.download = '퍼스널컬러_결과_' + new Date().toISOString().slice(0, 10) + '.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }).catch(() => {
      if (originalActions) originalActions.style.display = '';
      btn.disabled = false;
      btn.textContent = '이미지로 저장';
      alert('이미지 저장에 실패했습니다. 다시 시도해 주세요.');
    });
  });
}

/* ---------- 테스트 인트로: 메타 채우기 + 공유 버튼 ---------- */
function initTestIntro() {
  const intro = document.querySelector('.test-intro');
  if (!intro) return;

  const minutes = intro.dataset.minutes;
  const questions = intro.dataset.questions;
  const results = intro.dataset.results;
  if (minutes !== undefined) {
    const el = intro.querySelector('.meta-min');
    if (el) el.textContent = minutes;
  }
  if (questions !== undefined) {
    const el = intro.querySelector('.meta-q');
    if (el) el.textContent = questions;
  }
  if (results !== undefined) {
    const el = intro.querySelector('.meta-r');
    if (el) el.textContent = results;
  }

  intro.querySelector('.btn-share-link')?.addEventListener('click', () => {
    const url = window.location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => alert('링크가 복사되었습니다!')).catch(() => prompt('아래 링크를 복사하세요:', url));
    } else {
      prompt('아래 링크를 복사하세요:', url);
    }
  });

  intro.querySelector('.btn-bookmark')?.addEventListener('click', () => {
    const url = window.location.href;
    const title = document.title || '테스트';
    const msg = '이 페이지를 즐겨찾기에 추가하려면 브라우저에서 Ctrl+D (Mac: ⌘+D)를 눌러주세요.';

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        alert('주소가 복사되었습니다.\n\n' + msg);
      }).catch(() => alert(msg));
    } else {
      alert(msg + '\n\n주소: ' + url);
    }
  });
}

/* ---------- 네비게이션 로드 후 초기화 (공통 컴포넌트 사용 시) ---------- */
function initNavWhenReady() {
  initMobileMenu();
  initNavDropdown();
}

/* ---------- 플로팅 메뉴 (공유·즐겨찾기·탑) ---------- */
function initFloatingMenu() {
  const wrap = document.querySelector('.floating-menu-wrap');
  if (!wrap) return;

  const shareBtn = wrap.querySelector('.floating-menu-share');
  const bookmarkBtn = wrap.querySelector('.floating-menu-bookmark');
  const topBtn = wrap.querySelector('.floating-menu-top');

  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const url = window.location.href;
      const title = document.title || '';
      const text = title ? title + ' - ' + url : url;

      if (navigator.share) {
        navigator.share({
          title: document.title || '',
          url: url,
          text: title || undefined
        }).catch(() => {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(() => alert('주소가 복사되었습니다.')).catch(() => prompt('주소 복사:', url));
          } else {
            prompt('주소 복사:', url);
          }
        });
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => alert('주소가 복사되었습니다.')).catch(() => prompt('주소 복사:', url));
      } else {
        prompt('주소 복사:', url);
      }
    });
  }

  if (bookmarkBtn) {
    bookmarkBtn.addEventListener('click', () => {
      const url = window.location.href;
      const title = document.title || '컬러모어 톤랩';
      if (window.sidebar && window.sidebar.addPanel) {
        window.sidebar.addPanel(title, url, '');
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
          alert('주소가 복사되었습니다.\n즐겨찾기에는 브라우저에서 Ctrl+D (Mac: ⌘+D)로 추가해 주세요.');
        }).catch(() => alert('즐겨찾기에는 브라우저에서 Ctrl+D (Mac: ⌘+D)를 눌러 주세요.'));
      } else {
        alert('즐겨찾기에는 브라우저에서 Ctrl+D (Mac: ⌘+D)를 눌러 주세요.');
      }
    });
  }

  if (topBtn) {
    topBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ---------- 초기화 ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const placeholder = document.getElementById('header-placeholder');
  if (placeholder && placeholder.innerHTML.trim() === '') {
    document.addEventListener('navReady', initNavWhenReady, { once: true });
  } else {
    initNavWhenReady();
  }
  smoothScrollToTests();
  initTestCards();
  initSaveResultImage();
  initTestIntro();
  document.addEventListener('footerReady', initFloatingMenu, { once: true });
});
