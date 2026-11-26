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
    signOut: '退出登录',
    signOutAll: '退出全部设备',
    netErr: '网络请求失败，请稍后重试。',
  };

  let currentUser = null;
  let cooldownTimer = 0;
  let cooldownLeft = 0;
  let sdkLoadedPromise = null;
  let starlockWidget = null;
  let handleCheckTimer = 0;

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

  function openProfileModal() {
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
      <form class="sdt-modal-body" id="sdt-profile-form" novalidate>
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
        <div class="sdt-msg" id="sdt-profile-msg" role="status"></div>
        <button type="submit" class="sdt-btn sdt-btn-primary" id="sdt-save-btn">${esc(T.save)}</button>
        <details class="sdt-pwd-box">
          <summary><span>${esc(u.has_password ? T.pwdSectionChange : T.pwdSectionSet)}</span><span>▾</span></summary>
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
            <button type="button" class="sdt-btn sdt-btn-sm" id="sdt-pwd-save-btn">${esc(T.pwdSaveBtn)}</button>
          </div>
        </details>
        <div class="sdt-footer-actions">
          <button type="button" class="sdt-btn sdt-btn-sm sdt-btn-danger" id="sdt-logout-btn">${esc(T.signOut)}</button>
          <button type="button" class="sdt-btn sdt-btn-sm sdt-btn-danger" id="sdt-logout-all-btn">${esc(T.signOutAll)}</button>
        </div>
      </form>`;

    const msgEl = dialog.querySelector('#sdt-profile-msg');
    const handleInput = dialog.querySelector('#sdt-handle');
    const handleHint = dialog.querySelector('#sdt-handle-hint');
    const fileInput = dialog.querySelector('#sdt-avatar-file');
    const uploadBtn = dialog.querySelector('#sdt-avatar-upload-btn');
    const resetBtn = dialog.querySelector('#sdt-avatar-reset-btn');
    const saveBtn = dialog.querySelector('#sdt-save-btn');
    const pwdSaveBtn = dialog.querySelector('#sdt-pwd-save-btn');

    dialog.querySelector('.sdt-modal-close').addEventListener('click', () => dialog.close());

    handleInput.addEventListener('input', () => {
      clearTimeout(handleCheckTimer);
      const val = handleInput.value.trim();
      if (!val || val.toLowerCase() === currentUser.handle.toLowerCase()) {
        handleHint.textContent = '';
        handleHint.className = 'sdt-handle-hint';
        return;
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
      showMsg(msgEl, '', false);
      uploadBtn.disabled = true;
      try {
        const fd = new FormData();
        fd.append('file', f);
        const res = await api('/v1/me/avatar', { method: 'POST', body: fd });
        currentUser = res.user;
        renderNav();
        openProfileModal();
        showMsg(dialog.querySelector('#sdt-profile-msg'), T.avatarSaved, false);
      } catch (err) {
        showMsg(msgEl, err.message || T.netErr, true);
        uploadBtn.disabled = false;
      }
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', async () => {
        resetBtn.disabled = true;
        try {
          const res = await api('/v1/me/avatar', { method: 'DELETE' });
          currentUser = res.user;
          renderNav();
          openProfileModal();
        } catch (err) {
          showMsg(msgEl, err.message || T.netErr, true);
          resetBtn.disabled = false;
        }
      });
    }

    pwdSaveBtn.addEventListener('click', async () => {
      const curPwd = dialog.querySelector('#sdt-cur-pwd')?.value || '';
      const newPwd = dialog.querySelector('#sdt-new-pwd')?.value || '';
      if (!newPwd) return;
      showMsg(msgEl, '', false);
      pwdSaveBtn.disabled = true;
      try {
        const res = await api('/v1/me/password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ current_password: curPwd, new_password: newPwd }),
        });
        currentUser = res.user;
        openProfileModal();
        showMsg(dialog.querySelector('#sdt-profile-msg'), T.pwdSaved, false);
      } catch (err) {
        showMsg(msgEl, err.message || T.netErr, true);
        pwdSaveBtn.disabled = false;
      }
    });

    dialog.querySelector('#sdt-profile-form').addEventListener('submit', async e => {
      e.preventDefault();
      showMsg(msgEl, '', false);
      saveBtn.disabled = true;
      saveBtn.textContent = T.saving;
      try {
        const res = await api('/v1/me', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            handle: handleInput.value.trim(),
            nickname: dialog.querySelector('#sdt-nick').value.trim(),
            signature: dialog.querySelector('#sdt-sig').value.trim(),
            introduction: dialog.querySelector('#sdt-intro').value.trim(),
          }),
        });
        currentUser = res.user;
        renderNav();
        showMsg(msgEl, T.saved, false);
      } catch (err) {
        showMsg(msgEl, err.message || T.netErr, true);
      } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = T.save;
      }
    });

    async function doLogout(endpoint) {
      try { await api(endpoint, { method: 'POST' }); } catch {}
      currentUser = null;
      renderNav();
      dialog.close();
    }
    dialog.querySelector('#sdt-logout-btn').addEventListener('click', () => doLogout('/v1/auth/logout'));
    dialog.querySelector('#sdt-logout-all-btn').addEventListener('click', () => doLogout('/v1/auth/logout-all'));

    if (!dialog.open) dialog.showModal();
  }

  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  navBtn.addEventListener('click', () => currentUser ? openProfileModal() : openLoginModal());

  renderNav();
  api('/v1/me').then(res => {
    if (res && res.user) { currentUser = res.user; renderNav(); }
  }).catch(() => {});
})();
