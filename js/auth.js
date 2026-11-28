(() => {
  const API_BASE = 'https://api.stardreamfly.com';
  const isEn = document.documentElement.lang === 'en';
  const T = isEn ? {
    signIn: 'Sign in',
    loginTitle: 'Sign in to StarDreamTech',
    tabCode: 'Email code',
    tabPassword: 'Password',
    loginSubCode: 'Passwordless email verification. First sign-in creates your unified StarDream account automatically.',
    loginSubPwd: 'Sign in with your email or @ID and password (supports legacy StarDream passwords).',
    resetTitle: 'Reset password',
    resetSub: 'Verify with StarLock to receive a 6-digit reset code via email, then set a new password.',
    emailLabel: 'Email address',
    emailPlaceholder: 'you@example.com',
    identLabel: 'Email or @ID',
    identPlaceholder: 'you@example.com or @handle',
    pwdLabel: 'Password',
    pwdPlaceholder: 'Enter your password',
    newPwdLabel: 'New password (8–128 chars)',
    newPwdPlaceholder: 'At least 8 characters',
    curPwdLabel: 'Current password',
    curPwdPlaceholder: 'Enter current password',
    codeLabel: '6-digit verification code',
    codePlaceholder: 'Enter 6-digit code',
    sendCode: 'Send code',
    sending: 'Verifying…',
    resendIn: s => `${s}s`,
    submitLogin: 'Sign in / Register',
    submitPwdLogin: 'Sign in',
    submitReset: 'Reset password & sign in',
    submitting: 'Please wait…',
    forgotPwd: 'Forgot password?',
    backToLogin: '← Back to sign in',
    codeSent: 'Verification code sent. Check your inbox (valid for 5 min).',
    resetCodeSent: 'Password reset code sent. Check your inbox (valid for 5 min).',
    captchaFailed: 'StarLock verification did not complete. Please try again.',
    profileTitle: 'Account & Profile',
    uploadAvatar: 'Upload avatar',
    resetAvatar: 'Reset',
    handleLabel: 'Unique ID (@handle)',
    handlePlaceholder: 'e.g. star_traveler',
    handleOk: 'Available',
    nickLabel: 'Nickname',
    nickPlaceholder: 'Display name (1–32 chars)',
    sigLabel: 'Bio / Signature',
    sigPlaceholder: 'One-line tagline (optional)',
    introLabel: 'About',
    introPlaceholder: 'A short introduction (optional)',
    save: 'Save changes',
    saving: 'Saving…',
    saved: 'Profile updated.',
    avatarSaved: 'Avatar updated.',
    pwdSectionSet: 'Set a login password',
    pwdSectionChange: 'Change password',
    pwdSaveBtn: 'Update password',
    pwdSaved: 'Password updated.',
    oauthSep: 'or continue with',
    oauthGitHub: 'GitHub',
    oauthGoogle: 'Google',
    oauthSection: 'Connected accounts',
    oauthBound: 'Connected',
    oauthBind: 'Connect',
    oauthUnbind: 'Disconnect',
    oauthBoundMsg: 'Third-party account connected.',
    oauthUnboundMsg: 'Third-party account disconnected.',
    oauthErrMap: {
      OAUTH_DENIED: 'Sign-in was cancelled.',
      OAUTH_STATE_MISSING: 'Sign-in session expired. Please try again.',
      OAUTH_STATE_INVALID: 'Sign-in session expired. Please try again.',
      OAUTH_STATE_MISMATCH: 'Sign-in verification failed. Please try again.',
      IDENTITY_ALREADY_BOUND: 'This third-party account is already linked to another StarDream account.',
      PROVIDER_ALREADY_BOUND: 'Your account already has a linked account on this platform.',
      PROVIDER_CONFLICT: 'The account with this email is already linked to a different profile on this platform.',
    },
    signOut: 'Sign out',
    signOutAll: 'Sign out all devices',
    netErr: 'Network error. Please try again.',
  } : {
    signIn: '登录',
    loginTitle: '登录星梦账号',
    tabCode: '邮箱验证码',
    tabPassword: '密码登录',
    loginSubCode: '输入邮箱获取 6 位验证码登录，首次登录自动创建统一账号；发信前需通过星锁人机验证。',
    loginSubPwd: '使用邮箱或唯一 @ID 与密码登录（已兼容老网站星梦启航原密码）。',
    resetTitle: '找回 / 重置密码',
    resetSub: '输入注册邮箱并通过星锁人机验证获取 6 位重置码，即可设置新密码并自动登录。',
    emailLabel: '邮箱地址',
    emailPlaceholder: 'you@example.com',
    identLabel: '邮箱或唯一 @ID',
    identPlaceholder: 'you@example.com 或 @handle',
    pwdLabel: '密码',
    pwdPlaceholder: '输入登录密码',
    newPwdLabel: '新密码（8~128 位）',
    newPwdPlaceholder: '至少 8 位字符',
    curPwdLabel: '当前密码',
    curPwdPlaceholder: '输入当前密码',
    codeLabel: '6 位邮箱验证码',
    codePlaceholder: '输入 6 位数字验证码',
    sendCode: '获取验证码',
    sending: '验证中…',
    resendIn: s => `${s}s 后重发`,
    submitLogin: '登录 / 注册',
    submitPwdLogin: '立即登录',
    submitReset: '重置密码并登录',
    submitting: '处理中…',
    forgotPwd: '忘记密码？',
    backToLogin: '← 返回登录',
    codeSent: '验证码已发送至邮箱（5 分钟内有效），请注意查收。',
    resetCodeSent: '重置密码验证码已发送至邮箱（5 分钟内有效），请注意查收。',
    captchaFailed: '星锁人机验证未完成，请重试。',
    profileTitle: '星梦账号资料',
    uploadAvatar: '上传头像',
    resetAvatar: '恢复默认',
    handleLabel: '唯一 ID（@handle）',
    handlePlaceholder: '3~24 位字母开头，如 star_traveler',
    handleOk: '该唯一 ID 可用',
    nickLabel: '昵称',
    nickPlaceholder: '显示昵称（1~32 字）',
    sigLabel: '个性签名',
    sigPlaceholder: '一句话介绍自己（选填）',
    introLabel: '个人简介',
    introPlaceholder: '更多介绍（选填）',
    save: '保存资料',
    saving: '保存中…',
    saved: '资料已保存。',
    avatarSaved: '头像已更新。',
    pwdSectionSet: '设置登录密码',
    pwdSectionChange: '修改登录密码',
    pwdSaveBtn: '保存密码',
    pwdSaved: '密码已更新。',
    oauthSep: '或使用以下方式登录',
    oauthGitHub: 'GitHub 登录',
    oauthGoogle: 'Google 登录',
    oauthSection: '第三方账号绑定',
    oauthBound: '已绑定',
    oauthBind: '绑定',
    oauthUnbind: '解绑',
    oauthBoundMsg: '第三方账号绑定成功。',
    oauthUnboundMsg: '已解除第三方账号绑定。',
    oauthErrMap: {
      OAUTH_DENIED: '已取消第三方授权登录。',
      OAUTH_STATE_MISSING: '授权状态已过期，请重新点击登录。',
      OAUTH_STATE_INVALID: '授权状态已过期，请重新点击登录。',
      OAUTH_STATE_MISMATCH: '授权校验未通过，请重试。',
      IDENTITY_ALREADY_BOUND: '该第三方账号已绑定其他星梦账号。',
      PROVIDER_ALREADY_BOUND: '当前账号已绑定该平台，请先解绑。',
      PROVIDER_CONFLICT: '该邮箱对应的星梦账号已绑定另一个同平台账号，请先用邮箱登录后管理绑定。',
    },
    signOut: '退出登录',
    signOutAll: '退出全部设备',
    netErr: '网络请求失败，请稍后重试。',
  };

  let currentUser = null;
  let oauthProviders = { github: false, google: false };
  let cooldownTimer = 0;
  let cooldownLeft = 0;
  let sdkLoadedPromise = null;
  let starlockWidget = null;
  let handleCheckTimer = 0;

  const GITHUB_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.88-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85 0 1.7.12 2.5.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z"/></svg>';
  const GOOGLE_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.64v3.02h3.88c2.27-2.09 3.54-5.17 3.54-8.9Z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.94-2.91l-3.88-3.02c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.72-4.96H1.27v3.12A12 12 0 0 0 12 24Z"/><path fill="#FBBC05" d="M5.28 14.26A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.56.38-2.26V6.62H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.38l4.01-3.12Z"/><path fill="#EA4335" d="M12 4.78c1.76 0 3.34.61 4.58 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.62l4.01 3.12C6.23 6.89 8.88 4.78 12 4.78Z"/></svg>';

  function oauthStartURL(provider, mode = 'login') {
    const ret = encodeURIComponent(window.location.origin + window.location.pathname);
    return `${API_BASE}/v1/auth/oauth/${provider}/start?mode=${mode}&return_to=${ret}`;
  }

  const navLinks = document.querySelector('.nav-links');
  if (!navLinks) return;

  const navBtn = document.createElement('button');
  navBtn.type = 'button';
  navBtn.className = 'nav-auth-btn';
  navBtn.setAttribute('aria-haspopup', 'dialog');
  navLinks.appendChild(navBtn);

  const dialog = document.createElement('dialog');
  dialog.className = 'sdt-auth-dialog';
  dialog.setAttribute('aria-modal', 'true');
  document.body.appendChild(dialog);

  const captchaSlot = document.createElement('div');
  captchaSlot.className = 'sdt-captcha-slot';
  captchaSlot.id = 'sdt-starlock-slot';
  document.body.appendChild(captchaSlot);

  function esc(str) {
    return String(str ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function initials(u) {
    const s = (u?.nickname || u?.handle || u?.email || 'S').trim();
    return [...s][0]?.toUpperCase() || 'S';
  }
  function renderNav() {
    if (!currentUser) {
      navBtn.classList.remove('is-authed');
      navBtn.innerHTML = `<span>${esc(T.signIn)}</span>`;
      navBtn.setAttribute('aria-label', T.signIn);
      return;
    }
    navBtn.classList.add('is-authed');
    const av = currentUser.avatar_url
      ? `<img src="${esc(currentUser.avatar_url)}" alt="">`
      : esc(initials(currentUser));
    navBtn.innerHTML = `<span class="nav-auth-avatar">${av}</span><span class="nav-auth-name">${esc(currentUser.nickname || currentUser.handle)}</span>`;
    navBtn.setAttribute('aria-label', T.profileTitle);
  }

  async function api(path, opts = {}) {
    const res = await fetch(API_BASE + path, { credentials: 'include', ...opts });
    let data = {};
    try { data = await res.json(); } catch {}
    if (!res.ok) {
      const err = new Error(data.message || T.netErr);
      err.code = data.error_code || 'HTTP_ERROR';
      throw err;
    }
    return data;
  }

  function loadStarLockSDK(url) {
    if (window.StarLock) return Promise.resolve();
    if (sdkLoadedPromise) return sdkLoadedPromise;
    sdkLoadedPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = url;
      s.async = true;
      s.onload = () => window.StarLock ? resolve() : reject(new Error('StarLock SDK unavailable'));
      s.onerror = () => { sdkLoadedPromise = null; reject(new Error(T.captchaFailed)); };
      document.head.appendChild(s);
    });
    return sdkLoadedPromise;
  }

  function showMsg(el, text, isErr) {
    if (!el) return;
    el.textContent = text || '';
    el.className = 'sdt-msg' + (text ? (' is-show ' + (isErr ? 'is-err' : 'is-ok')) : '');
  }

  // Shared StarLock-protected email code sender (used by both login code & forgot-password reset code)
  async function runStarLockAndSend({ email, endpoint, sendBtn, msgEl, successText, onFocusCode }) {
    showMsg(msgEl, '', false);
    sendBtn.disabled = true;
    sendBtn.textContent = T.sending;
    const syncBtn = () => {
      if (!document.body.contains(sendBtn)) return;
      if (cooldownLeft > 0) {
        sendBtn.disabled = true;
        sendBtn.textContent = T.resendIn(cooldownLeft);
      } else {
        sendBtn.disabled = false;
        sendBtn.textContent = T.sendCode;
      }
    };
    try {
      const cap = await api('/v1/auth/captcha/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      await loadStarLockSDK(cap.sdk_url);
      if (starlockWidget && typeof starlockWidget.destroy === 'function') {
        try { starlockWidget.destroy(); } catch {}
      }
      await new Promise((resolve, reject) => {
        let settled = false;
        const finish = fn => v => { if (!settled) { settled = true; fn(v); } };
        starlockWidget = window.StarLock.render('#sdt-starlock-slot', {
          siteKey: cap.site_key,
          sessionTicket: cap.session_ticket,
          displayMode: 'invisible',
          onSuccess: finish(async ({ token }) => {
            try {
              const res = await api(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email,
                  challenge_nonce: cap.challenge_nonce,
                  starlock_token: token,
                  lang: isEn ? 'en' : 'zh-CN',
                }),
              });
              cooldownLeft = res.cooldown_seconds || 60;
              clearInterval(cooldownTimer);
              cooldownTimer = setInterval(() => {
                cooldownLeft = Math.max(0, cooldownLeft - 1);
                if (cooldownLeft === 0) clearInterval(cooldownTimer);
                syncBtn();
              }, 1000);
              syncBtn();
              showMsg(msgEl, successText, false);
              if (onFocusCode) onFocusCode();
              resolve();
            } catch (e) { reject(e); }
          }),
          onClose: finish(() => reject(new Error(T.captchaFailed))),
          onError: finish(() => reject(new Error(T.captchaFailed))),
          onExpire: finish(() => reject(new Error(T.captchaFailed))),
        });
        starlockWidget.execute();
      });
    } catch (err) {
      showMsg(msgEl, err.message || T.netErr, true);
      syncBtn();
    }
  }

  function openLoginModal(mode = 'code', prefillEmail = '') {
    if (mode === 'reset') { openResetPasswordModal(prefillEmail); return; }
    const isPwd = mode === 'password';
    dialog.innerHTML = `
      <div class="sdt-modal-head">
        <h3 class="sdt-modal-title">${esc(T.loginTitle)}</h3>
        <button type="button" class="sdt-modal-close" aria-label="Close">×</button>
      </div>
      <form class="sdt-modal-body" id="sdt-login-form" novalidate>
        <div class="sdt-tabs" role="tablist">
          <button type="button" class="sdt-tab ${!isPwd ? 'is-active' : ''}" data-tab="code">${esc(T.tabCode)}</button>
          <button type="button" class="sdt-tab ${isPwd ? 'is-active' : ''}" data-tab="password">${esc(T.tabPassword)}</button>
        </div>
        <p class="sdt-modal-sub">${esc(isPwd ? T.loginSubPwd : T.loginSubCode)}</p>
        ${isPwd ? `
          <div class="sdt-field">
            <label for="sdt-ident">${esc(T.identLabel)}</label>
            <input id="sdt-ident" class="sdt-input" type="text" autocomplete="username" value="${esc(prefillEmail)}" placeholder="${esc(T.identPlaceholder)}" required>
          </div>
          <div class="sdt-field">
            <label for="sdt-pwd">
              <span>${esc(T.pwdLabel)}</span>
              <button type="button" class="sdt-text-btn" id="sdt-forgot-btn">${esc(T.forgotPwd)}</button>
            </label>
            <input id="sdt-pwd" class="sdt-input" type="password" autocomplete="current-password" placeholder="${esc(T.pwdPlaceholder)}" required>
          </div>
        ` : `
          <div class="sdt-field">
            <label for="sdt-email">${esc(T.emailLabel)}</label>
            <input id="sdt-email" class="sdt-input" type="email" autocomplete="email" value="${esc(prefillEmail)}" placeholder="${esc(T.emailPlaceholder)}" required>
          </div>
          <div class="sdt-field">
            <label for="sdt-code">${esc(T.codeLabel)}</label>
            <div class="sdt-row">
              <input id="sdt-code" class="sdt-input" type="text" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="${esc(T.codePlaceholder)}">
              <button type="button" class="sdt-btn" id="sdt-send-btn">${esc(T.sendCode)}</button>
            </div>
          </div>
        `}
        <div class="sdt-msg" id="sdt-login-msg" role="status"></div>
        <button type="submit" class="sdt-btn sdt-btn-primary" id="sdt-login-submit">${esc(isPwd ? T.submitPwdLogin : T.submitLogin)}</button>
        ${!isPwd ? `<div class="sdt-link-row"><span></span><button type="button" class="sdt-text-btn" id="sdt-forgot-btn">${esc(T.forgotPwd)}</button></div>` : ''}
        ${(oauthProviders.github || oauthProviders.google) ? `
          <div class="sdt-oauth-sep">${esc(T.oauthSep)}</div>
          <div class="sdt-oauth-grid">
            ${oauthProviders.github ? `<a class="sdt-oauth-btn" href="${esc(oauthStartURL('github'))}">${GITHUB_SVG}<span>${esc(T.oauthGitHub)}</span></a>` : ''}
            ${oauthProviders.google ? `<a class="sdt-oauth-btn" href="${esc(oauthStartURL('google'))}">${GOOGLE_SVG}<span>${esc(T.oauthGoogle)}</span></a>` : ''}
          </div>
        ` : ''}
      </form>`;

    dialog.querySelector('.sdt-modal-close').addEventListener('click', () => dialog.close());
    dialog.querySelectorAll('.sdt-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const cur = (dialog.querySelector('#sdt-email') || dialog.querySelector('#sdt-ident'))?.value?.trim() || '';
        openLoginModal(tab.dataset.tab, cur);
      });
    });

    const msgEl = dialog.querySelector('#sdt-login-msg');
    const submitBtn = dialog.querySelector('#sdt-login-submit');
    const forgotBtn = dialog.querySelector('#sdt-forgot-btn');
    if (forgotBtn) {
      forgotBtn.addEventListener('click', () => {
        const cur = (dialog.querySelector('#sdt-email') || dialog.querySelector('#sdt-ident'))?.value?.trim() || '';
        openResetPasswordModal(cur.includes('@') && !cur.startsWith('@') ? cur : '');
      });
    }

    if (!isPwd) {
      const emailInput = dialog.querySelector('#sdt-email');
      const codeInput = dialog.querySelector('#sdt-code');
      const sendBtn = dialog.querySelector('#sdt-send-btn');
      if (cooldownLeft > 0) { sendBtn.disabled = true; sendBtn.textContent = T.resendIn(cooldownLeft); }
      sendBtn.addEventListener('click', () => {
        const email = emailInput.value.trim();
        if (!email) { emailInput.focus(); return; }
        runStarLockAndSend({
          email,
          endpoint: '/v1/auth/email/send-code',
          sendBtn,
          msgEl,
          successText: T.codeSent,
          onFocusCode: () => codeInput.focus(),
        });
      });

      dialog.querySelector('#sdt-login-form').addEventListener('submit', async e => {
        e.preventDefault();
        const email = emailInput.value.trim();
        const code = codeInput.value.trim();
        if (!email || !code) return;
        showMsg(msgEl, '', false);
        submitBtn.disabled = true;
        submitBtn.textContent = T.submitting;
        try {
          const res = await api('/v1/auth/email/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code }),
          });
          currentUser = res.user;
          renderNav();
          if (res.is_new_user) openProfileModal();
          else dialog.close();
        } catch (err) {
          showMsg(msgEl, err.message || T.netErr, true);
          submitBtn.disabled = false;
          submitBtn.textContent = T.submitLogin;
        }
      });
      if (!dialog.open) dialog.showModal();
      emailInput.focus();
    } else {
      const identInput = dialog.querySelector('#sdt-ident');
      const pwdInput = dialog.querySelector('#sdt-pwd');
      dialog.querySelector('#sdt-login-form').addEventListener('submit', async e => {
        e.preventDefault();
        const identifier = identInput.value.trim();
        const password = pwdInput.value;
        if (!identifier || !password) return;
        showMsg(msgEl, '', false);
        submitBtn.disabled = true;
        submitBtn.textContent = T.submitting;
        try {
          const res = await api('/v1/auth/password/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier, password }),
          });
          currentUser = res.user;
          renderNav();
          dialog.close();
        } catch (err) {
          showMsg(msgEl, err.message || T.netErr, true);
          submitBtn.disabled = false;
          submitBtn.textContent = T.submitPwdLogin;
        }
      });
      if (!dialog.open) dialog.showModal();
      identInput.focus();
    }
  }

  function openResetPasswordModal(prefillEmail = '') {
    dialog.innerHTML = `
      <div class="sdt-modal-head">
        <h3 class="sdt-modal-title">${esc(T.resetTitle)}</h3>
        <button type="button" class="sdt-modal-close" aria-label="Close">×</button>
      </div>
      <form class="sdt-modal-body" id="sdt-reset-form" novalidate>
        <p class="sdt-modal-sub">${esc(T.resetSub)}</p>
        <div class="sdt-field">
          <label for="sdt-reset-email">${esc(T.emailLabel)}</label>
          <input id="sdt-reset-email" class="sdt-input" type="email" autocomplete="email" value="${esc(prefillEmail)}" placeholder="${esc(T.emailPlaceholder)}" required>
        </div>
        <div class="sdt-field">
          <label for="sdt-reset-code">${esc(T.codeLabel)}</label>
          <div class="sdt-row">
            <input id="sdt-reset-code" class="sdt-input" type="text" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="${esc(T.codePlaceholder)}">
            <button type="button" class="sdt-btn" id="sdt-reset-send-btn">${esc(T.sendCode)}</button>
          </div>
        </div>
        <div class="sdt-field">
          <label for="sdt-reset-pwd">${esc(T.newPwdLabel)}</label>
          <input id="sdt-reset-pwd" class="sdt-input" type="password" autocomplete="new-password" minlength="8" maxlength="128" placeholder="${esc(T.newPwdPlaceholder)}" required>
        </div>
        <div class="sdt-msg" id="sdt-reset-msg" role="status"></div>
        <button type="submit" class="sdt-btn sdt-btn-primary" id="sdt-reset-submit">${esc(T.submitReset)}</button>
        <div class="sdt-link-row">
          <button type="button" class="sdt-text-btn" id="sdt-back-login">${esc(T.backToLogin)}</button>
        </div>
      </form>`;

    const emailInput = dialog.querySelector('#sdt-reset-email');
    const codeInput = dialog.querySelector('#sdt-reset-code');
    const pwdInput = dialog.querySelector('#sdt-reset-pwd');
    const sendBtn = dialog.querySelector('#sdt-reset-send-btn');
    const submitBtn = dialog.querySelector('#sdt-reset-submit');
    const msgEl = dialog.querySelector('#sdt-reset-msg');

    dialog.querySelector('.sdt-modal-close').addEventListener('click', () => dialog.close());
    dialog.querySelector('#sdt-back-login').addEventListener('click', () => openLoginModal('password', emailInput.value.trim()));
    if (cooldownLeft > 0) { sendBtn.disabled = true; sendBtn.textContent = T.resendIn(cooldownLeft); }

    sendBtn.addEventListener('click', () => {
      const email = emailInput.value.trim();
      if (!email) { emailInput.focus(); return; }
      runStarLockAndSend({
        email,
        endpoint: '/v1/auth/password/reset/send-code',
        sendBtn,
        msgEl,
        successText: T.resetCodeSent,
        onFocusCode: () => codeInput.focus(),
      });
    });

    dialog.querySelector('#sdt-reset-form').addEventListener('submit', async e => {
      e.preventDefault();
      const email = emailInput.value.trim();
      const code = codeInput.value.trim();
      const new_password = pwdInput.value;
      if (!email || !code || !new_password) return;
      showMsg(msgEl, '', false);
      submitBtn.disabled = true;
      submitBtn.textContent = T.submitting;
      try {
        const res = await api('/v1/auth/password/reset/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, code, new_password }),
        });
        currentUser = res.user;
        renderNav();
        dialog.close();
      } catch (err) {
        showMsg(msgEl, err.message || T.netErr, true);
        submitBtn.disabled = false;
        submitBtn.textContent = T.submitReset;
      }
    });

    if (!dialog.open) dialog.showModal();
    emailInput.focus();
  }

  function openProfileModal(activeTab = 'profile') {
    if (!currentUser) { openLoginModal(); return; }
    const u = currentUser;
    const av = u.avatar_url ? `<img src="${esc(u.avatar_url)}" alt="">` : esc(initials(u));
    const vipBadge = u.vip_tier && u.vip_tier !== 'none' ? `<span class="sdt-badge">${esc(u.vip_tier.toUpperCase())}</span>` : '';
    const roleBadge = u.role && u.role !== 'user' ? `<span class="sdt-badge">${esc(u.role.toUpperCase())}</span>` : '';

    dialog.innerHTML = `
      <div class="sdt-modal-head">
        <h3 class="sdt-modal-title">${esc(T.profileTitle)}</h3>
        <button type="button" class="sdt-modal-close" aria-label="Close">×</button>
      </div>
      <div style="padding:12px 22px 0">
        <div class="sdt-tabs sdt-tabs-4">
          <button type="button" class="sdt-tab ${activeTab==='profile'?'is-active':''}" data-ptab="profile">${isEn?'Profile':'基本资料'}</button>
          <button type="button" class="sdt-tab ${activeTab==='points'?'is-active':''}" data-ptab="points">${isEn?'Points':'积分钱包'}</button>
          <button type="button" class="sdt-tab ${activeTab==='security'?'is-active':''}" data-ptab="security">${isEn?'Security':'账号安全'}</button>
          <button type="button" class="sdt-tab ${activeTab==='prefs'?'is-active':''}" data-ptab="prefs">${isEn?'Prefs':'偏好设置'}</button>
        </div>
      </div>
      <div class="sdt-modal-body" id="sdt-profile-body">
        <div class="sdt-msg" id="sdt-profile-msg" role="status"></div>

        ${activeTab === 'profile' ? `
          <div class="sdt-profile-hero">
            <div class="sdt-avatar-lg" id="sdt-avatar-preview">${av}</div>
            <div class="sdt-profile-meta">
              <div class="sdt-meta-badges">
                <span class="sdt-badge">UID #${esc(u.id)}</span>
                ${roleBadge}${vipBadge}
              </div>
              <div class="sdt-meta-line">${esc(u.email || '@' + u.handle)}</div>
              <div class="sdt-avatar-actions">
                <button type="button" class="sdt-btn sdt-btn-sm" id="sdt-avatar-upload-btn">${esc(T.uploadAvatar)}</button>
                ${u.avatar_url ? `<button type="button" class="sdt-btn sdt-btn-sm" id="sdt-avatar-reset-btn">${esc(T.resetAvatar)}</button>` : ''}
                <input type="file" id="sdt-avatar-file" accept="image/png,image/jpeg" hidden>
              </div>
            </div>
          </div>
          <form id="sdt-profile-form" style="display:flex;flex-direction:column;gap:12px" novalidate>
            <div class="sdt-field">
              <label for="sdt-handle"><span>${esc(T.handleLabel)}</span></label>
              <input id="sdt-handle" class="sdt-input" type="text" maxlength="24" value="${esc(u.handle)}" placeholder="${esc(T.handlePlaceholder)}" required>
              <div class="sdt-handle-hint" id="sdt-handle-hint"></div>
            </div>
            <div class="sdt-field">
              <label for="sdt-nick">${esc(T.nickLabel)}</label>
              <input id="sdt-nick" class="sdt-input" type="text" maxlength="32" value="${esc(u.nickname)}" placeholder="${esc(T.nickPlaceholder)}" required>
            </div>
            <div class="sdt-field">
              <label for="sdt-sig">${esc(T.sigLabel)}</label>
              <input id="sdt-sig" class="sdt-input" type="text" maxlength="120" value="${esc(u.signature || '')}" placeholder="${esc(T.sigPlaceholder)}">
            </div>
            <div class="sdt-field">
              <label for="sdt-intro">${esc(T.introLabel)}</label>
              <textarea id="sdt-intro" class="sdt-textarea" maxlength="400" placeholder="${esc(T.introPlaceholder)}">${esc(u.introduction || '')}</textarea>
            </div>
            <button type="submit" class="sdt-btn sdt-btn-primary" id="sdt-save-btn">${esc(T.save)}</button>
          </form>
        ` : activeTab === 'points' ? `
          <div class="sdt-points-card">
            <div>
              <div style="font-size:12px;color:var(--sdt-ink2)">${isEn?'StarDream Unified Points':'星梦通用积分（全站通用）'}</div>
              <div class="sdt-points-val" id="sdt-pts-balance">…</div>
              <div style="font-size:11.5px;color:var(--sdt-ink2);margin-top:4px" id="sdt-pts-sub">可用于星梦中转站、星锁 Cloud、爬虫百战成神等全生态服务</div>
            </div>
            <button type="button" class="sdt-btn sdt-btn-primary sdt-btn-sm" id="sdt-checkin-btn" disabled>加载中…</button>
          </div>
          <div style="font-size:12.5px;font-weight:600;color:var(--sdt-ink2)">最近积分明细</div>
          <div class="sdt-tx-list" id="sdt-tx-list"><div style="color:var(--sdt-ink2);font-size:12.5px">加载明细中…</div></div>
        ` : activeTab === 'security' ? `
          <div class="sdt-pwd-box" id="sdt-ident-box">
            <div style="font-size:13.5px;font-weight:600;margin-bottom:10px">${esc(T.oauthSection)}</div>
            <div class="sdt-ident-list" id="sdt-ident-list"><div style="color:var(--sdt-ink2);font-size:12.5px">加载中…</div></div>
          </div>
          <div class="sdt-pwd-box">
            <div style="font-size:13.5px;font-weight:600;margin-bottom:10px">${esc(u.has_password ? T.pwdSectionChange : T.pwdSectionSet)}</div>
            <div class="sdt-pwd-inner">
              ${u.has_password ? `
                <div class="sdt-field">
                  <label for="sdt-cur-pwd">${esc(T.curPwdLabel)}</label>
                  <input id="sdt-cur-pwd" class="sdt-input" type="password" autocomplete="current-password" placeholder="${esc(T.curPwdPlaceholder)}">
                </div>
              ` : ''}
              <div class="sdt-field">
                <label for="sdt-new-pwd">${esc(T.newPwdLabel)}</label>
                <input id="sdt-new-pwd" class="sdt-input" type="password" autocomplete="new-password" minlength="8" maxlength="128" placeholder="${esc(T.newPwdPlaceholder)}">
              </div>
              <button type="button" class="sdt-btn sdt-btn-primary sdt-btn-sm" id="sdt-pwd-save-btn">${esc(T.pwdSaveBtn)}</button>
            </div>
          </div>
          <div class="sdt-footer-actions">
            <button type="button" class="sdt-btn sdt-btn-sm sdt-btn-danger" id="sdt-logout-btn">${esc(T.signOut)}</button>
            <button type="button" class="sdt-btn sdt-btn-sm sdt-btn-danger" id="sdt-logout-all-btn">${esc(T.signOutAll)}</button>
          </div>
        ` : `
          <div class="sdt-pref-card">
            <div>
              <div style="font-weight:600;font-size:13.5px">${isEn?'18+ Adult Content':'18+ 成人内容显示'}</div>
              <div style="font-size:12px;color:var(--sdt-ink2);margin-top:3px">${isEn?'Hidden by default. Only enable if you are 18+.':'默认隐藏。勾选确认已年满 18 周岁后，将在星梦启航导航中显示 18+ 分类站点。'}</div>
            </div>
            <input id="sdt-show-nsfw" type="checkbox" ${u.show_nsfw ? 'checked' : ''} style="width:18px;height:18px;margin-top:2px;cursor:pointer;flex-shrink:0">
          </div>
          <button type="button" class="sdt-btn sdt-btn-primary" id="sdt-pref-save-btn">${isEn?'Save Preferences':'保存偏好设置'}</button>
        `}
      </div>`;

    const msgEl = dialog.querySelector('#sdt-profile-msg');
    dialog.querySelector('.sdt-modal-close').addEventListener('click', () => dialog.close());
    dialog.querySelectorAll('[data-ptab]').forEach(btn => {
      btn.addEventListener('click', () => openProfileModal(btn.dataset.ptab));
    });

    if (activeTab === 'profile') {
      const handleInput = dialog.querySelector('#sdt-handle');
      const handleHint = dialog.querySelector('#sdt-handle-hint');
      const fileInput = dialog.querySelector('#sdt-avatar-file');
      const uploadBtn = dialog.querySelector('#sdt-avatar-upload-btn');
      const resetBtn = dialog.querySelector('#sdt-avatar-reset-btn');
      const saveBtn = dialog.querySelector('#sdt-save-btn');

      handleInput.addEventListener('input', () => {
        clearTimeout(handleCheckTimer);
        const val = handleInput.value.trim();
        if (!val || val.toLowerCase() === currentUser.handle.toLowerCase()) {
          handleHint.textContent = ''; handleHint.className = 'sdt-handle-hint'; return;
        }
        handleCheckTimer = setTimeout(async () => {
          try {
            const r = await api('/v1/users/handle-available?handle=' + encodeURIComponent(val));
            handleHint.textContent = r.available ? T.handleOk : (r.reason || '');
            handleHint.className = 'sdt-handle-hint ' + (r.available ? 'is-ok' : 'is-err');
          } catch {}
        }, 350);
      });

      uploadBtn.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', async () => {
        const f = fileInput.files?.[0];
        if (!f) return;
        showMsg(msgEl, '', false); uploadBtn.disabled = true;
        try {
          const fd = new FormData(); fd.append('file', f);
          const res = await api('/v1/me/avatar', { method: 'POST', body: fd });
          currentUser = res.user; renderNav(); openProfileModal('profile');
          showMsg(dialog.querySelector('#sdt-profile-msg'), T.avatarSaved, false);
        } catch (err) { showMsg(msgEl, err.message || T.netErr, true); uploadBtn.disabled = false; }
      });

      if (resetBtn) {
        resetBtn.addEventListener('click', async () => {
          resetBtn.disabled = true;
          try {
            const res = await api('/v1/me/avatar', { method: 'DELETE' });
            currentUser = res.user; renderNav(); openProfileModal('profile');
          } catch (err) { showMsg(msgEl, err.message || T.netErr, true); resetBtn.disabled = false; }
        });
      }

      dialog.querySelector('#sdt-profile-form').addEventListener('submit', async e => {
        e.preventDefault();
        showMsg(msgEl, '', false); saveBtn.disabled = true; saveBtn.textContent = T.saving;
        try {
          const res = await api('/v1/me', {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              handle: handleInput.value.trim(),
              nickname: dialog.querySelector('#sdt-nick').value.trim(),
              signature: dialog.querySelector('#sdt-sig').value.trim(),
              introduction: dialog.querySelector('#sdt-intro').value.trim(),
            }),
          });
          currentUser = res.user; renderNav();
          showMsg(msgEl, T.saved, false);
        } catch (err) { showMsg(msgEl, err.message || T.netErr, true); }
        finally { saveBtn.disabled = false; saveBtn.textContent = T.save; }
      });
    }

    if (activeTab === 'points') {
      const balEl = dialog.querySelector('#sdt-pts-balance');
      const subEl = dialog.querySelector('#sdt-pts-sub');
      const chkBtn = dialog.querySelector('#sdt-checkin-btn');
      const txEl = dialog.querySelector('#sdt-tx-list');
      async function loadPoints() {
        try {
          const p = await api('/v1/points/me');
          balEl.textContent = `${p.balance} 积分`;
          subEl.textContent = `累计获得 ${p.total_earned} · 累计消耗 ${p.total_spent} · 全站通用`;
          chkBtn.disabled = !!p.checked_in_today;
          chkBtn.textContent = p.checked_in_today ? '✓ 今日已签到' : `每日签到 +${p.daily_reward || 10}`;
          const txs = p.transactions || [];
          txEl.innerHTML = txs.length ? txs.map(t => `
            <div class="sdt-tx-row">
              <div><div style="font-weight:500">${esc(t.note || t.source)}</div><div style="font-size:11px;color:var(--sdt-ink2)">${new Date(t.created_at).toLocaleString('zh-CN',{hour12:false})}</div></div>
              <div style="font-weight:700;color:${t.delta>=0?'#22c55e':'#f87171'}">${t.delta>=0?'+':''}${t.delta}</div>
            </div>
          `).join('') : '<div style="color:var(--sdt-ink2);font-size:12.5px">暂无积分记录，点右上角每日签到领取首批积分吧！</div>';
        } catch (err) {
          balEl.textContent = '0 积分';
          txEl.innerHTML = `<div style="color:var(--sdt-ink2);font-size:12.5px">${esc(err.message || '加载失败')}</div>`;
        }
      }
      chkBtn.addEventListener('click', async () => {
        chkBtn.disabled = true; showMsg(msgEl, '', false);
        try {
          const r = await api('/v1/points/checkin', { method: 'POST' });
          showMsg(msgEl, `签到成功！获得 +${r.reward} 星梦积分`, false);
          loadPoints();
        } catch (err) { showMsg(msgEl, err.message || T.netErr, true); loadPoints(); }
      });
      loadPoints();
    }

    if (activeTab === 'security') {
      const pwdSaveBtn = dialog.querySelector('#sdt-pwd-save-btn');
      pwdSaveBtn.addEventListener('click', async () => {
        const curPwd = dialog.querySelector('#sdt-cur-pwd')?.value || '';
        const newPwd = dialog.querySelector('#sdt-new-pwd')?.value || '';
        if (!newPwd) return;
        showMsg(msgEl, '', false); pwdSaveBtn.disabled = true;
        try {
          const res = await api('/v1/me/password', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ current_password: curPwd, new_password: newPwd }),
          });
          currentUser = res.user; openProfileModal('security');
          showMsg(dialog.querySelector('#sdt-profile-msg'), T.pwdSaved, false);
        } catch (err) { showMsg(msgEl, err.message || T.netErr, true); pwdSaveBtn.disabled = false; }
      });

      async function doLogout(endpoint) {
        try { await api(endpoint, { method: 'POST' }); } catch {}
        currentUser = null; renderNav(); dialog.close();
        window.dispatchEvent(new CustomEvent('sdt:profile-updated', { detail: null }));
      }
      dialog.querySelector('#sdt-logout-btn').addEventListener('click', () => doLogout('/v1/auth/logout'));
      dialog.querySelector('#sdt-logout-all-btn').addEventListener('click', () => doLogout('/v1/auth/logout-all'));

      const identListEl = dialog.querySelector('#sdt-ident-list');
      api('/v1/me/identities').then(res => {
        const bound = new Set((res.identities || []).map(x => x.provider));
        const rows = [
          { id: 'github', label: 'GitHub', icon: GITHUB_SVG, enabled: oauthProviders.github },
          { id: 'google', label: 'Google', icon: GOOGLE_SVG, enabled: oauthProviders.google },
        ].filter(p => bound.has(p.id) || p.enabled);
        if (!rows.length) { dialog.querySelector('#sdt-ident-box')?.remove(); return; }
        identListEl.innerHTML = rows.map(p => {
          const isBound = bound.has(p.id);
          return `<div class="sdt-ident-row">
            <span class="sdt-ident-name">${p.icon}<span>${p.label}</span>${isBound ? `<span class="sdt-badge sdt-badge-ok">${esc(T.oauthBound)}</span>` : ''}</span>
            ${isBound
              ? `<button type="button" class="sdt-btn sdt-btn-sm sdt-btn-danger" data-unbind="${p.id}">${esc(T.oauthUnbind)}</button>`
              : `<a class="sdt-btn sdt-btn-sm" href="${esc(oauthStartURL(p.id, 'bind'))}">${esc(T.oauthBind)}</a>`}
          </div>`;
        }).join('');
        identListEl.querySelectorAll('[data-unbind]').forEach(btn => {
          btn.addEventListener('click', async () => {
            btn.disabled = true; showMsg(msgEl, '', false);
            try {
              await api('/v1/me/identities/' + btn.dataset.unbind, { method: 'DELETE' });
              openProfileModal('security');
              showMsg(dialog.querySelector('#sdt-profile-msg'), T.oauthUnboundMsg, false);
            } catch (err) { showMsg(msgEl, err.message || T.netErr, true); btn.disabled = false; }
          });
        });
      }).catch(() => dialog.querySelector('#sdt-ident-box')?.remove());
    }

    if (activeTab === 'prefs') {
      const savePrefBtn = dialog.querySelector('#sdt-pref-save-btn');
      savePrefBtn.addEventListener('click', async () => {
        const nsfw = Boolean(dialog.querySelector('#sdt-show-nsfw')?.checked);
        showMsg(msgEl, '', false); savePrefBtn.disabled = true;
        try {
          const res = await api('/v1/me', {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ show_nsfw: nsfw }),
          });
          currentUser = res.user;
          showMsg(msgEl, T.saved, false);
          window.dispatchEvent(new CustomEvent('sdt:profile-updated', { detail: currentUser }));
        } catch (err) { showMsg(msgEl, err.message || T.netErr, true); }
        finally { savePrefBtn.disabled = false; }
      });
    }

    if (!dialog.open) dialog.showModal();
  }

  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  navBtn.addEventListener('click', () => currentUser ? openProfileModal() : openLoginModal());

  renderNav();
  const params = new URLSearchParams(window.location.search);
  const authStatus = params.get('auth');
  const authErr = params.get('auth_err');
  if (authStatus || authErr) {
    params.delete('auth');
    params.delete('auth_err');
    const qs = params.toString();
    history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : '') + window.location.hash);
  }

  Promise.all([
    api('/v1/auth/providers').then(p => { oauthProviders = { github: !!p.github, google: !!p.google }; }).catch(() => {}),
    api('/v1/me').then(res => { if (res && res.user) { currentUser = res.user; renderNav(); } }).catch(() => {}),
  ]).then(() => {
    if (authErr) {
      openLoginModal('code');
      showMsg(dialog.querySelector('#sdt-login-msg'), T.oauthErrMap[authErr] || T.netErr, true);
    } else if ((authStatus === 'new' || authStatus === 'bound') && currentUser) {
      openProfileModal();
      if (authStatus === 'bound') showMsg(dialog.querySelector('#sdt-profile-msg'), T.oauthBoundMsg, false);
    }
  });

  // Passive anonymized browser fingerprint collection (once per browser session, zero PII)
  try {
    if (!sessionStorage.getItem('sdt_fp_sent')) {
      sessionStorage.setItem('sdt_fp_sent', '1');
      let glRenderer = '';
      try {
        const cv = document.createElement('canvas');
        const gl = cv.getContext('webgl') || cv.getContext('experimental-webgl');
        const ext = gl && gl.getExtension('WEBGL_debug_renderer_info');
        if (ext) glRenderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || '';
      } catch {}
      fetch(API_BASE + '/v1/fingerprints/collect', {
        method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site: window.location.host + (window.location.pathname.startsWith('/blog') ? '/blog' : ''),
          js_signals: {
            screen: screen.width + 'x' + screen.height,
            dpr: window.devicePixelRatio || 1,
            tz: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
            langs: navigator.languages || [navigator.language],
            platform: navigator.platform || '',
            cores: navigator.hardwareConcurrency || 0,
            mem: navigator.deviceMemory || 0,
            touch: navigator.maxTouchPoints || 0,
            webdriver: Boolean(navigator.webdriver),
            webgl: glRenderer,
          },
        }),
      }).catch(() => {});
    }
  } catch {}
})();
