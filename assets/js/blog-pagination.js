/**
 * 블로그 목록 페이징: 리스트가 5개 이상일 때만 페이징 표시 (페이지당 5개)
 */
(function () {
  var PER_PAGE = 5;
  var list = document.querySelector('.blog-list');
  var nav = document.getElementById('blog-pagination');
  var pagesEl = document.getElementById('blog-pagination-pages');
  var prevBtn = nav ? nav.querySelector('.blog-pagination-prev') : null;
  var nextBtn = nav ? nav.querySelector('.blog-pagination-next') : null;

  if (!list || !nav || !pagesEl) return;

  var cards = [].slice.call(list.querySelectorAll('li'));
  var totalPages = Math.ceil(cards.length / PER_PAGE);

  if (cards.length < PER_PAGE) return;

  nav.removeAttribute('hidden');
  var currentPage = 1;

  function renderPageNumbers() {
    pagesEl.innerHTML = '';
    for (var i = 1; i <= totalPages; i++) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'blog-pagination-num' + (i === currentPage ? ' is-current' : '');
      btn.setAttribute('aria-label', i + '페이지');
      if (i === currentPage) btn.setAttribute('aria-current', 'page');
      btn.textContent = i;
      btn.addEventListener('click', function (p) {
        return function () { goToPage(p); };
      }(i));
      pagesEl.appendChild(btn);
    }
  }

  function goToPage(page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    var start = (page - 1) * PER_PAGE;
    var end = start + PER_PAGE;
    cards.forEach(function (card, index) {
      card.style.display = index >= start && index < end ? '' : 'none';
    });
    renderPageNumbers();
    if (prevBtn) prevBtn.disabled = page <= 1;
    if (nextBtn) nextBtn.disabled = page >= totalPages;
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function () { goToPage(currentPage - 1); });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function () { goToPage(currentPage + 1); });
  }

  goToPage(1);
})();
