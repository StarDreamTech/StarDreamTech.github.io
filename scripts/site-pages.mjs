export const projects = [
  ['starclip', '星笺 Starclip'],
  ['starshot', '星镜 Starshot'],
  ['starvault', '星匣 StarVault'],
  ['starwatch', '星哨 StarWatch', 'StarWatch'],
  ['starlock', '星锁 StarLock'],
  ['starenvoy', '星使 StarEnvoy', 'StarEnvoy'],
  ['starcode', '星码 StarCode'],
  ['starbuddy', '星搭子 StarBuddy'],
  ['starpersona', '星相 StarPersona', 'StarPersona'],
  ['stardash', '星盘 StarDash', 'StarDash'],
];

export const pages = [
  { path: '', name: '星梦科技 StarDreamTech' },
  ...projects.map(([slug, name, repository = slug]) => ({ path: `projects/${slug}/`, name, slug, repository })),
  { path: 'projects/starlock/demo/', name: '星锁验证码交互演示', slug: 'starlock' },
];
