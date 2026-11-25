import { readFile } from 'node:fs/promises';

const origin = 'https://stardreamfly.com';
const root = new URL('../', import.meta.url);
const key = (await readFile(new URL('indexnow.txt', root), 'utf8')).trim();
const xml = await readFile(new URL('sitemap.xml', root), 'utf8');
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
if (!/^[a-f0-9]{32}$/.test(key) || urls.some(url => new URL(url).origin !== origin)) {
  throw new Error('Invalid IndexNow proof or sitemap host');
}
const proof = await fetch(`${origin}/indexnow.txt`, { signal: AbortSignal.timeout(15000) });
if (!proof.ok || (await proof.text()).trim() !== key) throw new Error('Publish the current ownership file before submitting URLs');
const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST', signal: AbortSignal.timeout(20000),
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: new URL(origin).host, key, keyLocation: `${origin}/indexnow.txt`, urlList: urls }),
});
if (response.status !== 200 && response.status !== 202) throw new Error(`IndexNow returned ${response.status}`);
console.log(`IndexNow HTTP ${response.status}: ${urls.length} URLs received. Crawling and indexing remain unverified.`);
