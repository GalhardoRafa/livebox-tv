/**
 * Ponte do Android: faz o papel do preload/main.js do Windows.
 * Expõe window.api (a mesma interface que a tela usa) em cima do objeto `Native`
 * que o MainActivity.java injeta na WebView, e roda a lógica compartilhada de src/core.js.
 */
const { createCore } = require('../../src/core');

(function () {
  const N = window.Native;
  document.body.classList.add('tv');

  // A tela foi desenhada para ~1280 px de largura; a WebView escala para a resolução da TV.
  const vp = document.querySelector('meta[name=viewport]');
  if (vp && window.innerWidth > 1500) vp.setAttribute('content', 'width=1280');

  const hint = document.querySelector('#miniHead span');
  if (hint) hint.textContent = '▲▼ escolhe · ◀▶ categoria · OK assiste · Voltar fecha';

  const log = (...a) => {
    try {
      N.log(a.map((x) => (x && x.message) || String(x)).join(' '));
    } catch (e) {}
  };

  const store = {
    readText(f) {
      try {
        const t = N.readFile(f);
        return t == null ? null : String(t);
      } catch (e) {
        return null;
      }
    },
    writeText(f, t) {
      N.writeFile(f, t);
    },
    readJson(f, d) {
      try {
        const t = store.readText(f);
        return t ? JSON.parse(t) : d;
      } catch (e) {
        return d;
      }
    },
    writeJson(f, v) {
      N.writeFile(f, JSON.stringify(v));
    },
  };

  const listeners = {};
  const send = (ch, data) => (listeners[ch] || []).slice().forEach((cb) => cb(data));
  const core = createCore({ store, send, log });

  const b64 = (buf) => {
    const u8 = new Uint8Array(buf);
    let s = '';
    for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
    return btoa(s);
  };

  window.api = {
    getSettings: async () => core.getSettings(),
    setSettings: async (p) => core.setSettings(p),
    loadPlaylist: () => core.loadPlaylist(),
    epgStart: () => core.epgStart(),
    getChecks: async () => core.checkGet(),
    checkRun: () => core.checkRun(),
    checkCancel: async () => core.checkCancel(),
    recOpen: async (name) => JSON.parse(N.recOpen(String(name || 'canal'))),
    recChunk: async (id, buf) => N.recChunk(id, b64(buf)),
    recClose: async (id) => N.recClose(id) || null,
    openRecordings: async () => {
      const toast = document.querySelector('#toast');
      if (toast) {
        toast.textContent = 'As gravações ficam em: ' + N.recDir();
        toast.hidden = false;
        setTimeout(() => (toast.hidden = true), 8000);
      }
    },
    backupSave: async (data) => N.saveBackup(JSON.stringify({ app: 'livebox', version: 1, savedAt: new Date().toISOString(), ...data }, null, 2)) || null,
    backupOpen: async () => {
      const t = N.readBackup();
      if (!t) return { error: 'Nenhum backup encontrado. Coloque o arquivo livebox-backup.json em: ' + N.backupDir() };
      try {
        const d = JSON.parse(t);
        return d.app === 'livebox' ? d : { error: 'Este arquivo não é um backup do LiveBox.' };
      } catch (e) {
        return { error: 'Não consegui ler o arquivo: ' + e.message };
      }
    },
    on(channel, cb) {
      (listeners[channel] = listeners[channel] || []).push(cb);
      return () => (listeners[channel] = listeners[channel].filter((f) => f !== cb));
    },
  };

  // WebView muito antiga: avisa em vez de mostrar tela quebrada.
  const m = /Chrome\/(\d+)/.exec(navigator.userAgent);
  if (m && +m[1] < 84) {
    window.addEventListener('load', () => {
      const d = document.createElement('div');
      d.style.cssText = 'position:fixed;left:0;right:0;bottom:0;padding:18px 28px;background:#7a1f1f;color:#fff;font:20px sans-serif;z-index:99999';
      d.textContent = `O WebView desta TV é antigo (Chrome ${m[1]}). Atualize "Android System WebView" na Play Store para o visual funcionar direito.`;
      document.body.appendChild(d);
    });
  }
  log('LiveBox TV iniciado. Chrome', m ? m[1] : '?', 'largura', window.innerWidth, 'dpr', window.devicePixelRatio);
})();
