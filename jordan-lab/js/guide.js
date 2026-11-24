/* ============================================================
   JG Guide — أسهم ذهبية مضيئة على الأرض تقود اللاعب إلى مهمته التالية
   + شرح توضيحي أثناء اللعب (مرة واحدة لكل موقف) + إعلان المهمة الجديدة
   المسار يُحسب بالبحث في شبكة المختبر (BFS) فيلتف حول الجدران ويمر من الأبواب
   ============================================================ */
(function () {
  'use strict';
  var JG = window.JG, G = JG.G, W = JG.World, AT = JG.Atom, U = JG.UI, M4 = JG.M4;
  var T = W.T || 2, MW = W.MW || 64, MH = W.MH || 58;
  var GD = JG.GUIDE = { on: true, path: [], t: 0, lastMission: null };
  try { GD.on = localStorage.getItem('jg_guide') !== '0'; } catch (e) {}

  /* نسيج السهم: رأس مزدوج يشير للأعلى في اللوحة */
  var arrowTex = null;
  function tex(R) {
    if (arrowTex) return arrowTex;
    var c = document.createElement('canvas'); c.width = c.height = 128; var x = c.getContext('2d');
    var g = x.createRadialGradient(64, 64, 6, 64, 64, 64); g.addColorStop(0, 'rgba(255,240,170,.55)'); g.addColorStop(1, 'rgba(255,200,40,0)');
    x.fillStyle = g; x.fillRect(0, 0, 128, 128);
    x.lineJoin = 'round'; x.lineCap = 'round'; x.strokeStyle = '#fff6c2'; x.lineWidth = 16;
    x.beginPath(); x.moveTo(26, 74); x.lineTo(64, 36); x.lineTo(102, 74); x.stroke();
    x.globalAlpha = .55; x.beginPath(); x.moveTo(34, 104); x.lineTo(64, 74); x.lineTo(94, 104); x.stroke();
    arrowTex = R.texture(c); return arrowTex;
  }

  function walk(tx, ty) { if (tx < 0 || ty < 0 || tx >= MW || ty >= MH) return false; var v = W.grid[ty * MW + tx]; return v === 1 || v > 2 || (v === 2 && W.secretOpen); }
  function bfs(sx, sy, gx, gy) {
    if (!walk(gx, gy)) { var f = null; for (var r = 1; r < 3 && !f; r++) for (var dy = -r; dy <= r && !f; dy++) for (var dx = -r; dx <= r; dx++) if (walk(gx + dx, gy + dy)) { f = [gx + dx, gy + dy]; break; } if (!f) return []; gx = f[0]; gy = f[1]; }
    var N = MW * MH, prev = new Int32Array(N).fill(-1), q = new Int32Array(N), h = 0, tl = 0, s = sy * MW + sx, g = gy * MW + gx;
    prev[s] = s; q[tl++] = s; var D = [1, 0, -1, 0, 0, 1, 0, -1];
    while (h < tl) { var c = q[h++]; if (c === g) break; var cx = c % MW, cy = (c / MW) | 0;
      for (var k = 0; k < 8; k += 2) { var nx = cx + D[k], ny = cy + D[k + 1], n = ny * MW + nx; if (walk(nx, ny) && prev[n] < 0) { prev[n] = c; q[tl++] = n; } } }
    if (prev[g] < 0) return []; var out = []; for (var p = g; p !== s; p = prev[p]) out.push([(p % MW) * T + T / 2, ((p / MW) | 0) * T + T / 2]); return out.reverse();
  }
  function recompute() {
    var P = G.player; if (!GD.on || !P || !G.target || G.mode !== 'play') { GD.path = []; return; }
    var tg = G.target, d = Math.hypot(tg[0] - P.pos[0], tg[1] - P.pos[2]); if (d < 3) { GD.path = []; return; }
    var pts = bfs(Math.floor(P.pos[0] / T), Math.floor(P.pos[2] / T), Math.floor(tg[0] / T), Math.floor(tg[1] / T));
    if (!pts.length) pts = [[tg[0], tg[1]]]; else pts.push([tg[0], tg[1]]);
    // نقاط على مسافات متساوية على طول المسار
    var out = [], cur = [P.pos[0], P.pos[2]], acc = -1.4, step = 1.7;
    for (var i = 0; i < pts.length && out.length < 9; i++) { var a = cur, b = pts[i], L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 1e-3) continue; var ux = (b[0] - a[0]) / L, uz = (b[1] - a[1]) / L;
      var s = -acc; while (s <= L && out.length < 9) { out.push({ x: a[0] + ux * s, z: a[1] + uz * s, ang: Math.atan2(ux, uz) }); s += step; } acc = L - (s - step); cur = b; }
    var tgx = tg[0], tgz = tg[1]; GD.path = out.filter(function (o) { return Math.hypot(o.x - tgx, o.z - tgz) > 1.6; });
  }
  setInterval(recompute, 350);

  /* الرسم بعد مشهد اللعبة */
  var oR = G.render;
  G.render = function () {
    oR.call(G);
    if (!GD.on || G.mode !== 'play' || !GD.path.length) return; var R = G.R, t = G.t, tx = tex(R);
    GD.path.forEach(function (o, i) { var w = .5 + .5 * Math.sin(t * 5 - i * .9), a = .45 + .5 * w, s = 1.05 + .15 * w;
      R.plane(tx, M4.trs(o.x, .07, o.z, 0, o.ang + Math.PI, 0, s, 1, s), [1, .82 + .1 * w, .3, a], true, true); });
  };

  /* ---------- الشرح التوضيحي ---------- */
  var said = {};
  function tip(k, txt) { if (AT && AT.once) AT.once('g_' + k, txt, 'info'); }
  setInterval(function () {
    if (G.mode !== 'play' || G.paused) return; var P = G.player; if (!P) return;
    if (!said.start) { said.start = 1; setTimeout(function () { tip('arrows', 'اتبع الأسهم الذهبية المضيئة على الأرض؛ إنها تقودك خطوة بخطوة إلى مهمتك التالية 🎯'); }, 6000); }
    if (G.curInter && !said.e) { said.e = 1; tip('interact', 'هذا جهاز يمكنك استخدامه! اضغط E أو زر اليد ✋ على الهاتف وأنت بجانبه.'); }
    if (P.energy < P.maxE * .3 && !said.low) { said.low = 1; tip('lowE', 'طاقتك منخفضة! التقط القوارير الخضراء 🧪 لتستعيدها، وابتعد قليلاً عن الأعداء.'); }
    var foe = JG.Ent && JG.Ent.foes && JG.Ent.foes.some(function (f) { return !f.dead && f.room === G.roomId; });
    if (foe && !said.foe) { said.foe = 1; tip('foes', 'أيونات معادية في الغرفة! بدّل اللون بزر التبديل: الأزرق OH⁻ يعادل الأحمر H₃O⁺ والعكس، ثم أطلق عليها.'); }
    // إعلان المهمة الجديدة عند تغيّرها
    var cur = G.missionList ? G.missionList().find(function (m) { return m.cur; }) : null, key = cur ? cur.t : null;
    if (key && GD.lastMission && key !== GD.lastMission && AT && AT.say) AT.say('✅ أحسنت! المهمة التالية: ' + cur.t + ' — ' + cur.d + '. اتبع الأسهم المضيئة.', 'info');
    if (key) GD.lastMission = key;
  }, 1000);

  /* زر إظهار/إخفاء الأسهم في قائمة الإيقاف */
  var oP = U.SC.pause;
  U.SC.pause = function (Gm) { var h = oP(Gm); return h.replace('<div class="btns col">', '<div class="btns col"><button class="sbtn" data-a="guideT">' + (GD.on ? '🧭 إخفاء أسهم الإرشاد' : '🧭 إظهار أسهم الإرشاد') + '</button>'); };
  var oA = G.onScreenAction;
  G.onScreenAction = function (a, b, e) { if (a === 'guideT') { GD.on = !GD.on; try { localStorage.setItem('jg_guide', GD.on ? '1' : '0'); } catch (x) {} recompute(); U.screen('pause', G); return; } return oA.call(G, a, b, e); };
})();
