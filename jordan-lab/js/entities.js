/* ============================================================
   JG Entities — الجسيمات، المقذوفات، المقتنيات، الأعداء والزعماء
   ============================================================ */
(function () {
  'use strict';
  var JG = window.JG = window.JG || {}, GB = JG.GB, M4 = JG.M4, C = JG.C;
  var E = JG.Ent = { parts: [], shots: [], picks: [], foes: [], hazards: [], meshes: {}, tex: {} };

  E.init = function (R) {
    var mk = function (f) { var g = new GB(); f(g); return R.mesh(g); }, m = E.meshes;
    m.ball = mk(function (g) { g.sphere(0, 0, 0, 1, '#ffffff', 14); });
    m.ballLo = mk(function (g) { g.sphere(0, 0, 0, 1, '#ffffff', 8); });
    m.ion = mk(function (g) { g.sphere(0, 0, 0, .55, '#ffffff', 14); g.sphere(.45, .3, .2, .22, '#f1f5f9', 8); g.sphere(-.4, .32, .25, .22, '#f1f5f9', 8); g.sphere(0, .1, -.5, .2, '#f1f5f9', 8); });
    m.turret = mk(function (g) { g.cyl(0, 0, 0, .55, .5, '#334155', 12); g.cyl(0, .5, 0, .38, .55, '#ffffff', 12); g.sphere(0, 1.1, 0, .36, '#ffffff', 12); g.box(0, 1.1, .45, .16, .16, .6, '#1f2937'); });
    m.shifter = mk(function (g) { g.box(0, .55, 0, 1, 1.1, 1, '#ffffff'); g.box(0, 1.15, 0, .7, .2, .7, '#cbd5e1'); g.box(-.22, .75, .51, .2, .2, .02, '#111827'); g.box(.22, .75, .51, .2, .2, .02, '#111827'); });
    m.radical = mk(function (g) { g.sphere(0, 0, 0, .35, '#ffffff', 10); for (var i = 0; i < 6; i++) { var a = i / 6 * 6.283; g.cyl(Math.cos(a) * .3, -.05, Math.sin(a) * .3, .06, .1, '#ffffff', 5, 0); } });
    m.coin = mk(function (g) { g.sphere(0, 0, 0, .2, '#fde047', 10); g.ring(0, 0, 0, .34, .035, '#fbbf24', 18); });
    m.flask = mk(function (g) { g.cyl(0, 0, 0, .22, .28, '#dcfce7', 10, .08); g.cyl(0, .28, 0, .07, .18, '#dcfce7', 8); g.cyl(0, .02, 0, .19, .18, '#22c55e', 10, .1); });
    m.card = mk(function (g) { g.box(0, 0, 0, .5, .66, .05, '#e0e7ff'); g.box(0, .12, .03, .34, .24, .01, '#6366f1'); g.box(0, -.16, .03, .34, .04, .01, '#94a3b8'); g.box(0, -.24, .03, .26, .04, .01, '#94a3b8'); });
    m.crystal = mk(function (g) { var P = [[0, .7, 0], [0, -.7, 0]], k; for (k = 0; k < 6; k++) { var a = k / 6 * 6.283, b = (k + 1) / 6 * 6.283, A = [Math.cos(a) * .4, 0, Math.sin(a) * .4], B = [Math.cos(b) * .4, 0, Math.sin(b) * .4]; g.tri(P[0], B, A, [1, 1, 1]); g.tri(P[1], A, B, [.8, .8, .9]); } });
    m.bottle = mk(function (g) { g.cyl(0, 0, 0, .14, .32, '#ffffff', 10); g.cyl(0, .32, 0, .05, .14, '#e2e8f0', 8); g.cyl(0, .46, 0, .07, .06, '#334155', 8); });
    m.barrel = mk(function (g) { g.cyl(0, 0, 0, .34, .9, '#ffffff', 14); g.ring(0, .15, 0, .345, .03, '#1f2937', 14); g.ring(0, .75, 0, .345, .03, '#1f2937', 14); g.cyl(0, .9, 0, .1, .06, '#1f2937', 8); });
    m.lever = mk(function (g) { g.box(0, .5, 0, .5, 1, .3, '#334155'); g.box(0, 1.02, 0, .55, .06, .35, '#111827'); });
    m.handle = mk(function (g) { g.cyl(0, 0, 0, .04, .6, '#cbd5e1', 6); g.sphere(0, .62, 0, .09, '#ef4444', 8); });
    m.station = mk(function (g) { g.box(0, .55, 0, 1.2, 1.1, .8, '#1f2937'); g.box(0, 1.15, -.05, 1.25, .1, .9, '#0f172a'); g.box(0, 1.8, -.32, 1.4, .95, .08, '#111827'); g.cyl(0, 1.12, -.32, .05, .3, '#475569', 6); });
    m.pistonHead = mk(function (g) { g.box(0, 0, 0, 1, 1, 1, '#ffffff'); });
    m.ring = R.texture(JG.radialCanvas('rgba(255,255,255,0)', 'rgba(255,255,255,0)', 8));
    E.tex.shadow = R.texture(JG.radialCanvas('rgba(0,0,0,.55)', 'rgba(0,0,0,0)', 64));
    E.tex.glow = R.texture(JG.radialCanvas('rgba(255,255,255,1)', 'rgba(255,255,255,0)', 64));
    var rc = JG.makeCanvas(128, 128), x = rc.getContext('2d'); x.strokeStyle = '#fff'; x.lineWidth = 9; x.beginPath(); x.arc(64, 64, 58, 0, 6.283); x.stroke(); x.globalAlpha = .28; x.fillStyle = '#fff'; x.fill();
    E.tex.ringT = R.texture(rc);
    var wc = JG.makeCanvas(128, 128); x = wc.getContext('2d'); x.strokeStyle = '#fff'; x.lineWidth = 7; x.beginPath(); x.arc(64, 64, 60, 0, 6.283); x.stroke(); E.tex.wave = R.texture(wc);
  };
  /* ---------- الجسيمات ---------- */
  E.burst = function (x, y, z, col, n, sp, life, size, up) {
    col = C(col); for (var i = 0; i < n; i++) { if (E.parts.length > 1100) break; var a = Math.random() * 6.283, b = Math.random() * 2 - 1, s = sp * (.4 + Math.random() * .8);
      E.parts.push({ x: x, y: y, z: z, vx: Math.cos(a) * s * Math.sqrt(1 - b * b), vy: b * s + (up || 0), vz: Math.sin(a) * s * Math.sqrt(1 - b * b), l: life * (.6 + Math.random() * .6), L: life, c: col, a: 1, s: size || .25, g: up ? -2 : -6 }); }
  };
  E.emit = function (x, y, z, col, vy, life, size, spread) { if (E.parts.length > 1100) return; col = C(col); spread = spread || .3; E.parts.push({ x: x + (Math.random() - .5) * spread, y: y, z: z + (Math.random() - .5) * spread, vx: (Math.random() - .5) * .3, vy: vy, vz: (Math.random() - .5) * .3, l: life, L: life, c: col, a: 1, s: size, g: 0 }); };
  E.updParts = function (dt) {
    var P = E.parts; for (var i = P.length - 1; i >= 0; i--) { var p = P[i]; p.l -= dt; if (p.l <= 0) { P[i] = P[P.length - 1]; P.pop(); continue; }
      p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt; if (p.y < .02) { p.y = .02; p.vy *= -.3; } p.a = Math.min(1, p.l / p.L * 1.6); }
  };
  /* ---------- الأعداء ---------- */
  var TYPES = {
    h3o: { mesh: 'ion', col: '#ef4444', hp: 30, sp: 2.6, r: .6, dmg: 12, chem: 'acid', label: 'H₃O⁺', y: .9, ai: 'chaser' },
    oh: { mesh: 'ion', col: '#3b82f6', hp: 30, sp: 2.8, r: .6, dmg: 12, chem: 'base', label: 'OH⁻', y: .9, ai: 'chaser' },
    radical: { mesh: 'radical', col: '#facc15', hp: 18, sp: 4.6, r: .45, dmg: 9, chem: 'neutral', label: 'جذر حر', y: .8, ai: 'zig' },
    shifter: { mesh: 'shifter', col: '#06b6d4', hp: 55, sp: 2.1, r: .75, dmg: 10, chem: 'neutral', label: 'مُزيح', y: 0, ai: 'pusher' },
    turret: { mesh: 'turret', col: '#b45309', hp: 45, sp: 0, r: .6, dmg: 10, chem: 'neutral', label: 'Br₂', y: 0, ai: 'turret' },
    spark: { mesh: 'radical', col: '#60a5fa', hp: 22, sp: 5.2, r: .45, dmg: 10, chem: 'neutral', label: 'e⁻', y: .7, ai: 'bounce' }
  };
  E.TYPES = TYPES;
  E.spawn = function (type, x, z, room, R) {
    var T = TYPES[type], f = { type: type, T: T, x: x, z: z, y: T.y, hp: T.hp, max: T.hp, home: [x, z], room: room, st: 'patrol', t: Math.random() * 3, wp: null, vx: 0, vz: 0, h: 0, flash: 0, ang: Math.random() * 6.28, cd: 1 + Math.random() * 2, dead: false };
    if (T.ai === 'bounce') { var a = Math.random() * 6.28; f.vx = Math.cos(a) * T.sp; f.vz = Math.sin(a) * T.sp; }
    f.lab = R.texture(JG.labelCanvas(T.label, { fs: 40, bg: 'rgba(15,23,42,.75)', col: T.col === '#3b82f6' ? '#93c5fd' : '#fecaca', bd: T.col })); f.labW = 1.1;
    E.foes.push(f); return f;
  };
  E.updFoes = function (dt, G) {
    var P = G.player, W = JG.World, A = JG.Audio, diffK = G.diffK;
    E.foes.forEach(function (f) {
      if (f.dead) return; var T = f.T; f.t += dt; f.flash = Math.max(0, f.flash - dt); f.ang += dt * 2;
      if (f.stun > 0) { f.stun -= dt; return; }
      var dx = P.pos[0] - f.x, dz = P.pos[2] - f.z, d = Math.hypot(dx, dz), sees = d < 10 && G.roomOf(P) === f.room && W.los(f.x, f.z, P.pos[0], P.pos[2]);
      var mvx = 0, mvz = 0, sp = T.sp * (.85 + diffK * .25);
      if (T.ai === 'turret') { f.h = Math.atan2(dx, dz); f.cd -= dt; if (sees && d < 13 && f.cd <= 0) { f.cd = 2.2 / (.8 + diffK * .3); E.fire(f.x, 1.1, f.z, dx / d, dz / d, 9, T.dmg, 'foe', '#f59e0b'); A.play('shootB', .6); } return; }
      if (T.ai === 'bounce') { var nx = f.x + f.vx * dt, nz = f.z + f.vz * dt; if (W.blocked(nx, f.z, T.r)) f.vx = -f.vx; else f.x = nx; if (W.blocked(f.x, nz, T.r)) f.vz = -f.vz; else f.z = nz;
        if (Math.random() < dt * .4) { var a2 = Math.atan2(f.vz, f.vx) + (Math.random() - .5); f.vx = Math.cos(a2) * T.sp; f.vz = Math.sin(a2) * T.sp; }
        E.emit(f.x, f.y, f.z, '#93c5fd', .2, .3, .25, .1); if (d < T.r + P.r + .1 && P.pos[1] < 1.2) { if (P.hurt(T.dmg * diffK, f.x, f.z, A)) G.onHurt(); } return; }
      if (f.st === 'patrol') {
        if (!f.wp || Math.hypot(f.wp[0] - f.x, f.wp[1] - f.z) < .5 || f.t > 5) { f.t = 0; for (var k = 0; k < 6; k++) { var w = [f.home[0] + (Math.random() - .5) * 8, f.home[1] + (Math.random() - .5) * 8]; if (!W.blocked(w[0], w[1], T.r) && W.los(f.x, f.z, w[0], w[1])) { f.wp = w; break; } } }
        if (f.wp) { var px = f.wp[0] - f.x, pz = f.wp[1] - f.z, pl = Math.hypot(px, pz) || 1; mvx = px / pl * sp * .45; mvz = pz / pl * sp * .45; }
        if (sees) { f.st = 'chase'; f.t = 0; }
      } else if (f.st === 'chase') {
        var zz = T.ai === 'zig' ? Math.sin(f.t * 7) * .8 : 0; mvx = (dx / d + -dz / d * zz) * sp; mvz = (dz / d + dx / d * zz) * sp;
        if (!sees && f.t > 2.5) { f.st = 'patrol'; f.t = 0; }
        if (d < (T.ai === 'pusher' ? 2.2 : 1.9) && P.pos[1] < 1.5) { f.st = 'windup'; f.t = 0; A.play('warn', .4); }
      } else if (f.st === 'windup') { f.flash = .1; if (f.t > .45 / (.8 + diffK * .2)) { f.st = 'lunge'; f.t = 0; f.lx = dx / d; f.lz = dz / d; } }
      else if (f.st === 'lunge') { mvx = f.lx * sp * 3.4; mvz = f.lz * sp * 3.4;
        if (d < T.r + P.r + .25 && P.pos[1] < 1.3) { if (P.hurt(T.dmg * diffK, f.x, f.z, A)) { G.onHurt(); if (T.ai === 'pusher') P.knock = [dx / d * 16, dz / d * 16]; } f.st = 'recover'; f.t = 0; }
        if (f.t > .3) { f.st = 'recover'; f.t = 0; } }
      else if (f.st === 'recover') { mvx = -dx / d * sp * .3; mvz = -dz / d * sp * .3; if (f.t > .8) { f.st = 'chase'; f.t = 0; } }
      // فصل بين الأعداء
      E.foes.forEach(function (o) { if (o === f || o.dead) return; var ox = f.x - o.x, oz = f.z - o.z, ol = Math.hypot(ox, oz); if (ol < 1.2 && ol > 0) { mvx += ox / ol * 1.5; mvz += oz / ol * 1.5; } });
      f.vx += (mvx - f.vx) * Math.min(1, dt * 6); f.vz += (mvz - f.vz) * Math.min(1, dt * 6);
      var nx2 = f.x + f.vx * dt, nz2 = f.z + f.vz * dt; if (!W.blocked(nx2, f.z, T.r)) f.x = nx2; else f.vx = 0; if (!W.blocked(f.x, nz2, T.r)) f.z = nz2; else f.vz = 0;
      if (Math.abs(f.vx) + Math.abs(f.vz) > .2) f.h = Math.atan2(f.vx, f.vz);
      if (T.chem === 'acid' && Math.random() < dt * 3) E.emit(f.x, f.y + .3, f.z, '#fca5a5', .6, .6, .18);
      if (T.chem === 'base' && Math.random() < dt * 3) E.emit(f.x, f.y + .3, f.z, '#93c5fd', .6, .6, .18);
    });
  };
  E.drawFoes = function (R, t, reflect) {
    var m = E.meshes; E.foes.forEach(function (f) {
      if (f.dead) return; var T = f.T, y = f.y + (T.ai === 'chaser' || T.ai === 'zig' || T.ai === 'bounce' ? Math.sin(f.t * 3 + f.ang) * .15 : 0), sy = reflect ? -1 : 1;
      var c = C(T.col), tint = f.flash > 0 ? [2, 2, 2] : (f.st === 'windup' ? [c[0] * 1.6 + .3, c[1] * 1.6 + .3, c[2] * 1.6 + .3] : c);
      var sc = T.ai === 'chaser' ? 1 + Math.sin(f.t * 5) * .05 : 1;
      R.draw(m[T.mesh], M4.trs(f.x, y * sy, f.z, 0, f.h + (T.ai === 'chaser' ? f.t * 1.5 : 0), 0, sc, sc * sy, sc), { tint: tint, em: T.ai === 'bounce' || T.ai === 'zig' ? .6 : .15, emc: c, spec: .6 });
    });
  };
  E.drawFoeUI = function (R) {
    E.foes.forEach(function (f) { if (f.dead) return; var T = f.T, h = (T.mesh === 'turret' || T.mesh === 'shifter') ? 2 : f.y + 1;
      R.sprite(f.lab, f.x, h, f.z, f.labW, f.labW * .42);
      if (f.hp < f.max) { R.sprite(E.tex.glow, f.x, h - .32, f.z, 1, .07, [.15, .15, .2, .9]); R.sprite(E.tex.glow, f.x - (1 - f.hp / f.max) * .45, h - .32, f.z, f.hp / f.max * .95, .06, [1, .3, .3, 1]); } });
  };
  /* ---------- المقذوفات ---------- */
  E.fire = function (x, y, z, dx, dz, sp, dmg, from, col, chem, big) { E.shots.push({ x: x, y: y, z: z, vx: dx * sp, vz: dz * sp, l: 2.2, dmg: dmg, from: from, c: C(col), chem: chem, r: big ? .45 : .25 }); };
  E.updShots = function (dt, G) {
    var W = JG.World, P = G.player, A = JG.Audio;
    for (var i = E.shots.length - 1; i >= 0; i--) {
      var s = E.shots[i], hit = false; s.l -= dt; s.x += s.vx * dt; s.z += s.vz * dt;
      if (Math.random() < .7) E.parts.push({ x: s.x, y: s.y, z: s.z, vx: 0, vy: 0, vz: 0, l: .25, L: .25, c: s.c, a: 1, s: s.r * 1.4, g: 0 });
      if (s.l <= 0 || W.solid(Math.floor(s.x / 2), Math.floor(s.z / 2))) hit = true;
      if (!hit && s.from === 'foe') { if (Math.hypot(P.pos[0] - s.x, P.pos[2] - s.z) < P.r + s.r && Math.abs(P.pos[1] + 1 - s.y) < 1.1) { if (P.hurt(s.dmg * G.diffK, s.x - s.vx, s.z - s.vz, A)) G.onHurt(); hit = true; } }
      if (!hit && s.from === 'me') {
        for (var j = 0; j < E.foes.length; j++) { var f = E.foes[j]; if (f.dead) continue; var fy = f.T.mesh === 'turret' || f.T.mesh === 'shifter' ? .9 : f.y;
          if (Math.hypot(f.x - s.x, f.z - s.z) < f.T.r + s.r && Math.abs(fy - s.y) < 1.3) { G.hitFoe(f, s); hit = true; break; } }
        if (!hit && G.boss && G.boss.alive && G.boss.hitTest(s)) { G.hitBoss(s); hit = true; }
      }
      if (hit) { E.burst(s.x, s.y, s.z, s.c, 8, 3, .35, .2); E.shots[i] = E.shots[E.shots.length - 1]; E.shots.pop(); }
    }
  };
  E.drawShots = function (R) { E.shots.forEach(function (s) { R.draw(E.meshes.ballLo, M4.trs(s.x, s.y, s.z, 0, 0, 0, s.r), { tint: s.c, em: .9, emc: s.c }); }); };
  /* ---------- مخاطر بإنذار مسبق (دوائر/موجات) ---------- */
  E.hazard = function (h) { h.t = 0; E.hazards.push(h); return h; };
  E.updHaz = function (dt, G) {
    var P = G.player, A = JG.Audio;
    for (var i = E.hazards.length - 1; i >= 0; i--) {
      var h = E.hazards[i]; h.t += dt; var px = P.pos[0], pz = P.pos[2];
      if (h.kind === 'circle') { if (h.t >= h.warn && !h.fired) { h.fired = true; E.burst(h.x, .3, h.z, h.col, 26, 5, .6, .35, 2); A.play(h.snd || 'hit', .7); G.cam.shake = Math.max(G.cam.shake, .4);
          if (Math.hypot(px - h.x, pz - h.z) < h.r + P.r && P.pos[1] < .9) { if (P.hurt(h.dmg * G.diffK, h.x, h.z, A)) G.onHurt(); } }
        if (h.t > h.warn + .35) { E.hazards.splice(i, 1); } }
      else if (h.kind === 'wave') { h.r += h.sp * dt; if (Math.abs(Math.hypot(px - h.x, pz - h.z) - h.r) < .55 && P.pos[1] < .55 && !h.hitP) { h.hitP = true; if (P.hurt(h.dmg * G.diffK, h.x, h.z, A)) G.onHurt(); } if (h.r > h.max) E.hazards.splice(i, 1); }
      else if (h.kind === 'beam') { h.a += h.sp * dt; var bx = Math.cos(h.a), bz = Math.sin(h.a), rx = px - h.x, rz = pz - h.z, along = rx * bx + rz * bz, perp = Math.abs(rx * bz - rz * bx);
        if (along > 0 && along < h.len && perp < .45 && P.pos[1] < .55 && h.t > h.warn) { if (P.hurt(h.dmg * G.diffK, px - bz, pz + bx, A)) G.onHurt(); } if (h.t > h.dur) E.hazards.splice(i, 1); }
    }
  };
  E.drawHaz = function (R) {
    E.hazards.forEach(function (h) {
      if (h.kind === 'circle') { var u = Math.min(1, h.t / h.warn), c = C(h.col);
        R.plane(E.tex.ringT, M4.trs(h.x, .04, h.z, 0, 0, 0, h.r * 2, 1, h.r * 2), [c[0], c[1], c[2], .55 + .4 * Math.sin(h.t * 18)], true, true);
        R.plane(E.tex.glow, M4.trs(h.x, .05, h.z, 0, 0, 0, h.r * 2 * u, 1, h.r * 2 * u), [c[0], c[1], c[2], .5], true, true); }
      else if (h.kind === 'wave') { var c2 = C(h.col); R.plane(E.tex.wave, M4.trs(h.x, .15, h.z, 0, 0, 0, h.r * 2, 1, h.r * 2), [c2[0], c2[1], c2[2], .95], true, true); }
      else if (h.kind === 'beam') { var c3 = C(h.col), on = h.t > h.warn; var mx = h.x + Math.cos(h.a) * h.len / 2, mz = h.z + Math.sin(h.a) * h.len / 2;
        R.draw(E.meshes.pistonHead, M4.trs(mx, .3, mz, 0, -h.a, 0, h.len, on ? .14 : .04, on ? .18 : .05), { tint: c3, em: 1, emc: c3, a: on ? 1 : .5 }); }
    });
  };
  /* ---------- المقتنيات ---------- */
  E.pick = function (o) { o.t = Math.random() * 6; o.taken = false; E.picks.push(o); return o; };
  E.drawPicks = function (R, t) {
    var m = E.meshes; E.picks.forEach(function (p) {
      if (p.taken) return; var b = Math.sin(t * 2.5 + p.t) * .12, y = (p.y || .7) + b, mesh = m[p.mesh || 'coin'], col = C(p.col || '#fde047');
      R.draw(mesh, M4.trs(p.x, y, p.z, 0, t * 2 + p.t, 0, p.s || 1), { tint: col, em: p.em === undefined ? .35 : p.em, emc: [col[0] * .4, col[1] * .4, col[2] * .4], spec: .8 });
      if (p.lab) R.sprite(p.lab, p.x, y + .75, p.z, p.labW || 1.2, (p.labW || 1.2) * p.labA);
    });
  };
})();
