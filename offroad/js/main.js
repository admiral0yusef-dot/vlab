// ============================================================
// OFFROAD LEGENDS — main.js : game loop, runs, camera, HUD, menus,
// garage, worlds, challenges, achievements, settings, input, saving.
// ============================================================
import * as THREE from '../lib/three.module.min.js';
import { Terrain, WORLDS, ZONE_LEN } from './terrain.js';
import { Vehicle, DT } from './physics.js';
import { VEHICLES, UPGRADES, MAX_LVL, upgradeCost, tuned, statBars } from './vehicles.js';
import { WorldRenderer } from './render.js';
import { buildVehicle, updateLegs, mat } from './models.js';
import { FX } from './fx.js';
import { Audio } from './audio.js';
import * as SV from './save.js';

const $ = id => document.getElementById(id);
const fmt = n => Math.round(n).toLocaleString('en-US');
let S = SV.load();
const A = new Audio();
const isTouch = matchMedia('(pointer:coarse)').matches || 'ontouchstart' in window;
const autoQ = () => (isTouch || innerWidth * innerHeight < 800000) ? 'mid' : 'high';
const qual = () => S.settings.quality === 'auto' ? autoQ() : S.settings.quality;
const R = new WorldRenderer($('gl'), qual());
const fx = new FX(R.scene); fx.resize(innerHeight);
const persist = () => SV.save(S);

let state = 'splash', run = null, cv = null, demo = null, tNow = 0, slowmo = 1, fpsAcc = [0, 0], autoChecked = false;
const input = { gas: 0, brake: 0, boost: false };

// ============================================================
// vehicle visual (body follows chassis; wheels/legs in world space)
// ============================================================
function makeCarVisual(v, scene = R.scene) {
  const m = buildVehicle(v); const root = new THREE.Group(); root.add(m.body); scene.add(root);
  m.wheels.forEach(w => scene.add(w)); if (m.legs) scene.add(m.legs.group);
  // shock absorbers (visible suspension)
  m.shocks = [];
  if (m.wheels.length) for (let i = 0; i < 2; i++) for (const z of [m.track - 0.32, -(m.track - 0.32)]) {
    const s = new THREE.Group(); const spring = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1, 8), mat(0xffc21a, { metalness: .5, roughness: .4 })); const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1, 6), mat(0xd0d6de, { metalness: .9, roughness: .2 }));
    spring.scale.set(1, 0.5, 1); spring.position.y = 0.25; s.add(spring, rod); scene.add(s); m.shocks.push({ s, i, z });
  }
  m.root = root; m.scene = scene; return m;
}
function removeCarVisual(m) { if (!m) return; m.scene.remove(m.root); m.wheels.forEach(w => m.scene.remove(w)); if (m.legs) m.scene.remove(m.legs.group); m.shocks.forEach(x => m.scene.remove(x.s)); }
const up = new THREE.Vector3(0, 1, 0), tv = new THREE.Vector3();
function syncCar(m, car) {
  m.root.position.set(car.x, car.y, 0); m.root.rotation.z = car.a;
  const c = Math.cos(car.a), s = Math.sin(car.a);
  car.wheels.forEach((W, i) => { const w = m.wheels[i]; if (w) { w.position.set(W.cx, W.cy, 0); w.rotation.z = -W.ang; } });
  for (const sh of m.shocks) { const W = car.wheels[sh.i]; const mx = car.x + W.m[0] * c - (W.m[1] + 0.35) * s, my = car.y + W.m[0] * s + (W.m[1] + 0.35) * c;
    tv.set(W.cx - mx, W.cy - my, 0); const L = tv.length(); sh.s.position.set(mx, my, sh.z); sh.s.quaternion.setFromUnitVectors(up, tv.normalize().negate()); sh.s.scale.set(1, L, 1); sh.s.rotateX(Math.PI); }
  if (m.legs) updateLegs(m.legs, car, car.T);
  const head = m.driver.userData.head; if (head) { head.rotation.z = THREE.MathUtils.lerp(head.rotation.z, -car.w * 0.05 + (car.grounded ? 0 : 0.15), 0.2); }
}

// ============================================================
// HUD + toasts
// ============================================================
const hud = { coins: -1, dia: -1, dist: -1, fuel: -1, spd: -1 };
function toast(txt, cls = '') { const d = document.createElement('div'); d.className = 'toast ' + cls; d.textContent = txt; $('toasts').appendChild(d); setTimeout(() => d.remove(), 1650); while ($('toasts').children.length > 3) $('toasts').firstChild.remove(); }
const bannerQ = []; let bannerOn = false;
function banner(txt) { bannerQ.push(txt); if (!bannerOn) nextBanner(); }
function nextBanner() { const t = bannerQ.shift(); if (!t) { bannerOn = false; return; } bannerOn = true; const b = $('banner'); b.hidden = false; b.textContent = t; b.style.animation = 'none'; b.offsetWidth; b.style.animation = ''; setTimeout(() => { b.hidden = true; nextBanner(); }, 3000); }
function updateHUD() {
  const car = run.car, total = run.coins;
  if (total !== hud.coins) { hud.coins = total; $('hCoins').textContent = fmt(total); }
  if (run.dia !== hud.dia) { hud.dia = run.dia; $('hDia').textContent = run.dia; }
  const d = Math.floor(run.dist); if (d !== hud.dist) { hud.dist = d; $('hDist').firstChild.nodeValue = fmt(d); }
  const f = Math.round(car.fuel / car.p.fuel * 100); if (f !== hud.fuel) { hud.fuel = f; const b = $('fuelBar'); b.style.width = f + '%'; b.classList.toggle('low', f < 22); $('fuelWarn').hidden = !(f < 22 && !run.over); }
  const spd = Math.round(Math.max(0, car.vx) * 3.6); if (spd !== hud.spd) { hud.spd = spd; $('hSpeed').textContent = spd + ' كم/س'; }
  $('nRpm').style.transform = `rotate(${-115 + Math.min(1.08, car.rpm) * 215}deg)`;
  const bf = car.boost / car.p.boostCap; $('nBoost').style.transform = `rotate(${-115 + bf * 215}deg)`; $('boostArc').style.strokeDasharray = `${bf * 100} 100`;
  $('bBoost').classList.toggle('empty', bf < 0.05); $('bBoost').classList.toggle('on', input.boost && bf > 0);
  $('pGas').classList.toggle('on', input.gas > 0); $('pBrake').classList.toggle('on', input.brake > 0);
}

// ============================================================
// runs
// ============================================================
function startRun(world = S.selWorld) {
  A.init();
  const v = VEHICLES.find(x => x.id === S.sel), p = tuned(v, S.lv[v.id]);
  const T = new Terrain(world), seed = 1000 + world * 17;
  R.setTerrain(T, seed); fx.parts.length = 0;
  const car = new Vehicle(p, T, 8);
  for (let i = 0; i < 120; i++) car.step(DT); // settle on suspension
  removeCarVisual(cv); removeCarVisual(demo?.cv); demo = null; cv = makeCarVisual(v);
  run = { T, car, v, startWorld: world, coins: 0, picked: 0, dia: 0, diaBonus: 0, fuel: 0, flips: 0, maxAir: 0, usedBoost: false, zones: new Set([0]), zoneCount: 1, bonus: { air: 0, flip: 0, dist: 0, zone: 0 },
    t: 0, over: false, reason: '', overT: 0, milestone: 0, emptyT: 0, upsideT: 0, secrets: 0, intro: 1.8, dist: 0, startX: car.x, curZone: 0, lowWarned: false };
  hud.coins = hud.dia = hud.dist = hud.fuel = hud.spd = -1;
  $('hBest').textContent = 'الأفضل ' + fmt(S.best[world] || 0) + 'م'; $('hZone').textContent = WORLDS[world].ar;
  R.camPos.set(car.x - 4, car.y + 1.5, 7); slowmo = 1;
  showScreen(null); $('hud').hidden = false; state = 'play';
  A.startEngine(v.id); A.startMusic(); toast(WORLDS[world].ar, 'c');
  R.bestFlag(S.best[world] ? (S.best[world] + run.startX) : null);
}
function endRun(reason) {
  if (run.over) return; run.over = true; run.reason = reason; run.overT = 0;
  if (reason === 'crash') { A.crash(); slowmo = 0.3; R.shake = 1; }
  else if (reason === 'fuel') toast('نفد الوقود!', 'r'); else toast('انقلبت المركبة!', 'r');
  input.gas = input.brake = 0; input.boost = false;
}
function runSummary() { return { dist: run.dist, coins: run.coins, maxAir: run.maxAir, flips: run.flips, fuel: run.fuel, usedBoost: run.usedBoost, startWorld: run.startWorld, vehicle: run.v.id, dia: run.dia, zones: run.zoneCount }; }
function finishRun() {
  A.stopEngine(); const r = runSummary(), w = run.startWorld;
  const prevBest = S.best[w] || 0, rec = r.dist > prevBest && r.dist > 20;
  S.coins += run.coins; S.dia += run.dia + run.diaBonus;
  S.best[w] = Math.max(prevBest, Math.floor(r.dist)); S.bestAny = Math.max(S.bestAny, Math.floor(r.dist));
  const st = S.stats; st.runs++; st.dist += r.dist; st.coins += run.coins; st.flips += r.flips; st.fuel += r.fuel; st.dia += run.dia; st.maxAir = Math.max(st.maxAir, r.maxAir); st.secrets += run.secrets;
  const unl = [];
  // challenges (sequential stages; several may complete in one run)
  while (S.chIdx < SV.CHALLENGES.length && SV.CHALLENGES[S.chIdx].test(r, S)) { const C = SV.CHALLENGES[S.chIdx]; S.ch[C.id] = 1; S.coins += C.rew[0]; S.dia += C.rew[1]; unl.push(`🏁 تحدٍّ مكتمل: ${C.ar} (+${fmt(C.rew[0])} عملة${C.rew[1] ? ' +' + C.rew[1] + ' ماس' : ''})`); S.chIdx++; }
  const day = SV.today(); if (S.daily.date !== day) S.daily = { date: day, done: false };
  const D = SV.dailyFor(day); if (!S.daily.done && D.test(r)) { S.daily.done = true; S.coins += D.rew[0]; S.dia += D.rew[1]; unl.push(`📅 التحدي اليومي مكتمل! (+${fmt(D.rew[0])} +${D.rew[1]} ماس)`); }
  unl.push(...checkAch());
  persist();
  // results UI
  const T = { crash: 'اصطدام!', fuel: 'نفد الوقود', flip: 'انقلبت المركبة', quit: 'انتهت الجولة' }[run.reason] || 'انتهت الجولة';
  $('oTitle').textContent = T; $('oDist').textContent = fmt(r.dist); $('oRecord').hidden = !rec;
  const B = run.bonus, L = [['العملات المجمّعة', run.picked], ['مكافأة القفزات', B.air], ['مكافأة الشقلبات', B.flip], ['مكافأة المسافة', B.dist], ['اكتشاف عوالم', B.zone]];
  $('oLines').innerHTML = L.filter(x => x[1] > 0 || x[0] === 'العملات المجمّعة').map(([k, v]) => `<div><span>${k}</span><b>${fmt(v)} <b class="ic coin"></b></b></div>`).join('') +
    `<div class="tot"><span>المجموع</span><b>${fmt(run.coins)} <b class="ic coin"></b>${run.dia + run.diaBonus ? ` · ${run.dia + run.diaBonus} <b class="ic gem"></b>` : ''}</b></div>`;
  $('oUnlocks').innerHTML = unl.map(u => `<div>${u}</div>`).join('');
  $('hud').hidden = true; showScreen('sOver'); state = 'over';
}
function checkAch() { const out = []; for (const a of SV.ACHIEVEMENTS) if (!S.ach[a.id] && a.test(S)) { S.ach[a.id] = 1; S.dia += a.dia; out.push(`🏆 إنجاز: ${a.ar} (+${a.dia} ماس)`); banner(`🏆 ${a.ar}`); A.achieve(); } return out; }

// ============================================================
// per-frame game logic
// ============================================================
function tickRun(dt) {
  const car = run.car, T = run.T;
  if (!run.over) { car.gas = input.gas; car.brake = input.brake; car.boostOn = input.boost; if (input.boost && car.boost > 0) run.usedBoost = true; }
  else { car.gas = 0; car.brake = 0.3; car.boostOn = false; }
  // fixed-step physics
  run.acc = (run.acc || 0) + dt * slowmo; let n = 0;
  while (run.acc >= DT && n < 40) { car.step(DT); run.acc -= DT; n++; }
  run.t += dt; run.dist = Math.max(0, car.maxX - run.startX);
  // events
  for (const e of car.events) {
    if (e.t === 'land') {
      if (e.air > run.maxAir) run.maxAir = e.air;
      if (!run.over) {
        const fl = Math.floor((Math.abs(e.rot) + 0.7) / (Math.PI * 2));
        if (fl > 0) { const b = 500 * fl * fl; run.flips += fl; run.bonus.flip += b; run.coins += b; toast((e.rot > 0 ? 'شقلبة خلفية' : 'شقلبة أمامية') + (fl > 1 ? ' ×' + fl : '') + ' +' + fmt(b)); A.bonus(); }
        if (e.air > 1.0) { const b = Math.round(e.air * e.air * 60 / 5) * 5; run.bonus.air += b; run.coins += b; toast('قفزة ' + e.air.toFixed(1) + 'ث +' + b, 'c'); }
      }
      if (e.v > 4) { A.land(e.v); if (S.settings.shake) R.shake = Math.max(R.shake, Math.min(1, e.v / 16)); car.wheels.forEach(W => fx.dust(W.cpx, W.cpy, 1.4, -1, dustColor(W.cpx), Math.min(14, e.v | 0))); }
    } else if (e.t === 'crash') endRun('crash');
    else if (e.t === 'thud') A.thud(e.v);
    else if (e.t === 'recover') A.recover();
  }
  car.events.length = 0;
  if (!run.over) {
    // pickups
    for (const p of R.pickups) {
      if (p.got || p.x < car.x - 4 || p.x > car.x + 4) continue;
      const hit = Math.hypot(p.x - car.x, p.y - car.y) < 1.9 || car.wheels.some(W => Math.hypot(p.x - W.cx, p.y - W.cy) < car.p.wheelR + 0.6);
      if (!hit) continue; p.got = true; R.hidePickup(p);
      if (p.k === 'coin') { run.coins += p.v; run.picked += p.v; A.coin(p.v); fx.burst(p.x, p.y, 0xffd84a, 8, 4); if (p.v >= 100) toast('+' + p.v, 'c'); }
      else if (p.k === 'fuel') { car.fuel = car.p.fuel; run.fuel++; A.fuel(); fx.burst(p.x, p.y, 0xff5a4a, 14, 5); toast('⛽ وقود!', 'r'); run.lowWarned = false; }
      else if (p.k === 'dia') { run.dia++; A.diamond(); fx.burst(p.x, p.y, 0x5ee7ff, 18, 6); if (p.secret) { run.secrets++; toast('💎 مخبأ سري!', 'g'); } else toast('💎 +1', 'g'); }
    }
    // zones / world discovery
    const zi = T.zoneOf(car.x); if (zi !== run.curZone) { run.curZone = zi; if (!run.zones.has(zi)) { run.zones.add(zi); run.zoneCount = run.zones.size; const wid = T.worldAtZone(zi); $('hZone').textContent = WORLDS[wid].ar; toast('🌍 ' + WORLDS[wid].ar, 'c');
      if (!S.discovered.includes(wid)) { S.discovered.push(wid); if (!S.worlds.includes(wid)) S.worlds.push(wid); run.bonus.zone += 2000; run.coins += 2000; run.diaBonus += 5; banner('🌍 عالم جديد مكتشف: ' + WORLDS[wid].ar + ' (+2000 +5 ماس)'); A.achieve(); persist(); } } }
    // distance milestones
    const ms = Math.floor(run.dist / 250); if (ms > run.milestone) { run.milestone = ms; const b = 50 * ms; run.bonus.dist += b; run.coins += b; toast(fmt(ms * 250) + ' م  +' + b, 'c'); A.bonus(); }
    // fuel
    if (car.fuel / car.p.fuel < 0.22 && !run.lowWarned) { run.lowWarned = true; A.fuelLow(); }
    if (car.fuel <= 0) { run.emptyT += dt; if ((car.speed < 0.4 && run.emptyT > 1.2) || run.emptyT > 9) endRun('fuel'); } else run.emptyT = 0;
    if (car.upsideDown() && car.speed < 1.5) { run.upsideT += dt; if (run.upsideT > 3.5) endRun('flip'); } else run.upsideT = 0;
  } else { run.overT += dt; if (run.overT > 0.9) slowmo = Math.min(1, slowmo + dt); if (run.overT > 2.0) finishRun(); }
  // ---------- visuals ----------
  syncCar(cv, car);
  const skid = Math.max(...car.wheels.map(W => W.contact ? W.slip : 0));
  car.wheels.forEach(W => { if (W.contact && (W.slip > 0.25 || (Math.abs(car.vx) > 6 && Math.random() < 0.25))) fx.dust(W.cpx, W.cpy, 1.3, Math.sign(W.spin || 1), dustColor(W.cpx), W.slip > 0.4 ? 2 : 1); });
  const c = Math.cos(car.a), s = Math.sin(car.a), ex = cv.exhaust; const exX = car.x + ex[0] * c - ex[1] * s, exY = car.y + ex[0] * s + ex[1] * c;
  const boosting = car.boostOn && car.boost > 0 && car.fuel > 0;
  if (Math.random() < 0.12 + car.gas * 0.3) fx.emit(exX + (Math.random() - .5) * .2, exY, ex[2], -c * 1.2 + (Math.random() - .5) * 1.5, 0.8 + Math.random() * .8, (Math.random() - .5) * .8, 0.9 + Math.random() * .5, 0.35 + Math.random() * .25, boosting ? 0xffb347 : 0xc9ccd1, 0.9, 2.2);
  fx.setFlame(boosting, exX, exY, car.a, tNow); if (boosting && Math.random() < .8) fx.emit(exX, exY, ex[2], -c * 6, -s * 6 + .5, 0, .35, .25, 0xffc34a, 1, -0.4);
  if (boosting && !run.wasBoost) A.boostStart(); run.wasBoost = boosting;
  A.engine(car.rpm, car.gas, boosting, skid, car.fuel > 0 && !run.over);
  fx.update(dt);
  followCamera(car, dt);
  R.ensureChunks(car.x); R.animatePickups(tNow, car.x - 30, car.x + 70); R.updateEnv(R.camera.position.x, car.y, dt);
  updateHUD();
}
function dustColor(x) { const s = run ? run.T.surface(x) : null; const id = s ? WORLDS[s.world].id : 'hills'; return s && s.type === 'ice' ? 0xe6f6ff : { hills: 0x9b7448, desert: 0xe7c27c, snow: 0xf4f8ff, canyon: 0xc07a4e, forest: 0x7a5a3a, indus: 0x8d8d8d, future: 0x7fe9ff }[id]; }

// ============================================================
// camera: smooth follow, look-ahead, speed zoom/FOV, jump framing, shake
// ============================================================
const camT = new THREE.Vector3(), look = new THREE.Vector3();
function followCamera(car, dt) {
  const sp = Math.max(0, car.vx), port = innerWidth / innerHeight < 1.2;
  const lead = THREE.MathUtils.clamp(car.vx * 0.32, -2, 7.5);
  const ahead = (car.T.height(car.x + 14) - car.y) * 0.25;
  let dist = (port ? 23 : 17) + Math.min(7, sp * 0.18) + (car.grounded ? 0 : Math.min(4, car.airTime * 2.5));
  let tx = car.x + (port ? lead * 0.45 + 1.2 : lead + 3.5), ty = car.y + 1.6 + ahead + (port ? 2 : 0);
  if (run && run.intro > 0) { const k = run.intro / 1.8; run.intro -= dt; const e = k * k; dist = dist * (1 - e) + 7 * e; tx = tx * (1 - e) + (car.x - 3) * e; ty = ty * (1 - e) + (car.y + 0.6) * e; }
  if (run && run.over) { dist *= Math.max(0.55, 1 - run.overT * 0.2); tx = car.x; ty = car.y + 1; }
  camT.set(tx, ty + dist * 0.12, dist);
  const k = 1 - Math.exp(-dt * (run && run.intro > 0 ? 3 : 5));
  R.camPos.lerp(camT, k); look.set(tx, ty, 0);
  R.camLook.lerp(look, 1 - Math.exp(-dt * 7));
  const sh = R.shake; R.shake = Math.max(0, R.shake - dt * 2.2);
  R.camera.position.copy(R.camPos).add(tv.set((Math.random() - .5) * sh * .6, (Math.random() - .5) * sh * .6, 0));
  R.camera.lookAt(R.camLook);
  const boosting = car.boostOn && car.boost > 0; const fov = R.fovBase + Math.min(8, sp * 0.18) + (boosting ? 5 : 0);
  if (Math.abs(R.camera.fov - fov) > 0.05) { R.camera.fov += (fov - R.camera.fov) * (1 - Math.exp(-dt * 3)); R.camera.updateProjectionMatrix(); }
  R.sun.position.set(car.x - 30, car.y + 60, 40); R.sun.target.position.set(car.x + 4, car.y, 0);
}

// ============================================================
// menu showcase scene (selected world + vehicle, idling)
// ============================================================
function setDemo() {
  removeCarVisual(cv); cv = null; removeCarVisual(demo?.cv);
  const v = VEHICLES.find(x => x.id === S.sel), T = new Terrain(S.selWorld); R.setTerrain(T, 1); fx.parts.length = 0; fx.setFlame(false);
  const car = new Vehicle(tuned(v, S.lv[v.id]), T, 34); for (let i = 0; i < 600; i++) car.step(DT);
  demo = { car, cv: makeCarVisual(v), t: 0 }; R.ensureChunks(car.x);
}
function tickDemo(dt) {
  const d = demo, car = d.car; d.t += dt; for (let i = 0; i < 4; i++) car.step(DT); syncCar(d.cv, car);
  const port = innerWidth / innerHeight < 1.2;
  R.camera.position.set(car.x + 2 + Math.sin(d.t * 0.15) * 5, car.y + 2.6 + Math.sin(d.t * 0.1), (port ? 16 : 11) + Math.cos(d.t * 0.15) * 2);
  R.camera.lookAt(car.x + (port ? 0 : 3.5), car.y + 0.8, 0); if (R.camera.fov !== R.fovBase) { R.camera.fov = R.fovBase; R.camera.updateProjectionMatrix(); }
  R.sun.position.set(car.x - 30, car.y + 60, 40); R.sun.target.position.set(car.x, car.y, 0);
  R.ensureChunks(car.x); R.animatePickups(tNow, car.x - 30, car.x + 70); R.updateEnv(car.x, car.y, dt); fx.update(dt);
  if (Math.random() < 0.3) { const c = Math.cos(car.a), s = Math.sin(car.a), ex = d.cv.exhaust; fx.emit(car.x + ex[0] * c - ex[1] * s, car.y + ex[0] * s + ex[1] * c, ex[2], -1, .6, 0, .8, .15, 0xaaaaaa, .5, 1.2); }
}

// ============================================================
// garage scene (separate 3D scene with orbit camera + turntable)
// ============================================================
const GR = { scene: null, cam: null, model: null, yaw: -0.6, pitch: 0.22, dist: 9, drag: null, view: S.sel, auto: true };
function buildGarage() {
  const sc = GR.scene = new THREE.Scene(); sc.background = new THREE.Color(0x111c2b); sc.fog = new THREE.Fog(0x111c2b, 18, 50); sc.environment = R.scene.environment; sc.environmentIntensity = 0.45;
  GR.cam = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, .1, 200);
  sc.add(new THREE.HemisphereLight(0xbfd8ff, 0x2a2016, 1.2));
  const key = new THREE.SpotLight(0xffffff, 280, 40, .55, .5); key.position.set(6, 10, 7); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); sc.add(key); key.target.position.set(0, 0, 0); sc.add(key.target);
  const rim = new THREE.SpotLight(0xff9a3c, 160, 40, .6, .6); rim.position.set(-7, 6, -6); sc.add(rim); rim.target.position.set(0, 0, 0); sc.add(rim.target);
  const floor = new THREE.Mesh(new THREE.CircleGeometry(30, 48), new THREE.MeshStandardMaterial({ color: 0x1b2638, roughness: .85 })); floor.rotation.x = -Math.PI / 2; floor.position.y = -0.01; floor.receiveShadow = true; sc.add(floor);
  const plat = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.8, 0.25, 48), new THREE.MeshStandardMaterial({ color: 0x2b3a52, metalness: .5, roughness: .4 })); plat.position.y = 0.12; plat.receiveShadow = true; sc.add(plat); GR.plat = plat;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(3.7, 0.05, 8, 64), new THREE.MeshBasicMaterial({ color: 0xff7a1a })); ring.rotation.x = Math.PI / 2; ring.position.y = 0.25; sc.add(ring);
  // back wall stripes + tool shelves for depth
  for (let i = 0; i < 9; i++) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.3, 8, 0.3), mat(0x2a3446)); const a = -Math.PI * 0.9 + i * Math.PI * 0.225; p.position.set(Math.cos(a) * 16, 4, Math.sin(a) * 16 - 2); sc.add(p); const l = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.12, 0.12), new THREE.MeshBasicMaterial({ color: 0xffd8a0 })); l.position.set(p.position.x, 7.5, p.position.z); sc.add(l); }
  const tyreStack = new THREE.Group(); for (let i = 0; i < 4; i++) { const t = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.22, 10, 24), mat(0x16171a, { roughness: .9 })); t.rotation.x = Math.PI / 2; t.position.y = 0.22 + i * 0.42; tyreStack.add(t); } tyreStack.position.set(-6, 0, -4); sc.add(tyreStack);
  const box = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.2, 1), mat(0xc0392b)); box.position.set(6, 0.6, -5); sc.add(box);
}
function garageModel(id) {
  if (GR.model) removeCarVisual(GR.model);
  const v = VEHICLES.find(x => x.id === id); const m = makeCarVisual(v, GR.scene); GR.model = m;
  // static pose on the platform: fake chassis for wheels/legs
  const y0 = 0.25 + v.wheelR + v.susp * 0.7 - v.rear[1];
  GR.fake = { x: 0, y: y0, a: 0, vx: 0, w: 0, grounded: true, airTime: 0, T: { height: () => 0.25, slope: () => 0 }, wheels: [v.rear, v.front].map((mm, i) => ({ m: mm, cx: mm[0], cy: y0 + mm[1] - v.susp * 0.7, ang: i, contact: true })) };
  m.root.traverse(o => { if (o.isMesh) o.castShadow = true; });
}
function tickGarage(dt) {
  if (GR.auto && !GR.drag) GR.yaw += dt * 0.25;
  const g = GR.fake; g.wheels.forEach(W => W.ang += dt * 0.3); syncCar(GR.model, g);
  // rotate whole model with turntable: apply to root+wheels by rotating camera instead
  const port = innerWidth / innerHeight < 1.1; const d = GR.dist * (port ? 1.5 : 1);
  GR.cam.position.set(Math.sin(GR.yaw) * d * Math.cos(GR.pitch), 1.2 + Math.sin(GR.pitch) * d, Math.cos(GR.yaw) * d * Math.cos(GR.pitch));
  // keep the car framed in the free part of the screen (panel is on the left)
  const off = port ? 0 : 2.2; GR.cam.lookAt(-off * Math.cos(GR.yaw), port ? 2.6 : 1.0, off * Math.sin(GR.yaw));
  GR.cam.aspect = innerWidth / innerHeight; GR.cam.updateProjectionMatrix();
}
$('gl').addEventListener('pointerdown', e => { if (state !== 'garage') return; GR.drag = { x: e.clientX, y: e.clientY }; GR.auto = false; });
addEventListener('pointermove', e => { if (!GR.drag) return; GR.yaw -= (e.clientX - GR.drag.x) * 0.008; GR.pitch = THREE.MathUtils.clamp(GR.pitch + (e.clientY - GR.drag.y) * 0.005, 0.02, 1.0); GR.drag = { x: e.clientX, y: e.clientY }; });
addEventListener('pointerup', () => GR.drag = null);
$('gl').addEventListener('wheel', e => { if (state === 'garage') GR.dist = THREE.MathUtils.clamp(GR.dist + e.deltaY * 0.01, 6, 15); }, { passive: true });

// ============================================================
// screens & UI
// ============================================================
function showScreen(id) { document.querySelectorAll('.screen').forEach(s => s.classList.toggle('show', s.id === id)); }
function wallet() { document.querySelectorAll('[data-coins]').forEach(e => e.textContent = fmt(S.coins)); document.querySelectorAll('[data-dia]').forEach(e => e.textContent = fmt(S.dia)); }
function goMenu() {
  if (run) { A.stopEngine(); run = null; } $('hud').hidden = true;
  if (!demo || demo.vid !== S.sel || demo.wid !== S.selWorld) { if (/\/offroad\//.test(location.pathname)) $('bHome').hidden = false;
setDemo(); demo.vid = S.sel; demo.wid = S.selWorld; }
  state = 'menu'; showScreen('sMenu'); wallet(); refreshMenu(); A.startMusic();
}
function refreshMenu() {
  const v = VEHICLES.find(x => x.id === S.sel); $('mVeh').textContent = v.ar; $('mWorld').textContent = WORLDS[S.selWorld].ar; $('mBest').textContent = fmt(S.best[S.selWorld] || 0) + ' م';
  const day = SV.today(); if (S.daily.date !== day) { S.daily = { date: day, done: false }; persist(); }
  const D = SV.dailyFor(day); $('dailyCard').className = 'card daily' + (S.daily.done ? ' done' : '');
  $('dailyCard').innerHTML = `<span class="tag">تحدّي اليوم</span><p>${D.text}</p><span class="rw">${S.daily.done ? '✅ مكتمل' : `+${fmt(D.rew[0])} <b class="ic coin"></b> +${D.rew[1]} <b class="ic gem"></b>`}</span>`;
  $('chDot').hidden = S.chIdx >= SV.CHALLENGES.length;
}
function go(where) {
  A.init(); A.click();
  if (run && (state === 'play' || state === 'pause')) { A.stopEngine(); run = null; $('hud').hidden = true; input.gas = input.brake = 0; input.boost = false; }
  if (where === 'menu') return goMenu();
  if (where === 'garage') { if (!GR.scene) buildGarage(); GR.view = S.sel; garageModel(GR.view); state = 'garage'; showScreen('sGarage'); renderGarage(); wallet(); return; }
  if (where === 'worlds') { state = 'menu'; showScreen('sWorlds'); renderWorlds(); wallet(); return; }
  if (where === 'chal') { state = 'menu'; showScreen('sChal'); renderChal(); wallet(); return; }
  if (where === 'ach') { state = 'menu'; showScreen('sAch'); renderAch(); wallet(); return; }
  if (where === 'set') { state = 'menu'; showScreen('sSet'); renderSet(); return; }
}
document.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => go(b.dataset.go)));

// ---------- garage UI ----------
function renderGarage() {
  const vid = GR.view, v = VEHICLES.find(x => x.id === vid), owned = S.owned.includes(vid), lv = S.lv[vid];
  $('vehList').innerHTML = VEHICLES.map(x => `<div class="veh ${x.id === vid ? 'sel' : ''}" data-v="${x.id}"><div class="sw" style="background:#${x.color.toString(16).padStart(6, '0')}"></div><b>${x.ar}</b><small class="${S.owned.includes(x.id) ? 'own' : ''}">${S.sel === x.id ? '✔ مختارة' : S.owned.includes(x.id) ? 'مملوكة' : fmt(x.price) + ' 🪙' + (x.dia ? ' + ' + x.dia + ' 💎' : '')}</small></div>`).join('');
  $('vehList').querySelectorAll('.veh').forEach(e => e.onclick = () => { A.click(); GR.view = e.dataset.v; garageModel(GR.view); renderGarage(); });
  $('gName').textContent = v.ar + ' · ' + v.en; $('gDesc').textContent = v.desc;
  const sb = statBars(v, lv), names = { speed: 'السرعة', power: 'القوة', grip: 'التماسك', fuel: 'الوقود', boost: 'التعزيز' };
  $('gStats').innerHTML = Object.keys(sb).map(k => `<span>${names[k]}</span><div class="sb"><i style="width:${Math.round(sb[k] * 100)}%"></i></div>`).join('');
  const act = $('gAction');
  if (owned) act.innerHTML = S.sel === vid ? '<button class="btn green" disabled>✔ المركبة المختارة</button>' : '<button class="btn go" id="gSel">اختر هذه المركبة</button>';
  else { const can = S.coins >= v.price && S.dia >= v.dia; act.innerHTML = `<button class="btn gold" id="gBuy" ${can ? '' : 'disabled'}>شراء ${fmt(v.price)} 🪙${v.dia ? ' + ' + v.dia + ' 💎' : ''}</button>${can ? '' : ' <small style="color:var(--muted);font-weight:700">رصيدك لا يكفي</small>'}`; }
  if ($('gSel')) $('gSel').onclick = () => { S.sel = vid; persist(); A.buy(); renderGarage(); };
  if ($('gBuy')) $('gBuy').onclick = () => { if (S.coins < v.price || S.dia < v.dia) return; S.coins -= v.price; S.dia -= v.dia; S.owned.push(vid); S.sel = vid; checkAch(); persist(); A.buy(); banner('🚗 حصلت على ' + v.ar + '!'); wallet(); renderGarage(); };
  $('upList').innerHTML = UPGRADES.map(u => { const l = lv[u.id], max = l >= MAX_LVL, cost = upgradeCost(v, u.id, l); return `<div class="up"><div class="t"><span>${u.icon}</span>${u.ar}</div><div class="pips">${Array.from({ length: MAX_LVL }, (_, i) => `<i class="${i < l ? 'on' : ''}"></i>`).join('')}</div><small>${u.desc}</small><button class="btn sm ${max ? '' : 'gold'}" data-up="${u.id}" ${(!owned || max || S.coins < cost) ? 'disabled' : ''}>${max ? 'الحد الأقصى' : !owned ? 'اشترِ المركبة أولاً' : 'تطوير ' + fmt(cost) + ' 🪙'}</button></div>`; }).join('');
  $('upList').querySelectorAll('[data-up]').forEach(b => b.onclick = () => { const k = b.dataset.up, l = lv[k], cost = upgradeCost(v, k, l); if (!owned || l >= MAX_LVL || S.coins < cost) return; S.coins -= cost; lv[k]++; checkAch(); persist(); A.buy(); wallet(); renderGarage(); });
}
// ---------- worlds UI ----------
function renderWorlds() {
  $('worldList').innerHTML = WORLDS.map((w, i) => { const open = S.worlds.includes(i), hx = c => '#' + c.toString(16).padStart(6, '0');
    return `<div class="world ${S.selWorld === i ? 'sel' : ''}" data-w="${i}" style="background:linear-gradient(180deg,${hx(w.sky[0])},${hx(w.sky[1])})"><div class="ghill" style="background:linear-gradient(180deg,${hx(w.top)},${hx(w.side)})"></div><h4>${w.ar}</h4><p>${w.en} · الأفضل: ${fmt(S.best[i] || 0)} م${w.grav < 1 ? ' · جاذبية منخفضة' : ''}${w.mu < .7 ? ' · سطح زلق' : ''}</p>${open ? (S.selWorld === i ? '<button class="btn go sm" data-play>▶ انطلق هنا</button>' : '') : `<div class="lock">🔒<span>افتح بـ ${fmt(w.unlock)} 🪙</span><button class="btn gold sm" data-buy="${i}" ${S.coins >= w.unlock ? '' : 'disabled'}>فتح العالم</button><small>أو اكتشفه أثناء القيادة</small></div>`}</div>`; }).join('');
  $('worldList').querySelectorAll('.world').forEach(e => e.onclick = ev => { const i = +e.dataset.w; if (ev.target.closest('[data-buy]')) { const w = WORLDS[i]; if (S.coins >= w.unlock) { S.coins -= w.unlock; S.worlds.push(i); S.selWorld = i; persist(); A.buy(); wallet(); renderWorlds(); } return; } if (ev.target.closest('[data-play]')) return startRun(i); if (S.worlds.includes(i)) { A.click(); S.selWorld = i; persist(); renderWorlds(); } });
}
// ---------- challenges / achievements ----------
function renderChal() {
  const D = SV.dailyFor(SV.today());
  $('chalList').innerHTML = `<div class="item ${S.daily.done ? 'done' : 'cur'}"><div class="num">📅</div><p>${D.text}<small>التحدي اليومي — يتجدد كل يوم</small></p><span class="rw">${S.daily.done ? '✅' : `+${fmt(D.rew[0])} <b class="ic coin"></b> +${D.rew[1]} <b class="ic gem"></b>`}</span></div>` +
    SV.CHALLENGES.map((c, i) => { const done = !!S.ch[c.id], cur = i === S.chIdx; return `<div class="item ${done ? 'done' : cur ? 'cur' : 'lock'}"><div class="num">${done ? '✓' : i + 1}</div><p>${c.ar}<small>${done ? 'مكتمل' : cur ? 'المرحلة الحالية' : 'مقفل — أكمل المرحلة السابقة'}</small></p><span class="rw">+${fmt(c.rew[0])} <b class="ic coin"></b>${c.rew[1] ? ' +' + c.rew[1] + ' <b class="ic gem"></b>' : ''}</span></div>`; }).join('');
}
const ACH_ICON = { first: '🚩', flip1: '🤸', flip25: '🌀', air3: '🦅', d1k: '🛣️', d3k: '👑', tot20k: '📏', coins50k: '💰', fuel50: '⛽', car2: '🚙', car6: '🏎️', max: '🔧', worlds: '🌍', secret: '💎' };
function renderAch() { $('achList').innerHTML = SV.ACHIEVEMENTS.map(a => `<div class="item ach ${S.ach[a.id] ? 'done' : ''}"><span class="ico">${ACH_ICON[a.id] || '🏆'}</span><p>${a.ar}<small>${a.d}</small></p><span class="rw">${S.ach[a.id] ? '✅' : '+' + a.dia + ' <b class="ic gem"></b>'}</span></div>`).join(''); }
// ---------- settings ----------
function renderSet() { $('setSfx').value = S.settings.sfx; $('setMus').value = S.settings.mus; $('setQ').value = S.settings.quality; $('setShake').checked = S.settings.shake; $('resetConfirm').hidden = true; $('bReset').hidden = false; }
$('setSfx').oninput = e => { S.settings.sfx = +e.target.value; A.setVolumes(S.settings.sfx, S.settings.mus); persist(); };
$('setMus').oninput = e => { S.settings.mus = +e.target.value; A.setVolumes(S.settings.sfx, S.settings.mus); persist(); };
$('setQ').onchange = e => { S.settings.quality = e.target.value; R.setQuality(qual()); persist(); };
$('setShake').onchange = e => { S.settings.shake = e.target.checked; persist(); };
$('bReset').onclick = () => { $('bReset').hidden = true; $('resetConfirm').hidden = false; };
$('bResetNo').onclick = () => { $('bReset').hidden = false; $('resetConfirm').hidden = true; };
$('bResetYes').onclick = () => { S = SV.reset(); persist(); demo = null; banner('تم مسح التقدّم'); goMenu(); };

// ---------- play / pause / results buttons ----------
$('bStart').onclick = () => { A.init(); A.setVolumes(S.settings.sfx, S.settings.mus); A.click(); goMenu(); };
$('bPlay').onclick = () => startRun(S.selWorld);
const pause = () => { if (state !== 'play' || run.over) return; state = 'pause'; showScreen('sPause'); A.engine(0, 0, false, 0, false); };
const resume = () => { if (state !== 'pause') return; state = 'play'; showScreen(null); };
$('bPause').addEventListener('click', pause); $('bResume').onclick = resume;
$('bRestart').onclick = () => { A.stopEngine(); startRun(run.startWorld); };
$('bQuit').onclick = () => { if (run) { run.reason = 'quit'; finishRun(); } };
$('bAgain').onclick = () => startRun(run ? run.startWorld : S.selWorld);
$('bOGarage').onclick = () => go('garage'); $('bOMenu').onclick = () => go('menu');

// ============================================================
// input: touch pedals (multi-touch via pointer events) + keyboard
// ============================================================
function hold(el, on, off) {
  el.addEventListener('pointerdown', e => { e.preventDefault(); try { el.setPointerCapture(e.pointerId); } catch (x) { } on(); });
  const end = e => { e.preventDefault(); off(); }; el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end); el.addEventListener('lostpointercapture', end);
  el.addEventListener('contextmenu', e => e.preventDefault());
}
hold($('pGas'), () => input.gas = 1, () => input.gas = 0);
hold($('pBrake'), () => input.brake = 1, () => input.brake = 0);
hold($('bBoost'), () => input.boost = true, () => input.boost = false);
$('bRecover').addEventListener('pointerdown', e => { e.preventDefault(); if (run && !run.over) run.car.recover(); });
const keys = {};
addEventListener('keydown', e => {
  if (e.repeat && keys[e.code]) return; keys[e.code] = true;
  if (state === 'play') { if (['ArrowRight', 'KeyD'].includes(e.code)) input.gas = 1; if (['ArrowLeft', 'KeyA'].includes(e.code)) input.brake = 1; if (e.code === 'Space') { input.boost = true; e.preventDefault(); } if (e.code === 'KeyR' && run && !run.over) run.car.recover(); if (['KeyP', 'Escape'].includes(e.code)) pause(); }
  else if (state === 'pause' && ['KeyP', 'Escape'].includes(e.code)) resume();
  else if (state === 'splash' && (e.code === 'Enter' || e.code === 'Space')) $('bStart').click();
  else if (state === 'over' && e.code === 'Enter') $('bAgain').click();
});
addEventListener('keyup', e => { keys[e.code] = false; if (['ArrowRight', 'KeyD'].includes(e.code)) input.gas = 0; if (['ArrowLeft', 'KeyA'].includes(e.code)) input.brake = 0; if (e.code === 'Space') input.boost = false; });
addEventListener('blur', () => { input.gas = input.brake = 0; input.boost = false; if (state === 'play') pause(); });
document.addEventListener('visibilitychange', () => { if (document.hidden && state === 'play') pause(); });
addEventListener('resize', () => { R.resize(); fx.resize(innerHeight); });

// ============================================================
// main loop
// ============================================================
let last = performance.now();
function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, (now - last) / 1000); last = now; tNow += dt;
  if (state === 'play' && run) tickRun(dt);
  else if (state === 'pause' || state === 'over') { /* frozen world */ }
  else if (state === 'garage') { tickGarage(dt); R.renderer.render(GR.scene, GR.cam); return; }
  else if (demo) tickDemo(dt);
  R.render();
  // automatic quality fallback on slow devices
  if (state === 'play' && S.settings.quality === 'auto' && !autoChecked) { fpsAcc[0] += dt; fpsAcc[1]++; if (fpsAcc[0] > 5) { autoChecked = true; const fps = fpsAcc[1] / fpsAcc[0]; if (fps < 38 && R.quality !== 'low') { R.setQuality('low'); } } }
}
if (/\/offroad\//.test(location.pathname)) $('bHome').hidden = false;
setDemo(); demo.vid = S.sel; demo.wid = S.selWorld;
$('loading').hidden = true; requestAnimationFrame(frame);

// ============================================================
// test / debug API (used by automated browser tests)
// ============================================================
window.OL = {
  get state() { return state; }, get run() { return run; }, get save() { return S; }, R, input, A,
  start: (w = 0, vid) => { if (vid) { if (!S.owned.includes(vid)) S.owned.push(vid); S.sel = vid; } A.init(); startRun(w); },
  menu: () => goMenu(), go, pause, resume, end: r => endRun(r || 'crash'), reload: () => { S = SV.load(); return S; },
  setCoins: n => { S.coins = n; persist(); wallet(); },
  // fast headless simulation for tests: advance the running game without rendering
  sim: (sec, ctl) => { for (let t = 0; t < sec && state === 'play'; t += 1 / 60) { if (ctl) ctl(run, input); tickRun(1 / 60); } return run && { dist: run.dist, coins: run.coins, over: run.over, reason: run.reason, fuel: run.car.fuel, flips: run.flips, dia: run.dia, state }; },
  info: () => R.renderer.info.render,
};
