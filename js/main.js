(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();

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
  document.querySelectorAll('.copy').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      try { await navigator.clipboard.writeText(text); }
      catch { const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); }
      const old = btn.textContent; btn.textContent = '已复制'; btn.classList.add('done');
      setTimeout(() => { btn.textContent = old; btn.classList.remove('done'); }, 1600);
    });
  });

  /* starfield */
  const cv = document.getElementById('sky'); if (!cv) return;
  const ctx = cv.getContext('2d');
  let W, H, dpr, stars = [], meteors = [], last = 0;
  const palette = ['255,255,255', '214,204,255', '190,230,255', '255,236,200'];
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(260, W * H / 6500));
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() < .08 ? Math.random() * 1.2 + 1 : Math.random() * .9 + .2,
      a: Math.random() * .6 + .25, s: Math.random() * 1.5 + .4, p: Math.random() * Math.PI * 2,
      c: palette[(Math.random() * palette.length) | 0], vy: Math.random() * .03 + .005
    }));
  }
  function frame(t) {
    const dt = Math.min(50, t - last || 16); last = t;
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      const tw = reduce ? 1 : .55 + .45 * Math.sin(t / 1000 * s.s + s.p);
      if (!reduce) { s.y -= s.vy * dt / 16; if (s.y < -2) { s.y = H + 2; s.x = Math.random() * W; } }
      ctx.globalAlpha = s.a * tw; ctx.fillStyle = `rgb(${s.c})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill();
      if (s.r > 1) { ctx.globalAlpha = s.a * tw * .18; ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 4, 0, 6.283); ctx.fill(); }
    }
    if (!reduce && Math.random() < .0025 && meteors.length < 2) {
      meteors.push({ x: Math.random() * W * .8 + W * .2, y: Math.random() * H * .4, l: 0, life: 1 });
    }
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i]; m.l += dt * .9; m.life -= dt / 1100;
      const ex = m.x - m.l * .9, ey = m.y + m.l * .45;
      const g = ctx.createLinearGradient(ex, ey, ex + 120, ey - 60);
      g.addColorStop(0, `rgba(255,255,255,${.85 * m.life})`); g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.globalAlpha = 1; ctx.strokeStyle = g; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex + 120, ey - 60); ctx.stroke();
      if (m.life <= 0) meteors.splice(i, 1);
    }
    ctx.globalAlpha = 1;
    if (!reduce) requestAnimationFrame(frame);
  }
  resize(); addEventListener('resize', () => { resize(); if (reduce) requestAnimationFrame(frame); });
  requestAnimationFrame(frame);
})();
