// ============================================================
// OFFROAD LEGENDS — terrain.js
// Procedural, deterministic terrain for 7 worlds that flow into
// each other inside a single run. Pure logic (no rendering) so the
// physics and the renderer read exactly the same ground.
// ============================================================

export const ZONE_LEN = 1100;      // metres per world zone inside a run
export const BLEND = 90;           // metres of smooth blending between zones
export const STEP = 0.25;          // sample spacing (m)
const CHUNK = 128;                 // metres per cached sample chunk

export const WORLDS = [
  { id: 'hills',  ar: 'التلال الخضراء',  en: 'Green Hills',      mu: 1.00, grav: 1.00, unlock: 0,
    sky: [0x7ec8f5, 0xd8f1ff], fog: 0xcfe9fb, top: 0x58c23a, dirt: 0x8a5a33, side: 0x6e4527, far: 0x7fb069, mid: 0x4f9d3a, sun: 0xfff1d0 },
  { id: 'desert', ar: 'مغامرة الصحراء', en: 'Desert Adventure', mu: 0.82, grav: 1.00, unlock: 6000,
    sky: [0x5fb0e8, 0xffe3b0], fog: 0xf6dcae, top: 0xf2c46d, dirt: 0xd9a24e, side: 0xb87a34, far: 0xe7b679, mid: 0xd89a52, sun: 0xffe0a8 },
  { id: 'snow',   ar: 'الجبال الثلجية',  en: 'Snow Mountains',   mu: 0.62, grav: 1.00, unlock: 18000,
    sky: [0x8fb8de, 0xeef6ff], fog: 0xe3eefa, top: 0xf4f8ff, dirt: 0x9fb3c8, side: 0x7d93ab, far: 0xc9d9ea, mid: 0xaec6de, sun: 0xffffff },
  { id: 'canyon', ar: 'الوادي الصخري',   en: 'Rocky Canyon',     mu: 1.02, grav: 1.00, unlock: 35000,
    sky: [0xf08a4b, 0xffd6a0], fog: 0xf3b98a, top: 0xc8673a, dirt: 0xa24f2b, side: 0x7e3a1f, far: 0xd0784a, mid: 0xb45a34, sun: 0xffc48a },
  { id: 'forest', ar: 'مغامرة الغابة',   en: 'Forest Adventure', mu: 0.95, grav: 1.00, unlock: 60000,
    sky: [0x6fb7c9, 0xd7f0e6], fog: 0xbfe0d2, top: 0x3e9c4b, dirt: 0x5e3d24, side: 0x47301d, far: 0x3f7f54, mid: 0x2f6b3f, sun: 0xf3ffd9 },
  { id: 'indus',  ar: 'المنطقة الصناعية', en: 'Industrial Zone', mu: 1.05, grav: 1.00, unlock: 100000,
    sky: [0x7d8aa0, 0xd9d2c4], fog: 0xbfb8ad, top: 0x7c8590, dirt: 0x5b6169, side: 0x434850, far: 0x8e8a86, mid: 0x6f6b68, sun: 0xffe6c4 },
  { id: 'future', ar: 'عالم المستقبل',   en: 'Future World',     mu: 0.92, grav: 0.78, unlock: 180000,
    sky: [0x1a1050, 0x6a3fd1], fog: 0x3b2b88, top: 0x22e3ff, dirt: 0x2b2f6e, side: 0x1b1d4a, far: 0x5b3fc4, mid: 0x3a2a9a, sun: 0xd6c8ff },
];

// ---------- deterministic noise ----------
function hash(i, s) { let x = (i * 374761393 + s * 668265263) | 0; x = (x ^ (x >>> 13)) * 1274126177 | 0; return ((x ^ (x >>> 16)) >>> 0) / 4294967295; }
function vnoise(x, s) { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return hash(i, s) * (1 - u) + hash(i + 1, s) * u; }
function fbm(x, s, oct) { let a = 0, amp = 1, f = 1, n = 0; for (let o = 0; o < oct; o++) { a += (vnoise(x * f, s + o * 17) * 2 - 1) * amp; n += amp; amp *= .5; f *= 2.03; } return a / n; }
export function rng(seed) { let t = seed >>> 0; return function () { t += 0x6D2B79F5; let r = Math.imul(t ^ (t >>> 15), 1 | t); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296; }; }
const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// ---------- features per world (ramps, bridges, ice, steps ...) ----------
// Each feature: {type, x0, x1, ...}. Generated once per zone index.
function zoneFeatures(zi, wid) {
  const R = rng(9137 + zi * 7919 + wid * 104729), f = [];
  const z0 = zi * ZONE_LEN + (zi === 0 ? 70 : BLEND + 30), z1 = (zi + 1) * ZONE_LEN - BLEND - 30;
  const diff = Math.min(1, zi * 0.18 + 0.25);
  let x = z0 + 60 + R() * 60;
  while (x < z1 - 60) {
    const r = R();
    if (wid === 4 && r < .32) { const L = 26 + R() * 18; f.push({ t: 'bridge', x0: x, x1: x + L, dip: 7 + R() * 5 }); x += L + 90 + R() * 120; continue; }
    if (wid === 2 && r < .3) { const L = 18 + R() * 30; f.push({ t: 'ice', x0: x, x1: x + L }); x += L + 70 + R() * 90; continue; }
    if (wid === 3 && r < .28) { const L = 12 + R() * 6 * diff + 6; f.push({ t: 'pit', x0: x, x1: x + L, d: 3 + R() * 3 }); x += L + 120 + R() * 110; continue; }
    if (wid === 5 && r < .35) { f.push({ t: 'pipe', x0: x, x1: x + 3.2, h: 0.6 + R() * .5 }); x += 40 + R() * 60; continue; }
    if (r < .55 + diff * .2) { const L = 9 + R() * 7, H = 1.6 + R() * (1.6 + diff * 1.6); f.push({ t: 'ramp', x0: x, x1: x + L, h: H }); x += L + 80 + R() * 140; continue; }
    x += 60 + R() * 100;
  }
  return f;
}

// ---------- base height per world ----------
function baseH(wid, x) {
  const d = Math.min(1.8, 0.55 + x / 2600); // difficulty grows with distance
  switch (wid) {
    case 0: return fbm(x / 70, 11, 4) * 9 * d + fbm(x / 18, 12, 2) * 1.6 * d + Math.sin(x / 140) * 4;
    case 1: { const dune = Math.sin(x / 55 + fbm(x / 200, 21, 2) * 3) * 6 * d; return dune + fbm(x / 120, 22, 3) * 10 * d + Math.sin(x / 7) * .25; }
    case 2: return fbm(x / 60, 31, 4) * 12 * d + Math.sin(x / 90) * 5 * d + fbm(x / 14, 32, 2) * 1.4;
    case 3: { const raw = fbm(x / 50, 41, 4) * 13 * d, q = raw / 2.2, fl = Math.floor(q), st = (fl + sstep(.3, .7, q - fl)) * 2.2; return raw * .45 + st * .55 + fbm(x / 6, 42, 2) * .45; }
    case 4: return fbm(x / 65, 51, 4) * 9 * d + Math.sin(x / 110) * 5 + fbm(x / 10, 52, 2) * .8;
    case 5: { const q = fbm(x / 40, 62, 2) * 3, fl = Math.floor(q); return fbm(x / 90, 61, 3) * 7 * d + (fl + sstep(.25, .75, q - fl)) * 1.1; }
    case 6: return Math.sin(x / 38) * 5 * d + Math.sin(x / 13 + 1) * 1.6 * d + fbm(x / 80, 71, 3) * 9 * d;
  }
  return 0;
}

function featH(feats, x) {
  let h = 0;
  for (let i = 0; i < feats.length; i++) {
    const F = feats[i]; if (x < F.x0 - 12 || x > F.x1 + 12) continue;
    if (F.t === 'ramp') { if (x >= F.x0 && x <= F.x1) { const u = (x - F.x0) / (F.x1 - F.x0); h += F.h * Math.pow(u, 1.35); } }
    else if (F.t === 'pit') { const a = sstep(F.x0 - 2, F.x0 + 1.5, x) * (1 - sstep(F.x1 - 1.5, F.x1 + 5, x)); h -= F.d * a; }
    else if (F.t === 'pipe') { if (x > F.x0 && x < F.x1) { const u = (x - F.x0) / (F.x1 - F.x0) * 2 - 1; h += F.h * Math.sqrt(Math.max(0, 1 - u * u)); } }
  }
  return h;
}

// ============================================================
export class Terrain {
  constructor(startWorld = 0) { this.start = startWorld; this.cache = new Map(); this.zf = new Map(); }
  worldAtZone(zi) { return (this.start + zi) % WORLDS.length; }
  zoneOf(x) { return Math.max(0, Math.floor(x / ZONE_LEN)); }
  features(zi) { if (!this.zf.has(zi)) this.zf.set(zi, zoneFeatures(zi, this.worldAtZone(zi))); return this.zf.get(zi); }
  // blend weight towards NEXT zone near the end of a zone
  blendInfo(x) {
    const zi = this.zoneOf(x), local = x - zi * ZONE_LEN;
    const w = sstep(ZONE_LEN - BLEND, ZONE_LEN, local);
    return { zi, w, a: this.worldAtZone(zi), b: this.worldAtZone(zi + 1) };
  }
  rawH(x) {
    if (x < 0) return this.rawH(0) + (-x) * 0.6; // wall behind start
    const { zi, w, a, b } = this.blendInfo(x);
    let h = baseH(a, x) * (1 - w) + baseH(b, x) * w;
    h += featH(this.features(zi), x);
    if (w > 0) h += featH(this.features(zi + 1), x) * w;
    // flat-ish start pad
    const pad = 1 - sstep(25, 70, x); if (pad > 0) h = h * (1 - pad) + baseH(this.start, 0) * pad;
    // bridges are flat decks (physics height)
    const br = this.bridgeAt(x); if (br) { const yA = this.rawNoBridge(br.x0), yB = this.rawNoBridge(br.x1); const u = (x - br.x0) / (br.x1 - br.x0); h = yA + (yB - yA) * u + Math.sin(u * Math.PI) * 0.4; }
    return h;
  }
  rawNoBridge(x) { const { zi, w, a, b } = this.blendInfo(x); return baseH(a, x) * (1 - w) + baseH(b, x) * w + featH(this.features(zi), x); }
  bridgeAt(x) { const fs = this.features(this.zoneOf(x)); for (const F of fs) if (F.t === 'bridge' && x >= F.x0 && x <= F.x1) return F; return null; }
  // visual ground height (under bridges the valley dips)
  groundVisual(x) { const br = this.bridgeAt(x); if (!br) return this.height(x); const u = (x - br.x0) / (br.x1 - br.x0); return this.height(x) - br.dip * Math.sin(u * Math.PI) - 0.6; }
  chunk(ci) {
    let c = this.cache.get(ci); if (c) return c;
    const n = Math.round(CHUNK / STEP) + 2; c = new Float32Array(n);
    for (let i = 0; i < n; i++) c[i] = this.rawH(ci * CHUNK + i * STEP);
    this.cache.set(ci, c); if (this.cache.size > 40) { const k = this.cache.keys().next().value; this.cache.delete(k); }
    return c;
  }
  height(x) {
    const ci = Math.floor(x / CHUNK), c = this.chunk(ci), lx = (x - ci * CHUNK) / STEP, i = Math.floor(lx), f = lx - i;
    return c[i] * (1 - f) + c[i + 1] * f;
  }
  slope(x) { return (this.height(x + 0.15) - this.height(x - 0.15)) / 0.3; }
  normal(x) { const s = this.slope(x), L = Math.hypot(s, 1); return [-s / L, 1 / L]; }
  surface(x) {
    const { zi, w, a, b } = this.blendInfo(x); const W = w < .5 ? a : b; let mu = WORLDS[W].mu, type = WORLDS[W].id;
    for (const F of this.features(zi)) { if (x >= F.x0 && x <= F.x1) { if (F.t === 'ice') { mu = 0.28; type = 'ice'; } else if (F.t === 'bridge') { mu = 0.95; type = 'wood'; } } }
    return { mu, type, world: W };
  }
  gravity(x) { const { w, a, b } = this.blendInfo(x); return WORLDS[a].grav * (1 - w) + WORLDS[b].grav * w; }
}

// ============================================================
// Pickup layout (coins, fuel, diamonds) — deterministic per run seed
// ============================================================
export function layoutPickups(terrain, x0, x1, seed) {
  const R = rng(seed + Math.floor(x0 / 50) * 31337), out = [];
  // fuel: guaranteed cadence that widens with distance
  const fuelGap = d => Math.min(430, 170 + d * 0.06);
  let fx = terrain._nextFuel ?? 120;
  while (fx < x1) { if (fx >= x0) out.push({ k: 'fuel', x: fx, y: terrain.height(fx) + 1.3, v: 1 }); fx += fuelGap(fx) * (0.85 + R() * .3); }
  terrain._nextFuel = fx;
  // coin groups
  let cx = Math.max(x0, terrain._nextCoin ?? 40);
  while (cx < x1) {
    const n = 4 + Math.floor(R() * 5), val = cx < 400 ? 5 : cx < 1200 ? (R() < .6 ? 5 : 25) : cx < 2600 ? (R() < .5 ? 25 : 100) : (R() < .55 ? 100 : 500);
    const arc = R() < .35;
    for (let i = 0; i < n; i++) { const x = cx + i * 2.3, ar = arc ? Math.sin(i / (n - 1) * Math.PI) * 2.6 : 0; out.push({ k: 'coin', x, y: terrain.height(x) + 1.25 + ar, v: (i === Math.floor(n / 2) && val < 500 && R() < .2) ? val * 5 : val }); }
    cx += n * 2.3 + 25 + R() * 45;
  }
  terrain._nextCoin = cx;
  // diamonds (rare), often above ramps
  let dx = Math.max(x0, terrain._nextDia ?? 300);
  while (dx < x1) { out.push({ k: 'dia', x: dx, y: terrain.height(dx) + 3.2 + R() * 1.5, v: 1 }); dx += 330 + R() * 260; }
  terrain._nextDia = dx;
  // secret stash: 3 diamonds floating high after the biggest ramp of each zone (needs a boosted jump)
  for (let zi = terrain.zoneOf(x0); zi <= terrain.zoneOf(x1); zi++) {
    let best = null; for (const F of terrain.features(zi)) if (F.t === 'ramp' && (!best || F.h > best.h)) best = F;
    if (!best) continue; const sx = best.x1 + 9;
    if (sx >= x0 && sx < x1) for (let i = 0; i < 3; i++) out.push({ k: 'dia', x: sx + i * 2.2, y: terrain.height(best.x1) + 7.5 + Math.sin(i / 2 * Math.PI) * 0.8, v: 1, secret: true });
  }
  return out;
}
