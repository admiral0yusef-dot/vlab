/* ============================================================
   JG Net — اللعب الجماعي برمز غرفة (مجاني عبر Supabase Realtime Broadcast)
   الأنماط: 🤝 تحالف (الجميع فريق واحد نحو هدف مشترك) · ⚔️ منافسة فردية · 🔴🔵 فريقان
   - يرى كل لاعب الآخرين داخل المختبر بأسمائهم وألوان فرقهم
   - لا أسئلة دورية: الأسئلة فقط عند فتح البوابات وعبور المراحل وإنجاز المهام، وكل مهمة تُحسب للفريق
   - تُحتسب أيضاً: الأعداء المهزومون، أسئلة المحطات، ومراحل «تحدي المراحل»
   - احتياط: BroadcastChannel للعب بين نوافذ الجهاز نفسه (وللاختبار)
   ============================================================ */
(function () {
  'use strict';
  var JG = window.JG, G = JG.G, U = JG.UI, A = JG.Audio, M4 = JG.M4;
  var RT_URL = 'wss://uxjsbkopkizixvlzqmpk.supabase.co/realtime/v1/websocket';
  var RT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4anNia29wa2l6aXh2bHpxbXBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUzNzcwNzYsImV4cCI6MjExMDk1MzA3Nn0.KcFrYSAm0PHcIyImwMaqxRajMJQzgZYpwRSHu4P5Y0g'; // مفتاح عام (anon) — الحماية بإعدادات الخادم
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var ls = function (k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } };
  var rid = function (n) { var A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', s = ''; for (var i = 0; i < n; i++) s += A[Math.floor(Math.random() * A.length)]; return s; };
  var MODES = { ally: '🤝 تحالف', solo: '⚔️ منافسة فردية', teams: '🔴🔵 فريقان' };
  var TEAMC = { r: '#ef4444', b: '#3b82f6', a: '#22c55e' };

  var NET = JG.NET = { room: null, me: { id: (function () { try { var v = sessionStorage.getItem('jg_pid'); if (!v) { v = rid(10); sessionStorage.setItem('jg_pid', v); } return v; } catch (e) { return rid(10); } })() }, peers: {}, host: false, hostId: null, mode: 'ally', rounds: 8, phase: 'idle', board: {}, ally: { pts: 0, goal: 0 }, round: 0, q: null, status: 'off', link: null };

  /* ---------- قناة الاتصال ---------- */
  function Link(code, onMsg, onStatus) {
    var self = this, topic = 'realtime:jg-' + code, ws = null, ref = 1, hb = null, closed = false, tries = 0, seen = {}, bc = null;
    this.ok = false;
    function deliver(m) { if (!m || !m.mid || seen[m.mid]) return; seen[m.mid] = 1; if (m.from === NET.me.id) return; onMsg(m); }
    try { bc = new BroadcastChannel('jg-' + code); bc.onmessage = function (e) { deliver(e.data); }; } catch (e) { bc = null; }
    function open() {
      if (closed) return;
      try { ws = new WebSocket(RT_URL + '?apikey=' + encodeURIComponent(RT_KEY) + '&vsn=1.0.0'); } catch (e) { onStatus('error'); return; }
      ws.onopen = function () {
        ws.send(JSON.stringify({ topic: topic, event: 'phx_join', payload: { config: { broadcast: { ack: false, self: false }, presence: { key: '' }, postgres_changes: [], private: false }, access_token: RT_KEY }, ref: String(ref++), join_ref: '1' }));
        clearInterval(hb); hb = setInterval(function () { try { ws.send(JSON.stringify({ topic: 'phoenix', event: 'heartbeat', payload: {}, ref: String(ref++) })); } catch (e) {} }, 25000);
      };
      ws.onmessage = function (e) {
        var m; try { m = JSON.parse(e.data); } catch (x) { return; }
        if (m.topic === topic && m.event === 'phx_reply' && m.payload && m.payload.status === 'ok' && !self.ok) { self.ok = true; tries = 0; onStatus('online'); }
        else if (m.topic === topic && m.event === 'phx_reply' && m.payload && m.payload.status === 'error') onStatus('error');
        else if (m.topic === topic && m.event === 'broadcast' && m.payload) deliver(m.payload.payload);
        else if (m.topic === topic && (m.event === 'phx_error' || m.event === 'phx_close')) { self.ok = false; onStatus('reconnecting'); }
      };
      ws.onclose = function () { self.ok = false; clearInterval(hb); if (closed) return; onStatus(tries > 2 ? 'error' : 'reconnecting'); tries++; setTimeout(open, Math.min(8000, 800 * tries)); };
      ws.onerror = function () {};
    }
    this.send = function (m) {
      m.from = NET.me.id; m.mid = m.mid || rid(12);
      if (bc) try { bc.postMessage(m); } catch (e) {}
      if (ws && ws.readyState === 1 && self.ok) try { ws.send(JSON.stringify({ topic: topic, event: 'broadcast', payload: { type: 'broadcast', event: 'jg', payload: m }, ref: String(ref++), join_ref: '1' })); } catch (e) {}
    };
    this.close = function () { closed = true; clearInterval(hb); try { ws && ws.close(); } catch (e) {} try { bc && bc.close(); } catch (e) {} };
    if (/^https?:$|^file:$/.test(location.protocol) && navigator.onLine !== false) open(); else onStatus('local');
  }

  /* ---------- الحالة ---------- */
  function meInfo() { var g = JG.GRADE || {}; return { name: NET.me.name || 'لاعب', grade: g.g || 0, gl: g.label ? g.label() : '', team: NET.me.team || 'a', host: NET.host, mode: NET.mode, rounds: NET.rounds, phase: NET.phase }; }
  NET.send = function (t, o) { if (!NET.link) return; o = o || {}; o.t = t; NET.link.send(o); };
  function hello() { NET.send('hello', meInfo()); }
  function onMsg(m) {
    var p = NET.peers[m.from] || (NET.peers[m.from] = { id: m.from, name: '...', team: 'a', pts: 0 });
    p.seen = Date.now();
    switch (m.t) {
      case 'hello': p.name = m.name; p.grade = m.grade; p.gl = m.gl; p.team = m.team; p.host = m.host; if (m.host) { NET.hostId = m.from; if (!NET.host) { NET.mode = m.mode; NET.rounds = m.rounds; } } if (m.host && m.phase === 'play' && NET.phase === 'lobby') startLocal(); if (NET.host) { ensureBoard(m.from, p); pushBoard(); } refresh(); break;
      case 'join': hello(); if (NET.host) { ensureBoard(m.from, p); pushBoard(); } break;
      case 'pos': p.tx = m.x; p.tz = m.z; p.ty = m.y || 0; p.th = m.h; p.sp = m.s; p.rm = m.r; if (p.x === undefined) { p.x = m.x; p.z = m.z; p.y = p.ty; p.h = m.h; } break;
      case 'start': NET.mode = m.mode; NET.rounds = m.rounds; NET.hostId = m.from; startLocal(); break;
      case 'q': showQ(m); break;
      case 'ans': if (NET.host) hostAns(m.from, m); break;
      case 'report': if (NET.host) hostReport(m.from, m); break;
      case 'board': NET.board = m.board; NET.ally = m.ally; NET.round = m.round; NET.teamPts = m.teams; hud(); if (U.open && U.open.mpBoard) U.open.repaint && U.open.repaint(); break;
      case 'end': NET.board = m.board; NET.ally = m.ally; NET.teamPts = m.teams; NET.phase = 'done'; results(); break;
      case 'bye': delete NET.peers[m.from]; if (NET.host) { delete NET.board[m.from]; pushBoard(); } refresh(); break;
      case 'kick': if (m.to === NET.me.id) { NET.leave(); U.toast('أخرجك المضيف من الغرفة'); } break;
    }
  }
  function onStatus(s) { NET.status = s; refresh(); hud(); }

  /* ---------- الغرفة ---------- */
  NET.create = function (mode, rounds) {
    NET.leave(true); NET.room = rid(6); NET.host = true; NET.hostId = NET.me.id; NET.mode = mode || 'ally'; NET.rounds = rounds || 5; NET.phase = 'lobby'; NET.board = {}; NET.round = 0;
    NET.me.team = NET.mode === 'teams' ? 'r' : 'a';
    NET.link = new Link(NET.room, onMsg, onStatus); ensureBoard(NET.me.id, { name: NET.me.name, team: NET.me.team });
    startBeat(); setTimeout(hello, 300);
  };
  NET.join = function (code) {
    code = String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); if (code.length !== 6) { U.toast('رمز الغرفة 6 خانات'); return false; }
    NET.leave(true); NET.room = code; NET.host = false; NET.phase = 'lobby'; NET.board = {}; NET.me.team = 'a';
    NET.link = new Link(code, onMsg, onStatus); startBeat(); setTimeout(function () { NET.send('join', {}); hello(); }, 300); return true;
  };
  NET.leave = function (silent) {
    if (NET.link) { NET.send('bye', {}); NET.link.close(); } NET.link = null; NET.room = null; NET.peers = {}; NET.host = false; NET.phase = 'idle'; NET.q = null;
    clearInterval(NET._beat); clearInterval(NET._rt); NET.status = 'off'; hud(); if (!silent) refresh();
  };
  function startBeat() {
    clearInterval(NET._beat);
    NET._beat = setInterval(function () {
      if (!NET.room) return; hello();
      var now = Date.now(); Object.keys(NET.peers).forEach(function (id) { var p = NET.peers[id]; if (now - (p.seen || 0) > 9000) { delete NET.peers[id]; if (NET.host) { delete NET.board[id]; pushBoard(); } } });
      if (!NET.host && NET.hostId && !NET.peers[NET.hostId] && NET.phase !== 'idle') { // انتقال الاستضافة عند مغادرة المضيف
        var ids = Object.keys(NET.peers).concat([NET.me.id]).sort(); if (ids[0] === NET.me.id) { NET.host = true; NET.hostId = NET.me.id; U.toast('أصبحتَ مضيف الغرفة'); if (NET.phase === 'play') hostLoop(); }
      }
      refresh();
    }, 2000);
  }

  /* ---------- المضيف: النقاط والجولات ---------- */
  function ensureBoard(id, p) { var b = NET.board[id] || (NET.board[id] = { name: p.name || 'لاعب', team: p.team || 'a', pts: 0, ok: 0, n: 0, kills: 0, arena: 0, ms: 0 }); b.name = p.name || b.name; b.team = p.team || b.team; return b; }
  function teamTotals() { var t = { r: 0, b: 0, a: 0 }; Object.keys(NET.board).forEach(function (id) { var b = NET.board[id]; t[b.team] = (t[b.team] || 0) + b.pts; }); return t; }
  function pushBoard() {
    if (!NET.host) return; var n = Math.max(1, Object.keys(NET.board).length); NET.ally.goal = n * NET.rounds; NET.ally.pts = Object.keys(NET.board).reduce(function (s, id) { return s + (NET.board[id].ms || 0); }, 0);
    NET.teamPts = teamTotals(); NET.send('board', { board: NET.board, ally: NET.ally, round: NET.round, teams: NET.teamPts }); hud();
  }
  function add(id, pts, f) { var p = id === NET.me.id ? { name: NET.me.name, team: NET.me.team } : (NET.peers[id] || {}); var b = ensureBoard(id, p); b.pts += pts; if (f) f(b); }
  function hostAns(id, m) {
    var Q = NET.q; if (!Q || m.rid !== Q.rid || Q.got[id]) return; Q.got[id] = 1; add(id, 0, function (b) { b.n++; });
    if (m.ok) { var pts = 100 + Math.round(50 * Math.max(0, 1 - m.ms / 20000)); if (!Q.first) { Q.first = id; pts += 25; } add(id, pts, function (b) { b.ok++; }); }
    pushBoard();
    if (Object.keys(Q.got).length >= Object.keys(NET.board).length) { clearTimeout(Q.tm); Q.tm = setTimeout(nextRound, 2500); }
  }
  function hostReport(id, m) { var pts = (m.kill ? 10 * m.kill : 0) + (m.correct ? 100 * m.correct : 0) + (m.mission ? 50 * m.mission : 0); add(id, pts, function (b) { if (m.kill) b.kills += m.kill; if (m.ans) b.n += m.ans; if (m.correct) b.ok += m.correct; if (m.mission) b.ms = (b.ms || 0) + m.mission; if (m.arena) b.arena = Math.max(b.arena, m.arena); }); pushBoard(); checkEnd(); }
  /* نهاية اللعبة بالمهام لا بالوقت: تحالف = مجموع المهام، فردي = أول لاعب، فرق = أول فريق */
  function checkEnd() {
    if (!NET.host || NET.phase !== 'play') return; var B = NET.board, ids = Object.keys(B), T = NET.rounds, done = false;
    if (NET.mode === 'ally') done = NET.ally.pts >= NET.ally.goal;
    else if (NET.mode === 'solo') done = ids.some(function (id) { return (B[id].ms || 0) >= T; });
    else { var tm = { r: [0, 0], b: [0, 0] }; ids.forEach(function (id) { var t = tm[B[id].team]; if (t) { t[0] += B[id].ms || 0; t[1]++; } }); done = ['r', 'b'].some(function (k) { return tm[k][1] && tm[k][0] >= T * tm[k][1]; }); }
    if (done) { NET.phase = 'done'; NET.send('end', { board: NET.board, ally: NET.ally, teams: teamTotals() }); setTimeout(results, 600); }
  }
  /* كل سؤال يُجاب داخل الغرفة يُحسب للاعب، وكل بلورة مهمة منجزة */
  (function () { var Z = JG.Puz, om = Z.mcq; Z.mcq = function (Gm, o, cb) { if (cb && cb._w) return om.call(Z, Gm, o, cb); var w = function (ok) { if (NET.room && NET.phase === 'play') NET.report({ ans: 1, correct: ok ? 1 : 0 }); cb && cb.apply(this, arguments); }; w._w = 1; return om.call(Z, Gm, o, w); };
    var ot = G.takeCrystal; if (ot) G.takeCrystal = function (z) { ot.apply(G, arguments); if (NET.room) NET.report({ mission: 1 }); }; })();
  NET.report = function (o) { if (!NET.room || NET.phase !== 'play') return; if (NET.host) hostReport(NET.me.id, o); else NET.send('report', o); };
  function pickQ() {
    var DB = JG.DB, q = DB.pick({ avoid: (NET._used || []) }); if (!q) return null; (NET._used = NET._used || []).push(q.id);
    var ord = q.options.map(function (_, i) { return i; }).sort(function () { return Math.random() - .5; });
    return { q: q.question, o: ord.map(function (i) { return q.options[i]; }), a: ord.indexOf(q.answer), src: q.lesson || '' };
  }
  function nextRound() {
    if (!NET.host || NET.phase !== 'play') return;
    if (NET.round >= NET.rounds) { NET.phase = 'done'; NET.send('end', { board: NET.board, ally: NET.ally, teams: teamTotals() }); results(); return; }
    var q = pickQ(); if (!q) return; NET.round++;
    NET.q = { rid: NET.room + NET.round, got: {}, first: null }; var msg = { rid: NET.q.rid, n: NET.round, of: NET.rounds, q: q.q, o: q.o, a: q.a, src: q.src, sec: 20 };
    NET.send('q', msg); showQ(msg); pushBoard();
    clearTimeout(NET.q.tm); NET.q.tm = setTimeout(nextRound, 45000);
  }
  function hostLoop() { clearTimeout(NET._first); }   // لم تعد هناك أسئلة دورية
  NET.start = function () {
    if (!NET.host) return; NET.phase = 'play'; NET.round = 0; NET._used = [];
    Object.keys(NET.board).forEach(function (id) { var b = NET.board[id]; b.pts = b.ok = b.n = b.kills = b.arena = b.ms = 0; });
    NET.send('start', { mode: NET.mode, rounds: NET.rounds }); startLocal(); hostLoop(); pushBoard();
  };

  /* ---------- اللاعب: بدء اللعب وجولات الأسئلة ---------- */
  function startLocal() {
    NET.phase = 'play';
    var go = function () { if (G.mode !== 'play') { G.save.name = G.save.name || NET.me.name; G.start(!G.hasSave()); } U.screen(null); G.paused = false; U.banner('غرفة ' + NET.room, MODES[NET.mode] + ' · افتحوا البوابات وأنجزوا المهام', '#a855f7'); hud(); };
    if (JG.GRADE && JG.GRADE.g) JG.GRADE.ensure(go); else go();
  }
  function showQ(m) {
    NET.cur = m; var t0 = Date.now(), answered = false;
    var open = function () {
      if (U.open && !U.open.mpQ) { setTimeout(open, 600); return; }
      var left = m.sec * 1000 - (Date.now() - t0); if (left < 2500) return;
      A.play('door');
      U.modal({ title: 'جولة ' + m.n + ' من ' + m.of + ' — ' + MODES[NET.mode], icon: '⚡', mpQ: 1, render: function (el, close) {
        var timer = null, paint = function () {
          var rem = Math.max(0, Math.ceil((m.sec * 1000 - (Date.now() - t0)) / 1000));
          el.innerHTML = '<div class="pz-meta"><span>⏱ ' + rem + ' ث</span><span>' + esc(m.src || '') + '</span><span>الأسرع يربح نقاطاً أكثر</span></div><div class="pz-q">' + JG.Puz.fmt(m.q) + '</div><div class="pz-ops">' +
            m.o.map(function (o, i) { return '<button class="pz-op" data-i="' + i + '"><b>' + 'أبجد'[i] + '</b><span>' + JG.Puz.fmt(o) + '</span></button>'; }).join('') + '</div><div class="pz-foot"><span class="pz-msg" id="mpMsg"></span></div>';
          el.querySelectorAll('.pz-op').forEach(function (b) { b.onclick = function () {
            if (answered) return; answered = true; clearInterval(timer); var i = +b.dataset.i, ok = i === m.a, ms = Date.now() - t0;
            b.classList.add(ok ? 'ok' : 'bad'); if (!ok) el.querySelector('.pz-op[data-i="' + m.a + '"]').classList.add('ok'); A.play(ok ? 'ok' : 'bad');
            el.querySelectorAll('.pz-op').forEach(function (x) { x.disabled = true; });
            if (NET.host) hostAns(NET.me.id, { rid: m.rid, ok: ok, ms: ms }); else NET.send('ans', { rid: m.rid, ok: ok, ms: ms });
            el.querySelector('#mpMsg').innerHTML = ok ? '✔ صحيح! +' + (100 + Math.round(50 * Math.max(0, 1 - ms / 20000))) + ' نقطة' : '✖ الإجابة الصحيحة مظللة بالأخضر';
            setTimeout(close, 1800);
          }; });
          JG.UI.fitEq && JG.UI.fitEq(el);
        };
        paint(); timer = setInterval(function () { var rem = m.sec * 1000 - (Date.now() - t0); var s = el.querySelector('.pz-meta span'); if (s) s.textContent = '⏱ ' + Math.max(0, Math.ceil(rem / 1000)) + ' ث'; if (rem <= 0) { clearInterval(timer); if (!answered) { answered = true; if (NET.host) hostAns(NET.me.id, { rid: m.rid, ok: false, ms: 20000 }); else NET.send('ans', { rid: m.rid, ok: false, ms: 20000 }); } close(); } }, 250);
      } });
    };
    open();
  }
  function ranked() { return Object.keys(NET.board).map(function (id) { var b = NET.board[id]; return Object.assign({ id: id }, b); }).sort(function (a, b) { return b.pts - a.pts; }); }
  function results() {
    clearTimeout(NET._first); var R = ranked(), T = NET.teamPts || teamTotals(), me = R.findIndex(function (r) { return r.id === NET.me.id; });
    var head = NET.mode === 'ally' ? (NET.ally.pts >= NET.ally.goal ? '🏆 نجح التحالف! أنجزتم ' + NET.ally.pts + ' من ' + NET.ally.goal + ' مهمة' : 'أنجز التحالف ' + NET.ally.pts + ' من ' + NET.ally.goal + ' مهمة — حاولوا مرة أخرى!')
      : NET.mode === 'teams' ? (T.r === T.b ? '🤝 تعادل الفريقان (' + T.r + ')' : (T.r > T.b ? '🔴 فاز الفريق الأحمر ' : '🔵 فاز الفريق الأزرق ') + Math.max(T.r, T.b) + ' مقابل ' + Math.min(T.r, T.b))
      : (R[0] ? '🥇 الفائز: ' + esc(R[0].name) + ' (' + R[0].pts + ' نقطة)' : '');
    U.modal({ title: 'نتائج غرفة ' + NET.room, icon: '🏁', render: function (el, close) {
      el.innerHTML = '<div class="pz-q">' + head + '</div>' + boardHTML(R) + (me >= 0 ? '<p style="text-align:center">ترتيبك: <b>' + (me + 1) + '</b> من ' + R.length + '</p>' : '') +
        '<div class="pz-foot">' + (NET.host ? '<button class="pz-go" id="mpAgain">↻ تحدٍّ جديد بنفس الغرفة</button>' : '') + '<button class="pz-go" id="mpClose">متابعة اللعب</button></div>';
      var a = el.querySelector('#mpAgain'); if (a) a.onclick = function () { close(); NET.phase = 'lobby'; NET.start(); };
      el.querySelector('#mpClose').onclick = close;
    } });
  }
  function boardHTML(R) {
    return '<table class="mpT"><tr><th>#</th><th>اللاعب</th><th>نقاط</th><th>صحيح</th><th>أعداء</th><th>مرحلة</th></tr>' + R.map(function (r, i) {
      return '<tr class="' + (r.id === NET.me.id ? 'me' : '') + '"><td>' + ['🥇', '🥈', '🥉'][i] || (i + 1) + '</td><td><i style="background:' + TEAMC[r.team] + '"></i>' + esc(r.name) + '</td><td><b>' + r.pts + '</b></td><td>' + r.ok + '/' + r.n + '</td><td>' + r.kills + '</td><td>' + (r.arena || '—') + '</td></tr>'; }).join('') + '</table>';
  }

  /* ---------- مزامنة المواقع ورسم اللاعبين الآخرين ---------- */
  var lastSent = 0, lastPos = '';
  setInterval(function () {
    if (!NET.room || NET.phase !== 'play' || G.mode !== 'play' || !G.player) return;
    var P = G.player, k = P.pos[0].toFixed(1) + P.pos[2].toFixed(1) + P.h.toFixed(1), now = Date.now();
    if (k === lastPos && now - lastSent < 2000) return; lastPos = k; lastSent = now;
    NET.send('pos', { x: +P.pos[0].toFixed(2), z: +P.pos[2].toFixed(2), y: +P.pos[1].toFixed(2), h: +P.h.toFixed(2), s: +(P.speed || 0).toFixed(1), r: G.roomId });
  }, 220);
  var origRender = G.render;
  G.render = function () {
    origRender.call(G);
    if (!NET.room || NET.phase !== 'play' || G.mode !== 'play') return;
    var R = G.R, t = G.t, now = Date.now();
    Object.keys(NET.peers).forEach(function (id) {
      var p = NET.peers[id]; if (p.tx === undefined || now - (p.seen || 0) > 6000) return;
      if (!p.pl) { p.pl = new JG.Player(R); p.phase = 0; }
      p.x += (p.tx - p.x) * .25; p.z += (p.tz - p.z) * .25; p.y += ((p.ty || 0) - p.y) * .3; var dh = ((p.th - p.h + Math.PI * 3) % (Math.PI * 2)) - Math.PI; p.h += dh * .3;
      var pl = p.pl; pl.pos = [p.x, p.y, p.z]; pl.h = p.h; pl.speed = p.sp || 0; pl.phase = (pl.phase || 0) + (p.sp || 0) * .016 * 2.2; pl.ground = p.y < .05; pl.hurtT = 0; pl.inv = 0; pl.carry = null; pl.emote = null;
      pl.mode = p.team === 'b' ? 'base' : 'acid'; pl.remote = true;
      pl.coatC = p.team === 'r' ? [1, .3, .35] : p.team === 'b' ? [.3, .6, 1] : [.75, .4, 1];   // اللاعبون الآخرون: بنفسجي (أو لون الفريق)
      try { pl.draw(R, t, false); } catch (e) {}
      var lab = (p.name || 'لاعب') + (p.team === 'r' ? ' 🔴' : p.team === 'b' ? ' 🔵' : '');
      if (p._lab !== lab) { p._lab = lab; p._tex = R.texture(JG.labelCanvas(lab, { fs: 34, bg: 'rgba(8,12,28,.82)', col: '#fff', bd: TEAMC[p.team] || '#a855f7' }), p._tex); }
      R.sprite(p._tex, p.x, p.y + 2.45, p.z, 1.9, .42);
    });
    var me = G.player; if (me) { if (!NET._meTex) NET._meTex = R.texture(JG.labelCanvas('▼ أنت', { fs: 34, bg: 'rgba(8,12,28,.82)', col: '#fde047', bd: '#fde047' })); R.sprite(NET._meTex, me.pos[0], me.pos[1] + 2.45, me.pos[2], 1.3, .42); }
  };
  /* الأعداء المهزومون تُحتسب في الغرفة */
  var origHit = G.hitFoe;
  G.hitFoe = function (f, s) { var was = f.dead; origHit.call(G, f, s); if (!was && f.dead) NET.report({ kill: 1 }); };

  /* ---------- شاشة اللعب الجماعي ---------- */
  function playersHTML() {
    var list = [{ id: NET.me.id, name: NET.me.name, team: NET.me.team, host: NET.host, gl: JG.GRADE && JG.GRADE.label ? JG.GRADE.label() : '' }].concat(Object.keys(NET.peers).map(function (id) { return NET.peers[id]; }));
    return '<div class="mpPl">' + list.map(function (p) { return '<div><i style="background:' + (TEAMC[p.team] || '#a855f7') + '"></i><b>' + esc(p.name || '...') + '</b>' + (p.id === NET.me.id ? ' (أنت)' : '') + (p.host ? ' <span class="h">مضيف</span>' : '') + '<small>' + esc(p.gl || '') + '</small></div>'; }).join('') + '</div>';
  }
  var ST = { connecting: 'جارٍ الاتصال…', online: '🟢 متصل', reconnecting: '🟡 إعادة الاتصال…', error: '🔴 تعذّر الاتصال بخادم اللعب (يعمل بين نوافذ هذا الجهاز فقط)', local: '🟡 وضع محلي', off: '' };
  U.SC.multi = function (Gm, back) {
    NET.me.name = NET.me.name || (document.getElementById('pName') || {}).value || Gm.save.name || '';
    if (!NET.room) {
      var invite = (location.search.match(/[?&]room=([A-Z0-9]{6})/i) || [])[1] || '';
      return '<h2>👥 اللعب الجماعي</h2><p class="mpP">العبوا معاً في الوقت نفسه من أجهزة مختلفة: أنشئ غرفة وأرسل رمزها لأصدقائك، أو ادخل برمز وصلك.</p>' +
        '<div class="frm"><label>اسمك<input id="mpName" maxlength="24" value="' + esc(NET.me.name) + '" placeholder="اكتب اسمك"></label></div>' +
        '<div class="mpBox"><b>إنشاء غرفة جديدة</b><div class="seg" id="mpMode">' + Object.keys(MODES).map(function (k) { return '<button type="button" data-m="' + k + '" class="' + (NET.mode === k ? 'on' : '') + '">' + MODES[k] + '</button>'; }).join('') + '</div>' +
        '<div class="seg" id="mpRounds">' + [3, 5, 8].map(function (n) { return '<button type="button" data-r="' + n + '" class="' + (NET.rounds === n ? 'on' : '') + '">' + n + ' مهام</button>'; }).join('') + '</div>' +
        '<small>الأسئلة من صف المضيف: ' + esc(JG.GRADE && JG.GRADE.g ? JG.GRADE.label() : 'اختر صفك في الشاشة الرئيسية أولاً') + '</small><button class="sbtn big" data-a="mpCreate">➕ إنشاء غرفة</button></div>' +
        '<div class="mpBox"><b>الدخول إلى غرفة</b><input id="mpCode" maxlength="6" dir="ltr" placeholder="رمز من 6 خانات" value="' + esc(invite) + '" style="text-transform:uppercase;letter-spacing:4px;text-align:center;font-weight:800"><button class="sbtn" data-a="mpJoin">🚪 دخول</button></div>' +
        '<div class="btns">' + back + '</div>';
    }
    NET._shown = NET.mode + NET.rounds + NET.phase + NET.host;
    var link = location.origin + location.pathname + '?room=' + NET.room;
    return '<h2>👥 غرفة اللعب الجماعي</h2><div class="mpCode" dir="ltr">' + NET.room + '</div><p class="mpP">' + MODES[NET.mode] + ' · ' + NET.rounds + ' مهام لكل لاعب · <span id="mpSt">' + (ST[NET.status] || '') + '</span></p>' +
      '<div class="btns"><button class="sbtn" data-a="mpCopy">📋 نسخ رابط الدعوة</button></div><input id="mpLink" readonly value="' + esc(link) + '" dir="ltr" style="width:100%;font-size:12px;opacity:.8">' +
      (NET.mode === 'teams' ? '<div class="seg" id="mpTeam"><button type="button" data-t="r" class="' + (NET.me.team === 'r' ? 'on' : '') + '">🔴 الفريق الأحمر</button><button type="button" data-t="b" class="' + (NET.me.team === 'b' ? 'on' : '') + '">🔵 الفريق الأزرق</button></div>' : '') +
      '<b>اللاعبون (<span id="mpN">' + (1 + Object.keys(NET.peers).length) + '</span>)</b><div id="mpList">' + playersHTML() + '</div>' +
      '<div class="btns">' + (NET.host ? (NET.phase === 'play' ? '<button class="sbtn big" data-a="mpResume">▶ العودة للعب</button>' : '<button class="sbtn big" data-a="mpStart">▶ ابدأ التحدي للجميع</button>') : (NET.phase === 'play' ? '<button class="sbtn big" data-a="mpResume">▶ العودة للعب</button>' : '<span class="mpWait">⏳ بانتظار أن يبدأ المضيف…</span>')) +
      '<button class="sbtn ghost" data-a="mpLeave">مغادرة الغرفة</button>' + back + '</div>';
  };
  U.SCmount.multi = function (s) {
    s.querySelectorAll('#mpMode [data-m]').forEach(function (b) { b.onclick = function () { NET.mode = b.dataset.m; s.querySelectorAll('#mpMode button').forEach(function (x) { x.classList.toggle('on', x === b); }); }; });
    s.querySelectorAll('#mpRounds [data-r]').forEach(function (b) { b.onclick = function () { NET.rounds = +b.dataset.r; s.querySelectorAll('#mpRounds button').forEach(function (x) { x.classList.toggle('on', x === b); }); }; });
    s.querySelectorAll('#mpTeam [data-t]').forEach(function (b) { b.onclick = function () { NET.me.team = b.dataset.t; if (NET.host) ensureBoard(NET.me.id, { name: NET.me.name, team: NET.me.team }).team = NET.me.team; hello(); U.screen('multi', G); }; });
    var n = s.querySelector('#mpName'); if (n) n.oninput = function () { NET.me.name = n.value.trim(); ls('jg_mpname', NET.me.name); };
  };
  function refresh() { var s = document.getElementById('screen'); if (s && !s.hidden && s.className === 'sc-multi') { if (NET.room && NET._shown !== NET.mode + NET.rounds + NET.phase + NET.host) { U.screen('multi', G); return; } var l = s.querySelector('#mpList'); if (l) l.innerHTML = playersHTML(); var nn = s.querySelector('#mpN'); if (nn) nn.textContent = 1 + Object.keys(NET.peers).length; var st = s.querySelector('#mpSt'); if (st) st.textContent = ST[NET.status] || ''; } }
  var origAct = G.onScreenAction;
  G.onScreenAction = function (a, b, e) {
    var name = function () { var n = document.getElementById('mpName'); NET.me.name = ((n && n.value) || NET.me.name || '').trim(); if (!NET.me.name) { U.toast('اكتب اسمك أولاً'); return false; } ls('jg_mpname', NET.me.name); G.save.name = G.save.name || NET.me.name; return true; };
    switch (a) {
      case 'multi': G._prevKeep = null; G._prev = G.mode === 'play' ? 'pause' : 'title'; U.screen('multi', G); return;
      case 'mpCreate': if (!name()) return; if (!JG.GRADE.g) { U.toast('اختر صفك في الشاشة الرئيسية أولاً (الأسئلة من صف المضيف)'); return; } JG.GRADE.ensure(function () { NET.create(NET.mode, NET.rounds); U.screen('multi', G); }); return;
      case 'mpJoin': if (!name()) return; if (NET.join((document.getElementById('mpCode') || {}).value)) U.screen('multi', G); return;
      case 'mpStart': NET.start(); return;
      case 'mpResume': U.screen(null); G.paused = false; if (G.mode !== 'play') startLocal(); return;
      case 'mpCopy': var inp = document.getElementById('mpLink'); var txt = 'تعال نلعب «مختبر الأردن الذكي» معاً! رمز الغرفة: ' + NET.room + '\n' + (inp ? inp.value : ''); (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(function () { U.toast('تم نسخ الدعوة — أرسلها عبر واتساب'); }, function () { if (inp) { inp.select(); U.toast('حدّد الرابط وانسخه'); } }); return;
      case 'mpLeave': NET.leave(); U.screen(G.mode === 'play' ? 'pause' : 'title', G); return;
      case 'mpBoard': return;
    }
    return origAct.call(G, a, b, e);
  };
  var origPause = U.SC.pause;
  U.SC.pause = function (Gm) { var h = origPause(Gm); return h.replace('<div class="btns col">', '<div class="btns col"><button class="sbtn" data-a="multi">👥 ' + (NET.room ? 'غرفة ' + NET.room + ' (' + (1 + Object.keys(NET.peers).length) + ' لاعبين)' : 'اللعب الجماعي') + '</button>'); };

  /* ---------- لوحة الغرفة أثناء اللعب ---------- */
  var bar = document.createElement('div'); bar.id = 'mpBar'; bar.hidden = true; document.body.appendChild(bar);
  bar.onclick = function () { if (!NET.room) return; U.modal({ title: 'لوحة النقاط — غرفة ' + NET.room, icon: '📊', mpBoard: 1, render: function (el, close) { var paint = function () { el.innerHTML = boardHTML(ranked()) + '<div class="pz-foot"><button class="pz-go" id="mpX">متابعة</button></div>'; el.querySelector('#mpX').onclick = close; }; U.open.repaint = paint; paint(); } }); };
  function hud() {
    var on = !!NET.room && NET.phase === 'play' && G.mode === 'play'; bar.hidden = !on; if (!on) return;
    var R = ranked(), me = R.findIndex(function (r) { return r.id === NET.me.id; }), mine = R[me] || { pts: 0 }, T = NET.teamPts || { r: 0, b: 0 };
    var mid = NET.mode === 'ally' ? '🤝 مهام التحالف <b>' + (NET.ally.pts || 0) + '</b>/' + (NET.ally.goal || 0) + '<span class="pb"><i style="width:' + Math.min(100, (NET.ally.pts || 0) / Math.max(1, NET.ally.goal) * 100) + '%"></i></span>'
      : NET.mode === 'teams' ? '🔴 <b>' + (T.r || 0) + '</b> · 🔵 <b>' + (T.b || 0) + '</b>' : '⚔️ ترتيبك <b>' + (me + 1) + '</b>/' + R.length;
    bar.innerHTML = '<span dir="ltr">' + NET.room + '</span> · ' + mid + ' · نقاطك <b>' + mine.pts + '</b> · مهامك ' + (mine.ms || 0) + '/' + NET.rounds + (NET.status === 'error' ? ' · ⚠️' : '');
  }
  setInterval(hud, 1000);

  /* دعوة عبر الرابط ?room=XXXXXX */
  var inv = (location.search.match(/[?&]room=([A-Z0-9]{6})/i) || [])[1];
  if (inv) { var wait = setInterval(function () { if (G.mode === 'title' && document.getElementById('screen') && !document.getElementById('screen').hidden) { clearInterval(wait); NET.me.name = ls('jg_mpname') || ''; U.screen('multi', G); } }, 400); }
  NET.me.name = ls('jg_mpname') || '';
  addEventListener('beforeunload', function () { if (NET.room) NET.send('bye', {}); });

  var st = document.createElement('style');
  st.textContent = '.mpP{color:#cbd5e1;line-height:1.8}.mpBox{border:1px solid #334155;border-radius:14px;padding:12px;margin:10px 0;display:grid;gap:8px;background:#0f172a88}.mpBox small{color:#94a3b8}.mpBox input{padding:10px;border-radius:10px;border:1px solid #475569;background:#0b1222;color:#fff;font-size:18px}' +
    '.mpCode{font:900 46px/1.1 ui-monospace,monospace;letter-spacing:10px;text-align:center;color:#fde047;margin:6px 0}.mpPl{display:grid;gap:6px;margin:8px 0}.mpPl>div{display:flex;gap:8px;align-items:center;background:#1e293b;border-radius:10px;padding:8px 10px}.mpPl i,.mpT i{width:12px;height:12px;border-radius:50%;display:inline-block;margin-inline-end:6px}' +
    '.mpPl small{margin-inline-start:auto;color:#94a3b8;font-size:12px}.mpPl .h{background:#a855f7;color:#fff;border-radius:6px;padding:0 6px;font-size:11px}.mpWait{color:#fbbf24;font-weight:700;padding:8px}' +
    '.mpT{width:100%;border-collapse:collapse;margin:8px 0;font-size:14px}.mpT th,.mpT td{padding:6px;border-bottom:1px solid #334155;text-align:center}.mpT td:nth-child(2){text-align:right}.mpT tr.me{background:#1e3a8a66}' +
    '#mpBar{position:fixed;bottom:max(8px,env(safe-area-inset-bottom));left:50%;transform:translateX(-50%) scale(var(--hs,1));transform-origin:bottom center;z-index:30;background:#2e1065e6;color:#e9d5ff;border:1px solid #a855f7;border-radius:999px;padding:6px 14px;font:700 13px system-ui;white-space:nowrap;cursor:pointer}' +
    '#mpBar b{color:#fff}#mpBar .pb{display:inline-block;width:70px;height:7px;background:#ffffff22;border-radius:9px;margin-inline-start:6px;vertical-align:middle;overflow:hidden}#mpBar .pb i{display:block;height:100%;background:#22c55e}' +
    'body.touch-on #mpBar{bottom:auto;top:calc(max(8px,env(safe-area-inset-top)) + 34px)}';
  document.head.appendChild(st);
})();
