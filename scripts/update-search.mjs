import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { projects, pages } from './site-pages.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const origin = 'https://stardreamfly.com';
const lastModified = '2026-11-26';
const translations = JSON.parse(await readFile(`${root}scripts/translations.en.json`, 'utf8'));
const softwareApps = {
  starclip: {
    softwareVersion: '0.2.7',
    operatingSystem: 'macOS 11+ (Apple Silicon), Windows x64',
    applicationCategory: 'UtilitiesApplication',
    downloadUrl: 'https://github.com/StarDreamTech/starclip/releases/tag/v0.2.7',
    license: 'https://github.com/StarDreamTech/starclip/blob/main/LICENSE',
  },
  starshot: {
    softwareVersion: '0.3.3',
    operatingSystem: 'macOS 12+ (Apple Silicon), Windows x64',
    applicationCategory: 'UtilitiesApplication',
    downloadUrl: 'https://github.com/StarDreamTech/starshot/releases/tag/v0.3.3',
  },
  starvault: {
    softwareVersion: '0.1.4',
    operatingSystem: 'macOS (Apple Silicon), Linux (CLI/MCP), Windows (source)',
    applicationCategory: 'DeveloperApplication',
    downloadUrl: 'https://github.com/StarDreamTech/starvault/releases/tag/v0.1.4',
  },
  starlock: {
    softwareVersion: '0.8.0',
    operatingSystem: 'Web, Linux, macOS, Windows',
    applicationCategory: 'SecurityApplication',
    license: 'https://github.com/StarDreamTech/starlock/blob/main/LICENSE',
  },
};
const stripTags = value => value
  .replace(/<[^>]+>/g, '')
  .replaceAll('&amp;', '&')
  .replaceAll('&quot;', '"')
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>')
  .replace(/\s+/g, ' ')
  .trim();
function extractFaqEntities(html) {
  const section = html.match(/<section[^>]*\bid="faq"[^>]*>([\s\S]*?)<\/section>/);
  if (!section) return [];
  const items = [];
  for (const match of section[1].matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>\s*<p\b[^>]*class="[^"]*\bprose\b[^"]*"[^>]*>([\s\S]*?)<\/p>/g)) {
    const question = stripTags(match[1]);
    const answer = stripTags(match[2]);
    if (question && answer) {
      items.push({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      });
    }
  }
  return items;
}
const organization = {
  '@type': 'Organization', '@id': `${origin}/#organization`,
  name: '星梦科技', alternateName: 'StarDreamTech', url: `${origin}/`,
  logo: `${origin}/assets/logo.svg`, email: 'mailto:hi@stardreamfly.com',
  sameAs: ['https://github.com/StarDreamTech'],
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
    const localizedWebsite = {
      ...website,
      '@id': `${origin}/${prefix}#website`,
      url: `${origin}/${prefix}`,
      name: language === 'en' ? 'StarDreamTech' : website.name,
      inLanguage: language,
    };
    const isSquareIcon = Boolean(page.slug && ['starclip', 'starshot', 'starvault', 'starlock'].includes(page.slug));
    const image = isSquareIcon
      ? `${origin}/assets/icons/${page.slug}.png` : `${origin}/assets/social.png`;
    const imageWidth = isSquareIcon ? 256 : 1200;
    const imageHeight = isSquareIcon ? 256 : 630;
    const twitterCard = isSquareIcon ? 'summary' : 'summary_large_image';
    const graph = [organization, localizedWebsite, {
      '@type': 'WebPage', '@id': `${url}#webpage`, url, name: title, description,
      inLanguage: language, dateModified: lastModified, isPartOf: { '@id': localizedWebsite['@id'] },
      about: { '@id': page.slug ? `${url}#software` : organization['@id'] },
      publisher: { '@id': organization['@id'] },
    }];
    if (page.slug) {
      const appMeta = !page.path.endsWith('/demo/') ? softwareApps[page.slug] : null;
      graph.push({
        '@type': 'SoftwareSourceCode', '@id': `${url}#software`,
        name, description, url,
        codeRepository: `https://github.com/StarDreamTech/${page.repository ?? page.slug}`,
        author: { '@id': organization['@id'] },
        ...(appMeta?.license ? { license: appMeta.license } : {}),
      });
      if (appMeta) {
        graph.push({
          '@type': 'SoftwareApplication', '@id': `${url}#app`,
          name, description, url,
          applicationCategory: appMeta.applicationCategory,
          operatingSystem: appMeta.operatingSystem,
          softwareVersion: appMeta.softwareVersion,
          ...(appMeta.downloadUrl ? { downloadUrl: appMeta.downloadUrl } : {}),
          ...(appMeta.license ? { license: appMeta.license } : {}),
          isAccessibleForFree: true,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          author: { '@id': organization['@id'] },
        });
      }
      graph.push({
        '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: language === 'en' ? 'StarDreamTech' : '星梦科技', item: `${origin}/${prefix}` },
          { '@type': 'ListItem', position: 2, name, item: url },
        ],
      });
    } else {
      graph.push({
        '@type': 'ItemList',
        name: language === 'en' ? 'StarDreamTech open-source projects' : '星梦科技开源项目',
        itemListElement: projects.map(([slug, projectName], index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: language === 'en' ? translations[projectName] : projectName,
          url: `${origin}/${prefix}projects/${slug}/`,
        })),
      });
    }
    const faqEntities = extractFaqEntities(html);
    if (faqEntities.length > 0) {
      graph.push({
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: faqEntities,
      });
    }
    // Metadata is static in the delivered HTML, including for clients that do not execute JS.
    html = html.replace(/\n?  <!-- search:start -->[\s\S]*?<!-- search:end -->\n?/g, '\n')
      .replace(/^  <link rel="canonical"[^>]*>\n/gm, '')
      .replace(/^  <meta property="og:[^>]*>\n/gm, '');
    const tags = `  <!-- search:start -->
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png">
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
  <meta property="og:image:width" content="${imageWidth}">
  <meta property="og:image:height" content="${imageHeight}">
  <meta property="og:image:alt" content="${name}">
  <meta name="twitter:card" content="${twitterCard}">
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

const urls = ['', 'en/'].flatMap(prefix => pages.map(page => `  <url><loc>${origin}/${prefix}${page.path}</loc><lastmod>${lastModified}</lastmod></url>`));
await writeFile(`${root}sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`);
console.log(`已更新 ${pages.length * 2} 个静态页面的元信息、结构化资料和站点地图。`);
