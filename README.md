# StarDreamTech.github.io

星梦科技 StarDreamTech 组织主页，发布于 https://stardreamtech.github.io 。

纯静态站点，无需构建：`index.html` + `css/style.css` + `js/main.js` + `assets/`。
本地预览：`python3 -m http.server` 后打开 http://localhost:8000 。

项目信息来源：各仓库 description / README / 最新 Release 与 StarDreamTech/homebrew-tap 中的 Cask（2026-11-17 核对）。
应用图标优先取自各项目仓库；星哨、星搭子、星口、星相和星盘使用本站 SVG 展示图标；星锁使用项目专用紫色锁形 Logo。

支持明、暗两套主题。首次访问跟随系统 `prefers-color-scheme`，手动切换后写入 `localStorage`（键名 `sdt-theme`）。

## 项目介绍页

首页列出 11 个公开产品项目，每个项目都有独立介绍、开发状态与仓库入口。路径与页面文件对应，GitHub Pages 可带或不带尾斜杠打开：

- 星笺 Starclip：https://stardreamtech.github.io/projects/starclip/ （`projects/starclip/index.html`）
- 星镜 Starshot：https://stardreamtech.github.io/projects/starshot/ （`projects/starshot/index.html`）
- 星匣 StarVault：https://stardreamtech.github.io/projects/starvault/ （`projects/starvault/index.html`）
- 星哨 StarWatch：https://stardreamtech.github.io/projects/starwatch/ （`projects/starwatch/index.html`）
- 星锁 StarLock：https://stardreamtech.github.io/projects/starlock/ （`projects/starlock/index.html`）
- 星使 StarEnvoy：https://stardreamtech.github.io/projects/starenvoy/ （`projects/starenvoy/index.html`）
- 星口 StarPort：https://stardreamtech.github.io/projects/starport/ （`projects/starport/index.html`）
- 星码 StarCode：https://stardreamtech.github.io/projects/starcode/ （`projects/starcode/index.html`）
- 星搭子 StarBuddy：https://stardreamtech.github.io/projects/starbuddy/ （`projects/starbuddy/index.html`）
- 星相 StarPersona：https://stardreamtech.github.io/projects/starpersona/ （`projects/starpersona/index.html`）
- 星盘 StarDash：https://stardreamtech.github.io/projects/stardash/ （`projects/stardash/index.html`）

星笺 v0.2.6、星镜 v0.3.3 与星匣 v0.1.4 已有正式安装包；星锁、星哨、星使和星口已有功能实现，但没有正式 Release；星码为 fork 初始化、星搭子为第 0 期前端预览、星相和星盘为项目筹备。筹备能力明确标为规划，不提供虚构下载入口。私有项目不列入公开目录，官网与 Homebrew 安装源不计作产品。

星锁按 0.8.0 源码与文档核对，包含八种挑战、托管 SDK、Vue 3 和 React 18/19 组件，以及 Python / Go 服务端 SDK。介绍页提供 README、接入指南与框架示例入口。在线交互 demo 采用浏览器内演示判定；正式业务接入继续使用服务端校验，npm 包与公共验证 API 尚未发布。

## 星锁在线试玩

https://stardreamtech.github.io/projects/starlock/demo/ 提供圆环旋转、曲线拼图、变速滑块、数字、字符、算术、文字点选和语义九宫格八种交互。演示复用项目的验证弹窗和客户端，公开样题在浏览器内判定。主页星锁卡片和项目介绍页均提供试玩入口。

源码位于 StarLock 仓库的 `examples/static-demo/`，通过 `npm run build:demo` 构建，再用 `scripts/export-demo.mjs` 同步到本仓库的 `projects/starlock/demo/`。导出后运行搜索与统计检查，再提交 Pages 仓库。

## 访问统计

全站共用 `js/analytics.js`。每个 HTML 在 `<head>` 里用 `defer` 引用它：首页是 `js/analytics.js`，`projects/*/` 介绍页是 `../../js/analytics.js`。主题初始化仍是 head 最前面那段内联脚本，统计脚本排在样式表之后，不会挡住首屏设主题。

公开编号写在 `js/analytics.js` 顶部：

- Google Analytics 4 衡量 ID：`G-X4TGP2S2YL`
- Microsoft Clarity 项目 ID：`zccwljdddd`

只在 `location.hostname === 'stardreamtech.github.io'` 时加载。本地 `python3 -m http.server` 和其他域名不会请求 Google 或 Clarity。GA4 关闭自动 `page_view`、`allow_google_signals` 和 `allow_ad_personalization_signals`，再手动发送一次 `page_view`。`page_location` 只有 origin 和 pathname，不带 query 和 hash；来源页只保留 origin，站内来源再保留 pathname。

百度统计和 51.la 还没接。之后把公开编号加到同一文件顶部，再在 `TRACKERS` 里登记加载函数。编号还没有时不要写空调用。

检查每个页面是否引用了脚本、编号是否正确：

```bash
node scripts/check-analytics.mjs
```

## 搜索发现与 AI 检索

十三个页面（首页、11 个项目介绍和星锁试玩）直接提供静态正文、独立标题与摘要、canonical、Open Graph / Twitter 分享信息，以及 Organization、WebSite、WebPage、SoftwareSourceCode 和面包屑结构化资料。星锁页包含可见的常见问题、中英文项目说明和原始文档链接。页面正文在 JavaScript 不执行时也可见。

`robots.txt` 允许公开内容抓取，`sitemap.xml` 列出十三个规范页面。`llms.txt` 是项目与文档的简明链接索引，页脚也提供入口。内容更新后运行以下命令同步并检查元信息。

```bash
node scripts/update-search.mjs
node scripts/check-search.mjs
node scripts/check-analytics.mjs
```

站点发布并确认线上内容后，可通知参与 IndexNow 的搜索引擎。`indexnow.txt` 是按协议公开托管的站点所有权验证文件。

```bash
node scripts/submit-indexnow.mjs
```

HTTP 200 表示通知已收到，202 表示通知已收到且所有权验证待处理。实际收录、排序与 AI 引用需要在搜索平台另行观察。Google Search Console 与 Bing Webmaster Tools 的站点验证、收录报告须在相应账户中核验。

实施依据包括 [Google 的 AI 搜索与网站指南](https://developers.google.com/search/docs/appearance/ai-features)、[OpenAI 抓取器说明](https://developers.openai.com/api/docs/bots) 和 [IndexNow 协议](https://www.indexnow.org/documentation)。普通索引可达性、可见内容、准确的结构化资料与来源链接是本次实现的重点。

## 许可证 / License

本项目采用 [MIT License](LICENSE)。
