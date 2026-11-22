/* ============================================================
   JG Bosses — ستة زعماء بسلوكيات مختلفة ومراحل دروع
   الدرع لا يُكسر بالضغط المتكرر: يحتاج حلّ تحدٍّ كيميائي في محطات الإضعاف
   ============================================================ */
(function () {
  'use strict';
  var JG = window.JG = window.JG || {}, GB = JG.GB, M4 = JG.M4, C = JG.C, E = JG.Ent;
  var B = JG.Bosses = {};

  B.DEF = {
    1: { name: 'الحمض الأعظم', sub: 'زعيم مختبر الأحماض والقواعد', col: '#ef4444', hp: 520, r: 1.6, chem: 'acid', speed: 2.2, shields: [.66, .33],
      tip: 'الحمض الأعظم مكوّن من أيونات H₃O⁺ — استخدم وضع القاعدة (OH⁻) في جهاز المعادلة. اضغط Q للتبديل.' },
    2: { name: 'المثبّط', sub: 'زعيم مختبر سرعة التفاعلات', col: '#f97316', hp: 600, r: 1.5, speed: 1.8, shields: [.66, .33], tip: 'المثبّط يبطئ حركتك داخل هالته. اقفز فوق الشعاع الدوّار.' },
    3: { name: 'حارس لوشاتلييه', sub: 'زعيم مختبر الاتزان الكيميائي', col: '#06b6d4', hp: 660, r: 1.5, speed: 1.6, shields: [.66, .33], tip: 'اقفز فوق موجات الضغط، وأزِح الاتزان من محطات الإضعاف لتكشف نقطة ضعفه.' },
    4: { name: 'البوليمر العملاق', sub: 'زعيم مختبر الكيمياء العضوية', col: '#eab308', hp: 700, r: 1.1, speed: 3.2, shields: [.66, .33], tip: 'الرأس وحده نقطة الضعف. كل إجابة صحيحة في المحطات تكسر روابط من سلسلته.' },
    5: { name: 'عاصفة الإلكترونات', sub: 'زعيم مختبر الخلايا الكهروكيميائية', col: '#3b82f6', hp: 760, r: 1.4, speed: 2.4, shields: [.66, .33], tip: 'راقب الدوائر الزرقاء قبل سقوط الصواعق، وابنِ الخلية الصحيحة لعكس التيار.' },
    6: { name: 'الخيميائي المظلم', sub: 'الزعيم النهائي — المختبر المركزي', col: '#a855f7', hp: 1150, r: 1.5, speed: 2.6, shields: [.75, .5, .25], tip: 'يجمع هجمات كل الزعماء. حلّ تحديات المفاعل لكسر دروعه الثلاثة.' }
  };
  B.meshes = {};
  B.init = function (R) {
    var mk = function (f) { var g = new GB(); f(g); return R.mesh(g); }, m = B.meshes;
    m.blob = mk(function (g) { g.sphere(0, 1.4, 0, 1.4, '#ffffff', 18); g.sphere(.9, .7, .5, .7, '#ffffff', 12); g.sphere(-.8, .6, .6, .75, '#ffffff', 12); g.sphere(0, .55, -.9, .7, '#ffffff', 12);
      g.sphere(-.45, 1.75, 1.18, .25, '#111827', 10); g.sphere(.45, 1.75, 1.18, .25, '#111827', 10); g.sphere(-.4, 1.8, 1.36, .08, '#ffffff', 6); g.sphere(.5, 1.8, 1.36, .08, '#ffffff', 6); g.box(0, 1.15, 1.32, .8, .12, .1, '#111827'); });
    m.gear = mk(function (g) { g.cyl(0, 0, 0, 1.3, 2.2, '#ffffff', 16); g.cyl(0, 2.2, 0, .9, .6, '#cbd5e1', 14); for (var i = 0; i < 10; i++) { var a = i / 10 * 6.283; g.box(Math.cos(a) * 1.45, 1.1, Math.sin(a) * 1.45, .4, 1.6, .4, '#94a3b8', -a); }
      g.box(-.4, 2.4, .85, .3, .22, .1, '#111827'); g.box(.4, 2.4, .85, .3, .22, .1, '#111827'); });
    m.scale = mk(function (g) { g.cyl(0, 0, 0, 1, .4, '#ffffff', 16); g.cyl(0, .4, 0, .25, 2.8, '#cbd5e1', 10); g.box(0, 3.2, 0, 4.4, .25, .35, '#e2e8f0'); g.sphere(0, 3.5, 0, .45, '#ffffff', 12); });
    m.pan = mk(function (g) { g.cyl(0, -.9, 0, .05, .9, '#94a3b8', 6); g.sphere(0, -1.2, 0, .7, '#ffffff', 14); });
    m.seg = mk(function (g) { g.sphere(0, 0, 0, .75, '#ffffff', 12); g.ring(0, 0, 0, .78, .07, '#334155', 14); });
    m.head = mk(function (g) { g.sphere(0, 0, 0, 1.05, '#ffffff', 16); g.sphere(-.4, .35, .85, .22, '#111827', 8); g.sphere(.4, .35, .85, .22, '#111827', 8); g.cyl(-.5, .7, 0, .08, .6, '#ffffff', 6, .02); g.cyl(.5, .7, 0, .08, .6, '#ffffff', 6, .02); });
    m.core = mk(function (g) { g.sphere(0, 0, 0, 1.1, '#ffffff', 16); g.ring(0, 0, 0, 1.5, .08, '#93c5fd', 20); });
    m.rod = mk(function (g) { g.box(0, 0, 0, .3, 1.8, .3, '#ffffff'); g.sphere(0, 1, 0, .25, '#ffffff', 8); });
    m.mage = mk(function (g) { g.cyl(0, 0, 0, 1.2, 2.6, '#ffffff', 16, .35); g.sphere(0, 2.9, 0, .55, '#ffffff', 14); g.cyl(0, 2.7, 0, .62, 1.1, '#ffffff', 14, 0); g.sphere(-.2, 2.9, .45, .09, '#fde047', 6); g.sphere(.2, 2.9, .45, .09, '#fde047', 6);
      g.box(-1, 1.7, .2, .9, .25, .25, '#ffffff', .4); g.box(1, 1.7, .2, .9, .25, .25, '#ffffff', -.4); });
    m.shield = mk(function (g) { g.sphere(0, 0, 0, 1, '#ffffff', 16); });
  };
  function Boss(z, x, zz, room, G) {
    var D = B.DEF[z]; this.z = z; this.D = D; this.x = x; this.zz = zz; this.room = room; this.hp = D.hp * (G.diffHP || 1); this.max = this.hp; this.alive = true; this.t = 0; this.h = 0;
    this.shield = false; this.shIdx = 0; this.stun = 0; this.flash = 0; this.cd = 2.5; this.atk = null; this.atkT = 0; this.vx = 0; this.vz = 0; this.mode = 0; this.intro = true;
    if (z === 4) { this.segs = []; for (var i = 0; i < 10; i++) this.segs.push({ x: x, z: zz + i * 1.2 }); this.trail = []; }
    if (z === 3) this.tilt = 0;
  }
  Boss.prototype.hitTest = function (s) {
    var hx = this.x, hz = this.zz, r = this.D.r + .3;
    return Math.hypot(hx - s.x, hz - s.z) < r + s.r && s.y < 4.5;
  };
  Boss.prototype.update = function (dt, G) {
    if (!this.alive) return; var P = G.player, W = JG.World, A = JG.Audio, D = this.D, me = this, dk = G.diffK;
    this.t += dt; this.flash = Math.max(0, this.flash - dt);
    if (this.intro) return;
    if (this.stun > 0) { this.stun -= dt; if (Math.random() < dt * 20) E.emit(this.x + (Math.random() - .5) * 2, 2.6, this.zz + (Math.random() - .5) * 2, '#fde047', 1, .5, .3); return; }
    var dx = P.pos[0] - this.x, dz = P.pos[2] - this.zz, d = Math.hypot(dx, dz) || 1;
    // دخول مرحلة الدرع
    if (!this.shield && this.shIdx < D.shields.length && this.hp / this.max <= D.shields[this.shIdx]) { this.shield = true; this.shIdx++; G.onBossShield(this); A.play('roar'); G.cam.shake = .8; }
    // الحركة
    var sp = D.speed * (.85 + dk * .2) * (this.shield ? 1.2 : 1), want = this.z === 4 ? 0 : 5.5, mvx = 0, mvz = 0;
    if (this.atk !== 'charge') { if (d > want + 1) { mvx = dx / d * sp; mvz = dz / d * sp; } else if (d < want - 1) { mvx = -dx / d * sp * .7; mvz = -dz / d * sp * .7; } else { mvx = -dz / d * sp * .6; mvz = dx / d * sp * .6; } }
    if (this.z === 4) { mvx = dx / d * sp; mvz = dz / d * sp; }
    // الهجمات
    this.cd -= dt * (this.shield ? 1.35 : 1) * (.8 + dk * .25);
    if (this.cd <= 0 && !this.atk) { this.pickAttack(G); }
    if (this.atk) { this.atkT += dt; this.runAttack(dt, G, dx, dz, d); if (this.atk === 'charge' && this.atkT > .8) { mvx = this.cx * sp * 4.5; mvz = this.cz * sp * 4.5; } }
    this.vx += (mvx - this.vx) * Math.min(1, dt * 3); this.vz += (mvz - this.vz) * Math.min(1, dt * 3);
    var nx = this.x + this.vx * dt, nz = this.zz + this.vz * dt, rr = Math.min(1.3, D.r);
    if (!W.blocked(nx, this.zz, rr) && G.roomOfXZ(nx, this.zz) === this.room) this.x = nx; else this.vx = 0;
    if (!W.blocked(this.x, nz, rr) && G.roomOfXZ(this.x, nz) === this.room) this.zz = nz; else this.vz = 0;
    this.h = Math.atan2(dx, dz);
    // التلامس يؤذي
    if (d < D.r + P.r + .2 && P.pos[1] < 2.2) { if (P.hurt(14 * dk, this.x, this.zz, A)) G.onHurt(); }
    // البوليمر: الذيل يتبع مسار الرأس
    if (this.segs) { this.trail.unshift([this.x, this.zz]); if (this.trail.length > 200) this.trail.pop();
      this.segs.forEach(function (s, i) { var k = Math.min(me.trail.length - 1, (i + 1) * 9); var p = me.trail[k]; if (p) { s.x = p[0]; s.z = p[1]; }
        if (Math.hypot(P.pos[0] - s.x, P.pos[2] - s.z) < .75 + P.r && P.pos[1] < 1.3) { if (P.hurt(10 * dk, s.x, s.z, A)) G.onHurt(); } }); }
    // المثبّط: هالة الإبطاء
    if (this.z === 2) { P.slow = d < 6.5; if (Math.random() < dt * 25) { var a = Math.random() * 6.28; E.emit(this.x + Math.cos(a) * 6.5, .2, this.zz + Math.sin(a) * 6.5, '#fb923c', .8, .6, .3, .1); } }
    if (this.z === 1 && Math.random() < dt * 8) E.emit(this.x + (Math.random() - .5) * 2.4, 2.6, this.zz + (Math.random() - .5) * 2.4, '#fca5a5', 1.2, .8, .35);
    if (this.z === 5 && Math.random() < dt * 10) E.emit(this.x + (Math.random() - .5) * 3, 2 + Math.random() * 2, this.zz + (Math.random() - .5) * 3, '#93c5fd', 0, .3, .3);
  };
  Boss.prototype.pickAttack = function (G) {
    var opts = { 1: ['rain', 'charge', 'rain', 'minions'], 2: ['beam', 'minions', 'beam', 'spread'], 3: ['wave', 'spread', 'wave', 'tilt'], 4: ['spread', 'charge', 'spread'], 5: ['bolts', 'minions', 'beam2', 'bolts'], 6: ['rain', 'wave', 'beam', 'bolts', 'minions', 'spread', 'charge'] }[this.z];
    var a = opts[Math.floor(Math.random() * opts.length)]; if (a === 'minions' && JG.Ent.foes.filter(function (f) { return !f.dead; }).length > 4) a = opts[0];
    this.atk = a; this.atkT = 0; this.cd = 2.6 + Math.random() * 1.4; this.fired = 0;
    if (a === 'charge') { var P = G.player, dx = P.pos[0] - this.x, dz = P.pos[2] - this.zz, d = Math.hypot(dx, dz) || 1; this.cx = dx / d; this.cz = dz / d; JG.Audio.play('warn'); }
  };
  Boss.prototype.runAttack = function (dt, G, dx, dz, d) {
    var P = G.player, A = JG.Audio, me = this, col = this.D.col, n;
    switch (this.atk) {
      case 'rain': if (this.atkT > this.fired * .35 && this.fired < (this.shield ? 7 : 5)) { this.fired++; var ox = (Math.random() - .5) * 5, oz = (Math.random() - .5) * 5; E.hazard({ kind: 'circle', x: P.pos[0] + ox * (this.fired > 1 ? 1 : 0), z: P.pos[2] + oz * (this.fired > 1 ? 1 : 0), r: 1.6, warn: 1.1, dmg: 14, col: this.z === 6 ? '#a855f7' : '#ef4444' }); } if (this.atkT > 2.4) this.atk = null; break;
      case 'bolts': if (this.atkT > this.fired * .18 && this.fired < (this.shield ? 12 : 8)) { this.fired++; E.hazard({ kind: 'circle', x: P.pos[0] + (Math.random() - .5) * 7, z: P.pos[2] + (Math.random() - .5) * 7, r: 1.1, warn: .9, dmg: 12, col: '#60a5fa', snd: 'zap' }); } if (this.atkT > 2.6) this.atk = null; break;
      case 'charge': if (this.atkT < .8) { this.flash = .05; } if (this.atkT > 1.6) this.atk = null; break;
      case 'minions': if (!this.fired) { this.fired = 1; var tp = { 1: 'h3o', 2: 'radical', 5: 'spark', 6: ['h3o', 'radical', 'spark'][Math.floor(Math.random() * 3)] }[this.z] || 'radical';
          for (var i = 0; i < 2; i++) { var a = Math.random() * 6.28, f = E.spawn(tp, this.x + Math.cos(a) * 2.5, this.zz + Math.sin(a) * 2.5, this.room, G.R); f.st = 'chase'; f.minion = true; } A.play('roar', .6); } this.atk = null; break;
      case 'beam': case 'beam2': if (!this.fired) { this.fired = 1; var k = this.atk === 'beam2' ? 2 : 1; for (var j = 0; j < k; j++) E.hazard({ kind: 'beam', x: this.x, z: this.zz, a: Math.atan2(dz, dx) + Math.PI * .6 + j * Math.PI, sp: (Math.random() < .5 ? 1 : -1) * 1.5, len: 11, warn: .9, dur: 4.6, dmg: 13, col: this.z === 5 ? '#60a5fa' : '#f97316' }); A.play('zap'); } if (this.atkT > 4.6) this.atk = null;
        E.hazards.forEach(function (h) { if (h.kind === 'beam') { h.x = me.x; h.z = me.zz; } }); break;
      case 'wave': if (this.atkT > this.fired * .9 && this.fired < (this.shield ? 3 : 2)) { this.fired++; E.hazard({ kind: 'wave', x: this.x, z: this.zz, r: 1, sp: 6.5, max: 14, dmg: 13, col: this.z === 6 ? '#c084fc' : '#22d3ee' }); A.play('bossHit'); G.cam.shake = .4; } if (this.atkT > 2.8) this.atk = null; break;
      case 'spread': if (this.atkT > .5 + this.fired * .45 && this.fired < 3) { this.fired++; n = this.shield ? 7 : 5; var base = Math.atan2(dz, dx);
          for (var q = 0; q < n; q++) { var ang = base + (q - (n - 1) / 2) * .22; E.fire(this.x, 1.4, this.zz, Math.cos(ang), Math.sin(ang), 9, 11, 'foe', col); } A.play('shootB'); } if (this.atkT > 2) this.atk = null; break;
      case 'tilt': this.tilt = Math.sin(this.atkT * 4) * .4; if (this.atkT > 1.5) { this.tilt = 0; this.atk = null; for (var w = 0; w < 8; w++) { var aa = w / 8 * 6.283; E.fire(this.x, 1.2, this.zz, Math.cos(aa), Math.sin(aa), 7, 10, 'foe', col); } } break;
      default: this.atk = null;
    }
  };
  Boss.prototype.draw = function (R, t, reflect) {
    if (!this.alive) return; var m = B.meshes, c = C(this.D.col), sy = reflect ? -1 : 1, x = this.x, z = this.zz, tint = this.flash > 0 ? [1.8, 1.8, 1.8] : c, o = { tint: tint, spec: .7, em: this.stun > 0 ? .3 : .08, emc: c };
    var bob = Math.sin(t * 2) * .15;
    if (this.z === 1) { var s = 1 + Math.sin(t * 4) * .04; R.draw(m.blob, M4.trs(x, 0, z, 0, this.h, 0, s * 1.1, s * 1.05 * sy, s * 1.1), o); }
    else if (this.z === 2) { R.draw(m.gear, M4.trs(x, 0, z, 0, t * .8, 0, 1, sy, 1), o); }
    else if (this.z === 3) { R.draw(m.scale, M4.trs(x, 0, z, 0, this.h + Math.PI / 2, this.tilt, 1, sy, 1), o); var tl = this.tilt || Math.sin(t * .8) * .15;
      R.draw(m.pan, M4.trs(x + Math.cos(this.h + Math.PI) * 2.1, (3.2 + tl * 2.1) * sy, z - Math.sin(this.h + Math.PI) * 2.1, 0, 0, 0, 1, sy, 1), { tint: [1, .5, .5], spec: .7 });
      R.draw(m.pan, M4.trs(x - Math.cos(this.h + Math.PI) * 2.1, (3.2 - tl * 2.1) * sy, z + Math.sin(this.h + Math.PI) * 2.1, 0, 0, 0, 1, sy, 1), { tint: [.5, .7, 1], spec: .7 }); }
    else if (this.z === 4) { this.segs.forEach(function (s, i) { R.draw(m.seg, M4.trs(s.x, (.8 + Math.sin(t * 5 + i) * .1) * sy, s.z, 0, 0, 0, 1 - i * .03, (1 - i * .03) * sy, 1 - i * .03), { tint: i % 2 ? [c[0] * .8, c[1] * .8, c[2] * .6] : c, spec: .6 }); });
      R.draw(m.head, M4.trs(x, 1.1 * sy, z, 0, this.h, 0, 1, sy, 1), o); }
    else if (this.z === 5) { R.draw(m.core, M4.trs(x, (2.4 + bob) * sy, z, t * .5, t, 0, 1, sy, 1), { tint: tint, em: .55, emc: c, spec: .8 });
      for (var i = 0; i < 3; i++) { var a = t * 1.8 + i * 2.094; R.draw(m.rod, M4.trs(x + Math.cos(a) * 2.4, (2 + Math.sin(t * 3 + i) * .4) * sy, z + Math.sin(a) * 2.4, 0, -a, .3, 1, sy, 1), { tint: i === 0 ? [.75, .75, .8] : (i === 1 ? [.85, .5, .2] : [.9, .9, .95]), spec: .9 }); } }
    else if (this.z === 6) { R.draw(m.mage, M4.trs(x, (bob + .2) * sy, z, 0, this.h, 0, 1.1, 1.1 * sy, 1.1), o);
      for (var k = 0; k < 4; k++) { var b = t * 1.2 + k * 1.57; R.draw(E.meshes.flask, M4.trs(x + Math.cos(b) * 2.2, (2.4 + Math.sin(t * 2 + k)) * sy, z + Math.sin(b) * 2.2, 0, t, 0, 1.4, 1.4 * sy, 1.4), { tint: C(['#ef4444', '#f97316', '#06b6d4', '#3b82f6'][k]), em: .4, emc: [.3, .3, .3] }); } }
    if (this.shield && !reflect) { var pul = 1 + Math.sin(t * 6) * .04, rs = this.z === 4 ? 1.6 : this.D.r + 1.2; R.draw(m.shield, M4.trs(x, (this.z === 5 ? 2.4 : 1.6), z, 0, t, 0, rs * pul, rs * pul, rs * pul), { tint: [.6, .9, 1], em: .8, emc: [.3, .6, 1], a: .28, spec: 1 }); }
  };
  B.make = function (z, x, zz, room, G) { return new Boss(z, x, zz, room, G); };
})();
