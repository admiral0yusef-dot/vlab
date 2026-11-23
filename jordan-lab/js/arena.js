/* ============================================================
   JG Arena — «تحدي المراحل»: مراحل لا نهائية تزداد صعوبتها مع التقدم
   كل مرحلة: موجة أعداء ← بوابة أسئلة من صف الطالب ← المرحلة التالية
   - يزداد العدد والسرعة والصلابة، ويُضاف سؤال ثانٍ للعبور ابتداءً من المرحلة 6
   - تقدّم الحملة الأساسية (البلورات) يرفع «مستوى التحدي» أيضاً
   ============================================================ */
(function () {
  'use strict';
  var JG = window.JG, G = JG.G, U = JG.UI, E = JG.Ent, W = JG.World, Z = JG.Puz, A = JG.Audio;
  var ls = function (k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } };
  var AR = JG.ARENA = { on: false, stage: 0, foes: [], best: +ls('jg_arena_best') || 0, gate: false, score: 0, ok: 0, asked: 0 };

  /* مستوى التحدي العام: يُضاف سؤال لكل بوابة بعد كل بلورتين في الحملة */
  AR.tier = function () { var c = G.save ? Object.keys(G.save.crystals || {}).length : 0; return Math.min(2, Math.floor(c / 2)); };
  AR.qCount = function (s) { return Math.min(2, 1 + Math.floor((s - 1) / 5)); };
  AR.foeTypes = function (s) {
    var young = JG.GRADE && JG.GRADE.g && JG.GRADE.g < 10;
    var t = young ? ['radical', 'spark'] : ['h3o', 'oh', 'radical'];
    if (s >= 3) t.push('spark'); if (s >= 5) t.push('shifter'); if (s >= 7) t.push('turret'); if (!young && s >= 4) t.push('oh', 'h3o');
    return t;
  };
  function spot(i, n) {
    var r = W.room('hub'), T = W.T, cx = (r.x + r.w / 2) * T, cz = (r.y + r.h / 2) * T, rad = Math.min(r.w, r.h) * T * .33;
    for (var k = 0; k < 20; k++) { var a = (i / n) * 6.283 + k * .7 + Math.random() * .4, d = rad * (.55 + Math.random() * .45), x = cx + Math.cos(a) * d, z = cz + Math.sin(a) * d;
      if (!W.blocked(x, z, .9) && Math.hypot(x - G.player.pos[0], z - G.player.pos[2]) > 5) return [x, z]; }
    return [cx + Math.cos(i) * rad, cz + Math.sin(i) * rad];
  }
  AR.wave = function () {
    var s = AR.stage, n = Math.min(14, 2 + s + Math.floor(s / 2)), types = AR.foeTypes(s), k = 1 + (s - 1) * .14;
    AR.foes = [];
    for (var i = 0; i < n; i++) { var p = spot(i, n), f = E.spawn(types[i % types.length], p[0], p[1], 'hub', G.R); f.hp = f.max = Math.round(f.max * k * (G.diffHP || 1)); f.spd = (f.spd || 1) * Math.min(1.6, 1 + s * .04); f.arena = 1; AR.foes.push(f); }
    U.banner('المرحلة ' + s, n + ' أعداء · ' + AR.qCount(s) + ' سؤال للعبور', s % 5 === 0 ? '#f59e0b' : '#22c55e');
    A.play('door');
  };
  AR.start = function () {
    if (!JG.GRADE.g) { JG.GRADE.ensure(function () {}); return; }
    JG.GRADE.ensure(function () {
      if (G.mode !== 'play') { G.save.name = G.save.name || (document.getElementById('pName') || {}).value || ''; G.start(!G.hasSave()); }
      var c = W.at('hub', .5, .5); G.player.pos = [c[0], 0, c[1] + 3]; G.player.energy = G.player.maxE; G.roomId = 'hub';
      E.foes.forEach(function (f) { if (f.room === 'hub') f.dead = true; });
      AR.on = true; AR.stage = 1; AR.score = 0; AR.ok = 0; AR.asked = 0; AR.gate = false; AR.t0 = Date.now();
      G.lockArena(true); setTimeout(AR.wave, 900);
    });
  };
  G.lockArena = function (on) { if (G.lockZoneDoors) { if (on) G.lockZoneDoors(true, 'hub'); else G.lockZoneDoors(false); } };
  AR.stop = function (why) {
    if (!AR.on) return; AR.on = false; AR.foes.forEach(function (f) { f.dead = true; }); AR.foes = []; G.lockArena(false);
    var reached = AR.stage - (why === 'dead' ? 0 : 0); if (reached - 1 > AR.best) { AR.best = reached - 1; ls('jg_arena_best', AR.best); }
    if (JG.NET && JG.NET.room) JG.NET.report({ arena: reached - 1 });
    JG.UI.modal({ title: 'نتيجة تحدي المراحل', icon: '🏟️', render: function (el, close) {
      el.innerHTML = '<div class="pz-q">وصلت إلى <b>المرحلة ' + reached + '</b>' + (why === 'dead' ? ' ونفدت طاقتك' : '') + '.</div><div class="pz-meta"><span>أسئلة صحيحة: ' + AR.ok + ' / ' + AR.asked + '</span><span>النقاط: ' + AR.score + '</span><span>أفضل مرحلة: ' + AR.best + '</span></div><button class="pz-go" id="arOk">متابعة</button>';
      el.querySelector('#arOk').onclick = close; } });
  };
  AR.cleared = function () {
    AR.gate = true; var n = AR.qCount(AR.stage), i = 0, okAll = true;
    var ask = function () {
      if (i >= n) { AR.gate = false; var bonus = okAll ? 100 * AR.stage : 0; AR.score += 150 * AR.stage + bonus; G.addScore(150 * AR.stage + bonus, 20 + AR.stage * 4);
        if (AR.stage > AR.best) { AR.best = AR.stage; ls('jg_arena_best', AR.best); }
        if (JG.NET && JG.NET.room) JG.NET.report({ arena: AR.stage });
        U.toast(okAll ? '🌟 مرحلة مثالية! مكافأة +' + bonus : 'عبرت المرحلة ' + AR.stage); G.player.energy = Math.min(G.player.maxE, G.player.energy + 25);
        AR.stage++; setTimeout(function () { if (AR.on) AR.wave(); }, 1400); return; }
      i++; AR.asked++;
      Z.mcq(G, { title: 'بوابة المرحلة ' + AR.stage + ' — سؤال ' + i + ' من ' + n, icon: '🏟️', retry: false, okText: i < n ? 'السؤال التالي ←' : 'المرحلة التالية ←', stakes: 'المرحلة ' + AR.stage },
        function (ok) { if (ok) { AR.ok++; if (JG.NET && JG.NET.room) JG.NET.report({ correct: 1 }); } else okAll = false; ask(); });
    };
    U.banner('اكتملت الموجة!', 'أجب لتفتح المرحلة ' + (AR.stage + 1), '#38bdf8'); setTimeout(ask, 900);
  };

  /* الربط مع حلقة اللعبة */
  var origUpd = G.update;
  G.update = function (dt) {
    origUpd.call(G, dt);
    if (!AR.on || AR.gate) return;
    if (G.mode !== 'play') return;
    if (AR.foes.length && AR.foes.every(function (f) { return f.dead; })) { AR.foes = []; AR.cleared(); }
  };
  var origDie = G.die;
  G.die = function () { var was = AR.on; origDie.apply(G, arguments); if (was) setTimeout(function () { AR.stop('dead'); }, 300); };
  var origAct = G.onScreenAction;
  G.onScreenAction = function (a, b, e) {
    if (a === 'arena') { AR.start(); return; }
    if (a === 'arenaStop') { U.screen(null); G.paused = false; AR.stop('quit'); return; }
    if (a === 'quit' && AR.on) AR.stop('quit');
    return origAct.call(G, a, b, e);
  };
  /* زر في قائمة الإيقاف */
  var origPause = U.SC.pause;
  U.SC.pause = function (Gm) { var h = origPause(Gm); return h.replace('<div class="btns col">', '<div class="btns col">' + (AR.on ? '<button class="sbtn" data-a="arenaStop">🏁 إنهاء تحدي المراحل (المرحلة ' + AR.stage + ')</button>' : '<button class="sbtn" data-a="arena">🏟️ تحدي المراحل · أفضل مرحلة ' + AR.best + '</button>')); };
  /* شارة المرحلة على الشاشة */
  var badge = document.createElement('div'); badge.id = 'arBadge'; document.body.appendChild(badge);
  setInterval(function () { var on = AR.on && G.mode === 'play'; badge.hidden = !on; if (on) { var left = AR.foes.filter(function (f) { return !f.dead; }).length; badge.innerHTML = '🏟️ المرحلة <b>' + AR.stage + '</b> · الأعداء ' + left + ' · أفضل ' + AR.best; } }, 300);
  var st = document.createElement('style');
  st.textContent = '#arBadge{position:fixed;top:max(8px,env(safe-area-inset-top));left:50%;transform:translateX(-50%) scale(var(--hs,1));transform-origin:top center;z-index:30;background:#052e16e6;color:#bbf7d0;border:1px solid #22c55e;border-radius:999px;padding:5px 14px;font:700 13px system-ui;pointer-events:none;white-space:nowrap}#arBadge b{color:#fff;font-size:15px}';
  document.head.appendChild(st);
})();
