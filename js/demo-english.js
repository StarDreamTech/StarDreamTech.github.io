// The exported demo owns its widget. Translate presentation only; challenge IDs, images and answers stay unchanged.
(() => {
  if (document.documentElement.lang !== 'en') return;
  const text = {
    '验证已过期，请重新开始': 'Verification expired. Please start again.',
    '网络连接失败，请稍后重试': 'Connection failed. Please try again later.',
    '验证服务暂时不可用': 'Verification is temporarily unavailable.',
    '验证服务响应异常': 'Unexpected verification response.',
    '验证题目响应异常，请重试': 'Unexpected challenge response. Please retry.',
    '请创建新的验证会话': 'Please start a new verification session.',
    '请按提示完成选择': 'Complete the selection as instructed.',
    '请先调整拼图位置': 'Adjust the puzzle position first.',
    '请先输入答案': 'Enter an answer first.',
    '验证结果响应异常': 'Unexpected verification result.',
    '验证通过': 'Verified',
    '固定外圈与旋转内圈，拖动使交界图案对齐': 'Drag to align the rotating inner ring with the fixed outer ring',
    '带多个图形缺口的星空题面，只有一个缺口的位置与角度能同时贴合': 'A starfield with several cutouts; only one matches both position and angle',
    '对齐图案后松开': 'Release when the image is aligned',
    '拖动滑块，旋转内圈': 'Drag the slider to rotate the inner ring',
    '对准缺口后松开': 'Release when the piece fits the cutout',
    '按住滑块，拖动拼图': 'Hold the slider and drag the puzzle piece',
    '旋转进度': 'Rotation progress',
    '拼图位置': 'Puzzle position',
    '题目图片加载失败，请换题。': 'The challenge image could not load. Try another challenge.',
    '松开验证 · 方向键微调，回车确认': 'Release to verify · Arrow keys to adjust, Enter to confirm',
    '文字点选区域，方向键移动光标，回车添加标记': 'Text selection area: move with arrow keys and press Enter to add a marker',
    '包含目标文字和干扰文字的图片': 'Image containing target characters and decoy characters',
    '已点选': 'Selected',
    '撤销': 'Undo',
    '清空': 'Clear',
    '按提示顺序点击文字，也可用方向键和回车添加标记。': 'Click the characters in the requested order, or use arrow keys and Enter to add markers.',
    '九宫格图片选择': 'Image grid selection',
    '已选择': 'Selected',
    '张': 'images',
    '清空选择': 'Clear selection',
    '图片加载失败，请换一题。': 'An image could not load. Try another challenge.',
    '选择所有符合题目含义的图片，再确认。': 'Select all images matching the prompt, then confirm.',
    '星锁人机验证': 'StarLock human verification',
    '星锁 Logo': 'StarLock logo',
    '星锁验证': 'StarLock verification',
    '星梦科技': 'StarDreamTech',
    '本次验证已完成': 'This verification is complete',
    '正在准备验证…': 'Preparing verification…',
    '需要识别的验证码图片': 'CAPTCHA image to read',
    '暂时无法加载题目': 'Unable to load the challenge',
    '正在连接验证服务': 'Connecting to the verification service',
    '正在换一题…': 'Loading another challenge…',
    '验证答案': 'Challenge answer',
    '输入图片答案': 'Enter the answer from the image',
    '换一张验证码': 'Refresh CAPTCHA image',
    '换一题': 'New challenge',
    '正在校验…': 'Checking…',
    '正在验证…': 'Verifying…',
    '确认选择': 'Confirm selection',
    '确认点选': 'Confirm clicks',
    '确认验证': 'Verify',
    '点击完成验证': 'Click to verify',
    '关闭验证': 'Close verification',
    '验证已过期': 'Verification expired',
    '当前浏览器不支持验证弹窗': 'This browser does not support the verification dialog',
    '此题型暂时没有演示题，请重新加载': 'No demo is available for this type. Please reload.',
    '请重新选择一种验证方式': 'Please choose a challenge type again',
    '本次体验已完成，请再试一次': 'Demo complete. Try again.',
    '请刷新当前题目': 'Please refresh the challenge',
    '演示题型不匹配，请重新加载': 'Demo challenge type mismatch. Please reload.',
    '题目已更新，请使用新题': 'The challenge changed. Use the new one.',
    '题目已过期，请刷新': 'The challenge expired. Please refresh.',
    '请换一题继续体验': 'Try a new challenge to continue',
    '还差一点，请再试一次': 'Not quite. Please try again.',
    '演示题暂时没有加载成功，请重试': 'The demo challenge could not load. Please retry.',
    '演示题暂时不可用，请重试': 'The demo challenge is temporarily unavailable. Please retry.',
    '演示题已过期，点击再试一次即可继续。': 'The demo expired. Click Try again to continue.',
    '图片加载失败，请重新体验。': 'The image could not load. Please try again.',
    '验证暂不可用，请换一题或重新体验。': 'Verification unavailable. Try another challenge or start again.',
    '加载失败，请重新体验': 'Loading failed. Please try again.',
    '请输入图片中算式的结果': 'Enter the result of the calculation in the image',
    '拖动滑块，让图形的位置与角度同时贴合缺口': 'Drag the slider to match the cutout position and angle',
    '请输入图片中的数字': 'Enter the digits in the image',
    '拖动滑块旋转内圈，让图案恢复完整': 'Drag the slider to rotate the inner ring and align the image',
    '请输入图片中的字符': 'Enter the characters in the image',
    '请选择所有生长在植物上的水果': 'Select all fruit growing on plants',
    '请选择所有能在水上航行的交通工具': 'Select all vehicles that travel on water',
    '请选择所有用于道路行驶的小汽车': 'Select all cars used for road travel'
  };
  function translate(value) {
    const key = value.trim();
    let result = text[key];
    if (!result) result = key
      .replace(/^正在准备(.+)…$/, 'Preparing $1…')
      .replace(/^正在体验(.+)$/, 'Trying $1')
      .replace(/^(.+)体验完成，换一种方式试试。$/, '$1 complete. Try another type.')
      .replace(/^已收起(.+)，点击卡片可继续体验。$/, '$1 closed. Click a card to continue.')
      .replace(/^旋转 (\d+) 度，手柄进度 (\d+)%$/, 'Rotation $1°, slider $2%')
      .replace(/^路径进度 (\d+)%$/, 'Path progress $1%')
      .replace(/^移除第 (\d+) 次点击$/, 'Remove click $1')
      .replace(/^第 (\d+) 张图片$/, 'Image $1')
      .replace(/^候选图片 (\d+)$/, 'Candidate image $1')
      .replace(/^已点选 (\d+) \/ (\d+)$/, 'Selected $1 / $2')
      .replace(/^已选择 (\d+) 张$/, 'Selected $1 images')
      .replace(/^请依次点击\s*/, 'Click in order: ')
      .replace(/^请选择所有(.+)$/, 'Select all $1')
      .replace('生长在植物上的水果', 'fruit growing on plants')
      .replace('小汽车', 'cars').replace('船只', 'boats').replace('水果', 'fruit');
    if (result === key) return value;
    return value.slice(0, value.length - value.trimStart().length) + result + value.slice(value.trimEnd().length);
  }
  function localize(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.parentElement?.closest('script, style, .lang-menu, .language-switch')) return;
      const value = translate(node.nodeValue);
      if (value !== node.nodeValue) node.nodeValue = value;
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE && node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return;
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.matches('script, style, .lang-menu, .language-switch')) return;
      for (const name of ['aria-label', 'aria-valuetext', 'alt', 'title', 'placeholder']) {
        if (!node.hasAttribute(name)) continue;
        const value = translate(node.getAttribute(name));
        if (value !== node.getAttribute(name)) node.setAttribute(name, value);
      }
      if (node.shadowRoot) {
        observe(node.shadowRoot);
        localize(node.shadowRoot);
      }
    }
    node.childNodes.forEach(localize);
  }
  const observed = new WeakSet();
  const observer = new MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'childList') record.addedNodes.forEach(localize);
      else localize(record.target);
    }
  });
  function observe(root) {
    if (observed.has(root)) return;
    observed.add(root);
    observer.observe(root, { subtree: true, childList: true, characterData: true, attributes: true,
      attributeFilter: ['aria-label', 'aria-valuetext', 'alt', 'title', 'placeholder'] });
  }
  observe(document.body);
  localize(document.body);
})();
