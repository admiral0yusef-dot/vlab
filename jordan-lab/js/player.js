/* ============================================================
   JG Player — العالِم الشاب: نموذج هرمي + تحكم + حركات
   ============================================================ */
(function () {
  'use strict';
  var JG = window.JG = window.JG || {}, GB = JG.GB, M4 = JG.M4;

  function Player(R) {
    var mk = function (f) { var g = new GB(); f(g); return R.mesh(g); };
    this.m = {
      torso: mk(function (g) {
        g.box(0, .4, 0, .64, .8, .38, '#f1f5f9');            // معطف المختبر
        g.box(0, .02, 0, .7, .18, .42, '#e2e8f0');           // أسفل المعطف
        g.box(0, .55, .195, .2, .5, .02, '#0f766e');          // قميص
        g.box(-.16, .68, .2, .16, .14, .02, '#cbd5e1'); g.box(.16, .68, .2, .16, .14, .02, '#cbd5e1'); // ياقة
        g.box(.2, .38, .2, .12, .14, .02, '#94a3b8');         // جيب + بطاقة
        g.box(.2, .42, .205, .06, .07, .01, '#0ea5e9');
        g.cyl(0, .1, -.29, .13, .62, '#64748b', 10);          // جهاز المعادلة على الظهر
        g.box(0, .4, -.22, .4, .5, .08, '#334155');
      }),
      tank: mk(function (g) { g.cyl(0, 0, 0, .1, .5, '#ffffff', 10); }),
      head: mk(function (g) {
        g.sphere(0, 0, 0, .27, '#f0c19a', 14);
        g.sphere(0, .07, -.03, .285, '#2b1d14', 12, null, .85);   // شعر
        g.box(0, .2, .02, .5, .14, .46, '#2b1d14');
        g.box(0, .03, .18, .44, .07, .14, '#0e7490');           // حزام النظارة
        g.box(-.1, .03, .25, .14, .1, .04, '#a5f3fc'); g.box(.1, .03, .25, .14, .1, .04, '#a5f3fc');
        g.sphere(-.1, .03, .265, .03, '#082f49', 6); g.sphere(.1, .03, .265, .03, '#082f49', 6);
        g.box(0, -.12, .25, .1, .03, .02, '#9a3412');            // فم
        g.sphere(-.27, 0, 0, .06, '#e5ae86', 6); g.sphere(.27, 0, 0, .06, '#e5ae86', 6);
      }),
      arm: mk(function (g) { g.box(0, -.22, 0, .17, .48, .17, '#f1f5f9'); g.box(0, -.43, 0, .18, .06, .18, '#cbd5e1'); g.sphere(0, -.52, 0, .085, '#f0c19a', 8); }),
      leg: mk(function (g) { g.box(0, -.26, 0, .2, .52, .21, '#1e3a8a'); g.box(0, -.56, .05, .22, .1, .32, '#111827'); }),
      barrel: mk(function (g) { g.cyl(0, 0, 0, .24, .55, '#ffffff', 12); g.ring(0, .1, 0, .245, .025, '#334155', 12); g.ring(0, .45, 0, .245, .025, '#334155', 12); }),
      bottle: mk(function (g) { g.cyl(0, 0, 0, .1, .22, '#ffffff', 10); g.cyl(0, .22, 0, .04, .12, '#e2e8f0', 8); }),
      atom: mk(function (g) { g.sphere(0, 0, 0, .14, '#ffffff', 10); })
    };
    this.pos = [0, 0, 0]; this.vel = [0, 0, 0]; this.h = 0; this.th = 0; this.phase = 0; this.ground = true; this.coyote = 0; this.jb = 0;
    this.r = .38; this.energy = 100; this.maxE = 100; this.inv = 0; this.hurtT = 0; this.emote = null; this.emoteT = 0; this.carry = null;
    this.mode = 'base'; this.speed = 0; this.stepT = 0; this.dashT = 0; this.boostT = 0; this.shieldT = 0;
  }
  Player.prototype.update = function (dt, inp, cam, W, A) {
    var run = inp.run || this.boostT > 0, maxS = (run ? 7.2 : 4.4) * (this.slow ? .55 : 1) * (this.boostT > 0 ? 1.25 : 1);
    var fx = Math.sin(cam.yaw), fz = Math.cos(cam.yaw), rx = -Math.cos(cam.yaw), rz = Math.sin(cam.yaw);
    var ix = inp.x, iz = inp.z, L = Math.hypot(ix, iz); if (L > 1) { ix /= L; iz /= L; L = 1; }
    var tx = (fx * iz + rx * ix) * maxS, tz = (fz * iz + rz * ix) * maxS;
    if (this.emote === 'win' || this.frozen) { tx = 0; tz = 0; }
    var acc = this.ground ? 14 : 5; this.vel[0] += (tx - this.vel[0]) * Math.min(1, acc * dt); this.vel[2] += (tz - this.vel[2]) * Math.min(1, acc * dt);
    if (this.knock) { this.vel[0] += this.knock[0]; this.vel[2] += this.knock[1]; this.knock = null; }
    if (L > .1 && !this.frozen) this.th = Math.atan2(tx, tz);
    var dh = ((this.th - this.h + Math.PI * 3) % (Math.PI * 2)) - Math.PI; this.h += dh * Math.min(1, 12 * dt);
    // القفز مع زمن السماح
    this.coyote = this.ground ? .12 : Math.max(0, this.coyote - dt); this.jb = inp.jump ? .14 : Math.max(0, this.jb - dt);
    if (this.jb > 0 && this.coyote > 0 && !this.frozen) { this.vel[1] = 7.4; this.ground = false; this.coyote = 0; this.jb = 0; inp.jump = false; A.play('jump'); }
    this.vel[1] -= 22 * dt;
    // حركة مع انزلاق على المحاور
    var nx = this.pos[0] + this.vel[0] * dt, nz = this.pos[2] + this.vel[2] * dt, feet = this.pos[1];
    var b = W.blocked(nx, this.pos[2], this.r, feet); if (!b) this.pos[0] = nx; else { this.vel[0] = 0; if (b.id) this.bumpDoor = b; }
    b = W.blocked(this.pos[0], nz, this.r, feet); if (!b) this.pos[2] = nz; else { this.vel[2] = 0; if (b.id) this.bumpDoor = b; }
    var gy = W.groundAt(this.pos[0], this.pos[2], this.r, this.pos[1]);
    this.pos[1] += this.vel[1] * dt;
    if (this.pos[1] <= gy) { if (!this.ground && this.vel[1] < -6) A.play('land'); this.pos[1] = gy; this.vel[1] = 0; this.ground = true; } else this.ground = this.pos[1] - gy < .02;
    this.speed = Math.hypot(this.vel[0], this.vel[2]);
    if (this.ground && this.speed > 1) { this.stepT -= dt * this.speed; if (this.stepT <= 0) { this.stepT = 1.7; A.play('step', run ? 1.2 : .8); } }
    this.phase += dt * (this.speed * 2.3 + (this.speed < .3 ? 1.5 : 0));
    this.inv = Math.max(0, this.inv - dt); this.hurtT = Math.max(0, this.hurtT - dt); this.emoteT = Math.max(0, this.emoteT - dt); if (this.emoteT <= 0) this.emote = null;
    this.boostT = Math.max(0, this.boostT - dt); this.shieldT = Math.max(0, this.shieldT - dt);
  };
  Player.prototype.hurt = function (dmg, fromX, fromZ, A) {
    if (this.inv > 0) return false; if (this.shieldT > 0) { dmg *= .3; A.play('shield'); }
    this.energy = Math.max(0, this.energy - dmg); this.inv = .8; this.hurtT = .45; A.play('hurt');
    if (fromX !== undefined) { var dx = this.pos[0] - fromX, dz = this.pos[2] - fromZ, l = Math.hypot(dx, dz) || 1; this.knock = [dx / l * 7, dz / l * 7]; this.vel[1] = Math.max(this.vel[1], 3.5); this.ground = false; }
    if (this.energy > 0) { this.emote = 'hurt'; this.emoteT = .45; } return true;
  };
  Player.prototype.draw = function (R, t, reflect) {
    var p = this.pos, s = this.speed, sw = Math.sin(this.phase) * Math.min(.85, s / 5.5), air = !this.ground;
    var bob = this.ground ? Math.abs(Math.cos(this.phase)) * Math.min(.06, s * .012) + Math.sin(t * 2) * .01 : 0;
    var y0 = reflect ? -p[1] : p[1], sy = reflect ? -1 : 1;
    var tint = this.hurtT > 0 && Math.floor(t * 20) % 2 ? [1.6, .5, .5] : (this.inv > 0 && Math.floor(t * 16) % 2 ? [1.25, 1.25, 1.25] : null);
    var o = { tint: tint, spec: .25 };
    var root = M4.trs(p[0], y0 + (.92 + bob) * sy, p[2], 0, this.h, 0, 1, sy, 1);
    var lean = air ? -.15 : Math.min(.18, s * .025);
    var torso = M4.mul(root, M4.trs(0, 0, 0, lean, 0, 0)); R.draw(this.m.torso, torso, o);
    var modeC = this.mode === 'acid' ? [1, .3, .35] : [.3, .6, 1];
    R.draw(this.m.tank, M4.mul(torso, M4.trs(0, .14, -.29, 0, 0, 0, 1, 1, 1)), { tint: modeC, em: .7, emc: [modeC[0] * .3, modeC[1] * .3, modeC[2] * .3] });
    var hy = .8 + .27; var look = this.emote === 'win' ? -.3 : 0;
    R.draw(this.m.head, M4.mul(torso, M4.trs(0, hy, 0, look + Math.sin(t * 1.3) * .03, Math.sin(t * .7) * .08, 0)), o);
    var la = sw, ra = -sw, lz = 0, rz = 0;
    if (air) { la = -1.2; ra = -1.2; lz = .4; rz = -.4; }
    if (this.emote === 'win') { var wv = Math.sin(t * 12) * .35; la = -2.8 + wv; ra = -2.8 - wv; lz = .3; rz = -.3; }
    if (this.emote === 'hurt') { la = -.9; ra = -.9; lz = .8; rz = -.8; }
    if (this.emote === 'shoot') { ra = -1.45; }
    if (this.carry) { la = -1.1; ra = -1.1; lz = .1; rz = -.1; }
    R.draw(this.m.arm, M4.mul(torso, M4.trs(-.41, .72, 0, la, 0, lz)), o);
    R.draw(this.m.arm, M4.mul(torso, M4.trs(.41, .72, 0, ra, 0, rz)), o);
    var ll = air ? -.9 : sw, rl = air ? .2 : -sw;
    R.draw(this.m.leg, M4.mul(root, M4.trs(-.16, -.02, 0, -ll, 0, 0)), o);
    R.draw(this.m.leg, M4.mul(root, M4.trs(.16, -.02, 0, -rl, 0, 0)), o);
    if (this.carry) {
      var cm = M4.mul(torso, M4.trs(0, .35, .48, 0, 0, 0));
      if (this.carry.kind === 'barrel') R.draw(this.m.barrel, cm, { tint: this.carry.col, spec: .5 });
      else if (this.carry.kind === 'atom') R.draw(this.m.atom, M4.mul(cm, M4.trs(0, .2, 0, 0, 0, 0, 1.4)), { tint: this.carry.col, em: .3 });
      else R.draw(this.m.bottle, M4.mul(cm, M4.trs(0, .1, 0, 0, 0, 0)), { tint: this.carry.col, spec: .6 });
    }
  };
  JG.Player = Player;

  /* ---------- الكاميرا التتبعية ---------- */
  function Cam() { this.yaw = Math.PI; this.pitch = .68; this.dist = 9; this.eye = [0, 8, 8]; this.tgt = [0, 1, 0]; this.shake = 0; this.cine = null; }
  Cam.prototype.update = function (dt, p, R) {
    var tx = p.pos[0] + Math.sin(p.h) * .8 * Math.min(1, p.speed / 5), tz = p.pos[2] + Math.cos(p.h) * .8 * Math.min(1, p.speed / 5), ty = p.pos[1] * .6 + 1.2;
    var k = Math.min(1, dt * 6); this.tgt[0] += (tx - this.tgt[0]) * k; this.tgt[1] += (ty - this.tgt[1]) * k; this.tgt[2] += (tz - this.tgt[2]) * k;
    var cp = Math.cos(this.pitch) * this.dist, ex = this.tgt[0] - Math.sin(this.yaw) * cp, ez = this.tgt[2] - Math.cos(this.yaw) * cp, ey = this.tgt[1] + Math.sin(this.pitch) * this.dist;
    var kk = Math.min(1, dt * 8); this.eye[0] += (ex - this.eye[0]) * kk; this.eye[1] += (ey - this.eye[1]) * kk; this.eye[2] += (ez - this.eye[2]) * kk;
    var e = this.eye.slice(), t = this.tgt.slice();
    if (this.cine) { var c = this.cine, u = Math.min(1, c.t / c.dur), sm = u * u * (3 - 2 * u); c.t += dt;
      var ce = [c.at[0] + Math.sin(c.a0 + c.da * sm) * c.r, c.at[1] + c.hgt, c.at[2] + Math.cos(c.a0 + c.da * sm) * c.r];
      var bl = Math.min(1, Math.min(c.t, c.dur + c.hold - c.t + .6) / .6); bl = Math.max(0, bl);
      for (var i = 0; i < 3; i++) { e[i] = e[i] + (ce[i] - e[i]) * bl; t[i] = t[i] + ((c.at[i] + (i === 1 ? 1 : 0)) - t[i]) * bl; }
      if (c.t > c.dur + c.hold + .6) { this.cine = null; if (c.done) c.done(); } }
    if (this.shake > 0) { this.shake = Math.max(0, this.shake - dt * 2); var s = this.shake * .35; e[0] += (Math.random() - .5) * s; e[1] += (Math.random() - .5) * s; e[2] += (Math.random() - .5) * s; }
    R.setCamera(e, t, .92);
  };
  Cam.prototype.cinema = function (at, opt) { opt = opt || {}; this.cine = { at: at, t: 0, dur: opt.dur || 2.4, hold: opt.hold || 1, r: opt.r || 9, hgt: opt.h || 5, a0: opt.a0 === undefined ? this.yaw + Math.PI : opt.a0, da: opt.da || 1.2, done: opt.done }; };
  JG.Cam = Cam;
})();
