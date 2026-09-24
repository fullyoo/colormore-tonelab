/**
 * 공통 푸터 컴포넌트 로더
 * - data-base: 루트는 "", 하위 폴더는 "../"
 * - Google AdSense 승인을 위한 개인정보처리방침·이용약관 링크 포함
 */
(function () {
  var script = document.getElementById('footer-loader') || document.querySelector('script[data-footer-loader]');
  var base = (script && script.getAttribute('data-base')) || '';
  window.FOOTER_BASE = base;
  var placeholder = document.getElementById('footer-placeholder');

  var footerUrl = base + (base ? 'assets/components/footer.html' : 'assets/components/footer.html');
  var menuUrl = base + (base ? 'assets/components/floating-menu.html' : 'assets/components/floating-menu.html');

  function applyFooterActive(ph) {
    var current = document.body.getAttribute('data-current');
    if (!current || !ph) return;
    var menuLinks = ph.querySelectorAll('.footer-menu a[href]');
    menuLinks.forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (href === current || href.endsWith('/' + current) || href.endsWith(current)) {
        a.classList.add('is-active');
      }
    });
    var legalLinks = ph.querySelectorAll('.footer-legal a[href]');
    legalLinks.forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (href === current || href.endsWith(current)) {
        a.classList.add('is-active');
      }
    });
  }

  Promise.all([
    fetch(footerUrl).then(function (r) { return r.text(); }),
    fetch(menuUrl).then(function (r) { return r.text(); })
  ]).then(function (results) {
    var footerHtml = results[0];
    var menuHtml = results[1];
    if (placeholder) {
      placeholder.innerHTML = footerHtml.replace(/\{\{BASE\}\}/g, base);
      applyFooterActive(placeholder);
    }
    var menuWrap = document.createElement('div');
    menuWrap.className = 'floating-menu-wrap';
    menuWrap.innerHTML = menuHtml;
    document.body.appendChild(menuWrap);
    document.dispatchEvent(new CustomEvent('footerReady'));
  })
    .catch(function () {
      if (placeholder) {
        placeholder.innerHTML = '<footer class="footer"><div class="container"><div class="footer-content"><p class="footer-copy">&copy; 2026 컬러모어 톤랩. <a href="' + base + 'privacy.html">개인정보처리방침</a> | <a href="' + base + 'terms.html">이용약관</a></p></div></div></footer>';
      }
      var menuWrap = document.createElement('div');
      menuWrap.className = 'floating-menu-wrap';
      menuWrap.innerHTML = '<div class="floating-menu" aria-label="바로가기"><button type="button" class="floating-menu-btn floating-menu-share" title="공유하기"><span class="floating-menu-icon">📤</span><span class="floating-menu-label">공유</span></button><button type="button" class="floating-menu-btn floating-menu-bookmark" title="즐겨찾기"><span class="floating-menu-icon">⭐</span><span class="floating-menu-label">즐겨찾기</span></button><button type="button" class="floating-menu-btn floating-menu-top" title="맨 위로"><span class="floating-menu-icon">↑</span><span class="floating-menu-label">탑</span></button></div>';
      document.body.appendChild(menuWrap);
      document.dispatchEvent(new CustomEvent('footerReady'));
    });
})();
