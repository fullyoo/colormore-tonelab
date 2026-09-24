/**
 * 공통 헤더(네비게이션) 컴포넌트 로더
 * - data-base: 루트는 "", 하위 폴더는 "../"
 * - body data-current: 현재 페이지 식별 (예: "index.html", "color-tone/personal-color.html")
 */
(function () {
  var script = document.getElementById('nav-loader') || document.querySelector('script[data-nav-loader]');
  var base = (script && script.getAttribute('data-base')) || '';
  window.NAV_BASE = base;
  var placeholder = document.getElementById('header-placeholder');
  if (!placeholder) return;

  var url = base + (base ? 'assets/components/header.html' : 'assets/components/header.html');
  fetch(url)
    .then(function (res) { return res.text(); })
    .then(function (html) {
      var out = html.replace(/\{\{BASE\}\}/g, base);
      placeholder.innerHTML = out;

      var current = document.body.getAttribute('data-current');
      if (current) {
        var links = placeholder.querySelectorAll('.header a[href]');
        links.forEach(function (a) {
          var href = a.getAttribute('href') || '';
          if (href.indexOf(current) !== -1 || href.endsWith(current)) {
            a.classList.add('active');
            var dropdown = a.closest('.nav-item-dropdown');
            if (dropdown) dropdown.classList.add('has-active');
          }
        });
      }

      document.dispatchEvent(new CustomEvent('navReady'));
    })
    .catch(function () {
      placeholder.innerHTML = '<header class="header"><div class="container"><a href="' + base + 'index.html">컬러모어 톤랩</a></div></header>';
    });
})();
