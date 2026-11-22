/* ============================================================
   Jordan Smart Chemistry Arcade — مختبر الأردن الذكي
   الحلقة الرئيسة · الحالة · المحتوى · الإدخال · الحفظ · الإنجازات · التقارير
   تصميم وبرمجة: الأستاذ يوسف القاق — VLab
   ============================================================ */
(function () {
  'use strict';
  var JG = window.JG, W = JG.World, E = JG.Ent, U = JG.UI, A = JG.Audio, Z = JG.Puz, AT = JG.Atom, M4 = JG.M4, C = JG.C;
  var $ = function (id) { return document.getElementById(id); };
  var CFG = JG.CONFIG || {};
  var ZL = { 0: ['u1l1', 'u1l2', 'u1l3', 'u2l1', 'u2l2'], 1: ['u4l1', 'u4l2', 'u4l3', 'u4l4'], 2: ['u5l1', 'u5l2', 'u5l3'], 3: ['u3l1', 'u3l2'], 4: ['u7l1'], 5: ['u6l1', 'u6l2', 'u6l3'], 6: null, 7: ['u7l1', 'u6l2', 'u4l3'] };
  if (CFG.zoneLessons) Object.keys(CFG.zoneLessons).forEach(function (k) { ZL[k] = CFG.zoneLessons[k]; });
  var ROOMZ = { hub: 0, hall: 0, z1: 1, z2: 2, z3: 3, z4: 4, z5: 5, z6: 6, sec: 7 };
  var G = JG.G = {
    mode: 'boot', paused: false, t: 0, ZC: { 1: '#a855f7', 2: '#f97316', 3: '#06b6d4', 4: '#eab308', 5: '#3b82f6', 6: '#ef4444' },
    session: { asked: [] }, inv: {}, inter: [], floats: [], movers: [], boss: null, roomId: 'hub', target: null, diffK: 1, diffHP: 1, streak: 0, nohint: 0,
    settings: { music: true, sfx: true, voice: false, touch: false, reflect: true, quality: 'auto', sens: 1, diff: 2 }
  };
  function freshSave() { return { v: 1, name: '', score: 0, xp: 0, level: 1, crystals: {}, tools: {}, flags: {}, ach: {}, seen: { hub: 1 }, log: [], pos: null, time: 0, kills: 0, deaths: 0, coins: 0, taken: {}, cards: {}, check: null, maxE: 100 }; }
  G.save = freshSave();
  try { Object.assign(G.settings, JSON.parse(localStorage.getItem('jg_settings') || '{}')); } catch (e) {}
  G.saveSettings = function () { try { localStorage.setItem('jg_settings', JSON.stringify(G.settings)); } catch (e) {} };
  G.applySettings = function () { A.setMusic(G.settings.music); A.setSfx(G.settings.sfx); A.voice = G.settings.voice; document.body.classList.toggle('touch-on', G.settings.touch || G.coarse); G.saveSettings(); G.resize(); };
  G.hasSave = function () { try { return !!localStorage.getItem('jg_save_v1'); } catch (e) { return false; } };
  G.xpNeed = function () { return 100 + G.save.level * 60; };
  G.zoneNow = function () { return ROOMZ[G.roomId] === undefined ? -1 : ROOMZ[G.roomId]; };
  G.roomOf = function (P) { var r = W.roomAt(P.pos[0], P.pos[2]); return r ? r.id : null; };
  G.roomOfXZ = function (x, z) { var r = W.roomAt(x, z); return r ? r.id : null; };

  /* ---------- الإنجازات ---------- */
  G.ACH = [
    { id: 'door1', i: '🚪', n: 'الخطوة الأولى', d: 'افتح باب الدليل بتحديد طبيعة المحلول' },
    { id: 'neutral', i: '⚖️', n: 'سيد التعادل', d: 'عادِل حوض الحمض حتى pH = 7 تماماً' },
    { id: 'k10', i: '🎯', n: 'صياد الأيونات', d: 'عادِل أو اهزم 10 أعداء' },
    { id: 'k50', i: '🧹', n: 'منظّف المختبر', d: 'اهزم 50 عدواً' },
    { id: 'nh5', i: '🧠', n: 'عقل مستقل', d: '5 إجابات صحيحة متتالية دون تلميح' },
    { id: 's10', i: '🔥', n: 'سلسلة ذهبية', d: '10 إجابات صحيحة متتالية' },
    { id: 'b1', i: '🧪', n: 'قاهر الحمض', d: 'اهزم الحمض الأعظم' }, { id: 'b2', i: '⚡', n: 'كاسر التثبيط', d: 'اهزم المثبّط' },
    { id: 'b3', i: '⚖️', n: 'سيد الاتزان', d: 'اهزم حارس لوشاتلييه' }, { id: 'b4', i: '🧬', n: 'محطّم البوليمر', d: 'اهزم البوليمر العملاق' },
    { id: 'b5', i: '🔋', n: 'مروّض الإلكترونات', d: 'اهزم عاصفة الإلكترونات' }, { id: 'b6', i: '👑', n: 'بطل المختبر المركزي', d: 'اهزم الخيميائي المظلم' },
    { id: 'secret', i: '🗝️', n: 'المستكشف السري', d: 'اكتشف المختبر السري' }, { id: 'cards', i: '📚', n: 'جامع المعرفة', d: 'اجمع كل بطاقات المعرفة' },
    { id: 'coins', i: '🪙', n: 'ثري بالذرات', d: 'اجمع 100 ذرة ذهبية' }, { id: 'speed', i: '⏱️', n: 'سرعة التفاعل', d: 'أنهِ تحدي المفاعل وبقي أكثر من 15 ثانية' },
    { id: 'clean', i: '✨', n: 'لمسة نظيفة', d: 'اهزم زعيماً دون أن يصيبك' }, { id: 'lv5', i: '🎓', n: 'عالم صاعد', d: 'بلغ المستوى 5' }
  ];
  G.award = function (id) { if (G.save.ach[id]) return; var a = G.ACH.find(function (x) { return x.id === id; }); if (!a) return; G.save.ach[id] = Date.now(); A.play('level'); U.toast('<b>' + a.i + ' إنجاز جديد:</b> ' + a.n, 3200); G.addScore(150, 30); };
  G.addScore = function (s, xp) {
    var S = G.save; S.score += s; S.xp += xp || 0;
    while (S.xp >= G.xpNeed()) { S.xp -= G.xpNeed(); S.level++; S.maxE += 5; G.player.maxE = S.maxE; G.player.energy = G.player.maxE; A.play('level'); U.banner('المستوى ' + S.level, 'ارتقيت!', '#fde047'); if (S.level >= 5) G.award('lv5'); }
  };
  G.float = function (txt, x, y, z, col) { var t = G.R.texture(JG.labelCanvas(txt, { fs: 36, bg: null, col: col || '#fde047' })); G.floats.push({ tex: t, x: x, y: y, z: z, t: 0, w: Math.min(3.2, .35 + txt.length * .11) }); };
  /* سجل المحاولات التعليمية */
  G.log = function (r) {
    r.at = Date.now(); G.save.log.push(r); if (G.save.log.length > 3000) G.save.log.shift();
    if (r.ok) { G.streak++; if (!r.hints) G.nohint++; else G.nohint = 0; G.addScore(100 + (r.hints ? 0 : 50), r.hints ? 15 : 25); if (G.nohint >= 5) G.award('nh5'); if (G.streak >= 10) G.award('s10'); }
    else { G.streak = 0; G.nohint = 0; G.addScore(10, 5); }
    G.persist();
  };
  /* ---------- التقرير ---------- */
  G.report = function () {
    var L = {}, S = {}, log = G.save.log, ok = 0;
    log.forEach(function (r) { var ln = r.lesson || 'غير مصنف', name = (JG.LESSONS && JG.LESSONS[ln]) || ln; var a = L[ln] || (L[ln] = { name: name, n: 0, ok: 0, id: ln }); a.n++; if (r.ok) a.ok++;
      var sk = r.skill || 'غير مصنف'; var b = S[sk] || (S[sk] = { name: sk, n: 0, ok: 0 }); b.n++; if (r.ok) b.ok++; if (r.ok) ok++; });
    var ls = Object.keys(L).map(function (k) { return L[k]; }), ss = Object.keys(S).map(function (k) { return S[k]; });
    var mastered = ls.filter(function (a) { return a.n >= 3 && a.ok / a.n >= .8; }).map(function (a) { return a.name; }).concat(ss.filter(function (a) { return a.n >= 3 && a.ok / a.n >= .8; }).map(function (a) { return 'مهارة: ' + a.name; }));
    var review = ls.filter(function (a) { return a.n >= 2 && a.ok / a.n < .6; }).map(function (a) { return a.name + ((JG.DB.CONCEPT[a.id]) ? ' — ' + JG.DB.CONCEPT[a.id] : ''); });
    var t = Math.round(G.save.time), time = Math.floor(t / 3600) + ':' + ('0' + Math.floor(t / 60 % 60)).slice(-2) + ':' + ('0' + t % 60).slice(-2);
    return { total: log.length, ok: ok, lessons: ls, skills: ss, mastered: mastered, review: review, time: time };
  };
  G.exportReport = function (kind) {
    var R = G.report(), S = G.save, nm = (S.name || 'student').replace(/[^\w؀-ۿ-]+/g, '_');
    if (kind === 'json') U.download('JG-report-' + Date.now() + '.json', JSON.stringify({ game: 'Jordan Smart Chemistry Arcade', player: S.name, date: new Date().toISOString(), level: S.level, score: S.score, playTime: R.time, answered: R.total, correctFirstTry: R.ok, wrong: R.total - R.ok, masteredSkills: R.mastered, needsReview: R.review, lessons: R.lessons, skills: R.skills, crystals: S.crystals, achievements: Object.keys(S.ach), attempts: S.log }, null, 1), 'application/json');
    else { var rows = [['player', 'time', 'zone', 'kind', 'lesson_id', 'lesson', 'skill', 'correct_first_try', 'tries', 'hints', 'seconds', 'question_id']];
      S.log.forEach(function (r) { rows.push([S.name, new Date(r.at).toISOString(), r.zone, r.kind, r.lesson, (JG.LESSONS && JG.LESSONS[r.lesson]) || '', r.skill, r.ok ? 1 : 0, r.tries, r.hints, Math.round((r.ms || 0) / 1000), r.qid || '']); });
      U.download('JG-report-' + Date.now() + '.csv', '﻿' + rows.map(function (r) { return r.map(function (v) { v = String(v === undefined ? '' : v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }).join(','); }).join('\r\n'), 'text/csv;charset=utf-8'); }
    void nm;
  };
  /* ---------- الحفظ التلقائي ---------- */
  G.persist = function () {
    if (G.mode === 'title' || G.mode === 'boot') return; var S = G.save, P = G.player; S.pos = [P.pos[0], P.pos[1], P.pos[2], P.h]; S.energy = P.energy; S.inv = G.inv;
    try { localStorage.setItem('jg_save_v1', JSON.stringify({ save: S, atom: AT.save(), secret: W.secretOpen })); } catch (e) {}
  };
  G.loadSave = function () { try { var o = JSON.parse(localStorage.getItem('jg_save_v1') || 'null'); if (!o) return false; G.save = Object.assign(freshSave(), o.save); AT.load(o.atom); W.secretOpen = !!o.secret; G.inv = G.save.inv || {}; return true; } catch (e) { return false; } };

  /* ---------- الإدخال: لوحة مفاتيح + فأرة + لمس ---------- */
  var IN = G.input = { k: {}, x: 0, z: 0, jump: false, run: false, fire: false, act: false, joy: null, runT: false,
    reset: function () { IN.k = {}; IN.x = IN.z = 0; IN.fire = false; IN.jump = false; IN.joy = null; var kn = $('joyK'); if (kn) kn.style.transform = ''; } };
  var KEYMAP = { KeyW: 'u', ArrowUp: 'u', KeyS: 'd', ArrowDown: 'd', KeyA: 'l', ArrowLeft: 'l', KeyD: 'r', ArrowRight: 'r' };
  addEventListener('keydown', function (e) {
    if (/INPUT|TEXTAREA|SELECT/.test((e.target || {}).tagName)) return; A.init();
    if (G.mode !== 'play') return; if (U.open) { if (e.code === 'Escape' && !U.open.noClose) { $('modal').querySelector('.mx').click(); } return; }
    if (KEYMAP[e.code]) { IN.k[KEYMAP[e.code]] = 1; e.preventDefault(); }
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') IN.run = true;
    if (e.code === 'Space') { IN.jump = true; e.preventDefault(); }
    if (e.code === 'KeyE' || e.code === 'Enter') G.interact();
    if (e.code === 'KeyJ' || e.code === 'KeyK') IN.fire = true;
    if (e.code === 'KeyQ') G.swapMode(); if (e.code === 'KeyR') G.useBoost(); if (e.code === 'KeyF') G.useShield();
    if (e.code === 'KeyM' || e.code === 'Tab') { G.togglePause('map'); e.preventDefault(); }
    if (e.code === 'Escape' || e.code === 'KeyP') G.togglePause();
    if (e.code === 'KeyZ') G.cam.yaw += .35; if (e.code === 'KeyC') G.cam.yaw -= .35;
  });
  addEventListener('keyup', function (e) { if (KEYMAP[e.code]) IN.k[KEYMAP[e.code]] = 0; if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') IN.run = false; if (e.code === 'KeyJ' || e.code === 'KeyK') IN.fire = false; });
  addEventListener('blur', function () { IN.reset(); if (G.mode === 'play' && !U.open && $('screen').hidden) G.togglePause(); });
  function bindPointer() {
    var cv = $('cv'), drag = null;
    cv.addEventListener('pointerdown', function (e) { A.init(); if (G.mode !== 'play') return; drag = { x: e.clientX, y: e.clientY, t: Date.now(), moved: false, id: e.pointerId, touch: e.pointerType === 'touch' }; try { cv.setPointerCapture(e.pointerId); } catch (_) {} });
    cv.addEventListener('pointermove', function (e) { if (!drag || drag.id !== e.pointerId) return; var dx = e.clientX - drag.x; if (Math.abs(dx) > 4) drag.moved = true; G.cam.yaw -= dx * .0065 * G.settings.sens; G.cam.pitch = Math.max(.35, Math.min(1.15, G.cam.pitch + (e.clientY - drag.y) * .003 * G.settings.sens)); drag.x = e.clientX; drag.y = e.clientY; });
    cv.addEventListener('pointerup', function (e) { if (drag && !drag.moved && !drag.touch && Date.now() - drag.t < 350 && e.button === 0) G.shoot(); drag = null; });
    cv.addEventListener('pointercancel', function () { drag = null; });
    cv.addEventListener('wheel', function (e) { G.cam.dist = Math.max(5.5, Math.min(14, G.cam.dist + e.deltaY * .01)); e.preventDefault(); }, { passive: false });
    cv.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    // عصا التحكم
    var jz = $('joyZ'), jk = $('joyK'), jb = $('joyB'), jid = null, jo = null;
    jz.addEventListener('pointerdown', function (e) { A.init(); jid = e.pointerId; jo = [e.clientX, e.clientY]; jb.style.left = (e.clientX - 60) + 'px'; jb.style.top = (e.clientY - 60) + 'px'; jb.classList.add('on'); try { jz.setPointerCapture(jid); } catch (_) {} e.preventDefault(); });
    jz.addEventListener('pointermove', function (e) { if (e.pointerId !== jid) return; var dx = e.clientX - jo[0], dy = e.clientY - jo[1], l = Math.hypot(dx, dy), m = 52; if (l > m) { dx = dx / l * m; dy = dy / l * m; } jk.style.transform = 'translate(' + dx + 'px,' + dy + 'px)'; IN.joy = [dx / m, -dy / m]; IN.joyRun = l > m * 1.6; });
    var jend = function (e) { if (e.pointerId !== jid) return; jid = null; IN.joy = null; jk.style.transform = ''; jb.classList.remove('on'); };
    jz.addEventListener('pointerup', jend); jz.addEventListener('pointercancel', jend);
    // أزرار اللمس
    var hold = function (id, on, off) { var b = $(id); b.addEventListener('pointerdown', function (e) { A.init(); e.preventDefault(); e.stopPropagation(); b.classList.add('dn'); on(); }); var up = function () { b.classList.remove('dn'); if (off) off(); }; b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up); b.addEventListener('pointerleave', up); };
    hold('tbJump', function () { IN.jump = true; }); hold('tbAct', function () { G.interact(); }); hold('tbFire', function () { IN.fire = true; G.shoot(); }, function () { IN.fire = false; });
    hold('tbSwap', function () { G.swapMode(); }); hold('tbRun', function () { IN.runT = !IN.runT; $('tbRun').classList.toggle('on', IN.runT); }); hold('tbBoost', function () { G.useBoost(); }); hold('tbShield', function () { G.useShield(); });
    $('pauseBtn').onclick = function () { G.togglePause(); }; $('mini').onclick = function () { G.togglePause('map'); };
  }

  /* ---------- القتال والقدرات ---------- */
  G.swapMode = function () { var P = G.player; P.mode = P.mode === 'acid' ? 'base' : 'acid'; A.play('ui'); U.toast(P.mode === 'acid' ? 'وضع الحمض: يطلق H₃O⁺ (يعادل أيونات OH⁻)' : 'وضع القاعدة: يطلق OH⁻ (يعادل أيونات H₃O⁺)', 1600); };
  G.useBoost = function () { var P = G.player; if (!G.save.tools.boost) { U.toast('المحفّز يُمنح بعد هزيمة زعيم مختبر السرعة'); return; } if (P.boostCd > 0) return; P.boostT = 5; P.boostCd = 14; A.play('dash'); E.burst(P.pos[0], 1, P.pos[2], '#fb923c', 30, 4, .6, .3); AT.once('boost', 'المحفّز يقلل «طاقة التنشيط» لحركتك: سرعة أعلى لخمس ثوانٍ — تماماً كما يسرّع العامل المساعد التفاعل دون أن يُستهلك.'); };
  G.useShield = function () { var P = G.player; if (!G.save.tools.shield) { U.toast('درع لوشاتلييه يُمنح بعد هزيمة حارس الاتزان'); return; } if (P.shieldCd > 0) return; P.shieldT = 6; P.shieldCd = 18; A.play('shield'); AT.once('shield', 'درع لوشاتلييه «يقاوم التغيير»: يمتص 70% من الضرر لست ثوانٍ.'); };
  G.shoot = function () {
    var P = G.player; if (G.mode !== 'play' || G.paused || P.fireCd > 0 || P.carry) { if (P.carry && !G._carryTip) { G._carryTip = 1; U.toast('ضع ما تحمله أولاً (E عند نقطة الاستخدام)'); } return; }
    var beam = !!G.save.tools.beam; P.fireCd = beam ? .24 : .3; var best = null, bs = 1e9, fx = Math.sin(P.h), fz = Math.cos(P.h);
    var cand = E.foes.filter(function (f) { return !f.dead; }).map(function (f) { return { x: f.x, z: f.z }; }); if (G.boss && G.boss.alive) cand.push({ x: G.boss.x, z: G.boss.zz, boss: 1 });
    cand.forEach(function (c) { var dx = c.x - P.pos[0], dz = c.z - P.pos[2], d = Math.hypot(dx, dz); if (d > 17 || d < .1) return; var dot = (dx * fx + dz * fz) / d; if (dot < .55) return; if (!W.los(P.pos[0], P.pos[2], c.x, c.z)) return; var s = d * (1.6 - dot); if (s < bs) { bs = s; best = c; } });
    var dx = fx, dz = fz; if (best) { dx = best.x - P.pos[0]; dz = best.z - P.pos[2]; var l = Math.hypot(dx, dz); dx /= l; dz /= l; P.th = Math.atan2(dx, dz); }
    var col = P.mode === 'acid' ? '#f87171' : '#60a5fa'; if (beam) col = P.mode === 'acid' ? '#fda4af' : '#93c5fd';
    E.fire(P.pos[0] + dx * .6, P.pos[1] + 1.25, P.pos[2] + dz * .6, dx, dz, 19, (beam ? 17 : 10) * (1 + (G.save.level - 1) * .04), 'me', col, P.mode, beam);
    P.emote = 'shoot'; P.emoteT = .18; A.play('shoot', .7);
  };
  G.hitFoe = function (f, s) {
    var T = f.T, need = T.chem === 'acid' ? 'base' : (T.chem === 'base' ? 'acid' : null);
    if (need && s.chem !== need) { f.hp = Math.min(f.max * 1.3, f.hp + 4); f.flash = .1; A.play('bad', .4);
      if (!G._wrongT || G.t - G._wrongT > 6) { G._wrongT = G.t; AT.say(T.chem === 'acid' ? 'إطلاق H₃O⁺ على أيون H₃O⁺ لا يعادله بل يزيد الحموضة! بدّل إلى وضع القاعدة OH⁻ (Q).' : 'أيون OH⁻ يُعادَل بأيون H₃O⁺ — بدّل إلى وضع الحمض (Q).', 'wrong'); } return; }
    f.hp -= s.dmg; f.flash = .12; A.play('hit', .6); var kx = s.vx, kz = s.vz, kl = Math.hypot(kx, kz) || 1; f.vx += kx / kl * 3; f.vz += kz / kl * 3;
    if (f.hp <= 0) { f.dead = true; A.play('kill'); E.burst(f.x, f.y + .4, f.z, T.col, 30, 5, .7, .3); G.save.kills++; G.addScore(50, 10);
      if (need) G.float('H₃O⁺ + OH⁻ → 2H₂O', f.x, f.y + 1.4, f.z, '#a5f3fc'); else G.float('+50', f.x, f.y + 1.2, f.z);
      if (Math.random() < .25) E.pick({ id: 'drop' + Date.now(), kind: 'energy', x: f.x, z: f.z, mesh: 'flask', col: '#22c55e', y: .5 });
      if (G.save.kills >= 10) G.award('k10'); if (G.save.kills >= 50) G.award('k50'); }
  };
  G.hitBoss = function (s) {
    var b = G.boss; if (b.intro) return;
    if (b.shield) { E.burst(s.x, s.y, s.z, '#a5f3fc', 6, 3, .3, .2); if (!G._shT || G.t - G._shT > 5) { G._shT = G.t; AT.say('الدرع منيع أمام الطلقات! اذهب إلى محطة الإضعاف المضيئة وحلّ التحدي الكيميائي.', 'tip'); } return; }
    if (b.D.chem === 'acid' && s.chem !== 'base') { A.play('bad', .4); b.hp = Math.min(b.max, b.hp + 3); if (!G._wrongT || G.t - G._wrongT > 6) { G._wrongT = G.t; AT.say(b.D.tip, 'wrong'); } return; }
    b.hp -= s.dmg * (b.stun > 0 ? 1.6 : 1); b.flash = .08; A.play('bossHit', .6);
    if (b.hp <= 0) G.bossDie(b);
  };
  G.onHurt = function () { G.cam.shake = Math.max(G.cam.shake, .35); if (G.boss && G.boss.alive) G.boss.wasHit = true; if (G.player.energy <= 0) G.die(); else if (G.player.energy < 30) AT.once('lowE', 'طاقتك منخفضة! ابحث عن قوارير الطاقة الخضراء.', 'tip'); };
  G.die = function () { if (G.mode !== 'play') return; G.mode = 'dead'; A.play('lose'); G.save.deaths++; G.save.score = Math.floor(G.save.score * .9); U.screen('dead', G); };
  G.respawn = function () {
    var P = G.player, c = G.save.check || G.spawnPt; P.pos = [c[0], 0, c[1]]; P.vel = [0, 0, 0]; P.energy = P.maxE; P.inv = 2; P.carry = null; P.slow = false;
    if (G.boss) { G.boss = null; E.foes.forEach(function (f) { if (f.minion) f.dead = true; }); E.hazards.length = 0; G.lockZoneDoors(false); A.track('lab'); }
    E.shots.length = 0; G.mode = 'play'; U.screen(null);
    if (G.save.deaths >= 2 && G.diffK > .7) { G.diffK -= .1; AT.say('خفّضتُ شدة الأعداء قليلاً لتتمكن من التركيز على الكيمياء. أنت تستطيع!', 'tip'); }
  };

  /* ---------- المحتوى: المحطات والمقتنيات والأعداء ---------- */
  var F = function () { return G.save.flags; };
  function inter(o) { o.r = o.r || 1.9; G.inter.push(o); return o; }
  function station(o) { o.kind = 'station'; o.rot = o.rot === undefined ? 0 : o.rot; o.col = o.col || '#38bdf8'; G.cols.push({ x0: o.x - .65, z0: o.z - .65, x1: o.x + .65, z1: o.z + .65, h: 1.2, top: true }); return inter(o); }
  function freePos(rid, rng, avoid) {
    var r = W.rooms[rid]; for (var k = 0; k < 60; k++) { var x = (r.x + 1 + rng() * (r.w - 2)) * 2, z = (r.y + 1 + rng() * (r.h - 2)) * 2;
      if (W.blocked(x, z, .9)) continue; if (avoid && avoid(x, z)) continue; if (G.inter.some(function (i) { return Math.hypot(i.x - x, i.z - z) < 2.2; })) continue; return [x, z]; } return [(r.x + r.w / 2) * 2, (r.y + r.h / 2) * 2];
  }
  function labelTex(txt, col, fs) { return G.R.texture(JG.labelCanvas(txt, { fs: fs || 34, bg: 'rgba(8,12,28,.82)', col: '#f8fafc', bd: col })); }
  G.respawnAtoms = function () { E.picks.forEach(function (p) { if (p.kind === 'atom') p.taken = false; }); };
  G.poolInside = function (x, z) { var p = G.pool; return p && x > p.x0 && x < p.x1 && z > p.z0 && z < p.z1; };
  G.setup = function () {
    var R = G.R, seed = 99, rng = function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }, S = G.save;
    if (W._baseCols === undefined) W._baseCols = W.colliders.length; W.colliders.length = W._baseCols;
    G.inter = []; G.cols = W.colliders; E.picks.length = 0; E.foes.length = 0; E.hazards.length = 0; G.movers = [];
    var at = W.at, door = function (id) { return W.doors.find(function (d) { return d.id === id; }); };
    G.spawnPt = at('hub', .5, .82);
    // —— الردهة: رف الكواشف + باب الدليل + مكتبة ذرّة
    var rack = at('hub', .1, .38); G.cols.push({ x0: rack[0] - .4, z0: rack[1] - 1.8, x1: rack[0] + .4, z1: rack[1] + 1.8, h: 1, top: true }); G.rack = rack;
    ['php', 'mo', 'lit'].forEach(function (k, i) { var I = Z.IND[k]; inter({ id: 'ind_' + k, x: rack[0] + .8, z: rack[1] - 1.2 + i * 1.2, r: 1.2, kind: 'bottle', ind: k, col: I.col, lab: labelTex(I.n, I.col, 30),
      name: function () { return 'خذ قارورة ' + I.n; }, can: function () { return !F().d1; }, act: function () { G.player.carry = { kind: 'bottle', ind: k, col: C(I.col), name: I.n }; A.play('pick'); AT.once('ind1', 'أحسنت! الآن اذهب إلى باب مختبر الأحماض والقواعد (غرب الردهة) واضغط E لإضافة الكاشف إلى المحلول.'); } }); });
    var d1 = door('d1'); G.d1 = d1;
    inter({ id: 'door1', x: d1.x + 2.3, z: d1.z, r: 2.4, kind: 'door', name: function () { return G.player.carry && G.player.carry.ind ? 'أضف الكاشف إلى محلول الباب' : 'افحص باب الدليل'; }, can: function () { return !F().d1; },
      act: function () { Z.indicatorDoor(G, d1, function () { F().d1 = 1; G.award('door1'); G.openDoor(d1, true); G.persist(); }); } });
    var lib = at('hub', .5, .16); station({ id: 'lib', x: lib[0], z: lib[1], rot: 0, col: '#38bdf8', title: 'مكتبة ذرّة', name: function () { return 'مكتبة ذرّة: سؤال مراجعة (طاقة + خبرة)'; }, can: function () { return !(G.libCd > G.t); },
      act: function () { Z.mcq(G, { lessons: ZL[0], title: 'مكتبة ذرّة — مراجعة حالات المادة والمحاليل', icon: '📚' }, function (ok) { G.libCd = G.t + 25; if (ok) { G.player.energy = Math.min(G.player.maxE, G.player.energy + 30); U.toast('+30 طاقة'); } }); } });
    // —— المختبر 1: حوض التعادل + خزانة الأملاح
    var r1 = W.rooms.z1; G.pool = { x0: (r1.x + 6) * 2, x1: (r1.x + 9) * 2, z0: r1.y * 2, z1: (r1.y + r1.h) * 2, nH: 0.3, nOH: 0, V: 10 };
    if (F().z1pool) { G.pool.nOH = G.pool.nH; }
    G.pool.pH = function () { var p = G.pool, ex = p.nH - p.nOH; if (Math.abs(ex) < 1e-9) return 7; return ex > 0 ? -Math.log10(ex / p.V) : 14 + Math.log10(-ex / p.V); };
    var bx = G.pool.x1 + 3.2;
    [['NaOH', '#3b82f6', 'قاعدة قوية — 0.1 mol', .25], ['HCl', '#ef4444', 'حمض قوي — 0.1 mol', .75], ['NaCl', '#e5e7eb', 'ملح متعادل', .5]].forEach(function (b) {
      var z = (r1.y + r1.h * b[3]) * 2; G.cols.push({ x0: bx + .6 - .45, z0: z - .45, x1: bx + .6 + .45, z1: z + .45, h: .95, top: true });
      inter({ id: 'barrel_' + b[0], x: bx, z: z, r: 1.6, kind: 'barrel', bx: bx + .6, col: b[1], lab: labelTex(b[0] + ' · ' + b[2], b[1], 28), name: function () { return 'احمل برميل ' + b[0]; }, can: function () { return !F().z1pool && !G.player.carry; },
        act: function () { G.player.carry = { kind: 'barrel', f: b[0], col: C(b[1]), name: 'برميل ' + b[0] }; A.play('pick'); AT.once('barrel', 'يحتوي الحوض على 0.3 mol من HCl. كل برميل يحوي 0.1 mol. كم برميلاً من القاعدة يلزم للوصول إلى pH = 7؟'); } });
    });
    var vz = (r1.y + r1.h * .5) * 2; G.valve = [G.pool.x1 + .9, vz];
    inter({ id: 'valve', x: G.pool.x1 + .9, z: vz, r: 2, kind: 'valve', name: function () { return G.player.carry && G.player.carry.kind === 'barrel' ? 'اسكب ' + G.player.carry.name + ' في الحوض' : 'شاشة الحوض: pH = ' + G.pool.pH().toFixed(2); }, can: function () { return !F().z1pool; },
      act: function () {
        var c = G.player.carry; if (!c || c.kind !== 'barrel') { AT.say('الحوض يحوي ' + (G.pool.nH - G.pool.nOH > 0 ? (G.pool.nH - G.pool.nOH).toFixed(1) + ' mol من H₃O⁺ الزائد' : (G.pool.nOH - G.pool.nH).toFixed(1) + ' mol من OH⁻ الزائد') + '. احمل برميلاً واسكبه هنا.', 'info'); return; }
        G.player.carry = null; A.play('pour'); E.burst(G.pool.x1 - 1, .3, vz, c.col, 30, 3, .8, .3, 1.5); var p = G.pool;
        if (c.f === 'NaOH') p.nOH += .1; else if (c.f === 'HCl') p.nH += .1; else { AT.say('NaCl ملح متعادل: أيوناته لا تتفاعل مع H₃O⁺ ولا مع OH⁻، فلم يتغير pH.', 'wrong'); G.log({ kind: 'pool', lesson: 'u4l4', skill: 'تطبيق', ok: false, tries: 1, hints: 0, ms: 0, zone: 1 }); return; }
        p.nOH = Math.round(p.nOH * 10) / 10; p.nH = Math.round(p.nH * 10) / 10; var ph = p.pH();
        G.float('pH = ' + ph.toFixed(2), G.pool.x1 - 1, 2.2, vz, ph === 7 ? '#86efac' : '#fde047');
        if (ph === 7) { F().z1pool = 1; A.play('ok'); G.award('neutral'); G.log({ kind: 'pool', lesson: 'u4l2', skill: 'حل مسائل حسابية', ok: !G._poolErr, tries: (G._poolErr || 0) + 1, hints: 0, ms: 0, zone: 1 });
          AT.say('ممتاز! عدد مولات OH⁻ = عدد مولات H₃O⁺ = 0.3 mol، فتحوّل الحوض إلى ماء وملح NaCl متعادل (pH = 7). يمكنك العبور الآن.', 'ok'); U.banner('تم التعادل!', 'H₃O⁺ + OH⁻ → 2H₂O', '#22c55e'); G.persist(); G.checkBoss(1); }
        else if (ph > 7) { G._poolErr = (G._poolErr || 0) + 1; AT.say('تجاوزت نقطة التعادل! أصبح المحلول قاعدياً (pH = ' + ph.toFixed(2) + ') وهو مؤذٍ أيضاً. أضف برميل حمض HCl لتصحيحه.', 'wrong'); }
        else AT.say('pH = ' + ph.toFixed(2) + ' ما زال حمضياً. المتبقي من H₃O⁺ = ' + (p.nH - p.nOH).toFixed(1) + ' mol.', 'info');
      } });
    var ss = at('z1', .18, .5); station({ id: 'salts', x: ss[0], z: ss[1], rot: Math.PI / 2, col: '#a855f7', title: 'خزانة الأملاح', zone: 1, name: function () { return G.bossMode(1) ? 'محطة إضعاف: اكسر درع الحمض الأعظم' : 'خزانة الأملاح: صنّف المحاليل'; }, can: function () { return !F().z1salts || G.bossMode(1); },
      act: function () { if (G.bossMode(1)) return G.weaken(1); Z.saltSort(G, function () { F().z1salts = 1; G.persist(); G.checkBoss(1); }); } });
    var st1b = at('z1', .82, .5); station({ id: 'z1w', x: st1b[0] + 1, z: st1b[1], rot: -Math.PI / 2, col: '#a855f7', title: 'محطة الحموض', zone: 1, name: function () { return G.bossMode(1) ? 'محطة إضعاف: اكسر درع الحمض الأعظم' : 'محطة الحموض: سؤال (ترقية الطاقة)'; }, can: function () { return G.bossMode(1) || !F().z1t; },
      act: function () { if (G.bossMode(1)) return G.weaken(1); Z.mcq(G, { lessons: ZL[1], title: 'محطة الحموض والقواعد', okText: 'استلم الترقية ←' }, function (ok) { if (ok) { F().z1t = 1; S.maxE += 15; G.player.maxE = S.maxE; G.player.energy = S.maxE; U.toast('🔋 ترقية: الطاقة القصوى +15'); } }); } });
    // —— المختبر 2: المفاعل والرافعات + منحنى الطاقة
    var r2 = W.rooms.z2, rc = at('z2', .55, .5); G.reactor = { x: rc[0], z: rc[1], on: false, t: 0, lim: 45, lev: {} }; G.cols.push({ x0: rc[0] - 1.6, z0: rc[1] - 1.6, x1: rc[0] + 1.6, z1: rc[1] + 1.6, h: 2.5 });
    var LEV = [['hot', 'تسخين إلى 60°C', 2, 'رفع درجة الحرارة يزيد الطاقة الحركية فتزداد التصادمات الفعالة.'], ['cold', 'تبريد إلى 5°C', .5, 'خفض الحرارة يقلل الطاقة الحركية وعدد التصادمات الفعالة فتقل السرعة.'], ['powder', 'استخدام مسحوق الخارصين', 2, 'المسحوق يزيد مساحة السطح المعرّض للتصادم.'],
      ['dilute', 'تخفيف تركيز الحمض', .5, 'تقليل التركيز يقلل عدد التصادمات في وحدة الزمن.'], ['cat', 'إضافة عامل مساعد', 2.5, 'العامل المساعد يوفّر مساراً بطاقة تنشيط أقل.'], ['lump', 'قطعة خارصين كبيرة', .5, 'القطعة الكبيرة مساحة سطحها أقل من المسحوق.']];
    G.LEV = LEV;
    LEV.forEach(function (l, i) { var p = at('z2', .3 + (i % 3) * .25, i < 3 ? .1 : .9); p[1] += i < 3 ? .6 : -.6; G.cols.push({ x0: p[0] - .3, z0: p[1] - .2, x1: p[0] + .3, z1: p[1] + .2, h: 1.05 });
      inter({ id: 'lev_' + l[0], x: p[0], z: p[1] + (i < 3 ? 1 : -1), lx: p[0], lz: p[1], r: 1.7, kind: 'lever', lv: l, lab: labelTex(l[1], '#f97316', 28),
        name: function () { return (G.reactor.lev[l[0]] ? 'أوقف: ' : 'فعّل: ') + l[1]; }, can: function () { return G.reactor.on; },
        act: function () { var R0 = G.reactor; R0.lev[l[0]] = !R0.lev[l[0]]; A.play('lever'); if (R0.lev[l[0]]) { if (l[2] < 1) { AT.say('انتبه! ' + l[3] + ' هذا يبطئ التفاعل.', 'wrong'); G.log({ kind: 'rate', lesson: 'u5l3', skill: 'تطبيق', ok: false, tries: 1, hints: 0, ms: 0, zone: 2 }); } else AT.say('✔ ' + l[3], 'ok'); } } }); });
    G.rate = function () { var r = 10; LEV.forEach(function (l) { if (G.reactor.lev[l[0]]) r *= l[2]; }); return r; };
    inter({ id: 'reactor', x: rc[0], z: rc[1] + 2.4, r: 2, kind: 'console', name: function () { return 'ابدأ تجربة المفاعل الزمنية'; }, can: function () { return !F().z2rate && !G.reactor.on; },
      act: function () { var R0 = G.reactor; R0.on = true; R0.t = 0; R0.lev = {}; R0.lim = [0, 60, 48, 40][G.settings.diff]; A.play('machine'); U.banner('تحدٍّ زمني!', 'ارفع سرعة التفاعل إلى 80 قبل انتهاء الوقت', '#f97316');
        AT.say('السرعة الحالية 10. فعّل الرافعات التي تزيد التصادمات الفعالة فقط. المكابس تتحرك — والليزر المنخفض يحتاج قفزة!', 'info');
        G.movers.forEach(function (m) { m.on = true; }); } });
    [.42, .68].forEach(function (fx, i) { var p = at('z2', fx, .5); G.movers.push({ x: p[0], z0: (r2.y + 1.2) * 2, z1: (r2.y + r2.h - 1.2) * 2, z: p[1], w: 1.1, t: i * 1.7, per: 3.4, on: false }); });
    var eg = at('z2', .9, .5); station({ id: 'graph', x: eg[0], z: eg[1], rot: -Math.PI / 2, col: '#f97316', title: 'منحنى الطاقة', zone: 2, name: function () { return G.bossMode(2) ? 'محطة إضعاف: عطّل هالة المثبّط' : 'شاشة منحنى الطاقة'; }, can: function () { return !F().z2graph || G.bossMode(2); },
      act: function () { if (G.bossMode(2)) return G.weaken(2); Z.energyGraph(G, function () { F().z2graph = 1; G.persist(); G.checkBoss(2); }); } });
    var w2 = at('z2', .12, .5); station({ id: 'z2w', x: w2[0], z: w2[1], rot: Math.PI / 2, col: '#f97316', title: 'محطة الحركية', zone: 2, name: function () { return G.bossMode(2) ? 'محطة إضعاف: عطّل هالة المثبّط' : 'محطة الحركية: سؤال (مكافأة)'; }, can: function () { return G.bossMode(2) || !F().z2t; },
      act: function () { if (G.bossMode(2)) return G.weaken(2); Z.mcq(G, { lessons: ZL[2], title: 'محطة الكيمياء الحركية' }, function (ok) { if (ok) { F().z2t = 1; G.addScore(200, 40); U.toast('+200 نقطة'); } }); } });
    // —— المختبر 3: بوابة الاتزان + حاسبة Kc
    var l3 = at('z3', .3, .55); station({ id: 'lech', x: l3[0], z: l3[1], rot: 0, col: '#06b6d4', title: 'بوابة الاتزان', zone: 3, name: function () { return G.bossMode(3) ? 'محطة إضعاف: أزِح اتزان الحارس' : 'بوابة الاتزان: مبدأ لوتشاتلييه'; }, can: function () { return !F().z3lc || G.bossMode(3); },
      act: function () { if (G.bossMode(3)) return G.weaken(3); Z.leChatelier(G, function () { F().z3lc = 1; G.persist(); G.checkBoss(3); }); } });
    var k3 = at('z3', .75, .78); station({ id: 'kc', x: k3[0], z: k3[1], rot: Math.PI, col: '#06b6d4', title: 'حاسبة Kc', zone: 3, name: function () { return G.bossMode(3) ? 'محطة إضعاف: أزِح اتزان الحارس' : 'حاسبة ثابت الاتزان'; }, can: function () { return !F().z3kc || G.bossMode(3); },
      act: function () { if (G.bossMode(3)) return G.weaken(3); Z.kcCalc(G, function (ok) { if (ok !== false) { F().z3kc = 1; G.persist(); G.checkBoss(3); } }); } });
    // —— المختبر 4: آلة الجزيئات + محطة المجموعات الوظيفية + المفتاح السري
    var m4 = at('z4', .5, .5); if (!S.flags.molI) S.flags.molI = [Math.floor(Math.random() * 2), 2 + Math.floor(Math.random() * (Z.MOL.length - 2))]; G.mol = [Z.MOL[S.flags.molI[0]], Z.MOL[S.flags.molI[1]]];
    station({ id: 'mach', x: m4[0], z: m4[1], rot: Math.PI, col: '#eab308', title: 'آلة الجزيئات', zone: 4, name: function () { return G.bossMode(4) ? 'محطة إضعاف: اكسر روابط البوليمر' : 'آلة الجزيئات: صنّع ' + G.mol[F().z4m || 0].n; }, can: function () { return (F().z4m || 0) < 2 || G.bossMode(4); },
      act: function () { if (G.bossMode(4)) return G.weaken(4); var i = F().z4m || 0; Z.moleculeMachine(G, G.mol[i], function () { F().z4m = i + 1; G.respawnAtoms(); if (F().z4m >= 2) { G.persist(); G.checkBoss(4); } else AT.say('الجزيء التالي: ' + G.mol[1].n + ' (' + G.mol[1].f + '). اجمع ذراته.', 'info'); }); } });
    var f4 = at('z4', .2, .8); station({ id: 'func', x: f4[0], z: f4[1], rot: Math.PI / 2, col: '#eab308', title: 'المجموعات الوظيفية', zone: 4, name: function () { return G.bossMode(4) ? 'محطة إضعاف: اكسر روابط البوليمر' : 'محطة المجموعات الوظيفية (' + (F().z4f || 0) + '/2)'; }, can: function () { return (F().z4f || 0) < 2 || G.bossMode(4); },
      act: function () { if (G.bossMode(4)) return G.weaken(4); Z.mcq(G, { lessons: ZL[4], title: 'محطة تفاعلات المركبات العضوية', retry: false }, function (ok) { if (ok) { F().z4f = (F().z4f || 0) + 1; if (F().z4f >= 2) { G.persist(); G.checkBoss(4); } } }); } });
    var sw = at('z4', .9, .08); inter({ id: 'secret', x: sw[0], z: sw[1] + .6, r: 1.4, kind: 'switch', name: function () { return 'لوحة غامضة خلف خزانة الغازات…'; }, can: function () { return !F().secret && !!S.crystals[3]; },
      act: function () { Z.mcq(G, { lessons: ZL[4], title: 'قفل المختبر السري', icon: '🗝️', stakes: 'سؤال تحدٍّ', retry: false, okText: 'افتح الممر ←' }, function (ok) { if (ok) { F().secret = 1; W.secretOpen = true; var d = door('ds'); d.locked = false; A.play('door'); U.banner('ممر سري!', 'انفتح جدار في شمال المختبر', '#ec4899'); G.cam.cinema([d.x, 0, d.z], { dur: 1.6, hold: .8, r: 7, h: 4 }); G.persist(); } else AT.say('القفل لم يُفتح. عُد لاحقاً وحاول بسؤال آخر.', 'info'); }); } });
    var atomsDef = [['C', '#111827', 5], ['H', '#f8fafc', 10], ['O', '#ef4444', 4]], arng = function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    atomsDef.forEach(function (a) { for (var i = 0; i < a[2]; i++) { var p = freePos('z4', arng); E.pick({ id: 'atom' + a[0] + i, kind: 'atom', el: a[0], x: p[0], z: p[1], mesh: 'ball', s: a[0] === 'H' ? .22 : .3, col: a[1], em: .2, lab: labelTex(a[0], a[1] === '#111827' ? '#94a3b8' : a[1], 40), labW: .5, labA: 1, y: .8 }); } });
    // —— المختبر 5: الخلية الجلفانية + التحليل الكهربائي
    var g5 = at('z5', .3, .62); station({ id: 'galv', x: g5[0], z: g5[1], rot: 0, col: '#3b82f6', title: 'الخلية الجلفانية', zone: 5, name: function () { return G.bossMode(5) ? 'محطة إضعاف: اعكس تيار العاصفة' : 'باني الخلية الجلفانية'; }, can: function () { return !F().z5g || G.bossMode(5); },
      act: function () { if (G.bossMode(5)) return G.weaken(5); Z.galvanic(G, function () { F().z5g = 1; G.persist(); G.checkBoss(5); }); } });
    var e5 = at('z5', .78, .35); station({ id: 'melt', x: e5[0], z: e5[1], rot: -Math.PI / 2, col: '#3b82f6', title: 'خلية التحليل', zone: 5, name: function () { return G.bossMode(5) ? 'محطة إضعاف: اعكس تيار العاصفة' : 'خلية التحليل الكهربائي للمصهور'; }, can: function () { return !F().z5m || G.bossMode(5); },
      act: function () { if (G.bossMode(5)) return G.weaken(5); Z.molten(G, function (ok) { if (ok) { F().z5m = 1; G.persist(); G.checkBoss(5); } }); } });
    // —— المختبر 6: ثلاثة مفاتيح للمفاعل
    [[.12, .82, Math.PI / 2], [.88, .82, -Math.PI / 2], [.5, .93, Math.PI]].forEach(function (p, i) { var q = at('z6', p[0], p[1]); station({ id: 'key' + i, x: q[0], z: q[1], rot: p[2], col: '#ef4444', title: 'مفتاح المفاعل ' + (i + 1), zone: 6,
      name: function () { return G.bossMode(6) ? 'محطة إضعاف: اكسر درع الخيميائي' : 'مفتاح المفاعل ' + (i + 1) + ': تحدّي معرفة'; }, can: function () { return !(F()['z6k' + i]) || G.bossMode(6); },
      act: function () { if (G.bossMode(6)) return G.weaken(6); var ls = [ZL[0], ZL[1].concat(ZL[3]), ZL[2].concat(ZL[5]).concat(ZL[4])][i]; Z.mcq(G, { lessons: ls, title: 'مفتاح المفاعل ' + (i + 1), icon: '🔑' }, function (ok) { if (ok) { F()['z6k' + i] = 1; A.play('machine'); G.persist(); G.checkBoss(6); } }); } }); });
    // —— الممر: محطة مراجعة
    var hl = at('hall', .5, .78); station({ id: 'hallq', x: hl[0], z: hl[1], rot: Math.PI, col: '#94a3b8', title: 'محطة مراجعة', name: function () { return 'محطة مراجعة شاملة (طاقة)'; }, can: function () { return !(G.hallCd > G.t); },
      act: function () { Z.mcq(G, { lessons: null, title: 'محطة المراجعة الشاملة' }, function (ok) { G.hallCd = G.t + 25; if (ok) { G.player.energy = Math.min(G.player.maxE, G.player.energy + 35); U.toast('+35 طاقة'); } }); } });
    // —— المختبر السري
    var sc = at('sec', .5, .5); station({ id: 'secq', x: sc[0], z: sc[1] + 1.5, rot: Math.PI, col: '#ec4899', title: 'أرشيف العلماء', name: function () { return 'أرشيف العلماء: تحدٍّ صعب (+300)'; }, can: function () { return !(G.secCd > G.t); },
      act: function () { Z.mcq(G, { lessons: ZL[7], title: 'أرشيف العلماء', icon: '🗝️' }, function (ok) { G.secCd = G.t + 20; if (ok) { G.addScore(300, 60); U.toast('+300 نقطة'); } }); } });
    // —— المقتنيات: ذرات ذهبية، قوارير طاقة، بطاقات معرفة
    var cardTxt = { hub: ['u1l1', 'حالات المادة'], z1: ['u4l4', 'تميّه الأملاح'], z2: ['u5l3', 'نظرية التصادم'], z3: ['u3l1', 'مبدأ لوتشاتلييه'], z4: ['u7l1', 'المجموعات الوظيفية'], z5: ['u6l2', 'جهود الاختزال'], z6: ['u3l2', 'ثابت الاتزان'], hall: ['u2l2', 'الخصائص الجامعة'], sec: ['u4l3', 'قوة الحموض'] };
    W.ROOMS.forEach(function (r) {
      var avoid = r.id === 'z1' ? function (x, z) { return G.poolInside(x, z) || (x > G.pool.x0 - 1 && x < G.pool.x1 + 1); } : null;
      for (var i = 0; i < (r.id === 'sec' ? 14 : 8); i++) { var p = freePos(r.id, rng, avoid), id = 'c_' + r.id + i; E.pick({ id: id, kind: 'coin', x: p[0], z: p[1], taken: false }); }
      for (i = 0; i < (r.id === 'sec' ? 3 : 2); i++) { p = freePos(r.id, rng, avoid); E.pick({ id: 'e_' + r.id + i, kind: 'energy', x: p[0], z: p[1], mesh: 'flask', col: '#22c55e', y: .45 }); }
      if (cardTxt[r.id]) { p = freePos(r.id, rng, avoid); E.pick({ id: 'card_' + r.id, kind: 'card', x: p[0], z: p[1], mesh: 'card', col: '#c7d2fe', y: 1, card: cardTxt[r.id], lab: labelTex('📘 ' + cardTxt[r.id][1], '#6366f1', 28), labW: 1.6, labA: .3 }); }
    });
    E.picks.forEach(function (p) { if (S.taken[p.id] && p.kind !== 'atom') p.taken = true; });
    G.cardsTotal = Object.keys(cardTxt).length;
    // —— الأعداء
    var foes = { z1: [['h3o', .78, .25], ['oh', .78, .75], ['h3o', .9, .5], ['oh', .3, .3], ['h3o', .3, .75]], z2: [['radical', .25, .3], ['radical', .8, .7], ['radical', .4, .75], ['radical', .75, .25]],
      z3: [['shifter', .6, .3], ['shifter', .4, .8], ['radical', .8, .5]], z4: [['turret', .12, .15], ['turret', .88, .85], ['radical', .7, .3], ['radical', .3, .6]],
      z5: [['spark', .5, .3], ['spark', .5, .7], ['spark', .2, .5], ['turret', .9, .12]], z6: [['h3o', .2, .3], ['oh', .8, .3], ['shifter', .2, .6], ['spark', .8, .6], ['turret', .5, .08]], hall: [['radical', .3, .5]] };
    Object.keys(foes).forEach(function (rid) { var z = ROOMZ[rid]; if (S.crystals[z]) return; foes[rid].forEach(function (f) { var p = at(rid, f[1], f[2]); if (W.blocked(p[0], p[1], .7)) p = freePos(rid, rng); E.spawn(f[0], p[0], p[1], rid, R); }); });
    // —— بلورات لم تُلتقط بعد هزيمة زعيمها
    for (var bz = 1; bz <= 6; bz++) if (S.flags['bd' + bz] && !S.crystals[bz]) { var bq = BOSSPOS[bz], bpp = at(bq[0], bq[1], bq[2]); E.pick({ id: 'crystal' + bz, kind: 'crystal', z0: bz, x: bpp[0], z: bpp[1], mesh: 'crystal', col: G.ZC[bz], s: 1.2, y: 1.3, em: .6 }); }
    // —— حالة الأبواب
    G.refreshDoors(true);
  };
  /* متطلبات الأبواب */
  G.doorReq = function (d) {
    var S = G.save, F0 = S.flags, need = { d1: [F0.d1, 'افتح الباب بتحديد طبيعة محلوله بكاشف من رف الأدلة'], d2: [S.crystals[1], 'يحتاج بلورة مختبر الأحماض والقواعد'], dh: [S.crystals[2], 'يحتاج بلورة مختبر سرعة التفاعلات'], d3: [S.crystals[2], 'يحتاج بلورة مختبر سرعة التفاعلات'],
      d4: [S.crystals[3], 'يحتاج بلورة مختبر الاتزان'], d5: [S.crystals[4], 'يحتاج بلورة مختبر الكيمياء العضوية'], d6: [S.crystals[5], 'يحتاج بلورة مختبر الخلايا الكهروكيميائية'], ds: [F0.secret, 'ممر سري'] }[d.id];
    return { ok: !!need[0], msg: need[1] };
  };
  G.refreshDoors = function (silent) {
    W.doors.forEach(function (d) { var r = G.doorReq(d); var was = d.locked; d.locked = !r.ok || d.zoneLock; if (silent && !d.locked) d.open = 1; d.target = d.locked ? 0 : 1; if (was && !d.locked && !silent && !d.secret) G.openDoor(d, true); d.labKey = null; });
  };
  G.openDoor = function (d, cine) { d.locked = false; d.target = 1; A.play('door'); if (cine) { G.cam.cinema([d.x, 0, d.z], { dur: 1.8, hold: .9, r: 8, h: 5 }); var to = W.rooms[d.c.to]; U.toast('🔓 انفتح باب: ' + (to ? to.name : '')); } };
  G.lockZoneDoors = function (on, rid) { W.doors.forEach(function (d) { if (!on) { d.zoneLock = false; } else if (d.c.to === rid || d.c.from === rid) d.zoneLock = true; }); G.refreshDoors(true); W.doors.forEach(function (d) { if (d.zoneLock) { d.target = 0; } }); };

  /* ---------- الزعماء ---------- */
  var BOSSPOS = { 1: ['z1', .3, .5], 2: ['z2', .55, .78], 3: ['z3', .5, .3], 4: ['z4', .5, .25], 5: ['z5', .55, .45], 6: ['z6', .5, .72] };
  G.zoneReady = function (z) { var f = G.save.flags; return { 1: f.z1pool && f.z1salts, 2: f.z2rate && f.z2graph, 3: f.z3lc && f.z3kc, 4: (f.z4m || 0) >= 2 && (f.z4f || 0) >= 2, 5: f.z5g && f.z5m, 6: f.z6k0 && f.z6k1 && f.z6k2 }[z]; };
  G.checkBoss = function (z) { if (G.zoneReady(z) && !G.save.crystals[z] && !G.boss) { AT.say('أنجزت مهام المختبر… لكن شيئاً ما يتحرك! استعد للمواجهة.', 'tip'); setTimeout(function () { G.startBoss(z); }, 1600); } };
  G.bossMode = function (z) { return G.boss && G.boss.alive && G.boss.z === z && G.boss.shield; };
  G.startBoss = function (z) {
    if (G.boss || G.save.crystals[z]) return; var bp = BOSSPOS[z], p = W.at(bp[0], bp[1], bp[2]); var b = G.boss = JG.Bosses.make(z, p[0], p[1], bp[0], G); b.wasHit = false;
    G.lockZoneDoors(true, bp[0]); A.play('boss'); A.track(z === 6 ? 'final' : 'boss'); U.letterbox(true); U.banner(b.D.name, b.D.sub, b.D.col); G.player.frozen = true;
    W.lights.forEach(function (L) { if (L.room === bp[0]) L.alarm = true; });
    G.cam.cinema([p[0], 0, p[1]], { dur: 2.4, hold: 1.2, r: 9, h: 4.5, done: function () { b.intro = false; U.letterbox(false); G.player.frozen = false; AT.say(b.D.tip, 'tip'); } });
  };
  G.onBossShield = function (b) { U.banner('درع منيع!', 'توجّه إلى محطة الإضعاف المضيئة', '#38bdf8'); AT.say('رفع ' + b.D.name + ' درعاً منيعاً لا تخترقه الطلقات. حلّ تحدّي إحدى محطات الإضعاف المضيئة في المختبر لكسره!', 'tip'); };
  G.weaken = function (z) {
    var b = G.boss, picks = { 1: [Z.saltSort], 2: [Z.energyGraph], 3: [Z.leChatelier, Z.kcCalc], 4: [], 5: [Z.galvanic, Z.molten], 6: [Z.kcCalc, Z.molten, Z.energyGraph] }[z];
    var done = function (ok) {
      if (!G.boss || !G.boss.alive) return;
      if (ok !== false) { b.shield = false; b.stun = 3.5; b.hp -= b.max * .08; A.play('zap'); G.cam.shake = .8; for (var i = 0; i < 40; i++) E.emit(b.x + (Math.random() - .5), 1 + Math.random() * 3, b.zz + (Math.random() - .5), '#a5f3fc', 2, .8, .4, 1.5);
        if (z === 4 && b.segs.length) { b.segs.splice(-3, 3); G.float('كسر روابط!', b.x, 3, b.zz, '#fde047'); }
        U.banner('انكسر الدرع!', 'أطلق الآن — الزعيم مشلول', '#22c55e'); if (b.hp <= 0) G.bossDie(b); }
      else { b.hp = Math.min(b.max, b.hp + b.max * .06); A.play('roar'); AT.say('الإجابة الخاطئة غذّت الزعيم فاستعاد بعض طاقته. راجع التفسير وحاول مجدداً في محطة أخرى.', 'wrong'); }
    };
    var ls = ZL[z] || null;
    if (picks.length && Math.random() < .5) Z.rnd(picks)(G, done);
    else Z.mcq(G, { lessons: ls, title: 'محطة الإضعاف — ' + b.D.name, icon: '⚡', stakes: 'كسر الدرع', retry: false, okText: 'أطلق الطاقة على الزعيم ←', wrongWorld: 'الزعيم يمتص الطاقة الخاطئة!' }, done);
  };
  G.bossDie = function (b) {
    b.alive = false; G.save.flags['bd' + b.z] = 1; A.play('win'); A.track('lab'); G.cam.shake = 1.2; var z = b.z; E.burst(b.x, 2, b.zz, b.D.col, 160, 9, 1.4, .5, 2);
    E.foes.forEach(function (f) { if (f.room === b.room && !f.dead) { f.dead = true; E.burst(f.x, 1, f.z, f.T.col, 20, 4, .6, .3); } }); E.hazards.length = 0; G.player.slow = false;
    G.addScore(1000 * z, 150); G.award('b' + z); if (!b.wasHit) G.award('clean');
    W.lights.forEach(function (L) { L.alarm = false; }); G.player.emote = 'win'; G.player.emoteT = 2.2;
    U.banner('هُزم ' + b.D.name + '!', 'التقط بلورة المعرفة', '#fde047');
    var ex = b.x, ez = b.zz; if (W.blocked(ex, ez, .5)) { var c = W.at(b.room, .5, .5); ex = c[0]; ez = c[1]; }
    E.pick({ id: 'crystal' + z, kind: 'crystal', z0: z, x: ex, z: ez, mesh: 'crystal', col: G.ZC[z], s: 1.2, y: 1.3, em: .6 });
    setTimeout(function () { G.boss = null; G.lockZoneDoors(false); }, 400);
    G.persist();
  };
  var REWARD = { 1: 'الطاقة القصوى +20', 2: 'أداة المحفّز ⚡ (R)', 3: 'درع لوشاتلييه 🛡️ (F)', 4: 'مجمّع الجزيئات 🧲 (جذب تلقائي)', 5: 'قطب الإلكترونات 🔋 (طلقات أقوى)', 6: 'لقب بطل المختبر' };
  G.takeCrystal = function (z) {
    var S = G.save; S.crystals[z] = 1; A.play('level'); var P = G.player;
    if (z === 1) { S.maxE += 20; P.maxE = S.maxE; } if (z === 2) S.tools.boost = 1; if (z === 3) S.tools.shield = 1; if (z === 4) S.tools.magnet = 1; if (z === 5) S.tools.beam = 1;
    P.energy = P.maxE; U.banner('بلورة المعرفة ' + z + '/6', 'مكافأة: ' + REWARD[z], G.ZC[z]);
    if (z === 6) { setTimeout(function () { G.mode = 'win'; A.play('win'); U.screen('win', G); G.persist(); }, 2200); }
    else { AT.say({ 1: 'رائع! حصلت على أول بلورة. باب مختبر سرعة التفاعلات (شرق الردهة) انفتح الآن.', 2: 'المحفّز بين يديك (R)! ممر المختبرات شمال الردهة مفتوح، ومنه إلى مختبر الاتزان غرباً.', 3: 'درع لوشاتلييه لك (F). مختبر الكيمياء العضوية شرق الممر بانتظارك.', 4: 'مجمّع الجزيئات يجذب الذرات والمقتنيات تلقائياً. مختبر الخلايا الكهروكيميائية شمال مختبر الاتزان.', 5: 'قطب الإلكترونات يضاعف قوة طلقاتك. الطريق إلى المختبر المركزي النهائي شمال الممر مفتوح!' }[z], 'ok'); }
    G.refreshDoors(false); G.persist();
  };

  /* ---------- الأهداف وقائمة المهام ---------- */
  var MISSIONS = [
    { t: 'افتح باب مختبر الأحماض والقواعد', d: 'خذ كاشفاً من رف الأدلة واستخدمه لتحديد طبيعة محلول الباب', ok: function (f) { return f.d1; }, tg: function () { return G.player.carry && G.player.carry.ind ? [G.d1.x + 2.3, G.d1.z] : [G.rack[0] + .8, G.rack[1]]; } },
    { t: 'عادِل حوض الحمض', d: 'احمل براميل القاعدة واسكبها حتى يصبح pH = 7', ok: function (f) { return f.z1pool; }, tg: function () { return G.valve; } },
    { t: 'صنّف الأملاح', d: 'خزانة الأملاح غرب الحوض: حمضي، قاعدي، متعادل', ok: function (f) { return f.z1salts; }, tg: function () { return st('salts'); } },
    { t: 'اهزم الحمض الأعظم والتقط البلورة', d: 'استخدم وضع القاعدة، واكسر دروعه في محطات الإضعاف', ok: function (f, S) { return S.crystals[1]; }, tg: function () { return crystalTg(1); } },
    { t: 'أكمل تجربة المفاعل الزمنية', d: 'مختبر سرعة التفاعلات: فعّل العوامل التي ترفع السرعة إلى 80', ok: function (f) { return f.z2rate; }, tg: function () { return [G.reactor.x, G.reactor.z + 2.4]; } },
    { t: 'اقرأ منحنى الطاقة', d: 'حدّد أسهم طاقة التنشيط وΔH', ok: function (f) { return f.z2graph; }, tg: function () { return st('graph'); } },
    { t: 'اهزم المثبّط والتقط البلورة', d: 'اقفز فوق الشعاع الدوّار وتجنّب هالة الإبطاء', ok: function (f, S) { return S.crystals[2]; }, tg: function () { return crystalTg(2); } },
    { t: 'افتح بوابة الاتزان', d: 'مختبر الاتزان (غرب الممر): أزِح الاتزان نحو النواتج', ok: function (f) { return f.z3lc; }, tg: function () { return st('lech'); } },
    { t: 'احسب ثابت الاتزان', d: 'حاسبة Kc في مختبر الاتزان', ok: function (f) { return f.z3kc; }, tg: function () { return st('kc'); } },
    { t: 'اهزم حارس لوشاتلييه والتقط البلورة', d: 'اقفز فوق موجات الضغط', ok: function (f, S) { return S.crystals[3]; }, tg: function () { return crystalTg(3); } },
    { t: 'صنّع جزيئين في آلة الجزيئات', d: 'مختبر الكيمياء العضوية (شرق الممر): اجمع ذرات C وH وO بالعدد المطلوب', ok: function (f) { return (f.z4m || 0) >= 2; }, tg: function () { return st('mach'); } },
    { t: 'أجب في محطة المجموعات الوظيفية', d: 'إجابتان صحيحتان', ok: function (f) { return (f.z4f || 0) >= 2; }, tg: function () { return st('func'); } },
    { t: 'اهزم البوليمر العملاق والتقط البلورة', d: 'الرأس نقطة الضعف', ok: function (f, S) { return S.crystals[4]; }, tg: function () { return crystalTg(4); } },
    { t: 'شغّل الخلية الجلفانية', d: 'مختبر الخلايا الكهروكيميائية (شمال مختبر الاتزان)', ok: function (f) { return f.z5g; }, tg: function () { return st('galv'); } },
    { t: 'حلّل المصهور كهربائياً', d: 'خلية التحليل الكهربائي', ok: function (f) { return f.z5m; }, tg: function () { return st('melt'); } },
    { t: 'اهزم عاصفة الإلكترونات والتقط البلورة', d: 'راقب دوائر الصواعق', ok: function (f, S) { return S.crystals[5]; }, tg: function () { return crystalTg(5); } },
    { t: 'فعّل مفاتيح المفاعل الثلاثة', d: 'المختبر المركزي النهائي (شمال الممر)', ok: function (f) { return f.z6k0 && f.z6k1 && f.z6k2; }, tg: function () { return [0, 1, 2].map(function (i) { return 'key' + i; }).filter(function (k) { return !G.save.flags['z6' + k.replace('key', 'k')]; }).map(st)[0]; } },
    { t: 'اهزم الخيميائي المظلم', d: 'المواجهة النهائية', ok: function (f, S) { return S.crystals[6]; }, tg: function () { return crystalTg(6); } }
  ];
  function st(id) { var s = G.inter.find(function (i) { return i.id === id; }); return s ? [s.x, s.z] : null; }
  function crystalTg(z) { var c = E.picks.find(function (p) { return p.kind === 'crystal' && p.z0 === z && !p.taken; }); if (c) return [c.x, c.z]; if (G.boss && G.boss.alive) return [G.boss.x, G.boss.zz]; var bp = BOSSPOS[z]; return W.at(bp[0], bp[1], bp[2]); }
  G.missionList = function () { var cur = false; return MISSIONS.map(function (m) { var d = !!m.ok(G.save.flags, G.save), c = !d && !cur; if (c) cur = true; return { t: m.t, d: m.d, done: d, cur: c }; }); };
  G.updObjective = function () {
    var m = MISSIONS.find(function (x) { return !x.ok(G.save.flags, G.save); });
    if (G.boss && G.boss.alive) { U.objective(G.boss.shield ? 'اكسر درع ' + G.boss.D.name + ' من محطة إضعاف مضيئة' : 'اهزم ' + G.boss.D.name); G.target = G.boss.shield ? G.nearestWeak() : [G.boss.x, G.boss.zz]; return; }
    if (!m) { U.objective('حرّرت المختبر! استكشف بحرية وحسّن نقاطك'); G.target = null; return; }
    var t = m.t; if (m === MISSIONS[1] && G.pool) t += ' (pH الآن ' + G.pool.pH().toFixed(2) + ')';
    if (m === MISSIONS[4] && G.reactor.on) t = 'السرعة ' + Math.round(G.rate()) + ' / 80 — الوقت المتبقي ' + Math.max(0, Math.ceil(G.reactor.lim - G.reactor.t)) + ' ث';
    if (m === MISSIONS[10]) { var mol = G.mol[G.save.flags.z4m || 0]; t = 'اجمع ذرات ' + mol.n + ' (' + mol.f + ') ثم اذهب للآلة — لديك: ' + ['C', 'H', 'O'].map(function (k) { return k + (G.inv[k] || 0); }).join(' '); }
    U.objective(t); G.target = m.tg();
  };
  G.nearestWeak = function () { var b = G.boss, P = G.player, best = null, bd = 1e9; G.inter.forEach(function (i) { if (i.kind === 'station' && i.zone === b.z) { var d = Math.hypot(i.x - P.pos[0], i.z - P.pos[2]); if (d < bd) { bd = d; best = [i.x, i.z]; } } }); return best; };

  /* ---------- التفاعل ---------- */
  G.curInter = null;
  G.interact = function () {
    if (G.mode !== 'play' || G.paused) return; var i = G.curInter;
    if (i) { i.act(); return; }
    var P = G.player, d = P.bumpDoor; if (d && Math.hypot(d.x - P.pos[0], d.z - P.pos[2]) < 4 && d.locked) { var r = G.doorReq(d); A.play('locked'); AT.say(d.zoneLock ? 'الأبواب مقفلة أثناء المواجهة!' : '🔒 ' + r.msg, 'info'); }
  };

  /* ---------- التحديث ---------- */
  var saveT = 0, fpsA = [], lastQ = 0;
  G.update = function (dt) {
    var P = G.player, S = G.save; G.t += dt; S.time += dt;
    IN.x = (IN.k.r ? 1 : 0) - (IN.k.l ? 1 : 0); IN.z = (IN.k.u ? 1 : 0) - (IN.k.d ? 1 : 0); if (IN.joy) { IN.x = IN.joy[0]; IN.z = IN.joy[1]; }
    var inp = { x: IN.x, z: IN.z, jump: IN.jump, run: IN.run || IN.runT || IN.joyRun }; P.update(dt, inp, G.cam, W, A); IN.jump = false;
    P.fireCd = Math.max(0, (P.fireCd || 0) - dt); P.boostCd = Math.max(0, (P.boostCd || 0) - dt); P.shieldCd = Math.max(0, (P.shieldCd || 0) - dt);
    if (IN.fire && P.fireCd <= 0) G.shoot();
    // الغرفة الحالية
    var r = W.roomAt(P.pos[0], P.pos[2]); if (r && !r.corr && r.id !== G.roomId) { G.roomId = r.id; if (!S.seen[r.id]) { S.seen[r.id] = 1; U.banner(r.name, r.zone >= 1 && r.zone <= 6 ? 'المختبر ' + r.zone : '', r.theme); AT.say(G.INTRO[r.id], 'info'); if (r.id === 'sec') G.award('secret'); }
      if (r.zone >= 1) S.check = [P.pos[0], P.pos[2]]; else S.check = null; }
    // حوض الحمض
    if (G.pool && G.poolInside(P.pos[0], P.pos[2]) && P.pos[1] < .25) { var ph = G.pool.pH(); if (Math.abs(ph - 7) > .01) { if (!P._poolT || G.t - P._poolT > .5) { P._poolT = G.t; P.hurt(7, P.pos[0] + (ph < 7 ? 1 : 1), P.pos[2], A); P.inv = .1; G.onHurt(); AT.once('pool', 'هذا الحوض ' + (ph < 7 ? 'حمضي' : 'قاعدي') + ' ويؤذيك! عادِله أولاً من صمام الحوض.', 'wrong'); } } }
    // المفاعل الزمني
    var R0 = G.reactor; if (R0 && R0.on) { R0.t += dt; if (G.rate() >= 80) { R0.on = false; S.flags.z2rate = 1; A.play('ok'); var left = R0.lim - R0.t; if (left > 15) G.award('speed'); G.log({ kind: 'rate', lesson: 'u5l3', skill: 'تطبيق', ok: true, tries: 1, hints: 0, ms: R0.t * 1000, zone: 2 });
        U.banner('اكتمل التفاعل!', 'السرعة ' + Math.round(G.rate()) + ' — التصادمات الفعالة في أوجها', '#22c55e'); G.movers.forEach(function (m) { m.on = false; }); AT.say('رائع! الحرارة ومساحة السطح والعامل المساعد معاً رفعت السرعة 10 أضعاف.', 'ok'); G.persist(); G.checkBoss(2); }
      else if (R0.t > R0.lim) { R0.on = false; A.play('bad'); G.movers.forEach(function (m) { m.on = false; }); U.banner('انتهى الوقت', 'أعد التجربة من لوحة المفاعل', '#ef4444'); AT.say('السرعة لم تبلغ 80. السرعة الأساسية 10، وكل عامل صحيح يضاعفها. هل فعّلت عاملاً يبطئ التفاعل؟', 'wrong'); G.log({ kind: 'rate', lesson: 'u5l3', skill: 'تطبيق', ok: false, tries: 1, hints: 0, ms: R0.t * 1000, zone: 2 }); }
      if (R0.on && Math.random() < dt * 2) { var a = Math.random() * 6.28; E.hazard({ kind: 'beam', x: R0.x, z: R0.z, a: a, sp: 1.2, len: 9, warn: .8, dur: 3, dmg: 8, col: '#fb923c' }); } }
    // المكابس المتحركة
    G.movers.forEach(function (m) { if (!m.on) { m.z += ((m.z0 + m.z1) / 2 - m.z) * dt; return; } m.t += dt; var u = (Math.sin(m.t / m.per * 6.283) + 1) / 2; m.z = m.z0 + (m.z1 - m.z0) * u;
      if (Math.abs(P.pos[0] - m.x) < m.w / 2 + P.r && Math.abs(P.pos[2] - m.z) < .9 + P.r && P.pos[1] < 1.2) { if (P.hurt(10 * G.diffK, m.x, m.z, A)) G.onHurt(); } });
    // المقتنيات
    E.picks.forEach(function (p) { if (p.taken) return; var dx = P.pos[0] - p.x, dz = P.pos[2] - p.z, d = Math.hypot(dx, dz);
      if (S.tools.magnet && d < 6 && p.kind !== 'crystal' && p.kind !== 'card') { p.x += dx / d * dt * 6; p.z += dz / d * dt * 6; }
      if (d < .95 && Math.abs(P.pos[1] + .8 - (p.y || .7)) < 1.5) G.collect(p); });
    E.updFoes(dt, G); E.updShots(dt, G); E.updHaz(dt, G); E.updParts(dt);
    if (G.boss) G.boss.update(dt, G);
    if (G.boss && G.boss.alive && G.boss.z !== 2) P.slow = false;
    W.doors.forEach(function (d) { d.open += (d.target - d.open) * Math.min(1, dt * 2.5); });
    G.floats = G.floats.filter(function (f) { f.t += dt; f.y += dt * .8; return f.t < 1.8; });
    // تلميحات ظرفية من ذرّة
    if (G.roomId === 'z1' && !S.flags.z1pool) AT.once('z1modes', 'لاحظ لون جهاز المعادلة على ظهرك: أزرق = OH⁻ (للأيونات الحمراء H₃O⁺)، أحمر = H₃O⁺ (للأيونات الزرقاء OH⁻).', 'tip');
    // التفاعل الأقرب
    var best = null, bd = 1e9; G.inter.forEach(function (i) { if (!i.can()) return; var d = Math.hypot(i.x - P.pos[0], i.z - P.pos[2]); if (d < i.r && d < bd) { bd = d; best = i; } }); G.curInter = best;
    saveT += dt; if (saveT > 12) { saveT = 0; G.persist(); }
    if (G.t - lastQ > .25) { lastQ = G.t; G.updObjective(); }
  };
  G.collect = function (p) {
    var S = G.save, P = G.player; if (p.kind === 'atom') { var cnt = G.inv[p.el] || 0; G.inv[p.el] = cnt + 1; p.taken = true; A.play('pick'); G.float(p.el + ' +1', p.x, 1.6, p.z, '#fde047'); return; }
    p.taken = true; S.taken[p.id] = 1;
    if (p.kind === 'coin') { S.coins++; G.addScore(10, 2); A.play('coin'); E.burst(p.x, .8, p.z, '#fde047', 8, 2, .4, .2); if (S.coins >= 100) G.award('coins'); }
    else if (p.kind === 'energy') { P.energy = Math.min(P.maxE, P.energy + 25); A.play('pick'); G.float('+25 طاقة', p.x, 1.4, p.z, '#86efac'); }
    else if (p.kind === 'card') { S.cards[p.id] = 1; A.play('ok'); var c = p.card; U.modal({ title: 'بطاقة معرفة: ' + c[1], icon: '📘', render: function (el, close) { el.innerHTML = '<div class="pz-exp ok">' + Z.fmt(AT.HINT[c[0]] || '') + '</div><p class="pz-msg">الدرس: ' + ((JG.LESSONS || {})[c[0]] || '') + ' — جمعت ' + Object.keys(S.cards).length + ' من ' + G.cardsTotal + ' بطاقات.</p><button class="pz-go" id="pzGo">متابعة</button>'; el.querySelector('#pzGo').onclick = close; } });
      G.addScore(80, 20); if (Object.keys(S.cards).length >= G.cardsTotal) G.award('cards'); }
    else if (p.kind === 'crystal') { E.burst(p.x, 1.3, p.z, p.col, 60, 5, 1, .4, 1); G.takeCrystal(p.z0); }
    G.persist();
  };
  G.INTRO = {
    hub: 'مرحباً! أنا ذرّة، مساعدتك في المختبر. تحرّك بـ WASD أو العصا، واقفز بالمسافة. مهمتك الأولى: خذ كاشفاً من رف الأدلة (غرب الردهة) لتفتح باب مختبر الأحماض والقواعد.',
    z1: 'هنا أيونات H₃O⁺ (حمراء) وOH⁻ (زرقاء). جهاز المعادلة يطلق الأيون المعاكس: بدّل الوضع بـ Q. الحوض أمامك حمضي — لا تخطُ فيه قبل معادلته!',
    z2: 'مختبر السرعة! ابدأ التجربة من لوحة المفاعل، وفعّل العوامل التي تزيد التصادمات الفعالة قبل انتهاء الوقت. احذر المكابس والليزر — اقفز فوقه.',
    hall: 'ممر المختبرات يربط بقية المختبرات. الأبواب تُفتح ببلورات المعرفة التي تحصل عليها من الزعماء.',
    z3: 'الاتزان ديناميكي: التفاعلان الأمامي والعكسي مستمران بالسرعة نفسها. استخدم مبدأ لوتشاتلييه لفتح البوابة. «المُزيحون» يدفعونك بقوة!',
    z4: 'اجمع ذرات C وH وO بالعدد المطلوب تماماً لتصنيع الجزيء، وانتبه للمتصاوغات! أبراج Br₂ تطلق مقذوفات — تحرّك باستمرار.',
    z5: 'الإلكترونات تتحرك في الدارة الخارجية من المصعد إلى المهبط. ابنِ خلية جلفانية بجهد كافٍ لتشغيل البوابة.',
    z6: 'المختبر المركزي! أعد تشغيل المفاعل بثلاثة مفاتيح معرفة، ثم واجه الخيميائي المظلم.',
    sec: 'وجدت المختبر السري! كنوز من المعرفة والطاقة بانتظارك.'
  };

  /* ---------- الرسم ---------- */
  var tex = {}, tmpM = new Float32Array(16);
  function screenTex(i) {
    var key = i.title + '|' + (i.can() ? 1 : 0) + '|' + (G.bossMode(i.zone) ? 'b' : ''); if (i._k === key) return i._t; i._k = key;
    var c = JG.makeCanvas(256, 160), x = c.getContext('2d'), done = !i.can() && !G.bossMode(i.zone), boss = G.bossMode(i.zone);
    var g = x.createLinearGradient(0, 0, 0, 160); g.addColorStop(0, boss ? '#083344' : '#0b1222'); g.addColorStop(1, boss ? '#0e7490' : '#111c33'); x.fillStyle = g; x.fillRect(0, 0, 256, 160);
    x.strokeStyle = boss ? '#67e8f9' : i.col; x.lineWidth = 6; x.strokeRect(3, 3, 250, 154); x.fillStyle = '#fff'; x.textAlign = 'center'; x.direction = 'rtl'; x.font = '800 30px ' + JG.FONT; x.fillText(JG.ND(i.title), 128, 58);
    x.font = '700 24px ' + JG.FONT; x.fillStyle = boss ? '#a5f3fc' : (done ? '#86efac' : '#fde68a'); x.fillText(boss ? '⚡ محطة إضعاف' : (done ? '✔ مكتمل' : '◉ جاهز'), 128, 110);
    i._t = G.R.texture(c, i._t); return i._t;
  }
  function doorTex(d) {
    var r = G.doorReq(d), to = W.rooms[d.c.to], key = (d.locked ? 'L' : 'O') + (d.zoneLock ? 'Z' : ''); if (d.labKey === key) return d.lab; d.labKey = key;
    d.lab = G.R.texture(JG.labelCanvas((d.locked ? '🔒 ' : '🔓 ') + (to ? to.name : '') + (d.locked && !d.zoneLock ? '\n' + r.msg : (d.zoneLock ? '\nمقفل أثناء المواجهة' : '')), { fs: 30, bg: 'rgba(8,12,28,.85)', col: '#fff', bd: d.locked ? '#ef4444' : '#22c55e' }), d.lab); d.labA = d.locked && !d.zoneLock ? .34 : .2; return d.lab;
  }
  G.render = function () {
    var R = G.R, t = G.t, P = G.player, gl = R.gl, Q = G.qual;
    // اختيار أقرب 4 أضواء
    var cx = G.cam.tgt[0], cz = G.cam.tgt[2]; var Ls = W.lights.slice(); if (G.boss && G.boss.alive) Ls.push({ p: [G.boss.x, 3, G.boss.zz], c: C(G.boss.D.col), i: 1.6, r: 12 });
    if (G.pool && Math.abs(G.pool.pH() - 7) > .01) Ls.push({ p: [(G.pool.x0 + G.pool.x1) / 2, 1.5, (G.pool.z0 + G.pool.z1) / 2], c: G.pool.pH() < 7 ? [1, .3, .2] : [.4, .3, 1], i: .9 + Math.sin(t * 3) * .2, r: 10 });
    Ls.forEach(function (L) { L._d = Math.hypot(L.p[0] - cx, L.p[2] - cz); if (L.alarm) { L.c = [1, .2, .2]; L.i = L.base * (.6 + .5 * Math.abs(Math.sin(t * 4))); } else if (L.base && L.c0) { L.c = L.c0; L.i = L.base; } if (!L.c0 && L.base) L.c0 = L.c.slice(); });
    Ls.sort(function (a, b) { return a._d - b._d; }); R.lights = Ls.slice(0, 4);
    R.begin(); R.draw(W.mesh, null, { spec: .2 });
    // انعكاسات الكائنات المتحركة على الأرضية اللامعة
    if (Q.reflect) { gl.frontFace(gl.CW); P.draw(R, t, true); E.drawFoes(R, t, true); if (G.boss) G.boss.draw(R, t, true); gl.frontFace(gl.CCW); }
    R.draw(W.floor, null, { a: Q.reflect ? .9 : 1, spec: .9 });
    // الظلال الدائرية
    var sh = function (x, z, s, a) { R.plane(E.tex.shadow, M4.trs(x, .02, z, 0, 0, 0, s, 1, s), [1, 1, 1, a || 1], true); };
    sh(P.pos[0], P.pos[2], 1.3 - Math.min(.6, P.pos[1] * .3)); E.foes.forEach(function (f) { if (!f.dead) sh(f.x, f.z, f.T.r * 2.6, .8); }); if (G.boss && G.boss.alive) sh(G.boss.x, G.boss.zz, G.boss.D.r * 2.8);
    // الحوض
    if (G.pool) { var p = G.pool, ph = p.pH(), col = Math.abs(ph - 7) < .01 ? [.4, .8, 1, .45] : (ph < 7 ? [1, .25 + (ph / 7) * .4, .15, .7] : [.55, .3, 1, .7]);
      R.plane(E.tex.glow, M4.trs((p.x0 + p.x1) / 2, .06, (p.z0 + p.z1) / 2, 0, 0, 0, p.x1 - p.x0 + 2, 1, p.z1 - p.z0), [col[0], col[1], col[2], col[3]], true);
      R.draw(W.unitBox, M4.trs((p.x0 + p.x1) / 2, .03, (p.z0 + p.z1) / 2, 0, 0, 0, p.x1 - p.x0, .06, p.z1 - p.z0), { tint: [col[0], col[1], col[2]], a: .55, em: .5, emc: [col[0] * .3, col[1] * .3, col[2] * .3], spec: 1 });
      if (Math.abs(ph - 7) > .01 && Math.random() < .5) E.emit(p.x0 + Math.random() * (p.x1 - p.x0), .1, p.z0 + Math.random() * (p.z1 - p.z0), ph < 7 ? '#fca5a5' : '#c4b5fd', .8, .9, .25); }
    // الأبواب
    W.doors.forEach(function (d) {
      if (d.secret) { if (!W.secretOpen) R.draw(W.unitBox, M4.trs(d.x, .65, d.z, 0, 0, 0, d.span, 1.3, .4), { tint: [.27, .25, .3] }); return; }
      var y = 1.45 + d.open * 2.75, sx = d.horiz ? .3 : d.span, sz = d.horiz ? d.span : .3, col = d.locked ? [.75, .25, .3] : C(W.rooms[d.c.to] ? W.rooms[d.c.to].theme : '#64748b');
      if (d.open < .98) { R.draw(W.doorMesh, M4.trs(d.x, y, d.z, 0, 0, 0, sx, 2.9, sz), { tint: [col[0] * .9 + .1, col[1] * .9 + .1, col[2] * .9 + .1], spec: .6 }); R.draw(W.unitBox, M4.trs(d.x, y, d.z, 0, 0, 0, sx + .02, .12, sz + .02), { tint: col, em: .9, emc: col }); }
    });
    // المحطات والعناصر التفاعلية
    var m = E.meshes;
    G.inter.forEach(function (i) {
      if (i.kind === 'station') { R.draw(m.station, M4.trs(i.x, 0, i.z, 0, i.rot, 0, 1), { spec: .4 }); var fx = Math.sin(i.rot), fz = Math.cos(i.rot);
        var boss = G.bossMode(i.zone); R.plane(screenTex(i), M4.trs(i.x - fx * .27, 1.8, i.z - fz * .27, 0, i.rot, 0, 1.3, .82, 1), [1, 1, 1, 1]);
        if (boss || (i.can() && !G.boss)) { var cc = boss ? [.4, .9, 1] : C(i.col); R.plane(E.tex.glow, M4.trs(i.x, .05, i.z, 0, 0, 0, 3.2 + Math.sin(t * 4) * .3, 1, 3.2 + Math.sin(t * 4) * .3), [cc[0], cc[1], cc[2], boss ? .8 : .35], true, true);
          if (boss && Math.random() < .3) E.emit(i.x + (Math.random() - .5), .3, i.z + (Math.random() - .5), '#a5f3fc', 2.5, .7, .3); } }
      else if (i.kind === 'bottle' && i.can()) { R.draw(m.bottle, M4.trs(i.x - .8, 1, i.z, 0, t, 0, 1.2), { tint: C(i.col), spec: .9, em: .2 }); R.sprite(i.lab, i.x - .8, 1.9, i.z, 1.6, .5); }
      else if (i.kind === 'barrel') { R.draw(m.barrel, M4.trs(i.bx, 0, i.z, 0, 0, 0, 1), { tint: C(i.col), spec: .6 }); if (!F().z1pool) R.sprite(i.lab, i.bx, 1.5, i.z, 2.4, .42); }
      else if (i.kind === 'lever') { R.draw(m.lever, M4.trs(i.lx, 0, i.lz, 0, 0, 0, 1)); var on = G.reactor.lev[i.lv[0]]; R.draw(m.handle, M4.trs(i.lx, 1.05, i.lz, on ? .7 : -.7, 0, 0, 1), { tint: on ? [.3, 1, .4] : [1, 1, 1], em: on ? .4 : 0, emc: [.1, .5, .1] }); R.sprite(i.lab, i.lx, 1.95, i.lz, 2.3, .4); }
      else if (i.kind === 'valve' && !F().z1pool) { R.draw(m.lever, M4.trs(i.x, 0, i.z, 0, 0, 0, 1)); var ph2 = G.pool.pH(); if (!i._ph || Math.abs(i._phv - ph2) > .001) { i._phv = ph2; i._ph = G.R.texture(JG.labelCanvas('pH = ' + ph2.toFixed(2) + '\nH₃O⁺: ' + G.pool.nH.toFixed(1) + ' mol · OH⁻: ' + G.pool.nOH.toFixed(1) + ' mol', { fs: 30, bd: '#a855f7' }), i._ph); } R.sprite(i._ph, i.x, 2.2, i.z, 2.6, .78); }
      else if (i.kind === 'switch' && i.can()) { R.draw(W.unitBox, M4.trs(i.x, 1.3, i.z - .5, 0, 0, 0, .5, .5, .08), { tint: [.9, .3, .7], em: .5 + Math.sin(t * 5) * .3, emc: [.6, .1, .4] }); }
    });
    // المفاعل
    if (G.reactor) { var Rc = G.reactor, rate = Math.min(100, G.rate()); R.draw(m.ball, M4.trs(Rc.x, 1.3, Rc.z, 0, t * (Rc.on ? rate / 20 : .2), 0, 1.4, 1.2, 1.4), { tint: [1, .55 + rate / 300, .2], em: .3 + rate / 200, emc: [.5, .2, 0], a: 1, spec: 1 });
      R.draw(m.pistonHead, M4.trs(Rc.x, .25, Rc.z, 0, 0, 0, 3, .5, 3), { tint: [.2, .22, .28] });
      if (Rc.on && Math.random() < rate / 60) E.emit(Rc.x + (Math.random() - .5) * 1.5, 2.4, Rc.z + (Math.random() - .5) * 1.5, '#fdba74', 2 + rate / 40, .8, .3);
      var lb = 'سرعة التفاعل: ' + Math.round(G.rate()) + (Rc.on ? ' · ' + Math.max(0, Math.ceil(Rc.lim - Rc.t)) + ' ث' : (F().z2rate ? ' ✔' : '')); if (Rc._lb !== lb) { Rc._lb = lb; Rc._t = R.texture(JG.labelCanvas(lb, { fs: 34, bd: '#f97316' }), Rc._t); } R.sprite(Rc._t, Rc.x, 3.3, Rc.z, 3, .55); }
    G.movers.forEach(function (mv) { R.draw(m.pistonHead, M4.trs(mv.x, .6, mv.z, 0, 0, 0, mv.w, 1.2, 1.8), { tint: mv.on ? [1, .55, .2] : [.45, .45, .5], em: mv.on ? .25 : 0, emc: [.4, .15, 0] }); });
    E.drawPicks(R, t); P.draw(R, t, false); E.drawFoes(R, t, false); if (G.boss) G.boss.draw(R, t, false); E.drawShots(R);
    // الشفافيات
    R.draw(W.glass, null, { a: .14, spec: 1, em: .1, emc: [.2, .3, .4] });
    E.drawHaz(R);
    if (P.shieldT > 0) R.draw(E.meshes.ball, M4.trs(P.pos[0], P.pos[1] + 1, P.pos[2], 0, t, 0, 1.15), { tint: [.4, .9, 1], a: .22, em: .8, emc: [.2, .5, .8] });
    if (G.target && G.mode === 'play') { var tg = G.target; R.plane(E.tex.ringT, M4.trs(tg[0], .06, tg[1], 0, 0, 0, 1.6 + Math.sin(t * 5) * .2, 1, 1.6 + Math.sin(t * 5) * .2), [1, .9, .3, .9], true, true); R.sprite(E.tex.glow, tg[0], 2.6 + Math.sin(t * 3) * .2, tg[1], .5, .5, [1, .9, .3, .9], true); }
    R.particles(E.parts);
    E.drawFoeUI(R);
    W.doors.forEach(function (d) { if (d.secret || d.open > .95) return; var l = doorTex(d); R.sprite(l, d.x, 3.7, d.z, d.labA > .3 ? 4.2 : 3.2, (d.labA > .3 ? 4.2 : 3.2) * d.labA); });
    G.floats.forEach(function (f) { R.sprite(f.tex, f.x, f.y, f.z, f.w, f.w * .2, [1, 1, 1, Math.min(1, 2 - f.t)]); });
    // موضع رسالة التفاعل
    if (G.curInter && G.mode === 'play' && !G.paused) { var pp = R.project(G.curInter.x, 2.6, G.curInter.z); U.prompt(G.curInter.name(), pp ? pp[0] : undefined, pp ? pp[1] : undefined); } else U.prompt(null);
  };

  /* ---------- الحلقة ---------- */
  var last = 0, titleT = 0;
  function frame(ts) {
    requestAnimationFrame(frame); var dt = Math.min(.05, (ts - last) / 1000 || .016); last = ts;
    if (document.hidden) return;
    try {
      if (G.mode === 'play' && !G.paused && !(G.cam.cine && G.player.frozen && false)) G.update(dt);
      else if (G.mode === 'play' && G.cam.cine) { G.t += dt; E.updParts(dt); if (G.boss) G.boss.t += dt; }
      if (G.mode === 'title' || G.mode === 'boot') { titleT += dt; G.t += dt; E.updParts(dt); var c = W.at('hub', .5, .5); G.R.setCamera([c[0] + Math.sin(titleT * .12) * 15, 9, c[1] + Math.cos(titleT * .12) * 15], [c[0], 1, c[1]], .9); if (Math.random() < .3) E.emit(c[0] + (Math.random() - .5) * 3, .5, c[1] + (Math.random() - .5) * 3, ['#38bdf8', '#a855f7', '#22c55e'][Math.floor(Math.random() * 3)], 1.5, 1.5, .3); }
      else G.cam.update(dt, G.player, G.R);
      G.render();
      if (G.mode === 'play') { U.hud(G); if (Math.floor(G.t * 8) !== G._mm) { G._mm = Math.floor(G.t * 8); U.minimap(G, false); } }
      // جودة تلقائية
      if (G.settings.quality === 'auto' && G.mode === 'play') { fpsA.push(dt); if (fpsA.length > 90) { var avg = fpsA.reduce(function (a, b) { return a + b; }, 0) / fpsA.length; fpsA = []; if (avg > 1 / 38 && G.dpr > .75) { G.dpr = Math.max(.75, G.dpr - .25); G.qual.reflect = false; G.resize(); } else if (avg < 1 / 57 && G.dpr < G.maxDpr) { G.dpr = Math.min(G.maxDpr, G.dpr + .25); G.resize(); } } }
    } catch (e) { if (!G._errShown) { G._errShown = 1; console.error(e); } }
  }
  G.resize = function () {
    var q = G.settings.quality; G.maxDpr = Math.min(q === 'low' ? 1 : 1.75, devicePixelRatio || 1); if (q !== 'auto' || !G.dpr) G.dpr = q === 'low' ? Math.min(1, G.maxDpr) : G.maxDpr;
    G.qual = { reflect: G.settings.reflect && q !== 'low' && (G.qual ? G.qual.reflect !== false || q === 'high' : true) };
    if (q === 'high') G.qual.reflect = G.settings.reflect;
    G.R.resize(innerWidth, innerHeight, G.dpr);
  };

  /* ---------- الشاشات والأفعال ---------- */
  G.togglePause = function (sub) {
    if (G.mode !== 'play' || U.open) return;
    if (!$('screen').hidden && !sub) { U.screen(null); G.paused = false; G._prev = null; return; }
    G.paused = true; IN.reset(); U.screen(sub || 'pause', G); G._prev = sub ? 'pause' : null; if (sub) G._prev = 'pause';
  };
  G.onScreenAction = function (a) {
    var back = function () { if (G.mode === 'play') U.screen(G._prev || 'pause', G); else U.screen(G.mode === 'win' ? 'win' : 'title', G); G._prev = null; };
    var go = function (n) { G._prev = G._prevKeep || (G.mode === 'play' ? 'pause' : (G.mode === 'win' ? 'win' : 'title')); U.screen(n, G); };
    switch (a) {
      case 'new': var nm = ($('pName') || {}).value || ''; G.save = freshSave(); G.save.name = nm.trim(); AT.load({ stats: {}, tips: {} }); W.secretOpen = false; G.inv = {}; G.mol = null; JG.DB.recent = []; G.start(true); break;
      case 'continue': var nm2 = ($('pName') || {}).value || ''; G.loadSave(); if (nm2.trim()) G.save.name = nm2.trim(); G.start(false); break;
      case 'resume': U.screen(null); G.paused = false; break;
      case 'help': case 'ach': case 'report': case 'settings': case 'admin': case 'missions': case 'map': go(a); break;
      case 'back': back(); break;
      case 'quit': G.persist(); G.mode = 'title'; G.paused = false; A.track('title'); U.screen('title', G); $('hud').hidden = true; break;
      case 'expJSON': G.exportReport('json'); break; case 'expCSV': G.exportReport('csv'); break;
      case 'respawn': G.respawn(); break;
      case 'site': G.persist(); location.href = '/'; break;
      case 'freeplay': G.mode = 'play'; G.paused = false; U.screen(null); break;
    }
  };
  G.start = function (fresh) {
    A.init(); A.track('lab'); G.mode = 'play'; G.paused = false; U.screen(null); $('hud').hidden = false;
    G.diffK = [0, .7, 1, 1.3][G.settings.diff]; G.diffHP = [0, .8, 1, 1.25][G.settings.diff];
    W.doors.forEach(function (d) { d.open = 0; d.zoneLock = false; }); G.boss = null; E.shots.length = 0; E.parts.length = 0;
    G.setup(); var P = G.player, S = G.save; P.maxE = S.maxE; P.energy = S.energy || P.maxE; P.carry = null; P.mode = 'base';
    if (!fresh && S.pos) { P.pos = [S.pos[0], 0, S.pos[2]]; P.h = P.th = S.pos[3] || 0; } else { P.pos = [G.spawnPt[0], 0, G.spawnPt[1]]; P.h = P.th = Math.PI; }
    if (W.blocked(P.pos[0], P.pos[2], P.r)) P.pos = [G.spawnPt[0], 0, G.spawnPt[1]];
    G.cam.yaw = P.h; G.cam.eye = [P.pos[0] - Math.sin(P.h) * 6, 8, P.pos[2] - Math.cos(P.h) * 6]; G.cam.tgt = [P.pos[0], 1, P.pos[2]];
    var r = W.roomAt(P.pos[0], P.pos[2]); G.roomId = r ? r.id : 'hub';
    for (var z = 1; z <= 6; z++) if (G.zoneReady(z) && !S.crystals[z] && !E.picks.some(function (p) { return p.kind === 'crystal' && p.z0 === z; })) { /* الزعيم يظهر عند العودة لمنطقته */ }
    if (fresh) { setTimeout(function () { AT.say(G.INTRO.hub, 'info'); }, 900); U.banner('مختبر الأردن الذكي', 'الردهة المركزية', '#38bdf8'); }
    else U.toast('أهلاً بعودتك يا ' + (S.name || 'بطل الكيمياء') + '! تم استرجاع تقدمك.');
    G.persist();
  };
  /* إعادة ظهور الزعيم عند العودة إلى منطقة جاهزة */
  setInterval(function () { if (G.mode !== 'play' || G.boss || G.paused) return; var z = ROOMZ[G.roomId]; if (z >= 1 && z <= 6 && G.zoneReady(z) && !G.save.crystals[z] && !E.picks.some(function (p) { return p.kind === 'crystal' && p.z0 === z && !p.taken; })) G.startBoss(z); }, 1500);

  /* ---------- الإقلاع ---------- */
  G.boot = function () {
    var cv = $('cv');
    try { G.R = new JG.Renderer(cv, { aa: true }); } catch (e) { $('boot').innerHTML = '<div class="err"><b>تعذّر تشغيل الرسوم ثلاثية الأبعاد</b><p>' + e.message + '</p><p>جرّب متصفحاً حديثاً (Chrome / Edge / Safari) مع تفعيل تسريع الرسوميات.</p></div>'; return; }
    G.coarse = matchMedia('(pointer: coarse)').matches; G.resize(); addEventListener('resize', G.resize);
    E.init(G.R); JG.Bosses.init(G.R); W.build(G.R); G.player = new JG.Player(G.R); G.cam = new JG.Cam();
    bindPointer(); G.applySettings();
    JG.DB.load(function () {
      $('boot').classList.add('gone'); setTimeout(function () { $('boot').hidden = true; }, 600);
      G.mode = 'title'; G.loadSave(); G.setup(); U.screen('title', G);
      document.addEventListener('pointerdown', function once() { A.init(); A.track('title'); document.removeEventListener('pointerdown', once); }, { once: true });
    });
    requestAnimationFrame(frame);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', G.boot); else G.boot();
})();
