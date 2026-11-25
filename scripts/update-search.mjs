import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const origin = 'https://stardreamfly.com';
const projects = [
  ['starclip', '星笺 Starclip'],
  ['starshot', '星镜 Starshot'],
  ['starvault', '星匣 StarVault'],
  ['starwatch', '星哨 StarWatch', 'StarWatch'],
  ['starlock', '星锁 StarLock'],
  ['starenvoy', '星使 StarEnvoy', 'StarEnvoy'],
  ['starport', '星口 StarPort'],
  ['starcode', '星码 StarCode'],
  ['starbuddy', '星搭子 StarBuddy'],
  ['starpersona', '星相 StarPersona', 'StarPersona'],
  ['stardash', '星盘 StarDash', 'StarDash'],
];
const organization = {
  '@type': 'Organization', '@id': `${origin}/#organization`,
  name: '星梦科技', alternateName: 'StarDreamTech', url: `${origin}/`,
  logo: `${origin}/assets/logo.svg`, sameAs: ['https://github.com/StarDreamTech'],
};
const website = {
  '@type': 'WebSite', '@id': `${origin}/#website`, url: `${origin}/`,
  name: '星梦科技 StarDreamTech', inLanguage: 'zh-CN',
  publisher: { '@id': organization['@id'] },
};
const pages = [
  { path: '', name: '星梦科技 StarDreamTech' },
  ...projects.map(([slug, name, repository = slug]) => ({ path: `projects/${slug}/`, name, slug, repository })),
  { path: 'projects/starlock/demo/', name: '星锁验证码交互演示', slug: 'starlock' },
];
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');

for (const page of pages) {
  const file = `${root}${page.path}index.html`;
  let html = await readFile(file, 'utf8');
  const title = html.match(/<title>(.*?)<\/title>/s)[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/)[1];
  const url = `${origin}/${page.path}`;
  const isSquareIcon = Boolean(page.slug && ['starclip', 'starshot', 'starvault', 'starlock'].includes(page.slug));
  const image = isSquareIcon
    ? `${origin}/assets/icons/${page.slug}.png` : `${origin}/assets/social.png`;
  const imageWidth = isSquareIcon ? 256 : 1200;
  const imageHeight = isSquareIcon ? 256 : 630;
  const twitterCard = isSquareIcon ? 'summary' : 'summary_large_image';
  const graph = [organization, website, {
    '@type': 'WebPage', '@id': `${url}#webpage`, url, name: title, description,
    inLanguage: 'zh-CN', isPartOf: { '@id': website['@id'] },
    about: { '@id': page.slug ? `${url}#software` : organization['@id'] },
    publisher: { '@id': organization['@id'] },
  }];
  if (page.slug) {
    graph.push({
      '@type': 'SoftwareSourceCode', '@id': `${url}#software`,
      name: page.name, description, url,
      codeRepository: `https://github.com/StarDreamTech/${page.repository ?? page.slug}`,
      author: { '@id': organization['@id'] },
      ...(page.slug === 'starlock' ? { license: 'https://github.com/StarDreamTech/starlock/blob/main/LICENSE' } : {}),
    }, {
      '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: '星梦科技', item: `${origin}/` },
        { '@type': 'ListItem', position: 2, name: page.name, item: url },
      ],
    });
  } else {
    graph.push({
      '@type': 'ItemList', name: '星梦科技开源项目', itemListElement: projects.map(([slug, name], index) => ({
        '@type': 'ListItem', position: index + 1, name, url: `${origin}/projects/${slug}/`,
      })),
    });
  }
  // Metadata is static in the delivered HTML, including for clients that do not execute JS.
  html = html.replace(/\n?  <!-- search:start -->[\s\S]*?<!-- search:end -->\n?/g, '\n')
    .replace(/^  <link rel="canonical"[^>]*>\n/gm, '')
    .replace(/^  <meta property="og:[^>]*>\n/gm, '');
  const tags = `  <!-- search:start -->
  <link rel="canonical" href="${url}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="星梦科技 StarDreamTech">
  <meta property="og:locale" content="zh_CN">
  <meta property="og:title" content="${escape(title)}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:width" content="${imageWidth}">
  <meta property="og:image:height" content="${imageHeight}">
  <meta property="og:image:alt" content="${page.name}">
  <meta name="twitter:card" content="${twitterCard}">
  <meta name="twitter:title" content="${escape(title)}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">
  <link rel="alternate" type="text/plain" href="${origin}/llms.txt" title="项目与文档索引">
  <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replaceAll('<', '\\u003c')}</script>
  <!-- search:end -->\n`;
  html = html.replace('</head>', `${tags}</head>`);
  await writeFile(file, html);
}
await writeFile(`${root}sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url><loc>${origin}/${page.path}</loc></url>`).join('\n')}
</urlset>
`);
console.log(`已更新 ${pages.length} 个静态页面的元信息、结构化资料和站点地图。`);
