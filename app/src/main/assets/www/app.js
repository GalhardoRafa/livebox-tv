(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const api = window.api;
  const esc = (s) => String(s != null ? s : "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const jget = (k, d) => {
    try {
      const v = JSON.parse(localStorage.getItem(k));
      return v != null ? v : d;
    } catch (e) {
      return d;
    }
  };
  const jset = (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {
    }
  };
  const norm = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const pad = (n) => String(n).padStart(2, "0");
  const fmtT = (ms) => {
    const d = new Date(ms);
    return pad(d.getHours()) + ":" + pad(d.getMinutes());
  };
  const fmtDur = (sec) => {
    sec = Math.max(0, Math.round(sec));
    const h = Math.floor(sec / 3600);
    const m = Math.floor(sec % 3600 / 60);
    const s = sec % 60;
    return (h ? h + ":" + pad(m) : m) + ":" + pad(s);
  };
  const isTV = () => document.body.classList.contains("tv");
  const initials = (n) => String(n).replace(/[^\p{L}\p{N} ]/gu, "").trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  function loadFavs() {
    const v = jget("lb.favlists", null);
    if (Array.isArray(v) && v.length) return v;
    return [{ id: "f1", name: "Favoritos", ids: jget("lb.fav", []) }];
  }
  const saveFavs = () => jset("lb.favlists", S.favs);
  const saveOv = () => jset("lb.ov", S.ov);
  const saveOrd = () => jset("lb.ord", S.ord);
  const video = $("#video");
  const stage = $("#stage");
  const S = {
    settings: {},
    raw: [],
    // todos os canais da lista
    all: [],
    // canais visíveis (sem grupos escondidos)
    list: [],
    // canais da visão atual
    byId: /* @__PURE__ */ new Map(),
    groups: [],
    epg: {},
    epgCount: 0,
    checks: {},
    info: null,
    favs: loadFavs(),
    // listas de favoritos: [{id, name, ids:[]}]
    ov: jget("lb.ov", {}),
    // por canal: { n: nome, h: 1 (oculto) }
    ord: jget("lb.ord", {}),
    // ordem manual por categoria
    sort: jget("lb.sort", "list"),
    prevId: null,
    base: [],
    mini: { open: false, i: 0, l: [], t: null, pick: null },
    dlgDone: null,
    view: "home",
    heroI: 0,
    heroItems: [],
    heroT: null,
    unlocked: false,
    unlockT: null,
    lists: [],
    arch: jget("lb.arch", {}),
    sleepAt: 0,
    mv: (() => {
      const v = jget("lb.mv", {});
      return { on: false, n: v.n === 4 ? 4 : 2, saved: (v.ids || []).filter(Boolean), tiles: [], active: 0 };
    })(),
    sched: jget("lb.sched", []).filter((it) => it && it.end + 12e4 > Date.now()),
    missed: 0,
    gOff: 0,
    alertCh: null,
    alertT: null,
    recent: jget("lb.recent", []),
    group: "__all",
    q: "",
    cur: null,
    order: [],
    idx: 0,
    gen: 0,
    hls: null,
    ts: null,
    startTimer: null,
    stallTimer: null,
    recovered: false,
    rec: null,
    numBuf: "",
    numTimer: null,
    checking: false,
    idleTimer: null
  };
  let toastTimer = null;
  function toast(msg, ms = 3500) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("on"), ms);
  }
  const setStatus = (t) => {
    if (!S.rec) $("#status").textContent = t || "";
  };
  function showMsg(html) {
    const m = $("#msg");
    m.innerHTML = html;
    m.hidden = false;
  }
  const hideMsg = () => $("#msg").hidden = true;
  const isDead = (c) => c.sources.every((s) => S.checks[s.url] && S.checks[s.url].ok === false);
  const curCh = () => S.mv.on ? (S.mv.tiles[S.mv.active] || {}).ch || null : S.cur;
  const isOn = (c) => S.mv.on ? S.mv.tiles.some((t) => t.ch && t.ch.id === c.id) : !!S.cur && S.cur.id === c.id;
  const dispName = (c) => S.ov[c.id] && S.ov[c.id].n || c.name;
  const isHid = (c) => !!(S.ov[c.id] && S.ov[c.id].h);
  const isFav = (id) => S.favs.some((f) => f.ids.includes(id));
  const favOf = (g) => S.favs.find((f) => "fav:" + f.id === g);
  const cleanOv = (id) => {
    if (S.ov[id] && !Object.keys(S.ov[id]).length) delete S.ov[id];
  };
  const lockedNames = () => new Set((S.settings.lockedGroups || []).map(norm));
  const pinOn = () => !!(S.settings.pin && S.settings.pin.hash);
  const isLockedGroup = (g) => pinOn() && lockedNames().has(norm(g));
  function applyHidden() {
    const hidden = new Set((S.settings.hiddenGroups || []).map(norm));
    const base0 = S.raw.filter((c) => !hidden.has(norm(c.group)));
    base0.forEach((c, i) => c.num = i + 1);
    S.lockedGroupsPresent = [...new Set(base0.filter((c) => isLockedGroup(c.group)).map((c) => c.group))];
    S.base = S.unlocked ? base0 : base0.filter((c) => !isLockedGroup(c.group));
    S.all = S.base.filter((c) => !isHid(c));
    S.byId = new Map(S.base.map((c) => [c.id, c]));
    const gm = /* @__PURE__ */ new Map();
    S.all.forEach((c) => gm.set(c.group, (gm.get(c.group) || 0) + 1));
    S.groups = [...gm].map(([name, count]) => ({ name, count }));
    const g = S.group;
    const fixed = ["__all", "__recent"].includes(g) || g === "__hidden" && S.base.some(isHid) || g.startsWith("fav:") && favOf(g);
    if (!fixed && !gm.has(g)) S.group = "__all";
  }
  function viewList() {
    const g = S.group;
    let l;
    if (g === "__all") l = S.all;
    else if (g === "__recent") return S.recent.map((id) => S.byId.get(id)).filter((c) => c && !isHid(c));
    else if (g === "__hidden") return S.base.filter(isHid);
    else if (g.startsWith("fav:")) {
      const f = favOf(g);
      return f ? f.ids.map((id) => S.byId.get(id)).filter((c) => c && !isHid(c)) : [];
    } else l = S.all.filter((c) => c.group === g);
    if (S.sort === "az") return l.slice().sort((a, b) => dispName(a).localeCompare(dispName(b), "pt", { sensitivity: "base", numeric: true }));
    const o = S.ord[g];
    if (o && o.length) {
      const pos = new Map(o.map((id, i) => [id, i]));
      const p = (c) => pos.has(c.id) ? pos.get(c.id) : 1e9 + c.num;
      return l.slice().sort((a, b) => p(a) - p(b));
    }
    return l;
  }
  function filtered() {
    let l = viewList();
    if (S.q) {
      const q = norm(S.q);
      l = l.filter((c) => norm(dispName(c)).includes(q) || norm(c.name).includes(q) || String(c.num) === S.q.trim());
    }
    if (S.settings.hideDead) l = l.filter((c) => !isDead(c));
    return l;
  }
  function progOf(ch, t = Date.now()) {
    const a = S.epg[ch.id];
    if (!a) return null;
    for (let i = 0; i < a.length; i++) if (a[i][0] <= t && t < a[i][1]) return { p: a[i], next: a[i + 1] || null };
    return null;
  }
  function rowNow(ch) {
    const n = progOf(ch);
    if (!n) return { t: "", w: 0 };
    return { t: n.p[2], w: Math.round((Date.now() - n.p[0]) / (n.p[1] - n.p[0]) * 100) };
  }
  function groupLabel() {
    const g = S.group;
    if (g === "__all") return "Todos os canais";
    if (g === "__recent") return "Recentes";
    if (g === "__hidden") return "Ocultos";
    const f = favOf(g);
    return f ? "★ " + f.name : g;
  }
  function renderGroups() {
    const item = (g, name, count, extra = "") => `<button class="grp ${S.group === g ? "on" : ""} ${extra}" data-g="${esc(g)}"><span>${esc(name)}</span><b>${count != null ? count : ""}</b></button>`;
    const live = (c) => !(S.settings.hideDead && isDead(c));
    let h = item("__all", "Todos os canais", S.all.filter(live).length);
    S.favs.forEach((f) => {
      const n = f.ids.filter((id) => S.byId.has(id) && !isHid(S.byId.get(id)) && live(S.byId.get(id))).length;
      h += item("fav:" + f.id, "★ " + f.name, n, "favg");
    });
    h += `<button class="grp add" data-add title="Criar outra lista de favoritos">＋ Nova lista</button>`;
    h += item("__recent", "Recentes", S.recent.filter((id) => S.byId.has(id) && !isHid(S.byId.get(id))).length);
    const nh = S.base.filter(isHid).length;
    if (nh) h += item("__hidden", "Ocultos", nh);
    if (pinOn() && S.unlocked) h += `<button class="grp relock" data-relock title="Bloquear as categorias protegidas de novo">🔒 Bloquear de novo</button>`;
    else if (pinOn()) S.lockedGroupsPresent.forEach((g) => h += `<button class="grp lock" data-lockg="${esc(g)}" title="Digite o PIN para abrir"><span>🔒 ${esc(g)}</span></button>`);
    S.groups.forEach((g, i) => {
      const n = S.settings.hideDead ? S.all.filter((c) => c.group === g.name && live(c)).length : g.count;
      h += item(g.name, (isLockedGroup(g.name) ? "🔓 " : "") + g.name, n, i === 0 ? "sep" : "");
    });
    $("#groups").innerHTML = h;
    $("#gGroups").innerHTML = h;
  }
  function renderList() {
    S.list = filtered();
    const el = $("#list");
    if (!S.all.length) return;
    if (!S.list.length && !progSearch().length) {
      el.innerHTML = `<div class="empty">${S.group.startsWith("fav:") ? "Nenhum canal nesta lista ainda.<br>Clique na estrela de um canal<br>(ou botão direito para escolher a lista)." : S.group === "__recent" ? "Você ainda não assistiu nada." : S.group === "__hidden" ? "Nenhum canal oculto." : "Nenhum canal encontrado."}</div>`;
      return updateFoot();
    }
    const progs = progSearch();
    el.innerHTML = S.list.map((c) => {
      const n = rowNow(c);
      return `<div class="ch ${isOn(c) ? "on" : ""} ${isDead(c) ? "dead" : ""} ${isHid(c) ? "hid" : ""}" data-id="${c.id}" title="Botão direito: favoritos, renomear, ocultar, mover">
          <span class="num">${c.num}</span>
          <span class="logo">${c.logo ? `<img loading="lazy" src="${esc(c.logo)}" alt="">` : `<i>${esc(initials(dispName(c)))}</i>`}</span>
          <div><div class="name">${esc(dispName(c))}</div><div class="now"><span class="nowt">${esc(n.t)}</span><i style="width:${n.w}%"></i></div></div>
          <button class="star ${isFav(c.id) ? "on" : ""}" data-star title="Favoritar"><svg class="i"><use href="#i-star"/></svg></button>
        </div>`;
    }).join("") + progHtml(progs);
    updateFoot();
  }
  function progSearch() {
    const q = norm(S.q || "").trim();
    if (q.length < 3) return [];
    const now = Date.now();
    const out = [];
    for (const c of S.all) {
      const a = S.epg[c.id];
      if (!a) continue;
      for (const p of a) if (p[1] > now && norm(p[2]).includes(q)) out.push([c, p]);
    }
    out.sort((x, y) => Math.max(x[1][0], now) - Math.max(y[1][0], now));
    return out.slice(0, 60);
  }
  function progHtml(list) {
    if (!list.length) return "";
    const now = Date.now();
    return `<div class="sect">Programas (${list.length})</div>` + list.map(([c, p]) => {
      const on = p[0] <= now;
      return `<div class="pg" data-pg="${c.id}" data-s="${p[0]}" title="Clique para assistir, avisar ou gravar">
            <span class="logo">${c.logo ? `<img loading="lazy" src="${esc(c.logo)}" alt="">` : `<i>${esc(initials(dispName(c)))}</i>`}</span>
            <div><div class="pt">${esc(p[2])}</div><div class="ps">${esc(dispName(c))} · ${fmtT(p[0])}–${fmtT(p[1])}</div></div>
            <span class="pw ${on ? "now" : ""}">${on ? "AGORA" : fmtWhen(p[0])}</span>
          </div>`;
    }).join("");
  }
  function refreshNow() {
    $$("#list .ch").forEach((el) => {
      const c = S.byId.get(el.dataset.id);
      if (!c) return;
      const n = rowNow(c);
      $(".nowt", el).textContent = n.t;
      $(".now i", el).style.width = n.w + "%";
    });
  }
  function updateFoot() {
    $("#sortBtn").textContent = S.sort === "az" ? "Ordem: A–Z" : "Ordem: da lista";
    const i = S.info;
    if (!i) return;
    const hm = fmtT(i.updatedAt);
    const guide = S.settings.epgEnabled === false ? "" : ` · Guia: ${S.epgCount} canais`;
    const cache = i.fromCache ? " (cópia salva — sem internet?)" : "";
    $("#footTxt").textContent = `${S.list.length} canais · lista de ${hm}${cache}${guide}`;
  }
  function showEmpty(msg) {
    $("#list").innerHTML = `<div class="empty"><b>Não consegui carregar a lista</b><br>${esc(msg)}<br><br>Confira o link em Configurações e sua conexão.</div>`;
  }
  function guessKind(url) {
    const p = url.split("?")[0].toLowerCase();
    if (p.includes(".m3u8")) return "hls";
    if (/\.(mp4|webm|mkv)$/.test(p)) return "mp4";
    if (p.endsWith(".ts")) return "ts";
    return "unknown";
  }
  async function sniff(url) {
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), 9e3);
    try {
      const r = await fetch(url, { signal: ac.signal });
      if (!r.ok) throw new Error("HTTP " + r.status);
      const rd = r.body.getReader();
      const { value } = await rd.read();
      rd.cancel().catch(() => {
      });
      if (!value || !value.length) throw new Error("resposta vazia");
      const head = new TextDecoder("latin1").decode(value.slice(0, 16));
      if (head.trim().startsWith("#EXTM3U")) return "hls";
      if (value[0] === 71) return "ts";
      if (head.slice(4, 8) === "ftyp") return "mp4";
      if (/^\s*</.test(head)) throw new Error("resposta em HTML");
      if ((r.headers.get("content-type") || "").toLowerCase().includes("mpegurl")) return "hls";
      return "ts";
    } finally {
      clearTimeout(timer);
      ac.abort();
    }
  }
  function orderSources(ch) {
    const ok = [];
    const dead = [];
    ch.sources.forEach((s) => (S.checks[s.url] && S.checks[s.url].ok === false ? dead : ok).push(s));
    return ok.concat(dead);
  }
  function teardown() {
    clearTimeout(S.startTimer);
    clearTimeout(S.stallTimer);
    video.onplaying = video.onwaiting = video.onerror = video.onstalled = null;
    if (S.hls) {
      try {
        S.hls.destroy();
      } catch (e) {
      }
      S.hls = null;
    }
    if (S.ts) {
      try {
        S.ts.pause();
        S.ts.unload();
        S.ts.detachMediaElement();
        S.ts.destroy();
      } catch (e) {
      }
      S.ts = null;
    }
    video.removeAttribute("src");
    video.load();
  }
  function fail(gen, reason) {
    if (gen !== S.gen) return;
    console.warn("[player] falha:", reason, S.order[S.idx] && S.order[S.idx].url);
    S.idx++;
    if (S.idx < S.order.length) {
      toast(`Fonte ${S.idx} não respondeu (${reason}). Tentando a fonte ${S.idx + 1}…`);
      startSource();
    } else {
      teardown();
      setStatus("");
      showMsg("<b>Canal indisponível agora</b>Todas as fontes falharam.<br>Tente outro canal ou verifique a lista.");
    }
  }
  async function startSource() {
    teardown();
    const gen = ++S.gen;
    const src = S.order[S.idx];
    if (!src) return;
    S.recovered = false;
    fillSources();
    setStatus(`Conectando… (fonte ${S.idx + 1}/${S.order.length})`);
    let kind = guessKind(src.url);
    if (kind === "unknown") {
      try {
        kind = await sniff(src.url);
      } catch (e) {
        return fail(gen, e.name === "AbortError" ? "tempo esgotado" : e.message);
      }
      if (gen !== S.gen) return;
    }
    let started = false;
    S.startTimer = setTimeout(() => !started && fail(gen, "tempo esgotado"), 15e3);
    video.onplaying = () => {
      if (gen !== S.gen) return;
      started = true;
      clearTimeout(S.startTimer);
      clearTimeout(S.stallTimer);
      setStatus("");
      hideMsg();
      syncPlayIcon();
    };
    video.onwaiting = () => {
      if (!started || gen !== S.gen) return;
      clearTimeout(S.stallTimer);
      S.stallTimer = setTimeout(() => fail(gen, "travou"), 2e4);
    };
    try {
      if (kind === "hls" && window.Hls && Hls.isSupported()) {
        const hls = new Hls({
          maxBufferLength: 30,
          backBufferLength: 900,
          liveSyncDurationCount: 3,
          manifestLoadingMaxRetry: 1,
          levelLoadingMaxRetry: 2,
          fragLoadingMaxRetry: 3
        });
        S.hls = hls;
        hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {
        }));
        hls.on(Hls.Events.ERROR, (_e, d) => {
          if (!d.fatal || gen !== S.gen) return;
          if (d.type === Hls.ErrorTypes.MEDIA_ERROR && !S.recovered) {
            S.recovered = true;
            hls.recoverMediaError();
          } else fail(gen, d.details || "erro HLS");
        });
        hls.loadSource(src.url);
        hls.attachMedia(video);
      } else if (kind === "ts" && window.mpegts && mpegts.isSupported()) {
        const p = mpegts.createPlayer(
          { type: "mpegts", isLive: true, url: src.url },
          {
            enableWorker: true,
            liveBufferLatencyChasing: false,
            autoCleanupSourceBuffer: true,
            autoCleanupMaxBackwardDuration: 1800,
            autoCleanupMinBackwardDuration: 900
          }
        );
        S.ts = p;
        p.on(mpegts.Events.ERROR, (_t, d) => fail(gen, d || "erro de transmissão"));
        p.on(mpegts.Events.LOADING_COMPLETE, () => fail(gen, "transmissão encerrada"));
        p.attachMediaElement(video);
        p.load();
        const r = p.play();
        if (r && r.catch) r.catch(() => {
        });
      } else {
        video.src = src.url;
        video.onerror = () => fail(gen, "erro de mídia");
        video.play().catch(() => {
        });
      }
    } catch (e) {
      fail(gen, e.message);
    }
  }
  function play(ch, idx = 0) {
    if (!ch) return;
    if (S.view !== "live") showView("live", true);
    if (S.mv.on) return mvAssign(S.mv.active, ch);
    stopRec();
    if (S.cur && S.cur.id !== ch.id) S.prevId = S.cur.id;
    S.cur = ch;
    S.order = orderSources(ch);
    S.idx = Math.min(idx, S.order.length - 1);
    hideMsg();
    $("#chName").textContent = `${ch.num}  ${dispName(ch)}`;
    $$("#list .ch").forEach((el) => el.classList.toggle("on", el.dataset.id === ch.id));
    const on = $("#list .ch.on");
    if (on) on.scrollIntoView({ block: "nearest" });
    S.recent = [ch.id, ...S.recent.filter((x) => x !== ch.id)].slice(0, 30);
    jset("lb.recent", S.recent);
    jset("lb.last", ch.id);
    syncFav();
    applyAr();
    tick();
    startSource();
  }
  function fillSources() {
    const sel = $("#srcSel");
    sel.innerHTML = S.order.map((s, i) => `<option value="${i}">Fonte ${i + 1} · ${esc(s.label)}${S.checks[s.url] && S.checks[s.url].ok === false ? " ✕" : ""}</option>`).join("");
    sel.value = String(S.idx);
    sel.style.display = S.order.length > 1 ? "" : "none";
  }
  function zap(dir) {
    const l = S.list.length ? S.list : S.all;
    if (!l.length) return;
    const cc = curCh();
    const i = cc ? l.findIndex((c) => c.id === cc.id) : -1;
    play(l[i < 0 ? 0 : (i + dir + l.length) % l.length]);
  }
  function goLive() {
    if (S.hls && S.hls.liveSyncPosition) video.currentTime = S.hls.liveSyncPosition;
    else {
      const b = video.buffered;
      if (b.length) video.currentTime = b.end(b.length - 1) - 1;
    }
    video.play().catch(() => {
    });
  }
  let seeking = false;
  function tick() {
    const ch = S.cur;
    const box = $("#osdEpg");
    const n = ch && progOf(ch);
    if (n) {
      const [s, e, t] = n.p;
      const left = Math.max(0, Math.round((e - Date.now()) / 6e4));
      $("#osdTitle").textContent = t;
      $("#osdTime").textContent = `${fmtT(s)} – ${fmtT(e)} · faltam ${left} min`;
      $("#osdBar").style.width = Math.min(100, (Date.now() - s) / (e - s) * 100) + "%";
      $("#osdNext").textContent = n.next ? `A seguir: ${n.next[2]} (${fmtT(n.next[0])})` : "";
      box.classList.remove("none");
    } else box.classList.add("none");
    const b = video.buffered;
    const live = $("#liveBtn");
    if (b.length) {
      const end = b.end(b.length - 1);
      const seek = $("#seek");
      seek.min = b.start(0);
      seek.max = end;
      if (!seeking) seek.value = video.currentTime;
      const behind = end - video.currentTime;
      if (behind < 8) {
        live.textContent = "AO VIVO";
        live.className = "live is-live";
      } else {
        live.textContent = `-${fmtDur(behind)} · ir ao vivo`;
        live.className = "live behind";
      }
    }
    if (S.rec) $("#status").textContent = `● REC ${fmtDur((Date.now() - S.rec.t0) / 1e3)}`;
  }
  function syncPlayIcon() {
    $("#bPlay use").setAttribute("href", video.paused ? "#i-play" : "#i-pause");
    kickIdle();
  }
  function syncMute() {
    $("#bMute use").setAttribute("href", video.muted || video.volume === 0 ? "#i-mute" : "#i-vol");
  }
  function syncFav() {
    {
      const c = curCh();
      $("#bFav").classList.toggle("on", !!c && isFav(c.id));
    }
  }
  function toggleFav(id) {
    if (!id) return;
    toggleIn(favOf(S.group) || S.favs[0], id);
  }
  function toggleIn(f, id) {
    const i = f.ids.indexOf(id);
    if (i >= 0) f.ids.splice(i, 1);
    else {
      f.ids.push(id);
      toast(`Adicionado a "${f.name}".`, 2e3);
    }
    saveFavs();
    syncFav();
    renderGroups();
    if (favOf(S.group)) renderList();
    else $$(`#list .ch[data-id="${id}"] .star, .gstar[data-gstar="${id}"]`).forEach((b) => b.classList.toggle("on", isFav(id)));
  }
  function showCtx(x, y, items) {
    const el = $("#ctx");
    el.innerHTML = items.map(
      (it, i) => it.sep ? "<hr>" : it.lbl ? `<div class="lbl">${esc(it.lbl)}</div>` : `<button data-i="${i}" ${it.off ? "disabled" : ""}><span class="k">${it.k || ""}</span>${esc(it.t)}</button>`
    ).join("");
    el._items = items;
    el.hidden = false;
    el.style.left = Math.max(4, Math.min(x, innerWidth - el.offsetWidth - 4)) + "px";
    el.style.top = Math.max(4, Math.min(y, innerHeight - el.offsetHeight - 4)) + "px";
    if (!el._prev || el._prev.isConnected === false) el._prev = document.activeElement;
    const b0 = el.querySelector("button:not([disabled])");
    if (b0) b0.focus({ preventScroll: true });
  }
  const hideCtx = () => {
    const el = $("#ctx");
    const wasOpen = !el.hidden;
    el.hidden = true;
    const p = el._prev;
    el._prev = null;
    if (wasOpen && p && p.isConnected && p.focus && p !== document.body) p.focus({ preventScroll: true });
  };
  function dialog({ title, text = "", input = false, value = "", ok = "OK", pw = false }) {
    return new Promise((res) => {
      const inp = $("#dlgInput");
      $("#dlgTitle").textContent = title;
      $("#dlgText").textContent = text;
      $("#dlgYes").textContent = ok;
      inp.hidden = !input;
      inp.type = pw ? "password" : "text";
      inp.value = value;
      const done = (v) => {
        if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
        $("#dlg").hidden = true;
        S.dlgDone = null;
        res(v);
      };
      S.dlgDone = done;
      $("#dlgYes").onclick = () => done(input ? inp.value.trim() : true);
      $("#dlgNo").onclick = () => done(null);
      inp.onkeydown = (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
          done(inp.value.trim());
        }
      };
      $("#dlg").hidden = false;
      setTimeout(() => input ? (inp.focus(), inp.select()) : $("#dlgYes").focus(), 0);
    });
  }
  function refreshAll() {
    renderGroups();
    renderList();
    if (S.mini.open) renderMini();
    if (S.view === "guide") buildGuide(guideKeep());
    if (S.view === "home") renderHome(true);
  }
  async function renameCh(c) {
    const n = await dialog({ title: "Renomear canal", text: "Nome original: " + c.name, input: true, value: dispName(c), ok: "Salvar" });
    if (n === null) return;
    const o = S.ov[c.id] || (S.ov[c.id] = {});
    if (!n || n === c.name) delete o.n;
    else o.n = n;
    cleanOv(c.id);
    saveOv();
    refreshAll();
    if (S.cur && S.cur.id === c.id) $("#chName").textContent = `${c.num}  ${dispName(c)}`;
  }
  function setHidden(c, hide) {
    const o = S.ov[c.id] || (S.ov[c.id] = {});
    if (hide) o.h = 1;
    else delete o.h;
    cleanOv(c.id);
    saveOv();
    applyHidden();
    refreshAll();
    toast(hide ? `"${dispName(c)}" ocultado. Para voltar, abra "Ocultos" na lateral.` : `"${dispName(c)}" voltou para a lista.`, 4e3);
  }
  const canMove = () => !S.q && S.sort !== "az" && S.group !== "__recent" && S.group !== "__hidden";
  function moveCh(id, how) {
    if (!canMove()) return;
    const f = favOf(S.group);
    const ids = viewList().map((c) => c.id);
    const i = ids.indexOf(id);
    if (i < 0) return;
    ids.splice(i, 1);
    const j = how === "top" ? 0 : how === "bottom" ? ids.length : how === "up" ? Math.max(0, i - 1) : Math.min(ids.length, i + 1);
    ids.splice(j, 0, id);
    if (f) {
      f.ids = ids.concat(f.ids.filter((x) => !ids.includes(x)));
      saveFavs();
    } else {
      S.ord[S.group] = ids;
      saveOrd();
    }
    renderList();
    const row = $(`#list .ch[data-id="${id}"]`);
    if (row) row.scrollIntoView({ block: "nearest" });
  }
  function channelMenu(c, x, y) {
    const items = [{ lbl: "Listas de favoritos" }];
    S.favs.forEach((f) => items.push({ k: f.ids.includes(c.id) ? "★" : "☆", t: f.name, fn: () => toggleIn(f, c.id) }));
    items.push({
      k: "＋",
      t: "Nova lista com este canal…",
      fn: async () => {
        const n = await dialog({ title: "Nova lista de favoritos", input: true, ok: "Criar" });
        if (!n) return;
        S.favs.push({ id: "f" + Date.now().toString(36), name: n, ids: [c.id] });
        saveFavs();
        syncFav();
        renderGroups();
        toast(`Lista "${n}" criada.`);
      }
    });
    items.push({ sep: true });
    items.push({ t: "Renomear canal…", fn: () => renameCh(c) });
    if (S.ov[c.id] && S.ov[c.id].n)
      items.push({
        t: "Restaurar nome original",
        fn: () => {
          delete S.ov[c.id].n;
          cleanOv(c.id);
          saveOv();
          refreshAll();
        }
      });
    items.push({ t: isHid(c) ? "Mostrar canal de novo" : "Ocultar canal", fn: () => setHidden(c, !isHid(c)) });
    items.push({ sep: true });
    items.push({ lbl: canMove() ? "Posição nesta lista" : "Posição (tire a busca/A–Z para mover)" });
    const off = !canMove();
    items.push({ k: "⇈", t: "Mover para o topo", off, fn: () => moveCh(c.id, "top") });
    items.push({ k: "↑", t: "Subir", off, fn: () => moveCh(c.id, "up") });
    items.push({ k: "↓", t: "Descer", off, fn: () => moveCh(c.id, "down") });
    showCtx(x, y, items);
  }
  function listMenu(g, x, y) {
    const f = favOf(g);
    if (!f) return;
    showCtx(x, y, [
      {
        t: "Renomear lista…",
        fn: async () => {
          const n = await dialog({ title: "Renomear lista", input: true, value: f.name, ok: "Salvar" });
          if (!n) return;
          f.name = n;
          saveFavs();
          renderGroups();
        }
      },
      {
        t: "Excluir lista…",
        off: S.favs.length < 2,
        fn: async () => {
          if (!await dialog({ title: `Excluir "${f.name}"?`, text: "Os canais continuam na lista geral; só a lista some.", ok: "Excluir" })) return;
          S.favs = S.favs.filter((x2) => x2 !== f);
          saveFavs();
          if (S.group === g) S.group = "__all";
          syncFav();
          refreshAll();
        }
      }
    ]);
  }
  function renderMini() {
    const m = S.mini;
    $("#miniTitle").textContent = groupLabel();
    $("#miniList").innerHTML = m.l.map((c, i) => {
      const n = rowNow(c);
      return `<div class="ch ${i === m.i ? "sel" : ""} ${S.cur && S.cur.id === c.id ? "on" : ""}" data-i="${i}" data-id="${c.id}">
          <span class="num">${c.num}</span>
          <span class="logo">${c.logo ? `<img loading="lazy" src="${esc(c.logo)}" alt="">` : `<i>${esc(initials(dispName(c)))}</i>`}</span>
          <div><div class="name">${esc(dispName(c))}</div><div class="now"><span class="nowt">${esc(n.t)}</span><i style="width:${n.w}%"></i></div></div>
        </div>`;
    }).join("");
    const sel = $("#miniList .sel");
    if (sel) sel.scrollIntoView({ block: "center" });
  }
  function miniKick() {
    clearTimeout(S.mini.t);
    S.mini.t = setTimeout(miniClose, 12e3);
  }
  function miniOpen(pick) {
    const m = S.mini;
    m.pick = pick !== void 0 ? pick : S.mv.on ? S.mv.active : null;
    m.l = S.list.length ? S.list : S.all;
    m.i = Math.max(0, m.l.findIndex((c) => S.cur && c.id === S.cur.id));
    renderMini();
    $("#mini").hidden = false;
    m.open = true;
    miniKick();
  }
  function miniClose() {
    clearTimeout(S.mini.t);
    S.mini.open = false;
    $("#mini").hidden = true;
  }
  function miniMove(d) {
    const m = S.mini;
    if (!m.l.length) return;
    m.i = Math.max(0, Math.min(m.l.length - 1, m.i + d));
    $$("#miniList .ch").forEach((el, i) => el.classList.toggle("sel", i === m.i));
    const sel = $("#miniList .sel");
    if (sel) sel.scrollIntoView({ block: "nearest" });
    miniKick();
  }
  function miniPick() {
    const c = S.mini.l[S.mini.i];
    const pick = S.mini.pick;
    miniClose();
    S.mini.pick = null;
    if (!c) return;
    if (S.mv.on && pick !== null) mvAssign(pick, c);
    else play(c);
  }
  function stopLive() {
    if (S.mv.on) mvExit(null, false);
    if (S.rec) return;
    teardown();
    S.gen++;
    hideMsg();
    setStatus("");
    showMsg("<b>Canais</b>Escolha um canal na lista para assistir.");
    syncPlayIcon();
  }
  function resumeLive() {
    if (S.cur && !S.hls && !S.ts && !video.getAttribute("src")) play(S.cur);
  }
  function showView(v, quiet) {
    if (S.view === v) return;
    const prev = S.view;
    if (prev === "live") stopLive();
    S.view = v;
    document.body.dataset.view = v;
    $$("#tabs .tab").forEach((t) => t.classList.toggle("on", t.dataset.view === v));
    miniClose();
    hideCtx();
    if (v === "home") renderHome();
    if (v === "guide") {
      S.gOff = 0;
      buildGuide();
    }
    if (v === "live" && !quiet) resumeLive();
  }
  const hueOf = (s) => {
    let h = 7;
    for (const ch of String(s)) h = h * 31 + ch.charCodeAt(0) >>> 0;
    return h % 360;
  };
  const artHtml = (c) => c.logo ? `<img src="${esc(c.logo)}" alt="" data-i="${esc(initials(dispName(c)))}">` : `<i>${esc(initials(dispName(c)))}</i>`;
  function toggleFav2(id) {
    toggleIn(S.favs[0], id);
  }
  function heroItems() {
    const out = [];
    const seen = /* @__PURE__ */ new Set();
    const add = (c) => {
      if (c && !seen.has(c.id) && !isHid(c) && !isDead(c)) {
        seen.add(c.id);
        out.push(c);
      }
    };
    add(S.cur);
    S.recent.slice(0, 2).forEach((id) => add(S.byId.get(id)));
    S.favs.forEach((f) => f.ids.slice(0, 2).forEach((id) => add(S.byId.get(id))));
    for (const g of S.groups) {
      if (out.length >= 7) break;
      add(S.all.find((x) => x.group === g.name && progOf(x) && progOf(x).p[3]));
    }
    if (out.length < 4) S.all.filter((c) => progOf(c)).slice(0, 6).forEach(add);
    if (!out.length) S.all.slice(0, 5).forEach(add);
    return out.slice(0, 6);
  }
  function renderHero() {
    const fa = document.activeElement;
    const fid = fa && fa.closest && fa.closest("#heroBody") ? fa.id : "";
    renderHero0();
    if (fid && $("#" + fid)) $("#" + fid).focus({ preventScroll: true });
  }
  function renderHero0() {
    const items = S.heroItems;
    if (!items.length) {
      $("#heroBody").innerHTML = "<h1>LiveBox</h1><p>Carregando seus canais…</p>";
      $("#heroArt").innerHTML = "";
      $("#heroDots").innerHTML = "";
      return;
    }
    S.heroI = (S.heroI % items.length + items.length) % items.length;
    const c = items[S.heroI];
    const n = progOf(c);
    const resume = S.cur && S.cur.id === c.id || S.recent[0] === c.id;
    $("#heroArt").style.setProperty("--h", hueOf(c.name));
    $("#heroArt").innerHTML = artHtml(c);
    let meta = "";
    if (n) {
      const left = Math.max(0, Math.round((n.p[1] - Date.now()) / 6e4));
      const pct = Math.min(100, Math.round((Date.now() - n.p[0]) / (n.p[1] - n.p[0]) * 100));
      meta = `<div class="hmeta">${fmtT(n.p[0])} – ${fmtT(n.p[1])} · Restam ${left} min</div><div class="hbar"><i style="width:${pct}%"></i></div>`;
    }
    $("#heroBody").innerHTML = `
      <div><span class="chip">${resume ? "CONTINUE ASSISTINDO" : "AO VIVO"}</span><span class="hch">CH ${c.num} · ${esc(dispName(c))}</span></div>
      <h1>${esc(n ? n.p[2] : dispName(c))}</h1>${meta}
      ${n && n.p[3] ? `<p>${esc(n.p[3])}</p>` : ""}
      <div class="hbtns"><button class="pill primary" id="heroPlay" data-nav>▶ Assistir agora</button><button class="pill" id="heroFav" data-nav>${isFav(c.id) ? "★ Nos favoritos" : "☆ Favoritar"}</button></div>`;
    $("#heroDots").innerHTML = items.map((_, i) => `<button data-i="${i}" class="${i === S.heroI ? "on" : ""}" aria-label="Destaque ${i + 1}"></button>`).join("");
  }
  function startHeroTimer() {
    clearInterval(S.heroT);
    S.heroT = setInterval(() => {
      if (S.view !== "home" || document.hidden || S.heroItems.length < 2) return;
      const hero = $("#hero");
      if (hero.matches(":hover") || hero.contains(document.activeElement)) return;
      S.heroI++;
      renderHero();
    }, 9e3);
  }
  function cardHtml(c) {
    const n = progOf(c);
    const pct = n ? Math.min(100, Math.round((Date.now() - n.p[0]) / (n.p[1] - n.p[0]) * 100)) : 0;
    return `<button class="card ${isDead(c) ? "dead" : ""}" data-nav data-id="${c.id}" style="--h:${hueOf(c.name)}" title="${esc(dispName(c))}">
      <span class="lg">${artHtml(c)}</span>${n ? '<span class="tag">AO VIVO</span>' : ""}
      <span class="info"><span class="nm">${esc(n ? n.p[2] : dispName(c))}</span><span class="pr">${n ? esc(dispName(c)) : "CH " + c.num}</span>${n ? `<span class="bar"><i style="width:${pct}%"></i></span>` : ""}</span></button>`;
  }
  function homeRows() {
    const alive = (c) => c && !isHid(c) && !(S.settings.hideDead && isDead(c));
    const rows = [];
    const rec = S.recent.map((id) => S.byId.get(id)).filter(alive);
    if (rec.length) rows.push({ t: "Continue assistindo", l: rec.slice(0, 24) });
    S.favs.forEach((f) => {
      const l = f.ids.map((id) => S.byId.get(id)).filter(alive);
      if (l.length) rows.push({ t: "★ " + f.name, l: l.slice(0, 30), g: "fav:" + f.id });
    });
    const now = S.all.filter((c) => alive(c) && progOf(c));
    if (now.length >= 4) rows.push({ t: "No ar agora", l: now.filter((c) => c.logo).concat(now.filter((c) => !c.logo)).slice(0, 30), g: "__all" });
    S.groups.slice(0, 16).forEach((g) => {
      const l = S.all.filter((c) => c.group === g.name && alive(c));
      if (l.length >= 2) rows.push({ t: g.name, l: l.slice(0, 30), g: g.name });
    });
    return rows;
  }
  function renderHome(keep) {
    const v = $("#v-home");
    const top = v.scrollTop;
    const fa = document.activeElement;
    const fin = fa && fa.closest && fa.closest("#rows");
    const fkey = fin ? fa.classList.contains("card") ? `.card[data-id="${fa.dataset.id}"]` : fa.classList.contains("all") ? `.all[data-g="${fa.dataset.g}"]` : "" : "";
    const sc = keep ? $$("#rows .rail").map((r) => r.scrollLeft) : [];
    S.heroItems = heroItems();
    renderHero();
    if (!S.all.length) {
      $("#rows").innerHTML = '<div class="empty">Nenhum canal carregado ainda.</div>';
      return;
    }
    $("#rows").innerHTML = homeRows().map(
      (r) => `<div class="rowh"><h3>${esc(r.t)}</h3>${r.g ? `<button class="all" data-g="${esc(r.g)}" data-nav>Ver tudo ›</button>` : ""}</div>
      <div class="railw"><button class="rbtn l" data-dir="-1" tabindex="-1">‹</button><div class="rail">${r.l.map(cardHtml).join("")}</div><button class="rbtn r" data-dir="1" tabindex="-1">›</button></div>`
    ).join("");
    $$("#rows .rail").forEach((r, i) => sc[i] && (r.scrollLeft = sc[i]));
    if (keep) v.scrollTop = top;
    const again = fkey && $("#rows " + fkey);
    if (again) again.focus({ preventScroll: true });
    else if (isTV() && S.view === "home" && (!document.activeElement || document.activeElement === document.body)) {
      const hp = $("#heroPlay");
      if (hp) hp.focus({ preventScroll: true });
    }
  }
  const FOCUSABLE = "button:not([disabled]), input:not([type=hidden]):not([disabled]), select:not([disabled]), textarea:not([disabled]), [data-nav]";
  function navMove(dir, root) {
    const vis = (el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && el.tabIndex !== -1;
    };
    const scope = root || document;
    const els = [...scope.querySelectorAll(root ? FOCUSABLE : "[data-nav]")].filter(vis);
    const act = document.activeElement;
    const cur = act && act !== document.body && els.includes(act) ? act : null;
    if (!cur) {
      const first = root ? els[0] : els.find((e) => e.matches(".card, .g-prog, #heroPlay")) || els[0];
      return first && first.focus();
    }
    const a = cur.getBoundingClientRect();
    const ax = a.left + a.width / 2;
    const ay = a.top + a.height / 2;
    let best = null;
    let bs = Infinity;
    for (const el of els) {
      if (el === cur) continue;
      const r = el.getBoundingClientRect();
      const dx = r.left + r.width / 2 - ax;
      const dy = r.top + r.height / 2 - ay;
      const ok = dir === "right" ? dx > 4 : dir === "left" ? dx < -4 : dir === "down" ? dy > 4 : dy < -4;
      if (!ok) continue;
      const horiz = dir === "left" || dir === "right";
      const score = (horiz ? Math.abs(dx) : Math.abs(dy)) + (horiz ? Math.abs(dy) : Math.abs(dx)) * 2.5;
      if (score < bs) {
        bs = score;
        best = el;
      }
    }
    if (best) {
      best.focus({ preventScroll: true });
      best.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }
  let backAt = 0;
  function goBack() {
    if (!$("#dlg").hidden) {
      if (S.dlgDone) S.dlgDone(null);
      return;
    }
    if (!$("#ctx").hidden) return hideCtx();
    if (S.mini.open) return miniClose();
    if (!$("#sched").hidden) return $("#sched").hidden = true;
    if (!$("#settings").hidden) return $("#settings").hidden = true;
    if (!$("#alert").hidden) return $("#alert").hidden = true;
    const a = document.activeElement;
    if (a && /^(INPUT|TEXTAREA)$/.test(a.tagName)) return a.blur();
    if (S.view !== "home") return showView("home");
    if (Date.now() - backAt < 2500 && window.Native && Native.exit) return Native.exit();
    backAt = Date.now();
    toast("Aperte Voltar de novo para sair do LiveBox.");
  }
  window.__back = goBack;
  window.__menu = () => keyAct("ContextMenu");
  async function sha(text) {
    const b = new TextEncoder().encode(text);
    const h = await crypto.subtle.digest("SHA-256", b);
    return [...new Uint8Array(h)].map((x) => x.toString(16).padStart(2, "0")).join("");
  }
  const pinHash = (salt, pin) => sha(salt + ":" + pin);
  async function checkPin(pin) {
    const p = S.settings.pin;
    return !!p && await pinHash(p.salt, pin) === p.hash;
  }
  async function askPin(title) {
    const v = await dialog({ title, text: "Digite o PIN.", input: true, pw: true, ok: "Abrir" });
    if (v === null) return false;
    if (!await checkPin(v)) {
      toast("PIN incorreto.", 2500);
      return false;
    }
    unlock();
    return true;
  }
  function unlock() {
    S.unlocked = true;
    clearTimeout(S.unlockT);
    S.unlockT = setTimeout(relock, 15 * 6e4);
    applyHidden();
    refreshAll();
    toast("Categorias protegidas liberadas por 15 minutos.", 3e3);
  }
  function relock() {
    S.unlocked = false;
    clearTimeout(S.unlockT);
    applyHidden();
    refreshAll();
    toast("Categorias protegidas bloqueadas.", 2500);
  }
  async function setPin() {
    if (pinOn() && !S.unlocked && !await askPin("PIN atual")) return false;
    const a = await dialog({ title: "Novo PIN", text: "4 a 8 números.", input: true, pw: true, ok: "Continuar" });
    if (a === null) return false;
    if (!/^\d{4,8}$/.test(a)) {
      toast("O PIN precisa ter de 4 a 8 números.", 3e3);
      return false;
    }
    const b = await dialog({ title: "Repita o PIN", input: true, pw: true, ok: "Salvar" });
    if (b !== a) {
      toast("Os PINs não são iguais.", 3e3);
      return false;
    }
    const salt = Math.random().toString(36).slice(2) + Date.now().toString(36);
    S.settings = await api.setSettings({ pin: { salt, hash: await pinHash(salt, a) } });
    S.unlocked = true;
    toast("PIN definido.", 2500);
    return true;
  }
  async function removePin() {
    if (!pinOn()) return;
    if (!S.unlocked && !await askPin("PIN atual")) return;
    S.settings = await api.setSettings({ pin: null, lockedGroups: [] });
    S.unlocked = false;
    applyHidden();
    refreshAll();
    toast("PIN removido; nenhuma categoria está bloqueada.", 3e3);
  }
  async function setLocked(g, lock) {
    if (lock && !pinOn() && !await setPin()) return;
    if (pinOn() && !S.unlocked && !await askPin("PIN")) return;
    const cur = (S.settings.lockedGroups || []).filter((x) => norm(x) !== norm(g));
    if (lock) cur.push(g);
    S.settings = await api.setSettings({ lockedGroups: cur });
    if (lock && S.group === g) S.group = "__all";
    applyHidden();
    refreshAll();
    toast(lock ? `"${g}" bloqueada. Para abrir, use o PIN na lateral.` : `"${g}" desbloqueada de vez.`, 4e3);
  }
  function groupLockMenu(g, x, y) {
    const locked = isLockedGroup(g);
    showCtx(x, y, [{ lbl: g }, locked ? { k: "🔓", t: "Tirar o bloqueio desta categoria", fn: () => setLocked(g, false) } : { k: "🔒", t: "Bloquear esta categoria com PIN", fn: () => setLocked(g, true) }]);
  }
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const saveSched = () => jset("lb.sched", S.sched);
  const pendingN = () => S.sched.filter((it) => !(it.type === "remind" ? it.fired : it.stopped)).length;
  function schedChanged() {
    saveSched();
    const n = pendingN();
    $("#schedN").textContent = n;
    $("#schedN").hidden = !n;
    if (S.view === "guide") buildGuide(guideKeep());
    if (!$("#sched").hidden) renderSched();
  }
  function fmtWhen(ms) {
    const d = new Date(ms);
    const same = d.toDateString() === (/* @__PURE__ */ new Date()).toDateString();
    return (same ? "hoje " : pad(d.getDate()) + "/" + pad(d.getMonth() + 1) + " ") + fmtT(ms);
  }
  function addSched(c, p, type) {
    const now = Date.now();
    if (S.sched.some((it) => it.chId === c.id && it.type === type && it.end === p[1])) return;
    S.sched.push({ id: now + "" + Math.floor(Math.random() * 1e3), type, chId: c.id, name: dispName(c), title: p[2], start: Math.max(p[0], now), end: p[1] });
    schedChanged();
    toast(
      type === "record" ? `Gravação agendada: "${p[2]}" (${dispName(c)}), ${fmtWhen(p[0])}. Deixe o LiveBox aberto.` : `Aviso agendado: "${p[2]}", ${fmtWhen(p[0])} (1 min antes).`,
      5e3
    );
  }
  function removeSched(id) {
    S.sched = S.sched.filter((it) => it.id !== id);
    schedChanged();
  }
  function programMenu(c, p, x, y) {
    const [s, e, t] = p;
    const now = Date.now();
    const items = [
      { lbl: `${t} · ${fmtT(s)}–${fmtT(e)}` },
      { k: "▶", t: "Assistir canal", fn: () => play(c) }
    ];
    if (e > now) {
      const ex = (type) => S.sched.find((it) => it.chId === c.id && it.type === type && it.end === e);
      if (s > now) {
        const r = ex("remind");
        items.push(r ? { k: "✕", t: "Cancelar lembrete", fn: () => removeSched(r.id) } : { k: "🔔", t: "Avisar 1 min antes", fn: () => addSched(c, p, "remind") });
      }
      const g = ex("record");
      items.push(g ? { k: "✕", t: "Cancelar gravação", fn: () => removeSched(g.id) } : { k: "⏺", t: s > now ? "Gravar este programa" : "Gravar daqui até o fim", fn: () => addSched(c, p, "record") });
    }
    showCtx(x, y, items);
  }
  function renderSched() {
    const l = S.sched.slice().sort((a, b) => a.start - b.start);
    const now = Date.now();
    $("#schedList").innerHTML = l.length ? l.map((it) => {
      const run = it.type === "record" && it.started && !it.stopped;
      const st = run ? "● Gravando" : it.type === "remind" && it.fired ? "Avisado" : it.start <= now ? "Agora" : "em " + (it.start - now >= 36e5 ? Math.floor((it.start - now) / 36e5) + " h " : "") + Math.round((it.start - now) / 6e4) % 60 + " min";
      return `<div class="si ${run ? "live-now" : ""}"><span class="ic">${it.type === "record" ? "⏺" : "🔔"}</span><div><div class="t">${esc(it.title)}</div><div class="s">${esc(it.name)} · ${fmtWhen(it.start)}–${fmtT(it.end)}</div></div><span class="w">${st}</span><button class="tbtn" data-rm="${it.id}">Cancelar</button></div>`;
    }).join("") : '<div class="empty">Nada agendado.<br>Abra o Guia, clique num programa e escolha<br>"Avisar" ou "Gravar".</div>';
  }
  function showAlert(html, chId) {
    $("#alertTxt").innerHTML = html;
    S.alertCh = chId;
    $("#alert").hidden = false;
    clearTimeout(S.alertT);
    S.alertT = setTimeout(() => $("#alert").hidden = true, 6e4);
  }
  function beep() {
    try {
      const a = new (window.AudioContext || window.webkitAudioContext)();
      const o = a.createOscillator();
      const g = a.createGain();
      o.frequency.value = 880;
      g.gain.value = 0.08;
      o.connect(g);
      g.connect(a.destination);
      o.start();
      setTimeout(() => {
        o.stop();
        a.close();
      }, 350);
    } catch (e) {
    }
  }
  function nativeNotify(title, body) {
    try {
      new Notification(title, { body });
    } catch (e) {
    }
  }
  async function startScheduledRec(it) {
    const c = S.byId.get(it.chId);
    if (!c) return toast(`Gravação "${it.title}" cancelada: o canal não está mais na lista.`, 7e3);
    if (S.mv.on) mvExit(null, false);
    if (S.rec) stopRec(true);
    if (!(S.cur && S.cur.id === c.id && video.readyState >= 3 && !video.paused)) play(c);
    showAlert(`<b>⏺ Gravando agendada</b><br>${esc(it.title)} · ${esc(it.name)}`, it.chId);
    nativeNotify("LiveBox: gravação começando", `${it.title} (${it.name})`);
    beep();
    for (let i = 0; i < 45; i++) {
      await sleep(1e3);
      if (!S.cur || S.cur.id !== c.id) return toast("Gravação agendada interrompida: você trocou de canal.", 6e3);
      if (video.readyState >= 3 && !video.paused) break;
    }
    await toggleRec(`${it.title} ${it.name}`);
    if (S.rec) S.rec.schedId = it.id;
    else toast(`Não consegui iniciar a gravação de "${it.title}".`, 7e3);
  }
  function schedTick() {
    const now = Date.now();
    let ch = false;
    for (const it of S.sched) {
      if (it.type === "remind" && !it.fired && now >= it.start - 6e4) {
        it.fired = true;
        ch = true;
        const left = Math.max(0, Math.round((it.start - now) / 6e4));
        const msg = left > 0 ? `Começa em ${left} min (${fmtT(it.start)})` : "Começou agora";
        showAlert(`<b>🔔 ${esc(it.title)}</b><br>${esc(it.name)} · ${msg}`, it.chId);
        nativeNotify(`${it.title} — ${it.name}`, msg);
        beep();
      }
      if (it.type === "record") {
        if (!it.started && now >= it.start - 3e4 && now < it.end) {
          it.started = true;
          ch = true;
          startScheduledRec(it);
        }
        if (it.started && !it.stopped && now >= it.end + 6e4) {
          it.stopped = true;
          ch = true;
          if (S.rec && S.rec.schedId === it.id) stopRec(true);
        }
      }
    }
    const keep = S.sched.filter((it) => it.type === "record" ? now < it.end + 12e4 : now < it.start + 6e5);
    if (keep.length !== S.sched.length) {
      S.sched = keep;
      ch = true;
    }
    if (ch) schedChanged();
  }
  async function toggleRec(label) {
    if (S.mv.on) return toast("Gravação não está disponível no multiview. Saia dele (V) para gravar.");
    if (S.rec) return stopRec(true);
    if (!S.cur || video.readyState < 2) return toast("Abra um canal primeiro.");
    if (!video.captureStream || !window.MediaRecorder) return toast("Gravação não suportada neste sistema.");
    try {
      const mime = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"].find((m) => MediaRecorder.isTypeSupported(m));
      const { id } = await api.recOpen(label || dispName(S.cur));
      const mr = new MediaRecorder(video.captureStream(), { mimeType: mime, videoBitsPerSecond: 4e6 });
      let chain = Promise.resolve();
      mr.ondataavailable = (e) => {
        if (e.data && e.data.size) chain = chain.then(async () => api.recChunk(id, await e.data.arrayBuffer()));
      };
      mr.onstop = () => {
        chain = chain.then(() => api.recClose(id)).then((f) => f && toast("Gravação salva em: " + f, 7e3));
      };
      mr.start(3e3);
      S.rec = { mr, t0: Date.now(), schedId: null };
      $("#status").className = "rec";
      $("#bRec").classList.add("on");
      toast("Gravando… clique de novo em ● (ou R) para parar.");
    } catch (e) {
      toast("Não foi possível gravar: " + e.message);
    }
  }
  function stopRec(announce) {
    if (!S.rec) return;
    const { mr } = S.rec;
    S.rec = null;
    $("#bRec").classList.remove("on");
    $("#status").className = "";
    $("#status").textContent = "";
    try {
      mr.stop();
    } catch (e) {
    }
    if (announce) toast("Gravação finalizada.");
  }
  const guideKeep = () => ({ l: $("#gScroll").scrollLeft, t: $("#gScroll").scrollTop });
  function openGuide() {
    S.gOff = 0;
    if (S.view === "guide") buildGuide();
    else showView("guide");
  }
  const GPX = 7;
  const GW = 210;
  function setGuideInfo(c, p) {
    const [s, e, t, d] = p;
    const now = Date.now();
    $("#gInfo").style.setProperty("--h", hueOf(c.name));
    $("#gInfoArt").innerHTML = artHtml(c);
    const when = s <= now && now < e ? ` · Restam ${Math.max(0, Math.round((e - now) / 6e4))} min` : e <= now ? " · já passou" : ` · ${fmtWhen(s)}`;
    $("#gInfoTxt").innerHTML = `<div class="gt">${esc(t)}</div><div class="gm">${fmtT(s)} – ${fmtT(e)}${when} · ${esc(dispName(c))}</div>${d ? `<p>${esc(d)}</p>` : ""}`;
  }
  function buildGuide(keep) {
    const fa = document.activeElement;
    const fk = fa && fa.classList && fa.classList.contains("g-prog") ? `.g-prog[data-id="${fa.dataset.id}"][data-s="${fa.dataset.s}"]` : "";
    buildGuide0(keep);
    const again = fk && $("#gScroll " + fk);
    if (again) again.focus({ preventScroll: true });
  }
  function buildGuide0(keep) {
    const HOURS = 5;
    const now = Date.now();
    const start = Math.floor(now / 18e5) * 18e5 - 18e5 + S.gOff * 36e5;
    const end = start + HOURS * 36e5;
    const width = HOURS * 60 * GPX;
    const rows = S.list.filter((c) => S.epg[c.id]).slice(0, 150);
    const box = $("#gScroll");
    $("#guideHint").textContent = rows.length ? `${groupLabel()} · ${rows.length} canais · clique para assistir · botão direito: avisar ou gravar` : "";
    if (!rows.length) {
      $("#gInfoTxt").innerHTML = "";
      $("#gInfoArt").innerHTML = "";
      box.innerHTML = `<div class="empty">${S.settings.epgEnabled === false ? "O guia está desligado em Configurações." : S.epgCount ? "Nenhum canal desta categoria tem programação.<br>Escolha outra categoria (ex.: Canais abertos, Esportes)." : "A programação ainda está sendo baixada…<br>Volte em alguns instantes."}</div>`;
      return;
    }
    let ticks = "";
    for (let t = start; t < end; t += 18e5) {
      ticks += `<div class="g-time" style="left:${(t - start) / 6e4 * GPX}px">${fmtT(t)}</div>`;
    }
    const nowX = (now - start) / 6e4 * GPX;
    let h = `<div class="g-inner"><div class="g-head"><div class="g-corner"></div><div style="position:relative;width:${width}px">${ticks}</div></div>`;
    if (now >= start && now <= end) h += `<div class="g-now" style="left:${GW + nowX}px"></div>`;
    for (const c of rows) {
      let blocks = "";
      for (const [s, e, t] of S.epg[c.id]) {
        if (e <= start || s >= end) continue;
        const l = (Math.max(s, start) - start) / 6e4 * GPX;
        const w = (Math.min(e, end) - Math.max(s, start)) / 6e4 * GPX - 4;
        if (w < 8) continue;
        const sc = S.sched.find((it) => it.chId === c.id && it.end === e);
        blocks += `<div class="g-prog ${s <= now && now < e ? "now" : ""} ${e < now ? "past" : ""} ${sc ? "sch" : ""} ${sc && sc.type === "record" ? "rec" : ""}" tabindex="0" data-nav data-id="${c.id}" data-s="${s}" style="left:${l}px;width:${w}px" title="${esc(t)}  (${fmtT(s)}–${fmtT(e)})"><b>${esc(t)}</b><i>${fmtT(s)}</i></div>`;
      }
      h += `<div class="g-row"><div class="g-ch" data-id="${c.id}"><span class="gn">${c.num}</span><button class="gstar ${isFav(c.id) ? "on" : ""}" data-gstar="${c.id}" tabindex="-1" title="Favoritar">★</button><span class="glogo">${artHtml(c)}</span><span class="gcap">${esc(dispName(c))}</span></div><div class="g-track" style="width:${width}px">${blocks}</div></div>`;
    }
    box.innerHTML = h + "</div>";
    if (keep) {
      box.scrollLeft = keep.l;
      box.scrollTop = keep.t;
    } else box.scrollLeft = S.gOff === 0 ? Math.max(0, nowX - 120) : 0;
    const c0 = rows.find((c) => S.cur && c.id === S.cur.id) || rows[0];
    const n0 = progOf(c0);
    if (n0) setGuideInfo(c0, n0.p);
    else {
      $("#gInfoTxt").innerHTML = "";
      $("#gInfoArt").innerHTML = "";
    }
  }
  async function runCheck() {
    if (S.checking) {
      api.checkCancel();
      return;
    }
    S.checking = true;
    $("#btnCheck").classList.add("busy");
    $("#checkLabel").textContent = "Verificando…";
    toast("Testando os canais… clique em Verificar de novo para parar.");
    const res = await api.checkRun();
    S.checking = false;
    $("#btnCheck").classList.remove("busy");
    $("#checkLabel").textContent = "Verificar";
    if (res) {
      S.checks = res;
      renderList();
      const alive = S.all.filter((c) => !isDead(c)).length;
      toast(`Verificação concluída: ${alive} canais no ar, ${S.all.length - alive} fora do ar.`, 6e3);
    }
  }
  async function loadPlaylist() {
    $("#list").innerHTML = '<div class="empty">Carregando a lista…</div>';
    const res = await api.loadPlaylist();
    if (!res || !res.channels) {
      showEmpty(res && res.error || "erro desconhecido");
      return false;
    }
    S.info = res;
    S.raw = res.channels;
    applyHidden();
    refreshAll();
    const st = res.stats || {};
    if (st.lists && st.lists.length > 1) {
      const okN = st.lists.filter((l) => l.ok).length;
      const bad = st.lists.filter((l) => !l.ok);
      toast(`${okN} listas ativas · ${st.merged || 0} canais repetidos juntados` + (bad.length ? ` · falhou: ${bad.map((l) => l.name).join(", ")}` : "") + (res.fromCache ? " · cópia salva" : ""), 6500);
    } else if (res.fromCache) toast("Sem conexão com a lista: usando a última cópia salva.", 5e3);
    S.epgCount = 0;
    api.epgStart();
    return true;
  }
  const AR = [["contain", "Ajustar (mostra tudo)"], ["cover", "Preencher (corta as bordas)"], ["fill", "Esticar"], ["zoom", "Zoom 125%"]];
  const arOf = (c) => c && S.arch[c.id] || "contain";
  function setAr(v, mode) {
    v.style.objectFit = mode === "cover" ? "cover" : mode === "fill" ? "fill" : "contain";
    v.style.transform = mode === "zoom" ? "scale(1.25)" : "";
  }
  function applyAr() {
    if (S.mv.on) S.mv.tiles.forEach((t) => setAr(t.v, arOf(t.ch)));
    else setAr(video, arOf(S.cur));
  }
  function setArMode(mode) {
    const c = curCh();
    if (!c) return toast("Abra um canal primeiro.");
    if (mode === "contain") delete S.arch[c.id];
    else S.arch[c.id] = mode;
    jset("lb.arch", S.arch);
    applyAr();
    toast("Proporção: " + AR.find((a) => a[0] === mode)[1].replace(/ \(.*/, "") + " (só neste canal)", 2200);
  }
  function cycleAr() {
    const c = curCh();
    const i = AR.findIndex((a) => a[0] === arOf(c));
    setArMode(AR[(i + 1) % AR.length][0]);
  }
  function setSleep(min) {
    S.sleepAt = min ? Date.now() + min * 6e4 : 0;
    toast(min ? `Vai pausar em ${min} min.` : "Temporizador desligado.", 2500);
  }
  function optMenu() {
    const c = curCh();
    const cur = arOf(c);
    const items = [];
    if (isTV() && c) items.push({ k: "★", t: "Favoritos e organizar este canal…", fn: () => setTimeout(() => channelMenu(c, 40, 40), 0) }, { sep: true });
    items.push({ lbl: "Proporção da imagem" });
    AR.forEach(([k, t]) => items.push({ k: cur === k ? "✓" : "", t, fn: () => setArMode(k) }));
    if (!S.mv.on) {
      const h = S.hls;
      const aud = h && h.audioTracks && h.audioTracks.length > 1 ? h.audioTracks : [];
      let subs = [];
      let subKind = "";
      if (h && h.subtitleTracks && h.subtitleTracks.length) {
        subs = h.subtitleTracks;
        subKind = "hls";
      } else subs = [...video.textTracks].filter((t) => t.kind === "subtitles" || t.kind === "captions");
      items.push({ sep: true });
      if (!aud.length && !subs.length) items.push({ lbl: "Este canal não oferece trocar áudio/legenda" });
      if (aud.length) {
        items.push({ lbl: "Áudio" });
        aud.forEach((a, i) => items.push({ k: h.audioTrack === i ? "✓" : "", t: a.name || a.lang || "Faixa " + (i + 1), fn: () => {
          h.audioTrack = i;
        } }));
      }
      if (subs.length) {
        items.push({ lbl: "Legendas" });
        const on = subKind === "hls" ? h.subtitleTrack : subs.findIndex((t) => t.mode === "showing");
        items.push({ k: on < 0 ? "✓" : "", t: "Desligadas", fn: () => {
          if (subKind === "hls") h.subtitleTrack = -1;
          else subs.forEach((t) => t.mode = "disabled");
        } });
        subs.forEach(
          (t, i) => items.push({
            k: on === i ? "✓" : "",
            t: t.name || t.label || t.lang || "Legenda " + (i + 1),
            fn: () => {
              if (subKind === "hls") {
                h.subtitleDisplay = true;
                h.subtitleTrack = i;
              } else subs.forEach((x, j) => x.mode = j === i ? "showing" : "disabled");
            }
          })
        );
      }
    }
    items.push({ sep: true });
    items.push({ lbl: S.sleepAt ? `Temporizador de sono (faltam ${Math.max(1, Math.round((S.sleepAt - Date.now()) / 6e4))} min)` : "Temporizador de sono" });
    [15, 30, 60, 90, 120].forEach((m) => items.push({ t: `Pausar em ${m} min`, fn: () => setSleep(m) }));
    if (S.sleepAt) items.push({ k: "✕", t: "Desligar temporizador", fn: () => setSleep(0) });
    if (isTV()) return showCtx(innerWidth - 420, 60, items);
    const r = $("#bOpt").getBoundingClientRect();
    showCtx(r.left - 80, r.top - 8, items);
  }
  function sleepCheck() {
    if (!S.sleepAt || Date.now() < S.sleepAt) return;
    S.sleepAt = 0;
    if (S.mv.on) S.mv.tiles.forEach((t) => t.v.pause());
    else video.pause();
    const c = curCh();
    showAlert("<b>😴 Temporizador de sono</b><br>A reprodução foi pausada.", c ? c.id : null);
    nativeNotify("LiveBox", "Temporizador de sono: reprodução pausada.");
  }
  const tileMsg = (t, m) => t.el.querySelector(".tm").textContent = m || "";
  function tileUi(t) {
    t.el.querySelector(".tl").textContent = t.ch ? `${t.ch.num}  ${dispName(t.ch)}` : "";
    t.el.querySelector(".tx").style.display = t.ch ? "" : "none";
    t.el.classList.toggle("full", !!t.ch);
  }
  function tileTeardown(t) {
    clearTimeout(t.timer);
    clearTimeout(t.stall);
    t.v.onplaying = t.v.onwaiting = t.v.onerror = null;
    if (t.hls) {
      try {
        t.hls.destroy();
      } catch (e) {
      }
      t.hls = null;
    }
    if (t.ts) {
      try {
        t.ts.pause();
        t.ts.unload();
        t.ts.detachMediaElement();
        t.ts.destroy();
      } catch (e) {
      }
      t.ts = null;
    }
    t.v.removeAttribute("src");
    try {
      t.v.load();
    } catch (e) {
    }
  }
  function tileFail(t, gen, why) {
    if (gen !== t.gen) return;
    t.idx++;
    if (t.idx < t.order.length) {
      tileMsg(t, `Fonte ${t.idx} falhou, tentando a ${t.idx + 1}…`);
      tileStart(t);
    } else {
      tileTeardown(t);
      tileMsg(t, "Canal indisponível");
    }
  }
  async function tileStart(t) {
    tileTeardown(t);
    const gen = ++t.gen;
    const src = t.order[t.idx];
    if (!src) return;
    tileMsg(t, "Conectando…");
    let kind = guessKind(src.url);
    if (kind === "unknown") {
      try {
        kind = await sniff(src.url);
      } catch (e) {
        return tileFail(t, gen, e.message);
      }
      if (gen !== t.gen) return;
    }
    let started = false;
    t.timer = setTimeout(() => !started && tileFail(t, gen, "tempo esgotado"), 15e3);
    t.v.onplaying = () => {
      if (gen !== t.gen) return;
      started = true;
      clearTimeout(t.timer);
      clearTimeout(t.stall);
      tileMsg(t, "");
    };
    t.v.onwaiting = () => {
      if (!started || gen !== t.gen) return;
      clearTimeout(t.stall);
      t.stall = setTimeout(() => tileFail(t, gen, "travou"), 2e4);
    };
    try {
      if (kind === "hls" && window.Hls && Hls.isSupported()) {
        const hls = new Hls({ maxBufferLength: 12, backBufferLength: 20, liveSyncDurationCount: 3, manifestLoadingMaxRetry: 1, levelLoadingMaxRetry: 2, fragLoadingMaxRetry: 3, capLevelToPlayerSize: true });
        t.hls = hls;
        let rec = false;
        hls.on(Hls.Events.MANIFEST_PARSED, () => t.v.play().catch(() => {
        }));
        hls.on(Hls.Events.ERROR, (_e, d) => {
          if (!d.fatal || gen !== t.gen) return;
          if (d.type === Hls.ErrorTypes.MEDIA_ERROR && !rec) {
            rec = true;
            hls.recoverMediaError();
          } else tileFail(t, gen, d.details);
        });
        hls.loadSource(src.url);
        hls.attachMedia(t.v);
      } else if (kind === "ts" && window.mpegts && mpegts.isSupported()) {
        const p = mpegts.createPlayer({ type: "mpegts", isLive: true, url: src.url }, { enableWorker: true, liveBufferLatencyChasing: false, autoCleanupSourceBuffer: true, autoCleanupMaxBackwardDuration: 30, autoCleanupMinBackwardDuration: 15 });
        t.ts = p;
        p.on(mpegts.Events.ERROR, () => tileFail(t, gen, "erro"));
        p.on(mpegts.Events.LOADING_COMPLETE, () => tileFail(t, gen, "encerrado"));
        p.attachMediaElement(t.v);
        p.load();
        const r = p.play();
        if (r && r.catch) r.catch(() => {
        });
      } else {
        t.v.src = src.url;
        t.v.onerror = () => tileFail(t, gen, "erro de mídia");
        t.v.play().catch(() => {
        });
      }
    } catch (e) {
      tileFail(t, gen, e.message);
    }
  }
  function mvAudio() {
    S.mv.tiles.forEach((t, i) => {
      t.v.volume = video.volume;
      t.v.muted = video.muted || i !== S.mv.active;
      t.el.classList.toggle("act", i === S.mv.active);
    });
  }
  function mvTitle() {
    const c = curCh();
    $("#chName").textContent = `Multiview · ${S.mv.n} telas${c ? " — " + dispName(c) : ""}`;
    syncFav();
  }
  function mvActive(i) {
    S.mv.active = i;
    mvAudio();
    mvTitle();
  }
  function mvSave() {
    const ids = S.mv.tiles.map((t) => t.ch ? t.ch.id : null);
    S.mv.saved = ids.filter(Boolean);
    jset("lb.mv", { n: S.mv.n, ids });
  }
  function mvAssignTile(i, ch) {
    const t = S.mv.tiles[i];
    if (!t) return;
    t.ch = ch;
    t.order = orderSources(ch);
    t.idx = 0;
    setAr(t.v, arOf(ch));
    tileUi(t);
    tileStart(t);
  }
  function mvAssign(i, ch) {
    mvAssignTile(i, ch);
    mvActive(i);
    mvSave();
    S.recent = [ch.id, ...S.recent.filter((x) => x !== ch.id)].slice(0, 30);
    jset("lb.recent", S.recent);
    $$("#list .ch").forEach((el) => el.classList.toggle("on", S.mv.tiles.some((t) => t.ch && t.ch.id === el.dataset.id)));
  }
  function mvClear(i) {
    const t = S.mv.tiles[i];
    if (!t) return;
    tileTeardown(t);
    t.gen++;
    t.ch = null;
    tileMsg(t, "");
    tileUi(t);
    mvSave();
    mvTitle();
    $$("#list .ch").forEach((el) => el.classList.toggle("on", S.mv.tiles.some((x) => x.ch && x.ch.id === el.dataset.id)));
  }
  function mvBuild(n) {
    const grid = $("#mvGrid");
    S.mv.n = n;
    S.mv.tiles = [];
    grid.className = "mv" + n;
    grid.innerHTML = "";
    for (let i = 0; i < n; i++) {
      const el = document.createElement("div");
      el.className = "tile";
      el.dataset.i = i;
      el.innerHTML = '<video playsinline></video><div class="tl"></div><button class="tx" title="Esvaziar esta tela">✕</button><div class="tm"></div><button class="tadd">＋ Escolher canal</button>';
      grid.appendChild(el);
      const t = { i, el, v: el.querySelector("video"), ch: null, hls: null, ts: null, gen: 0, idx: 0, order: [], timer: null, stall: null };
      t.v.muted = true;
      S.mv.tiles.push(t);
      tileUi(t);
    }
    $$("#mvBar [data-n]").forEach((b) => b.classList.toggle("on", +b.dataset.n === n));
  }
  function mvEnter() {
    if (S.mv.on) return;
    if (!S.all.length) return toast("Carregue a lista de canais primeiro.");
    if (S.view !== "live") showView("live", true);
    const prev = S.cur;
    stopRec();
    teardown();
    S.gen++;
    hideMsg();
    setStatus("");
    S.mv.on = true;
    stage.classList.add("mv");
    $("#mvGrid").hidden = false;
    $("#mvBar").hidden = false;
    $("#bMulti").classList.add("on");
    mvBuild(S.mv.n);
    const ids = (prev ? [prev.id] : []).concat(S.mv.saved);
    const seen = /* @__PURE__ */ new Set();
    let k = 0;
    for (const id of ids) {
      const c = S.byId.get(id);
      if (!c || seen.has(id) || isHid(c) || k >= S.mv.n) continue;
      seen.add(id);
      mvAssignTile(k++, c);
    }
    mvActive(0);
    mvSave();
    if (k < S.mv.n) toast('Clique em "＋ Escolher canal" ou num canal da lista para preencher as telas.', 5e3);
    $$("#list .ch").forEach((el) => el.classList.toggle("on", S.mv.tiles.some((t) => t.ch && t.ch.id === el.dataset.id)));
    kickIdle();
  }
  function mvSetN(n) {
    if (!S.mv.on || n === S.mv.n) return;
    const ids = S.mv.tiles.map((t) => t.ch).filter(Boolean);
    S.mv.tiles.forEach(tileTeardown);
    mvBuild(n);
    ids.slice(0, n).forEach((c, i) => mvAssignTile(i, c));
    mvActive(0);
    mvSave();
  }
  function mvExit(ch, doPlay = true) {
    if (!S.mv.on) return;
    const t = S.mv.tiles[S.mv.active];
    const target = ch || t && t.ch || S.cur;
    mvSave();
    S.mv.tiles.forEach(tileTeardown);
    S.mv.tiles = [];
    S.mv.on = false;
    miniClose();
    $("#mvGrid").innerHTML = "";
    $("#mvGrid").hidden = true;
    $("#mvBar").hidden = true;
    stage.classList.remove("mv");
    $("#bMulti").classList.remove("on");
    if (doPlay && target) play(target);
    else syncFav();
    $$("#list .ch").forEach((el) => el.classList.toggle("on", !!S.cur && el.dataset.id === S.cur.id));
  }
  function togglePlay() {
    if (S.mv.on) {
      const paused = S.mv.tiles.every((t) => t.v.paused);
      S.mv.tiles.forEach((t) => paused ? t.v.play().catch(() => {
      }) : t.v.pause());
    } else video.paused ? video.play() : video.pause();
  }
  function listRow(p) {
    return `<div class="lrow" data-id="${esc(p.id)}"><input type="text" class="ln" placeholder="Nome" value="${esc(p.name || "")}" spellcheck="false"><input type="text" class="lu" placeholder="https://…/lista.m3u" value="${esc(p.url || "")}" spellcheck="false"><label><input type="checkbox" class="le" ${p.enabled !== false ? "checked" : ""}> ativa</label><button class="tbtn lx" title="Remover esta lista">✕</button></div>`;
  }
  const readListRows = () => $$("#sLists .lrow").map((r) => ({ id: r.dataset.id, name: $(".ln", r).value.trim() || "Lista", url: $(".lu", r).value.trim(), enabled: $(".le", r).checked })).filter((p) => p.url);
  function syncParentalUi() {
    $("#sPin").textContent = pinOn() ? "Alterar PIN" : "Definir PIN";
    $("#sPinOff").hidden = !pinOn();
    const lock = pinOn() && !S.unlocked;
    $("#sLocked").disabled = lock;
    $("#sLocked").value = (S.settings.lockedGroups || []).join("\n");
    $("#sLocked").placeholder = lock ? "Digite o PIN (botão ao lado ou categoria 🔒 na lateral) para editar" : "Nomes de categorias, uma por linha (ex.: Adultos)";
  }
  function openSettings() {
    const s = S.settings;
    $("#sLists").innerHTML = (s.playlists && s.playlists.length ? s.playlists : [{ id: "p1", name: "Lista principal", url: s.playlistUrl, enabled: true }]).map(listRow).join("");
    $("#sHidden").value = (s.hiddenGroups || []).join("\n");
    $("#sEpg").value = (s.extraEpg || []).join("\n");
    $("#sEpgOn").checked = s.epgEnabled !== false;
    $("#sHideDead").checked = !!s.hideDead;
    $("#sAuto").checked = s.autoPlayLast !== false;
    $("#sAutoCheck").checked = !!s.autoCheck;
    syncParentalUi();
    $("#settings").hidden = false;
  }
  async function saveSettings() {
    const lines = (id) => $(id).value.split("\n").map((x) => x.trim()).filter(Boolean);
    const lists = readListRows();
    if (!lists.length) return toast("Coloque pelo menos um link de lista M3U.", 4e3);
    const urlChanged = JSON.stringify(lists) !== JSON.stringify((S.settings.playlists || []).map(({ id, name, url, enabled }) => ({ id, name, url, enabled: enabled !== false })));
    const patch = {
      playlists: lists,
      playlistUrl: lists[0].url,
      hiddenGroups: lines("#sHidden"),
      extraEpg: lines("#sEpg"),
      epgEnabled: $("#sEpgOn").checked,
      hideDead: $("#sHideDead").checked,
      autoPlayLast: $("#sAuto").checked,
      autoCheck: $("#sAutoCheck").checked
    };
    if (!$("#sLocked").disabled) {
      const locked = lines("#sLocked");
      if (locked.length && !pinOn() && !await setPin()) return;
      patch.lockedGroups = locked;
    }
    S.settings = await api.setSettings(patch);
    $("#settings").hidden = true;
    if (urlChanged) await loadPlaylist();
    else {
      applyHidden();
      refreshAll();
      api.epgStart();
    }
    if (!urlChanged) toast("Configurações salvas.");
  }
  const BK_LOCAL = ["lb.favlists", "lb.ov", "lb.ord", "lb.sort", "lb.arch", "lb.mv", "lb.vol"];
  const BK_SET = ["playlists", "playlistUrl", "hiddenGroups", "extraEpg", "epgEnabled", "hideDead", "autoPlayLast", "autoCheck", "lockedGroups", "pin"];
  async function doBackup() {
    const local = { "lb.favlists": S.favs, "lb.ov": S.ov, "lb.ord": S.ord, "lb.sort": S.sort, "lb.arch": S.arch, "lb.vol": video.volume };
    const mv = jget("lb.mv", void 0);
    if (mv !== void 0) local["lb.mv"] = mv;
    const settings = {};
    BK_SET.forEach((k) => S.settings[k] !== void 0 && (settings[k] = S.settings[k]));
    const f = await api.backupSave({ settings, local });
    toast(f ? "Backup salvo em: " + f : "Backup cancelado.", f ? 7e3 : 2e3);
  }
  async function doRestore() {
    if (pinOn() && !S.unlocked && !await askPin("PIN para restaurar")) return;
    const d = await api.backupOpen();
    if (!d) return;
    if (d.error) return toast(d.error, 6e3);
    const ok = await dialog({ title: "Restaurar este backup?", text: "Isso substitui listas, favoritos, nomes, ordem e configurações atuais.", ok: "Restaurar" });
    if (!ok) return;
    BK_LOCAL.forEach((k) => d.local && d.local[k] !== void 0 && jset(k, d.local[k]));
    const patch = {};
    BK_SET.forEach((k) => d.settings && d.settings[k] !== void 0 && (patch[k] = d.settings[k]));
    await api.setSettings(patch);
    toast("Backup restaurado. Recarregando…", 2e3);
    setTimeout(() => location.reload(), 600);
  }
  function toggleFull() {
    if (document.fullscreenElement) document.exitFullscreen();
    else stage.requestFullscreen().catch(() => {
    });
  }
  function kickIdle() {
    stage.classList.remove("idle");
    clearTimeout(S.idleTimer);
    S.idleTimer = setTimeout(() => {
      if (S.mv.on || !video.paused) stage.classList.add("idle");
    }, 3e3);
  }
  function cycleGroup(d) {
    const names = ["__all", ...S.groups.map((g) => g.name)];
    let i = names.indexOf(S.group);
    if (i < 0) i = 0;
    S.group = names[(i + d + names.length) % names.length];
    S.q = "";
    $("#q").value = "";
    refreshAll();
    miniOpen();
  }
  function keyAct(k, e) {
    const ev = e || { preventDefault() {
    }, ctrlKey: false, altKey: false, metaKey: false };
    const dirs = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down" };
    const act = document.activeElement;
    const tag = act ? act.tagName : "";
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(tag);
    if (isTV() && dirs[k] && !typing && e) e.preventDefault();
    const dlgOpen = !$("#dlg").hidden;
    const ov = ["#dlg", "#ctx", "#settings", "#sched"].map((x) => $(x)).find((el) => el && !el.hidden);
    if (k === "Escape") {
      if (isTV()) return goBack();
      if (dlgOpen) {
        if (S.dlgDone) S.dlgDone(null);
        return;
      }
      if (!$("#ctx").hidden) hideCtx();
      else if (S.mini.open) miniClose();
      else if (!$("#sched").hidden) $("#sched").hidden = true;
      else if (!$("#settings").hidden) $("#settings").hidden = true;
      else if (typing) act.blur();
      return;
    }
    if (ov && dirs[k]) {
      const horiz = k === "ArrowLeft" || k === "ArrowRight";
      const own = tag === "SELECT" || tag === "INPUT" && (act.type === "range" ? horiz : horiz && act.type !== "checkbox");
      if (!own && !(tag === "TEXTAREA" && horiz)) {
        ev.preventDefault();
        return navMove(dirs[k], ov);
      }
    }
    if (dlgOpen) return;
    if (ov && ov.id === "ctx" && k === "Enter") return;
    if (ev.ctrlKey || ev.altKey || ev.metaKey) return;
    if (typing) {
      if (act.id === "q" && (k === "ArrowDown" || k === "ArrowUp") && !ov) {
        ev.preventDefault();
        act.blur();
        navMove(dirs[k]);
      }
      return;
    }
    if (!$("#settings").hidden || !$("#sched").hidden) return;
    if (k === "ContextMenu") {
      ev.preventDefault();
      if (S.view === "live") return optMenu();
      if (act && act.matches && act.matches("[data-nav]")) {
        const r = act.getBoundingClientRect();
        act.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: r.left + 30, clientY: r.top + 30 }));
      }
      return;
    }
    if (S.view !== "live") {
      if (dirs[k]) {
        ev.preventDefault();
        return navMove(dirs[k]);
      }
      if (k === "Enter" && act && act.matches && act.matches("[data-nav]") && act.tagName !== "BUTTON") {
        ev.preventDefault();
        return act.click();
      }
      if (k === "/") {
        ev.preventDefault();
        return $("#q").focus();
      }
      if (k.toLowerCase() === "g") return openGuide();
      if (k.toLowerCase() === "h") return showView("home");
      if (k.toLowerCase() === "c") return showView("live");
      return;
    }
    if (isTV()) {
      kickIdle();
      if (k === "Enter" && !$("#alert").hidden) {
        ev.preventDefault();
        return $("#alertGo").click();
      }
      if (S.mini.open && (k === "ArrowLeft" || k === "ArrowRight")) {
        ev.preventDefault();
        return cycleGroup(k === "ArrowLeft" ? -1 : 1);
      }
      if (!S.mini.open && !S.mv.on) {
        if (k === "Enter" || k === "ArrowLeft") {
          ev.preventDefault();
          return miniOpen();
        }
        if (k === "ArrowRight") {
          ev.preventDefault();
          return optMenu();
        }
      }
    }
    const e2 = ev;
    if (S.mini.open) {
      const h = { ArrowUp: () => miniMove(-1), ArrowDown: () => miniMove(1), PageUp: () => miniMove(-8), PageDown: () => miniMove(8), Home: () => miniMove(-1e5), End: () => miniMove(1e5), Enter: miniPick };
      if (h[k]) {
        e2.preventDefault();
        return h[k]();
      }
      if (k.toLowerCase() === "c") return miniClose();
    }
    if (k === "/") {
      e2.preventDefault();
      $("#q").focus();
    } else if (k === " ") {
      e2.preventDefault();
      togglePlay();
    } else if (k === "ArrowUp" || k === "PageUp") {
      e2.preventDefault();
      zap(-1);
    } else if (k === "ArrowDown" || k === "PageDown") {
      e2.preventDefault();
      zap(1);
    } else if (k === "ArrowLeft") S.mv.on ? mvActive((S.mv.active + S.mv.n - 1) % S.mv.n) : video.currentTime -= 10;
    else if (k === "ArrowRight") S.mv.on ? mvActive((S.mv.active + 1) % S.mv.n) : video.currentTime += 10;
    else if (k.toLowerCase() === "a") cycleAr();
    else if (k.toLowerCase() === "v") S.mv.on ? mvExit() : mvEnter();
    else if (k === "Enter") toggleFull();
    else if (k.toLowerCase() === "f") toggleFav(curCh() && curCh().id);
    else if (k.toLowerCase() === "m") {
      video.muted = !video.muted;
      syncMute();
    } else if (k.toLowerCase() === "g") openGuide();
    else if (k.toLowerCase() === "h") showView("home");
    else if (k.toLowerCase() === "c") miniOpen();
    else if (k === "Backspace") {
      const p = S.byId.get(S.prevId);
      if (p) play(p);
      else toast("Ainda não há canal anterior.");
    } else if (k.toLowerCase() === "l") goLive();
    else if (k.toLowerCase() === "r") toggleRec();
    else if (/^\d$/.test(k)) {
      S.numBuf += k;
      $("#status").textContent = "Canal " + S.numBuf;
      clearTimeout(S.numTimer);
      S.numTimer = setTimeout(() => {
        const c = S.all.find((x) => String(x.num) === S.numBuf);
        S.numBuf = "";
        if (c) play(c);
        else toast("Canal não encontrado.");
        setStatus("");
      }, 1300);
    }
  }
  function bind() {
    ["#groups", "#gGroups"].forEach((sel) => $(sel).addEventListener("click", async (e) => {
      const b = e.target.closest(".grp");
      if (!b) return;
      if (b.hasAttribute("data-relock")) return relock();
      if (b.hasAttribute("data-lockg")) {
        if (await askPin("Categoria protegida")) {
          S.group = b.dataset.lockg;
          refreshAll();
        }
        return;
      }
      if (b.hasAttribute("data-add")) {
        const n = await dialog({ title: "Nova lista de favoritos", text: "Ex.: Esportes, Notícias, Crianças", input: true, ok: "Criar" });
        if (!n) return;
        const f = { id: "f" + Date.now().toString(36), name: n, ids: [] };
        S.favs.push(f);
        saveFavs();
        S.group = "fav:" + f.id;
        refreshAll();
        return toast(`Lista "${n}" criada. Use a estrela (ou botão direito) nos canais.`, 5e3);
      }
      S.group = b.dataset.g;
      refreshAll();
      $("#list").scrollTop = 0;
      $("#gScroll").scrollTop = 0;
    }));
    $("#list").addEventListener("click", (e) => {
      const pg = e.target.closest(".pg");
      if (pg) {
        const c = S.byId.get(pg.dataset.pg);
        const p = c && (S.epg[c.id] || []).find((x) => x[0] === +pg.dataset.s);
        if (c && p) programMenu(c, p, e.clientX, e.clientY);
        return;
      }
      const row = e.target.closest(".ch");
      if (!row) return;
      if (e.target.closest("[data-star]")) return toggleFav(row.dataset.id);
      play(S.byId.get(row.dataset.id));
    });
    $("#list").addEventListener("contextmenu", (e) => {
      const row = e.target.closest(".ch");
      const c = row && S.byId.get(row.dataset.id);
      if (!c) return;
      e.preventDefault();
      channelMenu(c, e.clientX, e.clientY);
    });
    ["#groups", "#gGroups"].forEach((sel) => $(sel).addEventListener("contextmenu", (e) => {
      const b = e.target.closest(".grp[data-g]");
      if (!b) return;
      e.preventDefault();
      if (b.dataset.g.startsWith("fav:")) return listMenu(b.dataset.g, e.clientX, e.clientY);
      if (["__all", "__recent", "__hidden"].includes(b.dataset.g)) return;
      groupLockMenu(b.dataset.g, e.clientX, e.clientY);
    }));
    $("#ctx").addEventListener("click", (e) => {
      const b = e.target.closest("button[data-i]");
      if (!b || b.disabled) return;
      const it = $("#ctx")._items[+b.dataset.i];
      hideCtx();
      if (it && it.fn) it.fn();
    });
    document.addEventListener("mousedown", (e) => {
      if (!(e.target.closest && e.target.closest("#ctx"))) hideCtx();
    });
    window.addEventListener("blur", hideCtx);
    $("#list").addEventListener("scroll", hideCtx);
    $("#dlg").addEventListener("mousedown", (e) => {
      if (e.target === $("#dlg") && S.dlgDone) S.dlgDone(null);
    });
    $("#miniList").addEventListener("click", (e) => {
      const row = e.target.closest(".ch");
      if (!row) return;
      S.mini.i = +row.dataset.i;
      miniPick();
    });
    $("#mini").addEventListener("mousemove", miniKick);
    $("#btnSched").onclick = () => {
      renderSched();
      $("#sched").hidden = false;
    };
    $("#schedClose").onclick = () => $("#sched").hidden = true;
    $("#schedList").addEventListener("click", (e) => {
      const b = e.target.closest("[data-rm]");
      if (b) removeSched(b.dataset.rm);
    });
    $("#alertNo").onclick = () => $("#alert").hidden = true;
    $("#alertGo").onclick = () => {
      $("#alert").hidden = true;
      const c = S.byId.get(S.alertCh);
      if (c) play(c);
    };
    const gShift = (h) => {
      S.gOff = h === 0 ? 0 : Math.max(-3, Math.min(24, S.gOff + h));
      buildGuide();
    };
    $("#gPrev").onclick = () => gShift(-3);
    $("#gNow").onclick = () => gShift(0);
    $("#gNext").onclick = () => gShift(3);
    $("#bMini").onclick = () => S.mini.open ? miniClose() : miniOpen();
    $("#bOpt").onclick = (e) => {
      e.stopPropagation();
      optMenu();
    };
    $("#bMulti").onclick = () => S.mv.on ? mvExit() : mvEnter();
    $("#mvExit").onclick = () => mvExit();
    $$("#mvBar [data-n]").forEach((b) => b.onclick = () => mvSetN(+b.dataset.n));
    $("#mvGrid").addEventListener("click", (e) => {
      const el = e.target.closest(".tile");
      if (!el) return;
      const i = +el.dataset.i;
      const t = S.mv.tiles[i];
      if (e.target.closest(".tx")) return mvClear(i);
      mvActive(i);
      if (e.target.closest(".tadd") || !t.ch) miniOpen(i);
    });
    $("#mvGrid").addEventListener("dblclick", (e) => {
      const el = e.target.closest(".tile");
      const t = el && S.mv.tiles[+el.dataset.i];
      if (t && t.ch) mvExit(t.ch);
    });
    $("#sortBtn").onclick = () => {
      S.sort = S.sort === "az" ? "list" : "az";
      jset("lb.sort", S.sort);
      renderList();
      toast(S.sort === "az" ? "Lista em ordem alfabética." : "Lista na ordem original (ou a que você montou).", 2500);
    };
    $("#sReset").onclick = async () => {
      if (!await dialog({ title: "Limpar personalizações?", text: "Volta nomes, canais ocultos e ordem ao original. Suas listas de favoritos ficam.", ok: "Limpar" })) return;
      S.ov = {};
      S.ord = {};
      S.sort = "list";
      saveOv();
      saveOrd();
      jset("lb.sort", "list");
      applyHidden();
      refreshAll();
      toast("Personalizações removidas.");
    };
    document.addEventListener(
      "error",
      (e) => {
        const img = e.target;
        if (img.tagName !== "IMG") return;
        const row = img.closest(".ch");
        const c = row && S.byId.get(row.dataset.id);
        if (c) img.parentElement.innerHTML = `<i>${esc(initials(dispName(c)))}</i>`;
        else img.remove();
      },
      true
    );
    let qT;
    $("#q").addEventListener("input", (e) => {
      clearTimeout(qT);
      qT = setTimeout(() => {
        if (S.view !== "live") showView("live", true);
        S.q = e.target.value;
        renderList();
      }, 120);
    });
    $("#q").addEventListener("keydown", (e) => {
      if (e.key !== "Enter" || !isTV()) return;
      e.preventDefault();
      clearTimeout(qT);
      if (S.view !== "live") showView("live", true);
      S.q = $("#q").value;
      renderList();
      $("#q").blur();
      miniOpen();
    });
    document.addEventListener("error", (e) => {
      const im = e.target;
      if (!im || im.tagName !== "IMG" || !im.dataset.i) return;
      const i = document.createElement("i");
      i.textContent = im.dataset.i;
      im.replaceWith(i);
    }, true);
    $$("#tabs .tab").forEach((t) => t.onclick = () => t.dataset.view === "guide" ? openGuide() : showView(t.dataset.view));
    const progOfCell = (el) => {
      const c = S.byId.get(el.dataset.id);
      const p = c && (S.epg[c.id] || []).find((x) => x[0] === +el.dataset.s);
      return c && p ? [c, p] : [null, null];
    };
    $("#gScroll").addEventListener("click", (e) => {
      const st = e.target.closest("[data-gstar]");
      if (st) return toggleFav(st.dataset.gstar);
      const pr = e.target.closest(".g-prog");
      if (pr) {
        const [c, p] = progOfCell(pr);
        if (!c) return;
        if (p[0] <= Date.now() || p[1] <= Date.now()) play(c);
        else programMenu(c, p, e.clientX, e.clientY);
        return;
      }
      const el = e.target.closest(".g-ch");
      if (el) play(S.byId.get(el.dataset.id));
    });
    $("#gScroll").addEventListener("contextmenu", (e) => {
      const pr = e.target.closest(".g-prog");
      if (!pr) return;
      const [c, p] = progOfCell(pr);
      if (!c) return;
      e.preventDefault();
      programMenu(c, p, e.clientX, e.clientY);
    });
    const guideFocus = (e) => {
      const pr = e.target.closest && e.target.closest(".g-prog");
      if (!pr) return;
      const [c, p] = progOfCell(pr);
      if (c) setGuideInfo(c, p);
    };
    $("#gScroll").addEventListener("mouseover", guideFocus);
    $("#gScroll").addEventListener("focusin", guideFocus);
    $("#rows").addEventListener("click", (e) => {
      const rb = e.target.closest(".rbtn");
      if (rb) {
        const rail = rb.parentElement.querySelector(".rail");
        return rail.scrollBy({ left: +rb.dataset.dir * rail.clientWidth * 0.8, behavior: "smooth" });
      }
      const all = e.target.closest(".all");
      if (all) {
        S.group = all.dataset.g;
        S.q = "";
        $("#q").value = "";
        showView("live", true);
        return refreshAll();
      }
      const cd = e.target.closest(".card");
      if (cd) play(S.byId.get(cd.dataset.id));
    });
    $("#rows").addEventListener("contextmenu", (e) => {
      const cd = e.target.closest(".card");
      const c = cd && S.byId.get(cd.dataset.id);
      if (!c) return;
      e.preventDefault();
      channelMenu(c, e.clientX, e.clientY);
    });
    $("#heroBody").addEventListener("click", (e) => {
      const c = S.heroItems[S.heroI];
      if (!c) return;
      if (e.target.closest("#heroPlay")) play(c);
      else if (e.target.closest("#heroFav")) {
        toggleFav2(c.id);
        renderHero();
      }
    });
    $("#heroDots").addEventListener("click", (e) => {
      const d = e.target.closest("button");
      if (!d) return;
      S.heroI = +d.dataset.i;
      renderHero();
    });
    $("#btnRefresh").onclick = async () => {
      if (await loadPlaylist()) toast("Lista atualizada.");
    };
    $("#btnCheck").onclick = runCheck;
    $("#btnSettings").onclick = openSettings;
    $("#setClose").onclick = () => $("#settings").hidden = true;
    $("#sSave").onclick = saveSettings;
    $("#sOpenRec").onclick = () => api.openRecordings();
    $("#sAddList").onclick = () => $("#sLists").insertAdjacentHTML("beforeend", listRow({ id: "p" + Date.now().toString(36), name: "", url: "", enabled: true }));
    $("#sLists").addEventListener("click", (e) => {
      const x = e.target.closest(".lx");
      if (x) x.closest(".lrow").remove();
    });
    $("#sPin").onclick = async () => {
      await setPin();
      syncParentalUi();
    };
    $("#sPinOff").onclick = async () => {
      await removePin();
      syncParentalUi();
    };
    $("#sBackup").onclick = doBackup;
    $("#sRestore").onclick = doRestore;
    $("#bPrev").onclick = () => zap(-1);
    $("#bNext").onclick = () => zap(1);
    $("#bPlay").onclick = togglePlay;
    $("#bMute").onclick = () => {
      video.muted = !video.muted;
      syncMute();
    };
    $("#vol").oninput = (e) => {
      video.volume = +e.target.value;
      video.muted = false;
      jset("lb.vol", video.volume);
      syncMute();
    };
    $("#bFav").onclick = () => curCh() && toggleFav(curCh().id);
    $("#bRec").onclick = () => toggleRec();
    $("#bPip").onclick = () => {
      if (document.pictureInPictureElement) document.exitPictureInPicture();
      else if (video.readyState >= 2) video.requestPictureInPicture().catch(() => {
      });
    };
    $("#bFull").onclick = toggleFull;
    $("#liveBtn").onclick = goLive;
    $("#srcSel").onchange = (e) => {
      S.idx = +e.target.value;
      startSource();
    };
    const seek = $("#seek");
    seek.addEventListener("pointerdown", () => seeking = true);
    seek.addEventListener("pointerup", () => seeking = false);
    seek.addEventListener("input", () => video.currentTime = +seek.value);
    document.addEventListener("fullscreenchange", () => {
      const host = document.fullscreenElement === stage ? stage : document.body;
      ["#ctx", "#alert", "#toast", "#dlg"].forEach((id) => host.appendChild($(id)));
    });
    video.addEventListener("pause", syncPlayIcon);
    video.addEventListener("play", syncPlayIcon);
    video.addEventListener("volumechange", () => {
      syncMute();
      if (S.mv.on) mvAudio();
    });
    video.addEventListener("dblclick", toggleFull);
    video.addEventListener("click", () => video.paused ? video.play() : video.pause());
    stage.addEventListener("mousemove", kickIdle);
    ["#settings", "#sched"].forEach(
      (id) => $(id).addEventListener("mousedown", (e) => {
        if (e.target === $(id)) $(id).hidden = true;
      })
    );
    document.addEventListener("keydown", (e) => keyAct(e.key, e));
    api.on("epg:data", (data) => {
      S.epg = data || {};
      S.epgCount = Object.keys(S.epg).filter((id) => S.byId.has(id)).length;
      refreshNow();
      if (S.q) renderList();
      updateFoot();
      tick();
      if (S.view === "guide") buildGuide(guideKeep());
      if (S.view === "home") renderHome(true);
      if (S.mini.open) renderMini();
    });
    api.on("check:progress", ({ done, total }) => {
      $("#checkLabel").textContent = `Verificando ${done}/${total}`;
    });
    setInterval(tick, 1e3);
    setInterval(sleepCheck, 1e3);
    setInterval(schedTick, 5e3);
    setInterval(refreshNow, 3e4);
  }
  async function init() {
    S.settings = await api.getSettings();
    video.volume = jget("lb.vol", 1);
    $("#vol").value = video.volume;
    syncMute();
    bind();
    document.body.dataset.view = "home";
    showMsg("<b>LiveBox</b>Escolha um canal na lista.<br>Dica: ↑ ↓ trocam de canal, / busca, G abre o guia.");
    S.checks = await api.getChecks();
    const ok = await loadPlaylist();
    schedChanged();
    if (!ok) return;
    startHeroTimer();
    if (S.settings.autoPlayLast !== false) {
      const c = S.byId.get(jget("lb.last", ""));
      if (c) play(c);
    }
    if (S.settings.autoCheck) {
      const ts = Object.values(S.checks).reduce((m, v) => Math.max(m, v.at || 0), 0);
      if (Date.now() - ts > 12 * 36e5) runCheck();
    }
  }
  init();
})();
