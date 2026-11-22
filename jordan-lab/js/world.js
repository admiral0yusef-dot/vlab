/* ============================================================
   JG World — عالم متصل واحد: الردهة + 6 مختبرات + ممرات + منطقة سرية
   شبكة بلاطات (2م لكل بلاطة)، جدران زجاجية، أبواب منزلقة، تصادمات
   ============================================================ */
(function () {
  'use strict';
  var JG = window.JG = window.JG || {}, GB = JG.GB, C = JG.C;
  var T = 2, MW = 64, MH = 58;
  var W = JG.World = { T: T, MW: MW, MH: MH, grid: null, rooms: {}, doors: [], colliders: [], lights: [], props: [], screens: [], labels: [] };

  /* المناطق (إحداثيات بلاطات) — zone: رقم المختبر */
  var ROOMS = [
    { id: 'hub', x: 25, y: 40, w: 15, h: 13, zone: 0, name: 'الردهة المركزية', theme: '#38bdf8', fl: ['#1c2638', '#222e44'] },
    { id: 'z1', x: 3, y: 41, w: 16, h: 12, zone: 1, name: 'مختبر الأحماض والقواعد', theme: '#a855f7', fl: ['#241a33', '#2c2040'] },
    { id: 'z2', x: 46, y: 41, w: 16, h: 12, zone: 2, name: 'مختبر سرعة التفاعلات', theme: '#f97316', fl: ['#2e1d14', '#38241a'] },
    { id: 'hall', x: 21, y: 24, w: 23, h: 9, zone: 0, name: 'ممر المختبرات', theme: '#94a3b8', fl: ['#1d2330', '#232a39'] },
    { id: 'z3', x: 3, y: 22, w: 14, h: 13, zone: 3, name: 'مختبر الاتزان الكيميائي', theme: '#06b6d4', fl: ['#12282e', '#163138'] },
    { id: 'z4', x: 48, y: 22, w: 14, h: 13, zone: 4, name: 'مختبر الكيمياء العضوية', theme: '#eab308', fl: ['#2a2612', '#332e16'] },
    { id: 'z5', x: 3, y: 3, w: 16, h: 13, zone: 5, name: 'مختبر الخلايا الكهروكيميائية', theme: '#3b82f6', fl: ['#141d33', '#19243f'] },
    { id: 'z6', x: 24, y: 2, w: 17, h: 15, zone: 6, name: 'المختبر المركزي النهائي', theme: '#ef4444', fl: ['#2b1416', '#35191c'] },
    { id: 'sec', x: 49, y: 5, w: 9, h: 8, zone: 7, name: 'المختبر السري', theme: '#ec4899', fl: ['#2b1626', '#341b2e'] }
  ];
  /* الممرات: d = موقع الباب (عمود x أو صف y) */
  var CORR = [
    { id: 'd1', x: 19, y: 45, w: 6, h: 3, axis: 'x', d: 21, from: 'hub', to: 'z1' },
    { id: 'd2', x: 40, y: 45, w: 6, h: 3, axis: 'x', d: 43, from: 'hub', to: 'z2' },
    { id: 'dh', x: 31, y: 33, w: 3, h: 7, axis: 'y', d: 36, from: 'hub', to: 'hall' },
    { id: 'd3', x: 17, y: 27, w: 4, h: 3, axis: 'x', d: 18, from: 'hall', to: 'z3' },
    { id: 'd4', x: 44, y: 27, w: 4, h: 3, axis: 'x', d: 46, from: 'hall', to: 'z4' },
    { id: 'd5', x: 9, y: 16, w: 3, h: 6, axis: 'y', d: 18, from: 'z3', to: 'z5' },
    { id: 'd6', x: 31, y: 17, w: 3, h: 7, axis: 'y', d: 20, from: 'hall', to: 'z6' },
    { id: 'ds', x: 52, y: 13, w: 3, h: 9, axis: 'y', d: 21, from: 'z4', to: 'sec', secret: true }
  ];
  W.ROOMS = ROOMS; W.CORR = CORR;
  W.cx = function (tx) { return tx * T + T / 2; };
  W.room = function (id) { return W.rooms[id]; };
  /* مركز بلاطة نسبية داخل غرفة */
  W.at = function (rid, fx, fy) { var r = W.rooms[rid]; return [(r.x + fx * r.w) * T, (r.y + fy * r.h) * T]; };
  W.roomAt = function (x, z) {
    var tx = Math.floor(x / T), ty = Math.floor(z / T);
    for (var i = 0; i < ROOMS.length; i++) { var r = ROOMS[i]; if (tx >= r.x && tx < r.x + r.w && ty >= r.y && ty < r.y + r.h) return r; }
    for (i = 0; i < CORR.length; i++) { var c = CORR[i]; if (tx >= c.x && tx < c.x + c.w && ty >= c.y && ty < c.y + c.h) return { id: c.id, corr: true, zone: -1, name: 'ممر', theme: '#64748b' }; }
    return null;
  };
  W.solid = function (tx, ty) { if (tx < 0 || ty < 0 || tx >= MW || ty >= MH) return true; return W.grid[ty * MW + tx] === 0; };

  /* ---------- قطع الأثاث ---------- */
  function bench(g, x, z, len, rot, col) {
    // طاولة مختبر: سطح داكن + خزائن سفلية + رف علوي
    var c = Math.cos(rot || 0), s = Math.sin(rot || 0), L = len || 4;
    g.box(x, .45, z, rot ? .9 : L, .9, rot ? L : .9, col || '#cbd5e1', 0, '#e2e8f0');
    g.box(x, .93, z, rot ? 1.05 : L + .1, .08, rot ? L + .1 : 1.05, '#1f2937');
    g.box(x - (rot ? 0 : 0), 1.6, z + (rot ? 0 : -.38), rot ? .12 : L, .06, rot ? L : .25, '#94a3b8');
    return [x - (rot ? .55 : L / 2 + .05), z - (rot ? L / 2 + .05 : .55), x + (rot ? .55 : L / 2 + .05), z + (rot ? L / 2 + .05 : .55), 1];
  }
  function glassware(g, x, z, n, cols, rng) {
    for (var i = 0; i < n; i++) {
      var px = x + (i - (n - 1) / 2) * .38, k = Math.floor(rng() * 4), col = cols[i % cols.length];
      if (k === 0) { g.cyl(px, .97, z, .1, .32, '#dbeafe', 10, .1, true); g.cyl(px, .98, z, .085, .18, col, 10); }       // كأس
      else if (k === 1) { g.cyl(px, .97, z, .15, .22, '#dbeafe', 10, .05, false); g.cyl(px, 1.19, z, .05, .16, '#dbeafe', 8); g.cyl(px, .98, z, .12, .12, col, 10, .07); } // دورق مخروطي
      else if (k === 2) { for (var j = 0; j < 3; j++) { g.cyl(px - .1 + j * .1, .97, z, .03, .28, col, 6); } g.box(px, 1.06, z, .38, .05, .1, '#475569'); } // حامل أنابيب
      else { g.sphere(px, 1.12, z, .13, '#dbeafe', 10); g.cyl(px, 1.22, z, .04, .2, '#dbeafe', 6); g.sphere(px, 1.1, z, .1, col, 8); } // دورق كروي
    }
  }
  function burette(g, x, z) { g.box(x, .98, z, .35, .04, .25, '#334155'); g.cyl(x - .1, .98, z, .02, 1.1, '#94a3b8', 6); g.cyl(x + .05, 1.2, z, .025, .75, '#e0f2fe', 6); g.box(x, 1.55, z, .22, .03, .03, '#64748b'); g.cyl(x + .05, 1.12, z, .05, .09, '#e0f2fe', 8, .02); }
  function cabinet(g, x, z, rot, col, rng) {
    var w = 1.8, d = .55, h = 2.2, rx = rot ? d : w, rz = rot ? w : d; g.box(x, h / 2, z, rx, h, rz, col || '#e5e7eb');
    for (var k = 0; k < 3; k++) { var y = .5 + k * .62; g.box(x, y, z, rx + .02, .04, rz + .02, '#9ca3af');
      for (var i = 0; i < 4; i++) { var o = (i - 1.5) * .38; var cc = ['#ef4444', '#22c55e', '#3b82f6', '#eab308', '#a855f7', '#f97316'][Math.floor(rng() * 6)]; g.cyl(x + (rot ? 0 : o), y + .02, z + (rot ? o : 0), .07, .3, cc, 8); g.cyl(x + (rot ? 0 : o), y + .32, z + (rot ? o : 0), .04, .06, '#e5e7eb', 6); } }
    return [x - rx / 2, z - rz / 2, x + rx / 2, z + rz / 2, 2.2];
  }
  function hood(g, x, z, rot, col) { // خزانة غازات
    var rx = rot ? 1.1 : 2.6, rz = rot ? 2.6 : 1.1; g.box(x, .45, z, rx, .9, rz, '#cbd5e1'); g.box(x, 2.2, z, rx, .8, rz, col || '#94a3b8');
    g.box(x + (rot ? -.5 : 0), 1.4, z + (rot ? 0 : -.5), rot ? .1 : rx, 1.1, rot ? rz : .1, '#64748b'); g.cyl(x, 2.6, z, .2, 1.2, '#64748b', 8);
    return [x - rx / 2, z - rz / 2, x + rx / 2, z + rz / 2, 2.6];
  }
  function analyzer(g, x, z, col) { g.box(x, .55, z, 1.4, 1.1, 1, '#475569'); g.box(x, 1.25, z, 1.2, .3, .9, '#334155'); g.box(x, 1.14, z + .51, .9, .25, .02, col); g.cyl(x + .45, 1.1, z + .2, .08, .35, '#cbd5e1', 8); return [x - .7, z - .5, x + .7, z + .5, 1.4]; }
  function tank(g, x, z, r, h, liquid) { g.cyl(x, 0, z, r + .08, .25, '#475569', 16); g.cyl(x, .25, z, r, h, '#bae6fd', 16, r, false); g.cyl(x, .26, z, r * .92, h * .7, liquid, 16); g.cyl(x, .25 + h, z, r + .06, .15, '#475569', 16); return [x - r - .1, z - r - .1, x + r + .1, z + r + .1, h + .4]; }
  function console_(g, x, z, rot, col) { g.box(x, .5, z, 1.3, 1, .8, '#1f2937', rot); g.box(x, 1.05, z, 1.3, .12, .9, '#111827', rot, col); return [x - .75, z - .6, x + .75, z + .6, 1.1]; }
  function pipesWall(g, x0, z0, x1, z1, y, col) { var len = Math.hypot(x1 - x0, z1 - z0), a = Math.atan2(z1 - z0, x1 - x0); var m = JG.M4.trs((x0 + x1) / 2, y, (z0 + z1) / 2, 0, -a, Math.PI / 2, 1, 1, 1); g.cyl(0, -len / 2, 0, .09, len, col, 8, .09, false, m); }
  W.parts = { bench: bench, glassware: glassware, burette: burette, cabinet: cabinet, hood: hood, analyzer: analyzer, tank: tank, console: console_ };

  /* ---------- بناء العالم ---------- */
  W.build = function (R) {
    var g = new GB(), gl = new GB(), gf = new GB(), i, x, y, seed = 7, rng = function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    var grid = W.grid = new Uint8Array(MW * MH);
    ROOMS.forEach(function (r) { W.rooms[r.id] = r; for (y = r.y; y < r.y + r.h; y++) for (x = r.x; x < r.x + r.w; x++) grid[y * MW + x] = 1; });
    CORR.forEach(function (c) { for (y = c.y; y < c.y + c.h; y++) for (x = c.x; x < c.x + c.w; x++) grid[y * MW + x] = c.secret ? 2 : 1; });
    // الأرضيات
    var flc = function (tx, ty) {
      var r = W.roomAt(tx * T + 1, ty * T + 1); if (!r || r.corr) return (tx + ty) % 2 ? C('#1a202c') : C('#202736');
      return C(r.fl[(tx + ty) % 2]);
    };
    for (y = 0; y < MH; y++) for (x = 0; x < MW; x++) if (grid[y * MW + x]) {
      var c = flc(x, y), X = x * T, Z = y * T;
      gf.quad([X, 0, Z + T], [X + T, 0, Z + T], [X + T, 0, Z], [X, 0, Z], c);
      // خطوط فواصل البلاط
      gf.quad([X, .005, Z + .04], [X + T, .005, Z + .04], [X + T, .005, Z], [X, .005, Z], [c[0] * .7, c[1] * .7, c[2] * .7]);
    }
    // الجدران: جزء سفلي معتم + زجاج علوي
    var wallH = 1.25, glassH = 1.75;
    for (y = 0; y < MH; y++) for (x = 0; x < MW; x++) {
      if (grid[y * MW + x]) continue; var adj = false, near = null;
      for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) { var nx = x + dx, ny = y + dy; if (nx >= 0 && ny >= 0 && nx < MW && ny < MH && grid[ny * MW + nx]) { adj = true; near = near || W.roomAt(nx * T + 1, ny * T + 1); } }
      if (!adj) continue;
      var th = near && !near.corr ? C(near.theme) : C('#64748b'), base = [.2 + th[0] * .12, .22 + th[1] * .12, .27 + th[2] * .12];
      g.box(x * T + 1, wallH / 2, y * T + 1, T, wallH, T, base, 0, [.35 + th[0] * .3, .37 + th[1] * .3, .42 + th[2] * .3]);
      g.box(x * T + 1, wallH + .04, y * T + 1, T + .02, .08, T + .02, th);       // شريط مضيء
      gl.box(x * T + 1, wallH + glassH / 2 + .08, y * T + 1, T, glassH, T, [.55 + th[0] * .3, .7 + th[1] * .2, .85 + th[2] * .1]);
    }
    // الأبواب: إطار ثابت + لوح متحرك
    CORR.forEach(function (c) {
      var horiz = c.axis === 'x'; // الباب عمودي على x (ممر أفقي)
      var cx = horiz ? c.d * T + 1 : (c.x + c.w / 2) * T, cz = horiz ? (c.y + c.h / 2) * T : c.d * T + 1, span = (horiz ? c.h : c.w) * T;
      var door = { id: c.id, c: c, x: cx, z: cz, horiz: horiz, span: span, open: 0, target: 0, locked: true, secret: !!c.secret, req: null, label: null };
      if (!c.secret) {
        var px = horiz ? 0 : span / 2 + .2, pz = horiz ? span / 2 + .2 : 0;
        g.box(cx - px, 1.55, cz - pz, horiz ? .5 : .4, 3.1, horiz ? .4 : .5, '#475569'); g.box(cx + px, 1.55, cz + pz, horiz ? .5 : .4, 3.1, horiz ? .4 : .5, '#475569');
        g.box(cx, 3.05, cz, horiz ? .5 : span + .8, .35, horiz ? span + .8 : .5, '#334155');
      }
      W.doors.push(door);
    });
    // الأثاث والإضاءة لكل منطقة
    ROOMS.forEach(function (r) {
      var X0 = r.x * T, Z0 = r.y * T, RW = r.w * T, RH = r.h * T, th = r.theme, cl = W.colliders;
      var L = function (fx, fz, col, it, rad) { W.lights.push({ p: [X0 + fx * RW, 3.1, Z0 + fz * RH], c: C(col || th), i: it || 1.25, r: rad || 13, room: r.id, base: it || 1.25 }); };
      // مصابيح السقف المعلقة
      [[.25, .3], [.75, .3], [.25, .72], [.75, .72]].forEach(function (p) { g.box(X0 + p[0] * RW, 3.25, Z0 + p[1] * RH, 2.4, .08, .5, '#e2e8f0'); g.box(X0 + p[0] * RW, 3.2, Z0 + p[1] * RH, 2.2, .03, .38, th); });
      L(.3, .35); L(.7, .65); if (r.w * r.h > 150) { L(.7, .3, '#f8fafc', .8); L(.3, .7, '#f8fafc', .8); }
      var put = function (b) { if (b) cl.push({ x0: b[0], z0: b[1], x1: b[2], z1: b[3], h: b[4], top: b[4] <= 1.5 }); };
      var gw = ['#22c55e', '#a855f7', '#f43f5e', '#38bdf8', '#facc15', '#fb923c'];
      if (r.id === 'hub') {
        put(bench(g, X0 + 6, Z0 + 5, 5)); glassware(g, X0 + 6, Z0 + 5, 6, gw, rng);
        put(bench(g, X0 + RW - 6, Z0 + 5, 5)); glassware(g, X0 + RW - 6, Z0 + 5, 6, gw, rng); burette(g, X0 + RW - 4.2, Z0 + 5.1);
        put(cabinet(g, X0 + 2.4, Z0 + RH - 6, 1, '#e5e7eb', rng)); put(cabinet(g, X0 + RW - 2.4, Z0 + RH - 6, 1, '#e5e7eb', rng));
        put(analyzer(g, X0 + RW / 2 + 5, Z0 + RH - 3, '#38bdf8')); put(console_(g, X0 + RW / 2 - 5, Z0 + RH - 3, 0, '#38bdf8'));
        // نافورة جزيئية مركزية
        g.cyl(X0 + RW / 2, 0, Z0 + RH / 2, 2.2, .35, '#334155', 24); g.cyl(X0 + RW / 2, .35, Z0 + RH / 2, 1.9, .1, '#0ea5e9', 24); g.cyl(X0 + RW / 2, .35, Z0 + RH / 2, .25, 1.4, '#94a3b8', 10);
        put([X0 + RW / 2 - 2.2, Z0 + RH / 2 - 2.2, X0 + RW / 2 + 2.2, Z0 + RH / 2 + 2.2, .35]);
      } else if (r.id === 'hall') {
        for (i = 0; i < 4; i++) { var bx = X0 + 6 + i * 11; put(console_(g, bx, Z0 + 2.2, 0, ['#a855f7', '#f97316', '#06b6d4', '#eab308'][i])); }
        put(tank(g, X0 + 4, Z0 + RH - 3, .8, 2.2, '#22d3ee')); put(tank(g, X0 + RW - 4, Z0 + RH - 3, .8, 2.2, '#f472b6'));
        pipesWall(g, X0 + 2, Z0 + .6, X0 + RW - 2, Z0 + .6, 2.6, '#64748b');
      } else if (r.id === 'z1') {
        put(cabinet(g, X0 + 2.4, Z0 + 4, 1, '#ede9fe', rng)); put(cabinet(g, X0 + 2.4, Z0 + RH - 4, 1, '#ede9fe', rng));
        put(bench(g, X0 + 8, Z0 + 2.2, 6)); glassware(g, X0 + 8, Z0 + 2.2, 8, ['#a855f7', '#22c55e', '#ec4899'], rng);
        put(hood(g, X0 + 8, Z0 + RH - 2, 0, '#a78bfa'));
        put(tank(g, X0 + RW - 3, Z0 + 3, .9, 2.4, '#ef4444')); put(tank(g, X0 + RW - 3, Z0 + RH - 3, .9, 2.4, '#3b82f6'));
      } else if (r.id === 'z2') {
        put(bench(g, X0 + 6, Z0 + 2.2, 6)); glassware(g, X0 + 6, Z0 + 2.2, 8, ['#fb923c', '#facc15', '#ef4444'], rng);
        put(bench(g, X0 + RW - 6, Z0 + RH - 2.2, 6)); glassware(g, X0 + RW - 6, Z0 + RH - 2.2, 8, ['#fb923c', '#38bdf8'], rng);
        put(analyzer(g, X0 + RW - 3, Z0 + 3, '#f97316')); put(hood(g, X0 + 3, Z0 + RH - 2, 0, '#fdba74'));
      } else if (r.id === 'z3') {
        put(bench(g, X0 + RW / 2, Z0 + 2.2, 6)); glassware(g, X0 + RW / 2, Z0 + 2.2, 8, ['#06b6d4', '#a3e635', '#f472b6'], rng);
        put(cabinet(g, X0 + 2.4, Z0 + RH - 5, 1, '#cffafe', rng)); put(analyzer(g, X0 + RW - 3, Z0 + RH - 3, '#06b6d4'));
      } else if (r.id === 'z4') {
        put(bench(g, X0 + 6, Z0 + RH - 2.2, 6)); glassware(g, X0 + 6, Z0 + RH - 2.2, 8, ['#eab308', '#84cc16', '#f97316'], rng);
        put(hood(g, X0 + RW - 2, Z0 + RH / 2 + 4, 1, '#fde047')); put(cabinet(g, X0 + 2.4, Z0 + 5, 1, '#fef9c3', rng));
        // نماذج جزيئات زخرفية
        g.sphere(X0 + 3, 1.6, Z0 + RH - 6, .35, '#111827', 12); g.sphere(X0 + 3.6, 1.9, Z0 + RH - 6, .2, '#f1f5f9', 10); g.sphere(X0 + 2.4, 1.9, Z0 + RH - 6, .2, '#f1f5f9', 10); g.sphere(X0 + 3, 2.1, Z0 + RH - 6.5, .3, '#ef4444', 10);
        g.cyl(X0 + 3, 0, Z0 + RH - 6, .08, 1.3, '#94a3b8', 8);
      } else if (r.id === 'z5') {
        put(bench(g, X0 + 6, Z0 + 2.2, 6)); put(bench(g, X0 + RW - 6, Z0 + 2.2, 6));
        for (i = 0; i < 3; i++) { var ex = X0 + 4 + i * 1.6; g.box(ex, 1.12, Z0 + 2.2, .9, .3, .5, '#93c5fd'); g.box(ex - .2, 1.35, Z0 + 2.2, .06, .5, .3, '#9ca3af'); g.box(ex + .2, 1.35, Z0 + 2.2, .06, .5, .3, '#b45309'); }
        put(analyzer(g, X0 + RW - 3, Z0 + RH - 3, '#3b82f6')); put(cabinet(g, X0 + 2.4, Z0 + RH - 4, 1, '#dbeafe', rng));
        pipesWall(g, X0 + 1, Z0 + .6, X0 + RW - 1, Z0 + .6, 2.4, '#f59e0b');
      } else if (r.id === 'z6') {
        // مفاعل مركزي ضخم (يمر حوله اللاعب)
        var mx = X0 + RW / 2, mz = Z0 + RH / 2 - 2; g.cyl(mx, 0, mz, 3, .5, '#1f2937', 28); g.cyl(mx, .5, mz, 2.2, .2, '#ef4444', 28);
        g.ring(mx, 3.6, mz, 2.6, .18, '#94a3b8', 24); g.ring(mx, .9, mz, 2.6, .18, '#94a3b8', 24);
        for (i = 0; i < 6; i++) { var a = i / 6 * 6.283; g.cyl(mx + Math.cos(a) * 2.6, .5, mz + Math.sin(a) * 2.6, .14, 3.2, '#64748b', 8); }
        put([mx - 3, mz - 3, mx + 3, mz + 3, 4]);
        put(cabinet(g, X0 + 2.4, Z0 + 4, 1, '#fee2e2', rng)); put(cabinet(g, X0 + RW - 2.4, Z0 + 4, 1, '#fee2e2', rng));
      } else if (r.id === 'sec') {
        put(bench(g, X0 + RW / 2, Z0 + 2.2, 6)); glassware(g, X0 + RW / 2, Z0 + 2.2, 8, ['#ec4899', '#fde047', '#22d3ee'], rng);
        put(cabinet(g, X0 + 2.4, Z0 + RH - 4, 1, '#fce7f3', rng)); put(cabinet(g, X0 + RW - 2.4, Z0 + RH - 4, 1, '#fce7f3', rng));
      }
    });
    W.mesh = R.mesh(g); W.glass = R.mesh(gl); W.floor = R.mesh(gf);
    W.tris = (g.count() + gl.count() + gf.count()) / 3;
    // لوح الأبواب (Mesh مشترك)
    var dg = new GB(); dg.box(0, 0, 0, 1, 1, 1, '#475569'); W.doorMesh = R.mesh(dg);
    var dl = new GB(); dl.box(0, 0, 0, 1, 1, 1, '#f8fafc'); W.unitBox = R.mesh(dl);
    return W;
  };

  /* ---------- التصادم: دائرة لاعب مع الشبكة + صناديق ---------- */
  W.blocked = function (x, z, r, yFeet) {
    var t0x = Math.floor((x - r) / T), t1x = Math.floor((x + r) / T), t0y = Math.floor((z - r) / T), t1y = Math.floor((z + r) / T);
    for (var ty = t0y; ty <= t1y; ty++) for (var tx = t0x; tx <= t1x; tx++) {
      if (tx < 0 || ty < 0 || tx >= MW || ty >= MH) return true; var v = W.grid[ty * MW + tx];
      if (v === 0 || (v === 2 && !W.secretOpen)) { var cx = Math.max(tx * T, Math.min(x, tx * T + T)), cz = Math.max(ty * T, Math.min(z, ty * T + T)); if ((x - cx) * (x - cx) + (z - cz) * (z - cz) < r * r) return true; }
    }
    var L = W.colliders; for (var i = 0; i < L.length; i++) { var b = L[i]; if (b.off) continue; if ((yFeet || 0) >= b.h - .05) continue;
      var bx = Math.max(b.x0, Math.min(x, b.x1)), bz = Math.max(b.z0, Math.min(z, b.z1)); if ((x - bx) * (x - bx) + (z - bz) * (z - bz) < r * r) return true; }
    for (i = 0; i < W.doors.length; i++) { var d = W.doors[i]; if (d.open > .85 || d.secret) continue; var hw = d.horiz ? .35 : d.span / 2, hd = d.horiz ? d.span / 2 : .35;
      var dx = Math.max(d.x - hw, Math.min(x, d.x + hw)), dz = Math.max(d.z - hd, Math.min(z, d.z + hd)); if ((x - dx) * (x - dx) + (z - dz) * (z - dz) < r * r) return d; }
    return false;
  };
  /* ارتفاع الأرض تحت نقطة (للوقوف على الطاولات والصناديق) */
  W.groundAt = function (x, z, r, yFeet) {
    var g = 0, L = W.colliders; for (var i = 0; i < L.length; i++) { var b = L[i]; if (b.off || !b.top) continue;
      if (x > b.x0 - r * .5 && x < b.x1 + r * .5 && z > b.z0 - r * .5 && z < b.z1 + r * .5 && yFeet >= b.h - .3) g = Math.max(g, b.h); }
    return g;
  };
  /* خط الرؤية على الشبكة (للأعداء) */
  W.los = function (x0, z0, x1, z1) {
    var d = Math.hypot(x1 - x0, z1 - z0), n = Math.ceil(d / .7);
    for (var i = 1; i < n; i++) { var x = x0 + (x1 - x0) * i / n, z = z0 + (z1 - z0) * i / n; if (W.solid(Math.floor(x / T), Math.floor(z / T))) return false; }
    return true;
  };
})();
