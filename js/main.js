(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();

  const KEY = 'sdt-theme';
  const root = document.documentElement;
  const btn = document.querySelector('.theme-toggle');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const themeColors = { dark: '#05060f', light: '#f3f0f8' };

  function currentTheme() {
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }
  function applyTheme(theme, persist) {
    const t = theme === 'light' ? 'light' : 'dark';
    root.setAttribute('data-theme', t);
    if (themeMeta) themeMeta.setAttribute('content', themeColors[t]);
    if (btn) btn.setAttribute('aria-label', t === 'dark' ? '切换到浅色主题' : '切换到深色主题');
    if (persist) {
      try { localStorage.setItem(KEY, t); } catch (e) {}
    }
  }
  applyTheme(currentTheme(), false);
  if (btn) {
    btn.addEventListener('click', () => applyTheme(currentTheme() === 'dark' ? 'light' : 'dark', true));
  }
  const mq = window.matchMedia('(prefers-color-scheme: light)');
  const onScheme = ev => {
    try { if (localStorage.getItem(KEY)) return; } catch (e) { return; }
    applyTheme(ev.matches ? 'light' : 'dark', false);
  };
  if (mq.addEventListener) mq.addEventListener('change', onScheme);
  else if (mq.addListener) mq.addListener(onScheme);
  if (!reduce) requestAnimationFrame(() => root.classList.add('theme-ready'));

  /* reveal on scroll */
  const items = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) items.forEach(el => el.classList.add('in'));
  else {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach((el, i) => { el.style.transitionDelay = (i % 6) * 70 + 'ms'; io.observe(el); });
  }

  /* card spotlight follows pointer */
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* copy buttons */
  document.querySelectorAll('.copy').forEach(btnCopy => {
    btnCopy.addEventListener('click', async () => {
      const text = btnCopy.dataset.copy;
      try { await navigator.clipboard.writeText(text); }
      catch { const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); }
      const old = btnCopy.textContent; btnCopy.textContent = '已复制'; btnCopy.classList.add('done');
      setTimeout(() => { btnCopy.textContent = old; btnCopy.classList.remove('done'); }, 1600);
    });
  });

  /* starfield */
  const cv = document.getElementById('sky'); if (!cv) return;
  const ctx = cv.getContext('2d');
  let W, H, dpr, stars = [], meteors = [], last = 0, light = false;
  const darkPalette = ['255,255,255', '214,204,255', '190,230,255', '255,236,200'];
  const lightPalette = ['90,70,150', '60,100,150', '140,100,80', '80,80,120'];
  function isLight() { return root.getAttribute('data-theme') === 'light'; }
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    light = isLight();
    const palette = light ? lightPalette : darkPalette;
    const n = Math.round(Math.min(light ? 160 : 260, W * H / (light ? 9000 : 6500)));
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() < (light ? .05 : .08) ? Math.random() * 1.1 + .7 : Math.random() * (light ? .7 : .9) + .2,
      a: light ? Math.random() * .36 + .16 : Math.random() * .6 + .25,
      s: Math.random() * 1.5 + .4, p: Math.random() * Math.PI * 2,
      c: palette[(Math.random() * palette.length) | 0], vy: Math.random() * .03 + .005
    }));
    meteors = [];
  }
  const mo = new MutationObserver(() => { if (isLight() !== light) resize(); });
  mo.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  function frame(t) {
    const dt = Math.min(50, t - last || 16); last = t;
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      const tw = reduce ? 1 : .55 + .45 * Math.sin(t / 1000 * s.s + s.p);
      if (!reduce) { s.y -= s.vy * dt / 16; if (s.y < -2) { s.y = H + 2; s.x = Math.random() * W; } }
      ctx.globalAlpha = s.a * tw; ctx.fillStyle = `rgb(${s.c})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill();
      if (s.r > 1) { ctx.globalAlpha = s.a * tw * (light ? .1 : .18); ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 4, 0, 6.283); ctx.fill(); }
    }
    if (!reduce && Math.random() < (light ? .0012 : .0025) && meteors.length < 2) {
      meteors.push({ x: Math.random() * W * .8 + W * .2, y: Math.random() * H * .4, l: 0, life: 1 });
    }
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i]; m.l += dt * .9; m.life -= dt / 1100;
      const ex = m.x - m.l * .9, ey = m.y + m.l * .45;
      const g = ctx.createLinearGradient(ex, ey, ex + 120, ey - 60);
      const head = light ? `rgba(80,70,130,${.4 * m.life})` : `rgba(255,255,255,${.85 * m.life})`;
      g.addColorStop(0, head); g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.globalAlpha = 1; ctx.strokeStyle = g; ctx.lineWidth = light ? .8 : 1.2;
      ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex + 120, ey - 60); ctx.stroke();
      if (m.life <= 0) meteors.splice(i, 1);
    }
    ctx.globalAlpha = 1;
    if (!reduce) requestAnimationFrame(frame);
  }
  resize(); addEventListener('resize', () => { resize(); if (reduce) requestAnimationFrame(frame); });
  requestAnimationFrame(frame);
})();
