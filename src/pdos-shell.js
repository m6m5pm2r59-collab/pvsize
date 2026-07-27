(function () {
  var body = document.body;
  if (!body || body.dataset.pdosShell === 'off') return;

  var hasNav = document.querySelector('nav.navbar, nav.pdos-shell-nav');
  var hasFooter = document.querySelector('footer.site-footer, footer.pdos-shell-footer');

  if (!hasNav) {
    body.insertAdjacentHTML(
      'afterbegin',
      '<nav class="pdos-shell-nav" aria-label="Primary">' +
        '<div class="pdos-shell-nav__inner">' +
          '<a class="pdos-shell-nav__brand" href="/">PVSize</a>' +
          '<ul class="pdos-shell-nav__links">' +
            '<li><a href="/calculators/">Calculators</a></li>' +
            '<li><a href="/learn/">Learn</a></li>' +
            '<li><a href="/insights/">Insights</a></li>' +
            '<li><a href="/request-solar-plan/">Request a Plan</a></li>' +
            '<li><a href="/contact/">Contact</a></li>' +
          '</ul>' +
        '</div>' +
      '</nav>'
    );
  }

  if (!hasFooter) {
    body.insertAdjacentHTML(
      'beforeend',
      '<footer class="pdos-shell-footer">' +
        '<div class="pdos-shell-footer__inner">' +
          '<div class="pdos-shell-footer__grid">' +
            '<div><div class="pdos-shell-footer__title">PVSize</div><p>Free solar planning tools for homeowners, DIY users, installers, and small EPCs.</p></div>' +
            '<div><div class="pdos-shell-footer__title">Tools</div><p><a href="/calculators/panel-count/">Panel Count</a><br><a href="/calculators/savings/">Savings</a><br><a href="/calculators/battery-sizing/">Battery Sizing</a><br><a href="/calculators/carbon/">Carbon Reduction</a></p></div>' +
            '<div><div class="pdos-shell-footer__title">Learn</div><p><a href="/learn/">Guides</a><br><a href="/insights/">Insights</a><br><a href="/about/">About</a><br><a href="/editorial-policy/">Editorial Policy</a></p></div>' +
            '<div><div class="pdos-shell-footer__title">Contact</div><p><a href="/request-solar-plan/">Request a detailed plan</a><br><a href="/contact/">Email PVSize</a><br><a href="/sponsored-disclosure/">Sponsored disclosure</a></p></div>' +
          '</div>' +
          '<div class="pdos-shell-footer__note">PVSize stays transparent, practical, and free. No signup required for the main calculators.</div>' +
        '</div>' +
      '</footer>'
    );
  }

  var currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
  document.querySelectorAll('.pdos-shell-nav a').forEach(function (link) {
    var linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/+$/, '') || '/';
    var isSectionRoot = linkPath !== '/';
    if (linkPath === currentPath || (isSectionRoot && currentPath.indexOf(linkPath + '/') === 0)) {
      link.classList.add('is-current');
      link.setAttribute('aria-current', 'page');
    }
  });

  body.dataset.pdosShell = 'on';
})();
