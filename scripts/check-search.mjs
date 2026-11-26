import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const origin = 'https://stardreamfly.com';
const cname = (await readFile(`${root}CNAME`, 'utf8')).trim();
assert.equal(cname, new URL(origin).host, 'CNAME must match canonical site host');
const folders = (await readdir(`${root}projects`, { withFileTypes: true }))
  .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
  .map(entry => entry.name);
const chinesePaths = ['', ...folders.map(folder => `projects/${folder}/`), 'projects/starlock/demo/'];
const paths = ['', 'en/'].flatMap(prefix => chinesePaths.map(path => prefix + path));
const sitemap = await readFile(`${root}sitemap.xml`, 'utf8');
const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
assert.equal(new Set(locations).size, paths.length, 'Sitemap must list each page once');
const titles = new Set();
const home = await readFile(`${root}index.html`, 'utf8');
const homeData = JSON.parse(home.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
const catalog = homeData['@graph'].find(item => item['@type'] === 'ItemList').itemListElement;
const projectSection = home.match(/<section id="projects"[\s\S]*?<\/section>/)[0];
assert.equal(folders.length, 10, 'The public product catalog must contain 10 projects');
assert.equal(catalog.length, folders.length, 'Structured catalog must match project pages');
assert.equal((projectSection.match(/<article\b/g) || []).length, folders.length, 'Every product must have one homepage card');
assert.ok(home.includes(`<dt>公开产品项目</dt><dd>${folders.length}</dd>`), 'Homepage count must match the catalog');
assert.doesNotMatch(projectSection + sitemap, /stargate|starscout|starport/i, 'Private projects must stay out of the public catalog');
for (const folder of folders) {
  assert.equal(catalog.filter(item => item.url === `${origin}/projects/${folder}/`).length, 1, folder);
  assert.ok(projectSection.includes(`href="projects/${folder}/"`), `${folder} needs an introduction link`);
}
for (const path of paths) {
  const html = await readFile(`${root}${path}index.html`, 'utf8');
  const url = `${origin}/${path}`;
  const isEnglish = path.startsWith('en/');
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1, path);
  assert.ok(html.includes(`<link rel="canonical" href="${url}">`), path);
  assert.ok(locations.includes(url), path);
  assert.match(html, /name="robots" content="index, follow/);
  assert.doesNotMatch(html, /noindex|localhost|127\.0\.0\.1/);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, path);
  const title = html.match(/<title>(.*?)<\/title>/s)[1];
  assert.ok(!titles.has(title), `Repeated title in ${path}`);
  titles.add(title);
  const data = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  const webpage = data['@graph'].find(item => item['@type'] === 'WebPage');
  assert.equal(webpage.url, url);
  assert.equal(webpage.name, title);
  assert.equal(webpage.inLanguage, isEnglish ? 'en' : 'zh-CN');
  const image = new URL(html.match(/property="og:image" content="([^"]+)"/)[1]);
  assert.equal(image.origin, origin);
  await access(`${root}${image.pathname}`);
  assert.ok(html.includes(`href="/${isEnglish ? 'en/' : ''}llms.txt"`), path);
}
const robots = await readFile(`${root}robots.txt`, 'utf8');
assert.match(robots, /User-agent: \*\s+Allow: \//);
assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
const index = await readFile(`${root}llms.txt`, 'utf8');
for (const path of chinesePaths.slice(1)) assert.ok(index.includes(`${origin}/${path}`));
const englishIndex = await readFile(`${root}en/llms.txt`, 'utf8');
for (const path of chinesePaths.slice(1)) assert.ok(englishIndex.includes(`${origin}/en/${path}`));
const css = await readFile(`${root}css/style.css`, 'utf8');
assert.match(css, /\.reveal\{opacity:1;transform:none/);
console.log(`PASS: ${folders.length} public projects, homepage cards and count, ${paths.length} static pages, canonical URLs, JSON-LD, sitemap, crawler access, image assets and document index.`);
