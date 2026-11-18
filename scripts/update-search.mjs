import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { projects, pages } from './site-pages.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const origin = 'https://stardreamtech.github.io';
const translations = JSON.parse(await readFile(`${root}scripts/translations.en.json`, 'utf8'));
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
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');

for (const language of ['zh-CN', 'en']) {
for (const page of pages) {
  const prefix = language === 'en' ? 'en/' : '';
  const name = language === 'en' ? translations[page.name] : page.name;
  const file = `${root}${prefix}${page.path}index.html`;
  let html = await readFile(file, 'utf8');
  const title = html.match(/<title>(.*?)<\/title>/s)[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/)[1];
  const url = `${origin}/${prefix}${page.path}`;
  const localizedWebsite = { ...website, '@id': `${origin}/${prefix}#website`, url: `${origin}/${prefix}`, name: language === 'en' ? 'StarDreamTech' : website.name, inLanguage: language };
  const image = page.slug && ['starclip', 'starshot', 'starvault', 'starlock'].includes(page.slug)
    ? `${origin}/assets/icons/${page.slug}.png` : `${origin}/assets/social.png`;
  const graph = [organization, localizedWebsite, {
    '@type': 'WebPage', '@id': `${url}#webpage`, url, name: title, description,
    inLanguage: language, isPartOf: { '@id': localizedWebsite['@id'] },
    about: { '@id': page.slug ? `${url}#software` : organization['@id'] },
    publisher: { '@id': organization['@id'] },
  }];
  if (page.slug) {
    graph.push({
      '@type': 'SoftwareSourceCode', '@id': `${url}#software`,
      name, description, url,
      codeRepository: `https://github.com/StarDreamTech/${page.repository ?? page.slug}`,
      author: { '@id': organization['@id'] },
      ...(page.slug === 'starlock' ? { license: 'https://github.com/StarDreamTech/starlock/blob/main/LICENSE' } : {}),
    }, {
      '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: language === 'en' ? 'StarDreamTech' : '星梦科技', item: `${origin}/${prefix}` },
        { '@type': 'ListItem', position: 2, name, item: url },
      ],
    });
  } else {
    graph.push({
      '@type': 'ItemList', name: language === 'en' ? 'StarDreamTech open-source projects' : '星梦科技开源项目', itemListElement: projects.map(([slug, name], index) => ({
        '@type': 'ListItem', position: index + 1, name: language === 'en' ? translations[name] : name, url: `${origin}/${prefix}projects/${slug}/`,
      })),
    });
  }
  // Metadata is static in the delivered HTML, including for clients that do not execute JS.
  html = html.replace(/\n?  <!-- search:start -->[\s\S]*?<!-- search:end -->\n?/g, '\n')
    .replace(/^  <link rel="canonical"[^>]*>\n/gm, '')
    .replace(/^  <meta property="og:[^>]*>\n/gm, '');
  const tags = `  <!-- search:start -->
  <link rel="canonical" href="${url}">
  <link rel="alternate" hreflang="zh-CN" href="${origin}/${page.path}">
  <link rel="alternate" hreflang="en" href="${origin}/en/${page.path}">
  <link rel="alternate" hreflang="x-default" href="${origin}/${page.path}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${language === 'en' ? 'StarDreamTech' : '星梦科技 StarDreamTech'}">
  <meta property="og:locale" content="${language === 'en' ? 'en_US' : 'zh_CN'}">
  <meta property="og:locale:alternate" content="${language === 'en' ? 'zh_CN' : 'en_US'}">
  <meta property="og:title" content="${escape(title)}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:alt" content="${name}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escape(title)}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">
  <link rel="alternate" type="text/plain" href="${origin}/${prefix}llms.txt" title="${language === 'en' ? 'Projects and documentation index' : '项目与文档索引'}">
  <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replaceAll('<', '\\u003c')}</script>
  <!-- search:end -->\n`;
  html = html.replace('</head>', `${tags}</head>`);
  await writeFile(file, html);
}
}
await writeFile(`${root}sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${['', 'en/'].flatMap(prefix => pages.map(page => `  <url><loc>${origin}/${prefix}${page.path}</loc></url>`)).join('\n')}
</urlset>
`);
console.log(`Updated metadata, structured data, language alternates and sitemap for ${pages.length * 2} static pages.`);
