(function () {
  // Mobile nav
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  function setNav(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  toggle.addEventListener('click', function () { setNav(toggle.getAttribute('aria-expanded') !== 'true'); });
  nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });
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
