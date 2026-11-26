// ============================================================
// OFFROAD LEGENDS — physics.js
// Planar rigid-body vehicle dynamics (the game is played side-on,
// so motion is solved in the x–y plane and rendered in 3D):
//  • chassis rigid body: mass, moment of inertia, linear+angular velocity
//  • ray-cast spring–damper suspension per wheel with bump stops
//  • spinning wheels with inertia; tyre friction solved as impulses
//    limited by μ·N (traction, wheel-spin, skids)
//  • engine torque curve + reaction torque on the chassis (wheelies)
//  • brakes / reverse, air pitch control, boost thrust, drag, gravity
//  • hull & driver-head collision with the terrain (crashes / flips)
// Fixed time step → identical results on every device.
// ============================================================

export const G = 15.5;           // arcade gravity (m/s²)
export const DT = 1 / 240;       // fixed physics step

const rot = (x, y, c, s) => [x * c - y * s, x * s + y * c];

export class Vehicle {
  constructor(p, terrain, x = 6) {
    this.p = p; this.T = terrain;
    this.x = x; this.y = terrain.height(x) + p.susp + p.wheelR + 0.6; this.a = 0;
    this.vx = 0; this.vy = 0; this.w = 0;
    this.wheels = [p.rear, p.front].map((m, i) => ({ m, i, s: p.susp, sPrev: p.susp, spin: 0, ang: 0, contact: false, slip: 0, load: 0, cx: 0, cy: 0, cpx: 0, cpy: 0, drive: i === 0 || p.drive === 'awd', mu: 1 }));
    this.gas = 0; this.brake = 0; this.boostOn = false;
    this.boost = p.boostCap; this.fuel = p.fuel;
    this.airTime = 0; this.airRot = 0; this.grounded = false; this.crashed = false; this.headHit = false;
    this.events = []; this.landImpact = 0; this.maxX = x; this.rpm = 0; this.recoverCD = 0; this.dist = 0;
    this.hullHit = 0;
  }
  get speed() { return Math.hypot(this.vx, this.vy); }
  // world velocity of a point offset (rx,ry) from the centre of mass
  pv(rx, ry) { return [this.vx - this.w * ry, this.vy + this.w * rx]; }
  impulse(jx, jy, rx, ry) { const p = this.p; this.vx += jx / p.mass; this.vy += jy / p.mass; this.w += (rx * jy - ry * jx) / p.inertia; }

  step(dt = DT) {
    const p = this.p, T = this.T, c = Math.cos(this.a), s = Math.sin(this.a);
    const g = G * T.gravity(this.x);
    let fx = 0, fy = -p.mass * g, tq = 0;
    const dirx = s, diry = -c;                  // suspension axis (chassis down)
    let nContact = 0;
    const hasFuel = this.fuel > 0;
    const gas = hasFuel ? this.gas : 0;

    // ---------------- wheels ----------------
    for (const W of this.wheels) {
      const [mx, my] = rot(W.m[0], W.m[1], c, s); const Mx = this.x + mx, My = this.y + my;
      // solve wheel-centre position along suspension axis so the tyre touches the ground
      let sv = p.susp, n = [0, 1], gx = Mx, contact = false;
      for (let it = 0; it < 4; it++) {
        const Cx = Mx + dirx * sv, Cy = My + diry * sv; n = T.normal(Cx); const gy = T.height(Cx);
        const dist = (Cy - gy) * n[1]; const nd = n[0] * dirx + n[1] * diry;
        if (nd > -0.15) break;
        const ns = sv + (p.wheelR - dist) / nd;
        if (it === 0 && dist > p.wheelR) { contact = false; break; }
        sv = ns; contact = true; gx = Cx;
      }
      let bump = 0; const smin = p.susp * 0.08;
      if (contact) { if (sv > p.susp) { contact = false; sv = p.susp; } if (sv < smin) { bump = smin - sv; sv = smin; } }
      else sv = Math.min(p.susp, W.s + (p.susp - W.s) * 0.25 + 0.002);
      W.sPrev = W.s; W.s = sv; W.contact = contact;
      const Cx = Mx + dirx * sv, Cy = My + diry * sv; W.cx = Cx; W.cy = Cy;
      if (contact) {
        nContact++;
        const cpx = Cx - n[0] * p.wheelR, cpy = Cy - n[1] * p.wheelR; W.cpx = cpx; W.cpy = cpy;
        // spring + damper (+ stiff bump stop)
        const comp = p.susp - sv, vel = (W.sPrev - sv) / dt;
        let Fs = p.k * comp + p.c * vel + bump * p.k * 25; if (Fs < 0) Fs = 0;
        if (p.legs) Fs *= 1 + 0.12 * Math.sin(W.ang * 2);           // walking gait bob
        fx += -dirx * Fs; fy += -diry * Fs; tq += mx * (-diry * Fs) - my * (-dirx * Fs);
        const nd = -(n[0] * dirx + n[1] * diry); const N = Fs * Math.max(0, nd); W.load = N;
        // tyre friction impulse (traction / braking / skidding)
        const surf = T.surface(cpx); W.mu = surf.mu * p.grip; W.surf = surf.type;
        const tx = n[1], ty = -n[0];
        const rx = cpx - this.x, ry = cpy - this.y;
        const [pvx, pvy] = this.pv(rx, ry); const vt = pvx * tx + pvy * ty;
        const Iw = p.wheelR * p.wheelR * 14;
        const slip = vt - W.spin * p.wheelR;
        const rxt = rx * ty - ry * tx; const invM = 1 / p.mass + rxt * rxt / p.inertia + p.wheelR * p.wheelR / Iw;
        let j = -slip / invM; const jmax = W.mu * N * dt; const sat = Math.abs(j) > jmax; if (sat) j = Math.sign(j) * jmax;
        this.impulse(j * tx, j * ty, rx, ry); W.spin -= j * p.wheelR / Iw;
        W.slip = sat ? Math.min(1, Math.abs(slip) / 6) : 0;
        // rolling resistance
        W.spin *= 1 - 0.15 * dt;
      } else { W.load = 0; W.slip = 0; W.spin *= 1 - 0.4 * dt; }
    }

    // ---------------- engine / brakes (torque on wheels + reaction on chassis) ----------------
    const Iw = p.wheelR * p.wheelR * 14; const drv = this.wheels.filter(W => W.drive);
    const fwdSpeed = this.vx * c + this.vy * s;
    for (const W of drv) {
      let Tq = 0;
      if (gas > 0) { const r = Math.abs(W.spin) / p.maxW; Tq = p.torque * gas * Math.max(0, 1 - r * r * r) * (1.05 - 0.25 * r) / drv.length; }
      if (this.brake > 0) {
        if (fwdSpeed > 1.2 || W.spin > 2) { const b = p.brake * this.brake / drv.length; const dw = Math.min(Math.abs(W.spin), b * dt / Iw); W.spin -= Math.sign(W.spin) * dw; tq -= Math.sign(fwdSpeed || 1) * b * 0.35; }
        else if (hasFuel) { const r = Math.abs(W.spin) / (p.maxW * 0.35); Tq -= p.torque * 0.55 * this.brake * Math.max(0, 1 - r * r) / drv.length; }
      }
      W.spin += Tq * dt / Iw; tq += Tq * (W.contact ? 1 : 0.55);
    }
    for (const W of this.wheels) { if (!W.drive && !W.contact) W.spin *= 1 - 0.6 * dt; W.ang += W.spin * dt; }
    this.rpm = Math.min(1.08, Math.abs(drv[0].spin) / p.maxW * (gas > 0 ? 1 : 0.85) + (gas > 0 ? 0.12 : 0.02));

    // ---------------- air control / stability ----------------
    this.grounded = nContact > 0;
    if (!this.grounded) { tq += (this.gas - this.brake) * p.air; this.w *= 1 - (p.angDamp || 0.15) * dt; }
    else this.w *= 1 - 0.35 * dt;

    // ---------------- boost ----------------
    if (this.boostOn && this.boost > 0 && hasFuel) { fx += c * p.boost; fy += s * p.boost; this.boost = Math.max(0, this.boost - dt); }
    else if (!this.boostOn) this.boost = Math.min(p.boostCap, this.boost + dt * 0.13);

    // ---------------- drag ----------------
    const sp = this.speed, dk = p.drag * 9;
    fx -= dk * this.vx * sp; fy -= dk * this.vy * sp;

    // integrate
    this.vx += fx / p.mass * dt; this.vy += fy / p.mass * dt; this.w += tq / p.inertia * dt;
    this.w = Math.max(-9, Math.min(9, this.w));
    this.x += this.vx * dt; this.y += this.vy * dt; this.a += this.w * dt;

    // ---------------- hull / head collision ----------------
    this.collideHull(dt);

    // ---------------- bookkeeping ----------------
    if (this.hullHit > 0) this.hullHit -= dt;
    if (!this.grounded && this.hullHit <= 0) { this.airTime += dt; this.airRot += this.w * dt; }
    else {
      if (this.airTime > 0.05) this.events.push({ t: 'land', air: this.airTime, rot: this.airRot, v: -this.vy });
      this.airTime = 0; this.airRot = 0;
    }
    if (this.recoverCD > 0) this.recoverCD -= dt;
    this.fuel = Math.max(0, this.fuel - p.burn * (0.35 + 0.65 * this.gas + (this.boostOn && this.boost > 0 ? 0.8 : 0)) * dt);
    if (this.x > this.maxX) this.maxX = this.x;
  }

  collideHull(dt) {
    const p = this.p, T = this.T, c = Math.cos(this.a), s = Math.sin(this.a);
    const pts = p.hull.concat([p.head]);
    for (let i = 0; i < pts.length; i++) {
      const [rx, ry] = rot(pts[i][0], pts[i][1], c, s); const wx = this.x + rx, wy = this.y + ry;
      const gy = T.height(wx); if (wy >= gy) continue;
      const n = T.normal(wx); const pen = (gy - wy) * n[1];
      if (i === pts.length - 1) { if (!this.crashed) { this.crashed = true; this.headHit = true; this.events.push({ t: 'crash' }); } }
      // positional correction
      this.x += n[0] * pen * 0.8; this.y += n[1] * pen * 0.8;
      const [vx, vy] = this.pv(rx, ry); const vn = vx * n[0] + vy * n[1];
      if (vn < 0) {
        const rxn = rx * n[1] - ry * n[0]; const jn = -(1.25) * vn / (1 / p.mass + rxn * rxn / p.inertia);
        this.impulse(jn * n[0], jn * n[1], rx, ry);
        const tx = n[1], ty = -n[0]; const vt = vx * tx + vy * ty; const rxt = rx * ty - ry * tx;
        let jt = -vt / (1 / p.mass + rxt * rxt / p.inertia); const lim = 0.6 * jn; jt = Math.max(-lim, Math.min(lim, jt));
        this.impulse(jt * tx, jt * ty, rx, ry);
        if (-vn > 6 && i < pts.length - 1) this.events.push({ t: 'thud', v: -vn });
        this.hullHit = 0.12;
      }
    }
  }

  // "Recover" button: hop + righting torque when stuck or tipping
  recover() {
    if (this.recoverCD > 0 || this.crashed) return false;
    let a = ((this.a + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
    if (Math.abs(a) < 0.5 && this.grounded && this.speed > 2) return false;
    this.vy += 6.5; this.w += -a * 2.2; this.recoverCD = 3.5; this.events.push({ t: 'recover' });
    return true;
  }
  upsideDown() { const a = ((this.a + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI; return Math.abs(a) > 1.9; }
}
