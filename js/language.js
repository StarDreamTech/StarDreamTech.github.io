(() => {
  const link = document.querySelector('.language-switch');
  if (!link) return;
  const target = new URL(link.getAttribute('href'), location.href);
  function preserveLocation() {
    link.href = target.pathname + location.search + location.hash;
  }
  preserveLocation();
  addEventListener('hashchange', preserveLocation);
})();
