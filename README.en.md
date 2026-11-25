# StarDreamTech.github.io

[简体中文](README.md) | English

The StarDreamTech organization website, published at https://stardreamfly.com/ (the legacy `https://stardreamtech.github.io` address automatically 301-redirects to the primary domain via GitHub Pages). The default language is Simplified Chinese; the English site starts at https://stardreamfly.com/en/ .

This is a static site: `index.html`, `css/style.css`, `js/main.js` and `assets/`. No framework build is required to serve the committed files. Preview with `python3 -m http.server`, then visit http://localhost:8000 .

Project information comes from repository descriptions, READMEs, releases and the StarDreamTech/homebrew-tap casks, checked on November 25, 2026. Contact email: `hi@stardreamfly.com`. Icons are taken from project repositories where available. StarWatch, StarBuddy, StarPort, StarPersona and StarDash use website display SVGs; StarLock uses its dedicated purple lock logo.

The site supports light and dark themes. The first visit follows `prefers-color-scheme`; manual choices are saved in `localStorage` under `sdt-theme`.

## Chinese and English pages

The home page, 11 public project pages and StarLock playground each have English / 中文 links, for 26 static HTML pages. Switching preserves the current page. With JavaScript enabled, it also retains query parameters and anchors. English internal navigation, playground links and the documentation index stay under `/en/`. There is no browser-language redirect; existing URLs remain Chinese by default.

English content is delivered in HTML and remains readable without JavaScript. After editing a Chinese page, maintain its entries in `scripts/translations.en.json` and run `node scripts/build-english.mjs`. Missing translations cause an error. The command generates `en/`, bilingual metadata and the sitemap. Images, styles and primary scripts remain shared.

The generated English playground bundle changes only the fixture base URL so it can load shared challenges without duplicating their images. `js/demo-english.js` translates dynamic instructions, accessible names and Shadow DOM dialogs without changing challenge answers or verification. Text-click challenges intentionally retain the original Chinese character images, as explained on the English page.

After exporting the StarLock demo again, rerun the generator. If the upstream fixture loader changes, generation fails until its adaptation is reviewed. Third-party license notices, external documentation and product installers retain their original sources; they are not all guaranteed to have English versions.

## Project pages

The home page lists 11 public product projects with their own description, status and repository links. GitHub Pages supports both trailing-slash and non-trailing-slash URLs.

- [Starclip](https://stardreamfly.com/en/projects/starclip/)
- [Starshot](https://stardreamfly.com/en/projects/starshot/)
- [StarVault](https://stardreamfly.com/en/projects/starvault/)
- [StarWatch](https://stardreamfly.com/en/projects/starwatch/)
- [StarLock](https://stardreamfly.com/en/projects/starlock/)
- [StarEnvoy](https://stardreamfly.com/en/projects/starenvoy/)
- [StarPort](https://stardreamfly.com/en/projects/starport/)
- [StarCode](https://stardreamfly.com/en/projects/starcode/)
- [StarBuddy](https://stardreamfly.com/en/projects/starbuddy/)
- [StarPersona](https://stardreamfly.com/en/projects/starpersona/)
- [StarDash](https://stardreamfly.com/en/projects/stardash/)

The catalog snapshot lists Starclip v0.2.7, Starshot v0.3.3 and StarVault v0.1.4 with installers. StarLock, StarWatch, StarEnvoy and StarPort have implementations without official releases; StarCode is an initialized fork, StarBuddy a Phase 0 frontend preview, and StarPersona and StarDash are listed as planning-stage projects. Planned capabilities are labeled accordingly. Private projects, the organization site and Homebrew distribution repositories are excluded from the product count.

StarLock information follows its 0.8.0 source and documentation: eight challenge types, a hosted SDK, Vue 3 and React 18/19 components, and Python / Go backend SDKs. Public verification APIs and npm packages have not been released.

## StarLock playground

https://stardreamfly.com/en/projects/starlock/demo/ offers ring rotation, curved puzzles, variable-speed sliders, digits, characters, arithmetic, ordered text clicks and semantic image grids. It reuses the project's verification dialog and client, with public demo fixtures checked in the browser. Real integrations require backend verification.

The source is in the StarLock repository at `examples/static-demo/`. Build with `npm run build:demo` and export with `scripts/export-demo.mjs` to this repository's `projects/starlock/demo/`. Then regenerate the English site and run the checks below before delivery.

## Analytics

Every page loads the shared `js/analytics.js` with `defer` in its head, after the stylesheet. Theme initialization stays first to avoid a theme flash. Script paths are relative to each page.

Public identifiers are defined at the top of that file:

- Google Analytics 4 measurement ID: `G-X4TGP2S2YL`
- Microsoft Clarity project ID: `zccwljdddd`

Trackers load only on the production host allowlist (`stardreamfly.com`, plus transitional `stardreamtech.github.io`). Local preview and other domains do not contact Google or Clarity. GA4 disables automatic `page_view`, `allow_google_signals` and `allow_ad_personalization_signals`, then sends one manual `page_view`. The reported page URL contains only origin and pathname; query strings and hashes are excluded. Referrers retain only origin, plus pathname for same-site referrals.

Baidu Analytics and 51.la are not integrated. Add real public IDs and loader functions to `TRACKERS` when available; do not add empty tracker calls.

## Search and AI discovery

All 26 pages provide static content, unique titles and descriptions, canonical URLs, reciprocal `hreflang` links with Chinese as `x-default`, Open Graph / Twitter metadata, and Organization, WebSite, WebPage, SoftwareSourceCode and breadcrumb structured data. The StarLock page includes FAQs and original documentation links.

`robots.txt` permits public crawling. `sitemap.xml` lists all 26 canonical pages. `llms.txt` and `en/llms.txt` provide language-specific project and documentation indexes, also linked in page footers.

Generate and verify after content changes:

```bash
node scripts/build-english.mjs
node scripts/check-search.mjs
node scripts/check-analytics.mjs
node scripts/check-i18n.mjs
```

After publishing and checking the live site, IndexNow submissions can be sent with `node scripts/submit-indexnow.mjs`. `indexnow.txt` is the publicly hosted ownership verification file. HTTP 200 means the notification was received; 202 means ownership verification is pending. Indexing, ranking and AI citations require separate observation. Google Search Console and Bing Webmaster Tools verification and reports must be checked in the corresponding accounts.

Implementation references: [Google AI search guidance](https://developers.google.com/search/docs/appearance/ai-features), [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots), and the [IndexNow protocol](https://www.indexnow.org/documentation). The focus is crawlability, visible content, accurate structured data and source links.

## License

[MIT License](LICENSE).
