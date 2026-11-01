
(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initTheme() {
    const btn = $('#themeToggle');
    if (!btn) return;
    const apply = (mode) => {
      document.documentElement.setAttribute('data-theme', mode);
      btn.setAttribute('aria-label', mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      btn.setAttribute('aria-pressed', String(mode === 'dark'));
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', mode === 'dark' ? '#050B1F' : '#FFFFFF');
    };
    apply(document.documentElement.getAttribute('data-theme') || 'light');

    btn.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      apply(next);
      try { localStorage.setItem('mywebstudio-theme', next); } catch (e) { }
    });
  }

  function initNav() {
    const toggle = $('#navToggle');
    const menu = $('#navMenu');
    const header = $('.site-header');
    if (!toggle || !menu) return;

    const close = () => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
      document.body.classList.remove('nav-open');
    };

    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      menu.classList.toggle('is-open', !open);
      document.body.classList.toggle('nav-open', !open);
    });

    $$('#navMenu a').forEach((a) => a.addEventListener('click', close));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 900) close(); });

    const toTop = $('#toTop');
    const onScroll = () => {
      const y = window.scrollY;
      if (header) header.classList.toggle('is-scrolled', y > 12);
      if (toTop) toTop.classList.toggle('is-visible', y > 420);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const page = document.body.dataset.page;
    if (page) {
      $$('#navMenu a[data-nav]').forEach((a) => {
        if (a.dataset.nav === page) {
          a.classList.add('active');
          a.setAttribute('aria-current', 'page');
        }
      });
    }
  }

  function initToTop() {
    const btn = $('#toTop');
    if (!btn) return;
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      $('#main') && $('#main').focus({ preventScroll: true });
    });
  }

  function initProgress() {
    const bar = $('#progressBar');
    if (!bar) return;

    let ticking = false;
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
      bar.style.width = pct + '%';
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  function initHeroParallax() {
    const hero = $('.hero');
    if (!hero || reduceMotion) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const frame = $('.hero__frame', hero);
    const media = $('.hero__media', hero);
    const content = $('.hero__content', hero);
    if (!frame && !media) return;

    let raf = null;
    const apply = (dx, dy) => {
      raf = null;
      if (frame) {
        frame.style.setProperty('--ry', (-9 + dx * 14).toFixed(2) + 'deg');
        frame.style.setProperty('--rx', (4 - dy * 11).toFixed(2) + 'deg');
      }
      if (media) media.style.transform = 'translate3d(' + (dx * -18) + 'px,' + (dy * -14) + 'px,0)';
      if (content) content.style.transform = 'translate3d(' + (dx * 7) + 'px,' + (dy * 5) + 'px,0)';
    };

    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      const dx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const dy = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (raf) return;
      raf = requestAnimationFrame(() => apply(dx, dy));
    });

    hero.addEventListener('pointerleave', () => {
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      if (frame) {
        frame.style.setProperty('--ry', '-9deg');
        frame.style.setProperty('--rx', '4deg');
      }
      if (media) media.style.transform = '';
      if (content) content.style.transform = '';
    });
  }

  function initSlider() {
    const root = $('#heroSlider') || $('#projectSlider');
    if (!root) return;

    const slides = $$('.slide', root);
    const scope = root.querySelector('.hero__controls') || root.parentElement || document;
    const dotsWrap = scope.querySelector('.slider-dots');
    const prev = scope.querySelector('[data-slide="prev"]');
    const next = scope.querySelector('[data-slide="next"]');
    if (slides.length < 2) return;

    let index = Math.max(0, slides.findIndex((s) => s.classList.contains('is-active')));
    let timer = null;
    const delay = 6000;

    const dots = dotsWrap
      ? slides.map((_, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('role', 'tab');
        b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        b.addEventListener('click', () => { go(i); restart(); });
        dotsWrap.appendChild(b);
        return b;
      })
      : [];

    function go(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach((s, n) => {
        s.classList.toggle('is-active', n === index);
        s.setAttribute('aria-hidden', String(n !== index));
      });
      dots.forEach((d, n) => d.setAttribute('aria-selected', String(n === index)));
    }

    function restart() {
      if (reduceMotion) return;
      clearInterval(timer);
      timer = setInterval(() => go(index + 1), delay);
    }

    prev && prev.addEventListener('click', () => { go(index - 1); restart(); });
    next && next.addEventListener('click', () => { go(index + 1); restart(); });

    root.addEventListener('mouseenter', () => clearInterval(timer));
    root.addEventListener('mouseleave', restart);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) clearInterval(timer); else restart();
    });

    let startX = null;
    root.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    root.addEventListener('touchend', (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 45) go(index + (dx < 0 ? 1 : -1));
      startX = null;
      restart();
    }, { passive: true });

    go(index);
    restart();
  }

  function initTyping() {
    const el = $('#typedText');
    if (!el) return;
    const words = (el.dataset.words || '').split('|').map((w) => w.trim()).filter(Boolean);
    if (!words.length) return;

    if (reduceMotion) { el.textContent = words[0]; return; }

    let word = 0, char = 0, deleting = false;

    (function tick() {
      const current = words[word];
      char += deleting ? -1 : 1;
      el.textContent = current.slice(0, char);

      let wait = deleting ? 55 : 105;
      if (!deleting && char === current.length) { wait = 1900; deleting = true; }
      else if (deleting && char === 0) { deleting = false; word = (word + 1) % words.length; wait = 350; }

      setTimeout(tick, wait);
    })();
  }

  function initCounters() {
    const nums = $$('[data-count]');
    if (!nums.length) return;

    const run = (el) => {
      const target = parseFloat(el.dataset.count);
      const decimals = (el.dataset.decimals || (target % 1 ? 2 : 0)) | 0;
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const duration = reduceMotion ? 0 : 1700;
      const start = performance.now();

      const frame = (now) => {
        const p = duration ? Math.min((now - start) / duration, 1) : 1;
        const eased = 1 - Math.pow(1 - p, 3);
        const val = target * eased;
        el.textContent = prefix + val.toLocaleString(undefined, {
          minimumFractionDigits: decimals, maximumFractionDigits: decimals
        }) + suffix;
        if (p < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    };

    if (!('IntersectionObserver' in window)) { nums.forEach(run); return; }

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { run(entry.target); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.4 });

    nums.forEach((n) => io.observe(n));
  }

  function initAccordion() {
    const items = $$('.acc-item');
    if (!items.length) return;

    items.forEach((item, i) => {
      const trigger = $('.acc-trigger', item);
      const panel = $('.acc-panel', item);
      if (!trigger || !panel) return;

      const id = 'faq-panel-' + i;
      panel.id = id;
      trigger.setAttribute('aria-controls', id);
      trigger.setAttribute('aria-expanded', String(item.classList.contains('is-open')));
      if (item.classList.contains('is-open')) panel.style.maxHeight = panel.scrollHeight + 'px';

      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        items.forEach((other) => {
          if (other === item) return;
          other.classList.remove('is-open');
          const t = $('.acc-trigger', other), p = $('.acc-panel', other);
          if (t) t.setAttribute('aria-expanded', 'false');
          if (p) p.style.maxHeight = null;
        });

        item.classList.toggle('is-open', !isOpen);
        trigger.setAttribute('aria-expanded', String(!isOpen));
        panel.style.maxHeight = !isOpen ? panel.scrollHeight + 'px' : null;
      });
    });

    window.addEventListener('resize', () => {
      $$('.acc-item.is-open .acc-panel').forEach((p) => { p.style.maxHeight = p.scrollHeight + 'px'; });
    });
  }

  function initPortfolio() {
    const grid = $('#workGrid');
    if (!grid) return;
    const cards = $$('.work', grid);
    const filters = $$('.filter-bar button');

    filters.forEach((btn) => {
      btn.addEventListener('click', () => {
        filters.forEach((b) => { b.classList.remove('is-active'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');
        const cat = btn.dataset.filter;

        cards.forEach((card) => {
          const show = cat === 'all' || card.dataset.category === cat;
          card.classList.toggle('is-hidden', !show);
        });

        const shown = cards.filter((c) => !c.classList.contains('is-hidden')).length;
        const status = $('#filterStatus');
        if (status) status.textContent = shown + ' project' + (shown === 1 ? '' : 's') + ' shown';
      });
    });

    const box = $('#lightbox');
    if (!box) return;
    const boxImg = $('#lightboxImg');
    const boxTitle = $('#lightboxTitle');
    const boxDesc = $('#lightboxDesc');
    const boxTags = $('#lightboxTags');
    const closeBtn = $('.lightbox__close', box);
    const extraClose = $$('[data-lightbox-close]', box);
    let lastFocused = null;

    const fillFacts = (card) => {
      if (!boxTags) return;
      boxTags.innerHTML = '';
      (card.dataset.tags || '').split('|').map((t) => t.trim()).filter(Boolean).forEach((t) => {
        const s = document.createElement('span');
        s.textContent = t;
        boxTags.appendChild(s);
      });
      boxTags.style.display = boxTags.children.length ? '' : 'none';

      ['client', 'year', 'discipline', 'result'].forEach((key) => {
        const el = box.querySelector('[data-fact="' + key + '"]');
        if (el) el.textContent = card.dataset[key] || '—';
      });
    };

    const open = (card, trigger) => {
      const btnTrigger = card.querySelector('[data-lightbox]');
      lastFocused = (trigger && trigger !== card && document.contains(trigger))
        ? trigger
        : (btnTrigger || document.activeElement);
      boxImg.src = card.dataset.image;
      boxImg.alt = card.dataset.title || 'Project preview';
      boxTitle.textContent = card.dataset.title || '';
      boxDesc.textContent = card.dataset.description || '';
      fillFacts(card);
      box.classList.add('is-open');
      box.setAttribute('aria-hidden', 'false');
      document.body.classList.add('nav-open');
      requestAnimationFrame(() => {
        if (closeBtn) closeBtn.focus({ preventScroll: true });
        else box.querySelector('.lightbox__dialog').focus({ preventScroll: true });
      });
    };

    const close = () => {
      box.classList.remove('is-open');
      box.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('nav-open');
      if (lastFocused && document.contains(lastFocused) && lastFocused.offsetParent !== null) {
        lastFocused.focus({ preventScroll: true });
      }
    };

    cards.forEach((card) => {
      const trigger = $('[data-lightbox]', card);
      if (trigger) trigger.addEventListener('click', (e) => { e.stopPropagation(); open(card, trigger); });
      card.addEventListener('click', (e) => open(card, e.target.closest('[data-lightbox]') || card));
    });

    closeBtn && closeBtn.addEventListener('click', close);
    extraClose.forEach((b) => b.addEventListener('click', close));
    box.addEventListener('click', (e) => { if (e.target === box) close(); });
    document.addEventListener('keydown', (e) => {
      if (!box.classList.contains('is-open')) return;
      if (e.key === 'Escape') { close(); return; }

      if (e.key !== 'Tab') return;
      const focusables = $$('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])', box)
        .filter((el) => el.offsetParent !== null);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  const validators = {
    required: (v) => v.trim() !== '' || 'This field is required.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim()) || 'Enter a valid email address.',
    phone: (v) => v.trim() === '' || /^[+]?[\d\s().-]{7,20}$/.test(v.trim()) || 'Enter a valid phone number.',
    min: (v, n) => v.trim().length >= n || 'Must be at least ' + n + ' characters.',
    max: (v, n) => v.trim().length <= n || 'Must be ' + n + ' characters or fewer.'
  };

  function checkField(input) {
    const field = input.closest('.field');
    if (!field) return true;
    const errEl = $('.error', field);

    if (input.type === 'checkbox') {
      const ok = input.checked;
      field.classList.toggle('is-invalid', !ok);
      input.setAttribute('aria-invalid', String(!ok));
      if (!ok && errEl) errEl.textContent = input.dataset.message || 'This box must be checked.';
      return ok;
    }

    const rules = (input.dataset.validate || '').split(',').map((r) => r.trim()).filter(Boolean);
    const minLen = parseInt(input.dataset.minlength || '0', 10);

    let message = '';
    for (const rule of rules) {
      const [name, arg] = rule.split(':');
      let result = true;
      if (name === 'required') result = validators.required(input.value);
      else if (name === 'email') result = validators.email(input.value);
      else if (name === 'phone') result = validators.phone(input.value);
      else if (name === 'min') result = validators.min(input.value, arg || minLen || 2);
      else if (name === 'max') result = validators.max(input.value, arg || 200);

      if (result !== true) { message = result; break; }
      if ((name === 'email' || name === 'phone') && input.value.trim() === '' &&
        !rules.includes('required')) { message = ''; break; }
    }

    if (message) {
      field.classList.add('is-invalid');
      field.classList.remove('is-valid');
      if (errEl) errEl.textContent = message;
      input.setAttribute('aria-invalid', 'true');
      return false;
    }
    field.classList.remove('is-invalid');
    field.classList.toggle('is-valid', input.value.trim() !== '');
    input.removeAttribute('aria-invalid');
    return true;
  }

  function initForms() {
    const form = $('#contactForm');
    if (form) {
      const fields = $$('input, textarea, select', form).filter((f) => f.dataset.validate);

      fields.forEach((f) => {
        f.addEventListener('blur', () => checkField(f));
        f.addEventListener('input', () => {
          if (f.closest('.field').classList.contains('is-invalid')) checkField(f);
        });
        f.addEventListener('change', () => {
          if (f.closest('.field').classList.contains('is-invalid')) checkField(f);
        });
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const valid = fields.map(checkField).every(Boolean);
        const status = $('#formStatus');

        if (!valid) {
          status.className = 'form-status is-error';
          status.textContent = 'Please fix the highlighted fields and try again.';
          const firstBad = $('.field.is-invalid input, .field.is-invalid textarea, .field.is-invalid select', form);
          if (firstBad) firstBad.focus();
          return;
        }

        const name = ($('#name') || {}).value || 'there';
        status.className = 'form-status is-success';
        status.textContent = 'Thanks, ' + name.trim().split(' ')[0] +
          '! Your message has been received — we usually reply within one business day.';
        status.focus && status.focus();
        form.reset();
        $$('.field', form).forEach((f) => f.classList.remove('is-valid', 'is-invalid'));
      });
    }

    const news = $('#newsletterForm');
    if (news) {
      const input = $('#newsletterEmail');
      news.addEventListener('submit', (e) => {
        e.preventDefault();
        const ok = validators.email(input.value) === true;
        news.classList.toggle('is-invalid', !ok);
        if (!ok) { $('.error', news).textContent = 'Please enter a valid email address.'; input.focus(); return; }
        news.classList.remove('is-invalid');
        input.value = '';
        input.placeholder = 'Subscribed ✓';
      });
      input.addEventListener('input', () => news.classList.remove('is-invalid'));
    }
  }

  function initReveal() {
    const items = $$('.reveal');
    if (!items.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -60px 0px' });
    items.forEach((el) => io.observe(el));
  }

  function initYear() {
    $$('span[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNav();
    initToTop();
    initProgress();
    initSlider();
    initTyping();
    initCounters();
    initAccordion();
    initPortfolio();
    initForms();
    initReveal();
    initHeroParallax();
    initYear();
  });
})();
