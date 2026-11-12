/* 全站访问统计。公开追踪编号写在这里，不要放入密钥。
 * 只在正式域名加载。GA4 的 page_location 只用 origin + pathname。
 * 以后接百度统计、51.la：在下方增加公开编号常量，写好加载函数，再登记进 TRACKERS。
 * 编号还没有就不要写空的加载调用。
 */
const GA_MEASUREMENT_ID = 'G-X4TGP2S2YL';
const CLARITY_PROJECT_ID = 'zccwljdddd';

function pageFields() {
  const page = {
    page_title: document.title,
    page_location: location.origin + location.pathname,
  };
  const referrer = sanitizedReferrer();
  if (referrer) page.page_referrer = referrer;
  return page;
}

function sanitizedReferrer() {
  if (!document.referrer) return '';
  try {
    const url = new URL(document.referrer);
    if (url.origin === location.origin) return url.origin + url.pathname;
    return url.origin;
  } catch (e) {
    return '';
  }
}

function loadGoogleAnalytics(id) {
  if (!/^G-[A-Z0-9]+$/.test(id)) return;
  const page = pageFields();
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('set', page);
  window.gtag('js', new Date());
  window.gtag('config', id, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
  document.head.appendChild(script);
  window.gtag('event', 'page_view', Object.assign({ send_to: id }, page));
}

function loadClarity(id) {
  if (!/^[a-z0-9]+$/.test(id)) return;
  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    t = l.createElement(r);
    t.async = 1;
    t.src = 'https://www.clarity.ms/tag/' + i;
    y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', id);
}

const TRACKERS = [
  { id: GA_MEASUREMENT_ID, load: loadGoogleAnalytics },
  { id: CLARITY_PROJECT_ID, load: loadClarity },
];

function start() {
  if (location.hostname !== 'stardreamtech.github.io') return;
  TRACKERS.forEach(function (tracker) {
    if (tracker.id) tracker.load(tracker.id);
  });
}

start();
