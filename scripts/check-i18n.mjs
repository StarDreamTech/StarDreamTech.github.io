import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import vm from 'node:vm';
import { pages } from './site-pages.mjs';

const root = resolve(import.meta.dirname, '..');
const origin = 'https://stardreamfly.com';
const documents = new Map();
const publicProjects = new Set(pages.map(page => page.slug).filter(Boolean));
for (const prefix of ['', 'en/']) {
  for (const page of pages) {
    const path = `${prefix}${page.path}index.html`;
    documents.set(path, await readFile(`${root}/${path}`, 'utf8'));
  }
}
const brandNames = new Set(['星梦科技', '星笺', '星镜', '星匣', '星锁', '星哨', '星使', '星口', '星码', '星搭子', '星相', '星盘', '中文']);
for (const [path, html] of documents) {
  const english = path.startsWith('en/');
  const pagePath = path.replace(/^en\//, '').replace(/index\.html$/, '');
  const counterpart = english ? `/${pagePath}` : `/en/${pagePath}`;
  assert.ok(html.includes(`<html lang="${english ? 'en' : 'zh-CN'}">`), path);
  assert.equal((html.match(/class="language-switch"/g) || []).length, 1, path);
  assert.match(html, new RegExp(`class="language-switch" href="${counterpart}"`), path);
  for (const [language, prefix] of [['zh-CN', ''], ['en', 'en/'], ['x-default', '']]) {
    assert.ok(html.includes(`hreflang="${language}" href="${origin}/${prefix}${pagePath}"`), path);
  }
  for (const [, slug] of html.matchAll(/(?:href|content)="[^"?#]*?\bprojects\/([a-z0-9-]+)(?:[/?#"])/gi)) {
    assert.ok(publicProjects.has(slug.toLowerCase()), `${path}: project outside the public catalog`);
  }
  const body = html.replace(/<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<!--[\s\S]*?-->/g, '');
  if (english) {
    for (const token of body.match(/>[^<]+</g) || []) {
      const text = token.slice(1, -1).trim();
      assert.ok(!/[\u3400-\u9fff\u3001-\u303f\uff01-\uffef]/u.test(text) || brandNames.has(text), `Untranslated English text in ${path}: ${text}`);
    }
    for (const [, mailto] of body.matchAll(/href="(mailto:[^"]+)"/g)) {
      assert.ok(!/[\u3400-\u9fff]/u.test(decodeURIComponent(mailto)), `Untranslated mailto in ${path}: ${mailto}`);
    }
    assert.match(html, /Switch to light theme|demo-english\.js/, path);
  }
  for (const [, kind, value] of body.matchAll(/\b(href|src)="([^"]*)"/g)) {
    if (/^(?:data:|mailto:|tel:)/.test(value)) continue;
    const url = new URL(value, `${origin}/${path}`);
    if (url.origin !== origin) continue;
    let target = url.pathname.replace(/^\//, '');
    if (!target || target.endsWith('/')) target += 'index.html';
    assert.ok(resolve(root, target).startsWith(root + '/'), `${path}: path must stay within site`);
    await access(`${root}/${target}`);
    if (documents.has(target)) {
      if (kind === 'href' && !body.includes(`class="language-switch" href="${value}"`)) {
        // Metadata alternates are deliberately cross-language, navigation is not.
        const navigation = html.slice(html.indexOf('<body>'));
        if (navigation.includes(`href="${value}"`)) assert.equal(target.startsWith('en/'), english, `${path}: navigation leaves current language: ${value}`);
      }
      if (url.hash) {
        const id = decodeURIComponent(url.hash.slice(1));
        assert.ok(documents.get(target).includes(`id="${id}"`), `${path}: missing anchor ${value}`);
      }
    }
  }
}

const languageScript = await readFile(`${root}/js/language.js`, 'utf8');
for (const [targetPath, location] of [
  ['/en/', { href: `${origin}/?preview=1#services`, search: '?preview=1', hash: '#services' }],
  ['/projects/starlock/', { href: `${origin}/en/projects/starlock/#faq`, search: '', hash: '#faq' }],
  ['/en/projects/starlock/demo/', { href: `${origin}/projects/starlock/demo/?kind=text#demo-title`, search: '?kind=text', hash: '#demo-title' }],
]) {
  const link = { getAttribute: () => targetPath };
  const listeners = {};
  vm.runInNewContext(languageScript, { URL, location, document: { querySelector: () => link }, addEventListener: (event, callback) => { listeners[event] = callback; } });
  assert.equal(link.href, targetPath + location.search + location.hash);
  location.hash = '#top';
  listeners.hashchange();
  assert.equal(link.href, targetPath + location.search + '#top');
}
const chineseReadme = await readFile(`${root}/README.md`, 'utf8');
const englishReadme = await readFile(`${root}/README.en.md`, 'utf8');
assert.match(chineseReadme, /\[English\]\(README\.en\.md\)/);
assert.match(englishReadme, /\[简体中文\]\(README\.md\)/);
console.log(`PASS: ${documents.size} bilingual pages, translated content, language alternates, local assets and anchors, same-language navigation, query/hash preservation and README links.`);
