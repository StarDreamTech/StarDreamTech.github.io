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

## 许可证 / License

本项目采用 [MIT License](LICENSE)。
