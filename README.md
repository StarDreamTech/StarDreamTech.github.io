# StarDreamTech.github.io

星梦科技 StarDreamTech 组织主页，发布于 https://stardreamtech.github.io 。

纯静态站点，无需构建：`index.html` + `css/style.css` + `js/main.js` + `assets/`。
本地预览：`python3 -m http.server` 后打开 http://localhost:8000 。

项目信息来源：各仓库 description / README / 最新 Release 与 StarDreamTech/homebrew-tap 中的 Cask（2026-11-11 核对）。
应用图标取自各项目仓库；星哨、星伴图标为本站原创 SVG。

支持明、暗两套主题。首次访问跟随系统 `prefers-color-scheme`，手动切换后写入 `localStorage`（键名 `sdt-theme`）。

## 项目介绍页

首页四张已上线卡片各有独立介绍，路径与页面文件对应，GitHub Pages 可带或不带尾斜杠打开：

- 星笺 Starclip：https://stardreamtech.github.io/projects/starclip/ （`projects/starclip/index.html`）
- 星镜 Starshot：https://stardreamtech.github.io/projects/starshot/ （`projects/starshot/index.html`）
- 星匣 StarVault：https://stardreamtech.github.io/projects/starvault/ （`projects/starvault/index.html`）
- 星哨 StarWatch：https://stardreamtech.github.io/projects/starwatch/ （`projects/starwatch/index.html`）

星伴 StarBuddy 仍是即将推出，没有介绍页，首页也不链接其仓库。介绍页文案只整理自各仓库公开 README、已发布 Release 与首页卡片，不另写未公布的功能。

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

## 许可证 / License

本项目采用 [MIT License](LICENSE)。
