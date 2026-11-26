import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { pages } from './site-pages.mjs';

const root = resolve(import.meta.dirname, '..');
const translations = JSON.parse(await readFile(`${root}/scripts/translations.en.json`, 'utf8'));
const brandNames = new Set(['星梦科技', '星笺', '星镜', '星匣', '星锁', '星哨', '星使', '星码', '星搭子', '星相', '星盘']);
const origin = 'https://stardreamfly.com';
const pagePaths = new Set(pages.map(page => `/${page.path}`));
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');

function translate(value) {
  const key = value.trim().replaceAll('&amp;', '&').replaceAll('&quot;', '"');
  if (!/[\u3400-\u9fff\u3001-\u303f\uff01-\uffef]/u.test(key)) return value;
  assert.ok(Object.hasOwn(translations, key) || brandNames.has(key), `Missing English translation: ${key}`);
  return value.slice(0, value.length - value.trimStart().length) + escape(translations[key] ?? key) + value.slice(value.trimEnd().length);
}

function translateMailto(value) {
  const [address, query] = value.split('?');
  if (!query) return value;
  const params = new URLSearchParams(query);
  let changed = false;
  for (const [k, v] of params.entries()) {
    if (/[\u3400-\u9fff]/u.test(v)) {
      assert.ok(Object.hasOwn(translations, v), `Missing English mailto translation: ${v}`);
      params.set(k, translations[v]);
      changed = true;
    }
  }
  if (!changed) return value;
  const serialized = [...params.entries()].map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
  return `${address}?${serialized}`;
}

function renderEnglishLangMenu(pagePath) {
  return `<details class="lang-menu">
        <summary class="lang-trigger" aria-label="Switch language">
          <svg class="lang-globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9"></circle>
            <path d="M3 12h18M12 3a13.5 13.5 0 0 1 0 18M12 3a13.5 13.5 0 0 0 0 18"></path>
          </svg>
          <span>EN</span>
          <svg class="lang-caret" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M4.5 6.5 8 10l3.5-3.5"></path>
          </svg>
        </summary>
        <div class="lang-dropdown" role="menu">
          <a class="lang-opt language-switch" role="menuitem" href="/${pagePath}" lang="zh-CN" hreflang="zh-CN">
            <span>简体中文</span>
          </a>
          <a class="lang-opt is-active" role="menuitem" href="/en/${pagePath}" lang="en" hreflang="en" aria-current="page">
            <span>English</span>
            <svg class="lang-check" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 8.5 6.5 11.5 12.5 5"></path></svg>
          </a>
        </div>
      </details>`;
}

for (const page of pages) {
  const source = `${root}/${page.path}index.html`;
  const destination = `${root}/en/${page.path}index.html`;
  let html = (await readFile(source, 'utf8')).replace(/\s*<!-- search:start -->[\s\S]*?<!-- search:end -->/g, '');
  const langMenuRe = /<details class="lang-menu">[\s\S]*?<\/details>/;
  assert.match(html, langMenuRe, `Missing language dropdown in ${page.path}index.html`);
  html = html.replace(langMenuRe, '<!-- lang-menu -->');
  html = html.replace(/<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<!--[\s\S]*?-->|<[^>]+>|[^<]+/g, token => {
    if (/^<style\b|^<!--/i.test(token) || /^<script\b/i.test(token) && !/\bsrc=/.test(token)) return token;
    if (!token.startsWith('<')) return translate(token);
    return token.replace(/\b(alt|title|aria-label|placeholder|content)="([^"]*)"/g, (_, key, value) => `${key}="${translate(value)}"`)
      .replace(/\b(href|src)="([^"]*)"/g, (original, key, value) => {
        if (key === 'href' && value.startsWith('mailto:')) return `href="${translateMailto(value)}"`;
        if (/^(?:#|data:|mailto:|tel:)/.test(value)) return original;
        const url = new URL(value, `${origin}/${page.path}`);
        if (url.origin !== origin) return original;
        let path = url.pathname.replace(/index\.html$/, '');
        if (!path.endsWith('/') && pagePaths.has(`${path}/`)) path += '/';
        if (key === 'href' && pagePaths.has(path)) return `href="/en${path}${url.search}${url.hash}"`;
        if (key === 'href' && path === '/llms.txt') return 'href="/en/llms.txt"';
        // Shared assets stay in one place; relative paths also work in plain static preview servers.
        const target = relative(dirname(destination), resolve(root, `.${url.pathname}`));
        return `${key}="${target}${url.search}${url.hash}"`;
      });
  });
  html = html.replace('<html lang="zh-CN">', '<html lang="en">');
  html = html.replace('<!-- lang-menu -->', renderEnglishLangMenu(page.path));
  if (page.path.endsWith('/demo/')) {
    const bundlePath = html.match(/<script type="module"[^>]+src="([^"]+)"/)[1];
    const bundle = await readFile(resolve(dirname(destination), bundlePath), 'utf8');
    // The upstream export resolves fixtures against location.href, which differs on the English route.
    const original = 'new URL(s,location.href)';
    assert.equal(bundle.split(original).length, 2, 'Review the demo fixture loader after a new upstream export');
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(`${dirname(destination)}/demo.en.js`, bundle.replace(original, 'new URL(s,new URL("/projects/starlock/demo/",location.origin))'));
    html = html.replace(`src="${bundlePath}"`, 'src="./demo.en.js"');
    html = html.replace('</head>', '  <script src="../../../../js/demo-english.js" defer></script>\n</head>');
    html = html.replace('An interactive browser demo. Real integrations use server-side verification.', 'An interactive browser demo. Real integrations use server-side verification. Text-click challenges intentionally retain the original Chinese character images.');
  }
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, `<!-- Generated by scripts/build-english.mjs; edit the Chinese page and translations.en.json. -->\n${html}`);
}

const summaries = await Promise.all(pages.slice(1).map(async page => {
  const html = await readFile(`${root}/en/${page.path}index.html`, 'utf8');
  const description = html.match(/<meta name="description" content="([^"]+)"/)[1];
  return `- [${translations[page.name]}](${origin}/en/${page.path}): ${description}`;
}));

await writeFile(`${root}/en/llms.txt`, `# StarDreamTech

> 10 public product projects: desktop tools, AI assistants, monitoring and human verification. Includes released, developing and planned projects. Official site: ${origin}/en/ . Contact email: hi@stardreamfly.com . Source organization: https://github.com/StarDreamTech .

English: ${origin}/en/llms.txt
中文: ${origin}/llms.txt

## Projects and demos

${summaries.join('\n')}

Project status was checked on November 25, 2026. Released desktop products listed here: Starclip v0.2.7, Starshot v0.3.3 and StarVault v0.1.4. StarLock 0.8.0 is a development version.

## StarLock developer documentation

- [README](https://github.com/StarDreamTech/starlock/blob/main/README.md): scope, setup and deployment.
- [Integration guide](https://github.com/StarDreamTech/starlock/blob/main/docs/integration.md): hosted script, Vue / React and backend verification.
- [Python / Go SDKs](https://github.com/StarDreamTech/starlock/blob/main/docs/server-sdks.md): standard-library clients, installation, errors and context binding.
- [Verification records](https://github.com/StarDreamTech/starlock/blob/main/docs/verification.md): checks performed and verification scope.

The demo checks answers in the browser; real integrations verify tokens on the application backend. Public hosted APIs, a production CDN and npm packages are not yet released. Original character images in text-click challenges remain in Chinese. Product capabilities and availability follow the linked public repositories and release records.
`);

await import('./update-search.mjs');
console.log(`Generated ${pages.length} English pages with static content and shared assets.`);
