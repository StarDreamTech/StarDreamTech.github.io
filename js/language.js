(() => {
  const link = document.querySelector('.language-switch');
  if (link) {
    const target = new URL(link.getAttribute('href'), location.href);
    function preserveLocation() {
      link.href = target.pathname + location.search + location.hash;
    }
    preserveLocation();
    addEventListener('hashchange', preserveLocation);
  }

  const menu = document.querySelector('details.lang-menu');
  if (!menu) return;
  const trigger = menu.querySelector('.lang-trigger');
  const active = menu.querySelector('a[aria-current="page"]');
  if (active) {
    active.addEventListener('click', event => {
      event.preventDefault();
      menu.open = false;
    });
  }
  document.addEventListener('click', event => {
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      if (trigger) trigger.focus();
    }
  });
})();
