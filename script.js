(function () {
  // Mobile nav
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  var lockedY = 0;
  function lockScroll(lock) {
    var b = document.body;
    if (lock && !b.classList.contains('scroll-locked')) {
      lockedY = window.scrollY;
      b.style.top = -lockedY + 'px';
      b.classList.add('scroll-locked');
    } else if (!lock && b.classList.contains('scroll-locked')) {
      b.classList.remove('scroll-locked');
      b.style.top = '';
      var html = document.documentElement, prev = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';
      window.scrollTo(0, lockedY);
      html.style.scrollBehavior = prev;
    }
  }
  function setNav(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('open', open);
    document.documentElement.classList.toggle('menu-open', open);
    lockScroll(open);
    if (open) { var first = nav.querySelector('a'); if (first) first.focus({ preventScroll: true }); }
  }
  toggle.addEventListener('click', function () { setNav(toggle.getAttribute('aria-expanded') !== 'true'); });
  nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { setNav(false); toggle.focus(); } });
  window.addEventListener('resize', function () { if (window.innerWidth > 860) setNav(false); });

  // Pre-select interest from CTA links
  var interest = document.getElementById('f-interest');
  document.querySelectorAll('[data-interest]').forEach(function (el) {
    el.addEventListener('click', function () {
      var v = el.getAttribute('data-interest');
      for (var i = 0; i < interest.options.length; i++) {
        if (interest.options[i].text === v) interest.selectedIndex = i;
      }
    });
  });

  // Contact form -> mailto
  var form = document.getElementById('contact-form');
  var err = document.getElementById('form-error');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = new FormData(form);
    var name = (d.get('name') || '').trim();
    var email = (d.get('email') || '').trim();
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.hidden = false; return; }
    err.hidden = true;
    var subject = 'Website enquiry: ' + d.get('interest') + ' (' + name + ')';
    var body = [
      'Name: ' + name,
      'Organisation: ' + (d.get('org') || '-'),
      'Email: ' + email,
      'Phone: ' + (d.get('phone') || '-'),
      'Interested in: ' + d.get('interest'),
      '',
      (d.get('message') || '')
    ].join('\n');
    window.location.href = 'mailto:merilynduff@outlook.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });

  // Lightbox
  var box = document.getElementById('lightbox');
  var boxImg = box.querySelector('img');
  document.querySelectorAll('.art-tile').forEach(function (t) {
    t.addEventListener('click', function () {
      boxImg.src = t.getAttribute('data-full');
      boxImg.alt = t.getAttribute('data-alt');
      if (box.showModal) box.showModal();
    });
  });
  box.querySelector('.lightbox-close').addEventListener('click', function () { box.close(); });
  box.addEventListener('click', function (e) { if (e.target === box) box.close(); });

  // Reveal on scroll
  if ('IntersectionObserver' in window) {
    var els = document.querySelectorAll('.section-head, .card, .about-grid > *, .commitments li, .art-tile, .contact-grid > *');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }
})();
