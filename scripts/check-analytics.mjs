// 确认每个 HTML 都在 head 里 defer 引用 js/analytics.js，编号与上报条件也正确。
// 运行：node scripts/check-analytics.mjs
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';
import vm from 'node:vm';

const GA_MEASUREMENT_ID = 'G-X4TGP2S2YL';
const CLARITY_PROJECT_ID = 'zccwljdddd';
const SITE_HOST = 'stardreamtech.github.io';
const THEME_SCRIPT = "<script>(function(){var k='sdt-theme',t;try{t=localStorage.getItem(k)}catch(e){}t=(t==='light'||t==='dark')?t:(matchMedia('(prefers-color-scheme:light)').matches?'light':'dark');document.documentElement.setAttribute('data-theme',t)})();</script>";

const root = resolve(import.meta.dirname, '..');
const analyticsPath = join(root, 'js', 'analytics.js');
const source = await readFile(analyticsPath, 'utf8');

assert.match(source, new RegExp(`const GA_MEASUREMENT_ID = '${GA_MEASUREMENT_ID}';`));
assert.match(source, new RegExp(`const CLARITY_PROJECT_ID = '${CLARITY_PROJECT_ID}';`));
assert.deepEqual([...new Set(source.match(/G-[A-Z0-9]+/g))], [GA_MEASUREMENT_ID]);
assert.equal([...source.matchAll(new RegExp(CLARITY_PROJECT_ID, 'g'))].length, 1);
assert.match(source, /location\.hostname !== 'stardreamtech\.github\.io'/);
assert.match(source, /send_page_view:\s*false/);
assert.match(source, /allow_google_signals:\s*false/);
assert.match(source, /allow_ad_personalization_signals:\s*false/);
assert.match(source, /location\.origin \+ location\.pathname/);
assert.match(source, /https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=/);
assert.match(source, /https:\/\/www\.clarity\.ms\/tag\//);
assert.doesNotMatch(source, /hm\.baidu\.com|sdk\.51\.la/);
assert.doesNotMatch(source, /export |import /);

async function htmlFiles(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...await htmlFiles(full));
    else if (entry.name.endsWith('.html')) found.push(full);
  }
  return found;
}

const pages = await htmlFiles(root);
assert.ok(pages.length >= 5, '至少应覆盖首页和四个项目介绍页');

for (const file of pages) {
  const html = await readFile(file, 'utf8');
  const rel = relative(dirname(file), analyticsPath).split(sep).join('/');
  const tag = `<script src="${rel}" defer></script>`;
  const head = html.match(/<head>([\s\S]*?)<\/head>/);
  assert.ok(head, `${file} 缺少 head`);
  assert.equal(head[1].split(tag).length - 1, 1, `${file} 的 head 应恰好引用一次 ${tag}`);
  assert.equal(html.split(tag).length - 1, 1, `${file} 不应在 head 之外重复引用统计脚本`);
  const themeAt = head[1].indexOf(THEME_SCRIPT);
  const analyticsAt = head[1].indexOf(tag);
  assert.ok(themeAt !== -1 && themeAt < analyticsAt, `${file} 的主题初始化脚本应原样留在统计脚本之前`);
}

function runAnalytics(location, referrer) {
  const created = [];
  const document = {
    title: '统计校验',
    referrer,
    head: { appendChild(node) { created.push(node); } },
    createElement(tag) { return { tag, async: false, src: '' }; },
    getElementsByTagName() {
      return [{ parentNode: { insertBefore(node) { created.push(node); } } }];
    },
  };
  const sandbox = { location, document, Date, URL, encodeURIComponent };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox);
  const commands = (sandbox.dataLayer || []).map((command) => Array.from(command));
  return { created, commands, dataLayer: sandbox.dataLayer };
}

const production = runAnalytics({
  hostname: SITE_HOST,
  origin: `https://${SITE_HOST}`,
  pathname: '/projects/starclip/',
  search: '?token=secret',
  hash: '#private',
}, 'https://referrer.example/land?token=secret#private');

const scripts = production.created.map((node) => node.src);
assert.deepEqual(scripts, [
  `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`,
  `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`,
]);
const config = production.commands.filter((command) => command[0] === 'config');
assert.equal(config.length, 1);
assert.equal(config[0][1], GA_MEASUREMENT_ID);
assert.deepEqual(JSON.parse(JSON.stringify(config[0][2])), {
  send_page_view: false,
  allow_google_signals: false,
  allow_ad_personalization_signals: false,
});
const views = production.commands.filter((command) => command[0] === 'event' && command[1] === 'page_view');
assert.equal(views.length, 1);
assert.deepEqual(JSON.parse(JSON.stringify(views[0][2])), {
  send_to: GA_MEASUREMENT_ID,
  page_title: '统计校验',
  page_location: `https://${SITE_HOST}/projects/starclip/`,
  page_referrer: 'https://referrer.example',
});
assert.equal(production.commands.filter((command) => command[0] === 'set').at(-1)[1].page_location, views[0][2].page_location);
assert.doesNotMatch(JSON.stringify(production.commands), /secret|private|token/);

const sameSite = runAnalytics({
  hostname: SITE_HOST,
  origin: `https://${SITE_HOST}`,
  pathname: '/',
  search: '',
  hash: '',
}, `https://${SITE_HOST}/projects/starclip/?utm=secret#hash`);
const sameSiteView = sameSite.commands.find((command) => command[0] === 'event' && command[1] === 'page_view');
assert.equal(sameSiteView[2].page_referrer, `https://${SITE_HOST}/projects/starclip/`);
assert.doesNotMatch(JSON.stringify(sameSite.commands), /secret|utm/);

for (const hostname of ['localhost', '127.0.0.1', 'example.com', `${SITE_HOST}.example`]) {
  const blocked = runAnalytics({
    hostname,
    origin: `http://${hostname}:8000`,
    pathname: '/',
    search: '?token=secret',
    hash: '#private',
  }, '');
  assert.equal(blocked.dataLayer, undefined, `${hostname} 不应初始化 GA`);
  assert.deepEqual(blocked.created, [], `${hostname} 不应加载统计脚本`);
}

console.log(`PASS: ${pages.length} 个 HTML 已 defer 引用 analytics.js；GA4 ${GA_MEASUREMENT_ID}、Clarity ${CLARITY_PROJECT_ID}；正式域名才上报，page_location 不含 query/hash。`);
